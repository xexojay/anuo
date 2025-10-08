# Research Canvas - 产品需求文档 (PRD)

**版本**: 1.0
**日期**: 2025-01-08
**作者**: 产品团队
**状态**: ✅ MVP已完成

---

## 📋 目录

1. [项目背景](#项目背景)
2. [产品目标](#产品目标)
3. [核心功能](#核心功能)
4. [技术架构](#技术架构)
5. [参考项目](#参考项目)
6. [已实现功能](#已实现功能)
7. [用户场景](#用户场景)
8. [未来规划](#未来规划)

---

## 🎯 项目背景

### 问题陈述

在进行研究工作时，用户需要：
- 🔍 **多源搜索** - 从Google、Twitter等多个平台搜索信息
- 📊 **信息整理** - 查看、过滤、组织大量搜索结果
- 🔗 **发现关联** - 找到不同信息之间的内在联系
- 💡 **可视化思考** - 以直观的方式展现信息和关系

### 现有方案的不足

- **传统搜索引擎** - 结果分散，无法整合
- **笔记应用** - 线性组织，难以展现复杂关系
- **思维导图工具** - 缺少AI辅助和多源搜索
- **研究工具** - 功能单一，缺少白板式交互

### 解决方案

**Research Canvas** - 一个AI驱动的研究助手工具，以**无限白板**为核心交互形式，结合**多源搜索**、**AI分析**和**智能关联**，帮助用户高效地进行研究工作。

---

## 🎯 产品目标

### 核心价值主张

> "在一个无限画布上，搜索、组织和发现信息之间的联系"

### 目标用户

- 📚 **学术研究者** - 文献综述、理论研究
- 💼 **产品经理** - 市场调研、竞品分析
- ✍️ **内容创作者** - 素材收集、主题策划
- 🎨 **设计师** - 灵感收集、趋势研究
- 🔬 **数据分析师** - 信息整合、模式发现

### 核心指标

- **效率提升** - 相比传统方法提升50%+的信息整理速度
- **关联发现** - 自动发现用户可能忽略的信息关联
- **信息密度** - 在单一视图中展现更多有价值信息
- **使用体验** - 直观、流畅、专业的交互体验

---

## ⚙️ 核心功能

### 1. 无限画布 (Infinite Canvas)

**描述**: 基于tldraw的无限白板，用户可以自由拖拽、缩放、组织内容。

**功能点**:
- ✅ 无限滚动和缩放
- ✅ 拖拽式交互
- ✅ 自定义卡片类型
- ✅ 多种内置工具（绘图、标注等）

**技术实现**: tldraw 4.0 SDK

---

### 2. AI智能搜索

**描述**: 通过自然语言对话，AI自动识别意图并执行多源搜索。

**功能点**:
- ✅ 自然语言输入
- ✅ 意图自动识别
- ✅ Google搜索集成（支持mock演示）
- ✅ Twitter搜索集成（支持mock演示）
- ✅ 结果自动转换为卡片

**用户交互**:
```
用户输入："搜索 AI最新进展"
    ↓
AI识别：搜索意图 + 关键词"AI最新进展"
    ↓
执行搜索：Google + Twitter
    ↓
生成卡片：自动排列在画布上
```

**技术实现**:
- Next.js API Routes
- OpenAI API（意图识别）
- Serper API（Google搜索）
- Twitter API v2

---

### 3. 自定义卡片系统

**描述**: 三种专门设计的卡片类型，用于展示不同类型的信息。

#### 3.1 搜索结果卡片 (SearchResultCard)

**用途**: 展示来自Google、Twitter等搜索结果

**属性**:
- 📌 标题
- 📝 摘要/片段
- 🔗 原始链接
- 🏷️ 来源标识（Google/Twitter）
- ⏰ 时间戳

**视觉设计**:
- 白色底板 + 彩色强调
- 渐变来源标签
- 悬浮阴影效果
- 可点击链接
- 收藏功能（⭐）

#### 3.2 笔记卡片 (NoteCard)

**用途**: 用户手动创建的笔记和想法

**属性**:
- 📄 笔记内容
- 🏷️ 标签数组
- 🎨 颜色主题

**视觉设计**:
- 渐变背景
- 支持多标签
- "NOTE"标识
- 7种颜色主题

#### 3.3 聚类卡片 (ClusterCard)

**用途**: AI自动生成的主题聚类

**属性**:
- 🎯 主题名称
- 📊 关联的卡片ID列表
- 📝 AI生成的摘要
- 💪 关联强度

**视觉设计**:
- 虚线边框（表示聚合）
- 三层渐变背景
- 渐变图标徽章
- 关联数量显示

---

### 4. 智能关联分析

**描述**: 使用AI向量搜索技术，自动发现卡片之间的语义关联。

**功能点**:
- 🧠 向量化文本内容
- 📐 计算语义相似度
- 🔗 自动绘制连接线
- 🎯 主题聚类建议

**算法**:
1. 将每个卡片的内容转换为1536维向量（OpenAI embedding）
2. 计算任意两个卡片向量的余弦相似度
3. 相似度 > 阈值（默认0.65）的卡片建立连接
4. 使用连通分量算法识别主题聚类

**技术实现**:
- OpenAI text-embedding-3-small
- Supabase pgvector
- 余弦相似度计算
- 图算法（聚类）

---

### 5. 实时协作 (Ready)

**描述**: 支持多用户同时编辑同一白板（基础设施已就绪）。

**功能点**:
- 👥 在线用户显示
- 📡 实时数据同步
- 🎯 Presence追踪
- 💬 协作感知

**技术实现**:
- Supabase Realtime
- WebSocket连接
- Presence API
- 乐观更新

**状态**: 基础设施完成，需配置Supabase后启用

---

## 🏗️ 技术架构

### 技术栈

#### 前端
- **Next.js 15** - React框架（App Router）
- **React 19** - UI库
- **TypeScript** - 类型安全
- **Tailwind CSS 3** - 样式系统
- **tldraw 4.0** - 无限画布SDK

#### 后端
- **Next.js API Routes** - RESTful API
- **Edge Runtime** - 低延迟响应
- **Supabase** - 后端服务平台
  - PostgreSQL - 关系数据库
  - pgvector - 向量搜索扩展
  - Realtime - 实时订阅
  - Auth - 用户认证（预留）
  - Storage - 文件存储（预留）

#### AI/ML
- **OpenAI API**
  - GPT-4o-mini - 对话和意图识别
  - text-embedding-3-small - 文本向量化

#### 第三方服务
- **Serper API** - Google搜索
- **Twitter API v2** - Twitter搜索

#### 状态管理
- **React Context** - Editor共享
- **Zustand** - 轻量状态管理（已安装）

---

### 数据模型

```sql
-- 白板表
boards {
  id: uuid
  user_id: uuid
  title: text
  canvas_state: jsonb        -- tldraw状态持久化
  created_at: timestamp
  updated_at: timestamp
}

-- 卡片表
cards {
  id: uuid
  board_id: uuid
  type: enum('search_result', 'note', 'cluster')
  content: jsonb
  metadata: jsonb
  embedding: vector(1536)    -- OpenAI向量
  position: jsonb
  created_at: timestamp
}

-- 连接表
connections {
  id: uuid
  board_id: uuid
  from_card_id: uuid
  to_card_id: uuid
  type: enum('semantic', 'temporal', 'manual')
  strength: float
  created_at: timestamp
}
```

---

### 系统架构

```
┌─────────────────────────────────────────────────┐
│              前端层 (React)                      │
│  ┌────────────┐  ┌──────────┐  ┌─────────────┐ │
│  │ LeftSidebar│  │ Canvas   │  │  ChatBar    │ │
│  │    工具栏   │  │  (tldraw)│  │   输入框    │ │
│  └────────────┘  └──────────┘  └─────────────┘ │
└─────────────────────────────────────────────────┘
                       ↓ API调用
┌─────────────────────────────────────────────────┐
│           应用层 (Next.js API Routes)            │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │AI Router │  │ Search   │  │Vector Search │  │
│  │意图识别   │  │ Service  │  │  向量搜索     │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│              数据层 (Supabase)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │PostgreSQL│  │pgvector  │  │  Realtime    │  │
│  │  数据库   │  │向量搜索   │  │   实时同步   │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 🎨 参考项目

### 1. tldraw
- **网址**: https://github.com/tldraw/tldraw
- **参考内容**: 无限画布SDK、自定义Shape开发
- **使用方式**: 核心框架
- **版本**: 4.0.3

**借鉴点**:
- ✅ 无限画布交互模式
- ✅ Shape系统和自定义能力
- ✅ 程序化操作API
- ✅ 高性能渲染

### 2. kuse.ai
- **网址**: https://kuse.ai / https://app.kuse.ai
- **参考内容**: UI设计、交互模式、布局结构
- **使用方式**: 设计参考

**借鉴点**:
- ✅ 三栏布局设计（左工具栏 + 中画布 + 右详情）
- ✅ 底部对话框交互模式
- ✅ AI卡片生成模式
- ✅ 现代化视觉风格
- ✅ 毛玻璃设计语言

**差异化**:
- ❌ 我们移除了右侧详情面板（保持简洁）
- ✅ 我们专注于研究场景（搜索 + 关联）
- ✅ 我们使用tldraw（开源、可控）

### 3. OpenAI ChatGPT Canvas
- **参考内容**: AI对话 + Canvas交互
- **借鉴点**: 对话生成内容的模式

### 4. Miro / FigJam
- **参考内容**: 协作白板的最佳实践
- **借鉴点**: 卡片式内容组织

---

## ✅ 已实现功能

### Phase 1: 基础架构 ✅

**完成时间**: 第1天

**内容**:
- ✅ Next.js 15 + TypeScript项目初始化
- ✅ Tailwind CSS 3配置
- ✅ tldraw 4.0集成
- ✅ 项目目录结构搭建

**文件**:
- `package.json` - 依赖管理
- `tsconfig.json` - TypeScript配置
- `tailwind.config.ts` - 样式配置
- `next.config.ts` - Next.js配置

---

### Phase 2: Supabase集成 ✅

**完成时间**: 第1天

**内容**:
- ✅ PostgreSQL数据库Schema设计
- ✅ pgvector扩展配置（向量搜索）
- ✅ Row Level Security（RLS）策略
- ✅ 数据库迁移脚本
- ✅ Supabase客户端封装
- ✅ React Hooks封装

**文件**:
- `supabase/migrations/20250101000000_initial_schema.sql`
- `lib/supabase/client.ts`
- `lib/supabase/database.types.ts`
- `lib/supabase/hooks.ts`
- `lib/supabase/realtime.ts`

**数据表**:
- `boards` - 白板信息
- `cards` - 卡片内容（含向量）
- `connections` - 卡片关联

---

### Phase 3: 自定义Shapes ✅

**完成时间**: 第2天

**内容**:
- ✅ SearchResultCard - 搜索结果卡片
- ✅ NoteCard - 笔记卡片
- ✅ ClusterCard - 聚类卡片
- ✅ 完整的交互支持（拖拽、缩放、编辑）
- ✅ CardHelpers工具函数

**文件**:
- `components/canvas/shapes/types.ts` - 类型定义
- `components/canvas/shapes/SearchResultCardUtil.tsx`
- `components/canvas/shapes/NoteCardUtil.tsx`
- `components/canvas/shapes/ClusterCardUtil.tsx`
- `components/canvas/helpers.ts` - 创建工具

**技术要点**:
- 继承tldraw的ShapeUtil
- 实现必需方法：getDefaultProps、getGeometry、component、indicator
- 支持resize、drag等交互

---

### Phase 4: AI对话和搜索 ✅

**完成时间**: 第2-3天

**内容**:
- ✅ AI意图识别系统
- ✅ 统一搜索服务接口
- ✅ Google搜索适配器（含Mock）
- ✅ Twitter搜索适配器（含Mock）
- ✅ ChatBar交互组件
- ✅ 自动卡片生成和布局

**文件**:
- `app/api/ai/chat/route.ts` - AI对话API
- `lib/ai/openai.ts` - OpenAI集成
- `lib/search/index.ts` - 搜索服务
- `lib/search/mock.ts` - Mock数据
- `lib/search/types.ts` - 类型定义
- `components/chat/ChatBar.tsx` - 输入组件

**意图识别逻辑**:
```typescript
function detectIntent(message: string) {
  // 检测搜索关键词："搜索"、"查找"、"search"等
  // 检测来源："twitter"、"google"
  // 提取查询词
  // 返回意图类型和参数
}
```

**Demo模式**:
- 内置Mock数据，无需API密钥即可体验
- 支持关键词："ai"、"tldraw"、"research"等
- 平滑切换到真实API

---

### Phase 5: 向量搜索和关联 ✅

**完成时间**: 第3天

**内容**:
- ✅ 文本向量化API
- ✅ 向量相似度搜索
- ✅ 语义关联分析
- ✅ 主题聚类算法
- ✅ 自动连接线绘制

**文件**:
- `app/api/vector/embed/route.ts` - 向量生成
- `app/api/vector/search/route.ts` - 向量搜索
- `app/api/ai/relate/route.ts` - 关联分析
- `lib/vector/operations.ts` - 向量操作工具

**算法**:
- **余弦相似度**: 计算两个向量的相似程度
- **连通分量**: 识别卡片聚类
- **Mock向量生成**: 无需API也能演示

**使用流程**:
```
用户点击"智能关联"
  ↓
获取画布上所有卡片
  ↓
生成每个卡片的向量
  ↓
两两计算相似度
  ↓
相似度 > 阈值 → 建立连接
  ↓
在画布上绘制箭头
```

---

### Phase 6: 实时协作基础 ✅

**完成时间**: 第3天

**内容**:
- ✅ Supabase Realtime集成
- ✅ useRealtimeBoard Hook
- ✅ useBoardPresence Hook
- ✅ 在线用户追踪
- ✅ 数据同步机制

**文件**:
- `lib/supabase/realtime.ts`
- `components/canvas/PresenceIndicator.tsx`

**状态**:
- ✅ 代码完成
- ⚠️ 需要配置Supabase才能使用
- ✅ 优雅降级（无配置时隐藏）

---

### Phase 7: UI设计升级 ✅

**完成时间**: 第3-4天

**内容**:
- ✅ 参考kuse.ai重新设计UI
- ✅ 创建左侧工具栏
- ✅ 优化卡片视觉设计
- ✅ 现代化ChatBar
- ✅ 添加动画效果
- ✅ 精简布局（移除右侧面板）

**文件**:
- `components/ui/LeftSidebar.tsx` - 工具栏
- `app/globals.css` - 全局样式和动画
- 所有Shape组件 - 视觉升级

**设计语言**:
- 🎨 渐变色（蓝→靛蓝，紫→靛蓝）
- 🌫️ 毛玻璃效果（backdrop-blur）
- 💎 精致阴影（多层阴影）
- 🎯 圆角设计（rounded-xl/2xl）
- ✨ 平滑过渡（transition-all duration-200）

---

## 👤 用户场景

### 场景1: 学术文献调研

**用户**: 研究生小李

**需求**: 了解"Transformer模型"的最新研究进展

**使用流程**:
1. 打开Research Canvas
2. 在底部输入："搜索 Transformer最新论文"
3. AI自动搜索Google + Twitter
4. 生成3-5张搜索结果卡片
5. 拖拽整理卡片，添加笔记
6. 点击"智能关联"发现论文间的联系
7. 形成知识图谱

**价值**: 快速建立研究领域的全景视图

---

### 场景2: 产品竞品分析

**用户**: 产品经理小王

**需求**: 分析"AI绘画工具"的竞品格局

**使用流程**:
1. 搜索 "Midjourney"
2. 搜索 "Stable Diffusion"
3. 搜索 "DALL-E"
4. 手动添加笔记卡片记录特性对比
5. 使用智能关联发现产品间的差异和联系
6. 导出为报告（未来功能）

**价值**: 可视化竞品关系，发现机会点

---

### 场景3: 内容创作素材收集

**用户**: 博主小张

**需求**: 收集"AI应用案例"相关素材

**使用流程**:
1. 搜索多个关键词
2. 在画布上分类整理
3. 添加笔记标注想法
4. 发现主题聚类
5. 基于聚类规划文章结构

**价值**: 从零散信息到结构化内容

---

## 📊 功能优先级

### P0 (MVP - 已完成)

- ✅ 无限画布基础
- ✅ AI搜索（Mock）
- ✅ 3种自定义卡片
- ✅ 自动卡片生成
- ✅ 基础UI（工具栏 + 输入框）

### P1 (核心功能 - 已完成)

- ✅ 向量搜索和关联
- ✅ 主题聚类
- ✅ 现代化UI设计
- ✅ 实时协作基础

### P2 (增强功能 - 未来)

- ⏳ 真实API集成（需API密钥）
- ⏳ 用户认证系统
- ⏳ 数据持久化（保存/加载）
- ⏳ 导出功能（PDF、图片）

### P3 (高级功能 - 未来)

- ⏳ 更多搜索源（Wikipedia、Arxiv等）
- ⏳ 更多卡片类型（图片、视频、表格）
- ⏳ AI自动摘要和总结
- ⏳ 协作编辑（光标同步）
- ⏳ 版本历史

---

## 🎯 当前产品状态

### MVP功能完成度: 100% ✅

**可用功能**:
- ✅ 搜索并生成卡片（Mock模式）
- ✅ 拖拽整理信息
- ✅ 发现信息关联（Mock向量）
- ✅ 现代化专业UI
- ✅ 完整的文档

**Demo就绪**:
- ✅ 无需任何配置即可运行
- ✅ Mock数据支持完整功能演示
- ✅ 平滑升级到真实API

### 技术债务: 低

- ⚠️ tldraw重复导入警告（不影响功能）
- ✅ TypeScript类型完整
- ✅ 代码结构清晰
- ✅ 注释完善

---

## 🚀 未来规划

### 短期（1-2周）

1. **真实API集成**
   - 配置OpenAI API
   - 配置Serper API
   - 配置Twitter API
   - 真实向量搜索

2. **数据持久化**
   - 连接Supabase
   - 实现保存/加载
   - 多Board管理

3. **用户认证**
   - Supabase Auth集成
   - 个人工作区
   - 权限管理

### 中期（1-2月）

1. **更多搜索源**
   - Wikipedia
   - Arxiv（学术论文）
   - GitHub
   - YouTube

2. **高级AI功能**
   - 自动摘要
   - 智能问答
   - 内容生成

3. **协作增强**
   - 实时光标
   - 评论系统
   - 分享链接

### 长期（3-6月）

1. **移动端适配**
2. **插件系统**
3. **API开放**
4. **企业版功能**

---

## 📈 成功指标

### 产品指标

- **用户留存率**: 目标 > 40%（7日）
- **日活用户**: 目标 > 100（6个月后）
- **平均会话时长**: 目标 > 15分钟
- **每会话创建卡片数**: 目标 > 5张

### 技术指标

- **页面加载时间**: < 2秒
- **API响应时间**: < 500ms
- **搜索结果生成**: < 3秒
- **向量搜索速度**: < 1秒

### 质量指标

- **代码测试覆盖率**: 目标 > 80%
- **TypeScript严格模式**: ✅ 已启用
- **无障碍性**: WCAG 2.1 AA级
- **浏览器兼容**: Chrome/Firefox/Safari最新版

---

## 🛠️ 开发规范

### 代码规范

- ✅ TypeScript strict mode
- ✅ ESLint配置
- ✅ 组件模块化
- ✅ 函数注释

### 设计规范

**颜色系统**:
- Primary: Blue 600 → Indigo 600
- Accent: Purple 600 → Indigo 600
- Success: Green 500
- Warning: Yellow 400
- Error: Red 500

**间距系统**:
- 小: 0.5rem (8px)
- 中: 1rem (16px)
- 大: 1.5rem (24px)
- 特大: 2rem (32px)

**圆角系统**:
- 小: rounded-lg (8px)
- 中: rounded-xl (12px)
- 大: rounded-2xl (16px)

**阴影系统**:
- 小: shadow-md
- 中: shadow-lg
- 大: shadow-xl
- 特大: shadow-2xl

---

## 📄 文档结构

### 用户文档

- ✅ `README.md` - 项目概览
- ✅ `QUICKSTART.md` - 快速开始
- ✅ `DEMO.md` - Demo使用指南

### 技术文档

- ✅ `HOW_IT_WORKS.md` - 技术原理
- ✅ `DEPLOYMENT.md` - 部署指南
- ✅ `PROJECT_SUMMARY.md` - 项目总结
- ✅ `UI_REDESIGN.md` - UI设计文档

### 产品文档

- ✅ `docs/PRD.md` - 产品需求文档（本文档）

### 开发文档

- ✅ `supabase/README.md` - 数据库配置
- ✅ `components/canvas/shapes/README.md` - Shape开发

---

## 🎓 技术亮点

### 1. 模块化架构
- 清晰的目录结构
- 组件高度解耦
- 易于扩展和维护

### 2. 渐进增强
- Mock数据演示
- 平滑升级到真实API
- 功能特性开关

### 3. 类型安全
- 100% TypeScript
- 完整的类型定义
- 编译时错误检查

### 4. 用户体验
- 现代化视觉设计
- 流畅的动画
- 直观的交互
- 响应式布局

### 5. 开发体验
- 完善的文档
- 清晰的代码注释
- 示例和模板
- 快速开发迭代

---

## 🔐 安全和隐私

### 数据安全

- ✅ Row Level Security（RLS）
- ✅ 环境变量管理
- ✅ API密钥服务端存储
- ✅ HTTPS强制

### 隐私保护

- 用户数据仅存储必要信息
- 搜索记录可选保存
- 符合GDPR要求（设计中）

---

## 💰 商业模式（未来）

### 免费版
- 基础搜索功能
- 5个Board限制
- Mock演示模式

### Pro版（$9.99/月）
- 无限Board
- 真实API集成
- 数据持久化
- 高级AI功能

### Team版（$29.99/月）
- 实时协作
- 团队工作区
- 权限管理
- 优先支持

---

## 📞 联系信息

**项目仓库**: (待创建)
**文档网站**: (待搭建)
**问题反馈**: GitHub Issues
**功能建议**: GitHub Discussions

---

## 📅 版本历史

### v1.0.0 (2025-01-08) - MVP发布

**新功能**:
- ✅ 无限画布
- ✅ AI智能搜索
- ✅ 自定义卡片系统
- ✅ 向量关联分析
- ✅ 现代化UI设计

**技术栈**:
- Next.js 15 + React 19
- tldraw 4.0
- Supabase
- OpenAI API

**状态**: ✅ 完全可用（Demo模式）

---

**🎉 Research Canvas v1.0 - AI驱动的研究助手，让信息研究更高效！**
