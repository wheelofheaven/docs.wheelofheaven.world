+++
title = "Performance"
description = "How the landing page stays fast — preload, inlined critical CSS, font discipline, FOUC and CLS prevention — and how to maintain it."
weight = 30
+++

What we do to keep `www.wheelofheaven.world` fast, and why.
The work below was sparked by a 2026-05 Lighthouse pass on the landing
page (`/`) that started at LCP 5.4s and Performance 52.
After the changes below, LCP sits at ~3.4s, CLS at 0, and the scores
table below.

## Current Lighthouse scores

Audited on the landing page (`/`), mobile profile, cold cache.

| Category | Score |
|---|---|
| Performance | 90 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

The full optimization pass is focused on the landing page because it is the
only page on the site with full-bleed background video and the only page
where LCP was meaningfully bad.
Other pages were already in good shape — their LCP element is usually a
text headline that paints as soon as CSS arrives.

## The three landing-page LCP techniques

### 1. Preload the §1 video poster

The landing page's first viewport is the §1 *Opening Question* section,
which uses a `<video preload="none" poster="...">` as a full-bleed
background.
The `<video>` element doesn't autoplay — the poster image is what
actually paints first, and it is the LCP element.

The trap: `<video poster=...>` is **not preload-scanned**.
The browser discovers the poster URL only after layout, which means it
fetches late and LCP suffers.

Fix: an explicit preload in `<head>` (in `themes/bifrost/templates/base.html`),
gated to locale-root paths so other pages don't pay for an unused fetch.
The relevant chunk emits this HTML on every locale homepage:

```html
<link
    rel="preload"
    as="image"
    type="image/webp"
    href="https://assets.wheelofheaven.world/videos/landing/01-question-poster.webp"
    fetchpriority="high"
/>
```

In the template it's wrapped in an `{_is_landing}` conditional set
earlier in `base.html` — see the file for the locale-root check.

The `_is_landing` flag is also used by the CSS strategy below — keep
them in sync.
Adding a new locale means adding it to that path list.

### 2. Inline `critical.css`, async-load `main.css`

The full stylesheet (`main.css`, ~455 KB / 60 KB gzipped) was loaded
synchronously in `<head>` on every page.
That blocks rendering for ~540ms on a cold connection.

A `sass/critical.scss` already existed but was never wired up — it
compiles to a ~60 KB / 10 KB-gzipped `critical.css` covering every above-
the-fold class on the landing page (`base`, `themes`, `layout/navbar`,
`layout/header`, `layout/grid`, `pages/home`).

On landing pages, **inline** `critical.css` directly in `<head>` via
Zola's `load_data` (reading `public/critical.css`), then async-load
`main.css` with the preload+`onload` swap pattern.
Inlining beats a separate `<link>` here because eliminating the extra
blocking request shaves an RTT off LCP.
The chunk in `themes/bifrost/templates/partials/fonts-css.html`:

```tera
{%/* if _is_landing */%}
{%/* set critical_css = load_data(path="public/critical.css", format="plain", required=false) */%}
{%/* if critical_css */%}<style>{{/* critical_css | safe */}}</style>{%/* else */%}<link rel="stylesheet" href="{{/* get_url(path='critical.css') */}}">{%/* endif */%}
{%/* set reveal = "document.documentElement.classList.add('css-loaded')" */%}
<link rel="preload" as="style" href="{{/* get_url(path='main.css') */}}" onload="this.onload=null;this.rel='stylesheet';{{/* reveal */}}" onerror="{{/* reveal */}}">
<noscript>…</noscript>
{%/* else */%}
<link rel="stylesheet" href="{{/* get_url(path='main.css') */}}">
{%/* endif */%}
```

The `<link>` fallback covers the first build pass (when
`public/critical.css` doesn't exist yet) and any environment where
`load_data` fails.
The `reveal` callback adds `css-loaded` to `<html>`, which un-gates the
FOUC-prevention rules described below.

Every other page falls through to the existing single-sync `main.css`
link — `critical.css` doesn't cover their page-specific layouts (wiki,
library, articles), and an async swap there would FOUC the body.

If you add new above-the-fold classes to the landing page, add the
corresponding `@use` to `sass/critical.scss` or they'll FOUC until
`main.css` arrives.

### 3. Right-sized poster images

The original `01-question-poster.webp` was 1280×720 at 132 KB.
Two things made that wasteful:

