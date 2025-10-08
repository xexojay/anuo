// 这些类型将在运行 supabase gen types 后自动生成
// 现在使用手动定义的类型

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      boards: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          canvas_state: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          canvas_state?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          canvas_state?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      cards: {
        Row: {
          id: string;
          board_id: string;
          type: "search_result" | "note" | "cluster";
          content: Json;
          metadata: Json;
          embedding: number[] | null;
          position: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          board_id: string;
          type: "search_result" | "note" | "cluster";
          content: Json;
          metadata?: Json;
          embedding?: number[] | null;
          position: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          board_id?: string;
          type?: "search_result" | "note" | "cluster";
          content?: Json;
          metadata?: Json;
          embedding?: number[] | null;
          position?: Json;
          created_at?: string;
        };
      };
      connections: {
        Row: {
          id: string;
          board_id: string;
          from_card_id: string;
          to_card_id: string;
          type: "semantic" | "temporal" | "manual";
          strength: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          board_id: string;
          from_card_id: string;
          to_card_id: string;
          type: "semantic" | "temporal" | "manual";
          strength?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          board_id?: string;
          from_card_id?: string;
          to_card_id?: string;
          type?: "semantic" | "temporal" | "manual";
          strength?: number | null;
          created_at?: string;
        };
      };
    };
    Functions: {
      match_cards: {
        Args: {
          query_embedding: number[];
          match_threshold: number;
          match_count: number;
        };
        Returns: {
          id: string;
          content: Json;
          similarity: number;
        }[];
      };
    };
  };
}
