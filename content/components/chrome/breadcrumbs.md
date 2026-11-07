+++
title = "Breadcrumbs"
description = "The hierarchical trail — Home > Section > Category > Current Page — set in the footer's brand column, under the site description."
template = "page.html"
weight = 10
+++

`.breadcrumbs` is the trail from the root of the site to the current page,
so readers can step back up the hierarchy.

**Placement (since 2026-11-07): the footer, not the top of the page.** On a
phone the trail plus the claim pill pushed the headline a third of the
screen down. The trail now sits in the footer's brand column, under the
site description, separated by a hairline — "where am I / go up a level"
is answered where a reader finishes. The top of every page starts with the
title. The "Back to Articles / Newsroom" links at the foot of articles and
dispatches were removed: the trail directly below carries the same link.

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

Renders in `font-family-tech` at `0.75rem` inside `.footer__trail`. The
separator leads each item (`.breadcrumbs__item + .breadcrumbs__item::before`),
so a wrapped line never ends on a dangling "/".

## Usage

A template hands its trail to the footer through `base.html`'s `trail`
block, using the [`breadcrumbs` macro](../../macros/breadcrumbs/):

```tera
{%/* block trail */%}
{%/* set_global page_trail = breadcrumbs::wiki(page=page, lang=detected_lang) */%}
{%/* endblock trail */%}
```

`partials/footer.html` prints `page_trail` under the description. Pages
that set no trail get one built from their section ancestors
(`page.ancestors` / `section.ancestors`), so every page except the home
page has one.

## Live examples

The trail renders in the footer of every interior page. E.g.
[/wiki/elohim/](https://www.wheelofheaven.world/wiki/elohim/),
[/timeline/age-of-aquarius/](https://www.wheelofheaven.world/timeline/age-of-aquarius/),
[/library/the-book-which-tells-the-truth/](https://www.wheelofheaven.world/library/the-book-which-tells-the-truth/).

## Related

- [Macros → `breadcrumbs`](../../macros/breadcrumbs/) — the macro module that renders the markup.
- [`section-mark`](../section-mark/) — the section identity glyph that often pairs with breadcrumbs in section headers.
