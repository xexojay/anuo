import { TLBaseShape, TLDefaultColorStyle } from "tldraw";

// 对话卡片类型（新）
export type ConversationCardShape = TLBaseShape<
  "conversation-card",
  {
    w: number;
    h: number;
    userMessage: string;
    aiResponse: string;
    isLoading: boolean;
    timestamp: number;
  }
>;

// 搜索结果卡片类型
export type SearchResultCardShape = TLBaseShape<
  "search-result-card",
  {
    w: number;
    h: number;
    title: string;
    snippet: string;
    source: "google" | "twitter";
    url: string;
    timestamp: string;
    color: TLDefaultColorStyle;
  }
>;

// 笔记卡片类型
export type NoteCardShape = TLBaseShape<
  "note-card",
  {
    w: number;
    h: number;
    content: string;
    tags: string[];
    color: TLDefaultColorStyle;
  }
>;

// 聚类卡片类型
export type ClusterCardShape = TLBaseShape<
  "cluster-card",
  {
    w: number;
    h: number;
    theme: string;
    cardIds: string[];
    summary: string;
    color: TLDefaultColorStyle;
  }
>;

// 所有自定义卡片类型的联合类型
export type CustomShape =
  | ConversationCardShape
  | SearchResultCardShape
  | NoteCardShape
  | ClusterCardShape;
