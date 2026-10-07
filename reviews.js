/* ---------- live reviews (Supabase) ----------
   Access is controlled entirely by the row-level security policies on the
   `reviews` table (anyone can read, anyone can insert within basic limits).
   Relies on the shared `_sb` client from supabase-client.js (loaded first).
*/


/* ---------- shared helpers ---------- */
function escHtml(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// Perfume names for saved posts. Posts store either an id from the small hand-written list in data.js
// or a catalogue slug. Call primePerfumes() once; after that perfumeInfo(id) works everywhere.
let _pfBySlug = null;
function primePerfumes(){
  if (typeof PFC === 'undefined') return Promise.resolve();
  return PFC.load().then(d => { _pfBySlug = {}; d.rows.forEach(r => { _pfBySlug[r.slug] = r; }); }).catch(() => {});
}
function perfumeInfo(id){
  const old = typeof perfumeById === 'function' ? perfumeById(id) : null;
  if (old) return { name: old.name, house: typeof houseName === 'function' ? houseName(old.houseId) : '', href: 'perfume.html?id=' + encodeURIComponent(id) };
  const r = _pfBySlug && _pfBySlug[id];
  if (r) return { name: r.name, house: r.house, href: 'catalog.html?id=' + encodeURIComponent(id) };
  return { name: String(id).replace(/-/g, ' '), house: '', href: 'catalog.html?id=' + encodeURIComponent(id) };
}

// A search box that finds any perfume in the full catalogue. Falls back to the short list if the catalogue is not loaded on the page.
function perfumePickerHTML(key){
  if (typeof PFC === 'undefined') {
    const opts = PERFUMES.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(p=>`<option value="${p.id}">${escHtml(p.name)} (${escHtml(houseName(p.houseId))})</option>`).join('');
    return `<select id="${key}-sel" required><option value="">Choose a fragrance…</option>${opts}</select>`;
  }
  return `<div class="pp"><input id="${key}-q" type="text" placeholder="Start typing, e.g. Sauvage or Khamrah" autocomplete="off"><input id="${key}-val" type="hidden"><div class="pp-list" id="${key}-list"></div></div>`;
}
function bindPerfumePicker(root, key){
  const sel = root.querySelector('#' + key + '-sel');
  if (sel) return () => sel.value;
  const q = root.querySelector('#' + key + '-q'), val = root.querySelector('#' + key + '-val'), list = root.querySelector('#' + key + '-list');
  let rows = [];
  PFC.load().then(d => { rows = d.rows.filter(r => r.ok); });
  q.addEventListener('input', () => {
    val.value = '';
    const t = q.value.toLowerCase().split(/\s+/).filter(Boolean);
    if (!t.length || !rows.length) { list.innerHTML = ''; list.classList.remove('on'); return; }
    const hits = rows.filter(r => t.every(w => r.hay.indexOf(w) >= 0)).sort((a,b) => (b.sizes - a.sizes) || a.hay.localeCompare(b.hay)).slice(0, 7);
    list.innerHTML = hits.length ? hits.map(r => `<button type="button" data-s="${escHtml(r.slug)}"><b>${escHtml(r.name)}</b><span>${escHtml(r.house)}</span></button>`).join('') : '<div class="pp-none">No match. Try a shorter name.</div>';
    list.classList.add('on');
  });
  list.addEventListener('click', e => {
    const b = e.target.closest('button[data-s]'); if (!b) return;
    val.value = b.dataset.s; q.value = b.querySelector('b').textContent + ' · ' + b.querySelector('span').textContent;
    list.classList.remove('on');
  });
  return () => val.value;
}

async function fetchLiveReviews(perfumeId, limit){
  if (!_sb) return [];
  try {
    let q = _sb.from('reviews').select('*').order('created_at', { ascending: false }).limit(limit || 20);
    if (perfumeId) q = q.eq('perfume_id', perfumeId);
    const { data, error } = await q;
    if (error) { console.error('fetchLiveReviews', error); return []; }
    return data || [];
  } catch (e) {
    console.error('fetchLiveReviews', e);
    return [];
  }
}

function liveToCardShape(row){
  const p = typeof perfumeById === 'function' ? perfumeById(row.perfume_id) : null;
  return {
    p: p ? p.name : row.perfume_id,
    b: p ? houseName(p.houseId) : '',
    s: row.rating,
    who: row.author,
    tx: row.body,
    hp: 0,
    id: row.perfume_id,
    live: true,
  };
}

async function submitReview({ perfumeId, author, rating, body }){
  if (!_sb) return { error: { message: 'Reviews service unavailable right now — please try again later.' } };
  try {
    return await _sb.from('reviews').insert([{ perfume_id: perfumeId, author, rating, body }]);
  } catch (e) {
    return { error: e };
  }
}

function starPickerHTML(){
  return `<div class="starpick" id="rv-stars">${[1,2,3,4,5].map(n=>`<span data-v="${n}">★</span>`).join('')}</div>`;
}

async function openReviewModal(opts){
  opts = opts || {};
  const fixedPerfume = opts.perfumeId ? (perfumeById(opts.perfumeId) || (opts.perfumeName ? { id: opts.perfumeId, name: opts.perfumeName } : null)) : null;
  const loggedInUser = typeof getCurrentUser === 'function' ? await getCurrentUser() : null;
  const prefillName = loggedInUser && typeof displayNameFor === 'function' ? displayNameFor(loggedInUser) : '';

  const backdrop = document.createElement('div');
  backdrop.className = 'rvmodal-backdrop';
  backdrop.innerHTML = `
    <div class="rvmodal">
      <button type="button" class="close" aria-label="Close">✕</button>
      <h2>Write a review</h2>
      <p class="sub" style="font-size:13px;color:var(--muted);margin-bottom:18px">${fixedPerfume ? `Reviewing <b>${escHtml(fixedPerfume.name)}</b>` : 'Share your take with the ParfAI community.'}</p>
      <form id="rv-form">
        ${!fixedPerfume ? `<div class="field"><label>Fragrance</label>${perfumePickerHTML('rv')}</div>` : ''}
        <div class="field"><label>Your name</label><input id="rv-author" type="text" value="${escHtml(prefillName)}" placeholder="e.g. FragBro" maxlength="60" required></div>
        <div class="field"><label>Rating</label>${starPickerHTML()}</div>
        <div class="field"><label>Review</label><textarea id="rv-body" rows="4" maxlength="1000" placeholder="What do you think of it?" required></textarea></div>
        <button class="btn block" type="submit">Post review</button>
        <div id="rv-msg"></div>
      </form>
    </div>`;
  document.body.appendChild(backdrop);

  let rating = 0;
  const getPerfume = fixedPerfume ? (() => fixedPerfume.id) : bindPerfumePicker(backdrop, 'rv');
  const starsEl = backdrop.querySelector('#rv-stars');
  starsEl.addEventListener('click', (e)=>{
    const el = e.target.closest('span[data-v]');
    if (!el) return;
    rating = Number(el.dataset.v);
    [...starsEl.children].forEach(s=>s.classList.toggle('on', Number(s.dataset.v) <= rating));
  });

  function close(){ backdrop.remove(); }
  backdrop.addEventListener('click', (e)=>{ if (e.target === backdrop) close(); });
  backdrop.querySelector('.close').addEventListener('click', close);
  document.addEventListener('keydown', function esc(e){ if (e.key === 'Escape'){ close(); document.removeEventListener('keydown', esc); } });

  backdrop.querySelector('#rv-form').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const msg = backdrop.querySelector('#rv-msg');
    const perfumeId = getPerfume();
    const author = backdrop.querySelector('#rv-author').value.trim();
    const body = backdrop.querySelector('#rv-body').value.trim();

    if (!perfumeId){ msg.className='rvmsg err'; msg.textContent='Please pick a fragrance from the list.'; return; }
    if (!rating){ msg.className='rvmsg err'; msg.textContent='Please pick a star rating.'; return; }
    if (!author || !body){ msg.className='rvmsg err'; msg.textContent='Please fill in your name and review.'; return; }

    const submitBtn = backdrop.querySelector('button[type=submit]');
    submitBtn.disabled = true; submitBtn.textContent = 'Posting…';
    const { error } = await submitReview({ perfumeId, author, rating, body });
    submitBtn.disabled = false; submitBtn.textContent = 'Post review';

    if (error){
      msg.className = 'rvmsg err';
      msg.textContent = 'Something went wrong — please try again.';
      console.error(error);
      return;
    }
    msg.className = 'rvmsg ok';
    msg.textContent = 'Review posted — thank you!';
    window.dispatchEvent(new CustomEvent('parfai:review-posted', { detail: { perfumeId } }));
    setTimeout(close, 1200);
  });
}

function bindReviewButtons(){
  document.querySelectorAll('[data-write-review]').forEach(el=>{
    if (el.dataset.bound) return; el.dataset.bound = '1';
    el.addEventListener('click', (e)=>{
      e.preventDefault();
      openReviewModal({ perfumeId: el.dataset.perfumeId || null });
    });
  });
}
document.addEventListener('DOMContentLoaded', bindReviewButtons);
