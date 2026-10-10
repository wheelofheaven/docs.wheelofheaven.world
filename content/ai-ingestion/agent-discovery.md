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

`robots.txt` is the one exception, and it has to be: under
[RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html) it is read
per-host, so a crawler fetching an image from `assets` reads *that*
host's file and never sees this one. It is therefore restated on every
host rather than centralised here — see
[Crawler policy](#crawler-policy) below.

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
| `_index._agents` / `_mcp._agents` (DNS) | [DNS-AID](#dns-aid-published-in-the-zone) SVCB records pointing at the site and the MCP server, DNSSEC-signed | [IETF draft](https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/) |
| every HTML page | [WebMCP](#webmcp-implemented-in-the-theme) tool registration — 8 page-level tools plus the 9 MCP server tools, in-browser | [W3C CG draft](https://webmachinelearning.github.io/webmcp/) |
| [`/auth.md`](https://www.wheelofheaven.world/auth.md) | The same document — scanners disagree on which path to probe, so both answer. A `200` rewrite in `_redirects`, not a second copy. | emerging |

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

### Every host states it

Because `robots.txt` is read per-host, a policy stated only on `www` is
a policy three quarters of the project never makes. Each host serves its
own copy of the group above, from its own source:

| Host | Served from |
|---|---|
| `www` | `static/robots.txt` in the www repo |
| `wheelofheaven.world` | redirects to `www` |
| `api` | `static/robots.txt` in the api repo |
| `docs` | `static/robots.txt` — overrides the one Zola generates, which was silent on Content Signals |
| `assets` | `robots.txt` at the repo root, served by Cloudflare Pages |
| `mcp` | a route in `src/worker.ts`, ahead of the catch-all 404 |

Only `www` and `api` carry a `Sitemap:` line, because only they have
one. `assets` serves media referenced by the other sites rather than a
browsable set of URLs of its own.

A missing file is not a neutral default here. Under RFC 9309 a `404`
means "no restrictions", so nothing was ever being *blocked* on the
hosts that lacked one — but nothing was being *declared* either, and
the declaration is the half this project cares about. Cloudflare's
robots.txt monitor is the place this shows up: it reports Content
Signals as "Declared" or "Not set" per hostname.

### Where crawler access is actually controlled

Crawler policy lives in the Cloudflare dashboard, not the repository —
but it is spread across **three independent controls**, and only one of
them generates the `robots.txt` file. Turning off the wrong one changes
nothing about what crawlers read, which is exactly the trap this section
exists to document:

| Control | Where | What it does |
|---|---|---|
| **Managed robots.txt** | AI Crawl Control → Robots.txt tab | **Generates the file.** This is the one that injects the `Disallow` block and the `ai-train=no` content signal. |
| Configure AI bot policies | Security → Settings → Bot traffic | Search / Agent / Training categories. Replaces the legacy toggle from 2026-09-15. All three should be **Allow**. |
| Block AI bots *(legacy)* | Security → Settings → Bot traffic | WAF-level enforcement, deprecating 2026-09-15. Blocks at the edge rather than by request. |

To check which is active without the dashboard, read
`is_robots_txt_managed` and `fight_mode` from the zone's
`/bot_management` API — the dashboard cards show available configuration
rather than live state, and can mislead.

Cloudflare's managed `robots.txt` feature *prepends* its own block to
the file the repository serves — so if per-agent rules exist in both
places, the deployed file contains two groups for the same user-agent
with opposite rules.

That file has no well-defined meaning. Google merges same-agent groups
and lets the least restrictive rule win; crawlers that take the first
matching group see the opposite. The result is a site whose crawl
policy depends on which crawler is reading it, which is the one
property a crawl policy must not have.

So: **do not add per-agent `Allow:` stanzas to `static/robots.txt`.**
They are redundant against the wildcard group, and they are the exact
thing that collides. If a specific crawler needs to be blocked, block
it in the dashboard — in the AI bot policies panel, not by editing the
repository file. A warning to this effect is in the file itself.

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

## Scorecard

Measured with the open scanner at
[isitagentready.com](https://isitagentready.com/) on 2026-10-10. The
Cloudflare Agent Readiness panel runs the same checks grouped
differently; it re-scans only on request from the dashboard.

| Check | Result | Why |
|---|---|---|
| `robots.txt`, sitemap, `Link: rel="api-catalog"` | pass | |
| Content Signals, AI crawler rules | pass | One open group; the policy is "everyone may" |
| API catalog, MCP server card, skills index | pass | |
| WebMCP | pass | 17 tools, since 2026-09-19 |
| DNS-AID | pass | 4 SVCB records + DNSSEC, since 2026-10-10 |
| Markdown negotiation | fail, by design | Pro-plan feature; the JSON twin already removes the page chrome |
| OAuth discovery, OAuth protected resource | fail, by design | No protected resources |
| `auth.md` | fail, by design | Describes registration; the next gate wants OAuth metadata |
| A2A agent card | fail, by design | The project does not act on anyone's behalf |
| ARD capability manifest | not yet | v0.9 draft; the only open item |
| Commerce (5) | neutral | Nothing for sale |

Overall level: **2, "Bot-Aware"**. Level 3 requires OAuth or A2A, which
this project will not publish, so 2 is the ceiling and the correct
result.

To re-run:

```bash
curl -s -X POST https://isitagentready.com/api/scan \
  -H 'Content-Type: application/json' -d '{"url":"https://wheelofheaven.world"}' \
  | python3 -c 'import json,sys; c=json.load(sys.stdin)["checks"]; \
    [print(g, k, v["status"]) for g in c for k,v in c[g].items() if isinstance(v,dict) and "status" in v]'
```

## What the project does not implement

Cloudflare's Agent Readiness scanner checks sixteen things. The project
implements the ones that describe something real about it and declines
the rest. Not implementing a standard is a position, not a gap:

| Not implemented | Why |
|---|---|
| **OAuth Protected Resource / OAuth Discovery** (RFC 9728, RFC 8414) | There are no protected resources. Publishing authorization-server metadata for a CC0 static site would advertise a login that does not exist. The MCP host returns a clean `404` on these paths precisely so clients fall back to anonymous access instead of attempting a token exchange. This also caps the scanners' `auth.md` check: since 2026-09-19 `auth.md` states the registration position in the protocol's own terms (audience, endpoints, methods, credentials — all *none*) and passes that gate, but the check's next gate wants RFC 9728 metadata, so it reports "fail" by design. |
| **Web Bot Auth** | Signs the requests of bots *you* operate against *other* people's sites. The project runs no crawlers. |
| **A2A Agent Card** | Describes an agent other agents can delegate tasks to. The project publishes a corpus; it does not act on anyone's behalf. |
| **All five commerce protocols** (ACP, AP2, MPP, UCP, x402) | Nothing is for sale and nothing is paywalled. These will never apply. |

The realistic ceiling for this project is therefore a full score on
discoverability and content, most of protocol discovery, and zero on
commerce. That is the correct shape for a public-domain knowledge
project, and chasing the remaining checkboxes would mean publishing
documents that describe a site this is not.

### DNS-AID — published in the zone

[DNS for AI Discovery](https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/)
is an IETF draft that advertises agent endpoints through ordinary SVCB
records (RFC 9460) under a reserved `_agents` label, so an agent can find
the MCP server with one DNS query and no HTTP round trip. This page
previously deferred it because the record format was still moving; it
has settled on `_<service>._agents.<domain>` ServiceMode records, and the
scanners query `_index._agents.<host>` over DNS-over-HTTPS. Published
2026-10-10:

```
_index._agents.wheelofheaven.world.      SVCB 1 www.wheelofheaven.world. alpn="h2"     port=443 mandatory=alpn,port
_index._agents.www.wheelofheaven.world.  SVCB 1 www.wheelofheaven.world. alpn="h2"     port=443 mandatory=alpn,port
_mcp._agents.wheelofheaven.world.        SVCB 1 mcp.wheelofheaven.world. alpn="mcp,h2" port=443 mandatory=alpn,port
_mcp._agents.www.wheelofheaven.world.    SVCB 1 mcp.wheelofheaven.world. alpn="mcp,h2" port=443 mandatory=alpn,port
```

The `www` twins exist because the scanners follow the apex redirect and
query the host they land on. `mcp` in the ALPN list is the draft's way of
carrying the agent protocol; the `_mcp` label says the same thing for
clients that read labels instead. The draft's richer parameters
(`well-known`, `cap`, `cap-sha256`) have no IANA numbers yet, so they
are deliberately not published — they could only appear as opaque
`keyNNNNN` values nobody interoperates on.

**DNSSEC is on** (Cloudflare-signed, algorithm 13, DS at the registrar),
because an unsigned discovery answer is only a hint: the draft and the
scanners both expect the `AD` bit. The zone had never been signed before
this; signing it was the larger part of the work.

Verify the way the scanner does, with the DNSSEC flag set:

```sh
curl -s -H 'accept: application/dns-json' \
  'https://cloudflare-dns.com/dns-query?name=_index._agents.wheelofheaven.world&type=SVCB&do=1'
# expect Status 0, "AD": true, and one SVCB answer
dig +short DS wheelofheaven.world      # the chain of trust at .world
```

If the MCP host or the reading site ever moves, the four targets above
move with it — there is no build step that regenerates them.

### WebMCP — implemented in the theme

[WebMCP](https://webmachinelearning.github.io/webmcp/) is a browser API
that lets a page hand an agent a list of callable tools with typed
parameters, instead of the agent screenshotting the page and guessing
where to click. It is the in-browser counterpart to the
[MCP server](@/reference/mcp.md): tools run in the page's own JS
context, with whatever the reader already has open.

The site registers its tools itself, from the bifrost theme, rather than
through Cloudflare's edge-injected bridge. Two reasons. The CSP is
`script-src 'self'`, so a bridge served from a Cloudflare path would be
blocked unless the policy were loosened on a guess. And the page-level
tools — search in the reader's language, the current page's metadata and
text, citations, navigation — are things an edge proxy of the server
cannot provide.

**How it loads.** `webmcp-loader.js`, a few lines inside
`core.bundle.js`, checks for `document.modelContext` (the spec's entry
point) or `navigator.modelContext` (the older name, which polyfills and
readiness scanners shim into browsers that have no native API). Only
when one exists does it inject `webmcp.bundle.js`, which registers the
tools. Ordinary visitors download the stub alone.

**Seventeen tools are registered, in two families:**

| Family | Tools | Notes |
|---|---|---|
| Page-level (8) | `search_site`, `get_current_page`, `get_page_text`, `fetch_entry`, `list_sections`, `cite_current_page`, `open_page`, `switch_language` | `search_site` reuses the site's own Fuse index and filters to the reader's language; `fetch_entry` reads the page's [JSON API twin](@/architecture/sites/api.md); `cite_current_page` returns what the Cite widget renders. |
| MCP server (9) | `search_corpus`, `get_entry`, `get_passage`, `get_source`, `compare_traditions`, `query_graph`, `get_interpretation`, `get_method`, `get_glossary_term` | Same names and schemas as the server's `tools/list`; `execute` is a Streamable HTTP call to `mcp.wheelofheaven.world`. The session is opened lazily on the first call, so registering costs no network. |

Every tool carries `readOnlyHint: true` except `open_page` and
`switch_language`, which navigate. All registrations share one
`AbortController`; `window.wohWebMCP.dispose()` unregisters everything,
and `window.wohWebMCP.ready` resolves to the list of names that
registered.

**Keep Cloudflare's "Site MCP server" tool pack off.** It would register
the same nine names a second time, and the spec rejects a duplicate
registration — whichever loads second fails. The C2PA pack stays off for
the reason given before: project images carry no provenance manifests.

**The maturity caveat still stands.** WebMCP is a W3C Community Group
Draft Report, shipping in Chrome's early preview only, and the entry
point has already moved once (`navigator` → `document`, with Chromium 150
deprecating the old name). The theme honours both, `document` first.
If the API moves again, `webmcp.js` is the one file to touch.

**Verify.** Cloudflare's Agent Readiness diagnostics and
[isitagentready.com](https://isitagentready.com/) both load the page in
a browser with a shimmed model context and record the registrations:

```
POST https://isitagentready.com/api/scan
{"url": "https://wheelofheaven.world"}
→ checks.discovery.webMcp.status == "pass"
```

By hand, in Chrome Canary with WebMCP enabled, the *WebMCP DevTools*
extension lists the registered tools on any page and can execute them.

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
| The MCP tool set (added, removed, or renamed a tool) | `www/static/.well-known/agent-skills/index.json`, [the MCP reference](@/reference/mcp.md), and `SERVER_TOOLS` in bifrost `static/js/webmcp.js` (then bump `?v=N` in `webmcp-loader.js` and re-bundle) |
| API base URLs or documentation locations | `www/static/.well-known/api-catalog` and `api/templates/index.json` |
| The MCP host or the `www` host (new hostname) | The four `_agents` SVCB targets in Cloudflare DNS — see [DNS-AID](#dns-aid-published-in-the-zone) |

The MCP host's own copy of the server card needs no maintenance — it is
imported from `server.json` at build time.

Verify the whole surface after a deploy:

```bash
for p in /robots.txt /llms.txt /.well-known/api-catalog \
         /.well-known/mcp/server-card.json \
         /.well-known/agent-skills/index.json /.well-known/auth.md \
         /auth.md; do
  printf '%s -> ' "$p"
  curl -s -o /dev/null -w '%{http_code} %{content_type}\n' \
    "https://www.wheelofheaven.world$p"
done
```

**Keep the `# Auth.md` heading.** Cloudflare's scanner checks the H1, not
just the file — it reports "auth.md exists but is missing the expected
Auth.md heading" if the document is titled anything else. Retitling that
line to something more natural silently un-ticks the check.

Then the two surfaces that are not files:

```bash
# DNS-AID: the scanner's own method — DNS-over-HTTPS with the DNSSEC flag
for n in _index._agents _mcp._agents; do
  curl -s -H 'accept: application/dns-json' \
    "https://cloudflare-dns.com/dns-query?name=$n.wheelofheaven.world&type=SVCB&do=1" \
    | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d["Status"], d["AD"], [a["data"] for a in d.get("Answer",[]) if a["type"]==64])'
done
# expect: 0 True ['1 www.wheelofheaven.world. …'] and 0 True ['… mcp.wheelofheaven.world. …']

# WebMCP: the bundle the loader fetches, and the loader inside core
curl -s -o /dev/null -w '%{http_code}\n' 'https://www.wheelofheaven.world/js/dist/webmcp.bundle.js?v=1'
```

All seven should return `200`. `/.well-known/api-catalog` should report
`application/linkset+json`, and both `auth.md` paths should report
`text/markdown` — these come from `static/_headers`, since neither path
has an extension Cloudflare Pages would recognise on its own. `_headers`
rules match the **request** path, so the root alias needs its own rule
even though it is served by a rewrite rather than a second file.
