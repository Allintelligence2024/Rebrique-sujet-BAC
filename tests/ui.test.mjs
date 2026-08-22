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

test("le hub affiche les années (2025 et 2024 actives, 2023 désactivée)", () => {
  assert.equal($$("#year-grid .year-card").length, 3);
  assert.equal($('#year-grid [data-year="2025"]').disabled, false);
  assert.equal($('#year-grid [data-year="2024"]').disabled, false);
  assert.equal($('#year-grid [data-year="2023"]').disabled, true);
});

test("l'ouverture de l'Atlas 4D affiche les onglets, la recherche et les flashcards interactives", () => {
  click("#btn-atlas");
  assert.ok($(".drawer.open"));
  assert.ok($("#atlas-search-input"));
  assert.ok($$(".atlas-tab-btn").length >= 4);

  // Switch to flashcards
  const flashcardTab = $('[data-cat="flashcards"]');
  assert.ok(flashcardTab);
  flashcardTab.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
  assert.ok($$(".flashcard").length > 0);

  // Click on a flashcard to reveal
  const firstCard = $(".flashcard");
  firstCard.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
  assert.ok(firstCard.classList.contains("revealed"));
});

test("le bouton d'ambiance sonore permet de cycler entre les modes de relaxation", async () => {
  const { soundEngine } = await import("../js/engine.js");
  const initial = soundEngine.currentMode;
  click("#btn-hub-sound");
  assert.notEqual(soundEngine.currentMode, initial);
  soundEngine.stop();
});

test("l'ouverture des أدعية وأذكار الامتحان affiche les invocations prophétiques et coraniques", () => {
  click("#btn-hub-adkar");
  assert.ok($(".modal"));
  assert.match($(".modal").textContent, /أدعية وأذكار/);
  assert.match($(".modal").textContent, /سورة طه/);
  click('[data-close="ok"]');
  assert.equal($(".modal"), null);
});

test("le parcours aboutit au workspace via l'exercice pipeline", () => {
  click('#year-grid [data-year="2025"]');
  // Vérifie la présence des Adkar dans l'écran de guide / sérénité
  assert.ok($(".adkar-section"));
  assert.ok($$(".adkar-card").length >= 6);
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

test("l'évaluation texte (exercice 1, pôle N) renvoie un feedback et l'accordéon de corrigé officiel", () => {
  click('#view-workspace [data-switch="1"]');
  $("#fld-N").value = "الأدينوزين يثبط اليقظة عبر الارتباط بالمستقبلات الغشائية";
  click('#ex-content [data-check="N"]');
  assert.match($("#fb-N").textContent.trim(), /النتيجة/);
  const modelBox = $("#fb-N details.model-box");
  assert.ok(modelBox, "L'accordéon de corrigé officiel doit être présent");
  assert.match(modelBox.textContent, /الإجابة النموذجية/);
});

test("le rapport de résultats s'ouvre avec les boutons d'export et le bouton d'impression PDF", () => {
  click("#ws-report");
  assert.ok($(".modal"));
  assert.ok($("#dl-csv"));
  assert.ok($("#dl-json"));
  assert.ok($("#btn-print-exam"));
});

test("la réinitialisation de session efface l'état et ramène au hub", async () => {
  click("#ws-reset");
  assert.ok($(".modal"));
  click("#reset-yes");
  const { store } = await import("../js/store.js");
  assert.equal(store.state.sessionActive, false);
  assert.ok(!$("#view-hub").classList.contains("hidden"));
});

test("rechargement : restauration exacte de l'écran et de la session", async () => {
  const { store } = await import("../js/store.js");
  // Simule une session active en cours sur l'espace de travail
  store.enterSession("2025", 1);
  store.setActiveExercise(2);
  store.setActiveStep(3);
  store.setActiveScreen("view-workspace");
  store.save();

  // Relance init (simulation F5 / reload)
  const { init } = await import("../js/ui.js");
  init();

  assert.ok(!$("#view-workspace").classList.contains("hidden"));
  assert.ok(!$("#global-timer-bar").classList.contains("hidden"));
  assert.equal(store.state.activeExercise, 2);
  assert.equal(store.state.activeStep, 3);
});

test("les boutons d'إملاء صوتي (dictée vocale) sont bien présents sur les champs", () => {
  const micBtns = $$(".btn-mic");
  assert.ok(micBtns.length > 0);
  // Clic sur le bouton de dictée ne doit pas planter (gestion gracieuse de jsdom sans Web Speech API)
  micBtns[0].dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
  assert.ok($("#toast-zone").children.length > 0);
});
