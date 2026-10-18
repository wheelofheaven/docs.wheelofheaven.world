+++
title = "Navigation and search keyboard behavior"
description = "Keyboard behavior for Bifrost navigation menus, language selection, and site search across mobile and desktop viewports."
template = "page.html"
weight = 55
+++

Bifrost keeps the same navigation, language picker, and search surfaces at every input mode.
The mobile breakpoint is 999px, matching the navbar SCSS.

## Navigation

On desktop, Enter opens a dropdown and focuses its first link.
Arrow Down and Arrow Up open it at the first and last link respectively.
Tab follows the links; leaving the final link closes the dropdown and continues to the next navbar control.
Shift+Tab from the first link returns to the trigger.
Escape closes the dropdown and restores trigger focus.
Moving focus elsewhere also closes it.

The dropdown's scrolling container is bounded by the available viewport height below the navbar.
This keeps its final links reachable in short windows and at increased zoom.

On mobile, opening the burger menu focuses its first link.
Tab and Shift+Tab remain within the visible navigation controls while the menu is expanded.
Escape closes it, restores focus to the burger button, and releases the page scroll lock.
Changing to desktop width also clears the mobile scroll lock.
The Knowledge and Community triggers control their inline groups on mobile and the corresponding popovers on desktop.

## Language selection

Both language lists use a single tab stop and the existing listbox/option semantics.
Arrow Up and Arrow Down move between languages; Home and End move to the first and last option.
Enter or Space activates the focused language through the same navigation path as a click.

Opening the mobile language pane focuses its Back button and makes the obscured main menu inert.
Tab reaches the selected language.
Escape first returns to the main menu and restores the language trigger; a second Escape dismisses the burger menu.
The desktop picker focuses an option when opened, closes when focus leaves, and restores the trigger on Escape.

## Site search

The visible Search buttons, the existing `/` shortcut, and Ctrl+/ or Command+/ open the same search interface.
The modifier shortcut also works before the lazy search bundle has loaded.
The dormant navbar input is excluded from normal Tab order.

The search overlay is a named dialog.
Its input keeps the existing navbar position and is associated with the dialog using `aria-owns="site-search-input"`.
While search is open, background controls are inert and Tab cycles through the input, Close button, filters, suggestions, and results.
Arrow Down and Arrow Up navigate suggestions/results and return to the input.
Escape and Close restore the initiating control, the previous scroll position, and the background's interaction state.
The closed dialog is inert throughout its fade-out.

Opening an already-open search does not capture a new scroll position or install another background lock.
Search changes require rebuilding both bundles and advancing the manual cache version in `search-loader.js`.

## Focus and themes

Use the global [focus indicators](../../chrome/focus/) and `--color-focus` token.
Navbar controls and inline wiki/article links retain a visible outline in both themes.
Do not suppress that outline in component hover/focus rules.
Popover visibility changes immediately when opening so the first keyboard focus is not delayed by an opacity transition.

## Regression checklist

Check the home page, a wiki page with a wide table, and a comparison article at 320px, 390px, 820px, and 1440px widths, in both themes.
Include a short desktop viewport such as 1440 × 600.

1. Open each navbar group with Enter and arrow keys; exercise Tab, Shift+Tab, and Escape.
2. Open the burger, its language pane, and a language option using the keyboard; Escape one level at a time.
3. Resize an open mobile menu to desktop and verify page scrolling is restored.
4. Open search from its button and keyboard shortcut, enter a query, move through results, and close it from both the input and Close button.
5. Confirm focus cannot reach background controls while search is open and returns to the opener afterward.
6. Verify page width stays within the viewport; wide content tables should scroll locally.
7. Check visible keyboard rings on navigation controls and inline prose links in light and dark modes.

## Sources

- [Navbar controller](https://github.com/wheelofheaven/bifrost/blob/main/static/js/navbar.js)
- [Mobile navbar controller](https://github.com/wheelofheaven/bifrost/blob/main/static/js/navbar-mobile-toggle.js)
- [Navbar and language picker template](https://github.com/wheelofheaven/bifrost/blob/main/templates/partials/navbar.html)
- [Search controller](https://github.com/wheelofheaven/bifrost/blob/main/static/js/search.js)
- [Search loader](https://github.com/wheelofheaven/bifrost/blob/main/static/js/search-loader.js)
- [Dropdown layout](https://github.com/wheelofheaven/bifrost/blob/main/sass/layout/_navbar-dropdown.scss)
