+++
title = "relatedness-graph"
description = "Bounded SVG 'neighbourhood' mini-graph rendered above the See also list on wiki and article pages. Single macro."
template = "page.html"
weight = 55
+++

`macros/relatedness-graph.html` renders a small SVG "neighbourhood"
constellation: the current entry at the centre, its curated
`see_also` neighbours around it as linked spokes. It is a **visual
companion** to the See also list — the list stays the semantic /
accessibility / crawl backbone, so the figure is `aria-hidden` and its
links are pulled from the tab order (`tabindex="-1"`) to avoid duplicate
screen-reader announcements. Real `<a href>` links are still present for
crawlers.

Part of the graph / relatedness surface (Decision 15, G3 — the human
counterpart to the API's [`/v1/graph/`](https://api.wheelofheaven.world/v1/graph/)
content graph).

**Source:**
[`themes/bifrost/templates/macros/relatedness-graph.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/relatedness-graph.html)
&middot; styled by
[`themes/bifrost/sass/components/_relatedness-graph.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_relatedness-graph.scss)

## Public API

```tera
{%/* import "macros/relatedness-graph.html" as relatedness_graph */%}

{{ relatedness_graph::neighborhood(title=page.title, see_also=page.extra.see_also, lang=detected_lang) }}
```

## Parameters

| Param       | Type   | Required | What                                                                        |
|-------------|--------|----------|-----------------------------------------------------------------------------|
| `title`     | string | yes      | Centre-node label — the current entry's title.                              |
| `see_also`  | array  | yes      | The page's `see_also` array (`{ title, path \| url, description }`). Empty or absent → the macro renders nothing. |
| `lang`      | string | yes      | Language code; used to resolve each neighbour's `path` via `get_url`.        |

## Anatomy

| Class                                   | What                                                        |
|-----------------------------------------|-------------------------------------------------------------|
| `.relatedness-graph`                    | `<figure>` container (`aria-hidden`), centred, max-width 380px. |
| `.relatedness-graph__svg`              | The `viewBox="0 0 340 264"` SVG canvas.                     |
| `.relatedness-graph__edge`             | A spoke from centre to a neighbour — translucent cyan.      |
| `.relatedness-graph__node`             | A neighbour `<a>` (a real link, `tabindex="-1"`).           |
| `.relatedness-graph__dot`              | Node circle — fills `--color-background`, cyan ring.        |
| `.relatedness-graph__dot--center`      | The centre node — filled cyan.                              |
| `.relatedness-graph__label`            | Node label — truncated, anchored outward from the centre.  |

## Layout & behaviour

- **Bounded.** Renders nothing when `see_also` is empty; caps at **8**
  neighbours. Most entries have 4–6, so the common case is uncluttered.
- **No trig in Tera.** Node positions are a precomputed per-count
  coordinate table (centre `170,132`, radius `92`), selected by neighbour
  count. Labels anchor *outward* from the centre so they never collide
  with the centre label.
- **Theme-safe colours.** Spokes and rings use a translucent cyan (not
  `--color-border`, which is near-transparent in dark); nodes fill with
  `--color-background`, so the constellation reads in both light and dark.
- **Language-correct.** It walks the page's own localised `see_also`, so
  every locale shows its own titles and links — no dependency on the
  English-only API graph.

## Where it's wired

Called from `wiki-page.html` and `articles-page.html`, just under the
"See also" heading and above the `see_also` list.

## Live examples

Above the See also list on any wiki entry with `see_also`, e.g.
[/wiki/elohim/](https://www.wheelofheaven.world/wiki/elohim/).

## Related

- [Content → Related content](../../content/related-content/) — the "Read
  next" card block at the end of long-form bodies (a different relatedness
  surface).
- [`/v1/graph/`](https://api.wheelofheaven.world/v1/graph/) — the API's
  machine-readable content graph this mirrors.
