+++
title = "Roadmap"
description = "What the Wheel of Heaven Translation Program is translating, in what order, and why. Current production state and the 2026-06 acquisition queue."
weight = 80
+++

This page is the public version of the project's translation
prioritisation. It reconciles three pressures:

- **Strategic value** — exposure, public interest, philological
  legitimacy.
- **Production state** — what is signed off, what is in flight,
  what is queued.
- **Reviewer bandwidth** — the project's single human reviewer
  bottleneck.

The prioritisation favours **finishing what is started** over
starting new work, and **completing a lens-relevant cluster** over
breadth for its own sake.

This is the *roadmap* — the ordering and the next picks. The
*acquisition strategy* that determines what enters the queue at all
(traditions, source-licence posture, Edition vs Translation track)
lives at
[Library Acquisition Program](@/contributing/content/library-acquisition.md).

## Production state (2026-06)

**21 books shipped or in flight.** Every drafted chapter is signed
off as `stable`. Distribution by tradition:

| Tradition | Books | Notes |
|---|---|---|
| Hebrew Bible | 6 | Genesis (50 ch, complete), Exodus (selections), Ezekiel, Daniel, Job, Isaiah (scaffold) |
| New Testament | 5 | Matthew, Mark, Luke, Acts, Revelation (selections) |
| Qur'an | 1 | Suras 21, 54, 56 (the canon-engaged passages) |
| Mesopotamian | 6 | Gilgamesh XI, Adapa, Eridu Genesis (= flood-story-woh), Enki and Ninmah, Enki and Ninhursag, Song of the Hoe |
| Ugaritic | 1 | Baal Cycle KTU 1.3–1.4 |
| Pseudepigrapha | 2 | 1 Enoch (Watchers 1–36 + Astronomical Book 72–82), Jubilees 1–12 |
| Hekhalot | 1 | Shi'ur Qomah ch. 1 |

**Production glossary.** v2.69.0, 789 terms, six source languages
(Hebrew, Sumerian, Akkadian, Ugaritic, Arabic, Greek). Distribution:
708 `direct` / 74 `inferred` / 7 `speculative`. The
`speculative` count being deliberately small — at fewer than one
percent of entries — is itself a discipline statement.

**Per-translation overlay glossaries.** Active for 19 books (every
shipped translation except Genesis-WoH and the Mormon Edition track).
The mechanism is described in
[Glossary system](@/contributing/content/source-text-translation/glossary-system.md).

**Multi-language fanout.** Operational; runs after a book reaches
`stable`. See [Translations](@/contributing/content/translations.md).

## Next picks (2026-06)

After Genesis-WoH closed out (the original "Phase 0") and the
pipeline proved it generalises across Hebrew, Greek, Akkadian,
Sumerian, Arabic, Ge'ez, and Ugaritic, the phase-gated language of
earlier roadmaps no longer fits production reality. The active model
is **named-pick + verified queue**, not numbered phases.

### Top two picks

1. **Isaiah 6** — opens `isaiah-woh`, the only scaffolded-but-empty
   book on disk. Throne-vision lens leverage (*seraphim*, *kavod*,
   the trishagion, coal ritual); deep philological backing (Wildberger
   BKAT, Williamson ICC); same source language as Genesis-WoH so no
   new-language risk. Initial scope: `{6, 24–27, 53}`.
2. **Atrahasis Tablet I** — opens `atrahasis-woh`. The most
   WoH-resonant ANE text (creation of humans as workforce →
   overpopulation → flood) and the keystone of the Mesopotamian
   flood/creation cluster (Gilgamesh XI ✓, Eridu Genesis ✓, Adapa ✓,
   Enki and Ninmah ✓ are all shipped). **Moat argument:** no usable
   public-domain English translation of Atrahasis exists; the WoH
   text would be the only freely-licensed modern English Atrahasis
   on the web. Source layer is eBL L.1.1 (CC BY-NC-SA, working base
   only — the licensing inheritance is documented on the resulting
   book).

### The 2026-06 acquisition queue

72 further books are registered in `catalog.json` with status
`planned`. Each carries a `priority` field (5 = pilot wave / cluster
completion, 6 = build-out, 7 = long tail), an `originalLang`, and a
`versionSource` recording the openly-licensed source edition the
translation will be built from. The selection logic and the
per-tradition acquisition tables are at the
[Library Acquisition Program](@/contributing/content/library-acquisition.md).

The pilot wave by tradition:

