+++
title = "Breadcrumbs"
description = "The hierarchical navigation row at the top of every interior page — Home > Section > Category > Current Page."
template = "page.html"
weight = 10
+++

`.breadcrumbs` is the navigation row that sits at the top of every
interior page below the navbar. It shows the path from the root of the
site to the current page so readers can step back up the hierarchy.

**Source:**
[`themes/bifrost/sass/components/_breadcrumbs.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_breadcrumbs.scss)
&middot;
[`themes/bifrost/templates/macros/breadcrumbs.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/breadcrumbs.html)

## Structure

```html
<nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol class="breadcrumbs__list">
        <li class="breadcrumbs__item">
            <a href="/">Home</a>
            <span class="breadcrumbs__sep" aria-hidden="true">/</span>
        </li>
        …
        <li class="breadcrumbs__item breadcrumbs__item--current">
            <span aria-current="page">Current page</span>
        </li>
    </ol>
</nav>
```

Renders in `font-family-tech` at `0.8125rem`. Items wrap on small
viewports (`gap: 0.25rem 0.5rem`); padding compresses below 1000px.

## Usage

Don't write the markup by hand — use the
[`breadcrumbs` macro](../../macros/breadcrumbs/), which has one entry
point per section type and handles aria attributes, separators, and
current-page treatment consistently:

```tera
{%/* import "macros/breadcrumbs.html" as breadcrumbs */%}
…
{{ breadcrumbs::wiki(page=page, lang=detected_lang) }}
{{ breadcrumbs::timeline(page=page, lang=detected_lang) }}
{{ breadcrumbs::library(page=page, lang=detected_lang) }}
```

## Live examples

Breadcrumbs render on every interior page. E.g.
[/wiki/elohim/](https://www.wheelofheaven.world/wiki/elohim/),
[/timeline/age-of-aquarius/](https://www.wheelofheaven.world/timeline/age-of-aquarius/),
[/library/the-book-which-tells-the-truth/](https://www.wheelofheaven.world/library/the-book-which-tells-the-truth/).

## Related

- [Macros → `breadcrumbs`](../../macros/breadcrumbs/) — the macro module that renders the markup.
- [`section-mark`](../section-mark/) — the section identity glyph that often pairs with breadcrumbs in section headers.
