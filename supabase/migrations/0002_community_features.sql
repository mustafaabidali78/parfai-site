-- ParfAI community features: Scent of the Day + Discussions — one-time setup
-- =============================================================================
-- Run this ONCE in the Supabase SQL Editor for this project:
--   https://supabase.com/dashboard/project/nqyiocjsovwjujvbaszr/sql/new
-- Paste the whole file and click "Run". It's safe to run more than once —
-- every statement below is guarded (IF NOT EXISTS / OR REPLACE / DROP..IF
-- EXISTS before CREATE), so re-running it after a partial failure won't
-- duplicate anything or error out.
--
-- What this adds, and why:
--   - `sotd_logs`: backs the "Log what you're wearing" button on
--     community.html. One row per log, shown in the Scent of the Day list.
--   - `discussions`: backs the "Start a discussion" button on
--     community.html. One row per discussion started, shown in the
--     Trending discussions list.
--
-- Privacy: same approach as reviews and feedback (see 0001) — anyone can
-- post (no login required, matching how "Write a review" already works),
-- and posts are public by design, since the whole point is other visitors
-- see them. Only what someone chooses to type in the "Your name" field is
-- stored; nothing else about them is collected. This is already covered
-- by the "Content you submit, such as reviews" line in the Privacy Policy.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- sotd_logs — one row per "what I'm wearing today" post
-- ---------------------------------------------------------------------------
create table if not exists public.sotd_logs (
  id bigint generated always as identity primary key,
  perfume_id text not null check (char_length(perfume_id) <= 100),
  author text not null check (char_length(author) <= 60),
  created_at timestamptz not null default now()
);

alter table public.sotd_logs enable row level security;

drop policy if exists "anyone can log scent of the day" on public.sotd_logs;
create policy "anyone can log scent of the day" on public.sotd_logs
  for insert to anon, authenticated
  with check (true);

drop policy if exists "anyone can read scent of the day logs" on public.sotd_logs;
create policy "anyone can read scent of the day logs" on public.sotd_logs
  for select to anon, authenticated
  using (true);

create index if not exists sotd_logs_created_at_idx on public.sotd_logs (created_at);

-- ---------------------------------------------------------------------------
-- discussions — one row per discussion thread started
-- ---------------------------------------------------------------------------
create table if not exists public.discussions (
  id bigint generated always as identity primary key,
  category text not null check (char_length(category) <= 40),
  title text not null check (char_length(title) <= 120),
  body text not null check (char_length(body) <= 1000),
  author text not null check (char_length(author) <= 60),
  created_at timestamptz not null default now()
);

alter table public.discussions enable row level security;

drop policy if exists "anyone can start a discussion" on public.discussions;
create policy "anyone can start a discussion" on public.discussions
  for insert to anon, authenticated
  with check (true);

drop policy if exists "anyone can read discussions" on public.discussions;
create policy "anyone can read discussions" on public.discussions
  for select to anon, authenticated
  using (true);

create index if not exists discussions_created_at_idx on public.discussions (created_at);

-- ---------------------------------------------------------------------------
-- Verify (optional) — run these separately after the block above to confirm
-- both tables exist and RLS is on:
--   select tablename, rowsecurity from pg_tables
--     where schemaname = 'public' and tablename in ('sotd_logs','discussions');
-- ---------------------------------------------------------------------------
