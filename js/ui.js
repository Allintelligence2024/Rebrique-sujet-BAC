/* ============================================================
   UI — rendu, routage entre écrans, boussole, exercices, toasts
   ------------------------------------------------------------
   Améliorations P0 :
     - Routeur avec restauration exacte de l'écran après refresh.
     - Minuteurs fiabilisés et ancrés sur l'état persistant.
     - Affichage PDF adapté desktop + liens directs / secours mobile.
     - Gestion propre des transitions sans reload destructif.
   ============================================================ */

import { APP_CONFIG, ATLAS_DATA, ADKAR_DATA, normalizeArabic } from "../data/subjects.js";
import { store, helpers } from "./store.js";
import { timers, evaluateText, evaluatePipeline, scoreFromFraction, soundEngine } from "./engine.js";

const POLE = {
  N: { title: "القطب الشمال", cls: "emerald"  },
  S: { title: "القطب الجنوب", cls: "blue"     },
  E: { title: "القطب الشرق",  cls: "amber"    },
  W: { title: "القطب الغرب",  cls: "purple"   }
};
const POLE_ORDER = ["N", "S", "E", "W"];

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };

function yearObj(id) { return APP_CONFIG.years.find(y => y.id === id); }
function sujetObj() { return yearObj(store.state.yearId)?.sujets.find(s => s.id === store.state.sujetId); }
function exDef(num)  { return sujetObj()?.exercises.find(e => e.number === num); }

