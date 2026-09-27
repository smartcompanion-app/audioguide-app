---
'smartcompanion-audioguide-app': patch
---

Fix the menu showing a language item in a single-language app. The menu only refreshed on navigation to `/stations/default`, so reloading on any other route — which the loading page forwards to directly — kept the initial state, including a language item that should be hidden. The menu now refreshes on every route change.
