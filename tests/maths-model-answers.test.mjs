/* ============================================================
   Filière maths — chaque réponse modèle satisfait sa propre règle
   ------------------------------------------------------------
   Pourquoi ce test : l'audit du 2026-09-13 avait relevé des pôles
   dont la réponse modèle ne contenait pas les mots-clés exigés
   (formes ة/ه, synonymes). L'élève qui recopiait la réponse modèle
   n'obtenait donc pas la validation attendue, et le corrigé
   affiché se contredisait lui-même.
   Le 2026-09-14, quatre règles impossibles à satisfaire ont été
   ajustées (2017-m S2E2W, 2018-m S2E2E, 2018-m S2E2W,
   2020-m S1E1W) et deux réponses modèle de 2018-m ont reçu les
   termes exacts du corrigé (الرامزة، المورثة، ARNm).
   Ce test verrouille la cohérence : `evaluateText(réponse, règle)`
   doit rendre `hits >= req` pour chaque pôle des années maths.
   ============================================================ */
import { test } from "node:test";
import assert from "node:assert/strict";
import { YEAR_CATALOG, loadYear } from "../data/subjects.js";
import { evaluateText } from "../js/domain/evaluation/text-evaluator.js";

const mathsYears = YEAR_CATALOG.filter((entry) => entry.stream === "m");

test("chaque réponse modèle des années maths satisfait sa propre règle", async () => {
  const failures = [];
  let poles = 0;
  for (const entry of mathsYears) {
    const year = await loadYear(entry.id);
    for (const subject of year.sujets) {
      for (const exercise of subject.exercises) {
        for (const [pole, data] of Object.entries(exercise.poles)) {
          poles += 1;
          assert.ok(
            data.modelAnswer && data.modelAnswer.trim(),
            `${entry.id}/S${subject.id}E${exercise.number}${pole}`
          );
          const result = evaluateText(data.modelAnswer, data.rule, pole);
          if (result.hits < result.req) {
            failures.push(
              `${entry.id}/S${subject.id}E${exercise.number}${pole}: ${result.hits}/${result.req} hits, manquants: ${result.missing.join(", ")}`
            );
          }
        }
      }
    }
  }
  assert.deepEqual(failures, [], failures.join("\n"));
  assert.ok(poles >= 160, `160 pôles maths attendus, ${poles} trouvés`);
});

test("aucun mot-clé de règle n'est un score ni une note chiffrée", async () => {
  // Politique produit : le moteur ne renvoie jamais de note. Les nombres
  // restent admis comme concepts (275, 64, 3…) mais jamais comme barème.
  for (const entry of mathsYears) {
    const year = await loadYear(entry.id);
    for (const subject of year.sujets) {
      for (const exercise of subject.exercises) {
        for (const [pole, data] of Object.entries(exercise.poles)) {
          for (const keyword of data.rule.keywords) {
            assert.doesNotMatch(
              String(Array.isArray(keyword) ? keyword[0] : keyword),
              /^(نقطة|نقاط|point|points)$/i,
              `${entry.id}/S${subject.id}E${exercise.number}${pole}`
            );
          }
        }
      }
    }
  }
});

test("aucune note des années maths ne prétend qu'un corrigé est absent du dépôt", async () => {
  // Les corrigés officiels 2017–2020 sont dans le dépôt (dossiers dzexams
  // `M/dzexams-bac-sciences-*.pdf`) et ceux de 2021–2022 y ont été repérés
  // (pp. 7–12 / 7–13). Une note qui affirme le contraire redevient une fausse
  // information sur la provenance des réponses modèle.
  for (const entry of mathsYears) {
    const year = await loadYear(entry.id);
    for (const subject of year.sujets) {
      for (const exercise of subject.exercises) {
        for (const [pole, data] of Object.entries(exercise.poles)) {
          assert.doesNotMatch(
            data.bacPromptNotes || "",
            /absent du dépôt/,
            `${entry.id}/S${subject.id}E${exercise.number}${pole} : corrigé annoncé absent`
          );
        }
      }
    }
  }
});
