+++
title = "Translations (i18n localisation)"
description = "Translating existing Wheel of Heaven English content across the ten supported site languages — workflow, glossary, RTL handling for Hebrew. Distinct from the WoH Translation Program (source-text translation), which has its own section."
weight = 50
+++

> **Two translation pipelines, two pages.** This page covers
> **i18n localisation** — taking an existing English Wheel of
> Heaven page (a wiki entry, Article, Newsroom Dispatch, etc.)
> and rendering it into the other nine site languages. It does
> NOT cover translating religious or mythological source texts
> (Hebrew, Greek, Akkadian, etc.) through the Wheel of Heaven
> lens — that work is the
> [WoH Translation Program](@/contributing/content/source-text-translation/_index.md),
> which has its own substantial methodology and runs a
> different pipeline (Translator → Editor → Reviewer agents,
> glossary with `claim_type` per entry, scholarly citation
> requirements, etc.). The two pipelines do not compete; they
> are sequential. A WoH Translation of Genesis is produced via
> the WoH Translation Program; that English Translation is
> then fanned out to the nine other languages via this i18n
> localisation pipeline.

The Wheel of Heaven knowledge base ships in **ten languages**:

- `en` — English (the source language)
- `de` — German
- `fr` — French
- `es` — Spanish
- `ru` — Russian
- `ja` — Japanese
- `ko` — Korean
- `zh` — Simplified Chinese
- `zh-Hant` — Traditional Chinese
- `he` — Hebrew (renders RTL)

Translations mirror the English source structure exactly. Coverage
varies by language; run the i18n dashboard for current numbers.

## How translations are organized

```
data-content/
├── wiki/elohim.md           # English source
├── de/wiki/elohim.md        # German translation
├── fr/wiki/elohim.md        # French translation
├── ja/wiki/elohim.md        # Japanese translation
└── he/wiki/elohim.md        # Hebrew translation (RTL)
```

Every translation file:

- Has the **same slug** as its English source
- Lives under `{lang}/{section}/`
- Has its own complete frontmatter (with translated `title` and
  `description`)
- Inherits its `template` from the English source

## Two ways to translate: automated fan-out vs. manual

Two paths produce the same output. Pick by section and by how many
target languages you need at once.

| Path | When to use | How |
|---|---|---|
| **Automated fan-out** (recommended for `/timeline/`) | Translating a `/timeline/` chapter into one or many target languages in one go. Pipeline applies the glossary, preserves shortcodes, runs a reviewer pass. | `/woh-fanout` skill |
| **Manual workflow** | Any other section (`/wiki/`, `/articles/`, `/news/`), or single-file touch-ups where the pipeline overhead doesn't pay. | Copy + edit + validate, described below |

The automated fan-out is **timeline-only at present** because the
timeline chapters' shortcode density and structural complexity make
mechanical preservation rules worth automating. The pipeline will
extend to other sections as it earns confidence; until then, follow
the manual workflow for those.

## Automated fan-out pipeline (timeline)

The `woh-fanout` skill orchestrates a translator + reviewer pass per
target language for one timeline chapter.

### Pipeline shape

```
English source (content/timeline/{slug}.md)
        │
        ▼
   ┌──────────────────┐         ┌──────────────────┐
   │ woh-fan-translator│ ──draft─▶│ woh-fan-reviewer │ ──verdict─▶ ready / flagged
   └──────────────────┘         └──────────────────┘
        ▲                              ▲
        │                              │
    one per target lang            independent (does not see
    (de, es, fr, …)                translator's narrative)
```

Per target language:

