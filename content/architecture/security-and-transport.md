+++
title = "Security and Transport"
description = "Security headers per host, the zone-wide HSTS policy and its ramp, security.txt and the vulnerability-reporting channel, and why preload is deliberately deferred."
weight = 25
+++

What the six hosts assert about transport security, where each header is
configured, and which decisions were made deliberately rather than by
default.

The short version: **transport policy is set once at the Cloudflare zone;
per-page headers are set per repository.** Mixing those up is how the
project ended up, for months, with HSTS on exactly one host out of six.

## What each host sends

As of 2026-08-23, verified on the wire rather than from configuration:

| Header | www | apex | api | docs | assets | mcp |
|---|---|---|---|---|---|---|
| `Strict-Transport-Security` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `X-Content-Type-Options` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `Referrer-Policy` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `Content-Security-Policy` | ✅ | — | — | ✅ | — | — |
| `X-Frame-Options` | ✅ | — | — | ✅ | — | — |
| `Permissions-Policy` | ✅ | — | — | ✅ | — | — |
| `Link: rel="api-catalog"` | ✅ | — | ✅ | ✅ | — | — |

CSP and frame protection are on the two hosts that serve HTML. `api` and
`assets` serve JSON and media, where a CSP buys little; they carry
`nosniff`, which is the header that actually matters for them.

## HSTS is zone-wide, not per-repo

HSTS is configured in **Cloudflare → SSL/TLS → Edge Certificates → HSTS**,
which applies it to every hostname in the zone including the apex redirect.
Current policy:

```
Strict-Transport-Security: max-age=2592000; includeSubDomains
```

| Setting | Value | Why |
|---|---|---|
| Enable | On | |
| Max Age | 1 month (`2592000`) | first rung of a ramp — see below |
| Apply to subdomains | On | this is what covers api/docs/assets/mcp |
| **Preload** | **Off** | a separate decision, deliberately deferred |
| No-Sniff | On | gave `nosniff` to apex, assets and mcp, which had none |

### The edge value replaces an origin one

This is the part worth remembering. When the zone setting is on and a
repository *also* sets `Strict-Transport-Security` in its `_headers`, the
edge value wins and the origin value is silently discarded — the two are
not concatenated and the browser sees one header.

That was live for a while: `www/static/_headers` said
`max-age=31536000` while the wire said `2592000`. A second source of truth
that always loses is worse than none, so the per-repo line was removed.
**Do not re-add HSTS to any repository's `_headers`.**

### The ramp

Max Age is deliberately at the first rung. The plan:

1. **1 month** — current. If something is broken by HSTS, it drains in a
   month rather than a year.
2. **12 months** — after a few weeks without incident. This is the end
   state.

Rolling back at any point means setting Max Age to **Disable**; browsers
that already cached the policy keep enforcing until their copy expires,
which is the entire reason for starting short.

One practical note: the dashboard's Max Age dropdown offers **Disable, or
1 to 12 months** — there is no 5-minute rung. A genuinely short first step
would need an API `PATCH` of the `security_header` zone setting with an
arbitrary `max_age` in seconds. That was judged unnecessary here because
all five subdomains already served valid TLS, so there was nothing a
shorter rung could have protected against.

### Universal SSL covers one label deep

`includeSubDomains` asserts the policy over **every** depth of subdomain.
Universal SSL certifies the apex and **one** label (`*.wheelofheaven.world`),
and Advanced Certificate Manager is not active.

Today that gap is theoretical — all six hosts are one label deep. But a
future host like `staging.api.wheelofheaven.world` would be forbidden from
plain HTTP by HSTS while having no certificate available to serve HTTPS,
making it unreachable. **Sort the certificate before standing up any
two-level subdomain.**

### Why preload is deferred

Preload closes one specific window: the *first ever* visit from a browser
that has never seen the site, on a hostile network. After a single HTTPS
visit, ordinary HSTS already covers a visitor.

Against that: this site has no logins, no sessions, no user data and no
payments, and the corpus is public domain — so the harm preload prevents is
content tampering for a first-time visitor, not credential theft. Removal
from the preload list takes a browser release cycle, and it binds every
future subdomain.

The judgement was that the smallest increment on the list is not worth the
least reversible commitment on the list. Revisiting it would require the
apex to serve HSTS in its redirect chain — the 301 currently carries none —
plus submission at [hstspreload.org](https://hstspreload.org/).

The `preload` token was previously present in www's header *without* the
domain being on the list, which advertised something untrue. If preload is
ever adopted, add the token as part of submitting, not before.

## Vulnerability reporting

[`/.well-known/security.txt`](https://www.wheelofheaven.world/.well-known/security.txt)
([RFC 9116](https://www.rfc-editor.org/rfc/rfc9116.html)) points at the
org-wide [`SECURITY.md`](https://github.com/wheelofheaven/.github/blob/main/SECURITY.md),
which routes reporters to GitHub private vulnerability reporting. No email
address is published, and every repository in the organisation inherits the
policy and gets a "Report a vulnerability" button.

### The expiry is generated, not typed

RFC 9116 makes `Expires` mandatory, and a stale `security.txt` is worse
than none — it advertises a channel that may no longer be watched. So:

- `www/scripts/build_security_txt.py` writes the file with `Expires` one
  year out.
- `.github/workflows/security-txt.yml` runs it **monthly** and commits any
  change with `[skip ci]`.

Monthly rather than annually because a yearly job that fails once would go
unnoticed until the file had already lapsed; monthly gives eleven chances
to notice, and the commit is a no-op when nothing moved.

It is deliberately **not** wired into `mise run build`. Cloudflare Pages
builds this repository with a command configured in the dashboard that is
not readable from the tree, so a local build step might never run in
production. Committing the file sidesteps the question — Pages ships what
is in the tree, whatever its build command happens to be. See
[CI and deploy](@/contributing/dev/ci-deploy.md) for the two related ways a
`_headers` change can silently do nothing.

### Scope, honestly

The policy states scope rather than implying everything is in it. The
surfaces that matter, in order: the published
`@wheelofheaven/mcp` npm package, because it runs on other people's
machines; the MCP Worker; client-side JS on www and docs; and subdomain
takeover. Missing hardening headers with no demonstrated impact are
explicitly **out** of scope — as is the absence of authentication, which is
[by design](https://www.wheelofheaven.world/.well-known/auth.md).

## Verifying

Configuration and reality drift. Check the wire:

```bash
for h in wheelofheaven.world www api docs assets mcp; do
  host="${h}.wheelofheaven.world"; [ "$h" = "wheelofheaven.world" ] && host="$h"
  echo "-- $host"
  curl -sI "https://$host/" | grep -iE \
    '^(strict-transport-security|content-security-policy|x-frame-options|x-content-type-options|referrer-policy|permissions-policy|link):'
done
```

A `_headers` change that deploys cleanly and does nothing looks identical
to one that worked, so re-run this after any change to headers — in either
a repository or the Cloudflare dashboard.
