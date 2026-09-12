import { node, replaceContent, setInternalHTML } from "../dom.js";
import { renderStepNavigation } from "../navigation.js";
import { createBrouillonController } from "../workspace/brouillon.js";
import { mayScorePole } from "../workspace/feedback.js";
import { firstEmptyPipelineSlot, PIPELINE_FIELDS } from "../workspace/pipeline-exercise.js";
import { restoreTextDrafts, textEvaluationRule } from "../workspace/text-exercise.js";
import { composeDrafts, hasObservationBeforeExplanation } from "../workspace/scratchpad.js";
import { quickCheckHTML } from "../workspace/quick-check.js";
import { createWorkspacePresentation } from "../workspace/presentation.js";
import { createSimulationController } from "./simulation.js";

export function createWorkspaceController(deps) {
  const {
    $,
    $$,
    METHOD_SCRIPTS,
    POLE,
    POLE_ORDER,
    applyTheme,
    bindMics,
    closeModal,
    debounce,
    escapeHTML,
    evaluatePipeline,
    evaluateText,
    fmtPts,
    goHome,
    helpers,
    micButton,
    normalizeArabic,
    officialCoverageForSubject,
    officialTaskInventoryFor,
    openDrawer,
    openModal,
    pdfFallbackHTML,
    renderHub,
    scoreBac,
    short,
    showScreen,
    store,
    timers,
    toast,
    yearObj,
    sujetObj,
    exDef
  } = deps;
  const { detectVerb, gateChipHTML, poleMethodHint, provenanceHTML, setFeedback } =
    createWorkspacePresentation({
      METHOD_SCRIPTS,
      node,
      normalizeArabic,
      officialTaskInventoryFor,
      replaceContent,
      store,
      levelWord
    });
  const brouillonController = createBrouillonController({
    $,
    store,
    openDrawer,
    closeModal,
    toast,
    escapeHTML,
    normalizeArabic,
    composeDrafts,
    hasObservationBeforeExplanation,
    POLE_ORDER,
    exDef,
    detectVerb
  });
  const simulationController = createSimulationController({
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
  });

  function enterExercise(exNum) {
    store.setActiveExercise(exNum);
    renderWorkspace();
    showScreen("view-workspace");
  }

  function renderWorkspace() {
    if (store.state.sessionMode === "simulation") {
      simulationController.renderSimulation();
      return;
    }
    if (store.isSessionActive()) completionNoticeShown = false;
    const s = sujetObj();
    const ex = exDef(store.state.activeExercise);
    setInternalHTML(
      $("#view-workspace"),
      `
    <div class="app">
      <header class="screen-head">
        <div class="brand">
          <button class="btn btn-rose btn-sm" id="ws-home">الرئيسية</button>
          <div><h2 id="ws-banner">الموضوع ${s.id === 1 ? "الأول" : "الثاني"} | التمرين 0${ex.number}</h2></div>
        </div>
      </header>

      <div class="workspace-tools" aria-label="أدوات الجلسة">
        <button class="btn btn-amber btn-sm" id="ws-panic">✨ أحتاج تلميحاً</button>
        <button class="btn btn-ghost btn-sm" id="ws-brouillon">📝 المسودة</button>
        <button class="btn btn-indigo btn-sm" id="ws-pdf">📄 الموضوع</button>
        <button class="btn btn-rose btn-sm" id="ws-finish">✓ إنهاء التدريب</button>
      </div>

      <div class="feedback mid mb-2" role="note">تدريب منهجي جزئي: بعض الخطوات مبنية لأغراض التدريب، ولا تمثل هذه الواجهة جميع تعليمات الموضوع الرسمي.</div>
      <div class="progress mb-2" id="progress"><span></span></div>
      <div class="card mb-2 method-guide" id="method-scratch-card">
        <strong>المسار المنهجي: أربع خطوات عملية</strong>
        <p class="small text-muted mt-0" id="step-purpose">اقرأ — ما المشكل العلمي الذي يجب أن أؤطّره؟</p>
        <button class="btn btn-ghost btn-sm" id="method-open-scratch">افتح ورقة المسودة (اقرأ · اجمع · اربط · اختُم)</button>
      </div>

      <div class="grid workspace-layout">
        <aside class="card stack">
          <span class="small bold text-muted">تمارين الموضوع المختار:</span>
          <div class="stack">${s.exercises
            .map(
              (e) => `
            <button class="btn btn-ghost quick-exercise" data-switch="${e.number}">
              <span>ت${e.number}: ${e.label} (${e.max}ن)</span><span id="active-exercise-${e.number}" aria-hidden="true">${e.number === ex.number ? "●" : ""}</span>
            </button>`
            )
            .join("")}</div>
          <div class="card center stack">
            <span class="bold text-muted">خطوات التمرين ${ex.number}</span>
            <span class="text-emerald" id="step-text">الخطوة الحالية: اقرأ</span>
          </div>
          <nav class="stepnav" id="stepnav"></nav>
          <div class="feedback mid small guidance-note">يمكنك الانتقال بحرية بين التمارين؛ تُحفظ إجاباتك تلقائياً.</div>
        </aside>
        <section class="card" id="ex-content"></section>
      </div>
    </div>`
    );

    $("#ws-home").addEventListener("click", goHome);
    $("#ws-panic").addEventListener("click", showPanic);
    $("#ws-brouillon").addEventListener("click", () => brouillonController.openBrouillon());
    $("#method-open-scratch").addEventListener("click", () => brouillonController.openBrouillon());
    $("#ws-pdf").addEventListener("click", openPdfDrawer);
    $("#ws-finish").addEventListener("click", confirmFinishSession);
    applyTheme(document.documentElement.dataset.theme);
    $$("#view-workspace [data-switch]").forEach((b) =>
      b.addEventListener("click", () => attemptSwitch(+b.dataset.switch))
    );

    renderStepnav(ex);
    renderExercise(ex);
    goToStep(store.state.activeStep || 1);
    applySessionLock();
  }

  function renderStepnav(ex) {
    renderStepNavigation(
      $("#stepnav"),
      POLE_ORDER.map((pole, index) => ({
        index: index + 1,
        pole,
        label: `${short(ex.poles[pole].prompt)} (${fmtPts(ex.poles[pole].points)})`
      })),
      goToStep
    );
  }

  function renderExercise(ex) {
    const body = $("#ex-content");
    const pending =
      ex.desc && /non relue|بانتظار PDF|في انتظار/i.test(ex.desc + ex.label)
        ? `<div class="feedback mid mb-2">هذا التمرين بانتظار إعادة قراءة المصدر الخارجي — لا يُقدَّم كتصحيح وزاري.</div>`
        : "";
    if (ex.ui === "pipeline") {
      setInternalHTML(body, pending + pipelineHTML(ex));
      bindPipeline(ex);
    } else {
      setInternalHTML(body, pending + textHTML(ex));
      bindText(ex);
    }
  }

  function canScorePole(pole) {
    return mayScorePole(pole, store.state.reviewMode);
  }

  function textHTML(ex) {
    return POLE_ORDER.map((p, i) => {
      const pole = ex.poles[p];
      return `
      <div id="panel-${i + 1}" class="${i === 0 ? "" : "hidden"}">
        <div class="card answer-card">
          <span class="badge badge-${POLE[p].cls} pole-badge">${POLE[p].title}</span>
          <h3 class="bac-consigne">${pole.bacPrompt || pole.prompt}</h3>
          ${provenanceHTML(pole, ex.number, p)}
          <details class="pole-help" id="pole-help-${p}">
            <summary class="small">توجيه هذه الخطوة — القرار، التنفيذ، الفحص <span class="text-muted">(انقر للعرض)</span></summary>
            <div class="pole-help-body">
              <p class="small text-muted mt-0">الهدف المنهجي: ${pole.prompt}</p>
              ${gateChipHTML(p, pole)}
              ${poleMethodHint(p, pole)}
              ${quickCheckHTML()}
            </div>
          </details>
          ${
            pole.minLength >= 100
              ? `<textarea class="field" id="fld-${p}" rows="6" placeholder="${pole.placeholder || ""}"></textarea>`
              : `<input class="field" id="fld-${p}" type="text" placeholder="${pole.placeholder || ""}">`
          }
          ${micButton("fld-" + p)}
          <div class="feedback hidden" role="status" aria-live="polite" aria-atomic="true" id="fb-${p}"></div>
          <div class="flex spread mt-2 step-actions">
            <button class="btn btn-ghost btn-sm" data-goto="${i}">تخطّي</button>
            <button class="btn btn-emerald" data-check="${p}">🔎 فحص تغطية الإجابة</button>
          </div>
        </div>
      </div>`;
    }).join("");
  }

  function bindText(ex) {
    $$("#ex-content [data-check]").forEach((b) =>
      b.addEventListener("click", () => checkText(ex.number, b.dataset.check))
    );
    $$("#ex-content [data-goto]").forEach((b) =>
      b.addEventListener("click", () => goToStep(+b.dataset.goto + 1))
    );
    const st = store.exercise(store.state.yearId, store.state.sujetId, ex.number);
    restoreTextDrafts(POLE_ORDER, st, (id) => $("#" + id));
    POLE_ORDER.forEach((p) => {
      const input = $("#fld-" + p);
      if (!input) return;
      const saveDraft = debounce(() => {
        st.text[p] = input.value;
        if (input.value.trim()) st.answeredAny = true;
        store.save();
      });
      input.addEventListener("input", saveDraft);
    });
    bindMics($("#ex-content"));
  }

  function checkText(exNum, p) {
    if (!store.isSessionActive()) return;
    const ex = exDef(exNum);
    const pole = ex.poles[p];
    const input = $("#fld-" + p);
    const text = input ? input.value : "";
    const needsProblem = p === "W" || /نص علمي|فقرة علمية/.test(pole.bacPrompt || pole.prompt || "");
    const rule = textEvaluationRule(
      pole,
      needsProblem ? ex.poles.N?.modelAnswer || ex.poles.N?.bacPrompt || "" : ""
    );
    const res = evaluateText(text, rule, p);

    const st = store.exercise(store.state.yearId, store.state.sujetId, exNum);
    st.text[p] = text;
    const scoreAllowed = canScorePole(pole);
    st.scores[p] = scoreAllowed ? scoreBac(pole.points, res.fraction) : 0;
    if (!st.answeredAny && text.trim()) st.answeredAny = true;
    store.save();

    const fb = $("#fb-" + p);
    fb.classList.remove("hidden");
    const grade = res.fraction >= 0.75 ? "good" : res.fraction >= 0.45 ? "mid" : "bad";
    fb.className = `feedback ${grade} mt-2`;
    setFeedback(fb, res, pole, scoreAllowed);
    if (!res.empty) goToNextStep();
  }

  function goToNextStep() {
    const idx = POLE_ORDER.indexOf(activePole);
    if (idx < 3) goToStep(idx + 2);
  }

  function pipelineHTML(ex) {
    return `
    <div id="panel-1" class="card">
      <span class="badge badge-emerald pole-badge">${POLE.N.title} (${fmtPts(ex.poles.N.points)})</span>
      <h3 class="mt-0">${ex.poles.N.bacPrompt || ex.poles.N.prompt}</h3>
      ${provenanceHTML(ex.poles.N, ex.number, "N")}
      ${gateChipHTML("N", ex.poles.N)}
      <div class="grid grid-2">
        <input class="field" id="pipeline-var-indep" type="text" placeholder="${ex.poles.N.rule?.hypotheses ? "الفرضية 1: يعود السبب إلى…" : "المتغير المستقل..."}">
        <input class="field" id="pipeline-var-dep" type="text" placeholder="${ex.poles.N.rule?.hypotheses ? "الفرضية 2 (آلية مختلفة)" : "المتغير التابع..."}">
      </div>
      ${micButton("pipeline-var-indep")}
      <div class="feedback hidden" role="status" aria-live="polite" aria-atomic="true" id="fb-N"></div>
      <button class="btn btn-emerald mt-2" data-polo-check="N">فحص خطوة اقرأ</button>
    </div>
    <div id="panel-2" class="card hidden">
      <span class="badge badge-indigo pole-badge">${POLE.S.title} (${fmtPts(ex.poles.S.points)})</span>
      <h3 class="mt-0">${ex.poles.S.bacPrompt || ex.poles.S.prompt}</h3>
      ${provenanceHTML(ex.poles.S, ex.number, "S")}
      ${gateChipHTML("S", ex.poles.S)}
      <div class="card card-inset">
        <label class="lbl">1. الشكل (أ): التحليل المقارن بالتوازي</label>
        <textarea class="field" rows="2" id="pipeline-doc1a"></textarea>
        <label class="lbl">الاستنتاج الخاص بالشكل (أ):</label>
        <input class="field" id="pipeline-doc1a-ded" type="text">
        <label class="lbl mt-2">2. الشكل (ب): شدة الارتباط</label>
        <input class="field" id="pipeline-doc1b" type="text">
        <input class="field mt-1" id="pipeline-doc1b-ded" type="text" placeholder="الاستنتاج الخاص بالشكل (ب):">
      </div>
      <div class="feedback hidden" role="status" aria-live="polite" aria-atomic="true" id="fb-S"></div>
      <button class="btn btn-emerald mt-2" data-polo-check="S">فحص مصفوفة السندات</button>
    </div>
    <div id="panel-3" class="card hidden">
      <span class="badge badge-amber pole-badge">${POLE.E.title} (${fmtPts(ex.poles.E.points)})</span>
      <h3 class="mt-0">${ex.poles.E.bacPrompt || ex.poles.E.prompt}</h3>
      ${provenanceHTML(ex.poles.E, ex.number, "E")}
      <div class="grid grid-2">
        <input class="field" id="pipeline-hyp1" type="text" placeholder="الفرضية 1">
        <input class="field" id="pipeline-hyp2" type="text" placeholder="الفرضية 2">
      </div>
      <label class="lbl mt-2">استدلال الوثيقة 2:</label>
      <textarea class="field" rows="4" id="pipeline-doc2"></textarea>
      <div class="feedback hidden" role="status" aria-live="polite" aria-atomic="true" id="fb-E"></div>
      <button class="btn btn-emerald mt-2" data-polo-check="E">فحص خطوة اربط</button>
    </div>
    <div id="panel-4" class="card hidden">
      <span class="badge badge-purple pole-badge">${POLE.W.title} (${fmtPts(ex.poles.W.points)})</span>
      <h3 class="mt-0">${ex.poles.W.bacPrompt || ex.poles.W.prompt}</h3>
      ${provenanceHTML(ex.poles.W, ex.number, "W")}
      <span class="lbl">📦 بنك العناصر البيوكيميائية:</span>
      <div class="bank" id="blocks-bank"></div>
      <div class="grid grid-2 mt-2">
        ${ex.streams
          .map(
            (str) => `
          <div class="card stream-card-${str.theme === "rose" ? "rose" : "emerald"}">
            <strong class="stream-title-${str.theme === "rose" ? "rose" : "emerald"}">${str.title}</strong>
            <div class="pipeline mt-1" data-stream="${str.id}">
              ${str.slots.map((sl, i) => `<button type="button" class="slot" data-slot="${i}" aria-label="${i + 1}. ${sl}">${i + 1}. ${sl}</button>`).join("")}
            </div>
          </div>`
          )
          .join("")}
      </div>
      <div class="feedback hidden mt-2" role="status" aria-live="polite" aria-atomic="true" id="fb-W"></div>
      <button class="btn btn-emerald mt-2" data-polo-check="W">مصادقة المخطط التحصيلي</button>
    </div>`;
  }

  function bindPipeline(ex) {
    $$("#ex-content [data-polo-check]").forEach((b) =>
      b.addEventListener("click", () => checkPipelinePole(ex.number, b.dataset.poloCheck))
    );
    const bank = $("#blocks-bank");
    replaceContent(
      bank,
      ex.blocksBank.map((blk) =>
        node("button", { className: "chip", text: blk.text, dataset: { block: blk.id } })
      )
    );
    $$("#blocks-bank [data-block]").forEach((c) =>
      c.addEventListener("click", () => placeBlock(ex, c.dataset.block))
    );
    $$("#ex-content .slot").forEach((sl) =>
      sl.addEventListener("click", () => {
        const stream = +sl.closest("[data-stream]").dataset.stream;
        clearBlock(ex, stream, +sl.dataset.slot);
      })
    );
    const st = store.exercise(store.state.yearId, store.state.sujetId, ex.number);
    renderPipeline(ex, st.pipeline);
    Object.entries(st.fields || {}).forEach(([id, val]) => {
      const f = $("#" + id);
      if (f) f.value = val;
    });
    $$("#ex-content input.field, #ex-content textarea.field").forEach((field) => {
      const saveDraft = debounce(() => {
        st.fields[field.id] = field.value;
        if (field.value.trim()) st.answeredAny = true;
        store.save();
      });
      field.addEventListener("input", saveDraft);
    });
    bindMics($("#ex-content"));
  }

  function placeBlock(ex, blockId) {
    if (!store.isSessionActive()) return;
    const st = store.exercise(store.state.yearId, store.state.sujetId, ex.number);
    const slot = firstEmptyPipelineSlot(st.pipeline);
    if (!slot) return;
    st.pipeline[slot.key][slot.index] = blockId;
    renderPipeline(ex, st.pipeline);
    store.save();
  }
  function clearBlock(ex, stream, index) {
    if (!store.isSessionActive()) return;
    const st = store.exercise(store.state.yearId, store.state.sujetId, ex.number);
    const key = stream === 1 ? "stream1" : "stream2";
    if (st.pipeline[key][index]) {
      st.pipeline[key][index] = null;
      renderPipeline(ex, st.pipeline);
      store.save();
    }
  }
  function renderPipeline(ex, arrangement) {
    $$("#blocks-bank [data-block]").forEach((c) => {
      const used = Object.values(arrangement).flat().includes(c.dataset.block);
      c.classList.toggle("used", used);
    });
    for (const str of ex.streams) {
      const key = str.id === 1 ? "stream1" : "stream2";
      const arr = arrangement[key];
      if (!arr) continue;
      $$(`[data-stream="${str.id}"] .slot`).forEach((slotEl, i) => {
        const id = arr[i];
        if (id) {
          const blk = ex.blocksBank.find((b) => b.id === id);
          slotEl.classList.add("filled");
          replaceContent(slotEl, [node("span", { text: blk?.text || "" }), node("span", { text: "🗑️" })]);
        } else {
          slotEl.classList.remove("filled");
          slotEl.textContent = `${i + 1}. ${str.slots[i]}`;
        }
      });
    }
  }

  function checkPipelinePole(exNum, p) {
    if (!store.isSessionActive()) return;
    const ex = exDef(exNum);
    const st = store.exercise(store.state.yearId, store.state.sujetId, exNum);
    const fb = $("#fb-" + p);
    fb.classList.remove("hidden");
    if (p === "N" || p === "S" || p === "E") {
      const ids = PIPELINE_FIELDS[p] || [];
      let joined = "";
      ids.forEach((id) => {
        const f = $("#" + id);
        if (f) {
          st.fields[id] = f.value;
          joined += f.value + " ";
        }
      });
      const text = joined.trim();
      const rule = {
        ...(ex.poles[p].rule || {}),
        prompt: ex.poles[p].bacPrompt || ex.poles[p].prompt,
        modelAnswer: ex.poles[p].modelAnswer,
        minLength: ex.poles[p].minLength
      };
      const res = evaluateText(text, rule, p);
      const scoreAllowed = canScorePole(ex.poles[p]);
      const score = scoreAllowed && text ? scoreBac(ex.poles[p].points, res.fraction) : 0;
      st.scores[p] = score;
      if (!st.answeredAny && text) st.answeredAny = true;
      fb.className = `feedback ${res.fraction >= 0.75 ? "good" : text ? "mid" : "bad"} mt-2`;
      setFeedback(fb, res, ex.poles[p], scoreAllowed);
    } else {
      const res = evaluatePipeline(ex.blocksBank, st.pipeline);
      const scoreAllowed = canScorePole(ex.poles[p]);
      const max = fmtPts(ex.poles[p].points);
      st.scores[p] = scoreAllowed ? scoreBac(ex.poles[p].points, res.fraction) : 0;
      if (!st.answeredAny) st.answeredAny = true;
      fb.className = `feedback ${res.fraction >= 0.75 ? "good" : res.fraction >= 0.4 ? "mid" : "bad"} mt-2`;
      fb.textContent =
        `المخطط: ${res.correct}/${res.total} عنصر صحيح — التقدير: ${levelWord(res.correct / Math.max(1, res.total))}` +
        (res.wrongSlots.length ? `\n⚠️ عناصر في غير موضعها: ${res.wrongSlots.length}` : "");
    }
    store.save();
  }

  let activePole = "N";
  function goToStep(n) {
    const ex = exDef(store.state.activeExercise);
    activePole = POLE_ORDER[n - 1];
    store.setActiveStep(n);
    $$("#ex-content [id^='panel-']").forEach((panel, i) => panel.classList.toggle("hidden", i !== n - 1));
    const bar = $("#progress span");
    if (bar) bar.className = `step-${n}`;
    const stepText = $("#step-text");
    if (stepText) stepText.textContent = `الخطوة الحالية: ${POLE[activePole].short}`;
    const purposes = {
      N: "اقرأ — ما المشكل أو الفرضية التي يجب أن أؤطّرها؟",
      S: "اجمع — ماذا ألاحظ وأقارن في السندات، دون تفسير متسرّع؟",
      E: "اربط — ما الآلية العلمية التي تربط الملاحظات بالنتيجة؟",
      W: "اختُم — هل تجيب خلاصتي عن المشكل وتغطي النتائج الأساسية؟"
    };
    if ($("#step-purpose")) $("#step-purpose").textContent = purposes[activePole];
    $$("#stepnav [data-step]").forEach((b, i) => b.classList.toggle("active", i === n - 1));
    return { ex, pole: activePole };
  }

  const LEVEL_WORDS = [
    [0.85, "ممتاز"],
    [0.7, "جيد"],
    [0.5, "متوسط"],
    [0, "ضعيف"]
  ];
  function levelWord(fraction) {
    const f = Number(fraction) || 0;
    return LEVEL_WORDS.find(([min]) => f >= min)[1];
  }

  function persistVisibleDraft() {
    const exercise = exDef(store.state.activeExercise);
    if (!exercise) return;
    const progress = store.exercise(store.state.yearId, store.state.sujetId, exercise.number);
    if (exercise.ui === "pipeline") {
      $$("#ex-content input.field, #ex-content textarea.field").forEach((field) => {
        progress.fields[field.id] = field.value;
        if (field.value.trim()) progress.answeredAny = true;
      });
    } else {
      for (const pole of POLE_ORDER) {
        const field = $("#fld-" + pole);
        if (!field) continue;
        progress.text[pole] = field.value;
        if (field.value.trim()) progress.answeredAny = true;
      }
    }
    store.save();
  }

  function applySessionLock() {
    const locked = !store.isSessionActive();
    const root = $("#view-workspace");
    if (!root) return;
    $$(
      "#ex-content input, #ex-content textarea, #ex-content [data-check], #ex-content [data-polo-check], #ex-content .chip, #ex-content .slot, #ex-content [data-mic]"
    ).forEach((control) => {
      control.disabled = locked;
    });
    for (const id of ["#ws-panic", "#ws-brouillon", "#method-open-scratch", "#ws-finish"]) {
      const control = $(id);
      if (control) control.disabled = locked;
    }
    let notice = $("#session-complete-notice");
    if (locked && !notice) {
      notice = node("div", {
        className: "feedback bad mb-2",
        text: "انتهت الجلسة وحُفظت الإجابات. يمكنك مراجعتها فقط؛ أُغلقت الكتابة والفحص.",
        attrs: { id: "session-complete-notice", role: "status" }
      });
      $(".workspace-tools")?.insertAdjacentElement("afterend", notice);
    } else if (!locked) {
      notice?.remove();
    }
  }

  let completionNoticeShown = false;
  function showCompletionNotice(reason) {
    if (completionNoticeShown) return;
    completionNoticeShown = true;
    const subject = sujetObj();
    const answered = (subject?.exercises || []).filter(
      (exercise) => store.exercise(store.state.yearId, store.state.sujetId, exercise.number).answeredAny
    ).length;
    const total = subject?.exercises.length || 0;
    const title = reason === "time-expired" ? "انتهى الوقت" : "اكتملت الجلسة";
    openModal(
      title,
      `<p>حُفظت إجاباتك محلياً. أجبت في ${answered} من ${total} تمارين.</p>
       <p class="feedback mid">لا تُعرض علامة بكالوريا: التشخيص الحالي أداة تدريب غير معايرة على نسخ حقيقية كافية.</p>`,
      `<button class="btn btn-indigo" id="completion-home">العودة إلى الرئيسية</button>`
    );
    const continueButton = $("[data-close='ok']");
    if (continueButton) continueButton.textContent = "مراجعة الإجابات";
    $("#completion-home")?.addEventListener("click", () => {
      closeModal();
      goHome();
    });
  }

  function handleSessionCompletion(reason = store.state.sessionEndReason) {
    if (store.state.sessionMode === "simulation") {
      simulationController.handleSessionCompletion(reason);
      return;
    }
    persistVisibleDraft();
    timers.stopAll();
    $("#global-timer-bar")?.classList.add("hidden");
    applySessionLock();
    showCompletionNotice(reason);
  }

  function confirmFinishSession() {
    if (!store.isSessionActive()) return;
    openModal(
      "إنهاء التدريب",
      "سيُوقف المؤقت وتُغلق الكتابة والفحص. ستبقى الإجابات محفوظة للمراجعة.",
      `<button class="btn btn-rose" id="finish-session-yes">نعم، أنهِ الجلسة</button>`
    );
    const cancelButton = $("[data-close='ok']");
    if (cancelButton) cancelButton.textContent = "إلغاء";
    $("#finish-session-yes")?.addEventListener("click", () => {
      persistVisibleDraft();
      store.finishSession("manual");
      closeModal();
      completionNoticeShown = false;
      handleSessionCompletion("manual");
    });
  }

  function attemptSwitch(target) {
    if (target === store.state.activeExercise) return;
    store.setActiveExercise(target);
    renderWorkspace();
    showScreen("view-workspace");
  }

  /* Le bouton « ↺ إعادة تعيين » a été retiré volontairement de la copie :
     aucune destruction du travail d'un élève ne doit être offerte depuis
     l'en-tête de l'épreuve. `store.reset()` reste couvert par
     tests/store.test.mjs ; voir aussi tests/ui.test.mjs (#ws-reset absent). */

  function showPanic() {
    const ex = exDef(store.state.activeExercise);
    const hints = {
      1: "لاحظ سياق التمرين: ما العامل الذي يغيّره المجرِّب (متغير مستقل) وما الظاهرة المقاسة (تابع)؟ صِغ المشكل بعلامة (؟) دون الإجابة هنا.",
      2: "ركّز على الأرقام في المنحنى أو الجدول، قارن بالتوازي ذاكراً القيم الابتدائية والنهائية، وتجنّب كلمة «بسبب» في هذه المرحلة.",
      3: "رتّب الآلية كسلسلة سببية: ارتباط الجزيء → تفعيل البروتينات الغشائية → حركة الشوارد → إفراز المبلغ. صِغ فرضيتك كحلٍّ سببي دون «ربما»."
    };
    openModal("💡 تلميح منهجي", hints[ex.number] || hints[3]);
  }

  function openPdfDrawer() {
    const s = sujetObj();
    openDrawer(
      "right",
      `📄 وثيقة الموضوع ${s.id === 1 ? "الأول" : "الثاني"} المختار فقط (PDF)`,
      pdfFallbackHTML(s)
    );
  }

  return { enterExercise, renderWorkspace, handleSessionCompletion };
}
