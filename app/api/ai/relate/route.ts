import { NextRequest, NextResponse } from "next/server";
import {
  mockGenerateEmbedding,
  cosineSimilarity,
  cardToSearchText,
} from "@/lib/vector/operations";

export const runtime = "edge";

/**
 * 智能关联分析
 * 分析一组卡片，找出它们之间的语义关联
 */
export async function POST(req: NextRequest) {
  try {
    const { cards, threshold = 0.65 } = await req.json();

    if (!cards || !Array.isArray(cards) || cards.length < 2) {
      return NextResponse.json(
        { error: "At least 2 cards are required" },
        { status: 400 }
      );
    }

    // 为每个卡片生成embedding
    const cardData = cards.map((card: any) => ({
      id: card.id,
      text: cardToSearchText(card.content || card),
      embedding: null as number[] | null,
    }));

    // 生成向量（使用mock函数，无需真实API）
    cardData.forEach((card) => {
      card.embedding = mockGenerateEmbedding(card.text);
    });

    // 计算所有卡片对之间的相似度
    const connections: Array<{
      from: string;
      to: string;
      similarity: number;
      type: "semantic";
    }> = [];

    for (let i = 0; i < cardData.length; i++) {
      for (let j = i + 1; j < cardData.length; j++) {
        const similarity = cosineSimilarity(
          cardData[i].embedding!,
          cardData[j].embedding!
        );

        if (similarity >= threshold) {
          connections.push({
            from: cardData[i].id,
            to: cardData[j].id,
            similarity,
            type: "semantic",
          });
        }
      }
    }

    // 按相似度排序
    connections.sort((a, b) => b.similarity - a.similarity);

    // 生成主题聚类建议
    const clusters = generateClusters(cardData, connections, threshold);

    return NextResponse.json({
      connections,
      clusters,
      analyzed: cardData.length,
      found: connections.length,
    });
  } catch (error) {
    console.error("Error in relate API:", error);
    return NextResponse.json(
      { error: "Failed to analyze card relationships" },
      { status: 500 }
    );
  }
}

/**
 * 生成主题聚类建议
 */
function generateClusters(
  cardData: any[],
  connections: any[],
  threshold: number
) {
  // 使用简单的连通分量算法找出聚类
  const visited = new Set<string>();
  const clusters: Array<{
    cardIds: string[];
    avgSimilarity: number;
    suggestedTheme: string;
  }> = [];

  cardData.forEach((card) => {
    if (visited.has(card.id)) return;

    // 找出与当前卡片连接的所有卡片
    const cluster = new Set<string>([card.id]);
    const queue = [card.id];
    const clusterConnections: number[] = [];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      visited.add(currentId);

      connections.forEach((conn) => {
        if (conn.from === currentId && !visited.has(conn.to)) {
          cluster.add(conn.to);
          queue.push(conn.to);
          clusterConnections.push(conn.similarity);
        } else if (conn.to === currentId && !visited.has(conn.from)) {
          cluster.add(conn.from);
          queue.push(conn.from);
          clusterConnections.push(conn.similarity);
        }
      });
    }

    // 只保留有多个卡片的聚类
    if (cluster.size >= 2) {
      const avgSimilarity =
        clusterConnections.reduce((a, b) => a + b, 0) /
          clusterConnections.length || 0;

      clusters.push({
        cardIds: Array.from(cluster),
        avgSimilarity,
        suggestedTheme: `主题 ${clusters.length + 1}`,
      });
    }
  });

  return clusters;
}
