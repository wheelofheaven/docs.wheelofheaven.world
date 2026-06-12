+++
title = "The glossary system"
description = "Three glossary layers (production, per-translation overlay, distribution) and how they interact to produce a Wheel of Heaven Translation and fan it out across the nine site languages."
weight = 40
+++

The Wheel of Heaven Translation Program uses **three glossary
layers**, each with a distinct purpose. They do not compete; they
sit at different points in the content flow.

| Layer | Purpose | File path | Direction | Status |
|---|---|---|---|---|
| **Production glossary** | Cross-corpus source-language → English lexical decisions | `data-content/i18n/translation-glossary.json` | Hebrew / Greek / Akkadian / Sumerian / Ugaritic / Arabic → English | Live: v2.69.0, 789 terms |
| **Per-translation overlay** | Text-specific source-language → English decisions that do not generalise | `data-library/{book-slug}/_translation-glossary.json` | Same direction, scoped to one text | Live for 19 books (every shipped translation except Genesis-WoH) |
| **Distribution glossary** | Per-book multi-language localisation (proper nouns, concepts, scripture policy) | `data-library/{book-slug}/_glossary.json` | English (or French) → de/es/fr/ja/ko/ru/zh/zh-Hant | Live for the 3 Raëlian-canon books |

The first two layers (production + per-translation overlay) belong
to the **translation phase** — producing the English Translation
from the source language. The third layer (distribution) belongs
to the **fanout phase** — rendering an already-translated book
into the eight other site languages.

## Layer 1: Production glossary

**File:** `data-content/i18n/translation-glossary.json`

**Purpose:** Record every cross-corpus lexical decision made by
the Wheel of Heaven Translation Program. When the Translator agent
encounters a term, it queries this file first. When the Editor
agent creates or modifies an entry, it writes to this file (for
cross-corpus decisions).

**Schema (every entry):**

```json
{
  "id": "<unique kebab-case identifier>",
  "source": "<pointed/transliterated source form>",
  "translit": "<romanised transliteration>",
  "strongs": "<Strong's number, e.g. H430 — where applicable>",
  "partOfSpeech": "<grammatical category>",
  "literal": "<word-for-word literal sense>",
  "standardEnglish": "<standard PD translation rendering>",
  "wohChoice": "<the Wheel of Heaven Translation rendering>",
  "claim_type": "direct | inferred | speculative",
  "rationale": "<minimum three sentences explaining the WoH choice over the standard>",
  "appliesTo": ["<refId>", "<refId>", "..."]
}
```

**File-level metadata:**

```json
{
  "$schema": "./translation-glossary-schema.json",
  "name": "Wheel of Heaven Translation Glossary",
  "version": "<semver, currently 1.9.0>",
  "released": "<ISO date>",
  "description": "...",
  "sourceLanguages": ["he"],
  "scopeNote": "...",
  "terms": [ /* entries */ ]
}
```

**Versioning:** Semver per file.

- **Major** (`2.0.0`) — modification of an existing entry's
  `wohChoice`. Any chapter pinned to a prior version still reads
  the same; readers of the new version see the new choice.
- **Minor** (`1.10.0`) — addition of a new entry. Backward
  compatible.
- **Patch** (`1.9.1`) — clarification of a `rationale` or
  correction of metadata. No behaviour change.

**Pinning:** Every chapter file pins to a specific glossary
version in `translation.glossaryVersion`. This ensures that when
the glossary evolves, prior chapters do not silently change.
Re-rendering a prior chapter against a newer glossary version is
explicit; it requires bumping the chapter's `glossaryVersion` and
re-running the pipeline for the affected paragraphs.

**Worked entry from production:**

```json
{
  "id": "elohim-as-translation",
  "source": "אֱלֹהִים",
  "translit": "elohim",
  "strongs": "H430",
  "partOfSpeech": "noun, masculine plural",
  "literal": "(the) elohim",
  "standardEnglish": "God",
  "wohChoice": "the Elohim (with article in narrative)",
  "claim_type": "direct",
  "rationale": "The form is grammatically masculine plural (-im ending). The translation 'God' (singular) is a theological smoothing inherited from the LXX's choice to render with singular Θεός and confirmed by Vulgate's Deus. The plural form is preserved as 'Elohim' (untranslated) per existing WoH convention. In narrative passages the bare proper-name form 'Elohim said' reads to English speakers as a singular proper noun, which silently re-imports the singular smoothing the WoH translation is explicitly rejecting. Rendering as 'the Elohim said' treats Elohim as a plural class-noun in English (parallel to 'the Egyptians', 'the Anunnaki') and carries the plural sense visibly in every occurrence. The article is dropped only inside the compound proper name YHWH-Elohim (Genesis 2:4 onward), which functions as a single divine name. Pronouns and verb agreement still mirror the Hebrew: where the Hebrew governs Elohim with singular verbs/pronouns the English keeps the singular; where the Hebrew breaks into plural the English follows. The agreement seam is the text's own, preserved rather than smoothed.",
  "appliesTo": ["GEN-1:1", "GEN-1:2", "GEN-1:3", "..."]
}
```

