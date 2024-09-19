const CACHE_NAME = "astro-cache-v1";
const urlsToCache = [
  "/", // The root page of your application
  "/products",
  "/user/cart",
  "/manifest.json", // Cache the manifest
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// Install the service worker and cache the specified URLs
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Handle fetch events, cache GET requests, and update the cache if necessary
self.addEventListener("fetch", (event) => {
  if (event.request.method === "POST") {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (event.request.method === "GET") {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      });

      // Serve from the cache if available, otherwise fetch from the network
      return cachedResponse || fetchPromise;
    })
  );
});

// Activate and clean up old caches when a new ServiceWorker is activated
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});