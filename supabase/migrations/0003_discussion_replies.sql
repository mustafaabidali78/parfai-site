-- ParfAI discussion replies — one-time setup
-- =============================================================================
-- Run this ONCE in the Supabase SQL Editor for this project:
--   https://supabase.com/dashboard/project/nqyiocjsovwjujvbaszr/sql/new
-- Paste the whole file and click "Run". It's safe to run more than once —
-- every statement below is guarded (IF NOT EXISTS / OR REPLACE / DROP..IF
-- EXISTS before CREATE), so re-running it after a partial failure won't
-- duplicate anything or error out.
--
-- What this adds, and why:
--   - `discussion_replies`: backs the new discussion detail page
--     (discussion.html). Clicking a discussion someone actually started
--     now opens it and shows real replies, instead of doing nothing.
--     One row per reply, linked to a row in `discussions` (see 0002).
--
-- Privacy: same approach as discussions and reviews — anyone can reply (no
-- login required), and replies are public by design. Only what someone
-- types in the "Your name" field is stored. Already covered by the
-- "Content you submit, such as reviews" line in the Privacy Policy.
-- =============================================================================

create table if not exists public.discussion_replies (
  id bigint generated always as identity primary key,
  discussion_id bigint not null references public.discussions(id) on delete cascade,
  author text not null check (char_length(author) <= 60),
  body text not null check (char_length(body) <= 1000),
  created_at timestamptz not null default now()
);

alter table public.discussion_replies enable row level security;

drop policy if exists "anyone can reply to a discussion" on public.discussion_replies;
create policy "anyone can reply to a discussion" on public.discussion_replies
  for insert to anon, authenticated
  with check (true);

drop policy if exists "anyone can read discussion replies" on public.discussion_replies;
create policy "anyone can read discussion replies" on public.discussion_replies
  for select to anon, authenticated
  using (true);

create index if not exists discussion_replies_discussion_id_idx on public.discussion_replies (discussion_id);
create index if not exists discussion_replies_created_at_idx on public.discussion_replies (created_at);

-- ---------------------------------------------------------------------------
-- Verify (optional) — run separately after the block above:
--   select tablename, rowsecurity from pg_tables
--     where schemaname = 'public' and tablename = 'discussion_replies';
-- ---------------------------------------------------------------------------
