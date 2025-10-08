import { mockGoogleSearch, mockTwitterSearch } from "./mock";
import type { SearchResult } from "./types";

// 搜索服务接口
export async function searchGoogle(query: string): Promise<SearchResult[]> {
  // TODO: 在有API key时替换为真实的Serper API调用
  // const apiKey = process.env.SERPER_API_KEY;
  // if (apiKey) {
  //   return await realGoogleSearch(query);
  // }

  return await mockGoogleSearch(query);
}

export async function searchTwitter(query: string): Promise<SearchResult[]> {
  // TODO: 在有API key时替换为真实的Twitter API调用
  // const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  // if (bearerToken) {
  //   return await realTwitterSearch(query);
  // }

  return await mockTwitterSearch(query);
}

// 统一搜索接口
export async function search(
  query: string,
  sources: ("google" | "twitter")[] = ["google"]
): Promise<SearchResult[]> {
  const promises = sources.map((source) => {
    switch (source) {
      case "google":
        return searchGoogle(query);
      case "twitter":
        return searchTwitter(query);
      default:
        return Promise.resolve([]);
    }
  });

  const results = await Promise.all(promises);
  return results.flat();
}

export type { SearchResult };
