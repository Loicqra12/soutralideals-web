const CACHE_NAME = "soutrali-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/logo.png",
  "/brand/logo.png",
  "/offline",
];

// Installation : mise en cache des assets statiques
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
  self.skipWaiting();
});

// Activation : nettoyage des anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
      ),
    ),
  );
  self.clients.claim();
});

// Stratégie : Network First (API) / Cache First (assets statiques)
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Ne pas cacher les requêtes API ou auth
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/api/auth/")) {
    return;
  }

  // Cache First pour les assets statiques (images, fonts, JS, CSS)
  if (
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg|ico|woff|woff2|css|js)$/)
  ) {
    event.respondWith(
      caches.match(event.request).then(
        (cached) =>
          cached ||
          fetch(event.request).then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) =>
              cache.put(event.request, clone),
            );
            return response;
          }),
      ),
    );
    return;
  }

  // Network First pour les pages HTML
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) =>
          cache.put(event.request, clone),
        );
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (event.request.mode === "navigate") {
          return caches.match("/offline");
        }
      }),
  );
});
