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
            notes: cleanNotes(i[5]), wear: i[6], sizes: i[7].length,
            link: variant ? d.pre + variant[0] + d.mid + variant[2] : ''
          };
          r.dupe = !!dupeSet[r.house.toLowerCase()];
          r.ok = !NOT_PERFUME.test(r.title) && !/bath & body/i.test(r.house) && r.notes.length >= 3;
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

  // A home page card. The picture and name open the catalogue page; the button is the affiliate link.
  function cardHTML(r) {
    var g = GENDER_GRAD[r.gender] || GENDER_GRAD[2];
    var href = 'catalog.html?id=' + encodeURIComponent(r.slug);
    var buy = r.link ? '<a class="buy" href="' + esc(r.link) + '" target="_blank" rel="sponsored nofollow noopener">Check price ↗</a>' : '<a class="buy" href="' + href + '">View ↗</a>';
    return '<div class="pcard" style="background:linear-gradient(150deg,' + g[0] + ',' + g[1] + ')">' +
      '<a class="em" href="' + href + '" aria-label="' + esc(r.name) + ' by ' + esc(r.house) + '"><span class="fam">' + GENDER[r.gender].toUpperCase() + '</span>' + (r.dupe ? '<span class="dupe">DUPE</span>' : '') + '<div class="bottle"></div></a>' +
      '<div class="info"><a href="' + href + '"><div class="bd">' + esc(r.house) + '</div><div class="nm">' + esc(r.name) + '</div>' +
      '<div class="hnotes">' + esc(r.notes.slice(0, 3).map(cap).join(', ')) + '</div></a>' +
      '<div class="prow">' + buy + '</div></div></div>';
  }

  window.PFC = { load: load, cardHTML: cardHTML, draw: draw, esc: esc, cap: cap, GENDER: GENDER, GENDER_GRAD: GENDER_GRAD };
})();
