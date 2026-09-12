/* ============================================================
   UI — rendu, routage entre écrans, boussole, exercices, toasts
   Facade stable : init, renderHub, notify, voiceEngine
   ============================================================ */

import {
  APP_CONFIG,
  examMinutesForYear,
  getLoadedYear,
  loadYear,
  normalizeArabic
} from "../data/subjects.js";
import { BROUILLON_MODE_DATA } from "../data/brouillon.js";
import { officialTaskInventoryFor } from "../data/official-tasks.js";
import { createSubjectSessionStarter } from "./application/subject-session.js";
import { buildOfficialCoverageReport } from "./domain/subjects/official-coverage.js";
import { store, helpers } from "./store.js";
import { timers, evaluateText, evaluatePipeline, scoreBac, soundEngine, METHOD_SCRIPTS } from "./engine.js";
import { createSpeechEngine } from "./services/speech-recognition.js";
import { createAtlas } from "./ui/atlas.js";
import {
  announceScreen,
  associateFieldsWithInstructions,
  bindDiagnosticAnnouncements,
  ensureLiveRegions
} from "./ui/accessibility.js";
import { createDialogManager } from "./ui/dialogs.js";
import { buildDemoDiagnostic } from "./ui/demo-diagnostic.js";
import { node, replaceContent, setInternalHTML } from "./ui/dom.js";
import { createScreenNavigator } from "./ui/navigation.js";
import { mountOperationalStatus } from "./ui/operational-status.js";
import { createGuideScreen } from "./ui/screens/guide.js";
import { createHubScreen } from "./ui/screens/hub.js";
import { createStrategyScreen } from "./ui/screens/strategy.js";
import { createTrainingController } from "./ui/training.js";
import { createWorkspaceController } from "./ui/screens/workspace.js";
import { reportDiagnostic } from "./services/diagnostics.js";

const POLE = {
  N: { title: "الخطوة 1 · اقرأ", short: "اقرأ", cls: "emerald" },
  S: { title: "الخطوة 2 · اجمع", short: "اجمع", cls: "blue" },
  E: { title: "الخطوة 3 · اربط", short: "اربط", cls: "amber" },
  W: { title: "الخطوة 4 · اختُم", short: "اختُم", cls: "purple" }
};
const POLE_ORDER = ["N", "S", "E", "W"];
let hubScreen;
let guideScreen;
let strategyScreen;

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const dialogs = createDialogManager({ $, $$ });
const { openModal, closeModal, openDrawer } = dialogs;
const showScreen = createScreenNavigator({
  screens: () => $$(".screen"),
  onNavigate: (id, { initial = false } = {}) => {
    store.setActiveScreen(id);
    associateFieldsWithInstructions(document.getElementById(id));
    announceScreen(document, id, { focus: !initial });
  }
});

