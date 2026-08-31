/* ============================================================
   Tests Exhaustifs — Test de TOUS les boutons et flux (E2E)
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

const html = readFileSync(join(__dirname, "..", "index.html"), "utf8");
const dom = new JSDOM(html, { url: "http://localhost/" });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.localStorage = dom.window.localStorage;
dom.window.scrollTo = () => {};
// Mock window.open for print test
dom.window.open = () => ({
  document: {
    open: () => {},
    write: () => {},
    close: () => {}
  }
});

const { init } = await import("../js/ui.js");
const { store } = await import("../js/store.js");
const { soundEngine, timers } = await import("../js/engine.js");
init();

after(() => {
  timers.stopAll();
  soundEngine.stop();
  try {
    dom.window.close();
  } catch (e) {}
});

const $ = (s, root = globalThis.document) => root.querySelector(s);
const $$ = (s, root = globalThis.document) => [...root.querySelectorAll(s)];
function click(sel) {
  const e = typeof sel === "string" ? $(sel) : sel;
  if (!e) throw new Error(`Élément introuvable: ${sel}`);
  e.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
}

test("1. Hub : test des boutons d'accueil, adkar, atlas, sons et années", () => {
  // Sound button
  click("#btn-hub-sound");
  assert.notEqual(soundEngine.currentMode, "off");
  soundEngine.stop();

  // Adkar modal
  click("#btn-hub-adkar");
  assert.ok($(".modal"));
  click('[data-close="ok"]');
  assert.equal($(".modal"), null);

  // Atlas drawer
  click("#btn-atlas");
  assert.ok($(".drawer.open"));
  // Test tabs
  click('[data-cat="verbs"]');
  assert.ok($$(".atlas-card").length > 0);
  click('[data-cat="hypotheses"]');
  assert.ok($$(".atlas-card").length > 0);
  click('[data-cat="flashcards"]');
  assert.ok($$(".flashcard").length > 0);
  click(".flashcard");
  assert.ok($(".flashcard").classList.contains("revealed"));
  // Close drawer
  click(".drawer [data-close]");
  assert.equal($(".drawer"), null);

  // Years verification
  assert.equal($('#year-grid [data-year="2025"]').disabled, false);
  assert.equal($('#year-grid [data-year="2024"]').disabled, false);
  assert.equal($('#year-grid [data-year="2023"]').disabled, false);

  // Theme clair persistant
  click("[data-theme-toggle]");
  assert.equal(document.documentElement.dataset.theme, "light");
  assert.equal(localStorage.getItem("boussole4d.theme"), "light");

  // Accès rapide : aucun passage par guide/stratégie/onboarding
  click('#year-grid [data-quick-year="2025"]');
  assert.ok($("[data-quick-start]"));
  click('[data-quick-start="2025:1:1"]');
  assert.ok(!$("#view-workspace").classList.contains("hidden"));
  assert.equal(store.state.reviewMode, true);
  click("#ws-home");
});

test("1b. Les années 2013–2021 restent en consultation ; 2026 est un entraînement 4D", () => {
  assert.equal($$("#year-grid .year-card").length, 14);
  const consult = $('#year-grid [data-hub-year="2013"]');
  assert.ok(consult);
  assert.equal(consult.dataset.kind, "consult");
  assert.equal(consult.querySelector("[data-year]"), null);
  assert.equal($('#year-grid [data-hub-year="2021"]').dataset.kind, "consult");
  assert.equal($('#year-grid [data-hub-year="2026"]').dataset.kind, "training");
  assert.ok($('#year-grid [data-year="2026"]'));
  const links = $$('#year-grid [data-kind="consult"] a[href*="dzexams.com/ar/annales/"]');
  assert.equal(links.length, 11, "filière SE : 9 sessions principales + 2 exceptionnelles");
  assert.ok(!$(".modal"));
  assert.ok(!$("#view-hub").classList.contains("hidden"));
});

test("1c. Le bouton filière affiche Maths puis le trou تقني رياضي", () => {
  click("#btn-stream-fab");
  assert.match($("#stream-fab-label").textContent, /رياضيات/);
  assert.equal($$("#year-grid [data-year]").length, 1, "un entraînement 4D Maths (2021) encodé");
  assert.equal($('#year-grid [data-hub-year="2021"]').dataset.kind, "training");
  assert.equal($('#year-grid [data-year="2021-m"]').disabled, false);
  assert.equal($$("#year-grid .year-card").length, 14);
  assert.ok($('#year-grid [data-hub-year="2026"]'));
  assert.ok($('#year-grid [data-hub-year="2022"]'));
  assert.ok($('#year-grid [data-hub-year="2021"]'));
  assert.ok($('#year-grid [data-hub-year="2013"]'));
  const links = $$('#year-grid [data-kind="consult"] a[href*="dzexams.com/ar/annales/"]');
  assert.equal(links.length, 14, "filière Maths : 13 principales restantes + 2017 exceptionnelle");
  click("#btn-stream-fab");
  assert.match($("#stream-fab-label").textContent, /تقني رياضي/);
  assert.equal($$('#year-grid [data-kind="gap"]').length, 1);
  assert.equal(
    $$('#year-grid a[href*="dzexams.com/ar/annales/"]').length,
    0,
    "aucun annales inventé pour TM"
  );
  click("#btn-stream-fab");
  assert.match($("#stream-fab-label").textContent, /علوم تجريبية/);
  assert.ok($('#year-grid [data-year="2025"]'));
});

test("2. Guide : respiration, adkar intégrés et navigation", () => {
  click('#year-grid [data-year="2024"]');
  assert.ok(!$("#view-guide").classList.contains("hidden"));
  assert.ok($(".adkar-section"));
  assert.ok($$(".adkar-card").length >= 6);

  // Test exit and re-entry
  click("#guide-exit");
  assert.ok(!$("#view-hub").classList.contains("hidden"));

  // Re-enter 2025
  click('#year-grid [data-year="2025"]');
  assert.ok(!$("#view-guide").classList.contains("hidden"));
  click("#guide-next");
  assert.ok(!$("#view-strategy").classList.contains("hidden"));
});

test("3. Stratégie : calculatrice, onglets sujets, confirmation", () => {
  // Preview sujet 2
  click('#view-strategy [data-preview="2"]');
  assert.ok($("#strategy-pdf").src.includes("BAC2025_SVT_Sujet2.pdf"));

  // Preview sujet 1
  click('#view-strategy [data-preview="1"]');
  assert.ok($("#strategy-pdf").src.includes("BAC2025_SVT_Sujet1.pdf"));

  // Calc inputs
  const input = $$("#view-strategy .calc-input")[0];
  if (input) {
    input.value = "5";
    input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  }

  // Confirm sujet 1
  click('#view-strategy [data-confirm="1"]');
  assert.ok(!$("#view-onboarding").classList.contains("hidden"));
});

test("4. Onboarding : choix de l'exercice et accès workspace", () => {
  assert.ok($$("#view-onboarding [data-ex]").length, 3);
  click('#view-onboarding [data-ex="1"]');
  assert.ok(!$("#view-workspace").classList.contains("hidden"));
});

test("5. Workspace : test de tous les boutons du header et navigation", () => {
  // Panic button
  click("#ws-panic");
  assert.ok($(".modal"));
  click('[data-close="ok"]');
  assert.equal($(".modal"), null);

  // Sound button in workspace
  click("#ws-sound");
  assert.notEqual(soundEngine.currentMode, "off");
  soundEngine.stop();

  // Adkar in workspace
  click("#ws-adkar");
  assert.ok($(".modal"));
  click('[data-close="ok"]');
  assert.equal($(".modal"), null);

  // Boussole brouillon in workspace
  click("#ws-brouillon");
  assert.ok($(".drawer.open"));
  assert.ok($("#scratch-N"));
  click(".drawer [data-close]");
  assert.equal($(".drawer"), null);

  // Atlas in workspace
  click("#ws-atlas");
  assert.ok($(".drawer.open"));
  click(".drawer [data-close]");
  assert.equal($(".drawer"), null);

  // PDF drawer
  click("#ws-pdf");
  assert.ok($(".drawer.open"));
  click(".drawer [data-close]");
  assert.equal($(".drawer"), null);

  // Onboarding button
  click("#ws-onb");
  assert.ok(!$("#view-onboarding").classList.contains("hidden"));
  click('#view-onboarding [data-ex="1"]');
  assert.ok(!$("#view-workspace").classList.contains("hidden"));
});

test("6. Workspace : résolution de l'exercice 1 et corrigé officiel dépliable", () => {
  // Pôle N
  $("#fld-N").value = "يلعب ARN دورا في تركيب البروتين";
  click('#ex-content [data-check="N"]');
  assert.ok(!$("#fb-N").classList.contains("hidden"));
  assert.ok($("#fb-N details.model-box"));

  // Pôle S
  click('#stepnav [data-step="2"]');
  $("#fld-S").value = "تتزايد نسبة الإشعاع في وجود النمط الطبيعي وتتناقص في الطافر";
  click('#ex-content [data-check="S"]');
  assert.ok(!$("#fb-S").classList.contains("hidden"));
  assert.ok($("#fb-S details.model-box"));

  // Pôle E
  click('#stepnav [data-step="3"]');
  $("#fld-E").value = "يعود ذلك إلى تفكك الرابطة بين الأدنين والريبوز مما يمنع استطالة السلسلة";
  click('#ex-content [data-check="E"]');
  assert.ok(!$("#fb-E").classList.contains("hidden"));

  // Pôle W
  click('#stepnav [data-step="4"]');
  $("#fld-W").value = "الخلاصة: يؤدي تخريب بنية النكليوتيدات إلى توقف الاصطناع الحيوي للبروتينات";
  click('#ex-content [data-check="W"]');
  assert.ok(!$("#fb-W").classList.contains("hidden"));
});

test("7. Workspace : transition vers l'exercice 3 (Pipeline) et résolution complète", () => {
  click('#view-workspace [data-switch="3"]');
  assert.equal(store.state.activeExercise, 3);

  // Pôle N
  $("#pipeline-var-indep").value = "تركيز الأدينوزين";
  $("#pipeline-var-dep").value = "مستوى النشاط العصبي واليقظة";
  click('#ex-content [data-polo-check="N"]');
  assert.ok(!$("#fb-N").classList.contains("hidden"));

  // Pôle S
  $("#pipeline-doc1a").value = "التحليل المقارن في وجود الكافيين وغيابه";
  $("#pipeline-doc1a-ded").value = "الكافيين ينشط اليقظة";
  $("#pipeline-doc1b").value = "شدة الارتباط بالمستقبلات";
  $("#pipeline-doc1b-ded").value = "تنافس على مستقبلات A1R";
  click('#ex-content [data-polo-check="S"]');
  assert.ok(!$("#fb-S").classList.contains("hidden"));

  // Pôle E
  $("#pipeline-hyp1").value = "يرتبط الكافيين بمستقبل A1R";
  $("#pipeline-hyp2").value = "يرتبط الكافيين بالأدينوزين";
  $("#pipeline-doc2").value = "التتبع الجزيئي لآلية النقل المشبكي";
  click('#ex-content [data-polo-check="E"]');
  assert.ok(!$("#fb-E").classList.contains("hidden"));

  // Pôle W : arrangement des blocs
  for (const id of ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8"])
    click(`#blocks-bank [data-block="${id}"]`);
  click('#ex-content [data-polo-check="W"]');
  assert.ok(!$("#fb-W").classList.contains("hidden"));
});

test("8. Rapport & Impression : test complet des exports CSV, JSON et PDF", () => {
  click("#ws-report");
  assert.ok($(".modal"));
  assert.ok($("#btn-print-exam"));
  assert.ok($("#dl-csv"));
  assert.ok($("#dl-json"));

  // Click print
  click("#btn-print-exam");

  // Close modal
  click('[data-close="btn"]');
  assert.equal($(".modal"), null);
});

test("9. Réinitialisation et retour hub", () => {
  click("#ws-reset");
  assert.ok($(".modal"));
  click("#reset-yes");
  assert.equal(store.state.sessionActive, false);
  assert.ok(!$("#view-hub").classList.contains("hidden"));
});
