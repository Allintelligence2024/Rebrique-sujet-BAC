import { test } from "node:test";
import assert from "node:assert/strict";
import { APP_CONFIG } from "./helpers/full-app-config.mjs";
import { officialTaskInventoryFor } from "../data/official-tasks.js";

const ARCHIVE_IDS = ["2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013"];
const ENABLED_RECON_SE = ["2019", "2018", "2017", "2016", "2015", "2014", "2013"];
const ENABLED_RECON_SE_REMAINING = ["2019", "2018"];
const OFFICIAL_VERIFIED_SE = ["2017", "2016", "2015", "2014", "2013"];
const ARCHIVE_YEARS = APP_CONFIG.years.filter((year) => ENABLED_RECON_SE.includes(year.id));

test("l'archive 2013-2019 SE est branchée dans APP_CONFIG ; 2020 SE reste le module officiel", () => {
  const ids = APP_CONFIG.years.map((y) => y.id);
  assert.deepEqual(ids.slice(0, 4), ["2025", "2024", "2023", "2022"]);
  assert.equal(APP_CONFIG.years[0].id, "2025");
  const se2020 = APP_CONFIG.years.find((y) => y.id === "2020");
  assert.ok(se2020 && se2020.enabled && (se2020.stream || "se") === "se");
  assert.equal(
    APP_CONFIG.years.filter((y) => y.id === "2020").length,
    1,
    "2020 SE ne doit pas être dupliqué (officiel + reconstruit)"
  );
  for (const id of ENABLED_RECON_SE) {
    const year = APP_CONFIG.years.find((y) => y.id === id);
    assert.ok(year && year.enabled && (year.stream || "se") === "se", `${id} SE 4D manquant`);
  }
  const se2021 = APP_CONFIG.years.find((y) => y.id === "2021");
  assert.ok(se2021 && se2021.enabled, "2021 ouvre une épreuve");
  assert.notEqual(se2021.answerMode, "free", "2021 n'est plus une armature");
  for (const sujet of se2021.sujets) {
    for (const exercise of sujet.exercises) {
      assert.deepEqual(
        Object.keys(exercise.poles),
        ["N", "S", "E", "W"],
        `2021/S${sujet.id}/E${exercise.number} doit être structuré`
      );
    }
  }
});

test("chaque année reconstruite 2013–2019 est activée — 2013-2015 vérifiées avec barèmes officiels", () => {
  assert.equal(ARCHIVE_YEARS.length, 7);
  for (const year of ARCHIVE_YEARS) {
    assert.equal(year.enabled, true, `${year.id} doit être enabled`);
    assert.equal(year.sujets.length, 2, `${year.id} doit avoir 2 sujets`);
    for (const sujet of year.sujets) {
      assert.equal(sujet.exercises.length, 3, `${year.id}/S${sujet.id}`);
      if (year.id === "2013") {
        if (sujet.id === 1) {
          assert.deepEqual(
            sujet.exercises.map((ex) => ex.max),
            [8, 8, 4],
            `${year.id}/S${sujet.id} barème officiel 8/8/4`
          );
        } else {
          assert.deepEqual(
            sujet.exercises.map((ex) => ex.max),
            [8, 6, 6],
            `${year.id}/S${sujet.id} barème officiel 8/6/6`
          );
        }
      } else if (year.id === "2014") {
        if (sujet.id === 1) {
          assert.deepEqual(
            sujet.exercises.map((ex) => ex.max),
            [6, 6, 8],
            `${year.id}/S${sujet.id} barème officiel 6/6/8`
          );
        } else {
          assert.deepEqual(
            sujet.exercises.map((ex) => ex.max),
            [5.5, 7.5, 7],
            `${year.id}/S${sujet.id} barème officiel 5.5/7.5/7`
          );
        }
      } else if (year.id === "2015") {
        if (sujet.id === 1) {
          assert.deepEqual(
            sujet.exercises.map((ex) => ex.max),
            [7, 6, 7],
            `${year.id}/S${sujet.id} barème officiel 7/6/7`
          );
        } else {
          assert.deepEqual(
            sujet.exercises.map((ex) => ex.max),
            [6, 7, 7],
            `${year.id}/S${sujet.id} barème officiel 6/7/7`
          );
        }
      } else if (year.id === "2016") {
        if (sujet.id === 1) {
          assert.deepEqual(
            sujet.exercises.map((ex) => ex.max),
            [6, 7, 7],
            `${year.id}/S${sujet.id} barème officiel 6/7/7`
          );
        } else {
          assert.deepEqual(
            sujet.exercises.map((ex) => ex.max),
            [6, 7, 7],
            `${year.id}/S${sujet.id} barème officiel 6/7/7`
          );
        }
      } else if (year.id === "2017") {
        if (sujet.id === 1) {
          assert.deepEqual(
            sujet.exercises.map((ex) => ex.max),
            [5, 7, 8],
            `${year.id}/S${sujet.id} barème officiel 5/7/8`
          );
        } else {
          assert.deepEqual(
            sujet.exercises.map((ex) => ex.max),
            [5, 7, 8],
            `${year.id}/S${sujet.id} barème officiel 5/7/8`
          );
        }
      } else {
        assert.deepEqual(
          sujet.exercises.map((ex) => ex.max),
          [5, 7, 8],
          `${year.id}/S${sujet.id} barème 5/7/8 (en attente de vérification)`
        );
      }
      assert.equal(sujet.pdf, null, `${year.id}/S${sujet.id} : PDF chargé à part, jamais inline`);
      assert.ok(sujet.pdfExternalUrl.startsWith("https://"));
      assert.ok(sujet.pdfNote && sujet.pdfNote.length > 20);
    }
  }
});

test("les consignes de l'archive 2018-2019 sont toutes marquées reconstructed — 2013-2017 sont désormais official", () => {
  for (const id of ENABLED_RECON_SE_REMAINING) {
    for (const sujet of [1, 2]) {
      const inventory = officialTaskInventoryFor(id, sujet);
      assert.ok(inventory, `${id}/S${sujet} sans inventaire`);
      assert.ok(
        inventory.tasks.every((task) => task.promptSource === "reconstructed"),
        `${id}/S${sujet} déclare une consigne officielle`
      );
    }
  }
  for (const id of OFFICIAL_VERIFIED_SE) {
    for (const sujet of [1, 2]) {
      const inventory = officialTaskInventoryFor(id, sujet);
      assert.ok(inventory, `${id}/S${sujet} sans inventaire`);
      assert.ok(
        inventory.tasks.every((task) => task.promptSource === "official"),
        `${id}/S${sujet} doit être entièrement official après vérification`
      );
    }
  }
});

test("aucune consigne d'archive 2018-2019 n'est marquée official — 2013-2017 sont official", () => {
  for (const year of ARCHIVE_YEARS) {
    if (OFFICIAL_VERIFIED_SE.includes(year.id)) continue;
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
  for (const year of ARCHIVE_YEARS.filter((y) => OFFICIAL_VERIFIED_SE.includes(y.id))) {
    for (const sujet of year.sujets) {
      for (const ex of sujet.exercises) {
        for (const [letter, pole] of Object.entries(ex.poles)) {
          assert.equal(
            pole.bacPromptSource,
            "official",
            `${year.id}/S${sujet.id}/E${ex.number}/${letter} doit être official`
          );
          assert.ok(pole.bacPrompt && pole.bacPrompt.trim().length > 8);
          assert.ok(
            typeof pole.bacPromptPage === "number" && pole.bacPromptPage >= 1,
            `${year.id}/S${sujet.id}/E${ex.number}/${letter} page manquante`
          );
        }
      }
    }
  }
});