This is the load-bearing entry — every other Hebrew Bible
translation in the corpus inherits the article rule and the
plural-class-noun treatment. Future translations of Exodus,
Ezekiel, Job, Isaiah etc. apply this entry mechanically.

## Layer 2: Per-translation overlay glossary

**File:** `data-library/{book-slug}/_translation-glossary.json`
(one per WoH-translated book)

**Purpose:** Record lexical decisions that are specific to a
single text and do not generalise to the rest of the corpus.
Adding them to the central production glossary would bloat the
central file with single-text entries.

**Schema:** Same as the production glossary. Identical entry
shape, identical `claim_type` discipline. The only difference is
scope.

**Lookup order:** The Translator and Editor agents query the
overlay first, then the production glossary. The overlay can
override a central entry for the scope of that specific text (rare
— and noted explicitly in the overlay entry's rationale).

**When to create the overlay file:** When the Editor produces the
first text-specific entry. Until then, the file does not exist.

**Examples of text-specific entries:**

- **Ezekiel** would gain `_translation-glossary.json` entries for
  *chashmal* (חַשְׁמַל, the "electrum" / "amber" / "gleaming
  metal" word of Ezek 1:4, 27; 8:2), *galgal* (גַּלְגַּל, the
  "wheel-within-wheel"), *ofan* (אוֹפָן, the standalone wheel),
  the four-faces lexicon, the *chayyot* (חַיּוֹת, "living
  creatures").
- **Job** would gain entries for *behemoth* (בְּהֵמוֹת),
  *leviathan* (לִוְיָתָן), the *bnei-elohim* council scene
  vocabulary (overlap with central, but Job has specific
  contextual readings).
- **Gilgamesh** would have an entirely separate overlay for
  Akkadian terms (*ilu*, *anunnaku*, the Tablet XI flood
  vocabulary) — actually a candidate for promotion to central if
  enough overlap with Hebrew Bible Atrahasis parallels emerges.

**Promotion to central:** If a term originally in an overlay
turns out to recur across multiple texts (the project picks up a
second book where the same lemma matters), the entry can be
promoted from overlay to central. Procedure:

1. The Editor copies the entry from overlay to central, bumping
   the central glossary's minor version.
2. The Editor removes the entry from the overlay, bumping the
   overlay's major version (since this is a behavioural change
   for anyone querying the overlay alone).
3. Affected chapters' `glossaryVersion` and (if applicable)
   `overlayGlossaryVersion` are bumped on next re-render.

**Status note (2026-06):** overlay files are active for 19 books
— every shipped translation except Genesis-WoH (the original
pilot, which used the central glossary only) and the LDS Edition
track books (no source-language layer). The overlay pattern was
first instantiated for Ezekiel and has carried forward to every
new translation since.

## Layer 3: Distribution glossary (per book)

**File:** `data-library/{book-slug}/_glossary.json` (one per
Library book that has been translated into multiple site
languages)

**Purpose:** Govern multi-language *distribution* of a text into
the eight site languages other than English. Records book names,
proper nouns, recurring concepts, and scripture-policy carve-outs
across `en de es fr ja ko ru zh zh-Hant`.

**This is a different concern from Layers 1 and 2.** Layers 1
and 2 are for producing the English Translation; Layer 3 is for
fanning that translation out (or, for the Raëlian-canon books
where the source language is French, fanning the French canonical
text out).

**Schema sections:**

```json
{
  "_meta": {
    "title": "...",
    "purpose": "...",
    "book": "...",
    "i18n_key_order": ["en", "de", "es", "ru", "ja", "ko", "zh", "zh-Hant"],
    "registers": {
      "dialogue": "formal/deferential per language",
      "narration": "each language's standard literary plain form"
    }
  },
  "scripture_policy": {
    "decision": "...",
    "base_editions": { "<lang>": "<edition name>" },
    "carve_outs": { /* per-term overrides */ }
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

**Worked example (Raëlian canon, TBWTT):**

```json
{
  "_meta": {
    "book": "The Book Which Tells the Truth (Le Livre qui dit la vérité)",
    "i18n_key_order": ["en", "de", "es", "ru", "ja", "ko", "zh", "zh-Hant"]
  },
  "scripture_policy": {
    "decision": "Quoted Bible passages use each language's recognized public-domain scripture text and cadence. Vorilhon's commentary is translated normally.",
    "carve_outs": {
      "elohim": "Where the French verse has 'Elohim', keep 'Elohim' (NOT God/Gott/Dios/Бог/神/하나님). The book's thesis is that 'Elohim' was mistranslated as God.",
      "divine_name": "Where the French verse uses 'Iahvé', keep it as the NAME per the divine_name glossary row."
    }
  },
  "book_names": {
    "Genèse": {
      "en": "Genesis", "de": "Genesis", "es": "Génesis",
      "ru": "Бытие", "ja": "創世記", "ko": "창세기",
      "zh": "创世记", "zh-Hant": "創世記"
    }
  }
}
```

**Status note (2026-06):** the distribution glossary exists for
the 3 Raëlian-canon books (TBWTT, ETTMTTP, LWTE) at ~1180 lines
each. The Genesis-WoH distribution glossary is created as part of
the multi-language fanout pass.

## How the three layers interact during a translation pass

When the **Translator agent** processes a verse:

1. Look up every source-language term in the **per-translation
   overlay** (if exists for this book).
2. For terms not in the overlay, look up in the **production
   glossary**.
3. For terms in neither, default to the reference PD translation
   and flag in `editorial_questions[]`.

Layer 3 is not touched during the Translator pass.

When the **Editor agent** creates a new lexical decision:

1. Ask: does this lemma occur in more than one book in the active
   or planned corpus?
   - Yes → central glossary entry.
   - No → per-translation overlay entry (create the overlay file
     if needed).
2. Either way, the entry has the same schema, same `claim_type`
   discipline.

Layer 3 is not touched during the Editor pass.

When the **multi-language fanout pipeline** (post-sign-off) runs:

1. Read the English Translation chapter file.
2. For every proper noun, concept, or scripture-quotation, look
   up in the **distribution glossary** for that book.
3. Render into each target language preserving the chosen forms.

Layers 1 and 2 are not touched during fanout. Fanout never
re-translates from the source language.

## Why three layers, not one?

The temptation is to consolidate. Resist it:

- **Production glossary** is for the project's collective
  cross-corpus decisions. It is a long-term asset that grows by
  ~30–100 entries per major book and stabilises around the lemmas
  that recur (every book of the Hebrew Bible inherits the
  *elohim* / *yhwh* / *ruach* / *bara* decisions). Bloating it
  with single-text entries would damage its utility.
- **Per-translation overlay** is for the text-specific decisions
  that would never benefit another book. It is short-lived in the
  sense that it is bounded by the text it serves. Mixing these
  into the central glossary would silently impose Ezekiel-specific
  decisions on every Genesis re-render.
- **Distribution glossary** answers a fundamentally different
  question — not "how does this Hebrew word render in English"
  but "how does this English term render across 9 languages."
  Mixing it with the production glossary would conflate two
  unrelated tasks.

The three-layer design keeps each glossary tight, scoped, and
useful for its own work.

## Migration paths

**If a term in the per-translation overlay turns out to recur**
across multiple books (you start a second book and find the same
lemma matters), promote it to central:

1. Copy entry from overlay to central, bumping central's minor
   version.
2. Remove from overlay, bumping overlay's major version.
3. Re-render affected chapters' `glossaryVersion` /
   `overlayGlossaryVersion`.

**If a term in the central glossary turns out to behave
differently in a specific text** (rare — but possible if a lemma
has a clearly idiomatic sense in one corpus), create an overlay
entry that shadows the central entry for that text. Note the
shadowing explicitly in the overlay entry's rationale ("Shadows
the central entry `<id>` for this text because …").

**If a project-wide convention changes** (e.g., the article rule
for *the Elohim* is revised), it is a central glossary major
version bump. Every affected chapter pinned to a prior version
remains as it was; new pinnings adopt the new convention. Manual
re-rendering of prior chapters is explicit and recorded.
