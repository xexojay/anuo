import { NextRequest, NextResponse } from "next/server";
import { search } from "@/lib/search";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    // 简单的意图识别
    const intent = detectIntent(message);

    let results = [];

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
    }

    return NextResponse.json({
      intent: intent.type,
      results,
      message: generateResponse(intent, results),
    });
  } catch (error) {
    console.error("Error in AI chat:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

// 简单的意图识别
function detectIntent(message: string) {
  const lowerMessage = message.toLowerCase();

  // 检测搜索意图
  const searchKeywords = [
    "搜索",
    "查找",
    "找",
    "search",
    "find",
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
        ? (["google", "twitter"] as const)
        : (["google"] as const),
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

  // 默认为搜索
  return {
    type: "search" as const,
    query: message,
    sources: ["google"] as const,
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
