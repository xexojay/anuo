export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: "google" | "twitter";
}

export interface GoogleSearchResult extends SearchResult {
  source: "google";
}

export interface TwitterSearchResult extends SearchResult {
  source: "twitter";
  author?: string;
  likes?: number;
}
