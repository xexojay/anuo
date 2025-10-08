# 工作原理

## 架构流程

```
┌─────────────────────────────────────────────┐
│           1. 用户输入                        │
│   "搜索 AI"                                  │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│        2. AI意图识别                         │
│   检测: 搜索关键词 → type: "search"          │
│   提取: 查询词 → query: "AI"                 │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│        3. 路由到搜索服务                      │
│   /api/ai/chat → search("AI", ["google"])   │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│        4. 执行搜索                            │
│   mockGoogleSearch("AI")                    │
│   → 返回搜索结果数组                          │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│        5. 生成卡片                            │
│   遍历结果 → createSearchResultCard()        │
│   位置: x: 100 + index*340, y: 100          │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│        6. 渲染到白板                          │
│   tldraw Editor → 显示自定义shape            │
│   自动缩放 → zoomToFit()                     │
└─────────────────────────────────────────────┘
```

## 关键组件

### 1. ChatBar (用户输入)
- 位置: `/components/chat/ChatBar.tsx`
- 功能:
  - 接收用户输入
  - 调用AI API
  - 触发卡片创建

### 2. AI Router (意图识别)
- 位置: `/app/api/ai/chat/route.ts`
- 功能:
  - 检测搜索意图
  - 识别搜索源（Google/Twitter）
  - 提取查询关键词

### 3. Search Service (搜索服务)
- 位置: `/lib/search/`
- 功能:
  - 统一搜索接口
  - Mock数据演示
  - 可扩展真实API

### 4. Card Helpers (卡片创建)
- 位置: `/components/canvas/helpers.ts`
- 功能:
  - `createSearchResultCard()` - 搜索结果
  - `createNoteCard()` - 笔记
  - `createClusterCard()` - 聚类

### 5. Custom Shapes (自定义形状)
- 位置: `/components/canvas/shapes/`
- 功能:
  - SearchResultCardUtil - 渲染搜索卡片
  - NoteCardUtil - 渲染笔记卡片
  - ClusterCardUtil - 渲染聚类卡片

### 6. Editor Context (编辑器上下文)
- 位置: `/components/canvas/EditorContext.tsx`
- 功能:
  - 存储tldraw编辑器实例
  - 提供全局访问
  - 支持程序化操作

## 数据流

```typescript
// 1. 用户输入
"搜索 AI"

// 2. API请求
POST /api/ai/chat
{
  message: "搜索 AI"
}

// 3. 意图识别结果
{
  type: "search",
  query: "AI",
  sources: ["google"]
}

// 4. 搜索结果
[
  {
    title: "OpenAI GPT-4...",
    snippet: "GPT-4是...",
    url: "https://...",
    source: "google"
  },
  // ...更多结果
]

// 5. API响应
{
  intent: "search",
  results: [...],
  message: "找到 3 条关于"AI"的结果"
}

// 6. 前端创建卡片
results.forEach((result, index) => {
  createSearchResultCard(editor, {
    ...result,
    x: 100 + index * 340,
    y: 100
  })
})
```

## 扩展点

### 添加新的搜索源

```typescript
// lib/search/wikipedia.ts
export async function searchWikipedia(query: string) {
  // 实现Wikipedia搜索
}

// lib/search/index.ts
export async function search(query, sources) {
  const sourceMap = {
    google: searchGoogle,
    twitter: searchTwitter,
    wikipedia: searchWikipedia, // 新增
  }
  // ...
}
```

### 添加新的卡片类型

```typescript
// 1. 定义类型
export type ImageCardShape = TLBaseShape<
  "image-card",
  { url: string; caption: string }
>

// 2. 创建Util
export class ImageCardUtil extends ShapeUtil<ImageCardShape> {
  // 实现必需方法
}

// 3. 注册到tldraw
const customShapeUtils = [
  SearchResultCardUtil,
  NoteCardUtil,
  ImageCardUtil, // 新增
]
```

## Mock vs 真实API

### 当前（Mock模式）
```typescript
// lib/search/mock.ts
export async function mockGoogleSearch(query) {
  // 返回预设的假数据
  return mockResults[query] || defaultResults
}
```

### 切换到真实API
```typescript
// lib/search/google.ts
export async function realGoogleSearch(query) {
  const response = await fetch('https://api.serper.dev/search', {
    method: 'POST',
    headers: {
      'X-API-KEY': process.env.SERPER_API_KEY
    },
    body: JSON.stringify({ q: query })
  })
  return response.json()
}

// lib/search/index.ts
export async function searchGoogle(query) {
  if (process.env.SERPER_API_KEY) {
    return realGoogleSearch(query)
  }
  return mockGoogleSearch(query)
}
```

## 下一步开发

查看 `README.md` 的开发进度部分了解待完成的功能！
