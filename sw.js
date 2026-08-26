/* ============================================================
   Service Worker — mode hors-ligne (PWA)
   ------------------------------------------------------------
   Met en cache l'application (HTML, CSS, JS, data, icônes, PDF
   des sujets) pour un usage fiable même sans connexion.
   ============================================================ */

importScripts("./js/app-version.js");
const CACHE = `boussole4d-${self.APP_BUILD_ID || "dev"}`;
// Keep this list aligned with every local module imported by index.html.
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/styles.css",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./js/main.js",
  "./js/app-version.js",
  "./js/ui.js",
  "./js/store.js",
  "./js/engine.js",
  "./js/method-scripts.js",
  "./js/application/timers.js",
  "./js/domain/evaluation/text-analysis.js",
  "./js/domain/evaluation/text-evaluator.js",
  "./js/domain/evaluation/pipeline-evaluator.js",
  "./js/domain/evaluation/methodology.js",
  "./js/domain/evaluation/quality-checks.js",
  "./js/services/sound-engine.js",
  "./js/services/speech-recognition.js",
  "./js/services/diagnostics.js",
  "./js/ui/atlas.js",
  "./js/ui/dialogs.js",
  "./js/ui/dom.js",
  "./js/ui/navigation.js",
  "./js/ui/screens/hub.js",
  "./js/ui/screens/guide.js",
  "./js/ui/screens/strategy.js",
  "./js/ui/screens/onboarding.js",
  "./js/ui/screens/workspace.js",
  "./js/ui/workspace/feedback.js",
  "./js/ui/workspace/text-exercise.js",
  "./js/ui/workspace/pipeline-exercise.js",
  "./js/ui/workspace/scratchpad.js",
  "./js/ui/reports/report.js",
  "./js/ui/reports/exports.js",
  "./data/subjects.js",
  "./data/brouillon.js",
  "./BAC2025_SVT_Sujet1.pdf",
  "./BAC2025_SVT_Sujet2.pdf"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  // Cache first for local resources. Only document navigations may fall back to
  // index.html: returning HTML for a missing JS module breaks offline startup.
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((hit) => {
      if (hit) return hit;
      return fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          if (res.ok && e.request.url.startsWith(self.location.origin)) {
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => {
          if (e.request.mode === "navigate") return caches.match("./index.html");
          return Response.error();
        });
    })
  );
});
