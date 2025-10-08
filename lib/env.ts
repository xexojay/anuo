/**
 * 环境变量配置和验证
 */

export const env = {
  // Supabase
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  },

  // OpenAI
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
  },

  // 搜索APIs
  search: {
    serperKey: process.env.SERPER_API_KEY || "",
    twitterToken: process.env.TWITTER_BEARER_TOKEN || "",
  },

  // 特性开关
  features: {
    realSearch: !!(
      process.env.SERPER_API_KEY || process.env.TWITTER_BEARER_TOKEN
    ),
    realAI: !!process.env.OPENAI_API_KEY,
    supabaseEnabled: !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
  },
};

/**
 * 验证必需的环境变量
 * @param strict 是否严格模式（生产环境应为true）
 */
export function validateEnv(strict: boolean = false): {
  valid: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];

  // 检查Supabase（推荐但非必需）
  if (!env.supabase.url || !env.supabase.anonKey) {
    const msg = "Supabase未配置 - 数据持久化和实时协作功能将不可用";
    if (strict) {
      errors.push(msg);
    } else {
      warnings.push(msg);
    }
  }

  // 检查OpenAI（推荐但非必需）
  if (!env.openai.apiKey) {
    warnings.push("OpenAI API未配置 - 将使用mock数据进行演示");
  }

  // 检查搜索APIs（可选）
  if (!env.search.serperKey && !env.search.twitterToken) {
    warnings.push("搜索API未配置 - 将使用mock数据进行演示");
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  };
}

/**
 * 在开发环境打印配置状态
 */
export function printEnvStatus() {
  if (process.env.NODE_ENV !== "development") return;

  const { valid, warnings, errors } = validateEnv();

  console.log("\n📋 环境变量配置状态：\n");

  console.log("✅ 已配置的功能：");
  if (env.features.supabaseEnabled) {
    console.log("  - Supabase数据库");
  }
  if (env.features.realAI) {
    console.log("  - OpenAI API");
  }
  if (env.features.realSearch) {
    console.log("  - 真实搜索API");
  }

  if (warnings.length > 0) {
    console.log("\n⚠️  警告：");
    warnings.forEach((w) => console.log(`  - ${w}`));
  }

  if (errors.length > 0) {
    console.log("\n❌ 错误：");
    errors.forEach((e) => console.log(`  - ${e}`));
  }

  if (warnings.length === 0 && errors.length === 0) {
    console.log("\n✅ 所有功能都已配置！");
  } else {
    console.log("\n💡 提示：查看 .env.example 了解如何配置缺失的环境变量");
  }

  console.log("");
}

// 开发环境自动打印状态
if (typeof window === "undefined" && process.env.NODE_ENV === "development") {
  printEnvStatus();
}
