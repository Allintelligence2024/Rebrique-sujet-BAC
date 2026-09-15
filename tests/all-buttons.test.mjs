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

test("1. Hub : test des boutons d'accueil, adkar, sons et années", () => {
  // Sound button
  click("#btn-hub-sound");
  assert.notEqual(soundEngine.currentMode, "off");
  soundEngine.stop();

  // Adkar modal
  click("#btn-hub-adkar");
  assert.ok($(".modal"));
  click('[data-close="ok"]');
  assert.equal($(".modal"), null);

  // Plus d'outils d'entraînement dans le hub : ni أطلس, ni تشخيص تجريبي, ni exercice rapide.
  for (const id of ["#btn-atlas", "#btn-demo", "#drill-start"]) {
    assert.equal($(id), null, `${id} ne doit plus exister`);
  }

  // Years verification
  assert.equal($('#year-grid [data-year="2025"]').disabled, false);
  assert.equal($('#year-grid [data-year="2024"]').disabled, false);
  assert.equal($('#year-grid [data-year="2023"]').disabled, false);

  // Une seule action par carte-sujet : démarrer l'épreuve (pas de double bouton).
  assert.equal($('#year-grid [data-hub-year="2025"]').querySelectorAll("button").length, 1);
  assert.equal($("#year-grid [data-quick-year]"), null, "l'accès rapide séparé est supprimé");
  click('#year-grid [data-year="2025"]');
  assert.ok(!$("#view-guide").classList.contains("hidden"));
  click("#guide-exit");
  assert.ok(!$("#view-hub").classList.contains("hidden"));
});

test('1b. SE 2013–2026 en épreuve : 4D partout, 2021 en armature "copie libre"', () => {
  assert.equal($$("#year-grid .year-card").length, 14);
  const training2013 = $('#year-grid [data-hub-year="2013"]');
  assert.ok(training2013);
  assert.equal(training2013.dataset.kind, "exam");
  assert.ok(training2013.querySelector("[data-year]"));
  assert.equal($('#year-grid [data-hub-year="2019"]').dataset.kind, "exam");
  assert.equal($('#year-grid [data-hub-year="2021"]').dataset.kind, "exam");
  assert.ok($('#year-grid [data-hub-year="2021"]').querySelector("[data-year]"), "2021 ouvre une épreuve");
  assert.equal($('#year-grid [data-hub-year="2020"]').dataset.kind, "exam");
  assert.equal($('#year-grid [data-hub-year="2026"]').dataset.kind, "exam");
  assert.ok($('#year-grid [data-year="2026"]'));
  assert.ok($('#year-grid [data-year="2020"]'));
  assert.ok($('#year-grid [data-year="2013"]'));
  const links = $$('#year-grid [data-kind="consult"] a[href*="dzexams.com/ar/annales/"]');
  assert.equal(links.length, 0, "filière SE : chaque année ouvre une épreuve dans l'application");
  assert.ok(!$(".modal"));
  assert.ok(!$("#view-hub").classList.contains("hidden"));
});

