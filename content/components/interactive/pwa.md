+++
title = "PWA components"
description = "Install banner, offline indicator, and update notification — the visual surface of www.wheelofheaven.world's progressive-web-app layer."
template = "page.html"
weight = 80
+++

Bifrost ships three components that surface the site's PWA layer:
install prompt, offline indicator, update-available notification.
Visibility is driven by the service worker + `BeforeInstallPromptEvent`,
not by per-page state.

**Source:**
[`themes/bifrost/sass/components/_pwa.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_pwa.scss)

| Class                       | What                                                            |
|-----------------------------|-----------------------------------------------------------------|
| `.offline-indicator`        | Bottom-left pill that appears when the browser reports offline. Yellow warning palette. |
| `.install-banner`           | Slide-up banner offering "Install this site as an app"; suppressed after dismiss. |
| `.update-notification`      | Persistent banner when the service worker has a new build cached; clicking reloads to activate. |

All three are hidden by default (`opacity: 0`, `visibility: hidden`,
`transform: translateY(1rem)`) and animate in via JS-driven state classes.

## Live examples

- **Install banner** — open in Chrome/Edge desktop or mobile; the
  banner appears once the install criteria are met. Suppressed after
  dismiss for ~90 days.
- **Offline indicator** — toggle DevTools → Network → Offline.
- **Update notification** — visible after a deploy when the SW has new
  assets cached and the user revisits.
