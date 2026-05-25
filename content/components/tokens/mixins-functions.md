+++
title = "Mixins + functions"
description = "The reusable SCSS mixins (focus rings, focus-visible) and functions (rem, themed-color, strip-unit) Bifrost exposes from abstracts/."
template = "page.html"
weight = 30
+++

`abstracts/_mixins.scss` and `abstracts/_functions.scss` collect the
reusable SCSS helpers Bifrost components compose from. Most are small —
the heavy lifting happens in component-level mixins like
[`glass-cloud-card`](../../visual-language/glass-cloud-card/).

## Mixins

**Source:**
[`themes/bifrost/sass/abstracts/_mixins.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/abstracts/_mixins.scss)

| Mixin                              | What it does                                                  |
|------------------------------------|---------------------------------------------------------------|
| `focus-ring($offset, $color)`      | Sets `outline` + `outline-offset` for a keyboard focus ring.  |
| `focus-visible($offset, $color)`   | Removes the mouse `:focus` outline and applies `focus-ring` on `:focus-visible`. |
| `focus-ring-highlight($color)`     | Focus ring + background hover highlight, for subtle elements. |
| `center-absolute`                  | Absolute-positioned dead-centre (`top/left 50%` + `translate(-50%, -50%)`). |
| `fluid-type($min, $max)`           | `font-size: clamp(…)` for responsive type.                    |
| `respond($breakpoint)`             | Media-query shortcut: `sm` / `md` / `lg`.                     |

```scss
@use "../abstracts/mixins" as m;

.my-link {
    @include m.focus-visible;
}
```

In practice `focus-visible` is **already applied globally** by
[`_focus.scss`](../../chrome/focus/) — you only need to `@include` it
manually when a component needs an inset or recoloured ring.

## Functions

**Source:**
[`themes/bifrost/sass/abstracts/_functions.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/abstracts/_functions.scss)

| Function                                | Returns                                                  |
|-----------------------------------------|----------------------------------------------------------|
| `rem($px, $base: 16)`                   | Converts pixels to rem.                                  |
| `themed-color($color, $amount)`         | Lightens / darkens a colour based on the current theme.  |
| `strip-unit($value)`                    | Returns the numeric part of a value with units.          |

These are mostly **unused** in current Bifrost code (components prefer
literal rem values), but they're available if a new component needs them.
