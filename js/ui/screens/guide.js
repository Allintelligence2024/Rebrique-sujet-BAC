/* ============================================================
   GUIDE SCREEN — ساس الهدوء + البوابتان + شحذ المفتاح (drill)
   ------------------------------------------------------------
   - البوابتان: تصنيف فوري لأي تعليمة (ورقة/رأس ثم صورة/فيلم).
   - شحذ المفتاح: 12 تعليمة في الجولة، شرط الخروج 12/12 ثلاث
     مرات متتالية ← فتح المفتاح+ (محفوظ في store عبر الجلسات).
   - المفتاح+ (البطاقة الثانية): لا يُعرض قبل تحقق الشرط.
   الحدود: التوجيه هنا منهجي بحت — لا سلم تنقيط رسمياً.
   ============================================================ */

import { elementFromInternalHTML, setInternalHTML } from "../dom.js";
import {
  DRILL_ROUND_SECONDS,
  DRILL_ROUND_SIZE,
  DRILL_UNLOCK_STREAK,
  DRILL_BANK,
  classifyInstruction,
  createDrillEngine
} from "../../domain/method/gates.js";

const GATE_EXAMPLES = [
  "فسّر بالاعتماد على معلوماتك والشكل 3 نتائج التجربة.",
  "اذكر من الوثيقة 2 العناصر المشتركة بين المنحنيين.",
  "عدّد خصائص المناعة الاكتسابية.",
  "علّل النتيجة المسجلة في الوثيقة."
];

function gatesCardHTML() {
  return `
    <div class="card stack" id="gates-card">
      <h3 class="mt-0">🚪 البوابتان — أقرّر قبل أن أكتب، لا أثناء</h3>
      <p class="small text-muted mt-0">أدخل تعليمة من موضوع حقيقي (أو اختر مثالاً) وقرّر فوراً: ورقة أم رأس؟ ثم صورة أم فيلم؟</p>
      <input class="field" id="gate-input" placeholder="مثال: فسّر بالاعتماد على معلوماتك والشكل 3…" autocomplete="off" />
      <div class="flex" id="gate-examples" style="gap:.4rem;flex-wrap:wrap">
        ${GATE_EXAMPLES.map((example) => `<button class="btn btn-ghost btn-sm" data-gate-example="${example}">${example}</button>`).join("")}
      </div>
      <div id="gate-verdict" class="small">اكتب تعليمة أعلاه ليظهر الحكم فوراً.</div>
    </div>`;
}

function drillIdleHTML(drill) {
  const status =
    drill.unlocked || drill.streak >= DRILL_UNLOCK_STREAK
      ? `<span class="text-emerald">✅ المفتاح+ مفتوح — حافظ على الطبيعة بجولات دورية.</span>`
      : `<span>متتالية الجولات الكاملة: <b>${drill.streak}/${DRILL_UNLOCK_STREAK}</b> · أفضل سلسلة: <b>${drill.best}</b> · جولات منجزة: <b>${drill.rounds}</b></span>`;
  return `
    <div id="drill-idle" class="stack">
      <p class="small mt-0">
        <b>الهدف:</b> ${DRILL_ROUND_SIZE} تعليمة قصيرة، لكل واحدة قراران متتاليان:
        <b>ورقة / رأس</b> ثم — إن كانت ورقة — <b>صورة / فيلم</b>.
        شرط الفتح: <b>12/12 ثلاث مرات متتالية</b> قبل أي تحرير كامل.
      </p>
      <p class="small">${status}</p>
      <div><button class="btn btn-emerald" id="drill-start">🔑 ابدأ التدريب (${DRILL_ROUND_SIZE} تعليمة · ${DRILL_ROUND_SECONDS} ثانية)</button></div>
    </div>`;
}

