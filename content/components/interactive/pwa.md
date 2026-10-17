+++
title = "PWA components"
description = "Install banner, offline indicator, and update notification — the visual surface of www.wheelofheaven.world's progressive-web-app layer."
template = "page.html"
weight = 80
+++

Bifrost ships three components that surface the site's PWA layer:
install prompt, offline indicator, update-available notification.
The service worker drives update notifications; `beforeinstallprompt`
and a session gate control installation offers.

**Source:**
[`themes/bifrost/sass/components/_pwa.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_pwa.scss)
· [notification-stack.html](https://github.com/wheelofheaven/bifrost/blob/main/templates/partials/notification-stack.html)
· [notification-stack.js](https://github.com/wheelofheaven/bifrost/blob/main/static/js/notification-stack.js)
· [pwa.js](https://github.com/wheelofheaven/bifrost/blob/main/static/js/pwa.js)

| Class                       | What                                                            |
|-----------------------------|-----------------------------------------------------------------|
| `.offline-indicator`        | Bottom-left pill that appears when the browser reports offline. Yellow warning palette. |
| `.notification-card--install` | Install card in the shared top notification stack; delayed and suppressed after dismissal. |
| `.notification-card--update` | Update card in the same stack when a new service worker is ready. |

Install and update cards are server-rendered with `hidden`; the stack
controller manages their visibility and the navbar offset. The offline
indicator is created by `pwa.js` and uses a visibility class.

## Install timing

The first page records `woh-install-session-start` in `sessionStorage`.
A later page can offer installation once at least 60 seconds have passed
since that timestamp. Eligibility is decided at page initialization,
before the browser emits `beforeinstallprompt`; no timer introduces a
banner halfway through reading. A quick second-page visit still stays
quiet. If session storage is unavailable, automatic offers stay hidden;
the browser's own installation UI remains available.

The notification stack also honors the existing persistent dismissal
key, `woh-banner-dismissed.install`, in `localStorage`. Dismissal has no
90-day expiry. Successful installation hides the card.

Run `node --test scripts/pwa.test.js` in Bifrost to check first visits,
quick navigation, eligible returns, late browser events, and unavailable
session storage.

## Live examples

- **Install banner** — open in Chrome/Edge desktop or mobile; the
  banner appears when both the browser's install criteria and the session
  gate are met. It stays hidden after dismissal.
- **Offline indicator** — toggle DevTools → Network → Offline.
- **Update notification** — visible after a deploy when the SW has new
  assets cached and the user revisits.
