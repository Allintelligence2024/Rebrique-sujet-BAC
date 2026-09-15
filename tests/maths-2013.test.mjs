/* ============================================================
   Filière maths — session 2013 encodée (parité avec les SE)
   ------------------------------------------------------------
   Pourquoi ce test : la filière رياضيات n'ouvrait son mode BAC
   qu'à partir de 2014, alors que le dossier dzexams local
   M/dzexams-bac-sciences-2770867.pdf porte le sujet 2013
   (pp. 1-4) ET son corrigé officiel « الإجابة النموذجية »
   (pp. 5-11). Les onze pages ont été relues en image le
   2026-09-15 (scan image seul : 1 fragment de texte par page).
   Ce test verrouille la session 2013-m : épreuve complète,
   inventaire mappé, barème officiel (10 + 10 par sujet), durée
   officielle (2 سا و30 د) et les valeurs du corrigé
   (2³ = 8 ; AUG/Met et UAA/UAG/UGA ; AAG/ACC/UGG/GGC ;
   H2N–CH(R1)–CO–NH–CH(R2)–CO–NH–CH(R3)–COOH ; قوس الترسيب
   بين الحفرتين (م) و(د) ; مناعة خلطية ; ظهور ARNm في الخلية
   البلازمية).
   ============================================================ */
import { test } from "node:test";
import assert from "node:assert/strict";
import { YEAR_CATALOG, examMinutesForYear, loadYear } from "../data/subjects.js";
import { officialTaskInventoryFor } from "../data/official-tasks.js";
import { buildOfficialCoverageReport, examOpenable } from "../js/domain/subjects/official-coverage.js";
import { simulationExamHTML } from "../js/ui/screens/simulation.js";

const entry = YEAR_CATALOG.find((year) => year.id === "2013-m");
const year = await loadYear("2013-m");

test("la session 2013 de la filière maths est une épreuve complète (2 sujets × 2 exercices)", () => {
  assert.ok(entry, "2013-m absent du catalogue : la carte reste en consultation externe");
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
    assert.equal(subject.pdfLocalUrl, `/subjects/M/2013/sujet-${subject.id}.pdf`);
  }
});

test("la durée officielle imprimée sur le sujet (02 سا و30 د) est celle de la session", () => {
  assert.equal(examMinutesForYear(year), 150);
});

test("chaque pôle de 2013-m est une tâche mappée, avec ses points exacts", () => {
  for (const subject of year.sujets) {
    const inventory = officialTaskInventoryFor("2013-m", subject.id);
    assert.ok(inventory, `S${subject.id} sans inventaire`);
    const report = buildOfficialCoverageReport({ yearId: "2013-m", subject, inventory });
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
        assert.match(data.bacPromptNotes, /2013/, `${pole} : année non citée dans la provenance`);
        assert.ok(Number.isInteger(data.bacPromptPage) && data.bacPromptPage >= 1 && data.bacPromptPage <= 4);
        assert.equal(data.bacPromptVerifiedAt, "2026-09-15");
      }
    }
  }
  // Les préambules ne portent aucune question de cadrage imprimée : les quatre
  // pôles N sont reconstruits ; les douze autres viennent du scan, sauf les
  // quatre clôtures W qui ne sont pas imprimées (les exercices s'arrêtent sur
  // la dernière question officielle).
  assert.deepEqual(official.sort(), ["1-1E", "1-1S", "1-2E", "1-2S", "2-1E", "2-1S", "2-2E", "2-2S"]);
});

