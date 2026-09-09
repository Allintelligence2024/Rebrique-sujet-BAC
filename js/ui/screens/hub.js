import { node, setInternalHTML } from "../dom.js";
import { ARCHIVE, catalogYearsForStream } from "../../../data/archive.js";

const STREAM_KEY = "boussole4d.stream";
const STREAM_ORDER = ["se", "m", "tm"];
const STREAMS = {
  se: { id: "se", label: "علوم تجريبية" },
  m: { id: "m", label: "رياضيات" },
  tm: { id: "tm", label: "تقني رياضي" }
};

function readStream() {
  try {
    const value = localStorage.getItem(STREAM_KEY);
    if (STREAMS[value]) return value;
  } catch {
    /* storage unavailable */
  }
  return "se";
}

function nextStreamId(id) {
  const index = STREAM_ORDER.indexOf(id);
  return STREAM_ORDER[(index + 1) % STREAM_ORDER.length];
}

function writeStream(id) {
  try {
    localStorage.setItem(STREAM_KEY, id);
  } catch {
    /* storage unavailable */
  }
}

function trainingYearsForStream(appConfig, streamId) {
  return appConfig.years.filter((year) => year.enabled && (year.stream || "se") === streamId);
}

function yearCardId(year) {
  return year.calendarYear || year.id;
}

