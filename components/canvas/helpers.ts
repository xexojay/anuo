import { Editor, createShapeId } from "tldraw";
import type {
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

// 导出所有helpers
export const cardHelpers = {
  createSearchResultCard,
  createNoteCard,
  createClusterCard,
};
