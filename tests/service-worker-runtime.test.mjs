import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = `${readFileSync(join(root, "sw.js"), "utf8")}\nglobalThis.__swTest = { cacheRuntimeResponse, fetchNavigation, fetchRuntime, isCacheableResponse, isRuntimeAsset, trimRuntimeCache, RUNTIME_MAX_ENTRIES, RUNTIME_CACHE, SHELL_CACHE };`;

class MemoryCache {
  constructor() {
    this.entries = new Map();
  }
  key(request) {
    return typeof request === "string" ? new URL(request, "https://app.test/").href : request.url;
  }
  async put(request, response) {
    this.entries.set(this.key(request), response);
  }
  async delete(request) {
    return this.entries.delete(this.key(request));
  }
  async keys() {
    return [...this.entries.keys()].map((url) => new globalThis.Request(url));
  }
  async match(request) {
    return this.entries.get(this.key(request));
  }
}

function harness(
  fetchImpl = async () => {
    throw new Error("network not configured");
  }
) {
  const stores = new Map();
  const caches = {
    async open(name) {
      if (!stores.has(name)) stores.set(name, new MemoryCache());
      return stores.get(name);
    },
    async keys() {
      return [...stores.keys()];
    },
    async delete(name) {
      return stores.delete(name);
    },
    async match(request) {
      for (const cache of stores.values()) {
        const hit = await cache.match(request);
        if (hit) return hit;
      }
      return undefined;
    }
  };
  const listeners = {};
  const self = {
    APP_BUILD_ID: "abcdef123456",
    location: { origin: "https://app.test" },
    clients: {
      async matchAll() {
        return [];
      },
      async claim() {}
    },
    skipWaiting: async () => {},
    addEventListener(type, listener) {
      listeners[type] = listener;
    }
  };
  const context = vm.createContext({
    caches,
    self,
    Request: globalThis.Request,
    Response,
    URL,
    fetch: fetchImpl,
    importScripts() {},
    console
  });
  vm.runInContext(source, context);
  return { api: context.__swTest, caches, listeners, stores };
}

test("la politique runtime refuse échec, redirection opaque et ressource hors périmètre", async () => {
  const { api, caches } = harness();
  const year = new globalThis.Request("https://app.test/data/years/se/year-2025.js");
  const external = new globalThis.Request("https://cdn.example/data/years/se/year-2025.js");

  assert.equal(api.isRuntimeAsset(year), true);
  assert.equal(api.isRuntimeAsset(external), true, "le filtre d'origine est appliqué avant cette fonction");
  assert.equal(api.isCacheableResponse(new Response("missing", { status: 404 })), false);
  assert.equal(api.isCacheableResponse(new Response("error", { status: 500 })), false);
  assert.equal(await api.cacheRuntimeResponse(year, new Response("missing", { status: 404 })), false);
  assert.equal(await api.cacheRuntimeResponse(external, new Response("ok")), false);
  const runtime = await caches.open(api.RUNTIME_CACHE);
  assert.equal((await runtime.keys()).length, 0);
});

test("une réponse locale 200 est stockée et l'éviction respecte strictement la borne", async () => {
  const { api, caches } = harness();
  const runtime = await caches.open(api.RUNTIME_CACHE);
  const first = new globalThis.Request("https://app.test/data/years/se/year-2000.js");
  for (let year = 2000; year < 2000 + api.RUNTIME_MAX_ENTRIES + 3; year += 1) {
    const request = new globalThis.Request(`https://app.test/data/years/se/year-${year}.js`);
    assert.equal(await api.cacheRuntimeResponse(request, new Response(`year-${year}`)), true);
  }
  const keys = await runtime.keys();
  assert.equal(keys.length, api.RUNTIME_MAX_ENTRIES);
  assert.equal(await runtime.match(first), undefined, "l'insertion la plus ancienne doit être évincée");
  assert.ok(await runtime.match(new globalThis.Request("https://app.test/data/years/se/year-2014.js")));
});

test("une réponse 500 ne remplace jamais une entrée saine déjà mise en cache", async () => {
  const { api, caches } = harness();
  const request = new globalThis.Request("https://app.test/BAC2025_SVT_Sujet1.pdf?v=2f81965e9afd");
  assert.equal(await api.cacheRuntimeResponse(request, new Response("pdf-ok")), true);
  assert.equal(await api.cacheRuntimeResponse(request, new Response("server-error", { status: 500 })), false);
  const cached = await (await caches.open(api.RUNTIME_CACHE)).match(request);
  assert.equal(await cached.text(), "pdf-ok");
});

test("un échec d’écriture du cache ne masque jamais une réponse réseau réussie", async () => {
  const networkBody = "fresh-network-response";
  const { api, caches } = harness(async () => new Response(networkBody));
  const runtime = await caches.open(api.RUNTIME_CACHE);
  runtime.put = async () => {
    throw new globalThis.DOMException("quota", "QuotaExceededError");
  };
  const request = new globalThis.Request("https://app.test/data/years/se/year-2025.js");
  const response = await api.fetchRuntime(request);
  assert.equal(response.status, 200);
  assert.equal(await response.text(), networkBody);

  const shell = await caches.open(api.SHELL_CACHE);
  shell.put = runtime.put;
  const navigation = await api.fetchNavigation(new globalThis.Request("https://app.test/index.html"));
  assert.equal(navigation.status, 200);
  assert.equal(await navigation.text(), networkBody);
});
