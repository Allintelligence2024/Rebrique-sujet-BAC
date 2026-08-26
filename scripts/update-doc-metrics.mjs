import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFileSync(join(root, path), "utf8");
const tests =
  [...read("tests/all-buttons.test.mjs").matchAll(/^\s*test\s*\(/gm)].length +
  [...read("tests/analysis-grid.test.mjs").matchAll(/^\s*test\s*\(/gm)].length +
  [...read("tests/bac-benchmark.test.mjs").matchAll(/^\s*test\s*\(/gm)].length +
  [...read("tests/data-integrity.test.mjs").matchAll(/^\s*test\s*\(/gm)].length +
  [...read("tests/data-selfcheck.test.mjs").matchAll(/^\s*test\s*\(/gm)].length +
  [...read("tests/engine-2024.test.mjs").matchAll(/^\s*test\s*\(/gm)].length +
  [...read("tests/engine.test.mjs").matchAll(/^\s*test\s*\(/gm)].length +
  [...read("tests/hard-benchmark.test.mjs").matchAll(/^\s*test\s*\(/gm)].length +
  [...read("tests/method-coach.test.mjs").matchAll(/^\s*test\s*\(/gm)].length +
  [...read("tests/security-baseline.test.mjs").matchAll(/^\s*test\s*\(/gm)].length +
  [...read("tests/service-worker.test.mjs").matchAll(/^\s*test\s*\(/gm)].length +
  [...read("tests/store.test.mjs").matchAll(/^\s*test\s*\(/gm)].length +
  [...read("tests/ui.test.mjs").matchAll(/^\s*test\s*\(/gm)].length;
const benchmarkCases = JSON.parse(read("tests/hard-benchmark/cases.json")).cases.length;
const uiLines = read("js/ui.js").split("\n").length;
const generated = `<!-- AUTO-METRICS:START -->\n\n- Déclarations \`test()\` détectées statiquement : **${tests}**\n- Copies vérifiées dans le hard benchmark : **${benchmarkCases}**\n- Taille de la façade UI : **${uiLines} lignes**\n\n<!-- AUTO-METRICS:END -->`;
const path = join(root, "README.md");
const current = read("README.md");
const next = current.replace(/<!-- AUTO-METRICS:START -->[\s\S]*?<!-- AUTO-METRICS:END -->/, generated);
if (next === current && !current.includes("<!-- AUTO-METRICS:START -->"))
  throw new Error("README auto-metrics markers missing");
if (process.argv.includes("--check")) {
  if (next !== current) {
    console.error("README metrics are stale. Run: npm run docs:update");
    process.exit(1);
  }
  console.log("README metrics are current.");
} else {
  writeFileSync(path, next);
  console.log("README metrics updated.");
}
