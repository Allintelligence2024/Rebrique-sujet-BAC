/* ============================================================
   Armatures « copie libre » Maths 2013–2020
   ------------------------------------------------------------
   Problème d'origine : ces huit millésimes n'existaient que comme cartes
   de CONSULTATION (liens dzexams) — l'élève pouvait lire le sujet, jamais
   entrer en épreuve, alors que 2021–2026 ouvraient un vrai mode BAC.

   Ce qu'on peut faire sans mentir, et ce qu'on ne peut pas faire :
     - ON PEUT ouvrir l'épreuve : le sujet officiel est servi par
       l'application, la copie se rédige à l'écran, le chronomètre tourne,
       « تسليم الورقة » verrouille la copie.
     - ON NE PEUT PAS encoder les consignes : la couche texte est absente
       (2013–2015 : scan) ou aux chiffres corrompus (2016–2020), et
       `PROMPT_RESTANT.md` l'interdit formellement (TRAVAIL C — relecture
       humaine). Aucune tâche, aucun pôle, aucun barème inventé.

   Ces tests verrouillent les deux versants : l'épreuve est réelle, et rien
   de ce qui n'a pas été mesuré n'est affiché comme une donnée.
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
const { officialTaskInventoryFor } = await import("../data/official-tasks.js");
const { APP_CONFIG: FULL_APP_CONFIG } = await import("./helpers/full-app-config.mjs");
await init();

after(() => {
  timers.stopAll();
  soundEngine.stop();
  try {
    dom.window.close();
  } catch {
    /* déjà fermé */
  }
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

const FREE_M_IDS = [
  "2013-m",
  "2014-m",
  "2015-m",
  "2016-m",
  "2017-m",
  "2018-m",
  "2019-m",
  "2020-m",
  "2017-em"
];
/* Identifiant de carte dans le hub : une session exceptionnelle du même
   millésime doit avoir sa propre carte, sinon elle est masquée. */
const CARD_BY_ID = Object.freeze({
  "2013-m": "2013",
  "2014-m": "2014",
  "2015-m": "2015",
  "2016-m": "2016",
  "2017-m": "2017",
  "2018-m": "2018",
  "2019-m": "2019",
  "2020-m": "2020",
  "2017-em": "2017 (دورة استثنائية)"
});
/* Découpage mesuré sur la couche texte : 2 en-têtes « التمرين » extraits pour
   2016–2020 et pour la session exceptionnelle 2017, aucun pour 2013–2015
   (scan sans couche texte). */
const SPLIT_MEASURED = ["2016-m", "2017-m", "2018-m", "2019-m", "2020-m", "2017-em"];

/* Le hub mémorise la filière dans localStorage et les tests s'enchaînent dans
   le même DOM : on part donc de l'état affiché, on revient au hub si une
   épreuve est ouverte, puis on cycle jusqu'à رياضيات (au plus 3 tours). */
function goToMathsStream() {
  if ($("#simulation-home") && !$("#view-workspace").classList.contains("hidden")) {
    click("#simulation-home");
  }
  store.reset();
  for (let tour = 0; tour < 3 && !/رياضيات/.test($("#stream-fab-label").textContent); tour += 1) {
    click("#btn-stream-fab");
  }
  assert.match($("#stream-fab-label").textContent, /رياضيات/);
}

function openExam(yearId, subjectId = 1) {
  click(`#year-grid [data-year="${yearId}"]`);
  assert.ok(!$("#view-guide").classList.contains("hidden"), `${yearId} : guide non ouvert`);
  click("#guide-next");
  click(`#view-strategy [data-confirm="${subjectId}"][data-session-mode="bac"]`);
  assert.ok(!$("#view-workspace").classList.contains("hidden"));
}

test("les neuf sessions Maths 2013–2020 ouvrent une épreuve, plus une consultation", () => {
  goToMathsStream();
  assert.equal($$('#year-grid [data-kind="consult"]').length, 0, "plus aucune carte de consultation Maths");
  for (const id of FREE_M_IDS) {
    const year = CARD_BY_ID[id];
    const card = $(`#year-grid [data-hub-year="${year}"]`);
    assert.ok(card, `carte ${year} absente`);
    assert.equal(card.dataset.kind, "exam", `${year} doit ouvrir une épreuve`);
    const button = card.querySelector("[data-year]");
    assert.equal(button.dataset.year, id);
    assert.equal(button.disabled, false, `${id} doit être cliquable`);
    /* La carte est épurée (ni badge ni description) : elle garde l'information
       en infobulle `title`, jamais en texte affiché. */
    assert.match(card.getAttribute("title"), /غير مُشفَّرة/, `${year} garde l'honnêteté en infobulle`);
    assert.equal(card.querySelector(".badge"), null, `${year} ne doit plus afficher de badge`);
  }
});

test("la session exceptionnelle 2017 garde ses propres fichiers, pas ceux de juin", () => {
  goToMathsStream();
  openExam("2017-em");
  assert.equal(store.state.yearId, "2017-em");
  assert.match(
    $("#view-workspace iframe.pdf-frame").getAttribute("src"),
    /^\/subjects\/M\/2017\/exceptional\/sujet-1\.pdf/,
    "la session exceptionnelle a ses propres PDF"
  );
  assert.equal($$("#view-workspace [data-exercise-free]").length, 2);
});

