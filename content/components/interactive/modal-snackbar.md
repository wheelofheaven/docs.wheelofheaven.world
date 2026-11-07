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

`.snackbar` is the receipt for a small action — "Added to reading list",
"Link copied". One compact glass card, one line: icon · message ·
optional text action · close. Redesigned 2026-11-07.

**Source:**
[`sass/components/_snackbar.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_snackbar.scss)
· [`templates/partials/snackbar.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/partials/snackbar.html)

```js
window.showSnackbar(message, type = "info", duration = 4000, action = null);
// action: { label, onClick } — one text button; runs, then dismisses.
window.showSnackbar("Added to reading list", "saved", 5000,
    { label: t.view, onClick: () => ReadingList.open("saved") });
```

| Rule | Why |
|---|---|
| **One at a time** — a new toast replaces the old | Receipts, not a feed. |
| **Phones: docked bottom-left, clear of the FAB rail; desktop: centred** | It never covers the search / reader buttons. Centred with auto margins, never a transform (see [glass invariants](../../../contributing/dev/bifrost-theme/#glassmorphism-invariants)). |
| **Glass only on the visible card** | One blur layer at most. |
| **Semantic colour on the icon only** | No side stripes, no countdown bar. |
| **Types** `info`, `success`, `error`, `warning`, `saved`, `unsaved` | `saved`/`unsaved` draw a filled / outline bookmark. |

Saving to the reading list offers **View** (opens the Saved tab); removing
offers **Undo**. Labels are the `snackbarView` / `snackbarUndo` keys in all
ten languages. The service worker's "Page saved for offline reading" toast
was retired — it fired on every save, replacing the localized receipt
with English text; offline caching is now a silent side effect
(`woh:page-cached` event).

## Live examples

- **Modal mixin** — open search (`/` or the navbar search affordance).
- **Snackbar** — bookmark any entry; a confirmation toast appears.
