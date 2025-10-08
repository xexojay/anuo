# 参考项目文档

本文档记录了Research Canvas项目开发过程中参考的项目和灵感来源。

---

## 🎨 设计参考

### 1. kuse.ai

**网址**: https://kuse.ai / https://app.kuse.ai

**参考时间**: 2025-01-08

**参考内容**:

#### UI设计
- ✅ **三栏布局** - 左工具栏 + 中画布 + 右详情面板
  - 我们的实现：简化为双栏（移除右侧面板）
- ✅ **底部输入框** - 居中、现代化设计
  - 我们的实现：渐变按钮 + 毛玻璃效果
- ✅ **卡片设计** - 白色底板 + 精致阴影
  - 我们的实现：白底 + 彩色强调 + 渐变标签
- ✅ **视觉风格** - 现代、简洁、专业
  - 我们的实现：毛玻璃 + 渐变 + 精致阴影

#### 交互模式
- ✅ **AI对话生成卡片** - 用户输入 → AI处理 → 生成结果卡片
  - 我们的实现：意图识别 → 搜索 → 自动布局卡片
- ✅ **无限画布** - 自由拖拽、整理信息
  - 我们的实现：基于tldraw的完整实现

#### 功能理念
- ✅ **All-in-one AI canvas** - 聊天文件、链接、视频转换为洞察
  - 我们的focus：搜索 + 研究 + 关联分析

**差异化**:
- kuse.ai更通用（支持多种媒体类型）
- Research Canvas专注研究场景（搜索 + 关联）
- 我们使用开源技术栈（tldraw + Supabase）

---

### 2. OpenAI Canvas

**网址**: https://openai.com/index/introducing-canvas

**参考时间**: 2024

**参考内容**:

#### 交互模式
- ✅ **分屏设计** - 左侧对话 + 右侧编辑器
- ✅ **AI驱动内容生成**
- ✅ **实时编辑**

**借鉴点**:
- AI对话 + Canvas的组合模式
- 用户可以在canvas上直接操作AI生成的内容

**差异**:
- OpenAI Canvas是文档编辑器
- Research Canvas是研究白板
- 我们支持多卡片、自由布局

---

## 🛠️ 技术参考

### 1. tldraw

**GitHub**: https://github.com/tldraw/tldraw

**版本**: 4.0.3

**参考时间**: 2025-01

**使用方式**: 核心依赖

**参考内容**:

