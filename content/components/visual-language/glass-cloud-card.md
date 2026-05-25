+++
title = "glass-cloud-card"
description = "Frosted glass + drifting cloud-duo gradient. The Bifrost mixin that lead cards on /read/, /articles/, and /news/ share."
template = "page.html"
weight = 10
+++

`glass-cloud-card` is the SCSS mixin that gives lead cards their signature
**glass-and-cloud** look: a frosted-glass surface (saturated backdrop
blur) sitting on top of a slowly drifting two-colour radial gradient.

**Source:**
[`themes/bifrost/sass/components/_glass-cloud-card.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_glass-cloud-card.scss)

## Anatomy

| Layer       | What it does                                                         |
|-------------|----------------------------------------------------------------------|
| Card root   | New stacking context (`isolation: isolate`) + `overflow: hidden` so the cloud layer stays inside the card. `backdrop-filter: blur(14px) saturate(150%)` on a translucent base. |
| `::before`  | Two radial gradients (`--cloud-a` top-left, `--cloud-b` bottom-right), `blur(28px)`, `opacity: 0.5`, slowly transformed by the `glass-cloud-drift` animation. |
| Animation   | 36s ease-in-out, alternates between four keyframe states. Tuned so the silhouettes change shape over half a minute without ever reading as a "moving thing". |
| Motion-safe | `@media (prefers-reduced-motion: reduce)` disables the animation. The static cloud-duo is still visible — it's only the drift that pauses. |

The mixin deliberately **doesn't set** `padding` or `border-radius` — call
sites pick values that match their content density.

## Usage

```scss
@use "../components/glass-cloud-card" as gcc;
@use "../abstracts/colors" as c;

.my-lead-card {
    @include gcc.glass-cloud-card;

    // Card shape — the mixin doesn't set these.
    padding: 2.5rem 2rem;
    border-radius: 1rem;

    // Pick a cloud-duo from the Bifrost 300-tier palette.
    --cloud-a: #{c.$mint-300};
    --cloud-b: #{c.$lavender-300};
}
```

## Tokens

| CSS variable  | Default            | What to pass                                              |
|---------------|--------------------|-----------------------------------------------------------|
| `--cloud-a`   | `c.$mauve-300`     | First radial-gradient colour (top-left). Pick from `$yellow-300`, `$pink-300`, `$lavender-300`, `$mauve-300`, `$blue-300`, `$cyan-300`, `$mint-300`. |
| `--cloud-b`   | `c.$blue-300`      | Second radial-gradient colour (bottom-right). Same palette. |

Pick a duo that **blends**, not contrasts — both colours sit at the same
tonal value (300 tier) so neither dominates. The /news/ section assigns
duos per event-type (e.g. `cyan-300 → mint-300` for `announcement`); the
/read/ section uses `mint-300 → lavender-300` as a single brand
treatment.

## Live examples

- **/read/ reading-path cards** — [www.wheelofheaven.world/read/](https://www.wheelofheaven.world/read/)
- **/articles/ lead article** — [www.wheelofheaven.world/articles/](https://www.wheelofheaven.world/articles/)
- **/news/ lead Dispatch** — [www.wheelofheaven.world/news/](https://www.wheelofheaven.world/news/)
  (cloud-duo varies per event-type — see `_news.scss`)

## Related

- [`glass-cloud-button`](../glass-cloud-button/) — the same recipe scaled
  to button-shaped affordances. Use for in-content CTAs that should
  match the lead-card visual language.
- [Tokens → Colors](../../tokens/) — the palette the cloud-duos come from.
