---
'smartcompanion-audioguide-app': minor
---

Derive shades and tints from their base colour instead of asking for them.

Ionic expects every themeable colour to come with a shade and a tint, and until now a customization had to supply all three: pick `primary_color`, then paste `primary_color_shade` and `primary_color_tint` in by hand from the Ionic Color Creator. But a shade and a tint are not choices — they are pure functions of the base colour, so that was busywork that also let the three values drift apart with nothing to catch it.

`src/global/_color-helpers.scss` now reproduces Ionic's own calculation in Sass: `shade()` mixes 12% black, `tint()` mixes 10% white, both rounding channels the way the generator does. The output is identical to the generator's, not merely close — every shade and tint this repo previously hardcoded, across both the default and Leon variants, comes out byte-for-byte the same.

**Six engraft variables are removed.** Delete them from your values file; leaving them in is harmless but they no longer do anything:

- `primary_color_shade`, `primary_color_tint`
- `light_color_shade`, `light_color_tint`
- `light_color_shade_dark`, `light_color_tint_dark`

`primary_color`, `light_color` and `light_color_dark` are unchanged and now drive their own derived values. No colour in a built app changes.
