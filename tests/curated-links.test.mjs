/* ============================================================
   Garde-fou : les liens curés ne pointent pas vers une page morte
   ------------------------------------------------------------
   Le 2026-09-15, le sujet 2 de maths 2013 renvoyait vers
   `https://www.dzexams.com/ar/expiree/…` (« page expirée ») alors que
   la page annales existe (`/ar/annales/…`). Le lien fautif vivait dans
   `data/subjects.js` et `data/archive.js`, puis dans
   `data/official-tasks.js` (fichier GÉNÉRÉ) : corriger la source ne
   suffit pas, il faut régénérer l'inventaire, et aucun test ne le
   voyait. Ce fichier verrouille les deux niveaux :

   1. toute URL écrite à la main (data/**, index.html,
      manifest.webmanifest) vise une section modélisée ;
   2. tout localisateur d'inventaire généré est contrôlé de la même
      façon — donc `npm test` échoue si l'inventaire n'est pas
      régénéré après une correction d'URL.
   ============================================================ */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { OFFICIAL_TASK_INVENTORIES } from "../data/official-tasks.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/* Sections réellement utilisées par le produit : les annales dzexams
   (page sujet + corrigé), l'index de la filière, les PDF directs
   dzexams, et les pages eddirasa (énoncé, corrigé, article). */
const ALLOWED = [
  /^https:\/\/www\.dzexams\.com\/ar\/annales(\/[A-Za-z0-9+/=]+)?$/,
  /^https:\/\/www\.dzexams\.com\/ar\/bac\/sciences-naturelles(\/(se|m))?$/,
  /^https:\/\/www\.dzexams\.com\/uploads\/[A-Za-z0-9/._-]+\.pdf$/,
  /^https:\/\/eddirasa\.com\/[A-Za-z0-9/._-]*$/
];

const DEAD = /\/ar\/expiree\//;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

/* Sources écrites à la main du produit (les années, l'archive, le
   catalogue) plus les coquilles servies au navigateur. `data/official-tasks.js`
   est inclus : c'est un fichier généré, donc contrôlé aussi par le test 3. */
const CURATED = [
  ...walk(join(ROOT, "data")).filter((file) => file.endsWith(".js")),
  join(ROOT, "index.html"),
  join(ROOT, "manifest.webmanifest")
];

/** URLs http(s) citées dans un fichier, ponctuation de fin retirée. */
function urlsIn(text) {
  const found = text.match(/https?:\/\/[A-Za-z0-9.-]+\.[a-z]{2,}[^\s"'`)\]|]*/g) || [];
  return found.map((url) => url.replace(/[.,;:]+$/, ""));
}

test("aucune source curée ne pointe vers une page dzexams expirée", () => {
  const offenders = [];
  for (const file of CURATED) {
    for (const url of urlsIn(readFileSync(file, "utf8"))) {
      if (DEAD.test(url)) offenders.push(`${relative(ROOT, file)} → ${url}`);
    }
  }
  assert.deepEqual(
    offenders,
    [],
    "lien(s) vers /ar/expiree/ : viser la page annales, puis régénérer data/official-tasks.js"
  );
});

test("chaque URL curée vise une section modélisée", () => {
  const unknown = [];
  for (const file of CURATED) {
    for (const url of urlsIn(readFileSync(file, "utf8"))) {
      if (!ALLOWED.some((pattern) => pattern.test(url))) {
        unknown.push(`${relative(ROOT, file)} → ${url}`);
      }
    }
  }
  assert.deepEqual(unknown, [], "URL hors des sections modélisées (lien inventé ou page morte ?)");
});

test("les localisateurs d'inventaires générés sont des liens vivants", () => {
  const locators = Object.entries(OFFICIAL_TASK_INVENTORIES).map(([key, inventory]) => ({
    key,
    locator: inventory?.source?.locator
  }));
  assert.ok(locators.length > 40, "trop peu d'inventaires : test aveugle");
  for (const { key, locator } of locators) {
    assert.equal(typeof locator, "string", `${key} : localisateur non textuel`);
    assert.doesNotMatch(locator, DEAD, `${key} : localisateur expiré`);
    assert.ok(
      ALLOWED.some((pattern) => pattern.test(locator)),
      `${key} : localisateur hors sections modélisées (${locator})`
    );
  }
});

test("le sujet 2 de maths 2013 reste sur la page annales", () => {
  /* Régression du 2026-09-15 : le lien vivait dans data/subjects.js,
     data/archive.js et l'inventaire généré, tous corrigés. */
  assert.match(
    OFFICIAL_TASK_INVENTORIES["2013-m/S2"].source.locator,
    /^https:\/\/www\.dzexams\.com\/ar\/annales\//,
    "l'inventaire 2013-m/S2 n'a pas été régénéré après la correction du lien"
  );
});
