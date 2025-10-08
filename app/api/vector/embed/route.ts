import { NextRequest, NextResponse } from "next/server";
import { generateEmbedding } from "@/lib/ai/openai";

export const runtime = "edge";

/**
 * 生成文本的向量表示
 */
export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // 生成向量
    const embedding = await generateEmbedding(text);

    return NextResponse.json({
      embedding,
      dimensions: embedding.length,
    });
  } catch (error) {
    console.error("Error generating embedding:", error);
    return NextResponse.json(
      { error: "Failed to generate embedding" },
      { status: 500 }
    );
  }
}