function buildHubCatalog(appConfig, streamId) {
  const training = trainingYearsForStream(appConfig, streamId).map((year) => ({
    id: yearCardId(year),
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
    examMinutesForYear,
    formatDuration,
    openAdkar,
    openAtlas,
    openModal,
    startSession,
    store,
    timers,
    training,
    yearObj
  } = deps;

  function renderHub() {
    training?.teardown?.();
    const streamId = readStream();
    const stream = STREAMS[streamId];
    const other = STREAMS[nextStreamId(streamId)];
    const catalog = buildHubCatalog(APP_CONFIG, streamId);
    setInternalHTML(
      $("#view-hub"),
      `
    <div class="app">
      <header class="screen-head">
        <div class="brand">
          <div class="brand-icon" aria-hidden="true">٤</div>
          <div>
            <h1>${APP_CONFIG.appTitle}</h1>
            <p>${APP_CONFIG.appSubtitle}</p>
          </div>
        </div>
        <div class="flex gap-2 hub-tools">
          <button class="btn btn-indigo btn-sm" id="btn-stream-fab" aria-live="polite">
            <span class="stream-fab-kicker">الشعبة:</span> <strong id="stream-fab-label"></strong>
          </button>
          <button class="btn-sound" id="btn-hub-sound">🔇 صوت</button>
          <button class="btn-adkar" id="btn-hub-adkar">🕌 أدعية وأذكار</button>
        </div>
      </header>

      <div class="flex spread mb-1 hub-stream-bar">
        <p class="small text-muted mt-0 mb-1" id="hub-stream-caption"></p>
      </div>
      <div class="grid grid-cards" id="year-grid"></div>
      ${training.html()}
      <footer class="screen-foot">منصة تدريب منهجي لامتحانات بكالوريا علوم الطبيعة والحياة.</footer>
    </div>`
    );

    const caption = $("#hub-stream-caption");
    caption.textContent =
      streamId === "se"
        ? `الشعبة: ${stream.label} — مواضيع 2013–2026.`
        : streamId === "m"
          ? `الشعبة: ${stream.label} — مواضيع 2021–2026 + رسمية 2013–2020.`
          : `الشعبة: ${stream.label} — لا موضوع SVT رسمي على المصادر المتاحة.`;

    const fab = $("#btn-stream-fab");
    fab.setAttribute("aria-label", `الشعبة الحالية: ${stream.label}. اضغط للانتقال إلى شعبة ${other.label}`);
    $("#stream-fab-label").textContent = stream.label;

    const grid = $("#year-grid");
    if (catalog.length === 0) {
      grid.appendChild(gapCard(stream));
    } else {
      for (const item of catalog) {
        grid.appendChild(item.kind === "training" ? trainingCard(item.year) : consultCard(item));
      }
    }

    $$("#year-grid [data-year]:not([disabled])").forEach((button) =>
      button.addEventListener("click", async () => {
        const label = button.textContent;
        button.disabled = true;
        button.setAttribute("aria-busy", "true");
        button.textContent = "جارٍ تحميل السنة…";
        const loaded = await startSession(button.dataset.year);
        if (!loaded && button.isConnected) {
          button.disabled = false;
          button.removeAttribute("aria-busy");
          button.textContent = label;
        }
      })
    );
    $("#btn-hub-adkar").addEventListener("click", openAdkar);
    $("#btn-hub-sound").addEventListener("click", () => cycleSound($("#btn-hub-sound")));
    fab.addEventListener("click", cycleStream);
    training.mount();
    // Démo et أطلس : outils secondaires, dans la section repliée تدريب الخطوات الأربع.
    const trainingSection = $("#training-section");
    if (trainingSection) {
      trainingSection.insertAdjacentHTML(
        "beforeend",
        `
        <section class="card" id="demo-card">
          <div class="flex spread">
            <div><h3 class="mt-0 mb-1">تشخيص تجريبي في 60 ثانية</h3>
            <p class="small text-muted mt-0">مثال توضيحي للمنتج — ليس نتيجة تلميذ.</p></div>
            <button class="btn btn-emerald" id="btn-demo">ابدأ المثال قبل / بعد</button>
          </div>
        </section>
        <div class="flex justify-center">
          <button class="btn btn-ghost btn-sm" id="btn-atlas">🔬 أطلس التقنيات</button>
        </div>`
      );
      $("#btn-demo").addEventListener("click", openDemo);
      $("#btn-atlas").addEventListener("click", openAtlas);
    }
    applyTheme(document.documentElement.dataset.theme);
  }

  function cycleStream() {
    writeStream(nextStreamId(readStream()));
    renderHub();
  }

  function gapCard(stream) {
    const card = node("div", {
      className: "card year-card dim",
      dataset: { hubYear: "none", kind: "gap", stream: stream.id }
    });
    const stack = node("div", { className: "stack" });
    const header = node("div", { className: "flex spread" });
    header.append(
      node("span", { className: "badge badge-indigo", text: "غير متوفر" }),
      node("span", { className: "mono bold year-number", text: "—" })
    );
    const copy = node("div");
    copy.append(
      node("h3", { className: "mt-0 mb-1", text: `شعبة ${stream.label}` }),
      node("p", {
        className: "small text-muted mt-0",
        text: "لا يوجد موضوع SVT متاح لهذه الشعبة."
      })
    );
    stack.append(header, copy);
    const actions = node("div", { className: "stack" });
    actions.append(
      node("a", {
        className: "btn btn-block btn-ghost",
        text: "📂 فهرس علوم الطبيعة والحياة",
        attrs: {
          href: ARCHIVE.sourceRoot,
          target: "_blank",
          rel: "noopener noreferrer"
        }
      })
    );
    card.append(stack, actions);
    return card;
  }

  function trainingCard(y) {
    const disabled = !y.enabled;
    const note = disabled
      ? y.loadingNote || "لم تُرفق وثائق PDF لهذه الدورة بعد — قريباً."
      : `تدريب منهجي جزئي — لا يمثل جميع تعليمات الموضوع. مدة الاختبار الرسمية: ${formatDuration(
          examMinutesForYear(y)
        )}.`;
    const cardId = yearCardId(y);
    const card = node("div", {
      className: `card year-card ${disabled ? "dim" : ""}`,
      attrs: { title: note },
      dataset: { hubYear: cardId, kind: "training" }
    });
    const stack = node("div", { className: "stack" });
    const header = node("div", { className: "flex spread" });
    header.append(
      node("span", { className: `badge badge-${y.theme}`, text: y.badge }),
      node("span", { className: "mono bold year-number", text: cardId })
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
      text: disabled ? "غير متاح بعد" : "▶ ابدأ التدريب المنهجي",
      attrs: disabled ? { disabled: "" } : {},
      dataset: { year: y.id }
    });
    const actions = node("div", { className: "stack" });
    actions.append(button);
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
      node("span", { className: "mono bold year-number", text: item.id })
    );
    const copy = node("div");
    copy.append(
      node("h3", { className: "mt-0 mb-1", text: `بكالوريا الجزائر دورة ${item.id}` }),
      node("p", {
        className: "small text-muted mt-0",
        text: "الموضوعان والتصحيح النموذجي — للاستشارة فقط."
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

  return { renderHub };
}
