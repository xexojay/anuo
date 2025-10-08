"use client";

import { useState, useRef } from "react";
import { useEditorContext } from "@/components/canvas/EditorContext";
import { cardHelpers } from "@/components/canvas/helpers";

export default function ChatBar() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<string[]>([]); // 存储图片的 base64
  const { editor } = useEditorContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // 移除图片
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !editor) return;

    setIsLoading(true);
    setMessage("");

    try {
      // 调用AI API
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          images: images.length > 0 ? images : undefined,
        }),
      });

      const data = await response.json();

      // 显示AI响应
      setMessage(data.message);

      // 创建卡片
      if (data.results && data.results.length > 0) {
        let x = 100;
        let y = 100;

        data.results.forEach((result: any, index: number) => {
          if (result.type === "note") {
            // 创建笔记卡片
            cardHelpers.createNoteCard(editor, {
              content: result.content,
              x: x + index * 340,
              y,
            });
          } else if (result.title && result.snippet) {
            // 创建搜索结果卡片
            cardHelpers.createSearchResultCard(editor, {
              title: result.title,
              snippet: result.snippet,
              source: result.source || "google",
              url: result.url,
              x: x + index * 340,
              y,
            });
          }
        });

        // 自动缩放到查看所有卡片
        editor.zoomToFit({ animation: { duration: 400 } });
      }

      setInput("");
      setImages([]); // 清空图片
    } catch (error) {
      console.error("Error:", error);
      setMessage("发生错误，请重试");
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
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`上传图片 ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center gap-3 px-4 py-3">
            {/* @ 按钮 */}
            <button
              type="button"
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-lg font-medium"
              title="@提及"
            >
              @
            </button>

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
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="搜索Twitter、Google，或询问AI..."
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
