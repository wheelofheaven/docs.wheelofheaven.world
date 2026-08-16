+++
title = "MCP Server"
description = "The Wheel of Heaven MCP server — connect AI agents to the corpus via Model Context Protocol: 9 read-only tools with claim-type labels and an explicit fact/interpretation split."
weight = 25
+++

The Wheel of Heaven MCP server exposes the corpus to AI agents over the
[Model Context Protocol](https://modelcontextprotocol.io/). It is a thin,
read-only wrapper around the [static JSON API](@/reference/api/_index.md):
every tool call fetches `api.wheelofheaven.world/v1/…` and reshapes the
response for agent consumption, with epistemic metadata (claim types,
editorial passes, citation URLs) attached to everything.

| | |
|---|---|
| Endpoint | `https://mcp.wheelofheaven.world/mcp` (Streamable HTTP) |
| Legacy transport | `https://mcp.wheelofheaven.world/sse` (SSE) |
| Auth | None — the corpus is CC0, the server is read-only |
| Source | [github.com/wheelofheaven/mcp.wheelofheaven.world](https://github.com/wheelofheaven/mcp.wheelofheaven.world) |
| License | CC0-1.0, like the corpus itself |

## Quickstart

**Claude Code**

```bash
claude mcp add --transport http wheel-of-heaven https://mcp.wheelofheaven.world/mcp
```

**Claude.ai / Claude Desktop** — add a custom connector with URL
`https://mcp.wheelofheaven.world/mcp` (no authentication).

**Cursor / other Streamable-HTTP clients** — point the client at the same
URL; the server is stateless and requires no headers beyond the MCP
defaults.

**Local stdio (npm)** — for clients that prefer a local process:

```bash
npx -y @wheelofheaven/mcp
```

The server is also listed in the
[official MCP registry](https://registry.modelcontextprotocol.io/v0/servers?search=wheelofheaven)
as `world.wheelofheaven.mcp/corpus`, so registry-aware clients can
discover it without any of the above.

## Design: two layers, declared stance

The tool surface enforces the corpus's editorial split
(see [Editorial method](https://api.wheelofheaven.world/v1/context/method/)):
**fact-layer** tools return source-grounded data with no interpretation
applied; **interpretation-layer** tools return the Wheel of Heaven
framework's own reading and say so in every response. An agent can use the
comparative datasets without ever invoking the interpretation — and when it
does invoke it, the framing is self-declared rather than smuggled.

Every response carries `claim_type` labels
(`direct` / `framework` / `inferred` / `speculative`), the canonical
`www.wheelofheaven.world` URL for citation, and the `/v1/` JSON URL.

## Tools

### Fact layer

| Tool | Returns |
|---|---|
| `search_corpus` | Ranked fuzzy search over wiki, timeline, library books, articles, and news (~290 documents) |
| `get_entry` | One wiki/timeline/articles/news entry as markdown with claim type, editorial pass, typed related-content edges, and citation URLs; `lang` selects any of the 9 site languages |
| `get_passage` | A library chapter as numbered paragraphs with stable reference IDs (e.g. `GEN-1:26`); `ref` filters to one verse |
| `get_source` | Bibliography records by stable ID or search, with authority tier, source family, and stance — critical sources included |
| `compare_traditions` | Rows from the comparative datasets: `flood-myths`, `divine-council-index`, `theomachy-crossrefs`, `world-ages`, `prophets-and-religions` |
| `query_graph` | The typed 1-hop ego network of any corpus node (`see_also`, `in_body`, `cites_source`, `same_tradition`, `same_age`, `comparison_of`) |

### Interpretation layer

| Tool | Returns |
|---|---|
| `get_interpretation` | The framework's reading of a topic — curated context documents for framework topics, the closest wiki reading otherwise; always carries an interpretation-layer notice |
| `get_method` | The editorial methodology: claim-type taxonomy, six-source rule, editorial passes |

### Meta

| Tool | Returns |
|---|---|
| `get_glossary_term` | Core terminology with renderings in all 9 site languages; exact-id match wins |

## Resources

The server also exposes MCP resources for attachable context: the six
curated narrative documents at `woh://context/{overview, hypothesis,
terminology, timeline, sources, method}` and the API's manifest at
`woh://llms.txt`.

## Discovery

An agent that has not been handed the endpoint can find it. The server
card is served from three places — all generated from the repository's
`server.json`, so they cannot drift:

| URL | Notes |
|---|---|
| `https://mcp.wheelofheaven.world/.well-known/mcp/server-card.json` | Canonical |
| `https://mcp.wheelofheaven.world/.well-known/mcp.json` | Same document, alternate convention |
| `https://www.wheelofheaven.world/.well-known/mcp/server-card.json` | Copy on the apex site, where scanners look |

The nine tools are described independently at
[`/.well-known/agent-skills/index.json`](https://www.wheelofheaven.world/.well-known/agent-skills/index.json),
and both documents are referenced from the site's
[API catalog](https://www.wheelofheaven.world/.well-known/api-catalog).
Every other path on the MCP host returns `404` — including
`/.well-known/oauth-*`, deliberately, so that RFC 9728 discovery misses
cleanly and clients fall back to anonymous access rather than attempting
a token exchange against a server that has no auth.

Full detail: [Agent discovery and crawler policy](@/ai-ingestion/agent-discovery.md).

## Architecture notes

- Cloudflare Worker (Durable Object per session, Streamable HTTP), one
  TypeScript codebase; a stdio npm build shares the same tool
  registration.
- Stateless over the upstream API: no data of its own. The ~600 KB search
  corpus is cached in-memory per isolate for one hour, matching the API's
  edge-cache TTL.
- If a tool ever needs data the API lacks, the fix is an additive `/v1/`
  endpoint first, then a thin tool — the API remains the single public
  query surface.
