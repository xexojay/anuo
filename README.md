# Research Canvas

一个基于AI的研究助手工具，帮助你高效地搜索、组织和关联研究信息。

## 特性

- 🎨 **无限画布** - 基于 tldraw 的交互式白板
- 🤖 **AI 驱动** - 智能搜索和内容分析
- 🔍 **多源搜索** - 支持 Google、Twitter 等多个搜索源
- 🧠 **智能关联** - 使用向量搜索发现信息间的联系
- 🔄 **实时协作** - 多用户同时编辑（即将推出）

## 技术栈

- **前端**: Next.js 15 + TypeScript + React 19
- **白板**: tldraw 4.0
- **样式**: Tailwind CSS 4
- **后端**: Supabase (PostgreSQL + pgvector)
- **AI**: OpenAI API
- **搜索**: Serper API, Twitter API v2

## 🚀 快速开始

> **✨ Demo已就绪！** 无需任何API密钥即可体验完整功能！

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 体验Demo

访问 [http://localhost:3000](http://localhost:3000)

**立即尝试：**
- 输入 `搜索 AI` - 看到AI相关搜索结果卡片
- 输入 `tldraw` - 自动搜索tldraw相关内容
- 输入 `research` - 获取研究工具推荐

📖 查看 [QUICKSTART.md](./QUICKSTART.md) 了解更多示例

### 4. 配置真实API（可选）

如果你想使用真实的API服务：

```bash
cp .env.example .env
# 编辑 .env 文件添加你的API密钥
```

## 项目结构

```
research-canvas/
├── app/                      # Next.js App Router
│   ├── api/                 # API 路由
│   │   ├── ai/             # AI 对话端点
│   │   ├── search/         # 搜索服务
│   │   └── vector/         # 向量操作
│   ├── board/[id]/         # 白板页面
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 根布局
│   └── page.tsx            # 主页
├── components/
│   ├── canvas/             # tldraw 相关组件
│   │   ├── shapes/        # 自定义 Shapes
│   │   └── CanvasBoard.tsx
│   ├── chat/              # 聊天组件
│   │   └── ChatBar.tsx
│   └── ui/                # UI 组件库
├── lib/                    # 工具库
│   ├── supabase/          # Supabase 客户端
│   ├── ai/                # AI 服务
│   ├── search/            # 搜索适配器
│   └── vector/            # 向量数据库操作
└── supabase/              # Supabase 配置
    └── migrations/        # 数据库迁移
```

## 开发进度

- [x] **Phase 1**: 项目初始化和基础 UI ✅
- [x] **Phase 2**: Supabase 配置 ✅
- [x] **Phase 3**: 自定义 tldraw Shapes ✅
- [x] **Phase 4**: AI 对话和搜索功能 ✅
- [x] **Phase 5**: 向量搜索和智能关联 ✅
- [x] **Phase 6**: 实时协作 ✅
- [x] **Phase 7**: 部署优化 ✅

### 🎉 全部功能已实现！

#### 核心功能

**📝 智能搜索**
- ✅ AI自动识别搜索意图
- ✅ 多源搜索（Google + Twitter）
- ✅ 自动生成结果卡片
- ✅ Mock数据演示（无需API密钥）

**🎨 无限画布**
- ✅ tldraw 4.0集成
- ✅ 3种自定义卡片类型
- ✅ 拖拽、缩放交互
- ✅ 自动布局和聚焦

**🧠 智能关联**
- ✅ 向量相似度计算
- ✅ 语义关联分析
- ✅ 自动主题聚类
- ✅ 可视化连接线

**👥 实时协作**
- ✅ Supabase Realtime集成
- ✅ 在线用户显示
- ✅ Presence追踪
- ✅ 多用户同步（就绪）

**🚀 生产就绪**
- ✅ 完整的部署指南
- ✅ 环境变量验证
- ✅ 性能优化配置
- ✅ 安全最佳实践

### 技术特性

- ✅ Next.js 15 + TypeScript
- ✅ React 19 + Tailwind CSS 3
- ✅ tldraw 4.0 自定义Shapes
- ✅ Supabase (PostgreSQL + pgvector + Realtime)
- ✅ OpenAI API集成（可选）
- ✅ 向量搜索和语义分析
- ✅ Edge Runtime优化
- ✅ 完全模块化架构

## 📚 文档

- [QUICKSTART.md](./QUICKSTART.md) - 5分钟快速开始
- [DEMO.md](./DEMO.md) - 完整Demo使用指南
- [HOW_IT_WORKS.md](./HOW_IT_WORKS.md) - 技术原理详解
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 🚀 生产部署指南
- [supabase/README.md](./supabase/README.md) - 数据库配置

## 🎯 使用场景

- 📚 **学术研究** - 整理文献、发现关联、组织笔记
- 💡 **创意构思** - 头脑风暴、思维导图、概念关联
- 📊 **数据分析** - 收集信息、可视化关系、发现模式
- 🔬 **项目调研** - 市场研究、竞品分析、趋势追踪
- 📝 **内容策划** - 素材收集、主题聚类、内容规划

## License

ISC
