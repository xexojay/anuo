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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
      modelName: undefined,
    };
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
    // 限制最小宽度 500px
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
    const { w, h, userMessage, aiResponse, isLoading, themeColor, modelName, references } = shape.props;
    const contentRef = useRef<HTMLDivElement>(null);
    const editor = useEditor();

    // 获取引用类型图标和文字
    const getReferenceLabel = (type: string, index: number) => {
      switch (type) {
        case "conversation": return { icon: "💬", label: `对话 #${index}` };
        case "image": return { icon: "🖼️", label: `图片 #${index}` };
        case "video": return { icon: "🎬", label: `视频 #${index}` };
        case "search-result": return { icon: "🔍", label: `搜索 #${index}` };
        default: return { icon: "📎", label: `引用 #${index}` };
      }
    };

    // 预置颜色
    const colors = [
      { name: "白色", value: "white", border: "#e5e7eb", bg: "#ffffff" },
      { name: "红色", value: "red", border: "#fca5a5", bg: "#fef2f2" },
      { name: "橙色", value: "orange", border: "#fdba74", bg: "#fff7ed" },
      { name: "黄色", value: "yellow", border: "#fde047", bg: "#fefce8" },
      { name: "淡绿色", value: "light-green", border: "#bbf7d0", bg: "#f0fdf4" },
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
              {modelName && <span className="text-blue-600 dark:text-blue-400">@{modelName} </span>}
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
              <div className="text-base text-gray-800 dark:text-gray-200 leading-relaxed markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // 标题样式
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-3 mb-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-2 mb-1" {...props} />,
                    // 段落样式
                    p: ({node, ...props}) => <p className="mb-2" {...props} />,
                    // 代码块样式
                    code: ({node, ...props}: any) =>
                      props.inline ? (
                        <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                      ) : (
                        <code className="block bg-gray-100 dark:bg-gray-700 p-3 rounded my-2 overflow-x-auto text-sm font-mono" {...props} />
                      ),
                    // 链接样式
                    a: ({node, ...props}) => <a className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                    // 列表样式
                    ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="ml-2" {...props} />,
                    // 引用块样式
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-2" {...props} />,
                    // 表格样式
                    table: ({node, ...props}) => <table className="border-collapse border border-gray-300 dark:border-gray-600 my-2" {...props} />,
                    th: ({node, ...props}) => <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-100 dark:bg-gray-700 font-semibold" {...props} />,
                    td: ({node, ...props}) => <td className="border border-gray-300 dark:border-gray-600 px-3 py-2" {...props} />,
                    // 强调样式
                    strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                    em: ({node, ...props}) => <em className="italic" {...props} />,
                  }}
                >
                  {aiResponse || "等待AI回复..."}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* 引用标记 - 显示在卡片底部 */}
          {references && references.length > 0 && (
            <div className="px-6 pb-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500 dark:text-gray-400">📎 引用：</span>
                {references.map((ref) => {
                  const refLabel = getReferenceLabel(ref.type, ref.index);
                  return (
                    <span
                      key={ref.cardId}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs"
                    >
                      <span>{refLabel.icon}</span>
                      <span>{refLabel.label}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </HTMLContainer>
    );
  }

  indicator(shape: ConversationCardShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
