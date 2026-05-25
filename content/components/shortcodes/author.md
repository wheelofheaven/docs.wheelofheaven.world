+++
title = "author"
description = "Author-attributed blockquote — body is the quote, author profile renders from `authors.toml`."
template = "page.html"
weight = 90
+++

The `author` shortcode wraps a quote in a blockquote with an
author-profile card sourced from `authors.toml`. Paired-tag; the body
is the quoted text.

**Source:**
[`themes/bifrost/templates/shortcodes/author.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/shortcodes/author.html)

## Syntax

```markdown
{%/* author(author="rael", year=1974) */%}
The Elohim created humanity in their image, in laboratories.
{%/* end */%}
```

| Param      | Type    | Required          | Default | What                                                  |
|------------|---------|-------------------|---------|-------------------------------------------------------|
| `author`   | string  | yes (or `name`)   | `""`    | Key into `authors.toml`. Renders the full profile card. |
| `name`     | string  | yes (or `author`) | `""`    | Manual author name when not in `authors.toml`.        |
| `title`    | string  | no                | `""`    | Manual author title/role.                             |
| `work`     | string  | no                | `""`    | Cited work (book, paper, talk).                       |
| `year`     | string  | no                | `""`    | Publication year.                                     |
| `url`      | string  | no                | `""`    | Link the citation to a source.                        |

## Auto-resolve

When `author` matches a key in
[`authors.toml`](https://github.com/wheelofheaven/www.wheelofheaven.world/blob/main/data/authors.toml),
the shortcode loads the full record (avatar, name, title, birth/death
years) and renders the author profile card via
[`macros/author.html`](../../macros/wiki-helpers/) → `author_profile`.

When the author isn't in `authors.toml`, pass `name` / `title` / `year`
manually.

## Output structure

```html
<blockquote class="wiki-content">
    <div class="blockquote-content">…body…</div>
    <div class="author-profile">…avatar + name + title + dates…</div>
</blockquote>
```

Styled by [`.wiki-content blockquote`](../../content/wiki-shortcodes/) —
gradient border, rounded corners.

## Related

- [Macros → wiki-helpers](../../macros/wiki-helpers/) → `author_profile` — the underlying card renderer.
- [Content → wiki-shortcodes](../../content/wiki-shortcodes/) — blockquote styling.
