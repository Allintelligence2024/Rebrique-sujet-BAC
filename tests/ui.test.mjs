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
const { loadAllYears } = await import("../data/subjects.js");
const allYears = await loadAllYears();
const { init } = await import("../js/ui.js");
await init();

after(async () => {
  const { timers } = await import("../js/engine.js");
  timers.stopAll();
  try {
    dom.window.close();
  } catch (e) {}
});

const $ = (s) => globalThis.document.querySelector(s);
const $$ = (s) => [...globalThis.document.querySelectorAll(s)];
function click(sel) {
  const e = $(sel);
  if (!e) throw new Error(`introuvable: ${sel}`);
  e.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
}

test("le hub affiche les années (2025, 2024, 2023 et 2022 actives)", () => {
  assert.equal($$("#year-grid .year-card").length, 14);
  assert.equal($('#year-grid [data-year="2025"]').disabled, false);
  assert.equal($('#year-grid [data-year="2024"]').disabled, false);
  assert.equal($('#year-grid [data-year="2023"]').disabled, false);
  assert.equal($('#year-grid [data-year="2022"]').disabled, false);
  assert.ok($('#year-grid [data-hub-year="2013"]'));
  assert.ok($('#year-grid [data-hub-year="2020"]'));
  assert.ok($('#year-grid [data-hub-year="2021"]'));
  assert.ok($('#year-grid [data-hub-year="2026"]'));
  assert.equal($('#year-grid [data-hub-year="2013"]').dataset.kind, "exam");
  assert.equal($('#year-grid [data-hub-year="2019"]').dataset.kind, "exam");
  assert.equal($('#year-grid [data-hub-year="2021"]').dataset.kind, "consult");
  assert.equal($('#year-grid [data-hub-year="2020"]').dataset.kind, "exam");
  assert.equal($('#year-grid [data-hub-year="2026"]').dataset.kind, "exam");
  assert.equal($('#year-grid [data-year="2013"]').disabled, false);
  assert.equal($('#year-grid [data-year="2020"]').disabled, false);
  assert.equal($('#year-grid [data-year="2026"]').disabled, false);
  assert.ok($("#btn-stream-fab"));
});

test("les données portent désormais des consignes BAC explicites sur chaque pôle", () => {
  const enabledYears = allYears.filter((year) => year.enabled);
  for (const year of enabledYears) {
    for (const sujet of year.sujets) {
      for (const ex of sujet.exercises) {
        for (const pole of ["N", "S", "E", "W"]) {
          assert.equal(
            typeof ex.poles[pole].bacPrompt,
            "string",
            `${year.id}/S${sujet.id}/E${ex.number}/${pole} doit avoir bacPrompt`
          );
          assert.ok(
            ex.poles[pole].bacPrompt.trim().length > 8,
            `${year.id}/S${sujet.id}/E${ex.number}/${pole} bacPrompt trop court`
          );
          const src = ex.poles[pole].bacPromptSource;
          assert.ok(
            src === "reconstructed" || src === "official",
            `${year.id}/S${sujet.id}/E${ex.number}/${pole} source inconnue: ${src}`
          );
          if (src === "official") {
            assert.equal(typeof ex.poles[pole].bacPromptPage, "number");
            assert.match(ex.poles[pole].bacPromptVerifiedAt, /^\d{4}-\d{2}-\d{2}$/);
            assert.ok(ex.poles[pole].bacPromptNotes.length > 5);
          }
        }
      }
    }
  }
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
  $(".modal .small").dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
  assert.ok($(".modal"), "un clic dans le contenu ne doit pas fermer la modale");
  click('[data-close="ok"]');
  assert.equal($(".modal"), null);
});

test("après تثبيت du sujet, entrée directe dans l'épreuve (aucun écran qui spoiler)", () => {
  click('#year-grid [data-year="2025"]');
  assert.ok($(".adkar-section"));
  assert.ok($$(".adkar-card").length >= 6);
  click("#guide-next");
  // Un seul mode : plus de choix entraînement/BAC sur l'écran de stratégie.
  assert.equal($('#view-strategy [data-session-mode="training"]'), null);
  assert.ok($('#view-strategy [data-confirm="1"][data-session-mode="bac"]'));
  click('#view-strategy [data-confirm="1"][data-session-mode="bac"]');
  assert.ok(!$("#view-workspace").classList.contains("hidden"));
  assert.equal($("#view-onboarding"), null, "l'écran onboarding n'existe plus");
  assert.equal($("#view-workspace").dataset.sessionMode, "bac");
  // L'épreuve s'ouvre sur les tâches du sujet, pas sur un exercice d'entraînement.
  assert.ok($$("#view-workspace .simulation-task").length > 0);
  assert.equal($("#stepnav"), null, "la navigation par étapes d'entraînement a disparu");
});

