+++
title = "CI & Deploy"
description = "Cloudflare Pages projects, custom domains, headers, redirects, and the build webhook chain."
weight = 40
+++

How a git push becomes a deployed site. The "pipeline" view of the same
chain — content → build → CDN — lives in
[Pipelines](@/contributing/dev/pipelines.md); this page is the
Cloudflare-side view: projects, domains, headers.

## Sites configuration

| Site | Project name | Custom domain | Build command |
|------|--------------|---------------|---------------|
| www | wheelofheaven | www.wheelofheaven.world | See below |
| api | api-wheelofheaven | api.wheelofheaven.world | See below |
| assets | assets-wheelofheaven | assets.wheelofheaven.world | N/A (static) |
| docs | docs-wheelofheaven-world | docs.wheelofheaven.world | See below |

## Build configuration

### www.wheelofheaven.world

Since Cloudflare doesn't ship Zola pre-installed, we download it at
build time:

**Build command:**

```sh
curl -sL https://github.com/getzola/zola/releases/download/v0.22.0/zola-v0.22.0-x86_64-unknown-linux-gnu.tar.gz -o zola.tar.gz && tar xzf zola.tar.gz && ./zola build
```

**Build output directory:** `public`

**Environment variables:** none required (Zola reads `config.toml`).

### api.wheelofheaven.world

```sh
python3 scripts/prebuild.py && curl -sL https://github.com/getzola/zola/releases/download/v0.22.0/zola-v0.22.0-x86_64-unknown-linux-gnu.tar.gz -o zola.tar.gz && tar xzf zola.tar.gz && ./zola build && bash scripts/postbuild.sh
```

**Build output directory:** `public`

The prebuild step extracts wiki / timeline / articles / news / tradition hubs from `data/content`, mirrors the bibliography from `data/bibliography`, and writes one Zola content page per entry under `content/v1/` plus a per-section index data file under `data/extracted/`. The postbuild step mirrors each generated `index.html` as `index.json`, writes `_headers` (Content-Type, CORS, cache TTLs, `X-License`, `X-Citable`, `X-API-Version`), and writes `_redirects` so directory URLs are canonical. Both files are committed to the repo and required for the API to serve correctly.

### docs.wheelofheaven.world

Same pattern, pinned to a more recent Zola:

```sh
curl -sL https://github.com/getzola/zola/releases/download/v0.22.1/zola-v0.22.1-x86_64-unknown-linux-gnu.tar.gz -o zola.tar.gz && tar xzf zola.tar.gz && ./zola build
```

**Build output directory:** `public`

### assets.wheelofheaven.world

**Build command:** none (static files only).
**Build output directory:** `/` (root).

## Deployment workflow

```mermaid
flowchart LR
    push["Git push<br/>(main)"]
    hook["Cloudflare<br/>webhook"]
    build["Build<br/>(Zola)"]
    deploy["Deploy<br/>(edge)"]
    push --> hook --> build --> deploy
```

1. Push to `main` triggers a CF Pages webhook
2. Cloudflare clones the repository (with submodules)
3. Build command executes
4. Output deployed globally to the edge network

## Submodule support

Cloudflare Pages auto-initializes Git submodules. `.gitmodules` must use
HTTPS URLs for public repos (CF Pages authenticates via the GitHub app's
HTTPS credentials):

```ini
[submodule "themes/bifrost"]
    path = themes/bifrost
    url = https://github.com/wheelofheaven/bifrost.git
```

For private repos, use deploy keys or HTTPS with a token.

## Custom domains

### DNS configuration

For apex (`wheelofheaven.world`):

```
Type:    CNAME
Name:    @
Target:  wheelofheaven.pages.dev
Proxied: yes
```

For subdomain (`www.wheelofheaven.world`):

```
Type:    CNAME
Name:    www
Target:  wheelofheaven.pages.dev
Proxied: yes
```

### SSL/TLS

- Automatic certificate provisioning
- Full (strict) SSL mode
- HTTPS enforced

## Headers configuration

Custom headers via a `_headers` file in the output:

```
# static/_headers (api example)
/*
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, HEAD, OPTIONS
  Content-Type: application/json; charset=utf-8

/v1/*
  Cache-Control: public, max-age=3600
```

## Redirects

Custom redirects via a `_redirects` file:

```
/old-path  /new-path  301
/legacy/*  /wiki/:splat  301
```

## Build caching

Cloudflare caches:

- Node modules (if `package.json` present)
- Build dependencies

The Zola binary download is quick (~5 seconds), so it's not normally a
bottleneck.

## Monitoring

### Build logs

