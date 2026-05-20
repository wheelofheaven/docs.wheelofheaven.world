+++
title = "Newsroom Dispatch"
description = "Writing a Dispatch — short, event-anchored News reads of current events through the Wheel of Heaven canon."
weight = 30
+++

A **Newsroom Dispatch** reads a current event through the Wheel of
Heaven frame. The event is the subject; the canon-tied reading is the
angle. Dispatches are short (300–800 words), event-anchored, and decay
— they're meant to be *current*, not definitive.

Dispatches live at `data-content/news/{slug}.md` and serve at
`https://www.wheelofheaven.world/news/{slug}/`.

## When to write a Dispatch

| If you're writing… | …it's a |
|---|---|
| "Here's a thing that happened, here's how the canon reads it" | **Dispatch** |
| A definitive long-form argument | [Article](@/contributing/content/article.md) |
| A definition or reference | [Wiki entry](@/contributing/content/wiki-entry.md) |

A useful test: would this piece be *just as relevant five years from now*?
If yes, it's an Article. If no, it's a Dispatch.

## Anatomy

```toml
+++
title = "JWST resolves the most distant galaxy yet — and the universe gets weirder"
description = "JADES-GS-z14-0 sits at z=14.32, only 290 million years after the Big Bang. We re-read the canon's cosmology in light of how much earlier structure formed than models predicted."
template = "news-page.html"
date = 2026-05-08

[extra]
event_date = 2026-05-07
event_type = "discovery"
claim_type = "inferred"
summary = "The James Webb Space Telescope confirmed JADES-GS-z14-0 as the most distant galaxy ever observed. Cosmological structure formed earlier and faster than mainstream models predict — a wrinkle the Wheel of Heaven cosmology has long noted."
canon_links = [
    { title = "Elohim cosmology", path = "/wiki/elohim-cosmology/" },
    { title = "Age of Cassiopeia", path = "/timeline/age-of-cassiopeia/" }
]
sources = [
    { title = "JWST confirms distance to JADES-GS-z14-0", url = "https://www.nature.com/articles/...", outlet = "Nature", date = "2026-05-07" },
    { title = "Universe formed structure faster than models predict", url = "https://...", outlet = "Reuters", date = "2026-05-08" }
]
+++

## What happened

JWST resolved JADES-GS-z14-0 at redshift z=14.32...

[Plain factual lede — 1–2 paragraphs, no editorial yet]

## The canon angle

This is the kind of result the canon has, in its own way, predicted...

[2–4 paragraphs reading the event through the Wheel of Heaven frame.
Which canon claim does it touch? Sharpen? Complicate? Echo?]

## Context

JADES-GS-z14-0 is not the first galaxy to surprise the model...

[Optional: where this event sits in a longer story]
```

## Required frontmatter

Dispatches have more required frontmatter than other content types
because of how they're surfaced.

| Field | Type | Notes |
|---|---|---|
| `title` | string | Headline. Under 60 chars. |
| `description` | string | 150–160 chars; appears in search and shares |
| `template` | string | Always `"news-page.html"` |
| `date` | date | Publication date (when *we* published) |
| `event_date` | date | When the event itself happened |
| `event_type` | enum | See below |
| `claim_type` | enum | See [Editorial Passes](@/contributing/content/editorial-passes.md) |
| `summary` | string | 2–4 sentence TL;DR — the lede plus the angle |
| `canon_links` | object[] | **At least one.** Wiki entries or timeline pages that this Dispatch touches |
| `sources` | object[] | The primary news source(s); rendered as a sources block automatically |

### `event_type` valid values

| Value | Example |
|---|---|
| `announcement` | Government policy change, organizational announcement |
| `discovery` | Scientific finding, archaeological discovery |
| `anniversary` | Notable anniversary (e.g. 50 years since first Roswell book) |
| `cultural-moment` | Film, book, public moment that intersects the canon |
| `obituary` | Death of someone relevant |

If your event doesn't fit, push back on the categorization — don't
shoehorn.

## Structure

1. **Lede — "What happened"** (1–2 paragraphs)
   Plain factual reporting. No editorial yet. State the event in terms a
   reader can verify against the source.

2. **Canon angle — "How does this read?"** (2–4 paragraphs)
   The Wheel of Heaven reading. Which canon claim does this event touch?
   Sharpen? Complicate? Echo? *This is the only reason the Dispatch exists.*
   Without a canon angle, it's not a Dispatch.

3. **Context (optional)** (1 paragraph)
   Where this event sits in a longer story. Skip if the event is
   stand-alone.

4. **Sources** (automatic)
   Rendered from the `sources` frontmatter array. Don't write this section
   manually.

## Sourcing — the floor, not the ceiling

Dispatches are **exempt from the six-source minimum**. They require only:

- 1× **Primary news source** (in `sources`)
- 1× **Canon link** (in `canon_links`)

The canon link is what makes this a Wheel of Heaven Dispatch rather than
commentary. If you can't link it to canon, write something else (or
nothing).

## Voice

Same scholarly register as the rest of the site, but **tighter and more
journalistic**. The stance rules still apply:

- Canon claims direct
- Comparative / scientific claims hedged
- Critical material in its own voice

Avoid:

- Sensational headlines
- Editorializing in the lede
- Burying the news under the angle (the *event* is the subject; the
  angle is the angle)

## Decay

Dispatches over **12 months old** should be reviewed:

- Leave as historical record (if the event still matters), or
- Seed into a future Article (if the angle has matured into a thesis)

**Never promote a Dispatch into an Article in-place.** Don't rename the
file, don't retitle it. If the topic deserves the long form, write a
*fresh* Article and have it cite the Dispatch. Different content types,
different lifetimes, different URLs.

## Workflow

```sh
cd data-content
git checkout -b feature/dispatch-{slug}
$EDITOR news/{slug}.md
python scripts/validate.py
git add news/{slug}.md
git commit -m "Newsroom Dispatch: {short headline}"
git push -u origin feature/dispatch-{slug}
```

Translations follow the regular i18n workflow — see
[Translations](@/contributing/content/translations.md). In practice, most
Dispatches ship English-only at first; key ones get translated later.

## Quality checklist

- [ ] Title under 60 characters
- [ ] Description 150–160 characters
- [ ] `event_date` set (the event, not the publication date)
- [ ] `event_type` matches the actual kind of event
- [ ] At least one `canon_links` entry
- [ ] At least one primary news source in `sources`
- [ ] Lede stays factual (no editorial)
- [ ] Canon angle is the second section and clearly named
- [ ] Length 300–800 words
- [ ] `claim_type` set (usually `inferred` for dispatches)
- [ ] No broken `@/path.md` links

## Distinct from Articles

| | Article | Dispatch |
|---|---|---|
| Built around | An idea | An event |
| Lifetime | Evergreen | 12-month review cycle |
| Length | 1,500–4,000 words | 300–800 words |
| Sourcing floor | Six-source minimum | News source + ≥1 canon link |
| Lives at | `/articles/` | `/news/` |
| `canon_links` required? | No | Yes |
| `event_date` required? | No | Yes |
