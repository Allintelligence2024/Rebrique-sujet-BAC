import { BROUILLON_MODE_DATA } from "../../../data/brouillon.js";
import { node, replaceContent, setInternalHTML } from "../dom.js";
import { renderStepNavigation } from "../navigation.js";
import { createReportController } from "../workspace/report-controller.js";
import { createBrouillonController } from "../workspace/brouillon.js";
import { mayScorePole, poleConfidence } from "../workspace/feedback.js";
import { firstEmptyPipelineSlot, PIPELINE_FIELDS } from "../workspace/pipeline-exercise.js";
import { textEvaluationRule } from "../workspace/text-exercise.js";
import { composeDrafts, hasObservationBeforeExplanation } from "../workspace/scratchpad.js";

export function createWorkspaceController(deps) {
  const {
    $,
    $$,
    APP_CONFIG,
    METHOD_SCRIPTS,
    POLE,
    POLE_ORDER,
    applyTheme,
    bindMics,
    closeModal,
    cycleSound,
    debounce,
    escapeHTML,
    evaluatePipeline,
    evaluateText,
    fmtPts,
    goHome,
    helpers,
    micButton,
    normalizeArabic,
    openAdkar,
    openAtlas,
    openDrawer,
    openModal,
    pdfFallbackHTML,
    renderHub,
    renderOnboarding,
    scoreBac,
    short,
    showScreen,
    soundEngine,
    store,
    timers,
    toast,
    trainingLimitHTML,
    toggleTheme,
    yearObj,
    sujetObj,
    exDef
  } = deps;
  const { showReport } = createReportController({
    $,
    APP_CONFIG,
    POLE_ORDER,
    openModal,
    store,
    trainingLimitHTML,
    yearObj,
    sujetObj
  });

  const brouillonController = createBrouillonController({
    $,
    store,
    openDrawer,
    openModal,
    escapeHTML,
    normalizeArabic,
    composeDrafts,
    hasObservationBeforeExplanation,
    POLE_ORDER,
    exDef,
    detectVerb
  });

  function enterExercise(exNum) {
    store.setActiveExercise(exNum);
    renderWorkspace();
    showScreen("view-workspace");
  }

  function renderWorkspace() {
    const s = sujetObj();
    const ex = exDef(store.state.activeExercise);
    setInternalHTML(
      $("#view-workspace"),
      `
    <div class="app">
      <header class="screen-head">
        <div class="brand">
          <button class="btn btn-rose btn-sm" id="ws-home">الرئيسية</button>
          <div><h2 id="ws-banner">الموضوع ${s.id === 1 ? "الأول" : "الثاني"} | التمرين 0${ex.number}</h2>
          <p class="small text-muted" id="ws-desc">${ex.desc}</p></div>
        </div>
        <div class="pill score-pill"><span class="text-dim">${store.state.reviewMode ? "التشخيص:" : "المؤشر الثانوي:"}</span><span class="mono" id="live-score">${store.state.reviewMode ? "—" : "0.00"}</span><span class="text-dim" id="live-max">${store.state.reviewMode ? "بدون نقاط" : `/ ${ex.max.toFixed(2)}`}</span></div>
      </header>

      <div class="workspace-tools" aria-label="أدوات ثانوية">
        <button class="btn btn-amber btn-sm" id="ws-panic">✨ أحتاج تلميحاً</button>
        <button class="btn btn-ghost btn-sm" id="ws-brouillon">📝 المسودة</button>
        <button class="btn btn-indigo btn-sm" id="ws-pdf">📄 الموضوع</button>
        <details class="more-tools"><summary>أدوات أخرى</summary><div class="flex mt-1">
          <button class="btn-sound" id="ws-sound">🔇 صوت</button>
          <button class="btn-adkar" id="ws-adkar">🕌 أذكار</button>
          <button class="btn btn-ghost btn-sm" id="ws-atlas">🔬 أطلس</button>
          <button class="btn btn-ghost btn-sm" id="ws-review" aria-pressed="${store.state.reviewMode}">${store.state.reviewMode ? "📖 تشخيص فقط" : "🔢 إظهار المؤشر"}</button>
          <button class="btn btn-ghost btn-sm" id="ws-onb">اختيار تمرين</button>
          <button class="btn btn-purple btn-sm" id="ws-report">📊 التقرير</button>
          <button class="btn btn-rose btn-sm" id="ws-reset" title="إعادة تعيين كل الجلسة">↺ تصفير</button>
          <button class="btn btn-ghost btn-sm" data-theme-toggle>☀️ الوضع الفاتح</button>
        </div></details>
      </div>

      <div class="progress mb-2" id="progress"><span></span></div>
      ${trainingLimitHTML(true)}
      <div class="card mb-2 compass-guide" id="boussole-scratch-card">
        <strong>🧭 البوصلة = أربع أسئلة عملية، وليست زينة</strong>
        <p class="small text-muted mt-0" id="pole-purpose">N — ما المشكل العلمي الذي يجب أن أؤطّره؟</p>
        <button class="btn btn-ghost btn-sm" id="boussole-open-scratch">افتح ورقة المسودة (اقرأ · اجمع · اربط · اختُم)</button>
      </div>

      <div class="grid workspace-layout">
        <aside class="card stack">
          <span class="small bold text-muted">تمارين الموضوع المختار:</span>
          <div class="stack">${s.exercises
            .map(
              (e) => `
            <button class="btn btn-ghost" data-switch="${e.number}" style="justify-content:space-between">
              <span>ت${e.number}: ${e.label} (${e.max}ن)</span><span id="lock-${e.number}">🔒</span>
            </button>`
            )
            .join("")}</div>
          <div class="card center stack">
            <div class="flex spread small"><span class="bold text-muted">بوصلة ت${ex.number}</span><span class="text-emerald" id="pole-text">السنّ: اقرأ</span></div>
            <div class="compass">
              <div class="compass-ring"></div>
              <span class="compass-mark" style="top:4px;inset-inline-start:50%;transform:translateX(50%);color:var(--emerald-soft)">1</span>
              <span class="compass-mark" style="bottom:4px;inset-inline-start:50%;transform:translateX(50%);color:var(--blue)">2</span>
              <span class="compass-mark" style="inset-block-start:50%;inset-inline-end:4px;transform:translateY(-50%);color:var(--amber-soft)">3</span>
              <span class="compass-mark" style="inset-block-start:50%;inset-inline-start:4px;transform:translateY(-50%);color:var(--purple-soft)">4</span>
              <div class="compass-seq" id="compass-needle">
                <svg viewBox="0 0 100 100"><polygon points="50,12 44,50 56,50" fill="#10b981"/><polygon points="50,88 44,50 56,50" fill="#3b82f6"/></svg>
              </div>
            </div>
          </div>
          <nav class="stepnav" id="stepnav"></nav>
          <div class="feedback mid small" style="background:rgba(16,185,129,.08)">⚠️ القاعدة: ركّز على كل قطب لحاله، وفُعلت باقي التمارين بعد إجابتك.</div>
        </aside>
        <section class="card" id="ex-content"></section>
      </div>
    </div>`
    );

    $("#ws-home").addEventListener("click", goHome);
    $("#ws-panic").addEventListener("click", showPanic);
    $("#ws-sound").addEventListener("click", () => cycleSound($("#ws-sound")));
    $("#ws-adkar").addEventListener("click", openAdkar);
    $("#ws-brouillon").addEventListener("click", () => brouillonController.openBrouillon());
    $("#boussole-open-scratch").addEventListener("click", () => brouillonController.openBrouillon());
    $("#ws-atlas").addEventListener("click", openAtlas);
    $("#ws-review").addEventListener("click", () => {
      store.setReviewMode(!store.state.reviewMode);
      renderWorkspace();
      toast(
        store.state.reviewMode
          ? "وضع المراجعة: feedback فقط دون نقاط."
          : "وضع التدريب: تظهر نقاط الأقطاب الرسمية فقط.",
        "info"
      );
    });
    $("#ws-onb").addEventListener("click", () => {
      renderOnboarding();
      showScreen("view-onboarding");
    });
    $("#ws-pdf").addEventListener("click", openPdfDrawer);
    $("#ws-report").addEventListener("click", showReport);
    $("#ws-reset").addEventListener("click", confirmReset);
    $$("[data-theme-toggle]").forEach((button) => button.addEventListener("click", toggleTheme));
    applyTheme(document.documentElement.dataset.theme);
    $$("#view-workspace [data-switch]").forEach((b) =>
      b.addEventListener("click", () => attemptSwitch(+b.dataset.switch))
    );

    renderStepnav(ex);
    renderExercise(ex);
    goToStep(store.state.activeStep || 1);
    updateLiveScore();
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

  function confidenceForPole(pole) {
    return poleConfidence(pole, store.state.yearId);
  }

  function provenanceBadge(pole) {
    const confidence = confidenceForPole(pole);
    if (pole.bacPromptSource === "official") {
      return `<span class="badge badge-emerald">رسمي · ص ${pole.bacPromptPage || "؟"} · ${confidence.label}</span>`;
    }
    return `<span class="badge">معاد بناؤه · ${confidence.label} · لا توجد نقطة رقمية</span>`;
  }

  function canScorePole(pole) {
    return mayScorePole(pole, store.state.reviewMode);
  }

  function modelBox(pole) {
    if (!pole.modelAnswer) return "";
    return `<details class="model-box"><summary class="model-summary">إجابة نموذجية للتدريب</summary><div class="model-body"><pre class="model-text">${pole.modelAnswer}</pre></div></details>`;
  }

  function setFeedback(container, res, score, points, pole, showScore = true) {
    // formatEvalFeedback is legacy presentation text. Render it as text, never as executable HTML.
    const feedback = formatEvalFeedback(res, score, points)
      .replace(/<br>/g, "\n")
      .replace(/<[^>]*>/g, "");
    const text = showScore
      ? feedback
      : `مراجعة منهجية فقط — لا توجد نقطة رقمية لهذه السنّ.\n${feedback.replace(/^.*?\n/, "")}`;
    const fragments = [node("span", { text })];
    if (pole?.modelAnswer) {
      const details = node("details", { className: "model-box" });
      details.append(
        node("summary", { className: "model-summary", text: "إجابة نموذجية للتدريب" }),
        node("div", { className: "model-body" })
      );
      details.lastElementChild.append(node("pre", { className: "model-text", text: pole.modelAnswer }));
      fragments.push(details);
    }
    replaceContent(container, fragments);
  }

  function formatEvalFeedback(res, score, points) {
    let html = `تشخيص تغطية الإجابة`;
    if (res.verdict) html += `<br>${res.verdict}`;
    if (res.rubric?.applicable && res.rubric.display) {
      html += `<br><span class="small">ميزان التحليل: ${res.rubric.display}</span>`;
      const skipped = (res.rubric.steps || []).filter((s) => !s.passed).map((s) => s.label);
      if (skipped.length) html += `<br>⏭️ خطوات ناقصة: <b>${skipped.join("، ")}</b>`;
    }
    if (res.missing?.length) html += `<br>🔎 مفاهيم مفتاحية ناقصة: <b>${res.missing.join("، ")}</b>`;
    if (res.forbiddenFound?.length)
      html += `<br>⛔ كلمة يجب تجنّبها هنا: <b>${res.forbiddenFound.join("، ")}</b>`;
    if (res.science?.errors?.length)
      html += `<br>🧪 خطأ علمي: <b>${res.science.errors.map((e) => e.message).join(" — ")}</b>`;
    if (res.document?.gaps?.length) html += `<br>📄 قراءة السند: <b>${res.document.gaps.join(" — ")}</b>`;
    if (res.artifact?.gaps?.length) html += `<br>✏️ مخطط/معادلة: <b>${res.artifact.gaps.join(" — ")}</b>`;
    if (res.hypotheses?.gaps?.length) html += `<br>🔬 الفرضيات: <b>${res.hypotheses.gaps.join(" — ")}</b>`;
    if (res.technique?.gaps?.length) html += `<br>🧫 التقنية: <b>${res.technique.gaps.join(" — ")}</b>`;
    if (res.closing?.applicable && res.taskProfile?.id === "scientific-text" && res.closing.score < 0.5)
      html += `<br>🎯 الخاتمة لا تجيب عن المشكل المطروح في السنّ اقرأ.`;
    if (res.methodology?.missing?.length) html += `<br>🧭 المنهجية: ${res.methodology.missing[0]}`;
    if (res.coach?.tips?.length) html += `<br>📘 من دليل المنهجية: ${res.coach.tips.slice(0, 2).join(" ")}`;
    else if (res.methodology?.score < 0.9 && res.coach?.script?.steps?.length) {
      html += `<br>📘 ${res.coach.script.title}: ${res.coach.script.steps.join(" ← ")}`;
    }
    const pack = BROUILLON_MODE_DATA.sentenceModels.find((s) => {
      const id = res.taskProfile?.id;
      if (id === "analysis") return s.title.includes("تقديم");
      if (id === "explanation") return s.title.includes("تفسير");
      return false;
    });
    if (pack && res.fraction < 0.9) html += `<br>✍️ بدّل: <i>${pack.items[0]}</i>`;
    html += `<br><span class="secondary-score">المؤشر التدريبي الثانوي: <b>${score.toFixed(2)} / ${fmtPts(points)}</b> (${Math.round(res.fraction * 100)}%)</span>`;
    if (res.empty) html = `لم تُدخل أي إجابة بعد.`;
    return html;
  }

  function detectVerb(text) {
    const n = normalizeArabic(text || "");
    for (const route of BROUILLON_MODE_DATA.verbRouting) {
      if (route.patterns.some((p) => n.includes(normalizeArabic(p)))) return route;
    }
    return BROUILLON_MODE_DATA.verbRouting[0];
  }

  function poleMethodHint(poleType, pole) {
    const fallback = { N: "problem", S: "analysis", E: "explanation", W: "scientific-text" };
    const script = METHOD_SCRIPTS[fallback[poleType]] || METHOD_SCRIPTS.synthesis;
    const verb = detectVerb(pole?.bacPrompt || pole?.prompt || "");
    const trap = verb?.warning ? `<div class="atlas-trap">${verb.warning}</div>` : "";
    if (!script) return trap;
    return `<div class="method-script"><strong>${script.title}</strong> — ${script.steps.join(" ← ")}${trap}</div>`;
  }

  function textHTML(ex) {
    return POLE_ORDER.map((p, i) => {
      const pole = ex.poles[p];
      return `
      <div id="panel-${i + 1}" class="${i === 0 ? "" : "hidden"}">
        <div class="card answer-card">
          <span class="badge badge-${POLE[p].cls}" style="margin-bottom:.6rem">${POLE[p].title}</span>
          ${provenanceBadge(pole)}
          <p class="small text-muted mb-1">Objectif méthodologique : ${pole.prompt}</p>
          <h3 class="bac-consigne">${pole.bacPrompt || pole.prompt}</h3>
          ${poleMethodHint(p, pole)}
          ${
            pole.minLength >= 100
              ? `<textarea class="field" id="fld-${p}" rows="6" placeholder="${pole.placeholder || ""}"></textarea>`
              : `<input class="field" id="fld-${p}" type="text" placeholder="${pole.placeholder || ""}">`
          }
          ${micButton("fld-" + p)}
          <div class="feedback hidden" role="status" aria-live="polite" aria-atomic="true" id="fb-${p}"></div>
          <div class="flex mt-2" style="justify-content:space-between">
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
    POLE_ORDER.forEach((p) => {
      const input = $("#fld-" + p);
      if (!input) return;
      if (st.text[p]) input.value = st.text[p];
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

    updateLiveScore();
    const fb = $("#fb-" + p);
    fb.classList.remove("hidden");
    const grade = res.fraction >= 0.75 ? "good" : res.fraction >= 0.45 ? "mid" : "bad";
    fb.className = `feedback ${grade} mt-2`;
    setFeedback(fb, res, st.scores[p], pole.points, pole, scoreAllowed);
    if (!res.empty) goToSuccessStep(exNum);
  }

  function goToSuccessStep() {
    const idx = POLE_ORDER.indexOf(activePole);
    if (idx < 3) goToStep(idx + 2);
  }

  function pipelineHTML(ex) {
    return `
    <div id="panel-1" class="card">
      <span class="badge badge-emerald" style="margin-bottom:.6rem">${POLE.N.title} (${fmtPts(ex.poles.N.points)})</span>
      <h3 class="mt-0">${ex.poles.N.prompt}</h3>
      <div class="grid grid-2">
        <input class="field" id="pipeline-var-indep" type="text" placeholder="${ex.poles.N.rule?.hypotheses ? "الفرضية 1: يعود السبب إلى…" : "المتغير المستقل..."}">
        <input class="field" id="pipeline-var-dep" type="text" placeholder="${ex.poles.N.rule?.hypotheses ? "الفرضية 2 (آلية مختلفة)" : "المتغير التابع..."}">
      </div>
      ${micButton("pipeline-var-indep")}
      <div class="feedback hidden" role="status" aria-live="polite" aria-atomic="true" id="fb-N"></div>
      <button class="btn btn-emerald mt-2" data-polo-check="N">تأكيد السنّ اقرأ (فكّ القفل)</button>
    </div>
    <div id="panel-2" class="card hidden">
      <span class="badge badge-indigo" style="margin-bottom:.6rem">${POLE.S.title} (${fmtPts(ex.poles.S.points)})</span>
      <h3 class="mt-0">${ex.poles.S.prompt}</h3>
      <div class="card" style="background:var(--bg)">
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
      <span class="badge badge-amber" style="margin-bottom:.6rem">${POLE.E.title} (${fmtPts(ex.poles.E.points)})</span>
      <h3 class="mt-0">${ex.poles.E.prompt}</h3>
      <div class="grid grid-2">
        <input class="field" id="pipeline-hyp1" type="text" placeholder="الفرضية 1">
        <input class="field" id="pipeline-hyp2" type="text" placeholder="الفرضية 2">
      </div>
      <label class="lbl mt-2">استدلال الوثيقة 2:</label>
      <textarea class="field" rows="4" id="pipeline-doc2"></textarea>
      <div class="feedback hidden" role="status" aria-live="polite" aria-atomic="true" id="fb-E"></div>
      <button class="btn btn-emerald mt-2" data-polo-check="E">تأكيد السنّ اربط</button>
    </div>
    <div id="panel-4" class="card hidden">
      <span class="badge badge-purple" style="margin-bottom:.6rem">${POLE.W.title} (${fmtPts(ex.poles.W.points)})</span>
      <h3 class="mt-0">${ex.poles.W.prompt}</h3>
      <span class="lbl">📦 بنك العناصر البيوكيميائية:</span>
      <div class="bank" id="blocks-bank"></div>
      <div class="grid grid-2 mt-2">
        ${ex.streams
          .map(
            (str) => `
          <div class="card" style="background:var(--bg);border-color:${str.theme === "rose" ? "var(--rose)" : "var(--emerald)"}">
            <strong style="color:${str.theme === "rose" ? "#fb7185" : "var(--emerald-soft)"}">${str.title}</strong>
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
    const st = store.exercise(store.state.yearId, store.state.sujetId, ex.number);
    const slot = firstEmptyPipelineSlot(st.pipeline);
    if (!slot) return;
    st.pipeline[slot.key][slot.index] = blockId;
    renderPipeline(ex, st.pipeline);
    store.save();
  }
  function clearBlock(ex, stream, index) {
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
      setFeedback(fb, res, score, ex.poles[p].points, ex.poles[p], scoreAllowed);
    } else {
      const res = evaluatePipeline(ex.blocksBank, st.pipeline);
      const scoreAllowed = canScorePole(ex.poles[p]);
      const max = fmtPts(ex.poles[p].points);
      st.scores[p] = scoreAllowed ? scoreBac(ex.poles[p].points, res.fraction) : 0;
      if (!st.answeredAny) st.answeredAny = true;
      fb.className = `feedback ${res.fraction >= 0.75 ? "good" : res.fraction >= 0.4 ? "mid" : "bad"} mt-2`;
      fb.textContent = scoreAllowed
        ? `المخطط: ${st.scores[p].toFixed(2)} / ${max} (${res.correct}/${res.total} عنصر صحيح)` +
          (res.wrongSlots.length ? `\n⚠️ عناصر في غير موضعها: ${res.wrongSlots.length}` : "")
        : `مراجعة منهجية فقط — لا توجد نقطة رقمية لهذه السنّ.\nالمخطط: ${res.correct}/${res.total} عنصر صحيح`;
    }
    store.save();
    updateLiveScore();
  }

  let activePole = "N";
  function goToStep(n) {
    const ex = exDef(store.state.activeExercise);
    activePole = POLE_ORDER[n - 1];
    store.setActiveStep(n);
    $$("#ex-content [id^='panel-']").forEach((panel, i) => panel.classList.toggle("hidden", i !== n - 1));
    const bar = $("#progress span");
    if (bar) bar.style.width = `${(n / 4) * 100}%`;
    const needle = $("#compass-needle");
    if (needle) needle.style.transform = `rotate(${n === 1 ? 0 : n === 2 ? 180 : n === 3 ? 90 : 270}deg)`;
    const poleText = $("#pole-text");
    if (poleText) poleText.textContent = `السنّ: ${POLE[activePole].short}`;
    const purposes = {
      N: "اقرأ — ما المشكل أو الفرضية التي يجب أن أؤطّرها؟",
      S: "اجمع — ماذا ألاحظ وأقارن في السندات، دون تفسير متسرّع؟",
      E: "اربط — ما الآلية العلمية التي تربط الملاحظات بالنتيجة؟",
      W: "اختُم — هل تجيب خلاصتي عن المشكل وتغطي النتائج الأساسية؟"
    };
    if ($("#pole-purpose")) $("#pole-purpose").textContent = purposes[activePole];
    $$("#stepnav [data-step]").forEach((b, i) => b.classList.toggle("active", i === n - 1));
    return { ex, pole: activePole };
  }

  function updateLiveScore() {
    const ex = exDef(store.state.activeExercise);
    if (!ex) return;
    const st = store.exercise(store.state.yearId, store.state.sujetId, ex.number);
    const officialPoles = POLE_ORDER.filter((pole) => ex.poles[pole].bacPromptSource === "official");
    const sum = officialPoles.reduce((total, pole) => total + st.scores[pole], 0);
    const officialMax = officialPoles.reduce((total, pole) => total + ex.poles[pole].points, 0);
    if ($("#live-score")) $("#live-score").textContent = store.state.reviewMode ? "—" : sum.toFixed(2);
    if ($("#live-max"))
      $("#live-max").textContent = store.state.reviewMode
        ? "بدون تنقيط"
        : `/ ${officialMax.toFixed(2)} رسمي فقط`;
    sujetObj()?.exercises.forEach((e) => {
      const lock = $("#lock-" + e.number);
      if (lock)
        lock.textContent = store.exercise(store.state.yearId, store.state.sujetId, e.number).answeredAny
          ? "🔓"
          : "🔒";
    });
  }

  function attemptSwitch(target) {
    const cur = store.state.activeExercise;
    if (target === cur) return;
    if (!store.exercise(store.state.yearId, store.state.sujetId, cur).answeredAny) {
      toast(
        `يجب الإجابة على سؤال واحد على الأقل في التمرين ${cur} لفكّ القفل قبل الانتقال لتمرين آخر!`,
        "warn"
      );
      return;
    }
    store.setActiveExercise(target);
    renderWorkspace();
    showScreen("view-workspace");
  }

  function confirmReset() {
    openModal(
      "↺ إعادة تعيين الجلسة",
      "سيتم مسح كل التقدم (النتائج والنصوص والاختيارات) لهذه الدورة. هل أنت متأكد؟",
      `<button class="btn btn-rose" id="reset-yes">نعم، امسح الكل</button>`
    );
    $("#reset-yes")?.addEventListener("click", () => {
      store.reset();
      timers.stopAll();
      soundEngine.stop();
      closeModal();
      renderHub();
      showScreen("view-hub");
      $("#global-timer-bar")?.classList.add("hidden");
      toast("تمت إعادة التعيين.", "success");
    });
  }

  function showPanic() {
    const ex = exDef(store.state.activeExercise);
    const hints = {
      1: "لاحظ سياق التمرين: ما العامل الذي يغيّره المجرِّب (متغير مستقل) وما الظاهرة المقاسة (تابع)؟ صِغ المشكل بعلامة (؟) دون الإجابة هنا.",
      2: "ركّز على الأرقام في المنحنى أو الجدول، قارن بالتوازي ذاكراً القيم الابتدائية والنهائية، وتجنّب كلمة «بسبب» في هذه المرحلة.",
      3: "تخيّل الآلية كشريط فيديو: ارتباط الجزيء → تفعيل البروتينات الغشائية → حركة الشوارد → إفراز المبلغ. صِغ فرضيتك كحلٍّ سببي دون «ربما»."
    };
    openModal("💡 تلميح فكّ القفل الذهني", hints[ex.number] || hints[3]);
  }

  function openPdfDrawer() {
    const s = sujetObj();
    openDrawer(
      "right",
      `📄 وثيقة الموضوع ${s.id === 1 ? "الأول" : "الثاني"} المختار فقط (PDF)`,
      pdfFallbackHTML(s)
    );
  }

  return { enterExercise, renderWorkspace };
}
