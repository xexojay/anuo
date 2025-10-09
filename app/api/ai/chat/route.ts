import { NextRequest, NextResponse } from "next/server";
import { search } from "@/lib/search";
import {
  chatWithText,
  chatWithTextAndImages,
  generateImage,
  generateVideoTask,
  pollVideoTask,
  tuzuChat,
} from "@/lib/ai/tuzi";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { message, images, model, baseUrl, modelType } = await req.json();

    // 处理图片生成
    if (modelType === "image") {
      try {
        const imageUrl = await generateImage(message, model, baseUrl);
        return NextResponse.json({
          intent: "image_generation",
          results: [
            {
              type: "image",
              imageUrl,
              prompt: message,
            },
          ],
          message: "图片生成成功",
        });
      } catch (error) {
        console.error("图片生成失败:", error);
        return NextResponse.json(
          { error: "图片生成失败" },
          { status: 500 }
        );
      }
    }

    // 处理视频生成
    if (modelType === "video") {
      try {
        const task = await generateVideoTask(message, model, baseUrl);
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
          message: "视频生成任务已提交",
        });
      } catch (error) {
        console.error("视频生成失败:", error);
        return NextResponse.json(
          { error: "视频生成失败" },
          { status: 500 }
        );
      }
    }

    // 如果有图片，使用AI处理图片+文字
    if (images && images.length > 0) {
      const aiResponse = await chatWithTextAndImages(message, images);

      return NextResponse.json({
        intent: "ai_vision",
        results: [
          {
            type: "note",
            content: aiResponse,
          },
        ],
        message: aiResponse,
      });
    }

    // 简单的意图识别
    const intent = detectIntent(message);

    let results: any[] = [];

    if (intent.type === "search") {
      // 执行搜索
      results = await search(intent.query, intent.sources);
    } else if (intent.type === "note") {
      // 创建笔记
      results = [
        {
          type: "note",
          content: message,
        },
      ];
    } else if (intent.type === "chat") {
      // AI对话 - 使用指定的模型和baseUrl
      const messages = [
        {
          role: "user" as const,
          content: message,
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

      results = [
        {
          type: "note",
          content: aiResponse,
        },
      ];
    }

    return NextResponse.json({
      intent: intent.type,
      results,
      message: generateResponse(intent, results),
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

// 简单的意图识别
function detectIntent(message: string) {
  const lowerMessage = message.toLowerCase();

  // 检测搜索意图 - 只有明确的搜索关键词才触发
  const searchKeywords = [
    "搜索",
    "search",
    "google",
    "twitter",
  ];
  const hasSearchKeyword = searchKeywords.some((kw) =>
    lowerMessage.includes(kw)
  );

  // 检测Twitter搜索
  const hasTwitterKeyword = lowerMessage.includes("twitter") || lowerMessage.includes("推特");

  if (hasSearchKeyword || hasTwitterKeyword) {
    // 提取搜索查询（简单实现）
    let query = message;

    // 移除搜索关键词
    searchKeywords.forEach((kw) => {
      query = query.replace(new RegExp(kw, "gi"), "").trim();
    });

    // 移除常见的连接词
    query = query
      .replace(/^(关于|about|一下)/gi, "")
      .trim();

    return {
      type: "search" as const,
      query: query || message,
      sources: hasTwitterKeyword
        ? ["google", "twitter"] as ("google" | "twitter")[]
        : ["google"] as ("google" | "twitter")[],
    };
  }

  // 检测笔记意图
  const noteKeywords = ["记录", "笔记", "note", "记下"];
  const hasNoteKeyword = noteKeywords.some((kw) => lowerMessage.includes(kw));

  if (hasNoteKeyword) {
    return {
      type: "note" as const,
      content: message,
    };
  }

  // 默认为AI对话
  return {
    type: "chat" as const,
    query: message,
  };
}

// 生成响应消息
function generateResponse(intent: any, results: any[]) {
  if (intent.type === "search") {
    return `找到 ${results.length} 条关于"${intent.query}"的结果`;
  }

  if (intent.type === "note") {
    return "已创建笔记";
  }

  return "已处理您的请求";
}