#### API和示例
- ✅ [Custom Shapes](https://tldraw.dev/examples/custom-shape)
  - 学习了如何创建自定义Shape
  - 实现了3种卡片类型
- ✅ [Custom UI](https://tldraw.dev/examples/custom-ui)
  - 学习了如何隐藏默认UI
  - 创建了自定义界面
- ✅ [Editor API](https://tldraw.dev/docs/editor)
  - 学习了编辑器API
  - 实现了程序化创建卡片

#### 官方模板
- 📦 [Next.js Template](https://github.com/tldraw/nextjs-template)
  - 参考了Next.js集成方式
  - 学习了配置最佳实践

**核心概念**:
- Shape系统 - 自定义渲染内容
- Editor API - 程序化操作
- Store - 状态管理
- Bindings - 连接和关系

---

### 2. Supabase

**网址**: https://supabase.com

**版本**: 2.74.0

**参考内容**:

#### 向量搜索
- ✅ [pgvector扩展](https://supabase.com/docs/guides/ai/vector-columns)
  - 学习了向量列的创建
  - 实现了语义搜索
- ✅ [向量相似度搜索](https://supabase.com/docs/guides/ai/semantic-search)
  - 学习了RPC函数创建
  - 实现了match_cards函数

#### Realtime
- ✅ [Realtime文档](https://supabase.com/docs/guides/realtime)
  - 学习了订阅机制
  - 实现了协作基础

---

### 3. Vercel AI SDK

**GitHub**: https://github.com/vercel/ai

**版本**: 5.0.60

**参考内容**:
- ✅ 流式响应处理
- ✅ Edge Runtime优化
- ✅ OpenAI集成模式

---

## 💡 设计灵感

### 研究工具

#### Notion
- 参考：数据库视图、模块化组件
- 差异：我们用白板而非页面

#### Obsidian
- 参考：双向链接、知识图谱
- 差异：我们用AI自动发现关联

#### Zotero
- 参考：学术研究工作流
- 差异：我们更视觉化、更AI驱动

### 白板工具

#### Miro
- 参考：无限画布、协作模式
- 差异：我们有AI搜索和关联

#### FigJam
- 参考：卡片式组织、视觉设计
- 差异：我们专注研究场景

---

## 📊 竞品对比

| 特性 | Research Canvas | kuse.ai | Notion | Miro |
|------|----------------|---------|--------|------|
| 无限画布 | ✅ | ✅ | ❌ | ✅ |
| AI搜索 | ✅ | ✅ | ⚠️ | ❌ |
| 多源搜索 | ✅ | ⚠️ | ❌ | ❌ |
| 智能关联 | ✅ | ⚠️ | ✅ | ❌ |
| 实时协作 | ✅ | ✅ | ✅ | ✅ |
| 开源 | ✅ | ❌ | ❌ | ❌ |
| 专注研究 | ✅ | ❌ | ⚠️ | ❌ |

**优势**:
- ✅ 开源技术栈
- ✅ 专为研究设计
- ✅ AI驱动的关联发现
- ✅ 多源信息整合

---

## 🎯 核心创新点

### 1. 搜索 + 白板的融合

**创新**: 将搜索结果直接转换为可操作的白板卡片

**价值**:
- 消除复制粘贴
- 保留上下文
- 可视化组织

### 2. AI驱动的关联发现

**创新**: 使用向量搜索自动发现信息间的语义关联

**价值**:
- 发现隐藏联系
- 自动主题聚类
- 降低认知负担

### 3. 研究专用的卡片类型

**创新**: 针对研究场景定制的卡片系统

**价值**:
- 信息结构化
- 视觉差异化
- 快速识别

---

## 📚 技术博客和文章

### 参考的技术文章

1. **tldraw自定义Shape开发**
   - 来源：tldraw官方文档
   - 学习：Shape生命周期、渲染机制

2. **Next.js 15最佳实践**
   - 来源：Vercel博客
   - 学习：App Router、Server Components

3. **向量搜索和语义分析**
   - 来源：Supabase文档
   - 学习：pgvector使用、相似度搜索

4. **现代UI设计趋势**
   - 参考：毛玻璃、渐变、微交互
   - 应用：全局样式系统

---

## 🙏 致谢

### 开源项目

- **tldraw团队** - 提供了优秀的画布SDK
- **Vercel团队** - Next.js和AI SDK
- **Supabase团队** - 强大的后端平台
- **Tailwind Labs** - 高效的样式系统

### 灵感来源

- **kuse.ai** - UI设计和交互模式
- **OpenAI Canvas** - AI + Canvas的组合思路
- **Notion** - 数据组织理念
- **Miro** - 协作白板最佳实践

---

## 📝 引用声明

### 商标和版权

- tldraw™ - tldraw Inc.
- Next.js™ - Vercel Inc.
- Supabase™ - Supabase Inc.
- Tailwind CSS™ - Tailwind Labs

### 开源协议

本项目使用的主要开源组件：

- **tldraw**: MIT License
- **Next.js**: MIT License
- **React**: MIT License
- **Tailwind CSS**: MIT License

### 数据和内容

- Mock搜索数据：虚构示例，仅用于演示
- 图标：使用Emoji，无版权问题
- 设计风格：参考业界最佳实践，独立实现

---

## 🔗 相关链接

### 项目文档
- [产品需求文档](./PRD.md)
- [技术栈文档](./TECH_STACK.md)
- [参考项目](./REFERENCE.md)（本文档）

### 外部资源
- [tldraw文档](https://tldraw.dev)
- [Next.js文档](https://nextjs.org)
- [Supabase文档](https://supabase.com/docs)
- [kuse.ai官网](https://kuse.ai)

---

**文档版本**: 1.0
**最后更新**: 2025-01-08
