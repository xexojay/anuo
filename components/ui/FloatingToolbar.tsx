"use client";

import { useEditorContext } from "@/components/canvas/EditorContext";
import { useEffect, useState } from "react";

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}

function ToolButton({ icon, label, onClick, active }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-10 h-10 flex items-center justify-center rounded-lg
        transition-colors relative group
        ${
          active
            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
        }
      `}
      title={label}
    >
      {icon}

      {/* Tooltip */}
      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
        {label}
      </div>
    </button>
  );
}

function Divider() {
  return <div className="w-6 h-px bg-gray-200 dark:bg-gray-700 mx-auto my-1"></div>;
}

export default function FloatingToolbar() {
  const { editor } = useEditorContext();
  const [currentTool, setCurrentTool] = useState<string>("select");

  const handleUpload = () => {
    // TODO: 实现文件上传功能
    console.log("Upload file");
  };

  // 监听工具变化
  useEffect(() => {
    if (!editor) return;

    const updateCurrentTool = () => {
      const toolId = editor.getCurrentToolId();
      setCurrentTool(toolId);
    };

    // 初始化
    updateCurrentTool();

    // 监听变化
    const unsubscribe = editor.store.listen(() => {
      updateCurrentTool();
    });

    return () => {
      unsubscribe();
    };
  }, [editor]);

  const handleText = () => {
    if (editor) {
      editor.setCurrentTool("text");
      setCurrentTool("text");
    }
  };

  const handleRectangle = () => {
    if (editor) {
      editor.setCurrentTool("geo");
      setCurrentTool("geo");
    }
  };

  const handleArrow = () => {
    if (editor) {
      editor.setCurrentTool("arrow");
      setCurrentTool("arrow");
    }
  };

  const handleUndo = () => {
    if (editor) {
      editor.undo();
    }
  };

  const handleRedo = () => {
    if (editor) {
      editor.redo();
    }
  };

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex flex-col gap-1">
        {/* 上传文件 */}
        <ToolButton
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          }
          label="上传文件"
          onClick={handleUpload}
        />

        {/* 新建文字 */}
        <ToolButton
          icon={
            <span className="text-xl font-semibold">T</span>
          }
          label="新建文字"
          onClick={handleText}
          active={currentTool === "text"}
        />

        {/* 矩形 */}
        <ToolButton
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            </svg>
          }
          label="矩形"
          onClick={handleRectangle}
          active={currentTool === "geo"}
        />

        {/* 箭头 */}
        <ToolButton
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          }
          label="箭头"
          onClick={handleArrow}
          active={currentTool === "arrow"}
        />

        <Divider />

        {/* 撤销 */}
        <ToolButton
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"></polyline>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
            </svg>
          }
          label="撤销"
          onClick={handleUndo}
        />

        {/* 前进 */}
        <ToolButton
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
          }
          label="前进"
          onClick={handleRedo}
        />
      </div>
    </div>
  );
}
