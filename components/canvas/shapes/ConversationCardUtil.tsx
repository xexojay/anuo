import {
  HTMLContainer,
  Rectangle2d,
  ShapeUtil,
} from "tldraw";
import { ConversationCardShape } from "./types";

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
    const { w, h, userMessage, aiResponse, isLoading, themeColor } = shape.props;

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

    return (
      <HTMLContainer
        style={{
          width: w,
          height: h,
          pointerEvents: "all",
        }}
      >
        {/* 卡片主体 - 简洁设计 */}
        <div
          className="w-full h-full rounded-2xl bg-white dark:bg-gray-800 overflow-hidden flex flex-col shadow-lg transition-shadow"
          style={{
            borderColor: currentColor.border,
            borderWidth: "3px",
            borderStyle: "solid",
          }}
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
