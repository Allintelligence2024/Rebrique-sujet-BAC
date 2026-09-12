import { setInternalHTML } from "../dom.js";
import { assertSimulationEligible } from "../../domain/subjects/official-coverage.js";
import { simulationBlockersArabic } from "../coverage-messages.js";

export function createStrategyScreen(deps) {
  const {
    $,
    $$,
    enterExercise,
    goHome,
    helpers,
    officialCoverageForSubject,
    openModal,
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
    // L'aperçu stratégique renvoie à la source externe (dzexams) : pendant la
    // phase de choix, aucun téléchargement n'est proposé, l'élève doit ouvrir
    // le sujet sans l'archiver. Le seul lien « ⬇️ تنزيل » de l'application vit
    // dans le mode lecture BAC (screens/simulation.js), où l'élève a précisément
    // besoin du PDF pour travailler hors ligne.
    if (subject?.pdfExternalUrl) {
      return `<div class="pdf-reader stack">
        <div class="pdf-reader-cover" role="status">
          <span class="pdf-reader-icon" aria-hidden="true">📄</span>
          <strong>الموضوع متاح على المصدر الخارجي</strong>
          <p class="small text-muted">تُفتح صفحة الموضوع على dzexams في نافذة مستقلة — فتح المصدر الخارجي.</p>
        </div>
        <a class="btn btn-indigo btn-block pdf-open" href="${subject.pdfExternalUrl}" target="_blank" rel="noopener noreferrer">📄 فتح المصدر الخارجي (dzexams)</a>
      </div>`;
    }
    if (subject?.pdfLocalUrl) {
      return `<div class="pdf-reader stack">
        <div class="pdf-reader-cover" role="status">
          <span class="pdf-reader-icon" aria-hidden="true">📄</span>
          <strong>ملف الموضوع جاهز للقراءة</strong>
        </div>
        <a class="btn btn-indigo btn-block pdf-open" href="${subject.pdfLocalUrl}" target="_blank" rel="noopener noreferrer">📄 فتح الموضوع المختار وقراءته</a>
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

  function calcCard(year, subject, theme) {
    const total = subject.exercises.reduce((sum, exercise) => sum + exercise.max, 0);
    const coverage = officialCoverageForSubject(year, subject);
    const inputs = subject.exercises
      .map((exercise) => {
        const initial = Math.round(exercise.max * 0.75 * 4) / 4;
        return `<div class="flex spread"><label class="small" for="strategy-s${subject.id}-e${exercise.number}">ت${exercise.number}: ${exercise.label} (${exercise.max}ن)</label><input class="field calc-input" id="strategy-s${subject.id}-e${exercise.number}" data-subject="${subject.id}" data-exercise="${exercise.number}" data-max="${exercise.max}" type="number" min="0" max="${exercise.max}" step="0.25" value="${initial}"></div>`;
      })
      .join("");
    const simDisabled = coverage.simulationEligible ? "" : "disabled";
    const guardMsg = coverage.simulationEligible
      ? ""
      : `<p class="small text-muted simulation-guard-note" id="simulation-guard-${subject.id}">المحاكاة ممنوعة: ${simulationBlockersArabic(coverage.blockers)}</p>`;
    return `
    <div class="card stack subject-card" data-subject-coverage="${coverage.inventoryStatus}" data-simulation-eligible="${coverage.simulationEligible}">
      <div>
        <div class="flex spread subject-card-head">
          <span class="badge badge-${theme}">الموضوع 0${subject.id}</span>
          <span class="mono small text-dim">${total.toFixed(2)} نقطة</span>
        </div>
        <div class="stack mt-1">${inputs}</div>
        <div class="flex spread small mt-1 subject-estimate">
          <span class="bold text-muted">مجموع تقدير الموضوع ${subject.id}:</span><span class="mono text-${theme}" id="s${subject.id}-total"></span>
        </div>
      </div>
      <div class="stack subject-mode-actions">
        <button class="btn btn-block btn-${theme}" data-confirm="${subject.id}" data-session-mode="training">ابدأ التدريب المنهجي</button>
        <button class="btn btn-block btn-ghost btn-sm" data-confirm="${subject.id}" data-session-mode="simulation" ${simDisabled}>ابدأ وضع BAC</button>
        ${guardMsg}
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
      const coverage = officialCoverageForSubject(year, subject);
      try {
        assertSimulationEligible(coverage);
      } catch {
        toast(`المحاكاة ممنوعة: ${simulationBlockersArabic(coverage.blockers)}`, "error");
        return;
      }
    }
    store.activateSubjectMode(sujetNum, mode);
    timers.stopStrategy();
    // Writing starts here, in both modes: the official clock begins. In
    // simulation, activateSubjectMode has just reset the remaining time to the
    // full duration, so the strategy/breathing phase is never debited.
    timers.startGlobal();
    enterExercise(1);
    $("#global-timer-bar")?.classList.remove("hidden");
  }

  return { goToStrategy, restoreStrategy, pdfFallbackHTML, updateStrategyTimer };
}
