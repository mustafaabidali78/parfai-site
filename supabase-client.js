/* ---------- shared Supabase client ----------
   Public project URL + anon key — safe to be public; access is governed by
   row-level security policies and Supabase Auth, not by keeping this secret.
   Loaded on every page, before data.js's helpers are needed and before
   auth.js / reviews.js, which both rely on the `_sb` client defined here.
*/
const SUPABASE_URL = 'https://nqyiocjsovwjujvbaszr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xeWlvY2pzb3Z3anVqdmJhc3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0ODk4MjUsImV4cCI6MjEwMzA2NTgyNX0.yijnTHcQ2mBor2aU-UhqE2U_awOSVrTmOC9Ias473yc';

const _sb = (typeof window !== 'undefined' && window.supabase)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
