/* ---------- live reviews (Supabase) ----------
   Public project URL + anon key — these are meant to be public (client-side),
   access is controlled entirely by the row-level security policies on the
   `reviews` table (anyone can read, anyone can insert within basic limits).
*/
const SUPABASE_URL = 'https://nqyiocjsovwjujvbaszr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xeWlvY2pzb3Z3anVqdmJhc3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0ODk4MjUsImV4cCI6MjEwMzA2NTgyNX0.yijnTHcQ2mBor2aU-UhqE2U_awOSVrTmOC9Ias473yc';

const _sb = (typeof window !== 'undefined' && window.supabase)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

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

function openReviewModal(opts){
  opts = opts || {};
  const fixedPerfume = opts.perfumeId ? perfumeById(opts.perfumeId) : null;
  const perfumeOptions = !fixedPerfume
    ? PERFUMES.slice().sort((a,b)=>a.name.localeCompare(b.name))
        .map(p=>`<option value="${p.id}">${p.name} (${houseName(p.houseId)})</option>`).join('')
    : '';

  const backdrop = document.createElement('div');
  backdrop.className = 'rvmodal-backdrop';
  backdrop.innerHTML = `
    <div class="rvmodal">
      <button type="button" class="close" aria-label="Close">✕</button>
      <h2>Write a review</h2>
      <p class="sub" style="font-size:13px;color:var(--muted);margin-bottom:18px">${fixedPerfume ? `Reviewing <b>${fixedPerfume.name}</b>` : 'Share your take with the ParfAI community.'}</p>
      <form id="rv-form">
        ${!fixedPerfume ? `<div class="field"><label>Fragrance</label><select id="rv-perfume" required><option value="">Choose a fragrance…</option>${perfumeOptions}</select></div>` : ''}
        <div class="field"><label>Your name</label><input id="rv-author" type="text" placeholder="e.g. FragBro" maxlength="60" required></div>
        <div class="field"><label>Rating</label>${starPickerHTML()}</div>
        <div class="field"><label>Review</label><textarea id="rv-body" rows="4" maxlength="1000" placeholder="What do you think of it?" required></textarea></div>
        <button class="btn block" type="submit">Post review</button>
        <div id="rv-msg"></div>
      </form>
    </div>`;
  document.body.appendChild(backdrop);

  let rating = 0;
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
    const perfumeSel = backdrop.querySelector('#rv-perfume');
    const perfumeId = fixedPerfume ? fixedPerfume.id : (perfumeSel ? perfumeSel.value : '');
    const author = backdrop.querySelector('#rv-author').value.trim();
    const body = backdrop.querySelector('#rv-body').value.trim();

    if (!perfumeId){ msg.className='rvmsg err'; msg.textContent='Please choose a fragrance.'; return; }
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
    el.addEventListener('click', (e)=>{
      e.preventDefault();
      openReviewModal({ perfumeId: el.dataset.perfumeId || null });
    });
  });
}
document.addEventListener('DOMContentLoaded', bindReviewButtons);
