import { test } from "node:test";
import assert from "node:assert/strict";
import { YEAR_CATALOG, loadYear } from "../data/subjects.js";
import { OFFICIAL_TASK_INVENTORIES, officialTaskInventoryFor } from "../data/official-tasks.js";
import {
  buildOfficialCoverageReport,
  examOpenable,
  isFreeAnswerSubject
} from "../js/domain/subjects/official-coverage.js";

const years = await Promise.all(
  YEAR_CATALOG.map(async (entry) => ({ entry, year: await loadYear(entry.id) }))
);
const loaded = years.filter((item) => item.year);

function eachSubject() {
  const rows = [];
  for (const { year } of loaded) {
    if (year.answerMode === "free") continue;
    for (const subject of year.sujets || []) {
      rows.push({ yearId: year.id, subject, inventory: officialTaskInventoryFor(year.id, subject.id) });
    }
  }
  return rows;
}

test("plus aucune armature « copie libre » : chaque année est structurée et inventoriée", () => {
  const freeYears = loaded.filter(({ year }) => year.answerMode === "free");
  assert.equal(freeYears.length, 0, "aucune année ne doit rester en copie libre");
  const synthetic = {
    id: 1,
    answerMode: "free",
    pdfLocalUrl: "/subjects/X/2099/sujet-1.pdf",
    exercises: [
      { number: 1, max: 5, poles: {} },
      { number: 2, max: 7, poles: {} },
      { number: 3, max: 8, poles: {} }
    ]
  };
  assert.equal(isFreeAnswerSubject(synthetic), true);
  assert.equal(officialTaskInventoryFor("2099", synthetic.id), null, "aucun inventaire inventé");
  const report = buildOfficialCoverageReport({ yearId: "2099", subject: synthetic, inventory: null });
  assert.equal(report.freeAnswerEligible, true);
  assert.equal(report.simulationEligible, false, "aucune note ne peut être calculée");
  assert.equal(examOpenable(report), true, "l'épreuve reste ouverte");
});

test("chaque sujet chargé possède un inventaire, et inversement", () => {
  const rows = eachSubject();
  // 48 sujets jusqu'au 2026-09-19 ; 56 depuis la structuration OCR de Maths
  // 2013–2015 + 2017 استثنائية ; 58 depuis celle de SE 2021 (2026-09-20) —
  // soit TOUS les sujets du catalogue.
  // 2013 SE vérifiée 2026-09-21 : 2 sujets complets (8/8/4 et 8/6/6).
  // 2014 SE vérifiée 2026-09-21 : 2 sujets complets (6/6/8 et 5.5/7.5/7).
  // 2015 SE vérifiée 2026-09-21 : 2 sujets complets (7/6/7 et 6/7/7).
  // 2016 SE vérifiée 2026-09-21 : 2 sujets complets (6/7/7 et 6/7/7).
  assert.equal(rows.length, 58);
  for (const { yearId, subject, inventory } of rows) {
    assert.ok(inventory, `${yearId}/S${subject.id} sans inventaire`);
    assert.equal(inventory.schemaVersion, 1);
    if (["2013", "2014", "2015", "2016"].includes(yearId)) {
      assert.equal(
        inventory.status,
        "complete",
        `${yearId}/S${subject.id} doit être complet après vérification`
      );
    } else {
      assert.notEqual(inventory.status, "complete", `${yearId}/S${subject.id} se déclare complet`);
    }
    assert.equal(inventory.source.humanVerified, false);
    assert.equal(inventory.source.verifiedAt, null);
    assert.ok(inventory.source.locator, `${yearId}/S${subject.id} sans source`);
  }
  const expected = new Set(rows.map(({ yearId, subject }) => `${yearId}/S${subject.id}`));
  assert.deepEqual(Object.keys(OFFICIAL_TASK_INVENTORIES).sort(), [...expected].sort());
});

