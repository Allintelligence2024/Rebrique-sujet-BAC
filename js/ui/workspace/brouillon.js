/* Noms d'affichage des étapes (les IDs internes N/S/E/W restent inchangés). */
const STEP_LABEL = { N: "اقرأ", S: "اجمع", E: "اربط", W: "اختُم" };

export function createBrouillonController({
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
}) {
  function brouillonPreflight(st, pole) {
    const s = st.scratch.S || "";
    const e = st.scratch.E || "";
    const w = st.scratch.W || "";
    const n = st.scratch.N || "";
    const sNorm = normalizeArabic(s);
    const hasCompare = /بينما|في حين|مقابل|مقارن|بالتوازي|اكثر|اقل/.test(sNorm);
    const msgs = [];
    const selectedDraft = pole === "full" ? [n, s, e, w].filter(Boolean).join("\n") : st.scratch[pole] || "";
    if (!selectedDraft.trim())
      msgs.push(pole === "full" ? "المسودة الكاملة فارغة" : "مسودة هذه الخطوة فارغة");
    if (pole === "S" && s && !hasCompare) msgs.push("لم تكتب مقارنة واضحة بين المعطيات");
    if (pole === "E" && !hasObservationBeforeExplanation(st.scratch))
      msgs.push("فسّرت النتيجة قبل تسجيل الملاحظة");
    if ((pole === "W" || pole === "full") && w && n) {
      const nTokens = normalizeArabic(n)
        .split(" ")
        .filter((t) => t.length > 3)
        .slice(0, 4);
      const hit = nTokens.some((t) => normalizeArabic(w).includes(t));
      if (!hit) msgs.push("الخاتمة لا تجيب عن المشكل العلمي المصاغ");
    }
    return msgs;
  }

  function buildDrafts(st) {
    const activePole = store.state.activeStep ? POLE_ORDER[store.state.activeStep - 1] : POLE_ORDER[0];
    return composeDrafts(st.scratch, activePole);
  }

  function openBrouillon() {
    const ex = exDef(store.state.activeExercise);
    const activePole = POLE_ORDER[(store.state.activeStep || 1) - 1];
    const pole = ex.poles[activePole];
    const st = store.exercise(store.state.yearId, store.state.sujetId, ex.number);
    // detectVerb() résout toujours une route (fallback verbRouting[0] côté presentation.js) :
    // inutile de retenter sur bacPrompt, le second opérande était mort.
    const verb = detectVerb(pole.prompt);
    // activePole vient de POLE_ORDER : ?? couvre un activeStep hors bornes sans masquer "" .
    const recommended = activePole ?? verb.recommendedPole;
    const drafts = buildDrafts(st);
    const preC = brouillonPreflight(st, activePole);
    const preF = brouillonPreflight(st, "full");
    const body = `
    <div class="brouillon-shell stack">
      <div class="brouillon-context-card card recommended">
        <strong>ورقة المسودة · الخطوات الأربع: اقرأ / اجمع / اربط / اختُم</strong>
        <p class="small">الفعل المكتشف: ${verb.canonical} — الخطوة الأنسب: ${STEP_LABEL[recommended] || recommended}</p>
        <p class="small"><b>تعليمة البكالوريا:</b> ${pole.bacPrompt || pole.prompt}</p>
        <p class="small"><b>صياغة التدريب:</b> ${pole.prompt}</p>
      </div>
      <div class="brouillon-mini-grid">
        ${POLE_ORDER.map(
          (p) => `
          <div>
            <label class="lbl" for="scratch-${p}">${STEP_LABEL[p] || p}</label>
            <textarea class="field brouillon-area" id="scratch-${p}">${escapeHTML(st.scratch[p])}</textarea>
          </div>`
        ).join("")}
      </div>
      <label class="lbl" for="scratch-free">ملاحظات حرة</label>
      <textarea class="field" id="scratch-free">${escapeHTML(st.scratch.free)}</textarea>
      <label class="lbl" for="brouillon-draft-current">معاينة مسودة الخطوة الحالية</label>
      <textarea class="field" id="brouillon-draft-current" readonly>${escapeHTML(drafts.current)}</textarea>
      <label class="lbl" for="brouillon-draft-full">معاينة المسودة الكاملة</label>
      <textarea class="field" id="brouillon-draft-full" readonly>${escapeHTML(drafts.full)}</textarea>
      <div id="brouillon-preflight-current" class="feedback mid" role="status" aria-live="polite" tabindex="-1">${preC.join(" — ")}</div>
      <div id="brouillon-preflight-full" class="feedback mid" role="status" aria-live="polite" tabindex="-1">${preF.join(" — ")}</div>
      <div class="flex">
        <button class="btn btn-emerald btn-sm" id="brouillon-insert-current">إدراج الحالي</button>
        <button class="btn btn-ghost btn-sm" id="brouillon-insert-full">إدراج الكامل</button>
      </div>
    </div>`;
    openDrawer("left", "📝 المسودة — الخطوات الأربع", body);

    const persist = () => {
      POLE_ORDER.forEach((p) => {
        st.scratch[p] = $("#scratch-" + p)?.value || "";
      });
      st.scratch.free = $("#scratch-free")?.value || "";
      const d = buildDrafts(st);
      if ($("#brouillon-draft-current")) $("#brouillon-draft-current").value = d.current;
      if ($("#brouillon-draft-full")) $("#brouillon-draft-full").value = d.full;
      if ($("#brouillon-preflight-current"))
        $("#brouillon-preflight-current").textContent = brouillonPreflight(st, activePole).join(" — ");
      if ($("#brouillon-preflight-full"))
        $("#brouillon-preflight-full").textContent = brouillonPreflight(st, "full").join(" — ");
      store.save();
    };

    ["N", "S", "E", "W", "free"].forEach((k) => {
      const node = $("#scratch-" + k);
      if (node) node.addEventListener("input", persist);
    });

    const doInsert = (target, draft, mode) => {
      const existing = target.value;
      if (mode === "append") {
        const glue = existing && !/\s$/.test(existing) ? "\n" : "";
        target.value = existing + glue + draft;
      } else if (mode === "caret") {
        const start = typeof target.selectionStart === "number" ? target.selectionStart : target.value.length;
        const end = typeof target.selectionEnd === "number" ? target.selectionEnd : target.value.length;
        target.value = target.value.slice(0, start) + draft + target.value.slice(end);
        try {
          target.setSelectionRange(start + draft.length, start + draft.length);
        } catch {
          /* noop */
        }
      } else {
        target.value = draft;
      }
      st.text[activePole] = target.value;
      st.answeredAny = Boolean(target.value.trim()) || st.answeredAny;
      store.save();
      closeModal?.();
      target.focus();
      toast?.("أُدرجت المسودة في الإجابة وحُفظت محلياً.", "success");
    };
    const insert = (which) => {
      persist();
      const scope = which === "full" ? "full" : activePole;
      const warns = brouillonPreflight(st, scope);
      const warning = $(`#brouillon-preflight-${which === "full" ? "full" : "current"}`);
      if (warns.length) {
        if (warning) {
          warning.setAttribute("role", "alert");
          warning.focus();
        }
        toast?.("راجع التنبيه المنهجي قبل إدراج المسودة.", "warn");
        return false;
      }
      const target = $("#fld-" + activePole);
      if (!target) return false;
      const d = buildDrafts(st);
      const draft = which === "full" ? d.full : d.current;
      // Default to "append at end" when there is already text — avoids silently
      // destroying student work. A full replace is available via select-all + paste,
      // never via an accidental tap.
      const mode = target.value.trim() ? "append" : "replace";
      doInsert(target, draft, mode);
      return true;
    };
    $("#brouillon-insert-current")?.addEventListener("click", () => insert("current"));
    $("#brouillon-insert-full")?.addEventListener("click", () => insert("full"));
  }

  return { detectVerb, brouillonPreflight, buildDrafts, openBrouillon };
}
