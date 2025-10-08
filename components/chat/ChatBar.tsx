"use client";

import { useState } from "react";
import { useEditorContext } from "@/components/canvas/EditorContext";
import { cardHelpers } from "@/components/canvas/helpers";

export default function ChatBar() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { editor } = useEditorContext();

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
        body: JSON.stringify({ message: input }),
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
