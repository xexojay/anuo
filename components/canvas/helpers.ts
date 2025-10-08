import { Editor, createShapeId } from "tldraw";
import type {
  ConversationCardShape,
  SearchResultCardShape,
  NoteCardShape,
  ClusterCardShape,
} from "./shapes";

// 创建搜索结果卡片
export function createSearchResultCard(
  editor: Editor,
  data: {
    title: string;
    snippet: string;
    source: "google" | "twitter";
    url: string;
    x?: number;
    y?: number;
  }
) {
  const id = createShapeId();
  editor.createShapes([
    {
      id,
      type: "search-result-card",
      x: data.x ?? 100,
      y: data.y ?? 100,
      props: {
        w: 320,
        h: 180,
        title: data.title,
        snippet: data.snippet,
        source: data.source,
        url: data.url,
        timestamp: new Date().toISOString(),
        color: data.source === "google" ? "blue" : "blue",
      },
    },
  ]);
  return id;
}

// 创建笔记卡片
export function createNoteCard(
  editor: Editor,
  data: {
    content: string;
    tags?: string[];
    x?: number;
    y?: number;
    color?: string;
  }
) {
  const id = createShapeId();
  editor.createShapes([
    {
      id,
      type: "note-card",
      x: data.x ?? 100,
      y: data.y ?? 100,
      props: {
        w: 280,
        h: 200,
        content: data.content,
        tags: data.tags || [],
        color: (data.color as any) || "yellow",
      },
    },
  ]);
  return id;
}

// 创建聚类卡片
export function createClusterCard(
  editor: Editor,
  data: {
    theme: string;
    cardIds: string[];
    summary: string;
    x?: number;
    y?: number;
  }
) {
  const id = createShapeId();
  editor.createShapes([
    {
      id,
      type: "cluster-card",
      x: data.x ?? 100,
      y: data.y ?? 100,
      props: {
        w: 350,
        h: 220,
        theme: data.theme,
        cardIds: data.cardIds,
        summary: data.summary,
        color: "purple",
      },
    },
  ]);
  return id;
}

// 创建对话卡片
export function createConversationCard(
  editor: Editor,
  data: {
    userMessage: string;
    aiResponse?: string;
    isLoading?: boolean;
    x?: number;
    y?: number;
  }
) {
  const id = createShapeId();
  editor.createShapes([
    {
      id,
      type: "conversation-card",
      x: data.x ?? 100,
      y: data.y ?? 100,
      props: {
        w: 600,
        h: 400,
        userMessage: data.userMessage,
        aiResponse: data.aiResponse || "",
        isLoading: data.isLoading ?? true,
        timestamp: Date.now(),
      },
    },
  ]);
  return id;
}

// 更新对话卡片的AI回复
export function updateConversationCard(
  editor: Editor,
  cardId: string,
  aiResponse: string,
  isLoading: boolean = false
) {
  editor.updateShape({
    id: cardId as any,
    type: "conversation-card",
    props: {
      aiResponse,
      isLoading,
    },
  });
}

// 导出所有helpers
export const cardHelpers = {
  createConversationCard,
  updateConversationCard,
  createSearchResultCard,
  createNoteCard,
  createClusterCard,
};
