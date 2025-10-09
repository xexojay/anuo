/**
 * 兔子AI客户端
 * 支持文本对话、图片识别、图片生成和视频生成
 */

const TUZI_API_KEY = process.env.TUZI_API_KEY || "";
const TUZI_BASE_URL = process.env.TUZI_BASE_URL || "https://api.tu-zi.com";
const TUZI_MODEL = process.env.TUZI_MODEL || "gpt-5";

// 视频异步任务轮询配置
const VIDEO_POLL_INTERVAL = 3000; // 3秒
const VIDEO_MAX_POLL_ATTEMPTS = 60; // 最多轮询60次（3分钟）

export interface TuziMessage {
  role: "user" | "assistant" | "system";
  content: string | TuziMessageContent[];
}

export interface TuziMessageContent {
  type: "text" | "image_url";
  text?: string;
  image_url?: {
    url: string;
  };
}

export interface TuziChatOptions {
  model?: string;
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

/**
 * 调用兔子AI文本对话
 */
export async function tuzuChat(
  messages: TuziMessage[],
  options: TuziChatOptions = {},
  baseUrl?: string
) {
  try {
    const apiUrl = baseUrl || TUZI_BASE_URL;
    const response = await fetch(`${apiUrl}/v1/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TUZI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: options.model || TUZI_MODEL,
        max_tokens: options.max_tokens || 2048,
        temperature: options.temperature ?? 0.7,
        stream: options.stream ?? false,
        messages,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`兔子AI API错误: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("兔子AI调用失败:", error);
    throw error;
  }
}

/**
 * 文本对话（简化接口）
 */
export async function chatWithText(prompt: string, systemPrompt?: string) {
  const messages: TuziMessage[] = [];

  if (systemPrompt) {
    messages.push({
      role: "system",
      content: systemPrompt,
    });
  }

  messages.push({
    role: "user",
    content: prompt,
  });

  const response = await tuzuChat(messages);

  // 根据返回格式提取内容
  if (response.content && Array.isArray(response.content)) {
    return response.content
      .filter((item: any) => item.type === "text")
      .map((item: any) => item.text)
      .join("");
  }

  return response.content || "";
}

/**
 * 图片识别（vision）
 */
export async function chatWithImage(
  imageUrl: string,
  prompt: string = "描述这张图片的内容"
) {
  const messages: TuziMessage[] = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: prompt,
        },
        {
          type: "image_url",
          image_url: {
            url: imageUrl,
          },
        },
      ],
    },
  ];

  const response = await tuzuChat(messages);

  if (response.content && Array.isArray(response.content)) {
    return response.content
      .filter((item: any) => item.type === "text")
      .map((item: any) => item.text)
      .join("");
  }

  return response.content || "";
}

/**
 * 文字+图片混合输入
 */
export async function chatWithTextAndImages(
  text: string,
  imageUrls: string[]
) {
  const contentParts: TuziMessageContent[] = [
    {
      type: "text",
      text,
    },
  ];

  // 添加所有图片
  imageUrls.forEach((url) => {
    contentParts.push({
      type: "image_url",
      image_url: { url },
    });
  });

  const messages: TuziMessage[] = [
    {
      role: "user",
      content: contentParts,
    },
  ];

  const response = await tuzuChat(messages);

  if (response.content && Array.isArray(response.content)) {
    return response.content
      .filter((item: any) => item.type === "text")
      .map((item: any) => item.text)
      .join("");
  }

  return response.content || "";
}

/**
 * 图片生成（文生图）
 */
export async function generateImage(
  prompt: string,
  model: string = "nano-banana",
  baseUrl: string = TUZI_BASE_URL
) {
  try {
    const response = await fetch(`${baseUrl}/v1/images/generations`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TUZI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        n: 1,
        size: "1024x1024",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`图片生成API错误: ${response.status} - ${error}`);
    }

    const data = await response.json();

    // 返回图片URL
    if (data.data && data.data.length > 0) {
      return data.data[0].url;
    }

    throw new Error("未能生成图片");
  } catch (error) {
    console.error("图片生成失败:", error);
    throw error;
  }
}

/**
 * 图片编辑（图生图）
 * 使用上传的图片 + 提示词生成新图片
 */
export async function editImage(
  imageBase64: string,
  prompt: string,
  model: string = "nano-banana",
  baseUrl: string = TUZI_BASE_URL
) {
  try {
    // 将 base64 转换为 Blob
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });

    // 构建 FormData
    const formData = new FormData();
    formData.append('image', blob, 'image.png');
    formData.append('prompt', prompt);
    formData.append('model', model);
    formData.append('n', '1');
    formData.append('size', '1024x1024');

    const response = await fetch(`${baseUrl}/v1/images/edits`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TUZI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`图片编辑API错误: ${response.status} - ${error}`);
    }

    const data = await response.json();

    // 返回图片URL
    if (data.data && data.data.length > 0) {
      return data.data[0].url;
    }

    throw new Error("未能编辑图片");
  } catch (error) {
    console.error("图片编辑失败:", error);
    throw error;
  }
}

/**
 * 视频生成（异步）- 提交任务
 */
export async function generateVideoTask(
  prompt: string,
  model: string = "sora-2",
  baseUrl: string = "https://asyncdata.net/tran/https://api.tu-zi.com"
) {
  try {
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TUZI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`视频生成任务提交失败: ${response.status} - ${error}`);
    }

    const data = await response.json();

    // 返回任务信息
    if (data.id && data.preview_url) {
      return {
        taskId: data.id,
        previewUrl: data.preview_url,
        sourceUrl: data.source_url,
      };
    }

    throw new Error("视频任务提交失败");
  } catch (error) {
    console.error("视频生成任务提交失败:", error);
    throw error;
  }
}

/**
 * 视频生成 - 查询任务状态
 */
export async function pollVideoTask(
  taskId: string,
  sourceUrl: string
): Promise<{ status: "pending" | "completed" | "failed"; videoUrl?: string }> {
  try {
    const response = await fetch(sourceUrl);

    if (!response.ok) {
      return { status: "pending" };
    }

    const data = await response.json();

    // 检查是否完成
    if (data.status === "completed" && data.output) {
      return {
        status: "completed",
        videoUrl: data.output.video_url || data.output,
      };
    }

    if (data.status === "failed") {
      return { status: "failed" };
    }

    return { status: "pending" };
  } catch (error) {
    console.error("视频任务轮询失败:", error);
    return { status: "pending" };
  }
}

/**
 * 视频生成 - 完整流程（提交 + 轮询）
 */
export async function generateVideo(
  prompt: string,
  model: string = "sora-2",
  baseUrl: string = "https://asyncdata.net/tran/https://api.tu-zi.com",
  onProgress?: (status: string) => void
): Promise<string> {
  // 提交任务
  onProgress?.("提交视频生成任务...");
  const task = await generateVideoTask(prompt, model, baseUrl);

  // 轮询任务状态
  let attempts = 0;
  while (attempts < VIDEO_MAX_POLL_ATTEMPTS) {
    await new Promise((resolve) => setTimeout(resolve, VIDEO_POLL_INTERVAL));
    attempts++;

    onProgress?.(`生成中... (${attempts}/${VIDEO_MAX_POLL_ATTEMPTS})`);

    const result = await pollVideoTask(task.taskId, task.sourceUrl);

    if (result.status === "completed" && result.videoUrl) {
      return result.videoUrl;
    }

    if (result.status === "failed") {
      throw new Error("视频生成失败");
    }
  }

  throw new Error("视频生成超时");
}
