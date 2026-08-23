/* ============================================================
   UI — rendu, routage entre écrans, boussole, exercices, toasts
   Facade stable : init, renderHub, notify, voiceEngine
   ============================================================ */

import { APP_CONFIG, normalizeArabic } from "../data/subjects.js";
import { BROUILLON_MODE_DATA } from "../data/brouillon.js";
import { store, helpers } from "./store.js";
import { timers, evaluateText, evaluatePipeline, scoreFromFraction, soundEngine } from "./engine.js";

const POLE = {
  N: { title: "القطب الشمال", cls: "emerald" },
  S: { title: "القطب الجنوب", cls: "blue" },
  E: { title: "القطب الشرق",  cls: "amber" },
  W: { title: "القطب الغرب",  cls: "purple" }
};
const POLE_ORDER = ["N", "S", "E", "W"];

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };

function yearObj(id) { return APP_CONFIG.years.find(y => y.id === id); }
function sujetObj() { return yearObj(store.state.yearId)?.sujets.find(s => s.id === store.state.sujetId); }
function exDef(num)  { return sujetObj()?.exercises.find(e => e.number === num); }

function showScreen(id) {
  $$(".screen").forEach(s => s.classList.add("hidden"));
  const target = $("#" + id);
  if (target) target.classList.remove("hidden");
  store.setActiveScreen(id);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

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

/* ---------- Voice / dictée ---------- */
export const voiceEngine = {
  listening: false,
  target: null,
  start(input) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      toast("الإملاء الصوتي غير متاح في هذا المتصفح.", "warn");
      return false;
    }
    this.target = input;
    this.listening = true;
    toast("بدأ الإملاء الصوتي…", "info");
    return true;
  },
  stop() {
    this.listening = false;
    this.target = null;
  }
};

function micButton(fieldId) {
  return `<button type="button" class="btn-mic" data-mic="${fieldId}">🎤 إملاء</button>`;
}
function bindMics(root = document) {
  $$("[data-mic]", root).forEach(btn => {
    btn.addEventListener("click", () => {
      const input = $("#" + btn.dataset.mic);
      voiceEngine.start(input);
    });
  });
}

