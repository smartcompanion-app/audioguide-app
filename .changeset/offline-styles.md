---
'smartcompanion-audioguide-app': patch
---

Fix the offline app starting without its styles. `index.html` linked `build/app.css`, which the service worker does not precache, so a start without a connection only had styles if the browser's HTTP cache still held the file. It now links `/build/app.css`, which the build points at the precached, content-hashed stylesheet.
