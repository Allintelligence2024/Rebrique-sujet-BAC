import { test } from "node:test";
import assert from "node:assert/strict";
import { buildP1Status } from "../scripts/report-p1-status.mjs";
import { CALIBRATION_STATUS } from "../data/calibration-status.js";
import { CALIBRATION_THRESHOLDS } from "../data/calibration-policy.js";

test("le statut P1 refuse un faux 100 % tant que les inventaires et copies manquent", () => {
  const status = buildP1Status();
  const byId = Object.fromEntries(status.gates.map((gate) => [gate.id, gate]));
  assert.equal(status.complete, false);
  assert.equal(status.completedGates, 3);
  assert.equal(status.totalGates, 6);
  assert.equal(byId["P1.1"].complete, false);
  // Le nombre de sujets audités grandit avec les années encodées : on vérifie
  // la forme de la preuve et sa cohérence interne au lieu de figer un total.
  const inventoryEvidence = byId["P1.1"].evidence.match(
    /^(\d+)\/(\d+) inventaires complets; (\d+) tâches connues$/
  );
  assert.ok(inventoryEvidence, `preuve P1.1 inattendue: ${byId["P1.1"].evidence}`);
  assert.equal(Number(inventoryEvidence[1]), 0);
  assert.ok(Number(inventoryEvidence[2]) >= 48, "les sujets encodés ne peuvent pas régresser");
  assert.ok(Number(inventoryEvidence[3]) >= 488);
  // Le minimum dépend du nombre de pôles actifs : on le calcule au lieu de le figer.
  const requiredCopies = CALIBRATION_STATUS.activePoles * CALIBRATION_THRESHOLDS.minimumCopiesPerPole;
  assert.match(byId["P1.5"].evidence, new RegExp(`0/${requiredCopies} copies`));
  assert.equal(byId["P1.2"].complete, false);
  assert.equal(byId["P1.3"].complete, true);
  assert.equal(byId["P1.4"].complete, true);
  assert.equal(byId["P1.5"].complete, false);
  assert.equal(byId["P1.6"].complete, true);
  assert.match(byId["P1.6"].evidence, /styles inline=0/);
});
