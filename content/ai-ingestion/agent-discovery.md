+++
title = "Agent discovery and crawler policy"
description = "The machine-facing discovery surface — .well-known endpoints, the API catalog, the MCP server card, the skills index — plus the project's crawler policy and what it deliberately does not implement."
weight = 25
template = "page.html"

[extra]
summary = "Everything an autonomous agent needs to find the project's machine surfaces without being told where they are: an RFC 9727 API catalog, an MCP server card, a skills index, and an explicit auth policy. Plus the crawler rules — the corpus is CC0, so every crawler is allowed, and the file that says so has exactly one control point."
+++

An agent that arrives at `wheelofheaven.world` with no prior knowledge
should be able to discover, without being told: that there is a JSON
API, that there is an MCP server, what that server can do, and whether
any of it requires credentials. This page documents the endpoints that
make that possible, the crawler policy behind them, and the standards
the project has deliberately declined to implement.

If you just want to *use* the surfaces, you want
[API endpoints for AI agents](@/ai-ingestion/api-for-ai.md) and the
[MCP server reference](@/reference/mcp.md) instead. This page is about
how they are *advertised*.

## The discovery surface

All discovery documents are served from `www.wheelofheaven.world`,
because that is where a scanner following `wheelofheaven.world` lands.
The services they describe live on other subdomains.

