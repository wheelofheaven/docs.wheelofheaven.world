+++
title = "Listen button + audio player"
description = "Text-to-speech inline trigger and the SoundCloud-style bottom bar that surfaces the active audio session."
template = "page.html"
weight = 60
+++

Bifrost ships a text-to-speech reader: an inline trigger button on
articles + a persistent bottom-bar audio player that surfaces the
current session as the reader navigates.

**Source:**
[`themes/bifrost/sass/components/_listen-button.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_listen-button.scss)

| Class                  | What                                                            |
|------------------------|-----------------------------------------------------------------|
| `.listen-trigger`      | Inline button, pill-shaped, icon + label. Renders inside article meta blocks. |
| `.listen-bar`          | Bottom-bar audio player; appears once the reader starts playback. |
| `.listen-bar__progress` | Scrubbable timeline.                                           |
| `.listen-bar__controls` | Play/pause + speed selector.                                   |

The trigger and bar coordinate via a small JS module — the bar persists
as the reader navigates within the same audio session, so playback
isn't interrupted by going to a related entry.

## Live examples

- **Listen trigger** — top of any article body, e.g.
  [/articles/](https://www.wheelofheaven.world/articles/).
- **Audio bar** — appears at the bottom of the viewport after the
  reader clicks Listen.
