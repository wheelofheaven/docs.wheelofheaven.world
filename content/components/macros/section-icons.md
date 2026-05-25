+++
title = "section-icons"
description = "Semantic icon resolvers — section(slug), tradition(slug), event_type(slug), render(id). All consult data/icons.json."
template = "page.html"
weight = 60
+++

`macros/section-icons.html` is the single entry point for rendering
icons across Bifrost. Four resolver macros expose semantic lookups
(section, tradition, event-type) plus a by-id renderer.

**Source:**
[`themes/bifrost/templates/macros/section-icons.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/section-icons.html)
&middot; registry: [`data/icons.json`][icons-json] &middot; live registry:
[Reference → Icons](../../../reference/icons/)

[icons-json]: https://github.com/wheelofheaven/www.wheelofheaven.world/blob/main/data/icons.json

## Public API

```tera
{%/* import "macros/section-icons.html" as section_icons */%}

{# Semantic resolvers — slug → icon via data/icons.json bindings #}
{{ section_icons::section(slug="library") }}
{{ section_icons::tradition(slug="raelian") }}
{{ section_icons::event_type(slug="announcement") }}

{# Generic by-id renderer #}
{{ section_icons::render(id="arrow-right") }}
```

## Adding a new icon

1. Drop the SVG into
   [`templates/partials/icons/<id>.html`](https://github.com/wheelofheaven/bifrost/tree/main/templates/partials/icons).
2. Add an entry under `icons` in `data/icons.json` (family, source,
   viewBox, usage).
3. Add a render-branch in the relevant macro below.

## Adding a new binding

For a new tradition slug, event-type slug, etc.:

1. Edit `bindings` in `data/icons.json`.
2. Ensure the chosen `icon_id` has a render-branch in the matching
   resolver macro.

## Why each macro has its own if-elif chain

Tera doesn't support computed `include` paths (you can't pass a variable
to `{%/* include */%}`), and Tera 1.x stack-overflows on self-import — so
delegating semantic resolvers to a shared `render(id)` macro in the
same file isn't possible. The duplication is small: each kind-macro
only branches on the icons actually bound to that kind.

## Related

- [Reference → Icons](../../../reference/icons/) — the live registry page that renders every icon and binding.
- [Chrome → Section mark](../../chrome/section-mark/) — the visual surface around resolved icons in headings.
