/* ============================================================
   UI — rendu, routage entre écrans, boussole, exercices, toasts
   ------------------------------------------------------------
   Améliorations vs v1 :
     - plus de `onclick` globaux / fonctionnalités éparpillées :
       on rend du HTML puis on attache des écouteurs ciblés.
     - contenu généré depuis la config (data-driven).
     - toasts à la place des `alert()`.
     - barème réel + feedback pédagogique.
   ============================================================ */

import { APP_CONFIG, normalizeArabic } from "../data/subjects.js";
import { store, helpers } from "./store.js";
import { timers, evaluateText, evaluatePipeline, scoreFromFraction } from "./engine.js";

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
  $$(".screen").forEach(s => s.classList.add("hidden"));
  const target = $("#" + id);
  if (target) target.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- Toasts ---------- */
function toast(msg, type = "info", ms = 3500) {
  const zone = $("#toast-zone");
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
        <button class="btn btn-amber" id="btn-atlas">🔬 أطلس التقنيات السريع</button>
      </header>

      <div class="center mb-2">
        <h2 class="mt-0">اختر دورة البكالوريا لبدء جلسة التدريب المنظم</h2>
        <p class="text-muted small">ستمر أولاً بمحطة التهدئة البصرية قبل تصفح وحساب نقاط الموضوعين</p>
      </div>

      <div class="grid grid-cards" id="year-grid"></div>
      <footer class="screen-foot">منصة الحل الميكانيكي المنظم لامتحانات بكالوريا علوم الطبيعة والحياة.</footer>
    </div>`;

  const grid = $("#year-grid");
  years.forEach(y => {
    const disabled = !y.enabled;
    const card = el(`
      <div class="card year-card ${disabled ? "dim" : ""}">
        <div class="stack">
          <div class="flex spread">
            <span class="badge badge-${y.theme}">${y.badge}</span>
            <span class="mono bold" style="font-size:1.6rem">${y.id}</span>
          </div>
          <div>
            <h3 class="mt-0 mb-1">${y.label}</h3>
            <p class="small text-muted mt-0">${disabled ? (y.loadingNote || "لم تُرفق وثائق PDF لهذه الدورة بعد — قريباً.") : "جلسة شاملة وفق نظام الأقطاب 4D الهادئ."}</p>
          </div>
        </div>
        <button class="btn btn-block ${y.theme === 'emerald' ? 'btn-emerald' : y.theme === 'indigo' ? 'btn-indigo' : 'btn-amber'}" ${disabled ? "disabled" : ""} data-year="${y.id}">
          ${disabled ? "غير متاح بعد" : "دخول الدورة (ساس التهدئة والبوصلة)"}
        </button>
      </div>`);
    grid.appendChild(card);
  });

  $$("#year-grid [data-year]:not([disabled])").forEach(btn =>
    btn.addEventListener("click", () => startSession(btn.dataset.year)));

  $("#btn-atlas").addEventListener("click", openAtlas);
}

/* ===================== 2) GUIDE (respiration) ===================== */
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
          <button class="btn btn-rose btn-sm" id="guide-exit">✕ إلغاء والعودة</button>
          <div class="brand-icon">🌿</div>
          <div><h2 id="guide-title">ساس الهدوء والتركيز المنهجي</h2>
          <p class="small text-emerald">جلسة التأطير النفسي والتنفس الموجه — بكالوريا ${y.id}</p></div>
        </div>
      </header>

      <div class="grid">
        <div class="card center stack">
          <div class="breath">تنفس بعمق</div>
          <div>
            <h3 class="mt-0">أنت تمتلك كافة المكتسبات، ركّز فقط على تطبيق خطوات البوصلة.</h3>
            <p class="small text-muted">خذ شهيقاً 4 ثوانٍ، احبس 4 ثوانٍ، ثم ازفر ببطء 4 ثوانٍ لطرد التوتر.</p>
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
      <footer class="screen-foot">المنهجية الميكانيكية تمنحك الثقة في كل خطوة.</footer>
    </div>`;

  $("#guide-exit").addEventListener("click", () => { window.location.reload(); });
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
  $("#view-strategy").innerHTML = `
    <div class="app app-wide">
      <header class="screen-head">
        <div class="brand">
          <button class="btn btn-rose btn-sm" id="strategy-exit">✕ إلغاء وخروج</button>
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
            </div>
          </div>
          <div style="height:60vh;background:var(--bg)" id="pdf-preview-container">
            ${(() => {
              const s = y.sujets[0];
              if (s && s.pdfAvailable && s.pdf) {
                return `<iframe id="strategy-pdf" src="${s.pdf}" style="width:100%;height:100%;border:0"></iframe>`;
              }
              if (s && s.pdfExternalUrl) {
                return `<div class="center stack" style="height:100%;justify-content:center">
                  <p class="small text-muted">${s.pdfNote || "PDF non disponible localement."}</p>
                  <a class="btn btn-indigo" href="${s.pdfExternalUrl}" target="_blank" rel="noopener noreferrer">📄 Ouvrir la source externe</a>
                </div>`;
              }
              return `<div class="center stack" style="height:100%;justify-content:center">
                <p class="small text-muted">Aucun PDF disponible pour cette session.</p>
              </div>`;
            })()}
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

  $("#strategy-exit").addEventListener("click", () => window.location.reload());
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
          <div class="flex spread"><span class="small">ت1: استرجاع (5ن)</span><input class="field calc-input" data-total="${s}-t1" type="number" min="0" max="5" step="0.25" value="4.25" style="width:5rem;text-align:center"></div>
          <div class="flex spread"><span class="small">ت2: استدلال (7ن)</span><input class="field calc-input" data-total="${s}-t2" type="number" min="0" max="7" step="0.25" value="5.75" style="width:5rem;text-align:center"></div>
          <div class="flex spread"><span class="small bold text-emerald">ت3: مسعى (8ن) ★</span><input class="field calc-input" data-total="${s}-t3" type="number" min="0" max="8" step="0.25" value="7.25" style="width:5rem;text-align:center"></div>
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
  const s = y.sujets.find(s => s.id === n);
  const iframe = $("#strategy-pdf");
  if (iframe && s) {
    iframe.src = s.pdfAvailable && s.pdf ? s.pdf : "about:blank";
  }
  $$("#view-strategy [data-preview]").forEach(b => {
    const active = +b.dataset.preview === n;
    const color = active ? (n === 1 ? "btn-indigo" : "btn-purple") : "btn-ghost";
    b.className = `btn btn-sm ${color}`;
  });
}

function updateStrategyTimer() { $("#strategy-timer").textContent = helpers.fmt(store.state.strategyRemaining); }

function calculateStrategicScores() {
  const read = (prefix, n) => {
    const v = parseFloat($(`[data-total="${prefix}-t${n}"]`).value);
    return isNaN(v) ? 0 : Math.min(20, Math.max(0, v));
  };
  const s1 = read("s1", 1) + read("s1", 2) + read("s1", 3);
  const s2 = read("s2", 1) + read("s2", 2) + read("s2", 3);
  $("#s1-total").textContent = `${s1.toFixed(2)} / 20.00`;
  $("#s2-total").textContent = `${s2.toFixed(2)} / 20.00`;

  let rec, gain;
  if (s1 > s2)      { rec = `ترجيح الموضوع الأول بفارق +${(s1 - s2).toFixed(2)} نقاط، لتميّز رصيد المسعى العلمي (ت3: 8ن).`; gain = ((s1 / 20) * 100).toFixed(1) + "%"; }
  else if (s2 > s1) { rec = `ترجيح الموضوع الثاني بفارق +${(s2 - s1).toFixed(2)} نقاط، لتميّز رصيد المسعى العلمي (ت3: 8ن).`; gain = ((s2 / 20) * 100).toFixed(1) + "%"; }
  else              { rec = "الموضوعان متكافئان تماماً — رجّح موضوع التمرين الثالث الأكثر ضماناً."; gain = ((s1 / 20) * 100).toFixed(1) + "%"; }
  $("#recommendation-text").textContent = rec;
  $("#recommendation-gain").textContent = gain;
}

function confirmChoice(sujetNum) {
  store.state.sujetId = sujetNum;
  store.save();
  timers.stopStrategy();
  renderOnboarding();
  showScreen("view-onboarding");
  $("#global-timer-bar").classList.remove("hidden");
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

  $("#onb-home").addEventListener("click", () => window.location.reload());
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
        <div class="flex gap-2">
          <button class="btn btn-amber btn-sm" id="ws-panic">✨ فك القفل الذهني</button>
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
  $("#ws-home").addEventListener("click", () => window.location.reload());
  $("#ws-panic").addEventListener("click", showPanic);
  $("#ws-onb").addEventListener("click", () => { renderOnboarding(); showScreen("view-onboarding"); });
  $("#ws-pdf").addEventListener("click", openPdfDrawer);
  $("#ws-report").addEventListener("click", showReport);
  $("#ws-reset").addEventListener("click", confirmReset);
  $$("#view-workspace [data-switch]").forEach(b => b.addEventListener("click", () => attemptSwitch(+b.dataset.switch)));

  renderStepnav(ex);
  renderExercise(ex);
  goToStep(1);
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
          <span class="badge badge-${m.color}" style="margin-bottom:.6rem">${POLE[p].title} (${fmtPts(pole.points)})</span>
          <h3 class="mt-0">${pole.prompt}</h3>
          ${pole.minLength >= 100 ? `<textarea class="field" id="fld-${p}" rows="6" placeholder="${pole.placeholder}"></textarea>`
                                  : `<input class="field" id="fld-${p}" type="text" placeholder="${pole.placeholder}">`}
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
  const res = evaluateText(text, pole.rule);

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
  if (res.missing.length) html += `<br>🔎 مفاهيم مفتاحية ناقصة: <b>${res.missing.join("، ")}</b>`;
  if (res.forbiddenFound.length) html += `<br>⛔ كلمة يجب تجنّبها هنا: <b>${res.forbiddenFound.join("، ")}</b>`;
  if (res.empty) html = `<br>لم تُدخل أي إجابة بعد.`;
  fb.innerHTML = html;

  if (!res.empty) goToSuccessStep(exNum);
}

function goToSuccessStep(exNum) {
  const idx = POLE_ORDER.indexOf(activePole);
  if (idx < 3) goToStep(idx + 2);
}

/* ---------- Pipeline (exercice 3) ---------- */
function pipelineHTML(ex) {
  return `
    <div id="panel-1" class="card">
      <span class="badge badge-emerald" style="margin-bottom:.6rem">${POLE.N.title} (${fmtPts(ex.poles.N.points)})</span>
      <h3 class="mt-0">${ex.poles.N.prompt}</h3>
      <div class="grid grid-2">
        <input class="field" id="pipeline-var-indep" type="text" placeholder="المتغير المستقل: تركيز الأدينوزين / الكافيين...">
        <input class="field" id="pipeline-var-dep" type="text" placeholder="المتغير التابع: النشاط العصبي الدماغي وشدة الارتباط بـ A1R...">
      </div>
      <div class="feedback hidden" id="fb-N"></div>
      <button class="btn btn-emerald mt-2" data-polo-check="N">تأكيد القطب N (فكّ القفل)</button>
    </div>

    <div id="panel-2" class="card hidden">
      <span class="badge badge-indigo" style="margin-bottom:.6rem">${POLE.S.title} (${fmtPts(ex.poles.S.points)})</span>
      <h3 class="mt-0">${ex.poles.S.prompt}</h3>
      <div class="card" style="background:var(--bg)">
        <label class="lbl">1. الشكل (أ): التحليل المقارن بالتوازي</label>
        <textarea class="field" rows="2" id="pipeline-doc1a"></textarea>
        <label class="lbl">الاستنتاج الخاص بالشكل (أ):</label>
        <input class="field" id="pipeline-doc1a-ded" type="text">
        <label class="lbl mt-2">2. الشكل (ب): شدة الارتباط</label>
        <input class="field" id="pipeline-doc1b" type="text">
        <input class="field mt-1" id="pipeline-doc1b-ded" type="text" placeholder="الاستنتاج الخاص بالشكل (ب):">
      </div>
      <div class="feedback hidden" id="fb-S"></div>
      <button class="btn btn-emerald mt-2" data-polo-check="S">فحص مصفوفة السندات</button>
    </div>

    <div id="panel-3" class="card hidden">
      <span class="badge badge-amber" style="margin-bottom:.6rem">${POLE.E.title} (${fmtPts(ex.poles.E.points)})</span>
      <h3 class="mt-0">${ex.poles.E.prompt}</h3>
      <div class="grid grid-2">
        <input class="field" id="pipeline-hyp1" type="text" placeholder="الفرضية 1: يرتبط الكافيين بمستقبل الأدينوزين A1R">
        <input class="field" id="pipeline-hyp2" type="text" placeholder="الفرضية 2: يرتبط الكافيين بالأدينوزين نفسه">
      </div>
      <label class="lbl mt-2">استدلال الوثيقة 2 (تتبّع السلسلة الجزيئية كشريط فيديو):</label>
      <textarea class="field" rows="4" id="pipeline-doc2"></textarea>
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
    const score = text ? scoreFromFraction(ex.poles[p].points, Math.min(1, Math.max(0.5, text.length / (ex.poles[p].minLength || 40)))) : 0;
    st.scores[p] = score;
    if (!st.answeredAny && text) st.answeredAny = true;
    fb.className = `feedback ${text ? "good" : "bad"} mt-2`;
    fb.innerHTML = `نقاط القطب ${p}: <b>${score.toFixed(2)} / ${fmtPts(ex.poles[p].points)}</b>` +
      (text ? " — أُخذت الإجابات بعين الاعتبار." : " — أدخل نصاً في أحد الحقول أولاً.");
  } else {
    // pôle W : évaluation du pipeline (arrangement)
    const res = evaluatePipeline(ex.blocksBank, st.pipeline);
    const max = fmtPts(ex.poles[p].points);
    st.scores[p] = Math.round(res.fraction * ex.poles[p].points * 100) / 100;
    if (!st.answeredAny) st.answeredAny = true;
    fb.className = `feedback ${res.fraction >= 0.75 ? "good" : res.fraction >= 0.4 ? "mid" : "bad"} mt-2`;
    fb.innerHTML = `المخطط: <b>${st.scores[p].toFixed(2)} / ${max}</b> (${res.correct}/${res.total} عنصر صحيح)` +
      (res.wrongSlots.length ? `<br>⚠️ عناصر في غير موضعها: ${res.wrongSlots.length}` : "");
  }
  store.save();
  updateLiveScore();
}

