+++
title = "Changelog"
description = "Major project milestones — domain migrations, framework decisions, editorial passes."
weight = 90
+++

This page records *project-level* changes — the structural shifts in
infrastructure, framing, or editorial program that matter beyond a single
commit. For day-to-day commit history, use Git.

## 2026-05 — Search Console / hreflang fix

First Google Search Console audit of `www.wheelofheaven.world`,
one week into full crawl coverage. Two structural issues surfaced:
hreflang was broken across all ~2,000 translation pages (Zola's native
`page.translations` doesn't see directory-prefixed locales, only
file-suffix translations), and ~80 URLs were 404'ing from a mix of
trailing-slash quirks, stale paths, and the broken hreflang's
side-effect of generating double-slash internal links.

Fix landed as a new manifest-driven hreflang pipeline
(`scripts/build_translations_manifest.py` writes
`data/translations.json`, the partial reads it via `load_data`) plus
five literal redirect rules in `static/_redirects` for the stale
`/wiki/age-of-*` and `/wiki/timeline/*` paths Google had cached.
Trailing-slash normalization is left to Cloudflare Pages's built-in
behavior — explicit per-locale rules ran into a de-facto rule-count
cap (~270) that silently drops anything later in the file.

The pass also committed 700 `translation_status = "en_only"` library
stubs in `data-content` that had been sitting untracked in the
working tree (the missing-content cause of ~40 of the Search Console
404s). The build-translations-manifest script now uses `git ls-files`
so untracked WIP can't inflate the manifest again.

Full writeup: [Indexing & Multilingual SEO](@/architecture/indexing.md).

## 2026-05 — Landing-page performance pass

First targeted Lighthouse pass on `www.wheelofheaven.world/`.
LCP dropped from 5.4s to under 2s, Performance score 98, Accessibility /
Best Practices / SEO all 100.
Three landing-page-only changes: explicit `<link rel="preload">` for the
§1 video poster, async-loaded `main.css` with the pre-existing
`critical.css` filling above-the-fold, and a resized §1 poster
(1280×720 132 KB → 800×450 53 KB).
The mobile language pane was also given the `inert` attribute alongside
`aria-hidden` to clear an accessibility violation.
Full writeup: [Performance](@/architecture/performance.md).

## 2026-05 — Documentation site launched

