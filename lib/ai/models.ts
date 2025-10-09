/**
 * AI模型配置
 */

export type ModelType = "text" | "image" | "video";

export interface ModelConfig {
  id: string;
  name: string;
  model: string;
  baseUrl: string;
  type: ModelType;
  description: string;
}

export const MODELS: ModelConfig[] = [
  {
    id: "claude-sonnet-4-5-all",
    name: "Claude Sonnet 4.5",
    model: "claude-sonnet-4-5-all",
    baseUrl: "https://api.tu-zi.com",
    type: "text",
    description: "Claude通用模型，稳定可靠",
  },
  {
    id: "claude-thinking",
    name: "Claude Thinking",
    model: "claude-sonnet-4-5-20250929-thinking",
    baseUrl: "https://api.tu-zi.com",
    type: "text",
    description: "思考模型，擅长复杂推理",
  },
  {
    id: "nano-banana",
    name: "Nano Banana",
    model: "nano-banana",
    baseUrl: "https://api.tu-zi.com",
    type: "image",
    description: "文生图模型",
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    model: "gemini-2.5-pro",
    baseUrl: "https://api.tu-zi.com",
    type: "text",
    description: "Google最新对话模型",
  },
  {
    id: "sora-2",
    name: "Sora 2",
    model: "sora-2",
    baseUrl: "https://asyncdata.net/tran/https://api.tu-zi.com",
    type: "video",
    description: "视频生成模型（异步）",
  },
  {
    id: "gpt-5-pro",
    name: "GPT-5 Pro",
    model: "gpt-5-pro",
    baseUrl: "https://api.tu-zi.com",
    type: "text",
    description: "OpenAI最新对话模型",
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    model: "deepseek-v3-250324",
    baseUrl: "https://api.tu-zi.com",
    type: "text",
    description: "DeepSeek对话模型",
  },
];

/**
 * 根据ID获取模型配置
 */
export function getModelById(id: string): ModelConfig | undefined {
  return MODELS.find((m) => m.id === id);
}

/**
 * 获取默认模型
 */
export function getDefaultModel(): ModelConfig {
  return MODELS[0]; // Claude Thinking
}
