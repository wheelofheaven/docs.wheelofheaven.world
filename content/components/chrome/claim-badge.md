+++
title = "Claim badge"
description = "The four-label legend (direct, framework, inferred, speculative). The page-level pill is retired: labels now sit on individual assertions."
template = "page.html"
weight = 20
+++

> **Retired as a page header, 2026-11-07.** A page argues many things at
> once, so one label per page mislabelled most of them. Labels now attach to
> individual assertions — see [Inline claim markers](../../shortcodes/claim/).
> The page-level `claim_type` stays in frontmatter as metadata (the
> `ai.claim_type` meta tag, WebMCP, the graph, the datasets).

What remains of this component is the complete **legend** — the four labels
**Direct**, **Framework**, **Inferred** and **Speculative** with their
definitions — used on the home page and the Method page
(`claim_badge::render(legend=true)`). The disclosure form described below
is no longer called by any template.

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

## Related

- [Inline claim markers](../../shortcodes/claim/) — the replacement
- [Macro API](../../macros/claim-badge/)
- [Content conventions](../../../contributing/content/)
- [Live wiki example](https://www.wheelofheaven.world/wiki/elohim/)
