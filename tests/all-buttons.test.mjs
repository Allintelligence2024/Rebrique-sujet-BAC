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

const { loadAllYears } = await import("../data/subjects.js");
await loadAllYears();
const { init } = await import("../js/ui.js");
const { store } = await import("../js/store.js");
const { soundEngine, timers } = await import("../js/engine.js");
await init();

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

  // Une seule action par carte-sujet : démarrer l'entraînement (pas de double bouton).
  assert.equal($('#year-grid [data-hub-year="2025"]').querySelectorAll("button").length, 1);
  assert.equal($("#year-grid [data-quick-year]"), null, "l'accès rapide séparé est supprimé");
  click('#year-grid [data-year="2025"]');
  assert.ok(!$("#view-guide").classList.contains("hidden"));
  click("#guide-exit");
  assert.ok(!$("#view-hub").classList.contains("hidden"));
});

test("1b. SE 2013–2020 et 2022–2026 en 4D ; 2021 en consultation", () => {
  assert.equal($$("#year-grid .year-card").length, 14);
  const training2013 = $('#year-grid [data-hub-year="2013"]');
  assert.ok(training2013);
  assert.equal(training2013.dataset.kind, "training");
  assert.ok(training2013.querySelector("[data-year]"));
  assert.equal($('#year-grid [data-hub-year="2019"]').dataset.kind, "training");
  assert.equal($('#year-grid [data-hub-year="2021"]').dataset.kind, "consult");
  assert.equal($('#year-grid [data-hub-year="2021"]').querySelector("[data-year]"), null);
  assert.equal($('#year-grid [data-hub-year="2020"]').dataset.kind, "training");
  assert.equal($('#year-grid [data-hub-year="2026"]').dataset.kind, "training");
  assert.ok($('#year-grid [data-year="2026"]'));
  assert.ok($('#year-grid [data-year="2020"]'));
  assert.ok($('#year-grid [data-year="2013"]'));
  const links = $$('#year-grid [data-kind="consult"] a[href*="dzexams.com/ar/annales/"]');
  assert.equal(links.length, 1, "filière SE : 2021 seule en consultation");
  assert.ok(!$(".modal"));
  assert.ok(!$("#view-hub").classList.contains("hidden"));
});

