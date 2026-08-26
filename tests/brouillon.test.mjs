import { test } from "node:test";
import assert from "node:assert/strict";
import { createBrouillonController } from "../js/ui/workspace/brouillon.js";

const POLE_ORDER = ["N", "S", "E", "W"];

function fake$(id) {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: { toggle() {}, add() {}, remove() {} },
    addEventListener() {},
    appendChild() {},
    lastElementChild: { append() {} }
  };
}

const baseDeps = {
  $: fake$,
  store: {
    state: { yearId: 1, sujetId: 1, activeExercise: 1, activeStep: 1 },
    exercise: () => ({
      scratch: { N: "", S: "", E: "", W: "", free: "" },
      text: {},
      pipeline: { stream1: [], stream2: [] },
      fields: {},
      answeredAny: false,
      scores: {}
    }),
    save() {}
  },
  openDrawer: () => {},
  openModal: () => {},
  escapeHTML: (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
    ),
  normalizeArabic: (s) => String(s).normalize("NFKD"),
  composeDrafts: (scratch, pole) => ({ current: `current-${pole}`, full: `full-${pole}` }),
  hasObservationBeforeExplanation: () => true,
  POLE_ORDER,
  exDef: (num) => ({
    poles: {
      N: { prompt: "problème", bacPrompt: "problème BAC" },
      S: { prompt: "observer", bacPrompt: "observer BAC" },
      E: { prompt: "expliquer", bacPrompt: "expliquer BAC" },
      W: { prompt: "conclure", bacPrompt: "conclure BAC" }
    },
    number: num
  }),
  detectVerb: () => ({ canonical: "observer", recommendedPole: "S", warning: null, patterns: [] })
};

const controller = createBrouillonController(baseDeps);

test("createBrouillonController exposes the expected methods", () => {
  assert.equal(typeof controller.detectVerb, "function");
  assert.equal(typeof controller.brouillonPreflight, "function");
  assert.equal(typeof controller.buildDrafts, "function");
  assert.equal(typeof controller.openBrouillon, "function");
});

test("brouillonPreflight signale l'absence de comparaison en S", () => {
  const st = { scratch: { S: "texte sans comparaison", E: "", W: "", N: "" } };
  const msgs = controller.brouillonPreflight(st, "S");
  assert.ok(msgs.some((m) => m.includes("comparaison")));
});

test("brouillonPreflight signale une explication sans observation en E", () => {
  const ctrl = createBrouillonController({
    ...baseDeps,
    hasObservationBeforeExplanation: () => false
  });
  const st = { scratch: { S: "", E: "explication directe", W: "", N: "" } };
  const msgs = ctrl.brouillonPreflight(st, "E");
  assert.ok(msgs.some((m) => m.includes("observer")));
});

test("brouillonPreflight signale une conclusion hors problème en W", () => {
  const st = { scratch: { S: "", E: "", W: "conclusion finale", N: "problème scientifique" } };
  const msgs = controller.brouillonPreflight(st, "W");
  assert.ok(msgs.some((m) => m.includes("problème")));
});

test("buildDrafts compose les drafts pour le pôle actif", () => {
  const st = { scratch: { N: "", S: "", E: "", W: "", free: "" } };
  const drafts = controller.buildDrafts(st);
  assert.ok(drafts.current.startsWith("current-"));
  assert.ok(drafts.full.startsWith("full-"));
});

test("openBrouillon ouvre le drawer avec le titre attendu", () => {
  let drawerTitle = "";
  const ctrl = createBrouillonController({
    ...baseDeps,
    openDrawer: (_side, title) => {
      drawerTitle = title;
    }
  });
  ctrl.openBrouillon();
  assert.equal(drawerTitle, "📝 وضع البوصلة — المسودة");
});

test("openBrouillon ne lève pas quand le DOM est minimal", () => {
  const ctrl = createBrouillonController({
    ...baseDeps,
    $: (id) => ({
      value: "",
      textContent: "",
      className: "",
      classList: { toggle() {}, add() {}, remove() {} },
      addEventListener() {},
      appendChild() {},
      lastElementChild: { append() {} }
    }),
    openDrawer: () => {},
    openModal: () => {}
  });
  assert.doesNotThrow(() => ctrl.openBrouillon());
});
