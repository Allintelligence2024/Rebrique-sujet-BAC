import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { findPole } from "./_find-pole.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CASES_PATH = join(__dirname, "cases.json");

function loadCases() {
  try {
    return JSON.parse(readFileSync(CASES_PATH, "utf8"));
  } catch {
    return { cases: [] };
  }
}

function saveCases(data) {
  data.cases.sort((a, b) => {
    if (a.year !== b.year) return a.year.localeCompare(b.year);
    if (a.sujet !== b.sujet) return a.sujet - b.sujet;
    if (a.exercise !== b.exercise) return a.exercise - b.exercise;
    return a.pole.localeCompare(b.pole);
  });
  writeFileSync(CASES_PATH, JSON.stringify(data, null, 2) + "\n");
}

function generateId(cases, year, sujet, exercise, pole) {
  const prefix = `${year}-S${sujet}-E${exercise}-${pole}`;
  const existing = cases
    .filter(c => c.id.startsWith(prefix))
    .map(c => parseInt(c.id.split("-").pop(), 10))
    .filter(n => !isNaN(n));
  const next = existing.length > 0 ? Math.max(...existing) + 1 : 1;
  return `${prefix}-${String(next).padStart(3, "0")}`;
}

const LLM_MARKERS = [
  "En ce qui concerne", "Il est important de noter", "Tout d'abord",
  "D'une part", "D'autre part", "En conclusion", "Par ailleurs",
  "Il convient de", "Il faut souligner", "En effet"
];

function detectLLM(text) {
  const hits = [];
  for (const marker of LLM_MARKERS) {
    if (text.includes(marker)) hits.push(marker);
  }
  return hits;
}

function validateCase(caseObj) {
  const errors = [];
  if (!caseObj.id || typeof caseObj.id !== "string") errors.push("id manquant");
  if (!caseObj.year || !/^\d{4}$/.test(caseObj.year)) errors.push("year invalide");
  if (typeof caseObj.sujet !== "number") errors.push("sujet invalide");
  if (typeof caseObj.exercise !== "number") errors.push("exercise invalide");
  if (!["N", "S", "E", "W"].includes(caseObj.pole)) errors.push("pole invalide");
  if (!caseObj.category || typeof caseObj.category !== "string") errors.push("category manquante");
  if (!caseObj.answer || typeof caseObj.answer !== "string" || caseObj.answer.length < 5) errors.push("answer trop courte");
  if (!caseObj.source || typeof caseObj.source !== "string") errors.push("source manquante");
  if (!caseObj.collector || typeof caseObj.collector !== "string") errors.push("collector manquant");
  if (!caseObj.annotator || typeof caseObj.annotator !== "string") errors.push("annotator manquant");
  if (!caseObj.date || !/^\d{4}-\d{2}-\d{2}$/.test(caseObj.date)) errors.push("date invalide (YYYY-MM-DD)");
  return errors;
}

function prompt(question) {
  const { createInterface } = await import("node:readline");
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans); }));
}

async function main() {
  let input = null;
  if (process.argv[2]) {
    try {
      input = JSON.parse(readFileSync(process.argv[2], "utf8"));
    } catch {
      console.error("Impossible de lire le fichier JSON:", process.argv[2]);
      process.exit(1);
    }
  }

  let data = loadCases();
  const caseObj = input || {};

  if (!input) {
    console.log("=== Import d'une copie réelle ===\n");
    caseObj.year = await prompt("Année (YYYY): ");
    caseObj.sujet = parseInt(await prompt("Sujet (1 ou 2): "), 10);
    caseObj.exercise = parseInt(await prompt("Exercice (1-3): "), 10);
    caseObj.pole = await prompt("Pôle (N/S/E/W): ").toUpperCase();
    caseObj.category = await prompt("Catégorie (ex: bonne-forme-fond-faux): ");
    caseObj.answer = await prompt("Réponse transcrite: ");
    caseObj.humanNote = await prompt("Note du correcteur: ");
    caseObj.source = await prompt("Source (fichier/établissement): ");
    caseObj.collector = await prompt("Collecteur: ");
    caseObj.annotator = await prompt("Annotateur: ");
    caseObj.date = await prompt("Date (YYYY-MM-DD): ");
  }

  const errors = validateCase(caseObj);
  if (errors.length) {
    console.error("❌ Validation échouée:", errors.join(", "));
    process.exit(1);
  }

  const poleInfo = findPole(caseObj.year, caseObj.sujet, caseObj.exercise, caseObj.pole);
  if (!poleInfo) {
    console.error("❌ Pôle introuvable dans data/subjects.js pour", caseObj.year, caseObj.sujet, caseObj.exercise, caseObj.pole);
    process.exit(1);
  }

  const llmHits = detectLLM(caseObj.answer);
  if (llmHits.length) {
    console.warn("⚠️  Marqueurs LLM détectés:", llmHits.join(", "));
    const confirm = input ? null : await prompt("Confirmer l'ajout malgré tout ? (oui/non): ");
    if (confirm !== "oui") {
      console.log("Import annulé.");
      process.exit(0);
    }
  }

  caseObj.id = generateId(data.cases, caseObj.year, caseObj.sujet, caseObj.exercise, caseObj.pole);
  data.cases.push(caseObj);
  saveCases(data);

  console.log(`✅ Copie importée: ${caseObj.id}`);
  console.log(`   Pôle: ${caseObj.year}/S${caseObj.sujet}/E${caseObj.exercise}/${caseObj.pole}`);
  console.log(`   Catégorie: ${caseObj.category}`);
  console.log(`   Source: ${caseObj.source}`);

  if (!input) {
    console.log("\nLancement de npm run test:hard ...");
    const { execSync } = await import("node:child_process");
    try {
      execSync("npm run test:hard", { stdio: "inherit", cwd: join(__dirname, "../../..") });
    } catch {
      console.log("(tests hard-benchmark terminés avec avertissements ou erreurs)");
    }
  }
}

main().catch(e => { console.error(e); process.exit(1); });