/* ---------- Router ---------- */
function showScreen(id) {
  stopVoiceDictation();
  $$(".screen").forEach(s => s.classList.add("hidden"));
  const target = $("#" + id);
  if (target) target.classList.remove("hidden");
  store.setActiveScreen(id);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function returnToHub() {
  renderHub();
  showScreen("view-hub");
}

/* ---------- Toasts ---------- */
function toast(msg, type = "info", ms = 3500) {
  const zone = $("#toast-zone");
  if (!zone) return;
  const t = el(`<div class="toast ${type}"><span>${iconFor(type)}</span><div>${msg}</div></div>`);
  zone.appendChild(t);
  setTimeout(() => { t.style.opacity = "0"; t.style.transform = "translateY(8px)"; setTimeout(() => t.remove(), 250); }, ms);
}
function iconFor(type) {
  const map = { success: "✅", warn: "⚠️", error: "⛔", info: "💡" };
  return map[type] || "ℹ️";
}

/* ===================== 1) HUB ===================== */
export function renderHub() {
  const years = APP_CONFIG.years;
  const isOngoing = store.state.sessionActive;
  const activeYear = store.state.yearId;

  $("#view-hub").innerHTML = `
    <div class="app">
      <header class="screen-head">
        <div class="brand">
          <div class="brand-icon">🧭</div>
          <div>
            <h1>${APP_CONFIG.appTitle}</h1>
            <p>${APP_CONFIG.appSubtitle}</p>
          </div>
        </div>
        <div class="flex gap-2" style="align-items:center;flex-wrap:wrap">
          ${isOngoing ? `<button class="btn btn-emerald btn-sm" id="btn-hub-resume">▶ استئناف الجلسة الحالية</button>` : ""}
          <button class="btn-sound btn-sm" data-sound-toggle id="btn-hub-sound">🎧 أصوات الهدوء</button>
          <button class="btn-adkar btn-sm" id="btn-hub-adkar">🤲 أذكار الامتحان</button>
          <button class="btn btn-amber btn-sm" id="btn-atlas">🔬 أطلس التقنيات والمنهجية 4D</button>
        </div>
      </header>

      <div class="center mb-2">
        <h2 class="mt-0">اختر دورة البكالوريا لبدء جلسة التدريب المنظم</h2>
        <p class="text-muted small">ستمر أولاً بمحطة التهدئة البصرية قبل تصفح وحساب نقاط الموضوعين</p>
      </div>

      ${isOngoing ? `
        <div class="card mb-2" style="border-color:var(--emerald);background:rgba(16,185,129,.06);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem">
          <div>
            <strong class="text-emerald">جلسة نشطة قيد الإنجاز: بكالوريا ${activeYear} (الموضوع 0${store.state.sujetId})</strong>
            <p class="small text-muted mt-0 mb-0">الوقت المتبقي: <span class="mono bold text-white">${helpers.fmt(store.state.globalRemaining)}</span></p>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-emerald" id="btn-resume-banner">متابعة الحل ⏎</button>
            <button class="btn btn-rose btn-sm" id="btn-hub-reset">بدء جلسة جديدة</button>
          </div>
        </div>
      ` : ""}

      <div class="grid grid-cards" id="year-grid"></div>
      <footer class="screen-foot">منصة الحل الميكانيكي المنظم لامتحانات بكالوريا علوم الطبيعة والحياة.</footer>
    </div>`;

  const grid = $("#year-grid");
  years.forEach(y => {
    const disabled = !y.enabled;
    const isCurrent = isOngoing && y.id === activeYear;
    const card = el(`
      <div class="card year-card ${disabled ? "dim" : ""}">
        <div class="stack">
          <div class="flex spread">
            <span class="badge badge-${y.theme}">${y.badge}</span>
            <span class="mono bold" style="font-size:1.6rem">${y.id}</span>
          </div>
          <div>
            <h3 class="mt-0 mb-1">${y.label}</h3>
            <p class="small text-muted mt-0">${disabled ? "لم تُرفق وثائق PDF لهذه الدورة بعد — قريباً." : "جلسة شاملة وفق نظام الأقطاب 4D الهادئ."}</p>
          </div>
        </div>
        <button class="btn btn-block ${y.theme === 'emerald' ? 'btn-emerald' : y.theme === 'indigo' ? 'btn-indigo' : 'btn-amber'}" ${disabled ? "disabled" : ""} data-year="${y.id}">
          ${disabled ? "غير متاح بعد" : isCurrent ? "استئناف الدورة الحالية" : "دخول الدورة (ساس التهدئة والبوصلة)"}
        </button>
      </div>`);
    grid.appendChild(card);
  });

  $$("#year-grid [data-year]:not([disabled])").forEach(btn =>
    btn.addEventListener("click", () => {
      const targetYear = btn.dataset.year;
      if (store.state.sessionActive && store.state.yearId === targetYear) {
        resumeCurrentSession();
      } else {
        startSession(targetYear);
      }
    }));

  if ($("#btn-hub-resume")) $("#btn-hub-resume").addEventListener("click", resumeCurrentSession);
  if ($("#btn-resume-banner")) $("#btn-resume-banner").addEventListener("click", resumeCurrentSession);
  if ($("#btn-hub-reset")) $("#btn-hub-reset").addEventListener("click", confirmReset);
  if ($("#btn-hub-adkar")) $("#btn-hub-adkar").addEventListener("click", openAdkarModal);
  if ($("#btn-atlas")) $("#btn-atlas").addEventListener("click", () => openAtlas());
  $$("[data-sound-toggle]").forEach(b => b.addEventListener("click", () => toggleSound()));
  updateSoundButtons();
}

function resumeCurrentSession() {
  const target = store.state.activeScreen;
  if (target && target !== "view-hub") {
    restoreActiveScreen();
  } else {
    enterExercise(store.state.activeExercise || 1);
  }
}

/* ===================== 2) GUIDE (respiration) ===================== */
function startSession(yearId) {
  const y = yearObj(yearId);
  store.enterSession(yearId, y.sujets[0].id);
  renderGuide(y);
  timers.startGlobal();
  const bar = $("#global-timer-bar");
  if (bar) bar.classList.remove("hidden");
  showScreen("view-guide");
}

function renderGuide(y) {
  $("#view-guide").innerHTML = `
    <div class="app">
      <header class="screen-head">
        <div class="brand">
          <button class="btn btn-rose btn-sm" id="guide-exit">✕ إلغاء والعودة</button>
          <div class="brand-icon">🌿</div>
          <div><h2 id="guide-title">ساس الهدوء والتركيز المنهجي</h2>
          <p class="small text-emerald">جلسة التأطير النفسي والتنفس الموجه والأدعية — بكالوريا ${y.id}</p></div>
        </div>
      </header>

      <div class="grid">
        <div class="card center stack">
          <div class="breath">تنفس بعمق</div>
          <div>
            <h3 class="mt-0">أنت تمتلك كافة المكتسبات، ركّز فقط على تطبيق خطوات البوصلة.</h3>
            <p class="small text-muted">خذ شهيقاً 4 ثوانٍ، احبس 4 ثوانٍ، ثم ازفر ببطء 4 ثوانٍ لطرد التوتر والاضطراب.</p>
          </div>
        </div>

        <div class="adkar-section">
          <div class="flex spread" style="align-items:center;flex-wrap:wrap;gap:.5rem">
            <strong class="text-emerald" style="font-size:1.05rem">🤲 أدعية وأذكار التوفيق وانشراح الصدر قبل الامتحان</strong>
            <span class="badge badge-emerald">سكينة وتوكل على الله</span>
          </div>
          <p class="small text-muted mt-1 mb-0">استفتح جلستك بالتوكل على الله واستحضر معيته لتيسير الفهم واسترجاع المعلومات والسداد في الجواب:</p>
          <div class="adkar-grid">
            ${ADKAR_DATA.map(a => `
              <div class="adkar-card">
                <div class="adkar-title">
                  <span>${escapeHTML(a.title)}</span>
                  <span class="badge badge-emerald">${escapeHTML(a.badge)}</span>
                </div>
                <div class="adkar-arabic">${escapeHTML(a.arabic)}</div>
                <div class="adkar-note">${escapeHTML(a.note)}</div>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="grid grid-4">
          <div class="card center stack"><div class="pole" style="margin:0 auto">N</div><strong class="text-emerald">تأطير المسألة</strong><p class="small text-muted mt-0">حدد المتغيرات وصغ المشكل بعلامة (؟)</p></div>
          <div class="card center stack"><div class="pole" style="margin:0 auto">S</div><strong class="text-indigo">استغلال السندات</strong><p class="small text-muted mt-0">قارن بالأرقام فقط دون تعليل</p></div>
          <div class="card center stack"><div class="pole" style="margin:0 auto">E</div><strong class="text-amber">الربط والتفسير</strong><p class="small text-muted mt-0">فسر بـ «يعود إلى» وتتبع الآلية</p></div>
          <div class="card center stack"><div class="pole" style="margin:0 auto">W</div><strong class="text-purple">التركيب والمصادقة</strong><p class="small text-muted mt-0">صادق ومثّل المسارين</p></div>
        </div>

        <div class="flex" style="justify-content:flex-end">
          <button class="btn btn-emerald" id="guide-next">♞ أنا هادئ ومستعد | تصفح PDF وحاسبة الاختيار (25 دقيقة)</button>
        </div>
      </div>
      <footer class="screen-foot">المنهجية الميكانيكية والتوكل على الله يمنحانك الثقة والسكينة في كل خطوة.</footer>
    </div>`;

  $("#guide-exit").addEventListener("click", returnToHub);
  $("#guide-next").addEventListener("click", goToStrategy);
}

/* ===================== 3) STRATEGY ===================== */
function goToStrategy() {
  renderStrategy(1);
  timers.startStrategy();
  showScreen("view-strategy");
}

function renderStrategy(sujetNum) {
  const y = yearObj(store.state.yearId);
  const pdfUrl = (y.sujets.find(s => s.id === sujetNum) || y.sujets[0] || {}).pdf || "";

  $("#view-strategy").innerHTML = `
    <div class="app app-wide">
      <header class="screen-head">
        <div class="brand">
          <button class="btn btn-rose btn-sm" id="strategy-exit">✕ الرئيسية</button>
          <div class="brand-icon">♞</div>
          <div><h2>استكشاف الموضوعين PDF وحاسبة الترجيح</h2>
          <p class="small text-muted">تصفح الوثائق الرسمية للموضوعين 1 و2 ثم قيّم نقاطك قبل التثبيت النهائي</p></div>
        </div>
        <div class="pill"><span class="text-dim">وقت الاختيار:</span><span class="mono" id="strategy-timer">25:00</span></div>
      </header>

      <div class="grid">
        <div class="card card-vign">
          <div class="flex spread" style="padding:.9rem 1rem;border-bottom:1px solid var(--line);margin-bottom:0">
            <span class="text-indigo bold small">📄 قارئ مواضيع البكالوريا الرسمية (تصفح مباشر):</span>
            <div class="flex gap-2">
              <button class="btn btn-indigo btn-sm" data-preview="1">الموضوع 01</button>
              <button class="btn btn-purple btn-sm" data-preview="2">الموضوع 02</button>
              <a class="btn btn-ghost btn-sm" id="strategy-pdf-link" target="_blank" rel="noopener noreferrer" href="${pdfUrl}">↗ فتح PDF مستقل</a>
            </div>
          </div>
          <div style="position:relative;height:60vh;background:var(--bg)">
            <iframe id="strategy-pdf" src="${pdfUrl}" title="موضوع البكالوريا" style="width:100%;height:100%;border:0"></iframe>
          </div>
          <div class="flex spread small" style="padding:.6rem 1rem;background:rgba(2,6,23,.75);border-top:1px solid var(--line)">
            <span class="text-muted">💡 لمستخدمي الهواتف: إذا لم يظهر الملف داخل الإطار، اضغط "فتح PDF مستقل".</span>
            <a class="text-emerald bold" id="strategy-pdf-download" href="${pdfUrl}" download>تحميل نسخة PDF ↓</a>
          </div>
        </div>

        <div class="grid grid-2">
          ${calcCard(1, "indigo")}
          ${calcCard(2, "purple")}
        </div>

        <div class="card" style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap">
          <span class="bold" id="recommendation-text">التوصية المنهجية: …</span>
          <span class="mono text-emerald" id="recommendation-gain"></span>
        </div>
      </div>
    </div>`;

  setPdfPreview(sujetNum);
  updateStrategyTimer();
  calculateStrategicScores();

  $("#strategy-exit").addEventListener("click", returnToHub);
  $$("#view-strategy [data-preview]").forEach(b => b.addEventListener("click", () => setPdfPreview(+b.dataset.preview)));
  $$("#view-strategy .calc-input").forEach(i => i.addEventListener("input", calculateStrategicScores));
  $$("#view-strategy [data-confirm]").forEach(b => b.addEventListener("click", () => confirmChoice(+b.dataset.confirm)));
}

function calcCard(n, theme) {
  const s = n === 1 ? "s1" : "s2";
  return `
    <div class="card stack" style="justify-content:space-between">
      <div>
        <div class="flex spread" style="border-bottom:1px solid var(--line);padding-bottom:.5rem">
          <span class="badge badge-${theme}">الموضوع 0${n}</span>
          <span class="mono small text-dim">20.00 نقطة</span>
        </div>
        <div class="stack mt-1">
          <div class="flex spread">
            <span class="small">ت1: استرجاع (5ن)</span>
            <input class="field calc-input" aria-label="علامة تقدير التمرين الأول الموضوع ${n}" data-total="${s}-t1" type="number" min="0" max="5" step="0.25" value="4.25" style="width:5rem;text-align:center">
          </div>
          <div class="flex spread">
            <span class="small">ت2: استدلال (7ن)</span>
            <input class="field calc-input" aria-label="علامة تقدير التمرين الثاني الموضوع ${n}" data-total="${s}-t2" type="number" min="0" max="7" step="0.25" value="5.75" style="width:5rem;text-align:center">
          </div>
          <div class="flex spread">
            <span class="small bold text-emerald">ت3: مسعى (8ن) ★</span>
            <input class="field calc-input" aria-label="علامة تقدير التمرين الثالث الموضوع ${n}" data-total="${s}-t3" type="number" min="0" max="8" step="0.25" value="7.25" style="width:5rem;text-align:center">
          </div>
        </div>
        <div class="flex spread small mt-1" style="background:rgba(99,102,241,.08);border:1px solid var(--line);padding:.5rem .75rem;border-radius:.8rem">
          <span class="bold text-muted">مجموع الموضوع ${n}:</span><span class="mono text-${theme}" id="${s}-total">17.25 / 20.00</span>
        </div>
      </div>
      <button class="btn btn-block btn-${theme}" data-confirm="${n}">🔒 تثبيت نهائي للموضوع 0${n} وعزل مستنداته</button>
    </div>`;
}

function setPdfPreview(n) {
  const y = yearObj(store.state.yearId);
  const pdf = y.sujets.find(s => s.id === n)?.pdf || "";
  const iframe = $("#strategy-pdf");
  if (iframe) iframe.src = pdf;
  const link = $("#strategy-pdf-link");
  if (link) link.href = pdf;
  const dl = $("#strategy-pdf-download");
  if (dl) dl.href = pdf;
  $$("#view-strategy [data-preview]").forEach(b => {
    const active = +b.dataset.preview === n;
    const color = active ? (n === 1 ? "btn-indigo" : "btn-purple") : "btn-ghost";
    b.className = `btn btn-sm ${color}`;
  });
}

function updateStrategyTimer() {
  const elTimer = $("#strategy-timer");
  if (elTimer) elTimer.textContent = helpers.fmt(store.state.strategyRemaining);
}

function calculateStrategicScores() {
  const read = (prefix, n) => {
    const elIn = $(`[data-total="${prefix}-t${n}"]`);
    if (!elIn) return 0;
    const v = parseFloat(elIn.value);
    return isNaN(v) ? 0 : Math.min(20, Math.max(0, v));
  };
  const s1 = read("s1", 1) + read("s1", 2) + read("s1", 3);
  const s2 = read("s2", 1) + read("s2", 2) + read("s2", 3);
  const elS1 = $("#s1-total");
  const elS2 = $("#s2-total");
  if (elS1) elS1.textContent = `${s1.toFixed(2)} / 20.00`;
  if (elS2) elS2.textContent = `${s2.toFixed(2)} / 20.00`;

  let rec, gain;
  if (s1 > s2)      { rec = `ترجيح الموضوع الأول بفارق +${(s1 - s2).toFixed(2)} نقاط، لتميّز رصيد المسعى العلمي (ت3: 8ن).`; gain = ((s1 / 20) * 100).toFixed(1) + "%"; }
  else if (s2 > s1) { rec = `ترجيح الموضوع الثاني بفارق +${(s2 - s1).toFixed(2)} نقاط، لتميّز رصيد المسعى العلمي (ت3: 8ن).`; gain = ((s2 / 20) * 100).toFixed(1) + "%"; }
  else              { rec = "الموضوعان متكافئان تماماً — رجّح موضوع التمرين الثالث الأكثر ضماناً."; gain = ((s1 / 20) * 100).toFixed(1) + "%"; }
  const recEl = $("#recommendation-text");
  const gainEl = $("#recommendation-gain");
  if (recEl) recEl.textContent = rec;
  if (gainEl) gainEl.textContent = gain;
}

function confirmChoice(sujetNum) {
  store.state.sujetId = sujetNum;
  store.save();
  timers.stopStrategy();
  renderOnboarding();
  showScreen("view-onboarding");
  const bar = $("#global-timer-bar");
  if (bar) bar.classList.remove("hidden");
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
          <div><h2>دليل معالجة الموضوع ${num === 1 ? "الأول" : "الثاني"} المختار (بكالوريا ${y.id})</h2>
          <p class="small text-emerald">تم عزل وتثبيت ملفات الموضوع المختار حصرياً وفق البوصلة 4D</p></div>
        </div>
      </header>

      <div class="grid grid-cards">
        ${s.exercises.map(e => `
          <div class="card stack">
            <div class="flex spread"><strong class="text-emerald">${e.number}. ${e.label} (${e.max} نقاط)</strong><span class="badge">${timeFor(e.max)}</span></div>
            <p class="small text-muted mt-0">${e.desc}</p>
          </div>`).join("")}
      </div>

      <div class="stack mt-3">
        <h3 class="small text-muted mb-1">اختر التمرين الذي ستبدأ بحله الآن:</h3>
        <div class="grid grid-cards">
          ${s.exercises.map(e => `
            <button class="card btn-ghost" style="text-align:right" data-ex="${e.number}">
              <div class="flex spread"><span class="badge">ت${e.number} (${e.max}ن)</span><span>←</span></div>
              <strong class="block mt-1">${e.label}</strong>
              <p class="small text-muted mt-1">كلمات مفتاحية، مقارنة بالتوازي، مصادقة ومخطط.</p>
            </button>`).join("")}
        </div>
      </div>
    </div>`;

  $("#onb-home").addEventListener("click", returnToHub);
  $$("#view-onboarding [data-ex]").forEach(b => b.addEventListener("click", () => enterExercise(+b.dataset.ex)));
}
function timeFor(points) { return points >= 8 ? "1س 45د" : points >= 5 ? "45 دقيقة" : "1س 15د"; }

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
        <div class="flex gap-2" style="align-items:center;flex-wrap:wrap">
          <button class="btn btn-amber btn-sm" id="ws-panic">✨ فك القفل الذهني</button>
          <button class="btn-sound btn-sm" data-sound-toggle id="ws-sound">🎧 أصوات الهدوء</button>
          <button class="btn-adkar btn-sm" id="ws-adkar">🤲 أذكار الامتحان</button>
          <button class="btn btn-ghost btn-sm" id="ws-atlas">🔬 الأطلس 4D</button>
          <div class="pill"><span class="text-dim">العلامة:</span><span class="mono" id="live-score">0.00</span><span class="text-dim" id="live-max">/ ${ex.max.toFixed(2)}</span></div>
          <button class="btn btn-ghost btn-sm" id="ws-onb">دليل المعالجة</button>
          <button class="btn btn-purple btn-sm" id="ws-report">📊 التقرير</button>
          <button class="btn btn-rose btn-sm" id="ws-reset" title="إعادة تعيين كل الجلسة">↺ تصفير</button>
          <button class="btn btn-indigo btn-sm" id="ws-pdf">📄 PDF الموضوع</button>
        </div>
      </header>

      <div class="progress mb-2" id="progress"><span></span></div>

      <div class="grid" style="grid-template-columns:minmax(230px,18rem) 1fr;align-items:start">
        <aside class="card stack">
          <span class="small bold text-muted">تمارين الموضوع المختار:</span>
          <div class="stack">${s.exercises.map(e => `
            <button class="btn btn-ghost" data-switch="${e.number}" style="justify-content:space-between">
              <span>ت${e.number}: ${e.label} (${e.max}ن)</span><span id="lock-${e.number}">🔒</span>
            </button>`).join("")}</div>

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
          <div class="feedback mid small" style="background:rgba(16,185,129,.08)">⚠️ القاعدة: ركّز على كل قطب لحاله، وفُعلت باقي التمارين بعد إجابتك.</div>
        </aside>

        <section class="card" id="ex-content"></section>
      </div>
    </div>`;

  // liens
  $("#ws-home").addEventListener("click", returnToHub);
  $("#ws-panic").addEventListener("click", showPanic);
  if ($("#ws-adkar")) $("#ws-adkar").addEventListener("click", openAdkarModal);
  if ($("#ws-atlas")) $("#ws-atlas").addEventListener("click", () => openAtlas());
  $("#ws-onb").addEventListener("click", () => { renderOnboarding(); showScreen("view-onboarding"); });
  $("#ws-pdf").addEventListener("click", openPdfDrawer);
  $("#ws-report").addEventListener("click", showReport);
  $("#ws-reset").addEventListener("click", confirmReset);
  $$("#view-workspace [data-switch]").forEach(b => b.addEventListener("click", () => attemptSwitch(+b.dataset.switch)));
  $$("[data-sound-toggle]").forEach(b => b.addEventListener("click", () => toggleSound()));
  updateSoundButtons();

  renderStepnav(ex);
  renderExercise(ex);
  goToStep(store.state.activeStep || 1);
  updateLiveScore();
}

function renderStepnav(ex) {
  $("#stepnav").innerHTML = POLE_ORDER.map((p, i) => `
    <button data-step="${i + 1}">
      <span class="pole">${p}</span>
      <span>${short(ex.poles[p].prompt)} (${fmtPts(ex.poles[p].points)})</span>
    </button>`).join("");
  $$("#stepnav [data-step]").forEach(b => b.addEventListener("click", () => goToStep(+b.dataset.step)));
}

function renderExercise(ex) {
  const body = $("#ex-content");
  if (ex.ui === "pipeline") { body.innerHTML = pipelineHTML(ex); bindPipeline(ex); }
  else { body.innerHTML = textHTML(ex); bindText(ex); }
}

function meta(p, index) {
  return { panelId: `panel-${index + 1}`, color: POLE[p].cls, cnt: `step-${index + 1}` };
}

function textHTML(ex) {
  return POLE_ORDER.map((p, i) => {
    const pole = ex.poles[p];
    const m = meta(p, i);
    return `
      <div id="${m.panelId}" class="${i === 0 ? "" : "hidden"}">
        <div class="card">
          <div class="flex spread mb-1" style="align-items:center">
            <span class="badge badge-${m.color}">${POLE[p].title} (${fmtPts(pole.points)})</span>
            <button type="button" class="btn-mic" data-mic-target="fld-${p}" title="إملاء صوتي باللغة العربية">
              <span>🎙️</span> <span class="mic-label">إملاء صوتي</span>
            </button>
          </div>
          <h3 class="mt-0">${pole.prompt}</h3>
          ${pole.minLength >= 100 ? `<textarea class="field" id="fld-${p}" rows="6" placeholder="${pole.placeholder}" aria-label="${pole.prompt}"></textarea>`
                                  : `<input class="field" id="fld-${p}" type="text" placeholder="${pole.placeholder}" aria-label="${pole.prompt}">`}
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
  $$("#ex-content [data-check]").forEach(b => b.addEventListener("click", () => checkText(ex.number, b.dataset.check)));
  $$("#ex-content [data-goto]").forEach(b => b.addEventListener("click", () => goToStep(+b.dataset.goto + 1)));
  bindMicButtons();
  // restaure le texte déjà saisi pour cet exercice (persistance)
  const st = store.exercise(store.state.sujetId, ex.number);
  POLE_ORDER.forEach(p => {
    const input = $("#fld-" + p);
    if (input && st.text[p]) input.value = st.text[p];
  });
}

