+++
title = "Indexing & Multilingual SEO"
description = "How translations are linked via hreflang and how legacy URLs stay reachable — the moving parts behind Google Search Console coverage."
weight = 40
+++

How Google sees the site, and what we do to keep that view clean.
Sparked by a 2026-05 Search Console audit that surfaced two structural
issues: broken hreflang (translation pages weren't being indexed) and
~80 404s from legacy URLs and trailing-slash quirks.

## Current Search Console state (2026-05)

Audited 2026-05-23, one week after the property started getting full
crawl coverage.

| Reason | Pages |
|---|---|
| Submitted and indexed | 146 |
| Discovered – currently not indexed | 1,281 |
| Crawled – currently not indexed | 76 |
| Not found (404) | 80 |
| Page with redirect | 16 |
| Duplicate canonical | 1 |

Most of "Discovered / Crawled – not indexed" was translation pages that
Google was treating as unrelated near-duplicates because hreflang was
broken. The fix below addresses that structurally; expect those numbers
to drop over the next 4–8 weeks as Google re-crawls.

## Hreflang: how translations link to each other

The site has 10 languages: `en` (default), `de`, `es`, `fr`, `he`, `ja`,
`ko`, `ru`, `zh`, `zh-Hant`. Content lives in directory-prefixed paths:

```
content/wiki/elohim.md         # English (default)
content/de/wiki/elohim.md      # German
content/fr/wiki/elohim.md      # French
...
```

### Why Zola's native multilingual doesn't work here

Zola's `page.translations` only links pages that share a basename with
language-code suffixes (`elohim.md`, `elohim.de.md`). The directory
layout this site uses is treated by Zola as **unrelated pages** —
`page.translations` always comes back empty, and the `lang` template
variable resolves to the default (`en`) on every page.

That's why the previous hreflang template emitted broken output: German
pages declared themselves as the English version of themselves, English
pages had no alternates at all, and the section-path fallback even
produced double-slash URLs (`/de//fr/library`) that Google followed and
404'd on.

Migrating ~2,000 content files to Zola's required convention would be a
massive churn. The site keeps directory-based locales and builds
hreflang from a manifest instead.

### The manifest pipeline

A Python script walks `content/` and writes a JSON manifest, which the
hreflang partial reads via Tera's `load_data`:

```
scripts/build_translations_manifest.py
  └─ writes →  data/translations.json
                  └─ loaded by →  themes/bifrost/templates/partials/language-alternates.html
```

The schema is canonical-path → list of locales:

```json
{
  "_meta": { "generated_at": "2026-05-23T...", "count": 263 },
  "paths": {
    "wiki/elohim":              ["de", "en", "es", "fr", "ja", "ko", "ru", "zh", "zh-Hant"],
    "timeline/age-of-aquarius": ["de", "en", "es", "fr", "ja", "ru", "zh"],
    "_root":                    ["de", "en", "es", "fr", "he", "ja", "ko", "ru", "zh", "zh-Hant"]
  }
}
```

Path normalization:

- `content/wiki/elohim.md` → `wiki/elohim`
- `content/de/wiki/elohim.md` → `wiki/elohim` (locale prefix stripped)
- `content/wiki/_index.md` → `wiki`
- `content/_index.md` → `_root` (special sentinel for homepages)

The template uses `detected_lang` (set in `base.html` from the URL path)
rather than Zola's unreliable `lang` global, and emits one `hreflang`
per locale listed for the page's canonical key — and only those. A page
without a Hebrew translation gets no `hreflang="he"` tag.

### Build wiring

The manifest is regenerated before each build:

- **Local builds via mise** — `mise.toml` makes the `build` task depend
  on a `translations` task that runs the script.
- **CI (`.github/workflows/deploy.yml`)** — runs the script as a "build
  translations manifest" step before `zola build`.
- **Cloudflare Pages** — `data/translations.json` is **committed** to
  the repo (same pattern as `data/sources.json`), so any direct
  `zola build` has a usable manifest without needing Python.

### Maintenance

Anytime you add, remove, or rename a translated file:

1. Run `mise run translations` (or rebuild via `mise run build`),
   commit the regenerated `data/translations.json` alongside the
   content change, or let CI regenerate on the next deploy.
2. The committed manifest can go stale between commits. That's fine for
   local dev (Tera will pick up the freshly-regenerated file). For
   production correctness, keep the manifest in sync with content in
   the same commit.

There's no automated test that catches a stale manifest. If translation
indexing drops in Search Console, `_meta.generated_at` is the first
thing to check.

## Redirects: keeping legacy URLs reachable

`static/_redirects` (consumed by Cloudflare Pages) is the URL-stability
contract.

### Three categories of rules

**1. Legacy-section redirects.** The reading-site has reorganized once
— `/intro/`, `/explainers/`, `/encyclopedia/`, `/categories/`,
`/medium/`, `/resources/`. Each old section has a per-locale block
redirecting to the current destination, e.g.
`/explainers/* → /articles/:splat`. This is the bulk of the file.

**2. Trailing-slash normalization.** Zola emits `index.html` at
`<path>/`. Google was crawling bare URLs like `/fr/library/1-chronicles`
and 404'ing because Cloudflare Pages doesn't auto-add a trailing slash.
Per-locale rules normalize:

```
/library/:slug              /library/:slug/              301
/de/library/:slug           /de/library/:slug/           301
...
```

The `:slug` placeholder matches a single non-slash segment, so the
already-slash-terminated form (`/fr/library/1-chronicles/`) falls
through and doesn't loop. Sections currently covered: `/library/`,
`/sources/`. If Search Console later flags more trailing-slash 404s in
another section, add the same pattern.

**3. Stale paths.** `age-of-*` entries used to live under `/wiki/`;
they now live under `/timeline/`. Google still had the old paths
cached. Splat redirects per locale:

```
/wiki/age-of-*              /timeline/age-of-:splat              301
/wiki/timeline/*            /timeline/:splat                     301
```

### Maintenance

`scripts/audit_redirects.py` walks the legacy site's content, the
current site, the redirects file, and Zola `aliases` frontmatter, then
reports old URLs with no destination. Run it after large content
reorganizations.

If Search Console flags a new 404 pattern: add the rule with the
appropriate placeholder, document it in a comment block above the rule,
and (if locale-specific) add the per-locale equivalents.

## Sitemap & robots

- `templates/sitemap.xml` generates a single multilingual sitemap with
  all 2,000+ URLs.
- `static/robots.txt` declares the sitemap URL and explicitly permits
  Google, ChatGPT, Claude, and other AI crawlers.
- The sitemap is auto-discovered by Search Console on the first crawl —
  no manual submission needed.

## Known not-pursued items

### `/tags/` taxonomy index missing

`config.toml` declares `tags` as a taxonomy with `feed = true`, but
`/tags/` returns 404. Either the taxonomy section template isn't
generating an index page or the taxonomy is unused on content pages.
Worth a small Zola investigation; left for a follow-up.

### 10 genuinely missing wiki entries

Search Console reports 404s for paths with no corresponding file:
`/wiki/jacob/`, `/wiki/el/`, `/wiki/hinduism/`, `/wiki/joseph/`,
`/wiki/joseph-smith/`, `/wiki/abrahamic-covenant/`,
`/wiki/mosaic-covenant/`, `/wiki/council-of-eternals/`,
`/wiki/new-testament/`, `/cosmic-chain/`.

Each is an editorial decision: write the entry, redirect to a related
existing one, or leave as 404 (Google drops 404s after a few crawls).

### Korean timeline gap

`/ko/timeline/age-of-leo/` returns 404 because the Korean translation
of that timeline entry was never created. The hreflang manifest
correctly omits `ko` from that entry, but Google still has the URL from
an earlier crawl. Will resolve once the page is created or Google
re-evaluates.
