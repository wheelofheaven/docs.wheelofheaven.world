+++
title = "Footer Social Icons"
description = "The footer's social-icon row and Social Media column, and how to add a new platform — the partials/social pattern, the include, and the optional brand-color hover."
template = "page.html"
weight = 90
+++

The site footer surfaces external platforms two ways: a **`footer__socials`** row
of monochrome icons, and a **Social Media** column of text links. Both live in
`themes/bifrost/templates/partials/footer.html`; the icon SVGs are one partial
each under `partials/social/`.

## Adding a platform

1. **Icon partial** — create `partials/social/<name>.html`: an
   `<a class="footer__social-link">` (add a `footer__social-link--<name>`
   modifier if you want a brand hover) wrapping a **24×24** SVG with
   `fill="currentColor"` (or `stroke="currentColor"`), plus `href`,
   `target="_blank" rel="noopener"`, and an `aria-label`. Keep it monochrome so
   it inherits the footer text colour and inverts cleanly in dark mode.
2. **Include it** in the `footer__socials` row in `footer.html`.
3. **Text link** (optional) — add a `link_macros::smart_link(...)` list item to
   the Social Media column.
4. **Brand hover** (optional) — in `sass/layout/_footer.scss`, under
   `&__social-link`, add `&--<name>:hover { color: <brand>; }`. Because the SVG
   is `fill="currentColor"`, tinting the link colour tints the mark.

## Example: Hugging Face

`partials/social/huggingface.html` uses the simple-icons mark
(`fill="currentColor"`), links to
[huggingface.co/wheelofheaven](https://huggingface.co/wheelofheaven), sits in the
socials row after GitHub, and its `--huggingface:hover` rule tints the mark
Hugging Face yellow (`#ffd21e`) on hover. A matching "Hugging Face" text link
lives in the Social Media column.

**Which icons get a colour.** Only platforms with a real brand colour carry a
hover tint — Telegram (blue), YouTube (red), Open Collective (blue), Hugging Face
(yellow). **X and GitHub stay monochrome**: they're black-and-white brands, so a
brand-colour hover would be arbitrary; they keep only the background + lift.
