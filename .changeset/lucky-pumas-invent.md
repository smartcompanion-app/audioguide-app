---
'smartcompanion-audioguide-app': minor
---

Generate the whole PWA icon set from a single source image.

An app named three icon files — `favicon`, `icon_192` and `icon_512` — and had to keep them in step by hand. It now names one, and [`scripts/generate-icons.mjs`](scripts/generate-icons.mjs) derives the set at build time into a gitignored folder the build copies in as `assets/icon/`. Nothing derived is committed:

```yaml
icon_source: customization/leon/assets/app-icon-512.png
```

**Breaking:** `favicon`, `icon_192` and `icon_512` are gone — replace all three with `icon_source`. Its path is repo-relative, like `data_url`, rather than relative to the values file the way the old file paths were.

This fixes a defect the template handed to every app. The manifest declared the same two PNGs twice, once as `purpose: "any"` and once as `purpose: "maskable"`, and no single image is correct for both: a maskable icon is cropped to the platform's shape within a safe zone, so one that fills its canvas loses its edges, while one padded to survive that floats when drawn whole. There is now a real `maskable-icon-512x512.png`, alongside the 64px icon and the 180px Apple touch icon the set was missing. The Apple icon is opaque, because iOS composites transparency onto black.

`icon_background` fills the margin around the padded maskable and Apple icons. Left unset it is sampled from the source image's own corners, which is why neither example app had to name it: `animals` resolves to `#8dbeba` and `leon` to `#ebebeb`, each the ground its own artwork already sits on. A source whose corners disagree — a photograph, a gradient — or are transparent falls back to `background_color`, and the build logs which rule applied.

An SVG source is preferred and is rasterized at full density for every size, but any format works. Generation adds two build-time dependencies, `sharp` and `png-to-ico`.
