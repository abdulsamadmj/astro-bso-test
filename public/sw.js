const CACHE_NAME = "astro-cache-v1";
const urlsToCache = [
  "/", // Cache root page
  "/manifest.json", // Cache the manifest
  "/icons/icon-192x192.png", // Cache icon
  "/icons/icon-512x512.png", // Cache larger icon
];

// Install event: caching necessary assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event: serve from cache, and update the cache if necessary
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // If cached response is found, return it immediately
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise, fetch the resource from the network
      return fetch(event.request)
        .then((networkResponse) => {
          // Clone the network response before using it, so it can be put into cache
          const clonedResponse = networkResponse.clone();

          // Cache the cloned response
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });

          // Return the original network response to be used by the page
          return networkResponse;
        })
        .catch((error) => {
          console.error("Fetching failed:", error);
          throw error;
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
