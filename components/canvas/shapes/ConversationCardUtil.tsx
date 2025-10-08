import {
  HTMLContainer,
  Rectangle2d,
  ShapeUtil,
  useEditor,
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
    const { w, h, userMessage, aiResponse, isLoading, themeColor } = shape.props;
    const editor = useEditor();

    // 检查是否选中
    const isSelected = editor.getSelectedShapeIds().includes(shape.id);

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

    const handleColorChange = (color: string) => {
      editor.updateShapes([
        {
          id: shape.id,
          type: "conversation-card",
          props: {
            ...shape.props,
            themeColor: color,
          },
        },
      ]);
    };

    const handleDelete = () => {
      editor.deleteShape(shape.id);
    };

    const handleRegenerate = async () => {
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

    const [showColorPicker, setShowColorPicker] = useState(false);

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
              className="absolute -top-12 left-0 flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-2 py-1"
              style={{ pointerEvents: "all" }}
            >
              {/* 主题按钮 */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowColorPicker(!showColorPicker);
                  }}
                  className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300"
                  title="主题"
                >
                  <div
                    className="w-4 h-4 rounded-full border-2"
                    style={{ backgroundColor: currentColor.bg, borderColor: currentColor.border }}
                  ></div>
                  <span>主题</span>
                </button>

                {/* 颜色选择器 */}
                {showColorPicker && (
                  <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 z-50 flex gap-1">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleColorChange(color.value);
                          setShowColorPicker(false);
                        }}
                        className="w-6 h-6 rounded-full border-2 hover:scale-110 transition-transform"
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                title="删除"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span>删除</span>
              </button>
            </div>

            {/* 右侧中间重新生成按钮 */}
            <div
              className="absolute top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1"
              style={{ left: `${w + 8}px`, pointerEvents: "all" }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRegenerate();
                }}
                disabled={isLoading}
                className="w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center text-gray-700 dark:text-gray-300 disabled:opacity-50"
                title="重新生成"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isLoading ? "animate-spin" : ""}>
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
              </button>
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