1. **`woh-fan-translator`** reads the English source, the
   [glossary](#the-glossary), and the
   [per-language conventions](#per-language-notes); writes the
   target-language file at `content/{lang}/timeline/{slug}.md`.
   Returns a structured summary including any
   `missing_glossary_terms`.
2. **`woh-fan-reviewer`** reads source + translation independently
   and runs structural checks (see
   [shortcode preservation](#shortcode-preservation-rules) and
   [frontmatter rules](#frontmatter-what-to-translate-what-to-preserve)),
   applies mechanical fixes via Edit, surfaces substantive flags
   for human judgement.
3. The skill reports per-language outcomes and rolls up
   missing-glossary terms across languages for the human to triage.

### Invoking

```
/woh-fanout
```

Then specify the source chapter and target languages. The skill
asks for what it needs:

- **Source chapter** — e.g. `timeline/age-of-aries.md`.
- **Target languages** — one (`de`), a subset (`de,fr,ja`), or
  `all` (= all nine non-English site languages).
- **Stale-replacement policy** — most existing `/timeline/`
  translations are pre-2026-05 and will be cleanly overwritten;
  the skill flags any target that's on the current editorial pass
  and asks before overwriting.

### Pre-flight requirements on the English source

The fan-out skill **refuses to start** if the source has any of
these issues — they're cheap to fix once in English and expensive
to clean up after distribution across 9 languages:

1. **Raw internal markdown links.** `[Moses](/wiki/moses/)` or
   `[Genesis 1:1](/library/genesis-woh/#c1p1)` hard-point at the
   English path from every translated chapter. Convert to
   [`wiki`](@/components/shortcodes/wiki.md) and
   [`libref`](@/components/shortcodes/libref.md) shortcodes
   first.
2. **Malformed frontmatter** (closing `+++` glued to the previous
   line without a newline). Zola tolerates it; downstream tooling
   does not. Fix in English first.
3. **Shortcode calls with corrupted args** (e.g. `[Elohim](/wiki/elohim/)`
   embedded in a `scripture(translit="…")` arg, which renders as
   literal markdown). Fix in English first.

### When the pipeline is the wrong tool

- Non-timeline content (see Manual workflow below).
- Source-text translations (Hebrew → English, etc.) — those use the
  separate
  [WoH Translation Program](@/contributing/content/source-text-translation/_index.md).
- Single-file touch-ups to an already-translated file — use
  `woh-fan-reviewer` directly with a narrow scope, or edit by hand.

## Shortcode preservation rules

Every Tera shortcode in the source must appear in the translation
with **identical argument values**. Only the visible body text of
paired-tag shortcodes is translated. The reviewer pass (and any
human reviewer) will diff shortcode calls between source and
translation; a mismatch on args is a hard fail.

| Shortcode | Translate | Preserve verbatim |
|---|---|---|
| `{%/* wiki(slug="elohim") */%}Elohim{%/* end */%}` | the body label | `slug="elohim"` |
| `{%/* libref(book="zephaniah", chapter=1, verse=10) */%}Zephaniah 1:10{%/* end */%}` | the body label (book name + ref localised) | `book="zephaniah", chapter=1, verse=10` |
| `{%/* library(book="genesis-woh", chapter=1, verse=1) */%}…{%/* end */%}` | the quoted body | `book="genesis-woh", chapter=1, verse=1` |
| `{{/* scripture(book="exodus", chapter=3, verse=2, english="…", translit="…", hebrew="…") */}}` | `english=` arg only | `book=`, `chapter=`, `verse=`, `translit=`, `hebrew=` |
| `{{/* figure(src="…", alt="…", caption="…") */}}` | `alt=` and `caption=` (incl. the `Ill. N -` prefix → `Abb./Илл./图…` per locale) | `src=` |
| `{{/* footnote(id="2") */}}` | nothing | the whole call |
| `{{/* cite(id="3") */}}` | nothing | the whole call |

The common failure mode is translating a `book="..."` or `slug="..."`
arg because the value *looks* like English. These are path
identifiers, not prose — never touch them.

Hebrew script and italic transliterations are also preserved verbatim
across all target languages. Only the English gloss in quotes (e.g.
`*na'aseh*, "let us make"` → translate `"let us make"`, leave the
Hebrew and the *na'aseh* alone) gets localised.

## Frontmatter: what to translate, what to preserve

| Field | Action |
|---|---|
| `title` | translate |
| `description` | translate |
| `[extra].summary` | translate |
| `[extra].footnotes[].content` | translate prose; rewrite any inline markdown link `[label](/wiki/foo/)` as `[label](/{lang}/wiki/foo/)` (shortcodes don't work inside TOML strings) |
| `[extra].references[].title` | translate display title; keep original-language book title in parens where appropriate |
| `[extra].references[].note` | translate |
| `[extra].references[].description` | translate |
| `[extra].see_also[].title` | translate (this is the display label that renders on the See also list) |
| `[extra].see_also[].description` | translate |
| `template` | preserve verbatim |
| `weight`, `sort_by` | preserve verbatim |
| `[extra].claim_type`, `editorial_pass`, `start_year`, `end_year`, `zodiac_sign`, `symbol` | preserve verbatim |
| `[extra].category`, `[extra].entry_type`, `[extra].timeline` | **preserve verbatim — taxonomy KEYS, not display text.** See the [Taxonomy-key vs display-text](#taxonomy-key-vs-display-text-and-the-zola-0-19-2-production-gotcha) section below. |
| `[extra].see_also[].path` | preserve as English (`/wiki/...`); Zola routes per language automatically |
| `[[extra.references]].id` | preserve verbatim — `data/sources.json` keys, not display text |
| `[[extra.references]].path` | preserve as English (`/library/...`); library translations route automatically |
| `aliases` | **drop entirely** — aliases are URL-level redirects from the source page's old English path; the translated page never had that old URL, and keeping the alias causes a path collision with the English page |

The reviewer diffs the preserve-verbatim fields byte-for-byte. Any
drift is a mechanical fix.

## Taxonomy-key vs display-text — and the Zola 0.19.2 production gotcha

Some `[extra]` fields *look* like display strings but are actually
keys that Zola's templates look up against a translation map. The
most common mistake is to translate them. **The mistake breaks the
production build.**

Specifically: `category`, `entry_type`, and `timeline` are looked
up by the template via `bindings.wiki_category."<key>"` (and similar)
against the per-language label map in `i18n/`. Translating the key
produces a lookup miss locally on **Zola 0.21.0** (silent — the label
just doesn't render) and a build-breaking panic on **Zola 0.19.2**:

```
thread '<unnamed>' panicked at tera-1.20.0/src/context.rs:281:46:
byte index 29 is not a char boundary; it is inside '宙' (bytes 27..30)
of `bindings.wiki_category."宇宙年代学"`
```

This is a multi-byte char-boundary bug in Tera 1.20 (the version
bundled with Zola 0.19.2). It triggers whenever a non-ASCII key
appears in a Tera `Context` field-access path. The local Zola
version doesn't hit it; Cloudflare Pages currently pins Zola
0.19.2 in production, so a translated `category` will land on `main`
green from `mise run build` and then fail Cloudflare's deploy.

**Rule:** if a field is named in the preserve-verbatim section of the
frontmatter table, treat it as a key. Translate the *display label*
elsewhere (the bindings file, the see_also `title=`, the reference
`note=`) but never the key itself.

The same logic applies to `see_also[].path`, `[[extra.references]].id`,
and `[[extra.references]].path` — they look like display strings,
they aren't.

Quick check before reporting a translation as done:

```sh
diff <(grep -E '^(category|entry_type|timeline) =' src.md) \
     <(grep -E '^(category|entry_type|timeline) =' tgt.md)
```

Empty output means the keys are preserved. Anything else is a
build-breaker waiting to happen.

## Use a single Write call for the file, not chunked Edits

The translator agents have a chunked-write protocol that opens with
a `Write` for the first section and appends subsequent sections
via `Edit`. That works reliably for files up to roughly 500 lines
but stalls catastrophically on larger files (~700+ lines): every
agent in a parallel batch hits the 600-second watchdog and the
whole fan-out fails.

For long entries (the `great-flood` and `hebrew-bible` entries are
~670 and ~804 lines respectively), instruct the translator
explicitly to use a **single Write call** for the whole file.
Translate the entire content mentally first, then commit it in one
operation. This bypasses the Edit cascade entirely and the same
batch that stalled on chunked-Edit completes cleanly with single-Write.

## TOML quote-escape gotcha

When you render a target-language closing curly-quote inside a TOML
frontmatter string — most commonly the `description` field — the
**closing curly-quote must be its proper Unicode codepoint**, not an
ASCII `"`. ASCII `"` inside a TOML string delimited by `"` terminates
the string prematurely and Zola fails to parse the file.

| Language | Opening | Closing curly-quote codepoint |
|---|---|---|
| de | `„` U+201E | `"` **U+201C** (not ASCII `"`) |
| fr | `«` U+00AB | `»` U+00BB |
| zh / zh-Hant / ja | `「` U+300C | `」` U+300D |
| he | `»` U+00BB (opens — reversed) | `«` U+00AB |
| ru | `«` U+00AB | `»` U+00BB |

The fix is to use the correct Unicode codepoint for the closing
curly-quote. A safer alternative for `description` is to escape
internal ASCII `"` with `\"`, or to use a TOML literal string
(single-quoted) when the content contains internal quote-marks.

## Markdown links inside TOML frontmatter strings

Shortcodes don't work inside TOML — they only execute in markdown
body. So when a markdown link appears inside `extra.footnotes[].content`
(or any frontmatter string rendered through the markdown filter), the
translator and reviewer must hand-prefix the path with the target
language code:

| English source | German | Japanese |
|---|---|---|
| `[Satan](/wiki/satan/)` | `[Satan](/de/wiki/satan/)` | `[サタン](/ja/wiki/satan/)` |
| `[Genesis](/library/genesis-woh/)` | `[Genesis](/de/library/genesis-woh/)` | `[創世記](/ja/library/genesis-woh/)` |

Inside the body (not frontmatter), the expectation is that the
source has already converted these to `wiki` / `libref`
shortcodes during pre-flight, so this rule applies only to
frontmatter survivors.

## Manual workflow (non-timeline content)

### 1. Find what needs translating

```sh
cd data-content
python scripts/i18n_dashboard.py
```

Output looks something like:

```
section   en   de   fr   es   ru   ja   ko   zh   zh-Hant   he
wiki      102  78   65   42   31   22   15   8    5         3
timeline  14   14   14   14   12   8    5    3    3         3
articles  18   12   8    4    2    1    -    -    -         -
news      24   3    -    -    -    -    -    -    -         -
```

Numbers are file counts. The English column is the source-of-truth size.

### 2. Pick an entry

Prefer high-leverage entries (heavily linked, currently surfaced on the
homepage, etc.) over deep-cut wiki entries. The dashboard surfaces these.

### 3. Copy + translate

```sh
mkdir -p de/wiki
cp wiki/elohim.md de/wiki/elohim.md
```

Then edit `de/wiki/elohim.md`:

- Translate `title`, `description`, `summary`
- Translate the body
- Preserve frontmatter structure (`template`, `claim_type`, etc.)
- Update inline links — Zola's `@/path.md` references work across
  languages automatically, but if you've hardcoded URLs to specific
  language versions, fix them
- Use the glossary (see below)

### 4. Validate

```sh
python scripts/validate.py
```

Catches frontmatter errors, broken links, missing required fields.

### 5. Commit

```sh
git add de/wiki/elohim.md
git commit -m "de: translate wiki/elohim"
git push
```

Then bump the `content/` submodule in `www` and `api` as usual.

## Translation guidelines

### Preserve meaning over literal translation

The goal is a *faithful* translation that reads naturally in the target
language. Literal word-for-word translations are rarely idiomatic.

### Adapt idioms

If the English uses an idiom (e.g. "the elephant in the room"), find the
target language's closest equivalent — don't translate the metaphor
literally.

### Keep technical terms consistent

Use the glossary (see below) for project terms. Don't invent new
translations for "Elohim" or "Raëlism" on your own — the project decided
once, per language, and consistency matters more than personal preference.

### Maintain the scholarly register

Same tone as English — academic, accessible, stance-aware. Don't lapse
into either casual prose or stilted formality.

### Don't add interpretation that isn't in the source

If the English doesn't state X, the translation doesn't either. A
translation isn't a re-write.

## Terms to keep in original

Some terms stay in their source language across all translations:

| Term | Reason |
|---|---|
| **Elohim** | Hebrew term — kept across languages, explained in-text in the target language |
| **Yahweh** | Same |
| **Raël**, **Raëlism**, **Raëlian** | Proper noun |
| **Anunnaki**, **Nephilim**, etc. | Hebrew / Sumerian originals |
| Book titles in original language | Provide a translation in parentheses on first mention |

## The glossary

`data-content/i18n/glossary.json` is the single source of truth for
project-term translations:

```json
{
  "terms": [
    {
      "id": "elohim",
      "translations": {
        "en": "Elohim",
        "de": "Elohim",
        "fr": "Elohim",
        "ja": "エロヒム",
        "ko": "엘로힘",
        "zh": "埃洛希姆",
        "he": "אלוהים"
      }
    },
    {
      "id": "precession-of-equinoxes",
      "translations": {
        "en": "precession of the equinoxes",
        "de": "Präzession der Tagundnachtgleichen",
        "fr": "précession des équinoxes",
        "ja": "歳差運動",
        "ko": "세차 운동"
      }
    }
  ]
}
```

When you're translating an entry and you hit a project term, **check the
glossary first**. If a term isn't there yet, add it during your PR — and
flag in the PR description so the maintainers can review the choice.

## Per-language notes

### German (de)

- Use formal **Sie** for reader address (consistent with the scholarly
  register; would feel odd as "du" given the subject matter)
- German compound nouns can be long — split with hyphens or rephrase
  if a sentence becomes unwieldy
- Quotes use „…" not "…"

### French (fr)

- Use **vous** for reader address (same reasoning as German)
- Use inclusive writing (`les Elohim, créateur·rices…`) where natural
- Non-breaking spaces before `:`, `;`, `?`, `!` and inside guillemets:
  `« texte »`

### Spanish (es)

- Use **usted** for reader address
- Spanish quotes use «…» (European) — match the existing site style

### Russian (ru)

- Use formal **Вы** for reader address
- Cyrillic typography — be careful with hyphens vs. em dashes

### Japanese (ja)

- Use polite **です／ます** form
- Punctuation: full-width 「」 for quotes
- Don't add spaces around Latin words embedded in Japanese text — the
  font handles spacing

### Korean (ko)

- Use polite **합니다** form (formal)
- Punctuation: half-width Latin punctuation around Latin words; full-width
  Hangul punctuation around Hangul

### Simplified Chinese (zh)

- Simplified characters for general PRC reader
- Punctuation: full-width 「」 for quotes (or 『』 for emphasis)
- Don't add Latin-style spacing around Chinese punctuation

### Traditional Chinese (zh-Hant)

- Traditional characters (Hong Kong / Taiwan)
- Same punctuation rules as zh

### Hebrew (he)

- **RTL** — the entire theme handles right-to-left rendering
  automatically, but watch for:
    - Inline Latin text inside Hebrew gets reversed-display correctly
      only with the right `dir=` attributes (the theme handles this for
      block-level content)
    - Numbers in Hebrew remain LTR within the RTL flow
    - Quotation marks use the Hebrew guillemets `»…«` (note the order:
      `»` opens, `«` closes in Hebrew)
- Hebrew is the newest addition; coverage is currently section-indexes
  plus a small set of high-priority pages

## How URLs work across languages

The site routes by language prefix:

```
en  →  https://www.wheelofheaven.world/wiki/elohim/
de  →  https://www.wheelofheaven.world/de/wiki/elohim/
ja  →  https://www.wheelofheaven.world/ja/wiki/elohim/
```

`hreflang` tags are emitted automatically — Zola knows which files are
translations of which. You don't have to do anything special; just
keep the slugs identical across languages.

## Quality checklist

- [ ] Same slug as English source
- [ ] Frontmatter `title`, `description`, `summary` all translated
- [ ] Frontmatter structural fields (`template`, `claim_type`, etc.) preserved
- [ ] Body translated faithfully (not literally)
- [ ] Glossary terms used consistently
- [ ] Per-language conventions followed (formal/informal, punctuation)
- [ ] No broken `@/path.md` links
- [ ] (Hebrew) RTL-specific issues checked
