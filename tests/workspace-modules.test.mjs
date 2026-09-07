import { test } from "node:test";
import assert from "node:assert/strict";
import { APP_CONFIG } from "../data/subjects.js";
import { createReportController } from "../js/ui/workspace/report-controller.js";
import { mayScorePole } from "../js/ui/workspace/feedback.js";

const year = APP_CONFIG.years.find((item) => item.enabled);
const sujet = year.sujets[0];
const emptyProgress = () => ({
  scores: { N: 0, S: 0, E: 0, W: 0 },
  answeredAny: false
});

test("les points heuristiques restent cachés tant que la calibration publique bloque la promotion", () => {
  const officialPole = { bacPromptSource: "official" };
  assert.equal(mayScorePole(officialPole, false), false);
  assert.equal(mayScorePole(officialPole, false, { scorePromotionAllowed: true }), true);
  assert.equal(mayScorePole(officialPole, true, { scorePromotionAllowed: true }), false);
});

test("report-controller calcule directement un rapport sans dépendre du contrôleur workspace", () => {
  const store = {
    state: { yearId: year.id, sujetId: sujet.id, reviewMode: true, globalRemaining: 100 },
    exercise: emptyProgress
  };
  const controller = createReportController({
    $: () => null,
    APP_CONFIG,
    POLE_ORDER: ["N", "S", "E", "W"],
    openModal() {},
    store,
    trainingLimitHTML: () => "",
    yearObj: () => year,
    sujetObj: () => sujet
  });
  const report = controller.computeReport();
  assert.equal(report.year, year.id);
  assert.equal(report.sujet, sujet.id);
  assert.equal(report.rows.length, sujet.exercises.length);
  assert.equal(report.grand, 0);
});

/* ---------- quick-check : الفحص الرباعي المعكوس (MIFTAH هـ) ---------- */

const { QUICK_CHECK_ITEMS, quickCheckHTML } = await import("../js/ui/workspace/quick-check.js");

test("le فحص رباعي معكوس liste 4 questions en ordre décroissant 4←3←2←1", () => {
  assert.deepEqual(
    QUICK_CHECK_ITEMS.map((item) => item.n),
    [4, 3, 2, 1]
  );
  const html = quickCheckHTML();
  assert.match(html, /الفحص الرباعي المعكوس/);
  for (const expected of ["كلمات السؤال", "بمعطى", "وحدته", "نفّذتُه"]) {
    assert.ok(html.includes(expected), `question manquante: ${expected}`);
  }
});
