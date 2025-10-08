import {
  HTMLContainer,
  Rectangle2d,
  ShapeUtil,
  useEditor,
  useValue,
} from "tldraw";
import { ConversationCardShape } from "./types";
import { useState } from "react";

export class ConversationCardUtil extends ShapeUtil<ConversationCardShape> {
  static override type = "conversation-card" as const;

  getDefaultProps(): ConversationCardShape["props"] {
    return {
      w: 700,
      h: 400,
      userMessage: "",
      aiResponse: "",
      isLoading: false,
      timestamp: Date.now(),
      themeColor: "blue",
      showColorPicker: false,
    };
  }

  getGeometry(shape: ConversationCardShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  component(shape: ConversationCardShape) {
    const { w, h, userMessage, aiResponse, isLoading, themeColor, showColorPicker } = shape.props;
    const editor = useEditor();

    // 使用 useValue 订阅选中状态，避免重渲染问题
    const isSelected = useValue(
      "is selected",
      () => editor.getSelectedShapeIds().includes(shape.id),
      [editor, shape.id]
    );

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

    const currentColor = colors.find((c) => c.value === themeColor) || colors.find((c) => c.value === "blue")!;

    const toggleColorPicker = () => {
      console.log("Toggle color picker, current:", showColorPicker);
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
      // 保持选中状态
      editor.setSelectedShapes([shape.id]);
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
      // 保持选中状态
      editor.setSelectedShapes([shape.id]);
    };

    const handleDelete = () => {
      console.log("Delete card:", shape.id);
      if (confirm("确定要删除这个对话吗？")) {
        editor.deleteShape(shape.id);
      } else {
        // 取消删除，保持选中
        editor.setSelectedShapes([shape.id]);
      }
    };

    const handleRegenerate = async () => {
      console.log("Regenerate clicked");
      // 设置加载状态
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
      // 保持选中状态
      editor.setSelectedShapes([shape.id]);

      // 调用API重新生成
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
        // 保持选中状态
        editor.setSelectedShapes([shape.id]);
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
        // 保持选中状态
        editor.setSelectedShapes([shape.id]);
      }
    };

    return (
      <HTMLContainer
        style={{
          width: w,
          height: h,
          pointerEvents: "all",
        }}
      >
        {/* 外部按钮 - 只在选中时显示 */}
        {isSelected && (
          <>
            {/* 顶部左上方按钮 */}
            <div
              className="absolute -top-12 left-0 flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-1 py-1"
              style={{ pointerEvents: "all" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 主题按钮 */}
              <div className="relative group">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleColorPicker();
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                >
                  <div
                    className="w-5 h-5 rounded-full border-2"
                    style={{ backgroundColor: currentColor.bg, borderColor: currentColor.border }}
                  ></div>
                </button>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-[101]">
                  主题
                </div>

                {/* 颜色选择器弹窗 */}
                {showColorPicker && (
                  <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 z-[100] flex gap-1">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleColorChange(color.value);
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("确定要删除这个对话吗？")) {
                      handleDelete();
                    }
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  title="删除"
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
              className="absolute top-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 group"
              style={{ left: `${w + 8}px`, pointerEvents: "all" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRegenerate();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                disabled={isLoading}
                className="w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center text-gray-600 dark:text-gray-400 disabled:opacity-50"
                title="重新生成"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isLoading ? "animate-spin" : ""}>
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
        )}

        {/* 卡片主体 - 简洁设计 */}
        <div
          className="w-full h-full rounded-2xl bg-white dark:bg-gray-800 overflow-hidden flex flex-col shadow-lg transition-shadow"
          style={{ borderColor: currentColor.border, borderWidth: "3px", borderStyle: "solid" }}
        >
          {/* 用户提问 */}
          <div className="px-6 py-4">
            <p className="text-base font-medium text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
              {userMessage || "用户提问"}
            </p>
          </div>

          {/* 分隔线 */}
          <div className="px-6">
            <div className="border-t border-gray-200 dark:border-gray-700"></div>
          </div>

          {/* AI回答 */}
          <div className="flex-1 overflow-auto px-6 py-4">
            {isLoading ? (
              <div className="flex items-center gap-2 text-gray-500">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="30"></circle>
                </svg>
                <span>生成中...</span>
              </div>
            ) : (
              <p className="text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words leading-relaxed">
                {aiResponse || "等待AI回复..."}
              </p>
            )}
          </div>
        </div>
      </HTMLContainer>
    );
  }

  indicator(shape: ConversationCardShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }

  override canResize = () => true;
}
