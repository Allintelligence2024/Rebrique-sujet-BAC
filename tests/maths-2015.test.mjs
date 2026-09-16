/* ============================================================
   Filière maths — session 2015 encodée (parité avec les SE)
   ------------------------------------------------------------
   Pourquoi ce test : la filière رياضيات n'ouvrait une épreuve
   qu'à partir de 2016, alors que le dossier dzexams local
   M/dzexams-bac-sciences-2723927.pdf porte le sujet 2015
   (pp. 1-4) ET son corrigé officiel « الإجابة النموذجية وسلم
   التنقيط » (pp. 5-10). Ce scan est image seul : rien n'a pu être
   recopié depuis une couche texte.
   Ce test verrouille la session 2015-m : épreuve complète,
   inventaire mappé, barème officiel (10 + 10 par sujet), durée
   officielle (2 سا و30 د) et réponses modèle issues du corrigé
   (503 = (133+174+117+133) − 3×18 ; pHi = 4.5 ; 90 % dans le
   milieu 4 ; O+ / AB− / B+ / A+).
   ============================================================ */
import { test } from "node:test";
import assert from "node:assert/strict";
import { YEAR_CATALOG, examMinutesForYear, loadYear } from "../data/subjects.js";
import { officialTaskInventoryFor } from "../data/official-tasks.js";
import { buildOfficialCoverageReport, examOpenable } from "../js/domain/subjects/official-coverage.js";
import { simulationExamHTML } from "../js/ui/screens/simulation.js";

const entry = YEAR_CATALOG.find((year) => year.id === "2015-m");
const year = await loadYear("2015-m");

test("la session 2015 de la filière maths est une épreuve complète (2 sujets × 2 exercices)", () => {
  assert.ok(entry, "2015-m absent du catalogue : la carte reste en consultation externe");
  assert.equal(entry.stream, "m");
  assert.deepEqual(entry.exerciseCounts, [2, 2]);
  assert.equal(year.sujets.length, 2);
  for (const subject of year.sujets) {
    assert.equal(subject.exercises.length, 2);
    assert.deepEqual(
      subject.exercises.map((exercise) => exercise.max),
      [10, 10],
      `S${subject.id}: barème officiel 10 + 10`
    );
    assert.equal(subject.pdfLocalUrl, `/subjects/M/2015/sujet-${subject.id}.pdf`);
  }
});

test("la durée officielle imprimée sur le sujet (02 سا و30 د) est celle de la session", () => {
  assert.equal(examMinutesForYear(year), 150);
});

test("chaque pôle de 2015-m est une tâche mappée, avec ses points exacts", () => {
  for (const subject of year.sujets) {
    const inventory = officialTaskInventoryFor("2015-m", subject.id);
    assert.ok(inventory, `S${subject.id} sans inventaire`);
    const report = buildOfficialCoverageReport({ yearId: "2015-m", subject, inventory });
    assert.deepEqual(report.errors, []);
    assert.equal(examOpenable(report), true, `S${subject.id} fermé à l'épreuve`);
    assert.equal(report.knownTaskCount, 8, "4 étapes par exercice");
    assert.equal(report.mappedTaskCount, 8);
    assert.equal(report.knownPoints, 20, "20 points sur 20 par sujet");
  }
});

test("les consignes recopiées du scan sont marquées official et pointent une page du sujet", () => {
  const official = [];
  for (const subject of year.sujets) {
    for (const exercise of subject.exercises) {
      for (const [pole, data] of Object.entries(exercise.poles)) {
        assert.ok(data.bacPrompt && data.bacPrompt.trim(), `S${subject.id}E${exercise.number}${pole}`);
        if (data.bacPromptSource !== "official") continue;
        official.push(`${subject.id}-${exercise.number}${pole}`);
        assert.match(data.bacPromptNotes, /relu en image|Relecture du scan/, `${pole} : provenance`);
        assert.match(data.bacPromptNotes, /2015/, `${pole} : année non citée dans la provenance`);
        assert.ok(Number.isInteger(data.bacPromptPage) && data.bacPromptPage >= 1 && data.bacPromptPage <= 4);
        assert.equal(data.bacPromptVerifiedAt, "2026-09-15");
      }
    }
  }
  // Les préambules ne portent aucune question de cadrage imprimée : les quatre
  // pôles N sont reconstruits, les onze autres viennent du scan (le pôle W de
  // 2015-m S1-E2 n'a pas de consigne de clôture imprimée).
  assert.deepEqual(official.sort(), [
    "1-1E",
    "1-1S",
    "1-1W",
    "1-2E",
    "1-2S",
    "2-1E",
    "2-1S",
    "2-1W",
    "2-2E",
    "2-2S",
    "2-2W"
  ]);
});

