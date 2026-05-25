+++
title = "Variables"
description = "Spacing scale, border-radius scale, transitions, z-index layers, breakpoints, font sizes — the non-colour tokens."
template = "page.html"
weight = 20
+++

`abstracts/_variables.scss` holds every non-colour token Bifrost
components reference: spacing, radii, transitions, z-indices, breakpoints,
font sizes. Components `@use "../abstracts/variables" as v;` and reach
for tokens like `v.$spacing-md` instead of hardcoding rem values.

**Source:**
[`themes/bifrost/sass/abstracts/_variables.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/abstracts/_variables.scss)

## Spacing scale

4px-based. Use this scale for `padding`, `margin`, `gap`.

| Token             | Value      |
|-------------------|------------|
| `$spacing-2xs`    | `0.25rem`  |
| `$spacing-xs`     | `0.5rem`   |
| `$spacing-sm`     | `0.75rem`  |
| `$spacing-md`     | `1rem`     |
| `$spacing-lg`     | `1.5rem`   |
| `$spacing-xl`     | `2rem`     |
| `$spacing-2xl`    | `3rem`     |
| `$spacing-3xl`    | `4rem`     |

## Border radius

| Token                    | Value     | Use                                        |
|--------------------------|-----------|--------------------------------------------|
| `$border-radius-xs`      | `0.25rem` | Small inline pills, chips.                 |
| `$border-radius-sm`      | `0.375rem`| Code blocks, inline highlights.            |
| `$border-radius-md`      | `0.5rem`  | Standard buttons, inputs.                  |
| `$border-radius-lg`      | `0.75rem` | Cards, modals.                             |
| `$border-radius-xl`      | `1rem`    | Lead cards, premium surfaces.              |
| `$border-radius-full`    | `50px`    | Pill / badge shapes.                       |

## Transitions

| Token                    | Value                                       |
|--------------------------|---------------------------------------------|
| `$transition-fast`       | `0.1s`                                      |
| `$transition-base`       | `0.2s`                                      |
| `$transition-slow`       | `0.3s`                                      |
| `$transition-slower`     | `0.5s`                                      |
| `$transition-default`    | `all 0.3s ease`                             |
| `$transition-transform`  | `transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)` |

## Z-index layers

| Token             | Value | Use                                           |
|-------------------|-------|-----------------------------------------------|
| `$z-navbar`       | `50`  | Site navbar.                                  |
| `$z-dropdown`     | `55`  | Open navbar menus.                            |
| `$z-modal`        | `60`  | Modal dialogs.                                |
| `$z-tooltip`      | `70`  | Tooltips (above modals).                      |
| `$z-toast`        | `80`  | Snackbar / toast notifications.               |

(Some components like the keyboard-shortcuts modal use higher values
deliberately to sit above other modals; reach for `z-toast + n`, not a
naked 9999.)

## Breakpoints

| Token              | Value     |
|--------------------|-----------|
| `$breakpoint-sm`   | `640px`   |
| `$breakpoint-md`   | `768px`   |
| `$breakpoint-lg`   | `1024px`  |
| `$breakpoint-xl`   | `1280px`  |

These are reference values — Bifrost uses inline `@media (max-width: …)`
queries with the literal pixel values for clarity, rather than wrapping
them in mixins.

## Font sizes

| Token                | Value       | Use                                |
|----------------------|-------------|------------------------------------|
| `$font-size-xs`      | `0.75rem`   | Chips, captions, badges.           |
| `$font-size-sm`      | `0.875rem`  | Secondary text.                    |
| `$font-size-base`    | `1rem`      | Body text.                         |
| `$font-size-lg`      | `1.125rem`  | Emphasis.                          |
| `$font-size-xl`      | `1.25rem`   | Section headings.                  |
| `$font-size-2xl`     | `1.5rem`    | Card titles.                       |
| `$font-size-3xl`     | `1.875rem`  | Page titles inside content.        |

## Layout

| Token                  | Value         | Use                                  |
|------------------------|---------------|--------------------------------------|
| `$viewport-max-width`  | `1400px`      | Content container max-width.         |
| `$hairline-width`      | `1px`         | Hairline border width.               |
