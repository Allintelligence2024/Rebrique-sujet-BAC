/* ============================================================
   TRAINING — تدريب الخطوات الأربع (قسم التدريب في المركز، مطوية)
   ------------------------------------------------------------
   فصل صارم بين منتجين:
   - مسار الامتحان (تهدئة ← استراتيجية ← تمرين): بسيط وهادئ.
   - أدوات التدريب (البوابتان، تدريب القرار، الأخطاء، البطاقة):
     هنا فقط، مطوية افتراضياً في المركز — لا تدخل مسار الامتحان.
   المنطق (gates.js) والواجهة (keycard.js) من مصادر مشتركة مُختبرة.
   ============================================================ */

import { elementFromInternalHTML, setInternalHTML } from "./dom.js";
import { keycardHTML } from "./keycard.js";
import {
  DRILL_BANK,
  DRILL_ROUND_SECONDS,
  DRILL_ROUND_SIZE,
  DRILL_UNLOCK_STREAK,
  classifyInstruction,
  createDrillEngine
} from "../domain/method/gates.js";

const GATE_EXAMPLES = [
  "فسّر بالاعتماد على معلوماتك والشكل 3 نتائج التجربة.",
  "اذكر من الوثيقة 2 العناصر المشتركة بين المنحنيين.",
  "عدّد خصائص المناعة الاكتسابية.",
  "علّل النتيجة المسجلة في الوثيقة."
];

function gatesCardHTML() {
  return `
    <div class="card stack" id="gates-card">
      <h3 class="mt-0">قراران قبل الكتابة</h3>
      <p class="small text-muted mt-0">أدخل تعليمة من موضوع حقيقي (أو اختر مثالاً): هل تعتمد على سند أم على المعارف؟ وهل تطلب وصفاً أم تفسيراً؟</p>
      <input class="field" id="gate-input" placeholder="مثال: فسّر بالاعتماد على معلوماتك والشكل 3…" autocomplete="off" />
      <div class="flex gate-examples" id="gate-examples">
        ${GATE_EXAMPLES.map((example) => `<button class="btn btn-ghost btn-sm" data-gate-example="${example}">${example}</button>`).join("")}
      </div>
      <div id="gate-verdict" class="small">اكتب تعليمة أعلاه ليظهر الحكم فوراً.</div>
    </div>`;
}

function mistakesCardHTML() {
  return `
    <div class="card stack" id="mistakes-card">
      <h3 class="mt-0">🧯 خمسة أخطاء تكلّف أكثر من الجهل</h3>
      <p class="small text-muted mt-0">أخطاء شكلية شائعة تُفقد نقاطاً مكتسبة — راجعها قبل التسليم.</p>
      <ol class="small flush-list">
        <li><b>إجابة بلا رقم سؤال</b> — الأسهل تفادياً والأغلى عند التصحيح.</li>
        <li><b>رقم بلا وحدة</b> — المعطى الكمي غير مكتمل بوحدته.</li>
        <li><b>خاتمة غائبة</b> — كل سؤال تفسير ينتظر جملة تجيب حرفياً عن السؤال.</li>
        <li><b>شجرة نسب بحكم واحد</b> — حدّدا السيادة ثم الموقع، الحكمان معاً.</li>
        <li><b>تركيب يعيد الأجزاء دون «ومنه»</b> — الجملة الختامية تُكتب في 30 ثانية وتغلق التمرين.</li>
      </ol>
    </div>`;
}

