import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { APP_CONFIG } from "../data/subjects.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CASES_PATH = join(__dirname, "hard-benchmark", "cases.json");
const SCHEMA_PATH = join(__dirname, "hard-benchmark", "schema.json");

function loadCases() {
  try {
    return JSON.parse(readFileSync(CASES_PATH, "utf8"));
  } catch {
    return { cases: [] };
  }
}

function loadSchema() {
  try {
    return JSON.parse(readFileSync(SCHEMA_PATH, "utf8"));
  } catch {
    return null;
  }
}

test("cases.json existe et est un objet JSON valide", () => {
  const data = loadCases();
  assert.ok(typeof data === "object", "cases.json doit être un objet");
  assert.ok(Array.isArray(data.cases), "cases.json.cases doit être un tableau");
});

test("cases.json peut rester vide — aucune copie n'est inventée", () => {
  const data = loadCases();
  assert.ok(Array.isArray(data.cases));
  if (data.cases.length === 0) {
    console.log("⚠️  0 copie réelle dans cases.json — pipeline prêt mais vide.");
  } else {
    console.log(`✅ ${data.cases.length} copie(s) réelle(s) déjà importée(s).`);
  }
});

test("schéma JSON présent et lisible", () => {
  const schema = loadSchema();
  assert.ok(schema, "schema.json doit être présent");
  assert.equal(schema.title, "HardBenchmarkCase");
});

test("validation manuelle d'une casse valide", () => {
  const schema = loadSchema();
  const valid = {
    id: "2025-S1-E1-N-001",
    year: "2025",
    sujet: 1,
    exercise: 1,
    pole: "N",
    category: "test",
    answer: "réponse suffisamment longue pour passer validation",
    source: "test",
    collector: "test",
    annotations: [
      { annotator: "correcteur-1", score: 1, note: "note 1" },
      { annotator: "correcteur-2", score: 1, note: "note 2" }
    ],
    date: "2025-08-23"
  };
  const required = schema.properties.cases.items.required;
  const missing = required.filter((f) => !(f in valid));
  assert.equal(missing.length, 0, `champs requis manquants: ${missing.join(", ")}`);
});

test("import-copy.mjs existe et est exécutable", () => {
  const importPath = join(__dirname, "hard-benchmark", "import-copy.mjs");
  const src = readFileSync(importPath, "utf8");
  assert.ok(src.includes("generateId"), "import-copy.mjs doit exporter generateId");
  assert.ok(src.includes("detectLLM"), "import-copy.mjs doit détecter les marqueurs LLM");
  assert.ok(src.includes("--dry-run"), "import-copy.mjs doit exposer --dry-run");
});

test("validateCase / generateId / detectLLM fonctionnent hors cases.json", async () => {
  const { validateCase, generateId, detectLLM } = await import("./hard-benchmark/import-copy.mjs");
  const valid = {
    id: "2025-S1-E1-N-001",
    year: "2025",
    sujet: 1,
    exercise: 1,
    pole: "N",
    category: "incomplet",
    answer: "المشكل العلمي غير مكتمل في هذه النسخة.",
    source: "centre-X / copie anonymisée",
    collector: "collecteur-A",
    annotations: [
      { annotator: "correcteur-A", score: 0.5, note: "forme partielle" },
      { annotator: "correcteur-B", score: 0.5, note: "forme partielle" }
    ],
    date: "2026-08-24"
  };
  assert.deepEqual(validateCase(valid), []);
  assert.ok(validateCase({ ...valid, answer: "ab" }).includes("answer trop courte"));
  assert.ok(validateCase({ ...valid, pole: "Z" }).includes("pole invalide"));
  assert.ok(
    validateCase({ ...valid, annotations: [valid.annotations[0]] }).includes(
      "deux annotations humaines indépendantes sont requises"
    )
  );
  assert.ok(
    validateCase({
      ...valid,
      annotations: [valid.annotations[0], { ...valid.annotations[0], note: "avis répété" }]
    }).includes("les deux annotations doivent venir de correcteurs distincts")
  );
  assert.equal(generateId([], "2025", 1, 1, "N"), "2025-S1-E1-N-001");
  assert.equal(generateId([valid], "2025", 1, 1, "N"), "2025-S1-E1-N-002");
  assert.ok(detectLLM("En conclusion, le mécanisme est clair.").includes("En conclusion"));
  assert.equal(detectLLM("نستنتج أن التدرج البروتوني شرط أساسي.").length, 0);
});

