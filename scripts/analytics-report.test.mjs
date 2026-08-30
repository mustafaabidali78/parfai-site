#!/usr/bin/env node
/**
 * Offline smoke test for buildReport() — no network/Supabase needed.
 * Run with: node scripts/analytics-report.test.mjs
 *
 * This only exercises the pure report-formatting logic. The Supabase query
 * functions (countSignups/loginStats/feedbackStats/reviewStats) are thin
 * wrappers around the official @supabase/supabase-js client and are
 * exercised for real the first time the GitHub Actions workflow runs.
 */
import assert from 'node:assert/strict';
import { buildReport } from './analytics-report.mjs';

const generatedAt = new Date('2026-08-29T06:00:00.000Z');
const dateStamp = '2026-08-29';

// --- Scenario 1: fresh install, migration not run yet -----------------------
{
  const report = buildReport({
    signups: { total: 42, new24h: 1, new7d: 5 },
    logins: null,      // login_events table doesn't exist yet
    feedback: null,    // feedback table doesn't exist yet
    reviews: { total: 0, last24h: 0, last7d: 0, avgRating: null, top: [] },
    generatedAt,
    dateStamp,
  });

  assert.match(report, /# ParfAI analytics report — 2026-08-29/);
  assert.match(report, /New signups \| 1 \| 5 \| 42/);
  assert.match(report, /Login tracking isn't set up yet/);
  assert.match(report, /Feedback tracking isn't set up yet/);
  assert.match(report, /No reviews yet\./);
  assert.match(report, /Not tracked — the site has no checkout\/payment system yet/);
  // Privacy: never a raw email/name, only the aggregate note text.
  assert.doesNotMatch(report, /@/, 'report must not contain anything email-shaped');
  console.log('✓ scenario 1 (fresh install) OK');
}

// --- Scenario 2: fully set up, with real-looking data ------------------------
{
  const report = buildReport({
    signups: { total: 1204, new24h: 12, new7d: 88 },
    logins: { total: 5031, last24h: 40, last7d: 310, uniqueUsers7d: 96 },
    feedback: { total: 14, last24h: 0, last7d: 2 },
    reviews: {
      total: 233,
      last24h: 3,
      last7d: 19,
      avgRating: '4.32',
      top: [['creed-aventus', 21], ['mfk-baccarat-rouge-540', 17]],
    },
    generatedAt,
    dateStamp,
  });

  assert.match(report, /New signups \| 12 \| 88 \| 1,204/);
  assert.match(report, /Login events \| 40 \| 310 \| 5,031/);
  assert.match(report, /Unique users who logged in, last 7 days: \*\*96\*\*/);
  assert.match(report, /Average rating \(all-time\): \*\*4\.32 \/ 5\*\*/);
  assert.match(report, /1\. `creed-aventus` — 21 reviews/);
  assert.match(report, /Submissions \| 0 \| 2 \| 14/);
  assert.doesNotMatch(report, /@/, 'report must not contain anything email-shaped');
  console.log('✓ scenario 2 (fully populated) OK');
}

// --- Scenario 3: a section's query failed this run (bad key, missing table,
// transient error) — the rest of the report should still render, not crash.
{
  const report = buildReport({
    signups: null,   // e.g. auth admin query failed
    logins: null,
    feedback: { total: 3, last24h: 0, last7d: 1 },
    reviews: null,    // e.g. reviews table missing/renamed
    generatedAt,
    dateStamp,
  });

  assert.match(report, /New signups \| — \| — \| — \|/);
  assert.match(report, /Signup tracking isn't set up yet/);
  assert.match(report, /Review tracking isn't set up yet/);
  assert.match(report, /Submissions \| 0 \| 1 \| 3/);
  assert.doesNotMatch(report, /@/, 'report must not contain anything email-shaped');
  console.log('✓ scenario 3 (partial query failure) OK');
}

console.log('\nAll analytics-report tests passed.');
