/* ===================================================================
   sw.js — Service Worker (Network-first with cache fallback)
   ===================================================================
   Strategy: Always fetch from the network when online (ensuring the
   latest server version). Cache every successful response so the page
   works offline when WiFi is turned off.
   =================================================================== */

const CACHE = 'exam-v2';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    /* Clean up old caches, then claim clients immediately */
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
      ))
      .then(() => self.clients.claim())
      .then(() => {
        /* After claiming, ask every client to report its resources
           so we can precache them (covers the very first visit). */
        return self.clients.matchAll();
      })
      .then((clients) => {
        clients.forEach((client) =>
          client.postMessage({ type: 'CACHE_URLS' }),
        );
      }),
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_URLS' && event.data.urls) {
    event.waitUntil(
      caches.open(CACHE).then((cache) =>
        Promise.all(
          event.data.urls.map((url) =>
            fetch(url)
              .then((res) => {
                if (res.ok) cache.put(url, res);
              })
              .catch(() => {}),
          ),
        ),
      ),
    );
  }
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  /* Only handle GET requests */
  if (request.method !== 'GET') return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(request, { ignoreSearch: true }).then(
          (cached) => cached || new Response('Offline', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' },
          }),
        ),
      ),
  );
});