/* ---------- Adkar ---------- */
const ADKAR = [
  { title: "دعاء بداية الامتحان", ar: "اللهم لا سهل إلا ما جعلته سهلا وأنت تجعل الحزن إذا شئت سهلا.", note: "يُستحب عند الشروع." },
  { title: "سورة طه", ar: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي.", note: "سورة طه — دعاء موسى عليه السلام." },
  { title: "الاستعاذة", ar: "أعوذ بالله من الشيطان الرجيم.", note: "قبل القراءة والتركيز." },
  { title: "التوكل", ar: "حسبي الله ونعم الوكيل.", note: "عند القلق." },
  { title: "طلب العلم", ar: "ربِّ زدني علما.", note: "أثناء المراجعة." },
  { title: "خاتمة الجلسة", ar: "الحمد لله الذي بنعمته تتم الصالحات.", note: "بعد التسليم." }
];

function adkarHTML() {
  return `<div class="adkar-section">
    <strong class="text-emerald">أدعية وأذكار الامتحان</strong>
    <div class="adkar-grid">
      ${ADKAR.map(a => `<div class="adkar-card"><div class="adkar-title">${a.title}</div><div class="adkar-arabic">${a.ar}</div><div class="adkar-note">${a.note}</div></div>`).join("")}
    </div>
  </div>`;
}
function openAdkar() {
  openModal("أدعية وأذكار الامتحان", adkarHTML());
}

/* ---------- Atlas ---------- */
const ATLAS = {
  techniques: [
    ["التصوير الإشعاعي الذاتي", "تتبع مسار الجزيئات بعد وسمها بنظير مشع.", "emerald"],
    ["الرحلان الشاردي", "فصل الجزيئات المشحونة حسب الشحنة الصافية.", "indigo"],
    ["الانتشار المناعي (أوكتارلوني)", "إثبات نوعية الأجسام المضادة بظهور أقواس الترسيب.", "amber"],
    ["Patch-Clamp", "عزل قطعة غشائية ودراسة التيارات الشاردية.", "purple"]
  ],
  verbs: BROUILLON_MODE_DATA.bacVerbs.map(v => ({
    title: v.verb, body: `${v.expected} — ${v.quickPlan}`, trap: v.trap, pole: v.pole
  })),
  hypotheses: [
    { title: "فرضية تفسيرية", body: "نفترض أن … مما يؤدي إلى …", trap: "لا تستعمل ربما/لعل." },
    { title: "مصادقة فرضية", body: "تتأكد صحة الفرضية لأن الوثيقة تُظهر …", trap: "لا تصادق دون سند." }
  ],
  flashcards: [
    { q: "ما أفعال القطب S؟", a: "استخرج، صف، حلّل، قارن — ملاحظة ثم استنتاج دون بسبب." },
    { q: "متى نكتب نصا علميا؟", a: "عند طلب تحرير نص: مقدمة + عرض + خاتمة تجيب عن المشكل." },
    { q: "ما الفرق بين حدد وفسّر؟", a: "حدد = تعيين دقيق. فسّر = سبب + آلية + نتيجة." }
  ]
};

function renderAtlasBody(cat = "techniques", query = "") {
  const q = normalizeArabic(query);
  if (cat === "flashcards") {
    const cards = ATLAS.flashcards.filter(c => !q || normalizeArabic(c.q + c.a).includes(q));
    return `<div class="flashcard-grid">${cards.map(c => `<div class="flashcard"><div class="flashcard-q">${c.q}<span>↺</span></div><div class="flashcard-a">${c.a}</div></div>`).join("")}</div>`;
  }
  if (cat === "verbs") {
    const items = ATLAS.verbs.filter(v => !q || normalizeArabic(v.title + v.body).includes(q));
    return items.map(v => `<div class="atlas-card"><strong>${v.title}</strong><p class="small">${v.body}</p><div class="atlas-trap">${v.trap}</div></div>`).join("");
  }
  if (cat === "hypotheses") {
    return ATLAS.hypotheses.map(h => `<div class="atlas-card"><strong>${h.title}</strong><p class="small">${h.body}</p><div class="atlas-trap">${h.trap}</div></div>`).join("");
  }
  return ATLAS.techniques
    .filter(i => !q || normalizeArabic(i[0] + i[1]).includes(q))
    .map(i => `<div class="atlas-card"><strong class="text-${i[2]}">${i[0]}</strong><p class="small text-muted mt-1">${i[1]}</p></div>`).join("");
}

function openAtlas() {
  const body = `<div class="atlas-header">
      <input class="field" id="atlas-search-input" type="search" placeholder="بحث في الأطلس…">
      <div class="atlas-tabs">
        <button class="atlas-tab-btn active" data-cat="techniques">تقنيات</button>
        <button class="atlas-tab-btn" data-cat="verbs">أفعال</button>
        <button class="atlas-tab-btn" data-cat="hypotheses">فرضيات</button>
        <button class="atlas-tab-btn" data-cat="flashcards">بطاقات</button>
      </div>
    </div>
    <div id="atlas-body">${renderAtlasBody("techniques")}</div>`;
  openDrawer("left", "🔬 أطلس التقنيات التجريبية والمخبرية", body);
  let cat = "techniques";
  const refresh = () => {
    const q = $("#atlas-search-input")?.value || "";
    $("#atlas-body").innerHTML = renderAtlasBody(cat, q);
    bindAtlasCards();
  };
  $("#atlas-search-input")?.addEventListener("input", refresh);
  $$(".atlas-tab-btn").forEach(btn => btn.addEventListener("click", () => {
    cat = btn.dataset.cat;
    $$(".atlas-tab-btn").forEach(b => b.classList.toggle("active", b === btn));
    refresh();
  }));
  bindAtlasCards();
}
function bindAtlasCards() {
  $$(".flashcard").forEach(card => card.addEventListener("click", () => card.classList.toggle("revealed")));
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
            <h1>${APP_CONFIG.appTitle}</h1>
            <p>${APP_CONFIG.appSubtitle}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="btn-sound" id="btn-hub-sound">🔇 صوت</button>
          <button class="btn-adkar" id="btn-hub-adkar">🕌 أدعية وأذكار</button>
          <button class="btn btn-amber" id="btn-atlas">🔬 أطلس التقنيات السريع</button>
        </div>
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
    const note = disabled ? (y.loadingNote || "لم تُرفق وثائق PDF لهذه الدورة بعد — قريباً.") : "جلسة شاملة وفق نظام الأقطاب 4D الهادئ.";
    const card = el(`
      <div class="card year-card ${disabled ? "dim" : ""}" title="${escapeAttr(note)}">
        <div class="stack">
          <div class="flex spread">
            <span class="badge badge-${y.theme}">${y.badge}</span>
            <span class="mono bold" style="font-size:1.6rem">${y.id}</span>
          </div>
          <div>
            <h3 class="mt-0 mb-1">${y.label}</h3>
            <p class="small text-muted mt-0">${note}</p>
          </div>
        </div>
        <button class="btn btn-block ${y.theme === "emerald" ? "btn-emerald" : y.theme === "indigo" ? "btn-indigo" : "btn-amber"}" ${disabled ? "disabled" : ""} data-year="${y.id}">
          ${disabled ? "غير متاح بعد" : "دخول الدورة (ساس التهدئة والبوصلة)"}
        </button>
      </div>`);
    grid.appendChild(card);
  });

  $$("#year-grid [data-year]:not([disabled])").forEach(btn =>
    btn.addEventListener("click", () => startSession(btn.dataset.year)));
  $("#btn-atlas").addEventListener("click", openAtlas);
  $("#btn-hub-adkar").addEventListener("click", openAdkar);
  $("#btn-hub-sound").addEventListener("click", () => cycleSound($("#btn-hub-sound")));
}

