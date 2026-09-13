import { node, setInternalHTML } from "../dom.js";
import { mountPdfViewers, pdfViewerHTML } from "../pdf-viewer.js";
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

function examYearsForStream(appConfig, streamId) {
  return appConfig.years.filter((year) => year.enabled && (year.stream || "se") === streamId);
}

function yearCardId(year) {
  return year.calendarYear || year.id;
}

function buildHubCatalog(appConfig, streamId) {
  const training = examYearsForStream(appConfig, streamId).map((year) => ({
    id: yearCardId(year),
    kind: "exam",
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
    mountPdfViewers,
    pdfViewerHTML,
    closeModal,
    cycleSound,
    enterExercise,
    examMinutesForYear,
    formatDuration,
    openAdkar,
    openDrawer,
    openModal,
    startSession,
    store,
    timers,
    yearObj
  } = deps;

  function renderHub() {
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
      <footer class="screen-foot">منصة امتحان بكالوريا علوم الطبيعة والحياة ورياضيات. <a href="legal/privacy.html">الخصوصية</a> · <a href="legal/legal-notice.html">المعلومات القانونية</a></footer>
    </div>`
    );

    const caption = $("#hub-stream-caption");
    caption.textContent =
      streamId === "se"
        ? `الشعبة: ${stream.label} — مواضيع 2013–2026.`
        : streamId === "m"
          ? `الشعبة: ${stream.label} — مواضيع 2020–2026 + مواضيع رسمية للقراءة 2013–2019.`
          : `الشعبة: ${stream.label} — لا موضوع SVT رسمي على المصادر المتاحة.`;

    const fab = $("#btn-stream-fab");
    fab.setAttribute("aria-label", `الشعبة الحالية: ${stream.label}. اضغط للانتقال إلى شعبة ${other.label}`);
    $("#stream-fab-label").textContent = stream.label;

    const grid = $("#year-grid");
    if (catalog.length === 0) {
      grid.appendChild(gapCard(stream));
    } else {
      for (const item of catalog) {
        grid.appendChild(item.kind === "exam" ? examCard(item.year) : consultCard(item));
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

  /* Une année « copie libre » n'a aucune consigne encodée : la carte ne peut
     pas annoncer un جرد المهام qu'elle n'a pas. Elle le dit à la place. */
  function examCardNote(y) {
    const duration = formatDuration(examMinutesForYear(y));
    return y.answerMode === "free"
      ? `امتحان الموضوع — وضع «الورقة الحرة»: تعليمات هذه الدورة غير مُشفَّرة، تقرأ الموضوع من الملف وتكتب إجابتك. مدة الاختبار الرسمية: ${duration}.`
      : `امتحان الموضوع — جرد المهام جزئي: بعض تعليمات الموضوع الرسمية غير مُدرجة بعد، وبعض الخطوات مُعاد بناؤها. مدة الاختبار الرسمية: ${duration}.`;
  }

  function examCard(y) {
    const disabled = !y.enabled;
    const note = disabled ? y.loadingNote || "لم تُرفق وثائق PDF لهذه الدورة بعد — قريباً." : examCardNote(y);
    const cardId = yearCardId(y);
    const card = node("div", {
      className: `card year-card ${disabled ? "dim" : ""}`,
      attrs: { title: note },
      dataset: { hubYear: cardId, kind: "exam" }
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
      text: disabled ? "غير متاح بعد" : "▶ ابدأ الامتحان",
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
    // Le sujet est lu dans l'application dès qu'un PDF local existe ; le lien
    // dzexams ne sert plus que de source de repli.
    const localPdfs = item.entries.flatMap((entry) => entry.localPdfUrls || []);
    const copy = node("div");
    copy.append(
      node("h3", { className: "mt-0 mb-1", text: `بكالوريا الجزائر دورة ${item.id}` }),
      node("p", {
        className: "small text-muted mt-0",
        text: localPdfs.length
          ? "يُقرأ الموضوعان داخل التطبيق. وضع الامتحان غير متاح: لم تُشفَّر تعليمات هذه الدورة بعد."
          : "الموضوعان والتصحيح النموذجي — للاستشارة فقط."
      })
    );
    stack.append(header, copy);
    const actions = node("div", { className: "stack" });
    if (localPdfs.length) {
      localPdfs.forEach((href, index) => {
        const button = node("button", {
          className: "btn btn-block btn-indigo",
          text: `📄 قراءة الموضوع ${index + 1} في التطبيق`,
          dataset: { consultPdf: href }
        });
        button.addEventListener("click", () => {
          const drawer = openDrawer(
            "right",
            `📄 وثيقة الموضوع ${index + 1}`,
            pdfViewerHTML({ id: index + 1, pdfLocalUrl: href })
          );
          mountPdfViewers(drawer);
        });
        actions.append(button);
      });
    }
    for (const entry of item.entries) {
      const session = ARCHIVE.sessions[entry.session] || entry.session;
      const label = item.entries.length > 1 ? `🔗 ${session} (المصدر)` : "🔗 المصدر والتصحيح";
      if (entry.url) {
        actions.append(
          node("a", {
            className: "btn btn-block btn-ghost btn-sm",
            text: label,
            attrs: { href: entry.url, target: "_blank", rel: "noopener noreferrer" }
          })
        );
      }
    }
    card.append(stack, actions);
    return card;
  }

  return { renderHub };
}
