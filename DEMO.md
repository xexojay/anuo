# Research Canvas - Demo 使用指南

🎉 恭喜！你的AI研究助手已经可以使用了！

## 🚀 快速开始

### 1. 启动应用

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 2. 尝试搜索

在底部对话框中输入以下内容体验功能：

#### 搜索示例

```
搜索 AI
```
✅ 会自动搜索Google，生成3个搜索结果卡片

```
搜索 tldraw
```
✅ 返回关于tldraw的搜索结果

```
搜索 Twitter AI
```
✅ 同时搜索Google和Twitter

```
research
```
✅ 即使不说"搜索"，也会智能识别并搜索

## 🎨 功能演示

### ✅ 已实现的功能

#### 1. **智能搜索**
- 输入任何关键词，AI会自动识别搜索意图
- 支持Google搜索（使用mock数据演示）
- 支持Twitter搜索（使用mock数据演示）
- 自动在白板上生成搜索结果卡片

#### 2. **自定义卡片**
- **搜索结果卡片** - 蓝色，显示标题、摘要、来源
- **笔记卡片** - 黄色，用于记录想法
- **聚类卡片** - 紫色，自动聚合相关卡片

#### 3. **白板交互**
- ✅ 拖拽移动卡片
- ✅ 缩放卡片大小
- ✅ 自动缩放以查看所有内容
- ✅ 所有tldraw原生功能（绘制、标注等）

#### 4. **🧠 智能关联分析**（NEW！）
- ✅ 点击右上角"智能关联"按钮
- ✅ 自动分析画布上所有卡片的语义相似度
- ✅ 生成主题聚类建议
- ✅ 在画布上绘制连接线
- ✅ 显示关联强度和统计信息

#### 5. **👥 实时协作**（NEW！）
- ✅ 左上角显示在线用户
- ✅ 实时presence追踪
- ✅ 多用户协作就绪（需配置Supabase）

#### 6. **UI设计**
- 🎨 现代化的卡片设计
- 🌈 颜色主题支持
- 📱 响应式布局
- 🔗 可点击的链接

### 🎮 新功能演示

#### 智能关联分析

1. 先添加几张卡片：
   ```
   搜索 AI
   ```

2. 再添加相关内容：
   ```
   搜索 tldraw
   ```

3. 点击右上角 **🧠 智能关联** 按钮

4. 查看：
   - 发现的语义关联数量
   - 主题聚类建议
   - 画布上的自动连接线
   - 关联强度百分比

#### 实时协作

1. 打开两个浏览器标签页
2. 访问同一个board URL
3. 观察左上角的在线用户指示器
4. 看到其他用户加入/离开

### 🆕 最新功能

- ✅ **向量搜索** - 智能发现卡片间的关联
- ✅ **语义分析** - 基于内容相似度的聚类
- ✅ **实时协作** - 多用户在线状态
- ✅ **Presence追踪** - 协作感知
- ✅ **生产部署** - 完整部署指南

## 💡 使用技巧

### 搜索关键词测试

尝试这些关键词查看不同的mock数据：

- `ai` - AI相关搜索结果
- `tldraw` - tldraw文档和GitHub
- `research` - 研究方法和工具
- 任何其他关键词 - 通用搜索结果

### 白板操作

- **选择工具**: 点击左侧工具栏
- **移动画布**: 按住空格 + 拖动，或使用鼠标滚轮
- **缩放**: Cmd/Ctrl + 滚轮
- **框选**: 拖动选择多个卡片
- **删除**: 选中后按 Delete/Backspace

## 🔧 配置真实API（可选）

如果你想连接真实的API服务：

### 1. OpenAI（用于真实AI对话）

```bash
# .env
OPENAI_API_KEY=sk-...
```

### 2. Google搜索（Serper API）

```bash
# .env
SERPER_API_KEY=your-key
```

访问 [serper.dev](https://serper.dev) 获取API密钥

### 3. Twitter API

```bash
# .env
TWITTER_BEARER_TOKEN=your-token
```

访问 [developer.twitter.com](https://developer.twitter.com) 申请

### 4. Supabase（数据持久化）

```bash
# .env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

参考 `supabase/README.md` 配置数据库

## 📊 项目架构

```
用户输入
    ↓
意图识别 (AI Router)
    ↓
┌─────────┬─────────┐
│  Google │ Twitter │
│ Search  │ Search  │
└─────────┴─────────┘
    ↓
生成卡片到白板
    ↓
tldraw 无限画布
```

## 🐛 故障排除

### 卡片没有出现？
- 检查浏览器控制台是否有错误
- 确认dev server正在运行
- 尝试刷新页面

### 搜索没有响应？
- 查看Network标签，检查API调用
- 确认 `/api/ai/chat` 路由正常

### 样式显示异常？
- 确认Tailwind CSS正确配置
- 检查是否有CSS冲突

## 🎯 下一步

现在你有一个可工作的demo！接下来可以：

1. **添加真实API** - 配置OpenAI、Serper等API密钥
2. **实现向量搜索** - 使用Supabase pgvector
3. **添加更多交互** - 卡片编辑、连线等
4. **部署到生产** - 使用Vercel一键部署

享受你的AI研究助手吧！ 🚀
