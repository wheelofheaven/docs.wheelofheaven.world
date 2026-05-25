+++
title = "Tera macros"
description = "Server-side render helpers in Bifrost — imported into templates with `{%/* import */%}` and called as `namespace::name(args)`."
sort_by = "weight"
weight = 50

[extra]
summary = "Bifrost ships a set of Tera macros that templates `import` to render breadcrumbs, claim badges, dispatch entries, library cards, wiki links, section icons, translation badges, and zodiac glyphs."
+++

Tera macros live in `themes/bifrost/templates/macros/`. They are
server-side render helpers — Zola executes them at build time, no
client-side runtime involved. Templates import them at the top and call
them by namespace:

```tera
{%/* import "macros/breadcrumbs.html" as breadcrumbs */%}
…
{{ breadcrumbs::wiki(page=page, lang=detected_lang) }}
```

The macro layer is where most of the cross-template consistency lives —
breadcrumb structure, badge rendering, link wrapping. Adding a new macro
means changes propagate to every template that imports it.
