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
  /* 58 sujets = 29 sessions × 2 (14 SE, 14 Maths, 1 Maths exceptionnelle).
     Seule SE 2021 reste une armature sans inventaire depuis la structuration
     OCR des Maths 2013–2015 + 2017 استثنائية (2026-09-20) ; elle compte dans
     le dénominateur : un sujet sans inventaire reste un sujet non inventorié. */
  assert.match(byId["P1.1"].evidence, /\/58 inventaires complets/);
  /* 3915 = 261 consignes officielles × 15 copies (3195 jusqu'au 2026-09-19,
     avant les 48 consignes OCR nouvelles). */
  assert.match(byId["P1.5"].evidence, /0\/3915 copies/);
  assert.equal(byId["P1.2"].complete, false);
  assert.equal(byId["P1.3"].complete, true);
  assert.equal(byId["P1.4"].complete, true);
  assert.equal(byId["P1.5"].complete, false);
  assert.equal(byId["P1.6"].complete, true);
  assert.match(byId["P1.6"].evidence, /styles inline=0/);
});
