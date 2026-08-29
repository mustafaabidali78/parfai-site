# Supabase setup for the analytics scheduler

One-time setup so the analytics scheduler (`.github/workflows/analytics-report.yml`)
can produce full reports. Until you do this, the report still runs and
still commits — it just shows "not set up yet" for logins and feedback,
and signups/reviews will still work since they don't depend on it.

## 1. Run the migration

Open the SQL editor for this project —
https://supabase.com/dashboard/project/nqyiocjsovwjujvbaszr/sql/new — paste
the contents of [`migrations/0001_analytics_tracking.sql`](./migrations/0001_analytics_tracking.sql),
and click **Run**. It creates two tables (`login_events`, `feedback`) with
row-level security that blocks anyone from reading them with the site's
public anon key — only an insert (writing a new row) is allowed from the
browser. Safe to run more than once.

## 2. Add the service-role key as a GitHub secret

The analytics script needs to *read* those tables (and the full user list,
for signup counts) — which requires the **service_role** key, not the
public anon key already in `supabase-client.js`. The service_role key
bypasses row-level security entirely, so:

- **Never** put it in any file in this repo, and never paste it into a
  chat with an AI assistant (including Claude) — it's a full-access
  credential, treat it like a password.
- Add it directly through GitHub's own UI, where it's encrypted at rest
  and never shown again after saving:
  1. Supabase dashboard → **Settings → API** → copy the **service_role**
     secret (not the anon/public one).
  2. GitHub → this repo → **Settings → Secrets and variables → Actions →
     New repository secret**.
  3. Name: `SUPABASE_SERVICE_ROLE_KEY`. Value: paste the key. Save.

That's it — the next scheduled run (or a manual one, see below) will pick
it up automatically via `${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}` in the
workflow file. It's never printed to logs.

## Running it manually

GitHub → this repo → **Actions** tab → **Analytics report** workflow →
**Run workflow**. Useful right after finishing setup, to confirm
everything's wired up without waiting for the next 06:00 UTC run.

## Rotating the key

If the service-role key is ever exposed, rotate it from Supabase
**Settings → API**, then update the `SUPABASE_SERVICE_ROLE_KEY` GitHub
secret to the new value (same steps as above — GitHub secrets are
overwrite-only, there's no separate "update" flow, just save a new value
under the same name).
