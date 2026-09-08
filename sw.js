/* ============================================================
   Service worker — shell minimal + cache runtime borné
   ------------------------------------------------------------
   - le shell applicatif est le seul contenu précaché ;
   - les payloads d'années et PDF sont récupérés à la demande ;
   - seules les réponses locales HTTP 200 réussies entrent au runtime ;
   - le runtime évince les insertions les plus anciennes au-delà de la borne.
   ============================================================ */

importScripts("./js/app-version.js");

const CACHE_PREFIX = "miftah-kanz";
const BUILD_ID = self.APP_BUILD_ID || "dev";
const SHELL_CACHE = `${CACHE_PREFIX}-shell-${BUILD_ID}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}-runtime-${BUILD_ID}`;
const CURRENT_CACHES = new Set([SHELL_CACHE, RUNTIME_CACHE]);
const RUNTIME_MAX_ENTRIES = 12;

// Shell = document, apparence, manifeste et graphe d'imports STATIQUES de
// js/main.js. Les data/years/** et les PDF sont volontairement absents.
const SHELL_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/styles.css",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./js/app-version.js",
  "./js/main.js",
  "./js/ui.js",
  "./js/store.js",
  "./js/engine.js",
  "./js/method-scripts.js",
  "./js/application/timers.js",
  "./js/application/subject-session.js",
  "./js/domain/subjects/official-coverage.js",
  "./js/domain/method/gates.js",
  "./js/domain/evaluation/text-analysis.js",
  "./js/domain/evaluation/text-evaluator.js",
  "./js/domain/evaluation/pipeline-evaluator.js",
  "./js/domain/evaluation/methodology.js",
  "./js/domain/evaluation/quality-checks.js",
  "./js/services/sound-engine.js",
  "./js/services/speech-recognition.js",
  "./js/services/diagnostics.js",
  "./js/ui/training.js",
  "./js/ui/atlas.js",
  "./js/ui/dialogs.js",
  "./js/ui/coverage-messages.js",
  "./js/ui/dom.js",
  "./js/ui/navigation.js",
  "./js/ui/operational-status.js",
  "./js/ui/screens/hub.js",
  "./js/ui/screens/guide.js",
  "./js/ui/screens/strategy.js",
  "./js/ui/screens/workspace.js",
  "./js/ui/screens/simulation.js",
  "./js/ui/workspace/feedback.js",
  "./js/ui/workspace/text-exercise.js",
  "./js/ui/workspace/pipeline-exercise.js",
  "./js/ui/workspace/scratchpad.js",
  "./js/ui/workspace/brouillon.js",
  "./js/ui/workspace/presentation.js",
  "./js/ui/workspace/quick-check.js",
  "./js/ui/accessibility.js",
  "./js/ui/demo-diagnostic.js",
  "./js/ui/keycard.js",
  "./data/subjects.js",
  "./data/archive.js",
  "./data/brouillon.js",
  "./data/calibration-status.js",
  "./data/official-tasks.js"
];

function isLocalRequest(request) {
  try {
    return new URL(request.url).origin === self.location.origin;
  } catch {
    return false;
  }
}

function isPdfRequest(request) {
  return /\/BAC2025_SVT_Sujet[12]\.pdf$/.test(new URL(request.url).pathname);
}

function isRuntimeAsset(request) {
  const pathname = new URL(request.url).pathname;
  return /\/data\/years\/(?:se|m)\/year-\d{4}\.js$/.test(pathname) || isPdfRequest(request);
}

function isCacheableResponse(response) {
  return response?.ok === true && response.status === 200 && ["basic", "default"].includes(response.type);
}

async function notifyClients(type, detail = {}) {
  try {
    const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of clients) client.postMessage({ source: "miftah-sw", type, ...detail });
  } catch {
    // Observability is best-effort and must never break a resource response.
  }
}

async function trimRuntimeCache(cache) {
  const keys = await cache.keys();
  const overflow = keys.length - RUNTIME_MAX_ENTRIES;
  if (overflow > 0) await Promise.all(keys.slice(0, overflow).map((request) => cache.delete(request)));
}

async function cacheRuntimeResponse(request, response) {
  if (!isLocalRequest(request) || !isRuntimeAsset(request) || !isCacheableResponse(response)) return false;
  const cache = await caches.open(RUNTIME_CACHE);
  // Delete + put refreshes insertion order and makes eviction deterministic.
  await cache.delete(request);
  await cache.put(request, response.clone());
  await trimRuntimeCache(cache);
  await notifyClients("runtime-cache-updated", {
    resource: isPdfRequest(request) ? "pdf" : "year-data"
  });
  return true;
}

async function fetchNavigation(request) {
  let response;
  try {
    response = await fetch(request);
  } catch {
    await notifyClients("offline-fallback", { resource: "navigation" });
    return (await caches.match("./index.html")) || Response.error();
  }
  if (isCacheableResponse(response)) {
    try {
      const shell = await caches.open(SHELL_CACHE);
      await shell.put("./index.html", response.clone());
    } catch {
      // A quota/cache failure must not replace a successful network navigation.
    }
  }
  return response;
}

async function fetchRuntime(request) {
  // Revision queries on manifest icons/PDFs must reuse the matching build cache offline.
  const cached = await caches.match(request, { ignoreSearch: true });
  if (cached) return cached;
  let response;
  try {
    response = await fetch(request);
  } catch {
    await notifyClients("offline-miss", {
      resource: isPdfRequest(request) ? "pdf" : "year-data"
    });
    return Response.error();
  }
  try {
    await cacheRuntimeResponse(request, response);
  } catch {
    // Cache writes are opportunistic; never turn HTTP 200 into a student-visible failure.
  }
  return response;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(`${CACHE_PREFIX}-`) && !CURRENT_CACHES.has(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || !isLocalRequest(request)) return;
  if (request.mode === "navigate") {
    event.respondWith(fetchNavigation(request));
    return;
  }
  if (request.headers.has("range")) return;
  event.respondWith(fetchRuntime(request));
});
