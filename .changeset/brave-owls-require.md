---
'smartcompanion-audioguide-app': minor
---

The engraft template no longer repeats the sample "Animals" app as defaults. `title_short`, `title`, `description`, `lang`, `data_url`, `background_color`, `primary_color`, `logo`, `logo_dark` and `icon_source` are now optional: leaving one out of a values file leaves its target untouched, so the app keeps the value already in the repo — the same result the old defaults produced. See [`customization/leon/engraft.variables.yml`](customization/leon/engraft.variables.yml) for a values file that names them all.

**Breaking:** `messaging_support` now defaults to `"false"`. The postMessage listener is only needed when the app is embedded in an iframe, so a values file that relies on it has to set `messaging_support: "true"` explicitly.
