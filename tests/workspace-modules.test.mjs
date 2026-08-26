import { test } from "node:test";
import assert from "node:assert/strict";
import { APP_CONFIG } from "../data/subjects.js";
import { createReportController } from "../js/ui/workspace/report-controller.js";

const year = APP_CONFIG.years.find((item) => item.enabled);
const sujet = year.sujets[0];
const emptyProgress = () => ({
  scores: { N: 0, S: 0, E: 0, W: 0 },
  answeredAny: false
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
