import { node, setInternalHTML } from "../dom.js";
import { ARCHIVE, catalogYearsForStream } from "../../../data/archive.js";

const STREAM_KEY = "boussole4d.stream";
const STREAMS = {
  se: { id: "se", label: "علوم تجريبية" },
  m: { id: "m", label: "رياضيات" }
};

function readStream() {
  try {
    const value = localStorage.getItem(STREAM_KEY);
    if (value === "se" || value === "m") return value;
  } catch {
    /* storage unavailable */
  }
  return "se";
}

function writeStream(id) {
  try {
    localStorage.setItem(STREAM_KEY, id);
  } catch {
    /* storage unavailable */
  }
}

function trainingYearsForStream(appConfig, streamId) {
  if (streamId !== "se") return [];
  return appConfig.years.filter((year) => year.enabled);
}

function buildHubCatalog(appConfig, streamId) {
  const training = trainingYearsForStream(appConfig, streamId).map((year) => ({
    id: year.id,
    kind: "training",
    year
  }));
  const consult = catalogYearsForStream(streamId)
    .filter((group) => !training.some((item) => item.id === group.year))
    .map((group) => ({
      id: group.year,
      kind: "consult",
      entries: group.entries
    }));
  return [...training, ...consult].sort((a, b) => (a.id < b.id ? 1 : -1));
}

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
    const streamId = readStream();
    const stream = STREAMS[streamId];
    const other = STREAMS[streamId === "se" ? "m" : "se"];
    const catalog = buildHubCatalog(APP_CONFIG, streamId);
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

      <div class="flex spread mb-1 hub-stream-bar">
        <p class="small text-muted mt-0 mb-1" id="hub-stream-caption"></p>
      </div>
      <div class="grid grid-cards" id="year-grid"></div>
      <button type="button" class="stream-fab" id="btn-stream-fab">
        <span class="stream-fab-kicker">تغيير الشعبة</span>
        <strong id="stream-fab-label"></strong>
      </button>
      <footer class="screen-foot">منصة تدريب منهجي لامتحانات بكالوريا علوم الطبيعة والحياة.</footer>
    </div>`
    );

    const caption = $("#hub-stream-caption");
    caption.textContent =
      streamId === "se"
        ? `الشعبة المعروضة: ${stream.label} — 2022–2025 تدريب 4D، 2013–2021 موضوع رسمي + تصحيح.`
        : `الشعبة المعروضة: ${stream.label} — موضوعات رسمية 2013–2021. تدريب 4D (2022–2025) متاح لشعبة علوم تجريبية.`;

    const fab = $("#btn-stream-fab");
    fab.setAttribute("aria-label", `الشعبة الحالية: ${stream.label}. اضغط للانتقال إلى شعبة ${other.label}`);
    $("#stream-fab-label").textContent = stream.label;

    const grid = $("#year-grid");
    for (const item of catalog) {
      grid.appendChild(item.kind === "training" ? trainingCard(item.year) : consultCard(item));
    }

    $$("#year-grid [data-year]:not([disabled])").forEach((btn) =>
      btn.addEventListener("click", () => startSession(btn.dataset.year))
    );
    $$("#year-grid [data-quick-year]:not([disabled])").forEach((btn) =>
      btn.addEventListener("click", () => openQuickAccess(btn.dataset.quickYear))
    );
    $("#btn-demo").addEventListener("click", openDemo);
    $("#btn-atlas").addEventListener("click", openAtlas);
    $("#btn-hub-adkar").addEventListener("click", openAdkar);
    $("#btn-hub-sound").addEventListener("click", () => cycleSound($("#btn-hub-sound")));
    $$("[data-theme-toggle]").forEach((button) => button.addEventListener("click", toggleTheme));
    fab.addEventListener("click", cycleStream);
    applyTheme(document.documentElement.dataset.theme);
  }

  function cycleStream() {
    writeStream(readStream() === "se" ? "m" : "se");
    renderHub();
  }

  function trainingCard(y) {
    const disabled = !y.enabled;
    const note = disabled
      ? y.loadingNote || "لم تُرفق وثائق PDF لهذه الدورة بعد — قريباً."
      : "جلسة شاملة وفق نظام الأقطاب 4D الهادئ.";
    const card = node("div", {
      className: `card year-card ${disabled ? "dim" : ""}`,
      attrs: { title: note },
      dataset: { hubYear: y.id, kind: "training" }
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
    return card;
  }

  function consultCard(item) {
    const card = node("div", {
      className: "card year-card",
      dataset: { hubYear: item.id, kind: "consult" }
    });
    const stack = node("div", { className: "stack" });
    const header = node("div", { className: "flex spread" });
    header.append(
      node("span", { className: "badge badge-indigo", text: "موضوع رسمي" }),
      node("span", { className: "mono bold", text: item.id, attrs: { style: "font-size:1.6rem" } })
    );
    const copy = node("div");
    copy.append(
      node("h3", { className: "mt-0 mb-1", text: `بكالوريا الجزائر دورة ${item.id}` }),
      node("p", {
        className: "small text-muted mt-0",
        text: "الموضوعان والتصحيح النموذجي — للاستشارة (بدون تقييم 4D)."
      })
    );
    stack.append(header, copy);
    const actions = node("div", { className: "stack" });
    for (const entry of item.entries) {
      const session = ARCHIVE.sessions[entry.session] || entry.session;
      const label = item.entries.length > 1 ? `📄 ${session}` : "📄 الموضوع والتصحيح النموذجي";
      actions.append(
        node("a", {
          className: "btn btn-block btn-indigo",
          text: label,
          attrs: {
            href: entry.url,
            target: "_blank",
            rel: "noopener noreferrer"
          }
        })
      );
      if (entry.pdfUrl) {
        actions.append(
          node("a", {
            className: "btn btn-block btn-ghost btn-sm",
            text: "⬇️ PDF مباشر",
            attrs: {
              href: entry.pdfUrl,
              target: "_blank",
              rel: "noopener noreferrer"
            }
          })
        );
      }
    }
    card.append(stack, actions);
    return card;
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
