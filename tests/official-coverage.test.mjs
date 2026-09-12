import { test } from "node:test";
import assert from "node:assert/strict";
import { APP_CONFIG } from "./helpers/full-app-config.mjs";
import { officialTaskInventoryFor } from "../data/official-tasks.js";
import {
  assertSimulationEligible,
  buildOfficialCoverageReport
} from "../js/domain/subjects/official-coverage.js";

const year2025 = APP_CONFIG.years.find((year) => year.id === "2025");
const subject2025S1 = year2025.sujets.find((subject) => subject.id === 1);

function completeFixture() {
  return {
    schemaVersion: 1,
    status: "complete",
    source: { locator: "official.pdf", verifiedAt: "2026-09-07" },
    scope: { inventoriedExerciseNumbers: [1], taskCompleteExerciseNumbers: [1] },
    tasks: [
      {
        id: "2026-S1-E1-Q1",
        exerciseNumber: 1,
        order: 1,
        page: 1,
        prompt: "تعليمة رسمية",
        maxPoints: 5,
        scoringReviewStatus: "verified",
        documentReviewStatus: "not-required",
        documentRefs: [],
        trainingMappings: [{ exerciseNumber: 1, pole: "E", kind: "direct" }]
      }
    ]
  };
}

test("le pilote 2025/S1 inventorie les douze pôles et marque leur provenance", () => {
  const inventory = officialTaskInventoryFor("2025", 1);
  const report = buildOfficialCoverageReport({ yearId: "2025", subject: subject2025S1, inventory });

  // Un pôle = une tâche inventoriée : les trois exercices du sujet sont couverts.
  assert.equal(inventory.tasks.length, 12);
  assert.deepEqual(inventory.scope.inventoriedExerciseNumbers, [1, 2, 3]);
  assert.deepEqual(inventory.tasks[0].id, "2025-S1-E1-Q1");
  // Provenance réelle : seules les consignes officielles portent une page.
  const official = inventory.tasks.filter((task) => task.promptSource === "official");
  const reconstructed = inventory.tasks.filter((task) => task.promptSource === "reconstructed");
  assert.equal(official.length, 8);
  assert.equal(reconstructed.length, 4);
  assert.ok(official.every((task) => Number.isInteger(task.page)));
  assert.ok(reconstructed.every((task) => task.page === null));
  // Le barème reste provisoire : rien n'est marqué vérifié.
  assert.ok(inventory.tasks.every((task) => task.scoringReviewStatus === "provisional"));
  assert.equal(inventory.source.humanVerified, false);
  assert.equal(report.inventoryStatus, "partial");
  assert.equal(report.knownTaskCount, 12);
  assert.equal(report.mappedTaskCount, 12);
  assert.equal(report.knownTaskMappingPercent, 100);
  assert.equal(report.overallTaskCoveragePercent, null);
  assert.deepEqual(report.errors, []);
});

test("une absence d'inventaire donne une couverture inconnue, jamais 0% ou 100%", () => {
  const report = buildOfficialCoverageReport({ yearId: "2025", subject: subject2025S1, inventory: null });
  assert.equal(report.inventoryStatus, "missing");
  assert.equal(report.knownTaskMappingPercent, null);
  assert.equal(report.overallTaskCoveragePercent, null);
  assert.equal(report.simulationEligible, false);
  assert.throws(() => assertSimulationEligible(report), /inventory-missing/);
});

test("un inventaire synthétique complet, vérifié et borné peut franchir la garde", () => {
  const subject = { id: 1, exercises: [{ number: 1, max: 5, poles: { E: {} } }] };
  const report = buildOfficialCoverageReport({ yearId: "2026", subject, inventory: completeFixture() });
  assert.equal(report.overallTaskCoveragePercent, 100);
  assert.equal(report.simulationEligible, true);
  assert.equal(assertSimulationEligible(report), true);
});

test("une tâche non mappée ou un total de points incohérent bloque la simulation", () => {
  const subject = { id: 1, exercises: [{ number: 1, max: 5, poles: { E: {} } }] };
  const inventory = completeFixture();
  inventory.tasks[0].maxPoints = 4;
  inventory.tasks[0].trainingMappings = [];
  inventory.tasks[0].documentReviewStatus = "pending";
  const report = buildOfficialCoverageReport({ yearId: "2026", subject, inventory });

  assert.equal(report.simulationEligible, false);
  assert.ok(report.blockers.includes("task-mapping-incomplete"));
  assert.ok(report.blockers.includes("documents-unreviewed"));
  assert.ok(report.blockers.includes("points-incomplete"));
  assert.ok(report.errors.some((error) => error.includes("task points do not match")));
});

test("les inventaires réels ouvrent l'épreuve sans jamais se prétendre complets", () => {
  // Décision produit (data/bac-mode-policy.js) : l'épreuve est ouverte sur un
  // inventaire partiel, à condition que le partiel soit dit explicitement.
  for (const year of APP_CONFIG.years) {
    for (const subject of year.sujets || []) {
      const inventory = officialTaskInventoryFor(year.id, subject.id);
      const label = `${year.id}/S${subject.id}`;
      assert.ok(inventory, `${label} sans inventaire`);
      assert.equal(
        buildOfficialCoverageReport({
          yearId: year.id,
          subject,
          inventory
        }).simulationEligible,
        true,
        `${label} devrait être ouvert à l'épreuve`
      );
      // Ce qui ne bouge pas : aucun inventaire ne se déclare complet ni vérifié.
      assert.notEqual(inventory.status, "complete", `${label} se déclare complet`);
      assert.ok(
        inventory.tasks.every((task) => task.scoringReviewStatus !== "verified"),
        `${label} annonce un barème vérifié`
      );
      assert.equal(inventory.source.humanVerified, false, `${label} annonce une relecture humaine`);
    }
  }
});
