/**
 * 兔子AI客户端
 * 支持文本对话和图片识别
 */

const TUZI_API_KEY = process.env.TUZI_API_KEY || "";
const TUZI_BASE_URL = process.env.TUZI_BASE_URL || "https://api.tu-zi.com";
const TUZI_MODEL = process.env.TUZI_MODEL || "gpt-5";

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
  options: TuziChatOptions = {}
) {
  try {
    const response = await fetch(`${TUZI_BASE_URL}/v1/messages`, {
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
