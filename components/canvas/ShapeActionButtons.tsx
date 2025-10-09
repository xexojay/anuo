"use client";

import { useEditor, useValue } from "tldraw";
import { ConversationCardShape, ImageCardShape, VideoCardShape } from "./shapes/types";
import { useState } from "react";
import { pollVideoStatus } from "@/lib/video-polling";
import { useToasts } from "tldraw";

/**
 * 自定义UI组件 - 显示选中shape的操作按钮
 * 这些按钮在画布之上，完全可以接收点击事件
 */
export default function ShapeActionButtons() {
  const editor = useEditor();

  // 订阅选中的shapes和相机状态，以便按钮跟随卡片移动
  const shapeData = useValue("shape with screen position", () => {
    // 订阅相机状态，这样移动/缩放画布时会重新计算
    editor.getCamera();

    const ids = editor.getSelectedShapeIds();
    if (ids.length !== 1) return null;

    const shape = editor.getShape(ids[0]);

    // 支持的卡片类型
    const supportedTypes = ["conversation-card", "image-card", "video-card"];
    if (!shape || !supportedTypes.includes(shape.type)) return null;

    const bounds = editor.getShapePageBounds(shape.id);
    if (!bounds) return null;

    // 计算屏幕坐标
    const topLeft = editor.pageToScreen({ x: bounds.x, y: bounds.y });
    const topRight = editor.pageToScreen({ x: bounds.x + bounds.w, y: bounds.y });

    return {
      shape,
      topLeft,
      topRight,
    };
  }, [editor]);

  // 如果没有选中合适的shape，不显示按钮
  if (!shapeData) return null;

  const { shape, topLeft, topRight } = shapeData;

  // 根据类型渲染不同的按钮
  if (shape.type === "conversation-card") {
    return <ConversationCardButtons shape={shape as ConversationCardShape} topLeft={topLeft} topRight={topRight} />;
  } else if (shape.type === "image-card") {
    return <ImageCardButtons shape={shape as ImageCardShape} topLeft={topLeft} topRight={topRight} />;
  } else if (shape.type === "video-card") {
    return <VideoCardButtons shape={shape as VideoCardShape} topLeft={topLeft} topRight={topRight} />;
  }

  return null;
}

/**
 * 对话卡片按钮
 */
