+++
title = "The eight-step workflow"
description = "The Wheel of Heaven Translation Program per-chapter pipeline from source acquisition through human sign-off to multi-language fanout. Each step's inputs, outputs, and acceptance criteria."
weight = 20
+++

Every chapter of every Wheel of Heaven Translation moves through
this eight-step pipeline. The pipeline is sequential by design —
each step's output is the next step's input, and skipping steps
breaks the audit trail.

```
┌─────────────────────────────────────────────────────────────┐
│  1. Source acquisition       (source-{lang}-{N}.json)       │
│         ↓                                                    │
│  2. Chapter scoping          (_meta.json updates)            │
│         ↓                                                    │
│  3. Glossary preparation     (coverage report)               │
│         ↓                                                    │
│  4. Translator pass          (chapter-{N}.json draft)        │
│         ↓                                                    │
│  5. Editor pass              (chapter-{N}.json + report)     │
│         ↓                                                    │
│  6. Reviewer pass            (chapter-{N}.json + verdicts)   │
│         ↓                                                    │
│  7. Human sign-off           (chapter-{N}.json stable)       │
│         ↓                                                    │
│  8. Multi-language fanout    (de/es/fr/ja/ko/ru/zh/zh-Hant)  │
└─────────────────────────────────────────────────────────────┘
```

The first six steps are the production pipeline. Step 7 is the
sign-off gate. Step 8 is distribution.

## 1. Source acquisition

**Input.** A chapter target (book + chapter number) and a
publicly-licensed critical edition of the source text.

**Output.** `data-library/{book-slug}/source-{lang}-{N}.json`
containing the pointed/transliterated source verbatim, with
`verses[]` entries carrying `{n, refId, <lang>}`. The file is
immutable once committed.

**Acceptance criteria:**
- License is one of: Public Domain, CC0, CC-BY-SA (with attribution
  preserved), or a project-cleared licence.
- Source is the pointed/cantillated text for Hebrew (not consonantal
  only), the polytonic Greek (not monotonic conversions), the
  transliterated cuneiform (not raw signs), or the equivalent for
  the source language.
- Verse divisions and `refId` format match the established convention
  for that book (e.g., `GEN-1:1` for Genesis).
- The `source` object inside the file records `versionTitle`,
  `license`, `versionSource` (the URL of the critical edition),
  `fetchedFrom` (where the project actually pulled it from), and
  `fetchedAt` (ISO date).

See [Source acquisition](@/contributing/content/source-text-translation/source-acquisition.md)
for canonical source lists per tradition.

## 2. Chapter scoping

**Input.** Source file with verse divisions.

**Output.** Updated
`data-library/{book-slug}/_meta.json` with a `chapterFiles[]` entry
for this chapter (file path, chapter number, paragraph count,
working title).

**Acceptance criteria:**
- `paragraphCount` in `_meta.json` matches the actual verse count
  in `source-{lang}-{N}.json.verses[]`.
- `_meta.json.refId` and the chapter file's `refId` prefix agree
  (e.g. `GEN-WOH` book code → `GEN-WOH-1:1` for chapter 1 verse 1).
- The working title is a placeholder until the Editor finalises it.

## 3. Glossary preparation

**Input.** Source file + current production glossary + (if exists)
per-translation overlay glossary.

**Output.** A coverage report mapping every word in the source to
its glossary status: `covered` (entry exists, will be applied),
`flagged` (entry exists but has a context-conditional rule the
Translator must apply carefully), `silent` (no glossary entry —
the Translator will default and flag).

**Acceptance criteria:**
- Every distinct lemma in the source has been queried against the
  glossary.
- The Translator agent invocation prompt includes the glossary
  version it should pin to in `chapter-{N}.json.translation.glossaryVersion`.

This step is partly automated, partly judgment. The Translator
agent itself does some of this work as part of step 4; the explicit
preparation step is to catch obvious gaps before the Translator
starts and to decide whether any new glossary entries should be
added pre-emptively (rare — usually deferred to the Editor).

