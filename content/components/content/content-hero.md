+++
title = "Content hero"
description = "Shared hero-section styling for pages with featured imagery — gradient background, image overlay, responsive height collapse."
template = "page.html"
weight = 60
+++

`.content-hero` is the shared hero-section primitive used by templates
that want a featured image or animated gradient header above the content
body. Used by Articles, Newsroom Dispatches, and other long-form
templates with featured imagery.

**Source:**
[`themes/bifrost/sass/components/_content-shared.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_content-shared.scss)

## Anatomy

| Class                          | What                                                       |
|--------------------------------|------------------------------------------------------------|
| `.content-hero`                | 300px tall (200px on `< 768px`), rounded 12px corners.    |
| `.content-hero--no-image`      | Variant — animated gradient blend (`$color-primary → $color-secondary → $color-accent`). 15s ease-in-out loop. |
| `.content-hero__image`         | The featured image, object-fit cover.                       |
| `.content-hero__overlay`       | Gradient overlay so text on top stays legible.              |
| `.content-hero__content`       | Centred title + meta block on top of the image.             |

The animated gradient on the `--no-image` variant uses
`@keyframes gradient-shift` to slowly cycle the gradient position —
similar in spirit to [`glass-cloud-card`](../../visual-language/glass-cloud-card/),
but full-bleed and not blur-treated.

## Live examples

- **Articles** — top of any
  [/articles/](https://www.wheelofheaven.world/articles/) page when the
  page has a featured image.
- **Dispatches** — top of any
  [/news/](https://www.wheelofheaven.world/news/) entry.
