const CACHE_NAME = "soutrali-v3";
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

// Le Cache Storage n'accepte que les GET : toute autre méthode doit
// court-circuiter le service worker pour laisser remonter la vraie réponse.
function isCacheable(request) {
  return request.method === "GET";
}

// Stratégie : Network First (API) / Cache First (assets statiques)
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Non-GET (POST login, upload, etc.) : le navigateur gère seul la requête,
  // sinon une erreur réseau serait masquée en net::ERR_FAILED.
  if (!isCacheable(request)) {
    return;
  }

  const url = new URL(request.url);

  // Requêtes API et auth : réseau direct, jamais de cache.
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // Cache First pour les assets statiques (images, fonts, JS, CSS)
  if (
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg|ico|woff|woff2|css|js)$/)
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches
                .open(CACHE_NAME)
                .then((cache) => cache.put(request, clone))
                .catch(() => {});
            }
            return response;
          }),
      ),
    );
    return;
  }

  // Network First pour les pages HTML
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(request, clone))
            .catch(() => {});
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === "navigate") {
          const offline = await caches.match("/offline");
          if (offline) return offline;
        }
        return Response.error();
      }),
  );
});
