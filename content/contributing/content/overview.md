+++
title = "Content Overview"
description = "How content is organized in data-content — directories, sections, translations, and naming conventions."
weight = 5
+++

Organization and conventions for the markdown that ships in
`data-content`. Each section below has its own per-content-type page;
this one covers the directory layout, file naming, and translation
workflow.

## Directory layout

```
data-content/
├── wiki/                    # encyclopedia entries
│   ├── _index.md            # section index
│   ├── elohim.md
│   ├── raelism.md
│   └── ...
├── timeline/                # precessional ages
│   ├── _index.md
│   ├── age-of-aquarius.md
│   └── ...
├── library/                 # sacred and primary texts
│   ├── _index.md
│   └── ...
├── articles/                # long-form essays (idea-driven, evergreen)
├── news/                    # newsroom dispatches (event-driven, decays)
├── sources/                 # bibliography section index (JSON-driven)
├── de/                      # German translations
├── es/                      # Spanish
├── fr/                      # French
├── ja/                      # Japanese
├── ko/                      # Korean
├── ru/                      # Russian
├── zh/                      # Simplified Chinese
├── zh-Hant/                 # Traditional Chinese
├── he/                      # Hebrew (RTL)
└── i18n/
    └── glossary.json        # term translations
```

## Content types

Each content type has its own dedicated page in this section:

- [Wiki Entry](@/contributing/content/wiki-entry.md) — encyclopedia-style
  definitions
- [Article](@/contributing/content/article.md) — long-form, idea-driven,
  evergreen
- [Newsroom Dispatch](@/contributing/content/newsroom-dispatch.md) — short,
  event-anchored
- [Library Book](@/contributing/content/library-book.md) — books with
  paragraph IDs
- [Translations](@/contributing/content/translations.md) — i18n workflow
- [Editorial Passes](@/contributing/content/editorial-passes.md) — what the
  `editorial_pass` field means

## File naming conventions

- Lowercase
- Hyphens for spaces: `age-of-aquarius.md`
- Match URL slugs
- Keep names short but descriptive

## Section index files

Each section needs an `_index.md`:

```toml
+++
title = "Wiki"
description = "Encyclopedia of terms and concepts"
template = "wiki-section.html"
sort_by = "title"
+++

Optional section introduction text.
```

## Sources

The `/sources/` page is JSON-driven — its content comes from
`data/sources.json`, built by `scripts/build_sources.py` in the www repo.
`content/sources/` contains only the section `_index.md`; individual
bibliography entries are not authored as Markdown.

## Translations

Translations mirror the English structure:

```
wiki/elohim.md           # English source
de/wiki/elohim.md        # German translation
fr/wiki/elohim.md        # French translation
```

For the full translation workflow, glossary use, and per-language notes,
see [Translations](@/contributing/content/translations.md).

## Content guidelines

### Titles

- Clear and concise
- Under 60 characters for SEO

### Descriptions

- 150–160 characters
- Include primary keyword
- Describe content value

### Body content

- Markdown headings (`##` for h2)
- Link to related wiki entries
- Include references for claims (six-source minimum on new entries)
- Use shortcodes for special content

See the [Frontmatter Reference](@/reference/frontmatter.md) for the full
field list.
