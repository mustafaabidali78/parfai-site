/* ---------- cookie notice ----------
   Shows once per visitor. Choice is remembered in localStorage under
   "parfai_consent" ("accepted" or "declined"). Visitors whose browser sends a
   Global Privacy Control signal are treated as declined and are not asked.
   Any optional tracking added in future must check window.parfaiConsent.allowed().
*/
(function () {
  var KEY = 'parfai_consent';
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  var gpc = !!(navigator.globalPrivacyControl);

  window.parfaiConsent = {
    allowed: function () { return !gpc && read() === 'accepted'; },
    reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} show(); }
  };

  /* Visitor counter (Cloudflare Web Analytics). Only loads after the visitor accepts.
     Paste the site token between the quotes below to switch it on. */
  var STATS_TOKEN = '';
  function loadStats() {
    if (!STATS_TOKEN || window.__parfaiStats || !window.parfaiConsent.allowed()) return;
    window.__parfaiStats = true;
    var s = document.createElement('script');
    s.defer = true;
    s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    s.setAttribute('data-cf-beacon', JSON.stringify({ token: STATS_TOKEN }));
    document.head.appendChild(s);
  }
  loadStats();

  if (gpc) { if (!read()) write('declined'); return; }
  if (read()) return;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show);
  else show();

  function show() {
    if (document.getElementById('parfai-cookie')) return;
    var css = document.createElement('style');
    css.textContent =
      '#parfai-cookie{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;' +
      'background:var(--panel,#fff);color:var(--ink,#141414);border:1px solid var(--border,rgba(20,20,20,.09));' +
      'border-radius:14px;box-shadow:0 8px 30px rgba(20,20,20,.15);padding:16px 18px;' +
      'font:14px/1.5 var(--body,Inter,Arial,sans-serif)}' +
      '#parfai-cookie p{margin:0 0 12px;color:var(--ink2,#4A4A46)}' +
      '#parfai-cookie a{color:inherit;text-decoration:underline}' +
      '#parfai-cookie .pc-row{display:flex;gap:10px;flex-wrap:wrap}' +
      '#parfai-cookie button{font:inherit;font-weight:600;cursor:pointer;border-radius:999px;padding:9px 18px;' +
      'border:1px solid var(--ink,#141414);background:transparent;color:var(--ink,#141414)}' +
      '#parfai-cookie button.pc-yes{background:var(--ink,#141414);color:var(--bg,#FAFAF7)}' +
      '#parfai-cookie button:focus-visible{outline:2px solid var(--violet,#8B7CFF);outline-offset:2px}';
    document.head.appendChild(css);

    var box = document.createElement('div');
    box.id = 'parfai-cookie';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Cookie notice');
    box.innerHTML =
      '<p>ParfAI uses cookies and similar storage to keep you signed in and remember your preferences. ' +
      'When you click a link to a retailer, that retailer and its affiliate network may set their own cookies ' +
      'so the referral can be credited. See our <a href="privacy.html">Privacy Policy</a> and ' +
      '<a href="affiliate-disclosure.html">Affiliate Disclosure</a>.</p>' +
      '<div class="pc-row"><button type="button" class="pc-yes">Accept</button>' +
      '<button type="button" class="pc-no">Decline optional cookies</button></div>';
    document.body.appendChild(box);
    function done(v) { write(v); box.remove(); loadStats(); }
    box.querySelector('.pc-yes').addEventListener('click', function () { done('accepted'); });
    box.querySelector('.pc-no').addEventListener('click', function () { done('declined'); });
  }
})();
