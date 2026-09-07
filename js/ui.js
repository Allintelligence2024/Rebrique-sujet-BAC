/* ============================================================
   UI — rendu, routage entre écrans, boussole, exercices, toasts
   Facade stable : init, renderHub, notify, voiceEngine
   ============================================================ */

import { APP_CONFIG, examMinutesForYear, normalizeArabic } from "../data/subjects.js";
import { BROUILLON_MODE_DATA } from "../data/brouillon.js";
import { officialTaskInventoryFor } from "../data/official-tasks.js";
import { buildOfficialCoverageReport } from "./domain/subjects/official-coverage.js";
import { store, helpers } from "./store.js";
import {
  timers,
  evaluateText,
  evaluatePipeline,
  scoreFromFraction,
  scoreBac,
  soundEngine,
  METHOD_SCRIPTS
} from "./engine.js";
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
import { createGuideScreen } from "./ui/screens/guide.js";
import { createHubScreen } from "./ui/screens/hub.js";
import { createStrategyScreen } from "./ui/screens/strategy.js";
import { createTrainingController } from "./ui/training.js";
import { createWorkspaceController } from "./ui/screens/workspace.js";
import { reportDiagnostic } from "./services/diagnostics.js";

const POLE = {
  N: { title: "السنّ 1 · اقرأ", short: "اقرأ", cls: "emerald" },
  S: { title: "السنّ 2 · اجمع", short: "اجمع", cls: "blue" },
  E: { title: "السنّ 3 · اربط", short: "اربط", cls: "amber" },
  W: { title: "السنّ 4 · اختُم", short: "اختُم", cls: "purple" }
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
  onNavigate: (id) => {
    store.setActiveScreen(id);
    associateFieldsWithInstructions(document.getElementById(id));
    announceScreen(document, id);
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
  return APP_CONFIG.years.find((y) => y.id === id);
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
    t.style.opacity = "0";
    t.style.transform = "translateY(8px)";
    setTimeout(() => t.remove(), 250);
  }, ms);
}
function iconFor(type) {
  const map = { success: "✅", warn: "⚠️", error: "⛔", info: "💡" };
  return map[type] || "ℹ️";
}

// The scorer is a training heuristic. It must never be presented as a ministry
// correction or a substitute for a human BAC marker.
function trainingLimitHTML(compact = false) {
  const detail = compact
    ? "نفحص تغطية العناصر العلمية والمنهجية؛ النقاط مؤشر ثانوي وليست علامة بكالوريا."
    : "تتحقق المنصة من تغطية إجابتك للعناصر العلمية والمنهجية المنتظرة. لا تصحح نسختك ولا تستبدل الأستاذ؛ النقاط مؤشر تدريبي ثانوي مبني على قواعد، وبعض التعليمات معاد بناؤها.";
  return `<div class="feedback mid ${compact ? "small" : "mb-2"}" role="note"><b>🔎 ما الذي تفحصه المنصة؟</b> — ${detail}</div>`;
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

const openAtlas = createAtlas({ $, $$, openDrawer, normalizeArabic, bacVerbs: BROUILLON_MODE_DATA.bacVerbs });

/* ---------- Voice / dictée ---------- */
export const voiceEngine = createSpeechEngine(toast);

function micButton(fieldId) {
  return `<button type="button" class="btn-mic" data-mic="${fieldId}">🎤 إملاء</button>`;
}
function bindMics(root = document) {
  $$("[data-mic]", root).forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = $("#" + btn.dataset.mic);
      voiceEngine.start(input);
    });
  });
}

/* ---------- Adkar ---------- */
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

/* ===================== 1) HUB ===================== */
export function renderHub() {
  return hubScreen.renderHub();
}

function goHome() {
  timers.stopAll();
  soundEngine.stop();
  if (store.isSessionActive()) store.leaveSession();
  renderHub();
  showScreen("view-hub");
  const bar = $("#global-timer-bar");
  if (bar) bar.classList.add("hidden");
}

/* ===================== 2) GUIDE ===================== */
function startSession(yearId) {
  const y = yearObj(yearId);
  if (!y) return;
  store.enterSession(yearId, y.sujets[0].id, examMinutesForYear(y) * 60, APP_CONFIG.strategyMinutes * 60);
  renderGuide(y);
  timers.startGlobal();
  showScreen("view-guide");
  $("#global-timer-bar")?.classList.remove("hidden");
}

function renderGuide(year) {
  return guideScreen.renderGuide(year);
}

/* ===================== 3) STRATEGY ===================== */
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

/* ===================== 5) WORKSPACE ===================== */
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
  showScreen,
  store,
  timers,
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

export function init() {
  ensureLiveRegions(document);
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

  const activeYear = yearObj(store.state.yearId);
  const canRestore = store.isSessionActive() && activeYear && sujetObj();
  if (canRestore) {
    timers.startGlobal();
    bar.classList.remove("hidden");
    if (store.state.activeScreen === "view-guide") {
      renderGuide(activeYear);
      showScreen("view-guide");
    } else if (store.state.activeScreen === "view-strategy") {
      strategyScreen.restoreStrategy();
    } else if (store.state.activeScreen === "view-workspace" && exDef(store.state.activeExercise)) {
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
