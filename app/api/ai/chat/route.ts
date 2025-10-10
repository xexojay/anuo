import { NextRequest, NextResponse } from "next/server";
import {
  chatWithText,
  chatWithTextAndImages,
  generateImage,
  editImage,
  generateVideoTask,
  generateVideoFromImage,
  pollVideoTask,
  tuzuChat,
} from "@/lib/ai/tuzi";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { message, images, selectedCards, model, baseUrl, modelType } = await req.json();

    // 处理图片生成/编辑
    if (modelType === "image") {
      try {
        let imageUrl: string;

        // 如果有上传图片，进行图片编辑（图生图）
        if (images && images.length > 0) {
          // 使用第一张图片进行编辑
          imageUrl = await editImage(images[0], message, model, baseUrl);
        } else {
          // 纯文生图
          imageUrl = await generateImage(message, model, baseUrl);
        }

        return NextResponse.json({
          intent: "image_generation",
          results: [
            {
              type: "image",
              imageUrl,
              prompt: message,
            },
          ],
          message: images && images.length > 0 ? "图片编辑成功" : "图片生成成功",
        });
      } catch (error) {
        console.error("图片处理失败:", error);
        return NextResponse.json(
          { error: images && images.length > 0 ? "图片编辑失败" : "图片生成失败" },
          { status: 500 }
        );
      }
    }

    // 处理视频生成/图生视频
    if (modelType === "video") {
      try {
        let task;

        // 如果有上传图片，进行图生视频
        if (images && images.length > 0) {
          // 使用第一张图片生成视频
          task = await generateVideoFromImage(images[0], message, model, baseUrl);
        } else {
          // 纯文生视频
          task = await generateVideoTask(message, model, baseUrl);
        }

        return NextResponse.json({
          intent: "video_generation",
          results: [
            {
              type: "video",
              taskId: task.taskId,
              sourceUrl: task.sourceUrl,
              prompt: message,
            },
          ],
          message: images && images.length > 0 ? "图生视频任务已提交" : "视频生成任务已提交",
        });
      } catch (error) {
        console.error("视频处理失败:", error);
        return NextResponse.json(
          { error: images && images.length > 0 ? "图生视频失败" : "视频生成失败" },
          { status: 500 }
        );
      }
    }

    // 如果有图片，使用AI处理图片+文字
    if (images && images.length > 0) {
      // 构建包含引用卡片的上下文消息
      let contextMessage = message;
      const references: any[] = [];

      if (selectedCards && selectedCards.length > 0) {
        let referencesContext = "\n\n参考以下内容：\n";

        selectedCards.forEach((card: any, index: number) => {
          const refNum = index + 1;
          references.push({
            type: card.type,
            index: refNum,
            cardId: card.id
          });

          if (card.type === "conversation") {
            referencesContext += `\n[对话 #${refNum}]\n问题：${card.title}\n回答：${card.content}\n`;
          } else if (card.type === "image") {
            referencesContext += `\n[图片 #${refNum}]\n提示词：${card.prompt || card.title}\n`;
          } else if (card.type === "video") {
            referencesContext += `\n[视频 #${refNum}]\n提示词：${card.prompt || card.title}\n`;
          } else if (card.type === "search-result") {
            referencesContext += `\n[搜索结果 #${refNum}]\n${card.title}\n${card.content || ""}\n`;
          }
        });

        contextMessage = referencesContext + "\n\n用户问题：" + message;
      }

      const aiResponse = await chatWithTextAndImages(contextMessage, images);

      return NextResponse.json({
        intent: "ai_vision",
        results: [
          {
            type: "conversation",
            content: aiResponse,
          },
        ],
        message: aiResponse,
        references: references.length > 0 ? references : undefined,
      });
    }

    // AI对话 - 使用指定的模型和baseUrl
    // 构建包含引用卡片的上下文消息
    let contextMessage = message;
    const references: any[] = [];

    if (selectedCards && selectedCards.length > 0) {
      let referencesContext = "\n\n参考以下内容：\n";

      selectedCards.forEach((card: any, index: number) => {
        const refNum = index + 1;
        references.push({
          type: card.type,
          index: refNum,
          cardId: card.id
        });

        if (card.type === "conversation") {
          referencesContext += `\n[对话 #${refNum}]\n问题：${card.title}\n回答：${card.content}\n`;
        } else if (card.type === "image") {
          referencesContext += `\n[图片 #${refNum}]\n提示词：${card.prompt || card.title}\n`;
        } else if (card.type === "video") {
          referencesContext += `\n[视频 #${refNum}]\n提示词：${card.prompt || card.title}\n`;
        } else if (card.type === "search-result") {
          referencesContext += `\n[搜索结果 #${refNum}]\n${card.title}\n${card.content || ""}\n`;
        }
      });

      contextMessage = referencesContext + "\n\n用户问题：" + message;
    }

    const messages = [
      {
        role: "user" as const,
        content: contextMessage,
      },
    ];
    const response = await tuzuChat(messages, { model }, baseUrl);

    // 提取响应内容
    let aiResponse = "";
    if (response.content && Array.isArray(response.content)) {
      aiResponse = response.content
        .filter((item: any) => item.type === "text")
        .map((item: any) => item.text)
        .join("");
    } else {
      aiResponse = response.content || "";
    }

    return NextResponse.json({
      intent: "chat",
      results: [
        {
          type: "conversation",
          content: aiResponse,
        },
      ],
      message: aiResponse,
      references: references.length > 0 ? references : undefined,
    });
  } catch (error) {
    console.error("Error in AI chat:", error);

    // 提取错误信息
    let errorMessage = "处理请求失败，请重试";

    if (error instanceof Error) {
      const errorText = error.message;

      // 检测 rate limit 错误
      if (errorText.includes("rate_limit")) {
        errorMessage = "该模型已达使用限制，请切换其他模型";
      }
      // 检测负载过高错误
      else if (errorText.includes("overloaded") || errorText.includes("too many requests")) {
        errorMessage = "模型负载过高，请稍后重试或切换其他模型";
      }
      // 检测超时错误
      else if (errorText.includes("timeout")) {
        errorMessage = "请求超时，请重试";
      }
      // 其他API错误
      else if (errorText.includes("API错误")) {
        errorMessage = "模型调用失败，请检查配置或切换其他模型";
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        intent: "error",
        results: []
      },
      { status: 500 }
    );
  }
}
