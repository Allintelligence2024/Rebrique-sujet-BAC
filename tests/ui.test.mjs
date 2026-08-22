/* ============================================================
   Tests d'intégration UI (bout-en-bout avec jsdom)
   ------------------------------------------------------------
   Prérequis : npm i  (installe jsdom), puis  npm test
   Le DOM est construit au niveau module (avant l'enregistrement
   des tests) pour garantir le même contexte d'exécution.
   ============================================================ */
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { JSDOM } = require("jsdom");
const __dirname = dirname(fileURLToPath(import.meta.url));

// --- configuration au niveau module (même contexte que les tests) ---
const html = readFileSync(join(__dirname, "..", "index.html"), "utf8");
const dom = new JSDOM(html, { url: "http://localhost/" });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.localStorage = dom.window.localStorage;
dom.window.scrollTo = () => {};
const { init } = await import("../js/ui.js");
init();

after(async () => {
  const { timers } = await import("../js/engine.js");
  timers.stopAll();
  try { dom.window.close(); } catch (e) {}
});

const $ = (s) => globalThis.document.querySelector(s);
const $$ = (s) => [...globalThis.document.querySelectorAll(s)];
function click(sel) {
  const e = $(sel);
  if (!e) throw new Error(`introuvable: ${sel}`);
  e.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
}

test("le hub affiche les années (2025 active, 2024/2023 désactivées)", () => {
  assert.equal($$("#year-grid .year-card").length, 3);
  assert.equal($('#year-grid [data-year="2025"]').disabled, false);
  assert.equal($('#year-grid [data-year="2024"]').disabled, true);
  assert.equal($('#year-grid [data-year="2023"]').disabled, true);
});

test("le parcours aboutit au workspace via l'exercice pipeline", () => {
  click('#year-grid [data-year="2025"]');
  click("#guide-next");
  click('#view-strategy [data-confirm="1"]');
  click('#view-onboarding [data-ex="3"]');
  assert.ok(!$("#view-workspace").classList.contains("hidden"));
  assert.equal($$("#blocks-bank [data-block]").length, 8);
});

test("le pipeline parfait est noté 1.50 / 1.50 (pôle W)", () => {
  for (const id of ["b1","b2","b3","b4","b5","b6","b7","b8"]) click(`#blocks-bank [data-block="${id}"]`);
  click('#ex-content [data-polo-check="W"]');
  const fb = $("#fb-W").textContent.trim();
  assert.match(fb, /1\.50 \/ 1\.50ن/);
  assert.match(fb, /8\/8/);
});

test("l'évaluation texte (exercice 1, pôle N) renvoie un feedback", () => {
  click('#view-workspace [data-switch="1"]');
  $("#fld-N").value = "الأدينوزين يثبط اليقظة عبر الارتباط بالمستقبلات الغشائية";
  click('#ex-content [data-check="N"]');
  assert.match($("#fb-N").textContent.trim(), /النتيجة/);
});

test("le rapport de résultats s'ouvre avec les boutons d'export", () => {
  click("#ws-report");
  assert.ok($(".modal"));
  assert.ok($("#dl-csv"));
  assert.ok($("#dl-json"));
});
