/* ---------- ParfAI full catalogue ----------
   Reads catalog/fragrancenet.json (built by scripts/build-catalog.py from the Rakuten feed).
   No prices are stored or shown. Bottle photos stay hidden until FragranceNet
   confirms in writing that we may host copies: then set PHOTOS = true in catalog-lib.js and
   put the files in catalog-img/<product id>.jpg.
*/
(function () {
  var PAGE = 48;
  var GENDER = ['Men', 'Women', 'Unisex'];
  var data = null, rows = [], filtered = [], shown = 0;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function $(id) { return document.getElementById(id); }
  function param(n) { return new URLSearchParams(location.search).get(n) || ''; }
  function cap(s) { return s.replace(/\b([a-z])/g, function (m) { return m.toUpperCase(); }); }
  function linkFor(v) { return data.pre + v[0] + data.mid + v[2]; }
  function shortTitle(r) {
    var h = r.house.toLowerCase(), t = r.title;
    if (t.toLowerCase().indexOf(h + ' ') === 0 && t.length > h.length + 1) return t.slice(h.length + 1);
    return t;
  }
  function labelFor(v) {
    return cap(v[1].toLowerCase()).replace(/\b(\d+(?:\.\d+)?) (Oz|Ml|G)\b/g, function (m, n, u) { return n + ' ' + u.toLowerCase(); }) || 'Standard size';
  }
  function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }

  // Cards use the same pedestal look as Explore. Bottle drawings are made in catalog-lib.js,
  // which also holds the photo switch (PHOTOS) for when FragranceNet approves hosting.
  function cardHTML(r) {
    var notes = r.notes.slice(0, 3).map(cap).join(', ');
    var R = rowFor(r);
    return '<a class="pd" style="--c1:' + PFC.tint(R) + ';text-decoration:none;color:inherit" href="catalog.html?id=' + encodeURIComponent(r.slug) + '">' +
      '<div class="pd-tg"><span class="gt">' + GENDER[r.gender] + '</span></div>' + PFC.stage(R, 170) +
      '<div class="pd-hh">' + esc(r.house) + '</div><div class="pd-nm">' + esc(shortTitle(r)) + '</div>' +
      (notes ? '<div class="pd-nt">' + esc(notes) + '</div>' : '') +
      '<div class="pd-sz">' + plural(r.variants.length, 'size option') + '</div></a>';
  }
  // PFC wants a slug, name and notes; the catalogue row already has them under other names.
  function rowFor(r) { return { slug: r.slug, name: shortTitle(r), notes: r.notes, pid: r.variants[0] ? r.variants[0][0] : '' }; }

  function applyFilters() {
    var q = $('q').value.trim().toLowerCase(), g = $('gender').value, h = $('house').value.trim().toLowerCase(), sort = $('sort').value;
    var tokens = q ? q.split(/\s+/) : [];
    filtered = rows.filter(function (r) {
      if (g !== '' && String(r.gender) !== g) return false;
      if (h && r.house.toLowerCase() !== h) return false;
      for (var i = 0; i < tokens.length; i++) if (r.hay.indexOf(tokens[i]) === -1) return false;
      return true;
    });
    if (sort === 'az') filtered.sort(function (a, b) { return a.title.localeCompare(b.title); });
    else if (sort === 'new') filtered.sort(function (a, b) { return (b.year - a.year) || a.title.localeCompare(b.title); });
    else filtered.sort(function (a, b) { return (b.variants.length - a.variants.length) || a.title.localeCompare(b.title); });
    shown = 0;
    $('grid').innerHTML = '';
    $('count').textContent = filtered.length.toLocaleString('en-US') + (filtered.length === 1 ? ' perfume' : ' perfumes');
    if (!filtered.length) {
      $('grid').innerHTML = '<div style="grid-column:1/-1;color:var(--muted);padding:40px 0;text-align:center">No perfumes match that search yet. Try fewer words or a different spelling.</div>';
    }
    showMore();
    var u = new URLSearchParams();
    if (q) u.set('q', q); if (g !== '') u.set('gender', g); if (h) u.set('house', $('house').value.trim()); if (sort !== 'popular') u.set('sort', sort);
    history.replaceState(null, '', u.toString() ? '?' + u.toString() : location.pathname);
  }

  function showMore() {
    var slice = filtered.slice(shown, shown + PAGE);
    $('grid').insertAdjacentHTML('beforeend', slice.map(cardHTML).join(''));
    shown += slice.length;
    $('more').hidden = shown >= filtered.length;
  }

  function showList() {
    $('detail-view').hidden = true; $('list-view').hidden = false;
    $('q').value = param('q'); $('gender').value = param('gender'); $('house').value = ''; var hp = param('house').toLowerCase(); Array.prototype.forEach.call($('house').options, function (o) { if (hp && o.value.toLowerCase() === hp) $('house').value = o.value; }); $('sort').value = param('sort') || 'popular';
    document.title = 'Full perfume catalogue — ParfAI';
    applyFilters();
  }

  function showDetail(r) {
    $('list-view').hidden = true; $('detail-view').hidden = false;
    document.title = shortTitle(r) + ' by ' + r.house + ' — ParfAI';
    var facts = [GENDER[r.gender] === 'Unisex' ? 'Unisex' : 'For ' + GENDER[r.gender].toLowerCase()];
    if (r.year) facts.push('Launched ' + r.year);
    var intro = esc(shortTitle(r)) + ' is a ' + (GENDER[r.gender] === 'Unisex' ? 'unisex fragrance' : 'fragrance for ' + GENDER[r.gender].toLowerCase()) + ' from ' + esc(r.house) + (r.year ? ', launched in ' + r.year : '') + '.' +
      (r.notes.length ? ' Its listed notes include ' + esc(r.notes.slice(0, 6).join(', ')) + '.' : '') +
      (r.wear ? ' It is suggested for ' + esc(r.wear) + ' wear.' : '');
    var variants = r.variants.map(function (v) {
      var label = labelFor(v);
      return '<div class="vrow"><span>' + esc(label) + '</span><a class="btn sm" href="' + esc(linkFor(v)) + '" target="_blank" rel="sponsored nofollow noopener">Check price on FragranceNet ↗</a></div>';
    }).join('');
    var uae = '<div class="vrow uae"><span>In the UAE? Search this perfume on Amazon.ae</span><a class="btn sm" href="' + esc(amazonAE(shortTitle(r) + ' ' + r.house)) + '" target="_blank" rel="sponsored nofollow noopener">Shop in the UAE ↗</a></div>';
    var noon = '<div class="vrow uae"><span>Or shop at Noon UAE. Use code <b>' + esc(NOON_CODE) + '</b> at checkout for cashback (terms apply)</span><a class="btn sm" href="' + esc(noonAE(shortTitle(r) + ' ' + r.house)) + '" target="_blank" rel="sponsored nofollow noopener">Shop at Noon ↗</a></div>';
    var more = rows.filter(function (x) { return x.house === r.house && x.slug !== r.slug; }).slice(0, 8);
    $('detail-view').innerHTML = '<div class="dwrap">' +
      '<div class="crumbs"><a href="catalog.html">Catalogue</a> / <a href="catalog.html?house=' + encodeURIComponent(r.house) + '">' + esc(r.house) + '</a></div>' +
      '<div class="dhero"><div class="pdbig" style="--c1:' + PFC.tint(rowFor(r)) + '">' + PFC.stage(rowFor(r), 230) + '</div>' +
      '<div><div class="by"><a href="catalog.html?house=' + encodeURIComponent(r.house) + '">' + esc(r.house) + '</a></div><h1>' + esc(shortTitle(r)) + '</h1>' +
      '<div style="color:var(--ink2);font-size:14px">' + esc(facts.join('  ·  ')) + '</div>' +
      '<div class="chips">' + r.notes.slice(0, 12).map(function (n) { return '<a class="chip" href="catalog.html?q=' + encodeURIComponent(n) + '">' + esc(cap(n)) + '</a>'; }).join('') + '</div></div></div>' +
      '<div class="dsec"><h2>About this fragrance</h2><p>' + intro + '</p></div>' +
      '<div class="dsec"><h2>Sizes and where to buy</h2>' + variants + uae + noon +
      '<div class="cat-note" style="margin-top:14px">ParfAI earns a commission when you buy through these links, at no extra cost to you. Prices change often, so check the current price on the retailer page. As an Amazon Associate I earn from qualifying purchases. <a href="affiliate-disclosure.html">Affiliate disclosure</a></div></div>' +
      (more.length ? '<div class="dsec"><h2>More from ' + esc(r.house) + '</h2><div class="grid">' + more.map(cardHTML).join('') + '</div></div>' : '') +
      '</div>';
    window.scrollTo(0, 0);
  }

  function route() {
    var id = param('id');
    if (id) {
      var r = rows.filter(function (x) { return x.slug === id; })[0];
      if (r) return showDetail(r);
    }
    showList();
  }

  fetch('catalog/fragrancenet.json').then(function (res) { return res.json(); }).then(function (d) {
    data = d;
    rows = d.items.map(function (i) {
      var r = { slug: i[0], house: i[1], title: i[2], gender: i[3], year: i[4], notes: i[5], wear: i[6], variants: i[7] };
      r.hay = (r.house + ' ' + r.title + ' ' + r.notes.join(' ')).toLowerCase();
      return r;
    });
    var houses = {}; rows.forEach(function (r) { houses[r.house] = 1; });
    $('house').innerHTML = '<option value="">All houses</option>' + Object.keys(houses).sort(function (a, b) { return a.localeCompare(b); }).map(function (h) { return '<option value="' + esc(h) + '">' + esc(h) + '</option>'; }).join('');
    $('stat-count').textContent = rows.length.toLocaleString('en-US') + ' perfumes from ' + Object.keys(houses).length.toLocaleString('en-US') + ' houses';
    var t; ['q', 'gender', 'house', 'sort'].forEach(function (id) {
      $(id).addEventListener('input', function () { clearTimeout(t); t = setTimeout(applyFilters, id === 'q' ? 180 : 0); });
    });
    $('more').addEventListener('click', showMore);
    route();
  }).catch(function () {
    $('count').textContent = 'The catalogue could not be loaded. Please refresh the page.';
  });
})();