test("les pôles reconstruits expliquent leur reconstruction et ne citent aucune page", () => {
  const reconstruits = new Set(["1-1N", "1-1W", "1-2N", "1-2W", "2-1N", "2-1W", "2-2N", "2-2W"]);
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

test("les valeurs du corrigé officiel 2013 sont bien celles des réponses modèle", () => {
  const poles = year.sujets.flatMap((subject) =>
    subject.exercises.flatMap((exercise) =>
      Object.entries(exercise.poles).map(([pole, data]) => ({
        key: `S${subject.id}E${exercise.number}${pole}`,
        data
      }))
    )
  );
  const answer = (key) => poles.find((item) => item.key === key).data.modelAnswer;
  // t1 du sujet 1 : les langues, les codons et la formule du tripeptide.
  assert.match(answer("S1E1S"), /2³ = 8/);
  assert.match(answer("S1E1S"), /AUG/);
  assert.match(answer("S1E1S"), /UAA و UAG و UGA/);
  assert.match(answer("S1E1E"), /AAG/);
  assert.match(answer("S1E1E"), /UGG/);
  assert.match(answer("S1E1E"), /H2N–CH\(R1\)–CO–NH–CH\(R2\)–CO–NH–CH\(R3\)–COOH/);
  assert.match(answer("S1E1E"), /حركة الريبوزوم برامزة واحدة/);
  // t2 du sujet 1 : le corps du délit et la réponse humorale.
  assert.match(answer("S1E2S"), /الجسم المضاد/);
  assert.match(answer("S1E2S"), /المنطقة المتغيرة/);
  assert.match(answer("S1E2S"), /المنطقة الثابتة/);
  assert.match(answer("S1E2E"), /قوس الترسيب بين الحفرة \(م\) والحفرة \(د\)/);
  assert.match(answer("S1E2E"), /مناعة نوعية ذات وساطة خلطية/);
  // t1 du sujet 2 : ARNr/ARNt contre ARNm et la structure de l'anticorps.
  assert.match(answer("S2E1S"), /ARNm/);
  assert.match(answer("S2E1S"), /نقي العظام/);
  assert.match(answer("S2E1E"), /ثلاثي الببتيد/);
  assert.match(answer("S2E1E"), /جسور ثنائية الكبريت/);
  // t2 du sujet 2 : l'arthrokinine, LTC et le VIH.
  assert.match(answer("S2E2S"), /LTC/);
  assert.match(answer("S2E2S"), /CMH I/);
  assert.match(answer("S2E2E"), /الأسبوع الأول/);
  // Mots recopiés du corrigé 2013 (الإجابة النموذجية, p. 4 du dossier,
  // relue en image le 2026-09-15) : « خلية بلازمية LBP »,
  // « مصدر الخلية البلازمية : تمايز الخلية اللمفاوية LB المنتقاة », et le
  // schéma p. 3 « التنشيط : التكاثر و التمايز ». Les formes « لازمية »,
  // « تماز » et « تشطيم » étaient des corruptions de recopie.
  const answers = poles.map((item) => item.data.modelAnswer || "").join("\n");
  assert.match(answers, /خلايا بلازمية/);
  assert.match(answers, /مصدرها تمايز الخلية اللمفاوية LB/);
  assert.match(answers, /ومصدرها تمايز الخلايا اللمفاوية LT8/);
  assert.match(answers, /التنشيط: تكاثر وتمايز/);
  const tokens = answers.match(/[\u0621-\u0652\u0670\u0640]+/g) || [];
  for (const bad of ["لازمية", "اللازمية", "تماز", "وتمازت", "تشطيم"]) {
    assert.ok(!tokens.includes(bad), `forme fautive réintroduite : ${bad}`);
  }
  assert.match(answer("S2E2E"), /VIH/);
  assert.match(answer("S2E2E"), /مناعة نوعية ذات وساطة خلوية/);
});

test("l'écran d'épreuve affiche les consignes officielles de 2013-m et badge les étapes reconstruites", () => {
  const subject = year.sujets[0];
  const inventory = officialTaskInventoryFor("2013-m", subject.id);
  const html = simulationExamHTML({ subject, inventory, activeExercise: 1, completed: false });
  assert.match(html, /عرّف ما تمثله الحروف/);
  assert.match(html, /استخرج هذه الإشارات من جدول الوثيقة/);
  assert.match(html, /2 من 4 مهام معروضة خطوات مُعاد بناؤها/);
  assert.equal((html.match(/data-task-source="official"/g) || []).length, 2);
  assert.equal((html.match(/data-task-source="reconstructed"/g) || []).length, 2);
  // Aucune réponse modèle n'est révélée pendant l'épreuve.
  assert.doesNotMatch(html, /H2N–CH\(R1\)/);
});
