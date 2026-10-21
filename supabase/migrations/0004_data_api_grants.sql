-- 0004: explicit Data API permissions for ParfAI's tables.
--
-- Why: from 30 October 2026 Supabase no longer gives the website access to
-- new tables automatically. Existing tables on the live project already have
-- access, so running this there changes nothing. It matters when the database
-- is rebuilt from these files (new project, preview branch, local reset).
--
-- Each table gets only what the site needs. Row-level security (set in the
-- earlier migrations) still decides which rows can be read or written.
-- Safe to run more than once.

-- Visitors may add a row, nobody may read it with the public key.
grant insert on public.feedback to anon, authenticated;
grant insert on public.login_events to authenticated;

-- Visitors may read and add.
grant select, insert on public.sotd_logs to anon, authenticated;
grant select, insert on public.discussions to anon, authenticated;
grant select, insert on public.discussion_replies to anon, authenticated;

-- The analytics report reads everything with the service role key.
grant select, insert, update, delete on public.feedback to service_role;
grant select, insert, update, delete on public.login_events to service_role;
grant select, insert, update, delete on public.sotd_logs to service_role;
grant select, insert, update, delete on public.discussions to service_role;
grant select, insert, update, delete on public.discussion_replies to service_role;

-- Reviews were created outside these files, so only grant if the table exists.
do $$
begin
  if to_regclass('public.reviews') is not null then
    grant select, insert on public.reviews to anon, authenticated;
    grant select, insert, update, delete on public.reviews to service_role;
  end if;
end
$$;
