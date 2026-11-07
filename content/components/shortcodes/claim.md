+++
title = "claim"
description = "Inline claim marker: puts the epistemic label (direct, framework, inferred, speculative) on one assertion, with a tap-to-open note and an optional link to the core record."
template = "page.html"
weight = 15
+++

The `claim` shortcode labels **one assertion**, not a page. It replaced the
page-header claim pill on 2026-11-07: a page argues many things at once —
a philological fact, a canon premise, a reading, a synthesis — so one
label per page mislabelled most of them.

**Source:**
[`templates/shortcodes/claim.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/shortcodes/claim.html)
· [`static/js/claim-notes.js`](https://github.com/wheelofheaven/bifrost/blob/main/static/js/claim-notes.js)
· [`sass/components/_claim-inline.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_claim-inline.scss)

## Usage

```markdown
The Hebrew word is {%/* claim(type="direct") */%}plural in form{%/* end */%},
and {%/* claim(type="framework", id="woh-claim-0001") */%}the Elohim created
life on Earth{%/* end */%}.
```

| Argument | Required | |
|---|---|---|
| `type` | yes | `direct`, `framework`, `inferred` or `speculative` |
| `id` | no | a core claim record (`woh-claim-0001`). Prefer it whenever a record controls the label — the record's `public_label` is the authority, the shortcode its projection. |

The body is the assertion; inline markdown is allowed.

## What the reader sees

The sentence keeps the body colour and gains a hairline underline in the
label's hue, ending in a small dot. Tapping the dot (a 44px hit area)
opens **one shared note** — on phones docked above the bottom edge, clear
of the FAB rail; on wider screens under the marker — with the label, its
definition, a link to The Method, and the core record when `id` is set.
Escape, an outside tap or (on desktop) scrolling closes it. Without
JavaScript the label is still announced (visually hidden text) and the dot
carries a `title`.

Only the open note carries a blur, and there is one note element per page
— never one per marker (see the
[glass invariants](../../../contributing/dev/bifrost-theme/#glassmorphism-invariants)).

## Editorial rule

Labelling assertions is an editorial pass: mark the load-bearing claims of
a page, not every sentence. See `.claude/rules/content.md` → *Claim Type*.
The page-level `claim_type` in `[extra]` stays as metadata (the
`ai.claim_type` meta tag, WebMCP, the graph, datasets) but is no longer
rendered.

## Related

- [Claim badge legend](../../chrome/claim-badge/)
- [Research core](../../../architecture/research-core/)