function escapeAttr(s) {
  return String(s || "").replace(/"/g, "&quot;");
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
        ${adkarHTML()}
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
      <p class="small text-muted">${s.pdfNote || "PDF non disponible localement."}</p>
      <a class="btn btn-indigo" href="${s.pdfExternalUrl}" target="_blank" rel="noopener noreferrer">📄 Ouvrir la source externe</a>
    </div>`;
  }
  return `<div class="center stack" style="height:100%;justify-content:center">
    <p class="small text-muted">${s?.pdfNote || "Aucun PDF disponible pour cette session."}</p>
  </div>`;
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
            ${pdfFallbackHTML(y.sujets[0])}
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

  $("#strategy-exit").addEventListener("click", goHome);
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
  const s = y.sujets.find(suj => suj.id === n) || y.sujets[0];
  const box = $("#pdf-preview-container");
  if (box && s) box.innerHTML = pdfFallbackHTML(s);
  $$("#view-strategy [data-preview]").forEach(b => {
    const active = +b.dataset.preview === n;
    const color = active ? (n === 1 ? "btn-indigo" : "btn-purple") : "btn-ghost";
    b.className = `btn btn-sm ${color}`;
  });
}

function updateStrategyTimer() {
  const t = $("#strategy-timer");
  if (t) t.textContent = helpers.fmt(store.state.strategyRemaining);
}

function calculateStrategicScores() {
  const read = (prefix, n) => {
    const node = $(`[data-total="${prefix}-t${n}"]`);
    if (!node) return 0;
    const v = parseFloat(node.value);
    return isNaN(v) ? 0 : Math.min(20, Math.max(0, v));
  };
  const s1 = read("s1", 1) + read("s1", 2) + read("s1", 3);
  const s2 = read("s2", 1) + read("s2", 2) + read("s2", 3);
  if ($("#s1-total")) $("#s1-total").textContent = `${s1.toFixed(2)} / 20.00`;
  if ($("#s2-total")) $("#s2-total").textContent = `${s2.toFixed(2)} / 20.00`;
  let rec, gain;
  if (s1 > s2)      { rec = `ترجيح الموضوع الأول بفارق +${(s1 - s2).toFixed(2)} نقاط، لتميّز رصيد المسعى العلمي (ت3: 8ن).`; gain = ((s1 / 20) * 100).toFixed(1) + "%"; }
  else if (s2 > s1) { rec = `ترجيح الموضوع الثاني بفارق +${(s2 - s1).toFixed(2)} نقاط، لتميّز رصيد المسعى العلمي (ت3: 8ن).`; gain = ((s2 / 20) * 100).toFixed(1) + "%"; }
  else              { rec = "الموضوعان متكافئان تماماً — رجّح موضوع التمرين الثالث الأكثر ضماناً."; gain = ((s1 / 20) * 100).toFixed(1) + "%"; }
  if ($("#recommendation-text")) $("#recommendation-text").textContent = rec;
  if ($("#recommendation-gain")) $("#recommendation-gain").textContent = gain;
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
  $("#onb-home").addEventListener("click", goHome);
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
          <button class="btn-sound" id="ws-sound">🔇 صوت</button>
          <button class="btn-adkar" id="ws-adkar">🕌 أذكار</button>
          <button class="btn btn-ghost btn-sm" id="ws-brouillon">📝 مسودة</button>
          <button class="btn btn-ghost btn-sm" id="ws-atlas">🔬 أطلس</button>
          <div class="pill"><span class="text-dim">العلامة:</span><span class="mono" id="live-score">0.00</span><span class="text-dim" id="live-max">/ ${ex.max.toFixed(2)}</span></div>
          <button class="btn btn-ghost btn-sm" id="ws-onb">دليل المعالجة</button>
          <button class="btn btn-purple btn-sm" id="ws-report">📊 التقرير</button>
          <button class="btn btn-rose btn-sm" id="ws-reset" title="إعادة تعيين كل الجلسة">↺ تصفير</button>
          <button class="btn btn-indigo btn-sm" id="ws-pdf">📄 PDF الموضوع</button>
        </div>
      </header>

      <div class="progress mb-2" id="progress"><span></span></div>
      <div class="card mb-2" id="boussole-scratch-card">
        <strong>ورقة المسودة السريعة</strong>
        <p class="small text-muted mt-0">افتح المسودة الكاملة من زر «مسودة» لتفكيك N/S/E/W.</p>
      </div>

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

  $("#ws-home").addEventListener("click", goHome);
  $("#ws-panic").addEventListener("click", showPanic);
  $("#ws-sound").addEventListener("click", () => cycleSound($("#ws-sound")));
  $("#ws-adkar").addEventListener("click", openAdkar);
  $("#ws-brouillon").addEventListener("click", openBrouillon);
  $("#ws-atlas").addEventListener("click", openAtlas);
  $("#ws-onb").addEventListener("click", () => { renderOnboarding(); showScreen("view-onboarding"); });
  $("#ws-pdf").addEventListener("click", openPdfDrawer);
  $("#ws-report").addEventListener("click", showReport);
  $("#ws-reset").addEventListener("click", confirmReset);
  $$("#view-workspace [data-switch]").forEach(b => b.addEventListener("click", () => attemptSwitch(+b.dataset.switch)));

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

function modelBox(pole) {
  if (!pole.modelAnswer) return "";
  return `<details class="model-box"><summary class="model-summary">الإجابة النموذجية</summary><div class="model-body"><pre class="model-text">${pole.modelAnswer}</pre></div></details>`;
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
          ${pole.minLength >= 100
            ? `<textarea class="field" id="fld-${p}" rows="6" placeholder="${pole.placeholder || ""}"></textarea>`
            : `<input class="field" id="fld-${p}" type="text" placeholder="${pole.placeholder || ""}">`}
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
  $$("#ex-content [data-check]").forEach(b => b.addEventListener("click", () => checkText(ex.number, b.dataset.check)));
  $$("#ex-content [data-goto]").forEach(b => b.addEventListener("click", () => goToStep(+b.dataset.goto + 1)));
  const st = store.exercise(store.state.sujetId, ex.number);
  POLE_ORDER.forEach(p => {
    const input = $("#fld-" + p);
    if (input && st.text[p]) input.value = st.text[p];
  });
  bindMics($("#ex-content"));
}

function checkText(exNum, p) {
  const ex = exDef(exNum);
  const pole = ex.poles[p];
  const input = $("#fld-" + p);
  const text = input ? input.value : "";
  const rule = { ...(pole.rule || {}), prompt: pole.bacPrompt || pole.prompt, modelAnswer: pole.modelAnswer, minLength: pole.minLength };
  const res = evaluateText(text, rule, p);

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
  if (res.missing?.length) html += `<br>🔎 مفاهيم مفتاحية ناقصة: <b>${res.missing.join("، ")}</b>`;
  if (res.forbiddenFound?.length) html += `<br>⛔ كلمة يجب تجنّبها هنا: <b>${res.forbiddenFound.join("، ")}</b>`;
  if (res.empty) html = `لم تُدخل أي إجابة بعد.`;
  fb.innerHTML = html + modelBox(pole);
  if (!res.empty) goToSuccessStep(exNum);
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
        <input class="field" id="pipeline-var-indep" type="text" placeholder="المتغير المستقل...">
        <input class="field" id="pipeline-var-dep" type="text" placeholder="المتغير التابع...">
      </div>
      ${micButton("pipeline-var-indep")}
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
        <input class="field" id="pipeline-hyp1" type="text" placeholder="الفرضية 1">
        <input class="field" id="pipeline-hyp2" type="text" placeholder="الفرضية 2">
      </div>
      <label class="lbl mt-2">استدلال الوثيقة 2:</label>
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
          <div class="card" style="background:var(--bg);border-color:${str.theme === "rose" ? "var(--rose)" : "var(--emerald)"}">
            <strong style="color:${str.theme === "rose" ? "#fb7185" : "var(--emerald-soft)"}">${str.title}</strong>
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
  $$("#ex-content [data-polo-check]").forEach(b => b.addEventListener("click", () => checkPipelinePole(ex.number, b.dataset.poloCheck)));
  const bank = $("#blocks-bank");
  bank.innerHTML = "";
  ex.blocksBank.forEach(blk => {
    const chip = el(`<button class="chip" data-block="${blk.id}">${blk.text}</button>`);
    bank.appendChild(chip);
  });
  $$("#blocks-bank [data-block]").forEach(c => c.addEventListener("click", () => placeBlock(ex, c.dataset.block)));
  $$("#ex-content .slot").forEach(sl => sl.addEventListener("click", () => {
    const stream = +sl.closest("[data-stream]").dataset.stream;
    clearBlock(ex, stream, +sl.dataset.slot);
  }));
  const st = store.exercise(store.state.sujetId, ex.number);
  renderPipeline(ex, st.pipeline);
  Object.entries(st.fields || {}).forEach(([id, val]) => {
    const f = $("#" + id);
    if (f) f.value = val;
  });
  bindMics($("#ex-content"));
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
    const key = str.id === 1 ? "stream1" : "stream2";
    const arr = arrangement[key];
    if (!arr) continue;
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
      (text ? " — أُخذت الإجابات بعين الاعتبار." : " — أدخل نصاً في أحد الحقول أولاً.") +
      modelBox(ex.poles[p]);
  } else {
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
  const st = store.exercise(store.state.sujetId, ex.number);
  const sum = st.scores.N + st.scores.S + st.scores.E + st.scores.W;
  if ($("#live-score")) $("#live-score").textContent = sum.toFixed(2);
  if ($("#live-max")) $("#live-max").textContent = `/ ${ex.max.toFixed(2)}`;
  sujetObj()?.exercises.forEach(e => {
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

/* ---------- Brouillon ---------- */
function detectVerb(text) {
  const n = normalizeArabic(text || "");
  for (const route of BROUILLON_MODE_DATA.verbRouting) {
    if (route.patterns.some(p => n.includes(normalizeArabic(p)))) return route;
  }
  return BROUILLON_MODE_DATA.verbRouting[0];
}

function brouillonPreflight(st, pole) {
  const s = st.scratch.S || "";
  const e = st.scratch.E || "";
  const w = st.scratch.W || "";
  const n = st.scratch.N || "";
  const sNorm = normalizeArabic(s);
  const hasCompare = /بينما|في حين|مقابل|مقارن|بالتوازي|اكثر|اقل/.test(sNorm);
  const msgs = [];
  if (pole === "S" && s && !hasCompare) msgs.push("tu n’as pas mis de comparaison");
  if (pole === "E" && e && !s.trim()) msgs.push("tu as expliqué sans observer");
  if ((pole === "W" || pole === "full") && w && n) {
    const nTokens = normalizeArabic(n).split(" ").filter(t => t.length > 3).slice(0, 4);
    const hit = nTokens.some(t => normalizeArabic(w).includes(t));
    if (!hit) msgs.push("ta conclusion ne répond pas au problème");
  }
  return msgs;
}

function buildDrafts(st) {
  const current = st.scratch[activePole] || "";
  const full = [
    st.scratch.N,
    st.scratch.S ? `وتبين المعطيات أن ${st.scratch.S}` : "",
    st.scratch.E,
    st.scratch.W
  ].filter(Boolean).join("\n");
  return { current, full };
}

function openBrouillon() {
  const ex = exDef(store.state.activeExercise);
  const pole = ex.poles[activePole];
  const st = store.exercise(store.state.sujetId, ex.number);
  const verb = detectVerb(pole.prompt) || detectVerb(pole.bacPrompt);
  const recommended = activePole || verb.recommendedPole;
  const drafts = buildDrafts(st);
  const preC = brouillonPreflight(st, activePole);
  const preF = brouillonPreflight(st, "full");
  const body = `
    <div class="brouillon-shell stack">
      <div class="brouillon-context-card card recommended">
        <strong>ورقة N/S/E/W</strong>
        <p class="small">الفعل المكتشف: ${verb.canonical} — البلوك الأنسب: ${recommended}</p>
        <p class="small"><b>consigne brute BAC</b> : ${pole.bacPrompt || pole.prompt}</p>
        <p class="small"><b>consigne reconstruite</b> : ${pole.prompt}</p>
      </div>
      <div class="brouillon-mini-grid">
        ${POLE_ORDER.map(p => `
          <div>
            <label class="lbl">${p}</label>
            <textarea class="field brouillon-area" id="scratch-${p}">${st.scratch[p] || ""}</textarea>
          </div>`).join("")}
      </div>
      <label class="lbl">حر</label>
      <textarea class="field" id="scratch-free">${st.scratch.free || ""}</textarea>
      <label class="lbl">مسودة القطب الحالي</label>
      <textarea class="field" id="brouillon-draft-current">${drafts.current}</textarea>
      <label class="lbl">المسودة الكاملة</label>
      <textarea class="field" id="brouillon-draft-full">${drafts.full}</textarea>
      <div id="brouillon-preflight-current" class="feedback mid">${preC.join(" — ")}</div>
      <div id="brouillon-preflight-full" class="feedback mid">${preF.join(" — ")}</div>
      <div class="flex">
        <button class="btn btn-emerald btn-sm" id="brouillon-insert-current">إدراج الحالي</button>
        <button class="btn btn-ghost btn-sm" id="brouillon-insert-full">إدراج الكامل</button>
      </div>
    </div>`;
  openDrawer("left", "📝 وضع البوصلة — المسودة", body);

  const persist = () => {
    POLE_ORDER.forEach(p => { st.scratch[p] = $("#scratch-" + p)?.value || ""; });
    st.scratch.free = $("#scratch-free")?.value || "";
    const d = buildDrafts(st);
    if ($("#brouillon-draft-current")) $("#brouillon-draft-current").value = d.current;
    if ($("#brouillon-draft-full")) $("#brouillon-draft-full").value = d.full;
    if ($("#brouillon-preflight-current")) $("#brouillon-preflight-current").textContent = brouillonPreflight(st, activePole).join(" — ");
    if ($("#brouillon-preflight-full")) $("#brouillon-preflight-full").textContent = brouillonPreflight(st, "full").join(" — ");
    store.save();
  };
  ["N", "S", "E", "W", "free"].forEach(k => {
    const node = $("#scratch-" + k);
    if (node) node.addEventListener("input", persist);
  });

  const insert = (which) => {
    persist();
    const warns = brouillonPreflight(st, which === "full" ? "full" : activePole);
    if (warns.length) openModal("Contrôle brouillon", warns.join(" — "));
    const target = $("#fld-" + activePole);
    if (target) {
      const d = buildDrafts(st);
      target.value = which === "full" ? d.full : d.current;
      st.text[activePole] = target.value;
      store.save();
    }
  };
  $("#brouillon-insert-current")?.addEventListener("click", () => insert("current"));
  $("#brouillon-insert-full")?.addEventListener("click", () => insert("full"));
}

/* ---------- Rapport ---------- */
function computeReport() {
  const y = yearObj(store.state.yearId);
  const s = sujetObj();
  const rows = s.exercises.map(e => {
    const st = store.exercise(store.state.sujetId, e.number);
    const tot = st.scores.N + st.scores.S + st.scores.E + st.scores.W;
    return {
      exercise: `ت${e.number}`, label: e.label, max: e.max,
      N: st.scores.N, S: st.scores.S, E: st.scores.E, W: st.scores.W,
      total: Math.round(tot * 100) / 100, filled: st.answeredAny
    };
  });
  const grand = rows.reduce((a, r) => a + r.total, 0);
  const grandMax = rows.reduce((a, r) => a + r.max, 0);
  return {
    title: APP_CONFIG.appTitle, year: y.id, sujet: s.id, sujetTitle: s.title,
    generatedAt: new Date().toISOString(), globalRemaining: store.state.globalRemaining,
    rows, grand: Math.round(grand * 100) / 100, grandMax,
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
      <button class="btn btn-indigo btn-sm" id="btn-print-exam">🖨️ طباعة</button>
    </div>`;
  openModal(`📊 تقرير النتائج — ${rep.rows.length} تمارين`, body);
  $("#dl-csv")?.addEventListener("click", () => download(`boussole4d_${rep.year}_sujet${rep.sujet}.csv`, toCSV(rep)));
  $("#dl-json")?.addEventListener("click", () => download(`boussole4d_${rep.year}_sujet${rep.sujet}.json`, JSON.stringify(rep, null, 2)));
  $("#btn-print-exam")?.addEventListener("click", printExam);
}

function printExam() {
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.open();
  w.document.write(`<html><head><title>نسخة الامتحان</title></head><body>${$("#ex-content")?.innerHTML || ""}</body></html>`);
  w.document.close();
}

function toCSV(rep) {
  const head = ["التمرين", "المسمى", "العلامة القصوى", "N", "S", "E", "W", "المجموع"];
  const lines = [head.join(",")];
  rep.rows.forEach(r => {
    lines.push([`ت${r.exercise.replace(/ت/, "")}`, `"${r.label}"`, r.max, r.N, r.S, r.E, r.W, r.total].join(","));
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
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 100);
}

function confirmReset() {
  openModal(
    "↺ إعادة تعيين الجلسة",
    "سيتم مسح كل التقدم (النتائج والنصوص والاختيارات) لهذه الدورة. هل أنت متأكد؟",
    `<button class="btn btn-rose" id="reset-yes">نعم، امسح الكل</button>`
  );
  $("#reset-yes")?.addEventListener("click", () => {
    store.reset();
    timers.stopAll();
    soundEngine.stop();
    closeModal();
    renderHub();
    showScreen("view-hub");
    $("#global-timer-bar")?.classList.add("hidden");
    toast("تمت إعادة التعيين.", "success");
  });
}

function showPanic() {
  const ex = exDef(store.state.activeExercise);
  const hints = {
    1: "لاحظ سياق التمرين: ما العامل الذي يغيّره المجرِّب (متغير مستقل) وما الظاهرة المقاسة (تابع)؟ صِغ المشكل بعلامة (؟) دون الإجابة هنا.",
    2: "ركّز على الأرقام في المنحنى أو الجدول، قارن بالتوازي ذاكراً القيم الابتدائية والنهائية، وتجنّب كلمة «بسبب» في هذه المرحلة.",
    3: "تخيّل الآلية كشريط فيديو: ارتباط الجزيء → تفعيل البروتينات الغشائية → حركة الشوارد → إفراز المبلغ. صِغ فرضيتك كحلٍّ سببي دون «ربما»."
  };
  openModal("💡 تلميح فكّ القفل الذهني", hints[ex.number] || hints[3]);
}

let modal = null;
function openModal(title, body, extra = "") {
  closeModal();
  modal = el(`<div class="overlay" data-close="overlay">
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-head">
        <strong class="text-amber">${title}</strong>
        <button class="btn btn-ghost btn-sm" data-close="btn">✕</button>
      </div>
      <div class="small">${body}</div>
      ${extra}
      <div class="flex" style="justify-content:flex-end"><button class="btn btn-emerald" data-close="ok">فهمت التلميح، سأواصل الحل</button></div>
    </div></div>`);
  document.body.appendChild(modal);
  $$("[data-close]", modal).forEach(b => b.addEventListener("click", closeModal));
}
function closeModal() { if (modal) modal.remove(); modal = null; }

function openPdfDrawer() {
  const s = sujetObj();
  openDrawer("right", `📄 وثيقة الموضوع ${s.id === 1 ? "الأول" : "الثاني"} المختار فقط (PDF)`, pdfFallbackHTML(s));
}

function openDrawer(side, title, body) {
  closeModal();
  $$(".drawer").forEach(d => d.remove());
  const d = el(`<div class="drawer ${side} open" role="dialog" aria-modal="true">
    <div class="drawer-head"><strong>${title}</strong><button class="btn btn-ghost btn-sm" data-close>✕</button></div>
    <div class="drawer-body">${body}</div></div>`);
  document.body.appendChild(d);
  $$("[data-close]", d).forEach(b => b.addEventListener("click", () => d.remove()));
}

function fmtPts(n) { return `${(+n).toFixed(2)}ن`; }
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
    bar.style.cssText = "position:sticky;top:0;z-index:40;display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.5rem 1.5rem;background:rgba(2,6,23,.9);border-bottom:1px solid var(--line);font-size:.8rem";
    bar.innerHTML = `<span class="text-emerald bold" style="display:flex;align-items:center;gap:.5rem"><span style="width:.5rem;height:.5rem;border-radius:50%;background:var(--emerald);animation:pulse 1.5s infinite"> </span> نمط التركيز والهدوء 4D</span>
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

  if (store.state.sessionActive && store.state.activeScreen === "view-workspace" && sujetObj() && exDef(store.state.activeExercise)) {
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
