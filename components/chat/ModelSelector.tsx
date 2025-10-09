"use client";

import { useState, useRef, useEffect } from "react";
import { MODELS, ModelConfig } from "@/lib/ai/models";

interface ModelSelectorProps {
  selectedModel: ModelConfig;
  onModelChange: (model: ModelConfig) => void;
}

export default function ModelSelector({
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleModelSelect = (model: ModelConfig) => {
    onModelChange(model);
    setIsOpen(false);
  };

  // 根据模型类型显示图标
  const getModelIcon = (type: string) => {
    switch (type) {
      case "image":
        return "🎨";
      case "video":
        return "🎬";
      default:
        return "💬";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* @ 按钮 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-lg font-medium"
        title="切换模型"
      >
        @
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              选择模型
            </p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {MODELS.map((model) => (
              <button
                key={model.id}
                type="button"
                onClick={() => handleModelSelect(model)}
                className={`w-full px-3 py-2.5 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  selectedModel.id === model.id
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : ""
                }`}
              >
                <span className="text-lg mt-0.5 flex-shrink-0">
                  {getModelIcon(model.type)}
                </span>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {model.name}
                    </p>
                    {selectedModel.id === model.id && (
                      <svg
                        className="w-4 h-4 text-blue-600 dark:text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {model.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
