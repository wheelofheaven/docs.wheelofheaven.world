+++
title = "Topic pages (/topics/)"
description = "The /topics/ index and one page per topic of the knowledge graph's vocabulary, with every page filed under it, plus the topic chips in reading-page sidebars."
template = "page.html"
weight = 96
+++

`/topics/` turns the knowledge graph's topic vocabulary into pages
(2026-11-08): an index of all 57 topics grouped by kind, and one page per
topic listing every wiki entry, article, timeline age, dispatch, library
book and dataset filed under it, with its broader and narrower topics and
its most-cited sources. Reading pages show their topics as chips in the
"At a glance" panel.

**Source:**
[`templates/topics-section.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/topics-section.html)
· [`templates/topic-page.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/topic-page.html)
· [`templates/macros/topics.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/topics.html)
· [`sass/pages/_topics.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/pages/_topics.scss)
· www [`scripts/build_graph.py`](https://github.com/wheelofheaven/www.wheelofheaven.world/blob/main/scripts/build_graph.py)

## Data

`mise run graph` writes, besides `static/graph/graph.json`:

| Output | What |
|---|---|
| `data/graph/topics.json` | Per topic: name, kind, description, defining wiki entry, broader and narrower topics, members by section (label, url, meta, one-line description), source count and the eight most-cited sources. Plus `by_page`: English page path → its topics, for the chips. |
| `content/topics/{slug}.md` | One generated stub per topic (`template = "topic-page.html"`, `extra.topic = slug`, `weight` = vocabulary order). Stale stubs are pruned. The Cloudflare build runs Zola only, so the stubs are committed in data-content. |

`content/topics/_index.md` is hand-written (title, description,
`template = "topics-section.html"`).

Membership comes from the builder's own page → topic filing (the
vocabulary's `match` terms, and catalog traditions for library books),
not from the de-duplicated link list in `graph.json`, so a page that also
*defines* a topic is still listed under it.

## Pages

Both templates use the generic `section-page` shell, so the page frame
and the reading grammar apply without new page-type rules. The index
groups topics by `kind` (themes, traditions, figures, methods, sciences,
what comes next) as cards with their page and source counts. A topic page
opens with its kind, name and description, links to its defining entry and
to its node on `/graph/` (`#node=topic:{slug}`), then lists members by
section in a two-column list.

## Chips

```tera
{% import "macros/topics.html" as topics %}
{{ topics::chips(path=page.path, lang=detected_lang, block="wiki") }}
```

renders a `{block}__meta-row` with up to six topic pills, so it slots into
the wiki and timeline "At a glance" panels. Topic names and pages are
English only for now, so the chips render on English pages only.

## Navigation

The Knowledge menu and the footer list *Topics* next to *Graph*
(`navbarTopics` / `navbarTopicsDesc`, in all ten languages; the link goes
to the English `/topics/`, like `/graph/`). Topic nodes on the graph open
their topic page.

## Related

- [Knowledge graph (/graph/)](../graph-view/) — the same vocabulary drawn as a graph.
