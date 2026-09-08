/* ============================================================
   Tests بطاقة المفتاح — vue imprimable (keycard.js)
   - contenu complet des sections de la fiche (source unique pour
     الفحص الرباعي et le critère du drill : imports, pas copies)
   - aucun pourcentage de barème
   - intégration guide : bouton → modal → bouton d'impression
   ============================================================ */
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const { keycardHTML } = await import("../js/ui/keycard.js");
const { QUICK_CHECK_ITEMS } = await import("../js/ui/workspace/quick-check.js");
const { DRILL_ROUND_SIZE, DRILL_UNLOCK_STREAK } = await import("../js/domain/method/gates.js");

test("la بطاقة المفتاح couvre les 4 أسنان et les 2 بوابتان", () => {
  const html = keycardHTML();
  for (const name of ["اقرأ", "اجمع", "اربط", "اختُم"]) {
    assert.ok(html.includes(name), `سنّ manquante: ${name}`);
  }
  assert.match(html, /سند أم معارف/);
  assert.match(html, /وصف أم تفسير/);
  assert.match(html, /1 ← 4/);
  assert.match(html, /1 ← 2 ← 3 ← 4/);
});

test("le الفحص الرباعي provient de la source partagée (quick-check.js), pas d'une copie", () => {
  const html = keycardHTML();
  for (const item of QUICK_CHECK_ITEMS) {
    assert.ok(html.includes(item.q), `question du فحص manquante: ${item.q}`);
  }
});

test("le critère du drill est affiché avec les constantes importées (12/12 ×3)", () => {
  const html = keycardHTML();
  assert.ok(
    html.includes(`${DRILL_ROUND_SIZE}/${DRILL_ROUND_SIZE} × ${DRILL_UNLOCK_STREAK}`),
    "critère 12/12 ×3 absent ou désynchronisé"
  );
  assert.match(html, /المستوى المتقدم/);
});

test("المفتاح+ et خمسة أخطاء sont résumés sans pourcentages de barème", () => {
  const html = keycardHTML();
  for (const expected of ["الهدف العام", "ومنه", "شجرة النسب", "بلا رقم سؤال", "بلا وحدة"]) {
    assert.ok(html.includes(expected), `section manquante: ${expected}`);
  }
  assert.doesNotMatch(html, /نصف النقطة|0,25|0,5|= 0|يُخصم/);
  assert.match(html, /ليس سلم تنقيط رسمياً/);
});

/* ---------------- intégration section تدريب المفتاح (hub) ---------------- */

const { JSDOM } = require("jsdom");
const uiDom = new JSDOM("<!DOCTYPE html><body><div id='view-hub'></div></body>", {
  url: "http://localhost/"
});
globalThis.document = uiDom.window.document;
globalThis.window = uiDom.window;

const { createTrainingController } = await import("../js/ui/training.js");

const $ = (s) => uiDom.window.document.querySelector(s);
const click = (el) => el.dispatchEvent(new uiDom.window.MouseEvent("click", { bubbles: true }));

function freshTraining({ openModal } = {}) {
  const training = createTrainingController({
    $,
    $$: (s) => [...uiDom.window.document.querySelectorAll(s)],
    store: { state: { drill: { streak: 0, best: 0, rounds: 0, unlocked: false } } },
    openModal
  });
  $("#view-hub").innerHTML = training.html();
  training.mount();
  return training;
}

after(async () => {
  try {
    uiDom.window.close();
  } catch (e) {}
});

test("le bouton بطاقة المفتاح ouvre la modal imprimable (sans openModal: pas de crash)", () => {
  const training = freshTraining();
  assert.ok($("#keycard-open"), "bouton بطاقة المفتاح manquant");
  click($("#keycard-open")); // openModal absent → ne doit rien casser
  training.teardown();
});

test("openModal reçoit la keycard et le bouton d'impression ajoute la classe d'impression", async () => {
  let capturedTitle = "";
  let capturedBody = "";
  const training = freshTraining({
    openModal(title, body) {
      capturedTitle = title;
      capturedBody = body;
      uiDom.window.document.body.innerHTML = `<div class="modal">${body}</div>`;
      return uiDom.window.document.querySelector(".modal");
    }
  });
  click($("#keycard-open"));
  assert.match(capturedTitle, /بطاقة الخطوات الأربع/);
  assert.match(capturedBody, /keycard-print/);

  let printed = false;
  uiDom.window.print = () => {
    printed = true;
  };
  click($("#keycard-print-btn"));
  assert.equal(printed, true, "window.print devrait être appelé");
  assert.equal(
    uiDom.window.document.body.classList.contains("keycard-printing"),
    true,
    "classe d'impression active pendant l'impression"
  );
  // Filet de sécurité : la classe est retirée après le délai même sans afterprint.
  await new Promise((resolve) => setTimeout(resolve, 1100));
  assert.equal(
    uiDom.window.document.body.classList.contains("keycard-printing"),
    false,
    "classe d'impression retirée après impression"
  );
  training.teardown();
});
