/* ============================================================
   UI — rendu, routage entre écrans, boussole, exercices, toasts
   Facade stable : init, renderHub, notify, voiceEngine
   ============================================================ */

import { APP_CONFIG, normalizeArabic } from "../data/subjects.js";
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
import { node, replaceContent } from "./ui/dom.js";

const POLE = {
  N: { title: "القطب الشمال", cls: "emerald" },
  S: { title: "القطب الجنوب", cls: "blue" },
  E: { title: "القطب الشرق", cls: "amber" },
  W: { title: "القطب الغرب", cls: "purple" }
};
const POLE_ORDER = ["N", "S", "E", "W"];

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const el = (html) => {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
};

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

function showScreen(id) {
  $$(".screen").forEach((s) => s.classList.add("hidden"));
  const target = $("#" + id);
  if (target) target.classList.remove("hidden");
  store.setActiveScreen(id);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toast(msg, type = "info", ms = 3500) {
  const zone = $("#toast-zone");
  if (!zone) return;
  const t = node("div", { className: `toast ${type}` });
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

function trainingLimitHTML(compact = false) {
  const detail = compact
    ? "النقاط تقدير تدريبي آلي مبني على الكلمات المفتاحية والمنهجية."
    : "هذه منصة تدريب منهجي: التقييم آلي لمساعدتك على تنظيم الإجابة وفق شبكة التقييم التقديرية.";
  return `<div class="feedback mid ${compact ? "small" : "mb-2"}" role="note"><b>💡 تنبيه تدريبي</b> — ${detail}</div>`;
}

/* ---------- Voice / dictée ---------- */
export const voiceEngine = createSpeechEngine(toast);

function micButton(fieldId) {
  return `<button type="button" class="btn-mic" data-mic="${fieldId}">🎤 إملاء صوتي</button>`;
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
    note: "دعاء موسى عليه السلام."
  },
  { title: "الاستعاذة", ar: "أعوذ بالله من الشيطان الرجيم.", note: "قبل التركيز." },
  { title: "التوكل", ar: "حسبي الله ونعم الوكيل.", note: "عند القلق." },
  { title: "طلب العلم", ar: "ربِّ زدني علما.", note: "أثناء الحل." },
  { title: "خاتمة الجلسة", ar: "الحمد لله الذي بنعمته تتم الصالحات.", note: "بعد الإنهاء." }
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
  const years = APP_CONFIG.years;
  $("#view-hub").innerHTML = `
    <div class="app">
      <header class="screen-head">
        <div class="brand">
          <div class="brand-icon">🧭</div>
          <div>
            <h1>ربريك موضوع البكالوريا 4D</h1>
            <p>منصة تدريب منهجي مبسطة لبكالوريا علوم الطبيعة والحياة</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="btn-sound" id="btn-hub-sound">🔇 صوت</button>
          <button class="btn-adkar" id="btn-hub-adkar">🕌 أدعية</button>
        </div>
      </header>

      <div class="center mb-2">
        <h2 class="mt-0">اختر دورة البكالوريا لبدء التدريب</h2>
      </div>

      <div class="grid grid-cards" id="year-grid"></div>
      <footer class="screen-foot">ربريك موضوع البكالوريا — علوم الطبيعة والحياة</footer>
    </div>`;

  const grid = $("#year-grid");
  years.forEach((y) => {
    const disabled = !y.enabled;
    const card = node("div", {
      className: `card year-card ${disabled ? "dim" : ""}`
    });
    const stack = node("div", { className: "stack" });
    const header = node("div", { className: "flex spread" });
    header.append(
      node("span", { className: `badge badge-${y.theme}`, text: y.badge }),
      node("span", { className: "mono bold", text: y.id, attrs: { style: "font-size:1.4rem" } })
    );
    const copy = node("div");
    copy.append(
      node("h3", { className: "mt-0 mb-1", text: y.label })
    );
    stack.append(header, copy);
    const buttonTheme =
      y.theme === "emerald" ? "btn-emerald" : y.theme === "indigo" ? "btn-indigo" : "btn-amber";
    const button = node("button", {
      className: `btn btn-block ${buttonTheme}`,
      text: disabled ? "غير متاح" : "دخول الدورة",
      attrs: disabled ? { disabled: "" } : {},
      dataset: { year: y.id }
    });
    card.append(stack, button);
    grid.appendChild(card);
  });

  $$("#year-grid [data-year]:not([disabled])").forEach((btn) =>
    btn.addEventListener("click", () => startSession(btn.dataset.year))
  );
  $("#btn-hub-adkar").addEventListener("click", openAdkar);
  $("#btn-hub-sound").addEventListener("click", () => cycleSound($("#btn-hub-sound")));
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

function renderGuide(y) {
  $("#view-guide").innerHTML = `
    <div class="app">
      <header class="screen-head">
        <div class="brand">
          <button class="btn btn-rose btn-sm" id="guide-exit">✕ خروج</button>
          <div class="brand-icon">🌿</div>
          <div><h2 id="guide-title">التهدئة والتركيز المنهجي</h2>
          <p class="small text-emerald">بكالوريا ${y.id}</p></div>
        </div>
      </header>

      <div class="grid">
        <div class="card center stack">
          <div class="breath">تنفس بعمق</div>
          <div>
            <h3 class="mt-0">خذ شهيقاً عميقاً وتهيّأ للحل بتركيز وهدوء.</h3>
          </div>
        </div>
        ${adkarHTML()}
        <div class="grid grid-4 mb-2">
          <div class="card center stack" style="border-top: 3px solid var(--emerald)"><div class="pole" style="margin:0 auto">N</div><strong class="text-emerald">تأطير المسألة</strong><p class="small text-muted mt-0">حدد المتغيرات وصغ المشكل بعلامة (؟)</p></div>
          <div class="card center stack" style="border-top: 3px solid var(--blue)"><div class="pole" style="margin:0 auto">S</div><strong class="text-indigo">استغلال السندات</strong><p class="small text-muted mt-0">اقرأ الوثيقة بالمجالات والقيم</p></div>
          <div class="card center stack" style="border-top: 3px solid var(--amber)"><div class="pole" style="margin:0 auto">E</div><strong class="text-amber">الربط والتفسير</strong><p class="small text-muted mt-0">ابنِ السلسلة السببية والآلية</p></div>
          <div class="card center stack" style="border-top: 3px solid var(--purple)"><div class="pole" style="margin:0 auto">W</div><strong class="text-purple">التركيب والمصادقة</strong><p class="small text-muted mt-0">اجمع النتائج في خلاصة أو مخطط</p></div>
        </div>

        <div class="flex" style="justify-content:flex-end">
          <button class="btn btn-emerald" id="guide-next">مستعد | اختيار الموضوع والقارئ</button>
        </div>
      </div>
    </div>`;

  $("#guide-exit").addEventListener("click", goHome);
  $("#guide-next").addEventListener("click", goToStrategy);
}

/* ===================== 3) STRATEGY ===================== */
function goToStrategy() {
  renderStrategy(1);
  timers.startStrategy();
  showScreen("view-strategy");
}

function pdfFallbackHTML(s) {
  if (s && s.pdfAvailable && s.pdf) {
    return `<iframe id="strategy-pdf" src="${s.pdf}" style="width:100%;height:100%;border:0"></iframe>`;
  }
  if (s && s.pdfExternalUrl) {
    return `<div class="center stack" style="height:100%;justify-content:center;padding:1rem">
      <a class="btn btn-indigo" href="${s.pdfExternalUrl}" target="_blank" rel="noopener noreferrer">📄 فتح موضوع البكالوريا</a>
    </div>`;
  }
  return `<div class="center stack" style="height:100%;justify-content:center">
    <p class="small text-muted">ملف PDF غير متوفر لهذه الدورة.</p>
  </div>`;
}

function renderStrategy(sujetNum) {
  const y = yearObj(store.state.yearId);
  $("#view-strategy").innerHTML = `
    <div class="app app-wide">
      <header class="screen-head">
        <div class="brand">
          <button class="btn btn-rose btn-sm" id="strategy-exit">✕ خروج</button>
          <div class="brand-icon">♞</div>
          <div><h2>تصفح الموضوعين واختيار أحدهما</h2></div>
        </div>
        <div class="pill"><span class="text-dim">الوقت:</span><span class="mono" id="strategy-timer">25:00</span></div>
      </header>

      <div class="grid">
        <div class="card card-vign">
          <div class="flex spread" style="padding:.9rem 1rem;border-bottom:1px solid var(--line);margin-bottom:0">
            <span class="text-indigo bold small">📄 قارئ موضوع البكالوريا:</span>
            <div class="flex gap-2">
              <button class="btn btn-indigo btn-sm" data-preview="1">الموضوع 01</button>
              <button class="btn btn-purple btn-sm" data-preview="2">الموضوع 02</button>
            </div>
          </div>
          <div style="height:55vh;background:var(--bg)" id="pdf-preview-container">
            ${pdfFallbackHTML(y.sujets[0])}
          </div>
        </div>
        <div class="grid grid-2">
          ${calcCard(1, "indigo")}
          ${calcCard(2, "purple")}
        </div>
      </div>
    </div>`;

  setPdfPreview(sujetNum);
  updateStrategyTimer();

  $("#strategy-exit").addEventListener("click", goHome);
  $$("#view-strategy [data-preview]").forEach((b) =>
    b.addEventListener("click", () => setPdfPreview(+b.dataset.preview))
  );
  $$("#view-strategy [data-confirm]").forEach((b) =>
    b.addEventListener("click", () => confirmChoice(+b.dataset.confirm))
  );
}

function calcCard(n, theme) {
  return `
    <div class="card stack center">
      <span class="badge badge-${theme}" style="font-size:1rem;padding:.4rem 1rem">الموضوع 0${n}</span>
      <p class="small text-muted">تمرين 1 (5ن) + تمرين 2 (7ن) + تمرين 3 (8ن)</p>
      <button class="btn btn-block btn-${theme}" data-confirm="${n}">تأكيد اختيار الموضوع 0${n}</button>
    </div>`;
}

function setPdfPreview(n) {
  const y = yearObj(store.state.yearId);
  const s = y.sujets.find((suj) => suj.id === n) || y.sujets[0];
  const box = $("#pdf-preview-container");
  if (box && s) box.innerHTML = pdfFallbackHTML(s);
  $$("#view-strategy [data-preview]").forEach((b) => {
    const active = +b.dataset.preview === n;
    const color = active ? (n === 1 ? "btn-indigo" : "btn-purple") : "btn-ghost";
    b.className = `btn btn-sm ${color}`;
  });
}

function updateStrategyTimer() {
  const t = $("#strategy-timer");
  if (t) t.textContent = helpers.fmt(store.state.strategyRemaining);
}

function confirmChoice(sujetNum) {
  store.state.sujetId = sujetNum;
  store.save();
  timers.stopStrategy();
  renderOnboarding();
  showScreen("view-onboarding");
  $("#global-timer-bar")?.classList.remove("hidden");
}

/* ===================== 4) ONBOARDING ===================== */
function renderOnboarding() {
  const y = yearObj(store.state.yearId);
  const s = sujetObj();
  const num = s.id;
  $("#view-onboarding").innerHTML = `
    <div class="app">
      <header class="screen-head">
        <div class="brand">
          <button class="btn btn-rose btn-sm" id="onb-home">الرئيسية</button>
          <div class="brand-icon">🧭</div>
          <div><h2>الموضوع ${num === 1 ? "الأول" : "الثاني"} (بكالوريا ${y.id})</h2></div>
        </div>
      </header>
      <div class="stack mt-2">
        <h3 class="small text-muted mb-1">اختر التمرين لبدء الحل:</h3>
        <div class="grid grid-cards">
          ${s.exercises
            .map(
              (e) => `
            <button class="card btn-ghost" style="text-align:right" data-ex="${e.number}">
              <div class="flex spread"><span class="badge">ت${e.number} (${e.max}ن)</span><span>←</span></div>
              <strong class="block mt-1">${e.label}</strong>
              <p class="small text-muted mt-1">${e.desc}</p>
            </button>`
            )
            .join("")}
        </div>
      </div>
    </div>`;
  $("#onb-home").addEventListener("click", goHome);
  $$("#view-onboarding [data-ex]").forEach((b) =>
    b.addEventListener("click", () => enterExercise(+b.dataset.ex))
  );
}

/* ===================== 5) WORKSPACE ===================== */
function enterExercise(exNum) {
  store.setActiveExercise(exNum);
  renderWorkspace();
  showScreen("view-workspace");
}

function renderWorkspace() {
  const s = sujetObj();
  const ex = exDef(store.state.activeExercise);
  $("#view-workspace").innerHTML = `
    <div class="app">
      <header class="screen-head">
        <div class="brand">
          <button class="btn btn-rose btn-sm" id="ws-home">الرئيسية</button>
          <div><h2 id="ws-banner">الموضوع ${s.id === 1 ? "الأول" : "الثاني"} | التمرين 0${ex.number}</h2>
          <p class="small text-muted" id="ws-desc">${ex.desc}</p></div>
        </div>
          <div class="flex gap-2">
            <button class="btn-sound" id="ws-sound">🔇 صوت</button>
            <button class="btn-adkar" id="ws-adkar">🕌 أدعية</button>
            <button class="btn btn-amber btn-sm" id="ws-brouillon">📝 ورقة المسودة M1</button>
            <button class="btn btn-indigo btn-sm" id="ws-pdf">📄 الوثيقة (PDF)</button>
            <div class="pill"><span class="text-dim">العلامة:</span><span class="mono" id="live-score">0.00</span><span class="text-dim" id="live-max">/ ${ex.max.toFixed(2)}</span></div>
            <button class="btn btn-purple btn-sm" id="ws-report">📊 التقرير</button>
          </div>
      </header>

      <div class="progress mb-2" id="progress"><span></span></div>
      ${trainingLimitHTML(true)}

      <div class="grid" style="grid-template-columns:minmax(200px,16rem) 1fr;align-items:start">
        <aside class="card stack">
          <span class="small bold text-muted">تمارين الموضوع:</span>
          <div class="stack">${s.exercises
            .map(
              (e) => `
            <button class="btn btn-ghost" data-switch="${e.number}" style="justify-content:space-between">
              <span>ت${e.number}: ${e.label} (${e.max}ن)</span><span id="lock-${e.number}">🔒</span>
            </button>`
            )
            .join("")}</div>
          <div class="card center stack">
            <div class="flex spread small"><span class="bold text-muted">بوصلة ت${ex.number}</span><span class="text-emerald" id="pole-text">القطب: الشمال</span></div>
            <div class="compass">
              <div class="compass-ring"></div>
              <span class="compass-mark" style="top:4px;inset-inline-start:50%;transform:translateX(50%);color:var(--emerald-soft)">N</span>
              <span class="compass-mark" style="bottom:4px;inset-inline-start:50%;transform:translateX(50%);color:var(--blue)">S</span>
              <span class="compass-mark" style="inset-block-start:50%;inset-inline-end:4px;transform:translateY(-50%);color:var(--amber-soft)">E</span>
              <span class="compass-mark" style="inset-block-start:50%;inset-inline-start:4px;transform:translateY(-50%);color:var(--purple-soft)">W</span>
              <div class="compass-seq" id="compass-needle">
                <svg viewBox="0 0 100 100"><polygon points="50,12 44,50 56,50" fill="#10b981"/><polygon points="50,88 44,50 56,50" fill="#3b82f6"/></svg>
              </div>
            </div>
          </div>
          <nav class="stepnav" id="stepnav"></nav>
        </aside>
        <section class="card" id="ex-content"></section>
      </div>
    </div>`;

  $("#ws-home").addEventListener("click", goHome);
  $("#ws-sound").addEventListener("click", () => cycleSound($("#ws-sound")));
  $("#ws-adkar").addEventListener("click", openAdkar);
  $("#ws-brouillon").addEventListener("click", openBrouillon);
  $("#ws-pdf").addEventListener("click", openPdfDrawer);
  $("#ws-report").addEventListener("click", showReport);
  $$("#view-workspace [data-switch]").forEach((b) =>
    b.addEventListener("click", () => attemptSwitch(+b.dataset.switch))
  );

  renderStepnav(ex);
  renderExercise(ex);
  goToStep(store.state.activeStep || 1);
  updateLiveScore();
}

function renderStepnav(ex) {
  $("#stepnav").innerHTML = POLE_ORDER.map(
    (p, i) => `
    <button data-step="${i + 1}">
      <span class="pole">${p}</span>
      <span>${short(ex.poles[p].prompt)} (${fmtPts(ex.poles[p].points)})</span>
    </button>`
  ).join("");
  $$("#stepnav [data-step]").forEach((b) => b.addEventListener("click", () => goToStep(+b.dataset.step)));
}

function renderExercise(ex) {
  const body = $("#ex-content");
  if (ex.ui === "pipeline") {
    body.innerHTML = pipelineHTML(ex);
    bindPipeline(ex);
  } else {
    body.innerHTML = textHTML(ex);
    bindText(ex);
  }
}

function setFeedback(container, res, score, points, pole) {
  const feedback = formatEvalFeedback(res, score, points);
  const fragments = [node("div", { html: feedback })];
  if (pole?.modelAnswer) {
    const details = node("details", { className: "model-box" });
    details.append(
      node("summary", { className: "model-summary", text: "إجابة نموذجية للتدريب" }),
      node("div", { className: "model-body" })
    );
    details.lastElementChild.append(node("pre", { className: "model-text", text: pole.modelAnswer }));
    fragments.push(details);
  }
  replaceContent(container, fragments);
}

function formatEvalFeedback(res, score, points) {
  let html = `التقدير التدريبي: <b>${score.toFixed(2)} / ${fmtPts(points)}</b> (${Math.round(res.fraction * 100)}%)`;
  if (res.verdict) html += `<br>${res.verdict}`;
  if (res.missing?.length) html += `<br>🔎 مفاهيم مفتاحية ناقصة: <b>${res.missing.join("، ")}</b>`;
  if (res.forbiddenFound?.length) html += `<br>⛔ كلمة ينبغي تجنبها: <b>${res.forbiddenFound.join("، ")}</b>`;
  if (res.science?.errors?.length) html += `<br>🧪 ملاحظة علمية: <b>${res.science.errors.map((e) => e.message).join(" — ")}</b>`;
  if (res.methodology?.missing?.length) html += `<br>🧭 المنهجية: ${res.methodology.missing[0]}`;
  if (res.coach?.tips?.length) html += `<br>💡 توجيه منهجي: ${res.coach.tips.slice(0, 2).join(" ")}`;
  if (res.empty) html = `لم تُدخل أي إجابة بعد.`;
  return html;
}

function textHTML(ex) {
  return POLE_ORDER.map((p, i) => {
    const pole = ex.poles[p];
    return `
      <div id="panel-${i + 1}" class="${i === 0 ? "" : "hidden"}">
        <div class="card">
          <span class="badge badge-${POLE[p].cls}" style="margin-bottom:.6rem">${POLE[p].title} (${fmtPts(pole.points)})</span>
          <h3 class="mt-0">${pole.prompt}</h3>
          <p class="small text-muted">${pole.bacPrompt || ""}</p>
          ${
            pole.minLength >= 100
              ? `<textarea class="field" id="fld-${p}" rows="5" placeholder="${pole.placeholder || "اكتب إجابتك هنا..."}"></textarea>`
              : `<input class="field" id="fld-${p}" type="text" placeholder="${pole.placeholder || "اكتب إجابتك هنا..."}">`
          }
          ${micButton("fld-" + p)}
          <div class="feedback hidden" id="fb-${p}"></div>
          <div class="flex mt-2" style="justify-content:space-between">
            <button class="btn btn-ghost btn-sm" data-goto="${i}">تخطّي</button>
            <button class="btn btn-emerald" data-check="${p}">✅ تأكيد القطب ${p}</button>
          </div>
        </div>
      </div>`;
  }).join("");
}

function bindText(ex) {
  $$("#ex-content [data-check]").forEach((b) =>
    b.addEventListener("click", () => checkText(ex.number, b.dataset.check))
  );
  $$("#ex-content [data-goto]").forEach((b) =>
    b.addEventListener("click", () => goToStep(+b.dataset.goto + 1))
  );
  const st = store.exercise(store.state.yearId, store.state.sujetId, ex.number);
  POLE_ORDER.forEach((p) => {
    const input = $("#fld-" + p);
    if (!input) return;
    if (st.text[p]) input.value = st.text[p];
    const saveDraft = debounce(() => {
      st.text[p] = input.value;
      if (input.value.trim()) st.answeredAny = true;
      store.save();
    });
    input.addEventListener("input", saveDraft);
  });
  bindMics($("#ex-content"));
}

function checkText(exNum, p) {
  const ex = exDef(exNum);
  const pole = ex.poles[p];
  const input = $("#fld-" + p);
  const text = input ? input.value : "";
  const rule = {
    ...(pole.rule || {}),
    prompt: pole.bacPrompt || pole.prompt,
    modelAnswer: pole.modelAnswer,
    minLength: pole.minLength
  };
  const res = evaluateText(text, rule, p);

  const st = store.exercise(store.state.yearId, store.state.sujetId, exNum);
  st.text[p] = text;
  st.scores[p] = scoreBac(pole.points, res.fraction);
  if (!st.answeredAny && text.trim()) st.answeredAny = true;
  store.save();

  updateLiveScore();
  const fb = $("#fb-" + p);
  fb.classList.remove("hidden");
  const grade = res.fraction >= 0.75 ? "good" : res.fraction >= 0.45 ? "mid" : "bad";
  fb.className = `feedback ${grade} mt-2`;
  setFeedback(fb, res, st.scores[p], pole.points, pole);
  if (!res.empty) goToSuccessStep();
}

function goToSuccessStep() {
  const idx = POLE_ORDER.indexOf(activePole);
  if (idx < 3) goToStep(idx + 2);
}

function pipelineHTML(ex) {
  return `
    <div id="panel-1" class="card">
      <span class="badge badge-emerald" style="margin-bottom:.6rem">${POLE.N.title} (${fmtPts(ex.poles.N.points)})</span>
      <h3 class="mt-0">${ex.poles.N.prompt}</h3>
      <div class="grid grid-2">
        <input class="field" id="pipeline-var-indep" type="text" placeholder="${ex.poles.N.rule?.hypotheses ? "الفرضية 1: يعود السبب إلى…" : "المتغير المستقل..."}">
        <input class="field" id="pipeline-var-dep" type="text" placeholder="${ex.poles.N.rule?.hypotheses ? "الفرضية 2" : "المتغير التابع..."}">
      </div>
      ${micButton("pipeline-var-indep")}
      <div class="feedback hidden" id="fb-N"></div>
      <button class="btn btn-emerald mt-2" data-polo-check="N">تأكيد القطب N</button>
    </div>
    <div id="panel-2" class="card hidden">
      <span class="badge badge-indigo" style="margin-bottom:.6rem">${POLE.S.title} (${fmtPts(ex.poles.S.points)})</span>
      <h3 class="mt-0">${ex.poles.S.prompt}</h3>
      <div class="card" style="background:var(--bg)">
        <label class="lbl">1. الشكل (أ): التحليل المقارن</label>
        <textarea class="field" rows="2" id="pipeline-doc1a"></textarea>
        <label class="lbl">الاستنتاج الخاص بالشكل (أ):</label>
        <input class="field" id="pipeline-doc1a-ded" type="text">
        <label class="lbl mt-2">2. الشكل (ب): شدة الارتباط</label>
        <input class="field" id="pipeline-doc1b" type="text">
        <input class="field mt-1" id="pipeline-doc1b-ded" type="text" placeholder="الاستنتاج الخاص بالشكل (ب):">
      </div>
      <div class="feedback hidden" id="fb-S"></div>
      <button class="btn btn-emerald mt-2" data-polo-check="S">تأكيد القطب S</button>
    </div>
    <div id="panel-3" class="card hidden">
      <span class="badge badge-amber" style="margin-bottom:.6rem">${POLE.E.title} (${fmtPts(ex.poles.E.points)})</span>
      <h3 class="mt-0">${ex.poles.E.prompt}</h3>
      <div class="grid grid-2">
        <input class="field" id="pipeline-hyp1" type="text" placeholder="الفرضية 1">
        <input class="field" id="pipeline-hyp2" type="text" placeholder="الفرضية 2">
      </div>
      <label class="lbl mt-2">استدلال الوثيقة 2:</label>
      <textarea class="field" rows="3" id="pipeline-doc2"></textarea>
      <div class="feedback hidden" id="fb-E"></div>
      <button class="btn btn-emerald mt-2" data-polo-check="E">تأكيد القطب E</button>
    </div>
    <div id="panel-4" class="card hidden">
      <span class="badge badge-purple" style="margin-bottom:.6rem">${POLE.W.title} (${fmtPts(ex.poles.W.points)})</span>
      <h3 class="mt-0">${ex.poles.W.prompt}</h3>
      <span class="lbl">📦 بنك العناصر:</span>
      <div class="bank" id="blocks-bank"></div>
      <div class="grid grid-2 mt-2">
        ${ex.streams
          .map(
            (str) => `
          <div class="card" style="background:var(--bg);border-color:${str.theme === "rose" ? "var(--rose)" : "var(--emerald)"}">
            <strong style="color:${str.theme === "rose" ? "#fb7185" : "var(--emerald-soft)"}">${str.title}</strong>
            <div class="pipeline mt-1" data-stream="${str.id}">
              ${str.slots.map((sl, i) => `<div class="slot" data-slot="${i}">${i + 1}. ${sl}</div>`).join("")}
            </div>
          </div>`
          )
          .join("")}
      </div>
      <div class="feedback hidden mt-2" id="fb-W"></div>
      <button class="btn btn-emerald mt-2" data-polo-check="W">مصادقة المخطط</button>
    </div>`;
}

function bindPipeline(ex) {
  $$("#ex-content [data-polo-check]").forEach((b) =>
    b.addEventListener("click", () => checkPipelinePole(ex.number, b.dataset.poloCheck))
  );
  const bank = $("#blocks-bank");
  replaceContent(
    bank,
    ex.blocksBank.map((blk) =>
      node("button", { className: "chip", text: blk.text, dataset: { block: blk.id } })
    )
  );
  $$("#blocks-bank [data-block]").forEach((c) =>
    c.addEventListener("click", () => placeBlock(ex, c.dataset.block))
  );
  $$("#ex-content .slot").forEach((sl) =>
    sl.addEventListener("click", () => {
      const stream = +sl.closest("[data-stream]").dataset.stream;
      clearBlock(ex, stream, +sl.dataset.slot);
    })
  );
  const st = store.exercise(store.state.yearId, store.state.sujetId, ex.number);
  renderPipeline(ex, st.pipeline);
  Object.entries(st.fields || {}).forEach(([id, val]) => {
    const f = $("#" + id);
    if (f) f.value = val;
  });
  $$("#ex-content input.field, #ex-content textarea.field").forEach((field) => {
    const saveDraft = debounce(() => {
      st.fields[field.id] = field.value;
      if (field.value.trim()) st.answeredAny = true;
      store.save();
    });
    field.addEventListener("input", saveDraft);
  });
  bindMics($("#ex-content"));
}

function placeBlock(ex, blockId) {
  const st = store.exercise(store.state.yearId, store.state.sujetId, ex.number);
  for (const key of ["stream1", "stream2"]) {
    const arr = st.pipeline[key];
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i]) {
        arr[i] = blockId;
        renderPipeline(ex, st.pipeline);
        store.save();
        return;
      }
    }
  }
}
function clearBlock(ex, stream, index) {
  const st = store.exercise(store.state.yearId, store.state.sujetId, ex.number);
  const key = stream === 1 ? "stream1" : "stream2";
  if (st.pipeline[key][index]) {
    st.pipeline[key][index] = null;
    renderPipeline(ex, st.pipeline);
    store.save();
  }
}
function renderPipeline(ex, arrangement) {
  $$("#blocks-bank [data-block]").forEach((c) => {
    const used = Object.values(arrangement).flat().includes(c.dataset.block);
    c.classList.toggle("used", used);
  });
  for (const str of ex.streams) {
    const key = str.id === 1 ? "stream1" : "stream2";
    const arr = arrangement[key];
    if (!arr) continue;
    $$(`[data-stream="${str.id}"] .slot`).forEach((slotEl, i) => {
      const id = arr[i];
      if (id) {
        const blk = ex.blocksBank.find((b) => b.id === id);
        slotEl.classList.add("filled");
        replaceContent(slotEl, [node("span", { text: blk?.text || "" }), node("span", { text: "🗑️" })]);
      } else {
        slotEl.classList.remove("filled");
        slotEl.textContent = `${i + 1}. ${str.slots[i]}`;
      }
    });
  }
}