/* ---------- Boussole / navigation ---------- */
let activePole = "N";
function goToStep(n) {
  const ex = exDef(store.state.activeExercise);
  activePole = POLE_ORDER[n - 1];
  $$("#ex-content [id^='panel-']").forEach((panel, i) => panel.classList.toggle("hidden", i !== n - 1));
  $("#progress span").style.width = `${(n / 4) * 100}%`;
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
  $("#live-score").textContent = sum.toFixed(2);
  $("#live-max").textContent = `/ ${ex.max.toFixed(2)}`;
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

function showReport() {
  const rep = computeReport();
  const body = `
    <div class="card" style="background:var(--bg)">
      <div class="flex spread"><strong>النتيجة الإجمالية</strong>
        <span class="mono text-emerald" style="font-size:1.4rem">${rep.grand.toFixed(2)} / ${rep.grandMax.toFixed(2)}</span></div>
      <div class="progress mt-1"><span style="width:${rep.percent}%"></span></div>
      <p class="small text-muted mt-1">النسبة: ${rep.percent}%</p>
    </div>
    <div class="stack mt-2">
      ${rep.rows.map(r => `
        <div class="flex spread" style="border-bottom:1px solid var(--line);padding-bottom:.4rem">
          <span class="bold">${r.exercise}: ${r.label} ${r.filled ? "" : "(غير مكتمل)"}</span>
          <span class="mono ${r.total >= r.max * 0.7 ? "text-emerald" : "text-amber"}">${r.total.toFixed(2)} / ${r.max.toFixed(2)}</span>
        </div>`).join("")}
    </div>
    <div class="flex mt-2">
      <button class="btn btn-emerald btn-sm" id="dl-csv">⬇️ تنزيل CSV</button>
      <button class="btn btn-ghost btn-sm" id="dl-json">⬇️ تنزيل JSON</button>
    </div>`;
  openModal(`📊 تقرير النتائج — ${rep.rows.length} تمارين`, body);
  $("#dl-csv").addEventListener("click", () => download(`boussole4d_${rep.year}_sujet${rep.sujet}.csv`, toCSV(rep)));
  $("#dl-json").addEventListener("click", () => download(`boussole4d_${rep.year}_sujet${rep.sujet}.json`, JSON.stringify(rep, null, 2)));
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
    "سيتم مسح كل التقدم (النتائج والنصوص والاختيارات) لهذه الدورة. هل أنت متأكد؟",
    `<button class="btn btn-rose" id="reset-yes">نعم، امسح الكل</button>`
  );
  const yes = $("#reset-yes");
  if (yes) yes.addEventListener("click", () => {
    store.reset();
    toast("تمت إعادة التعيين. سيعاد تحميل التطبيق.", "success");
    setTimeout(() => window.location.reload(), 700);
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

let modal = null;
function openModal(title, body) {
  modal = el(`<div class="overlay" data-close="overlay">
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-head">
        <strong class="text-amber">${title}</strong>
        <button class="btn btn-ghost btn-sm" data-close="btn">✕</button>
      </div>
      <p class="small">${body}</p>
      <div class="flex" style="justify-content:flex-end"><button class="btn btn-emerald" data-close="ok">فهمت التلميح، سأواصل الحل</button></div>
    </div></div>`);
  document.body.appendChild(modal);
  $$(`[data-close]`, modal).forEach(b => b.addEventListener("click", closeModal));
}
function closeModal() { if (modal) modal.remove(); modal = null; }

function openAtlas() {
  const items = [
    ["التصوير الإشعاعي الذاتي", "تتبع مسار ومصير الجزيئات داخل الخلايا بعد وسمها بنظير مشع (كالوراسيل المشع أو الثيميدين المشع).", "emerald"],
    ["الرحلان الشاردي", "فصل الجزيئات المشحونة (أحماض أمينية وبروتينات) في مجال كهربائي حسب الشحنة الصافية.", "indigo"],
    ["الانتشار المناعي (أوكتارلوني)", "إثبات نوعية الأجسام المضادة وتشكيل معقدات مناعية عند ظهور أقواس الترسيب.", "amber"],
    ["Patch-Clamp", "عزل قطعة غشائية تحتوي قناة شاردية ودراسة التيارات الداخلة والخارجة.", "purple"]
  ];
  openDrawer("left", "🔬 أطلس التقنيات التجريبية والمخبرية", items.map(i =>
    `<div class="card" style="background:var(--bg)"><strong class="text-${i[2]}">${i[0]}</strong><p class="small text-muted mt-1">${i[1]}</p></div>`).join(""));
}

function openPdfDrawer() {
  const s = sujetObj();
  const body = s.pdfAvailable && s.pdf
    ? `<iframe src="${s.pdf}" style="width:100%;height:100%;min-height:70vh;border:0"></iframe>`
    : s.pdfExternalUrl
      ? `<div class="center stack" style="height:100%;justify-content:center">
           <p class="small text-muted">${s.pdfNote || "PDF non disponible localement."}</p>
           <a class="btn btn-indigo" href="${s.pdfExternalUrl}" target="_blank" rel="noopener noreferrer">📄 Ouvrir la source externe</a>
         </div>`
      : `<div class="center stack" style="height:100%;justify-content:center">
           <p class="small text-muted">Aucun PDF disponible pour cette session.</p>
         </div>`;
  openDrawer("right", `📄 وثيقة الموضوع ${s.id === 1 ? "الأول" : "الثاني"} المختار فقط (PDF)`, body);
}

function openDrawer(side, title, body) {
  closeModal();
  const d = el(`<div class="drawer ${side} open" role="dialog" aria-modal="true">
    <div class="drawer-head"><strong>${title}</strong><button class="btn btn-ghost btn-sm" data-close>✕</button></div>
    <div class="drawer-body">${body}</div></div>`);
  document.body.appendChild(d);
  $$(`[data-close]`, d).forEach(b => b.addEventListener("click", () => d.remove()));
  const close = (e) => { if (e.key === "Escape") d.remove(); };
  document.addEventListener("keydown", close);
}

/* ---------- Helpers ---------- */
function fmtPts(n) { return `${(+n).toFixed(2)}ن`; }
function short(text, n = 7) {
  const words = text.split(" ");
  return words.length <= n ? text : words.slice(0, n).join(" ") + "…";
}

/* ---------- Bootstrap ---------- */
export function init() {
  store.load();

  // timer global (visible en continu quand en session)
  const bar = document.createElement("div");
  bar.id = "global-timer-bar";
  bar.className = "hidden";
  bar.style.cssText = "position:sticky;top:0;z-index:40;display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.5rem 1.5rem;background:rgba(2,6,23,.9);border-bottom:1px solid var(--line);font-size:.8rem";
  bar.innerHTML = `<span class="text-emerald bold" style="display:flex;align-items:center;gap:.5rem"><span style="width:.5rem;height:.5rem;border-radius:50%;background:var(--emerald);animation:pulse 1.5s infinite"> </span> نمط التركيز والهدوء 4D</span>
    <span class="mono bold" style="color:#fb7185">⏳ <span id="global-timer">04:30:00</span></span>`;
  document.body.prepend(bar);

  timers.onChange = (which) => {
    const t = $("#global-timer");
    if (t) t.textContent = helpers.fmt(store.state.globalRemaining);
    if (which === "strategy") updateStrategyTimer();
  };

  const toastZone = document.createElement("div");
  toastZone.id = "toast-zone";
  toastZone.className = "toast-zone";
  document.body.appendChild(toastZone);

  renderHub();
  showScreen("view-hub");
  updateLiveScoreSafe();
}

function updateLiveScoreSafe() { /* appelé après le rendu du hub : rien à faire */ }

// petites fonctions appelées par les handlers
export { toast as notify };
