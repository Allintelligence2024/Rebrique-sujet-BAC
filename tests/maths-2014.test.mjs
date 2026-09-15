/* ============================================================
   Filière maths — session 2014 encodée (parité avec les SE)
   ------------------------------------------------------------
   Pourquoi ce test : la filière رياضيات ouvrait sa première
   épreuve en 2015, alors que le dossier dzexams local
   M/dzexams-bac-sciences-2369148.pdf (11 pages) porte le sujet
   2014 (pp. 1-4) ET son corrigé officiel « الإجابة النموذجية »
   (pp. 5-11). Ce scan est image seul (1 fragment de texte par
   page) : rien n'a pu être recopié depuis une couche texte.
   Ce test verrouille la session 2014-m : épreuve complète,
   inventaire mappé, barème officiel (10 + 10 par sujet), durée
   officielle (2 سا و30 د) et réponses modèle issues du corrigé
   (pHi 3 / 5 / 9.8 / 10.8 ; 4⁴ = 256 et 4×3×2×1 = 24 ;
   18 = 5 × 3 + 3 et 4 unités ; B أو O).
   ============================================================ */
import { test } from "node:test";
import assert from "node:assert/strict";
import { YEAR_CATALOG, examMinutesForYear, loadYear } from "../data/subjects.js";
import { officialTaskInventoryFor } from "../data/official-tasks.js";
import { buildOfficialCoverageReport, examOpenable } from "../js/domain/subjects/official-coverage.js";
import { simulationExamHTML } from "../js/ui/screens/simulation.js";

const entry = YEAR_CATALOG.find((year) => year.id === "2014-m");
const year = await loadYear("2014-m");

test("la session 2014 de la filière maths est une épreuve complète (2 sujets × 2 exercices)", () => {
  assert.ok(entry, "2014-m absent du catalogue : la carte reste en consultation externe");
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
    assert.equal(subject.pdfLocalUrl, `/subjects/M/2014/sujet-${subject.id}.pdf`);
  }
});

test("la durée officielle imprimée sur le sujet (02 سا و30 د) est celle de la session", () => {
  assert.equal(examMinutesForYear(year), 150);
});

test("chaque pôle de 2014-m est une tâche mappée, avec ses points exacts", () => {
  for (const subject of year.sujets) {
    const inventory = officialTaskInventoryFor("2014-m", subject.id);
    assert.ok(inventory, `S${subject.id} sans inventaire`);
    const report = buildOfficialCoverageReport({ yearId: "2014-m", subject, inventory });
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
        assert.match(data.bacPromptNotes, /2014/, `${pole} : année non citée dans la provenance`);
        assert.ok(Number.isInteger(data.bacPromptPage) && data.bacPromptPage >= 1 && data.bacPromptPage <= 4);
        assert.equal(data.bacPromptVerifiedAt, "2026-09-15");
      }
    }
  }
  // Neuf consignes imprimées deviennent officielles : l'exercice 1 du sujet 1
  // s'arrête à la question 3ب (W reconstruit), l'exercice 2 du sujet 1 a sa
  // question 4 imprimée, et les deux exercices du sujet 2 s'arrêtent sur leur
  // dernier pôle imprimé (Q4ج et Q3ج), les deux W étant reconstruits.
  assert.deepEqual(official.sort(), ["1-1E", "1-1S", "1-2E", "1-2S", "1-2W", "2-1E", "2-1S", "2-2E", "2-2S"]);
});

test("les pôles reconstruits expliquent leur reconstruction et ne citent aucune page", () => {
  const reconstruits = new Set(["1-1N", "1-1W", "1-2N", "2-1N", "2-1W", "2-2N", "2-2W"]);
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

test("les valeurs du corrigé officiel 2014 sont bien celles des réponses modèle", () => {
  const poles = year.sujets.flatMap((subject) =>
    subject.exercises.flatMap((exercise) =>
      Object.entries(exercise.poles).map(([pole, data]) => ({
        key: `S${subject.id}E${exercise.number}${pole}`,
        data
      }))
    )
  );
  const answer = (key) => poles.find((item) => item.key === key).data.modelAnswer;
  // ت1 sujet 1 : les quatre pHi, la migration à pH = 5 et les deux dénombrements.
  assert.match(answer("S1E1S"), /pHi الموافقة = 3/);
  assert.match(answer("S1E1S"), /9\.8/);
  assert.match(answer("S1E1S"), /10\.8/);
  assert.match(answer("S1E1S"), /256/);
  assert.match(answer("S1E1S"), /24/);
  assert.match(answer("S1E1E"), /ثالثيه|ثالثية/);
  assert.match(answer("S1E1E"), /كبريتيه|كبريتية/);
  assert.match(answer("S1E1E"), /شارديه|شاردية/);
  // ت2 sujet 1 : l'expérience de greffe, le typage et les définitions.
  assert.match(answer("S1E2S"), /غليكوبروتين/);
  assert.match(answer("S1E2E"), /100/);
  assert.match(answer("S1E2E"), /ارتصاص/);
  assert.match(answer("S1E2E"), /Anti A/);
  assert.match(answer("S1E2W"), /اللاذات/);
  // ت1 sujet 2 : les 18 bases, les 4 unités et les quatre différences ADN / ARNm.
  assert.match(answer("S2E1S"), /18/);
  assert.match(answer("S2E1S"), /15 \+ 3 = 18/);
  assert.match(answer("S2E1E"), /المواقع|الموقع A/);
  assert.match(answer("S2E1E"), /جدول/);
  // ت2 sujet 2 : le VIH, la problématique et le rôle de l'interleukine.
  assert.match(answer("S2E2S"), /BCR/);
  assert.match(answer("S2E2S"), /TCR/);
  assert.match(answer("S2E2E"), /gp120/);
  assert.match(answer("S2E2E"), /CD4/);
  assert.match(answer("S2E2E"), /أنترلوكينات/);
});

test("l'écran d'épreuve affiche les consignes officielles de 2014-m et badge les étapes reconstruites", () => {
  const subject = year.sujets[0];
  const inventory = officialTaskInventoryFor("2014-m", subject.id);
  const html = simulationExamHTML({ subject, inventory, activeExercise: 1, completed: false });
  assert.match(html, /انسب لكل حمض أميني قيمة الـ pHi المناسبة/);
  assert.match(html, /استنتج أنواع هذه الروابط/);
  assert.match(html, /مهام معروضة خطوات مُعاد بناؤها/);
  assert.equal((html.match(/data-task-source="official"/g) || []).length, 2);
  assert.equal((html.match(/data-task-source="reconstructed"/g) || []).length, 2);
  // Aucune réponse modèle n'est révélée pendant l'épreuve.
  assert.doesNotMatch(html, /256 نوعا/);
});