function checkPipelinePole(exNum, p) {
  const ex = exDef(exNum);
  const st = store.exercise(store.state.yearId, store.state.sujetId, exNum);
  const fb = $("#fb-" + p);
  fb.classList.remove("hidden");
  if (p === "N" || p === "S" || p === "E") {
    const FIELDS = {
      N: ["pipeline-var-indep", "pipeline-var-dep"],
      S: ["pipeline-doc1a", "pipeline-doc1a-ded", "pipeline-doc1b", "pipeline-doc1b-ded"],
      E: ["pipeline-hyp1", "pipeline-hyp2", "pipeline-doc2"]
    };
    const ids = FIELDS[p] || [];
    let joined = "";
    ids.forEach((id) => {
      const f = $("#" + id);
      if (f) {
        st.fields[id] = f.value;
        joined += f.value + " ";
      }
    });
    const text = joined.trim();
    const rule = {
      ...(ex.poles[p].rule || {}),
      prompt: ex.poles[p].bacPrompt || ex.poles[p].prompt,
      modelAnswer: ex.poles[p].modelAnswer,
      minLength: ex.poles[p].minLength
    };
    const res = evaluateText(text, rule, p);
    const score = text ? scoreBac(ex.poles[p].points, res.fraction) : 0;
    st.scores[p] = score;
    if (!st.answeredAny && text) st.answeredAny = true;
    fb.className = `feedback ${res.fraction >= 0.75 ? "good" : text ? "mid" : "bad"} mt-2`;
    setFeedback(fb, res, score, ex.poles[p].points, ex.poles[p]);
  } else {
    const res = evaluatePipeline(ex.blocksBank, st.pipeline);
    const max = fmtPts(ex.poles[p].points);
    st.scores[p] = scoreBac(ex.poles[p].points, res.fraction);
    if (!st.answeredAny) st.answeredAny = true;
    fb.className = `feedback ${res.fraction >= 0.75 ? "good" : res.fraction >= 0.4 ? "mid" : "bad"} mt-2`;
    fb.textContent = `المخطط: ${st.scores[p].toFixed(2)} / ${max} (${res.correct}/${res.total} عنصر صحيح)` +
        (res.wrongSlots.length ? `\n⚠️ عناصر في غير موضعها: ${res.wrongSlots.length}` : "");
  }
  store.save();
  updateLiveScore();
}

