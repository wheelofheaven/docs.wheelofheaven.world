+++
title = "claim-badge"
description = "Renders one page classification with an expandable explanation, or the complete static claim-type legend."
template = "page.html"
weight = 20
+++

`macros/claim-badge.html` renders one page classification with an expandable
explanation beside the page title. The macro is the single entry point for the
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
| `claim_type`  | string  | yes      | `""`     | One of `direct` / `framework` / `inferred` / `speculative`. Empty or unknown values render nothing. |
| `legend`      | bool    | no       | `false`  | If `true`, renders the four-row "what each type means" legend used on the landing page (§6) instead of the page disclosure. |
| `lang`        | string  | no       | `"en"`   | Language code for labels, explanations, and Method links.            |

## Why one macro for both modes

The badge explanation (shown on individual entry pages) and the
landing-page legend share the same descriptions — keeping them in one
macro means the two surfaces can never drift apart. Both source their
text from the same four `trans()` keys
(`claimBadgeDirectDesc`, `…FrameworkDesc`, `…InferredDesc`,
`…SpeculativeDesc`).

## Related

- [Chrome → Claim badge](../../chrome/claim-badge/) — the visual surface and native disclosure behavior.
