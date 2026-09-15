/* ============================================================
   Filière maths — session 2017 : consignes ET corrigé officiels
   ------------------------------------------------------------
   Pourquoi ce test : 2017-m est la seule année maths dont les
   SEIZE pôles sont des consignes recopiées du scan, avec un
   corrigé officiel local à l'appui (M/dzexams-bac-sciences-2275712.pdf,
   « عناصر الإجابة » pp. 5-9). Aucun fichier de test ne la couvrait :
   une régression sur les consignes ou sur les réponses modèle
   (مستضد / جسم مضاد, ARNt/ARNm, مرحلة الاستطالة, الخلية البلازمية,
   les trois expériences de تراص +++++ et -----) restait invisible.
   Ce test verrouille : format 2 × (6 + 14), durée 2 سا و30 د,
   inventaire mappé, provenance des seize consignes et valeurs du
   corrigé.
   ============================================================ */
import { test } from "node:test";
import assert from "node:assert/strict";
import { YEAR_CATALOG, examMinutesForYear, loadYear } from "../data/subjects.js";
import { officialTaskInventoryFor } from "../data/official-tasks.js";
import { buildOfficialCoverageReport, examOpenable } from "../js/domain/subjects/official-coverage.js";
import { simulationExamHTML } from "../js/ui/screens/simulation.js";
import { matchConcept } from "../js/engine.js";

const entry = YEAR_CATALOG.find((year) => year.id === "2017-m");
const year = await loadYear("2017-m");

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

test("la session 2017 de la filière maths est une épreuve complète (2 sujets × 2 exercices 6 + 14)", () => {
  assert.ok(entry, "2017-m absent du catalogue");
  assert.equal(entry.stream, "m");
  assert.deepEqual(entry.exerciseCounts, [2, 2]);
  assert.equal(year.sujets.length, 2);
  for (const subject of year.sujets) {
    assert.deepEqual(
      subject.exercises.map((exercise) => exercise.max),
      [6, 14],
      `S${subject.id}: barème officiel 6 + 14`
    );
    assert.equal(subject.pdfLocalUrl, `/subjects/M/2017/sujet-${subject.id}.pdf`);
    assert.match(subject.pdfNote, /M\/dzexams-bac-sciences-2275712\.pdf/);
    assert.match(subject.pdfNote, /عناصر الإجابة/);
  }
});

test("la durée officielle imprimée sur le sujet (02 سا و30 د) est celle de la session", () => {
  assert.equal(examMinutesForYear(year), 150);
});

test("chaque pôle de 2017-m est une tâche mappée, avec ses points exacts", () => {
  for (const subject of year.sujets) {
    const inventory = officialTaskInventoryFor("2017-m", subject.id);
    assert.ok(inventory, `S${subject.id} sans inventaire`);
    const report = buildOfficialCoverageReport({ yearId: "2017-m", subject, inventory });
    assert.deepEqual(report.errors, []);
    assert.equal(examOpenable(report), true, `S${subject.id} fermé à l'épreuve`);
    assert.equal(report.knownTaskCount, 8, "4 étapes par exercice");
    assert.equal(report.mappedTaskCount, 8);
    assert.equal(report.knownPoints, 20, "20 points sur 20 par sujet");
  }
});

test("les seize consignes viennent du scan, avec page et provenance", () => {
  const official = [];
  for (const { key, data } of poles()) {
    assert.ok(data.bacPrompt && data.bacPrompt.trim(), key);
    assert.equal(data.bacPromptSource, "official", `${key} devrait être officielle`);
    official.push(key);
    assert.match(data.bacPromptNotes, /Relecture du scan 2017 Maths/, `${key} : provenance`);
    assert.ok(
      Number.isInteger(data.bacPromptPage) && data.bacPromptPage >= 1 && data.bacPromptPage <= 4,
      `${key} : page hors du sujet`
    );
    assert.equal(data.bacPromptVerifiedAt, "2026-09-13");
  }
  assert.equal(official.length, 16, "aucun pôle reconstruit : le sujet porte toutes ses questions");
  assert.equal(new Set(official).size, 16);
});