let activePole = "N";
function goToStep(n) {
  const ex = exDef(store.state.activeExercise);
  activePole = POLE_ORDER[n - 1];
  store.setActiveStep(n);
  $$("#ex-content [id^='panel-']").forEach((panel, i) => panel.classList.toggle("hidden", i !== n - 1));
  const bar = $("#progress span");
  if (bar) bar.style.width = `${(n / 4) * 100}%`;
  const needle = $("#compass-needle");
  if (needle) needle.style.transform = `rotate(${n === 1 ? 0 : n === 2 ? 180 : n === 3 ? 90 : 270}deg)`;
  const poleText = $("#pole-text");
  if (poleText) poleText.textContent = `القطب: ${POLE[activePole].title.replace("القطب ", "")}`;
  $$("#stepnav [data-step]").forEach((b, i) => b.classList.toggle("active", i === n - 1));
  return { ex, pole: activePole };
}

function updateLiveScore() {
  const ex = exDef(store.state.activeExercise);
  if (!ex) return;
  const st = store.exercise(store.state.yearId, store.state.sujetId, ex.number);
  const sum = POLE_ORDER.reduce((total, pole) => total + st.scores[pole], 0);
  if ($("#live-score")) $("#live-score").textContent = sum.toFixed(2);
  if ($("#live-max")) $("#live-max").textContent = `/ ${ex.max.toFixed(2)}`;
  sujetObj()?.exercises.forEach((e) => {
    const lock = $("#lock-" + e.number);
    if (lock)
      lock.textContent = store.exercise(store.state.yearId, store.state.sujetId, e.number).answeredAny
        ? "🔓"
        : "🔒";
  });
}

