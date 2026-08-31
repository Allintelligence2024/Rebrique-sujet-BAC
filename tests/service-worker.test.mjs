import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(__dirname, "..", "sw.js"), "utf8");

test("le precache contient tous les modules locaux importés par l'application", () => {
  for (const asset of [
    "./js/main.js",
    "./js/app-version.js",
    "./js/ui.js",
    "./js/store.js",
    "./js/engine.js",
    "./js/method-scripts.js",
    "./js/application/timers.js",
    "./js/domain/evaluation/text-analysis.js",
    "./js/domain/evaluation/text-evaluator.js",
    "./js/domain/evaluation/pipeline-evaluator.js",
    "./js/domain/evaluation/methodology.js",
    "./js/domain/evaluation/quality-checks.js",
    "./js/services/sound-engine.js",
    "./js/services/speech-recognition.js",
    "./js/services/diagnostics.js",
    "./js/ui/atlas.js",
    "./js/ui/dialogs.js",
    "./js/ui/dom.js",
    "./js/ui/navigation.js",
    "./js/ui/screens/hub.js",
    "./js/ui/screens/guide.js",
    "./js/ui/screens/strategy.js",
    "./js/ui/screens/onboarding.js",
    "./js/ui/screens/workspace.js",
    "./js/ui/workspace/feedback.js",
    "./js/ui/workspace/text-exercise.js",
    "./js/ui/workspace/pipeline-exercise.js",
    "./js/ui/workspace/scratchpad.js",
    "./js/ui/reports/report.js",
    "./js/ui/reports/exports.js",
    "./data/subjects.js",
    "./data/year-2026-se.js",
    "./data/year-2021-m.js",
    "./data/archive.js",
    "./data/brouillon.js"
  ]) {
    assert.ok(source.includes(`"${asset}"`), `${asset} manque au precache`);
  }
});

test("le cache PWA est versionné par le build", () => {
  assert.match(source, /importScripts\("\.\/js\/app-version\.js"\)/);
  assert.match(source, /boussole4d-\$\{self\.APP_BUILD_ID/);
});

test("le fallback index.html est réservé aux navigations", () => {
  assert.match(source, /e\.request\.mode === "navigate"/);
  assert.match(source, /return Response\.error\(\)/);
});
