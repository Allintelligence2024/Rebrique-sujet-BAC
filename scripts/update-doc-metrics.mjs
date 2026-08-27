import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFileSync(join(root, path), "utf8");

// Mêmes fichiers que `npm test` (`node --test tests/*.test.mjs`) :
// uniquement les *.test.mjs de premier niveau de tests/ (pas tests/e2e/).
const testFiles = readdirSync(join(root, "tests"))
  .filter((name) => name.endsWith(".test.mjs"))
  .sort();

const countDeclarations = (file) => [...file.matchAll(/^\s*test\s*\(/gm)].length;
let declared = 0;
for (const name of testFiles) declared += countDeclarations(read(`tests/${name}`));

// tests/bac-benchmark.test.mjs déclare un test() dans une boucle qui s'exécute
// une fois par entrée de BENCHMARK_CASES : le comptage statique sous-déclare le
// nombre de tests réellement exécutés (1 déclaration → N exécutions).
const benchmark = read("tests/bac-benchmark.test.mjs");
const loopDeclarations = countDeclarations(benchmark);
const benchmarkCases = [...benchmark.matchAll(/^\s{4}label: /gm)].length;
const executed = declared - loopDeclarations + benchmarkCases;

const benchmarkCorpus = JSON.parse(read("tests/hard-benchmark/cases.json")).cases.length;
const uiLines = read("js/ui.js").trimEnd().split("\n").length;
const generated = `<!-- AUTO-METRICS:START -->

- Tests exécutés par \`npm test\` : **${executed}** (comptage statique des \`test()\` déclarés dans \`tests/*.test.mjs\`, boucle \`BENCHMARK_CASES\` comprise)
- Copies vérifiées dans le hard benchmark : **${benchmarkCorpus}**
- Taille de la façade UI (js/ui.js) : **${uiLines} lignes**

<!-- AUTO-METRICS:END -->`;
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
  console.log(`README metrics updated. (${testFiles.length} fichiers, ${executed} tests)`);
}
