+++
title = "Indexing & Multilingual SEO"
description = "How translations are linked via hreflang and how legacy URLs stay reachable — the moving parts behind Google Search Console coverage."
weight = 40
+++

The site keeps crawl access, canonical URLs, sitemap membership and indexing
policy aligned. A successful fetch makes a page eligible for indexing; it does
not establish that Google has chosen to index it.

For the dated investigation, deployed commits, verification results and open
follow-up work, see [October 2026 Indexing Recovery](@/architecture/indexing-recovery-2026-10.md).

## Current indexing policy

English editorial pages are indexable. The July 2026 policy deliberately marks
the nine translated editions `noindex,follow` using
`config.extra.noindex_translations = true` and `index_languages = ["en"]`.
Generated source records (`extra.source_id`) and explicitly excluded utility
pages (`extra.noindex`, including offline fallbacks) are also noindexed.

The sitemap mirrors those exclusions. Its locale list is currently hardcoded
because Zola does not pass `config.extra` into the sitemap template: a policy
change must update both the robots partial/configuration and the sitemap guard.
Hreflang still describes available language editions; it does not override
`noindex`. The language gate is an editorial distribution policy, not a proven
explanation of an indexing decline or a promise of recovery.

## Investigating an indexing decline

Use the Search Console domain property and compare **All submitted pages** with
**All known pages**. Historic URLs, redirects and intentional exclusions inflate
the latter. Record the report's update date before comparing counts.

Inspect representative excluded English URLs and check their live fetch,
indexing permission, rendered content and Google-selected canonical. Check
manual actions, security issues, sitemap processing and the old-domain redirect
chain separately. Distinguish technical failures from **Crawled — currently not
indexed**: neither a successful live test nor a sitemap submission guarantees
indexing. The earlier May 2026 attribution of most exclusions to hreflang was a
hypothesis, not an established cause.

