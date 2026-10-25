# Firmament Sans web fonts (docs site)

The documentation site reads in Firmament Sans 0.1, the same four static
WOFF2 files the main website serves, so the pages that describe the
typeface are set in it. Copied byte-for-byte from
`www.wheelofheaven.world/static/fonts/vendor/firmament-sans/0.1/`;
`SHA256SUMS` lists the checksums of the deployed files.

- Source: [wheelofheaven/firmament-sans](https://github.com/wheelofheaven/firmament-sans),
  font build commit `1718e4d5f024951c770fc692244a2ef072693c71`.
- Original Jost design: Owen Earl / indestructible type and the Jost Project Authors.
- Scholarly extension: Wheel of Heaven contributors.
- License: SIL Open Font License 1.1, preserved in `OFL.txt`.

Publish future font builds under a new version path and update
`sass/base/_fonts.scss`, the preload in `templates/base.html`, and the
Mermaid font in `static/js/mermaid-init.js` together.