- The §1 media has a `.landing-section__overlay` gradient at 35–65% black
  on top of the poster. Quality loss is not visible through the overlay.
- Lighthouse's mobile profile renders the page at ~412 CSS pixels wide;
  serving a 1280-wide image is paying for desktop quality the mobile
  audit can't see.

Resized to 800×450 at WebP quality 65, 53 KB — a ~60% byte reduction with
no visible quality loss thanks to the overlay.

```sh
# Generate the landing poster from the encoded source
cwebp -m 6 -q 65 -resize 800 450 \
  raw-media/landing/01-question/encoded/01-question-poster.jpg \
  -o assets.wheelofheaven.world/videos/landing/01-question-poster.webp
```

The asset URL is unchanged.
`Cache-Control: public, max-age=31536000, immutable` means browsers that
already had the old file will keep using it until natural eviction —
purge the URL in Cloudflare if you want all visitors switched
immediately.

§2–§6 posters have been resized with the same recipe (`-q 65 -resize
800 450`).
They're below the fold, so they don't affect LCP — only bandwidth and
scroll-transition snappiness — but resizing them was worth the few
hundred KB total saving across the five sections.

## Font discipline: web-font fetches on the LCP path

The `iAWriterQuattroS` monospace was historically declared on every
`.tech` / kbd / eyebrow rule, which fanned out across landing markup
into many selectors.
Chrome's preload scanner sees the `@font-face` URL declaration and
speculatively fetches the font at VeryHigh priority — even when the
matched element is below the fold or never paints — which competes
with the §1 poster fetch on the LCP path.

Two changes removed it from the critical path:

1. **Per-selector swap** — every landing-DOM monospace selector
   (eyebrows in `pages/_home.scss`, `_timeline.scss`, `_read.scss`,
   the navbar kbd, the footer closure, the reader-fab) was switched
   to a `$_landing-mono: ui-monospace, SFMono-Regular, Menlo, Consolas,
   monospace` system stack.
2. **`url()` removed from `@font-face`** — only `local()` is left
   (`themes/bifrost/sass/base/_fonts.scss`).
   Users who happen to have iAWriterQuattroS installed still get it;
   nobody pays the network fetch.

Net effect: ~91 KB removed from every cold visit's LCP-blocking
critical path.

## FOUC and CLS prevention

The async `main.css` strategy means there's a brief window — usually
sub-100ms, but variable on slow networks — where the page has parsed
HTML and applied `critical.css` but is still waiting for `main.css`.
Two failure modes need handling.

### Unstyled-chrome flash

Chrome and other dropdown/banner widgets render their default browser
flow during that window: anchor links show in default blue, modals
appear at the default position, the offline indicator and
reading-list panel mount visible.

Mitigation in `sass/critical.scss`:

- A small set of always-rendered widgets (`.keyboard-shortcuts-modal`,
  `.highlight-share`, `.glossary-tooltip`) and JS-mounted widgets
  (`.offline-indicator`, `.reading-list-panel`, `.pwa-install-banner`,
  `.pwa-update-banner`) get `position: fixed; opacity: 0;
  visibility: hidden; pointer-events: none` from creation, matching
  the hidden state their main.css `--open` / `--visible` modifiers
  expect.
- A `html:not(.css-loaded)` gate hides chrome whose layout lives in
  main.css: `.translation-notice`, `.footer`, `.snackbar-container`,
  the navbar dropdowns and panes, `.read__paths`, `.claim-badges`,
  the reader-fab TOC sheet.
- The `reveal` callback wired into the `main.css` preload's `onload`
  (and `onerror`) flips `<html>` to `.css-loaded`, removing the gate
  the moment main.css parses (or fails — better to show unstyled
  chrome than leave it permanently hidden).

### Layout shift from delayed grid layout

`visibility: hidden` still occupies flow.
A hidden element whose final layout differs from its default-browser
flow will reflow when the gate lifts — even though the user never sees
the unstyled state.

The §7 reading-paths block is the classic case: the three
`.read__path` anchors stack as default block elements until
`main.css` arrives, then collapse into a single row when the grid
kicks in.
§8 below jumps up by a few hundred px → Lighthouse logs CLS.

Mitigation: any grid layout that's gated by `main.css` but whose
section is gated by the FOUC `:not(.css-loaded)` rule needs its
**layout** (display, grid-template-columns, gap) inlined into
`critical.scss`.
For `.read__paths`:

```scss
.read__paths {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: _v.$spacing-lg;
    margin: 0 auto;

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
        gap: _v.$spacing-md;
    }
}
```

Visual styling (glass, hairlines, hover) stays in `main.css`.
Net result: CLS dropped from 0.26 → 0 on the landing page.

If you add another section to the landing that uses a grid or flex
layout defined in another page-SCSS file (e.g. `pages/_read.scss`,
`pages/_library.scss`), repeat this pattern — inline just the layout
declarations in `critical.scss`.

## Related work in the same pass

### Accessibility — `inert` on the closed mobile language pane

Lighthouse's accessibility audit flagged the mobile language pane
(`#mobile-lang-pane`): it was `aria-hidden="true"` while closed, but its
back button stayed in the tab order, tripping the `aria-hidden-focus`
rule.

Fix: also toggle the `inert` attribute alongside `aria-hidden` on
open/close.
`inert` removes the subtree from both the tab order and the
accessibility tree, which is the correct semantic for a closed pane.

```html
<!-- templates/partials/navbar.html: initial markup -->
<div class="navbar__pane navbar__pane--lang mobile-only"
     id="mobile-lang-pane"
     aria-hidden="true"
     inert>
```

JS toggles `inert` in `openMobileLangPane()` / `closeMobileLangPane()`.

Same pattern applies to any future pane / drawer / modal that holds
focusable controls but is closed by default.
Pair `aria-hidden` with `inert` from the start.

## Maintenance

### Adding a new landing section with video

1. Encode the source video and generate the poster at **800×450 WebP
   quality 65** using the `cwebp` command above.
2. Place the poster and `.webm` at
   `assets.wheelofheaven.world/videos/landing/<n>-<slug>-poster.webp` /
   `<n>-<slug>.webm`.
3. Add the section markup to `themes/bifrost/templates/index.html` with
   `<video preload="none" poster="...">`.
4. If the new section becomes the **first** section (`§1` / above-the-
   fold), update the preload URL in `templates/base.html` to point at
   the new poster.
   Otherwise the preload still points at the old §1 and you're fetching
   a poster nobody sees first.

### Adding a new locale

Add the new locale root path to the `_is_landing` expression in
`templates/base.html`.
Otherwise the new locale's homepage falls back to the slower CSS path
and no LCP preload.

### Lighthouse run cadence

There's no automated Lighthouse run yet.
Re-audit manually after:

- Adding or replacing a landing section.
- Bumping the bifrost theme submodule pointer with template/SCSS
  changes.
- Adding a new locale.

Target: Performance ≥ 90 and CLS = 0 on the landing page, mobile profile.

## Known not-pursued items

These were flagged by the same audit but left alone.

### LCP — §1 video poster fetch (~3.4s)

The §1 poster is preloaded, but on the mobile profile the fetch + decode
still places LCP around 3.4s.
The remaining levers (smaller poster, AVIF, blurhash-style placeholder
inlined as a data URI for the first 200ms) all trade visual quality or
template complexity against a sub-second improvement.
Left for a future pass.

### Unused CSS in async `main.css` (~56 KiB)

`main.css` carries styles for every section on the site (wiki, library,
articles, timeline, etc.) but the landing page only renders the
`landing-*` classes.
The fix is per-route CSS splitting, which is a real refactor of the 7-1
SCSS bundle.
Not worth it for a few points on an already-async load.

### Inline JS not minified (~3 KiB)

The big inline `<script>` in `templates/partials/navbar.html` (language
detection, dropdown init, mutation observer) is ~5.6 KiB unminified.
Lighthouse can't see inline scripts as separately-fetched resources, so
the only way to clear the finding is to extract them to external files
where the build pipeline can minify and `defer` them.
That's a non-trivial refactor of working code for ~3 KiB savings — left
for a future pass.

### Web-font metric overrides

The §1 H1 uses SpaceGrotesk 700, preloaded — but the swap from the
Georgia fallback to SpaceGrotesk has different metrics, which can
produce a small reflow on the LCP element.
Mitigation is `size-adjust` / `ascent-override` / `descent-override` on
the `@font-face` declarations (the `fontpie` technique).
Current measured CLS is 0, so this stays on the backlog until a future
run flags it again.