function attemptSwitch(target) {
  const cur = store.state.activeExercise;
  if (target === cur) return;
  if (!store.exercise(store.state.yearId, store.state.sujetId, cur).answeredAny) {
    toast(
      `أجب عن سؤال واحد على الأقل في التمرين ${cur} قبل الانتقال!`,
      "warn"
    );
    return;
  }
  store.setActiveExercise(target);
  renderWorkspace();
  showScreen("view-workspace");
}

/* ---------- Brouillon ---------- */
function openBrouillon() {
  const ex = exDef(store.state.activeExercise);
  const st = store.exercise(store.state.yearId, store.state.sujetId, ex.number);
  const body = `
    <div class="brouillon-shell stack">
      <div class="card" style="background:rgba(245,158,11,0.06);border-color:var(--amber)">
        <strong>📝 ورقة المحاولة والمسودة المنهجية (M1)</strong>
        <p class="small text-muted mt-0">حرر أفكارك وأهيكل إجابتك هنا قبل نقلها إلى الحقل النهائي. يمكنك استخدام الإملاء الصوتي لسهولة الصياغة.</p>
      </div>
      <div class="brouillon-mini-grid">
        ${POLE_ORDER.map(
          (p) => `
          <div>
            <label class="lbl">${p} — ${POLE[p].title}</label>
            <textarea class="field brouillon-area" id="scratch-${p}" placeholder="مسودة القطب ${p}...">${escapeHTML(st.scratch[p])}</textarea>
            ${micButton("scratch-" + p)}
          </div>`
        ).join("")}
      </div>
      <label class="lbl">مسودة حرة شاملة</label>
      <textarea class="field" id="scratch-free" rows="4" placeholder="ملاحظات حرة ورسومات مسودة...">${escapeHTML(st.scratch.free)}</textarea>
      ${micButton("scratch-free")}
      <div class="flex mt-2">
        <button class="btn btn-emerald btn-sm" id="brouillon-insert-current">إدراج مسودة القطب الحالي في الإجابة</button>
      </div>
    </div>`;
  openDrawer("left", "📝 ورقة المسودة M1", body);

  const persist = () => {
    POLE_ORDER.forEach((p) => {
      st.scratch[p] = $("#scratch-" + p)?.value || "";
    });
    st.scratch.free = $("#scratch-free")?.value || "";
    store.save();
  };
  ["N", "S", "E", "W", "free"].forEach((k) => {
    const node = $("#scratch-" + k);
    if (node) node.addEventListener("input", persist);
  });
  bindMics($(".brouillon-shell"));

  $("#brouillon-insert-current")?.addEventListener("click", () => {
    persist();
    const target = $("#fld-" + activePole);
    if (target) {
      target.value = st.scratch[activePole] || "";
      st.text[activePole] = target.value;
      store.save();
      toast("تم إدراج النص من المسودة.", "success");
    }
  });
}

