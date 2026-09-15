/* ============================================================
   Filière maths — session 2021 : scan relu en image, corrigé appliqué
   ------------------------------------------------------------
   Pourquoi ce test : les consignes de 2021-m venaient d'une couche
   texte INVERSÉE (reconstituée le 2026-08-31) et les réponses modèle
   avaient été écrites sans le corrigé. La relecture du 2026-09-14
   (sujets pp. 1-6, corrigé « الإجابة النموذجية » pp. 7-12 du dossier
   local M/dzexams-bac-sciences-2068087.pdf) a corrigé trois verbes
   (« بيّن في نص علمي » et non أنشئ ; « اكتسبت » et non تكتسب ;
   « مبرزا تأثر هذه العلاقة » et non وأثر), rattaché cinq consignes
   imprimées à des pôles et corrigé deux valeurs fausses
   (0→40 د et 70 % / 10 %, au lieu de 0→10 د et 50 % / 5 %).
   Ce test verrouille tout cela.
   ============================================================ */
import { test } from "node:test";
import assert from "node:assert/strict";
import { YEAR_CATALOG, examMinutesForYear, loadYear } from "../data/subjects.js";
import { officialTaskInventoryFor } from "../data/official-tasks.js";
import { buildOfficialCoverageReport, examOpenable } from "../js/domain/subjects/official-coverage.js";
import { simulationExamHTML } from "../js/ui/screens/simulation.js";

const entry = YEAR_CATALOG.find((year) => year.id === "2021-m");
const year = await loadYear("2021-m");

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

const answer = (key) => poles().find((item) => item.key === key).data;

test("la session 2021 de la filière maths est une épreuve complète (2 sujets × 2 exercices 8 + 12)", () => {
  assert.ok(entry, "2021-m absent du catalogue");
  assert.equal(entry.stream, "m");
  assert.deepEqual(entry.exerciseCounts, [2, 2]);
  for (const subject of year.sujets) {
    assert.deepEqual(
      subject.exercises.map((exercise) => exercise.max),
      [8, 12],
      `S${subject.id}: barème officiel 8 + 12`
    );
    assert.equal(subject.pdfLocalUrl, `/subjects/M/2021/sujet-${subject.id}.pdf`);
    assert.match(subject.pdfNote, /M\/dzexams-bac-sciences-2068087\.pdf/);
    assert.match(subject.pdfNote, /pp\. 7-12/);
  }
});

test("la durée officielle imprimée sur le sujet (02 سا و30 د) est celle de la session", () => {
  assert.equal(examMinutesForYear(year), 150);
});

test("chaque pôle de 2021-m est une tâche mappée, avec ses points exacts", () => {
  for (const subject of year.sujets) {
    const inventory = officialTaskInventoryFor("2021-m", subject.id);
    assert.ok(inventory, `S${subject.id} sans inventaire`);
    const report = buildOfficialCoverageReport({ yearId: "2021-m", subject, inventory });
    assert.deepEqual(report.errors, []);
    assert.equal(examOpenable(report), true, `S${subject.id} fermé à l'épreuve`);
    assert.equal(report.knownTaskCount, 8);
    assert.equal(report.mappedTaskCount, 8);
    assert.equal(report.knownPoints, 20);
  }
});

