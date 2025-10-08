import {
  HTMLContainer,
  Rectangle2d,
  ShapeUtil,
  DefaultColorStyle,
} from "tldraw";
import { SearchResultCardShape } from "./types";

export class SearchResultCardUtil extends ShapeUtil<SearchResultCardShape> {
  static override type = "search-result-card" as const;

  getDefaultProps(): SearchResultCardShape["props"] {
    return {
      w: 320,
      h: 180,
      title: "",
      snippet: "",
      source: "google",
      url: "",
      timestamp: new Date().toISOString(),
      color: "blue",
    };
  }

  getGeometry(shape: SearchResultCardShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  component(shape: SearchResultCardShape) {
    const { w, h, title, snippet, source, url, color } = shape.props;

    const colorMap: Record<string, string> = {
      blue: "bg-white border-blue-200 hover:border-blue-400",
      red: "bg-white border-red-200 hover:border-red-400",
      green: "bg-white border-green-200 hover:border-green-400",
      yellow: "bg-white border-yellow-200 hover:border-yellow-400",
      orange: "bg-white border-orange-200 hover:border-orange-400",
      purple: "bg-white border-purple-200 hover:border-purple-400",
      black: "bg-white border-gray-200 hover:border-gray-400",
    };

    const accentColorMap: Record<string, string> = {
      blue: "bg-blue-500",
      red: "bg-red-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      orange: "bg-orange-500",
      purple: "bg-purple-500",
      black: "bg-gray-500",
    };

    const sourceConfig = {
      google: { icon: "🔍", label: "Google", color: "text-blue-600" },
      twitter: { icon: "𝕏", label: "Twitter", color: "text-gray-900" },
    };

    const sourceInfo = sourceConfig[source];

    return (
      <HTMLContainer
        style={{
          width: w,
          height: h,
          pointerEvents: "all",
        }}
      >
        <div className="w-full h-full rounded-2xl border-2 border-blue-500 bg-white dark:bg-gray-800 p-5 flex flex-col gap-3 shadow-md hover:shadow-lg overflow-hidden transition-shadow">
          {/* 顶部来源标签 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                {sourceInfo.icon}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {sourceInfo.label}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(shape.props.timestamp).toLocaleTimeString("zh-CN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* 标题 - 更大更突出 */}
          <h3 className="font-bold text-base text-gray-900 line-clamp-2 leading-snug break-words">
            {title || "搜索结果"}
          </h3>

          {/* 摘要 - 更好的可读性 */}
          <p className="text-sm text-gray-600 line-clamp-4 flex-1 overflow-hidden break-words leading-relaxed">
            {snippet || "暂无摘要"}
          </p>

          {/* 底部区域 */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium truncate flex-1 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                访问链接 →
              </a>
            )}
            <button
              className="ml-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: 添加收藏功能
              }}
            >
              ⭐
            </button>
          </div>
        </div>
      </HTMLContainer>
    );
  }

  indicator(shape: SearchResultCardShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }

  override canResize = () => true;

}
