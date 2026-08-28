# smartcompanion-audioguide-app

## 2026.1.0

### Minor Changes

- [#43](https://github.com/smartcompanion-app/audioguide-app/pull/43) [`303d190`](https://github.com/smartcompanion-app/audioguide-app/commit/303d19015a7a20182bf2f17f6ee4eae2d617ae52) Thanks [@stefanhuber](https://github.com/stefanhuber)! - Release through changesets, with CalVer versions that keep the year.

  Versions are `YYYY.MINOR.MICRO` — the [CalVer scheme](https://calver.org/) PyCharm and Unity use, and valid semver, which is what lets changesets drive it without any custom scripting. The year is the only calendar claim; the trailing two components are plain sequences, so nothing can drift out of step with the date the way a month component would.

  `major` now means "new year" rather than "breaking", so breaking changes are described in the changelog prose instead of being signalled by a number. That is the more useful half of the signal anyway: a forker cannot act on an incremented integer, but can act on "the engraft variable `x` was renamed to `y`".

  Each build now carries the version in a `version` meta tag, so a running app can say which build it is:

  ```js
  document.querySelector('meta[name="version"]').content; // "2026.1.0"
  ```

  The release workflow also takes a `workflow_dispatch` ref, so a bad release can be rolled back by redeploying a known-good tag rather than only by cutting a new one.

- [#51](https://github.com/smartcompanion-app/audioguide-app/pull/51) [`c6781e4`](https://github.com/smartcompanion-app/audioguide-app/commit/c6781e429807b3e5a55055f6c503df23e38884fe) Thanks [@stefanhuber](https://github.com/stefanhuber)! - Derive the whole palette from two base colours.

  A customization now names `primary_color` and `background_color` and gets the rest of the theme for free. `src/global/_color-helpers.scss` computes it: surfaces step off the background — darker in light mode, lighter in dark mode — the dark palette is the light background at low lightness, and the station icon's progress ring is the primary colour pushed far enough away from the background to stay legible on it.

  **Nine engraft variables lost their defaults and are now optional.** Naming one in a values file still wins; leaving it out derives it. A fork that sets all of them keeps exactly the colours it has today:

  - `background_color_dark`
  - `card_background_color`, `card_background_color_dark`
  - `menu_border_color`, `menu_border_color_dark`
  - `station_icon_progress_color`, `station_icon_progress_color_dark`
  - `light_color`, `light_color_dark`

  `primary_color_contrast` stays an explicit choice: Ionic's rule resolves the default primary to black text, so which text colour sits on a brand colour is a design decision rather than a calculation.

  The derived values are close enough to the hand-picked ones they replace to be indistinguishable — a 1–4 point RGB shift per channel across both shipped variants — except the station icon's progress ring, which now follows the primary colour instead of being an unrelated hand-picked colour (`#698e7c` → `#589c97` in the Animals app, `[#333333](https://github.com/smartcompanion-app/audioguide-app/issues/333333)` → `[#454545](https://github.com/smartcompanion-app/audioguide-app/issues/454545)` in Leon).

  Because the dark background is now computed by Sass, the `theme-color` meta tags can no longer be filled in at build time. `src/global/app.ts` keeps both of them on the active background colour instead, which also fixes `theme-color` under a palette forced with `UPDATE_DARK_MODE` — it never followed that before.

- [#51](https://github.com/smartcompanion-app/audioguide-app/pull/51) [`c6781e4`](https://github.com/smartcompanion-app/audioguide-app/commit/c6781e429807b3e5a55055f6c503df23e38884fe) Thanks [@stefanhuber](https://github.com/stefanhuber)! - Derive shades and tints from their base colour instead of asking for them.

  Ionic expects every themeable colour to come with a shade and a tint, and until now a customization had to supply all three: pick `primary_color`, then paste `primary_color_shade` and `primary_color_tint` in by hand from the Ionic Color Creator. But a shade and a tint are not choices — they are pure functions of the base colour, so that was busywork that also let the three values drift apart with nothing to catch it.

  `src/global/_color-helpers.scss` now reproduces Ionic's own calculation in Sass: `shade()` mixes 12% black, `tint()` mixes 10% white, both rounding channels the way the generator does. The output is identical to the generator's, not merely close — every shade and tint this repo previously hardcoded, across both the default and Leon variants, comes out byte-for-byte the same.

  **Six engraft variables are removed.** Delete them from your values file; leaving them in is harmless but they no longer do anything:

  - `primary_color_shade`, `primary_color_tint`
  - `light_color_shade`, `light_color_tint`
  - `light_color_shade_dark`, `light_color_tint_dark`

  `primary_color`, `light_color` and `light_color_dark` are unchanged and now drive their own derived values. No colour in a built app changes.