/* ---------- Évaluation texte ---------- */
function checkText(exNum, p) {
  const ex = exDef(exNum);
  const pole = ex.poles[p];
  const input = $("#fld-" + p);
  const text = input ? input.value : "";
  const res = evaluateText(text, pole.rule, p);

  const st = store.exercise(store.state.sujetId, exNum);
  st.text[p] = text;
  st.scores[p] = scoreFromFraction(pole.points, res.fraction);
  if (!st.answeredAny && text.trim()) st.answeredAny = true;
  store.save();

  updateLiveScore();
  const fb = $("#fb-" + p);
  fb.classList.remove("hidden");
  const grade = res.fraction >= 0.75 ? "good" : res.fraction >= 0.45 ? "mid" : "bad";
  fb.className = `feedback ${grade} mt-2`;
  let html = `النتيجة: <b>${st.scores[p].toFixed(2)} / ${fmtPts(pole.points)}</b> (${Math.round(res.fraction * 100)}%)`;
  
  if (res.isKeywordDump) {
    html += `<br><span class="text-rose">⛔ تنبيه منهجي: تم إدخال كلمات مفتاحية معزولة دون صياغة جملة علمية مفيدة (تتضمن أفعالاً وروابط منطقية). في البكالوريا، سرد المصطلحات دون صياغة جملة كاملة يُمنح عليه 0.</span>`;
  } else {
    if (res.matched && res.matched.length) {
      html += `<br><span class="text-emerald">✓ مفاهيم محققة:</span> <b>${res.matched.join("، ")}</b>`;
    }
    if (res.missing && res.missing.length) {
      html += `<br><span class="text-amber">🔎 مفاهيم مفتاحية ناقصة:</span> <b>${res.missing.join("، ")}</b>`;
    }
    if (res.forbiddenFound && res.forbiddenFound.length) {
      html += `<br><span class="text-rose">⛔ تنبيه منهجي: تم استخدام مصطلحات غير ملائمة لهذه الخطوة (${res.forbiddenFound.join("، ")}) — خُفّضت العلامة.</span>`;
    }
    if (res.empty) {
      html = `لم تُدخل أي إجابة بعد. اكتب تحليلك أو صياغتك أولاً.`;
    } else if (res.length < res.minLen && res.hits > 0) {
      html += `<br><small class="text-muted">💡 الصياغة موجزة نسبياً مقارنة بالمطلوب (${res.length}/${res.minLen} حرف).</small>`;
    }
  }

  if (pole.modelAnswer) {
    html += `
      <details class="model-box">
        <summary class="model-summary">📖 الإجابة النموذجية الرسمية الوزارية (انقر للمقارنة)</summary>
        <div class="model-body">
          <div class="model-text">${escapeHTML(pole.modelAnswer)}</div>
        </div>
      </details>`;
  }

  fb.innerHTML = html;

  if (!res.empty && res.fraction > 0) goToSuccessStep(exNum);
}

