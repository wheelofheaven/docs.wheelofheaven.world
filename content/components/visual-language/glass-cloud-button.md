+++
title = "glass-cloud-button"
description = "Glass-cloud-card scaled to button affordances. Used for in-content CTAs that should feel premium and match the lead-card visual language."
template = "page.html"
weight = 20
+++

`glass-cloud-button` is the SCSS mixin that adapts the
[glass-cloud-card](../glass-cloud-card/) recipe — frosted glass + drifting
cloud-duo gradient — to button-shaped affordances. Reach for it when an
in-content CTA should match the visual prominence of lead cards.

**Source:**
[`themes/bifrost/sass/components/_glass-cloud-button.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_glass-cloud-button.scss)

## Anatomy

The mixin `@include`s `glass-cloud-card` for the background recipe, then
adds button-specific concerns:

| Concern        | What it does                                                                            |
|----------------|-----------------------------------------------------------------------------------------|
| Shape          | `inline-flex`, `0.55rem 1rem` padding, `0.5rem` radius, `gap: 0.45rem` for icon + label. |
| Type           | `0.8125rem` / `font-weight: 600` / `text-decoration: none` / `white-space: nowrap`. |
| Cloud opacity  | Tones the card-scale `::before` drift down (`opacity: 0.65`, `filter: blur(20px)`) so the cloud reads as a tint, not a full background. |
| Hover / focus  | Lift (`translateY(-1px)`) + shadow grow + cloud brightens to `opacity: 0.85`. Identical state on `:hover` and `:focus-visible` so keyboard users get the same feedback. |
| Focus ring     | `2px` `--color-accent-primary` outline with `2px` offset. |
| Active press   | Lift returns to 0, shadow shrinks. |
| SVG icons      | `width / height: 1em`, `flex-shrink: 0`. Icons size with the label automatically — call sites don't need their own `svg` rule. |

## Usage

```scss
@use "../components/glass-cloud-button" as gcc-btn;
@use "../abstracts/colors" as c;

.my-cta {
    @include gcc-btn.glass-cloud-button;
    --cloud-a: #{c.$mauve-300};
    --cloud-b: #{c.$cyan-300};
}
```

The HTML can be a plain anchor or button:

```html
<a class="my-cta" href="/library/the-book-which-tells-the-truth/">
    <svg width="14" height="14" viewBox="0 0 24 24" …>…</svg>
    <span>Read in The Book Which Tells the Truth</span>
</a>
```

## Tokens

| CSS variable  | Default            | What to pass                                              |
|---------------|--------------------|-----------------------------------------------------------|
| `--cloud-a`   | inherited from `glass-cloud-card` | First gradient colour. Pick from the 300-tier palette. |
| `--cloud-b`   | inherited from `glass-cloud-card` | Second gradient colour.                                |

The mixin **doesn't** expose padding / radius / font-size as parameters —
those are the design intent. If you find yourself wanting to override
them per call site, the right answer is usually a new mixin or a
different component, not a bypass.

## Choosing a cloud-duo

Pair duos to the **prominence** of the CTA, not arbitrarily:

| Prominence            | Suggested duo                              | Example                         |
|-----------------------|--------------------------------------------|---------------------------------|
| Content-anchor CTA    | `$mauve-300 → $cyan-300`                   | "Read in *Book*" library button |
| Utility, recede       | `$blue-300 → $mauve-300` (cool)            | "View history" on edit footers  |
| Utility, more active  | `$mint-300 → $blue-300`                    | "Edit on GitHub" on edit footers|

Don't pick contrasting colours — both should sit at the same tonal value.

## Live examples

- **"Read in *Book*" CTA** — any wiki page with a `library` quote
  block, e.g. [www.wheelofheaven.world/wiki/elohim/](https://www.wheelofheaven.world/wiki/elohim/)
- **Wiki / timeline / library edit footers** — bottom of any wiki entry,
  e.g. [www.wheelofheaven.world/wiki/genesis/](https://www.wheelofheaven.world/wiki/genesis/)

## Related

- [`glass-cloud-card`](../glass-cloud-card/) — the parent recipe; same
  blur + drift, no button-shape concerns.
- [`library` shortcode](../../shortcodes/library/) — where the
  `.library-quote__button` adoption ships.
