# Supabase 配置指南

## 设置步骤

### 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com)
2. 创建新项目
3. 等待项目初始化完成

### 2. 配置环境变量

从 Supabase 项目设置中获取以下信息：

- Project URL
- Anon (public) key

将它们添加到 `.env` 文件：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 运行数据库迁移

#### 方式 1: 使用 Supabase CLI（推荐）

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 链接到你的项目
supabase link --project-ref your-project-ref

# 运行迁移
supabase db push
```

#### 方式 2: 手动执行

1. 在 Supabase Dashboard 中打开 SQL Editor
2. 复制 `migrations/20250101000000_initial_schema.sql` 的内容
3. 粘贴并执行

### 4. 启用 pgvector 扩展

确保 pgvector 扩展已启用（迁移脚本会自动启用）：

```sql
create extension if not exists vector;
```

### 5. 验证设置

检查表是否创建成功：

```sql
select * from information_schema.tables
where table_schema = 'public';
```

应该看到：
- boards
- cards
- connections

## 数据库结构

### boards 表
存储白板信息

| 列名 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| user_id | uuid | 用户ID |
| title | text | 白板标题 |
| canvas_state | jsonb | tldraw 状态 |
| created_at | timestamptz | 创建时间 |
| updated_at | timestamptz | 更新时间 |

### cards 表
存储卡片内容

| 列名 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| board_id | uuid | 所属白板 |
| type | text | 卡片类型 |
| content | jsonb | 卡片内容 |
| metadata | jsonb | 元数据 |
| embedding | vector(1536) | 向量表示 |
| position | jsonb | 位置信息 |
| created_at | timestamptz | 创建时间 |

### connections 表
存储卡片连接

| 列名 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| board_id | uuid | 所属白板 |
| from_card_id | uuid | 起始卡片 |
| to_card_id | uuid | 目标卡片 |
| type | text | 连接类型 |
| strength | float | 连接强度 |
| created_at | timestamptz | 创建时间 |

## 安全性

- 所有表都启用了 Row Level Security (RLS)
- 用户只能访问自己创建的白板和相关数据
- 策略已配置为自动处理权限检查

## 向量搜索

使用 `match_cards` 函数进行语义搜索：

```typescript
const { data } = await supabase.rpc('match_cards', {
  query_embedding: [0.1, 0.2, ...], // 1536维向量
  match_threshold: 0.78,
  match_count: 10
})
```

## 实时订阅

监听卡片变化：

```typescript
const channel = supabase
  .channel(`cards:${boardId}`)
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'cards' },
    (payload) => console.log(payload)
  )
  .subscribe()
```
