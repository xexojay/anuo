"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import {
  ConversationCardUtil,
  SearchResultCardUtil,
  NoteCardUtil,
  ClusterCardUtil,
} from "./shapes";
import { useEditorContext } from "./EditorContext";
import { useParams } from "next/navigation";

// 自定义shapes数组（在组件外定义，避免重渲染）
const customShapeUtils = [
  ConversationCardUtil,
  SearchResultCardUtil,
  NoteCardUtil,
  ClusterCardUtil,
];

export default function CanvasBoard() {
  const { setEditor } = useEditorContext();
  const params = useParams();
  const boardId = (params?.id as string) || "default";

  return (
    <div className="w-full h-full">
      <Tldraw
        shapeUtils={customShapeUtils}
        persistenceKey={`research-canvas-${boardId}`}
        onMount={(editor) => {
          setEditor(editor);
          console.log(`Board loaded with persistence key: research-canvas-${boardId}`);
        }}
        components={{
          // 隐藏与我们UI冲突的tldraw默认组件
          Toolbar: null,        // 隐藏顶部工具栏（与输入框冲突）
          StylePanel: null,     // 隐藏样式面板
          PageMenu: null,       // 隐藏页面菜单
          MainMenu: null,       // 隐藏主菜单
          QuickActions: null,   // 隐藏快捷操作
          // NavigationPanel（缩放+Minimap）通过CSS移到右下角
          // 保留有用的组件：
          // - NavigationPanel（通过CSS调整位置）
          // - ContextMenu（右键菜单）
        }}
      />
    </div>
  );
}
