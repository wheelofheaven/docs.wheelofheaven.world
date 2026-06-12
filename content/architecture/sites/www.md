+++
title = "www.wheelofheaven.world"
description = "The main public-facing knowledge base — Zola, Bifrost theme, ten languages, Cloudflare Pages."
weight = 10
+++

The main public-facing knowledge base website.

## Overview

- **URL:** <https://www.wheelofheaven.world>
- **Generator:** Zola
- **Hosting:** Cloudflare Pages
- **Theme:** Bifrost
- **Languages:** 10 (en, de, fr, es, ru, ja, zh, zh-Hant, ko, he — Hebrew renders RTL)

## Content sections

| Section | Path | Template | Notes |
|---------|------|----------|-------|
| Wiki | `/wiki/` | `wiki-page.html` | Encyclopedia of terms, figures, motifs |
| Timeline | `/timeline/` | `timeline-page.html` | Twelve precessional ages |
| Library | `/library/` | `library-book.html` | Sacred and primary texts with paragraph-level commentary |
| Articles | `/articles/` | `articles-page.html` | Long-form essays and explainers (idea-driven, evergreen) |
| News | `/news/` | `news-page.html` | Newsroom dispatches (event-driven, decays) |
| Sources | `/sources/` | `sources-section.html` | Living bibliography, JSON-driven from `data/sources.json`, with generated detail pages at `/sources/{id}/` |
| Press | `/press/` | `info-page.html` | Press kit — brand assets, palette, contact |

## Configuration

```toml
# config.toml
base_url = "https://www.wheelofheaven.world"
default_language = "en"
theme = "bifrost"
compile_sass = true
build_search_index = true
generate_feeds = true

[search]
index_format = "fuse_json"

[extra]
cdn_url = "https://assets.wheelofheaven.world"
```

## Build commands

```sh
mise run serve    # dev server (port 1199)
mise run build    # production build
mise run check    # check for issues
mise run clean    # remove build artifacts
```

## Features

### Search

Client-side search using Fuse.js. Index includes all content sections.
Keyboard shortcut: `/`.

### Dark/light mode

System-aware default, manual toggle in navbar, persisted in localStorage.

### Library reader

Paragraph-level navigation, keyboard shortcuts (j/k/n/p), bookmarks and
highlights, reading progress tracking, font size preferences.

### Version provenance

Library book pages surface a provenance panel so readers can inspect the
version/source context that backs the text they are reading.

### Wiki references

Wiki citations resolve against stable source IDs from
`data/sources.json`. Unknown IDs fail the build before deploy, so the
rendered reference list and the inline citation markers stay aligned.
The same IDs also drive local source detail pages at `/sources/{id}/`
and their reverse `Cited by` blocks.

### PWA support

Offline page, installable, service worker caching.

### SEO/AEO

JSON-LD schemas per content type, AI-extraction meta tags, speakable
content markup.

## Directory structure

```
www.wheelofheaven.io/
├── config.toml
├── mise.toml
├── content/                 # → data-content submodule
├── data/
│   └── library/             # → data-library submodule
├── themes/
│   └── bifrost/             # → bifrost submodule
├── static/
│   ├── brand/
│   ├── fonts/
│   └── map/
└── public/                  # build output (gitignored)
```

## Submodule management

```sh
# update all submodules
git submodule update --remote

# update a specific submodule
git submodule update --remote content

# after updating, commit the pointer change
git add content && git commit -m "Update content submodule"
```

## Deployment

Automatic deployment on push to `main`:

1. GitHub push triggers Cloudflare Pages
2. Build command: `curl -sL [zola-url] | tar xz && ./zola build`
3. Output directory: `public/`
4. Deployed to edge network

See [CI & Deploy](@/contributing/dev/ci-deploy.md) for details.
