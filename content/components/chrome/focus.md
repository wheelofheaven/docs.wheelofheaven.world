+++
title = "Focus indicators"
description = "Global keyboard-focus styles. `:focus-visible` driven so the ring shows for keyboard users only, not on mouse click."
template = "page.html"
weight = 80
+++

Bifrost's focus styles are global, not per-component. Every interactive
element (`a`, `button`, `input`, `select`, `textarea`, `[tabindex]`,
ARIA roles) gets a consistent `2px` accent-coloured ring on
`:focus-visible`, with no ring on `:focus` for mouse users.

**Source:**
[`themes/bifrost/sass/components/_focus.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_focus.scss)

## Rule

```scss
:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
}
```

`outline-offset: 2px` gives the ring breathing room — it doesn't clip
against rounded corners. `var(--color-focus)` is defined per-theme so
the ring reads correctly in both light and dark modes.

## When to override

Don't. The whole point of a global rule is consistency. Per-component
focus overrides (e.g. inset rings on packed UI) should still go through
`:focus-visible` and use `--color-focus` — they're customisations of
geometry, not colour.

The one exception is `glass-cloud-button`, which sets its own ring
matched to the cloud-duo. That's intentional — the global ring would
read wrong against the drifting background.

## Related

- [`glass-cloud-button`](../../visual-language/glass-cloud-button/) — overrides the focus ring to match the cloud duo.
