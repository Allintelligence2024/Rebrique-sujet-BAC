import { test } from "node:test";
import assert from "node:assert/strict";
import { buildP1Status } from "../scripts/report-p1-status.mjs";

test("le statut P1 refuse un faux 100 % tant que les inventaires et copies manquent", () => {
  const status = buildP1Status();
  const byId = Object.fromEntries(status.gates.map((gate) => [gate.id, gate]));
  assert.equal(status.complete, false);
  assert.equal(status.completedGates, 3);
  assert.equal(status.totalGates, 6);
  assert.equal(byId["P1.1"].complete, false);
  assert.match(byId["P1.1"].evidence, /\/38 inventaires complets/);
  assert.match(byId["P1.5"].evidence, /0\/2235 copies/);
  assert.equal(byId["P1.2"].complete, false);
  assert.equal(byId["P1.3"].complete, true);
  assert.equal(byId["P1.4"].complete, true);
  assert.equal(byId["P1.5"].complete, false);
  assert.equal(byId["P1.6"].complete, true);
  assert.match(byId["P1.6"].evidence, /styles inline=0/);
});