function drillIdleHTML(drill) {
  const status =
    drill.unlocked || drill.streak >= DRILL_UNLOCK_STREAK
      ? `<span class="text-emerald">✅ المستوى المتقدم مفتوح — حافظ على المهارة بجولات دورية.</span>`
      : `<span>متتالية الجولات الكاملة: <b>${drill.streak}/${DRILL_UNLOCK_STREAK}</b> · أفضل سلسلة: <b>${drill.best}</b> · جولات منجزة: <b>${drill.rounds}</b></span>`;
  return `
    <div id="drill-idle" class="stack">
      <p class="small mt-0">
        <b>الهدف:</b> ${DRILL_ROUND_SIZE} تعليمة قصيرة، لكل واحدة قراران متتاليان:
        <b>سند / معارف</b> ثم — إن ذُكر سند — <b>وصف / تفسير</b>.
        شرط الفتح: <b>12/12 ثلاث مرات متتالية</b> قبل أي تحرير كامل.
      </p>
      <p class="small">${status}</p>
      <div><button class="btn btn-emerald" id="drill-start">ابدأ التدريب (${DRILL_ROUND_SIZE} تعليمة · ${DRILL_ROUND_SECONDS} ثانية)</button></div>
    </div>`;
}

function plusCardHTML() {
  return `
    <div class="card stack" id="plus-card">
      <h3 class="mt-0">🧫🧱 المستوى المتقدم — تطبيقات إضافية (مفتوحة)</h3>
      <p class="small text-muted mt-0">لا تُستدعى كلها في آن واحد — تعود إليها حسب نوع التمرين.
      <b>مستوى متوسط:</b> البطاقتان الأوليان + فحص الخاتمة · <b>مستوى امتياز:</b> الصيغتان الخاصتان وجملة النجاة.</p>
      <div class="stack">
        <details open><summary><b>🟦 مستوى متوسط · الخطوة 0 — افتح (مرة واحدة لكل تمرين)</b></summary>
          <p class="small">بعد قراءة سياق التمرين مباشرة، اكتب أعلى المسودة:
          <b>«الهدف العام: ……»</b> في ≤ 5 كلمات (مثال: «آلية عمل الأنسولين»).
          التركيب النهائي يُبنى على إجابته لهذا السطر بالذات.</p></details>
        <details><summary><b>🟦 متوسط · البنية المتسلسلة + قالب التركيب</b></summary>
          <p class="small">افتّح ← جزء I (1 2 3 4) ← جزء II ← جزء III ← تركيب يُجيب عن «افتح».<br>
          القالب: «من الجزء I نعلم أنّ … ، ومن الجزء II أنّ … ، ومن الجزء III أنّ … ؛
          <b>ومنه</b> [الإجابة عن سطر الهدف العام]». تركيب بلا «ومنه» يضيّف نصف جودته.</p></details>
        <details><summary><b>🟨 امتياز · صيغة الحساب</b></summary>
          <p class="small">الخطوة 2: القانون بالحروف أولًا (Chargaff: %A = %T…) ·
          الخطوة 3: التعويض خطوة خطوة · الخطوة 4: النتيجة <b>بوحدتها</b>.
          القانون بالحروف يُكتب ولو خاب الحساب.</p></details>
        <details><summary><b>🟨 امتياز · صيغة شجرة النسب</b></summary>
          <p class="small">حدثان حاسمان في الخطوة 2: ① أبوان سليمانان ← طفل مصاب (يحسم
          <b>السيادة</b>) ② بنت مصابة من أب سليم / ابن سليم من أم مصابة (يحسم
          <b>الموقع</b>) · الخطوة 3: لماذا يستبعد كل حدث الفرضية المقابلة ·
          الخطوة 4: الحكمان (متنحٍّ/سائد + جسمي/مرتبط بـ X) ثم الأنماط الوراثية بالترميز.
          نمط بلا الحكم الثاني نصف الجودة.</p></details>
        <details><summary><b>🟦 متوسط · فحص الخاتمة — عامّ أم خاصّ؟</b></summary>
          <p class="small">هل تبقى جملتي صحيحة لو غيّرنا اسم الجزيئة/الكائن؟ نعم ← عامّ،
          لا ← خاصّ. إن طُلب الهدف العام: العام أولًا والخاص بين قوسين؛ وإن طُلبت
          الوثيقة بعينها: العكس.</p></details>
        <details><summary><b>🟨 امتياز · جملة النجاة</b></summary>
          <p class="small">بدأتَ تصف والفعل يطلب التفسير ← أكمل فوراً بـ
          <b>«وتفسير ذلك أنّ ……»</b> ثم الآلية، بلا شطب. وبدأتَ تفسّر والفعل يطلب
          الوصف فقط ← لا حيلة سوى الشطب؛ لهذا يُحسم القرار <b>قبل</b> الكتابة.</p></details>
      </div>
    </div>`;
}

