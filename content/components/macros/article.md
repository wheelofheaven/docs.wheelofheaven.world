+++
title = "article"
description = "Render helpers for the Articles (Explainers) section — chip, card, lead card."
template = "page.html"
weight = 40
+++

`macros/article.html` is the Articles-section render-helper module —
parallel to [`dispatch`](dispatch/) but for evergreen Explainers rather
than time-anchored Dispatches.

**Source:**
[`themes/bifrost/templates/macros/article.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/article.html)

## Public API

```tera
{%/* import "macros/article.html" as article */%}

{{ article::chip(lang=detected_lang) }}
{{ article::card(page=page, lang=detected_lang) }}
{{ article::card_lead(page=entries | first, lang=detected_lang) }}
```

## Macros

| Macro                  | What                                                                  |
|------------------------|-----------------------------------------------------------------------|
| `chip(lang)`           | "Explainer" pill — the section-type sibling of the Dispatch chip.    |
| `card(page, lang)`     | One Article in the chronological feed.                                |
| `card_lead(page, lang)`| Lead Article card at the top of `/articles/` — applies [`glass-cloud-card`](../../visual-language/glass-cloud-card/). |

## Related

- [Dispatch macros](dispatch/) — parallel module for the Newsroom section.
