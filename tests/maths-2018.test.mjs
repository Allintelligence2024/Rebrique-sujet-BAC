/* ============================================================
   Filière maths — session 2018 : corrigé officiel réinjecté
   ------------------------------------------------------------
   Pourquoi ce test : 2018-m a été la première année maths dont les
   réponses modèle ont été RÉÉCRITES depuis le corrigé officiel
   (M/dzexams-bac-sciences-1967487.pdf, « الإجابة النموذجية » pp. 7-12)
   après une première passe rédigée depuis le programme — celle-ci
   s'était trompée sur les stades des figures, l'identité de (a)/(b) et
   les séquences peptidiques. Aucun fichier de test ne couvrait 2018 :
   ce test verrouille le format (7 + 13 / 6 + 14), la seule étape
   reconstruite, la provenance et les valeurs du corrigé.
   ============================================================ */
import { test } from "node:test";
import assert from "node:assert/strict";
import { YEAR_CATALOG, examMinutesForYear, loadYear } from "../data/subjects.js";
import { officialTaskInventoryFor } from "../data/official-tasks.js";
import { buildOfficialCoverageReport, examOpenable } from "../js/domain/subjects/official-coverage.js";
import { simulationExamHTML } from "../js/ui/screens/simulation.js";

const entry = YEAR_CATALOG.find((year) => year.id === "2018-m");
const year = await loadYear("2018-m");

function poles() {
  return year.sujets.flatMap((subject) =>
    subject.exercises.flatMap((exercise) =>
      Object.entries(exercise.poles).map(([pole, data]) => ({
        key: `S${subject.id}E${exercise.number}${pole}`,
        data
      }))
    )
  );
}

test("la session 2018 de la filière maths est une épreuve complète (2 sujets × 2 exercices 7 + 13 / 6 + 14)", () => {
  assert.ok(entry, "2018-m absent du catalogue");
  assert.equal(entry.stream, "m");
  assert.deepEqual(entry.exerciseCounts, [2, 2]);
  assert.deepEqual(
    year.sujets.map((subject) => subject.exercises.map((exercise) => exercise.max)),
    [
      [7, 13],
      [6, 14]
    ]
  );
  for (const subject of year.sujets) {
    assert.equal(subject.pdfLocalUrl, `/subjects/M/2018/sujet-${subject.id}.pdf`);
    assert.match(subject.pdfNote, /M\/dzexams-bac-sciences-1967487\.pdf/);
    assert.match(subject.pdfNote, /pp\. 7-12/);
  }
});

test("la durée officielle imprimée sur le sujet (02 سا و30 د) est celle de la session", () => {
  assert.equal(examMinutesForYear(year), 150);
});

test("chaque pôle de 2018-m est une tâche mappée, avec ses points exacts", () => {
  for (const subject of year.sujets) {
    const inventory = officialTaskInventoryFor("2018-m", subject.id);
    assert.ok(inventory, `S${subject.id} sans inventaire`);
    const report = buildOfficialCoverageReport({ yearId: "2018-m", subject, inventory });
    assert.deepEqual(report.errors, []);
    assert.equal(examOpenable(report), true, `S${subject.id} fermé à l'épreuve`);
    assert.equal(report.knownTaskCount, 8);
    assert.equal(report.mappedTaskCount, 8);
    assert.equal(report.knownPoints, 20);
  }
});

test("quinze consignes du scan et une seule étape reconstruite", () => {
  const official = [];
  const reconstructed = [];
  for (const { key, data } of poles()) {
    assert.ok(data.bacPrompt && data.bacPrompt.trim(), key);
    if (data.bacPromptSource === "official") {
      official.push(key);
      assert.match(data.bacPromptNotes, /Relecture du scan 2018 Maths/, `${key} : provenance`);
      assert.ok(
        Number.isInteger(data.bacPromptPage) && data.bacPromptPage >= 2 && data.bacPromptPage <= 6,
        `${key} : page hors du sujet`
      );
      assert.equal(data.bacPromptVerifiedAt, "2026-09-13", `${key} : date de relecture`);
      continue;
    }
    reconstructed.push(key);
    assert.equal(data.bacPromptSource, "reconstructed");
    assert.equal(data.bacPromptPage ?? null, null, `${key} : une étape reconstruite ne cite pas de page`);
    assert.match(data.bacPromptNotes, /Pas une question BAC autonome/, `${key} : motif`);
  }
  assert.deepEqual(official.sort(), [
    "S1E1E",
    "S1E1N",
    "S1E1S",
    "S1E2E",
    "S1E2N",
    "S1E2S",
    "S1E2W",
    "S2E1E",
    "S2E1N",
    "S2E1S",
    "S2E1W",
    "S2E2E",
    "S2E2N",
    "S2E2S",
    "S2E2W"
  ]);
  assert.deepEqual(reconstructed.sort(), ["S1E1W"]);
});

