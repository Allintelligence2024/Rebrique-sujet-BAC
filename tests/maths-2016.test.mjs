/* ============================================================
   Filière maths — session 2016 encodée (parité avec les SE)
   ------------------------------------------------------------
   Pourquoi ce test : la filière رياضيات n'ouvrait une épreuve
   qu'à partir de 2017, alors que le dossier dzexams local
   M/dzexams-bac-sciences-1413929.pdf porte le sujet 2016
   (pp. 1-4) ET son corrigé officiel « عناصر الإجابة » (pp. 5-11).
   Ce test verrouille la session 2016-m : épreuve complète,
   inventaire mappé, barème officiel (10 + 10 par sujet), durée
   officielle (2 سا و30 د) et réponses modèle issues du corrigé
   (429 = 3 × 143 ; 141 = 1 − 142 ; 16.66 % = 1 × 100 ÷ 6).
   ============================================================ */
import { test } from "node:test";
import assert from "node:assert/strict";
import { YEAR_CATALOG, examMinutesForYear, loadYear } from "../data/subjects.js";
import { officialTaskInventoryFor } from "../data/official-tasks.js";
import { buildOfficialCoverageReport, examOpenable } from "../js/domain/subjects/official-coverage.js";
import { simulationExamHTML } from "../js/ui/screens/simulation.js";

const entry = YEAR_CATALOG.find((year) => year.id === "2016-m");
const year = await loadYear("2016-m");

test("la session 2016 de la filière maths est une épreuve complète (2 sujets × 2 exercices)", () => {
  assert.ok(entry, "2016-m absent du catalogue : la carte reste en consultation externe");
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
    assert.equal(subject.pdfLocalUrl, `/subjects/M/2016/sujet-${subject.id}.pdf`);
  }
});

test("la durée officielle imprimée sur le sujet (02 سا و30 د) est celle de la session", () => {
  assert.equal(examMinutesForYear(year), 150);
});

test("chaque pôle de 2016-m est une tâche mappée, avec ses points exacts", () => {
  for (const subject of year.sujets) {
    const inventory = officialTaskInventoryFor("2016-m", subject.id);
    assert.ok(inventory, `S${subject.id} sans inventaire`);
    const report = buildOfficialCoverageReport({ yearId: "2016-m", subject, inventory });
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
        assert.match(data.bacPromptNotes, /2016/, `${pole} : année non citée dans la provenance`);
        assert.ok(Number.isInteger(data.bacPromptPage) && data.bacPromptPage >= 1 && data.bacPromptPage <= 4);
        assert.equal(data.bacPromptVerifiedAt, "2026-09-14");
      }
    }
  }
  // Le préambule ne porte aucune question de cadrage imprimée : les quatre pôles
  // N sont reconstruits, tout le reste (12 pôles) vient du scan.
  assert.deepEqual(official.sort(), [
    "1-1E",
    "1-1S",
    "1-1W",
    "1-2E",
    "1-2S",
    "1-2W",
    "2-1E",
    "2-1S",
    "2-1W",
    "2-2E",
    "2-2S",
    "2-2W"
  ]);
});

test("les quatre pôles reconstruits expliquent leur reconstruction et ne citent aucune page", () => {
  for (const subject of year.sujets) {
    for (const exercise of subject.exercises) {
      const data = exercise.poles.N;
      assert.equal(data.bacPromptSource, "reconstructed", `S${subject.id}E${exercise.number}N`);
      assert.equal(data.bacPromptPage ?? null, null);
      assert.match(data.bacPromptNotes, /Pas de question de cadrage imprimée|reformulation du préambule/);
    }
  }
});

test("les valeurs du corrigé officiel 2016 sont bien celles des réponses modèle", () => {
  const poles = year.sujets.flatMap((subject) =>
    subject.exercises.flatMap((exercise) =>
      Object.entries(exercise.poles).map(([pole, data]) => ({
        key: `S${subject.id}E${exercise.number}${pole}`,
        data
      }))
    )
  );
  const answer = (key) => poles.find((item) => item.key === key).data.modelAnswer;
  // t1 du sujet 2 : nombre de niqueotides de l'ARNm et unités de la protéine.
  assert.match(answer("S2E1E"), /429 = 3 × 143/);
  assert.match(answer("S2E1E"), /141 = 1 − 142/);
  // t2 du sujet 2 : identité de l'allèle C3 et taux de compatibilité des parents.
  assert.match(answer("S2E2E"), /1 × 100 ÷ 6 = 16\.66 %/);
  assert.match(answer("S2E2W"), /A2 C5 B12/);
  assert.match(answer("S2E2W"), /A17 C6 B34/);
  // t1 du sujet 1 : masse de la chaîne et codons/anticodons du corrigé.
  assert.match(answer("S1E1E"), /روابط كيميائية/);
  assert.match(answer("S1E1S"), /إنزيم ARN بوليميراز/);
  // t2 du sujet 1 : la thymine est la preuve de l'ADN, l'uracile celle de l'ARNm.
  assert.match(answer("S2E1S"), /التيمين/);
  assert.match(answer("S2E1S"), /اليوراسيل/);
});

test("l'écran d'épreuve affiche les consignes officielles de 2016-m et badge l'étape reconstruite", () => {
  const subject = year.sujets[0];
  const inventory = officialTaskInventoryFor("2016-m", subject.id);
  const html = simulationExamHTML({ subject, inventory, activeExercise: 1, completed: false });
  assert.match(html, /اكتب أسماء البيانات المرقمة/);
  assert.match(html, /اكتب نصا علميا بيّن فيه دور العناصر المتدخلة في تركيب البروتين/);
  assert.match(html, /1 من 4 مهام معروضة خطوات مُعاد بناؤها/);
  assert.equal((html.match(/data-task-source="official"/g) || []).length, 3);
  assert.equal((html.match(/data-task-source="reconstructed"/g) || []).length, 1);
  // Aucune réponse modèle n'est révélée pendant l'épreuve.
  assert.doesNotMatch(html, /روابط كيميائية/);
});
