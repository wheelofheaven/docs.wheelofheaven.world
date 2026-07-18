+++
title = "Frontmatter Reference"
description = "Every TOML field that may appear in content frontmatter — what it means, where it's used, and per-content-type defaults."
weight = 10
+++

Every Wheel of Heaven content file opens with TOML frontmatter — fields
that tell Zola, the templates, and the AI extractor what kind of page
this is and how to surface it.

This page is the full field reference. For *how to use* frontmatter when
writing a specific kind of content, see the per-content-type guides
under [Contributing → Content](@/contributing/content/overview.md).

## Format

Always TOML. Delimited with `+++` (not `---`):

```toml
+++
title = "Elohim"
description = "Biblical Hebrew term for the creators of life on Earth."
template = "wiki-page.html"

[extra]
claim_type = "direct"
+++
```

The `[extra]` table is Zola's namespace for project-specific fields —
distinct from the top-level fields Zola itself uses.

## Top-level fields

These are read by Zola directly.

| Field | Type | Where used | Notes |
|---|---|---|---|
| `title` | string | Templates (page head + h1) | Required. Under 60 chars for SEO. |
| `description` | string | Templates (meta description), search snippet | 150–160 chars. |
| `template` | string | Zola template selection | Always set explicitly. See per-content-type values below. |
| `date` | date | Articles, News, dated pages | ISO 8601. Pubdate. |
| `updated` | date | Any page | When the page was last revised. |
| `weight` | int | Section sort | Lower weight = earlier in a section sorted `sort_by = "weight"`. |
| `slug` | string | URL | Override the automatic slug if you must. Rare. |
| `aliases` | string[] | URL redirects | Old paths that 301 to this page. |
| `taxonomies` | table | Tags / authors / categories | See below. |
| `path` | string | URL override | Power-user only. |
| `extra` | table | Project-specific | Everything else. |

### Section-level top-level fields

`_index.md` files for sections support extra top-level fields:

| Field | Type | Notes |
|---|---|---|
| `sort_by` | string | `"weight"`, `"date"`, `"title"` |
| `template` | string | `"wiki-section.html"`, `"timeline-section.html"`, etc. |
| `page_template` | string | Default page template for pages in this section |
| `paginate_by` | int | Items per page (sets up pagination) |

### Taxonomies

```toml
[taxonomies]
tags = ["ancient-astronauts", "genesis"]
authors = ["Zara Zinsfuss"]
categories = ["Research"]
```

The available taxonomies are configured in `config.toml` (currently
`tags`, `authors`, `categories`).

## `[extra]` fields

### Universal — apply to most content types

| Field | Type | Required | Notes |
|---|---|---|---|
| `claim_type` | `"direct"` \| `"inferred"` \| `"speculative"` | Yes, on new entries | The epistemic status of the page's main claim. See [Editorial Passes](@/contributing/content/editorial-passes.md). |
| `editorial_pass` | `"YYYY-MM"` | Yes when rewriting | Date code of the editorial pass that last fundamentally rewrote this entry. |
| `summary` | string | No | 2–4 sentence TL;DR. Used by AI extraction; displayed prominently on some templates. |
| `tldr` | string | No | One-sentence takeaway. |
| `category` | string | No | Free-form categorization within a content type. |
| `keywords` | string[] | No | 3–5 keywords for SEO. |
| `image` | string | No | Header / featured image path (relative to `static/`). |
| `image_alt` | string | No | Alt text for the header image. |
| `image_caption` | string | No | Optional caption. |
| `author` | string | No | When the page is by-lined to a person rather than the org. |
| `noindex` | bool | No | Set `true` to exclude from search indexes. |
| `schema_type` | string | No | Override the JSON-LD `@type` (e.g. `"ScholarlyArticle"`). |

### Wiki — `[extra]` additions

