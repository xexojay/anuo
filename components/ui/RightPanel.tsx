"use client";

import { useState } from "react";
import { useEditorContext } from "@/components/canvas/EditorContext";

export default function RightPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const { editor } = useEditorContext();

  // 监听选择变化（简化版）
  // TODO: 添加editor的onSelectionChange监听

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-l-lg px-2 py-4 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors z-40"
      >
        <span className="text-gray-600 dark:text-gray-400">◀</span>
      </button>
    );
  }

  return (
    <div className="w-96 h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">
          详情
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          ▶
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedCard ? (
          <div className="space-y-4">
            {/* 卡片信息 */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                类型
              </h3>
              <p className="text-base text-gray-900 dark:text-gray-100">
                {selectedCard.type === "search-result-card"
                  ? "搜索结果"
                  : selectedCard.type === "note-card"
                  ? "笔记"
                  : "聚类"}
              </p>
            </div>

            {/* 具体内容根据卡片类型显示 */}
            {selectedCard.type === "search-result-card" && (
              <>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    标题
                  </h3>
                  <p className="text-base text-gray-900 dark:text-gray-100">
                    {selectedCard.props.title}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    摘要
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedCard.props.snippet}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    来源
                  </h3>
                  <a
                    href={selectedCard.props.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline break-all"
                  >
                    {selectedCard.props.url}
                  </a>
                </div>
              </>
            )}

            {/* 操作按钮 */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                编辑卡片
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm font-medium transition-colors">
                查找相关
              </button>
              <button className="w-full px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors">
                删除
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">📋</span>
            </div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              未选择卡片
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              点击画布上的任意卡片查看详细信息
            </p>
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              0
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              卡片总数
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              0
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              关联数
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
