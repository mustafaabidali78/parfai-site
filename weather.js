/* ---------------------------------------------------------------
   Weather-Aware Pick of the Day — live, client-side, no backend.

   Flow: resolve the visitor's location (IP-based first, silently —
   no permission prompt — with an optional "use precise location"
   upgrade that asks the browser directly) -> fetch real current
   weather for those coordinates from Open-Meteo -> bucket the
   conditions -> pick from the full FragranceNet catalogue (catalog/fragrancenet.json) by notes.

   Every network step is wrapped so a CORS block, timeout, or outage
   degrades to the next fallback rather than showing a broken state;
   the last resort is a manual city picker that still pulls real
   live weather for whichever city is chosen. No other script is needed.
   ------------------------------------------------------------- */

const WEATHER_CACHE_KEY = 'parfai_weather_pick_v3';
const WEATHER_CACHE_MS = 3 * 60 * 60 * 1000; // 3 hours — weather doesn't change fast enough to refetch every load

// Representative cities spanning distinct climates — used as the
// manual fallback picker when location can't be resolved automatically.
const WEATHER_CITY_PRESETS = [
  { label: 'Dubai, UAE', lat: 25.2048, lon: 55.2708 },
  { label: 'London, UK', lat: 51.5072, lon: -0.1276 },
  { label: 'New York, USA', lat: 40.7128, lon: -74.0060 },
  { label: 'Mumbai, India', lat: 19.0760, lon: 72.8777 },
  { label: 'Sydney, Australia', lat: -33.8688, lon: 151.2093 },
  { label: 'Cairo, Egypt', lat: 30.0444, lon: 31.2357 },
  { label: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503 },
  { label: 'São Paulo, Brazil', lat: -23.5505, lon: -46.6333 },
];

const WEATHER_COND_TEXT = {
  0:'Clear sky',1:'Mostly clear',2:'Partly cloudy',3:'Overcast',
  45:'Fog',48:'Depositing rime fog',
  51:'Light drizzle',53:'Drizzle',55:'Dense drizzle',56:'Freezing drizzle',57:'Dense freezing drizzle',
  61:'Light rain',63:'Rain',65:'Heavy rain',66:'Freezing rain',67:'Heavy freezing rain',
  71:'Light snow',73:'Snow',75:'Heavy snow',77:'Snow grains',
  80:'Light showers',81:'Showers',82:'Violent showers',
  85:'Light snow showers',86:'Snow showers',
  95:'Thunderstorm',96:'Thunderstorm, hail',99:'Severe thunderstorm, hail',
};
const WEATHER_COND_ICON = {
  0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',
  51:'🌦️',53:'🌦️',55:'🌦️',56:'🌧️',57:'🌧️',61:'🌧️',63:'🌧️',65:'🌧️',66:'🌧️',67:'🌧️',
  71:'❄️',73:'❄️',75:'❄️',77:'❄️',80:'🌦️',81:'🌧️',82:'⛈️',85:'❄️',86:'❄️',
  95:'⛈️',96:'⛈️',99:'⛈️',
};

function weatherBucket(tempC, code){
  const rainy = [51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99].includes(code);
  const snowy = [71,73,75,77,85,86].includes(code);
  if (snowy) return 'snowy';
  if (rainy) return 'rainy';
  if (tempC >= 27) return 'hot';
  if (tempC <= 12) return 'cold';
  return 'mild';
}

/* ---------------- full catalogue picker ----------------
   Reads catalog/fragrancenet.json (the same file the Catalogue page uses,
   refreshed every week from FragranceNet). Every perfume is scored by its
   listed notes: bright citrus and watery notes score high in the heat,
   warm amber, vanilla and woody notes score high in the cold, and so on.
   The best matches form a pool, and a seeded draw from that pool picks
   today's perfume, so it changes every day but is the same for everyone
   with the same weather on the same day. No prices are used. */

