+++
title = "Enums"
description = "Controlled vocabularies returned by /v1/enums/."
weight = 30
+++

Every `/v1/enums/{name}/` endpoint returns a controlled vocabulary
used elsewhere in the API. The same vocabularies are tracked in
content frontmatter on www, so the API and the website agree on every
enumerated value.

The index lives at `/v1/enums/`.

## `authority-tier`

Source-program authority tier (Decision 5 of strategy-source-program).
Six tiers; Tier 0 is Raëlian-exclusive (Decision 1).

| Value | Tier | Label |
|---|---|---|
| `foundational` | 0 | Foundational Canon (Raëlian only) |
| `primary` | 1 | Primary Comparative |
| `scholarly` | 2 | Scholarly Context |
| `scientific` | 3 | Scientific Context |
| `critical` | 4 | Critical / Skeptical |
| `supplementary` | 5 | Supplementary |

## `source-family`

20 tradition families. Decision 6: no umbrella groupings — each
family stands alone. See `/v1/enums/source-family/` for the full
list including: `raelian`, `abrahamic`, `second_temple`, `islamic`,
`mormon`, `bahai`, `caodaist`, `oomoto`, `mesopotamian`, `egyptian`,
`iranian`, `vedic`, `buddhist`, `mesoamerican`, `western_esoteric`,
`archaeoastronomy`, `science`, `neo_euhemerism`, `criticism`,
`supplementary`.

## `claim-type`

Epistemological label for the main claim of a page (Decision 11).
Required on every content page.

| Value | Use for |
|---|---|
| `direct` | Claim explicit in a primary source, or scientifically established. |
| `inferred` | Reasonable reading not literally stated. |
| `speculative` | Interpretive synthesis or hypothesis. Honest about reach. |

## `event-type`

Newsroom dispatch event type.

`announcement`, `discovery`, `anniversary`, `cultural-moment`, `obituary`.

## `relation-to-wheel`

How a source relates to the canon.

`foundational`, `comparative_primary`, `revelatory_continuation`,
`scientific_context`, `critical_context`, `supplementary`.

## `stance`

A source's stance towards the canon's reading.

`supportive`, `neutral`, `critical`, `mixed`.

## `licensing-status`

Redistribution status for a Library text (Decision 8).

`public_domain`, `licensed`, `fair_use_excerpt`, `metadata_only`,
`unknown`.

## `translation-status`

Translation completeness per content entry (Decision 12).

`en_only`, `partial`, `complete`.

## `languages`

The 9 supported languages: `en` (default), `de`, `fr`, `es`, `ru`,
`ja`, `zh`, `zh-Hant`, `ko`. (`he` is reserved but currently empty.)

## Stability

Enum values are part of the v1 contract. Adding new values is
backwards-compatible. Renaming or removing values is a breaking
change and would require `/v2/`.