test("chaque copie importée possède deux annotations humaines distinctes", async () => {
  const { validateCase } = await import("./hard-benchmark/import-copy.mjs");
  for (const caseObj of loadCases().cases) {
    assert.deepEqual(validateCase(caseObj), [], `copie invalide: ${caseObj.id}`);
  }
});

test("dry-run valide une copie sans écrire dans cases.json", async () => {
  const { execFileSync } = await import("node:child_process");
  const { writeFileSync, unlinkSync } = await import("node:fs");
  const tmp = join(__dirname, "hard-benchmark", ".tmp-dry-run.json");
  const before = loadCases().cases.length;
  writeFileSync(
    tmp,
    JSON.stringify({
      year: "2025",
      sujet: 1,
      exercise: 1,
      pole: "N",
      category: "incomplet",
      answer: "كيف يتدخل ARN في تركيب البروتين؟",
      source: "centre-X / copie anonymisée",
      collector: "collecteur-A",
      annotations: [
        { annotator: "correcteur-A", score: 0.25, note: "ébauche" },
        { annotator: "correcteur-B", score: 0.25, note: "ébauche" }
      ],
      date: "2026-08-24"
    })
  );
  try {
    const out = execFileSync(
      process.execPath,
      [join(__dirname, "hard-benchmark", "import-copy.mjs"), tmp, "--dry-run"],
      { encoding: "utf8" }
    );
    assert.match(out, /Dry-run/);
    assert.equal(loadCases().cases.length, before);
  } finally {
    try {
      unlinkSync(tmp);
    } catch {
      /* ignore */
    }
  }
});

test("findPole résout un pôle existant", async () => {
  const { findPole } = await import("./hard-benchmark/_find-pole.mjs");
  const result = findPole("2025", 1, 1, "N");
  assert.ok(result, "findPole doit retourner un pôle existant");
  assert.equal(result.pole.points, 1);
});

test("findPole retourne null pour un pôle inexistant", async () => {
  const { findPole } = await import("./hard-benchmark/_find-pole.mjs");
  const result = findPole("2025", 1, 1, "Z");
  assert.equal(result, null);
});

test("findPole retourne null pour une année inexistante", async () => {
  const { findPole } = await import("./hard-benchmark/_find-pole.mjs");
  const result = findPole("1999", 1, 1, "N");
  assert.equal(result, null);
});

test("rapport de calibration : l'absence de copies reste explicitement non calibrée", async () => {
  const { buildCalibrationReport } = await import("./hard-benchmark/calibration-report.mjs");
  const report = buildCalibrationReport(loadCases().cases);
  assert.equal(report.calibrated, loadCases().cases.length > 0);
  assert.ok(report.activePoles > 0);
  if (!report.calibrated) assert.equal(report.meanAbsoluteError, null);
});

test("rapport de couverture : copies réelles par pôle APP_CONFIG", () => {
  const data = loadCases();
  const counts = new Map();
  for (const year of APP_CONFIG.years) {
    for (const sujet of year.sujets || []) {
      for (const ex of sujet.exercises || []) {
        for (const pole of ["N", "S", "E", "W"]) {
          if (!ex.poles?.[pole]) continue;
          const key = `${year.id}/S${sujet.id}/E${ex.number}/${pole}`;
          counts.set(key, 0);
        }
      }
    }
  }
  for (const c of data.cases) {
    const key = `${c.year}/S${c.sujet}/E${c.exercise}/${c.pole}`;
    if (counts.has(key)) counts.set(key, counts.get(key) + 1);
  }
  const empty = [...counts.entries()].filter(([, n]) => n === 0).map(([k]) => k);
  console.log(
    `📊 Couverture hard-benchmark : ${data.cases.length} copie(s) réelle(s) / ${counts.size} pôle(s).`
  );
  if (empty.length) {
    console.log(`⚠️  Pôles sans aucune copie réelle (${empty.length}) :`);
    empty.forEach((k) => console.log(`   - ${k}`));
  }
  assert.ok(counts.size > 0, "APP_CONFIG doit exposer au moins un pôle");
});
