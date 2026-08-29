-- ParfAI analytics tracking — one-time setup
-- =============================================================================
-- Run this ONCE in the Supabase SQL Editor for this project:
--   https://supabase.com/dashboard/project/nqyiocjsovwjujvbaszr/sql/new
-- Paste the whole file and click "Run". It's safe to run more than once —
-- every statement below is guarded (IF NOT EXISTS / OR REPLACE / DROP..IF
-- EXISTS before CREATE), so re-running it after a partial failure won't
-- duplicate anything or error out.
--
-- What this adds, and why:
--   - `login_events`: the site's existing Supabase Auth doesn't keep a
--     queryable log of sign-ins by itself (only the *current* session and
--     each user's last_sign_in_at). This table gives the analytics report
--     (.github/workflows/analytics-report.yml, scripts/analytics-report.mjs)
--     something to count logins against over time.
--   - `feedback`: contact.html's form was a design demo (its submit handler
--     just showed an alert and threw the message away). This table is
--     where real submissions land once the form is wired up.
--
-- Privacy: the parfai-site GitHub repo is PUBLIC. Row Level Security below
-- deliberately blocks anyone from *reading* these tables with the public/
-- anon key that ships in the site's client-side JS — inserts are allowed
-- (so the site itself can write to them), but the analytics script reads
-- them with the service_role key, which lives only in a GitHub Actions
-- secret and bypasses RLS. The generated reports themselves only ever
-- contain aggregate counts, never raw rows — see reports/analytics/README.md.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- login_events — one row per successful sign-in
-- ---------------------------------------------------------------------------
create table if not exists public.login_events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  email text,
  created_at timestamptz not null default now()
);

alter table public.login_events enable row level security;

-- A signed-in user may log their own sign-in event. No one — including the
-- anon key — may SELECT from this table; only service_role (which bypasses
-- RLS entirely) can, which is what the analytics script uses.
drop policy if exists "insert own login event" on public.login_events;
create policy "insert own login event" on public.login_events
  for insert to authenticated
  with check (auth.uid() = user_id);

create index if not exists login_events_created_at_idx on public.login_events (created_at);
create index if not exists login_events_user_id_idx on public.login_events (user_id);

-- ---------------------------------------------------------------------------
-- feedback — contact form submissions
-- ---------------------------------------------------------------------------
create table if not exists public.feedback (
  id bigint generated always as identity primary key,
  name text,
  email text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

-- Anyone (including a logged-out visitor) may submit the contact form. As
-- with login_events, no one may read it back via the public/anon key.
drop policy if exists "anyone can submit feedback" on public.feedback;
create policy "anyone can submit feedback" on public.feedback
  for insert to anon, authenticated
  with check (true);

create index if not exists feedback_created_at_idx on public.feedback (created_at);

-- ---------------------------------------------------------------------------
-- Verify (optional) — run these separately after the block above to confirm
-- both tables exist and RLS is on:
--   select tablename, rowsecurity from pg_tables
--     where schemaname = 'public' and tablename in ('login_events','feedback');
-- ---------------------------------------------------------------------------
