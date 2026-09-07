import { assertSimulationEligible } from "../../domain/subjects/official-coverage.js";
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
          <span class="small text-muted">الصفحة ${task.page} · ${task.maxPoints} ن</span>
        </div>
        <h3 class="bac-consigne">${escapeHTML(task.prompt)}</h3>
        ${documents ? `<p class="small text-muted">السندات: ${documents}</p>` : ""}
        <label class="lbl" for="simulation-answer-${escapeHTML(task.id)}">إجابتك</label>
        <textarea class="field simulation-answer" id="simulation-answer-${escapeHTML(task.id)}" data-task-answer="${escapeHTML(task.id)}" data-exercise="${task.exerciseNumber}" rows="8"${completed ? " disabled" : ""}></textarea>
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
    openDrawer,
    openModal,
    pdfFallbackHTML,
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
    store.save();
  }

  function renderSimulation() {
    const { subject, inventory, report } = context();
    if (!subject || !inventory) {
      denyInvalidSimulation(report);
      return;
    }
    try {
      assertSimulationEligible(report);
    } catch {
      denyInvalidSimulation(report);
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
          <button class="btn btn-indigo btn-sm" id="simulation-pdf">📄 الموضوع الرسمي</button>
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
    $("#simulation-pdf")?.addEventListener("click", openPdf);
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
    }
  }

  function denyInvalidSimulation(report) {
    timers.stopAll();
    if (store.isSessionActive()) store.leaveSession();
    toast(`المحاكاة مرفوضة: ${(report?.blockers || ["coverage-unknown"]).join(", ")}`, "error");
    goHome();
  }

  function openPdf() {
    const subject = sujetObj();
    openDrawer("right", "📄 الموضوع الرسمي المختار", pdfFallbackHTML(subject));
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
