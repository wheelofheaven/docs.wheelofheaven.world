+++
title = "Principles"
description = "The five editorial commitments that shape every Wheel of Heaven Translation: accuracy above lens, lens in the apparatus, the canon as tiebreaker, claim-type discipline, and audit-trail integrity."
weight = 10
+++

These principles are the constitution of the Wheel of Heaven
Translation Program. They override convenience, throughput, and
stylistic preference. Every agent role, every workflow step, and
every glossary entry is downstream of them.

## 1. Accuracy above lens

Where the source language is unambiguous, the translation reflects
it. Period.

This is the load-bearing commitment of the entire Program. The
project does **not** translate freely to accommodate the Wheel of
Heaven reading; it translates accurately and lets the WoH reading
emerge from the apparatus where the source supports it.

The corollary: if a credentialed scholar of the source tradition
reads a WoH Translation and says "that is not what the Hebrew /
Greek / Akkadian says," the translation has failed — regardless of
how well the choice serves the lens. The whole credibility of the
Program rests on this commitment being literally true.

**Example.** Genesis 1:1 — *bereshit bara elohim et hashamayim
v'et ha'aretz*. The verb *bara* is the qal of a Hebrew root whose
lexical core is "shape, fashion, bring into being." Rendering it
as "create" (KJV/ASV) or "shape" (WoH) are both defensible. The
WoH choice "shape" is not a lens-driven freedom — it is a
defensible reading of the lexical core, documented in the glossary
with the rationale "preserves the verb's distinctness from *asah*
and *yatsar* without inserting a metaphysical claim either way."

**Counter-example.** A reading like *bereshit bara elohim* → "in
the beginning, the extraterrestrials engineered" would be a lens
intrusion. The Hebrew word *bara* does not mean "engineered" and
the Hebrew word *elohim* does not name a specific category of
beings. That kind of move violates this principle and would not
ship.

## 2. The lens lives in the apparatus, not in the text

The translated text is what the reader sees first; the apparatus is
where the project's interpretive commitments live. The two are
deliberately separated.

The text in `paragraphs[].i18n.en` reads as a defensible scholarly
translation. A reader unfamiliar with Wheel of Heaven, reading the
translation cold, should not detect "this is a WoH translation" from
the English alone. They might detect it from the per-verse
commentary, or from the methodology page, or from the glossary
entries — but the translation itself reads straight.

This is how Édouard Dhorme (whose French Bible Raël used) did his
work. Dhorme's translation reads as a careful, scholarly French
rendering of the Hebrew; the interpretive moves are in the
footnotes and the introduction, not in the body of the text.
Dhorme is still cited in serious biblical scholarship a century
later for exactly this discipline.

**Concrete:** the per-paragraph `commentary` field can argue why
the WoH choice is defensible, can name what scholarly literature
supports it, can note what the lens makes visible. The
`paragraphs[].i18n.en` field cannot do those things — it can only
render.

## 3. Where the source is ambiguous, the Wheel of Heaven canon is the tiebreaker

Hebrew, Greek, Akkadian, and most other source languages have
words with multiple defensible English renderings. Lexicons list
ranges, not points. Translation is therefore always making
choices.

The project's stated stance (decision #1 in the project's strategy
record): the Raëlian canon — *The Book Which Tells The Truth*
(1974), *Extra-Terrestrials Took Me To Their Planet* (1975), and
*Let's Welcome The Extra-Terrestrials* (1979) — is the
foundational lens. Where two defensible translations of a verse
sit on the spectrum, the project prefers the one most consistent
with that canon.

This is not "translating to fit the canon." It is "using the canon
to break ties where the source genuinely permits multiple
readings, and recording the choice openly so the reader can audit
it."

**Example.** *elohim* is grammatically masculine plural in
Hebrew (the *-im* suffix is the unambiguous plural marker). It can
be construed singularly in some contexts (a "plural of majesty"
reading), but the plural form is the grammatical default. Most
modern English translations render it singular ("God") on
theological grounds inherited from the LXX. The WoH translation
preserves the plural ("the Elohim") because the canon reads
*elohim* as plural agency. Both readings are defensible; the
canon is the tiebreaker; the glossary entry records the choice as
`claim_type: direct` (the plural form is grammatically explicit).