function plusCardHTML() {
  return `
    <div class="card stack" id="plus-card">
      <h3 class="mt-0">🧫🧱 المفتاح+ — الأسنان الإضافية (مفتوحة)</h3>
      <p class="small text-muted mt-0">لا تُستدعى كلها في آن واحد — تعود إليها حسب نوع التمرين.</p>
      <div class="stack">
        <details open><summary><b>السنّ 0 — افتح (مرة واحدة لكل تمرين)</b></summary>
          <p class="small">بعد قراءة سياق التمرين مباشرة، اكتب أعلى المسودة:
          <b>«الهدف العام: ……»</b> في ≤ 5 كلمات (مثال: «آلية عمل الأنسولين»).
          التركيب النهائي يُبنى على إجابته لهذا السطر بالذات.</p></details>
        <details><summary><b>البنية المتسلسلة + قالب التركيب</b></summary>
          <p class="small">افتّح ← جزء I (1 2 3 4) ← جزء II ← جزء III ← تركيب يُجيب عن «افتح».<br>
          القالب: «من الجزء I نعلم أنّ … ، ومن الجزء II أنّ … ، ومن الجزء III أنّ … ؛
          <b>ومنه</b> [الإجابة عن سطر الهدف العام]». تركيب بلا «ومنه» يضيّف نصف جودته.</p></details>
        <details><summary><b>صيغة الحساب</b></summary>
          <p class="small">السنّ 2: القانون بالحروف أولًا (Chargaff: %A = %T…) ·
          السنّ 3: التعويض خطوة خطوة · السنّ 4: النتيجة <b>بوحدتها</b>.
          القانون بالحروف يُكتب ولو خاب الحساب.</p></details>
        <details><summary><b>صيغة شجرة النسب</b></summary>
          <p class="small">حدثان حاسمان في السنّ 2: ① أبوان سليمانان ← طفل مصاب (يحسم
          <b>السيادة</b>) ② بنت مصابة من أب سليم / ابن سليم من أم مصابة (يحسم
          <b>الموقع</b>) · السنّ 3: لماذا يستبعد كل حدث الفرضية المقابلة ·
          السنّ 4: الحكمان (متنحٍّ/سائد + جسمي/مرتبط بـ X) ثم الأنماط الوراثية بالترميز.
          نمط بلا الحكم الثاني نصف الجودة.</p></details>
        <details><summary><b>فحص الخاتمة — عامّ أم خاصّ؟</b></summary>
          <p class="small">هل تبقى جملتي صحيحة لو غيّرنا اسم الجزيئة/الكائن؟ نعم ← عامّ،
          لا ← خاصّ. إن طُلب الهدف العام: العام أولًا والخاص بين قوسين؛ وإن طُلبت
          الوثيقة بعينها: العكس.</p></details>
        <details><summary><b>جملة النجاة</b></summary>
          <p class="small">بدأتَ تصف والفعل يطلب التفسير ← أكمل فوراً بـ
          <b>«وتفسير ذلك أنّ ……»</b> ثم الآلية، بلا شطب. وبدأتَ تفسّر والفعل يطلب
          الوصف فقط ← لا حيلة سوى الشطب؛ لهذا تُفحص البوابة <b>قبل</b> الكتابة.</p></details>
      </div>
    </div>`;
}

