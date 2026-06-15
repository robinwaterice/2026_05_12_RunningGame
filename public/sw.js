const CACHE_NAME = 'chameleon-game-v1';
const ASSETS = [
  '/2026_05_12_RunningGame/',
  '/2026_05_12_RunningGame/index.html',
  '/2026_05_12_RunningGame/manifest.json',
  '/2026_05_12_RunningGame/icon-192.png',
  '/2026_05_12_RunningGame/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).then((networkResponse) => {
        if (
          networkResponse.status === 200 &&
          e.request.url.startsWith(self.location.origin) &&
          e.request.url.includes('/2026_05_12_RunningGame/')
        ) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, cacheCopy);
          });
        }
        return networkResponse;
      }).catch(() => {
        return caches.match('/2026_05_12_RunningGame/index.html');
      });
    })
  );
});
