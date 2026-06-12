+++
title = "Source-Text Translation (WoH Translation Program)"
description = "How Wheel of Heaven produces original translations of religious and mythological source texts (Hebrew, Greek, Akkadian, Sumerian, Arabic, …) under the WoH lens. Principles, pipeline, agent roles, glossary system, source acquisition, file formats, citation discipline, and roadmap."
sort_by = "weight"
weight = 55
template = "section.html"
+++

The **Wheel of Heaven Translation Program** produces original
English-language translations of religious and mythological texts
from their source languages, read through the Wheel of Heaven lens —
which takes the Raëlian canon as foundational and prefers, where the
source admits multiple defensible readings, the reading most
consistent with that canon.

This is a different kind of work from the i18n localisation pipeline
that translates English Wheel of Heaven content into the nine other
site languages. The two pipelines do not compete; they sit at
different points in the content flow.

| Pipeline | Direction | Documented at |
|---|---|---|
| **WoH Translation Program** | Source language (Hebrew, Greek, …) → English, with WoH lens applied lexically | This section |
| **i18n localisation** | English (or French, for canon books) → 8 other site languages, preserving project terminology | [Translations](@/contributing/content/translations.md) |

A book translated under the WoH Translation Program (worked
example: [Genesis-WoH](https://www.wheelofheaven.world/library/genesis-woh/),
50 chapters signed off as `stable`) is subsequently fanned out to
the other site languages through the i18n localisation pipeline.
The two are sequential, not parallel.

## What lives here

- **[Principles](@/contributing/content/source-text-translation/principles.md)**
  — the project's editorial commitments. Accuracy above lens; lens
  in the apparatus, not in the text; the Raëlian canon as the
  tiebreaker where the source is ambiguous; explicit
  `claim_type` discipline.
- **[Workflow](@/contributing/content/source-text-translation/workflow.md)**
  — the eight-step per-chapter pipeline from source acquisition
  through human sign-off, with a worked example.
- **[Roles](@/contributing/content/source-text-translation/roles.md)**
  — full role definitions for the three AI agents in the pipeline
  (Translator, Editor, Reviewer), with their hard rules and
  input/output contracts.
- **[Glossary system](@/contributing/content/source-text-translation/glossary-system.md)**
  — the three glossary layers (production / overlay / distribution),
  what each is for, and how they interact during translation.
- **[Source acquisition](@/contributing/content/source-text-translation/source-acquisition.md)**
  — where to obtain openly-licensed pointed/transliterated source
  texts, by tradition: Hebrew Bible, Greek NT, Akkadian, Sumerian,
  Egyptian, Qur'an, Pseudepigrapha.
- **[File formats](@/contributing/content/source-text-translation/file-formats.md)**
  — the JSON schemas for source files, chapter files, and glossary
  files, with full worked examples.
- **[Reviewer citation shelf](@/contributing/content/source-text-translation/reviewer-citation-shelf.md)**
  — the canonical scholarly lexicons and commentaries the Reviewer
  agent must cite. Acceptable and unacceptable sources by tradition.
- **[Roadmap](@/contributing/content/source-text-translation/roadmap.md)**
  — the prioritised text list, current state, and what is next.
- **[Library Acquisition Program](@/contributing/content/library-acquisition.md)**
  — the broader strategy the roadmap operates within: which texts
  are sourced, in which tradition, on which track (Edition vs
  Translation), and why.

## Who this section is for

- **Editors and reviewers** who want to understand or audit the
  project's translation methodology.
- **Scholarly readers** who want to see the project's source-handling
  discipline before deciding whether to trust the translations.
- **Future contributors** (human or AI-assisted) producing
  translations under the Program.
- **Anyone curious** about how the Raëlian-lens reading interacts
  with serious source-language work.

If you are reading a WoH Translation in the Library and want to know
why the translation makes a particular choice, the glossary entry
referenced from the chapter's `glossaryRefs[]` is the immediate
answer; this section is the methodological background behind that
answer.

## The one-paragraph version

A chapter of source-language text flows through three AI agents in
sequence — Translator (literal rendering applying the existing
glossary), Editor (lexical-decision adjudication, commentary,
glossary deltas), Reviewer (independent verification with
mandatory scholarly citations). The Reviewer then produces a
sign-off package; a named human reviewer (currently Zara
Zinsfuss) signs off; the chapter is promoted to stable. The
translated text reads as a defensible scholarly translation; the
Wheel of Heaven lens lives in the per-verse commentary and the
glossary entries, never in the translated English itself. Every
divergence from a major public-domain translation is recorded
with a `claim_type` (`direct` / `inferred` / `speculative`) so
readers can audit exactly how far the lens went in any specific
choice.

## Current state (2026-06)

- **Books shipped or in flight: 21.** Hebrew Bible — Genesis (50 ch,
  complete), Exodus, Isaiah (scaffold), Ezekiel, Daniel, Job. New
  Testament — Matthew, Mark, Luke, Acts, Revelation. Qur'an
  (selections). Pseudepigrapha — 1 Enoch, Jubilees, Shi'ur Qomah.
  Mesopotamian — Gilgamesh XI, Adapa, Eridu Genesis, Enki and Ninmah,
  Enki and Ninhursag, Song of the Hoe. Ugaritic — Baal Cycle (KTU
  1.3–1.4). All drafted chapters are signed off as `stable`.
- **Acquisition queue: 72 more books** are registered as `planned` in
  `catalog.json` per the
  [2026-06 Library Acquisition Program](@/contributing/content/library-acquisition.md):
  the Atrahasis ring, the Anatolian Kumarbi cycle, the Avesta, Greek
  (Theogony, Plato, the Hellenistic witnesses), Egyptian (Heavenly
  Cow, Pyramid Texts), Bahá'í, Caodai, Oomoto, more pseudepigrapha,
  Hekhalot, Gnostic/Coptic.
- **Production glossary** is at v2.69.0 with 789 terms across six
  source languages (Hebrew, Sumerian, Akkadian, Ugaritic, Arabic,
  Greek). Distribution: 708 `direct` / 74 `inferred` / 7
  `speculative`.
- **Per-translation overlay glossaries** are active for 19 books
  (every shipped translation except Genesis-WoH and the Mormon
  Edition track). The mechanism is described in
  [Glossary system](@/contributing/content/source-text-translation/glossary-system.md).
- **Multi-language fanout** is operational and runs after a book
  reaches `stable` — see [Translations](@/contributing/content/translations.md).
