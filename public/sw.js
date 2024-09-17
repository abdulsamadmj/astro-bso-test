const CACHE_NAME = "your-cache-name-v1";
const urlsToCache = [
  "/",
  "/styles/main.css",
  "/scripts/main.js",
  // Add other assets to cache here
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  // Avoid caching POST requests
  if (event.request.method === "POST") {
    event.respondWith(
      fetch(event.request)
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((fetchResponse) => {
          // Only cache GET requests
          if (event.request.method === "GET") {
            const cacheResponse = caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
            return cacheResponse;
          }
          return fetchResponse;
        })
      );
    })
  );
});
