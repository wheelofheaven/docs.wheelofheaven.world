+++
title = "dispatch"
description = "Render helpers for the Newsroom section — chip, card, lead card, attribution row."
template = "page.html"
weight = 30
+++

`macros/dispatch.html` renders Newsroom Dispatch UI in index and lead-card
contexts. Imports [`section-icons`](section-icons/) at the top to render
event-type glyphs in chips.

**Source:**
[`themes/bifrost/templates/macros/dispatch.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/dispatch.html)
&middot; chip styling:
[`.dispatch-chip`](../../chrome/dispatch-chip/)

## Public API

```tera
{%/* import "macros/dispatch.html" as dispatch */%}

{{ dispatch::chip(event_type=page.extra.event_type | default(value="")) }}
{{ dispatch::card(page=page, lang=detected_lang) }}
{{ dispatch::card_lead(page=page, lang=detected_lang) }}
{{ dispatch::attribution(page=page, lang=detected_lang) }}
```

## Macros

| Macro                    | What                                                              |
|--------------------------|-------------------------------------------------------------------|
| `chip(event_type, lang)` | The "Dispatch" pill. Optionally tinted + glyphed by `event_type`. |
| `card(page, lang)`       | One Dispatch in the chronological feed.                            |
| `card_lead(page, lang)`  | The magazine-cover lead Dispatch at the top of `/news/` — applies [`glass-cloud-card`](../../visual-language/glass-cloud-card/) with event-type cloud-duo. |
| `attribution(page, lang)`| Ground-News-style attribution row: outlet pills + canon-link pills at the bottom of every Dispatch card. Both columns cap at 4 with a "+N more" overflow. |

## Related

- [Chrome → Dispatch chip](../../chrome/dispatch-chip/) — chip styling and palette.
- [`section-icons`](section-icons/) — provides the event-type glyph used inside the chip.
- [Article macros](article/) — the parallel render-helpers for the Articles section.