test("chaque tâche recopie fidèlement le pôle dont elle vient", () => {
  for (const { yearId, subject, inventory } of eachSubject()) {
    for (const exercise of subject.exercises) {
      const tasks = inventory.tasks
        .filter((task) => task.exerciseNumber === exercise.number)
        .sort((a, b) => a.order - b.order);
      const poles = Object.entries(exercise.poles || {});
      assert.equal(tasks.length, poles.length, `${yearId}/S${subject.id} ت${exercise.number}`);
      let sum = 0;
      for (const [index, [letter, pole]] of poles.entries()) {
        const task = tasks[index];
        assert.equal(task.order, index + 1, `${yearId} ت${exercise.number} ordre`);
        assert.equal(task.pole, letter, `${yearId} ت${exercise.number} pôle`);
        assert.equal(task.prompt, pole.bacPrompt, `${yearId} ت${exercise.number}${letter} consigne`);
        assert.equal(task.maxPoints, pole.points, `${yearId} ت${exercise.number}${letter} points`);
        assert.equal(
          task.promptSource,
          pole.bacPromptSource === "official" ? "official" : "reconstructed",
          `${yearId} ت${exercise.number}${letter} provenance`
        );
        assert.equal(
          task.page ?? null,
          pole.bacPromptPage ?? null,
          `${yearId} ت${exercise.number}${letter} page`
        );
        assert.deepEqual(task.trainingMappings, [
          { exerciseNumber: exercise.number, pole: letter, kind: "direct" }
        ]);
        sum += task.maxPoints;
      }
      assert.ok(
        Math.abs(sum - exercise.max) < 1e-9,
        `${yearId} ت${exercise.number}: ${sum} ≠ ${exercise.max}`
      );
    }
  }
});

test("les identifiants de tâches sont uniques et dérivés de l'ordre réel", () => {
  const seen = new Set();
  for (const { yearId, subject, inventory } of eachSubject()) {
    for (const task of inventory.tasks) {
      assert.equal(task.id, `${yearId}-S${subject.id}-E${task.exerciseNumber}-Q${task.order}`);
      assert.equal(seen.has(task.id), false, `identifiant dupliqué: ${task.id}`);
      seen.add(task.id);
    }
  }
  assert.equal(seen.size, 576);
});

test("aucune provenance n'est survendue : official ⇒ page connue, barème toujours provisoire", () => {
  for (const { yearId, subject, inventory } of eachSubject()) {
    for (const task of inventory.tasks) {
      assert.equal(task.scoringReviewStatus, "provisional", `${task.id} barème non provisoire`);
      if (task.promptSource === "official") {
        assert.ok(Number.isInteger(task.page), `${task.id}: consigne officielle sans page`);
      } else {
        assert.equal(task.page, null, `${task.id}: étape reconstruite avec une page inventée`);
        assert.equal(task.pageInPdf ?? null, null, `${task.id}: page de fichier sur une étape reconstruite`);
      }
    }
  }
});

test("les pages annoncées restent utilisables dans le PDF livré", () => {
  let located = 0;
  let declared = 0;
  for (const { yearId, subject, inventory } of eachSubject()) {
    const { localPath, pages, pageOffset } = inventory.document;
    assert.equal(localPath, subject.pdfLocalUrl ?? null, `${yearId}/S${subject.id} chemin de fichier`);
    for (const task of inventory.tasks) {
      if (!Number.isInteger(task.page)) continue;
      declared += 1;
      if (!Number.isInteger(task.pageInPdf)) continue;
      located += 1;
      assert.ok(task.pageInPdf >= 1, `${task.id}: page de fichier ${task.pageInPdf}`);
      assert.ok(task.pageInPdf <= pages, `${task.id}: page ${task.pageInPdf} > ${pages} pages`);
      assert.equal(task.pageInPdf, task.page - pageOffset, `${task.id}: décalage incohérent`);
    }
  }
  // 213 jusqu'au 2026-09-19 ; 261 avec OCR Maths ; 277 avec OCR SE 2021 ; 301 avec SE 2013 ; 325 avec SE 2014 ; 349 avec SE 2015 ; 373 avec SE 2016
  assert.equal(declared, 373);
  assert.ok(located / declared > 0.8, `trop de pages non locables: ${declared - located}`);
});

test("la pagination déclarée n'est jamais silencieusement fausse", () => {
  for (const { yearId, subject, inventory } of eachSubject()) {
    if (inventory.document.pageOffset !== 0) continue;
    for (const task of inventory.tasks) {
      if (!Number.isInteger(task.page)) continue;
      assert.ok(
        task.page <= inventory.document.pages,
        `${yearId}/S${subject.id} ${task.id}: page ${task.page} au-delà des ${inventory.document.pages} pages du fichier`
      );
    }
  }
});

test("les 58 sujets restent éligibles à l'épreuve sans inventaire invalide", () => {
  let invalid = 0;
  for (const { yearId, subject, inventory } of eachSubject()) {
    const report = buildOfficialCoverageReport({ yearId, subject, inventory });
    if (report.errors.length) invalid += 1;
    assert.equal(report.simulationEligible, true, `${yearId}/S${subject.id} fermé à l'épreuve`);
  }
  assert.equal(invalid, 0, "inventaires invalides détectés par la garde");
});