`docs.wheelofheaven.world` (this site) launched as a dedicated
author/contributor/developer documentation site, separate from the main
knowledge base. Replaces the old browse-on-GitHub `wheelofheaven/docs`
repository. See the
[plan in `.claude/plans/docs-site.md`](https://github.com/wheelofheaven/.claude/blob/main/plans/docs-site.md)
for the design and rollout. Stack: Zola + a minimal `docs-theme` that
imports Bifrost's design tokens.

## 2026-05 — Editorial pass: modern working-hypothesis framing

First major editorial pass (`editorial_pass = "2026-05"`) under the
*modern, working-hypothesis, human-civilization* framing. Dropped the
"democratization / knowledge base / lore" register; tightened claim
discipline; uses "Elohim were a small advanced human civilization" rather
than "extraterrestrial."

## 2026-04 — Source program rolled out

`claim_type` and the source-registry tier system rolled out. Every new
entry declares its epistemic status (`direct` | `inferred` |
`speculative`), and resources get tiered (Tier 0: Raëlian canon, Tiers
1–4 for everything else read in dialogue).

## Domain migration: wheelofheaven.io → wheelofheaven.world

Scope: full migration of the public site, JSON API, and asset CDN from the
`.io` TLD to `.world`. The `.io` domain is kept indefinitely with permanent
301 redirects to `.world`.

| Subdomain | Old | New |
| --- | --- | --- |
| Main site | `www.wheelofheaven.io` | `www.wheelofheaven.world` |
| API | `api.wheelofheaven.io` | `api.wheelofheaven.world` |
| Asset CDN | `assets.wheelofheaven.io` | `assets.wheelofheaven.world` |

Hosting: Cloudflare Pages (×3 projects), with Cloudflare DNS in front and
Cloudflare Single Redirects on the `.io` zone for the path-preserving
301 hop.

### Repositories changed

Domain references were updated across the following repos. **Commit and
push these in dependency order** (the website repos depend on the theme
and content submodules).

1. **`bifrost`** — theme: hardcoded CDN URL fallbacks in image macros,
   `preconnect`/`dns-prefetch` in `base.html`, `alternateName` and email in
   JSON-LD schema partials, `beta.wheelofheaven.io` check generalized to
   `beta.wheelofheaven.` in link macros, hardcoded asset URLs in
   `timeline.js`, regenerated `static/js/dist/*.bundle.js`, sitemap
   homepage detection made TLD-agnostic, ask-ai prompt domain mention,
   `_pwa.scss` external-link selector generalized to
   `[href*="wheelofheaven."]`.
2. **`data-content`** — content URL refs in `faq.md`, `cookie-policy.md`,
   `wiki/wheel-of-heaven.md`, `wiki/list-of-exegetic-readings.md`,
   `wiki/list-of-close-encounters.md`, `author/zara-zinsfuss.md` across
   all 9 languages, plus `README.md`. The migration script
   `/tmp/woh-migrate.py` was used to apply substitutions safely
   (preserving `github.com/wheelofheaven/<repo>.io` references).
3. **`data-library`** — `README.md` URL ref. TODO file's directory-name
   references intentionally left as `.io` (local dir names are not being
   renamed).
4. **`data-bibliography`** — `README.md` URL ref.
5. **`www.wheelofheaven.io`** (the local repo name stays `.io`) —
   `config.toml` (`base_url`, `cdn_url`, `organization_id`),
   `static/CNAME`, `static/_headers` (CSP allowlist),
   `static/robots.txt` (sitemap URL), `static/site.webmanifest`
   (`related_applications`, `scope_extensions`),
   `static/sw.js` (`CDN_ORIGIN` + `CACHE_VERSION` bump v2 → v3),
   `static/llms.txt`, `static/llms-full.txt`, `data/ages.json`,
   `content/*` and submodule pointer bumps for theme and content.
6. **`api.wheelofheaven.io`** — `config.toml`, `CNAME`, all six
   `templates/*.json` (`v1-catalog.json`, `v1-context.json`,
   `v1-context-timeline.json`, `v1-context-terminology.json`,
   `index.json`), `README.md`, submodule pointer bumps.
7. **`assets.wheelofheaven.io`** — `README.md` only.
8. **`epub.wheelofheaven`** — `book/metadata.yaml` (EPUB identifier URL).

Files **deliberately not changed**:

- GitHub repo URLs
  (`github.com/wheelofheaven/wheelofheaven.io`,
  `…/www.wheelofheaven.io`, etc.) — repo names are not being renamed.
- Local directory names (`www.wheelofheaven.io/`,
  `api.wheelofheaven.io/`, `assets.wheelofheaven.io/`) — filesystem
  layout, not part of the domain migration.
- `www.wheelofheaven.io-legacy/`, `.archive/`, `node_modules/`, `public/`.

### Pre-launch checklist

#### Cloudflare zone setup

- [x] `.world` zone is on Cloudflare with **Active** status (DNS resolvers are CF nameservers).
- [x] On `.world` zone DNS, add CNAME records, all proxied (orange cloud):
    - `www` → `<www-project>.pages.dev`
    - `api` → `<api-project>.pages.dev`
    - `assets` → `<assets-project>.pages.dev`
- [x] Decide what to do with the apex `wheelofheaven.world`. Default: a
      Single Redirect rule on the `.world` zone that 301s the apex to
      `https://www.wheelofheaven.world${URI}`.

#### Cloudflare Pages custom domains

For each of the three Pages projects (www, api, assets):

- [x] In **Settings → Custom domains**, add the corresponding `.world` hostname.
- [x] Wait for "Active" status with SSL certificate issued.
- [x] Verify: `curl -I https://www.wheelofheaven.world/` returns 200.

#### Repository changes deployed

- [x] Push all repo changes through normal CI.
- [x] CF Pages production deploys complete on all three projects.
- [x] `curl -I https://www.wheelofheaven.world/` and
      `https://www.wheelofheaven.world/sitemap.xml` return 200 with
      `.world` URLs in the response body.
- [x] Same for `https://api.wheelofheaven.world/v1/context` and
      `https://assets.wheelofheaven.world/...`.

#### Search Console pre-verification

- [x] Add `www.wheelofheaven.world` as a property in Google Search Console.
- [x] Verify via DNS TXT (preferred — covers all subdomains).
- [x] Confirm `www.wheelofheaven.io` property is still verified.
- [x] Submit `https://www.wheelofheaven.world/sitemap.xml` in GSC.

### Launch — `.io` → `.world` redirect activation

#### Cloudflare Single Redirects on the `.io` zone

In the Cloudflare dashboard for the `.io` zone: **Rules → Redirect Rules**.
Create one Single Redirect per subdomain.

**Rule 1 — main site (www and apex):**

- **When:** `(http.host eq "www.wheelofheaven.io") or (http.host eq "wheelofheaven.io")`
- **Target:** `https://www.wheelofheaven.world${URI}`
- **Status:** `301`
- **Preserve query string:** yes
- Dynamic equivalent expression:
  `concat("https://www.wheelofheaven.world", http.request.uri.path, if(len(http.request.uri.query) > 0, concat("?", http.request.uri.query), ""))`

**Rule 2 — api:**

- **When:** `http.host eq "api.wheelofheaven.io"`
- **Target:** `https://api.wheelofheaven.world${URI}`
- **Status:** `301`

**Rule 3 — assets:**

- **When:** `http.host eq "assets.wheelofheaven.io"`
- **Target:** `https://assets.wheelofheaven.world${URI}`
- **Status:** `301`

#### Verify the redirects

```sh
# main site — root
curl -I https://www.wheelofheaven.io/
# expect: HTTP/2 301, Location: https://www.wheelofheaven.world/

# main site — deep path with query
curl -I "https://www.wheelofheaven.io/wiki/elohim/?utm_source=test"
# expect: HTTP/2 301, Location: https://www.wheelofheaven.world/wiki/elohim/?utm_source=test

# confirm exactly one 301 hop, then 200
curl -IL https://www.wheelofheaven.io/timeline/age-of-aquarius/

# apex and bare-host variants
curl -I https://wheelofheaven.io/
curl -I http://wheelofheaven.io/
curl -I http://www.wheelofheaven.io/

# API
curl -I https://api.wheelofheaven.io/v1/context

# assets
curl -I https://assets.wheelofheaven.io/images/wiki/elohim-symbol.webp
```

#### Google Search Console Change of Address

- In the `www.wheelofheaven.io` GSC property: **Settings → Change of Address → Update**.
- Target: `www.wheelofheaven.world`.
- GSC runs automated checks. Resolve any failures and re-submit.
- Bing Webmaster Tools: same procedure if used.

### Post-launch monitoring

For 2–4 weeks:

- **GSC Coverage / Indexing** — `.world` URLs should be getting indexed;
  `.io` URLs should move to "Page with redirect."
- **GSC Crawl Stats** — Googlebot reduces hits to `.io` over time as
  `.world` becomes canonical.
- **404 reports** — check on both zones for unexpected misses.
- **Analytics** — confirm traffic continues on `.world` host.
- **Top traffic pages** — spot-check that `.io` URLs for top-N pages all
  return 301 → matching `.world` paths.

Permanent obligations:

- **Renew `.io` annually** until at least 2027 (12-month minimum after
  migration). Prefer indefinite renewal.
- **Keep the Single Redirect rules active** on `.io` indefinitely.
  Removing them breaks every external link to old URLs.
- **Annual audit** — re-run `scripts/check-domain-migration.sh` against a
  fresh build to catch new hardcoded `.io` refs that may have slipped in.

### Rollback plan

If something breaks catastrophically after cutover:

1. **Before redirect activation:** `git revert` the merged commits in
   `www.wheelofheaven.io`, `api.wheelofheaven.io`, `bifrost`,
   `data-content`. Push. CF Pages auto-deploys old commits. Both domains
   resume serving `.io`-canonical content.
2. **After redirect activation:** first **disable the Single Redirect
   rules on the `.io` zone**. `.io` resumes serving content directly. Then
   revert repo commits as above.

The `.io` Pages custom domains remain attached the entire migration, so
disabling redirects is sufficient to restore `.io` serving at any point.

### Local validation

```sh
cd www.wheelofheaven.io
zola build
scripts/check-domain-migration.sh public

# expected output:
#   OK: sitemap.xml uses .world only.
#   OK: robots.txt sitemap points at .world.
#   OK: homepage canonical is .world.
#   All checks passed. Only GitHub repo URLs reference .io (expected).
```

### Open items at migration time

- **Email forwarding:** the JSON-LD organization schema and references
  now show `contact@wheelofheaven.world`. Set up CF Email Routing on the
  `.world` zone to forward this to wherever `contact@wheelofheaven.io`
  was going.
- **Submodule pointer bumps:** this migration touches four upstream
  submodule repos (bifrost, data-content, data-library, data-bibliography).
  Each must be pushed before the consumer repos can bump pointers and
  pick up the changes.
- **Bifrost in-flight work:** at the time of migration, the bifrost repo
  had unrelated in-progress changes (added pages, deleted templates). The
  migration's local validation worked around this by surgically restoring
  `templates/macros/zodiac.html` and `templates/read.html` from the
  submodule's pinned commit.
- **`beta.wheelofheaven.io` check** in `link.html` was generalized to
  `beta.wheelofheaven.` (matches any TLD) since there is no active beta
  domain to preserve specifically.
- **JS bundle regeneration:** `bifrost/static/js/dist/*.bundle.js` was
  regenerated locally via `npm run bundle` to capture the updated asset
  URLs in `timeline.js`. The deploy workflow also runs this in CI, so the
  production bundle will be regenerated on the next deploy.
