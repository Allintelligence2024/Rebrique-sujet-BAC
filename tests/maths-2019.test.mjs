/* ============================================================
   Filière maths — session 2019 : énoncé ET corrigé officiels
   ------------------------------------------------------------
   Pourquoi ce test : la session 2019 a d'abord été encodée sans
   son corrigé (« le corrigé n'est pas dans le dépôt »). C'était
   faux : le dossier dzexams local `M/dzexams-bac-sciences-2280992.pdf`
   contient les deux sujets (pp. 1–5) et l'corrigé officiel
   « الإجابة النموذجية » (pp. 6–10), relu en image le 2026-09-14.
   Les réponses modèle ont été réécrites depuis ces pages. Ce test
   verrouille les valeurs que le corrigé impose — et qui étaient
   fausses avant la relecture :
     - ت1 S1 : (1) بنية ثانوية مطوية β ، (2) بنية ثانوية حلزونية α ،
       (3) منطقة انعطاف ; masse du fragment (م) = (146+147) − 36 = 257
       (et non 275) ;
     - ت2 S1 : (س) = LT4 ، (ع) = LT8 ، (ص) = LB ، (ل) = خلية بالعة ;
       la chambre (3) ne déclenche aucune réponse immunitaire ;
     - ت2 S2 : n = 3 (64 possibilités) , quatre acides aminés seulement
       pour Niremberg/Matthaei, UCC/CUC/ACA/CAC pour Khorana.
   ============================================================ */
import { test } from "node:test";
import assert from "node:assert/strict";
import { YEAR_CATALOG, examMinutesForYear, loadYear } from "../data/subjects.js";
import { officialTaskInventoryFor } from "../data/official-tasks.js";
import { buildOfficialCoverageReport, examOpenable } from "../js/domain/subjects/official-coverage.js";

const entry = YEAR_CATALOG.find((year) => year.id === "2019-m");
const year = await loadYear("2019-m");

const poleOf = (sujetId, exerciseNumber, pole) =>
  year.sujets.find((s) => s.id === sujetId).exercises.find((e) => e.number === exerciseNumber).poles[pole];

test("la session 2019 de la filière maths est une épreuve complète (2 sujets × 2 exercices)", () => {
  assert.ok(entry, "2019-m absent du catalogue");
  assert.equal(entry.stream, "m");
  assert.deepEqual(entry.exerciseCounts, [2, 2]);
  assert.equal(year.sujets.length, 2);
  for (const subject of year.sujets) {
    assert.deepEqual(
      subject.exercises.map((exercise) => exercise.max),
      [6, 14],
      `S${subject.id}: barème officiel 6 + 14`
    );
    assert.equal(subject.pdfLocalUrl, `/subjects/M/2019/sujet-${subject.id}.pdf`);
  }
});

test("la durée imprimée sur le sujet (02 سا و30 د) est celle de la session", () => {
  assert.equal(examMinutesForYear(year), 150);
});

test("l'inventaire officiel de chaque sujet est complet et ouvre l'épreuve", () => {
  for (const subject of year.sujets) {
    const inventory = officialTaskInventoryFor("2019-m", subject.id);
    assert.ok(inventory, `S${subject.id} sans inventaire`);
    const report = buildOfficialCoverageReport({ yearId: "2019-m", subject, inventory });
    assert.deepEqual(report.errors, []);
    assert.equal(examOpenable(report), true, `S${subject.id} fermé à l'épreuve`);
    assert.equal(report.knownPoints, 20, "20 points sur 20 par sujet");
  }
});

test("la note PDF cite le corrigé officiel du même dossier (pp. 6-10, relu le 2026-09-14)", () => {
  for (const subject of year.sujets) {
    assert.match(subject.pdfNote, /الإجابة النموذجية/, `S${subject.id}: corrigé non cité`);
    assert.match(subject.pdfNote, /2280992/, `S${subject.id}: dossier source non cité`);
    assert.match(subject.pdfNote, /6-10/, `S${subject.id}: pages du corrigé non citées`);
    assert.match(subject.pdfNote, /2026-09-14/, `S${subject.id}: date de relecture du corrigé absente`);
  }
});

