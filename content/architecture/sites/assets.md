+++
title = "assets.wheelofheaven.world"
description = "The image CDN — AVIF/WebP/JPG with edge caching, populated by the data-images pipeline."
weight = 30
+++

CDN for serving optimized images and static assets.

## Overview

- **URL:** <https://assets.wheelofheaven.world>
- **Hosting:** Cloudflare Pages
- **Purpose:** Image CDN with format optimization

## Image formats

All images are served in multiple formats:

| Format | Use case | Browser support |
|--------|----------|-----------------|
| AVIF | Best compression | Modern browsers |
| WebP | Good compression | Wide support |
| JPG | Fallback | Universal |

## URL structure

```
https://assets.wheelofheaven.world/images/{category}/{image-name}.{ext}
```

Categories: `wiki/`, `timeline/`, `resources/`, `brand/`.

## Usage in templates

The Bifrost theme's `figure` shortcode handles format selection:

```html
{{/* figure(src="wiki/elohim-creation", caption="The Elohim creating life") */}}
```

Generates:

```html
<picture>
  <source srcset=".../wiki/elohim-creation.avif" type="image/avif">
  <source srcset=".../wiki/elohim-creation.webp" type="image/webp">
  <img src=".../wiki/elohim-creation.jpg" loading="lazy">
</picture>
```

## Configuration

The main site references the CDN via `config.toml`:

```toml
[extra]
cdn_url = "https://assets.wheelofheaven.world"
```

## Image processing pipeline

Images are processed via the `data-images` repository:

```
data-images/
├── sources/          # original high-res images
├── raw/              # unprocessed uploads
├── processed/        # optimized output (per-format trees)
├── og/               # Open Graph card renderer
└── scripts/
    ├── process_images.py
    └── deploy_to_cdn.py
```

See [Image pipeline](@/contributing/dev/pipelines.md) for the full processing
chain.

## Caching strategy

| Setting | Value |
|---------|-------|
| Cache TTL | 1 year |
| Browser TTL | 1 month |
| Cache level | Cache Everything |

```
Cache-Control: public, max-age=31536000, immutable
```

Images are considered immutable — new versions get new filenames.

## Performance benefits

1. **Edge caching** — served from nearest Cloudflare POP
2. **Format negotiation** — browser gets the optimal format
3. **Lazy loading** — images load on scroll
4. **Compression** — AVIF is ~50% smaller than JPG
