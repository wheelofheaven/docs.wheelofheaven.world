+++
title = "wiki + explainer + author helpers"
description = "Per-section render-helper modules: TOC items, reference entries, author profile cards. Bundled together because each is a small handful of macros used only inside its section template."
template = "page.html"
weight = 110
+++

Three small render-helper modules consumed by section templates. None of
them are large enough to deserve their own page — but they're worth
documenting so callers know what's available.

## `macros/wiki.html`

Source: [`templates/macros/wiki.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/wiki.html)

| Macro                            | What                                                  |
|----------------------------------|-------------------------------------------------------|
| `toc_item(item, level)`          | Recursively renders one TOC item + its children list. |
| `reference_entry(ref, index)`    | One entry inside the wiki page's references list (title, author, publication, date, url, description). |

## `macros/explainer.html`

Source: [`templates/macros/explainer.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/explainer.html)

| Macro                            | What                                                  |
|----------------------------------|-------------------------------------------------------|
| `reference_entry(ref, index)`    | Article-style reference entry — parallel to the wiki variant, with explainer-specific class names. |

## `macros/author.html`

Source: [`templates/macros/author.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/author.html)

| Macro                                          | What                                                |
|------------------------------------------------|-----------------------------------------------------|
| `author_profile(author_key, custom_name, custom_title)` | Avatar + name + title + dates card for blockquote citations. Reads from `authors.toml`. Falls back to a single-letter placeholder if the avatar image is missing. |

## Related

- [Shortcodes → author](../../shortcodes/author/) — the content-side shortcode that uses `author_profile` to render author cards inside markdown.
