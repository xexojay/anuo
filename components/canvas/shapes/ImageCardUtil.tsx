import {
  HTMLContainer,
  Rectangle2d,
  ShapeUtil,
  TLResizeInfo,
  resizeBox,
  useEditor,
} from "tldraw";
import { ImageCardShape } from "./types";
import { useRef } from "react";

export class ImageCardUtil extends ShapeUtil<ImageCardShape> {
  static override type = "image-card" as const;

  getDefaultProps(): ImageCardShape["props"] {
    return {
      w: 500,
      h: 500,
      imageUrl: "",
      prompt: "",
      isLoading: true,
      timestamp: Date.now(),
    };
  }

  // 允许调整大小
  override canResize() {
    return true;
  }

  // 处理调整大小 - 保持宽高比，限制最小宽度
  override onResize(shape: ImageCardShape, info: TLResizeInfo<ImageCardShape>) {
    const resized = resizeBox(shape, info);
    // 限制最小宽度 300px
    if (resized.props.w < 300) {
      resized.props.w = 300;
    }
    // 限制最小高度 300px
    if (resized.props.h < 300) {
      resized.props.h = 300;
    }
    return resized;
  }

  getGeometry(shape: ImageCardShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  component(shape: ImageCardShape) {
    const { w, h, imageUrl, prompt, isLoading } = shape.props;
    const imgRef = useRef<HTMLImageElement>(null);
    const editor = useEditor();

    // 图片加载完成后自动调整卡片大小
    const handleImageLoaded = () => {
      if (!imgRef.current) return;

      const img = imgRef.current;
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

      console.log(`[图片卡片] 图片加载完成: ${imgWidth}x${imgHeight}`);

      if (imgWidth && imgHeight) {
        const headerHeight = 48;
        const maxWidth = 800;
        const aspectRatio = imgWidth / imgHeight;

        // 计算合适的宽度（不超过最大宽度）
        let newWidth = Math.min(imgWidth, maxWidth);
        let newHeight = newWidth / aspectRatio + headerHeight;

        console.log(`[图片卡片] 调整大小: ${newWidth}x${newHeight}`);

        editor.updateShapes([
          {
            id: shape.id,
            type: "image-card",
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
        <div className="w-full h-full rounded-2xl shadow-lg bg-white dark:bg-gray-800 border-2 border-purple-300 dark:border-purple-600 overflow-hidden flex flex-col">
          {/* 头部提示 */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/20">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {prompt || "图片生成"}
            </p>
          </div>

          {/* 图片内容区 */}
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
                <span className="text-sm">生成图片中...</span>
              </div>
            ) : imageUrl ? (
              <img
                ref={imgRef}
                src={imageUrl}
                alt={prompt}
                className="max-w-full max-h-full object-contain cursor-pointer"
                style={{
                  width: "100%",
                  height: "100%",
                }}
                onLoad={handleImageLoaded}
                onClick={() => {
                  console.log("图片URL:", imageUrl);
                  console.log("点击在新标签页查看原图");
                  window.open(imageUrl, '_blank');
                }}
                title="点击查看原图"
              />
            ) : (
              <div className="text-gray-400 text-sm">图片加载失败</div>
            )}
          </div>
        </div>
      </HTMLContainer>
    );
  }

  indicator(shape: ImageCardShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }

  // 导出为SVG（用于生成PNG）- 导出原始图片尺寸，无边距
  override async toSvg(shape: ImageCardShape) {
    const { imageUrl } = shape.props;

    // 如果没有图片或正在加载，返回占位符
    if (!imageUrl || shape.props.isLoading) {
      return <rect width={100} height={100} fill="#f3f4f6" />;
    }

    try {
      // 1. 加载图片获取原始尺寸
      const img = new Image();
      img.crossOrigin = "anonymous"; // 尝试解决跨域

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = imageUrl;
      });

      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;

      console.log(`[图片导出] 原始尺寸: ${originalWidth}x${originalHeight}`);

      // 2. 将图片转换为 base64
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      console.log("[图片导出] 图片已转换为 base64");

      // 3. 使用原始尺寸导出（无边距）
      return (
        <image
          href={base64}
          x="0"
          y="0"
          width={originalWidth}
          height={originalHeight}
        />
      );
    } catch (error) {
      console.error("[图片导出] 处理失败:", error);

      // 降级方案：使用卡片尺寸减去头部
      const headerHeight = 48;
      return (
        <image
          href={imageUrl}
          x="0"
          y="0"
          width={shape.props.w}
          height={shape.props.h - headerHeight}
        />
      );
    }
  }
}
