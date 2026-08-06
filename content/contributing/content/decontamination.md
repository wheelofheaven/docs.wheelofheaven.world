+++
title = "Wiki Decontamination"
description = "The 2026-08 de-slop campaign: marker-guided repair of the May 2026 generation incident, the repair protocol, and the documented marker floor."
template = "page.html"
weight = 65
+++

## The incident

In May 2026 a generation incident salted otherwise-real English wiki
entries with telegraphic filler prose — sentences that pad or restate
without adding content. The entries' substance (sources, structure,
claims) was real; the damage was register-level. The repair job was
therefore **repair, not rewrite**: remove the filler, keep the
scholarship.

## The marker

The filler carries a reliable lexical tell: the words **"substantive" /
"substantively"** used as padding ("operates substantively as…",
"treated at substantive length…"). The campaign used per-entry marker
counts to build its worklists, then read every flagged passage in
context — the marker finds candidates; the read decides. The slop
register around a marker is also a signal: empty roadmap paragraphs,
"deserves articulation" lead-ins, and leaked editorial scaffolding
("the v1 entry the corpus is converting…") cluster near it.

## Repair protocol

Per entry:

1. **Read the entire file first.** Never repair from grep context alone.
2. **For each marker occurrence:** if the sentence carries real
   information awkwardly, rewrite it cleanly without the filler word;
   if it is pure padding, delete the sentence or passage. Genuinely
   grammatical uses stay and are documented in the floor list below.
3. **Scan for adjacent filler without the marker.** Repair minimally;
   leave clean scholarly prose alone — when unsure, leave it.
4. **Frontmatter hygiene:** a `description` over 300 characters moves
   its full text to `summary` (first field in `[extra]`), gets a fresh
   question-answering 150–160-character `description`, a one-sentence
   `tldr`, and 5–8 `keywords`. Stamp `editorial_pass = "2026-08"`.
5. **Verify:** zero unjustified markers; frontmatter parses as TOML;
   `cite` and shortcode token counts unchanged before and after; the
   site builds.
6. **Report, don't silently fix.** Factual or canon issues found along
   the way (miscited motif-index codes, list-count errors, citation
   form) are reported first and fixed in separate follow-up commits
   after editorial sign-off.

Hard rule throughout: never invent or delete citations, shortcode
calls, reference blocks, or `[extra.references]` tables.

## Outcome and the marker floor

The campaign closed on 2026-08-06: tiered repairs across the
~140-entry English wiki corpus, a final Phase 5 batch of ten entries,
and a corpus-wide tail sweep clearing 86 residual occurrences across 38
files. The English corpus floor is **eight documented-legitimate
occurrences in seven entries**:

| Entry | Occurrences | Why it stays |
|---|---|---|
| `mytheme` | 1 | "Mythemes are relational, not substantive" — the actual Lévi-Straussian claim |
| `infinity` | 2 | grammatical uses |
| `watchers` | 1 | method-vs-substance contrast |
| `pangaea` | 1 | method-vs-substance contrast |
| `ezekiel` | 1 | method-vs-substance contrast |
| `list-of-prophets-and-religions` | 1 | method-vs-substance contrast |
| `crop-circles` | 1 | infobox field label `substantive_residual_questions` |

Any "substantive" occurrence beyond this list is suspect by definition —
treat it as new contamination and repair it under this protocol.

## Translations

Locale entries with `translation_status = "metadata_only"` carry the
English body verbatim; their repair is a mechanical body splice from
the repaired English, verified byte-identical against the pre-repair
body before writing (done for `mytheme` across all nine locales). True
translations are instead re-fanned from the clean English.

## Campaign record

Working notes, tier lists, and per-phase decisions live in
`.claude/plans/wiki-decontamination.md` in the `www.wheelofheaven.world`
repo. The project-level summary is in the
[Changelog](@/reference/changelog.md).

Related: [Editorial Passes](@/contributing/content/editorial-passes.md).