export function createTrainingController({ $, $$, store, openModal }) {
  let drill = null;
  let drillTimer = null;
  let drillRemaining = DRILL_ROUND_SECONDS;

  function clearDrillTimer() {
    if (drillTimer) {
      clearInterval(drillTimer);
      drillTimer = null;
    }
  }

  /* Le DOM du hub est re-rendu à chaque navigation, et #drill-start est lié à
     la fois par mount() et par renderDrillIdle() : sans garde-fou, le même
     nœud pouvait recevoir deux écouteurs et lancer deux drills d'un clic.
     On mémorise donc ce qui a déjà été lié, par nœud (WeakMap : pas de fuite
     quand le nœud est remplacé par un re-rendu). */
  const boundClicks = new WeakMap();

  function bindOnce(id, fn) {
    const el = $(id);
    if (!el) return;
    let handlers = boundClicks.get(el);
    if (!handlers) boundClicks.set(el, (handlers = new Set()));
    if (handlers.has(fn)) return;
    handlers.add(fn);
    el.addEventListener("click", fn);
  }

  /* ---------------- البوابتان ---------------- */

  function renderGateVerdict() {
    const input = $("#gate-input");
    const verdict = $("#gate-verdict");
    if (!input || !verdict) return;
    const text = input.value || "";
    if (!text.trim()) {
      setInternalHTML(verdict, "اكتب تعليمة أعلاه ليظهر الحكم فوراً.");
      return;
    }
    const c = classifyInstruction(text);
    const step1 =
      c.mode === "paper"
        ? `<b class="text-emerald">تعليمة تعتمد على سند</b> — ابدأ بقراءة المعطيات.`
        : `<b>تعليمة تعتمد على المعارف</b> — لا سند مذكور؛ انتقل من اقرأ إلى اختُم.`;
    const twoColumns = c.twoColumns
      ? `<div class="small">المسودة بعمودين: <b>[من الوثيقة | من الدرس]</b>.</div>`
      : "";
    const step2 =
      c.mode === "paper"
        ? `<div>نوع المعالجة: ${
            c.gate2 === "film"
              ? `<b class="text-amber">تفسير أو استنتاج</b> — ملاحظة ثم آلية ونتيجة.`
              : `<b class="text-indigo">وصف أو استخراج</b>${c.verbMatched ? "" : " (الفعل غير مصنف؛ ابدأ بالاستخراج)"} — دون تعليل سببي.`
          } الخطوات: <span class="path">${c.pathLabel}</span>.</div>`
        : "";
    setInternalHTML(verdict, `${step1}${twoColumns}${step2}`);
  }

  function bindGatesCard() {
    const input = $("#gate-input");
    if (input) input.addEventListener("input", renderGateVerdict);
    $$("#gate-examples [data-gate-example]").forEach((chip) => {
      chip.addEventListener("click", () => {
        input.value = chip.dataset.gateExample;
        renderGateVerdict();
      });
    });
  }

  /* ---------------- تدريب القرار : drill ---------------- */

  function renderDrillIdle() {
    clearDrillTimer();
    drill = null;
    const box = $("#drill-zone");
    if (box) setInternalHTML(box, drillIdleHTML(store.state.drill));
    bindOnce("#drill-start", startDrill);
  }

  function startDrill() {
    clearDrillTimer();
    drill = createDrillEngine();
    drill.start();
    drillRemaining = DRILL_ROUND_SECONDS;
    // Anchor to wall-clock to avoid drift under tab-throttling (same pattern
    // used by the global/strategy session timers).
    let drillLastTick = Date.now();
    drillTimer = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.max(0, Math.floor((now - drillLastTick) / 1000));
      if (elapsed > 0) {
        drillLastTick += elapsed * 1000;
        drillRemaining = Math.max(0, drillRemaining - elapsed);
      }
      const label = $("#drill-timer");
      if (label)
        label.textContent =
          drillRemaining > 0 ? `⏱ ${drillRemaining} ث` : "⏱ انتهى الوقت المستهدف — أكمل بلا عقوبة";
      if (drillRemaining <= 0) {
        clearInterval(drillTimer);
        drillTimer = null;
      }
    }, 1000);
    renderDrillStep();
  }

  function renderDrillStep(flash = "") {
    const state = drill.view();
    const box = $("#drill-zone");
    if (!box) return;
    const item = state.item;
    const timerLabel =
      drillRemaining > 0 ? `⏱ ${drillRemaining} ث` : "⏱ انتهى الوقت المستهدف — أكمل بلا عقوبة";
    const gate2HTML =
      state.stage === "gate2"
        ? `<div class="flex training-choice-row" id="drill-gate2">
             <button class="btn btn-sm" data-choice="image">وصف أو استخراج</button>
             <button class="btn btn-sm" data-choice="film">تفسير أو استنتاج</button>
           </div>`
        : "";
    const gate1HTML =
      state.stage === "gate1"
        ? `<div class="flex training-choice-row" id="drill-gate1">
             <button class="btn btn-sm" data-choice="paper">تعليمة بسند</button>
             <button class="btn btn-sm" data-choice="head">تعليمة معرفية</button>
           </div>`
        : "";
    setInternalHTML(
      box,
      `
      <div class="flex spread small">
        <b>التعليمة ${state.index + 1}/${state.total}</b>
        <span id="drill-timer">${timerLabel}</span>
      </div>
      <p class="mt-0 mb-2" id="drill-instruction"><b>${item.text}</b></p>
      ${gate1HTML}${gate2HTML}
      <div id="drill-feedback" class="small">${flash}</div>`
    );
    bindDrillStep();
  }

  function renderDrillFeedback(step) {
    const feedback = $("#drill-feedback");
    if (!feedback) return;
    const expectedLabel =
      step.expected === "paper"
        ? "تعليمة بسند"
        : step.expected === "head"
          ? "تعليمة معرفية"
          : step.expected === "film"
            ? "تفسير أو استنتاج"
            : "وصف أو استخراج";
    setInternalHTML(
      feedback,
      `
      <div class="${step.ok ? "text-emerald" : "text-rose"}">${step.ok ? "✅ صحيح" : `❌ خطأ — الصواب: ${expectedLabel}`}</div>
      <div>${step.note || ""}</div>
      <button class="btn btn-ghost btn-sm" id="drill-next">${drill.view().stage === "done" ? "عرض النتيجة ←" : "التالي ←"}</button>`
    );
    bindOnce("#drill-next", () => {
      const after = drill.next();
      if (after.stage === "done") renderDrillSummary();
      else renderDrillStep();
    });
    const gate1 = $("#drill-gate1");
    if (gate1) gate1.querySelectorAll("button").forEach((b) => (b.disabled = true));
    const gate2 = $("#drill-gate2");
    if (gate2) gate2.querySelectorAll("button").forEach((b) => (b.disabled = true));
  }

  function bindDrillStep() {
    $$("#drill-zone [data-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        const choice = button.dataset.choice;
        if (button.closest("#drill-gate2")) {
          renderDrillFeedback(drill.answerGate2(choice));
          return;
        }
        const step = drill.answerGate1(choice);
        if (!step.advance) {
          renderDrillStep(
            `<div class="text-emerald">✅ تعتمد التعليمة على سند — حدّد الآن: وصف أم تفسير؟</div>`
          );
          return;
        }
        renderDrillFeedback(step);
      });
    });
  }

  function renderDrillSummary() {
    clearDrillTimer();
    const result = drill.result();
    const after = store.recordDrillRound(result.perfect);
    let unlockAction = null;
    if (after.streak >= DRILL_UNLOCK_STREAK && !after.unlocked) {
      unlockAction = store.unlockDrill();
    }
    const box = $("#drill-zone");
    if (!box) return;
    const unlockedNow = unlockAction && unlockAction.unlocked;
    const remainingText =
      after.unlocked || unlockedNow
        ? `<span class="text-emerald">المستوى المتقدم متاح الآن — البطاقة الثانية ظاهرة أسفل القسم.</span>`
        : after.perfect
          ? `ممتاز — تبقّى <b>${DRILL_UNLOCK_STREAK - after.streak}</b> جولة كاملة (12/12) لفتح المستوى المتقدم.`
          : `سلسلة الجولات الكاملة عادت إلى الصفر — الجولة التالية بلا أخطاء هي البداية.`;
    setInternalHTML(
      box,
      `
      <div class="stack" id="drill-summary">
        <h3 class="mt-0">نتيجة الجولة: <b class="${result.perfect ? "text-emerald" : "text-amber"}">${result.correct}/${result.total}</b></h3>
        ${unlockedNow ? `<div class="text-emerald"><b>🔓 فُتح المستوى المتقدم</b> — أُنجز الشرط: 12/12 × ${DRILL_UNLOCK_STREAK} متتالية.</div>` : ""}
        <p class="small">${remainingText}</p>
        <p class="small text-muted">متتالية حالية: ${after.streak}/${DRILL_UNLOCK_STREAK} · أفضل سلسلة: ${after.best} · جولات: ${after.rounds}</p>
        <div><button class="btn btn-ghost btn-sm" id="drill-again">جولة أخرى</button></div>
      </div>`
    );
    if (unlockedNow) injectPlusCard();
    bindOnce("#drill-again", renderDrillIdle);
  }

  function injectPlusCard() {
    const host = $("#training-section");
    if (!host || $("#plus-card")) return;
    host.append(elementFromInternalHTML(plusCardHTML()));
  }

  /* ---------------- بطاقة الخطوات الأربع ---------------- */

  function openKeycard() {
    const body = `${keycardHTML()}
      <div class="flex print-actions">
        <button class="btn btn-emerald btn-sm" id="keycard-print-btn">🖨️ طباعة (A4)</button>
      </div>`;
    const modal = openModal?.("🖨️ بطاقة الخطوات الأربع — نسخة الطباعة", body);
    modal?.querySelector("#keycard-print-btn")?.addEventListener("click", () => {
      document.body.classList.add("keycard-printing");
      const cleanup = () => document.body.classList.remove("keycard-printing");
      window.addEventListener("afterprint", cleanup, { once: true });
      window.print?.();
      setTimeout(cleanup, 1000);
    });
  }

  /* ---------------- API du contrôleur ---------------- */

  function html() {
    return `
      <details class="card stack" id="training-details">
        <summary><b>تدريب الخطوات الأربع</b> — قرارا البداية، تدريب سريع، بطاقة قابلة للطباعة <span class="small text-muted">(للتدريب فقط — لا يُفتح يوم الامتحان)</span></summary>
        <div class="stack training-section" id="training-section">
          ${gatesCardHTML()}
          <div class="card stack" id="drill-card">
            <h3 class="mt-0">تدريب القرار السريع (${DRILL_ROUND_SECONDS} ثانية)</h3>
            <div id="drill-zone">${drillIdleHTML(store.state.drill)}</div>
          </div>
          ${mistakesCardHTML()}
          ${store.state.drill.unlocked ? plusCardHTML() : ""}
          <div class="flex justify-center">
            <button class="btn btn-ghost btn-sm" id="keycard-open">🖨️ بطاقة الخطوات الأربع — طباعة A4</button>
          </div>
        </div>
      </details>`;
  }

  function mount() {
    clearDrillTimer();
    bindGatesCard();
    bindOnce("#drill-start", startDrill);
    bindOnce("#keycard-open", openKeycard);
  }

  function teardown() {
    clearDrillTimer();
  }

  return { html, mount, teardown };
}
