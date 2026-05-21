+++
title = "Schemas"
description = "JSON Schemas returned by /v1/schema/ — one per resource kind."
weight = 40
+++

`/v1/schema/{kind}/` returns the JSON Schema draft 2020-12 document
that validates the `data` field of a response whose `kind` matches.

The index of available kinds is at `/v1/schema/`.

| Kind | URL | Description |
|---|---|---|
| `wiki-entry` | `/v1/schema/wiki-entry/` | An encyclopedia entry. |
| `timeline-entry` | `/v1/schema/timeline-entry/` | A precessional age or framing page. |
| `article` | `/v1/schema/article/` | A long-form essay. |
| `dispatch` | `/v1/schema/dispatch/` | A Newsroom dispatch (current event read through the canon). |
| `book` | `/v1/schema/book/` | A library book. |
| `source` | `/v1/schema/source/` | A bibliography source record. |
| `tradition-hub` | `/v1/schema/tradition-hub/` | A landing page for a source-family tradition (Hebrew, Mesopotamian, etc.). |
| `concept-hub` | `/v1/schema/concept-hub/` | A deeper-than-wiki treatment of a central concept. |
| `glossary-term` | `/v1/schema/glossary-term/` | A multilingual glossary term. |
| `translation` | `/v1/schema/translation/` | A Wheel of Heaven Translation with provenance. |
| `library` | `/v1/schema/library/` | Library-level summary. |

## Using the schemas

The schemas are usable directly with any JSON Schema validator
implementing draft 2020-12. Quick check with `ajv-cli`:

```bash
curl https://api.wheelofheaven.world/v1/schema/wiki-entry/ \
  | jq '.data' > wiki-entry.schema.json

curl https://api.wheelofheaven.world/v1/wiki/elohim/ \
  | jq '.data' > elohim.json

ajv validate -s wiki-entry.schema.json -d elohim.json
```

## Stability

Schemas can grow new optional fields without notice (additive).
Required fields are part of the v1 contract — removing a required
field or renaming any field is a breaking change.

## Why expose schemas

Three reasons:

1. **Validate before consuming.** A client integrating the API can
   validate responses against the schema rather than hoping the
   payload shape matches its assumptions.
2. **Generate types.** Tools like `quicktype` can ingest the schema
   to produce typed clients in any language.
3. **Document by example.** The schema descriptions are the
   canonical English-language description of what each field means.
