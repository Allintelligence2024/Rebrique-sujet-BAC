import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => (values.has(key) ? values.get(key) : null),
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    clear: () => values.clear(),
    keys: () => [...values.keys()]
  };
}

globalThis.localStorage = memoryStorage();
const { store, CURRENT_SCHEMA_VERSION, migrateState, validateState } = await import("../js/store.js");

beforeEach(() => {
  localStorage.clear();
  store.reset();
});

test("la progression est isolée par année pour le même sujet et exercice", () => {
  const bac2025 = store.exercise("2025", 1, 1);
  bac2025.text.N = "Réponse BAC 2025";
  bac2025.scores.N = 1;
  bac2025.answeredAny = true;

  const bac2024 = store.exercise("2024", 1, 1);
  assert.notStrictEqual(bac2024, bac2025);
  assert.equal(bac2024.text.N, "");
  assert.equal(bac2024.scores.N, 0);
  assert.equal(bac2024.answeredAny, false);

  assert.equal(store.exercise("2025", 1, 1).text.N, "Réponse BAC 2025");
  assert.deepEqual(Object.keys(store.state.progress).sort(), ["2024", "2025"]);
});

test("une progression v2 ambiguë n'est jamais attribuée arbitrairement à une année", () => {
  const legacy = {
    yearId: "2025",
    subjects: { 1: { 1: { text: { N: "ancienne réponse" } } } }
  };
  localStorage.setItem("boussole4d.v2", JSON.stringify(legacy));
  localStorage.removeItem("boussole4d.v3");
  store.load();

  assert.equal(store.state.progress["2025"], undefined);
  assert.equal(localStorage.getItem("boussole4d.v2"), null);
  assert.equal(localStorage.getItem("boussole4d.v2.legacy-unmigrated"), JSON.stringify(legacy));
});

test("une sauvegarde v3 sans schemaVersion migre explicitement puis est normalisée", () => {
  const legacyV3 = {
    activeScreen: "view-workspace",
    yearId: "2024",
    sujetId: 1,
    progress: { 2024: { 1: { 1: { text: { N: "réponse" }, scores: { N: 1 } } } } }
  };
  localStorage.setItem("boussole4d.v3", JSON.stringify(legacyV3));
  store.load();

  assert.equal(store.state.schemaVersion, CURRENT_SCHEMA_VERSION);
  assert.equal(store.state.activeScreen, "view-workspace");
  assert.equal(store.exercise("2024", 1, 1).text.N, "réponse");
  assert.equal(JSON.parse(localStorage.getItem("boussole4d.v3")).schemaVersion, CURRENT_SCHEMA_VERSION);
});

test("un état stocké invalide est remis à zéro et sauvegardé dans une copie de secours", () => {
  const malformed = "{not-json";
  localStorage.setItem("boussole4d.v3", malformed);
  store.load();

  assert.equal(store.state.schemaVersion, CURRENT_SCHEMA_VERSION);
  assert.equal(store.state.activeScreen, "view-hub");
  const backupKey = localStorage.keys().find((key) => key.startsWith("boussole4d.v3.corrupt-"));
  assert.equal(localStorage.getItem(backupKey), malformed);
});

test("la migration v1 ajoute le mode révision désactivé", () => {
  const migrated = migrateState({ schemaVersion: 1, progress: {} });
  assert.equal(migrated.schemaVersion, CURRENT_SCHEMA_VERSION);
  assert.equal(migrated.reviewMode, false);
});

test("la validation rejette les futures versions et élimine les champs incohérents", () => {
  assert.throws(() => migrateState({ schemaVersion: CURRENT_SCHEMA_VERSION + 1 }), /future schema/);
  const validated = validateState({
    schemaVersion: CURRENT_SCHEMA_VERSION,
    activeScreen: "evil-screen",
    yearId: "pas-une-annee",
    sujetId: "1",
    globalRemaining: -30,
    progress: { bad: { x: { y: { text: { N: 42 } } } } }
  });
  assert.equal(validated.activeScreen, "view-hub");
  assert.equal(validated.yearId, "2025");
  assert.equal(validated.sujetId, 1);
  assert.equal(validated.globalRemaining, 0);
  assert.deepEqual(validated.progress, {});
});

test("exercise exige explicitement yearId", () => {
  assert.throws(() => store.exercise("", 1, 1), /yearId est requis/);
});