**Example.** *ruach elohim* in Gen 1:2 admits three lexical
fields: breath, wind, spirit. KJV/ASV "Spirit of God" is a
Trinitarian-tradition retrojection; the Hebrew supports any of the
three. The WoH translation chooses "breath of the Elohim"
because (a) the immediately-following verb *merachefet* "hovering"
fits a physical reading better, and (b) the canon does not need a
Christian Trinitarian metaphysics in the second verse of Genesis.
Glossary entry records this as `claim_type: inferred` — defensible
from the lexical range, not consensus.

## 4. Claim-type discipline

Every WoH-divergent lexical choice carries a `claim_type` label,
one of:

- **`direct`** — the WoH choice is grammatically explicit in the
  source or matches a scholarly consensus. There is no real
  disagreement among careful source-language readers.
- **`inferred`** — the WoH choice is a defensible reading of the
  source consistent with what some named scholars argue, but not
  the consensus or the traditional rendering. The lexical
  evidence supports it; the choice between this and the standard
  reading is interpretive.
- **`speculative`** — the WoH choice goes beyond what any single
  scholarly source attests. It is the project's interpretive
  synthesis or a project-specific reading. **Honest about being
  speculative**; not dressed up as direct or inferred.

This labeling is not for the project's internal use only — it is
the reader's audit handle. A reader inspecting the glossary can
filter to `speculative` entries to see exactly where the project
made non-scholarly moves, and can decide for themselves whether
to trust those moves.

The same `claim_type` discipline is used throughout the Wheel of
Heaven content corpus (see
[Editorial Passes](@/contributing/content/editorial-passes.md));
the translation program inherits the discipline at the lexical
level.

`claim_type: speculative` entries require explicit human sign-off.
They cannot ship on an AI editor or reviewer's say-so alone.

## 5. Audit-trail integrity

Every step of the pipeline is preserved. Nothing is silently
overwritten or edited away.

- The **source file** (`source-{lang}-{N}.json`) is immutable. The
  pointed/transliterated source is what it is.
- The **chapter file** (`chapter-{N}.json`) preserves
  `translation.modelDrafts[]`, `translation.reviewer`,
  `translation.reviewedAt`, `translation.reviewerReport`, the
  glossary version pinned to the chapter, and (eventually) a
  history of version bumps.
- The **glossary file** is semver-versioned, and every change to an
  existing entry bumps the major version. Chapters pin to the
  glossary version that produced them.
- The **editor's escalation report** and the **reviewer's verdict
  report** are preserved alongside the chapter. They are not summary
  artifacts that get discarded; they are part of the chapter's
  permanent record.

The audit trail is what lets the project make a credible claim
of scholarly seriousness. A reader who challenges a specific
WoH-divergence in a chapter can trace it through:

1. The `paragraphs[].i18n.en` rendering of the verse.
2. The `paragraphs[].glossaryRefs[]` array, naming the glossary
   entry that drove the choice.
3. The glossary entry itself, with `wohChoice`, `claim_type`,
   `rationale`, and `appliesTo[]`.
4. The chapter's `translation.reviewerReport` to see what the
   Reviewer agent verdicted on that specific verse and what
   citations were given.
5. The escalation report, where applicable, to see the editor's
   reasoning for the more contested choices.

Each layer of the audit chain can be checked independently. This
is the project's standing offer to serious readers: read the
translation, but if you want to know *why* any specific choice
was made, the answer is recorded, sourced, and signed.

## How these principles relate

The principles are ordered by priority. Accuracy is the absolute
top; everything else operates within it. The lens lives in the
apparatus *because* accuracy comes first in the text. The canon
is the tiebreaker *only where the source is ambiguous* —
ambiguity is the entry condition for the lens to operate. The
claim-type discipline and the audit trail are what make the
lens-as-tiebreaker honest rather than a fig leaf.

A simple test for any proposed translation choice: can it survive
all five principles simultaneously? If not, it does not ship.