## 4. Translator pass

**Input.** Source file + production glossary + (optional) overlay +
book metadata + reference PD translation (ASV for Hebrew Bible,
etc.).

**Output.** Draft `data-library/{book-slug}/chapter-{N}.json` with:

- `paragraphs[].i18n.en` filled for every verse.
- `paragraphs[].glossaryRefs[]` populated where entries were applied.
- `paragraphs[].commentary` empty.
- `editorial_questions[]` enumerating every lexical decision the
  glossary did not cover.
- `translation.status` = `draft`.
- `translation.version` = `1.0.0-draft`.
- `translation.modelDrafts[]` = the model id(s) used.

**Acceptance criteria:** see the Translator hard rules in
[Roles](@/contributing/content/source-text-translation/roles.md#translator).
The orchestrating skill verifies these after the agent returns.

**Common failures and what to do:**

- **Translator emits empty `editorial_questions[]` but obvious
  WoH-relevant lexical sites should have been flagged.** Either the
  glossary genuinely covers them (verify) or the Translator missed
  them (send back with explicit "you missed X, Y, Z").
- **Translator invents a glossary entry inline.** Hard-rule
  violation. Reject and re-run with the rule reiterated.
- **Translator writes commentary.** Hard-rule violation. Reject and
  re-run. Commentary is the Editor's job.

## 5. Editor pass

**Input.** Translator draft + source + glossary files.

**Output.** Revised `chapter-{N}.json` with:

- `paragraphs[].commentary` filled for every verse where the
  translation diverges meaningfully from the reference PD reading.
- `glossaryRefs[]` updated to include new entries the Editor
  created.
- `editorial_questions[]` cleared (each question resolved into a
  glossary entry or escalated).
- `translation.status` = `editor-review`.
- `translation.version` = `1.0.0-rc1`.

Plus separate artifacts:

- **Glossary diffs** in `data-content/i18n/translation-glossary.json`
  (central) or `data-library/{book-slug}/_translation-glossary.json`
  (overlay), with the file's `version` bumped semver-appropriately.
- **Escalation report** at
  `data-library/{book-slug}/chapter-{N}-editor-report.md`
  listing every `claim_type: speculative` entry and every editorial
  decision the Editor could not resolve without human judgement.

**Acceptance criteria:** see the Editor hard rules in
[Roles](@/contributing/content/source-text-translation/roles.md#editor).

## 6. Reviewer pass

**Input.** Editor-reviewed chapter + source + glossary diffs +
escalation report (the Reviewer reads this last).

**Output.** Same chapter file with a `translation.reviewerReport`
block appended containing per-verse verdicts (`approve` / `revise` /
`flag-for-human`), per-glossary-entry verdicts (`approve` /
`downgrade-claim-type` / `revise` / `flag-for-human`), and
lens-leakage flags. Every disputed verdict carries at least one
scholarly citation.

`translation.status` advances to either:

- `reviewer-approved` — every verdict is `approve`. Ready for human
  sign-off as a formality.
- `awaiting-human` — at least one verdict needs explicit human
  judgement.

**Acceptance criteria:** see the Reviewer hard rules in
[Roles](@/contributing/content/source-text-translation/roles.md#reviewer).

The Reviewer is the project's philological-seriousness check. The
Reviewer has explicit veto authority on `claim_type: speculative`
entries — any speculative entry the Reviewer cannot defend with at
least one acceptable citation must be downgraded or flagged.

## 7. Human sign-off

**Input.** Reviewer-approved chapter + escalation report + reviewer
report. A sign-off package is produced at
`data-library/{book-slug}/chapter-{N}-signoff-package.md`
summarising the chapter for human review.

**Output.** The named human reviewer (currently Zara Zinsfuss)
reads the package, confirms or revises the open items, and
authorises promotion. On sign-off:

- `translation.reviewer` updated from `pending` to the human
  reviewer's name (e.g. `zarazinsfuss`).
- `translation.reviewedAt` set to the ISO 8601 timestamp.
- `translation.version` bumped from `1.0.0-rc1` to `1.0.0`.
- `translation.status` set to `stable`.

This step is **synchronous and explicit.** The orchestrating skill
does not advance status past `awaiting-human` without explicit
written sign-off from the named reviewer. AI agents do not sign
off; humans do.

For chapters at `reviewer-approved` (no flags), human sign-off is
still required but can be quick — a confirmation reading of the
chapter end-to-end and the reviewer report. For chapters at
`awaiting-human`, human sign-off requires resolving every flag.

## 8. Multi-language fanout

**Input.** Stable chapter (English Translation at `1.0.0`).

**Output.** Eight additional `chapter-{N}-{lang}.json` files or
equivalent, one per site language, rendering the English Translation
into de, es, fr, ja, ko, ru, zh, zh-Hant. Each language preserves
WoH-specific terminology consistently via the per-book distribution
glossary (`data-library/{book-slug}/_glossary.json`).

**Acceptance criteria:**
- The English Translation is the source for fanout. Fanout does
  NOT re-translate from the source language.
- Proper nouns, project terminology, and glossary-tracked concepts
  render consistently per the distribution glossary.
- Per-language register and punctuation conventions follow
  [Translations](@/contributing/content/translations.md).

**Status note (2026-05-21):** the multi-language fanout pipeline is
designed but not yet operational. English Translations can ship
without it; the other languages are added when the pipeline exists.

## Worked example: Genesis 1

The Genesis 1 chapter went through this pipeline as the original
pilot (2026-05-18):

1. **Source acquisition.** Pointed Hebrew pulled from the
   Westminster Leningrad Codex via the Sefaria API. Stored at
   `data-library/genesis-woh/source-he-1.json`. Public Domain.
2. **Chapter scoping.** `_meta.json` records 31 paragraphs for
   chapter 1.
3. **Glossary preparation.** No glossary existed yet; the entire
   chapter was glossary-silent. Translator default-and-flag
   behaviour produced the initial ~30 editorial questions.
4. **Translator pass.** Drafted with Claude Opus 4.7. Produced
   `chapter-1.json` with English translation, empty commentary,
   and ~30 questions in `editorial_questions[]`.
5. **Editor pass.** Resolved all questions into the first ~30
   glossary entries (the founding seed of
   `translation-glossary.json` v1.0.0). Wrote per-verse
   commentary for divergent verses. Promoted to `1.0.0-rc1`.
6. **Reviewer pass.** The original Genesis 1 pilot bypassed the
   automated Reviewer pass and went straight to human review;
   every chapter since (including the rest of Genesis-WoH) has
   used the three-agent pipeline as documented above.
7. **Human sign-off.** Complete. Genesis-WoH ships all 50 chapters
   as `stable`.
8. **Multi-language fanout.** Operational; runs after a book
   reaches `stable`.

The methodology page for Genesis 1, with the parallel
Hebrew/ASV/WoH display and per-verse notes, is at
`data-library/genesis-woh/methodology.md` (rendered to the
public site as part of the library reader).

## What the workflow guarantees

If a chapter has reached `stable` via this workflow, it carries:

- An immutable source-language reference (step 1).
- A complete English translation, every verse with a glossary
  entry trail for every WoH-divergent choice (steps 4–5).
- Per-verse commentary explaining every divergence (step 5).
- An independent philological challenge with mandatory scholarly
  citations for disputed choices (step 6).
- A named human sign-off (step 7).

What the workflow does NOT guarantee:

- That the WoH lens is correct. That is a separate intellectual
  question. The workflow guarantees the translation is honest
  about where the lens went, not that the lens is right.
- That every reader will agree with every divergence. Disagreement
  is welcome; the audit trail makes informed disagreement
  possible.
- That the translation reads as good prose. The Program optimises
  for source-fidelity over prose-elegance. A reader who wants
  prose first should read Alter, not WoH.
