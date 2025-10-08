"use client";

import { useState } from "react";

interface SidebarButtonProps {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarButton({ icon, label, active, onClick }: SidebarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-12 h-12 flex items-center justify-center rounded-lg
        transition-all duration-200 group relative
        ${
          active
            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        }
      `}
      title={label}
    >
      <span className="text-xl">{icon}</span>

      {/* Tooltip */}
      <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
        {label}
      </div>
    </button>
  );
}

export default function LeftSidebar() {
  const [activeTool, setActiveTool] = useState("canvas");

  return (
    <div className="w-16 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-4 gap-2">
      {/* Logo */}
      <div className="w-12 h-12 flex items-center justify-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
          R
        </div>
      </div>

      {/* Divider */}
      <div className="w-10 h-px bg-gray-200 dark:bg-gray-700 mb-2"></div>

      {/* Tools */}
      <SidebarButton
        icon="👆"
        label="选择"
        active={activeTool === "select"}
        onClick={() => setActiveTool("select")}
      />

      <SidebarButton
        icon="🎨"
        label="画布"
        active={activeTool === "canvas"}
        onClick={() => setActiveTool("canvas")}
      />

      <SidebarButton
        icon="🔍"
        label="搜索"
        active={activeTool === "search"}
        onClick={() => setActiveTool("search")}
      />

      <SidebarButton
        icon="📝"
        label="笔记"
        active={activeTool === "note"}
        onClick={() => setActiveTool("note")}
      />

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Bottom tools */}
      <SidebarButton
        icon="⚙️"
        label="设置"
        active={activeTool === "settings"}
        onClick={() => setActiveTool("settings")}
      />

      <SidebarButton
        icon="❓"
        label="帮助"
        active={activeTool === "help"}
        onClick={() => setActiveTool("help")}
      />
    </div>
  );
}
