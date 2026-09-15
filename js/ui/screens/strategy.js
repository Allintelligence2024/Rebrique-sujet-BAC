import { setInternalHTML } from "../dom.js";
import { officialTaskInventoryFor } from "../../../data/official-tasks.js";
import { mountPdfViewers, pdfViewerHTML } from "../pdf-viewer.js";
import { assertSimulationEligible, examOpenable } from "../../domain/subjects/official-coverage.js";
import { officialTaskCountArabic, simulationBlockersArabic, taskCountArabic } from "../coverage-messages.js";

/** « الموضوع الأول » / « الموضوع الثاني » — jamais un « 01 » collé au mot. */
function subjectOrdinal(id) {
  return Number(id) === 2 ? "الموضوع الثاني" : "الموضوع الأول";
}

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

  /* Le sujet s'affiche dans l'application : les PDF sont suivis dans le dépôt
     (subjects/**) et servis par la même origine, ce que la CSP autorise
     (frame-src 'self'). Le lien externe ne reste qu'en source de repli. */
  function pdfFallbackHTML(subject) {
    return pdfViewerHTML(subject);
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
          <div><h2>اختر موضوع الامتحان</h2>
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
                    `<button class="btn ${index === 0 ? "btn-indigo" : "btn-purple"} btn-sm" data-preview="${subject.id}">${subjectOrdinal(subject.id)}</button>`
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
        confirmChoice(+button.dataset.confirm, button.dataset.sessionMode || "bac")
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
    const officialTasks = (officialTaskInventoryFor(store.state.yearId, subject.id)?.tasks || []).filter(
      (task) => task.promptSource === "official"
    ).length;
    const inventoryNote = coverage.freeAnswerEligible
      ? `<p class="small text-muted inventory-note" id="inventory-note-${subject.id}">وضع الإجابة الحرة: بلا تصحيح آلي ولا نقطة. الأسئلة الرسمية منقولة في شاشة الاختبار، والموضوع الكامل في الملف.</p>`
      : `<p class="small text-muted inventory-note" id="inventory-note-${subject.id}">جرد المهام: ${taskCountArabic(coverage.knownTaskCount)}، منها ${officialTaskCountArabic(officialTasks)}.</p>`;
    return `
    <div class="card stack subject-card" data-subject-coverage="${coverage.inventoryStatus}" data-simulation-eligible="${coverage.simulationEligible}" data-exam-openable="${examOpenable(coverage)}" data-answer-mode="${coverage.freeAnswerEligible ? "free" : "inventory"}">
      <div>
        <div class="flex spread subject-card-head">
          <span class="badge badge-${theme}">${subjectOrdinal(subject.id)}</span>
          <span class="mono small text-dim">${total.toFixed(2)} نقطة</span>
        </div>
        <div class="stack mt-1">${inputs}</div>
        <div class="flex spread small mt-1 subject-estimate">
          <span class="bold text-muted">مجموع تقدير ${subjectOrdinal(subject.id)}:</span><span class="mono text-${theme}" id="s${subject.id}-total"></span>
        </div>
      </div>
      <div class="stack subject-mode-actions">
        <button class="btn btn-block btn-${theme}" data-confirm="${subject.id}" data-session-mode="bac">ابدأ الامتحان</button>
        ${inventoryNote}
      </div>
    </div>`;
  }

  function setPdfPreview(subjectId) {
    const year = yearObj(store.state.yearId);
    const subject = year?.sujets.find((item) => item.id === subjectId) || year?.sujets[0];
    const box = $("#pdf-preview-container");
    if (box && subject) {
      setInternalHTML(box, pdfFallbackHTML(subject));
      mountPdfViewers(box);
    }
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
    recommendation.textContent = `يميل تقديرك الذاتي إلى ${subjectOrdinal(best.subject.id)} بفارق ${(
      (best.fraction - second.fraction) *
      100
    ).toFixed(1)} نقطة مئوية.`;
    gain.textContent = `${(best.fraction * 100).toFixed(1)}% ثقة ذاتية`;
  }

  function confirmChoice(sujetNum, mode = "bac") {
    if (!store.isSessionActive()) return;
    const year = yearObj(store.state.yearId);
    const subject = year?.sujets.find((item) => item.id === sujetNum);
    if (!subject) return;
    // Filet de sécurité : un sujet sans inventaire exploitable reste fermé,
    // sauf armature « copie libre » — là, rien n'est noté mais l'épreuve est
    // réelle : le sujet se lit dans l'application et l'élève rédige.
    const coverage = officialCoverageForSubject(year, subject);
    if (coverage.simulationEligible) {
      try {
        assertSimulationEligible(coverage);
      } catch {
        toast(`الامتحان مرفوض: ${simulationBlockersArabic(coverage.blockers)}`, "error");
        return;
      }
    } else if (!coverage.freeAnswerEligible) {
      toast(`الامتحان مرفوض: ${simulationBlockersArabic(coverage.blockers)}`, "error");
      return;
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