test("l'épreuve affiche les consignes avec leur provenance réelle", () => {
  const tasks = $$("#view-workspace .simulation-task");
  assert.equal(tasks.length, 4, "quatre tâches pour le ت1 de 2025/S1");
  const badges = $$("#view-workspace [data-task-source]");
  assert.equal(badges.length, 4, "chaque tâche porte sa provenance");
  const sources = badges.map((badge) => badge.dataset.taskSource);
  assert.deepEqual(sources, ["reconstructed", "official", "official", "reconstructed"]);
  // Les étapes reconstruites le disent ; les pages ne sont pas inventées.
  assert.match(badges[0].textContent, /مُعاد بناؤها/);
  assert.match(tasks[0].textContent, /صفحة غير موثّقة/);
  assert.match(tasks[1].textContent, /الصفحة 1/);
  // Aucune note, aucun pourcentage dans l'écran d'épreuve.
  assert.doesNotMatch($("#view-workspace").textContent, /\d+[.,]\d+\s*\/\s*\d+/);
});

test("le sujet s'ouvre dans l'application (PDF local) et non sur un lien externe", () => {
  click("#simulation-pdf");
  const frame = $(".drawer.open iframe.pdf-frame");
  assert.ok(frame, "le sujet doit s'afficher en visionneuse intégrée");
  assert.match(frame.getAttribute("src"), /^\/subjects\/SE\/2025\/sujet-1\.pdf/);
  assert.ok($(".drawer.open a[download]"), "le téléchargement hors ligne reste proposé");
  click(".drawer [data-close]");
  assert.equal($(".drawer"), null);
});

test("la réponse est enregistrée automatiquement, sans confirmation", async () => {
  const { store } = await import("../js/store.js");
  const input = $("#view-workspace [data-task-answer]");
  input.value = "إجابة محفوظة آلياً";
  input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  await new Promise((resolve) => setTimeout(resolve, 400));
  const taskId = input.dataset.taskAnswer;
  const progress = store.exercise("2025", 1, 1);
  assert.equal(progress.officialTaskAnswers[taskId], "إجابة محفوظة آلياً");
});

test("la dictée vocale reste disponible sur les champs de réponse", async () => {
  class FakeRecognition {
    start() {
      this.onresult({ resultIndex: 0, results: [[{ transcript: "نص مملى" }]] });
      this.onend();
    }
    abort() {}
  }
  dom.window.SpeechRecognition = FakeRecognition;
  const { voiceEngine } = await import("../js/ui.js");
  const mics = $$("#view-workspace .btn-mic");
  assert.ok(mics.length > 0, "un bouton de dictée par champ de réponse");
  const field = $("#" + mics[0].dataset.mic);
  field.value = "";
  assert.equal(voiceEngine.start(field), true);
  assert.equal(field.value, "نص مملى");
  assert.equal(voiceEngine.listening, false);
  delete dom.window.SpeechRecognition;
});

test("rechargement : l'épreuve est restaurée à l'identique", async () => {
  const { store } = await import("../js/store.js");
  store.setActiveExercise(2);
  store.setActiveScreen("view-workspace");
  store.save();
  const { init } = await import("../js/ui.js");
  await init();
  assert.ok(!$("#view-workspace").classList.contains("hidden"));
  assert.equal($("#view-workspace").dataset.sessionMode, "bac");
  assert.equal(store.state.activeExercise, 2);
  assert.equal(store.state.sessionMode, "bac");
  assert.ok($$("#view-workspace .simulation-task").length > 0);
});

test("l'épreuve n'expose ni rapport, ni réinitialisation, ni indices", () => {
  for (const id of ["#ws-report", "#ws-reset", "#ws-panic", "#ws-brouillon", "#ws-finish", "#ws-review"]) {
    assert.equal($(id), null, `${id} ne doit plus exister dans la copie`);
  }
  // Restent : la sortie, le sujet et la remise de copie.
  for (const id of ["#simulation-home", "#simulation-pdf", "#simulation-finish"]) {
    assert.ok($(id), `outil d'épreuve manquant: ${id}`);
  }
});

test("la remise verrouille la copie et ouvre la relecture", async () => {
  const { store } = await import("../js/store.js");
  click("#simulation-finish");
  assert.ok($("#simulation-finish-yes"), "une confirmation est exigée");
  click("#simulation-finish-yes");
  assert.equal(store.state.sessionStatus, "completed");
  assert.equal(store.state.sessionEndReason, "manual");
  assert.equal($("#view-workspace").dataset.reviewMode, "true");
  // Réponses conservées mais verrouillées.
  assert.equal($("#view-workspace [data-task-answer]").disabled, true);
  assert.equal($("#simulation-finish"), null, "plus de remise après remise");
  // Aucune note : le barème reste provisoire.
  assert.match($("#view-workspace").textContent, /التنقيط غير معاير/);
  assert.doesNotMatch($("#view-workspace").textContent, /\d+[.,]\d+\s*\/\s*\d+/);
});

test("أطلس والتشخيص التجريبي vivrent dans la section repliée تدريب المفتاح (hub épuré)", () => {
  click("[data-hub-year]") && null; // no-op: s'assure seulement qu'on est sur le hub
  const atlas = $("#btn-atlas");
  const demo = $("#btn-demo");
  assert.ok(atlas, "bouton أطلس introuvable");
  assert.ok(demo, "bouton démo introuvable");
  assert.ok(atlas.closest("#training-details"), "أطلس doit être dans تدريب المفتاح");
  assert.ok(demo.closest("#training-details"), "la démo doit être dans تدريب المفتاح");
  assert.equal($(".hub-tools #btn-atlas"), null, "l'en-tête du hub ne doit plus contenir أطلس");
});
