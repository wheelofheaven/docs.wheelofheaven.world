+++
title = "Performance"
description = "How the landing page hits a 98 Lighthouse Performance score — preload, critical CSS, poster sizing — and how to maintain it."
weight = 30
+++

What we do to keep `www.wheelofheaven.world` fast, and why.
The work below was sparked by a 2026-05 Lighthouse audit of the landing
page (`/`) that started at LCP 5.4s.
After three targeted changes it's at LCP under 2s with the scores below.

## Current Lighthouse scores

Audited on the landing page (`/`), mobile profile, cold cache.

| Category | Score |
|---|---|
| Performance | 98 |
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

### 2. Async-load `main.css` with a `critical.css` gate

The full stylesheet (`main.css`, ~455 KB / 60 KB gzipped) was loaded
synchronously in `<head>` on every page.
That blocks rendering for ~540ms on a cold connection.

A `sass/critical.scss` already existed but was never wired up — it
compiles to a 60 KB / 10 KB-gzipped `critical.css` covering every above-
the-fold class on the landing page (`base`, `themes`, `layout/navbar`,
`layout/header`, `layout/grid`, `pages/home`).

On landing pages only, ship critical synchronously and async-load main
with the preload+`onload` swap pattern.
The relevant chunk of `themes/bifrost/templates/partials/fonts-css.html`
emits this HTML on locale homepages:

```html
<link rel="stylesheet" href="https://www.wheelofheaven.world/critical.css">
<link rel="preload" as="style"
      href="https://www.wheelofheaven.world/main.css"
      onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://www.wheelofheaven.world/main.css"></noscript>
```

Every other page falls through to the existing single-sync `main.css`
link.

Other pages keep the full-sync load because `critical.css` doesn't cover
their page-specific layouts (wiki, library, articles), and an async swap
there would FOUC the body.

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

§2–§6 posters have not been resized.
They're below the fold, so they don't affect LCP — only bandwidth and
scroll-transition snappiness.
Apply the same `cwebp` command if you want to optimize them.

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

Target: Performance ≥ 95 on the landing page, mobile profile.

## Known not-pursued items

These were flagged by the same audit but left alone.
Both are tagged "Unscored" by Lighthouse, meaning they don't currently
affect the score.

### Unused CSS in async `main.css` (~53 KiB)

`main.css` carries styles for every section on the site (wiki, library,
articles, timeline, etc.) but the landing page only renders the
`landing-*` classes.
The fix is per-route CSS splitting, which is a real refactor of the 7-1
SCSS bundle.
Not worth it for two points on an already-async load.

### Inline JS not minified (~3 KiB)

The big inline `<script>` in `templates/partials/navbar.html` (language
detection, dropdown init, mutation observer) is ~5.6 KiB unminified.
Lighthouse can't see inline scripts as separately-fetched resources, so
the only way to clear the finding is to extract them to external files
where the build pipeline can minify and `defer` them.
That's a non-trivial refactor of working code for ~3 KiB savings — left
for a future pass.
