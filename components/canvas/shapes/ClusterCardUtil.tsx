import {
  HTMLContainer,
  Rectangle2d,
  ShapeUtil,
  TLOnResizeHandler,
  resizeBox,
} from "tldraw";
import { ClusterCardShape } from "./types";

export class ClusterCardUtil extends ShapeUtil<ClusterCardShape> {
  static override type = "cluster-card" as const;

  getDefaultProps(): ClusterCardShape["props"] {
    return {
      w: 350,
      h: 220,
      theme: "",
      cardIds: [],
      summary: "",
      color: "purple",
    };
  }

  getGeometry(shape: ClusterCardShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  component(shape: ClusterCardShape) {
    const { w, h, theme, cardIds, summary, color } = shape.props;

    const colorMap: Record<string, string> = {
      blue: "from-blue-100 via-blue-50 to-white border-blue-300",
      red: "from-red-100 via-red-50 to-white border-red-300",
      green: "from-green-100 via-green-50 to-white border-green-300",
      yellow: "from-yellow-100 via-yellow-50 to-white border-yellow-300",
      orange: "from-orange-100 via-orange-50 to-white border-orange-300",
      purple: "from-purple-100 via-purple-50 to-white border-purple-300",
      black: "from-gray-100 via-gray-50 to-white border-gray-300",
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
            w-full h-full rounded-xl border-2 border-dashed
            bg-gradient-to-br ${colorMap[color] || colorMap.purple}
            p-5 flex flex-col gap-3 shadow-xl hover:shadow-2xl
            transition-all duration-200 backdrop-blur-sm
          `}
        >
          {/* 头部 - 更醒目 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
              <span className="text-lg">🧩</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-base text-gray-900">
                {theme || "主题聚类"}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-purple-600 font-medium">
                  {cardIds.length} 个关联项
                </span>
                {cardIds.length > 0 && (
                  <span className="text-xs text-green-600">✓ 已分析</span>
                )}
              </div>
            </div>
          </div>

          {/* 摘要 - 更好的视觉层次 */}
          <div className="flex-1 overflow-auto bg-white/60 rounded-lg p-3 border border-gray-200/50">
            <p className="text-sm text-gray-700 leading-relaxed break-words">
              {summary || "AI 将自动生成这组卡片的关联摘要..."}
            </p>
          </div>

          {/* 底部信息 */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>语义关联</span>
            </div>
            <button className="text-xs text-purple-600 hover:text-purple-700 font-medium hover:underline">
              查看详情 →
            </button>
          </div>
        </div>
      </HTMLContainer>
    );
  }

  indicator(shape: ClusterCardShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }

  override canResize = () => true;

  override onResize: TLOnResizeHandler<ClusterCardShape> = (shape, info) => {
    return resizeBox(shape, info);
  };
}