test("les valeurs du corrigé officiel 2017 sont bien celles des réponses modèle", () => {
  const answers = new Map(poles().map(({ key, data }) => [key, data.modelAnswer]));
  // ت1 du sujet 1 : (س) مستضد et (ع) جسم مضاد, document = معقد مناعي.
  assert.match(answers.get("S1E1N"), /مستضد/);
  assert.match(answers.get("S1E1N"), /جسم مضاد/);
  assert.match(answers.get("S1E1N"), /معقد مناعي/);
  // ت1 du sujet 1 : le corrigé n'annonce aucun nombre de liaisons inventé.
  assert.match(answers.get("S1E1S"), /السلسلة الخفيفة/);
  assert.match(answers.get("S1E1S"), /الحسور ثنائية الكبريت|ثنائية الكبريت/);
  // ت2 du sujet 1 : ARNt / ARNm / حمض أميني et les six repères numérotés.
  assert.match(answers.get("S1E2E"), /ARNt/);
  assert.match(answers.get("S1E2E"), /ARNm/);
  assert.match(answers.get("S1E2E"), /رابطة ببتيدية/);
  assert.match(answers.get("S1E2E"), /الموقع A/);
  assert.match(answers.get("S1E2E"), /الموقع P/);
  // ت2 du sujet 1 : stade d'élongation et séquences du corrigé.
  assert.match(answers.get("S1E2W"), /مرحلة الاستطالة/);
  assert.match(answers.get("S1E2W"), /Met–Ala–Val–Ala–Asn–Ile–Phé–Gly/);
  assert.match(answers.get("S1E2W"), /TAC–CGA–CAA–CGA–TTA–TAG–AAA–CCA/);
  assert.match(answers.get("S1E2W"), /ATG–GCT–GTT–GCT–AAT–ATC–TTT–GGT/);
  // ت1 du sujet 2 : équation Lys–Glu–Gly avec deux liaisons peptidiques.
  assert.match(answers.get("S2E1E"), /Lys–Glu–Gly/);
  assert.match(answers.get("S2E1E"), /رابطتين ببتيديتين/);
  // ت2 du sujet 2 : la cellule productrice est la الخلية البلازمية.
  assert.match(answers.get("S2E2S"), /الخلية البلازمية/);
  assert.match(answers.get("S2E2S"), /الشبكة الهيولية/);
  // ت2 du sujet 2 : les trois expériences de la chambre de Marbrook.
  assert.match(answers.get("S2E2W"), /تراص كامل \(\+{5}\)/);
  assert.match(answers.get("S2E2W"), /غياب التراص \(-{5}\)/);
});

test("l'écran d'épreuve affiche les consignes officielles de 2017-m sans dévoiler les réponses", () => {
  const subject = year.sujets[0];
  const inventory = officialTaskInventoryFor("2017-m", subject.id);
  const html = simulationExamHTML({ subject, inventory, activeExercise: 1, completed: false });
  assert.match(html, /سمِّ الجزيئتين/);
  assert.match(html, /قدّم رسما تفسيريا/);
  assert.equal((html.match(/data-task-source="official"/g) || []).length, 4);
  assert.equal((html.match(/data-task-source="reconstructed"/g) || []).length, 0);
  assert.doesNotMatch(html, /محدّد مستضدي/);
  assert.doesNotMatch(html, /الحسور ثنائية الكبريت/);
});

test("chaque mot-clé de S2E2W matche sa propre réponse modèle", () => {
  // « بلاسم » était le reliquat de l'ancienne graphie « بلاسموسيت » : la
  // réponse modèle écrit بلازموسيتات, donc ce radical ne pouvait plus rien
  // attraper (بلاسم ≠ بلازم pour normalizeArabic). Corrigé en « بلازم »,
  // comme « لمفاو » et « تعاون » qui sont déjà des radicaux dans la même liste.
  const { data } = poles().find((item) => item.key === "S2E2W");
  assert.ok(data, "S2E2W absent");
  assert.ok(data.rule.keywords.includes("بلازم"), "radical بلازم attendu");
  assert.ok(!data.rule.keywords.includes("بلاسم"), "reliquat بلاسم");
  assert.match(data.modelAnswer, /بلازموسيتات/);
  for (const keyword of data.rule.keywords) {
    assert.ok(matchConcept(data.modelAnswer, keyword), `mot-clé mort : ${keyword}`);
  }
});
