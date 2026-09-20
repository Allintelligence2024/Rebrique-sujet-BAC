/* ============================================================
   Inventaire d'un sujet (pôles, points, provenance, pages)
   ------------------------------------------------------------
   Usage :
     node scripts/report-subject-inventory.mjs 2024-m
     node scripts/report-subject-inventory.mjs            # toutes les années maths
   Lit les payloads réels (data/years/**) — pas data/official-tasks.js —
   pour montrer ce que l'élève verra : consigne, provenance (official /
   reconstructed), page et points par pôle.
   ============================================================ */
import { loadAllYears } from "../data/subjects.js";

const only = process.argv[2];
const streamFilter = only ? null : "-m";
const years = await loadAllYears();

for (const year of years) {
  if (only && year.id !== only) continue;
  if (!only && streamFilter && !year.id.endsWith(streamFilter)) continue;
  for (const subject of year.sujets) {
    console.log(`\n########## ${year.id} S${subject.id} ${subject.title}`);
    for (const exercise of subject.exercises) {
      console.log(`--- ت${exercise.number} (${exercise.max}ن) :: ${exercise.label}`);
      for (const [pole, data] of Object.entries(exercise.poles || {})) {
        const source = data.bacPromptSource || "?";
        const page = data.bacPromptPage ? ` p${data.bacPromptPage}` : "";
        const flag = data.answerStatus === "synthetic" ? " [réponse-gabarit]" : "";
        console.log(`    [${pole}] ${data.points}ن ${source}${page}${flag}`);
        console.log(`        ${data.bacPrompt}`);
      }
    }
  }
}
