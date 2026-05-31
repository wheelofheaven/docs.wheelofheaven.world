+++
title = "Editorial Passes"
description = "What `editorial_pass` and `claim_type` mean — how the project tracks its voice and epistemic discipline over time."
weight = 60
+++

Two frontmatter fields encode the project's editorial discipline:

- **`claim_type`** — the *epistemic status* of a page's main claim
- **`editorial_pass`** — the *editorial campaign* under which a page was
  last fundamentally rewritten

Both fields are required on new entries. Together they let future readers
(and future-you) tell at a glance whether an entry reflects current
framing.

## `editorial_pass`

A date-coded marker (`YYYY-MM`) on each page recording the editorial
campaign that last fundamentally rewrote it.

### Why this exists

The corpus periodically goes through editorial passes — campaigns where
the project's voice, vocabulary, or framing shifts and a batch of entries
gets rewritten to match. Without the field, you can't tell which entries
reflect the *current* framing and which are pre-reframe holdovers.

### Current passes

| Code | What changed |
|---|---|
| `2026-05` | First major pass under the *modern, working-hypothesis, human-civilization* framing. Drops "democratization" / "knowledge base" / "lore" register; tightens claim discipline; uses "Elohim were a small advanced human civilization" rather than "extraterrestrial." Also included a library-book editorial sub-pass that split 35 long paragraphs across TBWTT, ETTMTTP, and LWTE into 83 pieces — see [Paragraph Split Tooling](@/contributing/dev/paragraph-split-tooling.md). |

Future passes will be added here as they happen.

A pass can include both content rewrites (wiki, articles, essentials)
and library-book editorial work (paragraph splits, attribution fixes,
OCR cleanup). Both kinds of work mark the entries they touch with the
same `editorial_pass` date code.

### When to set the field

Set `editorial_pass` whenever you **fundamentally rewrite** an entry —
not for a typo fix, a reference addition, or a small wording tweak.

Set the field to the date code of the *current* pass:

```toml
[extra]
editorial_pass = "2026-05"
```

If you create a new entry from scratch under current framing, also set
the field to the current pass code.

### Grandfathering

Entries from before the first pass don't have the field. Backfill is
editor's call. When you re-read a legacy entry and find it still aligns
with the current framing *without rewrites*, you may set the field to
the current pass code as an explicit "checked, still good" stamp.

### Filtering

Future tooling can filter:

- Entries reflecting current framing: `editorial_pass == "2026-05"`
- Legacy entries needing review: field absent or earlier date
- Entries from a specific campaign: `editorial_pass == "<code>"`

## `claim_type`

Every page declares the *epistemic status* of its main argument. The
value is rendered as a small colored pill near the page title.

### Values

| Value | Meaning | Badge color |
|---|---|---|
| `direct` | The claim is explicit in a primary source, or a direct description of project/methodology, or scientifically established | cyan |
| `inferred` | The claim is a reasonable reading of a source, not literally stated but consistent with it | yellow |
| `speculative` | The claim is interpretive synthesis going beyond what any single source states | lavender |

### How to choose

1. **Read the main claim** of the page — the thing the page is actually
   asserting.
2. **Is this claim literally in a source?**
   If yes → `direct`.
3. **Is it a reasonable reading** that a scholar might arrive at
   without a leap?
   If yes → `inferred`.
4. **Otherwise:** `speculative`. Be honest about this — `speculative`
   isn't a weakness, it's a label of intellectual transparency.

### Examples

`direct`:

- A wiki entry that defines a term using the term's primary-source
  definition
- A timeline entry stating the start and end years of a precessional age
  (astronomical fact)
- A page describing the project's own method

`inferred`:

- A wiki entry that draws together multiple sources to characterize a
  figure
- An Article that reads the Sumerian Anunnaki and the biblical Nephilim
  as describing the same kind of being
- Comparative-religion readings that connect dots a single source
  doesn't draw

`speculative`:

- The Elohim-as-ET-civilization reading
- Genesis-as-engineering-log reframing
- Speculative cosmology beyond what mainstream physics has measured

### Set it in `[extra]`

```toml
[extra]
claim_type = "inferred"
```

The badge color renders automatically; you don't need to touch templates.

### Why we mark this

The wiki has 100+ entries. Some are textbook-style definitions. Some are
interpretive synthesis. A reader needs to know which kind of claim they're
reading. The pill gives them that signal at a glance, before they commit
to reading the entry.

It also disciplines authors: if you can't articulate which value applies,
you probably haven't thought clearly enough about what the entry is
actually claiming.

## Both fields together

A new entry written today, under current framing, with a reasonable
reading of multiple sources:

```toml
+++
title = "Council of Eternals"
description = "The governing body of the Elohim civilization, described in Raëlian source texts."
template = "wiki-page.html"

[extra]
claim_type = "direct"
editorial_pass = "2026-05"
category = "Core Concepts"
+++
```

A legacy entry someone has re-read and confirmed still works without
rewrites:

```toml
[extra]
claim_type = "inferred"
editorial_pass = "2026-05"  # explicit "checked, still good" stamp
```

A legacy entry, untouched:

```toml
[extra]
claim_type = "inferred"
# editorial_pass not set — predates the 2026-05 pass
```

## Backfill status

- **Done:** all 7 English essentials + 1 article (as a model)
- **Pending:** ~102 wiki entries, ~15 timeline entries, all translations
- **Automatic:** all 67 resources have `claim_type = "direct"` from the
  source-program backfill (they describe sources, not claims)

If you find yourself working on a legacy entry that needs more than a
typo fix, that's a good moment to do the backfill — drop the modern
frontmatter on it as part of the same PR.

## Related

- The full strategy that introduced these fields lives in
  [`.claude/plans/strategy-decisions.md`](https://github.com/wheelofheaven/.claude/blob/main/plans/strategy-decisions.md) (decision #11)
  and
  [`.claude/plans/strategy-source-program.md`](https://github.com/wheelofheaven/.claude/blob/main/plans/strategy-source-program.md).
- The editorial voice rules these passes encode are in
  [`.claude/rules/content-editing.md`](https://github.com/wheelofheaven/.claude/blob/main/rules/content-editing.md).
