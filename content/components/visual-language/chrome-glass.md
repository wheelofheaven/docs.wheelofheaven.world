+++
title = "chrome-glass"
description = "The navbar's glass recipe as a reusable mixin, for floating chrome that should read as one surface with it. Distinct from the glass-cloud premium-CTA language."
template = "page.html"
weight = 30
+++

`chrome-glass` is the SCSS mixin that carries the **navbar's** glass —
a ~10% tint of the page background with a 12px backdrop blur, painted on
a `::before`. Use it for floating chrome that should read as the same
surface as the navbar: control clusters, overlay panels, popovers that
sit above a page rather than in it.

It is **not** the [glass-cloud](../) language. That recipe is for
premium CTAs and lead cards, and adds a drifting two-colour gradient;
this one adds nothing — it is deliberately the quietest possible
surface.

**Source:**
[`themes/bifrost/sass/abstracts/_mixins.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/abstracts/_mixins.scss)
&middot; original in
[`sass/layout/_navbar.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/layout/_navbar.scss)

## Public API

```scss
@use "../abstracts/mixins" as m;

.my-floating-panel {
    position: absolute;   // see "the caller must position itself" below
    inset-block-end: 1rem;
    @include m.chrome-glass(v.$border-radius-xl);
}
```

| Param      | Default                    | What                                          |
|------------|----------------------------|-----------------------------------------------|
| `$radius`  | `0.5rem`                   | Corner radius. The navbar itself uses `1rem`. |
| `$surface` | `var(--color-navbar-bg)`   | The tint. Override only when the backdrop makes the shared token unreadable — see below. |

## Three details that make it match

A surface can declare `backdrop-filter` and still look nothing like the
navbar. All three of these matter:

1. **`--color-navbar-bg`, not `--color-card-bg`.** The card token is
   *opaque* (`$gray-900` / `$white`), so the blur composites behind a
   solid fill and can never show. The map's panels carried
   `backdrop-filter` for months and read as flat cards for exactly this
   reason.
2. **`blur(12px)`, no `saturate()`.** Matching the navbar exactly.
3. **Painted on a `::before`.** Children keep their own stacking context,
   and the token picks up the reduced-transparency and
   no-`backdrop-filter` fallbacks defined in
   [`themes/_init.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/themes/_init.scss)
   for free.

## The caller must position itself

The mixin deliberately does **not** set `position`. Sass emits included
declarations *after* the ones written above the `@include`, so a
`position: relative` inside the mixin silently overrides a call site's
`position: absolute` — which is exactly what happened to every map
overlay when this mixin was first written.

So the call site needs its own positioned, stacking context. Most of
these surfaces are `position: absolute` already; a static one needs an
explicit `position: relative`, or the glass `::before` will size itself
against the nearest positioned ancestor instead.

## The transformed-ancestor trap

WebKit silently refuses to paint `backdrop-filter` anywhere below a
transformed element. **Every ancestor of a glass surface must stay
transform-free.** This is documented on the navbar, where
`left: 50% + translateX(-50%)` was replaced by `left: 0; right: 0;
margin-inline: auto`; `.map-layout` had the same bug and offsets with
`top` instead of `translateY` now.

Nothing warns you. The blur simply does not render on Safari and iOS
while looking correct in Chrome.

## Chrome versus panels

Floating surfaces divide into two kinds, and they do **not** want the
same treatment over a dark backdrop:

| | Behaviour | Examples |
|---|---|---|
| **Chrome** | Dissolves — the glyphs carry the meaning, not the fill | `.navbar`, `.search-fab`, `.to-top`, `.map-zoom-controls__button` |
| **Panels** | Keep enough body to stay readable | `.map-graph-legend`, `.map-graph-card`, `.map-graph-footer` |

The site already draws this line: the "Chrome over a hero" block in
[`pages/_home.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/pages/_home.scss)
remaps `.navbar`, `.search-fab` and `.to-top` together when a dark hero
is behind them. **Read that block before inventing a solution for chrome
over a dark backdrop** — it is the same problem, already solved.

### When to override `$surface`

The shared token works because the blur samples page content. Over a
*flat* field — the graph canvas is pure black or pure white with only
hairline edges — there is nothing to frost, and a 10% tint leaves a panel
with no body at all: only its border marks it out, and panning does not
help.

`/map/` therefore defines `--map-chrome-bg`, an inverse tint
(`color-mix(in srgb, var(--color-text) 12%, transparent)` — a light veil
on the dark canvas, a dark one on the light canvas) and passes it as
`$surface` for the panels only. The chrome keeps the shared token and
dissolves.

Override sparingly, and restate the reduced-transparency and
no-`backdrop-filter` fallbacks for any token you introduce — the
`:root`-level ones in `themes/_init.scss` only cover
`--color-navbar-bg`.

## Adopters

| Surface | Radius | Tint |
|---|---|---|
| `.navbar` | `1rem` | shared (inline, predates the mixin) |
| `.map-zoom-controls__button` | `0.5rem` | shared |
| `.map-graph-legend` / `-card` / `-footer` | `1rem` | `--map-chrome-bg` |
| `.map-graph__status` / `__retry` / `__skip` | `0.5rem` | `--map-chrome-bg` |

The navbar, search modal, dropdowns and glossary tooltip still inline
the recipe rather than calling the mixin; adopting it there is a
worthwhile cleanup that has not been done.

## Related

- [Visual language](../) — the glass-cloud premium-CTA recipe this is
  deliberately distinct from.
- [Narrative map → Graph view](../../interactive/graph-view/) — where the
  chrome/panel split is applied in anger.
- [Tokens → Mixins & functions](../../tokens/mixins-functions/)
