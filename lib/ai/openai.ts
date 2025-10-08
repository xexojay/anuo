import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export { openai };

// 生成文本嵌入向量
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

// AI对话完成
export async function chatCompletion(messages: any[]) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
    });

    return response.choices[0].message;
  } catch (error) {
    console.error("Error in chat completion:", error);
    throw error;
  }
}

// 带工具调用的AI对话
export async function chatWithTools(
  messages: any[],
  tools: any[],
  toolChoice: any = "auto"
) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      tools,
      tool_choice: toolChoice,
    });

    return response.choices[0].message;
  } catch (error) {
    console.error("Error in chat with tools:", error);
    throw error;
  }
}
