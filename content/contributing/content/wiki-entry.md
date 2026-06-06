+++
title = "Wiki Entry"
description = "Writing a wiki entry — frontmatter, structure, sourcing, terminology, and editorial register."
weight = 10
+++

A wiki entry is a reference-style definition of a term, figure, place,
text, motif, or concept. Encyclopedia entries — *not* essays.

Wiki entries live at `data-content/wiki/{slug}.md` and serve at
`https://www.wheelofheaven.world/wiki/{slug}/`. Translations mirror the
structure under `data-content/{lang}/wiki/{slug}.md`.

## Anatomy

```toml
+++
title = "Elohim"
description = "Biblical Hebrew term for the creators of life on Earth — plural noun translated as 'those who came from the sky.'"
template = "wiki-page.html"
toc = true

[extra]
claim_type = "direct"
editorial_pass = "2026-05"
category = "Core Concepts"
alternative_names = ["Aluhim", "Eloah (singular)"]
see_also = [
    { title = "Yahweh", path = "/wiki/yahweh/" },
    { title = "Council of Eternals", path = "/wiki/council-of-eternals/" }
]
external_links = [
    { title = "Elohim — Wikipedia", url = "https://en.wikipedia.org/wiki/Elohim" }
]
references = [
    { id = "the-book-which-tells-the-truth", locator = "Chapter 1" },
    { id = "a-hebrew-and-english-lexicon-of-the-old-testament" }
]
+++

**Elohim** (Hebrew: אֱלֹהִים) is a Hebrew word traditionally translated as
"God" but grammatically plural, meaning "those who came from the sky."
In the Wheel of Heaven hypothesis, the Elohim are an advanced human
civilization that designed life on Earth.

## Etymology

The word combines a root meaning "to ascend" or "to come from above"
with a plural ending. The singular form *Eloah* appears in older biblical
texts...

## In Wheel of Heaven canon

The canon reads Elohim not as "gods" but as a council of advanced
designers...

## In comparative tradition

Mesopotamian texts describe similar collective creator-figures...

## See also

- [Yahweh](@/wiki/yahweh.md)
- [Council of Eternals](@/wiki/council-of-eternals.md)
```

## Frontmatter — required fields

| Field | Type | Notes |
|---|---|---|
| `title` | string | Under 60 chars |
| `description` | string | 150–160 chars; appears in search results and as the opening definition snippet |
| `template` | string | Always `"wiki-page.html"` |

## Frontmatter — `[extra]` fields

| Field | Type | Notes |
|---|---|---|
| `claim_type` | `"direct"` \| `"inferred"` \| `"speculative"` | Required on new entries. See [Editorial Passes](@/contributing/content/editorial-passes.md) and below. |
| `editorial_pass` | `"YYYY-MM"` | Date code of the editorial campaign that last fundamentally rewrote this entry |
| `category` | string | One of the established categories (Core Concepts, Texts, Figures, etc.) |
| `alternative_names` | string[] | Other names this entry is known by — searched and surfaced |
| `see_also` | object[] | Internal links to closely-related wiki entries |
| `external_links` | object[] | Outbound references (Wikipedia, papers, etc.) |
| `references` | object[] | Sources cited in the body. Prefer stable `data/sources.json` IDs: `{ id = "sefaria", note = "...", locator = "Genesis 1:26" }`. Legacy title/url records remain valid while new source records are being added. |

## Structure

An entry follows a consistent five-part structure. Not every entry will
use every section — drop what doesn't apply.

1. **Opening definition** — one or two sentences, used by AI extraction
   and by the description snippet. Must stand alone.
2. **Etymology / origin** — where the word or concept comes from.
3. **Main explanation** — the body. Subdivide with `##` headings as needed.
4. **In Wheel of Heaven canon** — how the Raëlian framework reads this.
5. **In comparative tradition** *(if applicable)* — how Mesopotamian /
   Egyptian / Vedic / scholarly traditions read this. Preserve
   irreducible differences; don't flatten.
6. **See also** + **References** — implicit, from frontmatter.

### Opening definition: stand-alone test

The first paragraph gets pulled out as the summary in search results, AI
snippets, and the entry's `data-ai-summary` block. Test it by reading it
without the page title. If it doesn't make sense, rewrite it.

Good:

> **Elohim** (Hebrew: אֱלֹהִים) is a Hebrew word traditionally translated
> as "God" but grammatically plural…

Bad:

> They are an advanced civilization that created humanity in laboratories.

(Who are "they"? The page title doesn't ride along into the snippet.)

## Voice and register

The wiki is **scholarly, accessible, and stance-aware**. Three rules:

### Canon claims can be stated directly

Raëlian doctrine, Elohim hypothesis, precessional cosmology:

> The Elohim created humanity in laboratories.

Not:

> Some interpretations suggest that the Elohim may have created…

### Comparative claims stay hedged

When reaching across traditions:

> The Mesopotamian *Atrahasis* describes a similar reset narrative…
>
> Bahá'í authoritative texts present progressive revelation in their own
> terms, which converge with the canon at…

### Scientific claims stay measured

> Current genetic evidence is consistent with…
>
> Mainstream archaeology dates this to…

Never *"science is wrong about…"* — present alongside, distinguish what
science establishes from what it speculates.

For the full register/voice guide, see
[`.claude/rules/content-editing.md`](https://github.com/wheelofheaven/.claude/blob/main/rules/content-editing.md)
in the parent repo.

## Sourcing — the six-source minimum

Every new wiki entry should reach for at least six sources, mixed across:

- 1× **Raëlian canon** (Tier 0)
- 1× **ancient primary source** (Tier 1) — the text being read
- 1× **scholarly secondary** (Tier 2) — academic analysis
- 1× **scientific or historical** (Tier 3) — genetics, archaeology, history
- 1× **comparative tradition** (Tier 2) — another religion's take
- 1× **critical** (Tier 4) — a serious objection or skeptical reading

It's not a strict checklist — some entries can't reach all six. The point
is to *try*. Entries from before 2026-04 are grandfathered.

## Claim type

Every entry declares its epistemic status in `[extra]`:

| Value | Meaning | Example |
|---|---|---|
| `direct` | Explicit in a primary source, or describing project/method, or scientifically established | "The precession of the equinoxes is observable since Hipparchus" |
| `inferred` | A reasonable reading of a source, not literally stated | "The Sumerian Anunnaki and the biblical Nephilim describe overlapping figures" |
| `speculative` | Interpretive synthesis going beyond any single source | "Genesis as engineering log" |

Pick the value that describes the *main* claim of the entry. See
[Editorial Passes](@/contributing/content/editorial-passes.md) for the
fuller framing. The badge color on the rendered page is set
automatically.

## Terminology — get the core terms right

| Term | Use | Avoid |
|---|---|---|
| Elohim | Always capitalize; plural ("the Elohim were…") | "aliens", "gods" |
| Yahweh | The Elohim president | "God" (except in direct quotes) |
| Raëlism / Raëlian | Note the diaeresis (ë) | "Raelism" |
| Ancient astronaut theory | Academic term | "ancient aliens" (pop-culture) |
| Genesis | Italicize the book; not "The Bible" generically | |
| Nephilim | "the fallen ones"; add Hebrew context | |

The full terminology table lives in
[`.claude/rules/content-editing.md`](https://github.com/wheelofheaven/.claude/blob/main/rules/content-editing.md).

## Workflow

```sh
cd data-content
git checkout -b feature/wiki-{slug}

# create the file
$EDITOR wiki/{slug}.md

# validate locally
python scripts/validate.py

# commit
git add wiki/{slug}.md
git commit -m "Add wiki entry: {Title}"
git push -u origin feature/wiki-{slug}
```

Open a PR; CI validates frontmatter, link targets, and translation
coverage. After merge, bump the `content/` submodule pointer in `www`
and the same in `api`:

```sh
cd www.wheelofheaven.io
git submodule update --remote content
git add content
git commit -m "Update content submodule"
git push
```

## Quality checklist before opening a PR

- [ ] Title under 60 characters
- [ ] Description 150–160 characters
- [ ] Opening paragraph stands alone (passes the "no title" test)
- [ ] `claim_type` set in frontmatter
- [ ] `editorial_pass` set to current pass if writing fresh under
      current framing
- [ ] All claims have citations or links
- [ ] Key terms link to other wiki entries
- [ ] Six-source minimum where reachable
- [ ] No broken `@/path.md` links
- [ ] Alternative viewpoints (scholarly + critical) acknowledged
- [ ] Terminology table followed
