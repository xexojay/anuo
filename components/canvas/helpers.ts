import { Editor, createShapeId } from "tldraw";
import type {
  ConversationCardShape,
  SearchResultCardShape,
  NoteCardShape,
  ClusterCardShape,
  ImageCardShape,
  VideoCardShape,
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
    modelName?: string;
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
        w: 700,
        h: 400,
        userMessage: data.userMessage,
        aiResponse: data.aiResponse || "",
        isLoading: data.isLoading ?? true,
        timestamp: Date.now(),
        themeColor: "blue",
        showColorPicker: false,
        modelName: data.modelName,
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
  isLoading: boolean = false,
  references?: any[]
) {
  const shape = editor.getShape(cardId as any) as ConversationCardShape | undefined;
  if (!shape) {
    console.error("Shape not found:", cardId);
    return;
  }

  editor.updateShapes([
    {
      id: cardId as any,
      type: "conversation-card",
      props: {
        ...shape.props,
        aiResponse,
        isLoading,
        references: references !== undefined ? references : (shape.props.references || []),
      },
    },
  ]);
}

// 创建图片卡片
export function createImageCard(
  editor: Editor,
  data: {
    imageUrl?: string;
    prompt: string;
    isLoading?: boolean;
    x?: number;
    y?: number;
  }
) {
  const id = createShapeId();
  editor.createShapes([
    {
      id,
      type: "image-card",
      x: data.x ?? 100,
      y: data.y ?? 100,
      props: {
        w: 500,
        h: 500,
        imageUrl: data.imageUrl || "",
        prompt: data.prompt,
        isLoading: data.isLoading ?? true,
        timestamp: Date.now(),
      },
    },
  ]);
  return id;
}

// 更新图片卡片
export function updateImageCard(
  editor: Editor,
  cardId: string,
  imageUrl: string,
  isLoading: boolean = false
) {
  const shape = editor.getShape(cardId as any);
  if (!shape) {
    console.error("Shape not found:", cardId);
    return;
  }

  editor.updateShapes([
    {
      id: cardId as any,
      type: "image-card",
      props: {
        ...shape.props,
        imageUrl,
        isLoading,
      },
    },
  ]);
}

// 创建视频卡片
export function createVideoCard(
  editor: Editor,
  data: {
    videoUrl?: string;
    prompt: string;
    isLoading?: boolean;
    taskId?: string;
    progress?: string;
    x?: number;
    y?: number;
  }
) {
  const id = createShapeId();
  editor.createShapes([
    {
      id,
      type: "video-card",
      x: data.x ?? 100,
      y: data.y ?? 100,
      props: {
        w: 640,
        h: 400,
        videoUrl: data.videoUrl || "",
        prompt: data.prompt,
        isLoading: data.isLoading ?? true,
        taskId: data.taskId,
        progress: data.progress,
        timestamp: Date.now(),
      },
    },
  ]);
  return id;
}

// 更新视频卡片
export function updateVideoCard(
  editor: Editor,
  cardId: string,
  updates: {
    videoUrl?: string;
    isLoading?: boolean;
    progress?: string;
  }
) {
  const shape = editor.getShape(cardId as any);
  if (!shape) {
    console.error("Shape not found:", cardId);
    return;
  }

  editor.updateShapes([
    {
      id: cardId as any,
      type: "video-card",
      props: {
        ...shape.props,
        ...updates,
      },
    },
  ]);
}

// 导出所有helpers
export const cardHelpers = {
  createConversationCard,
  updateConversationCard,
  createSearchResultCard,
  createNoteCard,
  createClusterCard,
  createImageCard,
  updateImageCard,
  createVideoCard,
  updateVideoCard,
};
