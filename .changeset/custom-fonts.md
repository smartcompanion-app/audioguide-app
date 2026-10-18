---
'smartcompanion-audioguide-app': minor
---

Make the app's font customizable through engraft. `font_family` sets the font, `font_stylesheet` names a `.scss` file with its `@font-face` rules or an `@import` of a font service such as Google Fonts, and `font_dir` names a folder of font files that the build copies to `assets/fonts/`. With offline support, self-hosted fonts are precached and Google Fonts are cached once loaded. Left unset, the app keeps Ionic's default font.
