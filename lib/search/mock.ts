import type { SearchResult } from "./types";

// Mock搜索数据 - 用于demo演示
const mockGoogleResults: Record<string, SearchResult[]> = {
  ai: [
    {
      title: "OpenAI GPT-4 - 最先进的AI语言模型",
      snippet:
        "GPT-4是OpenAI开发的多模态大型语言模型。它可以接受图像和文本输入，输出文本内容...",
      url: "https://openai.com/gpt-4",
      source: "google",
    },
    {
      title: "Google AI - 机器学习和人工智能",
      snippet:
        "探索Google在AI领域的最新研究和产品，包括TensorFlow、Bard等创新技术...",
      url: "https://ai.google",
      source: "google",
    },
    {
      title: "Anthropic Claude - 安全可靠的AI助手",
      snippet:
        "Claude是由Anthropic开发的AI助手，专注于安全性和可靠性，能够进行复杂的对话和分析...",
      url: "https://anthropic.com/claude",
      source: "google",
    },
  ],
  tldraw: [
    {
      title: "tldraw - 无限画布SDK",
      snippet:
        "tldraw是一个强大的React库，用于创建无限画布体验。支持自定义shapes、协作编辑等功能...",
      url: "https://tldraw.dev",
      source: "google",
    },
    {
      title: "tldraw GitHub - 开源白板项目",
      snippet:
        "tldraw是一个开源的白板和图形编辑器，提供了完整的SDK和示例代码...",
      url: "https://github.com/tldraw/tldraw",
      source: "google",
    },
  ],
  research: [
    {
      title: "如何进行高效的学术研究",
      snippet:
        "学术研究需要系统的方法论：文献综述、假设提出、实验设计、数据分析和结论撰写...",
      url: "https://example.com/research-methods",
      source: "google",
    },
    {
      title: "研究工具推荐 - 提升效率的利器",
      snippet:
        "推荐几款优秀的研究工具：Zotero文献管理、Notion笔记、Obsidian知识图谱...",
      url: "https://example.com/research-tools",
      source: "google",
    },
  ],
};

const mockTwitterResults: Record<string, SearchResult[]> = {
  ai: [
    {
      title: "@sama - OpenAI CEO关于AGI的最新思考",
      snippet:
        "AGI即将到来。我们需要为此做好准备，确保技术的安全性和对齐性...",
      url: "https://twitter.com/sama/status/123",
      source: "twitter",
    },
    {
      title: "@ylecun - AI研究的下一个前沿",
      snippet:
        "深度学习只是开始。我们需要探索新的架构和学习范式，特别是自监督学习...",
      url: "https://twitter.com/ylecun/status/124",
      source: "twitter",
    },
  ],
  default: [
    {
      title: "@elonmusk - 关于技术和创新",
      snippet: "技术的发展速度比我们想象的要快。保持学习和适应能力至关重要...",
      url: "https://twitter.com/elonmusk/status/125",
      source: "twitter",
    },
  ],
};

// Mock Google搜索
export async function mockGoogleSearch(
  query: string
): Promise<SearchResult[]> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 800));

  const lowerQuery = query.toLowerCase();

  // 简单的关键词匹配
  for (const [keyword, results] of Object.entries(mockGoogleResults)) {
    if (lowerQuery.includes(keyword)) {
      return results;
    }
  }

  // 默认返回一些通用结果
  return [
    {
      title: `关于 "${query}" 的搜索结果`,
      snippet: `这是关于${query}的模拟搜索结果。在实际应用中，这里会显示来自Google的真实搜索结果...`,
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      source: "google",
    },
    {
      title: `${query} - 维基百科`,
      snippet: `${query}的详细介绍和背景信息。维基百科是一个自由的百科全书...`,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
      source: "google",
    },
  ];
}

// Mock Twitter搜索
export async function mockTwitterSearch(
  query: string
): Promise<SearchResult[]> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 600));

  const lowerQuery = query.toLowerCase();

  // 简单的关键词匹配
  for (const [keyword, results] of Object.entries(mockTwitterResults)) {
    if (lowerQuery.includes(keyword)) {
      return results;
    }
  }

  // 默认返回
  return mockTwitterResults.default || [];
}
