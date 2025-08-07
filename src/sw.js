importScripts('workbox-v7.3.0/workbox-sw.js');

workbox.routing.registerRoute(
  ({ request }) => request.url.match(/files\/[abcdef0-9]+\./),
  new workbox.strategies.CacheFirst()
);

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
