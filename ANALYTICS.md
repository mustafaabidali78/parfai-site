# Analytics scheduler

A scheduled system that tracks signups, logins, reviews, and contact-form
feedback for parfai.org, and reports on them automatically. Two parts work
together:

1. **A GitHub Actions workflow** does the real work — queries Supabase on a
   schedule and commits a Markdown report into this repo. This is the
   system of record: it runs independently of any chat session, and every
   run is permanently versioned in git.
2. **A weekly Claude check-in** reads that report and gives you a short,
   plain-English summary — the "someone glances at this so you don't have
   to" layer on top of the raw numbers.

Purchases are **not** tracked — the site has no checkout/payment system
yet (Pricing is marketing copy only; "Get started"/"Upgrade to Pro" just
link to signup). Add that section once real purchase data exists.

## 1. The GitHub Actions report

| | |
|---|---|
| Workflow | [`.github/workflows/analytics-report.yml`](.github/workflows/analytics-report.yml) |
| Script | [`scripts/analytics-report.mjs`](scripts/analytics-report.mjs) (tested by `scripts/analytics-report.test.mjs`) |
| Schedule | Daily, 06:00 UTC — plus a manual **Run workflow** button in the Actions tab |
| Output | [`reports/analytics/latest.md`](reports/analytics/latest.md) + a dated snapshot per day |
| One-time setup | [`supabase/README.md`](supabase/README.md) — run a SQL migration, add one GitHub secret |

It reads Supabase for:

- **Signups** — from Supabase Auth directly. Works immediately, no setup.
- **Logins** — from a new `login_events` table, written by
  [`auth.js`](auth.js)'s `logLoginEvent()` every time someone signs in.
- **Reviews** — from the `reviews` table that already powered the site's
  review feature before this scheduler existed.
- **Feedback** — from a new `feedback` table, written by the contact form
  ([`contact.html`](contact.html)), which used to just show an alert and
  discard the message.

Every number is an aggregate (a count, an average, a top-5 list) — see
[`reports/analytics/README.md`](reports/analytics/README.md) for why that
matters (this repo is public).

## 2. The weekly Claude check-in

A scheduled task (Monday mornings) fetches `reports/analytics/latest.md`
from GitHub and messages you a short summary — current numbers, and
anything worth noticing (a spike, a metric still at zero, setup that
hasn't happened yet). It's a separate, editable schedule — ask me
("check the site analytics more/less often", "change the day", "stop the
weekly check-in") any time and I'll update or remove it. It doesn't store
any code of its own; it's just a standing instruction that reads the same
GitHub-hosted report described above.

## Everything this scheduler touches

```
.github/workflows/analytics-report.yml   the cron job
scripts/analytics-report.mjs             query + report-building logic
scripts/analytics-report.test.mjs        offline tests for the report format
package.json                             declares @supabase/supabase-js for the script
supabase/migrations/0001_analytics_tracking.sql   creates login_events + feedback tables
supabase/README.md                       one-time setup steps
reports/analytics/                       every report ever generated, one file per day
auth.js                                  writes to login_events on sign-in
contact.html                             writes to feedback on form submit (was a no-op demo before)
ANALYTICS.md                             this file
```

Nothing here depends on any single chat session or sandbox — the workflow
file, the script, the migration, and every generated report all live in
this git repository, which is exactly what makes them safe to come back to
later.