test("les consignes relues en image portent leur page et la date du 2026-09-14", () => {
  const official = [];
  const reconstructed = [];
  for (const { key, data } of poles()) {
    assert.ok(data.bacPrompt && data.bacPrompt.trim(), key);
    if (data.bacPromptSource === "official") {
      official.push(key);
      assert.match(data.bacPromptNotes, /Relecture du scan 2021 Maths/, `${key} : provenance`);
      assert.ok(
        Number.isInteger(data.bacPromptPage) && data.bacPromptPage >= 1 && data.bacPromptPage <= 6,
        `${key} : page hors du sujet`
      );
      assert.equal(data.bacPromptVerifiedAt, "2026-09-14", `${key} : date de relecture`);
      continue;
    }
    reconstructed.push(key);
    assert.equal(data.bacPromptPage ?? null, null, `${key} : une étape reconstruite ne cite pas de page`);
    assert.match(
      data.bacPromptNotes,
      /Pas de question officielle autonome|Pas une question BAC autonome|Clôture issue du corrigé officiel 2021/,
      `${key} : motif`
    );
  }
  assert.deepEqual(official.sort(), [
    "S1E1E",
    "S1E1S",
    "S1E2E",
    "S1E2N",
    "S1E2S",
    "S1E2W",
    "S2E1E",
    "S2E1S",
    "S2E2E",
    "S2E2N",
    "S2E2S",
    "S2E2W"
  ]);
  // Les quatre étapes de cadrage/clôture restent reconstruites (badge ⚠️).
  assert.deepEqual(reconstructed.sort(), ["S1E1N", "S1E1W", "S2E1N", "S2E1W"]);
  assert.equal(official.length, 12, "12 consignes officielles sur 16 pôles");
});

test("les cinq consignes rattachées le 2026-09-14 sont bien dans les pôles officiels", () => {
  // النمط الوراثي لولدين → S1-E1/S
  assert.match(answer("S1E1S").bacPrompt, /حدّد النمط الوراثي الخاص بمورثات الـ \(CMH\) لولدين/);
  // اشرح آلية التأثير + اقترح فرضية → S1-E2/E
  assert.match(answer("S1E2E").bacPrompt, /اشرح آلية تأثير المضاد الحيوي على تكاثر ونمو البكتريا/);
  assert.match(answer("S1E2E").bacPrompt, /اقترح فرضية تفسر بها كيفية افلات|اقترح فرضية/);
  // قدم نصيحة + نص علمي du الجزء الثالث → S1-E2/W
  assert.match(answer("S1E2W").bacPrompt, /قدم نصيحة حول عواقب الاستعمال المفرط/);
  // مرحلة التدخل + معادلة ثنائي الببتيد → S2-E1/S et /E
  assert.match(answer("S2E1S").bacPrompt, /حدّد في أيّ مرحلة يتدخل كل من العنصرين/);
  assert.match(answer("S2E1E").bacPrompt, /اكتب معادلة تشكُّل الجزء المُؤطَّر/);
  // فسّر الشكل (ب) + ناقش الفرضية + خطورة انخفاض pH → S2-E2/E
  assert.match(answer("S2E2E").bacPrompt, /فسّر الرسومات الموضحة في الشكل \(ب\)/);
  assert.match(answer("S2E2E").bacPrompt, /ناقش صحة الفرضية/);
  assert.match(answer("S2E2E").bacPrompt, /خطورة انخفاض الـ pH/);
  // Plus aucune consigne n'est signalée « non mappée » : les notes qui citent
  // cette étiquette disent aussi qu'elle a été rattachée à un pôle.
  for (const { key, data } of poles()) {
    const note = data.bacPromptNotes || "";
    if (!note.includes("non mappée")) continue;
    assert.match(
      note,
      /non mappée[^.]*rattachée|rattachée[^.]*non mappée/,
      `${key} : consigne encore non rattachée`
    );
  }
});

test("les trois verbes mal reconstitués depuis la couche inversée sont ceux du scan", () => {
  // Le scan imprime « بيّن في نص علمي دقيق » (et non أنشئ).
  assert.match(answer("S1E2W").bacPrompt, /بيّن في نص علمي دقيق/);
  assert.doesNotMatch(answer("S1E2W").bacPrompt, /أنشئ/);
  // « فسّر كيف اكتسبت إحدى السلالتين » (et non تكتسب).
  assert.match(answer("S1E2E").bacPrompt, /فسّر كيف اكتسبت إحدى السلالتين/);
  assert.doesNotMatch(answer("S1E2E").bacPrompt, /تكتسب/);
  // « مبرزا تأثر هذه العلاقة بعوامل الوسط » (et non وأثر هذه العلاقة).
  assert.match(answer("S2E2W").bacPrompt, /مبرزا تأثر هذه العلاقة بعوامل الوسط/);
  assert.doesNotMatch(answer("S2E2W").bacPrompt, /وأثر هذه العلاقة/);
});

