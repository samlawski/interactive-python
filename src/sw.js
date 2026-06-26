/* ===================================================================
   sw.js — Service Worker (offline-first for exam pages)
   ===================================================================
   Strategy:
   - Pyodide files (/pyodide/*): cache-first.  Precached during SW
     install so they are available even before the first page load
     completes.  Pyodide's internal fetches (asm.wasm, stdlib.zip, …)
     happen dynamically and would miss the SW on the very first visit
     (race condition), so install-time precaching is essential.
   - Everything else (HTML, CSS, JS assets): network-first with cache
     fallback, so pages always reflect the latest server content when
     online and still work when offline.
   =================================================================== */

const CACHE = 'exam-v3';

/* ------------------------------------------------------------------ */
/*  Pyodide precache list                                              */
/*  sw.js sits next to the pyodide/ directory, so URLs are relative   */
/*  to self.location (e.g. https://host/pyodide/pyodide.js).          */
/* ------------------------------------------------------------------ */

const PYODIDE_BASE = new URL('./pyodide/', self.location).href;

/* Core files that loadPyodide() fetches internally and that would
   otherwise miss the SW on the very first page load. */
const PYODIDE_FILES = [
  'pyodide.js',
  'pyodide.asm.js',
  'pyodide.asm.wasm',
  'python_stdlib.zip',
  'pyodide-lock.json',
];

/* ------------------------------------------------------------------ */
/*  Install — precache Pyodide immediately (best-effort)              */
/* ------------------------------------------------------------------ */

self.addEventListener('install', (event) => {
  self.skipWaiting();

  /* Precache Pyodide files so the very first offline visit works.
     Failures are swallowed — the SW still installs successfully so
     the network-first fetch handler can try again later. */
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(
        PYODIDE_FILES.map((file) => {
          const url = PYODIDE_BASE + file;
          return fetch(url)
            .then((res) => { if (res.ok) cache.put(url, res); })
            .catch(() => {});
        }),
      ),
    ),
  );
});

/* ------------------------------------------------------------------ */
/*  Activate — purge old caches, claim clients                        */
/* ------------------------------------------------------------------ */

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
      ))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll())
      .then((clients) => {
        clients.forEach((client) =>
          client.postMessage({ type: 'CACHE_URLS' }),
        );
      }),
  );
});

/* ------------------------------------------------------------------ */
/*  Message — cache URLs reported by the page                         */
/* ------------------------------------------------------------------ */

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_URLS' && event.data.urls) {
    event.waitUntil(
      caches.open(CACHE).then((cache) =>
        Promise.all(
          event.data.urls.map((url) =>
            fetch(url)
              .then((res) => { if (res.ok) cache.put(url, res); })
              .catch(() => {}),
          ),
        ),
      ),
    );
  }
});

/* ------------------------------------------------------------------ */
/*  Fetch — Pyodide: cache-first  |  everything else: network-first   */
/* ------------------------------------------------------------------ */

self.addEventListener('fetch', (event) => {
  const request = event.request;

  /* Only handle GET requests */
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isPyodide = url.pathname.includes('/pyodide/');

  if (isPyodide) {
    /* Cache-first: large immutable binaries; serve instantly offline.
       If not yet cached (edge case), fetch, cache, and return. */
    event.respondWith(
      caches.match(request, { ignoreSearch: true }).then(
        (cached) => cached || fetch(request).then((res) => {
          if (res.ok) {
            caches.open(CACHE).then((cache) => cache.put(request, res.clone()));
          }
          return res;
        }),
      ),
    );
  } else {
    /* Network-first: always try to get the latest version; fall back
       to cache when offline. */
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
  }
});
