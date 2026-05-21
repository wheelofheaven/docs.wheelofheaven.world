+++
title = "Roadmap"
description = "What the Wheel of Heaven Translation Program is translating, in what order, why, and what is deliberately not on the list yet. Current state as of 2026-05-21."
weight = 80
+++

This page is the public version of the project's translation
prioritisation. It reconciles three pressures:

- **Strategic value** — exposure, public interest, philological
  legitimacy.
- **Production state** — what is in flight, what is signed off,
  what is queued.
- **Reviewer bandwidth** — the project's single human reviewer
  bottleneck.

The prioritisation favours **finishing what is started** over
starting new work. The Genesis translation is mid-flight; that
finishes before anything else begins. Everything below describes
what happens after Genesis is signed off.

## Current state (2026-05-21)

| Project | Status | Notes |
|---|---|---|
| **Genesis** | Chapters 1–9 drafted; 10–11 queued; full review pending | The first WoH Translation. Production glossary v1.9.0 was built around this work. |
| **Production glossary** | v1.9.0, 147 Hebrew entries | 117 `direct` / 23 `inferred` / 7 `speculative`. Stable; awaiting next chapter additions. |
| **Per-translation overlay system** | Designed, not yet active | First instance created when Ezekiel begins. |
| **Multi-language fanout pipeline** | Designed, not yet built | Activated when Genesis reaches `stable`. |
| **Parallel-display reader** (Library UI for ASV ↔ WoH) | Not built | Open infrastructure item. Required for the public reading experience. |

## Phase 0 — Finish Genesis (2026-Q2 / Q3)

**Do not start any new text until Phase 0 is complete.**

Deliverables:

1. Draft Genesis chapters 10–11 through the Translator → Editor
   → Reviewer pipeline.
2. End-to-end human review of chapters 1–11 with named reviewer
   and ISO date pinned in each `chapter-N.json`.
3. Promote all 11 chapters from `1.0.0-rc1` to `1.0.0` (stable).
4. Ship the parallel-display reader for the Library UI so a
   reader can compare a chosen reference PD translation
   verse-by-verse against the WoH Translation.
5. Trigger the multi-language fanout pipeline: render the
   English Translation of Genesis into the 8 other site
   languages, using `data-library/genesis-woh/_glossary.json`
   (created as part of this work) for proper-noun and concept
   consistency.

Phase 0 is the closing-out of what the project called the
"Genesis 1 pilot" — a label that has been overrun by reality.
The work has succeeded loudly enough that "pilot" is no longer
the right framing. Phase 0 is the formal recognition of that.

## Phase 1 — Standalone-chapter pilot for non-Genesis (2026-Q3)

Goal: **prove the pipeline generalises off Genesis.**

The next test is whether the three-agent pipeline (Translator,
Editor, Reviewer) produces work of comparable quality on a
different book in the same source language. One standalone
high-leverage chapter, end to end.

**The choice is Ezekiel chapter 1.** Reasons:

- **Standing search interest.** The Ezekiel-as-ancient-astronaut
  reading is one of the project's most-referenced associations
  in public discourse. Search traffic to this chapter dwarfs
  other Hebrew Bible chapters.
- **Strong philological backing.** Greenberg (Anchor Bible),
  Block (NICOT), Zimmerli (Hermeneia) all wrestle seriously with
  the chapter; the *kavod*-tradition scholarship is well-developed;
  the Dhorme translation handles it carefully.
- **Standalone scope.** One chapter, finishable without
  committing to the full book. Outputs the project's first
  example of a non-Genesis WoH Translation.
- **High lens leverage.** The throne-vision, the four living
  creatures, the wheel-within-wheel — the WoH-relevant
  vocabulary is dense and the lens-friendly reading is
  defensible from the Hebrew.
- **Glossary expansion.** Forces the production glossary (or
  the per-translation overlay) to extend into Ezekiel-specific
  vocabulary: *chashmal* (electrum / amber), *galgal* (wheel),
  *ofan* (wheel), *chayyot* (living creatures), the four-faces
  lexicon. Proves the glossary system scales beyond Genesis.

Phase 1 ships when Ezekiel 1 is signed off as `stable`.

## Phase 2 — Hebrew Bible spine (2026-Q4 — 2027-Q2)

With the pipeline proven on two books, extend the Hebrew Bible
work. Each item below is independently finishable; one ships
before the next starts.

1. **Exodus 1–20** — continues the Genesis narrative arc with
   the highest-recognition material in the Hebrew Bible
   (burning bush, plagues, parting sea, Sinai). Extends the
   `bara` / `asah` / `yatsar` verb-pattern attention into the
   tabernacle account (chs. 25–31, 35–40 — though those are
   beyond the Phase 2 chapter scope).
2. **Ezekiel chapters 10 and 37** — the throne-vision return
   (ch 10) and the valley of dry bones (ch 37, read in the
   Raëlian canon as the biological-creation machine).
3. **Book of Job, chapters 1–2 and 38–42** — the *bnei-elohim*
   council scene (chs 1–2) and the divine speeches with the
   *behemoth* / *leviathan* material (chs 38–42).
4. **Isaiah chapters 6, 24–27, 53** — throne-room vision (ch 6),
   the "Little Apocalypse" (chs 24–27), and the suffering-servant
   text (ch 53).

