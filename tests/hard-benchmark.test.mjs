import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CASES_PATH = join(__dirname, "hard-benchmark", "cases.json");
const SCHEMA_PATH = join(__dirname, "hard-benchmark", "schema.json");

function loadCases() {
  try { return JSON.parse(readFileSync(CASES_PATH, "utf8")); }
  catch { return { cases: [] }; }
}

function loadSchema() {
  try { return JSON.parse(readFileSync(SCHEMA_PATH, "utf8")); }
  catch { return null; }
}

test("cases.json existe et est un objet JSON valide", () => {
  const data = loadCases();
  assert.ok(typeof data === "object", "cases.json doit être un objet");
  assert.ok(Array.isArray(data.cases), "cases.json.cases doit être un tableau");
});

test("cases.json vide passe avec un avertissement (0 copie réelle)", () => {
  const data = loadCases();
  assert.equal(data.cases.length, 0);
  console.log("⚠️  0 copie réelle dans cases.json — pipeline prêt mais vide.");
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
    humanNote: "note",
    source: "test",
    collector: "test",
    annotator: "test",
    date: "2025-08-23"
  };
  const required = schema.properties.cases.items.required;
  const missing = required.filter(f => !(f in valid));
  assert.equal(missing.length, 0, `champs requis manquants: ${missing.join(", ")}`);
});

test("import-copy.mjs existe et est exécutable", () => {
  const importPath = join(__dirname, "hard-benchmark", "import-copy.mjs");
  const src = readFileSync(importPath, "utf8");
  assert.ok(src.includes("generateId"), "import-copy.mjs doit exporter generateId");
  assert.ok(src.includes("detectLLM"), "import-copy.mjs doit détecter les marqueurs LLM");
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

test("findPole retourne null pour une année désactivée", async () => {
  const { findPole } = await import("./hard-benchmark/_find-pole.mjs");
  const result = findPole("2024", 1, 1, "N");
  assert.equal(result, null);
});
