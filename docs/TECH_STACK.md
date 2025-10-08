# 技术栈文档

## 📚 完整技术栈清单

### 核心框架

| 技术 | 版本 | 用途 | 文档 |
|------|------|------|------|
| Next.js | 15.5.4 | React框架 | [nextjs.org](https://nextjs.org) |
| React | 19.2.0 | UI库 | [react.dev](https://react.dev) |
| TypeScript | 5.9.3 | 类型系统 | [typescriptlang.org](https://typescriptlang.org) |

### 样式系统

| 技术 | 版本 | 用途 |
|------|------|------|
| Tailwind CSS | 3.4.18 | 样式框架 |
| PostCSS | 8.5.6 | CSS处理 |
| Autoprefixer | 10.4.21 | 浏览器兼容 |

### 无限画布

| 技术 | 版本 | 用途 |
|------|------|------|
| tldraw | 4.0.3 | 无限画布SDK |

**tldraw子包**:
- `@tldraw/editor` - 核心编辑器
- `@tldraw/state` - 状态管理
- `@tldraw/store` - 数据存储
- `@tldraw/utils` - 工具函数

### 后端服务

| 技术 | 版本 | 用途 |
|------|------|------|
| Supabase | 2.74.0 | 后端平台 |
| PostgreSQL | - | 数据库 |
| pgvector | - | 向量扩展 |

### AI/ML

| 技术 | 版本 | 用途 |
|------|------|------|
| OpenAI | 6.2.0 | AI能力 |
| Vercel AI SDK | 5.0.60 | AI流式响应 |

**使用的模型**:
- GPT-4o-mini - 对话和意图识别
- text-embedding-3-small - 文本向量化（1536维）

### 状态管理

| 技术 | 版本 | 用途 |
|------|------|------|
| Zustand | 5.0.8 | 轻量状态管理 |
| React Context | - | Editor共享 |

---

## 🏗️ 项目架构

### 目录结构

```
research-canvas/
├── app/                          # Next.js App Router
│   ├── api/                      # API端点
│   │   ├── ai/
│   │   │   ├── chat/            # AI对话
│   │   │   └── relate/          # 关联分析
│   │   └── vector/
│   │       ├── embed/           # 向量生成
│   │       └── search/          # 向量搜索
│   ├── board/[id]/              # 白板页面
│   ├── globals.css              # 全局样式
│   ├── layout.tsx               # 根布局
│   └── page.tsx                 # 首页
├── components/
│   ├── canvas/                  # 画布相关
│   │   ├── shapes/             # 自定义Shapes
│   │   │   ├── SearchResultCardUtil.tsx
│   │   │   ├── NoteCardUtil.tsx
│   │   │   ├── ClusterCardUtil.tsx
│   │   │   ├── types.ts
│   │   │   ├── index.ts
│   │   │   └── README.md
│   │   ├── CanvasBoard.tsx     # tldraw包装器
│   │   ├── EditorContext.tsx   # Editor上下文
│   │   ├── CustomMinimap.tsx   # 自定义小地图
│   │   └── helpers.ts          # 工具函数
│   ├── chat/
│   │   └── ChatBar.tsx         # 输入组件
│   └── ui/
│       ├── LeftSidebar.tsx     # 工具栏
│       └── RightPanel.tsx      # 详情面板（已移除）
├── lib/                         # 工具库
│   ├── ai/
│   │   └── openai.ts           # OpenAI集成
│   ├── search/
│   │   ├── index.ts            # 统一接口
│   │   ├── types.ts            # 类型定义
│   │   └── mock.ts             # Mock数据
│   ├── supabase/
│   │   ├── client.ts           # 客户端
│   │   ├── database.types.ts   # 数据库类型
│   │   ├── hooks.ts            # React Hooks
│   │   └── realtime.ts         # 实时功能
│   ├── vector/
│   │   └── operations.ts       # 向量操作
│   └── env.ts                  # 环境变量
├── supabase/
│   ├── migrations/             # 数据库迁移
│   │   └── 20250101000000_initial_schema.sql
│   └── README.md
├── docs/                        # 产品文档
│   ├── PRD.md                  # 需求文档
│   └── TECH_STACK.md           # 技术栈（本文档）
├── public/                      # 静态资源
├── .env.example                 # 环境变量模板
├── next.config.ts               # Next.js配置
├── tailwind.config.ts           # Tailwind配置
├── tsconfig.json                # TS配置
└── package.json                 # 依赖管理
```

---

## 🔧 配置文件说明

### next.config.ts

```typescript
const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['tldraw'],  // 转译tldraw包
  webpack: (config) => {
    config.externals.push({ canvas: "canvas" });
    return config;
  },
};
```

**关键配置**:
- `transpilePackages` - 解决tldraw重复导入
- `webpack.externals` - canvas外部化

### tailwind.config.ts

```typescript
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## 🌐 第三方服务集成

### OpenAI API

**用途**:
- 对话和意图识别（GPT-4o-mini）
- 文本向量化（text-embedding-3-small）

**API端点**:
- `https://api.openai.com/v1/chat/completions`
- `https://api.openai.com/v1/embeddings`

**费用**: 按使用量计费

### Serper API (Google搜索)

**用途**: 获取Google搜索结果

**API端点**:
- `https://api.serper.dev/search`

**费用**: 免费额度 + 付费套餐

### Twitter API v2

**用途**: 搜索Twitter内容

**API端点**:
- `https://api.twitter.com/2/tweets/search/recent`

**费用**: 免费额度有限

### Supabase

**用途**:
- PostgreSQL数据库
- pgvector向量搜索
- Realtime实时同步
- Auth用户认证（预留）
- Storage文件存储（预留）

**费用**: 免费额度 + Pro套餐

---

## 📦 NPM依赖清单

### 生产依赖

```json
{
  "@supabase/supabase-js": "^2.74.0",
  "ai": "^5.0.60",
  "next": "^15.5.4",
  "openai": "^6.2.0",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "tldraw": "^4.0.3",
  "zustand": "^5.0.8"
}
```

### 开发依赖

```json
{
  "@types/node": "^24.7.0",
  "@types/react": "^19.2.2",
  "@types/react-dom": "^19.2.1",
  "autoprefixer": "^10.4.21",
  "postcss": "^8.5.6",
  "tailwindcss": "^3.4.18",
  "typescript": "^5.9.3"
}
```

---

## 🔍 技术选型理由

### 为什么选择Next.js 15？

- ✅ App Router - 现代化路由系统
- ✅ Server Components - 性能优化
- ✅ API Routes - 全栈能力
- ✅ Edge Runtime - 低延迟
- ✅ Vercel部署 - 一键部署

### 为什么选择tldraw？

- ✅ 开源免费（MIT协议）
- ✅ 强大的自定义能力
- ✅ 高性能渲染
- ✅ React集成友好
- ✅ 活跃的社区

### 为什么选择Supabase？

- ✅ 开源（vs Firebase）
- ✅ PostgreSQL（标准SQL）
- ✅ pgvector支持（向量搜索）
- ✅ Realtime开箱即用
- ✅ 免费额度充足

### 为什么选择Tailwind CSS？

- ✅ 快速开发
- ✅ 工具类优先
- ✅ 响应式设计
- ✅ 深色模式
- ✅ 与Next.js完美集成

---

## ⚡ 性能优化

### 前端优化

- ✅ 代码分割（自动）
- ✅ 路由预加载
- ✅ 图片优化（Next.js Image）
- ✅ CSS按需加载（Tailwind）

### 后端优化

- ✅ Edge Runtime（低延迟）
- ✅ 数据库索引（boards, cards）
- ✅ 向量索引（IVFFlat）
- ✅ API缓存（可选）

### 渲染优化

- ✅ React 19并发特性
- ✅ tldraw WebGL渲染
- ✅ 虚拟滚动（tldraw内置）

---

## 🧪 测试策略（未来）

### 单元测试
- Jest + React Testing Library
- 组件测试
- 工具函数测试

### 集成测试
- API端点测试
- 数据库操作测试

### E2E测试
- Playwright
- 关键用户流程

---

## 🚀 部署架构

### 推荐部署方案

**前端**: Vercel
- 自动CI/CD
- 全球CDN
- Edge Network
- 零配置

**数据库**: Supabase
- 托管PostgreSQL
- 自动备份
- 全球分布

**监控**:
- Vercel Analytics
- Sentry（错误追踪）
- Supabase Dashboard

---

## 🔄 开发工作流

### 本地开发

```bash
npm install          # 安装依赖
npm run dev          # 启动开发服务器
```

### 构建和测试

```bash
npm run build        # 生产构建
npm start            # 启动生产服务器
npm run lint         # 代码检查
```

### Git工作流

```
main ← production
  ↑
develop ← 开发分支
  ↑
feature/* ← 功能分支
```

---

## 📖 学习资源

### Next.js
- [官方文档](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

### tldraw
- [官方文档](https://tldraw.dev)
- [示例代码](https://examples.tldraw.com)
- [GitHub仓库](https://github.com/tldraw/tldraw)

### Supabase
- [官方文档](https://supabase.com/docs)
- [JavaScript客户端](https://supabase.com/docs/reference/javascript)

### Tailwind CSS
- [官方文档](https://tailwindcss.com/docs)
- [UI组件库](https://tailwindui.com)

---

**更新时间**: 2025-01-08
**维护者**: 开发团队
