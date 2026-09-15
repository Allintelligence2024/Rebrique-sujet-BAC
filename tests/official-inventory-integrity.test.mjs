import { test } from "node:test";
import assert from "node:assert/strict";
import { YEAR_CATALOG, loadYear } from "../data/subjects.js";
import { OFFICIAL_TASK_INVENTORIES, officialTaskInventoryFor } from "../data/official-tasks.js";
import {
  buildOfficialCoverageReport,
  examOpenable,
  isFreeAnswerSubject
} from "../js/domain/subjects/official-coverage.js";

/* ============================================================
   Intégrité des inventaires de tâches officielles.
   ------------------------------------------------------------
   Les inventaires sont générés (scripts/generate-official-inventories.mjs) :
   ce test garantit qu'ils ne racontent pas autre chose que les données
   d'année, et que les pages annoncées restent utilisables par l'élève.
   ============================================================ */

const years = await Promise.all(
  YEAR_CATALOG.map(async (entry) => ({ entry, year: await loadYear(entry.id) }))
);
const loaded = years.filter((item) => item.year);

/* Les armatures « copie libre » (années dont les consignes ne sont pas
   encodées) n'ont, par construction, aucun inventaire : elles sont vérifiées
   par leur propre test, plus bas. */
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

test("une armature « copie libre » n'invente aucune tâche et n'ouvre aucune note", () => {
  const freeYears = loaded.filter(({ year }) => year.answerMode === "free");
  assert.ok(freeYears.length >= 1, "aucune année en copie libre");
  for (const { year } of freeYears) {
    for (const subject of year.sujets) {
      assert.equal(isFreeAnswerSubject(subject), true, `${year.id}/S${subject.id}`);
      assert.equal(
        officialTaskInventoryFor(year.id, subject.id),
        null,
        `${year.id}/S${subject.id} ne doit pas avoir d'inventaire inventé`
      );
      const report = buildOfficialCoverageReport({ yearId: year.id, subject, inventory: null });
      assert.equal(report.freeAnswerEligible, true);
      assert.equal(report.simulationEligible, false, "aucune note ne peut être calculée");
      assert.equal(examOpenable(report), true, "l'épreuve reste ouverte");
      for (const exercise of subject.exercises) {
        assert.deepEqual(
          Object.keys(exercise.poles || {}),
          [],
          `${year.id}/S${subject.id}/E${exercise.number} encode une consigne`
        );
      }
    }
  }
});

test("chaque sujet chargé possède un inventaire, et inversement", () => {
  const rows = eachSubject();
  assert.equal(rows.length, 52);
  for (const { yearId, subject, inventory } of rows) {
    assert.ok(inventory, `${yearId}/S${subject.id} sans inventaire`);
    assert.equal(inventory.schemaVersion, 1);
    assert.notEqual(inventory.status, "complete", `${yearId}/S${subject.id} se déclare complet`);
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
  assert.equal(seen.size, 520);
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
  // Le générateur rattache la très grande majorité des consignes à une page du
  // fichier ; les autres restent annotées « (الأصل) » plutôt que d'être devinées.
  assert.equal(declared, 236);
  assert.ok(located / declared > 0.8, `trop de pages non locables: ${declared - located}`);
});

test("la pagination déclarée n'est jamais silencieusement fausse", () => {
  // Quand le fichier suit la numérotation du document, aucune tâche ne doit
  // pointer au-delà de sa dernière page.
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

test("les 40 sujets restent éligibles à l'épreuve sans inventaire invalide", () => {
  let invalid = 0;
  for (const { yearId, subject, inventory } of eachSubject()) {
    const report = buildOfficialCoverageReport({ yearId, subject, inventory });
    if (report.errors.length) invalid += 1;
    assert.equal(report.simulationEligible, true, `${yearId}/S${subject.id} fermé à l'épreuve`);
  }
  assert.equal(invalid, 0, "inventaires invalides détectés par la garde");
});
