import {
  HTMLContainer,
  Rectangle2d,
  ShapeUtil,
  TLResizeInfo,
  resizeBox,
  useEditor,
} from "tldraw";
import { ConversationCardShape } from "./types";
import { useLayoutEffect, useRef } from "react";

export class ConversationCardUtil extends ShapeUtil<ConversationCardShape> {
  static override type = "conversation-card" as const;
  private contentHeightCache = new Map<string, number>();

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

  // 最小尺寸限制 - 只限制宽度
  override getMinDimensions() {
    return { w: 500, h: 100 };
  }

  // 允许调整大小
  override canResize() {
    return true;
  }

  // 处理调整大小 - 只应用宽度变化，限制最小宽度
  override onResize(shape: ConversationCardShape, info: TLResizeInfo<ConversationCardShape>) {
    const resized = resizeBox(shape, info);
    // 保持原有高度不变，让 useLayoutEffect 自动调整
    resized.props.h = shape.props.h;
    // 限制最小宽度
    if (resized.props.w < 500) {
      resized.props.w = 500;
    }
    return resized;
  }

  // 获取内容所需的基础高度
  getContentHeight(shapeId: string): number {
    return this.contentHeightCache.get(shapeId) || 400;
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
    const contentRef = useRef<HTMLDivElement>(null);
    const editor = useEditor();

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

    // 测量内容高度，自动调整卡片高度（类似 Excel 自动换行）
    useLayoutEffect(() => {
      if (!contentRef.current) return;

      const contentHeight = contentRef.current.scrollHeight;
      // 添加小的 padding 让内容有呼吸空间
      const neededHeight = Math.max(200, contentHeight + 8);

      // 更新缓存
      this.contentHeightCache.set(shape.id, neededHeight);

      // 自动调整高度以匹配内容（无论是增加还是减少）
      if (Math.abs(neededHeight - h) > 2) { // 避免微小变化导致频繁更新
        editor.updateShape({
          id: shape.id,
          type: "conversation-card",
          props: {
            ...shape.props,
            h: neededHeight,
          },
        });
      }
    }, [userMessage, aiResponse, w, h, shape.id, shape.props, editor]);

    return (
      <HTMLContainer
        style={{
          width: w,
          height: h,
          pointerEvents: "all",
        }}
      >
        {/* 卡片主体 - 填满容器，内容自然显示 */}
        <div
          ref={contentRef}
          className="w-full rounded-2xl shadow-lg transition-all duration-200 flex flex-col"
          style={{
            backgroundColor: currentColor.bg,
            borderColor: currentColor.border,
            borderWidth: "3px",
            borderStyle: "solid",
            minHeight: h,
          }}
        >
          {/* 用户提问 */}
          <div className="px-6 pt-4 pb-2">
            <p className="text-base font-medium text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
              {userMessage || "用户提问"}
            </p>
          </div>

          {/* 分隔线 */}
          <div className="px-6">
            <div className="border-t border-gray-200 dark:border-gray-700"></div>
          </div>

          {/* AI回答 - 完整显示，占据剩余空间 */}
          <div className="px-6 pt-2 pb-4 flex-1 flex items-start">
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
