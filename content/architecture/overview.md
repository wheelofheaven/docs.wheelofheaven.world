+++
title = "Architecture Overview"
description = "How the Wheel of Heaven sites, themes, content repos, and build pipeline fit together."
weight = 10
+++

The Wheel of Heaven ecosystem uses a modular architecture with Git submodules
to share content and themes across multiple sites.

## High-level architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           WHEEL OF HEAVEN ECOSYSTEM                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        CLOUDFLARE PAGES                              │    │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐        │    │
│  │  │      www        │ │       api       │ │     assets      │        │    │
│  │  │  Static Site    │ │    JSON API     │ │      CDN        │        │    │
│  │  │  1,251 pages    │ │   REST endpoints│ │  Images/Media   │        │    │
│  │  └────────┬────────┘ └────────┬────────┘ └────────┬────────┘        │    │
│  └───────────┼───────────────────┼───────────────────┼──────────────────┘    │
│              │                   │                   │                       │
│  ┌───────────┴───────────────────┴───────────────────┴──────────────────┐    │
│  │                         BUILD LAYER (Zola)                            │    │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐         │    │
│  │  │ www.wheelof...  │ │ api.wheelof...  │ │ data-images     │         │    │
│  │  │   ├── themes/   │ │   ├── data/     │ │   ├── sources/  │         │    │
│  │  │   │   └── bifrost│ │   │   ├── content│ │   ├── processed/│         │    │
│  │  │   ├── content/  │ │   │   └── library│ │   └── scripts/  │         │    │
│  │  │   └── data/     │ │   └── templates/│ │                  │         │    │
│  │  │       └── library│ │                 │ │                  │         │    │
│  │  └─────────────────┘ └─────────────────┘ └─────────────────┘         │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│              │                   │                                           │
│  ┌───────────┴───────────────────┴──────────────────────────────────────┐    │
│  │                      SHARED SUBMODULES                                │    │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐         │    │
│  │  │   bifrost       │ │  data-content   │ │  data-library   │         │    │
│  │  │   (theme)       │ │  (markdown)     │ │  (books JSON)   │         │    │
│  │  └─────────────────┘ └─────────────────┘ └─────────────────┘         │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Author     │────▶│ data-content │────▶│  Zola Build  │────▶│  Cloudflare  │
│   (Markdown) │     │  (Git repo)  │     │   (Static)   │     │   (CDN)      │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  Validation  │
                     │  (CI/CD)     │
                     └──────────────┘
```

## Submodule relationships

```
www.wheelofheaven.io
├── content/           → data-content (submodule)
├── data/library/      → data-library (submodule)
└── themes/bifrost/    → bifrost (submodule)

api.wheelofheaven.io
├── data/content/      → data-content (submodule)
└── data/library/      → data-library (submodule)
```

## Key design decisions

### Content as submodules

Single source of truth for content. Shared between www and api. Independent
versioning — each repo bumps its content pointer when ready.

### Theme extraction (Bifrost)

The reading theme is its own repo. Reusable across projects, decoupled from
content, versioned separately.

### Split book format

Library books are split into per-chapter JSON with paragraph-level granularity
and stable refIds (e.g. `TBWTT-1:5`). Enables deep linking and multi-language
text within a single source. See [Library Book Format](@/reference/library-book-format.md).

### Static-first

No server-side processing. Cloudflare Pages serves built HTML from edge caches.
The "API" is also static — Zola-generated JSON files served like any other
asset.

## Component responsibilities

| Component | Responsibility |
|-----------|----------------|
| www | User-facing knowledge base |
| api | Machine-readable JSON endpoints |
| assets | Image CDN with format optimization |
| bifrost | Templates, styles, JavaScript |
| data-content | Markdown content (1,330+ files) |
| data-library | Book data (catalog + chapters) |
| data-images | Image processing pipeline |

## Build process

1. **Content authored** in `data-content` (Markdown)
2. **Submodules updated** in www/api repos
3. **Zola builds** static HTML/JSON
4. **Cloudflare deploys** on git push
5. **CDN caches** at edge locations

See [Pipelines](@/contributing/dev/pipelines.md) for the full build,
content, and image pipeline details.
