---
'smartcompanion-audioguide-app': minor
---

Update the SmartCompanion library to 2.0.0 and Ionic to 9. Pages now render into `ion-router-outlet` instead of `ion-nav`, as Ionic 9 no longer lets `ion-router` drive an `ion-nav`. The menu replaces the current history entry when choosing an entry, as before.
