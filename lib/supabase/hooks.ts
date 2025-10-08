"use client";

import { useEffect, useState } from "react";
import { supabase } from "./client";
import type { Database } from "./database.types";

type Board = Database["public"]["Tables"]["boards"]["Row"];
type Card = Database["public"]["Tables"]["cards"]["Row"];

// 获取白板数据的 Hook
export function useBoard(boardId: string) {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchBoard() {
      try {
        if (!supabase) return;
        const { data, error } = await (supabase as any)
          .from("boards")
          .select("*")
          .eq("id", boardId)
          .single();

        if (error) throw error;
        setBoard(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchBoard();
  }, [boardId]);

  return { board, loading, error };
}

// 获取白板上所有卡片的 Hook
export function useCards(boardId: string) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCards() {
      try {
        if (!supabase) return;
        const { data, error } = await (supabase as any)
          .from("cards")
          .select("*")
          .eq("board_id", boardId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setCards(data || []);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchCards();

    // 订阅实时更新
    if (!supabase) return;

    const channel = supabase
      .channel(`cards:${boardId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cards",
          filter: `board_id=eq.${boardId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setCards((prev) => [...prev, payload.new as Card]);
          } else if (payload.eventType === "UPDATE") {
            setCards((prev) =>
              prev.map((card) =>
                card.id === payload.new.id ? (payload.new as Card) : card
              )
            );
          } else if (payload.eventType === "DELETE") {
            setCards((prev) =>
              prev.filter((card) => card.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [boardId]);

  return { cards, loading, error };
}

// 保存白板状态
export async function saveCanvasState(boardId: string, canvasState: any) {
  if (!supabase) return;
  const { error } = await (supabase as any)
    .from("boards")
    .update({ canvas_state: canvasState })
    .eq("id", boardId);

  if (error) throw error;
}

// 创建新卡片
export async function createCard(cardData: {
  board_id: string;
  type: "search_result" | "note" | "cluster";
  content: any;
  position: { x: number; y: number };
  metadata?: any;
}) {
  if (!supabase) return;
  const { data, error } = await (supabase as any)
    .from("cards")
    .insert(cardData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 更新卡片
export async function updateCard(cardId: string, updates: Partial<Card>) {
  const { error } = await (supabase as any)
    .from("cards")
    .update(updates)
    .eq("id", cardId);

  if (error) throw error;
}

// 删除卡片
export async function deleteCard(cardId: string) {
  if (!supabase) return;
  const { error } = await (supabase as any).from("cards").delete().eq("id", cardId);

  if (error) throw error;
}
