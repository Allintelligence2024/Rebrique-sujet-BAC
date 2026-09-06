/* ============================================================
   GUIDE SCREEN — ساس الهدوء (écran de calme, flux examen)
   ------------------------------------------------------------
   Règle de simplicité : cet écran appartient au flux d'examen.
   Trois éléments maximum : respiration, plan de session, suite.
   Toute l'aide méthodologique (بوابتان، drill، بطاقة…) vit dans
   la section تدريب المفتاح du hub (js/ui/training.js) — jamais ici.
   ============================================================ */

import { setInternalHTML } from "../dom.js";

export function createGuideScreen(deps) {
  const { $, adkarHTML, goHome, goToStrategy } = deps;

  function renderGuide(y) {
    setInternalHTML(
      $("#view-guide"),
      `
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
            <h3 class="mt-0">أنت تمتلك كافة المكتسبات، ركّز فقط على خطواتك الأربع.</h3>
            <p class="small text-muted">خذ شهيقاً 4 ثوانٍ، احبس 4 ثوانٍ، ثم ازفر ببطء 4 ثوانٍ لطرد التوتر.</p>
          </div>
        </div>
        ${adkarHTML()}
        <div class="card center stack">
          <p class="mt-0 mb-0"><b>المفتاح:</b>
          <span class="text-emerald">اقرأ</span> ← <span class="text-indigo">اجمع</span> ←
          <span class="text-amber">اربط</span> ← <span class="text-purple">اختُم</span>
          <span class="small text-muted"> — سنّ واحدة في كل مرة، والقرار قبل الكتابة.</span></p>
        </div>
        <div class="card center stack">
          <p class="small text-muted mt-0 mb-0">خطتك الآن: <b>25 د</b> تصفح الموضوع وحاسبة الاختيار ←
          ثم التمارين سنّاً سنّاً ← و<b>10 ثوانٍ</b> من الفحص قبل كل سؤال موالي.</p>
        </div>
        <div class="flex" style="justify-content:flex-end">
          <button class="btn btn-emerald" id="guide-next">♞ أنا هادئ ومستعد | تصفح PDF وحاسبة الاختيار (25 دقيقة)</button>
        </div>
      </div>
      <footer class="screen-foot">ثقة واحدة تكفي: خطوة في كل مرة.</footer>
    </div>`
    );

    $("#guide-exit").addEventListener("click", goHome);
    $("#guide-next").addEventListener("click", goToStrategy);
  }

  return { renderGuide };
}
