+++
title = "Bifrost Theme"
description = "The multilingual reading theme — templates, shortcodes, SCSS architecture, and how to extend it."
weight = 20
+++

Bifrost is the Zola theme that powers `www.wheelofheaven.world`. Named
after the rainbow bridge in Norse mythology — and reused here by
`docs-theme`, which imports Bifrost's design tokens via SCSS so palette,
typography, and spacing come from one source.

The docs site pins Bifrost as a submodule, independently of the pin in
`www`. Nothing keeps the two pins level, so token changes reach the docs
site only when someone bumps its pin — and only the four files under
`sass/abstracts/` matter when deciding whether to.

## Overview

- **Repository:** [github.com/wheelofheaven/bifrost](https://github.com/wheelofheaven/bifrost)
- **License:** CC0-1.0 (Public Domain)
- **Zola version:** 0.19.0+
- **Languages:** 10 supported

## Features

- **Multilingual** — 10 languages with RTL handling for Hebrew (`he`)
- **Dark/light mode** — system-aware with manual toggle
- **Responsive** — mobile-first design
- **Accessible** — WCAG 2.1 AA compliant
- **SEO optimized** — JSON-LD schemas, meta tags
- **PWA ready** — offline support, installable

## Installation

Add as a Git submodule:

```sh
git submodule add https://github.com/wheelofheaven/bifrost themes/bifrost
```

Update `config.toml`:

```toml
theme = "bifrost"
```

## Directory structure

```
bifrost/
├── theme.toml              # theme metadata
├── templates/
│   ├── base.html           # root template
│   ├── index.html          # homepage
│   ├── 404.html
│   ├── *-section.html      # section templates
│   ├── *-page.html         # page templates
│   ├── macros/             # reusable macros
│   ├── partials/
│   │   ├── schema/         # JSON-LD schemas
│   │   └── icons/          # SVG icons
│   └── shortcodes/         # markdown shortcodes
├── sass/                   # SCSS (7-1 architecture)
│   ├── main.scss           # entry point
│   ├── abstracts/          # variables, mixins
│   ├── base/               # reset, typography
│   ├── components/         # UI components
│   ├── layout/             # navbar, footer
│   ├── pages/              # page-specific
│   ├── themes/             # light/dark
│   └── vendors/            # third-party
└── static/
    └── js/                 # JavaScript modules
```

## Templates

### Section templates

| Template | Section |
|----------|---------|
| `wiki-section.html` | Wiki index |
| `timeline-section.html` | Timeline / ages index |
| `library-section.html` | Book library index |
| `articles-section.html` | Articles index |
| `news-section.html` | Newsroom dispatches index |
| `sources-section.html` | JSON-driven bibliography page |

### Page templates

| Template | Content type |
|----------|--------------|
| `wiki-page.html` | Wiki entries |
| `timeline-page.html` | Precessional ages |
| `library-book.html` | Book reader |
| `articles-page.html` | Long-form essays |
| `news-page.html` | Newsroom dispatches |
| `info-page.html` | Standalone pages (about, press, contact) |

## Shortcodes

| Shortcode | Usage |
|-----------|-------|
| `figure` | Responsive images with CDN |
| `cite` | Citation references |
| `definition` | Term definitions |
| `info` | Info boxes |
| `link` | Internal links |
| `ref` | Cross-references |
| `reference` | Bibliography entries |
| `author` | Author attribution |
| `library` | Library links |

### Figure shortcode

```markdown
{{/* figure(src="wiki/elohim", caption="The Elohim") */}}
```

Generates a responsive `<picture>` with AVIF/WebP/JPG sources from the
assets CDN.

## JavaScript modules

| Module | Purpose |
|--------|---------|
| `navbar.js` | Navigation behavior |
| `search.js` | Client-side search |
| `library-reader.js` | Book reading UI |
| `library-storage.js` | Persistence layer |
| `library-study-tools.js` | Bookmarks, highlights |
| `library-search.js` | In-book search |
| `pwa.js` | Service worker |
| `toc-scroll-spy.js` | ToC highlighting |
| `to-top.js` | Scroll to top |
| `timeline.js` | Timeline interactions |
| `reading-list.js` | Reading list feature |

## JavaScript bundling & cache-busting

The site does **not** serve the raw `static/js/*.js` sources — it serves
**committed esbuild bundles** under `static/js/dist/*.bundle.js`. Editing a
source module is not enough on its own: regenerate and commit the bundle.

**When you change any `static/js/*.js`:**

1. Edit the source module.
2. `mise run bundle` (or `cd themes/bifrost && npm run bundle`) — runs
   `scripts/bundle.js` (esbuild) and rewrites `static/js/dist/*.bundle.js`.
3. **Commit the regenerated `dist/*.bundle.js` artifact** alongside the source.
   `mise run build` also bundles first, but a plain `zola build` serves the
   committed bundle — so it must be up to date in git.

Entry points are declared in `themes/bifrost/scripts/bundle.js`:

| Bundle | Loaded | Contains |
|---|---|---|
| `core.bundle.js` | every page, `?h=<contenthash>` | navbar, search-loader, reading-list, notification-stack, pwa, toc-scroll-spy, cite-copy, … |
| `search.bundle.js` | lazy, on first search interaction, `?v=N` | `vendor/fuse.min.js`, `search.js` |
| `library.bundle.js` | library pages | library-storage, library-reader, … |

**Cache-busting is not uniform — this is the trap.** `core.bundle.js` is
referenced with a **content-hash** `?h=…`, so any change auto-busts it. But
`search.bundle.js` is lazy-loaded by `search-loader.js` with a **manual `?v=N`
tag** (not a content hash) under a 7-day CDN cache — so changing `search.js`
alone will **not** reach returning visitors. You must **bump `?v=N` in
`search-loader.js`**. Because `search-loader.js` lives in `core.bundle.js`,
bumping it changes core's content-hash, which busts core's own cache → the fresh
core then requests the new `search.bundle.js?v=N+1`.

Verify a deploy end-to-end along the chain the browser follows:
`index.html → core.bundle.js?h=… → search.bundle.js?v=…`.

## Configuration options

```toml
# theme.toml
[extra]
multilingual = true
dark_mode = true
search = true
responsive = true
palette = "bifrost"
sections = ["wiki", "timeline", "library", "articles", "news", "sources"]
```

## Customization

### Colors

Edit `sass/abstracts/_colors.scss`:

```scss
$yellow: #f9c74f;
$pink: #f72585;
$lavender: #b5a7d5;
// ... Bifrost palette
```

### Spacing

Edit `sass/abstracts/_variables.scss`:

```scss
$spacing-md: 1rem;
$spacing-lg: 1.5rem;
$border-radius-md: 0.5rem;
```

### Glassmorphism invariants

Every chrome surface (navbar, search modal, dropdowns, tooltips, FABs,
reader popovers) shares one glass recipe: `background-color:
var(--color-navbar-bg)` (~10% alpha per theme) plus `backdrop-filter:
blur(...)`. Two rules keep it rendering identically on every engine:

1. **No transformed ancestors above a glass surface.** WebKit (iOS and
   macOS Safari) silently refuses to render `backdrop-filter` on any
   element that has a transformed ancestor — including identity
   transforms like `translateY(0)` and transforms that only exist
   mid-animation. Center overlays with `left: 0; right: 0;
   margin-inline: auto` or a JS-measured `left`, never
   `translateX(-50%)`; animate position with `top`, and use fade-only
   entrances for surfaces whose blur lives on a child or `::before`.
   A transform on the blurred element *itself* is fine (the FABs rely
   on this).

2. **Fallback lives in the token, not the component.** Engines with no
   `backdrop-filter` support at all get a near-opaque surface via a
   single `@supports not (...)` override of `--color-navbar-bg` in
   `sass/themes/_init.scss` — the same mechanism the
   `prefers-reduced-transparency` override uses. Never hardcode a
   per-component opaque fallback.
