/* ===================================================================
   sw.js — Service Worker (Network-first with cache fallback)
   ===================================================================
   Strategy: Always fetch from the network when online (ensuring the
   latest server version). Cache every successful response so the page
   works offline when WiFi is turned off.
   =================================================================== */

const CACHE = 'exam-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        /* Cache successful responses for offline use */
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() =>
        /* Network unavailable — serve from cache */
        caches
          .match(event.request)
          .then((cached) => cached || new Response('Offline', { status: 503 })),
      ),
  );
});
