+++
title = "Interactive"
description = "JS-backed widgets in Bifrost: glossary tooltips, reader controls, sharing, keyboard shortcuts, modals, snackbars, listen-button, study-tools, PWA install."
sort_by = "weight"
weight = 30

[extra]
summary = "Components that need JavaScript to function — tooltips, sharing flows, keyboard shortcuts, modals. Each ships with progressive-enhancement defaults so the page still works without JS."
+++

Interactive components are Bifrost's JS-backed widgets. Each one degrades
gracefully: the underlying HTML works without JavaScript (links resolve,
text is readable), and the script layer adds affordances like keyboard
shortcuts, animated reveals, and clipboard integration.

JavaScript lives in `themes/bifrost/static/js/` and is bundled by
`scripts/bundle.js` into `themes/bifrost/static/js/dist/core.bundle.js`,
which `base.html` loads with `defer`.