function goToSuccessStep(exNum) {
  const idx = POLE_ORDER.indexOf(activePole);
  if (idx < 3) goToStep(idx + 2);
}

/* ---------- Speech Recognition Engine (Dictée vocale robuste) ---------- */
const LANG_FALLBACKS = ["ar-DZ", "ar-SA", "ar-EG", "ar"];

export const voiceEngine = {
  recognition: null,
  activeTargetId: null,
  activeBtn: null,
  isUserRecording: false,
  baseTextBeforeSession: "",
  sessionTranscribedChunks: [],
  langIndex: 0,
  restartTimer: null,

  isSupported() {
    return typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  },

  start(targetId, btn) {
    if (!this.isSupported()) {
      toast("خاصية الإملاء الصوتي غير مدعومة في متصفحك الحالي. يُفضل استخدام متصفح Google Chrome أو Safari.", "warn");
      return;
    }

    // Arrête toute session précédente
    this.stop(false);

    const field = document.getElementById(targetId);
    if (!field) return;

    this.activeTargetId = targetId;
    this.activeBtn = btn;
    this.isUserRecording = true;
    this.baseTextBeforeSession = field.value || "";
    this.sessionTranscribedChunks = [];
    this.langIndex = 0;

    this._spawnRecognition();
    toast("🎙️ الميكروفون نشط: تحدث بوضوح ليتم تحويل إجابتك إلى نص.", "info", 2500);
  },

  _spawnRecognition() {
    if (!this.isUserRecording) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      if (this.recognition) {
        try { this.recognition.abort(); } catch (e) {}
        this.recognition = null;
      }

      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = LANG_FALLBACKS[this.langIndex] || "ar-DZ";

      rec.onstart = () => {
        this._updateUIState(true);
      };

      rec.onresult = (event) => {
        let finalBatch = "";
        let interimBatch = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalBatch += res[0].transcript + " ";
          } else {
            interimBatch += res[0].transcript;
          }
        }

        if (finalBatch.trim()) {
          this.sessionTranscribedChunks.push(finalBatch.trim());
        }

        const field = document.getElementById(this.activeTargetId);
        if (field) {
          const joinedSpoken = this.sessionTranscribedChunks.join(" ");
          const combined = (this.baseTextBeforeSession ? this.baseTextBeforeSession.trim() + " " : "") +
                           (joinedSpoken ? joinedSpoken.trim() + " " : "") +
                           (interimBatch ? interimBatch.trim() : "");
          field.value = combined.trim();
          field.dispatchEvent(new Event("input", { bubbles: true }));
        }
      };

      rec.onerror = (event) => {
        const err = event.error;
        if (err === "language-not-supported" && this.langIndex < LANG_FALLBACKS.length - 1) {
          this.langIndex++;
          this._scheduleRestart(100);
          return;
        }

        if (err === "not-allowed" || err === "service-not-allowed") {
          toast("يرجى السماح بصلاحية الميكروفون في المتصفح لاستخدام الإملاء الصوتي.", "error");
          this.stop(false);
          return;
        }

        if (err === "network") {
          toast("تعذر الاتصال بخدمة التعرف على الصوت. تحقق من اتصال الإنترنت.", "warn");
          this.stop(false);
          return;
        }

        // no-speech ou interruption temporaire : relance en douceur si l'enregistrement reste actif
        if (err === "no-speech" && this.isUserRecording) {
          this._scheduleRestart(300);
        }
      };

      rec.onend = () => {
        // Keep-alive sur mobile : si l'utilisateur n'a pas cliqué sur Stop, on redémarre
        if (this.isUserRecording) {
          const field = document.getElementById(this.activeTargetId);
          if (field) {
            this.baseTextBeforeSession = field.value || "";
            this.sessionTranscribedChunks = [];
          }
          this._scheduleRestart(250);
        } else {
          this._updateUIState(false);
        }
      };

      this.recognition = rec;
      rec.start();
    } catch (e) {
      if (this.isUserRecording) {
        this._scheduleRestart(500);
      }
    }
  },

  _scheduleRestart(delayMs = 250) {
    if (this.restartTimer) clearTimeout(this.restartTimer);
    if (!this.isUserRecording) return;
    this.restartTimer = setTimeout(() => {
      if (this.isUserRecording) this._spawnRecognition();
    }, delayMs);
  },

  stop(notifyUser = true) {
    this.isUserRecording = false;
    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
      this.restartTimer = null;
    }
    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) {}
      this.recognition = null;
    }
    this._updateUIState(false);
    if (notifyUser && this.activeBtn) {
      toast("تم حفظ النص وإيقاف التسجيل الصوتي.", "info", 1800);
    }
    this.activeTargetId = null;
    this.activeBtn = null;
  },

  toggle(targetId, btn) {
    if (this.isUserRecording && this.activeTargetId === targetId) {
      this.stop(true);
    } else {
      this.start(targetId, btn);
    }
  },

  _updateUIState(isRecording) {
    if (this.activeBtn) {
      this.activeBtn.classList.toggle("listening", isRecording);
      const label = this.activeBtn.querySelector(".mic-label");
      if (label) {
        label.textContent = isRecording ? "🔴 جاري الاستماع... (انقر للإيقاف)" : "إملاء صوتي";
      }
    }
    if (this.activeTargetId) {
      const field = document.getElementById(this.activeTargetId);
      if (field) field.classList.toggle("dictating", isRecording);
    }
  }
};

function stopVoiceDictation() {
  voiceEngine.stop(false);
}

function bindMicButtons(root = document) {
  $$("[data-mic-target]", root).forEach(btn => {
    btn.addEventListener("click", () => {
      voiceEngine.toggle(btn.dataset.micTarget, btn);
    });
  });
}

/* ---------- Pipeline (exercice 3) ---------- */
function pipelineHTML(ex) {
  return `
    <div id="panel-1" class="card">
      <div class="flex spread mb-1" style="align-items:center">
        <span class="badge badge-emerald">${POLE.N.title} (${fmtPts(ex.poles.N.points)})</span>
        <button type="button" class="btn-mic" data-mic-target="pipeline-var-indep" title="إملاء صوتي للمتغيرات">
          <span>🎙️</span> <span class="mic-label">إملاء صوتي</span>
        </button>
      </div>
      <h3 class="mt-0">${ex.poles.N.prompt}</h3>
      <div class="grid grid-2">
        <input class="field" id="pipeline-var-indep" type="text" placeholder="المتغير المستقل: تركيز الأدينوزين / الكافيين..." aria-label="المتغير المستقل">
        <input class="field" id="pipeline-var-dep" type="text" placeholder="المتغير التابع: النشاط العصبي الدماغي وشدة الارتباط بـ A1R..." aria-label="المتغير التابع">
      </div>
      <div class="feedback hidden" id="fb-N"></div>
      <button class="btn btn-emerald mt-2" data-polo-check="N">تأكيد القطب N (فكّ القفل)</button>
    </div>

    <div id="panel-2" class="card hidden">
      <div class="flex spread mb-1" style="align-items:center">
        <span class="badge badge-indigo">${POLE.S.title} (${fmtPts(ex.poles.S.points)})</span>
        <button type="button" class="btn-mic" data-mic-target="pipeline-doc1a" title="إملاء صوتي لمصفوفة السندات">
          <span>🎙️</span> <span class="mic-label">إملاء صوتي</span>
        </button>
      </div>
      <h3 class="mt-0">${ex.poles.S.prompt}</h3>
      <div class="card" style="background:var(--bg)">
        <label class="lbl">1. الشكل (أ): التحليل المقارن بالتوازي</label>
        <textarea class="field" rows="2" id="pipeline-doc1a" aria-label="التحليل المقارن بالشكل أ"></textarea>
        <label class="lbl">الاستنتاج الخاص بالشكل (أ):</label>
        <input class="field" id="pipeline-doc1a-ded" type="text" aria-label="استنتاج الشكل أ">
        <label class="lbl mt-2">2. الشكل (ب): شدة الارتباط</label>
        <input class="field" id="pipeline-doc1b" type="text" aria-label="تحليل الشكل ب">
        <input class="field mt-1" id="pipeline-doc1b-ded" type="text" placeholder="الاستنتاج الخاص بالشكل (ب):" aria-label="استنتاج الشكل ب">
      </div>
      <div class="feedback hidden" id="fb-S"></div>
      <button class="btn btn-emerald mt-2" data-polo-check="S">فحص مصفوفة السندات</button>
    </div>

    <div id="panel-3" class="card hidden">
      <div class="flex spread mb-1" style="align-items:center">
        <span class="badge badge-amber">${POLE.E.title} (${fmtPts(ex.poles.E.points)})</span>
        <button type="button" class="btn-mic" data-mic-target="pipeline-doc2" title="إملاء صوتي للاستدلال">
          <span>🎙️</span> <span class="mic-label">إملاء صوتي</span>
        </button>
      </div>
      <h3 class="mt-0">${ex.poles.E.prompt}</h3>
      <div class="grid grid-2">
        <input class="field" id="pipeline-hyp1" type="text" placeholder="الفرضية 1: يرتبط الكافيين بمستقبل الأدينوزين A1R" aria-label="الفرضية 1">
        <input class="field" id="pipeline-hyp2" type="text" placeholder="الفرضية 2: يرتبط الكافيين بالأدينوزين نفسه" aria-label="الفرضية 2">
      </div>
      <label class="lbl mt-2">استدلال الوثيقة 2 (تتبّع السلسلة الجزيئية كشريط فيديو):</label>
      <textarea class="field" rows="4" id="pipeline-doc2" aria-label="استدلال الوثيقة 2"></textarea>
      <div class="feedback hidden" id="fb-E"></div>
      <button class="btn btn-emerald mt-2" data-polo-check="E">تأكيد القطب E</button>
    </div>

    <div id="panel-4" class="card hidden">
      <span class="badge badge-purple" style="margin-bottom:.6rem">${POLE.W.title} (${fmtPts(ex.poles.W.points)})</span>
      <h3 class="mt-0">${ex.poles.W.prompt}</h3>

      <span class="lbl">📦 بنك العناصر البيوكيميائية:</span>
      <div class="bank" id="blocks-bank"></div>

      <div class="grid grid-2 mt-2">
        ${ex.streams.map(str => `
          <div class="card" style="background:var(--bg);border-color:${str.theme === 'rose' ? 'var(--rose)' : 'var(--emerald)'}">
            <strong style="color:${str.theme === 'rose' ? '#fb7185' : 'var(--emerald-soft)'}">${str.title}</strong>
            <div class="pipeline mt-1" data-stream="${str.id}">
              ${str.slots.map((sl, i) => `<div class="slot" data-slot="${i}">${i + 1}. ${sl}</div>`).join("")}
            </div>
          </div>`).join("")}
      </div>

      <div class="feedback hidden mt-2" id="fb-W"></div>
      <button class="btn btn-emerald mt-2" data-polo-check="W">مصادقة المخطط التحصيلي</button>
    </div>`;
}

