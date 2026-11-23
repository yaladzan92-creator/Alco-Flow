const CACHE_NAME = "alco-flow-v2-packages-v4";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./data/model.js?v=3",
  "./data/guides.js",
  "./manifest.webmanifest",
  "./Alco_logo.png",
  "./iconfolder.png",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
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

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.protocol !== "http:" && requestUrl.protocol !== "https:") {
    return;
  }

  if (requestUrl.origin === self.location.origin && requestUrl.pathname.endsWith("/sw.js")) {
    return;
  }

  if (
    requestUrl.origin !== self.location.origin &&
    (event.request.destination === "image" || /\.(png|jpe?g|gif|webp|avif|svg)(\?|$)/i.test(requestUrl.pathname))
  ) {
    return;
  }

  const isHtmlRequest =
    event.request.mode === "navigate" ||
    requestUrl.pathname.endsWith("/index.html") ||
    (event.request.headers.get("accept") || "").includes("text/html");

  if (isHtmlRequest) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
        .then((response) => response || caches.match("./index.html"))
    );
    return;
  }

  const isAppJsRequest =
    requestUrl.origin === self.location.origin &&
    requestUrl.pathname.endsWith(".js");

  if (isAppJsRequest) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() =>
          caches.match(event.request).then((cachedResponse) =>
            cachedResponse || caches.match(event.request, { ignoreSearch: true })
          )
        )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match("./index.html");
        });
    })
  );
});
