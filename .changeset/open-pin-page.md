---
'smartcompanion-audioguide-app': patch
---

Fix a guide with a PIN never reaching the PIN page. The `/pin` route was guarded by `canLoadRoute()`, which only passes once a valid PIN has been entered, so it redirected to the loading page, which forwarded to `/pin` again. The PIN page now only requires a selected language.