const WEATHER_CATALOG_URL = 'catalog/fragrancenet.json';
let _weatherCatalogPromise = null;
function loadWeatherCatalog(){
  if (!_weatherCatalogPromise) {
    _weatherCatalogPromise = fetchJSON(WEATHER_CATALOG_URL, 25000).catch(e => { _weatherCatalogPromise = null; throw e; });
  }
  return _weatherCatalogPromise;
}

// Note groups, checked in this order; each note counts once, in the first group it matches.
const WEATHER_NOTE_GROUPS = [
  ['DEEP',    /\b(oud|agarwood|leather|tobacco|incense|resin|labdanum|benzoin|myrrh|cinnamon|clove|saffron|rum|smoke|smoky|birch|opoponax|frankincense|olibanum|cognac|whiskey)\b/],
  ['WARM',    /\b(amber|ambergris|ambroxan|vanilla|tonka|caramel|honey|praline|cacao|chocolate|coffee|cashmeran|balsam|nutmeg|black pepper|cardamom|patchouli|toffee|almond(?! blossom)|maple|marshmallow)\b/],
  ['AQUATIC', /\b(aquatic|marine|sea|ozonic|ozone|water|watery|calone|salt|salty|rain|cucumber|melon|watermelon|coconut water|seaweed|driftwood)\b/],
  ['CITRUS',  /\b(bergamot|lemon|grapefruit|mandarin|tangerine|lime|citrus|yuzu|bitter orange|petitgrain|verbena|lemongrass|bigarade|neroli|orange)\b(?! blossom)/],
  ['GREEN',   /\b(mint|basil|green|tea|galbanum|violet leaf|rosemary|sage|clary sage|lavender|geranium|grass|cypress|juniper|eucalyptus|tomato|thyme|fir|pine|herbal|aromatic|fern|bamboo|ginger)\b/],
  ['WOODS',   /\b(cedar|cedarwood|vetiver|sandalwood|oakmoss|moss|guaiac|woody|woods?|amberwood|cashmere wood|papyrus|sandal|teak|hinoki|iso e super)\b/],
  ['SOFT',    /\b(peony|freesia|lily|lotus|jasmine|magnolia|pear|apple|peach|pineapple|white musk|musk|rose|iris|orris|violet|orange blossom|neroli|mimosa|cherry|raspberry|strawberry|blackcurrant|black currant|plum|lychee|mango|pink pepper|marine|cotton|linen|powder|heliotrope|tuberose|gardenia|ylang|orchid|wisteria|sweet pea)\b/],
];
const WEATHER_GROUP_WEIGHTS = {
  hot:   { CITRUS: 3,   AQUATIC: 3,   GREEN: 1.5, SOFT: 1.5, WOODS: 0,   WARM: -1.5, DEEP: -3 },
  mild:  { CITRUS: 1.5, AQUATIC: 0.5, GREEN: 1.5, SOFT: 2,   WOODS: 2,   WARM: 0.5,  DEEP: -1 },
  rainy: { CITRUS: 0.5, AQUATIC: 1.5, GREEN: 3,   SOFT: 0.5, WOODS: 2.5, WARM: 0.5,  DEEP: 0 },
  cold:  { CITRUS: -0.5, AQUATIC: -2, GREEN: 0,   SOFT: 0,   WOODS: 1.5, WARM: 3,    DEEP: 2 },
  snowy: { CITRUS: -1,  AQUATIC: -3,  GREEN: 0,   SOFT: 0,   WOODS: 1.5, WARM: 3,    DEEP: 3 },
};
const WEATHER_DAY_WEAR = { hot: ['daytime', 'casual'], mild: ['daytime', 'casual'], rainy: ['casual'], cold: ['evening', 'romantic'], snowy: ['evening', 'romantic'] };
const WEATHER_NOT_PERFUME = /\b(soap|shower|lotion|candle|deodorant|gel|set|hair|bath|baby|kids?)\b/i;
const WEATHER_JUNK_NOTE = /recommended for wear|^notes?$/;

const _noteGroupCache = new Map();
function weatherNoteGroup(note){
  if (_noteGroupCache.has(note)) return _noteGroupCache.get(note);
  let g = null;
  for (const [name, re] of WEATHER_NOTE_GROUPS) { if (re.test(note)) { g = name; break; } }
  _noteGroupCache.set(note, g);
  return g;
}

