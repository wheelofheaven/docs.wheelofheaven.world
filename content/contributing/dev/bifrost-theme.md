+++
title = "Bifrost Theme"
description = "The multilingual reading theme — templates, shortcodes, SCSS architecture, and how to extend it."
weight = 20
+++

Bifrost is the Zola theme that powers `www.wheelofheaven.world`. Named
after the rainbow bridge in Norse mythology — and reused here by
`docs-theme` (it imports Bifrost's design tokens via SCSS so palette,
typography, and spacing stay in sync).

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