| Path | What it is | Spec |
|---|---|---|
| [`/robots.txt`](https://www.wheelofheaven.world/robots.txt) | Crawl rules and content signals | [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html) |
| [`/sitemap.xml`](https://www.wheelofheaven.world/sitemap.xml) | Every URL, all 9 languages | [sitemaps.org](https://www.sitemaps.org/) |
| [`/llms.txt`](https://www.wheelofheaven.world/llms.txt) | Navigational manifest for LLMs | [llmstxt.org](https://llmstxt.org/) |
| [`/llms-full.txt`](https://www.wheelofheaven.world/llms-full.txt) | Full corpus, one file | [llmstxt.org](https://llmstxt.org/) |
| [`/.well-known/api-catalog`](https://www.wheelofheaven.world/.well-known/api-catalog) | Both APIs, with their descriptions and docs | [RFC 9727](https://www.rfc-editor.org/rfc/rfc9727.html) |
| [`/.well-known/mcp/server-card.json`](https://www.wheelofheaven.world/.well-known/mcp/server-card.json) | MCP server identity and transports | [MCP server schema](https://modelcontextprotocol.io/) |
| [`/.well-known/agent-skills/index.json`](https://www.wheelofheaven.world/.well-known/agent-skills/index.json) | The nine tools, described | emerging |
| [`/.well-known/auth.md`](https://www.wheelofheaven.world/.well-known/auth.md) | Authentication policy | emerging |

Every HTML response also carries a link header pointing at the catalog,
so an agent that fetches any page at all has a path to the rest:

```http
Link: </.well-known/api-catalog>; rel="api-catalog"
```

### The API catalog

`/.well-known/api-catalog` is an [RFC 9264](https://www.rfc-editor.org/rfc/rfc9264.html)
linkset served as `application/linkset+json`. It lists two APIs:

- **`https://api.wheelofheaven.world/`** — the static JSON API. Its
  `service-desc` links point at the [v1 manifest](https://api.wheelofheaven.world/v1/)
  (every endpoint, grouped by section) and the
  [JSON Schemas](https://api.wheelofheaven.world/v1/schema/).
- **`https://mcp.wheelofheaven.world/mcp`** — the MCP server. Its
  `service-desc` links point at the server card and the skills index.

Both entries carry `service-doc` links into this documentation site,
`service-meta` pointing at the auth policy, and an explicit `license`
link to CC0-1.0.

### The server card and skills index

The two documents answer different questions, and the split is
deliberate:

- **The server card** (`/.well-known/mcp/server-card.json`) says *what
  the server is* — name, version, transports, package identifiers. It
  is a copy of the `server.json` published to the MCP registry under
  the `world.wheelofheaven.mcp/corpus` namespace.
- **The skills index** (`/.well-known/agent-skills/index.json`) says
  *what it can do* — the nine read-only tools, each with a one-line
  description of what it returns and whether it mutates anything
  (nothing does).

The MCP host serves the same card at both
`https://mcp.wheelofheaven.world/.well-known/mcp/server-card.json` and
`.../.well-known/mcp.json`, generated directly from the repository's
`server.json` so the registry entry and the served card cannot drift.

## Crawler policy

**Every crawler is allowed, without exception.** The corpus is
[CC0-1.0](@/ai-ingestion/attribution.md) — public domain — so there is
no rights-based reason to restrict anyone, and the project's
distribution strategy depends on being ingested, retrieved, and cited.
`robots.txt` is a single open group:

```
User-agent: *
Content-Signal: search=yes,ai-input=yes,ai-train=yes
Allow: /
```

The [Content Signals](https://contentsignals.org/) line states the same
policy in the machine-readable form Cloudflare and others read:
indexing for search is fine, use as retrieval input for a generative
answer is fine, and training or fine-tuning on the corpus is fine. A
project that publishes `llms-full.txt` and runs a public MCP server
would be incoherent saying otherwise.

### One control point

Crawler access is controlled in **exactly one place**: the Cloudflare
dashboard, under AI Crawl Control. Cloudflare's managed `robots.txt`
feature *prepends* its own block to the file the repository serves —
so if per-agent rules exist in both places, the deployed file contains
two groups for the same user-agent with opposite rules.

That file has no well-defined meaning. Google merges same-agent groups
and lets the least restrictive rule win; crawlers that take the first
matching group see the opposite. The result is a site whose crawl
policy depends on which crawler is reading it, which is the one
property a crawl policy must not have.

So: **do not add per-agent `Allow:` stanzas to `static/robots.txt`.**
They are redundant against the wildcard group, and they are the exact
thing that collides. If a specific crawler needs to be blocked, block
it in the dashboard. A warning to this effect is in the file itself.

The corollary is that the repository cannot express the open policy on
its own. If the managed block is enabled, its `Disallow` rules are what
crawlers see, whatever `static/robots.txt` says. Fetch the deployed
file — not the repository copy — to know the live policy.

### Markdown negotiation

Requests carrying `Accept: text/markdown` receive the page as Markdown
instead of HTML, converted at the edge by Cloudflare — no build-time
`.md` twins, no extra URLs:

```bash
curl -H 'Accept: text/markdown' https://www.wheelofheaven.world/wiki/elohim/
```

The response comes back as `text/markdown; charset=utf-8` with `Vary:
Accept`, plus `x-markdown-tokens` and `x-original-tokens` headers
reporting the token count saved.

This is a zone setting, not anything in the repository — if the command
above returns `text/html`, the switch is off. It lives in the Cloudflare
dashboard under AI Crawl Control, alongside the managed `robots.txt`
control described above.

For bulk ingestion prefer [`llms-full.txt`](@/ai-ingestion/llms-txt.md)
or the [JSON API](@/ai-ingestion/api-for-ai.md) — negotiation is for
agents fetching a page they already have a URL for.

## What the project does not implement

Cloudflare's Agent Readiness scanner checks sixteen things. The project
implements the ones that describe something real about it and declines
the rest. Not implementing a standard is a position, not a gap:

| Not implemented | Why |
|---|---|
| **OAuth Protected Resource / OAuth Discovery** (RFC 9728, RFC 8414) | There are no protected resources. Publishing authorization-server metadata for a CC0 static site would advertise a login that does not exist. The MCP host returns a clean `404` on these paths precisely so clients fall back to anonymous access instead of attempting a token exchange. |
| **Web Bot Auth** | Signs the requests of bots *you* operate against *other* people's sites. The project runs no crawlers. |
| **A2A Agent Card** | Describes an agent other agents can delegate tasks to. The project publishes a corpus; it does not act on anyone's behalf. |
| **WebMCP** | Exposes tools to an agent running inside the reader's browser. Plausible eventually — an in-page corpus search is a real use case — but it means shipping JavaScript for a draft specification onto a static reading site. Not yet. |
| **DNS-AID** | DNS-level advertisement of AI resources. Cheap, and early enough that the record format is still moving. Revisit when it settles. |
| **All five commerce protocols** (ACP, AP2, MPP, UCP, x402) | Nothing is for sale and nothing is paywalled. These will never apply. |

The realistic ceiling for this project is therefore a full score on
discoverability and content, most of protocol discovery, and zero on
commerce. That is the correct shape for a public-domain knowledge
project, and chasing the remaining checkboxes would mean publishing
documents that describe a site this is not.

### On readiness scores generally

A checklist scores the *presence* of a declaration, not its agreement
with your goals. Before this pass the project scored 4/5 on Cloudflare's
"Quick Wins" while its `robots.txt` blocked eight AI crawlers and
reserved rights under EU DSM Article 4 against a corpus it had already
waived all rights to. The score was green; the policy was backwards.
Read the files, not the score.

## Maintenance

Three of these documents restate information that is authoritative
somewhere else. When you change the source, change the copy:

| If you change… | Also update |
|---|---|
| `mcp.wheelofheaven.world/server.json` (version, transports, package) | `www/static/.well-known/mcp/server-card.json` |
| The MCP tool set (added, removed, or renamed a tool) | `www/static/.well-known/agent-skills/index.json` and [the MCP reference](@/reference/mcp.md) |
| API base URLs or documentation locations | `www/static/.well-known/api-catalog` and `api/templates/index.json` |

The MCP host's own copy of the server card needs no maintenance — it is
imported from `server.json` at build time.

Verify the whole surface after a deploy:

```bash
for p in /robots.txt /llms.txt /.well-known/api-catalog \
         /.well-known/mcp/server-card.json \
         /.well-known/agent-skills/index.json /.well-known/auth.md; do
  printf '%s -> ' "$p"
  curl -s -o /dev/null -w '%{http_code} %{content_type}\n' \
    "https://www.wheelofheaven.world$p"
done
```

All six should return `200`. `/.well-known/api-catalog` should report
`application/linkset+json` and `/.well-known/auth.md` should report
`text/markdown` — both come from `static/_headers`, since neither path
has an extension Cloudflare Pages would recognise on its own.
