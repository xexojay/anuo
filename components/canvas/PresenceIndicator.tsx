"use client";

import { useState, useEffect } from "react";
import { useBoardPresence } from "@/lib/supabase/realtime";
import { isSupabaseConfigured } from "@/lib/supabase/client";

interface PresenceIndicatorProps {
  boardId: string;
}

export default function PresenceIndicator({ boardId }: PresenceIndicatorProps) {
  // 如果Supabase未配置，不渲染组件
  if (!isSupabaseConfigured) {
    return null;
  }

  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

  // 模拟用户ID和名称（实际应该从认证系统获取）
  const userId = "demo-user-" + Math.random().toString(36).substr(2, 9);
  const userName = "访客 " + userId.substr(-4);

  const { channel } = useBoardPresence(boardId, userId, userName);

  useEffect(() => {
    if (!channel) return;

    // 监听presence变化
    const handlePresenceSync = () => {
      const state = channel.presenceState();
      const users = Object.values(state).flat();
      setOnlineUsers(users);
    };

    channel.on("presence", { event: "sync" }, handlePresenceSync);
    channel.on("presence", { event: "join" }, handlePresenceSync);
    channel.on("presence", { event: "leave" }, handlePresenceSync);

    return () => {
      channel.unsubscribe();
    };
  }, [channel]);

  if (onlineUsers.length === 0) return null;

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex -space-x-3">
          {onlineUsers.slice(0, 5).map((user: any, idx) => (
            <div
              key={user.user_id || idx}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold ring-3 ring-white dark:ring-gray-800 shadow-lg hover:scale-110 transition-transform cursor-pointer"
              title={user.user_name || "未知用户"}
            >
              {(user.user_name || "?").charAt(0).toUpperCase()}
            </div>
          ))}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {onlineUsers.length} 在线
          </p>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              实时协作
            </span>
          </div>
        </div>
      </div>

      {/* 用户列表 - 可折叠 */}
      {onlineUsers.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50 space-y-1.5">
          {onlineUsers.map((user: any, idx) => (
            <div
              key={user.user_id || idx}
              className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="font-medium">{user.user_name || "未知用户"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
