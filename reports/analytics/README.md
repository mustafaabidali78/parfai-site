# Analytics reports

Generated automatically, daily at 06:00 UTC, by
[`.github/workflows/analytics-report.yml`](../../.github/workflows/analytics-report.yml)
running [`scripts/analytics-report.mjs`](../../scripts/analytics-report.mjs).
See the top-level [`ANALYTICS.md`](../../ANALYTICS.md) for how the whole
scheduler fits together (including the weekly Claude check-in).

- **`latest.md`** — always the most recent report. Link to this one if you
  just want "what does it look like right now".
- **`YYYY-MM-DD.md`** — one snapshot per day it ran, kept forever as a
  running history (it's just Markdown text, effectively free to store).

## What's tracked

| Section | Source | Status as of setup |
|---|---|---|
| Signups | Supabase Auth (`auth.users`) | Live immediately — no setup needed |
| Logins | `login_events` table | Needs [`supabase/migrations/0001_analytics_tracking.sql`](../../supabase/migrations/0001_analytics_tracking.sql) run once |
| Reviews | `reviews` table | Live immediately — already existed before the scheduler |
| Feedback | `feedback` table (contact form) | Needs the same migration as logins |
| Purchases | — | Not tracked. The site has no checkout/payment system yet — see `ANALYTICS.md` |

## Privacy — why you'll never see a raw email or name in here

This repository is **public**. Every report is aggregate-only by design —
counts, averages, and a top-5 list of perfume IDs by review count. The
script (`scripts/analytics-report.mjs`) never writes an individual row
(an email address, a person's name, a feedback message body) into a
report file. If you ever need to look at real submissions, that requires
querying Supabase directly with the service-role key — never do it by
having a report or a script write raw rows into this repo.
