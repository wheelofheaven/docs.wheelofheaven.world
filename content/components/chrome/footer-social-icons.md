+++
title = "Footer Social Icons"
description = "The footer's social-icon row and Social Media column, and how to add a new platform — the partials/social pattern, the include, and the optional brand-color hover."
template = "page.html"
weight = 90
+++

The site footer includes a **`footer__socials`** row of labeled monochrome icons
and a Social Media text group in the full navigation grid.
The row lives in `themes/bifrost/templates/partials/footer.html`; each icon
has a partial under `partials/social/`.

## Footer hierarchy

The footer is an exhaustive, always-visible navigation area with no
**More links** disclosure.
The desktop grid has a wide introduction and four link columns containing
Get started / Start reading, Sections / Press, Community / Social Media,
and Development / Privacy & terms.
Below 900px the introduction spans the grid; below 640px all columns stack.

The original spacing is restored: content top margins of 3rem on desktop,
2rem below 768px, and 1.5rem below 600px, with 1rem between link items.
The decorative rainbow is 13rem tall on desktop and 10rem below 768px.
Social icons, the license, and desktop language/theme controls remain in
the bottom bar.
The introduction uses the localized `elevatorPitch`.

The RSS link uses `/rss.xml` in English and the localized
`/articles/rss.xml` in translated editions. Avoid language-root feeds:
they were absent in production and empty in a newer local build.
See [feed discovery](@/architecture/indexing.md#feed-discovery-and-legacy-feed-urls).

## Adding a platform

1. **Icon partial** — create `partials/social/<name>.html`: an
   `<a class="footer__social-link">` (add a `footer__social-link--<name>`
   modifier if you want a brand hover) wrapping a **24×24** SVG with
   `fill="currentColor"` (or `stroke="currentColor"`), plus `href`,
   `target="_blank" rel="noopener"`, and an `aria-label`. Keep it monochrome so
   it inherits the footer text colour and inverts cleanly in dark mode.
2. **Include it** in the `footer__socials` row in `footer.html`.
3. **Brand hover** (optional) — in `sass/layout/_footer.scss`, under
   `&__social-link`, add `&--<name>:hover { color: <brand>; }`. Because the SVG
   is `fill="currentColor"`, tinting the link colour tints the mark.

## Example: Hugging Face

`partials/social/huggingface.html` uses the simple-icons mark
(`fill="currentColor"`), links to
[huggingface.co/wheelofheaven](https://huggingface.co/wheelofheaven), sits in the
socials row after GitHub, and its `--huggingface:hover` rule tints the mark
Hugging Face yellow (`#ffd21e`) on hover.

**Which icons get a colour.** Only platforms with a real brand colour carry a
hover tint — Telegram (blue), YouTube (red), Open Collective (blue), Hugging Face
(yellow). **X and GitHub stay monochrome**: they're black-and-white brands, so a
brand-colour hover would be arbitrary; they keep only the background + lift.
