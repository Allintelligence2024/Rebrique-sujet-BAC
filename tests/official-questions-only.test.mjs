import { test } from "node:test";
import assert from "node:assert/strict";
import { loadAllYears } from "../data/subjects.js";
import { APP_CONFIG as FULL_APP_CONFIG } from "./helpers/full-app-config.mjs";
import { officialTaskInventoryFor } from "../data/official-tasks.js";
import { simulationExamHTML } from "../js/ui/screens/simulation.js";

/* ============================================================================
   Règle énoncée par le propriétaire (2026-09-19) : « les SE aussi doivent
   avoir SEULEMENT les questions officielles, comme les Maths ».

   Une tâche « reconstructed » est une étape que l'application a fabriquée
   faute de pouvoir relire la consigne dans le PDF. Ce n'est pas une question
   du sujet : la montrer dans une épreuve laissait croire à l'élève qu'elle
   comptait. Ce test verrouille les deux faces de la règle :
     1. aucune étape reconstruite n'est jamais rendue dans une épreuve ;
     2. un exercice sans consigne officielle ouvre une copie libre et LE DIT,
        au lieu d'afficher une question inventée ou un écran vide.
   ========================================================================== */

await loadAllYears();

const FREE_NOTE = "لا توجد تعليمة رسمية موثّقة لهذا التمرين";

function parse(html) {
  const sources = [...html.matchAll(/data-task-source="([^"]+)"/g)].map((match) => match[1]);
  const answers = [...html.matchAll(/data-task-answer="([^"]+)"/g)].map((match) => match[1]);
  return { sources, answers };
}

const sessions = [];
for (const year of FULL_APP_CONFIG.years) {
  for (const sujet of year.sujets || []) {
    if (officialTaskInventoryFor(year.id, sujet.id)) sessions.push({ year, sujet });
  }
}

test("aucune épreuve n'affiche une étape reconstruite", () => {
  let checked = 0;
  for (const { year, sujet } of sessions) {
    for (const exercise of sujet.exercises) {
      const html = simulationExamHTML({
        subject: sujet,
        inventory: officialTaskInventoryFor(year.id, sujet.id),
        activeExercise: exercise.number
      });
      const { sources, answers } = parse(html);
      for (const source of sources) {
        assert.equal(
          source,
          "official",
          `${year.id}/S${sujet.id}/E${exercise.number} affiche une étape ${source}`
        );
      }
      const inventory = officialTaskInventoryFor(year.id, sujet.id);
      const official = inventory.tasks.filter(
        (task) => task.exerciseNumber === exercise.number && task.promptSource === "official"
      );
      assert.deepEqual(
        answers,
        official.map((task) => task.id),
        `${year.id}/S${sujet.id}/E${exercise.number} : exactement les consignes officielles`
      );
      checked++;
    }
  }
  assert.ok(checked >= 100, `${checked} exercices vérifiés`);
});

test("un exercice sans consigne officielle ouvre une copie libre et le dit", () => {
  let withoutOfficial = 0;
  for (const { year, sujet } of sessions) {
    const inventory = officialTaskInventoryFor(year.id, sujet.id);
    for (const exercise of sujet.exercises) {
      const official = inventory.tasks.filter(
        (task) => task.exerciseNumber === exercise.number && task.promptSource === "official"
      );
      if (official.length > 0) continue;
      withoutOfficial++;
      const html = simulationExamHTML({
        subject: sujet,
        inventory,
        activeExercise: exercise.number
      });
      // Ni question inventée, ni écran mort : un champ de rédaction et l'aveu.
      assert.equal(parse(html).answers.length, 0, `${year.id}/S${sujet.id}/E${exercise.number}`);
      assert.match(
        html,
        new RegExp(`data-exercise-free="${exercise.number}"`),
        `${year.id}/S${sujet.id}/E${exercise.number} : une copie libre`
      );
      assert.match(html, new RegExp(FREE_NOTE), `${year.id}/S${sujet.id}/E${exercise.number} : annoncé`);
      assert.doesNotMatch(html, /بيانات هذا الموضوع غير صالحة/, "plus d'écran « données invalides »");
    }
  }
  /* Le nombre est un fait, pas une opinion : c'est la mesure qui oblige à
     garder le repli. Seul un inventaire relu à la main le fera baisser. */
  assert.ok(withoutOfficial > 0, "au moins un exercice sans consigne officielle");
  console.log(`      → ${withoutOfficial} exercices sans consigne officielle (copie libre)`);
});
