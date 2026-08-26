/* ============================================================
   UI — rendu, routage entre écrans, boussole, exercices, toasts
   Facade stable : init, renderHub, notify, voiceEngine
   ============================================================ */

import { APP_CONFIG, normalizeArabic } from "../data/subjects.js";
import { BROUILLON_MODE_DATA } from "../data/brouillon.js";
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
import { createOnboardingScreen } from "./ui/screens/onboarding.js";
import { createStrategyScreen } from "./ui/screens/strategy.js";
import { createWorkspaceController } from "./ui/screens/workspace.js";
import { reportDiagnostic } from "./services/diagnostics.js";

const POLE = {
  N: { title: "القطب الشمال", cls: "emerald" },
  S: { title: "القطب الجنوب", cls: "blue" },
  E: { title: "القطب الشرق", cls: "amber" },
  W: { title: "القطب الغرب", cls: "purple" }
};
const POLE_ORDER = ["N", "S", "E", "W"];
let hubScreen;
let guideScreen;
let onboardingScreen;
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
  const labels = {
    dark: "☀️ الوضع الفاتح",
    light: "◐ تباين قوي",
    contrast: "🌙 الوضع الداكن"
  };
  $$("[data-theme-toggle]").forEach((button) => {
    button.textContent = labels[value];
    button.setAttribute("aria-label", `المظهر الحالي: ${value}. ${labels[value]}`);
  });
}
function toggleTheme() {
  const current = document.documentElement.dataset.theme || "dark";
  applyTheme(current === "dark" ? "light" : current === "light" ? "contrast" : "dark");
  toast("تم تغيير مظهر الألوان.", "info");
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
  store.state.sessionActive = false;
  store.save();
  renderHub();
  showScreen("view-hub");
  const bar = $("#global-timer-bar");
  if (bar) bar.classList.add("hidden");
}

/* ===================== 2) GUIDE ===================== */
function startSession(yearId) {
  const y = yearObj(yearId);
  store.enterSession(yearId, y.sujets[0].id);
  renderGuide(y);
  timers.startGlobal();
  showScreen("view-guide");
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

/* ===================== 4) ONBOARDING ===================== */
function renderOnboarding() {
  return onboardingScreen.renderOnboarding();
}

function timeFor(points) {
  return points >= 8 ? "1س 45د" : points >= 5 ? "45 دقيقة" : "1س 15د";
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
  openAdkar,
  openAtlas,
  openModal,
  startSession,
  store,
  timers,
  trainingLimitHTML,
  toggleTheme,
  yearObj
});
guideScreen = createGuideScreen({ $, adkarHTML, goHome, goToStrategy });
onboardingScreen = createOnboardingScreen({
  $,
  $$,
  enterExercise,
  goHome,
  store,
  sujetObj,
  yearObj,
  timeFor
});
strategyScreen = createStrategyScreen({
  $,
  $$,
  goHome,
  helpers,
  renderOnboarding,
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
  cycleSound,
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
  openAdkar,
  openAtlas,
  openDrawer,
  openModal,
  pdfFallbackHTML,
  renderHub,
  renderOnboarding,
  replaceContent,
  scoreBac,
  short,
  showScreen,
  soundEngine,
  store,
  timers,
  toast,
  trainingLimitHTML,
  toggleTheme,
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
    bar.className = "hidden";
    bar.style.cssText =
      "position:sticky;top:0;z-index:40;display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.5rem 1.5rem;background:rgba(2,6,23,.9);border-bottom:1px solid var(--line);font-size:.8rem";
    const timerLabel = node("span", {
      className: "text-emerald bold",
      text: "● نمط التركيز والهدوء 4D",
      attrs: { style: "display:flex;align-items:center;gap:.5rem" }
    });
    const timerValue = node("span", { className: "mono bold", attrs: { style: "color:#fb7185" } });
    timerValue.append("⏳ ", node("span", { text: "04:30:00", attrs: { id: "global-timer" } }));
    replaceContent(bar, [timerLabel, timerValue]);
    document.body.prepend(bar);
  }

  timers.onChange = (which) => {
    const t = $("#global-timer");
    if (t) t.textContent = helpers.fmt(store.state.globalRemaining);
    if (which === "strategy") strategyScreen.updateStrategyTimer();
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

  if (
    store.state.sessionActive &&
    store.state.activeScreen === "view-workspace" &&
    sujetObj() &&
    exDef(store.state.activeExercise)
  ) {
    timers.startGlobal();
    renderWorkspace();
    showScreen("view-workspace");
    bar.classList.remove("hidden");
  } else {
    renderHub();
    showScreen("view-hub");
  }
}

export { toast as notify };