/* ---------- Rapport ---------- */
function computeReport() {
  const y = yearObj(store.state.yearId);
  const s = sujetObj();
  const rows = s.exercises.map((e) => {
    const st = store.exercise(store.state.yearId, store.state.sujetId, e.number);
    const tot = POLE_ORDER.reduce((total, pole) => total + st.scores[pole], 0);
    return {
      exercise: `ت${e.number}`,
      label: e.label,
      max: e.max,
      N: st.scores.N,
      S: st.scores.S,
      E: st.scores.E,
      W: st.scores.W,
      total: Math.round(tot * 100) / 100,
      filled: st.answeredAny
    };
  });
  const grand = rows.reduce((a, r) => a + r.total, 0);
  const grandMax = rows.reduce((a, r) => a + r.max, 0);
  return {
    title: APP_CONFIG.appTitle,
    year: y.id,
    sujet: s.id,
    sujetTitle: s.title,
    rows,
    grand: Math.round(grand * 100) / 100,
    grandMax,
    percent: grandMax ? Math.round((grand / grandMax) * 100) : 0
  };
}

function showReport() {
  const rep = computeReport();
  const summary = `<div class="card" style="background:var(--bg)">
      <div class="flex spread"><strong>الحصيلة التدريبية الإجمالية</strong>
        <span class="mono text-emerald" style="font-size:1.4rem">${rep.grand.toFixed(2)} / ${rep.grandMax.toFixed(2)}</span></div>
      <div class="progress mt-1"><span style="width:${rep.percent}%"></span></div>
      <p class="small text-muted mt-1">النسبة المحققة: ${rep.percent}%</p>
    </div>`;
  const body = `
    ${trainingLimitHTML()}
    ${summary}
    <div class="stack mt-2">
      ${rep.rows
        .map(
          (r) => `
        <div class="flex spread" style="border-bottom:1px solid var(--line);padding-bottom:.4rem">
          <span class="bold">${r.exercise}: ${r.label} ${r.filled ? "" : "(غير مكتمل)"}</span>
          <span class="mono ${r.total >= r.max * 0.7 ? "text-emerald" : "text-amber"}">${r.total.toFixed(2)} / ${r.max.toFixed(2)}</span>
        </div>`
        )
        .join("")}
    </div>
    <div class="flex mt-2">
      <button class="btn btn-emerald btn-sm" id="dl-csv">⬇️ تنزيل CSV</button>
      <button class="btn btn-ghost btn-sm" id="dl-json">⬇️ تنزيل JSON</button>
    </div>`;
  openModal(`📊 تقرير النتائج`, body);
  $("#dl-csv")?.addEventListener("click", () =>
    download(`boussole4d_${rep.year}_sujet${rep.sujet}.csv`, toCSV(rep))
  );
  $("#dl-json")?.addEventListener("click", () =>
    download(`boussole4d_${rep.year}_sujet${rep.sujet}.json`, JSON.stringify(rep, null, 2))
  );
}

