/* ============================================================
   Service Worker — mode hors-ligne (PWA)
   ------------------------------------------------------------
   Met en cache l'application (HTML, CSS, JS, data, icônes, PDF
   des sujets) pour un usage fiable même sans connexion.
   ============================================================ */

const CACHE = "boussole4d-v2-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./assets/styles.css",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./js/main.js",
  "./js/ui.js",
  "./js/store.js",
  "./js/engine.js",
  "./data/subjects.js",
  "./BAC2025_SVT_Sujet1.pdf",
  "./BAC2025_SVT_Sujet2.pdf"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  // stratégie : cache d'abord, puis réseau (offline-first)
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).then((res) => {
        const copy = res.clone();
        if (res.ok && e.request.url.startsWith(self.location.origin)) {
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