// Any value that can originate from localStorage or user input must cross this
// boundary before being interpolated in HTML. Prefer .textContent/.value elsewhere.
function escapeHTML(value = "") {
  return String(value).replace(
    /[&<>'"]/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]
  );
}

function debounce(fn, wait = 350) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

function yearObj(id) {
  return getLoadedYear(id);
}
function yearMetadata(id) {
  return APP_CONFIG.years.find((year) => year.id === id);
}
function officialCoverageForSubject(year, subject) {
  return buildOfficialCoverageReport({
    yearId: year?.id,
    subject,
    inventory: officialTaskInventoryFor(year?.id, subject?.id)
  });
}
function sujetObj() {
  return yearObj(store.state.yearId)?.sujets.find((s) => s.id === store.state.sujetId);
}
function exDef(num) {
  return sujetObj()?.exercises.find((e) => e.number === num);
}

function toast(msg, type = "info", ms = 3500) {
  const zone = $("#toast-zone");
  if (!zone) return;
  const t = node("div", {
    className: `toast ${type}`,
    attrs: { role: type === "error" || type === "warn" ? "alert" : "status", "aria-atomic": "true" }
  });
  t.append(node("span", { text: iconFor(type) }), node("div", { text: msg }));
  zone.appendChild(t);
  setTimeout(() => {
    t.classList.add("is-exiting");
    setTimeout(() => t.remove(), 250);
  }, ms);
}
function iconFor(type) {
  const map = { success: "✅", warn: "⚠️", error: "⛔", info: "💡" };
  return map[type] || "ℹ️";
}

const THEME_KEY = "boussole4d.theme";
function applyTheme(theme) {
  const value = ["dark", "light", "contrast"].includes(theme) ? theme : "dark";
  document.documentElement.dataset.theme = value;
  try {
    localStorage.setItem(THEME_KEY, value);
  } catch (error) {
    reportDiagnostic("theme.save", error, { value });
  }
}

const openAtlas = createAtlas({
  $,
  $$,
  openDrawer,
  normalizeArabic,
  bacVerbs: BROUILLON_MODE_DATA.bacVerbs,
  setInternalHTML
});

export const voiceEngine = createSpeechEngine(toast);

function micButton(fieldId) {
  return `<button type="button" class="btn-mic" data-mic="${fieldId}">🎤 إملاء</button>`;
}
function bindMics(root = document) {
  $$("[data-mic]", root).forEach((btn) => {
    if (btn.dataset.micBound === "1") return;
    btn.dataset.micBound = "1";
    btn.addEventListener("click", () => {
      const input = $("#" + btn.dataset.mic);
      // Explain the privacy boundary before the browser permission prompt. The
      // app only receives a transcript and never stores an audio recording.
      openModal(
        "🎤 قبل تفعيل الإملاء الصوتي",
        "سيطلب المتصفح إذن الميكروفون الآن. قد يعالج المتصفح الصوت عبر محركه الخاص؛ لا تحفظ منصة مفتاح الكنز أي تسجيل صوتي، ولا تستقبل إلا النص المحوّل. يمكنك الرفض ومواصلة الكتابة يدوياً.",
        '<p class="small text-muted">راجع سياسة الخصوصية لمزيد من التفاصيل.</p>'
      );
      const modal = $(".overlay:last-child");
      $("[data-close='ok']", modal)?.addEventListener("click", () => voiceEngine.start(input), {
        once: true
      });
    });
  });
}

const ADKAR = [
  {
    title: "دعاء بداية الامتحان",
    ar: "اللهم لا سهل إلا ما جعلته سهلا وأنت تجعل الحزن إذا شئت سهلا.",
    note: "يُستحب عند الشروع."
  },
  {
    title: "سورة طه",
    ar: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي.",
    note: "سورة طه — دعاء موسى عليه السلام."
  },
  { title: "الاستعاذة", ar: "أعوذ بالله من الشيطان الرجيم.", note: "قبل القراءة والتركيز." },
  { title: "التوكل", ar: "حسبي الله ونعم الوكيل.", note: "عند القلق." },
  { title: "طلب العلم", ar: "ربِّ زدني علما.", note: "أثناء المراجعة." },
  { title: "خاتمة الجلسة", ar: "الحمد لله الذي بنعمته تتم الصالحات.", note: "بعد التسليم." }
];

function adkarHTML() {
  return `<div class="adkar-section">
    <strong class="text-emerald">أدعية وأذكار الامتحان</strong>
    <div class="adkar-grid">
      ${ADKAR.map((a) => `<div class="adkar-card"><div class="adkar-title">${a.title}</div><div class="adkar-arabic">${a.ar}</div><div class="adkar-note">${a.note}</div></div>`).join("")}
    </div>
  </div>`;
}
function openAdkar() {
  openModal("أدعية وأذكار الامتحان", adkarHTML());
}

function cycleSound(btn) {
  const mode = soundEngine.cycle();
  if (btn) {
    btn.classList.toggle("active", mode !== "off");
    btn.textContent = mode === "off" ? "🔇 صوت" : `🔊 ${mode}`;
  }
}

export function renderHub() {
  return hubScreen.renderHub();
}

function goHome() {
  timers.stopAll();
  soundEngine.stop();
  if (store.isSessionActive()) store.leaveSession();
  renderHub();
  showScreen("view-hub");
  $("#global-timer-bar")?.classList.add("hidden");
}

function renderGuide(year) {
  return guideScreen.renderGuide(year);
}
function goToStrategy() {
  return strategyScreen.goToStrategy();
}
function pdfFallbackHTML(subject) {
  return strategyScreen.pdfFallbackHTML(subject);
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}س${String(rest).padStart(2, "0")}د` : `${hours}س`;
}

let workspaceController;
function enterExercise(exerciseNumber) {
  return workspaceController.enterExercise(exerciseNumber);
}
function renderWorkspace() {
  return workspaceController.renderWorkspace();
}

function fmtPts(n) {
  return `${(+n).toFixed(2)}ن`;
}
function short(text, n = 7) {
  const words = String(text || "").split(" ");
  return words.length <= n ? text : words.slice(0, n).join(" ") + "…";
}

const startSession = createSubjectSessionStarter({
  appConfig: APP_CONFIG,
  renderGuide,
  showScreen,
  store,
  timers,
  toast,
  timerBar: () => $("#global-timer-bar"),
  helpers,
  $
});

hubScreen = createHubScreen({
  $,
  $$,
  APP_CONFIG,
  applyTheme,
  buildDemo: () => buildDemoDiagnostic(evaluateText),
  closeModal,
  cycleSound,
  enterExercise,
  examMinutesForYear,
  formatDuration,
  openAdkar,
  openAtlas,
  openModal,
  startSession,
  store,
  timers,
  training: createTrainingController({ $, $$, store, openModal }),
  yearObj
});
guideScreen = createGuideScreen({
  $,
  $$,
  adkarHTML,
  examMinutesForYear,
  formatDuration,
  goHome,
  goToStrategy,
  store,
  openModal
});
strategyScreen = createStrategyScreen({
  $,
  $$,
  enterExercise,
  goHome,
  helpers,
  officialCoverageForSubject,
  openModal,
  showScreen,
  store,
  timers,
  toast,
  yearObj
});

workspaceController = createWorkspaceController({
  $,
  $$,
  APP_CONFIG,
  METHOD_SCRIPTS,
  POLE,
  POLE_ORDER,
  applyTheme,
  bindMics,
  closeModal,
  debounce,
  escapeHTML,
  evaluatePipeline,
  evaluateText,
  fmtPts,
  goHome,
  helpers,
  micButton,
  node,
  normalizeArabic,
  officialCoverageForSubject,
  officialTaskInventoryFor,
  openDrawer,
  openModal,
  pdfFallbackHTML,
  renderHub,
  replaceContent,
  scoreBac,
  short,
  showScreen,
  soundEngine,
  store,
  timers,
  toast,
  yearObj,
  sujetObj,
  exDef
});

export async function init() {
  ensureLiveRegions(document);
  mountOperationalStatus(document, globalThis.window);
  bindDiagnosticAnnouncements(window);
  store.load();
  let savedTheme = "dark";
  try {
    savedTheme = localStorage.getItem(THEME_KEY) || "dark";
  } catch (error) {
    reportDiagnostic("theme.load", error);
  }
  applyTheme(savedTheme);

  let bar = $("#global-timer-bar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "global-timer-bar";
    bar.className = "global-timer-bar hidden";
    const timerLabel = node("span", {
      className: "global-timer-label text-emerald bold",
      text: "● وقت الجلسة"
    });
    const timerValue = node("span", { className: "global-timer-value mono bold" });
    timerValue.append(
      "⏳ ",
      node("span", { text: helpers.fmt(store.state.globalRemaining), attrs: { id: "global-timer" } })
    );
    replaceContent(bar, [timerLabel, timerValue]);
    document.body.prepend(bar);
  }

  timers.onChange = (which) => {
    const t = $("#global-timer");
    if (t) t.textContent = helpers.fmt(store.state.globalRemaining);
    if (which === "strategy") strategyScreen.updateStrategyTimer();
    if (which === "global" && store.state.sessionStatus === "completed") {
      if (store.state.activeScreen === "view-workspace") {
        workspaceController.handleSessionCompletion("time-expired");
      } else {
        timers.stopAll();
        renderHub();
        showScreen("view-hub");
        bar.classList.add("hidden");
        toast("انتهى وقت الجلسة وحُفظ التقدم.", "warn");
      }
    }
  };

  if (!$("#toast-zone")) {
    const toastZone = document.createElement("div");
    toastZone.id = "toast-zone";
    toastZone.className = "toast-zone";
    toastZone.setAttribute("aria-live", "polite");
    toastZone.setAttribute("aria-relevant", "additions text");
    toastZone.setAttribute("aria-label", "الإشعارات");
    document.body.appendChild(toastZone);
  }

  const hasRestorableSession =
    store.isSessionActive() ||
    (store.state.sessionStatus === "completed" &&
      store.state.sessionMode === "simulation" &&
      store.state.activeScreen === "view-workspace");
  let activeYear = yearObj(store.state.yearId);
  if (hasRestorableSession && yearMetadata(store.state.yearId) && !activeYear) {
    try {
      activeYear = await loadYear(store.state.yearId);
    } catch (error) {
      reportDiagnostic("subjects.restore-year", error, { yearId: store.state.yearId });
    }
  }
  const canRestoreActive = store.isSessionActive() && activeYear && sujetObj();
  const canRestoreSimulationReview =
    store.state.sessionStatus === "completed" &&
    store.state.sessionMode === "simulation" &&
    store.state.activeScreen === "view-workspace" &&
    activeYear &&
    sujetObj();
  if (canRestoreActive || canRestoreSimulationReview) {
    // The global exam clock only ticks during the writing phase (workspace).
    // Guide and strategy are planning/reading phases that must not debit
    // official exam time after reload either.
    const onWorkspace = canRestoreSimulationReview || store.state.activeScreen === "view-workspace";
    if (canRestoreActive && onWorkspace) {
      timers.startGlobal();
      bar.classList.remove("hidden");
    } else {
      bar.classList.add("hidden");
    }
    if (canRestoreSimulationReview) {
      renderWorkspace();
      showScreen("view-workspace");
    } else if (store.state.activeScreen === "view-guide") {
      renderGuide(activeYear);
      showScreen("view-guide");
    } else if (store.state.activeScreen === "view-strategy") {
      // On reload during strategy, keep the strategy timer only — global stays paused.
      strategyScreen.restoreStrategy();
    } else if (onWorkspace) {
      renderWorkspace();
      showScreen("view-workspace");
    } else {
      renderGuide(activeYear);
      showScreen("view-guide");
    }
  } else {
    if (store.isSessionActive()) store.leaveSession();
    renderHub();
    showScreen("view-hub");
    bar.classList.add("hidden");
  }
}

export { toast as notify };
