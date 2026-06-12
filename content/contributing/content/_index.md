+++
title = "Contributing Content"
description = "Writing wiki entries, Articles, Newsroom Dispatches, library entries, and translations for the Wheel of Heaven knowledge base."
sort_by = "weight"
weight = 10
template = "section.html"
+++

Everything you need to write or translate content for the main reading
site lives in this section. Content is markdown in the `data-content`
repository; this section is how to write that markdown.

## Pick the content type that matches what you're writing

The reading site has several distinct content types, each with its own
file location, frontmatter, and editorial conventions. Pick the one
that fits before you start writing — they're not interchangeable.

| Want to add… | Content type | Where it lives |
|---|---|---|
| A definition / reference entry | [Wiki Entry](@/contributing/content/wiki-entry.md) | `data-content/wiki/{slug}.md` |
| A long-form, evergreen argument | [Article](@/contributing/content/article.md) | `data-content/articles/{slug}.md` |
| A short, event-anchored read of current events | [Newsroom Dispatch](@/contributing/content/newsroom-dispatch.md) | `data-content/news/{slug}.md` |
| A book to the Library | [Library Book](@/contributing/content/library-book.md) | `data-library/` (catalog + chapter JSON) |
| A translation of an existing English page into another site language | [Translations (i18n localisation)](@/contributing/content/translations.md) | `data-content/{lang}/{section}/{slug}.md` |
| An original English translation of a religious/mythological source text (Hebrew, Greek, Akkadian, etc.) through the WoH lens | [Source-Text Translation](@/contributing/content/source-text-translation/_index.md) | `data-library/{book-slug}-woh/` (source + chapter JSON + glossary entries) |

The decision behind *which* texts enter the Library at all — the
20 traditions, the original-language-first rule, the Edition vs
Translation tracks — is documented at the
[Library Acquisition Program](@/contributing/content/library-acquisition.md).

If you're not sure which one to write, the per-type guides each open
with a "when to write this" decision table.

## Required reading regardless of content type

- **[Content Overview](@/contributing/content/overview.md)** —
  directory layout, file-naming conventions, how sections work, how
  translations mirror English.
- **[Editorial Passes](@/contributing/content/editorial-passes.md)** —
  what the `claim_type` and `editorial_pass` fields mean. Required on
  every new entry.
- **[Frontmatter Reference](@/reference/frontmatter.md)** — every TOML
  field a content file may use, with per-type defaults and worked
  examples.

## The editorial register, briefly

Wheel of Heaven reads the comparative material **through** the
Raëlian frame — that's a stance, not a tone. The register stays
**scholarly, accessible, and stance-aware**:

- Canon claims can be stated directly ("The Elohim created humanity
  in laboratories")
- Comparative claims stay hedged ("The Mesopotamian *Atrahasis*
  describes a similar reset narrative…")
- Scientific claims stay measured ("Current genetic evidence is
  consistent with…")
- Critical material gets its own voice, not dismissed

The full editorial guide is in
[`.claude/rules/content-editing.md`](https://github.com/wheelofheaven/.claude/blob/main/rules/content-editing.md)
in the parent org's docs. Each content-type page below distills the
relevant slice.

## Sourcing floor

Most new entries should reach for at least six sources, mixed across
Raëlian canon, ancient primary, scholarly secondary, scientific /
historical, comparative tradition, and critical. Newsroom Dispatches
are exempt (they need primary news + at least one canon link). Details
on each content-type page.