function toCSV(rep) {
  const head = ["التمرين", "المسمى", "العلامة القصوى", "N", "S", "E", "W", "المجموع"];
  const lines = [head.join(",")];
  rep.rows.forEach((r) => {
    lines.push(
      [`ت${r.exercise.replace(/ت/, "")}`, `"${r.label}"`, r.max, r.N, r.S, r.E, r.W, r.total].join(",")
    );
  });
  lines.push([`الإجمالي`, "", rep.grandMax, "", "", "", "", rep.grand].join(","));
  return "\ufeff" + lines.join("\n");
}

function download(name, content, type = "text/plain") {
  const blob = new Blob([content], { type });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 100);
}

let modal = null;
let lastFocusedElement = null;
function trapDialogFocus(event, container) {
  if (event.key === "Escape") return closeModal();
  if (event.key !== "Tab") return;
  const focusable = $$(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    container
  ).filter((item) => !item.disabled);
  if (!focusable.length) return event.preventDefault();
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
function openModal(title, body, extra = "") {
  closeModal();
  lastFocusedElement = document.activeElement;
  modal = el(`<div class="overlay" data-close="overlay">
    <div class="modal" role="dialog" aria-modal="true" aria-label="${escapeHTML(title)}" tabindex="-1">
      <div class="modal-head">
        <strong class="text-amber">${title}</strong>
        <button class="btn btn-ghost btn-sm" data-close="btn">✕</button>
      </div>
      <div class="small">${body}</div>
      ${extra}
      <div class="flex" style="justify-content:flex-end;margin-top:1rem"><button class="btn btn-emerald" data-close="ok">موافق</button></div>
    </div></div>`);
  document.body.appendChild(modal);
  $$("[data-close]", modal).forEach((b) => b.addEventListener("click", closeModal));
  modal.addEventListener("keydown", (event) => trapDialogFocus(event, modal));
  $("[data-close='btn']", modal)?.focus();
}
function closeModal() {
  if (modal) modal.remove();
  modal = null;
  lastFocusedElement?.focus?.();
  lastFocusedElement = null;
}

function openPdfDrawer() {
  const s = sujetObj();
  openDrawer(
    "right",
    `📄 الموضوع ${s.id === 1 ? "الأول" : "الثاني"} (PDF)`,
    pdfFallbackHTML(s)
  );
}

function openDrawer(side, title, body) {
  closeModal();
  lastFocusedElement = document.activeElement;
  $$(".drawer").forEach((d) => d.remove());
  const d =
    el(`<div class="drawer ${side} open" role="dialog" aria-modal="true" aria-label="${escapeHTML(title)}" tabindex="-1">
    <div class="drawer-head"><strong>${title}</strong><button class="btn btn-ghost btn-sm" data-close>✕</button></div>
    <div class="drawer-body">${body}</div></div>`);
  document.body.appendChild(d);
  const closeDrawer = () => {
    d.remove();
    lastFocusedElement?.focus?.();
    lastFocusedElement = null;
  };
  $$("[data-close]", d).forEach((b) => b.addEventListener("click", closeDrawer));
  d.addEventListener("keydown", (event) => {
    if (event.key === "Escape") return closeDrawer();
    if (event.key === "Tab") trapDialogFocus(event, d);
  });
  $("[data-close]", d)?.focus();
}

function fmtPts(n) {
  return `${(+n).toFixed(2)}ن`;
}
function short(text, n = 7) {
  const words = String(text || "").split(" ");
  return words.length <= n ? text : words.slice(0, n).join(" ") + "…";
}

export function init() {
  store.load();

  let bar = $("#global-timer-bar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "global-timer-bar";
    bar.className = "hidden";
    bar.style.cssText =
      "position:sticky;top:0;z-index:40;display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.5rem 1.5rem;background:rgba(2,6,23,.9);border-bottom:1px solid var(--line);font-size:.8rem";
    bar.innerHTML = `<span class="text-emerald bold" style="display:flex;align-items:center;gap:.5rem"><span style="width:.5rem;height:.5rem;border-radius:50%;background:var(--emerald);animation:pulse 1.5s infinite"> </span> مؤقت الجلسة</span>
      <span class="mono bold" style="color:#fb7185">⏳ <span id="global-timer">04:30:00</span></span>`;
    document.body.prepend(bar);
  }

  timers.onChange = (which) => {
    const t = $("#global-timer");
    if (t) t.textContent = helpers.fmt(store.state.globalRemaining);
    if (which === "strategy") updateStrategyTimer();
  };

  if (!$("#toast-zone")) {
    const toastZone = document.createElement("div");
    toastZone.id = "toast-zone";
    toastZone.className = "toast-zone";
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
