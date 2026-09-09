import { assertSimulationEligible } from "../../domain/subjects/official-coverage.js";
import { simulationBlockersArabic } from "../coverage-messages.js";
import { setInternalHTML } from "../dom.js";

export function createStrategyScreen(deps) {
  const {
    $,
    $$,
    enterExercise,
    goHome,
    helpers,
    officialCoverageForSubject,
    showScreen,
    store,
    timers,
    toast,
    yearObj
  } = deps;

  function goToStrategy() {
    renderStrategy(store.state.sujetId || 1);
    timers.startStrategy();
    showScreen("view-strategy");
  }

  function restoreStrategy() {
    renderStrategy(store.state.sujetId || 1);
    if (store.state.strategyRemaining > 0) timers.startStrategy();
    showScreen("view-strategy");
  }

  function pdfFallbackHTML(subject) {
    if (subject?.pdfAvailable && subject.pdf) {
      const bytes = Number(subject.pdfBytes);
      const size =
        Number.isFinite(bytes) && bytes > 0 ? `${(bytes / 1024 / 1024).toFixed(2)} م.ب` : "غير معروف";
      const filename = subject.pdfFilename || `sujet-${subject.id || "bac"}.pdf`;
      const revision = subject.pdf.startsWith("data:")
        ? null
        : globalThis.APP_ASSET_REVISIONS?.[subject.pdf]?.sha256;
      const pdfUrl = revision ? `${subject.pdf}?v=${revision.slice(0, 12)}` : subject.pdf;
      return `<div class="center stack preview-empty pdf-download-card">
      <p class="small text-muted">لا يُنزّل الملف تلقائياً. نزّله فقط عندما تريد قراءة الموضوع؛ ويمكن استعماله دون اتصال بعد أول تنزيل.</p>
      <p class="small"><strong>حجم الملف:</strong> <span class="mono" data-pdf-bytes="${Number.isFinite(bytes) ? bytes : ""}">${size}</span></p>
      <a class="btn btn-indigo pdf-download" href="${pdfUrl}" target="_blank" rel="noopener noreferrer" download="${filename}">⬇️ تنزيل وفتح ملف الموضوع — ${size}</a>
    </div>`;
    }
    if (subject?.pdfExternalUrl) {
      return `<div class="center stack preview-empty">
      <p class="small text-muted">الملف غير مرفق بالتطبيق وحجمه غير متاح؛ افتح صفحة المصدر للتحقق منه.</p>
      <a class="btn btn-indigo" href="${subject.pdfExternalUrl}" target="_blank" rel="noopener noreferrer">📄 فتح المصدر الخارجي</a>
    </div>`;
    }
    return `<div class="center stack preview-empty">
    <p class="small text-muted">لا يوجد ملف موضوع متاح لهذه الدورة في التطبيق.</p>
  </div>`;
  }

  function renderStrategy(sujetNum) {
    const year = yearObj(store.state.yearId);
    if (!year) return;
    setInternalHTML(
      $("#view-strategy"),
      `
    <div class="app app-wide">
      <header class="screen-head">
        <div class="brand">
          <button class="btn btn-rose btn-sm" id="strategy-exit">✕ إلغاء وخروج</button>
          <div class="brand-icon" aria-hidden="true">٤</div>
          <div><h2>اختر موضوع التدريب</h2>
          <p class="small text-muted">تصفّح وقدّر ثقتك في كل تمرين — 25 د.</p></div>
        </div>
        <div class="pill"><span class="text-dim">وقت الاختيار:</span><span class="mono" id="strategy-timer">25:00</span></div>
      </header>

      <div class="feedback mid mb-2" role="note">هذه حاسبة تقدير ذاتي للتدريب، وليست توقعاً لعلامة البكالوريا.</div>
      <div class="feedback bad mb-2" role="note">وضع المحاكاة الرسمية مقفل افتراضياً، ولا يُفتح إلا بعد جرد جميع الأسئلة والوثائق والسلالم وربطها كاملاً.</div>
      <div class="grid">
        <div class="card card-vign">
          <div class="flex spread strategy-preview-head">
            <span class="text-indigo bold small">📄 الموضوعان الرسميان:</span>
            <div class="flex gap-2">
              ${year.sujets
                .map(
                  (subject, index) =>
                    `<button class="btn ${index === 0 ? "btn-indigo" : "btn-purple"} btn-sm" data-preview="${subject.id}">الموضوع 0${subject.id}</button>`
                )
                .join("")}
            </div>
          </div>
          <div class="strategy-pdf-container" id="pdf-preview-container"></div>
        </div>
        <div class="grid grid-2">
          ${year.sujets
            .map((subject, index) => calcCard(year, subject, index === 0 ? "indigo" : "purple"))
            .join("")}
        </div>
        <div class="card strategy-summary">
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
    $$("#view-strategy [data-preview]").forEach((button) =>
      button.addEventListener("click", () => setPdfPreview(+button.dataset.preview))
    );
    $$("#view-strategy .calc-input").forEach((input) =>
      input.addEventListener("input", calculateStrategicScores)
    );
    $$("#view-strategy [data-confirm]").forEach((button) =>
      button.addEventListener("click", () =>
        confirmChoice(+button.dataset.confirm, button.dataset.sessionMode || "training")
      )
    );
  }

  function coverageHTML(report, subjectId) {
    const id = `coverage-s${subjectId}`;
    if (report.simulationEligible) {
      return `<div class="feedback good small" id="${id}" data-coverage-status="complete">✓ جرد رسمي مكتمل — المحاكاة مؤهلة تقنياً.</div>`;
    }
    if (report.inventoryStatus === "missing") {
      return `<div class="feedback bad small" id="${id}" data-coverage-status="missing">جرد الأسئلة الرسمية غير منجز — المحاكاة ممنوعة.</div>`;
    }
    const mapped = `${report.mappedTaskCount}/${report.knownTaskCount}`;
    const scope = report.inventoriedExerciseNumbers.join("، ") || "—";
    return `<div class="feedback mid small" id="${id}" data-coverage-status="${report.inventoryStatus}">جرد جزئي: رُبطت ${mapped} من التعليمات المعروفة (التمارين: ${scope}). تغطية الموضوع الكاملة غير معروفة؛ المحاكاة ممنوعة.</div>`;
  }

  function calcCard(year, subject, theme) {
    const total = subject.exercises.reduce((sum, exercise) => sum + exercise.max, 0);
    const coverage = officialCoverageForSubject(year, subject);
    const inputs = subject.exercises
      .map((exercise) => {
        const initial = Math.round(exercise.max * 0.75 * 4) / 4;
        return `<div class="flex spread"><label class="small" for="strategy-s${subject.id}-e${exercise.number}">ت${exercise.number}: ${exercise.label} (${exercise.max}ن)</label><input class="field calc-input" id="strategy-s${subject.id}-e${exercise.number}" data-subject="${subject.id}" data-exercise="${exercise.number}" data-max="${exercise.max}" type="number" min="0" max="${exercise.max}" step="0.25" value="${initial}"></div>`;
      })
      .join("");
    return `
    <div class="card stack subject-card" data-subject-coverage="${coverage.inventoryStatus}" data-simulation-eligible="${coverage.simulationEligible}">
      <div>
        <div class="flex spread subject-card-head">
          <span class="badge badge-${theme}">الموضوع 0${subject.id}</span>
          <span class="mono small text-dim">${total.toFixed(2)} نقطة</span>
        </div>
        ${coverageHTML(coverage, subject.id)}
        <div class="stack mt-1">${inputs}</div>
        <div class="flex spread small mt-1 subject-estimate">
          <span class="bold text-muted">مجموع تقدير الموضوع ${subject.id}:</span><span class="mono text-${theme}" id="s${subject.id}-total"></span>
        </div>
      </div>
      <div class="stack subject-mode-actions">
        <button class="btn btn-block btn-${theme}" data-confirm="${subject.id}" data-session-mode="training">ابدأ التدريب الموجّه</button>
        <button class="btn btn-block btn-ghost" data-confirm="${subject.id}" data-session-mode="simulation"${coverage.simulationEligible ? "" : " disabled"} aria-describedby="coverage-s${subject.id}">ابدأ المحاكاة الرسمية</button>
      </div>
    </div>`;
  }

  function setPdfPreview(subjectId) {
    const year = yearObj(store.state.yearId);
    const subject = year?.sujets.find((item) => item.id === subjectId) || year?.sujets[0];
    const box = $("#pdf-preview-container");
    if (box && subject) setInternalHTML(box, pdfFallbackHTML(subject));
    $$("#view-strategy [data-preview]").forEach((button, index) => {
      const active = +button.dataset.preview === subject?.id;
      const color = active ? (index === 0 ? "btn-indigo" : "btn-purple") : "btn-ghost";
      button.className = `btn btn-sm ${color}`;
    });
  }

  function updateStrategyTimer() {
    const timer = $("#strategy-timer");
    if (timer) timer.textContent = helpers.fmt(store.state.strategyRemaining);
  }

  function subjectEstimate(subject) {
    return subject.exercises.reduce((sum, exercise) => {
      const input = $(`[data-subject="${subject.id}"][data-exercise="${exercise.number}"]`);
      const value = Number.parseFloat(input?.value || "0");
      return sum + (Number.isFinite(value) ? Math.min(exercise.max, Math.max(0, value)) : 0);
    }, 0);
  }

  function calculateStrategicScores() {
    const year = yearObj(store.state.yearId);
    if (!year) return;
    const estimates = year.sujets.map((subject) => {
      const total = subject.exercises.reduce((sum, exercise) => sum + exercise.max, 0);
      const estimate = subjectEstimate(subject);
      const output = $(`#s${subject.id}-total`);
      if (output) output.textContent = `${estimate.toFixed(2)} / ${total.toFixed(2)}`;
      return { subject, estimate, total, fraction: total ? estimate / total : 0 };
    });
    const sorted = [...estimates].sort((a, b) => b.fraction - a.fraction);
    const best = sorted[0];
    const second = sorted[1];
    const recommendation = $("#recommendation-text");
    const gain = $("#recommendation-gain");
    if (!best || !recommendation || !gain) return;
    if (!second || Math.abs(best.fraction - second.fraction) < 0.0001) {
      recommendation.textContent = "التقديران متكافئان — اختر الموضوع الذي تفهم وثائقه وتعليماته بوضوح أكبر.";
      gain.textContent = `${(best.fraction * 100).toFixed(1)}% ثقة ذاتية`;
      return;
    }
    recommendation.textContent = `يميل تقديرك الذاتي إلى الموضوع ${best.subject.id} بفارق ${(
      (best.fraction - second.fraction) *
      100
    ).toFixed(1)} نقطة مئوية.`;
    gain.textContent = `${(best.fraction * 100).toFixed(1)}% ثقة ذاتية`;
  }

  function confirmChoice(sujetNum, mode = "training") {
    if (!store.isSessionActive()) return;
    const year = yearObj(store.state.yearId);
    const subject = year?.sujets.find((item) => item.id === sujetNum);
    if (!subject) return;
    if (mode === "simulation") {
      const report = officialCoverageForSubject(year, subject);
      try {
        assertSimulationEligible(report);
      } catch {
        toast(`المحاكاة مرفوضة: ${simulationBlockersArabic(report.blockers)}`, "error");
        return;
      }
    }
    store.activateSubjectMode(sujetNum, mode);
    timers.stopStrategy();
    enterExercise(1);
    $("#global-timer-bar")?.classList.remove("hidden");
  }

  return { goToStrategy, restoreStrategy, pdfFallbackHTML, updateStrategyTimer };
}
