+++
title = "Hosting and Caching"
description = "How Cloudflare Pages serves the sites, what gets cached where, and how cache invalidation works."
weight = 20
+++

How content moves from origin to browser, and what gets cached at each
layer.

## Cache layers

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│  Cloudflare │────▶│   Origin    │────▶│   Source    │
│   Cache     │     │   Edge      │     │   (Pages)   │     │   (Git)     │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
     Local           Global CDN         Build Output        Repository
```

## Cache configuration by site

### www.wheelofheaven.world

| Asset type | Browser TTL | Edge TTL | Strategy |
|------------|-------------|----------|----------|
| HTML pages | 0 | Deploy purge | Always fresh |
| CSS/JS | 1 year | 1 year | Hashed filenames |
| Fonts | 1 year | 1 year | Immutable |
| Images | 1 month | 1 year | Long-lived |

### api.wheelofheaven.world

| Endpoint | Browser TTL | Edge TTL | Header |
|----------|-------------|----------|--------|
| `/v1/*` | 1 hour | 1 hour | `max-age=3600` |

```
# static/_headers
/v1/*
  Cache-Control: public, max-age=3600
```

### assets.wheelofheaven.world

| Asset type | Browser TTL | Edge TTL | Header |
|------------|-------------|----------|--------|
| All images | 1 year | 1 year | `max-age=31536000, immutable` |

Images are immutable — updates get new filenames.

## Cloudflare cache settings

### Page rules (if needed)

```
URL: assets.wheelofheaven.world/*
Setting: Cache Level = Cache Everything
Edge TTL: 1 month
Browser TTL: 1 year
```

### Cache purge

On Cloudflare Pages deployment, cache for changed files is purged
automatically and the edge cache is invalidated globally.

Manual purge via API:

```sh
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

## Browser caching

### HTML documents

No caching, to ensure fresh content:

```
Cache-Control: no-cache
```

Cloudflare serves from edge but validates on each request.

### Static assets

Long cache with hashed filenames:

```
Cache-Control: public, max-age=31536000, immutable
```

Zola generates hashed asset URLs, so new versions get new URLs and bypass
the cache automatically.

### Service worker (PWA)

The service worker manages its own cache:

- Cache-first for static assets
- Network-first for HTML
- Fallback to offline page

## Cache debugging

### Check cache status

```sh
curl -I https://www.wheelofheaven.world/ | grep -i cf-cache
```

Response header values:

- `cf-cache-status: HIT` — served from edge
- `cf-cache-status: MISS` — fetched from origin
- `cf-cache-status: DYNAMIC` — not cached

### Force bypass

Add a query string to bypass cache:

```
https://www.wheelofheaven.world/?nocache=1
```

Or use browser dev tools: "Disable cache" checkbox.

## Cache optimization

1. **CDN for images** — all images served from `assets.wheelofheaven.world`
   with aggressive caching.
2. **Minimize HTML** — keep pages focused; lazy-load images; defer
   non-critical JS.
3. **Long browser TTLs** — consistent URLs for unchanged assets,
   fingerprinted filenames for CSS/JS.
4. **Edge-first architecture** — static generation only; no server-side
   rendering; everything cacheable.
