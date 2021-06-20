const CACHE_NAME = "cache-v1";
const FILES_TO_CACHE = ["/"];

// https://www.kaliop.com/fr/les-service-workers-vers-la-pwa/

self.addEventListener("install", (e) => {
  e.waitUntile(
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys.then((keys) => {
      return Promise.all(
        keys.filter((key) => key != CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // IMPORTANT: Cloner la requête.
      // Une requete est un flux et est à consommation unique
      // Il est donc nécessaire de copier la requete pour pouvoir l'utiliser et la servir
      let fetchRequest = e.request.clone();

      return fetch(fetchRequest).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // IMPORTANT: Même constat qu'au dessus, mais pour la mettre en cache
        let responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseToCache);
        });

        return response;
      });
    })
  );
});
