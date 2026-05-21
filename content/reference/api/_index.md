+++
title = "API Reference"
description = "Tabular reference for api.wheelofheaven.world — endpoint catalogue, response envelope, controlled vocabularies, JSON Schemas, language routing, and changelog."
weight = 20
sort_by = "weight"
+++

Reference docs for the `api.wheelofheaven.world` JSON API. For the
narrative / rationale — what the API is, who it's for, how it's built
— see [architecture/sites/api](@/architecture/sites/api.md).

## In this section

| Page | What |
|---|---|
| [Endpoints](@/reference/api/endpoints.md) | Every URL, its method, what it returns, sample response |
| [Envelope](@/reference/api/envelope.md) | The `{ apiVersion, kind, metadata, data, links }` shape |
| [Enums](@/reference/api/enums.md) | Controlled vocabularies returned by `/v1/enums/` |
| [Schemas](@/reference/api/schemas.md) | JSON Schemas returned by `/v1/schema/` |
| [Multilingual](@/reference/api/multilingual.md) | Language routing — `/v1/{lang}/...` |
| [Changelog](@/reference/api/changelog.md) | Versioning policy and v1 evolution history |