function bindPipeline(ex) {
  // check per pole
  $$("#ex-content [data-polo-check]").forEach(b => b.addEventListener("click", () => checkPipelinePole(ex.number, b.dataset.poloCheck)));
  // mic buttons
  bindMicButtons();
  // bank chips
  const bank = $("#blocks-bank");
  bank.innerHTML = "";
  ex.blocksBank.forEach(blk => {
    const chip = el(`<button class="chip" data-block="${blk.id}">${blk.text}</button>`);
    bank.appendChild(chip);
  });
  $$("#blocks-bank [data-block]").forEach(c => c.addEventListener("click", () => placeBlock(ex, c.dataset.block)));

  // slots : clic = retirer l'élément (le flux est lu sur le conteneur parent)
  $$("#ex-content .slot").forEach(sl => sl.addEventListener("click", () => {
    const stream = +sl.closest("[data-stream]").dataset.stream;
    clearBlock(ex, stream, +sl.dataset.slot);
  }));
  // restaure l'agencement et les zones de texte (persistance)
  const st = store.exercise(store.state.sujetId, ex.number);
  renderPipeline(ex, st.pipeline);
  Object.entries(st.fields || {}).forEach(([id, val]) => {
    const f = $("#" + id);
    if (f) f.value = val;
  });
}

function placeBlock(ex, blockId) {
  const st = store.exercise(store.state.sujetId, ex.number);
  for (const key of ["stream1", "stream2"]) {
    const arr = st.pipeline[key];
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i]) { arr[i] = blockId; renderPipeline(ex, st.pipeline); store.save(); return; }
    }
  }
}

function clearBlock(ex, stream, index) {
  const st = store.exercise(store.state.sujetId, ex.number);
  const key = stream === 1 ? "stream1" : "stream2";
  if (st.pipeline[key][index]) { st.pipeline[key][index] = null; renderPipeline(ex, st.pipeline); store.save(); }
}

function renderPipeline(ex, arrangement) {
  $$("#blocks-bank [data-block]").forEach(c => {
    const used = Object.values(arrangement).flat().includes(c.dataset.block);
    c.classList.toggle("used", used);
  });
  for (const str of ex.streams) {
    const container = $(`[data-stream="${str.id}"]`);
    const key = str.id === 1 ? "stream1" : "stream2";
    const arr = arrangement[key];
    if (!container || !arr) continue;
    $$(`[data-stream="${str.id}"] .slot`).forEach((slotEl, i) => {
      const id = arr[i];
      if (id) {
        const blk = ex.blocksBank.find(b => b.id === id);
        slotEl.classList.add("filled");
        slotEl.innerHTML = `<span>${blk.text}</span><span>🗑️</span>`;
      } else {
        slotEl.classList.remove("filled");
        slotEl.innerHTML = `${i + 1}. ${str.slots[i]}`;
      }
    });
  }
}

function checkPipelinePole(exNum, p) {
  const ex = exDef(exNum);
  const st = store.exercise(store.state.sujetId, exNum);
  const fb = $("#fb-" + p);
  fb.classList.remove("hidden");

  if (p === "N" || p === "S" || p === "E") {
    // persiste toutes les zones de saisie du pôle courant
    const FIELDS = {
      N: ["pipeline-var-indep", "pipeline-var-dep"],
      S: ["pipeline-doc1a", "pipeline-doc1a-ded", "pipeline-doc1b", "pipeline-doc1b-ded"],
      E: ["pipeline-hyp1", "pipeline-hyp2", "pipeline-doc2"]
    };
    const ids = FIELDS[p] || [];
    let joined = "";
    ids.forEach(id => {
      const f = $("#" + id);
      if (f) { st.fields[id] = f.value; joined += f.value + " "; }
    });
    const text = joined.trim();
    const res = evaluateText(text, ex.poles[p].rule || { minLength: ex.poles[p].minLength || 40 }, p);
    const score = scoreFromFraction(ex.poles[p].points, res.fraction);
    st.scores[p] = score;
    if (!st.answeredAny && text) st.answeredAny = true;

    const grade = res.fraction >= 0.75 ? "good" : res.fraction >= 0.45 ? "mid" : "bad";
    fb.className = `feedback ${grade} mt-2`;
    let html = `نقاط القطب ${p}: <b>${score.toFixed(2)} / ${fmtPts(ex.poles[p].points)}</b> (${Math.round(res.fraction * 100)}%)`;
    if (res.isKeywordDump) {
      html += `<br><span class="text-rose">⛔ تنبيه منهجي: تم إدخال كلمات مبعثرة دون صياغة جملة تفسيرية مترابطة.</span>`;
    } else {
      if (res.matched && res.matched.length) html += `<br><span class="text-emerald">✓ عناصر محققة:</span> <b>${res.matched.join("، ")}</b>`;
      if (res.missing && res.missing.length) html += `<br><span class="text-amber">🔎 عناصر ناقصة:</span> <b>${res.missing.join("، ")}</b>`;
      if (res.forbiddenFound && res.forbiddenFound.length) html += `<br><span class="text-rose">⛔ تنبيه منهجي: تجنب (${res.forbiddenFound.join("، ")}).</span>`;
      if (res.empty) html = `لم تُدخل أي إجابة بعد في حقول القطب ${p}.`;
    }

    if (ex.poles[p].modelAnswer) {
      html += `
        <details class="model-box">
          <summary class="model-summary">📖 الإجابة النموذجية الرسمية للقطب ${p} (انقر للمقارنة)</summary>
          <div class="model-body">
            <div class="model-text">${escapeHTML(ex.poles[p].modelAnswer)}</div>
          </div>
        </details>`;
    }

    fb.innerHTML = html;
  } else {
    // pôle W : évaluation du pipeline (arrangement)
    const res = evaluatePipeline(ex.blocksBank, st.pipeline);
    const max = fmtPts(ex.poles[p].points);
    st.scores[p] = Math.round(res.fraction * ex.poles[p].points * 100) / 100;
    if (!st.answeredAny) st.answeredAny = true;
    fb.className = `feedback ${res.fraction >= 0.75 ? "good" : res.fraction >= 0.4 ? "mid" : "bad"} mt-2`;
    let html = `المخطط: <b>${st.scores[p].toFixed(2)} / ${max}</b> (${res.correct}/${res.total} عنصر صحيح)` +
      (res.wrongSlots.length ? `<br>⚠️ عناصر في غير موضعها: ${res.wrongSlots.length}` : "");
    if (ex.poles[p].modelAnswer) {
      html += `
        <details class="model-box">
          <summary class="model-summary">📖 المخطط التركيبي النموذجي</summary>
          <div class="model-body">
            <div class="model-text">${escapeHTML(ex.poles[p].modelAnswer)}</div>
          </div>
        </details>`;
    }
    fb.innerHTML = html;
  }
  store.save();
  updateLiveScore();
}

