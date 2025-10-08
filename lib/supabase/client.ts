import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// 只有在环境变量存在时才创建客户端
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey)
    : null;

// 检查Supabase是否已配置
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// 创建服务端客户端（用于Server Components和API Routes）
export function createServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase环境变量未配置");
  }
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}
