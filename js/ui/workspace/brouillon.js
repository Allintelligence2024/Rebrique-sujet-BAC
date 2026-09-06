/* Noms d'affichage des pôles (les IDs internes N/S/E/W restent inchangés). */
const POLE_TOOTH = { N: "اقرأ", S: "اجمع", E: "اربط", W: "اختُم" };

export function createBrouillonController({
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
}) {
  function brouillonPreflight(st, pole) {
    const s = st.scratch.S || "";
    const e = st.scratch.E || "";
    const w = st.scratch.W || "";
    const n = st.scratch.N || "";
    const sNorm = normalizeArabic(s);
    const hasCompare = /بينما|في حين|مقابل|مقارن|بالتوازي|اكثر|اقل/.test(sNorm);
    const msgs = [];
    if (pole === "S" && s && !hasCompare) msgs.push("tu n’as pas mis de comparaison");
    if (pole === "E" && !hasObservationBeforeExplanation(st.scratch))
      msgs.push("tu as expliqué sans observer");
    if ((pole === "W" || pole === "full") && w && n) {
      const nTokens = normalizeArabic(n)
        .split(" ")
        .filter((t) => t.length > 3)
        .slice(0, 4);
      const hit = nTokens.some((t) => normalizeArabic(w).includes(t));
      if (!hit) msgs.push("ta conclusion ne répond pas au problème");
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
    const verb = detectVerb(pole.prompt) || detectVerb(pole.bacPrompt);
    const recommended = activePole || verb.recommendedPole;
    const drafts = buildDrafts(st);
    const preC = brouillonPreflight(st, activePole);
    const preF = brouillonPreflight(st, "full");
    const body = `
    <div class="brouillon-shell stack">
      <div class="brouillon-context-card card recommended">
        <strong>ورقة المسودة · اقرأ / اجمع / اربط / اختُم</strong>
        <p class="small">الفعل المكتشف: ${verb.canonical} — البلوك الأنسب: ${POLE_TOOTH[recommended] || recommended}</p>
        <p class="small"><b>consigne brute BAC</b> : ${pole.bacPrompt || pole.prompt}</p>
        <p class="small"><b>consigne reconstruite</b> : ${pole.prompt}</p>
      </div>
      <div class="brouillon-mini-grid">
        ${POLE_ORDER.map(
          (p) => `
          <div>
            <label class="lbl">${POLE_TOOTH[p] || p}</label>
            <textarea class="field brouillon-area" id="scratch-${p}">${escapeHTML(st.scratch[p])}</textarea>
          </div>`
        ).join("")}
      </div>
      <label class="lbl">حر</label>
      <textarea class="field" id="scratch-free">${escapeHTML(st.scratch.free)}</textarea>
      <label class="lbl">مسودة السنّ الحالية</label>
      <textarea class="field" id="brouillon-draft-current">${escapeHTML(drafts.current)}</textarea>
      <label class="lbl">المسودة الكاملة</label>
      <textarea class="field" id="brouillon-draft-full">${escapeHTML(drafts.full)}</textarea>
      <div id="brouillon-preflight-current" class="feedback mid">${preC.join(" — ")}</div>
      <div id="brouillon-preflight-full" class="feedback mid">${preF.join(" — ")}</div>
      <div class="flex">
        <button class="btn btn-emerald btn-sm" id="brouillon-insert-current">إدراج الحالي</button>
        <button class="btn btn-ghost btn-sm" id="brouillon-insert-full">إدراج الكامل</button>
      </div>
    </div>`;
    openDrawer("left", "📝 وضع البوصلة — المسودة", body);

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

    const insert = (which) => {
      persist();
      const warns = brouillonPreflight(st, which === "full" ? "full" : activePole);
      if (warns.length) openModal("Contrôle brouillon", warns.join(" — "));
      const target = $("#fld-" + activePole);
      if (target) {
        const d = buildDrafts(st);
        target.value = which === "full" ? d.full : d.current;
        st.text[activePole] = target.value;
        store.save();
      }
    };
    $("#brouillon-insert-current")?.addEventListener("click", () => insert("current"));
    $("#brouillon-insert-full")?.addEventListener("click", () => insert("full"));
  }

  return { detectVerb, brouillonPreflight, buildDrafts, openBrouillon };
}
