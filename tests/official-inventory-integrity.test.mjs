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
  assert.equal(freeYears.length, 0);
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
  assert.equal(officialTaskInventoryFor("2099", synthetic.id), null);
  const report = buildOfficialCoverageReport({ yearId: "2099", subject: synthetic, inventory: null });
  assert.equal(report.freeAnswerEligible, true);
  assert.equal(report.simulationEligible, false);
  assert.equal(examOpenable(report), true);
});

test("chaque sujet chargé possède un inventaire, et inversement", () => {
  const rows = eachSubject();
  assert.equal(rows.length, 58);
  for (const { yearId, subject, inventory } of rows) {
    assert.ok(inventory, `${yearId}/S${subject.id} sans inventaire`);
    assert.equal(inventory.schemaVersion, 1);
    if (["2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"].includes(yearId)) {
      assert.equal(inventory.status, "complete", `${yearId}/S${subject.id} doit être complet`);
    } else {
      assert.notEqual(inventory.status, "complete", `${yearId}/S${subject.id} se déclare complet`);
    }
    assert.equal(inventory.source.humanVerified, false);
    assert.equal(inventory.source.verifiedAt, null);
    assert.ok(inventory.source.locator);
  }
  const expected = new Set(rows.map(({ yearId, subject }) => `${yearId}/S${subject.id}`));
  assert.deepEqual(Object.keys(OFFICIAL_TASK_INVENTORIES).sort(), [...expected].sort());
});

test("chaque tâche recopie fidèlement le pôle dont elle vient", () => {
  for (const { yearId, subject, inventory } of eachSubject()) {
    for (const exercise of subject.exercises) {
      const tasks = inventory.tasks.filter((t) => t.exerciseNumber === exercise.number).sort((a, b) => a.order - b.order);
      const poles = Object.entries(exercise.poles || {});
      assert.equal(tasks.length, poles.length, `${yearId}/S${subject.id} ت${exercise.number}`);
      let sum = 0;
      for (const [index, [letter, pole]] of poles.entries()) {
        const task = tasks[index];
        assert.equal(task.order, index + 1);
        assert.equal(task.pole, letter);
        assert.equal(task.prompt, pole.bacPrompt);
        assert.equal(task.maxPoints, pole.points);
        assert.equal(task.promptSource, pole.bacPromptSource === "official" ? "official" : "reconstructed");
        assert.equal(task.page ?? null, pole.bacPromptPage ?? null);
        assert.deepEqual(task.trainingMappings, [{ exerciseNumber: exercise.number, pole: letter, kind: "direct" }]);
        sum += task.maxPoints;
      }
      assert.ok(Math.abs(sum - exercise.max) < 1e-9, `${yearId} ت${exercise.number}: ${sum} ≠ ${exercise.max}`);
    }
  }
});

test("les identifiants de tâches sont uniques et dérivés de l'ordre réel", () => {
  const seen = new Set();
  for (const { yearId, subject, inventory } of eachSubject()) {
    for (const task of inventory.tasks) {
      assert.equal(task.id, `${yearId}-S${subject.id}-E${task.exerciseNumber}-Q${task.order}`);
      assert.equal(seen.has(task.id), false, `dupliqué: ${task.id}`);
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
        assert.ok(Number.isInteger(task.page), `${task.id}: officielle sans page`);
      } else {
        assert.equal(task.page, null, `${task.id}: reconstruite avec page`);
        assert.equal(task.pageInPdf ?? null, null);
      }
    }
  }
});

test("les pages annoncées restent utilisables dans le PDF livré", () => {
  let located = 0;
  let declared = 0;
  for (const { yearId, subject, inventory } of eachSubject()) {
    const { localPath, pages, pageOffset } = inventory.document;
    assert.equal(localPath, subject.pdfLocalUrl ?? null);
    for (const task of inventory.tasks) {
      if (!Number.isInteger(task.page)) continue;
      declared += 1;
      if (!Number.isInteger(task.pageInPdf)) continue;
      located += 1;
      assert.ok(task.pageInPdf >= 1);
      assert.ok(task.pageInPdf <= pages);
      assert.equal(task.pageInPdf, task.page - pageOffset);
    }
  }
  // 452 officielles après SE 2020
  assert.equal(declared, 452);
  assert.ok(located / declared > 0.8, `trop de pages non locables: ${declared - located}`);
});

test("la pagination déclarée n'est jamais silencieusement fausse", () => {
  for (const { yearId, subject, inventory } of eachSubject()) {
    if (inventory.document.pageOffset !== 0) continue;
    for (const task of inventory.tasks) {
      if (!Number.isInteger(task.page)) continue;
      assert.ok(task.page <= inventory.document.pages);
    }
  }
});

test("les 58 sujets restent éligibles à l'épreuve sans inventaire invalide", () => {
  let invalid = 0;
  for (const { yearId, subject, inventory } of eachSubject()) {
    const report = buildOfficialCoverageReport({ yearId, subject, inventory });
    if (report.errors.length) invalid += 1;
    assert.equal(report.simulationEligible, true, `${yearId}/S${subject.id} fermé`);
  }
  assert.equal(invalid, 0);
});
