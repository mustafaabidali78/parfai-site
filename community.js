/* ---------- community features: Scent of the Day + Discussions (Supabase) ----------
   Same pattern as reviews.js: access is controlled entirely by the row-level
   security policies on the `sotd_logs` and `discussions` tables (anyone can
   read, anyone can insert). Relies on the shared `_sb` client from
   supabase-client.js (loaded first). The review-modal helpers in reviews.js
   aren't required here, these build their own small modals so this file
   works standalone on any page that includes it.
   Requires the tables created by supabase/migrations/0002_community_features.sql.
*/

function timeAgo(dateStr){
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const s = Math.max(0, Math.floor(diffMs / 1000));
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

/* ---------- Scent of the Day ---------- */

async function fetchLiveSotd(limit){
  if (!_sb) return [];
  try {
    const { data, error } = await _sb.from('sotd_logs').select('*').order('created_at', { ascending: false }).limit(limit || 20);
    if (error) { console.error('fetchLiveSotd', error); return []; }
    return data || [];
  } catch (e) {
    console.error('fetchLiveSotd', e);
    return [];
  }
}

function liveSotdToCardShape(row){
  const p = typeof perfumeById === 'function' ? perfumeById(row.perfume_id) : null;
  return { u: row.author, w: p ? p.name : row.perfume_id, id: row.perfume_id, t: timeAgo(row.created_at), live: true };
}

async function submitSotd({ perfumeId, author }){
  if (!_sb) return { error: { message: 'This feature is unavailable right now, please try again later.' } };
  try {
    return await _sb.from('sotd_logs').insert([{ perfume_id: perfumeId, author }]);
  } catch (e) {
    return { error: e };
  }
}

async function openSotdModal(){
  const loggedInUser = typeof getCurrentUser === 'function' ? await getCurrentUser() : null;
  const prefillName = loggedInUser && typeof displayNameFor === 'function' ? displayNameFor(loggedInUser) : '';
  const backdrop = document.createElement('div');
  backdrop.className = 'rvmodal-backdrop';
  backdrop.innerHTML = `
    <div class="rvmodal">
      <button type="button" class="close" aria-label="Close">✕</button>
      <h2>Log what you're wearing</h2>
      <p class="sub" style="font-size:13px;color:var(--muted);margin-bottom:18px">Let the community know what's on today.</p>
      <form id="sotd-form">
        <div class="field"><label>Fragrance</label>${perfumePickerHTML('sotd')}</div>
        <div class="field"><label>Your name</label><input id="sotd-author" type="text" value="${escHtml(prefillName)}" placeholder="e.g. FragBro" maxlength="60" required></div>
        <button class="btn block" type="submit">Log it</button>
        <div id="sotd-msg"></div>
      </form>
    </div>`;
  document.body.appendChild(backdrop);

  const getPerfume = bindPerfumePicker(backdrop, 'sotd');
  function close(){ backdrop.remove(); }
  backdrop.addEventListener('click', (e)=>{ if (e.target === backdrop) close(); });
  backdrop.querySelector('.close').addEventListener('click', close);
  document.addEventListener('keydown', function esc(e){ if (e.key === 'Escape'){ close(); document.removeEventListener('keydown', esc); } });

  backdrop.querySelector('#sotd-form').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const msg = backdrop.querySelector('#sotd-msg');
    const perfumeId = getPerfume();
    const author = backdrop.querySelector('#sotd-author').value.trim();
    if (!perfumeId){ msg.className='rvmsg err'; msg.textContent='Please pick a fragrance from the list.'; return; }
    if (!author){ msg.className='rvmsg err'; msg.textContent='Please enter your name.'; return; }

    const btn = e.target.querySelector('button[type=submit]');
    btn.disabled = true;
    const { error } = await submitSotd({ perfumeId, author });
    btn.disabled = false;
    if (error){
      msg.className='rvmsg err';
      msg.textContent = error.message && error.message.includes('does not exist')
        ? 'This feature is still being set up, please check back soon.'
        : 'Something went wrong, please try again.';
      console.error(error);
      return;
    }
    msg.className = 'rvmsg ok';
    msg.textContent = "Logged, thanks for sharing!";
    bumpStreak();
    window.dispatchEvent(new CustomEvent('parfai:sotd-posted'));
    setTimeout(close, 1200);
  });
}

/* ---------- Discussions ---------- */

const DISCUSSION_CATEGORIES = ['Recommendations', 'General talk', 'Beginners', 'Deals', 'Swaps'];

async function fetchLiveDiscussions(limit){
  if (!_sb) return [];
  try {
    const { data, error } = await _sb.from('discussions').select('*').order('created_at', { ascending: false }).limit(limit || 20);
    if (error) { console.error('fetchLiveDiscussions', error); return []; }
    return data || [];
  } catch (e) {
    console.error('fetchLiveDiscussions', e);
    return [];
  }
}

