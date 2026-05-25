+++
title = "Modal + snackbar"
description = "The two surface primitives for overlay content: modal mixins (used by search, dropdowns, the shortcuts panel) and snackbar toasts."
template = "page.html"
weight = 50
+++

Two low-level surfaces Bifrost uses across multiple feature components.

## Modal mixins

`_modal.scss` exposes mixins rather than a finished component. Concrete
modals (search overlay, navbar dropdowns, share/login panels) `@include`
the mixins to inherit consistent open/close transitions and backdrop
treatment.

**Source:**
[`themes/bifrost/sass/components/_modal.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_modal.scss)

| Mixin                | Sets                                                            |
|----------------------|-----------------------------------------------------------------|
| `modal-base`         | `opacity: 0` / `visibility: hidden` defaults, `--active` state. |
| `modal-backdrop`     | Fixed full-screen backdrop, `var(--color-overlay)`, `backdrop-filter: blur(8px)`. |

```scss
.search-modal {
    @include modal-base;
    …
    &__backdrop { @include modal-backdrop; }
}
```

## Snackbar

`.snackbar` is the toast-notification system: a stack of cards in the
bottom-right corner that announce transient events like "Bookmark
saved", "Link copied".

**Source:**
[`themes/bifrost/sass/components/_snackbar.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_snackbar.scss)

| Class                  | What                                                            |
|------------------------|-----------------------------------------------------------------|
| `.snackbar-container`  | Fixed bottom-right, `column-reverse` flex so new toasts push older ones up. `z-index: 9999`. |
| `.snackbar`            | One toast — background + hairline border + shadow.              |
| `.snackbar__title` / `__body` / `__close` | Optional structure inside a toast.            |

Layout collapses to full-width on `< 768px`. Toasts are JS-driven and
auto-dismiss after a configurable timeout.

## Live examples

- **Modal mixin** — open search (`/` or the navbar search affordance).
- **Snackbar** — bookmark any entry; a confirmation toast appears.
