# 自定义 Shapes

这个目录包含了Research Canvas的三种自定义tldraw shapes。

## Shape 类型

### 1. SearchResultCardShape (`search-result-card`)
展示搜索结果的卡片

**属性:**
- `title`: 标题
- `snippet`: 摘要
- `source`: 来源 (`google` | `twitter`)
- `url`: 链接
- `timestamp`: 时间戳
- `color`: 颜色主题

**用途:**
显示从Google或Twitter搜索获得的结果

### 2. NoteCardShape (`note-card`)
笔记卡片

**属性:**
- `content`: 笔记内容
- `tags`: 标签数组
- `color`: 颜色主题

**用途:**
用户手动创建的笔记和想法

### 3. ClusterCardShape (`cluster-card`)
主题聚类卡片

**属性:**
- `theme`: 主题名称
- `cardIds`: 关联的卡片ID数组
- `summary`: AI生成的摘要
- `color`: 颜色主题

**用途:**
将相关的卡片组织成主题集群

## 使用方法

### 基础用法

```typescript
import { cardHelpers } from "@/components/canvas/helpers";

// 在tldraw编辑器中创建卡片
function MyComponent() {
  const handleCreateCard = (editor: Editor) => {
    // 创建搜索结果卡片
    cardHelpers.createSearchResultCard(editor, {
      title: "AI研究进展",
      snippet: "最新的AI技术突破...",
      source: "google",
      url: "https://example.com",
      x: 100,
      y: 100,
    });

    // 创建笔记卡片
    cardHelpers.createNoteCard(editor, {
      content: "这是一个想法...",
      tags: ["ai", "research"],
      color: "yellow",
      x: 500,
      y: 100,
    });

    // 创建聚类卡片
    cardHelpers.createClusterCard(editor, {
      theme: "AI应用",
      cardIds: ["card-1", "card-2"],
      summary: "关于AI应用的相关内容...",
      x: 900,
      y: 100,
    });
  };
}
```

### 高级用法

```typescript
// 获取编辑器实例
import { useEditor } from "tldraw";

function MyCanvas() {
  const editor = useEditor();

  // 程序化创建卡片
  const createFromSearchResult = (result: SearchResult) => {
    if (!editor) return;

    cardHelpers.createSearchResultCard(editor, {
      title: result.title,
      snippet: result.snippet,
      source: result.source,
      url: result.url,
    });
  };

  return <Tldraw />;
}
```

## 样式定制

每个shape使用Tailwind CSS进行样式化，颜色主题映射：

- `blue`: 蓝色系
- `red`: 红色系
- `green`: 绿色系
- `yellow`: 黄色系
- `orange`: 橙色系
- `purple`: 紫色系
- `black`: 灰色系

## 交互特性

所有自定义shapes支持：
- ✓ 拖拽移动
- ✓ 调整大小
- ✓ 选中/取消选中
- ✓ 复制/粘贴
- ✓ 删除
- ✓ 导出

## 扩展开发

要创建新的shape类型：

1. 在 `types.ts` 中定义shape类型
2. 创建 `YourShapeUtil.tsx` 继承 `ShapeUtil`
3. 实现必需的方法：
   - `getDefaultProps()`
   - `getGeometry()`
   - `component()`
   - `indicator()`
4. 在 `index.ts` 中导出
5. 在 `CanvasBoard.tsx` 中注册
