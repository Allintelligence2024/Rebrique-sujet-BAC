import { setInternalHTML } from "../dom.js";

export function createOnboardingScreen(deps) {
  const { $, $$, enterExercise, goHome, store, sujetObj, yearObj, timeFor } = deps;

  function renderOnboarding() {
    const y = yearObj(store.state.yearId);
    const s = sujetObj();
    const num = s.id;
    setInternalHTML(
      $("#view-onboarding"),
      `
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
        ${s.exercises
          .map(
            (e) => `
          <div class="card stack">
            <div class="flex spread"><strong class="text-emerald">${e.number}. ${e.label} (${e.max} نقاط)</strong><span class="badge">${timeFor(e.max)}</span></div>
            <p class="small text-muted mt-0">${e.desc}</p>
          </div>`
          )
          .join("")}
      </div>
      <div class="stack mt-3">
        <h3 class="small text-muted mb-1">اختر التمرين الذي ستبدأ بحله الآن:</h3>
        <div class="grid grid-cards">
          ${s.exercises
            .map(
              (e) => `
            <button class="card btn-ghost" style="text-align:right" data-ex="${e.number}">
              <div class="flex spread"><span class="badge">ت${e.number} (${e.max}ن)</span><span>←</span></div>
              <strong class="block mt-1">${e.label}</strong>
              <p class="small text-muted mt-1">كلمات مفتاحية، مقارنة بالتوازي، مصادقة ومخطط.</p>
            </button>`
            )
            .join("")}
        </div>
      </div>
    </div>`
    );
    $("#onb-home").addEventListener("click", goHome);
    $$("#view-onboarding [data-ex]").forEach((b) =>
      b.addEventListener("click", () => enterExercise(+b.dataset.ex))
    );
  }

  return { renderOnboarding };
}