test("1c. Le bouton filière affiche Maths puis le trou تقني رياضي", () => {
  click("#btn-stream-fab");
  assert.match($("#stream-fab-label").textContent, /رياضيات/);
  assert.equal(
    $$("#year-grid [data-year]").length,
    14,
    "quatorze entraînements 4D Maths (2013–2026) ; la filière maths est complète"
  );
  assert.equal($('#year-grid [data-hub-year="2021"]').dataset.kind, "exam");
  assert.equal($('#year-grid [data-year="2021-m"]').disabled, false);
  // 14 cartes-épreuve (2013-m … 2026-m) + 1 carte de consultation
  // (la session exceptionnelle 2017) : chaque carte 20xx principale devient
  // celle de l'épreuve dès que l'année est encodée, la consultation de la
  // session exceptionnelle 2017 restant attachée à sa propre carte.
  assert.equal($$("#year-grid .year-card").length, 15);
  assert.equal(
    $('#year-grid [data-hub-year="2017-exceptionnelle"]').dataset.kind,
    "consult",
    "la session exceptionnelle 2017 reste consultable"
  );
  assert.ok($('#year-grid [data-hub-year="2026"]'));
  assert.ok($('#year-grid [data-hub-year="2022"]'));
  assert.ok($('#year-grid [data-hub-year="2021"]'));
  assert.ok($('#year-grid [data-hub-year="2013"]'));
  assert.ok($('#year-grid [data-hub-year="2014"]'));
  const links = $$('#year-grid [data-kind="consult"] a[href*="dzexams.com/ar/annales/"]');
  assert.equal(
    links.length,
    1,
    "filière Maths : seule la session exceptionnelle 2017 reste en consultation ; 2013 à 2026 sont des épreuves"
  );
  assert.equal($('#year-grid [data-hub-year="2020"]').dataset.kind, "exam", "2020-m ouvre une épreuve");
  assert.equal($('#year-grid [data-hub-year="2016"]').dataset.kind, "exam", "2016-m ouvre une épreuve");
  assert.equal($('#year-grid [data-year="2016-m"]').disabled, false, "2016-m ouvre une épreuve");
  assert.equal($('#year-grid [data-hub-year="2015"]').dataset.kind, "exam", "2015-m ouvre une épreuve");
  assert.equal($('#year-grid [data-year="2015-m"]').disabled, false, "2015-m ouvre une épreuve");
  assert.equal($('#year-grid [data-hub-year="2014"]').dataset.kind, "exam", "2014-m ouvre une épreuve");
  assert.equal($('#year-grid [data-year="2014-m"]').disabled, false, "2014-m ouvre une épreuve");
  assert.equal($('#year-grid [data-hub-year="2013"]').dataset.kind, "exam", "2013-m ouvre une épreuve");
  assert.equal($('#year-grid [data-year="2013-m"]').disabled, false, "2013-m ouvre une épreuve");
  assert.equal($('#year-grid [data-year="2017-m"]').disabled, false, "2017-m ouvre une épreuve");
  assert.equal($('#year-grid [data-year="2018-m"]').disabled, false, "2018-m ouvre une épreuve");
  assert.equal($('#year-grid [data-year="2019-m"]').disabled, false, "2019-m ouvre une épreuve");
  assert.equal(
    $('#year-grid [data-hub-year="2019"]').dataset.kind,
    "exam",
    "la carte 2019 est celle de l'épreuve"
  );

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

test("3. Stratégie : calculatrice, inventaire officiel et confirmation", () => {
  const coverageCards = $$("#view-strategy [data-subject-coverage]");
  assert.equal(coverageCards.length, 2);
  assert.equal(coverageCards[0].dataset.subjectCoverage, "partial");
  assert.equal(coverageCards[1].dataset.subjectCoverage, "partial");
  // Un seul mode : les deux sujets sont ouverts, sans message d'interdiction.
  const examButtons = $$('#view-strategy [data-session-mode="bac"]');
  assert.equal(examButtons.length, 2);
  assert.ok(examButtons.every((button) => !button.disabled));
  assert.doesNotMatch($("#view-strategy").textContent, /المحاكاة ممنوعة/);
  assert.match($("#view-strategy").textContent, /جرد المهام/);

  // Le sujet s'affiche dans l'application : plus de renvoi externe.
  click('#view-strategy [data-preview="2"]');
  assert.equal(
    $("#pdf-preview-container iframe.pdf-frame").getAttribute("src").split("#")[0],
    "/subjects/SE/2025/sujet-2.pdf"
  );
  assert.ok($("#pdf-preview-container a[download]"), "le téléchargement hors ligne est proposé");
  click('#view-strategy [data-preview="1"]');
  assert.equal(
    $("#pdf-preview-container iframe.pdf-frame").getAttribute("src").split("#")[0],
    "/subjects/SE/2025/sujet-1.pdf"
  );

  // Calc inputs
  const input = $$("#view-strategy .calc-input")[0];
  if (input) {
    input.value = "5";
    input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  }

  // Confirm sujet 1 → entrée directe dans l'épreuve
  click('#view-strategy [data-confirm="1"][data-session-mode="bac"]');
  assert.equal(store.state.sessionMode, "bac");
  assert.ok(!$("#view-workspace").classList.contains("hidden"));
  // Régression : l'écran gardait le « data-answer-mode » de la session
  // précédente (un sujet inventorié s'affichait comme une copie libre).
  assert.equal($("#view-workspace").dataset.answerMode, "inventory");
});

test("4. L'écran onboarding n'existe plus et les exercices restent librement accessibles", () => {
  assert.equal($("#view-onboarding"), null, "view-onboarding supprimé du DOM");
  assert.equal($("#ws-onb"), null, "le bouton vers l'ancien écran est retiré de la copie");
  click('#view-workspace [data-simulation-exercise="2"]');
  assert.equal(
    store.state.activeExercise,
    2,
    "le changement d'exercice ne doit pas être artificiellement verrouillé"
  );
  assert.ok(!$("#view-workspace").classList.contains("hidden"));
  click('#view-workspace [data-simulation-exercise="1"]');
  assert.equal(store.state.activeExercise, 1);
});

test("5. Épreuve : les seuls outils sont le sujet, la sortie et la remise", () => {
  // Aucun outil d'entraînement dans la copie.
  for (const id of ["#ws-panic", "#ws-brouillon", "#ws-pdf", "#ws-report", "#ws-reset", "#ws-finish"]) {
    assert.equal($(id), null, `${id} ne doit plus exister dans la copie`);
  }
  // Sujet : visionneuse intégrée dans le tiroir.
  click("#simulation-pdf");
  assert.ok($(".drawer.open"));
  assert.ok($(".drawer.open iframe.pdf-frame"));
  click(".drawer [data-close]");
  assert.equal($(".drawer"), null);
  // Remise : jamais sans confirmation.
  click("#simulation-finish");
  assert.ok($(".modal"), "une confirmation est exigée");
  assert.ok($("#simulation-finish-no"));
  click("#simulation-finish-no");
  assert.equal($(".modal"), null);
  assert.equal(store.state.sessionStatus, "active", "la session continue si l'élève refuse");
});

test("6. Épreuve : les tâches du sujet sont visibles et peuvent être rédigées", () => {
  const taskText = $$("#view-workspace .simulation-task")
    .map((task) => task.textContent)
    .join(" ");
  assert.match(taskText, /2025-S1-E1-Q1/);
  assert.match(taskText, /2025-S1-E1-Q2/);
  // Chaque tâche porte sa provenance ; aucune n'affiche de note.
  assert.equal(
    $$("#view-workspace [data-task-source]").length,
    $$("#view-workspace .simulation-task").length
  );
  assert.doesNotMatch($("#view-workspace").textContent, /\d+[.,]\d+\s*\/\s*\d+/);
  // Rédaction libre : le texte est conservé, sans validation de note.
  const input = $('#view-workspace [data-task-answer="2025-S1-E1-Q1"]');
  input.value = "إجابة الطالب في الإمتحان";
  input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  assert.equal(store.exercise("2025", 1, 1).officialTaskAnswers["2025-S1-E1-Q1"], "إجابة الطالب في الإمتحان");
  // Le contrôle qualité n'est pas un corrigé : il ne rend pas de note.
  click('#view-workspace [data-qualitative-for="2025-S1-E1-Q1"]');
  const result = $('#view-workspace [data-qualitative-result="2025-S1-E1-Q1"]');
  assert.notEqual(result.textContent.trim(), "");
  assert.doesNotMatch(result.textContent, /\d+[.,]\d+\s*\/\s*\d+/);
});

test("7. Épreuve : transition vers l'exercice 3 et rédaction complète", () => {
  click('#view-workspace [data-simulation-exercise="3"]');
  assert.equal(store.state.activeExercise, 3);
  const tasks = $$("#view-workspace .simulation-task");
  assert.ok(tasks.length > 0, "l'exercice 3 propose ses tâches");
  for (const input of $$("#view-workspace [data-task-answer]")) {
    input.value = "إجابة كاملة";
    input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  }
  const progress = store.exercise("2025", 1, 3);
  assert.equal(Object.keys(progress.officialTaskAnswers).length, tasks.length);
  assert.ok(
    Object.values(progress.officialTaskAnswers).every((answer) => answer === "إجابة كاملة"),
    "toutes les réponses de l'exercice sont conservées"
  );
});

test("8-9. Ni rapport, ni réinitialisation : la remise est la seule sortie", () => {
  // Les garde-fous de l'ancien écran d'entraînement n'existent plus du tout.
  for (const id of ["#ws-report", "#reset-yes", "#dl-csv", "#btn-print-exam"]) {
    assert.equal($(id), null, `${id} ne doit plus exister`);
  }
  // Remise confirmée : la copie est verrouillée, les réponses conservées.
  click("#simulation-finish");
  click("#simulation-finish-yes");
  assert.equal(store.state.sessionStatus, "completed");
  assert.equal(store.state.sessionEndReason, "manual");
  assert.equal($("#view-workspace").dataset.reviewMode, "true");
  assert.equal($("#view-workspace [data-task-answer]").disabled, true);
  assert.equal($("#simulation-finish"), null, "plus de remise après remise");
  // Retour au hub.
  click("#simulation-home");
  assert.ok(!$("#view-hub").classList.contains("hidden"));
  assert.ok($("#view-workspace").classList.contains("hidden"));
});

test("10. La copie n'affiche aucun indice de confiance ni barème", () => {
  click('#year-grid [data-year="2025"]');
  click("#guide-next");
  click('#view-strategy [data-confirm="1"][data-session-mode="bac"]');
  assert.equal($$("#view-workspace .confidence-chip").length, 0, "aucun indice de confiance en épreuve");
  assert.doesNotMatch($("#view-workspace").textContent, /ثقة (مرتفعة|متوسطة|منخفضة)/);
  assert.match($("#view-workspace").textContent, /اختبار صامت/);
});

test("l'écran de choix n'ancre aucune estimation : les champs partent vides", async () => {
  // Biais relevé dans l'analyse (§5, `strategy.js:130`) : chaque champ était
  // pré-rempli à 75 % du maximum, ce qui suggérait une estimation que l'élève
  // n'avait pas faite. Les champs sont vides, le maximum reste visible en
  // indication, et la somme part de zéro tant que l'élève n'a rien saisi.
  click('#year-grid [data-year="2025"]');
  click("#guide-next");
  const inputs = $$("#view-strategy .calc-input");
  assert.ok(inputs.length >= 2, "les estimations doivent rester saisissables");
  for (const input of inputs) {
    assert.equal(input.value, "", `champ pré-rempli : ${input.id} = ${input.value}`);
    assert.equal(input.getAttribute("placeholder"), `من ${input.dataset.max}`);
  }
  assert.match($("#s1-total").textContent, /^0\.00 \/ \d+\.\d{2}$/);
  const input = inputs[0];
  input.value = "4";
  input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  assert.match($("#s1-total").textContent, /^4\.00 \/ \d+\.\d{2}$/);
  click("#strategy-exit");
});