function ConversationCardButtons({ shape, topLeft, topRight }: { shape: ConversationCardShape; topLeft: any; topRight: any }) {
  const editor = useEditor();
  const { themeColor, showColorPicker, userMessage } = shape.props;

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
          ...shape.props,
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
          ...shape.props,
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
          ...shape.props,
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
            ...shape.props,
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
            ...shape.props,
            aiResponse: "重新生成失败，请重试",
            isLoading: false,
          },
        },
      ]);
    }
  };

  const handleResetSize = () => {
    console.log("Reset to base size");
    // 获取 ShapeUtil 实例来访问 contentHeightCache
    const util = editor.getShapeUtil(shape);
    const contentHeight = (util as any).getContentHeight?.(shape.id) || 400;

    editor.updateShapes([
      {
        id: shape.id,
        type: "conversation-card",
        props: {
          ...shape.props,
          w: 700, // 默认宽度
          h: contentHeight, // 内容所需高度
        },
      },
    ]);
  };

  return (
    <>
      {/* 顶部左侧按钮 */}
      <div
        className="absolute flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-1 py-1 z-[9999]"
        style={{
          left: `${topLeft.x}px`,
          top: `${topLeft.y - 48}px`,
          pointerEvents: 'auto',
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
            <div
              className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 flex gap-1"
              style={{ pointerEvents: 'auto' }}
            >
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

        {/* 重置大小按钮 */}
        <div className="relative group">
          <button
            onClick={handleResetSize}
            className="w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center text-gray-600 dark:text-gray-400"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7v6h6"></path>
              <path d="M21 17v-6h-6"></path>
              <path d="M21 7a9 9 0 0 0-9-9 9 9 0 0 0-9 9m0 10a9 9 0 0 0 9 9 9 9 0 0 0 9-9"></path>
            </svg>
          </button>

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
            重置大小
          </div>
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
        className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 z-[9999] group"
        style={{
          left: `${topRight.x + 8}px`,
          top: `${topRight.y}px`,
          pointerEvents: 'auto',
        }}
      >
        <button
          onClick={handleRegenerate}
          disabled={shape.props.isLoading}
          className="w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center text-gray-600 dark:text-gray-400 disabled:opacity-50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={shape.props.isLoading ? "animate-spin" : ""}>
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

/**
 * 图片卡片按钮
 */
function ImageCardButtons({ shape, topLeft, topRight }: { shape: ImageCardShape; topLeft: any; topRight: any }) {
  const editor = useEditor();
  const toasts = useToasts();

  const handleDelete = () => {
    if (confirm("确定要删除这张图片吗？")) {
      editor.deleteShape(shape.id);
    }
  };

  // 复制原图到剪贴板（无边距）
  const handleCopyOriginal = async () => {
    try {
      const response = await fetch(shape.props.imageUrl);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);

      console.log("✅ 原图已复制到剪贴板");

      // 显示成功提示
      toasts.addToast({
        title: "复制成功",
        severity: "success",
      });
    } catch (error) {
      console.error("复制原图失败:", error);

      // 显示错误提示
      toasts.addToast({
        title: "复制失败",
        description: "请重试",
        severity: "error",
      });
    }
  };

  // 下载原图（无边距）
  const handleDownloadOriginal = async () => {
    try {
      const response = await fetch(shape.props.imageUrl);
      const blob = await response.blob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log("✅ 原图已下载");

      // 显示成功提示
      toasts.addToast({
        title: "下载成功",
        severity: "success",
      });
    } catch (error) {
      console.error("下载原图失败:", error);

      // 显示错误提示
      toasts.addToast({
        title: "下载失败",
        description: "请重试",
        severity: "error",
      });
    }
  };

  const handleRegenerate = async () => {
    console.log("重新生成图片");

    // 设置加载状态
    editor.updateShapes([
      {
        id: shape.id,
        type: "image-card",
        props: {
          ...shape.props,
          isLoading: true,
          imageUrl: "",
        },
      },
    ]);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: shape.props.prompt,
          model: "nano-banana",
          baseUrl: "https://api.tu-zi.com",
          modelType: "image",
        }),
      });

      const data = await response.json();

      if (data.results?.[0]?.imageUrl) {
        editor.updateShapes([
          {
            id: shape.id,
            type: "image-card",
            props: {
              ...shape.props,
              imageUrl: data.results[0].imageUrl,
              isLoading: false,
            },
          },
        ]);
      } else {
        throw new Error("图片生成失败");
      }
    } catch (error) {
      console.error("重新生成图片失败:", error);
      editor.updateShapes([
        {
          id: shape.id,
          type: "image-card",
          props: {
            ...shape.props,
            isLoading: false,
          },
        },
      ]);
    }
  };

  return (
    <>
      <div
        className="absolute flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-1 py-1 z-[9999]"
        style={{
          left: `${topLeft.x}px`,
          top: `${topLeft.y - 48}px`,
          pointerEvents: 'auto',
        }}
      >
        {/* 复制原图按钮 */}
        <div className="relative group">
          <button
            onClick={handleCopyOriginal}
            disabled={shape.props.isLoading}
            className="w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center text-gray-600 dark:text-gray-400 disabled:opacity-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
            复制原图
          </div>
        </div>

        {/* 下载原图按钮 */}
        <div className="relative group">
          <button
            onClick={handleDownloadOriginal}
            disabled={shape.props.isLoading}
            className="w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center text-gray-600 dark:text-gray-400 disabled:opacity-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
            下载原图
          </div>
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
        className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 z-[9999] group"
        style={{
          left: `${topRight.x + 8}px`,
          top: `${topRight.y}px`,
          pointerEvents: 'auto',
        }}
      >
        <button
          onClick={handleRegenerate}
          disabled={shape.props.isLoading}
          className="w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center text-gray-600 dark:text-gray-400 disabled:opacity-50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={shape.props.isLoading ? "animate-spin" : ""}>
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

/**
 * 视频卡片按钮
 */
function VideoCardButtons({ shape, topLeft, topRight }: { shape: VideoCardShape; topLeft: any; topRight: any }) {
  const editor = useEditor();

  const handleDelete = () => {
    if (confirm("确定要删除这个视频吗？")) {
      editor.deleteShape(shape.id);
    }
  };

  const handleRegenerate = async () => {
    console.log("重新生成视频");

    // 设置加载状态
    editor.updateShapes([
      {
        id: shape.id,
        type: "video-card",
        props: {
          ...shape.props,
          isLoading: true,
          videoUrl: "",
          progress: "提交视频生成任务...",
        },
      },
    ]);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: shape.props.prompt,
          model: "sora-2",
          baseUrl: "https://asyncdata.net/tran/https://api.tu-zi.com",
          modelType: "video",
        }),
      });

      const data = await response.json();

      if (data.results?.[0]) {
        const result = data.results[0];

        // 更新任务ID
        editor.updateShapes([
          {
            id: shape.id,
            type: "video-card",
            props: {
              ...shape.props,
              taskId: result.taskId,
              progress: "视频生成中...",
            },
          },
        ]);

        // 开始轮询
        pollVideoStatus({
          editor,
          cardId: shape.id,
          taskId: result.taskId,
          sourceUrl: result.sourceUrl,
        });
      } else {
        throw new Error("视频任务提交失败");
      }
    } catch (error) {
      console.error("重新生成视频失败:", error);
      editor.updateShapes([
        {
          id: shape.id,
          type: "video-card",
          props: {
            ...shape.props,
            isLoading: false,
            progress: "视频生成失败",
          },
        },
      ]);
    }
  };

  return (
    <>
      <div
        className="absolute flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-1 py-1 z-[9999]"
        style={{
          left: `${topLeft.x}px`,
          top: `${topLeft.y - 48}px`,
          pointerEvents: 'auto',
        }}
      >
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
        className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 z-[9999] group"
        style={{
          left: `${topRight.x + 8}px`,
          top: `${topRight.y}px`,
          pointerEvents: 'auto',
        }}
      >
        <button
          onClick={handleRegenerate}
          disabled={shape.props.isLoading}
          className="w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center text-gray-600 dark:text-gray-400 disabled:opacity-50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={shape.props.isLoading ? "animate-spin" : ""}>
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
