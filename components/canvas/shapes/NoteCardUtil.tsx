import {
  HTMLContainer,
  Rectangle2d,
  ShapeUtil,
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
    const { w, h, content } = shape.props;

    return (
      <HTMLContainer
        style={{
          width: w,
          height: h,
          pointerEvents: "all",
        }}
      >
        <div className="w-full h-full rounded-2xl border-2 border-blue-500 bg-white dark:bg-gray-800 p-6 flex flex-col shadow-md hover:shadow-lg transition-shadow">
          {/* 笔记内容 */}
          <div className="flex-1 overflow-auto">
            <p className="text-base text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words leading-relaxed">
              {content || "在此输入笔记..."}
            </p>
          </div>
        </div>
      </HTMLContainer>
    );
  }

  indicator(shape: NoteCardShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }

  override canResize = () => true;

}
