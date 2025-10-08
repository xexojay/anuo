# 部署指南

## 🚀 快速部署到Vercel

### 前置条件

- GitHub账号
- Vercel账号
- Supabase项目（可选，用于生产环境）
- OpenAI API密钥（可选，用于真实AI功能）

### 步骤1：推送到GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/research-canvas.git
git push -u origin main
```

### 步骤2：连接Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "Import Project"
3. 选择你的GitHub仓库
4. 配置项目：
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 步骤3：配置环境变量

在Vercel项目设置中添加以下环境变量：

#### 必需（用于Supabase）
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### 可选（用于真实API）
```
OPENAI_API_KEY=sk-...
SERPER_API_KEY=your-serper-key
TWITTER_BEARER_TOKEN=your-twitter-token
```

### 步骤4：部署

点击 "Deploy" 按钮，Vercel会自动构建和部署你的应用。

---

## 🗄️ Supabase配置

### 创建Supabase项目

1. 访问 [supabase.com](https://supabase.com)
2. 创建新项目
3. 等待项目初始化完成

### 运行数据库迁移

#### 方式1：使用Supabase CLI

```bash
# 安装CLI
npm install -g supabase

# 登录
supabase login

# 链接项目
supabase link --project-ref your-project-ref

# 运行迁移
supabase db push
```

#### 方式2：手动执行SQL

1. 打开Supabase Dashboard → SQL Editor
2. 复制 `supabase/migrations/20250101000000_initial_schema.sql` 的内容
3. 粘贴并执行

### 获取API密钥

1. Supabase Dashboard → Settings → API
2. 复制：
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## ⚡ 性能优化

### 1. 图片优化

使用Next.js Image组件：

```tsx
import Image from 'next/image'

<Image
  src="/logo.png"
  width={200}
  height={50}
  alt="Logo"
/>
```

### 2. 代码分割

已自动启用：
- 动态导入
- Route-based splitting
- Component-level splitting

### 3. 缓存策略

在API routes中添加缓存头：

```typescript
return NextResponse.json(data, {
  headers: {
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
  }
});
```

### 4. 数据库优化

- ✅ 已创建索引（见migration文件）
- ✅ 已启用RLS安全策略
- ✅ 使用向量索引（IVFFlat）

---

## 🔒 安全最佳实践

### 1. 环境变量

- ✅ 使用 `NEXT_PUBLIC_` 前缀的变量会暴露到客户端
- ✅ 敏感密钥（OpenAI API Key）只在服务端使用
- ✅ 不要在客户端代码中硬编码密钥

### 2. Supabase RLS

已启用Row Level Security：
- 用户只能访问自己的白板
- 自动处理权限检查
- 防止SQL注入

### 3. API限流

建议添加限流中间件（可选）：

```bash
npm install @upstash/ratelimit @upstash/redis
```

---

## 📊 监控

### Vercel Analytics

1. Vercel Dashboard → Analytics
2. 查看：
   - Page views
   - Unique visitors
   - Top pages
   - Performance metrics

### Supabase Logs

1. Supabase Dashboard → Logs
2. 监控：
   - Database queries
   - Realtime connections
   - API requests

---

## 🐛 故障排除

### 构建失败

```bash
# 本地测试构建
npm run build

# 检查类型错误
npx tsc --noEmit
```

### Supabase连接失败

- 检查环境变量是否正确
- 确认Supabase项目状态正常
- 验证RLS策略配置

### Realtime不工作

- 检查Supabase Realtime是否启用
- 验证网络连接
- 查看浏览器控制台错误

---

## 🎯 生产环境检查清单

- [ ] 所有环境变量已配置
- [ ] Supabase数据库迁移已运行
- [ ] RLS策略已启用
- [ ] API密钥已妥善保管
- [ ] 构建无错误
- [ ] 测试所有核心功能
- [ ] 配置自定义域名（可选）
- [ ] 启用Vercel Analytics
- [ ] 设置错误监控

---

## 🔄 持续部署

Vercel会自动为每个push部署：

- **main分支** → 生产环境
- **其他分支** → 预览环境

每个PR都会获得独立的预览URL！

---

## 💰 成本估算

### 免费层额度

- **Vercel**: 100GB带宽/月
- **Supabase**: 500MB数据库，2GB存储
- **OpenAI**: 需要付费（按使用量）

### 扩展建议

- 升级到Vercel Pro: $20/月（无限带宽）
- 升级到Supabase Pro: $25/月（8GB数据库）