test("les pôles reconstruits expliquent leur reconstruction et ne citent aucune page", () => {
  const reconstruits = new Set(["1-1N", "1-2N", "1-2W", "2-1N", "2-2N"]);
  for (const subject of year.sujets) {
    for (const exercise of subject.exercises) {
      const key = `${subject.id}-${exercise.number}`;
      for (const [pole, data] of Object.entries(exercise.poles)) {
        if (!reconstruits.has(`${key}${pole}`)) continue;
        assert.equal(data.bacPromptSource, "reconstructed", `${key}${pole}`);
        assert.equal(data.bacPromptPage ?? null, null, `${key}${pole} : page déclarée`);
        assert.match(data.bacPromptNotes, /reformulation du préambule|Aucune consigne de clôture imprimée/);
      }
    }
  }
});

test("les valeurs du corrigé officiel 2015 sont bien celles des réponses modèle", () => {
  const poles = year.sujets.flatMap((subject) =>
    subject.exercises.flatMap((exercise) =>
      Object.entries(exercise.poles).map(([pole, data]) => ({
        key: `S${subject.id}E${exercise.number}${pole}`,
        data
      }))
    )
  );
  const answer = (key) => poles.find((item) => item.key === key).data.modelAnswer;
  // t1 du sujet 1 : la masse du peptide et l'appariement acide aminé / migration.
  assert.match(answer("S1E1E"), /503/);
  assert.match(answer("S1E1E"), /557 − 54/);
  assert.match(answer("S1E1E"), /AUG-GAC-GUC-AGA-GAU-UAA/);
  assert.match(answer("S1E1E"), /Asp-Val-Arg-Asp/);
  assert.match(answer("S1E1E"), /2\.98/);
  assert.match(answer("S1E1E"), /10\.7/);
  // t2 du sujet 1 : les zones de la famille et l'absence de clôture imprimée.
  assert.match(answer("S1E2S"), /O\+/);
  assert.match(answer("S1E2S"), /AB−/);
  assert.match(answer("S1E2S"), /B\+/);
  assert.match(answer("S1E2S"), /A\+/);
  assert.match(answer("S1E2E"), /غالاكتوز/);
  // t1 du sujet 2 : pHi, la relation charnière et la source du soufre.
  assert.match(answer("S2E1S"), /pHi = 4\.5|pHi لهذه الجزيئة = 4\.5/);
  assert.match(answer("S2E1E"), /3\.08/);
  assert.match(answer("S2E1E"), /10\.7/);
  assert.match(answer("S2E1E"), /Cys/);
  // t2 du sujet 2 : les milieux de la culture et la nature de la réponse.
  assert.match(answer("S2E2E"), /90 %|90/);
  assert.match(answer("S2E2W"), /Anti-Hbs/);
  assert.match(answer("S2E2W"), /LTc/);
});

test("l'écran d'épreuve affiche les consignes officielles de 2015-m et badge l'étape reconstruite", () => {
  const subject = year.sujets[0];
  const inventory = officialTaskInventoryFor("2015-m", subject.id);
  const html = simulationExamHTML({ subject, inventory, activeExercise: 1, completed: false });
  assert.match(html, /حلّل نتائج الوثيقة/);
  assert.match(html, /اقترح فرضية تحدّد من خلالها عدد الوحدات البنائية/);
  assert.match(html, /1 من 4 مهام معروضة خطوات مُعاد بناؤها/);
  assert.equal((html.match(/data-task-source="official"/g) || []).length, 3);
  assert.equal((html.match(/data-task-source="reconstructed"/g) || []).length, 1);
  // Aucune réponse modèle n'est révélée pendant l'épreuve.
  assert.doesNotMatch(html, /557 − 54/);
});
