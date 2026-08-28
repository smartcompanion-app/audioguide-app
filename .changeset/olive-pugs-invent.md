---
'smartcompanion-audioguide-app': minor
---

Derive the whole palette from two base colours.

A customization now names `primary_color` and `background_color` and gets the rest of the theme for free. `src/global/_color-helpers.scss` computes it: surfaces step off the background — darker in light mode, lighter in dark mode — the dark palette is the light background at low lightness, and the station icon's progress ring is the primary colour pushed far enough away from the background to stay legible on it.

**Nine engraft variables lost their defaults and are now optional.** Naming one in a values file still wins; leaving it out derives it. A fork that sets all of them keeps exactly the colours it has today:

- `background_color_dark`
- `card_background_color`, `card_background_color_dark`
- `menu_border_color`, `menu_border_color_dark`
- `station_icon_progress_color`, `station_icon_progress_color_dark`
- `light_color`, `light_color_dark`

`primary_color_contrast` stays an explicit choice: Ionic's rule resolves the default primary to black text, so which text colour sits on a brand colour is a design decision rather than a calculation.

The derived values are close enough to the hand-picked ones they replace to be indistinguishable — a 1–4 point RGB shift per channel across both shipped variants — except the station icon's progress ring, which now follows the primary colour instead of being an unrelated hand-picked colour (`#698e7c` → `#589c97` in the Animals app, `#333333` → `#454545` in Leon).

Because the dark background is now computed by Sass, the `theme-color` meta tags can no longer be filled in at build time. `src/global/app.ts` keeps both of them on the active background colour instead, which also fixes `theme-color` under a palette forced with `UPDATE_DARK_MODE` — it never followed that before.
