/**
 * 视频生成轮询工具
 * 用于在前端轮询视频生成任务状态
 */

import type { Editor } from "tldraw";

interface PollVideoOptions {
  editor: Editor;
  cardId: string;
  taskId: string;
  sourceUrl: string;
  maxAttempts?: number;
  interval?: number;
}

/**
 * 轮询视频生成状态
 */
export async function pollVideoStatus({
  editor,
  cardId,
  taskId,
  sourceUrl,
  maxAttempts = 60,
  interval = 3000,
}: PollVideoOptions) {
  let attempts = 0;

  console.log(`[视频轮询] 开始轮询，taskId: ${taskId}, sourceUrl: ${sourceUrl}`);

  const poll = async () => {
    attempts++;
    console.log(`[视频轮询] 第 ${attempts} 次尝试`);

    try {
      const response = await fetch(sourceUrl);
      console.log(`[视频轮询] 响应状态: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log(`[视频轮询] 响应数据:`, data);

        // 尝试提取视频URL - 支持多种可能的格式
        let videoUrl = null;
        let status = data.status;

        // 格式1: { status: "completed", output: { video_url: "..." } }
        if (data.output) {
          if (typeof data.output === "string") {
            videoUrl = data.output;
          } else if (data.output.video_url) {
            videoUrl = data.output.video_url;
          } else if (data.output.url) {
            videoUrl = data.output.url;
          } else if (data.output.video) {
            videoUrl = data.output.video;
          }
        }

        // 格式2: { video_url: "..." }
        videoUrl = videoUrl || data.video_url || data.url || data.video;

        // 格式3: { result: "..." }
        if (!videoUrl && data.result) {
          if (typeof data.result === "string") {
            videoUrl = data.result;
          } else if (data.result.video_url) {
            videoUrl = data.result.video_url;
          }
        }

        console.log(`[视频轮询] 解析结果 - status: ${status}, videoUrl: ${videoUrl}`);

        // 检查是否完成
        if (videoUrl && (status === "completed" || status === "success" || !status)) {
          console.log(`[视频轮询] ✅ 视频生成成功: ${videoUrl}`);
          editor.updateShapes([
            {
              id: cardId as any,
              type: "video-card",
              props: {
                videoUrl,
                isLoading: false,
              },
            },
          ]);
          return; // 完成，停止轮询
        }

        // 检查是否失败
        if (status === "failed" || status === "error") {
          console.log(`[视频轮询] ❌ 视频生成失败`);
          editor.updateShapes([
            {
              id: cardId as any,
              type: "video-card",
              props: {
                isLoading: false,
                progress: "视频生成失败",
              },
            },
          ]);
          return;
        }
      } else {
        console.log(`[视频轮询] ⚠️  HTTP 错误: ${response.status}`);
      }

      // 更新进度
      const shape = editor.getShape(cardId as any);
      if (shape) {
        editor.updateShapes([
          {
            id: cardId as any,
            type: "video-card",
            props: {
              ...shape.props,
              progress: `生成中... (${attempts}/${maxAttempts})`,
            },
          },
        ]);
      }

      // 继续轮询
      if (attempts < maxAttempts) {
        setTimeout(poll, interval);
      } else {
        console.log(`[视频轮询] ⏱️  超时，已达最大尝试次数`);
        const shape = editor.getShape(cardId as any);
        if (shape) {
          editor.updateShapes([
            {
              id: cardId as any,
              type: "video-card",
              props: {
                ...shape.props,
                isLoading: false,
                progress: "视频生成超时，请稍后查看",
              },
            },
          ]);
        }
      }
    } catch (error) {
      console.error(`[视频轮询] ❌ 错误:`, error);

      const shape = editor.getShape(cardId as any);
      if (shape) {
        editor.updateShapes([
          {
            id: cardId as any,
            type: "video-card",
            props: {
              ...shape.props,
              progress: `生成中... (${attempts}/${maxAttempts}) - 网络错误`,
            },
          },
        ]);
      }

      if (attempts < maxAttempts) {
        setTimeout(poll, interval);
      } else {
        const shape = editor.getShape(cardId as any);
        if (shape) {
          editor.updateShapes([
            {
              id: cardId as any,
              type: "video-card",
              props: {
                ...shape.props,
                isLoading: false,
                progress: "视频生成失败：网络错误",
              },
            },
          ]);
        }
      }
    }
  };

  // 开始第一次轮询
  setTimeout(poll, interval);
}