test("le troisième onglet est « باكالوريات أجنبية », sans lien dzexams ni شعبة:", () => {
  goToMathsStream();
  click("#btn-stream-fab"); // Maths -> باكالوريات أجنبية
  assert.match($("#stream-fab-label").textContent, /باكالوريات أجنبية/);
  assert.equal($(".stream-fab-kicker").hidden, true, "ce n'est pas une شعبة : pas de préfixe الشعبة:");
  assert.equal($$('#year-grid [data-kind="gap"]').length, 1);
  assert.equal($$('#year-grid a[href*="dzexams.com"]').length, 0, "aucun lien algérien dans cet espace");
  click("#btn-stream-fab"); // retour SE
  assert.equal($(".stream-fab-kicker").hidden, false, "les شعب algériennes gardent le préfixe");
  assert.match($("#stream-fab-label").textContent, /علوم تجريبية/);
});

test("rien n'est encodé dans les huit armatures : aucun pôle, aucun inventaire", () => {
  for (const id of FREE_M_IDS) {
    const year = FULL_APP_CONFIG.years.find((entry) => entry.id === id);
    assert.ok(year, `${id} absent du catalogue`);
    assert.equal(year.stream, "m");
    assert.equal(year.answerMode, "free");
    assert.equal(year.freeMeasurements.pointsMeasured, false, `${id} ne doit pas annoncer de barème`);
    assert.equal(year.freeMeasurements.promptsEncoded, false, `${id} ne doit pas annoncer de consigne`);
    assert.equal(
      year.freeMeasurements.exerciseSplitMeasured,
      SPLIT_MEASURED.includes(id),
      `${id} : le découpage déclaré doit être celui qui a été mesuré`
    );
    for (const sujet of year.sujets) {
      assert.match(
        sujet.pdfLocalUrl,
        /^\/subjects\/M\/\d{4}\/(?:exceptional\/)?sujet-[12]\.pdf$/,
        `${id}/S${sujet.id}`
      );
      for (const ex of sujet.exercises) {
        assert.deepEqual(ex.poles, {}, `${id}/S${sujet.id}/E${ex.number} ne doit rien encoder`);
        assert.equal(ex.max, null, `${id}/S${sujet.id}/E${ex.number} : barème non mesuré, pas 0`);
      }
      assert.equal(
        officialTaskInventoryFor(id, sujet.id),
        null,
        `${id}/S${sujet.id} ne doit pas produire d'inventaire`
      );
    }
  }
});

test("2016 (découpage mesuré) : une copie par exercice, sans aucun nombre de points", () => {
  goToMathsStream();
  openExam("2016-m");
  assert.equal($("#view-workspace").dataset.answerMode, "free");
  assert.equal($("#view-workspace").dataset.sessionMode, "bac");

  const frame = $("#view-workspace iframe.pdf-frame");
  assert.ok(frame, "le sujet doit être affiché dans une visionneuse");
  assert.match(frame.getAttribute("src"), /^\/subjects\/M\/2016\/sujet-1\.pdf/);

  const fields = $$("#view-workspace [data-exercise-free]");
  assert.equal(fields.length, 2, "deux exercices mesurés");
  assert.deepEqual(
    fields.map((field) => Number(field.dataset.exercise)),
    [1, 2]
  );
  assert.match($("#view-workspace").textContent, /التمرين 1/);
  assert.match($("#view-workspace").textContent, /البارم غير مُقاس/);
  // Un barème non mesuré ne doit JAMAIS s'afficher comme « 0 نقطة ».
  assert.doesNotMatch($("#view-workspace").textContent, /0 نقطة/);

  assert.equal($("#view-workspace .bac-consigne"), null, "aucune consigne affichée");
  assert.equal($("#view-workspace [data-task-answer]"), null, "aucune tâche inventée");
  assert.equal($("#view-workspace [data-quick-grade]"), null, "aucune note");
  assert.ok(!$("#global-timer-bar").classList.contains("hidden"), "le chronomètre tourne");
  assert.equal($("#simulation-finish").textContent.trim(), "✓ تسليم الورقة");
});

test("2013 (scan, découpage non mesurable) : une seule copie pour le sujet entier", () => {
  goToMathsStream();
  openExam("2013-m");
  const fields = $$("#view-workspace [data-exercise-free]");
  assert.equal(fields.length, 1, "le découpage n'étant pas mesurable, une seule copie");
  assert.match($("#view-workspace").textContent, /الموضوع كاملاً/);
  assert.doesNotMatch($("#view-workspace").textContent, /التمرين 1/);
  assert.match($("#view-workspace").textContent, /البارم غير مُقاس/);
  assert.match(
    $("#view-workspace iframe.pdf-frame").getAttribute("src"),
    /^\/subjects\/M\/2013\/sujet-1\.pdf/
  );
});

test("la copie est enregistrée puis verrouillée par la remise", () => {
  goToMathsStream();
  openExam("2017-m");
  const answer = "إجابة حرة: استغلال الوثائق ثم صياغة نص علمي حول الإستجابة المناعية.";
  type('#view-workspace [data-exercise-free="2"]', answer);
  assert.equal(
    store.exercise(store.state.yearId, store.state.sujetId, 2).freeAnswer,
    answer,
    "la réponse doit être enregistrée localement"
  );

  click("#simulation-finish");
  assert.ok($(".modal"), "la remise demande confirmation");
  click("#simulation-finish-yes");

  assert.equal(store.state.sessionStatus, "completed");
  const fields = $$("#view-workspace [data-exercise-free]");
  assert.equal(fields.length, 2, "la relecture garde les deux réponses");
  for (const field of fields) assert.equal(field.disabled, true, "la copie doit être verrouillée");
  assert.equal(fields[1].value, answer);
  assert.equal($("#simulation-finish"), null, "plus de remise après تسليم");
  assert.ok($("#simulation-review-notice"), "la relecture est annoncée");
});