export function createGuideScreen(deps) {
  const { $, $$, adkarHTML, goHome, goToStrategy, store } = deps;

  let drill = null;
  let drillTimer = null;
  let drillRemaining = DRILL_ROUND_SECONDS;

  function clearDrillTimer() {
    if (drillTimer) {
      clearInterval(drillTimer);
      drillTimer = null;
    }
  }

  function bindOnce(id, fn) {
    const el = $(id);
    if (el) el.addEventListener("click", fn);
  }

  function renderGateVerdict() {
    const input = $("#gate-input");
    const verdict = $("#gate-verdict");
    if (!input || !verdict) return;
    const text = input.value || "";
    if (!text.trim()) {
      verdict.innerHTML = `اكتب تعليمة أعلاه ليظهر الحكم فوراً.`;
      return;
    }
    const c = classifyInstruction(text);
    const step1 =
      c.mode === "paper"
        ? `<b class="text-emerald">📄 ورقة</b> — سند وثائقي مذكور.`
        : `<b>🧠 رأس</b> — لا سند مذكور: وضع الحفظ، مسار <span class="path">${c.pathLabel}</span>.`;
    const twoColumns = c.twoColumns
      ? `<div class="small">المسودة بعمودين: <b>[من الوثيقة | من الدرس]</b>.</div>`
      : "";
    const step2 =
      c.mode === "paper"
        ? `<div>البوابة 2: ${
            c.gate2 === "film"
              ? `<b class="text-amber">🎬 فيلم</b> — فعل تفسير/استنتاج: آلية + نتيجة.`
              : `<b class="text-indigo">📷 صورة</b>${c.verbMatched ? "" : " (فعل غير مصنف — افترض استخراجاً)"}: وصف/استخراج دون تعليل.`
          } المسار: <span class="path">${c.pathLabel}</span>.</div>`
        : "";
    verdict.innerHTML = `${step1}${twoColumns}${step2}`;
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

  /* ---------------- شحذ المفتاح : drill ---------------- */

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
    drillTimer = setInterval(() => {
      drillRemaining -= 1;
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

  function currentBankItem() {
    const state = drill.view();
    return state.item ? DRILL_BANK.find((entry) => entry.text === state.item.text) || state.item : null;
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
        ? `<div class="flex" id="drill-gate2" style="gap:.5rem;flex-wrap:wrap">
             <button class="btn btn-sm" data-choice="image">📷 صورة</button>
             <button class="btn btn-sm" data-choice="film">🎬 فيلم</button>
           </div>`
        : "";
    const gate1HTML =
      state.stage === "gate1"
        ? `<div class="flex" id="drill-gate1" style="gap:.5rem;flex-wrap:wrap">
             <button class="btn btn-sm" data-choice="paper">📄 ورقة</button>
             <button class="btn btn-sm" data-choice="head">🧠 رأس</button>
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
        ? "ورقة"
        : step.expected === "head"
          ? "رأس"
          : step.expected === "film"
            ? "فيلم"
            : "صورة";
    feedback.innerHTML = `
      <div class="${step.ok ? "text-emerald" : "text-rose"}">${step.ok ? "✅ صحيح" : `❌ خطأ — الصواب: ${expectedLabel}`}</div>
      <div>${step.note || ""}</div>
      <button class="btn btn-ghost btn-sm" id="drill-next">${drill.view().stage === "done" ? "عرض النتيجة ←" : "التالي ←"}</button>`;
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
          // ورقة صحيحة → afficher les boutons de la بوابة 2 avec le flash de réussite.
          renderDrillStep(`<div class="text-emerald">✅ ورقة — الآن البوابة 2: صورة أم فيلم؟</div>`);
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
        ? `<span class="text-emerald">المفتاح+ متاح الآن — البطاقة الثانية ظاهرة أسفل الشاشة.</span>`
        : after.perfect
          ? `ممتاز — تبقّى <b>${DRILL_UNLOCK_STREAK - after.streak}</b> جولة كاملة (12/12) لفتح المفتاح+.`
          : `سلسلة الجولات الكاملة عادت إلى الصفر — الجولة التالية بلا أخطاء هي البداية.`;
    setInternalHTML(
      box,
      `
      <div class="stack" id="drill-summary">
        <h3 class="mt-0">نتيجة الجولة: <b class="${result.perfect ? "text-emerald" : "text-amber"}">${result.correct}/${result.total}</b></h3>
        ${unlockedNow ? `<div class="text-emerald"><b>🔓 فُتح المفتاح+</b> — أُنجز الشرط: 12/12 × ${DRILL_UNLOCK_STREAK} متتالية.</div>` : ""}
        <p class="small">${remainingText}</p>
        <p class="small text-muted">متتالية حالية: ${after.streak}/${DRILL_UNLOCK_STREAK} · أفضل سلسلة: ${after.best} · جولات: ${after.rounds}</p>
        <div><button class="btn btn-ghost btn-sm" id="drill-again">جولة أخرى</button></div>
      </div>`
    );
    if (unlockedNow) injectPlusCard();
    bindOnce("#drill-again", renderDrillIdle);
  }

  function injectPlusCard() {
    const host = $("#view-guide .grid");
    if (!host || $("#plus-card")) return;
    host.append(elementFromInternalHTML(plusCardHTML()));
  }

  function renderDrillCard() {
    return `
      <div class="card stack" id="drill-card">
        <h3 class="mt-0">🔑 شحذ المفتاح — تدريب القرار (${DRILL_ROUND_SECONDS} ثانية)</h3>
        <div id="drill-zone">${drillIdleHTML(store.state.drill)}</div>
      </div>`;
  }

  function renderGuide(y) {
    clearDrillTimer();
    drill = null;
    setInternalHTML(
      $("#view-guide"),
      `
    <div class="app">
      <header class="screen-head">
        <div class="brand">
          <button class="btn btn-rose btn-sm" id="guide-exit">✕ إلغاء والعودة</button>
          <div class="brand-icon">🌿</div>
          <div><h2 id="guide-title">ساس الهدوء والتركيز المنهجي</h2>
          <p class="small text-emerald">جلسة التأطير النفسي والتنفس الموجه — بكالوريا ${y.id}</p></div>
        </div>
      </header>

      <div class="grid">
        <div class="card center stack">
          <div class="breath">تنفس بعمق</div>
          <div>
            <h3 class="mt-0">أنت تمتلك كافة المكتسبات، ركّز فقط على تطبيق خطوات المفتاح.</h3>
            <p class="small text-muted">خذ شهيقاً 4 ثوانٍ، احبس 4 ثوانٍ، ثم ازفر ببطء 4 ثوانٍ لطرد التوتر.</p>
          </div>
        </div>
        ${adkarHTML()}
        <div class="grid grid-4">
          <div class="card center stack"><div class="pole" style="margin:0 auto">1</div><strong class="text-emerald">اقرأ — تأطير المسألة</strong><p class="small text-muted mt-0">طوّق الفعل، أسطر الكلمات المفتاحية، رقّم إجابتك</p></div>
          <div class="card center stack"><div class="pole" style="margin:0 auto">2</div><strong class="text-indigo">اجمع — استغلال السندات</strong><p class="small text-muted mt-0">أرقام + وحدات + اتجاه التغيّر، دون تعليل</p></div>
          <div class="card center stack"><div class="pole" style="margin:0 auto">3</div><strong class="text-amber">اربط — الربط والتفسير</strong><p class="small text-muted mt-0">فسر بـ «يعود إلى» وتتبع الآلية إن سمح الفعل</p></div>
          <div class="card center stack"><div class="pole" style="margin:0 auto">4</div><strong class="text-purple">اختُم — التركيب والمصادقة</strong><p class="small text-muted mt-0">جملة تجيب حرفياً عن كلمات السؤال</p></div>
        </div>
        ${gatesCardHTML()}
        ${renderDrillCard()}
        ${store.state.drill.unlocked ? plusCardHTML() : ""}
        <div class="flex" style="justify-content:flex-end">
          <button class="btn btn-emerald" id="guide-next">♞ أنا هادئ ومستعد | تصفح PDF وحاسبة الاختيار (25 دقيقة)</button>
        </div>
      </div>
      <footer class="screen-foot">المنهجية الميكانيكية تمنحك الثقة في كل خطوة.</footer>
    </div>`
    );

    $("#guide-exit").addEventListener("click", () => {
      clearDrillTimer();
      goHome();
    });
    $("#guide-next").addEventListener("click", () => {
      clearDrillTimer();
      goToStrategy();
    });
    bindGatesCard();
    bindOnce("#drill-start", startDrill);
  }

  return { renderGuide };
}
