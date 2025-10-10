"use client";

import { useState, useRef, useEffect } from "react";
import { useEditorContext } from "@/components/canvas/EditorContext";
import { cardHelpers } from "@/components/canvas/helpers";
import ModelSelector from "./ModelSelector";
import { getDefaultModel, ModelConfig } from "@/lib/ai/models";
import { pollVideoStatus } from "@/lib/video-polling";
import type { SelectedCardReference, ConversationCardShape, ImageCardShape, VideoCardShape } from "@/components/canvas/shapes/types";

type ImageSource = {
  id: string; // 唯一标识：upload-{index} 或 shape-{shapeId}
  data: string; // base64 数据
  type: "upload" | "selected"; // 来源类型
};

// 压缩图片函数
async function compressImage(base64: string, maxWidth: number = 800, quality: number = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // 如果图片宽度小于最大宽度，直接返回
      if (img.width <= maxWidth) {
        resolve(base64);
        return;
      }

      // 计算新的尺寸
      const ratio = maxWidth / img.width;
      const newWidth = maxWidth;
      const newHeight = img.height * ratio;

      // 创建 canvas 进行压缩
      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('无法获取 canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // 转换为 base64
      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };
    img.onerror = reject;
    img.src = base64;
  });
}

export default function ChatBar() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<ImageSource[]>([]); // 统一管理上传和选中的图片
  const [selectedCards, setSelectedCards] = useState<SelectedCardReference[]>([]); // 选中的卡片
  const [selectedModel, setSelectedModel] = useState<ModelConfig>(getDefaultModel());
  const { editor } = useEditorContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 处理模型切换
  const handleModelChange = (model: ModelConfig) => {
    setSelectedModel(model);
    // 在输入框插入 @模型名称
    setInput(`@${model.name} `);
    // 自动聚焦到输入框
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(async (file, index) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const imageId = `upload-${Date.now()}-${index}`;
          const originalBase64 = event.target!.result as string;

          // 压缩图片
          try {
            const compressedBase64 = await compressImage(originalBase64);
            setImages((prev) => [
              ...prev,
              {
                id: imageId,
                data: compressedBase64,
                type: "upload",
              },
            ]);
          } catch (error) {
            console.error("图片压缩失败，使用原图:", error);
            setImages((prev) => [
              ...prev,
              {
                id: imageId,
                data: originalBase64,
                type: "upload",
              },
            ]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // 移除图片
  const removeImage = (imageId: string, imageType: "upload" | "selected") => {
    if (imageType === "upload") {
      // 移除上传的图片
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } else {
      // 移除选中的图片：取消编辑器中的选中
      const shapeId = imageId.replace("shape-", "");
      if (editor) {
        const currentSelection = editor.getSelectedShapeIds();
        editor.setSelectedShapes(currentSelection.filter((id) => id !== shapeId));
      }
    }
  };

  // 监听 editor 选中状态变化，获取选中的卡片和图片
  useEffect(() => {
    if (!editor) return;

    const updateSelectedCards = async () => {
      const selectedShapes = editor.getSelectedShapes();
      const cards: SelectedCardReference[] = [];
      const selectedImageIds: string[] = [];

      for (const shape of selectedShapes) {
        if (shape.type === "conversation-card") {
          const card = shape as ConversationCardShape;
          cards.push({
            id: card.id,
            type: "conversation",
            title: card.props.userMessage.slice(0, 30) + (card.props.userMessage.length > 30 ? "..." : ""),
            content: card.props.aiResponse.slice(0, 50) + (card.props.aiResponse.length > 50 ? "..." : ""),
          });
        } else if (shape.type === "image-card") {
          const card = shape as ImageCardShape;
          cards.push({
            id: card.id,
            type: "image",
            title: card.props.prompt || "图片",
            imageUrl: card.props.imageUrl,
            prompt: card.props.prompt,
          });

          // 同时将图片 URL 添加到 images 数组（发送时再处理）
          if (card.props.imageUrl && !card.props.isLoading) {
            const imageId = `shape-${card.id}`;
            selectedImageIds.push(imageId);

            // 直接存储 URL，不进行异步处理
            setImages((prev) => {
              const exists = prev.some((img) => img.id === imageId);
              if (!exists) {
                return [
                  ...prev,
                  {
                    id: imageId,
                    data: card.props.imageUrl,  // 直接存储 URL
                    type: "selected",
                  },
                ];
              }
              return prev;
            });
          }
        } else if (shape.type === "video-card") {
          const card = shape as VideoCardShape;
          cards.push({
            id: card.id,
            type: "video",
            title: card.props.prompt || "视频",
            videoUrl: card.props.videoUrl,
            prompt: card.props.prompt,
          });
        } else if (shape.type === "image") {
          // 处理 tldraw 原生图片
          const imageShape = shape as any;
          const assetId = imageShape.props?.assetId;
          if (assetId) {
            const asset = editor.getAsset(assetId);

            if (asset && asset.type === "image") {
              const imageId = `shape-${shape.id}`;
              selectedImageIds.push(imageId);

              // 使用 resolveAssetUrl 获取实际的图片 URL
              let imageData: string | null = null;

              try {
                // 解析 asset URL
                const assetUrl = await editor.resolveAssetUrl(assetId, {
                  shouldResolveToOriginal: true
                });

                if (assetUrl) {
                  // 如果是 blob URL，转换为 base64
                  if (assetUrl.startsWith("blob:")) {
                    const response = await fetch(assetUrl);
                    const blob = await response.blob();
                    imageData = await new Promise<string>((resolve) => {
                      const reader = new FileReader();
                      reader.onloadend = () => resolve(reader.result as string);
                      reader.readAsDataURL(blob);
                    });
                  }
                  // 如果已经是 data URL (base64)，直接使用
                  else if (assetUrl.startsWith("data:")) {
                    imageData = assetUrl;
                  }
                  // 如果是 HTTP URL，需要 fetch 并转换
                  else if (assetUrl.startsWith("http")) {
                    const response = await fetch(assetUrl);
                    const blob = await response.blob();
                    imageData = await new Promise<string>((resolve) => {
                      const reader = new FileReader();
                      reader.onloadend = () => resolve(reader.result as string);
                      reader.readAsDataURL(blob);
                    });
                  }
                }
              } catch (error) {
                console.error("resolveAssetUrl 失败:", error);
              }

              // 确保有有效的图片数据，直接存储（发送时再压缩）
              if (imageData) {
                setImages((prev) => {
                  const exists = prev.some((img) => img.id === imageId);
                  if (!exists) {
                    return [
                      ...prev,
                      {
                        id: imageId,
                        data: imageData,  // 直接存储，不压缩
                        type: "selected",
                      },
                    ];
                  }
                  return prev;
                });
              }
            }
          }
        }
      }

      // 移除不再选中的图片
      setImages((prev) => {
        return prev.filter((img) => {
          if (img.type === "selected") {
            return selectedImageIds.includes(img.id);
          }
          return true; // 保留上传的图片
        });
      });

      setSelectedCards(cards);
    };

    // 初始更新
    updateSelectedCards();

    // 监听选中状态变化
    const unsubscribe = editor.store.listen(() => {
      updateSelectedCards();
    });

    return () => {
      unsubscribe();
    };
  }, [editor]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !editor) return;

    // 提取实际消息内容（移除 @模型名称 前缀）
    let userMessage = input;
    const modelPrefix = `@${selectedModel.name} `;
    if (userMessage.startsWith(modelPrefix)) {
      userMessage = userMessage.slice(modelPrefix.length);
    }

    // 如果移除前缀后没有内容，不提交
    if (!userMessage.trim()) return;

    const userSelectedCards = selectedCards;
    const hasImages = images.length > 0;

    setIsLoading(true);
    setMessage("");
    setInput("");
    // 只清除上传的图片，保留选中的图片
    setImages((prev) => prev.filter((img) => img.type === "selected"));
    // 不清除 selectedCards，保持选中状态由 editor 管理

    // 立即创建对话卡片
    const cardId = cardHelpers.createConversationCard(editor, {
      userMessage,
      isLoading: true,
      modelName: selectedModel.name,
      x: 100,
      y: 100,
    });

    // 选中并聚焦到卡片
    editor.select(cardId);
    editor.zoomToSelection({ animation: { duration: 400 } });

    try {
      let userImages: string[] = [];

      // 如果有图片，先压缩
      if (hasImages) {
        // 更新卡片显示"正在压缩图片..."
        cardHelpers.updateConversationCard(editor, cardId, "正在压缩图片...", true);

        // 压缩所有图片
        userImages = await Promise.all(
          images.map(async (img) => {
            try {
              // 如果是 URL，先转换为 base64
              let base64Data = img.data;
              if (img.data.startsWith("http")) {
                const response = await fetch(img.data);
                const blob = await response.blob();
                base64Data = await new Promise<string>((resolve) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve(reader.result as string);
                  reader.readAsDataURL(blob);
                });
              }
              // 压缩图片
              return await compressImage(base64Data);
            } catch (error) {
              console.error("压缩图片失败:", error);
              return img.data;  // 失败则使用原图
            }
          })
        );

        // 更新卡片显示"生成中..."
        cardHelpers.updateConversationCard(editor, cardId, "", true);
      }

      // 调用AI API
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          images: userImages.length > 0 ? userImages : undefined,
          selectedCards: userSelectedCards.length > 0 ? userSelectedCards : undefined,
          model: selectedModel.model,
          baseUrl: selectedModel.baseUrl,
          modelType: selectedModel.type,
        }),
      });

      // 先检查响应状态，再解析 JSON
      if (!response.ok) {
        let errorMsg = "请求失败";
        try {
          const data = await response.json();
          errorMsg = data.error || errorMsg;
        } catch (parseError) {
          // JSON 解析失败，使用默认错误消息
          console.error("Failed to parse error response:", parseError);
        }
        setMessage(errorMsg);
        cardHelpers.updateConversationCard(editor, cardId, errorMsg, false);
        editor.select(cardId);
        editor.zoomToSelection({ animation: { duration: 400 } });
        return;
      }

      // 解析成功响应
      const data = await response.json();

      // 处理API逻辑错误
      if (data.error) {
        const errorMsg = data.error;
        setMessage(errorMsg);
        cardHelpers.updateConversationCard(editor, cardId, errorMsg, false);
        editor.select(cardId);
        editor.zoomToSelection({ animation: { duration: 400 } });
        return;
      }

      // 处理图片生成
      if (data.intent === "image_generation" && data.results?.[0]) {
        // 删除对话卡片
        editor.deleteShape(cardId as any);

        // 创建图片卡片
        const result = data.results[0];
        const imageCardId = cardHelpers.createImageCard(editor, {
          imageUrl: result.imageUrl,
          prompt: result.prompt,
          isLoading: false,
          x: 100,
          y: 100,
        });

        editor.select(imageCardId);
        editor.zoomToSelection({ animation: { duration: 400 } });
      }
      // 处理视频生成
      else if (data.intent === "video_generation" && data.results?.[0]) {
        // 删除对话卡片
        editor.deleteShape(cardId as any);

        // 创建视频卡片
        const result = data.results[0];
        const videoCardId = cardHelpers.createVideoCard(editor, {
          prompt: result.prompt,
          isLoading: true,
          taskId: result.taskId,
          progress: "提交视频生成任务...",
          x: 100,
          y: 100,
        });

        // 开始轮询视频状态
        pollVideoStatus({
          editor,
          cardId: videoCardId,
          taskId: result.taskId,
          sourceUrl: result.sourceUrl,
        });

        editor.select(videoCardId);
        editor.zoomToSelection({ animation: { duration: 400 } });
      }
      // AI对话或图片识别 - 更新对话卡片
      else {
        const aiResponse = data.results?.[0]?.content || data.message || "无响应";
        const references = data.references || [];
        cardHelpers.updateConversationCard(editor, cardId, aiResponse, false, references);
        editor.select(cardId);
        editor.zoomToSelection({ animation: { duration: 400 } });
      }

      setMessage(data.message);
    } catch (error) {
      console.error("Error:", error);
      setMessage("发生错误，请重试");
      // 更新卡片显示错误
      cardHelpers.updateConversationCard(
        editor,
        cardId,
        "抱歉，发生了错误，请重试。",
        false
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[580px] z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        {/* 图片预览 */}
        {images.length > 0 && (
          <div className="px-4 pt-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-2 flex-wrap">
              {images.map((img) => (
                <div key={img.id} className="relative group">
                  <img
                    src={img.data}
                    alt={img.type === "upload" ? "上传图片" : "选中图片"}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(img.id, img.type)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  {/* 选中图片的标记 */}
                  {img.type === "selected" && (
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-[10px] text-center py-0.5">
                      选中
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 选中卡片显示 - 简洁版 */}
        {selectedCards.length > 0 && (
          <div className="px-4 pt-2 pb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span>📎 已选中:</span>
              <span className="flex-1 truncate">
                {selectedCards.map((card) => card.title).join(", ")}
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                {selectedCards.length} 个
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center gap-3 px-4 py-3">
            {/* 模型选择器 */}
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={handleModelChange}
            />

            {/* 图片上传按钮 */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="上传图片"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* 输入框 */}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="询问AI..."
              className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 text-sm focus:outline-none disabled:opacity-50 placeholder:text-gray-400"
              disabled={isLoading}
            />

            {/* 右侧按钮组 */}
            <div className="flex items-center gap-2">
              {/* Library Based 切换 */}
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400">
                <span>Library Based</span>
                <label className="relative inline-block w-8 h-4">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-600 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
                  <div className="absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform peer-checked:translate-x-4"></div>
                </label>
              </div>

              {/* 发送按钮 */}
              <button
                type="submit"
                disabled={isLoading || !input.trim() || !editor}
                className="w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:opacity-50 rounded-lg flex items-center justify-center transition-colors"
              >
                {isLoading ? (
                  <span className="animate-spin text-gray-600 dark:text-gray-300">⟳</span>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-300">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 16 16 12 12 8"></polyline>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