/* ---------- Boussole / navigation ---------- */
let activePole = "N";
function goToStep(n) {
  stopVoiceDictation();
  const ex = exDef(store.state.activeExercise);
  activePole = POLE_ORDER[n - 1] || "N";
  store.setActiveStep(n);

  $$("#ex-content [id^='panel-']").forEach((panel, i) => panel.classList.toggle("hidden", i !== n - 1));
  const prog = $("#progress span");
  if (prog) prog.style.width = `${(n / 4) * 100}%`;
  const needle = $("#compass-needle");
  if (needle) needle.style.transform = `rotate(${n === 1 ? 0 : n === 2 ? 180 : n === 3 ? 90 : 270}deg)`;
  const poleText = $("#pole-text");
  if (poleText) poleText.textContent = `القطب: ${POLE[activePole].title.replace("القطب ", "")}`;
  $$("#stepnav [data-step]").forEach((b, i) => b.classList.toggle("active", i === n - 1));
  return { ex, pole: activePole };
}

function updateLiveScore() {
  const ex = exDef(store.state.activeExercise);
  const st = store.exercise(store.state.sujetId, ex.number);
  const sum = st.scores.N + st.scores.S + st.scores.E + st.scores.W;
  const liveScore = $("#live-score");
  const liveMax = $("#live-max");
  if (liveScore) liveScore.textContent = sum.toFixed(2);
  if (liveMax) liveMax.textContent = `/ ${ex.max.toFixed(2)}`;
  // verrous
  sujetObj().exercises.forEach(e => {
    const lock = $("#lock-" + e.number);
    if (lock) lock.textContent = store.exercise(store.state.sujetId, e.number).answeredAny ? "🔓" : "🔒";
  });
}

function attemptSwitch(target) {
  const cur = store.state.activeExercise;
  if (target === cur) return;
  if (!store.exercise(store.state.sujetId, cur).answeredAny) {
    toast(`يجب الإجابة على سؤال واحد على الأقل في التمرين ${cur} لفكّ القفل قبل الانتقال لتمرين آخر!`, "warn");
    return;
  }
  store.setActiveExercise(target);
  renderWorkspace();
  showScreen("view-workspace");
}

/* ---------- Rapport & export des résultats ---------- */
function computeReport() {
  const y = yearObj(store.state.yearId);
  const s = sujetObj();
  const rows = s.exercises.map(e => {
    const st = store.exercise(store.state.sujetId, e.number);
    const tot = st.scores.N + st.scores.S + st.scores.E + st.scores.W;
    return {
      exercise: `ت${e.number}`,
      label: e.label,
      max: e.max,
      N: st.scores.N, S: st.scores.S, E: st.scores.E, W: st.scores.W,
      total: Math.round(tot * 100) / 100,
      filled: st.answeredAny
    };
  });
  const grand = rows.reduce((a, r) => a + r.total, 0);
  const grandMax = rows.reduce((a, r) => a + r.max, 0);
  return {
    title: APP_CONFIG.appTitle,
    year: y.id, sujet: s.id, sujetTitle: s.title,
    generatedAt: new Date().toISOString(),
    globalRemaining: store.state.globalRemaining,
    rows,
    grand: Math.round(grand * 100) / 100,
    grandMax,
    percent: grandMax ? Math.round((grand / grandMax) * 100) : 0
  };
}

function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showReport() {
  const rep = computeReport();
  const body = `
    <div class="card" style="background:var(--bg)">
      <div class="flex spread"><strong>النتيجة الإجمالية</strong>
        <span class="mono text-emerald" style="font-size:1.4rem">${rep.grand.toFixed(2)} / ${rep.grandMax.toFixed(2)}</span></div>
      <div class="progress mt-1"><span style="width:${rep.percent}%"></span></div>
      <p class="small text-muted mt-1">النسبة المئوية المحققة: <b>${rep.percent}%</b></p>
    </div>
    <div class="stack mt-2">
      ${rep.rows.map(r => `
        <div class="flex spread" style="border-bottom:1px solid var(--line);padding-bottom:.4rem">
          <span class="bold">${r.exercise}: ${r.label} ${r.filled ? "" : "(غير مكتمل)"}</span>
          <span class="mono ${r.total >= r.max * 0.7 ? "text-emerald" : "text-amber"}">${r.total.toFixed(2)} / ${r.max.toFixed(2)}</span>
        </div>`).join("")}
    </div>
    <div class="flex mt-2" style="flex-wrap:wrap;gap:.5rem">
      <button class="btn btn-indigo btn-sm" id="btn-print-exam">🖨️ طباعة ورقة الإجابة (PDF)</button>
      <button class="btn btn-emerald btn-sm" id="dl-csv">⬇️ تنزيل CSV</button>
      <button class="btn btn-ghost btn-sm" id="dl-json">⬇️ تنزيل JSON</button>
    </div>`;
  openModal(`📊 تقرير النتائج — ${rep.rows.length} تمارين`, body);
  $("#btn-print-exam").addEventListener("click", () => printOfficialExamPaper(rep));
  $("#dl-csv").addEventListener("click", () => download(`boussole4d_${rep.year}_sujet${rep.sujet}.csv`, toCSV(rep)));
  $("#dl-json").addEventListener("click", () => download(`boussole4d_${rep.year}_sujet${rep.sujet}.json`, JSON.stringify(rep, null, 2)));
}

