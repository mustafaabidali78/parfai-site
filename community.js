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
  const perfumeOptions = PERFUMES.slice().sort((a,b)=>a.name.localeCompare(b.name))
    .map(p=>`<option value="${p.id}">${p.name} (${houseName(p.houseId)})</option>`).join('');

  const backdrop = document.createElement('div');
  backdrop.className = 'rvmodal-backdrop';
  backdrop.innerHTML = `
    <div class="rvmodal">
      <button type="button" class="close" aria-label="Close">✕</button>
      <h2>Log what you're wearing</h2>
      <p class="sub" style="font-size:13px;color:var(--muted);margin-bottom:18px">Let the community know what's on today.</p>
      <form id="sotd-form">
        <div class="field"><label>Fragrance</label><select id="sotd-perfume" required><option value="">Choose a fragrance…</option>${perfumeOptions}</select></div>
        <div class="field"><label>Your name</label><input id="sotd-author" type="text" value="${prefillName.replace(/"/g,'&quot;')}" placeholder="e.g. FragBro" maxlength="60" required></div>
        <button class="btn block" type="submit">Log it</button>
        <div id="sotd-msg"></div>
      </form>
    </div>`;
  document.body.appendChild(backdrop);

  function close(){ backdrop.remove(); }
  backdrop.addEventListener('click', (e)=>{ if (e.target === backdrop) close(); });
  backdrop.querySelector('.close').addEventListener('click', close);
  document.addEventListener('keydown', function esc(e){ if (e.key === 'Escape'){ close(); document.removeEventListener('keydown', esc); } });

  backdrop.querySelector('#sotd-form').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const msg = backdrop.querySelector('#sotd-msg');
    const perfumeId = backdrop.querySelector('#sotd-perfume').value;
    const author = backdrop.querySelector('#sotd-author').value.trim();
    if (!perfumeId){ msg.className='rvmsg err'; msg.textContent='Please choose a fragrance.'; return; }
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
  return { t: row.title, c: row.category, r: 0, live: true };
}

async function submitDiscussion({ category, title, body, author }){
  if (!_sb) return { error: { message: 'This feature is unavailable right now, please try again later.' } };
  try {
    return await _sb.from('discussions').insert([{ category, title, body, author }]);
  } catch (e) {
    return { error: e };
  }
}

async function openDiscussionModal(){
  const loggedInUser = typeof getCurrentUser === 'function' ? await getCurrentUser() : null;
  const prefillName = loggedInUser && typeof displayNameFor === 'function' ? displayNameFor(loggedInUser) : '';
  const categoryOptions = DISCUSSION_CATEGORIES.map(c=>`<option value="${c}">${c}</option>`).join('');

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
        <div class="field"><label>Your name</label><input id="disc-author" type="text" value="${prefillName.replace(/"/g,'&quot;')}" placeholder="e.g. FragBro" maxlength="60" required></div>
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

/* ---------- wire up buttons ---------- */

function bindCommunityButtons(){
  document.querySelectorAll('[data-log-sotd]').forEach(el=>{
    el.addEventListener('click', (e)=>{ e.preventDefault(); openSotdModal(); });
  });
  document.querySelectorAll('[data-start-discussion]').forEach(el=>{
    el.addEventListener('click', (e)=>{ e.preventDefault(); openDiscussionModal(); });
  });
}
document.addEventListener('DOMContentLoaded', bindCommunityButtons);
