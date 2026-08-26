import { setInternalHTML } from "../dom.js";

export function createStrategyScreen(deps) {
  const { $, $$, goHome, helpers, renderOnboarding, showScreen, store, timers, yearObj } = deps;

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
    setInternalHTML(
      $("#view-strategy"),
      `
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
    </div>`
    );

    setPdfPreview(sujetNum);
    updateStrategyTimer();
    calculateStrategicScores();

    $("#strategy-exit").addEventListener("click", goHome);
    $$("#view-strategy [data-preview]").forEach((b) =>
      b.addEventListener("click", () => setPdfPreview(+b.dataset.preview))
    );
    $$("#view-strategy .calc-input").forEach((i) => i.addEventListener("input", calculateStrategicScores));
    $$("#view-strategy [data-confirm]").forEach((b) =>
      b.addEventListener("click", () => confirmChoice(+b.dataset.confirm))
    );
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
    const s = y.sujets.find((suj) => suj.id === n) || y.sujets[0];
    const box = $("#pdf-preview-container");
    if (box && s) setInternalHTML(box, pdfFallbackHTML(s));
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
    if (s1 > s2) {
      rec = `ترجيح الموضوع الأول بفارق +${(s1 - s2).toFixed(2)} نقاط، لتميّز رصيد المسعى العلمي (ت3: 8ن).`;
      gain = ((s1 / 20) * 100).toFixed(1) + "%";
    } else if (s2 > s1) {
      rec = `ترجيح الموضوع الثاني بفارق +${(s2 - s1).toFixed(2)} نقاط، لتميّز رصيد المسعى العلمي (ت3: 8ن).`;
      gain = ((s2 / 20) * 100).toFixed(1) + "%";
    } else {
      rec = "الموضوعان متكافئان تماماً — رجّح موضوع التمرين الثالث الأكثر ضماناً.";
      gain = ((s1 / 20) * 100).toFixed(1) + "%";
    }
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

  return { goToStrategy, pdfFallbackHTML, updateStrategyTimer };
}
