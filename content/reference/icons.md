+++
title = "Icon registry"
description = "Every icon used across www.wheelofheaven.world, rendered live from data/icons.json — slug bindings, family classification, full catalogue."
template = "icon-registry.html"
weight = 50
+++

The icon system on **www.wheelofheaven.world** is centralised in a single
registry file, [`data/icons.json`][icons-json]. The registry is the source
of truth for:

1. **Which SVG partials exist** — every file under
   `themes/bifrost/templates/partials/icons/` is catalogued, with metadata
   on family (stroked / mixed / filled), source (Feather, Game Icons,
   custom, etc.), viewBox, and where it&rsquo;s currently used.
2. **Which icon represents which semantic slug** — the `bindings` block
   maps section slugs (`library`, `wiki`, &hellip;), tradition slugs
   (`raelian`, `biblical`, &hellip;), and event-type slugs
   (`announcement`, `discovery`, &hellip;) to specific icon ids.

At render time, the [`macros/section-icons.html`][macros] file exposes
three semantic resolvers that consult the registry &mdash;
`section_icons::section(slug)`, `section_icons::tradition(slug)`,
`section_icons::event_type(slug)` &mdash; plus a generic
`section_icons::render(id)` for arbitrary by-id rendering.

This page is a **live render** of the entire registry. To refresh after
upstream changes, run `mise run icons` in the docs repo &mdash; it copies
`data/icons.json`, every SVG partial, and the resolver macro from the
www repo via [`scripts/sync_icons.py`][sync-script].

[icons-json]: https://github.com/wheelofheaven/www.wheelofheaven.world/blob/main/data/icons.json
[macros]: https://github.com/wheelofheaven/www.wheelofheaven.world/blob/main/themes/bifrost/templates/macros/section-icons.html
[sync-script]: https://github.com/wheelofheaven/docs.wheelofheaven.world/blob/main/scripts/sync_icons.py