function printOfficialExamPaper(rep) {
  const y = yearObj(rep.year) || APP_CONFIG.years[0];
  const s = y.sujets.find(item => item.id === rep.sujet) || y.sujets[0];

  let exercisesHtml = "";
  s.exercises.forEach(e => {
    const st = store.exercise(s.id, e.number);
    const exTotal = st.scores.N + st.scores.S + st.scores.E + st.scores.W;

    let polesHtml = "";
    POLE_ORDER.forEach(p => {
      const poleDef = e.poles[p];
      const userScore = (st.scores[p] || 0).toFixed(2);
      const maxScore = (+poleDef.points).toFixed(2);

      let userText = "";
      if (e.ui === "pipeline") {
        if (p === "W") {
          userText = `ترتيب مسار المخطط التحصيلي: (${st.scores.W.toFixed(2)} / ${maxScore}ن)`;
        } else {
          const FIELDS = {
            N: ["pipeline-var-indep", "pipeline-var-dep"],
            S: ["pipeline-doc1a", "pipeline-doc1a-ded", "pipeline-doc1b", "pipeline-doc1b-ded"],
            E: ["pipeline-hyp1", "pipeline-hyp2", "pipeline-doc2"]
          };
          userText = (FIELDS[p] || []).map(id => st.fields[id] || "").filter(Boolean).join(" | ") || "لم تتم الإجابة";
        }
      } else {
        userText = st.text[p] || "لم تتم الإجابة";
      }

      polesHtml += `
        <div class="pole-card">
          <div class="pole-head">
            <span>${POLE[p].title}: ${escapeHTML(poleDef.prompt)}</span>
            <span class="score-pill">${userScore} / ${maxScore}ن</span>
          </div>
          <div class="student-label">إجابة المترشح:</div>
          <div class="student-ans">${escapeHTML(userText)}</div>
          <div class="model-ans"><strong>الإجابة النموذجية الوزارية:</strong><br>${escapeHTML(poleDef.modelAnswer || 'الإجابة متوفرة في دليل التصحيح')}</div>
        </div>
      `;
    });

    exercisesHtml += `
      <div class="exercise-box">
        <div class="exercise-title">
          <span>التمرين 0${e.number}: ${escapeHTML(e.label)} (${e.max} نقاط)</span>
          <span>علامة التمرين: ${exTotal.toFixed(2)} / ${e.max.toFixed(2)}ن</span>
        </div>
        <p style="font-size:0.88em;color:#555;margin:6px 0 14px 0">${escapeHTML(e.desc)}</p>
        ${polesHtml}
      </div>
    `;
  });

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    toast("يرجى السماح بالنوافذ المنبثقة (Popups) لمعاينة وطباعة ورقة الامتحان.", "warn");
    return;
  }

  const printDoc = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>ورقة إجابة بكالوريا الجزائر — ${s.title} (${y.id})</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, 'Noto Kufi Arabic', Arial, sans-serif;
          line-height: 1.6;
          color: #111;
          background: #fff;
          margin: 0;
          padding: 24px;
          direction: rtl;
        }
        .header {
          text-align: center;
          border-bottom: 3px double #000;
          padding-bottom: 12px;
          margin-bottom: 20px;
        }
        .header h2 { margin: 0 0 6px 0; font-size: 1.25rem; }
        .header h3 { margin: 0 0 6px 0; font-size: 1.05rem; color: #333; }
        .header p { margin: 0; font-size: 0.9rem; color: #555; }
        .meta-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 24px;
          font-size: 0.9rem;
        }
        .meta-item strong { display: block; color: #0f172a; margin-bottom: 2px; }
        .summary-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 25px;
          font-size: 0.9rem;
        }
        .summary-table th, .summary-table td {
          border: 1px solid #cbd5e1;
          padding: 8px 12px;
          text-align: center;
        }
        .summary-table th {
          background: #f1f5f9;
          font-weight: bold;
        }
        .exercise-box {
          border: 1px solid #94a3b8;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
          page-break-inside: avoid;
        }
        .exercise-title {
          background: #f1f5f9;
          padding: 8px 12px;
          font-weight: 800;
          border-radius: 6px;
          display: flex;
          justify-content: space-between;
          border-bottom: 2px solid #cbd5e1;
          margin-bottom: 10px;
        }
        .pole-card {
          border-right: 3px solid #10b981;
          padding-right: 12px;
          margin-bottom: 16px;
        }
        .pole-head {
          font-weight: 700;
          color: #047857;
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .student-label {
          font-size: 0.8rem;
          font-weight: bold;
          color: #475569;
          margin-top: 4px;
        }
        .student-ans {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.88rem;
          white-space: pre-wrap;
          margin: 4px 0 8px 0;
        }
        .model-ans {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #064e3b;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.86rem;
          line-height: 1.6;
          white-space: pre-wrap;
        }
        .score-pill {
          background: #0f172a;
          color: #fff;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-family: monospace;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 0.8rem;
          color: #64748b;
          border-top: 1px solid #cbd5e1;
          padding-top: 12px;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom:20px;text-align:center">
        <button onclick="window.print()" style="background:#10b981;color:#fff;border:0;padding:10px 24px;border-radius:8px;font-size:1rem;font-weight:bold;cursor:pointer">🖨️ اضغط هنا لطباعة الورقة أو حفظها كـ PDF</button>
      </div>

      <div class="header">
        <h2>الجمهورية الجزائرية الديمقراطية الشعبية</h2>
        <h3>وزارة التربية الوطنية — امتحان بكالوريا التعليم الثانوي</h3>
        <p>الشعبة: علوم تجريبية | المادة: علوم الطبيعة والحياة | تقرير الإنجاز بنظام الأقطاب 4D</p>
      </div>

      <div class="meta-grid">
        <div class="meta-item"><strong>الدورة:</strong> بكالوريا ${y.id}</div>
        <div class="meta-item"><strong>الموضوع:</strong> ${s.title}</div>
        <div class="meta-item"><strong>العلامة الإجمالية:</strong> <span style="color:#047857;font-size:1.1em">${rep.grand.toFixed(2)} / ${rep.grandMax.toFixed(2)}</span> (${rep.percent}%)</div>
        <div class="meta-item"><strong>تاريخ الإنجاز:</strong> ${new Date(rep.generatedAt).toLocaleDateString("ar-DZ")}</div>
      </div>

      <table class="summary-table">
        <thead>
          <tr>
            <th>التمرين</th>
            <th>موضوع التمرين</th>
            <th>N (التأطير)</th>
            <th>S (السندات)</th>
            <th>E (الاستدلال)</th>
            <th>W (التركيب)</th>
            <th>مجموع التمرين</th>
          </tr>
        </thead>
        <tbody>
          ${rep.rows.map(r => `
            <tr>
              <td><strong>${r.exercise}</strong></td>
              <td>${escapeHTML(r.label)}</td>
              <td>${r.N.toFixed(2)}</td>
              <td>${r.S.toFixed(2)}</td>
              <td>${r.E.toFixed(2)}</td>
              <td>${r.W.toFixed(2)}</td>
              <td><strong>${r.total.toFixed(2)} / ${r.max.toFixed(2)}</strong></td>
            </tr>`).join("")}
          <tr style="background:#f8fafc;font-weight:bold">
            <td colspan="2">المجموع العام للبكالوريا</td>
            <td colspan="4"></td>
            <td style="color:#047857;font-size:1.1em">${rep.grand.toFixed(2)} / ${rep.grandMax.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <h3>تفاصيل إجابات المترشح ومقارنتها بالإجابة النموذجية الرسمية:</h3>
      ${exercisesHtml}

      <div class="footer">
        تم استخراج هذا التقرير عبر منصة بوصلة كنز المنهجية 4D لبكالوريا الجزائر.
      </div>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(printDoc);
  printWindow.document.close();
}

function toCSV(rep) {
  const head = ["التمرين", "المسمى", "العلامة القصوى", "N", "S", "E", "W", "المجموع"];
  const lines = [head.join(",")];
  rep.rows.forEach(r => {
    lines.push([`ت${r.exercise.replace(/ت/, "")}`, `"${r.label}"`, r.max, r.N, r.S, r.E, r.W, r.total].join(","));
  });
  lines.push([`الإجمالي`, "", rep.grandMax, "", "", "", "", rep.grand].join(","));
  return "\ufeff" + lines.join("\n"); // BOM pour Excel/arabe
}

function download(name, content, type = "text/plain") {
  const blob = new Blob([content], { type });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  doc().body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 100);
}
function doc() { return document; }

function confirmReset() {
  openModal(
    "↺ إعادة تعيين الجلسة",
    "سيتم مسح كل التقدم (النتائج والنصوص والاختيارات) لهذه الدورة والعودة للبداية. هل أنت متأكد؟",
    `<button class="btn btn-rose" id="reset-yes">نعم، امسح الكل وابدأ من جديد</button>`
  );
  const yes = $("#reset-yes");
  if (yes) yes.addEventListener("click", () => {
    store.reset();
    timers.stopAll();
    const bar = $("#global-timer-bar");
    if (bar) bar.classList.add("hidden");
    closeModal();
    toast("تمت إعادة التعيين بنجاح.", "success");
    returnToHub();
  });
}

/* ---------- Panic / Atlas / PDF drawer ---------- */
function showPanic() {
  const ex = exDef(store.state.activeExercise);
  const hints = {
    1: "لاحظ سياق التمرين: ما العامل الذي يغيّره المجرِّب (متغير مستقل) وما الظاهرة المقاسة (تابع)؟ صِغ المشكل بعلامة (؟) دون الإجابة هنا.",
    2: "ركّز على الأرقام في المنحنى أو الجدول، قارن بالتوازي ذاكراً القيم الابتدائية والنهائية، وتجنّب كلمة «بسبب» في هذه المرحلة.",
    3: "تخيّل الآلية كشريط فيديو: ارتباط الجزيء → تفعيل البروتينات الغشائية → حركة الشوارد → إفراز المبلغ. صِغ فرضيتك كحلٍّ سببي دون «ربما»."
  };
  openModal(`💡 تلميح فكّ القفل الذهني`, hints[ex.number] || hints[3]);
}

function openAdkarModal() {
  const body = `
    <div class="small text-muted mb-2">أدعية مأثورة من القرآن الكريم والسنة النبوية لبث السكينة والاطمئنان وتيسير الفهم واسترجاع المعلومات:</div>
    <div class="stack" style="max-height:65vh;overflow-y:auto;padding-inline-end:.3rem">
      ${ADKAR_DATA.map(a => `
        <div class="adkar-card mb-2">
          <div class="adkar-title">
            <span>${escapeHTML(a.title)}</span>
            <span class="badge badge-emerald">${escapeHTML(a.badge)}</span>
          </div>
          <div class="adkar-arabic">${escapeHTML(a.arabic)}</div>
          <div class="adkar-note">${escapeHTML(a.note)}</div>
        </div>
      `).join("")}
    </div>
  `;
  openModal("🤲 أدعية وأذكار التوفيق والسكينة في الامتحان", body);
}

let modal = null;
let modalEscHandler = null;

function openModal(title, body, customFooter = "") {
  closeModal();
  modal = el(`<div class="overlay" data-close="overlay">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-head">
        <strong class="text-amber" id="modal-title">${title}</strong>
        <button class="btn btn-ghost btn-sm" data-close="btn" aria-label="إغلاق النافذة">✕</button>
      </div>
      <div class="small mb-2">${body}</div>
      <div class="flex" style="justify-content:flex-end;gap:.5rem">
        ${customFooter ? customFooter : `<button class="btn btn-emerald" data-close="ok">متابعة الحل</button>`}
      </div>
    </div></div>`);
  document.body.appendChild(modal);
  $$(`[data-close]`, modal).forEach(b => b.addEventListener("click", closeModal));

  modalEscHandler = (e) => { if (e.key === "Escape") closeModal(); };
  document.addEventListener("keydown", modalEscHandler);
}

function closeModal() {
  if (modal) {
    modal.remove();
    modal = null;
  }
  if (modalEscHandler) {
    document.removeEventListener("keydown", modalEscHandler);
    modalEscHandler = null;
  }
}

/* ---------- Sound controller helper ---------- */
function toggleSound() {
  const mode = soundEngine.cycle();
  const toasts = {
    rain: "🌧️ تم تفعيل صوت المطر الهادئ للتركيز.",
    waves: "🌊 تم تفعيل صوت أمواج البحر المتناغمة مع التنفس.",
    binaural: "🧠 تم تفعيل تردد التركيز الذهني (40Hz Gamma).",
    off: "🔇 تم إيقاف الصوت الهادئ."
  };
  toast(toasts[mode] || "تم تحديث الصوت.", "info", 2200);
  updateSoundButtons();
}

function updateSoundButtons() {
  const labels = {
    off: "🎧 أصوات الهدوء",
    rain: "🌧️ مطر هادئ",
    waves: "🌊 أمواج البحر",
    binaural: "🧠 40Hz تركيز"
  };
  $$("[data-sound-toggle]").forEach(btn => {
    btn.innerHTML = `<span>${labels[soundEngine.currentMode] || "🎧 أصوات الهدوء"}</span>`;
    btn.classList.toggle("active", soundEngine.currentMode !== "off");
  });
}

/* ---------- Atlas 4D & Flashcards Engine ---------- */
let currentAtlasCategory = "techniques";
let currentAtlasSearch = "";

function openAtlas(initialCategory = "techniques") {
  currentAtlasCategory = initialCategory;
  currentAtlasSearch = "";

  const renderContent = () => {
    const query = normalizeArabic(currentAtlasSearch.trim());
    let html = `
      <div class="atlas-header">
        <input type="search" class="field mb-1" id="atlas-search-input" value="${escapeHTML(currentAtlasSearch)}" placeholder="🔍 بحث سريع في التقنيات، أفعال الأداء، الفرضيات...">
        <div class="atlas-tabs">
          ${(ATLAS_DATA.categories || []).map(c => `
            <button class="atlas-tab-btn ${c.id === currentAtlasCategory ? 'active' : ''}" data-cat="${c.id}">${c.label}</button>
          `).join("")}
        </div>
      </div>
      <div class="mt-2" id="atlas-items-container">
    `;

    if (currentAtlasCategory === "techniques") {
      const list = (ATLAS_DATA.techniques || []).filter(t => !query || normalizeArabic(t.title + " " + t.principle + " " + t.purpose + " " + t.trap).includes(query));
      if (!list.length) {
        html += `<p class="small text-muted center mt-2">لا توجد نتائج مطابقة لبحثك في التقنيات المخبرية.</p>`;
      } else {
        html += list.map(t => `
          <div class="atlas-card">
            <div class="flex spread" style="align-items:center">
              <strong class="text-${t.color}">${escapeHTML(t.title)}</strong>
              <span class="badge badge-${t.color}">${escapeHTML(t.badge)}</span>
            </div>
            <div class="small mt-1"><b>المبدأ العلمي:</b> ${escapeHTML(t.principle)}</div>
            <div class="small mt-1 text-muted"><b>الهدف البيولوجي:</b> ${escapeHTML(t.purpose)}</div>
            <div class="atlas-trap"><b>⚠️ الفخ المنهجي:</b> ${escapeHTML(t.trap)}</div>
          </div>
        `).join("");
      }
    } else if (currentAtlasCategory === "verbs") {
      const list = (ATLAS_DATA.verbs || []).filter(v => !query || normalizeArabic(v.verb + " " + v.definition + " " + v.goldenRule + " " + v.example).includes(query));
      if (!list.length) {
        html += `<p class="small text-muted center mt-2">لا توجد نتائج مطابقة لبحثك في أفعال الأداء.</p>`;
      } else {
        html += list.map(v => `
          <div class="atlas-card">
            <div class="flex spread" style="align-items:center">
              <strong class="text-${v.color}">${escapeHTML(v.verb)}</strong>
              <span class="badge badge-${v.color}">${escapeHTML(v.badge)}</span>
            </div>
            <p class="small mt-1 mb-0">${escapeHTML(v.definition)}</p>
            <div class="atlas-golden"><b>⭐ القاعدة الذهبية:</b> ${escapeHTML(v.goldenRule)}</div>
            <div class="small text-dim mt-1"><b>مثال نموذجي:</b> «${escapeHTML(v.example)}»</div>
          </div>
        `).join("");
      }
    } else if (currentAtlasCategory === "hypotheses") {
      html += (ATLAS_DATA.hypothesesRules || []).map(r => `
        <div class="atlas-card">
          <strong class="${r.color === 'emerald' ? 'text-emerald' : 'text-rose'}">${escapeHTML(r.title)}</strong>
          <ul class="small mt-1" style="padding-inline-start:1.2rem;line-height:1.7">
            ${r.points.map(p => `<li class="mt-1">${escapeHTML(p)}</li>`).join("")}
          </ul>
        </div>
      `).join("");
    } else if (currentAtlasCategory === "flashcards") {
      const list = (ATLAS_DATA.flashcards || []).filter(f => !query || normalizeArabic(f.q + " " + f.a).includes(query));
      html += `
        <p class="small text-muted mb-2">💡 انقر على أي بطاقة لعرض الإجابة النموذجية والمفهوم المفتاحي فوراً:</p>
        <div class="flashcard-grid">
          ${list.map((f, i) => `
            <div class="flashcard" data-card="${i}">
              <div class="flashcard-q">
                <span>${escapeHTML(f.q)}</span>
                <span class="badge badge-amber">${escapeHTML(f.tag)}</span>
              </div>
              <div class="flashcard-a">${escapeHTML(f.a)}</div>
            </div>
          `).join("")}
        </div>
      `;
    }

    html += `</div>`;
    return html;
  };

  openDrawer("left", "🔬 أطلس التقنيات والمنهجية 4D", renderContent());

  const bindDrawerEvents = () => {
    const searchInput = $("#atlas-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        currentAtlasSearch = e.target.value;
        const container = $(".drawer-body");
        if (container) {
          container.innerHTML = renderContent();
          bindDrawerEvents();
          const nextInput = $("#atlas-search-input");
          if (nextInput) {
            nextInput.focus();
            nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
          }
        }
      });
    }

    $$(".atlas-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        currentAtlasCategory = btn.dataset.cat;
        const container = $(".drawer-body");
        if (container) {
          container.innerHTML = renderContent();
          bindDrawerEvents();
        }
      });
    });

    $$(".flashcard").forEach(fc => {
      fc.addEventListener("click", () => {
        fc.classList.toggle("revealed");
      });
    });
  };

  bindDrawerEvents();
}

