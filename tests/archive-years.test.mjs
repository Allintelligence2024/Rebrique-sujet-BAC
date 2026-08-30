import { test } from "node:test";
import assert from "node:assert/strict";
import { APP_CONFIG } from "../data/subjects.js";
import { ARCHIVE_YEARS } from "../data/subjects-archive.js";
import { poleConfidence } from "../js/ui/workspace/feedback.js";

const ARCHIVE_IDS = ["2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013"];

test("l'archive 2013-2020 est branchée dans APP_CONFIG après 2022", () => {
  const ids = APP_CONFIG.years.map((y) => y.id);
  assert.deepEqual(ids.slice(0, 4), ["2025", "2024", "2023", "2022"]);
  assert.deepEqual(ids.slice(4), ARCHIVE_IDS);
  assert.equal(APP_CONFIG.years.length, 12);
});

test("chaque année d'archive est activée avec 2 sujets × 3 exercices 5/7/8", () => {
  assert.equal(ARCHIVE_YEARS.length, 8);
  for (const year of ARCHIVE_YEARS) {
    assert.equal(year.enabled, true, `${year.id} doit être enabled`);
    assert.equal(year.sujets.length, 2, `${year.id} doit avoir 2 sujets`);
    for (const sujet of year.sujets) {
      assert.equal(sujet.exercises.length, 3, `${year.id}/S${sujet.id}`);
      assert.deepEqual(
        sujet.exercises.map((ex) => ex.max),
        [5, 7, 8],
        `${year.id}/S${sujet.id} barème 5/7/8`
      );
      assert.equal(sujet.pdfAvailable, false);
      assert.ok(sujet.pdfExternalUrl.startsWith("https://"));
      assert.ok(sujet.pdfNote && sujet.pdfNote.length > 20);
    }
  }
});

test("la confiance UI de l'archive 2013-2020 est basse", () => {
  const pole = { bacPromptSource: "reconstructed" };
  for (const id of ARCHIVE_IDS) {
    assert.equal(poleConfidence(pole, id).level, "low", `${id} doit être low`);
  }
  assert.equal(poleConfidence(pole, "2024").level, "low");
  assert.equal(poleConfidence(pole, "2023").level, "medium");
  assert.equal(poleConfidence({ bacPromptSource: "official" }, "2018").level, "high");
});

test("aucune consigne d'archive n'est marquée official", () => {
  for (const year of ARCHIVE_YEARS) {
    for (const sujet of year.sujets) {
      for (const ex of sujet.exercises) {
        for (const [letter, pole] of Object.entries(ex.poles)) {
          assert.equal(
            pole.bacPromptSource,
            "reconstructed",
            `${year.id}/S${sujet.id}/E${ex.number}/${letter}`
          );
          assert.ok(pole.bacPrompt && pole.bacPrompt.trim().length > 8);
        }
      }
    }
  }
});
