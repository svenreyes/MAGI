-- MAGI initial schema
-- A living personality graph: users, AI personality agents, social circles,
-- visibility rules, journaling, agent conversations, and imported memories.
--
-- Apply locally with:  supabase db reset   (or)  supabase migration up
-- Notes:
--   * pgvector powers similarity over personality snapshots and memories.
--   * Row Level Security is enabled on every table; owners manage their own rows.
--   * `auth.users` is provided by Supabase Auth; `public.users` extends it.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "vector";      -- pgvector embeddings

-- ---------------------------------------------------------------------------
-- Helper: keep updated_at fresh
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- users  (extends auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null unique,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references public.users (id) on delete cascade,
  username              text not null unique,
  display_name          text not null,
  bio                   text,
  avatar_url            text,
  onboarding_completed  boolean not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (user_id)
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- personality_agents
-- ---------------------------------------------------------------------------
create table if not exists public.personality_agents (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.users (id) on delete cascade,
  name                text not null,
  description         text not null,
  personality_prompt  text not null,
  visual_style        text not null default 'minimalist',
  color_palette       jsonb not null default '{}'::jsonb,
  avatar_url          text,
  avatar_prompt       text,
  default_visibility  text not null default 'private'
    check (default_visibility in ('public','friends','close_friends','family','private')),
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists personality_agents_user_id_idx
  on public.personality_agents (user_id);

create trigger personality_agents_set_updated_at
  before update on public.personality_agents
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- personality_snapshots  (how identity evolves over time)
-- ---------------------------------------------------------------------------
create table if not exists public.personality_snapshots (
  id          uuid primary key default gen_random_uuid(),
  agent_id    uuid not null references public.personality_agents (id) on delete cascade,
  user_id     uuid not null references public.users (id) on delete cascade,
  traits      jsonb not null default '{}'::jsonb,
  summary     text not null default '',
  embedding   vector(1536),
  created_at  timestamptz not null default now()
);

create index if not exists personality_snapshots_agent_id_idx
  on public.personality_snapshots (agent_id);

-- ---------------------------------------------------------------------------
-- social_circles
-- ---------------------------------------------------------------------------
create table if not exists public.social_circles (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users (id) on delete cascade,
  type         text not null default 'custom'
    check (type in ('public','friends','close_friends','family','custom')),
  name         text not null,
  description  text,
  is_public    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists social_circles_user_id_idx
  on public.social_circles (user_id);

create trigger social_circles_set_updated_at
  before update on public.social_circles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- circle_members
-- ---------------------------------------------------------------------------
create table if not exists public.circle_members (
  id                   uuid primary key default gen_random_uuid(),
  circle_id            uuid not null references public.social_circles (id) on delete cascade,
  member_user_id       uuid not null references public.users (id) on delete cascade,
  member_display_name  text not null default '',
  created_at           timestamptz not null default now(),
  unique (circle_id, member_user_id)
);

create index if not exists circle_members_circle_id_idx
  on public.circle_members (circle_id);
create index if not exists circle_members_member_user_id_idx
  on public.circle_members (member_user_id);

-- ---------------------------------------------------------------------------
-- agent_visibility_rules  (which agents each circle can see)
-- ---------------------------------------------------------------------------
create table if not exists public.agent_visibility_rules (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users (id) on delete cascade,
  agent_id    uuid not null references public.personality_agents (id) on delete cascade,
  circle_id   uuid not null references public.social_circles (id) on delete cascade,
  is_visible  boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (agent_id, circle_id)
);

create index if not exists agent_visibility_rules_agent_id_idx
  on public.agent_visibility_rules (agent_id);
create index if not exists agent_visibility_rules_circle_id_idx
  on public.agent_visibility_rules (circle_id);

create trigger agent_visibility_rules_set_updated_at
  before update on public.agent_visibility_rules
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- journal_entries
-- ---------------------------------------------------------------------------
create table if not exists public.journal_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users (id) on delete cascade,
  title       text,
  content     text not null,
  embedding   vector(1536),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists journal_entries_user_id_idx
  on public.journal_entries (user_id);

create trigger journal_entries_set_updated_at
  before update on public.journal_entries
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- agent_interactions  (viewer <-> agent conversations)
-- ---------------------------------------------------------------------------
create table if not exists public.agent_interactions (
  id              uuid primary key default gen_random_uuid(),
  owner_user_id   uuid not null references public.users (id) on delete cascade,
  agent_id        uuid not null references public.personality_agents (id) on delete cascade,
  viewer_user_id  uuid not null references public.users (id) on delete cascade,
  messages        jsonb not null default '[]'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists agent_interactions_agent_id_idx
  on public.agent_interactions (agent_id);
create index if not exists agent_interactions_viewer_user_id_idx
  on public.agent_interactions (viewer_user_id);

create trigger agent_interactions_set_updated_at
  before update on public.agent_interactions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- memory_imports  (pasted ChatGPT/Claude context)
-- ---------------------------------------------------------------------------
create table if not exists public.memory_imports (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users (id) on delete cascade,
  source        text not null default 'other'
    check (source in ('chatgpt','claude','other')),
  prompt        text not null default '',
  raw_response  text not null default '',
  embedding     vector(1536),
  created_at    timestamptz not null default now()
);

create index if not exists memory_imports_user_id_idx
  on public.memory_imports (user_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.users                  enable row level security;
alter table public.profiles               enable row level security;
alter table public.personality_agents     enable row level security;
alter table public.personality_snapshots  enable row level security;
alter table public.social_circles         enable row level security;
alter table public.circle_members         enable row level security;
alter table public.agent_visibility_rules enable row level security;
alter table public.journal_entries        enable row level security;
alter table public.agent_interactions     enable row level security;
alter table public.memory_imports         enable row level security;

-- users: a row is readable/writable by its owner.
create policy "users self access" on public.users
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- profiles: public read (profiles are meant to be visited), owner writes.
create policy "profiles public read" on public.profiles
  for select using (true);
create policy "profiles owner write" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- personality_agents: owner full access.
create policy "agents owner access" on public.personality_agents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- personality_snapshots: owner full access.
create policy "snapshots owner access" on public.personality_snapshots
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- social_circles: owner full access.
create policy "circles owner access" on public.social_circles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- circle_members: the circle owner manages members; members can read their row.
create policy "circle members owner manage" on public.circle_members
  for all
  using (
    exists (
      select 1 from public.social_circles c
      where c.id = circle_members.circle_id and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.social_circles c
      where c.id = circle_members.circle_id and c.user_id = auth.uid()
    )
  );
create policy "circle members self read" on public.circle_members
  for select using (auth.uid() = member_user_id);

-- agent_visibility_rules: owner full access.
create policy "visibility rules owner access" on public.agent_visibility_rules
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- journal_entries: owner full access.
create policy "journal owner access" on public.journal_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- agent_interactions: the agent owner and the viewer can both access the thread.
create policy "interactions participant access" on public.agent_interactions
  for all
  using (auth.uid() = owner_user_id or auth.uid() = viewer_user_id)
  with check (auth.uid() = owner_user_id or auth.uid() = viewer_user_id);

-- memory_imports: owner full access.
create policy "memory imports owner access" on public.memory_imports
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
