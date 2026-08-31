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
  assert.equal($$("#year-grid .year-card").length, 13);
  assert.equal($('#year-grid [data-year="2025"]').disabled, false);
  assert.equal($('#year-grid [data-year="2024"]').disabled, false);
  assert.equal($('#year-grid [data-year="2023"]').disabled, false);
  assert.equal($('#year-grid [data-year="2022"]').disabled, false);
  assert.ok($('#year-grid [data-hub-year="2013"]'));
  assert.ok($('#year-grid [data-hub-year="2020"]'));
  assert.ok($('#year-grid [data-hub-year="2021"]'));
  assert.equal($('#year-grid [data-hub-year="2013"]').dataset.kind, "consult");
  assert.equal($('#year-grid [data-hub-year="2021"]').dataset.kind, "consult");
  assert.ok($("#btn-stream-fab"));
});

test("les données portent désormais des consignes BAC explicites sur chaque pôle", async () => {
  const { APP_CONFIG } = await import("../data/subjects.js");
  const enabledYears = APP_CONFIG.years.filter((y) => y.enabled);
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

test("le mode brouillon Boussole s'ouvre, expose la fiche N/S/E/W et persiste les notes", () => {
  assert.ok($("#boussole-scratch-card"));
  click("#ws-brouillon");
  assert.ok($(".drawer.open"));
  assert.match($(".drawer").textContent, /ورقة N\/S\/E\/W/);
  assert.match($(".drawer").textContent, /الفعل المكتشف/);
  assert.match($(".drawer").textContent, /consigne brute BAC/);
  assert.match($(".drawer").textContent, /consigne reconstruite/);
  assert.match($(".drawer").textContent, /البلوك الأنسب: N/);
  assert.ok($("#scratch-N"));
  assert.ok($("#scratch-S"));

  const scratchN = $("#scratch-N");
  scratchN.value = "المشكل العلمي: كيف يؤثر المنبه على الاستجابة؟";
  scratchN.dispatchEvent(new dom.window.Event("input", { bubbles: true }));

  click(".drawer [data-close]");
  assert.equal($(".drawer"), null);

  click("#ws-brouillon");
  assert.equal($("#scratch-N").value, "المشكل العلمي: كيف يؤثر المنبه على الاستجابة؟");
  click(".drawer [data-close]");
});

test("la copie finale du brouillon génère un texte rédigé puis peut l'injecter dans la réponse texte", () => {
  $("#pipeline-var-indep").value = "تركيز الأدينوزين والكافيين";
  $("#pipeline-var-dep").value = "شدة النشاط العصبي";
  click('#ex-content [data-polo-check="N"]');
  click('#view-workspace [data-switch="1"]');
  assert.ok($("#fld-N"));
  click("#ws-brouillon");

  $("#scratch-N").value = "المشكل العلمي: كيف تتدخل مختلف أنواع ARN في تركيب البروتين؟";
  $("#scratch-N").dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  $("#scratch-S").value = "نلاحظ وجود ARN رسول وناقل وريبوزومي في الهيولى مع تكامل أدوارها.";
  $("#scratch-S").dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  $("#scratch-E").value =
    "يفسر ذلك بأن ARNm يحمل المعلومة وARNt ينقل الأحماض الأمينية وARNr يضمن الترجمة داخل الريبوزوم.";
  $("#scratch-E").dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  $("#scratch-W").value = "في الختام يؤدي تعطل هذه العناصر إلى توقف تركيب البروتين.";
  $("#scratch-W").dispatchEvent(new dom.window.Event("input", { bubbles: true }));

  assert.match($("#brouillon-draft-current").value, /المشكل العلمي/);
  assert.match($("#brouillon-draft-full").value, /وتبين المعطيات أن/);

  click("#brouillon-insert-current");
  assert.match($("#fld-N").value, /المشكل العلمي/);

  click("#brouillon-insert-full");
  assert.match($("#fld-N").value, /وتبين المعطيات أن/);
  click(".drawer [data-close]");
});

test("le mini-contrôle du brouillon signale l'absence de comparaison avant injection", () => {
  click('#stepnav [data-step="1"]');
  click('#ex-content [data-check="N"]');
  click('#view-workspace [data-switch="2"]');
  click('#stepnav [data-step="2"]');
  click("#ws-brouillon");
  $("#scratch-S").value = "النمط الطبيعي ينمو جيداً.";
  $("#scratch-S").dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  assert.match($("#brouillon-preflight-current").textContent, /tu n’as pas mis de comparaison/);
  click("#brouillon-insert-current");
  assert.ok($(".modal"));
  assert.match($(".modal").textContent, /tu n’as pas mis de comparaison/);
  click('[data-close="btn"]');
  click(".drawer [data-close]");
});

test("le mini-contrôle du brouillon signale une explication sans observation", () => {
  click('#stepnav [data-step="3"]');
  click("#ws-brouillon");
  $("#scratch-S").value = "";
  $("#scratch-S").dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  $("#scratch-E").value = "يعود ذلك إلى خلل في الموقع الفعال للإنزيم.";
  $("#scratch-E").dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  assert.match($("#brouillon-preflight-current").textContent, /tu as expliqué sans observer/);
  click(".drawer [data-close]");
});

test("le mini-contrôle du brouillon signale une conclusion hors problème", () => {
  click('#stepnav [data-step="4"]');
  click("#ws-brouillon");
  $("#scratch-N").value = "المشكل العلمي: كيف تساهم البنية النسيجية للصانعة الخضراء في استغلال CO2؟";
  $("#scratch-N").dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  $("#scratch-W").value = "في الختام هذه الظاهرة مهمة للكائنات الحية.";
  $("#scratch-W").dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  assert.match($("#brouillon-preflight-full").textContent, /ta conclusion ne répond pas au problème/);
  click(".drawer [data-close]");
});

test("le pipeline parfait est noté 1.50 / 1.50 (pôle W)", () => {
  click('#stepnav [data-step="1"]');
  $("#fld-N").value = "البيرينويد يرفع كفاءة استغلال CO2 عند الطحالب الطبيعية";
  click('#ex-content [data-check="N"]');
  click('#view-workspace [data-switch="3"]');
  for (const id of ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8"])
    click(`#blocks-bank [data-block="${id}"]`);
  click('#ex-content [data-polo-check="W"]');
  const fb = $("#fb-W").textContent.trim();
  assert.match(fb, /1\.50 \/ 1\.50ن/);
  assert.match(fb, /8\/8/);
});

test("l'évaluation texte renvoie un feedback d'entraînement et l'accordéon de réponse modèle", () => {
  click('#view-workspace [data-switch="1"]');
  $("#fld-N").value = "الأدينوزين يثبط اليقظة عبر الارتباط بالمستقبلات الغشائية";
  click('#ex-content [data-check="N"]');
  assert.match($("#fb-N").textContent.trim(), /مراجعة منهجية فقط/);
  const modelBox = $("#fb-N details.model-box");
  assert.ok(modelBox, "L'accordéon de réponse modèle doit être présent");
  assert.match(modelBox.textContent, /إجابة نموذجية للتدريب/);
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

test("l'autosave debounced conserve une réponse sans confirmation", async () => {
  const { store } = await import("../js/store.js");
  const field = $("#fld-N");
  field.value = "brouillon sauvegardé automatiquement";
  field.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  await new Promise((resolve) => setTimeout(resolve, 400));
  assert.equal(store.exercise("2025", 1, 2).text.N, "brouillon sauvegardé automatiquement");
});

test("la dictée vocale instancie Web Speech et insère la transcription", async () => {
  class FakeRecognition {
    start() {
      this.onresult({ resultIndex: 0, results: [[{ transcript: "نص مملى" }]] });
      this.onend();
    }
    abort() {}
  }
  window.SpeechRecognition = FakeRecognition;
  const { voiceEngine } = await import("../js/ui.js");
  const field = $("#fld-N");
  field.value = "";
  assert.equal(voiceEngine.start(field), true);
  assert.equal(field.value, "نص مملى");
  assert.equal(voiceEngine.listening, false);
  delete window.SpeechRecognition;
});

test("les boutons d'إملاء صوتي (dictée vocale) sont bien présents sur les champs", () => {
  const micBtns = $$(".btn-mic");
  assert.ok(micBtns.length > 0);
  // Clic sans Web Speech API : avertissement gracieux, sans crash.
  micBtns[0].dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
  assert.ok($("#toast-zone").children.length > 0);
});
