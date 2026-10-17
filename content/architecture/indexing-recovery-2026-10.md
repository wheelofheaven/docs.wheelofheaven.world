+++
title = "October 2026 Indexing Recovery"
description = "The October 17 indexing investigation: evidence, deployed fixes, verification, and the work still required to assess recovery."
template = "page.html"
weight = 41
+++

On **2026-10-17**, we investigated a reported fall from hundreds of indexed pages to two on `wheelofheaven.world`.
The technical cleanup was deployed and verified that day; **recovery in Google's index was not established**.
This is a dated incident record, not a live status dashboard.
The continuing implementation contract is in [Indexing & Multilingual SEO](@/architecture/indexing.md).

## Evidence at the time

Search Console's report was dated **2026-10-12**, five days before the investigation.
The domain property showed two indexed URLs: the homepage and `/timeline/preamble/`.
The earlier count of hundreds was the reported symptom, not a history reconstructed during this investigation.

| Report scope | Indexed | Excluded breakdown |
|---|---:|---|
| All submitted URLs | 2 | 251 crawled, currently not indexed; 105 discovered, currently not indexed; 5 not found |
| All known URLs | 2 | 1,583 crawled, currently not indexed; 105 discovered, currently not indexed; 904 noindex; 414 not found; 37 redirects |

The submitted report totaled 363 URLs, while the live sitemap contained 364.
These were observations from different update times, not a requirement that the counts match exactly.
Search Console listed the sitemap as successfully processed, last read on October 16.

The following checks narrowed the investigation:

- `/wiki/elohim/` had a successful Googlebot smartphone fetch on October 12, crawling and indexing allowed, and agreement between the declared and Google-selected canonical.
  Its live inspection on October 17 also passed and rendered the article content, but the recorded indexing status remained **Crawled — currently not indexed**.
- No manual actions or security issues were reported.
  The Removals report showed no requests in the preceding six months.
- Search Console recognized the `.io` → `.world` change of address.
  Checks of the old apex, old `www` host and new apex for `/wiki/elohim/` returned permanent redirects to the canonical `https://www.wheelofheaven.world/wiki/elohim/`.
  This was a sample migration check, not a complete audit of every historic path.
- The nine translated editions were intentionally noindexed under the July policy.
  Their exclusion was not treated as an accidental outage, and the policy was preserved.

These findings did not establish why Google selected so few English pages.
They also did not establish that translation volume, poor content quality, the domain move, or the sitemap errors caused the collapse.

## What changed

The initial live audit fetched all 364 sitemap destinations.
It found three 404s and one HTML redirect; the other 360 returned HTTP 200 with matching canonical URLs and no indexing prohibition detected by the audit.

| Finding | Correction | Intended result |
|---|---|---|
| `/authors/`, `/tags/`, `/topics/` returned 404 but appeared in the sitemap | Removed unused Zola taxonomy declarations from `config.toml` | Stop submitting pages that are not rendered; retain honest 404 responses until meaningful pages exist |
| `/news/page/1/` returned an HTML redirect with HTTP 200 | Excluded first-pagination redirect URLs from the sitemap; added an HTTP 301 to `/news/` | Submit the canonical section URL and redirect at the HTTP layer |
| `/offline/` was submitted as a normal page | Set `extra.noindex = true` on offline fallbacks in all ten languages | Keep the browser fallback available without advertising it as search content |
| Sitemap template read the nonexistent `SitemapEntry.date` field | Changed it to `SitemapEntry.updated` | Emit recorded dates where available; do not fabricate dates from build time |
| Long wiki introductions doubled as search descriptions | Added `extra.seo_description` and theme support for ten English entries | Provide concise, attributed search and social summaries while retaining the visible introductions and structured-data descriptions |
| No repeatable audit covered every submitted destination | Added `scripts/audit_sitemap.py` and `mise run audit-sitemap` | Make the same checks reproducible after future changes |

The ten entries were **Elohim, Precession, Yahweh, Raël, Genesis, Eden, Apocalypse, Hebrew Bible, Lucifer, and Raëlism**.
The changes were metadata improvements, not a substantive scholarly review of those articles or evidence that their indexing would improve.

### Release references

