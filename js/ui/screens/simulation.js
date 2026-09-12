import { assertSimulationEligible } from "../../domain/subjects/official-coverage.js";
import { simulationBlockersArabic } from "../coverage-messages.js";
import { setInternalHTML } from "../dom.js";

const escapeHTML = (value = "") =>
  String(value).replace(
    /[&<>'"]/g,
    (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]
  );

function tasksForExercise(inventory, exerciseNumber) {
  return (inventory?.tasks || [])
    .filter((task) => task.exerciseNumber === exerciseNumber)
    .sort((left, right) => left.order - right.order);
}

function taskReviewHTML(task, subject) {
  const references = (task.trainingMappings || [])
    .map((mapping) => {
      const exercise = subject.exercises.find((item) => item.number === mapping.exerciseNumber);
      const pole = exercise?.poles?.[mapping.pole];
      if (!pole?.modelAnswer) return "";
      return `<li><b>${escapeHTML(mapping.pole)}</b> — ${escapeHTML(pole.modelAnswer)}</li>`;
    })
    .filter(Boolean)
    .join("");
  if (!references) {
    return `<div class="feedback mid simulation-review-reference">لا يوجد مرجع تدريبي مراجع لهذه المهمة. لا تُخترع إجابة بعد التسليم.</div>`;
  }
  return `<details class="model-box simulation-review-reference">
    <summary class="model-summary">مراجع التدريب المرتبطة بهذه المهمة</summary>
    <div class="model-body">
      <p class="small text-muted mt-0">هذه عناصر تدريبية مرتبطة بالمهمة، وليست تصحيحاً وزارياً ولا تنقيطاً للنسخة.</p>
      <ul class="small simulation-reference-list">${references}</ul>
    </div>
  </details>`;
}

/** Pure renderer used by browser code and regression tests. */
export function simulationExamHTML({ subject, inventory, activeExercise, completed = false }) {
  const exercise = subject.exercises.find((item) => item.number === activeExercise) || subject.exercises[0];
  const tasks = tasksForExercise(inventory, exercise.number);
  const modeNotice = completed
    ? `<div class="feedback good mb-2" id="simulation-review-notice" role="status">تم التسليم. هذه شاشة إعادة القراءة؛ الإجابات مقفلة والمراجع لا تعرض أي نقطة آلية.</div>`
    : `<div class="feedback bad mb-2" id="simulation-active-notice" role="note">محاكاة صامتة: لا تلميح، لا إجابة نموذجية، لا تشخيص ولا نقطة أثناء الاختبار.</div>`;
  const taskCards = tasks
    .map((task) => {
      const documents = (task.documentRefs || [])
        .map((reference) => `${escapeHTML(reference.id)}، ص ${reference.pages.join("، ")}`)
        .join(" · ");
      return `<article class="card simulation-task" data-official-task="${escapeHTML(task.id)}">
        <div class="flex spread simulation-task-head">
          <span class="badge badge-indigo">${escapeHTML(task.id)}</span>
          <span class="small text-muted">الصفحة ${task.page}</span>
        </div>
        <h3 class="bac-consigne">${escapeHTML(task.prompt)}</h3>
        ${documents ? `<p class="small text-muted">السندات: ${documents}</p>` : ""}
        <label class="lbl" for="simulation-answer-${escapeHTML(task.id)}">إجابتك</label>
        <textarea class="field simulation-answer" id="simulation-answer-${escapeHTML(task.id)}" data-task-answer="${escapeHTML(task.id)}" data-exercise="${task.exerciseNumber}" rows="8"${completed ? " disabled" : ""}></textarea>
        ${completed ? "" : `<button class="btn btn-ghost btn-sm qualitative-check" data-qualitative-for="${escapeHTML(task.id)}">تقييم نوعي</button><div class="feedback small qualitative-feedback" data-qualitative-result="${escapeHTML(task.id)}" aria-live="polite"></div>`}
        ${completed ? taskReviewHTML(task, subject) : ""}
      </article>`;
    })
    .join("");
  return `${modeNotice}
    <div class="grid workspace-layout simulation-layout">
      <aside class="card stack">
        <span class="small bold text-muted">تمارين الموضوع الرسمي:</span>
        <div class="stack">${subject.exercises
          .map(
            (item) => `<button class="btn btn-ghost quick-exercise" data-simulation-exercise="${item.number}">
              <span>ت${item.number}: ${escapeHTML(item.label)}</span>
              <span>${item.number === exercise.number ? "●" : ""}</span>
            </button>`
          )
          .join("")}</div>
      </aside>
      <section class="stack" id="simulation-task-list" aria-label="المهام الرسمية">
        ${taskCards || `<div class="feedback bad">لا توجد مهمة رسمية لهذا التمرين؛ بيانات المحاكاة غير صالحة.</div>`}
      </section>
    </div>`;
}

export function createSimulationController(deps) {
  const {
    $,
    $$,
    closeModal,
    goHome,
    officialCoverageForSubject,
    officialTaskInventoryFor,
    openModal,
    showScreen,
    store,
    timers,
    toast,
    yearObj,
    sujetObj
  } = deps;
  let completionNoticeShown = false;

  function context() {
    const year = yearObj(store.state.yearId);
    const subject = sujetObj();
    const inventory = officialTaskInventoryFor(store.state.yearId, store.state.sujetId);
    const report = officialCoverageForSubject(year, subject);
    return { year, subject, inventory, report };
  }

  function restoreAnswers(inventory) {
    for (const task of inventory.tasks) {
      const input = $(`[data-task-answer="${task.id}"]`);
      if (!input) continue;
      const progress = store.exercise(store.state.yearId, store.state.sujetId, task.exerciseNumber);
      input.value = progress.officialTaskAnswers[task.id] || "";
    }
  }

  function restoreFreeAnswers(subject) {
    for (const exercise of subject.exercises) {
      const input = $(`[data-exercise-free="${exercise.number}"]`);
      if (!input) continue;
      const progress = store.exercise(store.state.yearId, store.state.sujetId, exercise.number);
      input.value = progress.freeAnswer || "";
    }
  }

  function persistAnswers() {
    $$("#view-workspace [data-task-answer]").forEach((input) => {
      const progress = store.exercise(
        store.state.yearId,
        store.state.sujetId,
        Number(input.dataset.exercise)
      );
      progress.officialTaskAnswers[input.dataset.taskAnswer] = input.value;
      if (input.value.trim()) progress.answeredAny = true;
    });
    $$("#view-workspace [data-exercise-free]").forEach((input) => {
      const progress = store.exercise(
        store.state.yearId,
        store.state.sujetId,
        Number(input.dataset.exercise)
      );
      progress.freeAnswer = input.value;
      if (input.value.trim()) progress.answeredAny = true;
    });
    store.save();
  }

  function qualitativeLabel(value) {
    const length = String(value || "").trim().length;
    if (!length) return "ضعيف — C — ابدأ بكتابة إجابتك.";
    if (length < 80) return "يحتاج إلى تطوير — C — أضف الملاحظة والشرح والنتيجة.";
    if (length < 220) return "جيد — B — إجابة مفهومة وقابلة للتحسين.";
    return "ممتاز — A — إجابة مفصلة ومنظمة.";
  }

  function bindQualitativeChecks(freeMode = false) {
    $$("#view-workspace [data-qualitative-for]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.qualitativeFor;
        const input = $(`[data-task-answer="${id}"]`);
        const output = $(`[data-qualitative-result="${id}"]`);
        if (output) output.textContent = qualitativeLabel(input?.value);
      });
    });
    $$("#view-workspace [data-qualitative-free]").forEach((button) => {
      button.addEventListener("click", () => {
        const exNum = Number(button.dataset.qualitativeFree);
        const input = $(`[data-exercise-free="${exNum}"]`);
        const output = $(`[data-qualitative-result-free="${exNum}"]`);
        if (output) output.textContent = qualitativeLabel(input?.value);
      });
    });
  }

  /* Filet de sécurité : si l'inventaire officiel est absent, partiel ou non
     éligible, la simulation « silencieuse » est impossible. On bascule sur le
     mode lecture — en l'annonçant explicitement, jamais à l'insu de l'élève. */
  const FALLBACK_NOTICE = {
    missing:
      "لا يوجد جرد رسمي لمهام هذا الموضوع: وضع المحاكاة غير متاح. تعرض هذه الشاشة الموضوع للقراءة وكتابة إجابات حرة فقط.",
    partial:
      "جرد المهام الرسمية لهذا الموضوع غير مكتمل: وضع المحاكاة غير متاح حتى اكتماله. تعرض هذه الشاشة الموضوع للقراءة وكتابة إجابات حرة فقط.",
    blocked:
      "لم يستوفِ هذا الموضوع شروط الأهلية للمحاكاة. تعرض هذه الشاشة الموضوع للقراءة وكتابة إجابات حرة فقط."
  };

  function renderBacReadingMode(subject, fallbackReason = "") {
    const pdf = subject?.pdfLocalUrl;
    const fallbackNotice = FALLBACK_NOTICE[fallbackReason]
      ? `<div class="feedback mid mb-2" role="status">${FALLBACK_NOTICE[fallbackReason]}</div>`
      : "";
    setInternalHTML(
      $("#view-workspace"),
      `<div class="app app-wide bac-reading-mode" data-session-mode="simulation">
        <header class="screen-head">
          <div class="brand">
            <button class="btn btn-rose btn-sm" id="bac-reading-home">الرئيسية</button>
            <div>
              <h2>وضع BAC · الموضوع ${subject.id === 1 ? "الأول" : "الثاني"}</h2>
              <p>قراءة الموضوع المختار فقط — بدون تصحيح أو إجابة نموذجية</p>
            </div>
          </div>
          <span class="badge badge-indigo">PDF محلي</span>
        </header>
        ${fallbackNotice}
        <div class="feedback mid mb-2" role="note">هذا الموضوع منفصل عن الموضوع الثاني. لا توجد حلول أو إجابات نموذجية في هذا الوضع. إجاباتك تُحفظ محلياً لكل تمرين.</div>
        <section class="card center stack bac-reading-card">
          <div class="pdf-reader-cover"><span class="pdf-reader-icon" aria-hidden="true">📄</span><strong>موضوع البكالوريا جاهز</strong><p class="small text-muted">اقرأ الموضوع ثم اكتب إجابتك بدون تنقيط آلي.</p></div>
          ${pdf ? `<a class="btn btn-indigo btn-block pdf-open" href="${pdf}" target="_blank" rel="noopener noreferrer">📄 فتح الموضوع المختار</a><a class="small" href="${pdf}" download>⬇️ تنزيل PDF</a>` : `<p class="feedback bad">لا يوجد PDF محلي لهذا الموضوع.</p>`}
        </section>
        <section class="stack bac-answers" aria-label="إجابات الموضوع">
          ${subject.exercises
            .map((exercise) => {
              return `<article class="card stack"><h3>إجابة التمرين ${exercise.number}: ${escapeHTML(exercise.label)}</h3><textarea class="field simulation-answer" data-exercise-free="${exercise.number}" data-exercise="${exercise.number}" rows="8"></textarea><button class="btn btn-ghost btn-sm qualitative-check" data-qualitative-free="${exercise.number}">تقييم نوعي</button><div class="feedback small qualitative-feedback" data-qualitative-result-free="${exercise.number}" aria-live="polite"></div></article>`;
            })
            .join("")}
        </section>
      </div>`
    );
    $("#bac-reading-home")?.addEventListener("click", goHome);
    restoreFreeAnswers(subject);
    $$("#view-workspace [data-task-answer], #view-workspace [data-exercise-free]").forEach((input) =>
      input.addEventListener("input", persistAnswers)
    );
    bindQualitativeChecks(true);
    showScreen("view-workspace");
  }

  function renderSimulation() {
    const { subject, inventory, report } = context();
    if (!subject) {
      denyInvalidSimulation(report);
      return;
    }
    if (!inventory || !report.simulationEligible) {
      renderBacReadingMode(subject, inventory ? "partial" : "missing");
      return;
    }
    try {
      assertSimulationEligible(report);
    } catch {
      renderBacReadingMode(subject, "blocked");
      return;
    }
    const completed = store.state.sessionStatus === "completed";
    setInternalHTML(
      $("#view-workspace"),
      `<div class="app app-wide" data-session-mode="simulation" data-review-mode="${completed}">
        <header class="screen-head">
          <div class="brand">
            <button class="btn btn-rose btn-sm" id="simulation-home">الرئيسية</button>
            <div>
              <h2>المحاكاة الرسمية · الموضوع ${subject.id === 1 ? "الأول" : "الثاني"}</h2>
              <p>${completed ? "إعادة القراءة بعد التسليم" : "اختبار جارٍ — الأدوات التعليمية محجوبة"}</p>
            </div>
          </div>
          <span class="badge ${completed ? "badge-emerald" : "badge-rose"}">${completed ? "مُسلَّم" : "محاكاة"}</span>
        </header>
            <div class="workspace-tools" aria-label="أدوات المحاكاة">
              ${completed ? "" : `<button class="btn btn-rose btn-sm" id="simulation-finish">✓ تسليم النسخة</button>`}
            </div>
        ${simulationExamHTML({
          subject,
          inventory,
          activeExercise: store.state.activeExercise,
          completed
        })}
      </div>`
    );
    restoreAnswers(inventory);
    bind(completed);
    showScreen("view-workspace");
  }

  function bind(completed) {
    $("#simulation-home")?.addEventListener("click", goHome);
    $("#simulation-finish")?.addEventListener("click", confirmFinish);
    $$("#view-workspace [data-simulation-exercise]").forEach((button) =>
      button.addEventListener("click", () => {
        if (!completed) persistAnswers();
        store.setActiveExercise(Number(button.dataset.simulationExercise));
        renderSimulation();
      })
    );
    if (!completed) {
      $$("#view-workspace [data-task-answer]").forEach((input) =>
        input.addEventListener("input", persistAnswers)
      );
      bindQualitativeChecks();
    }
  }

  function denyInvalidSimulation(report) {
    timers.stopAll();
    if (store.isSessionActive()) store.leaveSession();
    toast(`المحاكاة مرفوضة: ${simulationBlockersArabic(report?.blockers)}`, "error");
    goHome();
  }

  function confirmFinish() {
    if (!store.isSessionActive()) return;
    openModal(
      "تسليم المحاكاة",
      "بعد التسليم تُقفل الإجابات نهائياً وتبدأ إعادة القراءة. لا توجد نقطة آلية.",
      `<button class="btn btn-rose" id="simulation-finish-yes">نعم، سلّم النسخة</button>`
    );
    $("#simulation-finish-yes")?.addEventListener("click", () => {
      persistAnswers();
      store.finishSession("manual");
      timers.stopAll();
      closeModal();
      completionNoticeShown = false;
      renderSimulation();
      showCompletionNotice("manual");
    });
  }

  function showCompletionNotice(reason) {
    if (completionNoticeShown) return;
    completionNoticeShown = true;
    openModal(
      reason === "time-expired" ? "انتهى وقت المحاكاة" : "تم تسليم المحاكاة",
      `<p>حُفظت الإجابات محلياً وأُغلقت الكتابة.</p>
       <p class="feedback mid">تبدأ الآن إعادة القراءة دون نقطة آلية. المراجع المعروضة تدريبية وليست تصحيحاً وزارياً.</p>`
    );
    const closeButton = $("[data-close='ok']");
    if (closeButton) closeButton.textContent = "راجع الإجابات";
  }

  function handleSessionCompletion(reason = store.state.sessionEndReason) {
    persistAnswers();
    timers.stopAll();
    $("#global-timer-bar")?.classList.add("hidden");
    renderSimulation();
    showCompletionNotice(reason);
  }

  return { renderSimulation, handleSessionCompletion, persistAnswers };
}