Cloudflare dashboard → Pages project → Deployments → click a deployment
for the full log.

### Analytics

Web Analytics is enabled per project — Core Web Vitals tracking, no
client-side JavaScript required.

## Troubleshooting

### Build failures

#### "Command not found: zola"

Use the curl-download method in the build command.

#### "Submodule not found"

- Ensure submodule URLs are HTTPS
- Check `.gitmodules` is committed

#### "Out of memory"

Zola builds are lightweight; rarely an issue. Contact Cloudflare support
if persistent.

#### "Pages only supports up to 20,000 files in a deployment"

Cloudflare Pages caps every deployment at 20,000 files, across all
plans (Free, Pro, Business). The Zola build succeeds in the log but
the deploy step rejects the artefact and the previous successful
build keeps serving — new URLs from the failed deploy 404. Verify
locally before pushing big page-count changes:

```sh
mise run build && find public -type f | wc -l
```

For the full incident postmortem and the working patterns (drop
redundant postbuild file mirrors, make per-language mirrors coverage-
honest), see
[Hosting and Caching → CF Pages 20,000-file deployment cap](@/architecture/hosting-and-caching.md).

### Cache issues

#### Stale content after deploy

- Cloudflare purges cache on deploy automatically for **same-URL HTML
  pages** (network-first via Cloudflare Pages' default behaviour).
- Browser cache may persist — hard-refresh.
- Check `Cache-Control` headers.

#### Stale `core.bundle.js` after a deploy that touched `bifrost`

The www site is two CDN layers deep — **gh-pages branch →
GitHub Pages (Fastly, ~10-min asset cache) → Cloudflare (7-day
edge cache from `static/_headers`) → user**. Both layers cache
JS bundles, both layers key on URL string (not content hash),
and both layers ignore the gh-pages branch update until their
own TTL expires.

The bundle is loaded via
`bifrost/templates/partials/scripts.html`:

```tera
<script src="{{ get_url(path='js/dist/core.bundle.js') | safe }}?v=N" defer></script>
```

When bundled JS source changes (`listen-button.js`,
`reader-fab.js`, etc.), bump the `?v=N` querystring in
`scripts.html` — CF Pages caches each `?v=N` as a distinct key,
so the bump forces a MISS on the new URL. **But** if Fastly is
still serving the previous bundle when CF MISSes (i.e. the bump
went out within ~10 min of the original deploy), CF will cache
the stale bytes under the new URL for 7 more days. So bump
`?v=N` either with the deploy (and then again ~15 min later if
verification fails) or in a separate follow-up commit.

Verify the deploy is actually live with content-comparison, not
just a deploy-succeeded log line:

```sh
# what gh-pages shipped:
git show origin/gh-pages:js/dist/core.bundle.js | wc -c

# what CF edge is serving (forces MISS to bypass any existing cache):
curl -sI "https://www.wheelofheaven.world/js/dist/core.bundle.js?bust=$(uuidgen)" | grep -i content-length
```

If these don't match, Fastly hasn't refreshed. Wait, then bump
`?v=N` again so CF caches the fresh response. For an emergency
override (critical fix), purge via the Cloudflare dashboard or
API instead. Full deploy-gotcha table for the audiobook stack:
[Audiobook Pipeline → Bundle + cache invalidation](@/contributing/dev/audiobook-pipeline.md#bundle-cache-invalidation).

#### Stale CDN asset for visitors with a service worker

The `www` service worker uses **`cacheFirst` (no revalidation)** for
any cross-origin request to `assets.wheelofheaven.world` — images,
audio MP3s, timing JSON, manifests. Once a visitor has the asset in
their SW cache, they keep it forever until cache namespaces change.

The cache namespace embeds `CACHE_VERSION` from `static/sw.js`
(`woh-images-${CACHE_VERSION}` etc.). Old namespaces get deleted on
SW activation. So when CDN content changes (new audio takes, updated
manifest shape, etc.), **bump `CACHE_VERSION`** in `www/static/sw.js`
and push — visitors pick up v(N+1) on their next page load and the
v(N) cache is dropped.

Symptom when the bump is missed: a visitor's normal browser keeps
serving the old audio / old timing / old manifest forever, while
Incognito works fine.

## Comparison: GitHub Pages vs Cloudflare Pages

| Feature | GitHub Pages | Cloudflare Pages |
|---------|--------------|------------------|
| Custom build | Jekyll only | Any static generator |
| Edge network | Limited | Global |
| Custom headers | No | Yes |
| Redirects | Limited | Yes |
| Analytics | No | Yes |
| Preview deploys | No | Yes |
| Submodules | Yes | Yes |