| Field | Type | Notes |
|---|---|---|
| `alternative_names` | string[] | Other names this entry is known by. Searchable. |
| `see_also` | object[] | Related wiki entries. Format: `{ title = "Yahweh", path = "/wiki/yahweh/" }` |
| `external_links` | object[] | Outbound references. Format: `{ title = "Wikipedia", url = "https://..." }` |
| `references` | object[] | Sources cited in the body. Prefer stable source IDs: `{ id = "sefaria", note = "..." }`. The wiki template and `cite` shortcode use the same ID to keep the inline marker and reference list aligned. Legacy title/url records remain valid: `{ title = "...", author = "...", date = "...", url = "..." }`. |

### Timeline — `[extra]` additions

| Field | Type | Notes |
|---|---|---|
| `start_year` | string | Start of the precessional age (e.g. `"1945"`) |
| `end_year` | string | End of the precessional age (e.g. `"4105"`) |
| `zodiac_sign` | string | Lowercase zodiac slug (e.g. `"aquarius"`) |
| `symbol` | string | Unicode glyph (e.g. `"♒"`) |
| `references` | object[] | External sources cited by the chapter. Prefer stable source IDs when the source exists in `data/sources.json`; legacy title/url records remain valid. Rendered after the chapter body and aggregated into `/sources/`. Use ordinary Markdown links in the body for hosted `/wiki/` and `/library/` material. |

### Library book — `[extra]` additions

For the section `_index.md`:

| Field | Type | Notes |
|---|---|---|
| `author` | string | Book author |
| `original_title` | string | Original-language title |
| `publication_year` | string | Year published |
| `isbn` | string | ISBN if available |

For an **individual book page** (`content/library/<slug>.md`) — the chapter and
verse text is loaded from `data-library` JSON, but the page's frontmatter still
carries its metadata (`title`, `description`, `claim_type`, `translation_status`,
etc.):

| Field | Type | Notes |
|---|---|---|
| `hf_dataset` | string | URL of the book's CC0 parallel-corpus dataset on Hugging Face. When `hf_dataset` and/or `kaggle_dataset` is set, `library-book.html` renders an **"Available as a CC0 dataset on Hugging Face · Kaggle →"** link after the lede (each platform shown only if its field is present) — the reciprocal of the dataset card's link back to the book. Used by the `-woh` translation books; see [Dataset distribution](/contributing/dev/dataset-distribution/). |
| `kaggle_dataset` | string | URL of the book's CC0 dataset on Kaggle (`zarazinsfuss/<slug>`). Renders alongside `hf_dataset` (see above). |

### Article — `[extra]` additions

(See universal fields above; Articles primarily use `summary`,
`claim_type`, `category`, `keywords`, `references`.)

### Reference objects

Use stable source IDs whenever the cited source already exists in
`data/sources.json`.
The site resolves the visible title, author/date metadata, and source URL
from that manifest.
Those IDs also map to the generated local source pages at
`/sources/{id}/` in English and `/{lang}/sources/{id}/` in translated
shells, where the reverse `Cited by` list is rendered. The same ID is
what body citations use via `cite(id="...")` on wiki pages, so the
inline marker and the reference entry stay in sync.

```toml
[[extra.references]]
id = "sefaria"
note = "Primary digital access point for Hebrew Bible and Jewish source traditions."
locator = "Genesis 1:26"
```

| Field | Type | Notes |
|---|---|---|
| `id` | string | Stable `data/sources.json` source ID. Validated by `mise run build` in the website repo. |
| `note` | string | Optional page-specific explanation of why this source is cited here. |
| `locator` | string | Optional page, chapter, passage, section, or other local citation locator. |

Unknown IDs fail the website build before deploy. That keeps the content
manifest, the rendered reference list, and the citation anchors on the page
in lockstep.

Legacy records can still be used for sources that do not yet exist in the
manifest.
They are aggregated by the source builder and can later be converted to stable
IDs.

```toml
[[extra.references]]
title = "Hamlet's Mill"
author = "Giorgio de Santillana and Hertha von Dechend"
date = "1969"
url = "https://wheelofheaven.github.io/de-santillana-von-dechend-hamlets-mill/"
```

