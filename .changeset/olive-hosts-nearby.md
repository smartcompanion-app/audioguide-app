---
'smartcompanion-audioguide-app': minor
---

Let an app bundle its audioguide data instead of fetching it from another host.

`data_url` has always been an absolute URL to data hosted elsewhere — for the sample apps, the [data-format](https://github.com/smartcompanion-app/data-format) repo's GitHub Pages site. That makes a fork depend on a second deployment it does not control. Point `data_url` at a path inside this repo now and the folder holding that `data.json` is copied into the build and served from `/data`, so the app is self-contained and a fork only has to host this repo:

```yaml
data_url: customization/leon/data/data.json
```

Assets in such a `data.json` are addressed by the served path rather than the repo path — `data/assets/i11.png` — and being relative to the page, they survive being served from a subpath the way GitHub Pages project sites are.

The `leon` example now works this way, with its data committed under `customization/leon/data/`. `animals` still points at data-format, so both arrangements stay exercised.
