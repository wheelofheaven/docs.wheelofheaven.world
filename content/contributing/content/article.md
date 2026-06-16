+++
title = "Article"
description = "Writing an Article — long-form, idea-driven, evergreen. Where to put a deep-dive that isn't an event."
weight = 20
+++

An **Article** is a long-form essay or explainer organized around an
*idea*. Unlike a wiki entry (terse, reference-style) or a Newsroom
Dispatch (short, event-anchored, decays), an Article argues something at
length and is evergreen.

Articles live at `data-content/articles/{slug}.md` and serve at
`https://www.wheelofheaven.world/articles/{slug}/`.

## When to write an Article instead of…

| If you're writing… | …it's actually a |
|---|---|
| A definition or term explainer | [Wiki entry](@/contributing/content/wiki-entry.md) |
| A reaction to a current event | [Newsroom Dispatch](@/contributing/content/newsroom-dispatch.md) |
| The story of one precessional age | A timeline entry (lives in `timeline/`) |
| A multi-thousand-word argument | **Article** |
| A how-to guide for readers | Probably an Article, with care |

If the piece will be *exactly as relevant in five years* as it is today,
it's an Article. Otherwise, consider a Dispatch.

## Anatomy

```toml
+++
title = "Why the Elohim hypothesis is more parsimonious than mainstream readings of Genesis"
description = "A side-by-side comparison of how the ancient-astronaut reading and the mythological-allegory reading account for the textual oddities in Genesis 1–11."
template = "articles-page.html"
date = 2026-05-15

[extra]
claim_type = "inferred"
editorial_pass = "2026-05"
summary = "Genesis contains specific, peculiar details — sequence of creation, anatomical language, multiple-creator grammar — that are easier to explain as an engineering log than as either myth or literal history. This Article walks through five such details and shows what each reading must assume to fit."
category = "Hermeneutics"
keywords = ["Genesis", "Elohim hypothesis", "parsimony", "hermeneutics"]
references = [
    { id = "the-book-which-tells-the-truth", locator = "Chapter 1" },
    { title = "Genesis 1–11: From Creation to Babel", author = "Gordon Wenham", date = "1987" },
    { title = "The Anchor Bible: Genesis", author = "Speiser", date = "1964" },
    { title = "The Combat Myth in the Hebrew Bible", author = "Day", date = "1985" },
    { title = "The 12th Planet", author = "Zecharia Sitchin", date = "1976" },
    { title = "Inspiration and Incarnation", author = "Peter Enns", date = "2005" }
]
+++

The opening paragraphs draw the reader in with a hook and state the
claim clearly...

## What I'm comparing

Two readings:

1. The Elohim hypothesis...
2. The mythological-allegory reading...

## Detail 1: Sequence of creation

Genesis 1 orders creation in a specific way — light, then sky, then
land...

## Detail 2: Plural grammar

The verb in Genesis 1:26 is plural...

[...etc...]

## What each reading must assume

| Detail | Elohim reading assumes | Allegory reading assumes |
|---|---|---|
| Plural grammar | Multiple agents | A literary convention |
| Sequence | Engineering order | A literary order |
| ... | ... | ... |

## Conclusion

The Elohim reading explains the textual peculiarities without invoking
unmotivated literary devices...

## References

(Rendered automatically from frontmatter.)
```

## Frontmatter — required fields

| Field | Type | Notes |
|---|---|---|
| `title` | string | Under 60 chars |
| `description` | string | 150–160 chars; SEO + search snippet |
| `template` | string | Always `"articles-page.html"` |
| `date` | date | Publication date — appears on the page |

## Frontmatter — `[extra]` fields

| Field | Type | Notes |
|---|---|---|
| `claim_type` | `"direct"` \| `"inferred"` \| `"speculative"` | Required. See [Editorial Passes](@/contributing/content/editorial-passes.md). |
| `editorial_pass` | `"YYYY-MM"` | Date code of the editorial campaign |
| `summary` | string | 2–4 sentence TL;DR, displayed prominently and used by AI extraction |
| `category` | string | One of: Hermeneutics, Comparative, Method, History, Critique |
| `keywords` | string[] | 3–5 keywords for SEO |
| `references` | object[] | Sources — six-source minimum. Prefer stable `data/sources.json` IDs when available; legacy title/url records remain valid. See [wiki-entry sourcing](@/contributing/content/wiki-entry.md). |
| `footnotes` | object[] | Optional explanatory endnotes; each `{ content = "…" }`, referenced inline via the `footnote` shortcode. Lettered (a, b, c…), distinct from numbered `references`. |
| `image` / `header_image` | string | Optional landscape hero image path. When absent, a category-matched gradient is generated. |
| `article_type` | string | Article variety, e.g. `"explainer"` (the long-form default). |
| `featured` | bool | Surface the Article in featured placements on the `/articles/` index. |