test("la seule étape reconstruite ne prétend plus que le corrigé est absent du dépôt", () => {
  const note = poles().find(({ key }) => key === "S1E1W").data.bacPromptNotes;
  assert.match(note, /corrigé officiel 2018 est dans le dépôt/);
  assert.doesNotMatch(note, /absent du dépôt/);
});

test("les valeurs du corrigé officiel 2018 sont bien celles des réponses modèle", () => {
  const answers = new Map(poles().map(({ key, data }) => [key, data.modelAnswer]));
  // ت1 du sujet 1 : les dix repères, (س) الاستنساخ / (ص) الترجمة.
  assert.match(answers.get("S1E1N"), /ARN بوليميراز/);
  assert.match(answers.get("S1E1N"), /الاستنساخ ومقرها النواة/);
  assert.match(answers.get("S1E1N"), /الترجمة ومقرها/);
  // ت1 : les deux stades de la traduction — النهاية puis الاستطالة (et non l'inverse).
  assert.match(answers.get("S1E1S"), /الشكل \(أ\) مرحلة النهاية/);
  assert.match(answers.get("S1E1S"), /\(ب\) مرحلة الاستطالة/);
  assert.match(answers.get("S1E1S"), /القطب \(\+\)/);
  // ت2 du sujet 1 : (a) = CD4 et (b) = TCR, puis VIH / LT4 / IL-2.
  assert.match(answers.get("S1E2E"), /CD4/);
  assert.match(answers.get("S1E2E"), /TCR/);
  assert.match(answers.get("S1E2E"), /الأنترلوكين 2/);
  assert.match(answers.get("S1E2W"), /CMH II/);
  assert.match(answers.get("S1E2W"), /LT4/);
  // ت1 du sujet 2 : le vaccin (الأناتوكسين) crée une mémoire иммуниtaire.
  assert.match(answers.get("S2E1W"), /عصيات الكزاز/);
  assert.match(answers.get("S2E1W"), /الأناتوكسين|اللقاح/);
  assert.match(answers.get("S2E1W"), /ذاكرة مناعية/);
  // ت2 du sujet 2 : chaînes du tableau et du الشكل (أ).
  assert.match(answers.get("S2E2S"), /His – Phe – Asp – Pro – Ser – Val/);
  assert.match(answers.get("S2E2S"), /GTA AAA CTA GGA AGT CAG ATT/);
  assert.match(answers.get("S2E2S"), /CAT TTT GAT CCT TCA GTC TAA/);
  // ت2 : la mutation chiffrée du corrigé (A 362 → T, acide aminé 120).
  assert.match(answers.get("S2E2E"), /His–Tyr–Asp–Pro–Ser–Val/);
  assert.match(answers.get("S2E2E"), /رقم 362/);
  assert.match(answers.get("S2E2E"), /رقم 120/);
  assert.match(answers.get("S2E2E"), /Phe/);
  assert.match(answers.get("S2E2E"), /Tyr/);
});

test("l'écran d'épreuve affiche les consignes officielles de 2018-m et badge l'étape reconstruite", () => {
  const subject = year.sujets[0];
  const inventory = officialTaskInventoryFor("2018-m", subject.id);
  const html = simulationExamHTML({ subject, inventory, activeExercise: 1, completed: false });
  assert.match(html, /اكتب البيانات المرقمة من 1 إلى 10/);
  assert.match(html, /تعرّف على مرحلتي الظاهرة/);
  assert.equal((html.match(/data-task-source="official"/g) || []).length, 3);
  assert.equal((html.match(/data-task-source="reconstructed"/g) || []).length, 1);
  assert.match(html, /1 من 4 مهام معروضة خطوات مُعاد بناؤها/);
  // Aucune réponse modèle (ni la mutation chiffrée) n'est révélée pendant l'épreuve.
  assert.doesNotMatch(html, /رقم 362/);
  assert.doesNotMatch(html, /مرحلة الاستطالة/);
});
