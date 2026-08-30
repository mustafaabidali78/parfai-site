#!/usr/bin/env node
/**
 * ParfAI analytics report generator.
 *
 * Run by .github/workflows/analytics-report.yml on a schedule. Reads
 * aggregate counts from Supabase (signups, logins, reviews, feedback) and
 * writes a dated Markdown report into reports/analytics/, plus refreshes
 * reports/analytics/latest.md to point at it.
 *
 * Deliberately does NOT read or write any purchase/payment data — the site
 * has no checkout system yet (see reports/analytics/README.md).
 *
 * Privacy: this repo is public. This script only ever computes counts,
 * averages and top-N lists — it never writes a raw row (an email, a name,
 * a feedback message body) into the committed report.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (a GitHub Actions secret — see
 * supabase/README.md for how to add it). Falls back gracefully — noting
 * "not available yet" in the report instead of crashing — when that secret
 * or the login_events/feedback tables (supabase/migrations/0001_*.sql)
 * aren't set up yet, so the report is still useful before setup is finished.
 */
import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const REPORTS_DIR = join(REPO_ROOT, 'reports', 'analytics');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://nqyiocjsovwjujvbaszr.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const now = new Date();
const since24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const since7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const dateStamp = now.toISOString().slice(0, 10); // YYYY-MM-DD

function fmt(n) {
  return n === null || n === undefined ? '—' : n.toLocaleString('en-US');
}

async function countSignups(supabase) {
  // auth.admin.listUsers() is paginated — page through everything to get
  // an accurate total. Fine at this site's scale; if the user base grows
  // into the tens of thousands this should switch to a cached counter.
  let page = 1;
  let total = 0;
  let new24h = 0;
  let new7d = 0;
  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    if (!data.users.length) break;
    total += data.users.length;
    for (const u of data.users) {
      const created = new Date(u.created_at);
      if (created >= since24h) new24h++;
      if (created >= since7d) new7d++;
    }
    if (data.users.length < 200) break;
    page++;
  }
  return { total, new24h, new7d };
}

async function countTable(supabase, table, sinceCol = 'created_at') {
  const { count: total, error: e1 } = await supabase
    .from(table).select('*', { count: 'exact', head: true });
  if (e1) return null; // table probably doesn't exist yet — migration not run
  const { count: last24h } = await supabase
    .from(table).select('*', { count: 'exact', head: true }).gte(sinceCol, since24h.toISOString());
  const { count: last7d } = await supabase
    .from(table).select('*', { count: 'exact', head: true }).gte(sinceCol, since7d.toISOString());
  return { total: total || 0, last24h: last24h || 0, last7d: last7d || 0 };
}

async function loginStats(supabase) {
  const base = await countTable(supabase, 'login_events');
  if (!base) return null;
  const { data: rows7d } = await supabase
    .from('login_events').select('user_id').gte('created_at', since7d.toISOString());
  const uniqueUsers7d = new Set((rows7d || []).map((r) => r.user_id).filter(Boolean)).size;
  return { ...base, uniqueUsers7d };
}

async function feedbackStats(supabase) {
  return countTable(supabase, 'feedback');
}

async function reviewStats(supabase) {
  const { data, error } = await supabase.from('reviews').select('perfume_id,rating,created_at');
  if (error) return null; // table missing/renamed, or a permissions issue — don't take the whole report down
  const total = data.length;
  const last24h = data.filter((r) => new Date(r.created_at) >= since24h).length;
  const last7d = data.filter((r) => new Date(r.created_at) >= since7d).length;
  const avgRating = total ? (data.reduce((s, r) => s + (r.rating || 0), 0) / total).toFixed(2) : null;
  const byPerfume = {};
  for (const r of data) byPerfume[r.perfume_id] = (byPerfume[r.perfume_id] || 0) + 1;
  const top = Object.entries(byPerfume).sort((a, b) => b[1] - a[1]).slice(0, 5);
  return { total, last24h, last7d, avgRating, top };
}

function statsTable(rows) {
  const header = '| Metric | Last 24h | Last 7d | All-time |\n|---|---:|---:|---:|';
  return [header, ...rows].join('\n');
}

function notSetUpNote(what, migrationLine) {
  return `> ⚠️ **${what} tracking isn't set up yet.** ${migrationLine}\n`;
}