function liveDiscussionToCardShape(row){
  return { t: row.title, c: row.category, r: 0, live: true, id: row.id };
}

async function submitDiscussion({ category, title, body, author }){
  if (!_sb) return { error: { message: 'This feature is unavailable right now, please try again later.' } };
  try {
    return await _sb.from('discussions').insert([{ category, title, body, author }]);
  } catch (e) {
    return { error: e };
  }
}

async function fetchDiscussionById(id){
  if (!_sb) return null;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) return null;
  try {
    const { data, error } = await _sb.from('discussions').select('*').eq('id', numericId).maybeSingle();
    if (error) { console.error('fetchDiscussionById', error); return null; }
    return data || null;
  } catch (e) {
    console.error('fetchDiscussionById', e);
    return null;
  }
}

/* ---------- Discussion replies ---------- */

async function fetchReplies(discussionId, limit){
  if (!_sb) return [];
  try {
    const { data, error } = await _sb.from('discussion_replies').select('*').eq('discussion_id', discussionId).order('created_at', { ascending: true }).limit(limit || 200);
    if (error) { console.error('fetchReplies', error); return []; }
    return data || [];
  } catch (e) {
    console.error('fetchReplies', e);
    return [];
  }
}

async function submitReply({ discussionId, author, body }){
  if (!_sb) return { error: { message: 'This feature is unavailable right now, please try again later.' } };
  try {
    return await _sb.from('discussion_replies').insert([{ discussion_id: discussionId, author, body }]);
  } catch (e) {
    return { error: e };
  }
}

async function openDiscussionModal(opts){
  opts = opts || {};
  const loggedInUser = typeof getCurrentUser === 'function' ? await getCurrentUser() : null;
  const prefillName = loggedInUser && typeof displayNameFor === 'function' ? displayNameFor(loggedInUser) : '';
  const categoryOptions = DISCUSSION_CATEGORIES.map(c=>`<option value="${c}"${opts.category===c?' selected':''}>${DISCUSSION_LABELS[c]||c}</option>`).join('');

  const backdrop = document.createElement('div');
  backdrop.className = 'rvmodal-backdrop';
  backdrop.innerHTML = `
    <div class="rvmodal">
      <button type="button" class="close" aria-label="Close">✕</button>
      <h2>Start a discussion</h2>
      <p class="sub" style="font-size:13px;color:var(--muted);margin-bottom:18px">Ask a question or start a conversation with the community.</p>
      <form id="disc-form">
        <div class="field"><label>Category</label><select id="disc-category" required><option value="">Choose a category…</option>${categoryOptions}</select></div>
        <div class="field"><label>Title</label><input id="disc-title" type="text" placeholder="What's on your mind?" maxlength="120" required></div>
        <div class="field"><label>Message</label><textarea id="disc-body" rows="4" maxlength="1000" placeholder="Add some detail…" required></textarea></div>
        <div class="field"><label>Your name</label><input id="disc-author" type="text" value="${escHtml(prefillName)}" placeholder="e.g. FragBro" maxlength="60" required></div>
        <button class="btn block" type="submit">Post discussion</button>
        <div id="disc-msg"></div>
      </form>
    </div>`;
  document.body.appendChild(backdrop);

  function close(){ backdrop.remove(); }
  backdrop.addEventListener('click', (e)=>{ if (e.target === backdrop) close(); });
  backdrop.querySelector('.close').addEventListener('click', close);
  document.addEventListener('keydown', function esc(e){ if (e.key === 'Escape'){ close(); document.removeEventListener('keydown', esc); } });

  backdrop.querySelector('#disc-form').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const msg = backdrop.querySelector('#disc-msg');
    const category = backdrop.querySelector('#disc-category').value;
    const title = backdrop.querySelector('#disc-title').value.trim();
    const body = backdrop.querySelector('#disc-body').value.trim();
    const author = backdrop.querySelector('#disc-author').value.trim();
    if (!category){ msg.className='rvmsg err'; msg.textContent='Please choose a category.'; return; }
    if (!title || !body){ msg.className='rvmsg err'; msg.textContent='Please fill in a title and message.'; return; }
    if (!author){ msg.className='rvmsg err'; msg.textContent='Please enter your name.'; return; }

    const btn = e.target.querySelector('button[type=submit]');
    btn.disabled = true;
    const { error } = await submitDiscussion({ category, title, body, author });
    btn.disabled = false;
    if (error){
      msg.className='rvmsg err';
      msg.textContent = error.message && error.message.includes('does not exist')
        ? 'This feature is still being set up, please check back soon.'
        : 'Something went wrong, please try again.';
      console.error(error);
      return;
    }
    msg.className = 'rvmsg ok';
    msg.textContent = 'Posted, thank you!';
    window.dispatchEvent(new CustomEvent('parfai:discussion-posted'));
    setTimeout(close, 1200);
  });
}


