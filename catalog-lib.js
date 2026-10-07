/* ---------- ParfAI shared catalogue helpers ----------
   Used by the home page cards and the Dupe Finder. Reads catalog/fragrancenet.json,
   the same file the Catalogue page uses (rebuilt weekly from FragranceNet's feed).
   No prices are used anywhere. Bottle photos stay hidden until FragranceNet
   confirms in writing that we may host copies. */
(function () {
  var GENDER = ['For men', 'For women', 'Unisex'];
  var GENDER_GRAD = { 0: ['#6C7BFF', '#00B8D4'], 1: ['#FF4D9D', '#FF8C42'], 2: ['#8B7CFF', '#C86BFF'] };

  // Affordable "inspired by" houses. Perfumes from these houses are labelled DUPE.
  var DUPE_HOUSES = ['lattafa', 'armaf', 'maison alhambra', 'ard al zaafaran', 'al haramain', 'khadlaj', 'rasasi',
    'paris corner', 'ajmal', 'french avenue', 'zimaya', 'swiss arabian', 'afnan', 'afnan perfumes', 'al rehab',
    'orientica', 'nabeel', 'rave', 'fragrance world', 'bujairami', 'al wataniah', 'jean rish', 'arabiyat',
    'gulf orchid', 'riiffs', 'emper', 'maison asrar'];
  var dupeSet = {}; DUPE_HOUSES.forEach(function (h) { dupeSet[h] = 1; });

  var NOT_PERFUME = /\b(soap|shower|lotion|candle|deodorant|gel|set|hair|bath|baby|kids?)\b/i;
  var JUNK_NOTE = /recommended for wear|^notes?$/;

  var promise = null;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function cap(s) { return String(s).replace(/\b([a-z])/g, function (m) { return m.toUpperCase(); }); }
  function shortTitle(house, title) {
    var h = house.toLowerCase();
    if (title.toLowerCase().indexOf(h + ' ') === 0 && title.length > h.length + 1) return title.slice(h.length + 1);
    return title;
  }
  function cleanNotes(raw) {
    return raw.map(function (n) { return n.replace(/\s*\((top|heart|base|middle)\)/i, '').toLowerCase().trim(); })
      .filter(function (n) { return n && !JUNK_NOTE.test(n) && n.indexOf(':') === -1 && n.length <= 28; });
  }

  // Loads the catalogue once and turns each row into a friendly object.
  function load() {
    if (!promise) {
      promise = fetch('catalog/fragrancenet.json').then(function (r) { if (!r.ok) throw new Error('bad response'); return r.json(); }).then(function (d) {
        var rows = d.items.map(function (i) {
          var variant = i[7].filter(function (v) { return !/tester/i.test(v[1]); })[0] || i[7][0];
          var r = {
            slug: i[0], house: i[1], title: i[2], name: shortTitle(i[1], i[2]), gender: i[3], year: i[4],
            notes: cleanNotes(i[5]), wear: i[6], sizes: i[7].length, pid: i[7][0] ? i[7][0][0] : '',
            link: variant ? d.pre + variant[0] + d.mid + variant[2] : ''
          };
          r.dupe = !!dupeSet[r.house.toLowerCase()];
          r.listed = !NOT_PERFUME.test(r.title) && !/bath & body/i.test(r.house);
          r.ok = r.listed && r.notes.length >= 3;
          r.hay = (r.house + ' ' + r.name).toLowerCase();
          return r;
        });
        return { rows: rows };
      });
      promise.catch(function () { promise = null; });
    }
    return promise;
  }

  // Seeded random numbers: same picks for everyone on the same day, new picks tomorrow.
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0; var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function dayKey() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  // Draws n items from pool, one per house, avoiding the slugs in "skip".
  function draw(pool, n, salt, skip) {
    var rand = rng(hash(dayKey() + '|' + salt)), out = [], houses = {}, left = pool.slice();
    while (out.length < n && left.length) {
      var x = left.splice(Math.floor(rand() * left.length), 1)[0];
      if (houses[x.house] || (skip && skip[x.slug])) continue;
      houses[x.house] = 1; out.push(x);
    }
    return out;
  }


  // ---------- Bottle pictures ----------
  // Until FragranceNet confirms in writing that we may host copies, every perfume shows a drawn bottle
  // coloured from its own notes. When photos are allowed: set PHOTOS = true and put the files in
  // catalog-img/<product id>.jpg. A perfume without a photo keeps its drawing.
  var PHOTOS = false;
  var NC = {lemon:'#F4D03F',pineapple:'#F2B84B',bergamot:'#B6D36B','black currant':'#5B3A6B',apple:'#8FCB6A',birch:'#CDBB9E',cedar:'#A67B5B','cacao pod':'#6B4130',iris:'#A99BE8',patchouli:'#6F7C4C',sandalwood:'#D2A679',jasmine:'#F4EDB5',mint:'#7ED8B5','green sap':'#8CC152',kumquat:'#FFA726',caramel:'#D9904A','tonka bean':'#B57C4D',vetiver:'#7A8C5A','clary sage':'#A7B89A',strawberry:'#F0627A','violet leaf':'#6FAF8C','blood grapefruit':'#F0705A',violet:'#9B7FD4',gardenia:'#F3E7DA',lavender:'#B9A2E6','bitter almond':'#E8C9A0',vanilla:'#F3DFA2',amber:'#E0A040',amberwood:'#C47F3B',ambergris:'#B7B1A6',saffron:'#E0742B','fir resin':'#4F7A5A',rose:'#EE7C9B',musk:'#D9CFC4',oud:'#6B4A3A',orange:'#FFA64D',pepper:'#C94B4B',cardamom:'#C9B27A',sandal:'#D2A679',coconut:'#F2EDE4'};
  function noteCol(n) { if (NC[n]) return NC[n]; var h = (n.length * 47 + n.charCodeAt(0) * 13) % 360; return 'hsl(' + h + ' 55% 70%)'; }
  function noteTxt(c) { var m = c.match(/^#(..)(..)(..)$/); if (!m) return '#141414'; var l = (.299 * parseInt(m[1], 16) + .587 * parseInt(m[2], 16) + .114 * parseInt(m[3], 16)) / 255; return l > .58 ? '#141414' : '#fff'; }
  function alpha(c, a) {
    if (c.charAt(0) === '#') return 'rgba(' + parseInt(c.substr(1, 2), 16) + ',' + parseInt(c.substr(3, 2), 16) + ',' + parseInt(c.substr(5, 2), 16) + ',' + a + ')';
    return c.replace(')', ' / ' + a + ')');
  }
  var bid = 0;
  function bottle(r, h) {
    var n = r.notes, c1 = noteCol(n[0] || 'musk'), c2 = noteCol(n[1] || n[0] || 'musk'), id = 'bg' + (++bid), s = hash(r.slug) % 4, body, cp;
    var lab = '<rect x="30" y="92" width="40" height="30" rx="3" fill="rgba(255,255,255,.88)"/><rect x="36" y="100" width="28" height="3" rx="1.5" fill="#141414" opacity=".7"/><rect x="40" y="107" width="20" height="2" rx="1" fill="#141414" opacity=".35"/>';
    if (s === 0) { body = '<rect x="14" y="48" width="72" height="104" rx="9" fill="url(#' + id + ')" stroke="rgba(255,255,255,.7)" stroke-width="2"/>'; cp = '<rect x="38" y="14" width="24" height="34" rx="3" fill="#2a2a2e"/><rect x="38" y="14" width="24" height="6" rx="3" fill="#C9A96A"/>'; }
    else if (s === 1) { body = '<circle cx="50" cy="104" r="48" fill="url(#' + id + ')" stroke="rgba(255,255,255,.7)" stroke-width="2"/>'; cp = '<rect x="40" y="26" width="20" height="14" rx="2" fill="#C9A96A"/><rect x="33" y="8" width="34" height="20" rx="10" fill="#C9A96A"/>'; lab = lab.replace('y="92"', 'y="96"'); }
    else if (s === 2) { body = '<rect x="28" y="40" width="44" height="116" rx="8" fill="url(#' + id + ')" stroke="rgba(255,255,255,.7)" stroke-width="2"/>'; cp = '<rect x="36" y="6" width="28" height="36" rx="14" fill="#1b1b1f"/>'; lab = '<rect x="33" y="92" width="34" height="30" rx="3" fill="rgba(255,255,255,.88)"/><rect x="38" y="100" width="24" height="3" rx="1.5" fill="#141414" opacity=".7"/>'; }
    else { body = '<path d="M30 44 H70 L90 70 V140 Q90 154 76 154 H24 Q10 154 10 140 V70 Z" fill="url(#' + id + ')" stroke="rgba(255,255,255,.7)" stroke-width="2"/>'; cp = '<rect x="38" y="16" width="24" height="30" rx="4" fill="#E9E4DA" stroke="#C9A96A" stroke-width="2"/>'; }
    return '<svg class="bt" viewBox="0 0 100 160" width="' + Math.round(h * 100 / 160) + '" height="' + h + '" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient></defs>' + body + lab + '<path d="M22 70 V140" stroke="rgba(255,255,255,.55)" stroke-width="5" stroke-linecap="round" fill="none"/>' + cp + '</svg>';
  }
  // The bottle on its stage: a photo if allowed and available, otherwise the drawing.
  function art(r, h) {
    var ph = PHOTOS && r.pid ? '<img class="pd-ph" src="catalog-img/' + esc(r.pid) + '.jpg" alt="' + esc(r.name) + ' bottle" loading="lazy" style="max-height:' + h + 'px" onload="this.parentNode.classList.add(\'has\')" onerror="this.remove()">' : '';
    return '<div class="pd-bw">' + bottle(r, h) + ph + '</div>';
  }
  // A card in the "pedestal" style, used by Explore and Catalogue. "inner" is the text under the bottle.
  function stage(r, h) {
    var n = r.notes, bubs = n.slice(0, 3).map(function (x) { var c = noteCol(x); return '<span class="pd-bub" style="background:' + c + ';color:' + noteTxt(c) + '">' + esc(cap(x.split(' ')[0])) + '</span>'; }).join('');
    return '<div class="pd-stage"><div class="pd-disc"></div><div class="pd-plat"></div>' + bubs + art(r, h) + '</div>';
  }
  function tint(r) { return alpha(noteCol(r.notes[0] || 'musk'), .35); }

  // A card in the pedestal style. The picture and name open the catalogue page; the button is the affiliate link.
  function cardHTML(r) {
    var href = 'catalog.html?id=' + encodeURIComponent(r.slug);
    var buy = r.link ? '<a class="pd-buy" href="' + esc(r.link) + '" target="_blank" rel="sponsored nofollow noopener">Check price ↗</a>' : '<a class="pd-buy" href="' + href + '">View ↗</a>';
    return '<div class="pd" style="--c1:' + tint(r) + '"><div class="pd-tg"><span class="gt">' + esc(GENDER[r.gender]) + '</span>' + (r.dupe ? '<span class="dp">DUPE</span>' : '') + '</div>' +
      '<a class="pd-main" href="' + href + '" aria-label="' + esc(r.name) + ' by ' + esc(r.house) + '">' + stage(r, 170) +
      '<div class="pd-hh">' + esc(r.house) + '</div><div class="pd-nm">' + esc(r.name) + '</div><div class="pd-nt">' + esc(r.notes.slice(0, 3).map(cap).join(', ')) + '</div></a>' +
      '<div class="pd-act">' + buy + '</div></div>';
  }

  window.PFC = { load: load, cardHTML: cardHTML, stage: stage, art: art, bottle: bottle, noteCol: noteCol, noteTxt: noteTxt, tint: tint, draw: draw, esc: esc, cap: cap, GENDER: GENDER, GENDER_GRAD: GENDER_GRAD };
})();
