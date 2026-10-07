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
  // Short search words for Amazon and Noon: house plus the first few words of the name,
  // without size, strength or "for men" words, so more perfumes are found.
  var SKIP = {for:1,men:1,man:1,women:1,woman:1,pour:1,homme:1,femme:1,unisex:1,edp:1,edt:1,eau:1,de:1,parfum:1,toilette:1,cologne:1,spray:1,set:1,gift:1,tester:1,and:1,'&':1,the:1,by:1,extrait:1,intense:1,elixir:1,pure:1,perfume:1};
  var ART = {al:1,el:1,la:1,le:1,les:1,l:1,du:1,del:1,der:1};
  function shopWords(r) {
    var words = shortTitle(r).replace(/[()\[\],.]/g, ' ').replace(/'/g, '').split(/\s+/).filter(Boolean);
    var keep = words.filter(function (w) { return !SKIP[w.toLowerCase()]; });
    if (!keep.length) keep = words;
    var n = ART[keep[0].toLowerCase()] ? 3 : 2;
    return keep.slice(0, n).join(' ');
  }
  function shopQuery(r) { return r.house + ' ' + shopWords(r); }
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
    var uae = '<div class="vrow uae"><span>In the UAE? Search this perfume on Amazon.ae</span><a class="btn sm" href="' + esc(amazonAE(shopQuery(r))) + '" target="_blank" rel="sponsored nofollow noopener">Shop in the UAE ↗</a><a class="vmore" href="' + esc(amazonAE(r.house)) + '" target="_blank" rel="sponsored nofollow noopener">More ' + esc(r.house) + ' on Amazon.ae</a></div>';
    var noon = '<div class="vrow uae"><span>Or shop at Noon UAE. Use code <b>' + esc(NOON_CODE) + '</b> at checkout for cashback (terms apply)</span><a class="btn sm noonlink" href="' + esc(noonAE(shopQuery(r))) + '" target="_blank" rel="sponsored nofollow noopener">Shop at Noon ↗</a><a class="vmore noonlink" href="' + esc(noonAE(r.house)) + '" target="_blank" rel="sponsored nofollow noopener">More ' + esc(r.house) + ' on Noon</a></div>';
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

  // Noon code pop-up: shown when someone clicks a Noon link, so they see the code before leaving.
  (function () {
    var box = null, lastFocus = null;
    function close() {
      if (!box) return;
      document.removeEventListener('keydown', onKey);
      box.parentNode.removeChild(box); box = null;
      if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    function copyCode(btn, note) {
      function done(ok) {
        btn.textContent = ok ? 'Copied' : 'Copy code';
        note.textContent = ok ? 'The code is copied. Paste it in the promo code box at checkout.' : 'Please copy the code by hand: ' + NOON_CODE;
      }
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(NOON_CODE).then(function () { done(true); }, function () { done(false); }); return; }
      } catch (e) {}
      try {
        var ta = document.createElement('textarea'); ta.value = NOON_CODE; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); var ok = document.execCommand('copy'); document.body.removeChild(ta); done(ok);
      } catch (e2) { done(false); }
    }
    function open(href) {
      close();
      lastFocus = document.activeElement;
      box = document.createElement('div');
      box.className = 'ncode-back';
      box.innerHTML = '<div class="ncode" role="dialog" aria-modal="true" aria-labelledby="ncode-t">' +
        '<h3 id="ncode-t">Before you go to Noon</h3>' +
        '<p>Use this code at checkout to get cashback.</p>' +
        '<div class="ncode-row"><b class="ncode-code">' + esc(NOON_CODE) + '</b><button type="button" class="btn sm ncode-copy">Copy code</button></div>' +
        '<p class="ncode-note" aria-live="polite">Paste it in the promo code box when you pay.</p>' +
        '<div class="ncode-go"><a class="btn ncode-cont" target="_blank" rel="sponsored nofollow noopener">Continue to Noon ↗</a><button type="button" class="ncode-x">Not now</button></div>' +
        '<p class="ncode-fine">Cashback terms apply. Valid on orders above AED 40. ParfAI earns a commission when you use this code.</p>' +
        '</div>';
      document.body.appendChild(box);
      var cont = box.querySelector('.ncode-cont'), copy = box.querySelector('.ncode-copy'), note = box.querySelector('.ncode-note');
      cont.setAttribute('href', href);
      cont.addEventListener('click', function () { copyCode(copy, note); setTimeout(close, 150); });
      copy.addEventListener('click', function () { copyCode(copy, note); });
      box.querySelector('.ncode-x').addEventListener('click', close);
      box.addEventListener('click', function (e) { if (e.target === box) close(); });
      document.addEventListener('keydown', onKey);
      copyCode(copy, note);
      cont.focus();
    }
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a.noonlink') : null;
      if (!a) return;
      e.preventDefault();
      open(a.getAttribute('href'));
    });
  })();
})();
