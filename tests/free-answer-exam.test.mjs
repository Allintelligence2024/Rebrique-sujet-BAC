/* ============================================================
   Épreuve « copie libre » — 2021 شعبة علوم تجريبية
   ------------------------------------------------------------
   Les questions officielles de cette session ont été recopiées page
   par page depuis le PDF (relecture image ; les symboles latins sont
   restitués d'après la couche texte du PDF, dont les chiffres sont
   faux). L'année reste en « copie libre » : le sujet officiel est lu
   dans l'application, l'élève rédige une réponse par exercice, le
   chronomètre officiel tourne et il rend sa copie.
   Ce test verrouille ce qui doit l'être :
     - rien n'est inventé (aucun pôle, aucun inventaire, aucune note) ;
     - les questions affichées sont la transcription, avec sa page source ;
     - mais l'épreuve est réelle (PDF, champs, chrono, تسليم الورقة).
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
  const element = typeof sel === "string" ? $(sel) : sel;
  if (!element) throw new Error(`Élément introuvable: ${sel}`);
  element.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
}
function type(sel, value) {
  const input = $(sel);
  if (!input) throw new Error(`Champ introuvable: ${sel}`);
  input.value = value;
  input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
}

test("2021 ouvre une épreuve, pas une consultation", () => {
  const card = $('#year-grid [data-hub-year="2021"]');
  assert.ok(card, "la carte 2021 doit exister");
  assert.equal(card.dataset.kind, "exam", "2021 n'est plus renvoyée vers un lien externe");
  const button = card.querySelector("[data-year]");
  assert.ok(button, "2021 doit avoir un bouton d'épreuve");
  assert.equal(button.disabled, false);
  // L'épreuve est annoncée en copie libre, jamais comme du 4D.
  assert.match(card.textContent, /وضع الإجابة الحرة|الورقة الحرة|غير مُشفَّرة/);
});

test("l'écran de choix annonce l'absence d'inventaire, sans inventer de جرد", () => {
  click('#year-grid [data-year="2021"]');
  assert.ok(!$("#view-guide").classList.contains("hidden"));
  click("#guide-next");
  assert.ok(!$("#view-strategy").classList.contains("hidden"));

  for (const card of $$("#view-strategy [data-subject-coverage]")) {
    assert.equal(card.dataset.examOpenable, "true", "l'épreuve doit être ouvrable");
    assert.equal(card.dataset.answerMode, "free");
    assert.equal(card.dataset.simulationEligible, "false", "aucune note n'est calculable");
  }
  assert.match($("#view-strategy").textContent, /بلا تصحيح آلي ولا نقطة/);
  assert.match($("#view-strategy").textContent, /الأسئلة الرسمية منقولة/);
  assert.doesNotMatch($("#view-strategy").textContent, /جرد المهام: \d+ مهمة/);
});

test("l'épreuve affiche le sujet officiel et un champ de rédaction par exercice", () => {
  click('#view-strategy [data-confirm="1"][data-session-mode="bac"]');
  assert.ok(!$("#view-workspace").classList.contains("hidden"));
  assert.equal($("#view-workspace").dataset.sessionMode, "bac");
  assert.equal($("#view-workspace").dataset.answerMode, "free");

  // Le sujet officiel, servi par l'application (jamais un onglet externe).
  const frame = $("#view-workspace iframe.pdf-frame");
  assert.ok(frame, "le sujet doit être affiché dans une visionneuse");
  assert.match(frame.getAttribute("src"), /^\/subjects\/SE\/2021\/sujet-1\.pdf/);

  // Une copie libre par exercice : 3 exercices, 5 + 7 + 8.
  const fields = $$("#view-workspace [data-exercise-free]");
  assert.equal(fields.length, 3);
  assert.deepEqual(
    fields.map((field) => Number(field.dataset.exercise)),
    [1, 2, 3]
  );
  for (const field of fields) assert.equal(field.disabled, false);
  assert.match($("#view-workspace").textContent, /5 نقطة/);
  assert.match($("#view-workspace").textContent, /7 نقطة/);
  assert.match($("#view-workspace").textContent, /8 نقطة/);

  // Ce qui est affiché : la transcription officielle, avec sa page source.
  const consignes = $$('#view-workspace [data-consigne-source="transcription"]');
  assert.equal(consignes.length, 3, "une transcription par exercice");
  assert.match($("#view-workspace").textContent, /النص الرسمي للأسئلة/);
  assert.match($("#view-workspace").textContent, /الصفحة 1 من 10/);
  assert.match($("#view-workspace").textContent, /مستوى البنية الفراغية للبروتين/);

  // Ce qui ne doit jamais apparaître : un pôle noté, un corrigé, une note.
  assert.equal($("#view-workspace .bac-consigne"), null, "aucune consigne de pôle");
  assert.equal($("#view-workspace [data-task-answer]"), null, "aucune tâche inventée");

  // L'épreuve est une épreuve : chronomètre officiel et remise de copie.
  assert.ok(!$("#global-timer-bar").classList.contains("hidden"), "le chronomètre doit tourner");
  assert.equal($("#simulation-finish").textContent.trim(), "✓ تسليم الورقة");
  assert.equal($("#view-workspace [data-quick-grade]"), null);
  assert.equal($("#view-workspace [data-show-report]"), null);
});

test("la réponse est enregistrée, puis la remise verrouille la copie", () => {
  const answer = "إجابة حرة: تحليل الوثائق ثم استغلال المعطيات للإجابة عن التمرين الأول.";
  type('#view-workspace [data-exercise-free="1"]', answer);
  assert.equal(
    store.exercise(store.state.yearId, store.state.sujetId, 1).freeAnswer,
    answer,
    "la réponse doit être enregistrée localement"
  );

  click("#simulation-finish");
  assert.ok($(".modal"), "la remise demande confirmation");
  click("#simulation-finish-yes");

  assert.equal(store.state.sessionStatus, "completed");
  const fields = $$("#view-workspace [data-exercise-free]");
  assert.equal(fields.length, 3, "la relecture garde les trois réponses");
  for (const field of fields) assert.equal(field.disabled, true, "la copie doit être verrouillée");
  assert.equal(fields[0].value, answer);
  assert.equal($("#simulation-finish"), null, "plus de remise après تسليم");
  assert.ok($("#simulation-review-notice"), "la relecture est annoncée");
  assert.ok($("#global-timer-bar").classList.contains("hidden"), "le chronomètre s'arrête");
  assert.equal($("#view-workspace").dataset.reviewMode, "true");
});

test("les six exercices portent une transcription datée, aucun pôle, aucune note", async () => {
  const { YEAR_2021_SE } = await import("../data/years/se/year-2021.js");
  assert.equal(YEAR_2021_SE.answerMode, "free");
  assert.ok(YEAR_2021_SE.answerModeNote.length > 20);
  let exercises = 0;
  for (const subject of YEAR_2021_SE.sujets) {
    assert.equal(subject.answerMode, "free", `sujet ${subject.id}`);
    assert.ok(subject.pdfLocalUrl, `sujet ${subject.id} : le PDF officiel reste servi`);
    for (const exercise of subject.exercises) {
      exercises += 1;
      assert.deepEqual(exercise.poles, {}, `${subject.id}/${exercise.number} : rien à noter`);
      assert.ok(Array.isArray(exercise.consignes), `${subject.id}/${exercise.number} : consignes`);
      assert.ok(exercise.consignes.length >= 2, `${subject.id}/${exercise.number} : questions listées`);
      assert.ok(
        /الصفح/.test(exercise.consignesPages || ""),
        `${subject.id}/${exercise.number} : page source citée`
      );
      assert.match(exercise.consignesSource || "", /منقولة من ملف الموضوع الرسمي/);
      // Une transcription n'est pas un corrigé : aucune réponse modèle déguisée.
      assert.doesNotMatch(exercise.consignes.join(" "), /الإجابة النموذجية|الحل/);
    }
  }
  assert.equal(exercises, 6, "deux sujets × trois exercices");
});
