+++
title = "Frontmatter Reference"
description = "Every TOML field that may appear in content frontmatter, what it means, and where it's used."
weight = 10
+++

> Placeholder — full content lands in Phase 4.

## Top-level fields

| Field | Type | Notes |
|---|---|---|
| `title` | string | Required. Under 60 chars for SEO. |
| `description` | string | 150–160 chars for SEO. |
| `template` | string | Specifies which Tera template to use. |
| `weight` | int | Sort order within section when `sort_by = "weight"`. |
| `date` | date | Publication date. |
| `updated` | date | Last revised date. |

## `[extra]` fields

| Field | Type | Notes |
|---|---|---|
| `claim_type` | `"direct"` \| `"inferred"` \| `"speculative"` | Required on new entries. |
| `editorial_pass` | string (YYYY-MM) | The editorial pass that last rewrote this entry. |
| `summary` | string | Plain-language TL;DR for AI extraction. |
