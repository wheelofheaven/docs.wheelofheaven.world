+++
title = "Content shortcodes"
description = "Tera shortcodes Bifrost exposes to markdown content — invoked as `{%/* name(args) */%}…{%/* end */%}` (paired) or `{%/* name(args) */%}` (inline)."
sort_by = "weight"
weight = 60

[extra]
summary = "Bifrost's content shortcodes — `wiki`, `library`, `cite`, `definition`, `info`, `figure`, `link`, `ref`, `reference`, `author` — invoked from inside markdown to render canon-internal links, library quotes, citations, and info boxes."
+++

Content shortcodes live in `themes/bifrost/templates/shortcodes/`. They
are Tera shortcodes — Zola's mechanism for letting markdown authors
invoke template logic from inside content files. They differ from macros
in three ways:

1. **Called from markdown**, not templates: `wiki(slug="elohim") %}Elohim{% end`.
2. **Two flavours**: paired (with `end`, takes a body) and inline
   (single tag, no body).
3. **Stable contract**: shortcode arg names are part of the content
   contract — renaming an arg breaks every markdown file that uses it.

The shortcode layer is what content authors see. Adding a new shortcode
is a content-authoring change, not just a template change — document the
arg signature here when you add one.
