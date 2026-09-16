/* ============================================================
   Filière maths — sessions 2022 et 2026 relues (corrigé appliqué)
   ------------------------------------------------------------
   Pourquoi ce test : la relecture image du 2026-09-14 a corrigé des
   réponses modèle fausses et rattaché des consignes qui n'appartenaient
   à aucun pôle. Ce verrou empêche de réintroduire les anciennes
   valeurs, et exige que chaque consigne imprimée du sujet soit citée
   par un pôle (ou signalée comme regroupée dans une consigne voisine).
   ============================================================ */
import { test } from "node:test";
import assert from "node:assert/strict";
import { YEAR_CATALOG, examMinutesForYear, loadYear } from "../data/subjects.js";
import { officialTaskInventoryFor } from "../data/official-tasks.js";

const year2022 = await loadYear("2022-m");
const year2026 = await loadYear("2026-m");

const poleOf = (year, subjectId, exerciseNumber, pole) =>
  year.sujets
    .find((subject) => subject.id === subjectId)
    .exercises.find((exercise) => exercise.number === exerciseNumber).poles[pole];

test("2022-m et 2026-m restent des épreuves complètes (2 sujets × 2 exercices, 8 + 12 / 6 + 14)", () => {
  for (const [id, counts] of [
    ["2022-m", [8, 12]],
    ["2026-m", [6, 14]]
  ]) {
    const entry = YEAR_CATALOG.find((year) => year.id === id);
    assert.ok(entry, `${id} absent du catalogue`);
    assert.equal(entry.stream, "m");
    assert.deepEqual(entry.exerciseCounts, [2, 2]);
  }
  for (const year of [year2022, year2026]) {
    assert.equal(examMinutesForYear(year), 150, "02 سا و30 د imprimé sur les deux sujets");
    for (const subject of year.sujets) {
      assert.equal(subject.exercises.length, 2);
      assert.equal(subject.pdfLocalUrl, `/subjects/M/${year.calendarYear}/sujet-${subject.id}.pdf`);
      assert.ok(officialTaskInventoryFor(year.id, subject.id), `${year.id} S${subject.id} sans inventaire`);
    }
  }
  assert.deepEqual(
    year2026.sujets.map((subject) => subject.exercises.map((exercise) => exercise.max)),
    [
      [6, 14],
      [8, 12]
    ]
  );
});

test("2022-m : les valeurs fausses du corrigé ne reviennent pas", () => {
  // (س) est le niveau بنائي ثانوي (et non primaire), (ع) ثالثي, (ص) رابعي.
  const s = poleOf(year2022, 2, 1, "S");
  assert.match(s.modelAnswer, /مستوى بنائي ثانوي/);
  assert.match(s.modelAnswer, /ثالثي/);
  assert.match(s.modelAnswer, /رابعي/);
  assert.doesNotMatch(s.modelAnswer, /المستوى \(س\): أولي/);
  assert.match(s.modelAnswer, /ج ← أ ← ب|ج ← أ ← ب/, "ordre des étapes (ج ← أ ← ب)");
  assert.ok(s.rule.keywords.includes("ثانوي"), "mots-clés alignés sur le corrigé");

  // Tableau 1 du corrigé : 5 غ / 10 إلى 30 غ (et non 11 إلى 13).
  const s2 = poleOf(year2022, 2, 2, "S");
  assert.match(s2.modelAnswer, /من 10 إلى 30 غ/);
  assert.doesNotMatch(s2.modelAnswer, /11 إلى 13/);

  // Numérotation du sujet : S1-E2 porte le texte du الجزء الثالث avec وضّح.
  const w = poleOf(year2022, 1, 2, "W");
  assert.match(w.bacPrompt, /وضّح كيف تُساهم هذه الدراسة/);
  assert.doesNotMatch(w.bacPrompt, /بيّن كيف تساهم/);

  // Le texte de S1-E1/E couvre les éléments du corrigé (مواقع A و P، شروط، معادلة).
  const e = poleOf(year2022, 1, 1, "E");
  assert.match(e.bacPrompt, /معادلة كيميائية/);
  assert.match(e.modelAnswer, /موقع القراءة/);
  assert.match(e.modelAnswer, /شروط الترجمة/);
});

test("2026-m : les consignes rattachées et les éléments du corrigé sont présents", () => {
  const e122 = poleOf(year2026, 1, 2, "E");
  assert.match(e122.bacPrompt, /برّر أنّ تثبيط بروتين PCSK9/);
  assert.match(e122.modelAnswer, /الثلاثية رقم 33/);
  assert.match(e122.modelAnswer, /لا يُجدي|لا يجدي/, "le النمط B ne répond pas au تثبيط");

  const e222 = poleOf(year2026, 2, 2, "E");
  assert.match(e222.bacPrompt, /قدّم نصيحة لتحسين الحالة الصحية/);
  assert.match(e222.modelAnswer, /إعادة امتصاص الشوارد من البول/);

  const e111 = poleOf(year2026, 1, 1, "E");
  assert.match(e111.bacPrompt, /مُهيكل بمقدمة وعرض وخاتمة/);

  const w = poleOf(year2026, 2, 2, "W");
  assert.match(w.bacPrompt, /مخطط وظيفي/);
});

test("plus aucune consigne maths n'est annoncée « non mappée » comme reste à faire", async () => {
  // Les notes peuvent raconter l'historique (« était notée non mappée »),
  // mais une note qui se termine sur « non mappée » signale une consigne
  // du sujet qui n'est rattachée à aucun pôle.
  for (const entry of YEAR_CATALOG.filter((year) => year.stream === "m")) {
    const year = await loadYear(entry.id);
    for (const subject of year.sujets) {
      for (const exercise of subject.exercises) {
        for (const [pole, data] of Object.entries(exercise.poles)) {
          const notes = data.bacPromptNotes || "";
          const idx = notes.indexOf("non mappée");
          if (idx === -1) continue;
          const tail = notes.slice(idx, idx + 80);
          assert.match(
            tail,
            /non mappée »[^.]{0,60} rattachée/,
            `${entry.id}/S${subject.id}E${exercise.number}${pole} : « non mappée » sans rattachement`
          );
        }
      }
    }
  }
});
