+++
title = "Button"
description = "The generic `.btn` primitive with size and variant modifiers — covers most non-premium buttons."
template = "page.html"
weight = 20
+++

`.btn` is Bifrost's generic button primitive: inline-flex, padded, rounded,
with a subtle shine effect on hover. Use it for normal buttons; reach for
[`glass-cloud-button`](../../visual-language/glass-cloud-button/) only
when you want premium / lead-card prominence.

**Source:**
[`themes/bifrost/sass/components/_button.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_button.scss)

## Anatomy

| Token          | Value                                          |
|----------------|------------------------------------------------|
| Display        | `inline-flex`, items + content centered        |
| Gap            | `$spacing-xs`                                  |
| Padding        | `$spacing-sm $spacing-lg`                      |
| Radius         | `$border-radius-md`                            |
| Font           | `$font-size-base`, weight 500, `line-height: 1.5` |
| Transition     | `all 0.3s ease`                                |
| `::before`     | Subtle shine animation that sweeps across on hover. |

## Variants (modifiers)

| Modifier              | What                                                |
|-----------------------|-----------------------------------------------------|
| `.btn--primary`       | Accent background, light text. The default visual.  |
| `.btn--secondary`     | Outlined: transparent background, accent border.    |
| `.btn--ghost`         | Borderless, fades in background on hover.           |
| `.btn--sm`            | Smaller padding + font-size.                        |
| `.btn--lg`            | Larger padding + font-size.                         |

## When NOT to use this

For premium / lead-position CTAs (the "Read in *Book*" library button,
edit-footer history/edit buttons) use
[`glass-cloud-button`](../../visual-language/glass-cloud-button/) — it
matches the glass-cloud-card visual language.

## Related

- [`glass-cloud-button`](../../visual-language/glass-cloud-button/) — the premium counterpart.
- [Focus indicators](../../chrome/focus/) — global focus ring inherited by every button.