// Pure — takes already-fetched stats and today's date, returns the Markdown
// report body. Kept separate from main() so it can be unit-tested (see
// scripts/analytics-report.test.mjs) without needing a live Supabase
// connection, and so the query logic above stays independently testable too.
export function buildReport({ signups, logins, feedback, reviews, generatedAt, dateStamp: ds }) {
  const lines = [];
  lines.push(`# ParfAI analytics report — ${ds}`);
  lines.push('');
  lines.push(
    '_Generated automatically by [`.github/workflows/analytics-report.yml`](../../.github/workflows/analytics-report.yml) ' +
    `at ${generatedAt.toISOString()}. Aggregate counts only — no names, emails, or message text are included ` +
    '(this repo is public). See [reports/analytics/README.md](./README.md) for what each number means ' +
    'and the current setup status._'
  );
  lines.push('');

  lines.push('## Signups & logins');
  lines.push('');
  if (!signups) {
    lines.push(notSetUpNote('Signup', 'Could not read the user list this run (see the workflow log for the underlying error) — this needs the `SUPABASE_SERVICE_ROLE_KEY` secret to have admin access to Supabase Auth.'));
  }
  lines.push(statsTable([
    signups
      ? `| New signups | ${fmt(signups.new24h)} | ${fmt(signups.new7d)} | ${fmt(signups.total)} |`
      : `| New signups | — | — | — |`,
    logins
      ? `| Login events | ${fmt(logins.last24h)} | ${fmt(logins.last7d)} | ${fmt(logins.total)} |`
      : `| Login events | — | — | — |`,
  ]));
  if (logins) {
    lines.push('');
    lines.push(`Unique users who logged in, last 7 days: **${fmt(logins.uniqueUsers7d)}**`);
  } else {
    lines.push('');
    lines.push(notSetUpNote('Login', 'Run `supabase/migrations/0001_analytics_tracking.sql` once in the Supabase SQL editor, then logins will start counting from that point forward (it does not backfill history that wasn\'t recorded).'));
  }
  lines.push('');

  lines.push('## Reviews');
  lines.push('');
  if (reviews) {
    lines.push(statsTable([
      `| New reviews | ${fmt(reviews.last24h)} | ${fmt(reviews.last7d)} | ${fmt(reviews.total)} |`,
    ]));
    lines.push('');
    lines.push(`Average rating (all-time): **${reviews.avgRating ?? 'n/a'} / 5**`);
    lines.push('');
    if (reviews.top.length) {
      lines.push('Most-reviewed fragrances (all-time):');
      lines.push('');
      reviews.top.forEach(([perfumeId, count], i) => {
        lines.push(`${i + 1}. \`${perfumeId}\` — ${fmt(count)} review${count === 1 ? '' : 's'}`);
      });
    } else {
      lines.push('_No reviews yet._');
    }
  } else {
    lines.push(notSetUpNote('Review', 'Could not read the `reviews` table this run — it may not exist yet, or its columns differ from `perfume_id, rating, created_at`.'));
  }
  lines.push('');

  lines.push('## Feedback (contact form)');
  lines.push('');
  if (feedback) {
    lines.push(statsTable([
      `| Submissions | ${fmt(feedback.last24h)} | ${fmt(feedback.last7d)} | ${fmt(feedback.total)} |`,
    ]));
  } else {
    lines.push(notSetUpNote('Feedback', 'Run `supabase/migrations/0001_analytics_tracking.sql` once in the Supabase SQL editor — the contact form (contact.html) is already wired up to write here once the table exists.'));
  }
  lines.push('');

  lines.push('## Purchases');
  lines.push('');
  lines.push('_Not tracked — the site has no checkout/payment system yet (Pricing is marketing copy only). This section will be added once real purchase data exists._');
  lines.push('');

  return lines.join('\n') + '\n';
}

async function main() {
  if (!SERVICE_KEY) {
    console.error(
      'Missing SUPABASE_SERVICE_ROLE_KEY. This script needs it to read auth.users and ' +
      'the login_events/feedback tables (RLS blocks the public anon key from reading them ' +
      'on purpose — see supabase/migrations/0001_analytics_tracking.sql). Add it as a ' +
      'GitHub Actions secret named SUPABASE_SERVICE_ROLE_KEY — see supabase/README.md.'
    );
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

  // Run each section independently: one bad table or a permissions hiccup on
  // one section should not stop the whole report from being generated — the
  // real error still gets logged here so it's visible in the workflow run.
  async function safely(label, fn) {
    try {
      return await fn(supabase);
    } catch (err) {
      console.error(`${label} query failed:`, err);
      return null;
    }
  }

  const [signups, logins, feedback, reviews] = await Promise.all([
    safely('signups', countSignups),
    safely('logins', loginStats),
    safely('feedback', feedbackStats),
    safely('reviews', reviewStats),
  ]);

  const report = buildReport({ signups, logins, feedback, reviews, generatedAt: now, dateStamp });

  mkdirSync(REPORTS_DIR, { recursive: true });
  writeFileSync(join(REPORTS_DIR, `${dateStamp}.md`), report);
  writeFileSync(join(REPORTS_DIR, 'latest.md'), report);

  console.log(`Wrote reports/analytics/${dateStamp}.md and reports/analytics/latest.md`);
}

// Only auto-run when executed directly (`node scripts/analytics-report.mjs`),
// not when imported by the test file.
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error('analytics-report.mjs failed:', err);
    process.exit(1);
  });
}
