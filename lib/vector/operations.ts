/**
 * 向量操作工具函数
 */

/**
 * 计算两个向量的余弦相似度
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}

/**
 * 生成文本的向量表示（客户端调用）
 */
export async function embedText(text: string): Promise<number[]> {
  const response = await fetch("/api/vector/embed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate embedding");
  }

  const data = await response.json();
  return data.embedding;
}

/**
 * 搜索相似的卡片
 */
export async function searchSimilarCards(
  embedding: number[],
  options: {
    boardId?: string;
    threshold?: number;
    limit?: number;
  } = {}
): Promise<
  Array<{
    id: string;
    content: any;
    similarity: number;
  }>
> {
  const response = await fetch("/api/vector/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embedding,
      ...options,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to search similar cards");
  }

  const data = await response.json();
  return data.results;
}

/**
 * 将卡片内容转换为可搜索的文本
 */
export function cardToSearchText(card: any): string {
  if (typeof card === "string") {
    return card;
  }

  if (card.title && card.snippet) {
    return `${card.title}\n${card.snippet}`;
  }

  if (card.content) {
    return card.content;
  }

  if (card.summary) {
    return card.summary;
  }

  return JSON.stringify(card);
}

/**
 * Mock向量生成（用于demo，无需真实API）
 */
export function mockGenerateEmbedding(text: string): number[] {
  // 使用简单的哈希函数生成一致的"向量"
  const hash = simpleHash(text);
  const vector: number[] = [];

  for (let i = 0; i < 1536; i++) {
    // text-embedding-3-small的维度
    const seed = hash + i;
    vector.push(Math.sin(seed) * Math.cos(seed * 0.5));
  }

  // 归一化
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map((v) => v / norm);
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * 查找相似的文本（使用mock embedding）
 */
export function findSimilarTexts(
  query: string,
  texts: string[],
  threshold: number = 0.7
): Array<{ text: string; similarity: number; index: number }> {
  const queryEmbedding = mockGenerateEmbedding(query);

  const results = texts
    .map((text, index) => {
      const textEmbedding = mockGenerateEmbedding(text);
      const similarity = cosineSimilarity(queryEmbedding, textEmbedding);
      return { text, similarity, index };
    })
    .filter((r) => r.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity);

  return results;
}