test("les deux valeurs fausses du corrigé ne reviennent pas (0→40 د, 70 % et 10 %)", () => {
  const s = answer("S1E2S");
  assert.match(s.modelAnswer, /من 0 إلى 40 د/);
  assert.match(s.modelAnswer, /70 بالمئة/);
  assert.match(s.modelAnswer, /10 بالمئة/);
  assert.doesNotMatch(s.modelAnswer, /من 0 إلى 10 د/);
  assert.doesNotMatch(s.modelAnswer, /0 إلى 50 بالمئة/);
  // La règle documentaire a suivi : mêmes valeurs, et elles sont strictes.
  assert.deepEqual(s.rule.document.values, ["70"]);
  assert.equal(s.rule.document.strictValues, true);
  assert.deepEqual(
    s.rule.document.trends.map((trend) => trend.expect),
    [
      ["تزداد", "70"],
      ["قليلة", "10"]
    ]
  );
});

test("les réponses modèle 2021 suivent le corrigé officiel (Mex.R, R/T, transcription-traduction)", () => {
  // t2 du sujet 1 : mecanisme du Macrolide, mutation Mex.R, codons de stop.
  const e = answer("S1E2E").modelAnswer;
  assert.match(e, /الموقع \(A\)/);
  assert.match(e, /الرابطة الببتيدية/);
  assert.match(e, /الثلاثية 114 \(من TGC إلى TGA\)/);
  assert.match(e, /رامزة التوقف UGA/);
  assert.match(e, /7 أحماض أمينية بدل 9/);
  // t1 du sujet 2 : rôles de l'ARN polymérase et du ribosome, équation.
  const s2 = answer("S2E1S").modelAnswer;
  assert.match(s2, /ARN بوليميراز/);
  assert.match(s2, /الريبوزوم/);
  assert.match(s2, /الاستنساخ/);
  assert.match(s2, /الترجمة/);
  assert.match(answer("S2E1E").modelAnswer, /معادلة تشكل ثنائي الببتيد/);
  // t2 du sujet 2 : pH 7.4 → 7.3, liaison ionique His146–Asp94, 8 Å et 2 Å.
  const hb = answer("S2E2E").modelAnswer;
  assert.match(hb, /\(94\) والهستيدين \(146\)/);
  assert.match(hb, /8 أنغستروم/);
  assert.match(hb, /2 أنغستروم/);
  assert.match(hb, /7\.4/);
  assert.match(hb, /7\.3/);
  assert.match(hb, /خطورة انخفاض الـ pH|ثنائي الأكسجين/);
});

test("l'écran d'épreuve affiche les consignes officielles de 2021-m et badge les deux étapes reconstruites", () => {
  const subject = year.sujets[0];
  const inventory = officialTaskInventoryFor("2021-m", subject.id);
  const html = simulationExamHTML({ subject, inventory, activeExercise: 1, completed: false });
  assert.match(html, /اقترح نمطا وراثيا هجينا خاصا بمورثات الـ \(CMH\)/);
  assert.match(html, /وضّح في نص علمي سبب ارتفاع نسبة التوافق النسيجي/);
  assert.equal((html.match(/data-task-source="official"/g) || []).length, 2);
  assert.equal((html.match(/data-task-source="reconstructed"/g) || []).length, 2);
  assert.match(html, /2 من 4 مهام معروضة خطوات مُعاد بناؤها/);
  // Les réponses du corrigé ne sont pas révélées pendant l'épreuve.
  assert.doesNotMatch(html, /7 أحماض أمينية بدل 9/);
  assert.doesNotMatch(html, /70 بالمئة/);
});
