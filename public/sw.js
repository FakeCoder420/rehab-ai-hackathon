// RehabAI Service Worker — Edge-AI, offline-first
// No patient video is ever cached or transmitted. Only app shell + model files.
const CACHE_NAME = 'rehabai-v1';
const SHELL_ASSETS = [
  '/',
  '/patient/dashboard',
  '/doctor/dashboard',
  '/login',
  '/manifest.json',
];
const MODEL_CACHE = 'rehabai-models-v1';
const MODEL_HOST = 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(SHELL_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME && k !== MODEL_CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Cache MediaPipe model files aggressively
  if (url.href.startsWith(MODEL_HOST)) {
    e.respondWith(
      caches.open(MODEL_CACHE).then(async c => {
        const cached = await c.match(e.request);
        if (cached) return cached;
        const fresh = await fetch(e.request);
        c.put(e.request, fresh.clone());
        return fresh;
      })
    );
    return;
  }
  // App shell: stale-while-revalidate
  if (e.request.mode === 'navigate') {
    e.respondWith(
      caches.match(e.request).then(cached => {
        const fresh = fetch(e.request).then(res => {
          caches.open(CACHE_NAME).then(c => c.put(e.request, res.clone()));
          return res;
        });
        return cached || fresh;
      })
    );
  }
});

// Background sync: relay queued session data when online
self.addEventListener('sync', (e) => {
  if (e.tag === 'sync-sessions') {
    e.waitUntil(syncOfflineSessions());
  }
});

async function syncOfflineSessions() {
  const allClients = await self.clients.matchAll();
  allClients.forEach(c => c.postMessage({ type: 'SYNC_COMPLETE' }));
}
