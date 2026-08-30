import { node, setInternalHTML } from "../dom.js";
import { ARCHIVE, archiveByStream } from "../../../data/archive.js";

export function createHubScreen(deps) {
  const {
    $,
    $$,
    APP_CONFIG,
    applyTheme,
    buildDemo,
    closeModal,
    cycleSound,
    enterExercise,
    openAdkar,
    openAtlas,
    openModal,
    startSession,
    store,
    timers,
    trainingLimitHTML,
    toggleTheme,
    yearObj
  } = deps;

  function renderHub() {
    const years = APP_CONFIG.years;
    setInternalHTML(
      $("#view-hub"),
      `
    <div class="app">
      <header class="screen-head">
        <div class="brand">
          <div class="brand-icon">🧭</div>
          <div>
            <h1>${APP_CONFIG.appTitle}</h1>
            <p>${APP_CONFIG.appSubtitle}</p>
          </div>
        </div>
        <div class="flex gap-2 hub-tools">
          <button class="btn btn-ghost btn-sm" data-theme-toggle>☀️ الوضع الفاتح</button>
          <button class="btn-sound" id="btn-hub-sound">🔇 صوت</button>
          <button class="btn-adkar" id="btn-hub-adkar">🕌 أدعية وأذكار</button>
          <button class="btn btn-amber" id="btn-atlas">🔬 أطلس التقنيات</button>
        </div>
      </header>

      <div class="center mb-2">
        <h2 class="mt-0">تدرّب على تغطية العناصر المنتظرة في إجابتك</h2>
        <p class="text-muted small">اختر المسار الموجّه، أو ادخل مباشرة إلى تمرين دون المرور بالتهدئة والاستراتيجية.</p>
      </div>
      ${trainingLimitHTML()}
      <section class="card demo-card mb-2" aria-labelledby="demo-title">
        <div class="flex spread">
          <div><h2 id="demo-title" class="mt-0 mb-1">تشخيص تجريبي في 60 ثانية</h2>
          <p class="small text-muted mt-0">مثال توضيحي مكتوب للمنتج، وليس نسخة تلميذ أو شهادة مستخدم.</p></div>
          <button class="btn btn-emerald" id="btn-demo">ابدأ المثال قبل / بعد</button>
        </div>
      </section>

      <div class="grid grid-cards" id="year-grid"></div>
      <section class="card archive-card mb-2 mt-2" aria-labelledby="archive-title">
        <div class="flex spread" style="flex-wrap:wrap;gap:1rem">
          <div>
            <h2 id="archive-title" class="mt-0 mb-1">📚 أرشيف موضوعات 2013–2020</h2>
            <p class="small text-muted mt-0">
              موضوعات رسمية مع التصحيح النموذجي (فتح خارجي). للاستشارة فقط — بدون تقييم 4D بعد.
            </p>
          </div>
          <button class="btn btn-indigo" id="btn-archive">فتح الأرشيف</button>
        </div>
      </section>
      <footer class="screen-foot">منصة تدريب منهجي لامتحانات بكالوريا علوم الطبيعة والحياة.</footer>
    </div>`
    );

    const grid = $("#year-grid");
    years.forEach((y) => {
      const disabled = !y.enabled;
      const note = disabled
        ? y.loadingNote || "لم تُرفق وثائق PDF لهذه الدورة بعد — قريباً."
        : "جلسة شاملة وفق نظام الأقطاب 4D الهادئ.";
      const card = node("div", {
        className: `card year-card ${disabled ? "dim" : ""}`,
        attrs: { title: note }
      });
      const stack = node("div", { className: "stack" });
      const header = node("div", { className: "flex spread" });
      header.append(
        node("span", { className: `badge badge-${y.theme}`, text: y.badge }),
        node("span", { className: "mono bold", text: y.id, attrs: { style: "font-size:1.6rem" } })
      );
      const copy = node("div");
      copy.append(
        node("h3", { className: "mt-0 mb-1", text: y.label }),
        node("p", { className: "small text-muted mt-0", text: note })
      );
      stack.append(header, copy);
      const buttonTheme =
        y.theme === "emerald" ? "btn-emerald" : y.theme === "indigo" ? "btn-indigo" : "btn-amber";
      const button = node("button", {
        className: `btn btn-block ${buttonTheme}`,
        text: disabled ? "غير متاح بعد" : "دخول الدورة (ساس التهدئة والبوصلة)",
        attrs: disabled ? { disabled: "" } : {},
        dataset: { year: y.id }
      });
      const quickButton = node("button", {
        className: "btn btn-block btn-ghost",
        text: disabled ? "غير متاح" : "⚡ دخول سريع إلى تمرين",
        attrs: disabled ? { disabled: "" } : {},
        dataset: { quickYear: y.id }
      });
      const actions = node("div", { className: "stack" });
      actions.append(button, quickButton);
      card.append(stack, actions);
      grid.appendChild(card);
    });

    $$("#year-grid [data-year]:not([disabled])").forEach((btn) =>
      btn.addEventListener("click", () => startSession(btn.dataset.year))
    );
    $$("#year-grid [data-quick-year]:not([disabled])").forEach((btn) =>
      btn.addEventListener("click", () => openQuickAccess(btn.dataset.quickYear))
    );
    $("#btn-demo").addEventListener("click", openDemo);
    $("#btn-atlas").addEventListener("click", openAtlas);
    $("#btn-archive").addEventListener("click", openArchive);
    $("#btn-hub-adkar").addEventListener("click", openAdkar);
    $("#btn-hub-sound").addEventListener("click", () => cycleSound($("#btn-hub-sound")));
    $$("[data-theme-toggle]").forEach((button) => button.addEventListener("click", toggleTheme));
    applyTheme(document.documentElement.dataset.theme);
  }

  function openDemo() {
    const demo = buildDemo();
    const list = (items, empty) =>
      items.length ? `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>` : `<p>${empty}</p>`;
    const panel = (title, result) => `<article class="card">
      <h3 class="mt-0">${title}</h3>
      <blockquote class="demo-copy">${result.text}</blockquote>
      <strong>ما رصده المحرك</strong>${list(result.detected, "لا توجد مؤشرات كافية.")}
      <strong>ما بقي ناقصاً</strong>${list(result.missing, "لم يرصد نقصاً ضمن هذه القاعدة المحدودة.")}
    </article>`;
    openModal(
      "⏱️ تشخيص توضيحي في 60 ثانية",
      `<p class="feedback mid">هذا مثال مصطنع ومعلن للشرح فقط؛ ليس نتيجة طالب حقيقي ولا دليلاً على الدقة.</p>
       <div class="grid grid-2">${panel("قبل: عبارة عامة", demo.before)}${panel("بعد: ملاحظة ثم تفسير", demo.after)}</div>
       <section class="mt-2"><h3>ما لا يضمنه المحرك</h3>${list(demo.limits, "")}</section>`
    );
  }

  function openArchive() {
    const groups = archiveByStream();
    const section = (stream) => {
      const { label, indexUrl, entries } = groups[stream];
      const cards = entries
        .map((e) => {
          const session = ARCHIVE.sessions[e.session] || e.session;
          return `<div class="card stack" style="padding:.75rem 1rem">
            <span class="bold">${e.year} — ${session}</span>
            <a class="btn btn-ghost btn-sm" href="${e.url}" target="_blank" rel="noopener noreferrer">
              📄 الموضوع والتصحيح النموذجي (dzexams)
            </a>
            ${e.pdfUrl ? `<a class="btn btn-ghost btn-sm" href="${e.pdfUrl}" target="_blank" rel="noopener noreferrer">⬇️ PDF مباشر</a>` : ""}
            <small class="text-muted">${e.viewer === "ok" ? "المعاينة متاحة" : "معاينة محجوبة — رابط التحميل متاح"}</small>
          </div>`;
        })
        .join("");
      return `<section class="stack">
        <h3 class="mt-2 mb-1">${label} <small class="text-muted">(فهرس: <a href="${indexUrl}" target="_blank" rel="noopener noreferrer">dzexams</a>)</small></h3>
        <div class="grid grid-2">${cards || '<p class="text-muted">لا توجد مخططات.</p>'}</div>
      </section>`;
    };
    openModal(
      "📚 أرشيف موضوعات 2013–2020 (بدون تقييم 4D)",
      `<p class="text-muted small">تحققتُ من المصدر بتاريخ ${ARCHIVE.verifiedAt} — dzexams.com. كل رابط يفتح الموضوعين 1 و2 مع التصحيح النموذجي في نفس الصفحة. هذا ركن استشارة فقط: لا يطبّق المحرك تقييمه على هذه المواضيع ولا يمنح مؤشرات تغطية.</p>
       ${section("se")}
       ${section("m")}
       <p class="small text-muted mt-2"><strong>⚠️ شعبة تقني رياضي:</strong> لا تتوفر في dzexams أقسام "علوم الطبيعة والحياة" لهذه الشعبة (تحقق في ${ARCHIVE.verifiedAt}) — لم يُضف أي رابط وهمي. يلزم مصدر بديل يتم التحقق منه قبل أي إضافة.</p>`
    );
  }

  function openQuickAccess(yearId) {
    const year = yearObj(yearId);
    const body = `<p class="text-muted">اختر الموضوع والتمرين. ستصل مباشرة إلى مساحة الإجابة.</p>
    <div class="quick-access-grid">${year.sujets
      .map(
        (sujet) =>
          `<section class="card stack"><strong>${sujet.title}</strong>${sujet.exercises
            .map(
              (
                exercise
              ) => `<button class="btn btn-ghost quick-exercise" data-quick-start="${year.id}:${sujet.id}:${exercise.number}">
              <span>ت${exercise.number} — ${exercise.label}</span><small>${exercise.max}ن</small>
            </button>`
            )
            .join("")}</section>`
      )
      .join("")}</div>`;
    openModal("⚡ الدخول السريع", body);
    $$("[data-quick-start]").forEach((button) =>
      button.addEventListener("click", () => {
        const [selectedYear, sujetId, exerciseId] = button.dataset.quickStart.split(":");
        store.enterSession(selectedYear, Number(sujetId));
        store.setReviewMode(true);
        timers.startGlobal();
        closeModal();
        enterExercise(Number(exerciseId));
        $("#global-timer-bar")?.classList.remove("hidden");
      })
    );
  }

  return { renderHub };
}
