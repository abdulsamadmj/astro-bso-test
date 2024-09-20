const CACHE_NAME = "astro-cache-v1";
const urlsToCache = [
  "/",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// Install event: caching necessary assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event: serve from cache, check for changes, and update cache if necessary
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(async (cachedResponse) => {
      const fetchRequest = event.request.clone();

      // Fetch the resource from the network
      return fetch(fetchRequest)
        .then((networkResponse) => {
          // If the server returns 304, use the cached version
          if (networkResponse.status === 304 && cachedResponse) {
            return cachedResponse;
          }

          // Otherwise, clone the network response and update the cache
          const clonedResponse = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });

          // Return the network response
          return networkResponse;
        })
        .catch(() => {
          // If fetch fails (e.g., offline), return cached response if available
          if (cachedResponse) {
            return cachedResponse;
          }

          // Optionally, handle a case where neither fetch nor cache works
          return new Response("Resource not available in cache or network", {
            status: 404,
            statusText: "Not Found",
          });
        });
    })
  );
});

// Activate event: cleanup old caches
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
