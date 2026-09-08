import { test } from "node:test";
import assert from "node:assert/strict";
import { APP_CONFIG } from "../data/subjects.js";
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

test("le pilote 2025/S1 sépare deux tâches officielles des quatre étapes N/S/E/W", () => {
  const inventory = officialTaskInventoryFor("2025", 1);
  const report = buildOfficialCoverageReport({ yearId: "2025", subject: subject2025S1, inventory });

  assert.equal(inventory.tasks.length, 2);
  assert.deepEqual(
    inventory.tasks.map((task) => task.id),
    ["2025-S1-E1-Q1", "2025-S1-E1-Q2"]
  );
  assert.equal(inventory.tasks[1].trainingMappings.length, 3);
  assert.equal(report.inventoryStatus, "partial");
  assert.equal(report.knownTaskCount, 2);
  assert.equal(report.mappedTaskCount, 2);
  assert.equal(report.knownTaskMappingPercent, 100);
  assert.equal(report.overallTaskCoveragePercent, null);
  assert.equal(report.simulationEligible, false);
  assert.ok(report.blockers.includes("inventory-partial"));
  assert.ok(report.blockers.includes("scoring-unverified"));
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

test("aucun sujet réel n'est promu en simulation tant que son inventaire n'est pas complet", () => {
  for (const year of APP_CONFIG.years) {
    for (const subject of year.sujets || []) {
      const report = buildOfficialCoverageReport({
        yearId: year.id,
        subject,
        inventory: officialTaskInventoryFor(year.id, subject.id)
      });
      assert.equal(report.simulationEligible, false, `${year.id}/S${subject.id} promu prématurément`);
    }
  }
});