### Newsroom Dispatch — `[extra]` additions

| Field | Type | Required | Notes |
|---|---|---|---|
| `event_date` | date | Yes | When the event itself happened |
| `event_type` | enum | Yes | `announcement` \| `discovery` \| `anniversary` \| `cultural-moment` \| `obituary` |
| `canon_links` | object[] | Yes | ≥ 1 entry. Format: `{ title = "Elohim", path = "/wiki/elohim/" }` |
| `sources` | object[] | Yes | Format: `{ title = "...", url = "...", outlet = "...", date = "..." }` |

### Social broadcast

The [Social Broadcast Pipeline](@/contributing/dev/social-broadcast.md)
reads two pieces of frontmatter when deciding what to post and how.

#### `extra.broadcast` — eligibility

| Type | Meaning |
|---|---|
| `true` | Post to every enabled channel (default for `/news/` and `/articles/`). |
| `false` | Don't post anywhere (default for `/wiki/`, `/library/`, `/timeline/`, `/resources/`, translations, drafts). |
| `string[]` | Allowlist of channel names — e.g. `broadcast = ["telegram", "bluesky"]` posts only to those two. |

```toml
[extra]
broadcast = true                          # all enabled channels
broadcast = false                         # suppress entirely
broadcast = ["telegram"]                  # only Telegram
```

#### `[social]` — per-platform overrides

Optional top-level block (not under `[extra]`). Each key is a platform
name; the value overrides the mechanical default copy for that
platform only. Unset platforms fall back to the default template.

| Field | Type | Notes |
|---|---|---|
| `telegram` | string | Custom Telegram caption / message. HTML subset supported. Up to 1024 chars with photo, 4096 plain text. |
| `bluesky` | string | Custom Bluesky post body. ≤ 300 graphemes. |
| `mastodon` | string | Custom Mastodon status body. ≤ 500 chars (instance default). |
| `twitter` | string | Custom Twitter / X post body. ≤ 280 chars (URL counts as 23). |
| `discord` | string | Custom Discord message body. |
| `not_before` | datetime | Don't broadcast before this ISO 8601 timestamp. |

```toml
[social]
telegram = """
🛰️ <b>Custom Telegram lede</b>

Multi-paragraph copy goes here.
"""
not_before = "2026-05-22T13:00:00Z"
```

Per-page hand-rolled copy is the exception, not the norm — the
mechanical default (title + summary + permalink + OG card) handles
most dispatches well. Use `[social]` when the dispatch's lede needs to
match a specific tone or hook on a specific platform.

### Resource — `[extra]` additions

For entries in the source registry (resources section).

| Field | Type | Notes |
|---|---|---|
| `medium` | enum | See list below |
| `authority_tier` | int (0–4) | Source-program tier |
| `source_family` | string | Grouping (e.g. `"Raëlian canon"`, `"Hebrew Bible"`) |
| `relation_to_wheel` | string | Brief description of how this source relates to the project |
| `stance` | string | The source's stance toward the Wheel of Heaven reading |
| `licensing_status` | string | Reuse classification (traffic-light) |
| `topics` | string[] | Subject tags |
| `source_url` | string | Where the source lives online |
| `publication_year` | string | Year published |

#### Valid `medium` values

| Group | Values |
|---|---|
| Books | `nonfiction-book`, `fiction-book`, `religious-text`, `academic-paper` |
| Video / film | `documentary`, `movie`, `tv-series`, `video-channel` |
| Audio | `podcast`, `audio-book`, `lecture` |
| Web | `website`, `wiki`, `blog`, `article` |
| Other | `organization`, `community` |

## Templates per content type

`template` should be set explicitly on every page. Defaults to the
section's `page_template` if not set; setting explicitly makes intent
obvious to anyone reading.

