+++
title = "File formats"
description = "The JSON schemas for every artifact in the Wheel of Heaven Translation pipeline: source files, chapter files, production glossary, per-translation overlay, distribution glossary, escalation reports, sign-off packages. Full worked examples from Genesis-WoH."
weight = 60
+++

This page is the canonical schema reference. Every file in the
WoH Translation Program pipeline has a defined shape; the
pipeline assumes those shapes hold. Validate against this page
when authoring or auditing.

## Index

1. [Source file](#source-file)
2. [Chapter file](#chapter-file)
3. [Book metadata](#book-metadata)
4. [Production glossary](#production-glossary)
5. [Per-translation overlay glossary](#per-translation-overlay-glossary)
6. [Distribution glossary](#distribution-glossary)
7. [Editor escalation report](#editor-escalation-report)
8. [Reviewer report (inside chapter file)](#reviewer-report-inside-chapter-file)
9. [Human sign-off package](#human-sign-off-package)

## Source file

**Path:** `data-library/{book-slug}/source-{lang}-{N}.json`

**Status:** Immutable once committed.

**Schema:**

```json
{
  "schemaVersion": 2,
  "bookSlug": "<book slug>",
  "chapter": <integer>,
  "source": {
    "type": "<source-type identifier>",
    "versionTitle": "<edition name>",
    "license": "<Public Domain | CC0 | CC-BY-SA | ...>",
    "versionSource": "<canonical URL>",
    "fetchedFrom": "<actual fetch URL or method>",
    "fetchedAt": "<ISO 8601 date>"
  },
  "verses": [
    {
      "n": <verse number>,
      "refId": "<CODE>-<chapter>:<verse>",
      "<lang>": "<verbatim source text>"
    }
  ]
}
```

**Worked example** (`data-library/genesis-woh/source-he-1.json`,
abbreviated):

```json
{
  "schemaVersion": 2,
  "bookSlug": "genesis",
  "chapter": 1,
  "source": {
    "type": "masoretic-text",
    "versionTitle": "Tanach with Ta'amei Hamikra",
    "license": "Public Domain",
    "versionSource": "http://www.tanach.us/Tanach.xml",
    "fetchedFrom": "sefaria.org/api/v3/texts",
    "fetchedAt": "2026-05-18"
  },
  "verses": [
    {
      "n": 1,
      "refId": "GEN-1:1",
      "he": "בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃"
    },
    {
      "n": 2,
      "refId": "GEN-1:2",
      "he": "וְהָאָ֗רֶץ הָיְתָ֥ה תֹ֙הוּ֙ וָבֹ֔הוּ וְחֹ֖שֶׁךְ עַל־פְּנֵ֣י תְה֑וֹם וְר֣וּחַ אֱלֹהִ֔ים מְרַחֶ֖פֶת עַל־פְּנֵ֥י הַמָּֽיִם׃"
    }
  ]
}
```

## Chapter file

**Path:** `data-library/{book-slug}/chapter-{N}.json`

**Status:** Mutable through the pipeline; promoted to `stable`
via human sign-off.

**Schema:**

```json
{
  "schemaVersion": 2,
  "bookCode": "<book code, e.g. GEN-WOH>",
  "bookSlug": "<book slug, e.g. genesis-woh>",
  "n": <chapter number>,
  "title": "<book> <chapter> — <short descriptive title>",
  "translation": {
    "track": "translation | edition",
    "version": "<semver>",
    "sourceText": "<canonical source edition name>",
    "sourceLicense": "<licence>",
    "sourceUrl": "<canonical URL>",
    "sourceAccessedVia": "<actual fetch route>",
    "glossaryVersion": "<pinned production glossary semver>",
    "overlayGlossaryVersion": "<pinned overlay semver, optional>",
    "modelDrafts": ["<model id, e.g. claude-opus-4-7>"],
    "reviewer": "pending | <name>",
    "reviewedAt": null | "<ISO 8601 timestamp>",
    "status": "draft | editor-review | reviewer-approved | awaiting-human | stable",
    "reviewerReport": { /* see below */ } | null
  },
  "paragraphs": [
    {
      "n": <verse number>,
      "refId": "<CODE>-<chapter>:<verse>",
      "text": "<source-language text verbatim from source file>",
      "i18n": {
        "en": "<English translation>"
      },
      "glossaryRefs": ["<glossary entry id>"],
      "commentary": "<Markdown commentary, empty if no divergence>"
    }
  ],
  "editorial_questions": [
    {
      "refId": "<CODE>-<chapter>:<verse>",
      "issue": "<description>",
      "options": ["<reading A>", "<reading B>"],
      "default_taken": "<which option was used>",
      "candidate_glossary_entry": null | { /* glossary entry shape */ }
    }
  ]
}
```

**Status field lifecycle:**

```
draft → editor-review → (reviewer-approved | awaiting-human) → stable
```

After `editor-review`, the `editorial_questions[]` array should be
empty. After `reviewer-approved`, the `reviewerReport` block is
populated.

**Version field lifecycle:**

```
1.0.0-draft → 1.0.0-rc1 → 1.0.0
```

`-draft` is the Translator's output. `-rc1` is the Editor's
output. Plain `1.0.0` is human-signed-off stable.

**Worked example** (Genesis-WoH chapter-1, paragraph 1):

```json
{
  "n": 1,
  "refId": "GEN-WOH-1:1",
  "text": "בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃",
  "i18n": {
    "en": "When the Elohim began to shape the skies and the land—"
  },
  "glossaryRefs": [
    "bereshit",
    "bara",
    "elohim-as-translation",
    "shamayim",
    "eretz"
  ],
  "commentary": "**Three load-bearing choices in one verse.**\n\n*Bereshit* is grammatically a construct form **without** the definite article — בְּרֵאשִׁית means \"in beginning-of\", not \"in **the** beginning\" ... [further commentary continues]"
}
```

## Book metadata

**Path:** `data-library/{book-slug}/_meta.json`

**Schema:**

```json
{
  "schemaVersion": 2,
  "chapterCount": <integer>,
  "chapterFiles": [
    {
      "file": "chapter-{N}.json",
      "n": <chapter number>,
      "paragraphs": <integer>,
      "title": "<title>"
    }
  ],
  "code": "<bookCode>",
  "paragraphCount": <integer>,
  "primaryLang": "<source language ISO code>",
  "originalLang": "<original language ISO code, may equal primaryLang>",
  "publicationYear": <year>,
  "refId": "<bookCode>",
  "revision": <integer>,
  "schema": ["book", "chapters", "verses"],
  "schemaLabels": {
    "en": ["Book", "Chapter", "Verse"]
  },
  "slug": "<book slug>",
  "titles": {
    "<lang>": "<localised title>"
  },
  "versionTitles": {
    "<lang>": "<localised version title>"
  },
  "shortVersionTitles": {
    "<lang>": "<short form, e.g. WoH, 2026>"
  },
  "versionSource": "<URL of the project's authoritative source spec>",
  "versionLicense": "<licence>",
  "priority": <integer, sort order in catalog>,
  "subtitles": {
    "<lang>": "<subtitle>"
  },
  "descriptions": {
    "<lang>": "<long description>"
  },
  "updated": "<ISO 8601 timestamp>"
}
```

See `data-library/genesis-woh/_meta.json` for a complete worked
example.

## Production glossary

**Path:** `data-content/i18n/translation-glossary.json`

**File schema:**

```json
{
  "$schema": "./translation-glossary-schema.json",
  "name": "Wheel of Heaven Translation Glossary",
  "version": "<semver>",
  "released": "<ISO 8601 date>",
  "description": "<purpose statement>",
  "sourceLanguages": ["<ISO code>"],
  "scopeNote": "<what is and is not covered>",
  "terms": [ /* entries */ ]
}
```

**Entry schema:**

```json
{
  "id": "<unique kebab-case identifier>",
  "source": "<pointed/transliterated source form>",
  "translit": "<romanised transliteration>",
  "strongs": "<Strong's number, where applicable>",
  "partOfSpeech": "<grammatical category>",
  "literal": "<word-for-word literal sense>",
  "standardEnglish": "<standard PD translation rendering>",
  "wohChoice": "<the Wheel of Heaven Translation rendering>",
  "claim_type": "direct | inferred | speculative",
  "rationale": "<minimum three sentences>",
  "appliesTo": ["<refId>"]
}
```

**Versioning:**

- **Major** (`2.0.0`) — modification of existing entry's
  `wohChoice`. Behaviour change for re-renders.
- **Minor** (`1.10.0`) — addition of new entry. Backward
  compatible.
- **Patch** (`1.9.1`) — clarification of `rationale` or metadata.
  No behaviour change.

**Worked entry** (current production):

```json
{
  "id": "bara",
  "source": "בָּרָא",
  "translit": "bara",
  "strongs": "H1254",
  "partOfSpeech": "verb, qal",
  "literal": "shape, fashion, bring into being",
  "standardEnglish": "create",
  "wohChoice": "shape",
  "claim_type": "inferred",
  "rationale": "בָּרָא in the Qal is one of three distinct creation verbs in Genesis 1 (with עָשָׂה asah 'make' and יָצַר yatsar 'form'). All three are flattened to 'create/make' in the canonical English translations, losing a deliberate distinction. בָּרָא specifically denotes shaping or fashioning — its qal usage is reserved for Elohim's action throughout the Hebrew Bible, which has often been read theologically as 'create ex nihilo'. The lexical core, however, is the act of shaping — compare the cognate בָּרָא in the Piel meaning 'cut out, fashion'. Rendering as 'shape' preserves the verb's distinctness from asah without inserting a metaphysical claim either way.",
  "appliesTo": ["GEN-1:1", "GEN-1:21", "GEN-1:27"]
}
```

## Per-translation overlay glossary

**Path:** `data-library/{book-slug}/_translation-glossary.json`
(one per WoH-translated book; created when first needed)

**Schema:** Same file-level and entry-level shape as the
production glossary. The only difference is scope (text-specific
versus cross-corpus).

**Versioning:** Independent semver. The chapter file pins to
both the production glossary version and the overlay version (if
applicable).

## Distribution glossary

**Path:** `data-library/{book-slug}/_glossary.json`

**Schema:**

```json
{
  "_meta": {
    "title": "<purpose>",
    "purpose": "<authoritative purpose statement>",
    "book": "<book name, source-language and translated>",
    "i18n_key_order": ["en", "de", "es", "ru", "ja", "ko", "zh", "zh-Hant"],
    "registers": {
      "dialogue": "<per-language register convention>",
      "narration": "<per-language register convention>"
    },
    "open_inconsistencies_resolved_here": ["<note>"]
  },
  "scripture_policy": {
    "decision": "<one-line policy>",
    "base_editions": {
      "<lang>": "<PD scripture edition name>"
    },
    "carve_outs": {
      "<carve-out id>": "<explanation>"
    },
    "speaker_tag": "<rule for speaker tags>",
    "citation_form": "<rule for citation form>",
    "mixed_paragraphs": "<rule for mixed commentary + quote>"
  },
  "book_names": {
    "<source-language book name>": {
      "<lang>": "<localised name>"
    }
  },
  "proper_nouns": {
    "<canonical id>": {
      "<lang>": "<localised form>"
    }
  },
  "concepts": {
    "<canonical id>": {
      "<lang>": "<localised rendering>"
    }
  }
}
```

See `data-library/the-book-which-tells-the-truth/_glossary.json`
for a complete worked example (1176 lines, covering the full
Raëlian-canon distribution policy).

## Editor escalation report

**Path:** `data-library/{book-slug}/chapter-{N}-editor-report.md`

**Format:** Markdown with mandatory sections.

```markdown
# Chapter N Editor Report

## Speculative entries requiring sign-off

### `<glossary-entry-id>`

**Source:** <pointed/transliterated form>
**WoH choice:** <wohChoice>
**Why speculative:** <one paragraph explaining what this goes beyond>
**Recommendation:** <ship | downgrade to inferred | drop>

---

## Unresolved editorial questions

### `<refId>`

**Issue:** <description>
**Options considered:** <A, B, C>
**Why escalating:** <what the editor cannot resolve alone>
**Recommendation:** <option preferred, if any>

---

## Glossary changes for review

### Central glossary
- Added: `<id>` (claim_type: `<type>`)
- Modified: `<id>` (was `<old>`, now `<new>`; reason: `<reason>`)

### Per-translation overlay
- Added: `<id>` (claim_type: `<type>`)
```

If a section is empty, write the section header with the literal
text `_None._` underneath so the reader knows it was considered
and is genuinely empty.

## Reviewer report (inside chapter file)

The Reviewer's output is a JSON block written into the chapter
file at `translation.reviewerReport`:

```json
{
  "translation": {
    "...": "...",
    "reviewerReport": {
      "reviewer": "<agent id, e.g. claude-opus-4-7 acting as woh-reviewer>",
      "reviewedAt": "<ISO 8601 timestamp>",
      "verdicts": [
        {
          "refId": "<CODE>-<chapter>:<verse>",
          "status": "approve | revise | flag-for-human",
          "citations": ["<scholarly source>"],
          "reasoning": "<one to three sentences>"
        }
      ],
      "glossaryReview": [
        {
          "glossary_id": "<id>",
          "status": "approve | downgrade-claim-type | revise | flag-for-human",
          "citations": ["<scholarly source>"],
          "reasoning": "<one to three sentences>"
        }
      ],
      "lens-leakage-flags": [
        {
          "refId": "<CODE>-<chapter>:<verse>",
          "concern": "<what makes the translated text read like interpretation>"
        }
      ]
    }
  }
}
```

The `verdicts[]` array must have one entry per paragraph in the
chapter. `glossaryReview[]` must have one entry per glossary
entry added or modified during this chapter's editorial pass.
`lens-leakage-flags[]` may be empty.

## Human sign-off package

**Path:** `data-library/{book-slug}/chapter-{N}-signoff-package.md`

**Purpose:** Summary document for human review. Contains the
information needed to make the sign-off decision without reading
every individual file.

**Format:**

```markdown
# Chapter N Sign-off Package

**Book:** <book name>
**Chapter:** N
**Status:** awaiting-human | reviewer-approved
**Pinned glossary versions:** production v<X.Y.Z>; overlay v<A.B.C> (if applicable)

## Summary

| Metric | Count |
|---|---|
| Verses translated | <N> |
| Verses divergent from standard PD | <N> |
| New glossary entries | <N> (<direct count> direct / <inferred count> inferred / <speculative count> speculative) |
| Reviewer verdicts: approve | <N> |
| Reviewer verdicts: revise | <N> |
| Reviewer verdicts: flag-for-human | <N> |
| Lens-leakage flags | <N> |

## Items requiring decision

<List every reviewer flag-for-human verdict and every editor
escalation that is still open. One bullet per item, with the
refId or glossary id.>

## Editor escalation report (inlined)

<Full inlined content of chapter-N-editor-report.md>

## Reviewer report (inlined)

<Pretty-printed JSON of translation.reviewerReport>

## Sign-off

To sign off, the human reviewer:

1. Resolves every item in "Items requiring decision" above.
2. Confirms the verdicts they accept.
3. Writes a sign-off statement: "Signed off by <name> on <ISO date>."
4. Updates the chapter file:
   - `translation.reviewer` = <name>
   - `translation.reviewedAt` = <ISO timestamp>
   - `translation.version` = `1.0.0` (drop the -rc1 suffix)
   - `translation.status` = `stable`
```
