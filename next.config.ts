import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next.js 15推荐：转译tldraw包以避免重复导入
  transpilePackages: ['tldraw'],
  webpack: (config) => {
    // tldraw需要处理canvas相关的配置
    config.externals.push({
      canvas: "canvas",
    });

    return config;
  },
};

export default nextConfig;