test("ت1 S1 : données de la figure et masse du fragment (م) viennent du corrigé", () => {
  const answer = poleOf(1, 1, "N").modelAnswer;
  assert.match(answer, /بنية ثانوية مطوية β/);
  assert.match(answer, /بنية ثانوية حلزونية α/);
  assert.match(answer, /منطقة انعطاف/);

  const masse = poleOf(1, 1, "S").modelAnswer;
  assert.match(masse, /257/, "le corrigé donne (146+147) − 36 = 257 غ/مول");
  assert.match(masse, /146/);
  assert.match(masse, /147/);
  assert.doesNotMatch(masse, /275/, "275 était la valeur fausse de la première passe");
  const keywords = poleOf(1, 1, "S").rule.keywords;
  assert.ok(keywords.includes("257"), "mot-clé 257 attendu");
  assert.ok(!keywords.includes("275"), "l'ancien mot-clé 275 doit disparaître");
});

test("ت2 S1 : les cellules sont celles du corrigé et la chambre (3) reste sans réponse", () => {
  const cellules = poleOf(1, 2, "N").modelAnswer;
  assert.match(cellules, /\(س\) خلية لمفاوية LT4/);
  assert.match(cellules, /\(ع\) خلية لمفاوية LT8/);
  assert.match(cellules, /\(ص\) خلية لمفاوية LB/);
  assert.match(cellules, /\(ل\) خلية بالعة/);
  assert.match(cellules, /CMH II/);
  assert.match(cellules, /CMH I/);
  assert.match(cellules, /BCR/);

  const motif = poleOf(1, 2, "E").modelAnswer;
  assert.match(motif, /الغرفة \(3\): عدم حدوث استجابة مناعية/);
  assert.match(motif, /خلطية وخلوية/);
  assert.match(motif, /TCR/);
});

test("ت2 S2 : le corrigé chiffre la réponse (n = 3, 64, UUU/AAA/CCC, UCC/CUC/ACA/CAC)", () => {
  const hypothese = poleOf(2, 2, "N").modelAnswer;
  assert.match(hypothese, /n هي 3/);
  assert.match(hypothese, /64/);
  assert.match(hypothese, /20 حمضا أمينيا/);

  const codons = poleOf(2, 2, "E").modelAnswer;
  assert.match(codons, /UUU/);
  assert.match(codons, /AAA/);
  assert.match(codons, /CCC/);
  assert.match(codons, /UCC/);
  assert.match(codons, /CUC/);
  assert.match(codons, /ACA/);
  assert.match(codons, /CAC/);
  assert.match(codons, /أربعة أحماض أمينية فقط/);
  assert.match(codons, /UAG وUAA وUGA/, "ordre des رامزات التوقف dans le corrigé du الجزء الثاني");

  const fin = poleOf(2, 2, "W").modelAnswer;
  assert.match(fin, /64 رامزة/);
  assert.match(fin, /AUG/);
  assert.match(fin, /UAA وUAG وUGA/);
});

test("les consignes restituées depuis la couche texte portent leur provenance", () => {
  const pole = poleOf(2, 2, "N");
  assert.equal(pole.bacPromptSource, "official");
  assert.equal(pole.bacPromptPage, 4);
  assert.equal(pole.bacPromptVerifiedAt, "2026-09-14");
  assert.match(pole.bacPrompt, /بـ n نيكليوتيدة من الـ ARNm/, "les lettres n et ARNm du scan inversé");
  assert.match(pole.bacPrompt, /Crick/);
  assert.match(pole.bacPromptNotes, /police incomplète/);
  assert.match(pole.bacPromptNotes, /couche texte/);
});

test("aucune étape reconstruite ne prétend citer le corrigé ni porter une page", () => {
  const rebuilt = [];
  for (const subject of year.sujets) {
    for (const exercise of subject.exercises) {
      for (const [pole, data] of Object.entries(exercise.poles)) {
        if (data.bacPromptSource !== "reconstructed") continue;
        rebuilt.push(`${subject.id}-${exercise.number}${pole}`);
        assert.equal(data.bacPromptPage ?? null, null);
        assert.match(data.bacPromptNotes, /Pas une question BAC autonome/);
        assert.doesNotMatch(data.bacPromptNotes, /corrigé 2019 étant absent/);
      }
    }
  }
  assert.deepEqual(rebuilt.sort(), ["1-2W", "2-1W"], "seules les deux clôtures restent reconstruites");
});
