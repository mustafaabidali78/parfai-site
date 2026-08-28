# Archived pages

Pages here have been removed from the live site (unlinked from nav, not
served as part of the active site flow) but are kept in this repo, with
full git history, so they can be restored on request without redoing any
work.

## pricing.html

Removed from the nav menu and top-level site on 2026-08-28. The page's
content (Free / Scent Pro tiers, prices, FAQ copy) is unchanged from when
it went live — see `git log --follow -- archive/pricing.html` (and
`pricing.html` before the rename) for full history.

**To restore:**

1. `git mv archive/pricing.html pricing.html` (from the `site/` directory)
2. Its `<link>`/`<script>` tags already use root-relative paths
   (`parfai.css`, `data.js`, `favicon.svg`, `supabase-client.js`,
   `auth.js`) — no path fixes needed once it's back at the root.
3. Bump its `?v=` cache-busting query params on `parfai.css`/`data.js` to
   match whatever the current site-wide version is (check any other
   `.html` file at the root for the current value).
4. In `data.js`, inside `renderNav()`, find the HTML comment starting
   `<!-- Pricing nav item removed 2026-08-28 -->` and replace the whole
   comment with the line it documents:
   `${link('pricing.html','Pricing','pricing')}`
5. Commit and push as usual.

That's the whole restore — nothing else in the site referenced
`pricing.html` at removal time (confirmed via a repo-wide grep), so no
other files need changes.
