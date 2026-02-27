/* ============================================================
   CANADIAN WX HUD — Service Worker
   Caches app shell for offline PWA support
   ============================================================ */

const CACHE_NAME = 'wxhud-v2.0.0';
const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// Pre-cache app shell on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

// Clean up old caches on activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

// Network-first for API calls, cache-first for app shell
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // API calls — always network first, no caching
  if (
    url.hostname.includes('open-meteo.com') ||
    url.hostname.includes('weather.gc.ca') ||
    url.hostname.includes('dd.weather.gc.ca') ||
    url.hostname.includes('allorigins.win') ||
    url.hostname.includes('corsproxy.io') ||
    url.hostname.includes('codetabs.com') ||
    url.hostname.includes('nominatim.openstreetmap.org') ||
    url.hostname.includes('windy.com')
  ) {
    return; // Let the browser handle these normally
  }

  // Google Fonts — cache on first use
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        });
      })
    );
    return;
  }

  // App shell — cache first, fallback to network
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
