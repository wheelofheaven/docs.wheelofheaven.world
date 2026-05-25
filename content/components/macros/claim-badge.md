+++
title = "claim-badge"
description = "Renders the four-badge claim-type row with the page's claim_type highlighted. Single macro."
template = "page.html"
weight = 20
+++

`macros/claim-badge.html` renders the four-badge claim-type row that
appears next to page titles. The macro is the single entry point for the
[claim badge](../../chrome/claim-badge/) UI — every template that wants
to surface claim type calls this macro.

**Source:**
[`themes/bifrost/templates/macros/claim-badge.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/claim-badge.html)

## Public API

```tera
{%/* import "macros/claim-badge.html" as claim_badge */%}

{{ claim_badge::render(claim_type=page.extra.claim_type | default(value="")) }}
```

## Parameters

| Param         | Type    | Required | Default  | What                                                  |
|---------------|---------|----------|----------|-------------------------------------------------------|
| `claim_type`  | string  | yes      | `""`     | One of `direct` / `framework` / `inferred` / `speculative`. Empty renders the row with no active badge. |
| `legend`      | bool    | no       | `false`  | If `true`, renders the four-row "what each type means" legend used on the landing page (§6) instead of the badge row. |
| `lang`        | string  | no       | `"en"`   | Language code for the tooltip descriptions.            |

## Why one macro for both modes

The badge tooltip body (shown on individual entry pages) and the
landing-page legend share the same descriptions — keeping them in one
macro means the two surfaces can never drift apart. Both source their
text from the same four `trans()` keys
(`claimBadgeDirectDesc`, `…FrameworkDesc`, `…InferredDesc`,
`…SpeculativeDesc`).

## Related

- [Chrome → Claim badge](../../chrome/claim-badge/) — the visual surface and state machine.