/* ---------- extras for the Community page ---------- */
const DISCUSSION_LABELS = { 'Recommendations': 'Ask & recommend', 'General talk': 'General perfume talk', 'Beginners': 'New to fragrance', 'Deals': 'Deals & where to buy', 'Swaps': 'Decants & swaps' };

async function fetchCount(table, sinceIso){
  if (!_sb) return 0;
  try {
    let q = _sb.from(table).select('*', { count: 'exact', head: true });
    if (sinceIso) q = q.gte('created_at', sinceIso);
    const { count, error } = await q;
    return error ? 0 : (count || 0);
  } catch (e) { return 0; }
}
async function fetchReplyCounts(){
  if (!_sb) return {};
  try {
    const { data, error } = await _sb.from('discussion_replies').select('discussion_id').limit(2000);
    if (error) return {};
    const m = {}; (data || []).forEach(r => { m[r.discussion_id] = (m[r.discussion_id] || 0) + 1; });
    return m;
  } catch (e) { return {}; }
}

/* Scent of the Day streak. It is kept on this device only (nothing is sent anywhere), so it is honest but private. */
function dayStr(d){ return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); }
function readStreak(){
  try {
    const o = JSON.parse(localStorage.getItem('parfai_streak') || 'null');
    if (!o || !o.last) return { n: 0, today: false, days: [] };
    const t = dayStr(new Date()), y = dayStr(new Date(Date.now() - 864e5));
    const alive = o.last === t || o.last === y;
    return { n: alive ? o.n : 0, today: o.last === t, days: o.days || [] };
  } catch (e) { return { n: 0, today: false, days: [] }; }
}
function bumpStreak(){
  try {
    const t = dayStr(new Date()), y = dayStr(new Date(Date.now() - 864e5));
    const o = JSON.parse(localStorage.getItem('parfai_streak') || 'null') || { n: 0, last: '', days: [] };
    if (o.last === t) return;
    o.n = (o.last === y) ? o.n + 1 : 1; o.last = t;
    o.days = (o.days || []).concat(t).slice(-14);
    localStorage.setItem('parfai_streak', JSON.stringify(o));
  } catch (e) {}
}

/* Weekly prompts: ideas for what to review. They rotate every Monday. Nothing here is a score or a prize. */
const WEEKLY_PROMPTS = [
  ['Review something woody', 'Pick any fragrance with oud, cedar, vetiver or sandalwood and tell us how it wears.'],
  ['Review your most worn scent', 'The bottle you reach for without thinking. What makes it yours?'],
  ['Review a dupe you love', 'An affordable fragrance that smells far more expensive than it is.'],
  ['Review a summer scent', 'Something fresh, citrusy or light that works in the heat.'],
  ['Review a vanilla you like', 'Sweet, creamy, smoky or spicy. How does it behave on skin?'],
  ['Review a signature scent', 'The one people recognise you by. Do you get compliments?'],
  ['Review a blind buy', 'Did it pay off or not? Help someone avoid a mistake or take a chance.'],
  ['Review a gift you gave or got', 'How did it go down, and would you do it again?'],
  ['Review a fall favourite', 'Warm, spicy, smoky or cosy. What do you wear when the weather turns?'],
  ['Review a floral', 'Rose, jasmine, iris or something unexpected. Soft or loud?'],
  ['Review an office-safe scent', 'Something polite that will not bother anyone at work.'],
  ['Review a date-night scent', 'What do you wear when you want to be remembered?']
];
function weekIndex(){ const d = new Date(); const s = new Date(d.getFullYear(), 0, 1); return Math.floor((d - s) / 6048e5); }
function thisWeekPrompts(){ const w = weekIndex(), n = WEEKLY_PROMPTS.length; return [0, 1, 2].map(i => WEEKLY_PROMPTS[(w * 3 + i) % n]); }
function mondayIso(){ const d = new Date(); const day = (d.getDay() + 6) % 7; d.setHours(0,0,0,0); d.setDate(d.getDate() - day); return d.toISOString(); }

/* ---------- wire up buttons ---------- */

function bindCommunityButtons(){
  document.querySelectorAll('[data-log-sotd]').forEach(el=>{
    if (el.dataset.bound) return; el.dataset.bound = '1';
    el.addEventListener('click', (e)=>{ e.preventDefault(); openSotdModal(); });
  });
  document.querySelectorAll('[data-start-discussion]').forEach(el=>{
    if (el.dataset.bound) return; el.dataset.bound = '1';
    el.addEventListener('click', (e)=>{ e.preventDefault(); openDiscussionModal({ category: el.dataset.category || '' }); });
  });
}
document.addEventListener('DOMContentLoaded', bindCommunityButtons);
