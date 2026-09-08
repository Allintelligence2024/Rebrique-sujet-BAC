import { test } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { createSimulationController, simulationExamHTML } from "../js/ui/screens/simulation.js";

const subject = {
  id: 1,
  exercises: [
    {
      number: 1,
      label: "تركيب البروتين",
      max: 5,
      poles: {
        E: { modelAnswer: "مرجع تدريبي سري حتى التسليم" }
      }
    }
  ]
};
const inventory = {
  tasks: [
    {
      id: "2026-S1-E1-Q1",
      exerciseNumber: 1,
      order: 1,
      page: 1,
      prompt: "اشرح آلية تركيب البروتين.",
      maxPoints: 5,
      documentRefs: [],
      trainingMappings: [{ exerciseNumber: 1, pole: "E", kind: "direct" }]
    }
  ]
};

test("la simulation active n'expose aucun indice, modèle, diagnostic ou action de correction", () => {
  const html = simulationExamHTML({ subject, inventory, activeExercise: 1, completed: false });
  assert.match(html, /data-official-task="2026-S1-E1-Q1"/);
  assert.match(html, /محاكاة صامتة/);
  assert.doesNotMatch(html, /مرجع تدريبي سري/);
  assert.doesNotMatch(html, /data-check|model-box|id="ws-panic"|id="ws-brouillon"/);
  assert.doesNotMatch(html, /textarea[^>]+disabled/);
});

test("la relecture après remise verrouille les réponses et révèle seulement les références qualitatives", () => {
  const html = simulationExamHTML({ subject, inventory, activeExercise: 1, completed: true });
  assert.match(html, /simulation-review-notice/);
  assert.match(html, /textarea[^>]+disabled/);
  assert.match(html, /مرجع تدريبي سري حتى التسليم/);
  assert.match(html, /ليست تصحيحاً وزارياً ولا تنقيطاً/);
  assert.doesNotMatch(html, /data-check|التقدير:/);
});

test("le contrôleur persiste la copie puis bascule réellement en relecture après remise", () => {
  const dom = new JSDOM(
    '<!doctype html><body><div id="global-timer-bar"></div><section id="view-workspace"></section></body>'
  );
  globalThis.document = dom.window.document;
  const progress = { answeredAny: false, officialTaskAnswers: {} };
  const store = {
    state: {
      yearId: "2026",
      sujetId: 1,
      activeExercise: 1,
      sessionStatus: "active",
      sessionEndReason: null
    },
    exercise: () => progress,
    save() {},
    setActiveExercise(number) {
      this.state.activeExercise = number;
    },
    isSessionActive() {
      return this.state.sessionStatus === "active";
    },
    finishSession(reason) {
      this.state.sessionStatus = "completed";
      this.state.sessionEndReason = reason;
    },
    leaveSession() {
      this.state.sessionStatus = "idle";
    }
  };
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const controller = createSimulationController({
    $,
    $$,
    closeModal: () => $("#test-modal")?.remove(),
    goHome() {},
    officialCoverageForSubject: () => ({ simulationEligible: true, blockers: [] }),
    officialTaskInventoryFor: () => inventory,
    openDrawer() {},
    openModal(title, body, actions = "") {
      const modal = document.createElement("div");
      modal.id = "test-modal";
      modal.innerHTML = `${title}${body}${actions}<button data-close="ok">OK</button>`;
      document.body.appendChild(modal);
    },
    pdfFallbackHTML: () => "",
    showScreen() {},
    store,
    timers: { stopAll() {} },
    toast() {},
    yearObj: () => ({ id: "2026", sujets: [subject] }),
    sujetObj: () => subject
  });

  controller.renderSimulation();
  const answer = $('[data-task-answer="2026-S1-E1-Q1"]');
  answer.value = "إجابة التلميذ";
  answer.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  assert.equal(progress.officialTaskAnswers["2026-S1-E1-Q1"], "إجابة التلميذ");
  $("#simulation-finish").click();
  $("#simulation-finish-yes").click();

  assert.equal(store.state.sessionStatus, "completed");
  assert.equal($('[data-task-answer="2026-S1-E1-Q1"]').disabled, true);
  assert.match($("#view-workspace").textContent, /مرجع تدريبي سري حتى التسليم/);
  assert.equal($("#simulation-finish"), null);
});
