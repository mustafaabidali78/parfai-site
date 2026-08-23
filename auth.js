/* ---------- shared auth state (Supabase Auth) ----------
   Runs on every page. Updates the nav (rendered by data.js) to reflect a
   logged-in user, and exposes small helpers other scripts (reviews.js) use.
*/

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
  _sb.auth.onAuthStateChange(() => { updateNavForAuth(); });
}
