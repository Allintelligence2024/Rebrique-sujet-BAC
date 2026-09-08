/* ============================================================
   Tests البوابتان + شحذ المفتاح (gates & drill)
   - classification pure (classer toute la banque sans contradiction)
   - moteur de round (état, série, déblocage 12/12 ×3)
   - persistance store (drill : streak / best / rounds / unlocked)
   - intégration UI guide (jsdom) : carte des portes + drill complet
   ============================================================ */
import { test, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

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
const { store, migrateState, validateState } = await import("../js/store.js");
const { DRILL_BANK, DRILL_ROUND_SIZE, DRILL_UNLOCK_STREAK, classifyInstruction, createDrillEngine } =
  await import("../js/domain/method/gates.js");

/* ---------------- classification (ال بوابتان) ---------------- */

test("toute la banque de drill est classée sans contradiction par classifyInstruction", () => {
  for (const item of DRILL_BANK) {
    const c = classifyInstruction(item.text);
    assert.equal(c.source, item.source, `source divergente pour: ${item.text}`);
    assert.equal(c.gate2, item.gate2, `gate2 divergente pour: ${item.text}`);
    assert.equal(c.twoColumns, item.twoColumns === true, `twoColumns divergent pour: ${item.text}`);
  }
});

test("تعريف sans sendedocument → رأس (1 → 4)", () => {
  const c = classifyInstruction("عرّف الإنزيم.");
  assert.equal(c.mode, "head");
  assert.equal(c.gate2, null);
  assert.deepEqual(c.teeth, [1, 4]);
  assert.equal(c.pathLabel, "1 → 4");
});

test("استخراج من جدول → ورقة/صورة (1 → 2 → 4)", () => {
  const c = classifyInstruction("استخرج من الجدول قيمة التركيز النهائي.");
  assert.equal(c.mode, "paper");
  assert.equal(c.gate2, "image");
  assert.deepEqual(c.teeth, [1, 2, 4]);
});

test("سند + معلوماتك + فعل تفسير → ورقة بعمودين/فيلم (1 → 2 → 3 → 4)", () => {
  const c = classifyInstruction("فسّر بالاعتماد على معلوماتك والشكل 3 نتائج التجربة.");
  assert.equal(c.mode, "paper");
  assert.equal(c.gate2, "film");
  assert.equal(c.twoColumns, true);
  assert.equal(c.pathLabel, "1 → 2 → 3 → 4");
});

test("verbes hybrides (استخرج ثم فسّر) → فيلم gagne (chemin le plus complet)", () => {
  const c = classifyInstruction("استخرج من الوثيقة النتائج ثم فسّرها.");
  assert.equal(c.gate2, "film");
  assert.deepEqual(c.teeth, [1, 2, 3, 4]);
});

test("texte vide → رأس sans lever d'erreur", () => {
  const c = classifyInstruction("");
  assert.equal(c.mode, "head");
});

test("diacritiques et hamza variantes sont normalisés", () => {
  const c = classifyInstruction("اِسْتَخْرِجْ مِنَ الوثائق القيمة النهائية.");
  assert.equal(c.mode, "paper");
  assert.equal(c.gate2, "image");
});

/* ---------------- moteur du drill ---------------- */

/** Joue une round entière : réponses exactes tirées des champs de la banque. */
function playRound(engine, { breakGate1 = false, breakGate2 = false } = {}) {
  engine.start();
  for (let i = 0; i < DRILL_ROUND_SIZE; i += 1) {
    const state = engine.view();
    const item = state.item;
    const expected1 = item.source === "doc" ? "paper" : "head";
    const step1 = engine.answerGate1(
      breakGate1 && i === 0 ? (expected1 === "paper" ? "head" : "paper") : expected1
    );
    if (!step1.advance) {
      engine.answerGate2(breakGate2 && i === 0 ? (item.gate2 === "film" ? "image" : "film") : item.gate2);
    }
    engine.next();
  }
  return engine.result();
}

test("une round parfaite 12/12 marque perfect=true", () => {
  const engine = createDrillEngine({ rand: () => 0.5 });
  const result = playRound(engine);
  assert.equal(result.correct, DRILL_ROUND_SIZE);
  assert.equal(result.perfect, true);
  assert.deepEqual(result.mistakes, []);
});

test("une erreur à la بوابة 1 casse le perfect et journalise la faute", () => {
  const engine = createDrillEngine({ rand: () => 0.5 });
  const result = playRound(engine, { breakGate1: true });
  assert.equal(result.correct, DRILL_ROUND_SIZE - 1);
  assert.equal(result.perfect, false);
  assert.equal(result.mistakes.length, 1);
  assert.equal(result.mistakes[0].gate, 1);
});

test("une erreur à la بوابة 2 est comptée et journalisée", () => {
  const engine = createDrillEngine({ rand: () => 0.5 });
  const result = playRound(engine, { breakGate2: true });
  assert.equal(result.perfect, false);
  assert.equal(result.mistakes[0].gate, 2);
});

test("l'ordre des items varie (mélange) et chaque round garde la taille demandée", () => {
  const flips = [
    0.99, 0.01, 0.99, 0.01, 0.99, 0.01, 0.99, 0.01, 0.99, 0.01, 0.99, 0.01, 0.99, 0.01, 0.99, 0.01
  ];
  let call = -1;
  const engineA = createDrillEngine({
    rand: () => {
      call += 1;
      return flips[call % flips.length];
    }
  });
  const a = engineA.start();
  const engineB = createDrillEngine({ rand: () => 0.5 });
  const b = engineB.start();
  assert.equal(a.total, DRILL_ROUND_SIZE);
  assert.equal(b.total, DRILL_ROUND_SIZE);
  assert.notDeepEqual(a.item, undefined);
  assert.notEqual(a.item.text, b.item.text);
});

test("answerGate1 hors état lève une erreur explicite", () => {
  const engine = createDrillEngine();
  assert.throws(() => engine.answerGate1("paper"), /البوابة 1/);
});

/* ---------------- persistance store ---------------- */

beforeEach(() => {
  localStorage.clear();
  store.reset();
});

test("recordDrillRound construit la série et remet à zéro après un échec", () => {
  assert.deepEqual(store.recordDrillRound(true), { streak: 1, best: 1, rounds: 1, unlocked: false });
  assert.deepEqual(store.recordDrillRound(true), { streak: 2, best: 2, rounds: 2, unlocked: false });
  assert.deepEqual(store.recordDrillRound(false), { streak: 0, best: 2, rounds: 3, unlocked: false });
});

test("validateState conserve le drill et la migration tolère son absence (états anciens)", () => {
  const legacy = validateState(migrateState({ schemaVersion: 2, progress: {} }));
  assert.deepEqual(legacy.drill, { streak: 0, best: 0, rounds: 0, unlocked: false });
  const validated = validateState(
    migrateState({
      schemaVersion: 2,
      progress: {},
      drill: { streak: 2, best: 5, rounds: 9, unlocked: true }
    })
  );
  assert.deepEqual(validated.drill, { streak: 2, best: 5, rounds: 9, unlocked: true });
  const coerced = validateState(
    migrateState({ schemaVersion: 2, progress: {}, drill: { streak: "x", unlocked: "oui" } })
  );
  assert.deepEqual(coerced.drill, { streak: 0, best: 0, rounds: 0, unlocked: false });
});

test("le drill survit à un cycle save/load (persistance locale)", () => {
  store.recordDrillRound(true);
  store.recordDrillRound(true);
  store.load();
  assert.equal(store.state.drill.streak, 2);
  assert.equal(store.state.drill.rounds, 2);
});

/* ---------------- intégration UI (section تدريب المفتاح du hub) ---------------- */

const { JSDOM } = require("jsdom");
const uiDom = new JSDOM("<!DOCTYPE html><body><div id='view-hub'></div><div id='view-guide'></div></body>", {
  url: "http://localhost/"
});
globalThis.document = uiDom.window.document;

const { createTrainingController } = await import("../js/ui/training.js");
const { createGuideScreen } = await import("../js/ui/screens/guide.js");

let lastTraining = null;

const $$sel = (s) => [...uiDom.window.document.querySelectorAll(s)];
function uiClick(el) {
  el.dispatchEvent(new uiDom.window.MouseEvent("click", { bubbles: true }));
}

function makeTrainingStore() {
  return {
    state: { drill: { streak: 0, best: 0, rounds: 0, unlocked: false } },
    recorded: [],
    recordDrillRound(perfect) {
      this.recorded.push(perfect);
      const drill = this.state.drill;
      drill.streak = perfect ? drill.streak + 1 : 0;
      drill.best = Math.max(drill.best, drill.streak);
      drill.rounds += 1;
      return { ...drill };
    },
    unlockDrill() {
      this.state.drill.unlocked = true;
      return { ...this.state.drill };
    }
  };
}

function expectedGate1(item) {
  return item.source === "doc" ? "paper" : "head";
}

/** Joue `count` items de la round en cours (réponses exactes tirées de la banque). */
function playUiItems(count) {
  for (let i = 0; i < count; i += 1) {
    const instruction = uiDom.window.document.querySelector("#drill-instruction").textContent.trim();
    const bankItem = DRILL_BANK.find((entry) => entry.text === instruction);
    assert.ok(bankItem, `instruction hors banque: ${instruction}`);
    uiClick(uiDom.window.document.querySelector(`#drill-gate1 [data-choice="${expectedGate1(bankItem)}"]`));
    if (uiDom.window.document.querySelector("#drill-gate2")) {
      uiClick(uiDom.window.document.querySelector(`#drill-gate2 [data-choice="${bankItem.gate2}"]`));
    }
    uiClick(uiDom.window.document.querySelector("#drill-next"));
  }
  return uiDom.window.document.querySelector("#drill-summary");
}

function freshTraining(store = makeTrainingStore()) {
  const training = createTrainingController({
    $: (s) => uiDom.window.document.querySelector(s),
    $$: $$sel,
    store,
    openModal: undefined
  });
  uiDom.window.document.querySelector("#view-hub").innerHTML = training.html();
  training.mount();
  lastTraining = training;
  return { training, store };
}

test("la section تدريب porte les البوابتان et le drill — le المفتاح+ reste fermé", () => {
  const { store: tStore } = freshTraining();
  assert.ok(uiDom.window.document.querySelector("#training-details"));
  assert.ok(uiDom.window.document.querySelector("#gates-card"));
  assert.ok(uiDom.window.document.querySelector("#drill-card"));
  assert.ok(uiDom.window.document.querySelector("#mistakes-card"));
  assert.equal(uiDom.window.document.querySelector("#plus-card"), null, "المفتاح+ fermé par défaut");

  const input = uiDom.window.document.querySelector("#gate-input");
  input.value = "فسّر بالاعتماد على معلوماتك والشكل 3 نتائج التجربة.";
  input.dispatchEvent(new uiDom.window.Event("input", { bubbles: true }));
  const verdict = uiDom.window.document.querySelector("#gate-verdict").textContent;
  assert.match(verdict, /تعتمد على سند/);
  assert.match(verdict, /تفسير أو استنتاج/);
  assert.match(verdict, /من الوثيقة \| من الدرس/);
  assert.equal(tStore.recorded.length, 0);
});

test("les exemples cliquables remplissent l'entrée et le verdict", () => {
  freshTraining();
  uiClick($$sel("[data-gate-example]")[2]);
  assert.equal(uiDom.window.document.querySelector("#gate-input").value, "عدّد خصائص المناعة الاكتسابية.");
  assert.match(uiDom.window.document.querySelector("#gate-verdict").textContent, /تعتمد على المعارف/);
});

test("3 rounds parfaites 12/12 consécutives ouvrent المفتاح+ dans la section", () => {
  freshTraining();
  for (let round = 0; round < DRILL_UNLOCK_STREAK; round += 1) {
    uiClick(uiDom.window.document.querySelector("#drill-start"));
    const summary = playUiItems(DRILL_ROUND_SIZE);
    assert.match(summary.textContent, new RegExp(`${DRILL_ROUND_SIZE}/${DRILL_ROUND_SIZE}`));
    if (round < DRILL_UNLOCK_STREAK - 1) {
      uiClick(uiDom.window.document.querySelector("#drill-again"));
    }
  }
  assert.match(uiDom.window.document.querySelector("#drill-summary").textContent, /فُتح المستوى المتقدم/);
  assert.ok(uiDom.window.document.querySelector("#plus-card"), "المفتاح+ doit apparaître après déblocage");
  const plusText = uiDom.window.document.querySelector("#plus-card").textContent;
  for (const expected of ["افتح", "ومنه", "شجرة النسب", "عامّ أم خاصّ", "وتفسير ذلك أنّ"]) {
    assert.ok(plusText.includes(expected), `المفتاح+ doit contenir: ${expected}`);
  }
});

test("une round imparfaite n'ouvre pas المفتاح+", () => {
  freshTraining();
  uiClick(uiDom.window.document.querySelector("#drill-start"));
  const instruction = uiDom.window.document.querySelector("#drill-instruction").textContent.trim();
  const bankItem = DRILL_BANK.find((entry) => entry.text === instruction);
  const wrong = expectedGate1(bankItem) === "paper" ? "head" : "paper";
  uiClick(uiDom.window.document.querySelector(`#drill-gate1 [data-choice="${wrong}"]`));
  uiClick(uiDom.window.document.querySelector("#drill-next"));
  const summary = playUiItems(DRILL_ROUND_SIZE - 1);
  assert.match(summary.textContent, /11\/12/);
  assert.equal(uiDom.window.document.querySelector("#plus-card"), null);
});

test("خمسة أخطاء : contenu méthode sans pourcentages de barème", () => {
  freshTraining();
  const mistakes = uiDom.window.document.querySelector("#mistakes-card");
  assert.ok(mistakes, "carte خمسة أخطاء manquante");
  const text = mistakes.textContent;
  assert.match(text, /إجابة بلا رقم سؤال/);
  assert.match(text, /شجرة نسب بحكم واحد/);
  assert.doesNotMatch(text, /نصف النقطة|0,25|0,5 نقطة/);
});

test("المفتاح+ pré-rendu quand unlocked, avec badges de gradation متوسط/امتياز", () => {
  const store = makeTrainingStore();
  store.state.drill.unlocked = true;
  freshTraining(store);
  const plus = uiDom.window.document.querySelector("#plus-card");
  assert.ok(plus, "المفتاح+ devrait être rendu d'emblée quand unlocked=true");
  const text = plus.textContent;
  assert.match(text, /مستوى متوسط/);
  assert.match(text, /مستوى امتياز/);
});

test("l'écran guide est calme : ni drill, ni البوابتان, ni carte erreurs", () => {
  const guide = createGuideScreen({
    $: (s) => uiDom.window.document.querySelector(s),
    adkarHTML: () => "<div id='adkar'></div>",
    examMinutesForYear: () => 270,
    formatDuration: (minutes) => `${minutes} min`,
    goHome: () => {},
    goToStrategy: () => {}
  });
  guide.renderGuide({ id: 2025 });
  const guideEl = uiDom.window.document.querySelector("#view-guide");
  assert.equal(
    guideEl.querySelector("#gates-card"),
    null,
    "البوابتان ne doivent pas vivre dans le flux examen"
  );
  assert.equal(guideEl.querySelector("#drill-card"), null, "le drill ne doit pas vivre dans le flux examen");
  assert.equal(guideEl.querySelector("#mistakes-card"), null);
  assert.equal(guideEl.querySelector("#training-details"), null);
  assert.ok(guideEl.querySelector(".breath"), "la respiration reste le cœur de l'écran");
  assert.ok(guideEl.querySelector("#guide-next"), "une seule action principale : continuer");
});

after(async () => {
  try {
    lastTraining?.teardown?.();
  } catch (e) {}
  try {
    uiDom.window.close();
  } catch (e) {}
});
