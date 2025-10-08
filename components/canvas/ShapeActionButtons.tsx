"use client";

import { useEditor, useValue } from "tldraw";
import { ConversationCardShape } from "./shapes/types";
import { useState } from "react";

/**
 * 自定义UI组件 - 显示选中shape的操作按钮
 * 这些按钮在画布之上，完全可以接收点击事件
 */
export default function ShapeActionButtons() {
  const editor = useEditor();

  // 订阅选中的shapes
  const selectedShapes = useValue("selected shapes", () => {
    const ids = editor.getSelectedShapeIds();
    return ids.map((id) => editor.getShape(id));
  }, [editor]);

  // 只处理单个选中的ConversationCard
  if (selectedShapes.length !== 1) return null;

  const shape = selectedShapes[0];
  if (!shape || shape.type !== "conversation-card") return null;

  const conversationShape = shape as ConversationCardShape;
  const { themeColor, showColorPicker, userMessage } = conversationShape.props;

  // 获取shape的屏幕坐标
  const bounds = editor.getShapePageBounds(shape.id);
  if (!bounds) return null;

  const topLeft = editor.pageToScreen({ x: bounds.x, y: bounds.y });
  const topRight = editor.pageToScreen({ x: bounds.x + bounds.w, y: bounds.y });

  // 预置颜色
  const colors = [
    { name: "白色", value: "white", border: "#e5e7eb", bg: "#ffffff" },
    { name: "红色", value: "red", border: "#fca5a5", bg: "#fef2f2" },
    { name: "黄色", value: "yellow", border: "#fde047", bg: "#fefce8" },
    { name: "绿色", value: "green", border: "#86efac", bg: "#f0fdf4" },
    { name: "青色", value: "cyan", border: "#67e8f9", bg: "#ecfeff" },
    { name: "蓝色", value: "blue", border: "#60a5fa", bg: "#eff6ff" },
    { name: "紫色", value: "purple", border: "#c084fc", bg: "#faf5ff" },
    { name: "粉色", value: "pink", border: "#f9a8d4", bg: "#fdf2f8" },
    { name: "黑色", value: "black", border: "#6b7280", bg: "#f9fafb" },
  ];

  const currentColor = colors.find((c) => c.value === themeColor) || colors[5];

  const toggleColorPicker = () => {
    console.log("Toggle color picker");
    editor.updateShapes([
      {
        id: shape.id,
        type: "conversation-card",
        props: {
          ...conversationShape.props,
          showColorPicker: !showColorPicker,
        },
      },
    ]);
  };

  const handleColorChange = (color: string) => {
    console.log("Change color to:", color);
    editor.updateShapes([
      {
        id: shape.id,
        type: "conversation-card",
        props: {
          ...conversationShape.props,
          themeColor: color,
          showColorPicker: false,
        },
      },
    ]);
  };

  const handleDelete = () => {
    console.log("Delete card");
    if (confirm("确定要删除这个对话吗？")) {
      editor.deleteShape(shape.id);
    }
  };

  const handleRegenerate = async () => {
    console.log("Regenerate");
    editor.updateShapes([
      {
        id: shape.id,
        type: "conversation-card",
        props: {
          ...conversationShape.props,
          isLoading: true,
          aiResponse: "",
        },
      },
    ]);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      const newResponse = data.results?.[0]?.content || data.message || "无响应";

      editor.updateShapes([
        {
          id: shape.id,
          type: "conversation-card",
          props: {
            ...conversationShape.props,
            aiResponse: newResponse,
            isLoading: false,
          },
        },
      ]);
    } catch (error) {
      console.error("重新生成失败:", error);
      editor.updateShapes([
        {
          id: shape.id,
          type: "conversation-card",
          props: {
            ...conversationShape.props,
            aiResponse: "重新生成失败，请重试",
            isLoading: false,
          },
        },
      ]);
    }
  };

  return (
    <>
      {/* 顶部左侧按钮 */}
      <div
        className="absolute flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-1 py-1 z-50"
        style={{
          left: `${topLeft.x}px`,
          top: `${topLeft.y - 48}px`,
        }}
      >
        {/* 主题按钮 */}
        <div className="relative group">
          <button
            onClick={toggleColorPicker}
            className="w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            <div
              className="w-5 h-5 rounded-full border-2"
              style={{ backgroundColor: currentColor.bg, borderColor: currentColor.border }}
            ></div>
          </button>

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
            主题
          </div>

          {/* 颜色选择器 */}
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 flex gap-1">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorChange(color.value)}
                  className="w-7 h-7 rounded-full border-2 hover:scale-110 transition-transform"
                  style={{
                    backgroundColor: color.bg,
                    borderColor: color.border,
                  }}
                  title={color.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* 删除按钮 */}
        <div className="relative group">
          <button
            onClick={handleDelete}
            className="w-8 h-8 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
            删除
          </div>
        </div>
      </div>

      {/* 右侧顶部重新生成按钮 */}
      <div
        className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 z-50 group"
        style={{
          left: `${topRight.x + 8}px`,
          top: `${topRight.y}px`,
        }}
      >
        <button
          onClick={handleRegenerate}
          disabled={conversationShape.props.isLoading}
          className="w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center text-gray-600 dark:text-gray-400 disabled:opacity-50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={conversationShape.props.isLoading ? "animate-spin" : ""}>
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
        </button>

        {/* Tooltip */}
        <div className="absolute top-1/2 -translate-y-1/2 left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
          重新生成
        </div>
      </div>
    </>
  );
}
