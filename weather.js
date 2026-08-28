/* ---------------------------------------------------------------
   Weather-Aware Pick of the Day — live, client-side, no backend.

   Flow: resolve the visitor's location (IP-based first, silently —
   no permission prompt — with an optional "use precise location"
   upgrade that asks the browser directly) -> fetch real current
   weather for those coordinates from Open-Meteo -> bucket the
   conditions -> rank the existing PERFUMES catalog by family match.

   Every network step is wrapped so a CORS block, timeout, or outage
   degrades to the next fallback rather than showing a broken state;
   the last resort is a manual city picker that still pulls real
   live weather for whichever city is chosen. Requires data.js
   (PERFUMES, houseName) to already be loaded on the page.
   ------------------------------------------------------------- */

const WEATHER_CACHE_KEY = 'parfai_weather_pick_v1';
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

const WEATHER_FAMILY_TARGET = {
  hot:   ['Fresh', 'Floral', 'Aromatic'],
  mild:  ['Aromatic', 'Chypre', 'Woody'],
  cold:  ['Woody', 'Amber', 'Oriental', 'Gourmand'],
  rainy: ['Fresh', 'Woody', 'Chypre'],
  snowy: ['Woody', 'Amber', 'Oriental'],
};

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

function pickForWeather(bucket){
  const targets = WEATHER_FAMILY_TARGET[bucket] || WEATHER_FAMILY_TARGET.mild;
  return PERFUMES
    .filter(p => targets.includes(p.family))
    .sort((a, b) => {
      const ra = targets.indexOf(a.family), rb = targets.indexOf(b.family);
      if (ra !== rb) return ra - rb;   // earlier = more specific match for this weather
      return b.rating - a.rating;      // then highest rated
    })
    .slice(0, 3);
}

function whyThisPick(p, bucket){
  const accordTxt = p.accords.slice(0, 2).join(' and ').toLowerCase();
  const reasons = {
    hot:   `Light and ${accordTxt} — stays pleasant instead of turning heavy in the heat.`,
    mild:  `A versatile ${accordTxt} pick that performs well without needing extreme weather to carry it.`,
    cold:  `Dense enough to actually project in the cold — ${accordTxt} holds up when lighter scents would fade fast.`,
    rainy: `A clean, ${accordTxt} character that suits damp, overcast air.`,
    snowy: `Rich and warm — built to still show up at freezing temperatures.`,
  };
  return reasons[bucket] || reasons.mild;
}

function familyGrad(fam){
  const g = typeof famColor === 'function' ? famColor(fam) : ['#6C4CFF', '#00B8D4'];
  return `linear-gradient(150deg,${g[0]},${g[1]})`;
}
function bottleThumbHTML(p, cls){
  const art = p.image
    ? `<img src="${p.image}" alt="${p.name} bottle" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'bottle'}))">`
    : `<div class="bottle"></div>`;
  return `<div class="${cls}" style="background:${familyGrad(p.family)}">${art}</div>`;
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
  const result = { lat, lon, label, countryCode, tempC: w.tempC, code: w.code, bucket, picks: pickForWeather(bucket), ts: Date.now() };
  writeWeatherCache(result);
  return result;
}

function readWeatherCache(){
  try {
    const raw = localStorage.getItem(WEATHER_CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data.ts || Date.now() - data.ts > WEATHER_CACHE_MS) return null;
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

  el.innerHTML = `
    <div class="wpxlive">
      <div class="wpxnow">
        <div class="wpxloc">${result.label}</div>
        <div class="wpxtemp">${icon} ${fmtTemp(result.tempC, unit)}</div>
        <div class="wpxcond">${cond}</div>
      </div>
      <div class="wpxpickwrap">
        <div class="wcpicklabel">Today's pick for you</div>
        <div class="wpxpick">
          <a href="perfume.html?id=${top.id}">${bottleThumbHTML(top, 'wpxthumb')}</a>
          <div class="wpxpicktext">
            <a class="wpxname" href="perfume.html?id=${top.id}">${top.name}</a>
            <div class="wcfam">${typeof houseName === 'function' ? houseName(top.houseId) : ''} · ${top.accords.slice(0, 3).join(', ')}</div>
            <div class="wcwhy">${whyThisPick(top, result.bucket)}</div>
          </div>
        </div>
        ${alts.length ? `<div class="wpxaltlabel">Also good today</div><div class="wpxalt">${alts.map(p => `<a class="wpxaltlink" href="perfume.html?id=${p.id}">${bottleThumbHTML(p, 'wpxaltthumb')}${p.name}</a>`).join('')}</div>` : ''}
      </div>
    </div>
    <div class="wpxcredit">
      Live weather via <a href="https://open-meteo.com" target="_blank" rel="noopener">Open-Meteo</a>
      <button class="wpxchange" type="button" data-action="precise">Use precise location</button>
      <button class="wpxchange" type="button" data-action="manual">Not your location?</button>
    </div>
  `;

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
