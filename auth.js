/* ---------- shared auth state (Supabase Auth) ----------
   Runs on every page. Updates the nav (rendered by data.js) to reflect a
   logged-in user, and exposes small helpers other scripts (reviews.js) use.
*/

/* ---------- login tracking (for the analytics scheduler) ----------
   Supabase Auth itself doesn't keep a queryable log of sign-ins, only the
   current session — so the analytics report (scripts/analytics-report.mjs,
   run by .github/workflows/analytics-report.yml) has nothing to count
   without this. Every real 'SIGNED_IN' event writes one row to the
   login_events table (see supabase/migrations/0001_analytics_tracking.sql).

   Note: Supabase can also re-fire 'SIGNED_IN' when a persisted session is
   restored in a new tab/window, not only on a fresh credentials sign-in —
   so this is "sign-in events", a reasonable activity signal, not a
   guaranteed one-row-per-distinct-login-action count. Fire-and-forget and
   never blocks the UI; if the login_events table doesn't exist yet (the
   migration hasn't been run) this just logs a console warning and moves on.
*/
async function logLoginEvent(user){
  if (!_sb || !user) return;
  try {
    await _sb.from('login_events').insert([{ user_id: user.id, email: user.email }]);
  } catch (e) {
    console.warn('logLoginEvent (login_events table may not exist yet — see supabase/README.md)', e);
  }
}

async function getCurrentUser(){
  if (!_sb) return null;
  try {
    const { data } = await _sb.auth.getSession();
    return data && data.session ? data.session.user : null;
  } catch (e) {
    console.error('getCurrentUser', e);
    return null;
  }
}

function displayNameFor(user){
  if (!user) return '';
  return (user.user_metadata && user.user_metadata.full_name) || (user.email ? user.email.split('@')[0] : 'there');
}

async function signOutUser(){
  if (!_sb) return;
  try { await _sb.auth.signOut(); } catch (e) { console.error('signOutUser', e); }
  window.location.href = 'index.html';
}

async function updateNavForAuth(){
  const navSlot = document.getElementById('nav-slot');
  if (!navSlot) return;
  const user = await getCurrentUser();
  if (!user) return; // leave the default "Log in" / "Get started" buttons as-is

  const loginBtn = navSlot.querySelector('a.btn.ghost[href="login.html"]');
  const signupBtn = navSlot.querySelector('a.btn[href="signup.html"]');
  if (loginBtn) loginBtn.remove();

  const name = displayNameFor(user);
  if (signupBtn){
    signupBtn.textContent = `Hi, ${name}`;
    signupBtn.removeAttribute('href');
    signupBtn.style.cursor = 'default';
  }

  const logout = document.createElement('a');
  logout.href = '#';
  logout.className = 'btn ghost';
  logout.textContent = 'Log out';
  logout.addEventListener('click', (e)=>{ e.preventDefault(); signOutUser(); });

  if (signupBtn && signupBtn.parentNode) signupBtn.insertAdjacentElement('afterend', logout);
  else navSlot.querySelector('.nav')?.appendChild(logout);
}

document.addEventListener('DOMContentLoaded', () => {
  // data.js's own DOMContentLoaded listener (registered earlier in document
  // order) renders the nav synchronously before this listener runs.
  updateNavForAuth();
});

if (_sb && _sb.auth) {
  _sb.auth.onAuthStateChange((event, session) => {
    updateNavForAuth();
    if (event === 'SIGNED_IN' && session && session.user) logLoginEvent(session.user);
  });
}