After correcting a concrete fault, verify production before requesting a crawl.
Use validation only for an issue actually corrected across the selected scope.
Review the same submitted-URL cohort weekly, allowing for report lag; do not
repeatedly request indexing for unchanged pages. See Google's
[Page indexing report guide](https://support.google.com/webmasters/answer/7440203)
and [recrawl guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

## Feed discovery and legacy feed URLs

English pages advertise the populated root `/atom.xml` and `/rss.xml` feeds.
Translated pages advertise their localized `/articles/atom.xml` and
`/articles/rss.xml` feeds instead: the directory-based translated content does
not populate Zola's language-root feeds consistently across build versions.
On October 17, the production locale-root feeds returned 404, while the local
Zola 0.21 build emitted empty Atom feeds at those paths.

The footer links to the corresponding RSS feed.
Explicit 301 rules in `static/_redirects` preserve `/index.xml` and the nine
locales' root `index.xml`, `atom.xml`, and `rss.xml` URLs; localized aliases
lead to the populated Articles feeds.
The observed obsolete `/en/` homepage redirects to `/`.
Verify the deployed destinations return XML with entries, not merely HTTP 200.

These repairs remove broken feed discovery and legacy URL requests; they do
not establish a cause for Google's exclusion of otherwise fetchable pages.

## Search descriptions and visible introductions

Wiki `description` frontmatter also supplies the visible introduction. For an
entry with a long introduction, set `extra.seo_description` to a concise,
page-specific summary. Bifrost uses this override for the description, Open
Graph description and Twitter description; the visible introduction and
structured-data description retain the original text. Existing pages without
an override keep their previous behavior.

Summaries should distinguish a source's reported claims, historical or
scientific context, and the project's interpretation. Do not invent evidence,
authorship or expertise for search snippets. Google may choose a different
snippet; description length is not an indexing guarantee.

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

The script uses `git -C content ls-files *.md` rather than walking the
filesystem with `rglob`. This is important: the `content/` working tree
often holds WIP translation stubs that aren't committed, and including
them in the manifest would emit hreflang pointing to URLs that 404 in
production (the deployed site only has committed content). Sticking to
tracked files keeps the manifest aligned with deployment reality.

### Build wiring

Manifest regeneration depends on the build entry point:

- **Local builds via mise** — `mise.toml` makes the `build` task depend
  on a `translations` task that runs the script.
- **Cloudflare Pages** — `data/translations.json` is **committed** to
  the repo (same pattern as `data/sources.json`), so any direct
  `zola build` has a usable manifest without needing Python.
  The production build observed on 2026-10-17 invoked Zola directly;
  do not assume it regenerates the manifest or that an older GitHub Actions
  deployment workflow is still present.

### Maintenance

Anytime you add, remove, or rename a translated file:

1. Run `mise run translations` (or rebuild via `mise run build`),
   commit the regenerated `data/translations.json` alongside the
   content change. Confirm regeneration explicitly if using another pipeline.
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

### Categories of rules

**Legacy-section redirects.** The reading-site has reorganized once —
`/intro/`, `/explainers/`, `/encyclopedia/`, `/categories/`, `/medium/`,
`/resources/`. Each old section has a per-locale block redirecting to
the current destination, e.g. `/explainers/* → /articles/:splat`. This
is the bulk of the file (~73 dynamic rules).

**Stale paths from the 2026-05 pass.** `age-of-*` entries used to live
under `/wiki/`; they now live under `/timeline/`. Five literal rules
near the top of the file cover the specific URLs Google had cached
(e.g. `/wiki/age-of-aquarius/ → /timeline/age-of-aquarius/`).

We do **not** maintain per-locale trailing-slash normalization rules —
Cloudflare Pages auto-308's bare paths to `<path>/` when the target
file exists. Bare paths whose target doesn't exist would 404 either
way; the right fix there is to publish the page (or commit the
translation stub — see the `library/*` stubs landed in the 2026-05
content pass).

### The Cloudflare Pages de-facto rule-count cap

The documented Cloudflare Pages limit is 2,100 static + 100 dynamic
rules. In practice, this file behaves as if rules past ~270 are
silently ignored — pre-existing rules near the end of the file (e.g.
`/medium/`, `/categories/` catch-alls at lines 404–409) return 404 in
production even though they're well under the documented caps.

The 2026-05 pass discovered this the hard way: literal redirects
added at the *end* of the file deployed cleanly to gh-pages but were
never applied by Cloudflare. The workaround is **keep recently-added
urgent rules near the TOP** of the file, just after the header. The
file itself documents this in a leading comment.

Long-term, the legacy `/intro/*` block (~100 rules of churn from the
pre-migration site structure) could be condensed into a much smaller
splat-pattern set, which would push the cap out and rescue the
trailing catch-all rules. Left for a separate pass.

### Maintenance

`scripts/audit_redirects.py` walks the legacy site's content, the
current site, the redirects file, and Zola `aliases` frontmatter, then
reports old URLs with no destination. Run it after large content
reorganizations.

If Search Console flags a new 404 pattern: add a literal rule near the
top of the file in the dated section, document the reason in a comment
block, and (if locale-specific) add the per-locale equivalents — but
keep an eye on the dynamic-rule count.

## Sitemap & robots

- `themes/bifrost/templates/sitemap.xml` includes eligible English pages and
  sections, excluding generated source records, explicit noindex pages and
  translations under the current policy.
- Unused Zola taxonomies are not declared: empty taxonomy declarations added
  `/authors/`, `/tags/` and `/topics/` to the sitemap without rendering pages.
  These URLs remain legitimate 404s until meaningful destinations exist.
- First pagination URLs ending in `/page/1/` are excluded because they redirect
  to section roots. `/news/page/1/` also has an HTTP 301 in `static/_redirects`.
- `lastmod` uses Zola's `SitemapEntry.updated`, not the nonexistent `date` field.
  Supply truthful content modification dates; never stamp every page with the
  current build date. Entries without a date omit `lastmod`.
- `static/robots.txt` declares the sitemap and permits crawling. It does not
  override page-level noindex directives.

### Audit before and after deployment

From the main website repository, check generated files after a full build:

```sh
python3 scripts/audit_sitemap.py \
  --sitemap public/sitemap.xml --build-dir public \
  --output /tmp/woh-sitemap-local.json
```

Then run `mise run audit-sitemap` against production. The standard-library
script fetches every submitted destination with four concurrent GET requests
and writes `/tmp/woh-sitemap-audit.json`. It checks HTTP status, redirects,
canonical agreement, robots meta and X-Robots-Tag, title and description
presence, and duplicate sitemap URLs. Failures produce a nonzero exit code.
Local mode catches missing generated files but cannot test edge redirects or
headers. The report also counts incoming links from submitted pages; it is not
a complete sitewide link graph or an assessment of editorial quality.

Keep live audit output outside the repository. For important English pages,
review the actual prose, source relevance, attribution and limitations in
addition to technical eligibility. Short metadata and a high source count
alone do not establish helpfulness or reliable scholarship.

## Regional search engines (not yet set up)

Google Search Console is currently the only webmaster property registered
for the site. Because www.wheelofheaven.world publishes in 10 languages,
several regional engines are worth setting up — but only where the engine
actually dominates its market *and* the matching language edition has
substantive content.

The list below is a parking lot for a future pass. Nothing here is set up
yet.

### Worth setting up

- **Bing Webmaster Tools** — covers Bing, Yahoo, DuckDuckGo, and ChatGPT
  search grounding from a single property. Broad reach across all 10
  languages, low friction. The obvious first step after Google.
- **Yandex Webmaster** — for the `ru` edition. Yandex still holds the
  majority of Russian search.
- **Baidu Ziyuan (资源)** — only for the `zh` (Simplified Chinese)
  edition, and only if we're willing to deal with ICP licensing,
  mainland-China reachability requirements, slow indexing, and a
  Chinese-language admin UI. High effort, real reach inside the PRC.
- **Naver Search Advisor** — for the `ko` edition. Naver is roughly half
  of Korean search but heavily favors its own walled-garden surfaces
  (blogs, cafés), so a static site often underperforms regardless.

### Skip

- **Yahoo Japan** — runs on Bing's index. Bing Webmaster already covers
  it; no separate property needed for the `ja` edition.
- **Seznam** (Czech) — Google now holds ~85% of Czech search. We also
  don't publish a `cs` edition, so this is doubly moot.
- **Per-country Google properties** — one Search Console property already
  covers all `hreflang` variants. No need to create separate properties
  for google.de, google.fr, etc.

### Realistic priority order

1. Bing Webmaster (universal benefit).
2. Yandex / Baidu / Naver, gated on whether the corresponding `ru` / `zh`
   / `ko` editions have enough translated body content to be worth
   submitting. Thinly-translated sections (e.g. library stubs in the
   `en_only` pattern above) aren't worth the verification overhead.

## Historical follow-up list (May 2026)

The findings below describe the May investigation, not a current inventory.
Recheck each URL before taking action; for example, the Council of the Eternals
page was present in the October audit.

### 10 genuinely missing wiki entries

The May Search Console review reported missing paths:
`/wiki/jacob/`, `/wiki/el/`, `/wiki/hinduism/`, `/wiki/joseph/`,
`/wiki/joseph-smith/`, `/wiki/abrahamic-covenant/`,
`/wiki/mosaic-covenant/`, `/wiki/council-of-the-eternals/`,
`/wiki/new-testament/`, `/cosmic-chain/`.

Each is an editorial decision: write the entry, redirect to a related
existing one, or leave as 404 (Google drops 404s after a few crawls).

### Korean timeline gap

`/ko/timeline/age-of-leo/` returns 404 because the Korean translation
of that timeline entry was never created. The hreflang manifest
correctly omits `ko` from that entry, but Google still has the URL from
an earlier crawl. Will resolve once the page is created or Google
re-evaluates.

## Translation stubs: the `en_only` pattern

Many library books have locale companion files at e.g.
`content/<lang>/library/genesis.md` with `translation_status =
"en_only"` and frontmatter-only content (title, description in the
target language, but no translated body). These exist so the library
catalog renders in each locale and hreflang on the canonical English
page binds the locale URLs as alternates, even when the body content
hasn't been translated yet.

The 2026-05 SEO pass committed 700 such stubs in a single batch (698
across the 9 locale directories under `library/` + 2 new EN entries:
`atrahasis` and `epic-of-gilgamesh`). Before that, the files existed
in working trees but were untracked, so production 404'd ~40 of the
URLs Google was crawling. Now committed and tracked.

If you add a new library book, generate matching `en_only` stubs in
each locale directory (or accept that hreflang on that book will only
declare English until the stubs land). The build-translations-manifest
script will pick them up automatically once they're committed in the
content submodule and the parent repo's submodule pointer is bumped.
