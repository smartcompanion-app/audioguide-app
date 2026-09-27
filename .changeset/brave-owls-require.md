---
'smartcompanion-audioguide-app': minor
---

**Breaking:** the engraft template no longer falls back to the sample "Animals" app. `title_short`, `title`, `description`, `lang`, `data_url`, `background_color`, `primary_color`, `logo`, `logo_dark` and `icon_source` have no defaults, so a values file must name each of them — see [`customization/leon/engraft.variables.yml`](customization/leon/engraft.variables.yml) for a complete example.

`messaging_support` now defaults to `"false"`: the postMessage listener is only needed when the app is embedded in an iframe, so set it to `"true"` explicitly if you rely on it.