## Structure

A typical Article runs 1,500–4,000 words and roughly follows:

1. **Hook + claim** — what this Article argues, stated clearly in the
   opening paragraphs.
2. **Background / setup** — what the reader needs to know to follow.
   Use this to acknowledge competing readings.
3. **The argument** — the body, organized into `##` sections. Each
   section should advance the claim.
4. **Counterarguments** — present the strongest objections; respond.
   *Always* include this section — strawmanned alternatives are a tell.
5. **Conclusion** — restate the argument briefly; note what it would
   take to falsify or revise.
6. **References** — automatic from frontmatter.

## Voice

More narrative than a wiki entry. Author perspective is okay and
expected — but mark interpretation as interpretation.

### Acceptable

> The most striking thing about Genesis 1:26 is the plural verb. We can
> read it as a literary convention, or we can read it as evidence that
> multiple agents are involved. The latter reading...

### Not acceptable

> Science has been wrong about Genesis for centuries.

The first acknowledges the alternative reading exists and engages with it.
The second strawmans and dismisses.

### Citations vs. body claims

Articles can make stronger claims than wiki entries because they earn
those claims with argument. But:

- Direct claims about the canon: state directly
- Claims about other traditions: hedged, sourced
- Scientific claims: measured, sourced

The full register guide is in
[`.claude/rules/content-editing.md`](https://github.com/wheelofheaven/.claude/blob/main/rules/content-editing.md).

## Inline citation

Use the `cite` shortcode:

```markdown
The plural in Genesis 1:26 has been noted since at least
Rashi{{/* cite(id="1", text="[1]", title="Rashi commentary on Genesis 1:26") */}}.
```

The reference list at the bottom of the page is rendered automatically
from the `references` array in frontmatter.
If a source already exists in `data/sources.json`, use its stable `id` and add
page-specific `note` or `locator` fields as needed.

## Footnotes (explanatory notes)

Separate from numbered citations: explanatory **footnotes** render as
lettered endnotes (a, b, c, …) at the foot of the Article. Use them to gloss
a technical term or add an aside without breaking the prose. Define them in
`[extra].footnotes` and reference them inline with the `footnote` shortcode:

```markdown
The text survives only in lacunae{{/* footnote(id="2") */}}, ...
```

```toml
[[extra.footnotes]]
content = "Gaps in a damaged text where the tablet is broken or illegible."
```

`id` is the 1-based index into `extra.footnotes`, so place the markers in the
same order the notes are listed. Citations (`cite`, numbered `[1]`) and
footnotes (`footnote`, lettered `[a]`) are two independent systems — each
round-trips to its own list at the foot of the page.

For original-language quotations, the `library` shortcode's
[interlinear mode](@/components/shortcodes/library.md) renders the source
script and transliteration beneath each translated line.

## Linking out

Articles should link extensively to wiki entries:

```markdown
The [Elohim](@/wiki/elohim.md) account in Genesis differs from the
[Anunnaki](@/wiki/anunnaki.md) account in Sumerian sources...
```

This creates the canonical reading paths through the site. Don't
duplicate definitions — link to them.

## Workflow

```sh
cd data-content
git checkout -b feature/article-{slug}
$EDITOR articles/{slug}.md
python scripts/validate.py
git add articles/{slug}.md
git commit -m "Add Article: {short title}"
git push -u origin feature/article-{slug}
```

After merge, bump the `content/` submodule pointer in www (and api).

## Quality checklist

- [ ] Title under 60 characters
- [ ] Description 150–160 characters
- [ ] `summary` field set (2–4 sentences) — used by AI extraction
- [ ] `claim_type` set
- [ ] `editorial_pass` set if writing fresh under current framing
- [ ] Counterarguments section present and not strawmanned
- [ ] Six-source minimum in `references`
- [ ] Wiki entries linked on first mention
- [ ] No broken `@/path.md` links
- [ ] Conclusion notes what would falsify or revise the claim

## Compared with Newsroom Dispatches

| | Article | Dispatch |
|---|---|---|
| Built around | An idea | An event |
| Lifetime | Evergreen | Decays |
| Length | 1,500–4,000 words | 300–800 words |
| Sourcing floor | Six-source minimum | News source + ≥1 canon link |
| Lives at | `/articles/` | `/news/` |
| Promotion path | — | A Dispatch never gets retitled into an Article — write a fresh Article that *cites* the Dispatch |
