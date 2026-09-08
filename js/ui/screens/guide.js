/* ============================================================
   GUIDE SCREEN — ساس الهدوء (écran de calme, flux examen)
   ------------------------------------------------------------
   Règle de simplicité : cet écran appartient au flux d'examen.
   Trois éléments maximum : respiration, plan de session, suite.
   Toute l'aide méthodologique (بوابتان، drill، بطاقة…) vit dans
   la section تدريب الخطوات الأربع du hub (js/ui/training.js) — jamais ici.
   ============================================================ */

import { setInternalHTML } from "../dom.js";

export function createGuideScreen(deps) {
  const { $, adkarHTML, examMinutesForYear, formatDuration, goHome, goToStrategy } = deps;

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
          <p class="small text-emerald">جلسة التأطير النفسي والتنفس الموجه — بكالوريا ${y.calendarYear || y.id}</p></div>
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
          <p class="mt-0 mb-0"><b>الخطوات الأربع:</b>
          <span class="text-emerald">اقرأ</span> ← <span class="text-indigo">اجمع</span> ←
          <span class="text-amber">اربط</span> ← <span class="text-purple">اختُم</span>
          <span class="small text-muted"> — خطوة واحدة في كل مرة، والقرار قبل الكتابة.</span></p>
        </div>
        <div class="card center stack">
          <p class="small text-muted mt-0 mb-0">مدة الاختبار الرسمية لهذه الشعبة: <b>${formatDuration(
            examMinutesForYear(y)
          )}</b>. خطتك هنا: <b>25 د</b> لتصفح الموضوع وتقدير الثقة، ثم تطبيق الخطوات الأربع.</p>
          <p class="small text-amber mt-0 mb-0">هذا التدريب جزئي ولا يعرض جميع تعليمات الموضوع الرسمي.</p>
        </div>
        <div class="flex justify-end">
          <button class="btn btn-emerald" id="guide-next">أنا مستعد — تصفح الموضوع واختر خلال 25 دقيقة</button>
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
