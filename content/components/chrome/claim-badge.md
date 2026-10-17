+++
title = "Claim badge"
description = "One readable page classification with a native disclosure explaining direct, framework, inferred, or speculative claims."
template = "page.html"
weight = 20
+++

A page shows its own claim type as one fully written label: **Direct**,
**Framework**, **Inferred**, or **Speculative**.
The label describes the page; it does not offer a choice of classifications.
Opening it reveals the existing editorial definition and a localized link to
The Method.

**Source:**
[SCSS](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_claim-badge.scss)
· [macro](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/claim-badge.html)

## Interaction

The component uses native `details` and `summary` elements.
Click, tap, Enter, or Space toggles the explanation in the document flow.
It works without JavaScript and does not place a tooltip over nearby text.
The summary has a visible focus outline and a minimum 44px height.
Its accessible name includes the localized “Reading this as” label and type.

The previous four-letter stack and its hover/tap state machine were retired
in October 2026.
The `claim_type` frontmatter values and the definitions were preserved.
The homepage retains a static four-row legend, using the same labels and
explanations as individual pages.

## Anatomy

| Element | Purpose |
|---|---|
| `.claim-badges--disclosure` | Native details container for one page classification. |
| `.claim-badges__summary` | Full type label and information icon. |
| `.claim-badge--{type}` | Existing palette association: cyan, mauve, yellow, or lavender. |
| `.claim-badges__explanation` | Definition and Method link, revealed inline. |
| `.claim-badges--legend` | Static, complete key used on the homepage. |

Missing or unknown claim types render no classification; the UI never infers
one from the page topic.
On wiki pages, the classification sits below the title, ahead of the summary.

## Related

- [Macro API](../../macros/claim-badge/)
- [Content conventions](../../../contributing/content/)
- [Live wiki example](https://www.wheelofheaven.world/wiki/elohim/)