| Content type | Template |
|---|---|
| Wiki entry | `wiki-page.html` |
| Wiki section index | `wiki-section.html` |
| Timeline entry | `timeline-section.html` (timeline entries are sections) |
| Library book | `library-book.html` |
| Article | `articles-page.html` |
| Newsroom Dispatch | `news-page.html` |
| Resource | `resources-page.html` |
| Sources section index | `sources-section.html` |
| Standalone (about, press, contact) | `info-page.html` |

## Worked examples

### Wiki entry

```toml
+++
title = "Elohim"
description = "Biblical Hebrew term for the creators of life on Earth — grammatically plural, meaning 'those who came from the sky.'"
template = "wiki-page.html"
toc = true

[extra]
claim_type = "direct"
editorial_pass = "2026-05"
category = "Core Concepts"
alternative_names = ["Aluhim", "Eloah (singular)"]
see_also = [
    { title = "Yahweh", path = "/wiki/yahweh/" },
    { title = "Council of Eternals", path = "/wiki/council-of-the-eternals/" }
]
external_links = [
    { title = "Elohim — Wikipedia", url = "https://en.wikipedia.org/wiki/Elohim" }
]
references = [
    { id = "the-book-which-tells-the-truth", locator = "Chapter 1" },
    { id = "a-hebrew-and-english-lexicon-of-the-old-testament" }
]
+++
```

### Timeline entry

```toml
+++
title = "Age of Aquarius"
description = "The current precessional age (1945–4105 CE) — the age of revelation."
template = "timeline-section.html"
weight = 12

[extra]
claim_type = "direct"
editorial_pass = "2026-05"
start_year = "1945"
end_year = "4105"
zodiac_sign = "aquarius"
symbol = "♒"
references = [
    { title = "Hamlet's Mill", author = "Giorgio de Santillana and Hertha von Dechend", date = "1969", url = "https://wheelofheaven.github.io/de-santillana-von-dechend-hamlets-mill/" }
]
+++
```

### Article

```toml
+++
title = "Why the Elohim hypothesis is more parsimonious than mainstream readings of Genesis"
description = "A side-by-side comparison of how the ancient-astronaut reading and the mythological-allegory reading account for the textual oddities in Genesis 1–11."
template = "articles-page.html"
date = 2026-05-15

[extra]
claim_type = "inferred"
editorial_pass = "2026-05"
summary = "Genesis contains specific, peculiar details — sequence of creation, anatomical language, multiple-creator grammar — that are easier to explain as an engineering log than as either myth or literal history."
category = "Hermeneutics"
keywords = ["Genesis", "Elohim hypothesis", "parsimony", "hermeneutics"]
references = [
    { id = "the-book-which-tells-the-truth", locator = "Chapter 1" }
]
+++
```

### Newsroom Dispatch

```toml
+++
title = "JWST resolves the most distant galaxy yet"
description = "JADES-GS-z14-0 sits at z=14.32. We re-read the canon's cosmology in light of how much earlier structure formed than models predicted."
template = "news-page.html"
date = 2026-05-08

[extra]
event_date = 2026-05-07
event_type = "discovery"
claim_type = "inferred"
summary = "The James Webb Space Telescope confirmed JADES-GS-z14-0 as the most distant galaxy ever observed. Cosmological structure formed earlier and faster than mainstream models predict — a wrinkle the Wheel of Heaven cosmology has long noted."
canon_links = [
    { title = "Elohim cosmology", path = "/wiki/elohim-cosmology/" }
]
sources = [
    { title = "JWST confirms distance to JADES-GS-z14-0", url = "https://www.nature.com/articles/...", outlet = "Nature", date = "2026-05-07" }
]
+++
```

## See also

- [Wiki Entry](@/contributing/content/wiki-entry.md) — workflow for wiki
  entries specifically
- [Article](@/contributing/content/article.md) — workflow for Articles
- [Newsroom Dispatch](@/contributing/content/newsroom-dispatch.md) —
  workflow for Dispatches
- [Editorial Passes](@/contributing/content/editorial-passes.md) — the
  `claim_type` and `editorial_pass` fields in detail