| Repository | Commit | Scope |
|---|---|---|
| Main website | [087c7c50e78](https://github.com/wheelofheaven/www.wheelofheaven.world/commit/087c7c50e78) | Configuration, redirect, audit script/task and submodule pins |
| Bifrost | [259e9ce](https://github.com/wheelofheaven/bifrost/commit/259e9ce8960236497a15d7f65284268b594ae2a5) | Sitemap filtering/date field and description override |
| data-content | [73acb22](https://github.com/wheelofheaven/data-content/commit/73acb22d2882d7c7a25e88be8684660735fb7a08) | Ten wiki descriptions and ten offline-page exclusions |
| Documentation | [888515d](https://github.com/wheelofheaven/docs.wheelofheaven.world/commit/888515d5c374a27d5b8bb5da8fbada33f17e111a) | Indexing policy, audit commands and metadata behavior |

Cloudflare Pages project `www-wheelofheaven-world` published deployment `2281f963-56e9-465f-b9be-db8687355c0e` at approximately **09:36 UTC on October 17**.
Its build log used Zola **0.19.2**; the local website build used **0.21.0**.
The mismatch was observed, not corrected in this work.
When reproducing a build issue, inspect the actual Pages build command instead of assuming it matches `mise.toml` or the docs site's separate version pin.

## What was verified

- The full local website build and the docs build passed.
  The generated sitemap contained **359 URLs**, all passing the local audit.
- The post-deployment HTTP audit finished at **09:39:40 UTC**: **359 URLs, zero duplicate sitemap URLs, zero reported issues**.
  All ten revised descriptions were present in production.
- `/news/page/1/` returned HTTP 301 to `/news/`.
  `/offline/` emitted `noindex, nofollow`.
- Google displayed **Sitemap submitted successfully** after the corrected live sitemap was resubmitted.
  This confirms submission, not that Google had reprocessed every URL or indexed the pages.
- A separate indexing request for `/wiki/elohim/` was attempted, but no success confirmation was obtained.
  Record it as **unconfirmed**, not completed.

The audit checks GET status, final URL, canonical agreement, robots meta/X-Robots-Tag, title and description presence, HTML refresh redirects, and duplicate sitemap URLs.
It does **not** prove Google's indexing decision, inspect Googlebot-specific edge treatment, validate robots.txt rules, assess source quality, or check every internal link.
The zero-issue result applies to that submitted set at that time, not to all historic URLs.

The original JSON reports were temporary local diagnostics, not durable public artifacts.
Use the [audit commands](@/architecture/indexing.md#audit-before-and-after-deployment) to produce fresh reports and keep dated operational copies outside the public repository.

## Same-day follow-up: sitemap processed, recovery still unresolved

A second check on **2026-10-17**, after the navigation release, found:

- The sitemap report now showed **Success**, **last read October 17**, and
  **359 discovered pages**. This confirms processing of the corrected set.
- The aggregate Page indexing report still had **October 12** as its update
  date, with the same counts recorded above. It cannot measure the effect of
  the October 17 fixes yet.
- Crawl stats, updated **October 15**, reported **5,271 requests** to the
  main `www` host over 90 days, **98 ms** average response time, and **no host
  problems**. Responses were 66% HTTP 200, 18% HTTP 301, and 16% HTTP 404;
  the 404 detail showed 819 requests. 96% of requests were refresh crawls
  and 4% discovery. These figures describe requests, not unique pages.

### Stable sample inspected

The times below are transcribed as displayed by Search Console; no timezone
conversion is inferred.

| URL | Inspection status | Last crawl | Fetch, permission and canonical |
|---|---|---|---|
| `/wiki/elohim/` | Crawled — currently not indexed | Oct 17, 2026, 11:41:22 AM | Successful smartphone fetch; crawling and indexing allowed; Google-selected canonical matches the inspected URL |
| `/wiki/precession/` | Crawled — currently not indexed | Sep 19, 2026, 3:01:53 AM | Successful smartphone fetch; crawling and indexing allowed; matching canonical |
| `/articles/anunnaki-and-the-elohim/` | URL is unknown to Google | N/A | No crawl or canonical data reported |
| `/timeline/preamble/` | Crawled — currently not indexed | Sep 12, 2026, 9:44:01 PM | Successful smartphone fetch; crawling and indexing allowed; matching canonical |

The aggregate Indexed pages list still included Preamble with a June 9 crawl,
while its individual inspection reported the exclusion above. Preserve both
observations rather than declaring recovery or assigning a new sitewide count
from inconsistent report snapshots.
Precession and Preamble showed a sitemap **Temporary processing error** in
their individual records even though the current sitemap report showed Success.
Recheck those associations after the reports refresh; no current sitemap
failure was established by those older inspection records alone.

A single indexing request was attempted for the updated Precession page.
After the live eligibility test, Google displayed a reCAPTCHA; human completion
was requested. Google subsequently displayed **“We had a problem submitting
your indexing request. Please try again later.”** No success confirmation was
obtained. This request remains **unconfirmed**; it was not retried in a loop.
After dismissal, the page also reported that it could not connect to the
reCAPTCHA service. This was a submission-path failure, not a Googlebot fetch
failure for the website.
Elohim was not submitted again because its inspection already recorded a
same-day crawl. The earlier Elohim request remains unconfirmed.

### Additional concrete repair: feed discovery

Recent 404 crawl examples included `/index.xml`, `/es/index.xml`,
`/es/rss.xml`, `/ja/rss.xml`, `/zh/rss.xml`, and `/en/`.
Production checks also found `/es/atom.xml` missing, despite translated pages
advertising locale-root Atom/RSS feeds in their HTML.
The corresponding translated Articles feeds were available and populated.

The follow-up changed translated feed autodiscovery and footer links to the
localized Articles feeds, retained the English root feeds, and added 29
explicit permanent redirects: the English legacy `index.xml`, the obsolete
`/en/` homepage, and three root feed aliases for each of the nine locales.
The [feed contract](@/architecture/indexing.md#feed-discovery-and-legacy-feed-urls)
documents the destination choices.
Release references: [website db441351107](https://github.com/wheelofheaven/www.wheelofheaven.world/commit/db441351107)
and [Bifrost 063d03e](https://github.com/wheelofheaven/bifrost/commit/063d03e).

The full local build passed. All ten language editions advertised two
parseable, populated feeds, their footer links matched the RSS destination,
and all 29 new redirect destinations existed without duplicate source rules.
Other sampled 404s included historical Japanese slugs and relative image
paths; this pass did not invent replacements or claim all 819 requests fixed.
Feed repair is a concrete delivery improvement, not a proven explanation for
the exclusion of successfully fetched English pages.

## Required follow-up

The site maintainer should perform the first follow-up around **2026-10-24**, then compare the same reports weekly while recovery remains unresolved.
This is a maintenance procedure; no scheduled automation was created.

1. The same-day follow-up confirmed the corrected sitemap was read on October 17.
   At the next check, look for newer page-indexing and crawl reports.
   Record the report date, sitemap last-read date, submitted URL count and indexed count separately.
   The 359-URL count is a release baseline, not a permanent target as content changes.
2. Re-run the live sitemap audit after deployments affecting routes, metadata or indexing policy.
   Fix newly submitted 404s, redirects, noindex pages or canonical conflicts before requesting further crawls.
3. Inspect a small, stable English sample: `/wiki/elohim/`, `/wiki/precession/`, `/articles/anunnaki-and-the-elohim/`, and `/timeline/preamble/`.
   Record last crawl, fetch/indexing permission, selected canonical and indexed status.
   Keep Preamble in the sample, but resolve its aggregate/inspection discrepancy
   before treating it as a confirmed indexed comparison page.
4. If desired, complete the unconfirmed Elohim indexing request in Search Console and record the actual confirmation.
   Handle any verification prompt interactively.
   Do not repeatedly submit unchanged URLs: [Google's guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl) says repeats do not accelerate crawling and requests do not guarantee indexing.
5. Review 10–20 important English pages for useful original analysis, specific supporting citations, accurate authorship, and clear separation of source claims from the project's interpretation.
   The ten entries above are a starting set; this deeper editorial review remains outstanding.
   Review relevant internal links and pursue legitimate editorial references where the work is useful; no outreach or backlink campaign was performed in this pass.
6. If pages remain excluded after fresh successful crawls, investigate selection and content quality with the new evidence.
   If fetches or canonicals regress, investigate delivery and migration instead.
   Do not reopen translations, bulk-publish pages, or blanket-redirect missing URLs solely to change the report totals.

For issue-specific validation, follow the [Page indexing report guide](https://support.google.com/webmasters/answer/7440203).
Removing unused taxonomy URLs from a sitemap does not make their 404s disappear immediately from **All known pages**, and does not justify claiming every historic 404 is fixed.
Close the technical incident when deployed checks pass; record indexing recovery separately when fresh Search Console evidence actually shows it.

## Related traffic work on the same day

Earlier changes allowed Cloudflare's automatically injected analytics script through the CSP, redirected `/favicon.ico` to the existing asset, and normalized locale-relative links and breadcrumbs that emitted doubled slashes.
See [Hosting and Caching](@/architecture/hosting-and-caching.md#cloudflare-web-analytics-and-regional-exclusions) for the implementation and verification procedure.

Cloudflare zone requests include bots and other hosts; they are not human pageviews or evidence of Google indexing.
The configured regional analytics exclusion includes Switzerland, so the Zurich check could not establish collection for eligible regions.
An eligible-region browser test and confirmation of new Web Analytics pageviews remained outstanding.