function wxCap(s){ return String(s).replace(/\b([a-z])/g, m => m.toUpperCase()); }
function wxEsc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function wxShortTitle(house, title){
  const h = house.toLowerCase();
  if (title.toLowerCase().indexOf(h + ' ') === 0 && title.length > h.length + 1) return title.slice(h.length + 1);
  return title;
}
function wxList(arr){
  if (arr.length <= 1) return arr.join('');
  return arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
}
function wxDayKey(){
  const d = new Date();
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}
function wxHash(s){
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function wxRandom(seed){ // small seeded random number generator
  let a = seed >>> 0;
  return function(){
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function scoreForWeather(item, bucket){
  const weights = WEATHER_GROUP_WEIGHTS[bucket] || WEATHER_GROUP_WEIGHTS.mild;
  const notes = item[5].map(n => n.replace(/\s*\((top|heart|base|middle)\)/i, '')).filter(n => !WEATHER_JUNK_NOTE.test(n) && n.indexOf(':') === -1 && n.length <= 28);
  if (notes.length < 3) return null;
  let total = 0;
  const likedAll = [];
  for (const n of notes) {
    const g = weatherNoteGroup(n);
    if (!g) continue;
    const w = weights[g];
    total += w;
    if (w > 0 && likedAll.every(x => x.n !== n)) likedAll.push({ n, w });
  }
  // the notes that fit this weather best, strongest first (used in the reason text)
  const liked = likedAll.sort((a, b) => b.w - a.w).slice(0, 3).map(x => x.n);
  let score = total / Math.sqrt(notes.length);
  score += 0.25 * Math.min(item[7].length, 5);                  // more size options usually means a well-known perfume
  if ((WEATHER_DAY_WEAR[bucket] || []).indexOf(item[6]) !== -1) score += 1;
  return { score, liked, notes };
}

function whyForWeather(bucket, liked, notes){
  const list = wxList((liked.length ? liked : notes.slice(0, 3)).map(n => n.toLowerCase()));
  const reasons = {
    hot:   `Bright ${list} keep it light and fresh, so it stays pleasant instead of turning heavy in the heat.`,
    mild:  `A balanced mix of ${list}. It works well without needing extreme weather to carry it.`,
    cold:  `Warm ${list} give it the density to keep projecting in the cold, when lighter scents fade fast.`,
    rainy: `Notes of ${list} sit well in damp, overcast air without fighting it.`,
    snowy: `Rich ${list}, built to still show up at freezing temperatures.`,
  };
  return reasons[bucket] || reasons.mild;
}

function slimPick(item, data, bucket, scored){
  const variant = item[7].find(v => !/tester/i.test(v[1])) || item[7][0];
  return {
    slug: item[0],
    pid: item[7][0] ? item[7][0][0] : '',
    house: item[1],
    name: wxShortTitle(item[1], item[2]),
    gender: item[3],
    notes: scored.notes.slice(0, 6),
    link: variant ? data.pre + variant[0] + data.mid + variant[2] : '',
    why: whyForWeather(bucket, scored.liked, scored.notes),
  };
}

// Picks 3 perfumes (one main pick and two alternates) from the whole catalogue.
async function pickForWeather(bucket){
  const data = await loadWeatherCatalog();
  const scored = [];
  for (const item of data.items) {
    if (WEATHER_NOT_PERFUME.test(item[2]) || /bath & body/i.test(item[1])) continue;
    const s = scoreForWeather(item, bucket);
    if (s) scored.push({ item, s });
  }
  scored.sort((a, b) => b.s.score - a.s.score);

  // Top matches, at most 3 per house, so one brand can't fill the pool.
  const pool = [], perHouse = {};
  for (const x of scored) {
    const h = x.item[1];
    if ((perHouse[h] || 0) >= 3) continue;
    perHouse[h] = (perHouse[h] || 0) + 1;
    pool.push(x);
    if (pool.length >= 60) break;
  }

  // Seeded draw: same pick for everyone with this weather today, a new pick tomorrow.
  const rand = wxRandom(wxHash(wxDayKey() + '|' + bucket));
  const chosen = [], usedHouses = {};
  while (chosen.length < 3 && pool.length) {
    const i = Math.floor(rand() * pool.length);
    const x = pool.splice(i, 1)[0];
    if (usedHouses[x.item[1]]) continue;
    usedHouses[x.item[1]] = 1;
    chosen.push(slimPick(x.item, data, bucket, x.s));
  }
  return chosen;
}

const WEATHER_GENDER_GRAD = { 0: ['#6C7BFF', '#00B8D4'], 1: ['#FF4D9D', '#FF8C42'], 2: ['#8B7CFF', '#C86BFF'] };
const WEATHER_GENDER_TEXT = { 0: 'For men', 1: 'For women', 2: 'Unisex' };
function bottleThumbHTML(p, cls){
  // A FragranceNet picture goes on top of the drawn bottle when we have one (large thumbnails only).
  const g = WEATHER_GENDER_GRAD[p.gender] || WEATHER_GENDER_GRAD[2];
  const big = cls === 'wpxthumb' || cls === 'wcthumb' || cls === 'wpxaltthumb';
  const pic = big && p.pid ? `<img src="catalog-img/${p.pid}.jpg" alt="" loading="lazy" onload="this.parentNode.classList.add('hasimg')" onerror="this.remove()">` : '';
  return `<div class="${cls}" style="background:linear-gradient(150deg,${g[0]},${g[1]})"><div class="bottle"></div>${pic}</div>`;
}

function tempUnitForCountry(countryCode){
  return ['US', 'LR', 'MM'].includes(countryCode) ? 'F' : 'C';
}
function fmtTemp(c, unit){
  return unit === 'F' ? `${Math.round(c * 9 / 5 + 32)}°F` : `${Math.round(c)}°C`;
}

async function fetchJSON(url, timeoutMs){
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs || 6000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error('bad response ' + res.status);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

async function fetchWeatherFor(lat, lon){
  const data = await fetchJSON(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=celsius`);
  if (!data || !data.current) throw new Error('no current weather in response');
  return { tempC: data.current.temperature_2m, code: data.current.weather_code };
}

// Two independent IP-geolocation providers, tried in order — neither
// requires an API key or a permission prompt.
async function ipLocate(){
  try {
    const d = await fetchJSON('https://ipapi.co/json/');
    if (d && !d.error && d.latitude != null) {
      return { lat: d.latitude, lon: d.longitude, countryCode: d.country_code || null,
        label: [d.city, d.country_name].filter(Boolean).join(', ') || 'Your location' };
    }
  } catch (e) { /* fall through to the second provider */ }

  const d2 = await fetchJSON('https://free.freeipapi.com/api/json');
  const lat = d2.latitude, lon = d2.longitude;
  if (lat == null || lon == null) throw new Error('no coordinates from fallback IP provider');
  return { lat, lon, countryCode: d2.countryCode || null,
    label: [d2.cityName || d2.city, d2.countryName].filter(Boolean).join(', ') || 'Your location' };
}

function browserGeolocate(){
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('geolocation unsupported'));
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      err => reject(err),
      { timeout: 7000, maximumAge: 600000 }
    );
  });
}

async function reverseGeocode(lat, lon){
  try {
    const d = await fetchJSON(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    const city = d.city || d.locality || d.principalSubdivision;
    return [city, d.countryName].filter(Boolean).join(', ') || 'Your precise location';
  } catch (e) { return 'Your precise location'; }
}

async function weatherForCoords(lat, lon, label, countryCode){
  const w = await fetchWeatherFor(lat, lon);
  const bucket = weatherBucket(w.tempC, w.code);
  const result = { lat, lon, label, countryCode, tempC: w.tempC, code: w.code, bucket, picks: [], ts: Date.now(), day: wxDayKey() };
  try { result.picks = await pickForWeather(bucket); } catch (e) { result.picks = []; result.catalogError = true; }
  writeWeatherCache(result);
  return result;
}

function readWeatherCache(){
  try {
    const raw = localStorage.getItem(WEATHER_CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data.ts || Date.now() - data.ts > WEATHER_CACHE_MS) return null;
    if (data.day !== wxDayKey() || !data.picks || !data.picks.length || data.picks.some(p => p.pid === undefined)) return null; // new day or no picks saved: start fresh
    return data;
  } catch (e) { return null; }
}
function writeWeatherCache(data){
  try { localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
}
function clearWeatherCache(){
  try { localStorage.removeItem(WEATHER_CACHE_KEY); } catch (e) { /* ignore */ }
}

// IP-based location first (silent, no prompt) -> live weather.
// Returns null if it can't resolve anything; caller shows the manual picker.
async function resolveWeatherPick(){
  const cached = readWeatherCache();
  if (cached) return cached;
  try {
    const ip = await ipLocate();
    return await weatherForCoords(ip.lat, ip.lon, ip.label, ip.countryCode);
  } catch (e) {
    return null;
  }
}

/* ---------------- weather-resolved listeners ----------------
   Anything on the page that wants to react to a real weather result
   (not just the pick panel itself) subscribes here. Fired once for the
   initial automatic resolution, and again any time the visitor overrides
   it — "Use precise location" or the manual city picker — so a listener
   like the hero video always reflects the weather actually being shown,
   not just the first guess. */
const _weatherResolvedListeners = [];
function onWeatherResolved(fn){ if (typeof fn === 'function') _weatherResolvedListeners.push(fn); }
function notifyWeatherResolved(result){
  _weatherResolvedListeners.forEach(fn => { try { fn(result); } catch (e) { /* one bad listener shouldn't break another */ } });
}

/* ---------------- rendering ---------------- */

async function renderWeatherPick(containerId){
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `<div class="wpx-loading">Finding your local weather…</div>`;
  const result = await resolveWeatherPick();
  notifyWeatherResolved(result);
  if (result && result.picks && result.picks.length) {
    renderWeatherResult(el, result);
  } else if (result && result.catalogError) {
    el.innerHTML = `<div class="wpx-loading">We found your weather but couldn't load the perfume catalogue just now. Please refresh the page in a moment.</div>`;
  } else {
    renderManualPicker(el, `Couldn't detect your location automatically — pick a city and we'll still pull real live weather for it.`);
  }
}

function renderWeatherResult(el, result){
  const unit = tempUnitForCountry(result.countryCode);
  const icon = WEATHER_COND_ICON[result.code] || '🌤️';
  const cond = WEATHER_COND_TEXT[result.code] || 'Current conditions';
  const top = result.picks[0];
  const alts = result.picks.slice(1);

  if (!top) {
    el.innerHTML = `<div class="wpx-loading">No catalog match for today's conditions yet — check back soon.</div>`;
    return;
  }

  const normalHTML = `
    <div class="wpxlive">
      <div class="wpxnow">
        <div class="wpxloc">${result.label}</div>
        <div class="wpxtemp">${icon} ${fmtTemp(result.tempC, unit)}</div>
        <div class="wpxcond">${cond}</div>
      </div>
      <div class="wpxpickwrap">
        <div class="wcpicklabel">Today's pick for you</div>
        <div class="wpxpick">
          <a href="catalog.html?id=${encodeURIComponent(top.slug)}">${bottleThumbHTML(top, 'wpxthumb')}</a>
          <div class="wpxpicktext">
            <a class="wpxname" href="catalog.html?id=${encodeURIComponent(top.slug)}">${wxEsc(top.name)}</a>
            <div class="wcfam">${wxEsc(top.house)} · ${wxEsc(top.notes.slice(0, 3).map(wxCap).join(', '))}</div>
            <div class="wcwhy">${wxEsc(top.why)}</div>
            ${top.link ? `<a class="wpxbuy" href="${wxEsc(top.link)}" target="_blank" rel="sponsored nofollow noopener">Check price on FragranceNet ↗</a>` : ''}
          </div>
        </div>
        ${alts.length ? `<div class="wpxaltlabel">Also good today</div><div class="wpxalt">${alts.map(p => `<a class="wpxaltlink" href="catalog.html?id=${encodeURIComponent(p.slug)}">${bottleThumbHTML(p, 'wpxaltthumb')}${wxEsc(p.name)}</a>`).join('')}</div>` : ''}
      </div>
    </div>
    <div class="wpxcredit">
      Live weather via <a href="https://open-meteo.com" target="_blank" rel="noopener">Open-Meteo</a>. Price links are affiliate links.
      <button class="wpxchange" type="button" data-action="precise">Use precise location</button>
      <button class="wpxchange" type="button" data-action="manual">Not your location?</button>
    </div>
  `;

  // Home page layout: one big bottle picture next to today's pick (no "also good" list)
  const heroPhoto = top.pid ? `<img src="catalog-img/${top.pid}.jpg" alt="${wxEsc(top.name)} bottle" loading="lazy" onload="this.parentNode.classList.add('hasimg')" onerror="this.remove()">` : '';
  const heroG = WEATHER_GENDER_GRAD[top.gender] || WEATHER_GENDER_GRAD[2];
  const heroHTML = `
    <div class="wxh">
      <div class="wxh-l">
        <span class="lp-badge live">&bull; Live</span>
        <h3>Weather-Aware Pick of the Day</h3>
        <div class="wpxloc">${result.label}</div>
        <div class="wpxtemp">${icon} ${fmtTemp(result.tempC, unit)}</div>
        <div class="wpxcond">${cond}</div>
        <div class="wcpicklabel wxh-lab">Today's pick for you</div>
        <a class="wpxname" href="catalog.html?id=${encodeURIComponent(top.slug)}">${wxEsc(top.name)}</a>
        <div class="wcfam">${wxEsc(top.house)} · ${wxEsc(top.notes.slice(0, 3).map(wxCap).join(', '))}</div>
        <div class="wcwhy">${wxEsc(top.why)}</div>
        ${top.link ? `<a class="wpxbuy" href="${wxEsc(top.link)}" target="_blank" rel="sponsored nofollow noopener">Check price on FragranceNet ↗</a>` : ''}
        <div class="wpxcredit">
          Live weather via <a href="https://open-meteo.com" target="_blank" rel="noopener">Open-Meteo</a>. Price links are affiliate links.
          <button class="wpxchange" type="button" data-action="precise">Use precise location</button>
          <button class="wpxchange" type="button" data-action="manual">Not your location?</button>
        </div>
        <a class="lp-cta" href="weather-pick.html">How this works →</a>
      </div>
      <a class="wxh-r" href="catalog.html?id=${encodeURIComponent(top.slug)}" aria-label="${wxEsc(top.name)}">
        <div class="wxh-tile" style="background:linear-gradient(150deg,${heroG[0]},${heroG[1]})"><div class="bottle"></div>${heroPhoto}</div>
      </a>
    </div>`;
  // Home page, compact layout: weather line on top, then three picks to choose from.
  const TRIO_TAG = { hot: 'Best for the heat', mild: 'Best for today', rainy: 'Best for the rain', cold: 'Best for the cold', snowy: 'Best for the snow' };
  const trioCard = (p, i) => {
    const g = WEATHER_GENDER_GRAD[p.gender] || WEATHER_GENDER_GRAD[2];
    const pic = p.pid ? `<img src="catalog-img/${p.pid}.jpg" alt="${wxEsc(p.name)} bottle" loading="lazy" onload="this.parentNode.classList.add('hasimg')" onerror="this.remove()">` : '';
    const tag = i === 0 ? (TRIO_TAG[result.bucket] || 'Best for today') : 'Also good today';
    const line = i === 0 ? p.why : p.notes.slice(0, 3).map(wxCap).join(', ') + '.';
    return `<div class="wxt-card${i === 0 ? ' top' : ''}">
      <a class="wxt-th" href="catalog.html?id=${encodeURIComponent(p.slug)}" aria-label="${wxEsc(p.name)}" style="background:linear-gradient(150deg,${g[0]},${g[1]})"><div class="bottle"></div>${pic}</a>
      <div class="wxt-tx">
        <div class="wxt-tag">${tag}</div>
        <a class="wxt-nm" href="catalog.html?id=${encodeURIComponent(p.slug)}">${wxEsc(p.name)}</a>
        <div class="wxt-hs">${wxEsc(p.house)}</div>
        <p>${wxEsc(line)}</p>
        ${p.link ? `<a class="wxt-buy" href="${wxEsc(p.link)}" target="_blank" rel="sponsored nofollow noopener">Check price ↗</a>` : ''}
      </div>
    </div>`;
  };
  const trioHTML = `
    <div class="wxt">
      <div class="wxt-head">
        <span class="wxt-live">&bull; Live</span>
        <span class="wxt-t">${icon} ${fmtTemp(result.tempC, unit)} in ${wxEsc(String(result.label).split(',')[0])}</span>
        <span class="wxt-s">${cond}</span>
        <span class="wxt-links">
          <button class="wxt-link" type="button" data-action="manual">Not your location?</button>
          <button class="wxt-link" type="button" data-action="precise">Use precise location</button>
          <a class="wxt-link" href="weather-pick.html">How this works</a>
        </span>
      </div>
      <div class="wxt-row">${result.picks.slice(0, 3).map(trioCard).join('')}</div>
      <div class="wxt-credit">Live weather via <a href="https://open-meteo.com" target="_blank" rel="noopener">Open-Meteo</a>. Price links are affiliate links.</div>
    </div>`;
  el.innerHTML = el.dataset.hero === '3' ? trioHTML : (el.dataset.hero === '1' ? heroHTML : normalHTML);

  const preciseBtn = el.querySelector('[data-action="precise"]');
  if (preciseBtn) preciseBtn.addEventListener('click', async () => {
    preciseBtn.disabled = true;
    preciseBtn.textContent = 'Locating…';
    try {
      const pos = await browserGeolocate();
      const label = await reverseGeocode(pos.lat, pos.lon);
      const r = await weatherForCoords(pos.lat, pos.lon, label, result.countryCode);
      notifyWeatherResolved(r);
      renderWeatherResult(el, r);
    } catch (e) {
      preciseBtn.disabled = false;
      preciseBtn.textContent = 'Use precise location';
    }
  });

  const manualBtn = el.querySelector('[data-action="manual"]');
  if (manualBtn) manualBtn.addEventListener('click', () => {
    clearWeatherCache();
    renderManualPicker(el, `Pick a city and we'll pull real live weather for it.`);
  });
}

/* ---------------- weather-pick.html hero: video synced to real weather ----------------
   Only 3 clips exist, so mild/hot share the sunny clip and cold/snowy
   share the snow clip — the closest visual match available rather than
   commissioning 5 for every bucket. */
const WEATHER_HERO_VIDEO = {
  hot:   'https://d8j0ntlcm91z4.cloudfront.net/user_3GClRJLPfk4DQWViYV9PO3J6IYl/hf_20260828_024601_3e0cb531-5cd6-46fa-9f06-f86ea1f50504.mp4',
  mild:  'https://d8j0ntlcm91z4.cloudfront.net/user_3GClRJLPfk4DQWViYV9PO3J6IYl/hf_20260828_024601_3e0cb531-5cd6-46fa-9f06-f86ea1f50504.mp4',
  rainy: 'https://d8j0ntlcm91z4.cloudfront.net/user_3GClRJLPfk4DQWViYV9PO3J6IYl/hf_20260828_025449_f6142d09-5b64-4e8b-955b-026450d2e29a.mp4',
  cold:  'https://d8j0ntlcm91z4.cloudfront.net/user_3GClRJLPfk4DQWViYV9PO3J6IYl/hf_20260828_025449_e6f086bc-783f-4d3b-afaf-bcae8ab5bbcd.mp4',
  snowy: 'https://d8j0ntlcm91z4.cloudfront.net/user_3GClRJLPfk4DQWViYV9PO3J6IYl/hf_20260828_025449_e6f086bc-783f-4d3b-afaf-bcae8ab5bbcd.mp4',
};
const WEATHER_HERO_COPY = {
  hot:   'Warm &amp; bright —<br>reach for citrus',
  mild:  'Mild &amp; easy —<br>go effortless',
  rainy: 'Grey skies —<br>go clean &amp; green',
  cold:  'Cold &amp; still —<br>go bold &amp; dense',
  snowy: 'Freezing &amp; hushed —<br>go rich &amp; warm',
};

function applyWeatherHero(result){
  const video = document.getElementById('whero-video');
  if (!video) return; // this page has no hero — nothing to do
  if (!result || !result.bucket) return; // resolution failed — keep the static gradient + generic copy

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const src = WEATHER_HERO_VIDEO[result.bucket];
    if (src && video.getAttribute('data-loaded') !== src) {
      video.setAttribute('data-loaded', src);
      video.src = src;
      video.oncanplay = () => { video.classList.add('ready'); video.play().catch(() => {}); };
      video.load();
    }
  }

  const unit = tempUnitForCountry(result.countryCode);
  const cond = (WEATHER_COND_TEXT[result.code] || 'these conditions').toLowerCase();
  const badge = document.getElementById('whero-badge');
  const h1 = document.getElementById('whero-h1');
  const sub = document.getElementById('whero-sub');
  if (badge) badge.textContent = `● Live — ${result.label || 'your location'} · ${fmtTemp(result.tempC, unit)}`;
  if (h1) h1.innerHTML = WEATHER_HERO_COPY[result.bucket] || WEATHER_HERO_COPY.mild;
  if (sub) sub.textContent = `It's ${fmtTemp(result.tempC, unit)} and ${cond} where you are right now — today's pick below is chosen from the real catalog to suit exactly that.`;
}

function renderManualPicker(el, note){
  el.innerHTML = `
    <div class="wpxmanual">
      <div class="wpxmanualtxt">${note}</div>
      <div class="wpxcities">
        ${WEATHER_CITY_PRESETS.map((c, i) => `<button class="wpxcitybtn" data-i="${i}" type="button">${c.label}</button>`).join('')}
      </div>
    </div>
  `;
  el.querySelectorAll('.wpxcitybtn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const c = WEATHER_CITY_PRESETS[+btn.dataset.i];
      el.innerHTML = `<div class="wpx-loading">Finding weather in ${c.label}…</div>`;
      try {
        const r = await weatherForCoords(c.lat, c.lon, c.label, null);
        notifyWeatherResolved(r);
        renderWeatherResult(el, r);
      } catch (e) {
        el.innerHTML = `<div class="wpx-loading">Couldn't reach the weather service right now — try again in a moment.</div>`;
      }
    });
  });
}

/* ---------------- example cities on weather-pick.html ----------------
   Fills each ".wcity[data-bucket]" card from the same full-catalogue picker. */
async function renderWeatherExamples(){
  const cards = document.querySelectorAll('.wcity[data-bucket]');
  for (const card of cards) {
    const slot = card.querySelector('.wcpick');
    if (!slot) continue;
    try {
      const picks = await pickForWeather(card.getAttribute('data-bucket'));
      const p = picks[0];
      if (!p) continue;
      slot.innerHTML = `
        <div class="wcpickrow">
          <a href="catalog.html?id=${encodeURIComponent(p.slug)}">${bottleThumbHTML(p, 'wcthumb')}</a>
          <div>
            <div class="wcpicklabel">Today's pick</div>
            <a class="wcname" href="catalog.html?id=${encodeURIComponent(p.slug)}">${wxEsc(p.name)}</a>
          </div>
        </div>
        <div class="wcfam">${wxEsc(p.house)} · ${wxEsc(p.notes.slice(0, 3).map(wxCap).join(', '))}</div>
        <div class="wcwhy">${wxEsc(p.why)}</div>`;
    } catch (e) { /* leave the card as it is */ }
  }
}