These four are a coherent set: the centre of the WoH-resonant
Hebrew Bible material that is not itself Genesis. Extension
beyond this set is deferred to a reassessment gate.

## Phase 3 — The cross-tradition pairing (2027-Q2 / Q3)

Two anchor cross-tradition texts. These earn intellectual
seriousness or fail.

1. **Epic of Gilgamesh, Tablet XI (the flood narrative).** The
   single best-attested cross-tradition parallel in all of
   religious literature. Paired with Genesis 6–9 (already in
   WoH translation), this is the project's strongest
   comparative move. Source: ETCSL / CDLI for open-licensed
   transliteration; George 2003 as scholarly reference (not as
   base text — Penguin Classics is copyrighted).
2. **Qur'an: Suras 21:1–5, 54:1, 56:15–24** (the three citations
   the Raëlian canon engages directly). Translation track
   requires working from Arabic; Edition track is available as
   a fallback. The project must engage Islam respectfully and
   technically, not casually.

## Phase 4 — The New Testament hinge (2027-Q3 / Q4)

1. **Gospel of Matthew** — most heavily cited NT book in the
   Raëlian canon; contains the Parable of the Sower (chapter
   13) that the canon reads cosmologically.
2. **Apocalypse of John (Revelation)** — strongest interpretive
   payoff in the NT; the WoH-style re-reading of the
   throne-vision sequence in chapters 4–6 is one of the
   highest-leverage moves in the corpus.

These come after Phase 3 (not before, despite the public
appeal) for one reason: **the existing Hebrew Bible work and
the cross-tradition ANE pairing should be the project's
intellectual centre of gravity before the NT pivots attention
to a tradition the project engages less canonically.** The NT
texts are absolutely on the roadmap; they are not the next
anchor.

## Phase 5 — The esoteric corpus (2028+)

1. **Book of Enoch (1 Enoch), Book of the Watchers (chapters
   1–36)** — high-interest, mid-legitimacy. The most directly
   WoH-resonant material in the pseudepigrapha. Critical
   editions: Knibb 1978; Nickelsburg 2001 (Hermeneia).
2. **Curated selection from Shi'ur Qomah / Hekhalot
   literature** — what the Raëlian canon actually means when it
   says "Kabbalah." Closing one of the source-tensions named in
   the *Reference corpus of the Raëlian canon* wiki entry.

## Phase 6 — Reassessment gate

Geographic and traditional expansion (Popol Vuh, Hesiod's
*Theogony* / *Works and Days*, others) only after a
reassessment gate. Phase 6 is not on the schedule.

## What we do not prioritise (and why)

These are on the canon's reference corpus but deliberately not
on the translation roadmap in the foreseeable future.

| Text | Why deferred |
|---|---|
| **Mahābhārata / Vedas** | Corpus is enormous, WoH-relevant material scattered, existing English-language popular readings (vimanas, *Mausala Parva* nuclear weapons) are exactly the kind of low-credibility ancient-astronaut material the project's editorial standards are designed to resist. Doing this well requires deep Sanskritic competence the project does not yet have. |
| ***Chronicle of Akakor*** | Actively do not translate. Provenance is contested enough that giving it the same treatment as Genesis would damage the credibility of the whole library. |
| **Kojiki** | Intriguing but requires linguistic depth the project does not yet have. Existing English translations (Chamberlain, Philippi) are old enough that a WoH retranslation would be doing two jobs at once. |
| **Book of Mormon material** | The audience overlap with the existing LDS community is fraught territory and the project gains little exposure benefit relative to the risk. Also: classified as Edition track only (no pre-Smith source-language manuscript). |
| **Egyptian Pyramid Texts** | The Egyptian-WoH readings are not as well-developed as the Mesopotamian ones; existing scholarly editions are mostly copyrighted (Allen 2005). Defer until the Mesopotamian comparative work has matured. |

## Resource reality and what would change the plan

The phase ordering assumes a single named human reviewer with
finite throughput. **If reviewer bandwidth expands** — adding a
named second human reviewer with source-language competence —
the ordering loosens substantially:

- Phase 2 and Phase 3 could run partially in parallel (different
  reviewers per book).
- Phase 1 could be doubled (Ezekiel 1 in parallel with a Greek
  NT pilot, e.g. Mark 1).
- Phase 0 could finish faster (chapter review parallelised).

**If a credentialed scholar of a specific tradition joins the
project**, that tradition can move earlier in the queue. A named
Sanskrit specialist could de-prioritise the "not-yet-Mahābhārata"
constraint; a named Akkadianist could front-load Atrahasis
alongside Gilgamesh.

**If a multi-model drafting pipeline becomes operational**
(Claude + GPT in parallel, with the Editor receiving both
drafts), the Translator stage gets a quality multiplier without
reviewer bandwidth growth. This is the most likely near-term
expansion.

## Cross-references

The strategic reasoning that produced this roadmap is recorded
in the project's internal strategy documents (not part of the
public docs). The relevant public references:

- The catalogue of texts the Raëlian canon engages — the
  source pool the roadmap selects from — is at the *Reference
  corpus of the Raëlian canon* wiki entry on the main site.
- The current production glossary state lives at
  `data-content/i18n/translation-glossary.json` in the
  data-content repository.
- The current Genesis translation lives at
  `data-library/genesis-woh/` in the data-library repository.
