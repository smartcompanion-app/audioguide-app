---
'smartcompanion-audioguide-app': minor
---

Update the SmartCompanion library to 2.1.0 and the native audio player to 2. The audio slider follows the player's progress instead of polling it, a completed audio stays rewound instead of starting over, and listening time no longer carries over from a stopped audio. Stations with a single image, without images or audio, or with several audios show up correctly, and a failing data update no longer escapes loading as an unhandled rejection.
