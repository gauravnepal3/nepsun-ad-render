# The Slow Page — ad test site

A plain static blog for testing ad code and ad delivery. No build step, no
dependencies, no framework. Edit the HTML directly.

## Run it

```
python3 -m http.server 8000
```

Then open http://localhost:8000. (Use a server rather than `file://` — most ad
tags need a real origin.)

## Files

```
index.html        post listing
about.html
posts/post-1.html …post-3.html   long articles (good for lazy-load testing)
css/style.css
js/ads.js         test helpers only — no ad server calls
```

## Where to put ad code

Library / header tags (GPT, prebid, etc.) go in the `<!-- HEAD AD CODE -->`
block in the `<head>` of each page.

Slot markup goes inside the matching `<div class="ad-slot">`, replacing the
`<!-- paste ad code here -->` comment. Slot IDs are consistent across pages:

| ID | Where | Typical size |
|---|---|---|
| `ad-leaderboard-top` | above the fold, every page | 728x90 / 970x250 |
| `ad-infeed-1` | inside the post list, home page | 300x250 |
| `ad-feed-bottom` | below the post list, home page | 300x250 |
| `ad-incontent-1`, `-2` | mid-article, post pages | 300x250 / fluid |
| `ad-article-end` | below the article body | 300x250 |
| `ad-sidebar-1` | sidebar, upper | 300x250 |
| `ad-sidebar-sticky` | sidebar, sticky on scroll | 300x600 |
| `ad-anchor-footer` | fixed footer anchor | 320x50 / 728x90 |

## Test helpers

Query params:

- `?debug=1` — panel listing every slot, its rendered size, and whether it filled
- `?clean=1` — hides the dashed slot outlines and labels, for screenshots

Every slot also logs to the console when it scrolls into view (`[ads] slot in
view: …`), which is useful for checking lazy-load and viewability behaviour.

The dashed outlines come from `.ad-slot` in `css/style.css` — delete that rule
if you want the page to look exactly like production.
