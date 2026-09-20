/* ============================================================
   Notifications — la zone d'annonces ne dépend plus d'un ordre
   ------------------------------------------------------------
   `init()` installe le rappel du minuteur global avant de créer
   `#toast-zone` ; `toast()` sortait silencieusement quand la zone
   n'existait pas encore. Aucun minuteur ne démarre assez tôt pour
   déclencher ce cas, mais la dépendance d'ordre restait une dette
   (analyse §10.1 S2.6) : un tir précoce (test, restauration d'état,
   futur démarrage automatique) aurait perdu le message, et une page
   sans `#toast-zone` n'aurait jamais rien annoncé.

   Le test vérifie la propriété qui compte : `notify()` fabrique la
   zone lui-même, la garde annoncée reste accessible (`aria-live`), et
   les niveaux d'urgence produisent le bon `role`.
   ============================================================ */
import { after, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { JSDOM } = require("jsdom");
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(root, "index.html"), "utf8");
const dom = new JSDOM(html, { url: "http://localhost/" });

globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.localStorage = dom.window.localStorage;
dom.window.scrollTo = () => {};

const { init, notify } = await import("../js/ui.js");
const { store } = await import("../js/store.js");
const { timers } = await import("../js/engine.js");

after(() => {
  timers.stopAll();
  dom.window.close();
});

test("la zone d'annonces est créée à la demande, jamais supposée présente", async () => {
  await init();
  const zone = document.querySelector("#toast-zone");
  assert.ok(zone, "init() doit disposer d'une zone d'annonces");
  // On simule le cas de la dette : la zone disparaît du DOM.
  zone.remove();
  assert.equal(document.querySelector("#toast-zone"), null);

  notify("رسالة اختبار", "info");

  const rebuilt = document.querySelector("#toast-zone");
  assert.ok(rebuilt, "notify() doit reconstruire la zone manquante");
  assert.equal(rebuilt.getAttribute("aria-live"), "polite");
  assert.equal(rebuilt.getAttribute("aria-label"), "الإشعارات");
  const toasts = rebuilt.querySelectorAll(".toast");
  assert.equal(toasts.length, 1, "le message ne doit plus être perdu");
  assert.equal(toasts[0].getAttribute("role"), "status");
  assert.match(toasts[0].textContent, /رسالة اختبار/);
});

test("les niveaux d'urgence produisent le rôle attendu et une seule zone", () => {
  const before = document.querySelectorAll("#toast-zone").length;
  notify("تنبيه", "warn");
  notify("خطأ", "error");
  notify("نجاح", "success");
  assert.equal(document.querySelectorAll("#toast-zone").length, before, "jamais deux zones");
  const toasts = [...document.querySelectorAll("#toast-zone .toast")];
  assert.deepEqual(
    toasts.map((t) => t.getAttribute("role")),
    ["status", "alert", "alert", "status"],
    "warn/error sont des alertes, info/success des statuts"
  );
});

test("l'écran reste annonçable après un retour au hub", async () => {
  store.reset();
  notify("بعد إعادة التعيين", "info");
  const zone = document.querySelector("#toast-zone");
  assert.ok(zone);
  assert.match(zone.textContent, /بعد إعادة التعيين/);
});
