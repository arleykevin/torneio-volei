const CACHE_NAME = 'volei-arena-v3.3.0';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './audio/matchpoint_t1.mp3',
  './audio/matchpoint_t2.mp3',
  './audio/matchpoint_t3.mp3',
  './audio/matchpoint_t4.mp3',
  './audio/victory_t1.mp3',
  './audio/victory_t2.mp3',
  './audio/victory_t3.mp3',
  './audio/victory_t4.mp3',
  './beach-volleyball-svgrepo-com.svg',
  './man-playing-volleyball-svgrepo-com.svg',
  './volleyball-ball-svgrepo-com.svg',
  './volleyball-game-svgrepo-com.svg',
  './volleyball-motion-svgrepo-com.svg',
  './volleyball-player-motion-svgrepo-com.svg',
  './volleyball-silhouette-svgrepo-com.svg',
  './volleyball-svgrepo-com.svg',
  './volleyball-svgrepo-com (1).svg',
  './volleyball-svgrepo-com (2).svg',
  './volleyball-svgrepo-com (3).svg',
  './volleyball-svgrepo-com (4).svg',
  './volleyball-svgrepo-com (5).svg',
  './volleyball-svgrepo-com (6).svg',
  './volleyball-svgrepo-com (7).svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (networkResponse.type === 'basic' || networkResponse.type === 'cors')
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
