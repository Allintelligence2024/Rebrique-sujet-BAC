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
    </div>`
    );

    $("#guide-exit").addEventListener("click", goHome);
    $("#guide-next").addEventListener("click", goToStrategy);
  }

  return { renderGuide };
}
