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
  /* 58 sujets = 29 sessions × 2 (15 SE, 14 Maths, 1 Maths exceptionnelle).
     Depuis la structuration OCR de SE 2021 (2026-09-20), TOUS les sujets
     portent un inventaire — 8 sont complets depuis SE 2013-2016 vérifiées. */
  assert.match(byId["P1.1"].evidence, /\/58 inventaires complets/);
  /* 5955 = 397 consignes officielles × 15 copies (3195 jusqu'au 2026-09-19 ;
     3915 avec les 48 consignes OCR Maths ; 4155 avec les 16 consignes OCR de
     SE 2021 ; 4515 avec SE 2013 vérifiée ; 4875 avec SE 2014 vérifiée ; 5235 avec SE 2015 ; 5595 avec SE 2016 ; 5955 avec SE 2017). */
  assert.match(byId["P1.5"].evidence, /0\/5955 copies/);
  assert.equal(byId["P1.2"].complete, false);
  assert.equal(byId["P1.3"].complete, true);
  assert.equal(byId["P1.4"].complete, true);
  assert.equal(byId["P1.5"].complete, false);
  assert.equal(byId["P1.6"].complete, true);
  assert.match(byId["P1.6"].evidence, /styles inline=0/);
});
