+++
title = "Translations"
description = "Translating Wheel of Heaven content across the ten supported languages — workflow, glossary, RTL handling for Hebrew."
weight = 50
+++

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

## Workflow

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