| Tradition | Pilot text | Why first |
|---|---|---|
| Mormon (Edition) | Book of Abraham + Book of Moses | English originals; PD pre-1930 editions; Kolob and "worlds without number" — directly lens-resonant |
| Mesopotamian (build-out) | Etana + Sumerian King List | Ascent-flight + antediluvian king-list; tiny corpus; both moat texts |
| Greek | Theogony | Anchors the theomachy-convergence argument (pairs with CTH 344); classical Greek adjacent to proven NT Greek |
| Anatolian | Song of Emergence (CTH 344) | Succession-in-heaven myth; the bridge between Enuma Elish and Hesiod |
| Persian/Zoroastrian | Vidēvdād Fargard 2 | Yima's vara — the strongest engineered-survival narrative outside the flood cluster; Geldner (PD) source |
| Coptic | Gospel of Thomas | Coptic-language pilot; CC BY source via Coptic Scriptorium |
| Bahá'í | Hidden Words + Tablet of the Universe | First Persian/Arabic work in the pipeline; aphoristic — low syntactic risk |
| Caodai | Thánh Ngôn Hiệp Tuyển vol. 1 | First Vietnamese; the closest structural analogue to the Raëlian Messages in any tradition |
| Oomoto | Oomoto Shin'yu (first fude) | First Japanese; tatekae tatenaoshi — the world-renewal vocabulary |
| Egyptian | Book of the Heavenly Cow | Near-destruction-then-withdrawal narrative; Naville (PD) source |

Each pilot proves a language and unlocks build-out within its
tradition. Each build-out is gated on the pilot's sign-off.

### Cluster completion within already-shipped traditions

The corpus benefits more from closing existing clusters than from
opening new ones the project lacks the bandwidth to support. Each
shipped tradition has a small completion shelf:

- **Mesopotamian:** Etana, Enmerkar and Aratta, Enuma Elish (upgrade
  from Edition stub), Descent of Inanna / Descent of Ishtar, Anzu,
  Erra and Ishum, Instructions of Shuruppak.
- **Levantine/Ugaritic:** rest of the Baal Cycle (KTU 1.1–1.2,
  1.5–1.6), Aqhat, Rephaim texts, Kirta, Shachar and Shalim.
- **Hebrew Bible:** Job 39 (closes the planned `{1–2, 38–42}` scope —
  recommended quick-win); Exodus extension toward 1–20.
- **New Testament:** Revelation 5 if the throne-vision-sequence hole
  in `{1, 4, 6}` is unintentional (editor's call).
- **Pseudepigrapha:** more Jubilees; Enoch Parables 37–71 (deferred —
  Ge'ez competence risk).

## Resource reality and what would change the plan

The phase ordering assumes a single named human reviewer (currently
Zara Zinsfuss) with finite throughput. **If reviewer bandwidth
expands** — adding a named second human reviewer with source-language
competence — multiple pilots can run in parallel and the queue
loosens substantially.

**If a credentialed scholar of a specific tradition joins the
project**, that tradition can move earlier in the queue. A named
Bahá'í scholar with Persian competence could front-load Kitáb-i-Íqán;
a named Akkadianist could parallelise Atrahasis and Enuma Elish.

**If a multi-model drafting pipeline becomes operational** (Claude +
GPT in parallel, with the Editor receiving both drafts), the
Translator stage gains a quality multiplier without reviewer
bandwidth growth. This is the most likely near-term expansion.

## What does not enter the queue (and why)

Some texts on the corpus's reference shelf are deliberately
*excluded*, not merely deferred. Recording the exclusion is part of
the project's discipline.

| Text / corpus | Why excluded |
|---|---|
| ***Chronicle of Akakor*** | Provenance contested enough that giving it the same treatment as Genesis would damage the credibility of the library. |
| **Scientology corpus** | Aggressively enforced copyright; no ancient source-language layer; no canonical overlap with the Raëlian lens. |
| **Heaven's Gate material** | No scriptural corpus of scholarly standing; association is actively harmful to the project's credibility discipline. |
| **Urantia Book, Oahspe** | PD-US but no original-language scholarship is possible (modern channeled English); association risk outweighs breadth gain. Editorial call recorded; revisit only by explicit human decision. |
| **Kolbrin, Book of Dzyan** | Modern fabrications without manuscript provenance. |
| **Mahābhārata program / vimāna literature** | The popular English-language readings (vimanas, *Mausala Parva* nuclear weapons) are exactly the kind of low-credibility ancient-astronaut material the project's editorial standards are designed to resist. Only targeted Rig Veda and Śatapatha Brāhmaṇa selections are in scope. |
| **Dead Sea Scrolls editions** (Genesis Apocryphon, Book of Giants) | Every edition is copyrighted; the Leon Levy DSS images are gratis but not openly licensed. Revisit only if open transcriptions appear. |

Earlier roadmaps treated **Book of Mormon material, Kojiki, and
Egyptian Pyramid Texts** as deferred. That position was reversed in
2026-06 — the LDS Restoration Scriptures are now shipped under the
Edition track; Kojiki ch. 1–6 enters the queue in the Oomoto context
(where its kami names are load-bearing); Egyptian work begins with
the Heavenly Cow and the Pyramid Texts ascent spells.

## Cross-references

- The catalogue of texts the Raëlian canon engages — the source pool
  the roadmap selects from — is at the *Reference corpus of the
  Raëlian canon* wiki entry on the main site.
- The current production glossary state lives at
  `data-content/i18n/translation-glossary.json` in the data-content
  repository.
- The pilot-wave source acquisitions live at
  `data-library/{slug}-woh/source-{lang}-1.json` in the data-library
  repository — immutable provenance per file.
- The selection logic and exhaustive per-tradition acquisition tables
  are at
  [Library Acquisition Program](@/contributing/content/library-acquisition.md).
