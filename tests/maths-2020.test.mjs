/* ============================================================
   Filière maths — session 2020 encodée (parité avec les SE)
   ------------------------------------------------------------
   Pourquoi ce test : la filière رياضيات n'ouvrait une épreuve
   qu'à partir de 2021, alors que le PDF officiel 2020 était déjà
   livré dans subjects/M/2020/ (visible en consultation). Ce test
   verrouille la session 2020-m : elle doit rester une ÉPREUVE
   (pas une simple consultation), couverte par un inventaire dont
   les consignes recopient les questions du scan, avec le barème
   officiel (8 + 12 par sujet) et la durée officielle (2 سا و30 د).
   ============================================================ */
import { test } from "node:test";
import assert from "node:assert/strict";
import { YEAR_CATALOG, examMinutesForYear, loadYear } from "../data/subjects.js";
import { officialTaskInventoryFor } from "../data/official-tasks.js";
import { buildOfficialCoverageReport, examOpenable } from "../js/domain/subjects/official-coverage.js";
import { simulationExamHTML } from "../js/ui/screens/simulation.js";

const entry = YEAR_CATALOG.find((year) => year.id === "2020-m");
const year = await loadYear("2020-m");

test("la session 2020 de la filière maths est une épreuve complète (2 sujets × 2 exercices)", () => {
  assert.ok(entry, "2020-m absent du catalogue : la carte reste en consultation externe");
  assert.equal(entry.stream, "m");
  assert.deepEqual(entry.exerciseCounts, [2, 2]);
  assert.equal(year.sujets.length, 2);
  for (const subject of year.sujets) {
    assert.equal(subject.exercises.length, 2);
    assert.deepEqual(
      subject.exercises.map((exercise) => exercise.max),
      [8, 12],
      `S${subject.id}: barème officiel 8 + 12`
    );
    assert.equal(subject.pdfLocalUrl, `/subjects/M/2020/sujet-${subject.id}.pdf`);
  }
});

test("la durée officielle imprimée sur le sujet (02 سا و30 د) est celle de la session", () => {
  assert.equal(examMinutesForYear(year), 150);
});

test("chaque pôle de 2020-m est une tâche mappée, avec ses points exacts", () => {
  for (const subject of year.sujets) {
    const inventory = officialTaskInventoryFor("2020-m", subject.id);
    assert.ok(inventory, `S${subject.id} sans inventaire`);
    const report = buildOfficialCoverageReport({ yearId: "2020-m", subject, inventory });
    assert.deepEqual(report.errors, []);
    assert.equal(examOpenable(report), true, `S${subject.id} fermé à l'épreuve`);
    assert.equal(report.knownTaskCount, 8, "4 étapes par exercice");
    assert.equal(report.mappedTaskCount, 8);
    assert.equal(report.knownPoints, 20, "20 points sur 20 par sujet");
  }
});

test("les consignes recopiées du scan sont marquées official et pointent une page du fichier", () => {
  const official = [];
  for (const subject of year.sujets) {
    for (const exercise of subject.exercises) {
      for (const [pole, data] of Object.entries(exercise.poles)) {
        assert.ok(data.bacPrompt && data.bacPrompt.trim(), `S${subject.id}E${exercise.number}${pole}`);
        if (data.bacPromptSource !== "official") continue;
        official.push(`${subject.id}-${exercise.number}${pole}`);
        assert.match(data.bacPromptNotes, /relu en image/, `${pole} : provenance non documentée`);
        assert.match(data.bacPromptNotes, /scan 2020/, `${pole} : source non citée`);
        assert.ok(Number.isInteger(data.bacPromptPage) && data.bacPromptPage >= 1);
        assert.equal(data.bacPromptVerifiedAt, "2026-09-13");
      }
    }
  }
  // Les questions de cadrage officielles (« صُغ المشكل العلمي », « أبرز المشكلة المطروحة »)
  // existent réellement dans le sujet : elles sont marquées official, pas reconstruites.
  assert.deepEqual(official.sort(), [
    "1-1E",
    "1-1S",
    "1-2E",
    "1-2N",
    "1-2S",
    "2-1E",
    "2-1S",
    "2-2E",
    "2-2N",
    "2-2S"
  ]);
});

test("aucune étape reconstruite ne prétend citer le sujet ni porter une page", () => {
  for (const subject of year.sujets) {
    for (const exercise of subject.exercises) {
      for (const [pole, data] of Object.entries(exercise.poles)) {
        if (data.bacPromptSource !== "reconstructed") continue;
        assert.equal(data.bacPromptPage ?? null, null, `S${subject.id}E${exercise.number}${pole}`);
        assert.match(
          data.bacPromptNotes,
          /Pas de question officielle|Clôture/,
          `S${subject.id}E${exercise.number}${pole} : reconstruction non expliquée`
        );
      }
    }
  }
});

test("l'écran d'épreuve affiche les consignes officielles de 2020-m et badge les étapes reconstruites", () => {
  const subject = year.sujets[0];
  const inventory = officialTaskInventoryFor("2020-m", subject.id);
  const html = simulationExamHTML({ subject, inventory, activeExercise: 1, completed: false });
  // Les questions du scan apparaissent telles quelles.
  assert.match(html, /تعرّف على البيانات المرقمة/);
  assert.match(html, /اكتب نصا علميا تبيّن فيه تأثير درجة pH/);
  assert.match(html, /2 من 4 مهام معروضة خطوات مُعاد بناؤها/);
  // Les pastilles de provenance : 2 officielles + 2 reconstruites sur l'exercice 1.
  assert.equal((html.match(/data-task-source="official"/g) || []).length, 2);
  assert.equal((html.match(/data-task-source="reconstructed"/g) || []).length, 2);
  // Aucun corrigé n'est révélé pendant l'épreuve.
  assert.doesNotMatch(html, /رابطة كارهة للماء/);
});
