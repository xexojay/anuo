"use client";

import { DefaultMinimap } from "tldraw";

/**
 * 自定义Minimap组件
 * 固定在右下角，避免与其他UI冲突
 */
export function CustomMinimap() {
  return (
    <div className="absolute bottom-28 right-4 z-10">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-2 overflow-hidden">
        <DefaultMinimap />
      </div>
    </div>
  );
}
