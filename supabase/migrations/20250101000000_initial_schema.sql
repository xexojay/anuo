-- 启用 pgvector 扩展用于向量搜索
create extension if not exists vector;

-- Boards 表：存储白板信息
create table public.boards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  canvas_state jsonb not null default '{}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Cards 表：存储卡片内容（搜索结果、笔记、聚类）
create table public.cards (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references public.boards(id) on delete cascade not null,
  type text check (type in ('search_result', 'note', 'cluster')) not null,
  content jsonb not null,
  metadata jsonb default '{}'::jsonb,
  embedding vector(1536), -- OpenAI text-embedding-3-small 维度
  position jsonb not null,
  created_at timestamptz default now() not null
);

-- Connections 表：存储卡片之间的连接关系
create table public.connections (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references public.boards(id) on delete cascade not null,
  from_card_id uuid references public.cards(id) on delete cascade not null,
  to_card_id uuid references public.cards(id) on delete cascade not null,
  type text check (type in ('semantic', 'temporal', 'manual')) not null,
  strength float,
  created_at timestamptz default now() not null
);

-- 为向量搜索创建索引 (IVFFlat)
create index on public.cards using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- 为常用查询创建索引
create index cards_board_id_idx on public.cards(board_id);
create index connections_board_id_idx on public.connections(board_id);
create index boards_user_id_idx on public.boards(user_id);

-- 启用 Row Level Security (RLS)
alter table public.boards enable row level security;
alter table public.cards enable row level security;
alter table public.connections enable row level security;

-- RLS 策略：用户只能访问自己的白板
create policy "Users can view their own boards"
  on public.boards for select
  using (auth.uid() = user_id);

create policy "Users can insert their own boards"
  on public.boards for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own boards"
  on public.boards for update
  using (auth.uid() = user_id);

create policy "Users can delete their own boards"
  on public.boards for delete
  using (auth.uid() = user_id);

-- RLS 策略：用户可以访问自己白板上的卡片
create policy "Users can view cards on their boards"
  on public.cards for select
  using (
    exists (
      select 1 from public.boards
      where boards.id = cards.board_id
      and boards.user_id = auth.uid()
    )
  );

create policy "Users can insert cards on their boards"
  on public.cards for insert
  with check (
    exists (
      select 1 from public.boards
      where boards.id = cards.board_id
      and boards.user_id = auth.uid()
    )
  );

create policy "Users can update cards on their boards"
  on public.cards for update
  using (
    exists (
      select 1 from public.boards
      where boards.id = cards.board_id
      and boards.user_id = auth.uid()
    )
  );

create policy "Users can delete cards on their boards"
  on public.cards for delete
  using (
    exists (
      select 1 from public.boards
      where boards.id = cards.board_id
      and boards.user_id = auth.uid()
    )
  );

-- RLS 策略：连接关系
create policy "Users can view connections on their boards"
  on public.connections for select
  using (
    exists (
      select 1 from public.boards
      where boards.id = connections.board_id
      and boards.user_id = auth.uid()
    )
  );

create policy "Users can insert connections on their boards"
  on public.connections for insert
  with check (
    exists (
      select 1 from public.boards
      where boards.id = connections.board_id
      and boards.user_id = auth.uid()
    )
  );

create policy "Users can delete connections on their boards"
  on public.connections for delete
  using (
    exists (
      select 1 from public.boards
      where boards.id = connections.board_id
      and boards.user_id = auth.uid()
    )
  );

-- 创建向量相似度搜索函数
create or replace function match_cards(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content jsonb,
  similarity float
)
language sql stable
as $$
  select
    cards.id,
    cards.content,
    1 - (cards.embedding <=> query_embedding) as similarity
  from public.cards
  where cards.embedding <=> query_embedding < 1 - match_threshold
  order by cards.embedding <=> query_embedding
  limit match_count;
$$;

-- 自动更新 updated_at 触发器
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_boards_updated_at
  before update on public.boards
  for each row
  execute function update_updated_at_column();

-- 注释
comment on table public.boards is '白板数据表';
comment on table public.cards is '卡片数据表，包含搜索结果、笔记、聚类等';
comment on table public.connections is '卡片之间的连接关系表';
comment on function match_cards is '基于向量相似度搜索相关卡片';
