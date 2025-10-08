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
      w: 600,
      h: 400,
      userMessage: "",
      aiResponse: "",
      isLoading: false,
      timestamp: Date.now(),
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
    const { w, h, userMessage, aiResponse, isLoading } = shape.props;

    return (
      <HTMLContainer
        style={{
          width: w,
          height: h,
          pointerEvents: "all",
        }}
      >
        <div className="w-full h-full rounded-2xl border-2 border-blue-500 bg-white dark:bg-gray-800 overflow-hidden flex shadow-lg hover:shadow-xl transition-shadow">
          {/* 主内容区域 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* 用户提问区域 */}
            <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                {userMessage || "用户提问"}
              </h3>
            </div>

            {/* AI回答区域 */}
            <div className="flex-1 overflow-auto px-6 py-4">
              {isLoading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="animate-spin">⟳</span>
                  <span>生成中...</span>
                </div>
              ) : (
                <p className="text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words leading-relaxed">
                  {aiResponse || "等待AI回复..."}
                </p>
              )}
            </div>
          </div>

          {/* 右侧工具按钮栏 */}
          <div className="w-12 border-l border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/30 flex flex-col items-center gap-2 py-4">
            {/* 保存按钮 */}
            <button
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="保存"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
            </button>

            {/* 刷新按钮 */}
            <button
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="重新生成"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
            </button>

            {/* 复制按钮 */}
            <button
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="复制"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>

            {/* 删除按钮 */}
            <button
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="删除"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
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
