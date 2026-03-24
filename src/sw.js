importScripts('workbox-v7.4.0/workbox-sw.js');

const { precaching, routing, strategies } = workbox;

// Clean up old precache versions on update
precaching.cleanupOutdatedCaches();

// Precache and route the app shell (JS, CSS, HTML, etc.)
precaching.precacheAndRoute(self.__WB_MANIFEST);

// Cache the external data JSON with NetworkFirst strategy
// Fresh data when online, falls back to cache when offline
routing.registerRoute(
  ({ url }) => url.pathname.endsWith('/data.json'),
  new strategies.NetworkFirst({
    cacheName: 'data-cache',
  })
);

// Cache assets directory with CacheFirst
routing.registerRoute(
  ({ request }) => request.url.match(/assets\/.+\..{2,}/),
  new strategies.CacheFirst({
    cacheName: 'assets-cache',
  })
);

// On activate, immediately claim all clients
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});