test("1c. Le bouton filière affiche Maths puis le trou تقني رياضي", () => {
  click("#btn-stream-fab");
  assert.match($("#stream-fab-label").textContent, /رياضيات/);
  assert.equal($$("#year-grid [data-year]").length, 6, "six entraînements 4D Maths (2021–2026)");
  assert.equal($('#year-grid [data-hub-year="2021"]').dataset.kind, "training");
  assert.equal($('#year-grid [data-year="2021-m"]').disabled, false);
  assert.equal($$("#year-grid .year-card").length, 14);
  assert.ok($('#year-grid [data-hub-year="2026"]'));
  assert.ok($('#year-grid [data-hub-year="2022"]'));
  assert.ok($('#year-grid [data-hub-year="2021"]'));
  assert.ok($('#year-grid [data-hub-year="2013"]'));
  const links = $$('#year-grid [data-kind="consult"] a[href*="dzexams.com/ar/annales/"]');
  assert.equal(links.length, 9, "filière Maths : 8 principales 2013–2020 + 2017 exceptionnelle");

  click('#year-grid [data-year="2026-m"]');
  assert.match($("#view-guide").textContent, /2س30د/);
  assert.equal($("#global-timer").textContent, "02:30:00");
  click("#guide-next");
  assert.doesNotMatch($("#view-strategy").textContent, /110 د/);
  click("#strategy-exit");

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

test("3. Stratégie : calculatrice, couverture officielle et confirmation", () => {
  const coverageCards = $$("#view-strategy [data-subject-coverage]");
  assert.equal(coverageCards.length, 2);
  assert.equal(coverageCards[0].dataset.subjectCoverage, "partial");
  assert.equal(coverageCards[0].dataset.simulationEligible, "false");
  assert.equal(coverageCards[1].dataset.subjectCoverage, "missing");
  const simulationButtons = $$('#view-strategy [data-session-mode="simulation"]');
  assert.equal(simulationButtons.length, 2);
  assert.ok(simulationButtons.every((button) => button.disabled));
  assert.match($("#view-strategy").textContent, /المحاكاة ممنوعة/);

  // Third-party PDFs are not redistributed: the strategy links to the external source.
  click('#view-strategy [data-preview="2"]');
  assert.ok($("#pdf-preview-container a").href.includes("dzexams.com"));
  assert.equal($("#pdf-preview-container .pdf-download"), null);

  click('#view-strategy [data-preview="1"]');
  assert.ok($("#pdf-preview-container a").href.includes("dzexams.com"));
  assert.equal($("#pdf-preview-container .pdf-download"), null);

  // Calc inputs
  const input = $$("#view-strategy .calc-input")[0];
  if (input) {
    input.value = "5";
    input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  }

  // Confirm sujet 1 → entrée directe au workspace (examen, pas de spoiler)
  click('#view-strategy [data-confirm="1"][data-session-mode="training"]');
  assert.equal(store.state.sessionMode, "training");
  assert.ok(!$("#view-workspace").classList.contains("hidden"));
});

test("4. L'écran onboarding n'existe plus et les exercices restent librement accessibles", () => {
  assert.equal($("#view-onboarding"), null, "view-onboarding supprimé du DOM");
  assert.equal($("#ws-onb"), null, "le bouton vers l'ancien écran est retiré du workspace");
  click('#view-workspace [data-switch="2"]');
  assert.equal(
    store.state.activeExercise,
    2,
    "le changement d'exercice ne doit pas être artificiellement verrouillé"
  );
  assert.ok(!$("#view-workspace").classList.contains("hidden"));
  click('#view-workspace [data-switch="1"]');
  assert.equal(store.state.activeExercise, 1);
});

test("5. Workspace : test de tous les boutons du header et navigation", () => {
  // Panic button
  click("#ws-panic");
  assert.ok($(".modal"));
  click('[data-close="ok"]');
  assert.equal($(".modal"), null);

  // Boussole brouillon in workspace
  click("#ws-brouillon");
  assert.ok($(".drawer.open"));
  assert.ok($("#scratch-N"));
  click(".drawer [data-close]");
  assert.equal($(".drawer"), null);

  // PDF drawer
  click("#ws-pdf");
  assert.ok($(".drawer.open"));
  click(".drawer [data-close]");
  assert.equal($(".drawer"), null);
});

test("6. Workspace : tâches officielles visibles et résolution de l'exercice 1", () => {
  const provenanceText = $$("#ex-content .provenance-note")
    .map((note) => note.textContent)
    .join(" ");
  assert.match(provenanceText, /2025-S1-E1-Q1/);
  assert.match(provenanceText, /2025-S1-E1-Q2/);

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

test("8-9. Rapport et réinitialisation sont exposés dans la copie, derrière garde-fous", () => {
  // Rapport : ouvert, qualitatif uniquement (aucune note avant calibration).
  click("#ws-report");
  assert.ok($(".modal"), "le rapport s'ouvre");
  assert.match($(".modal").textContent, /تشخيص نوعي فقط/);
  assert.equal($(".modal .report-score"), null, "aucun total chiffré");
  assert.equal($("#dl-csv"), null, "l'export CSV reste verrouillé par la calibration");
  assert.ok($("#btn-print-exam"), "l'impression de la copie reste disponible");
  click("#btn-print-exam");
  click('.modal [data-close="btn"]');
  assert.equal($(".modal"), null);

  // Réinitialisation : jamais sans confirmation.
  click("#ws-reset");
  assert.ok($(".modal"), "une confirmation est exigée");
  assert.ok($("#reset-yes"));
  click('.modal [data-close="btn"]');
  assert.equal($(".modal"), null);

  // Confirmée : la copie est effacée et l'élève revient au hub.
  const savedBefore = JSON.stringify(store.state.progress);
  assert.notEqual(savedBefore, "{}", "une copie est en cours avant la réinitialisation");
  click("#ws-reset");
  click("#reset-yes");
  assert.equal($(".modal"), null);
  assert.deepEqual(store.state.progress, {}, "toute la copie est effacée");
  assert.equal(store.state.sessionActive, false, "la session est fermée");
  assert.ok(!$("#view-hub").classList.contains("hidden"), "retour à la page principale");
  assert.ok($("#view-workspace").classList.contains("hidden"));

  assert.equal($("#ws-review"), null, "المؤشر reste retiré de la copie");
});

test("10. Chaque étape affiche un indice de confiance (poleConfidence)", () => {
  click('#year-grid [data-year="2025"]');
  click("#guide-next");
  click('#view-strategy [data-confirm="1"][data-session-mode="training"]');
  const chips = $$("#ex-content .confidence-chip");
  assert.equal(chips.length, 4, "un indice par étape");
  for (const chip of chips) {
    assert.ok(
      ["high", "medium", "low"].includes(chip.dataset.confidence),
      `niveau inattendu: ${chip.dataset.confidence}`
    );
    assert.match(chip.textContent, /ثقة (مرتفعة|متوسطة|منخفضة)/);
  }
});
