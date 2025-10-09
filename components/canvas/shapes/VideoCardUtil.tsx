import {
  HTMLContainer,
  Rectangle2d,
  ShapeUtil,
  TLResizeInfo,
  resizeBox,
  useEditor,
} from "tldraw";
import { VideoCardShape } from "./types";
import { useRef } from "react";

export class VideoCardUtil extends ShapeUtil<VideoCardShape> {
  static override type = "video-card" as const;

  getDefaultProps(): VideoCardShape["props"] {
    return {
      w: 640,
      h: 400,
      videoUrl: "",
      prompt: "",
      isLoading: true,
      taskId: undefined,
      progress: undefined,
      timestamp: Date.now(),
    };
  }

  // 允许调整大小
  override canResize() {
    return true;
  }

  // 处理调整大小 - 保持 16:9 宽高比，限制最小宽度
  override onResize(shape: VideoCardShape, info: TLResizeInfo<VideoCardShape>) {
    const resized = resizeBox(shape, info);
    // 限制最小宽度 400px
    if (resized.props.w < 400) {
      resized.props.w = 400;
    }
    // 保持 16:9 宽高比（加上头部高度）
    const headerHeight = 48; // 头部高度
    const videoHeight = resized.props.w * 9 / 16;
    resized.props.h = Math.max(300, videoHeight + headerHeight);
    return resized;
  }

  getGeometry(shape: VideoCardShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  component(shape: VideoCardShape) {
    const { w, h, videoUrl, prompt, isLoading, progress } = shape.props;
    const videoRef = useRef<HTMLVideoElement>(null);
    const editor = useEditor();

    // 视频加载完成后自动调整卡片大小
    const handleVideoLoaded = () => {
      if (!videoRef.current) return;

      const video = videoRef.current;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      console.log(`[视频卡片] 视频加载完成: ${videoWidth}x${videoHeight}`);

      if (videoWidth && videoHeight) {
        const headerHeight = 48;
        const maxWidth = 800;
        const aspectRatio = videoWidth / videoHeight;

        // 计算合适的宽度（不超过最大宽度）
        let newWidth = Math.min(videoWidth, maxWidth);
        let newHeight = newWidth / aspectRatio + headerHeight;

        console.log(`[视频卡片] 调整大小: ${newWidth}x${newHeight}`);

        editor.updateShapes([
          {
            id: shape.id,
            type: "video-card",
            props: {
              ...shape.props,
              w: newWidth,
              h: newHeight,
            },
          },
        ]);
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
        <div className="w-full h-full rounded-2xl shadow-lg bg-white dark:bg-gray-800 border-2 border-blue-300 dark:border-blue-600 overflow-hidden flex flex-col">
          {/* 头部提示 */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {prompt || "视频生成"}
            </p>
          </div>

          {/* 视频内容区 */}
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative">
            {isLoading ? (
              <div className="flex flex-col items-center gap-3 text-gray-500">
                <svg
                  className="animate-spin h-10 w-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    strokeDasharray="60"
                    strokeDashoffset="30"
                  ></circle>
                </svg>
                <span className="text-sm">
                  {progress || "生成视频中..."}
                </span>
              </div>
            ) : videoUrl ? (
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                className="max-w-full max-h-full"
                style={{
                  width: "100%",
                  height: "100%",
                }}
                onLoadedMetadata={handleVideoLoaded}
              >
                您的浏览器不支持视频播放
              </video>
            ) : (
              <div className="text-gray-400 text-sm">视频加载失败</div>
            )}
          </div>
        </div>
      </HTMLContainer>
    );
  }

  indicator(shape: VideoCardShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }

  // 导出为SVG（用于生成PNG）- 视频显示占位图
  override async toSvg(shape: VideoCardShape) {
    const { w, h, prompt } = shape.props;

    // 视频无法导出为静态图片，显示占位图
    return (
      <g>
        <rect width={w} height={h} fill="#eff6ff" stroke="#60a5fa" strokeWidth="3" rx="12" />
        <text
          x={w / 2}
          y={h / 2 - 10}
          textAnchor="middle"
          fontSize="24"
          fill="#1f2937"
        >
          🎬
        </text>
        <text
          x={w / 2}
          y={h / 2 + 20}
          textAnchor="middle"
          fontSize="16"
          fill="#4b5563"
        >
          视频: {prompt}
        </text>
      </g>
    );
  }
}
