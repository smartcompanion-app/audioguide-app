importScripts('workbox-v7.3.0/workbox-sw.js');

workbox.routing.registerRoute(
  // it is assumed that cachable assets are in the 'assets' directory
  ({ request }) => request.url.match(/assets\/.+\..{2,}/),
  new workbox.strategies.CacheFirst()
);

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