function openPdfDrawer() {
  const s = sujetObj();
  openDrawer("right", `📄 وثيقة الموضوع ${s.id === 1 ? "الأول" : "الثاني"} المختار (PDF)`,
    `<div class="stack" style="height:100%">
      <div class="flex spread mb-1">
        <a class="btn btn-indigo btn-sm" target="_blank" rel="noopener noreferrer" href="${s.pdf}">↗ فتح في نافذة مستقلة</a>
        <a class="btn btn-ghost btn-sm" href="${s.pdf}" download>تحميل PDF ↓</a>
      </div>
      <iframe src="${s.pdf}" title="PDF الموضوع" style="width:100%;flex:1;min-height:65vh;border-radius:.8rem;border:1px solid var(--line)"></iframe>
      <p class="small text-muted mt-1">ملاحظة لمستخدمي الهواتف: إذا لم يظهر الملف داخل الإطار، يمكنك فتحه في نافذة مستقلة للاطلاع المريح.</p>
    </div>`);
}

let drawerEscHandler = null;
function openDrawer(side, title, body) {
  closeModal();
  const existing = $(".drawer");
  if (existing) {
    existing.remove();
    if (drawerEscHandler) {
      document.removeEventListener("keydown", drawerEscHandler);
      drawerEscHandler = null;
    }
  }

  const d = el(`<div class="drawer ${side} open" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
    <div class="drawer-head"><strong id="drawer-title">${title}</strong><button class="btn btn-ghost btn-sm" data-close aria-label="إغلاق القائمة">✕</button></div>
    <div class="drawer-body">${body}</div></div>`);
  document.body.appendChild(d);
  
  const closeDrawer = () => {
    d.remove();
    if (drawerEscHandler) {
      document.removeEventListener("keydown", drawerEscHandler);
      drawerEscHandler = null;
    }
  };

  $$(`[data-close]`, d).forEach(b => b.addEventListener("click", closeDrawer));
  drawerEscHandler = (e) => { if (e.key === "Escape") closeDrawer(); };
  document.addEventListener("keydown", drawerEscHandler);
}

/* ---------- Helpers ---------- */
function fmtPts(n) { return `${(+n).toFixed(2)}ن`; }
function short(text, n = 7) {
  const words = text.split(" ");
  return words.length <= n ? text : words.slice(0, n).join(" ") + "…";
}

/* ---------- Restauration du routeur ---------- */
function restoreActiveScreen() {
  const current = store.state.activeScreen || "view-hub";
  const timerBar = $("#global-timer-bar");

  if (store.state.sessionActive) {
    if (timerBar) timerBar.classList.remove("hidden");
    if (store.state.globalRemaining > 0) {
      timers.startGlobal();
    }
  } else {
    if (timerBar) timerBar.classList.add("hidden");
  }

  const y = yearObj(store.state.yearId) || APP_CONFIG.years[0];

  switch (current) {
    case "view-guide":
      renderGuide(y);
      showScreen("view-guide");
      break;
    case "view-strategy":
      renderStrategy(store.state.sujetId || 1);
      if (store.state.strategyRunning && store.state.strategyRemaining > 0) {
        timers.startStrategy();
      }
      showScreen("view-strategy");
      break;
    case "view-onboarding":
      renderOnboarding();
      showScreen("view-onboarding");
      break;
    case "view-workspace":
      renderWorkspace();
      showScreen("view-workspace");
      if (store.state.activeStep) {
        goToStep(store.state.activeStep);
      }
      break;
    case "view-hub":
    default:
      renderHub();
      showScreen("view-hub");
      break;
  }
}

/* ---------- Bootstrap ---------- */
export function init() {
  store.load();

  // timer global (visible en continu quand en session)
  if (!$("#global-timer-bar")) {
    const bar = document.createElement("div");
    bar.id = "global-timer-bar";
    bar.className = "hidden";
    bar.style.cssText = "position:sticky;top:0;z-index:40;display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.5rem 1.5rem;background:rgba(2,6,23,.95);border-bottom:1px solid var(--line);font-size:.8rem";
    bar.innerHTML = `<span class="text-emerald bold" style="display:flex;align-items:center;gap:.5rem"><span style="width:.5rem;height:.5rem;border-radius:50%;background:var(--emerald);animation:pulse 1.5s infinite"> </span> نمط التركيز والهدوء 4D</span>
      <span class="mono bold" style="color:#fb7185">⏳ <span id="global-timer">${helpers.fmt(store.state.globalRemaining)}</span></span>`;
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
    toastZone.setAttribute("aria-live", "polite");
    toastZone.setAttribute("aria-atomic", "true");
    document.body.appendChild(toastZone);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) voiceEngine.stop(false);
  });

  restoreActiveScreen();
}

// petites fonctions exportées
export { toast as notify };
