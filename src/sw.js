importScripts('workbox-v7.4.1/workbox-sw.js');

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
  }),
);

// Cache assets directory with CacheFirst
routing.registerRoute(
  ({ request }) => request.url.match(/assets\/.+\..{2,}/),
  new strategies.CacheFirst({
    cacheName: 'assets-cache',
  }),
);

// Cache Google Fonts, should an app link them from its font stylesheet
routing.registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new strategies.StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  }),
);

routing.registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new strategies.CacheFirst({
    cacheName: 'google-fonts-webfonts',
  }),
);

// On activate, immediately claim all clients
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});
