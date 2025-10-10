import { TLBaseShape, TLDefaultColorStyle } from "tldraw";

// 选中卡片引用类型
export type SelectedCardReference = {
  id: string;
  type: "conversation" | "image" | "video" | "search-result";
  title: string; // 显示的标题
  content?: string; // 内容摘要
  imageUrl?: string; // 图片URL
  videoUrl?: string; // 视频URL
  prompt?: string; // 提示词
};

// 卡片引用标记类型
export type CardReference = {
  type: "conversation" | "image" | "video" | "search-result";
  index: number; // 引用序号
  cardId: string; // 原始卡片ID
};

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
    themeColor: string; // 主题颜色
    showColorPicker: boolean; // 颜色选择器显示状态
    modelName?: string; // 使用的模型名称
    references?: CardReference[]; // 引用的卡片
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

// 图片卡片类型
export type ImageCardShape = TLBaseShape<
  "image-card",
  {
    w: number;
    h: number;
    imageUrl: string;
    prompt: string;
    isLoading: boolean;
    timestamp: number;
  }
>;

// 视频卡片类型
export type VideoCardShape = TLBaseShape<
  "video-card",
  {
    w: number;
    h: number;
    videoUrl: string;
    prompt: string;
    isLoading: boolean;
    taskId?: string;
    progress?: string;
    timestamp: number;
  }
>;

// 所有自定义卡片类型的联合类型
export type CustomShape =
  | ConversationCardShape
  | SearchResultCardShape
  | NoteCardShape
  | ClusterCardShape
  | ImageCardShape
  | VideoCardShape;
