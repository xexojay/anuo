"use client";

import { useEffect, useRef } from "react";
import { supabase } from "./client";
import type { RealtimeChannel } from "@supabase/supabase-js";

/**
 * 实时协作Hook
 * 监听指定board的所有变化
 */
export function useRealtimeBoard(
  boardId: string,
  onCardChange?: (payload: any) => void,
  onConnectionChange?: (payload: any) => void
) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!boardId || !supabase) return;

    // 创建realtime channel
    const channel = supabase.channel(`board:${boardId}`);

    // 监听cards表的变化
    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cards",
          filter: `board_id=eq.${boardId}`,
        },
        (payload) => {
          console.log("Card change:", payload);
          onCardChange?.(payload);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "connections",
          filter: `board_id=eq.${boardId}`,
        },
        (payload) => {
          console.log("Connection change:", payload);
          onConnectionChange?.(payload);
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    channelRef.current = channel;

    return () => {
      console.log("Unsubscribing from realtime channel");
      channel.unsubscribe();
    };
  }, [boardId, onCardChange, onConnectionChange]);

  return channelRef.current;
}

/**
 * 发送presence信息（用户在线状态、光标位置等）
 */
export function useBoardPresence(
  boardId: string,
  userId: string,
  userName: string
) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!boardId || !userId || !supabase) return;

    const channel = supabase.channel(`presence:${boardId}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    // 跟踪presence
    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        console.log("Presence state:", state);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("User joined:", key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("User left:", key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            user_id: userId,
            user_name: userName,
            online_at: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
    };
  }, [boardId, userId, userName]);

  return {
    channel: channelRef.current,
    updatePresence: async (data: any) => {
      if (channelRef.current) {
        await channelRef.current.track(data);
      }
    },
  };
}

/**
 * 广播消息给其他用户
 */
export async function broadcastMessage(
  channel: RealtimeChannel,
  event: string,
  payload: any
) {
  if (!channel) return;

  await channel.send({
    type: "broadcast",
    event,
    payload,
  });
}
