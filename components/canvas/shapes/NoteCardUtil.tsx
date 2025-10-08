import {
  HTMLContainer,
  Rectangle2d,
  ShapeUtil,
  TLOnResizeHandler,
  resizeBox,
} from "tldraw";
import { NoteCardShape } from "./types";

export class NoteCardUtil extends ShapeUtil<NoteCardShape> {
  static override type = "note-card" as const;

  getDefaultProps(): NoteCardShape["props"] {
    return {
      w: 280,
      h: 200,
      content: "",
      tags: [],
      color: "yellow",
    };
  }

  getGeometry(shape: NoteCardShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  component(shape: NoteCardShape) {
    const { w, h, content, tags, color } = shape.props;

    const colorMap: Record<string, string> = {
      blue: "from-blue-50 to-blue-100/50 border-blue-200",
      red: "from-red-50 to-red-100/50 border-red-200",
      green: "from-green-50 to-green-100/50 border-green-200",
      yellow: "from-yellow-50 to-yellow-100/50 border-yellow-200",
      orange: "from-orange-50 to-orange-100/50 border-orange-200",
      purple: "from-purple-50 to-purple-100/50 border-purple-200",
      black: "from-gray-50 to-gray-100/50 border-gray-200",
    };

    return (
      <HTMLContainer
        style={{
          width: w,
          height: h,
          pointerEvents: "all",
        }}
      >
        <div
          className={`
            w-full h-full rounded-xl border-2 bg-gradient-to-br
            ${colorMap[color] || colorMap.yellow}
            p-5 flex flex-col gap-3 shadow-lg hover:shadow-xl
            transition-all duration-200
          `}
        >
          {/* 笔记头部 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">📝</span>
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Note
              </span>
            </div>
            {tags.length > 0 && (
              <span className="text-xs text-gray-500">{tags.length} 标签</span>
            )}
          </div>

          {/* 笔记内容 - 更好的排版 */}
          <div className="flex-1 overflow-auto">
            <p className="text-sm text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
              {content || "在此输入笔记..."}
            </p>
          </div>

          {/* 标签 - 更现代的设计 */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-200/50">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 bg-white/80 backdrop-blur-sm rounded-md text-gray-700 font-medium shadow-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </HTMLContainer>
    );
  }

  indicator(shape: NoteCardShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }

  override canResize = () => true;

  override onResize: TLOnResizeHandler<NoteCardShape> = (shape, info) => {
    return resizeBox(shape, info);
  };
}
