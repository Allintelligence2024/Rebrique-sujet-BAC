import { test } from "node:test";
import assert from "node:assert/strict";
import {
  APP_CONFIG,
  getLoadedYear,
  loadAllYears,
  loadYear,
  loadedYearIds,
  YEAR_CATALOG
} from "../data/subjects.js";

test("le catalogue initial reste léger et ne contient aucun sujet complet", () => {
  assert.equal(APP_CONFIG.dataLoading, "on-demand");
  assert.equal(YEAR_CATALOG.length, 19);
  assert.deepEqual(loadedYearIds(), []);
  for (const metadata of YEAR_CATALOG) {
    assert.equal("sujets" in metadata, false, `${metadata.id} embarque un payload dans le catalogue`);
    assert.match(metadata.modulePath, /^data\/years\/(?:se|m)\/year-\d{4}\.js$/);
    assert.ok(Object.isFrozen(metadata));
  }
});

test("loadYear ne charge que l'année demandée, la valide et la mémorise", async () => {
  const firstPromise = loadYear("2025");
  const secondPromise = loadYear("2025");
  assert.equal(firstPromise, secondPromise, "deux requêtes concurrentes doivent partager leur promesse");
  const year = await firstPromise;
  assert.equal(year.id, "2025");
  assert.equal(year.sujets.length, 2);
  assert.deepEqual(loadedYearIds(), ["2025"]);
  assert.equal(getLoadedYear("2025"), year);
  assert.equal(getLoadedYear("2024"), null);
  assert.equal(year.sujets[0].pdfAvailable, false);
  assert.equal(year.sujets[0].pdf, null);
  assert.match(year.sujets[0].pdfExternalUrl, /^https:\/\/www\.dzexams\.com\//);
});

test("une année inconnue est refusée sans modifier le cache", async () => {
  await assert.rejects(loadYear("1999"), /سنة غير معروفة/);
  assert.deepEqual(loadedYearIds(), ["2025"]);
});

test("l'audit exhaustif peut charger les 19 payloads sans doublon", async () => {
  const years = await loadAllYears();
  assert.equal(years.length, 19);
  assert.equal(new Set(years.map((year) => year.id)).size, 19);
  assert.deepEqual(
    years.map((year) => year.id),
    YEAR_CATALOG.map((year) => year.id)
  );
});
