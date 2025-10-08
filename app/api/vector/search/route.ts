import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/client";

export const runtime = "edge";

/**
 * 向量相似度搜索
 * 找到与查询向量最相似的卡片
 */
export async function POST(req: NextRequest) {
  try {
    const { embedding, boardId, threshold = 0.7, limit = 5 } = await req.json();

    if (!embedding || !Array.isArray(embedding)) {
      return NextResponse.json(
        { error: "Valid embedding array is required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // 使用Supabase的向量搜索函数
    const { data, error } = await supabase.rpc("match_cards", {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: limit,
    });

    if (error) {
      console.error("Vector search error:", error);
      return NextResponse.json(
        { error: "Failed to search similar cards" },
        { status: 500 }
      );
    }

    // 过滤结果（如果指定了boardId）
    let results = data || [];
    if (boardId) {
      // 这里可以添加board过滤逻辑
    }

    return NextResponse.json({
      results: results.map((r: any) => ({
        id: r.id,
        content: r.content,
        similarity: r.similarity,
      })),
      count: results.length,
    });
  } catch (error) {
    console.error("Error in vector search:", error);
    return NextResponse.json(
      { error: "Failed to perform vector search" },
      { status: 500 }
    );
  }
}
