import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluateText } from "../js/engine.js";
import { buildDemoDiagnostic, DEMO_COPY, DEMO_LIMITS } from "../js/ui/demo-diagnostic.js";

test("la démonstration avant/après utilise un exemple explicitement interne et améliore le diagnostic", () => {
  const demo = buildDemoDiagnostic(evaluateText);
  assert.equal(demo.before.text, DEMO_COPY.before);
  assert.equal(demo.after.text, DEMO_COPY.after);
  assert.ok(demo.after.fraction > demo.before.fraction);
  assert.ok(demo.after.detected.length > demo.before.detected.length);
});

test("la démonstration expose explicitement les limites du moteur", () => {
  const demo = buildDemoDiagnostic(evaluateText);
  assert.deepEqual(demo.limits, DEMO_LIMITS);
  assert.ok(demo.limits.some((limit) => /لا يضمن علامة البكالوريا/.test(limit)));
  assert.ok(demo.limits.some((limit) => /قد يفوّت/.test(limit)));
});
