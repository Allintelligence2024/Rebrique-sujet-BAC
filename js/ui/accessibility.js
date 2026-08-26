const SCREEN_NAMES = {
  "view-hub": "الصفحة الرئيسية",
  "view-guide": "دليل الاستعداد",
  "view-strategy": "استراتيجية الموضوع",
  "view-onboarding": "اختيار التمرين",
  "view-workspace": "مساحة الإجابة"
};

export function ensureLiveRegions(document) {
  let announcer = document.getElementById("screen-announcer");
  if (!announcer) {
    announcer = document.createElement("div");
    announcer.id = "screen-announcer";
    announcer.className = "sr-only";
    announcer.setAttribute("role", "status");
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");
    document.body.appendChild(announcer);
  }

  let diagnostics = document.getElementById("diagnostic-announcer");
  if (!diagnostics) {
    diagnostics = document.createElement("div");
    diagnostics.id = "diagnostic-announcer";
    diagnostics.className = "sr-only";
    diagnostics.setAttribute("role", "alert");
    diagnostics.setAttribute("aria-live", "assertive");
    diagnostics.setAttribute("aria-atomic", "true");
    document.body.appendChild(diagnostics);
  }
  return { announcer, diagnostics };
}

export function announceScreen(document, id) {
  const target = document.getElementById(id);
  const { announcer } = ensureLiveRegions(document);
  const heading = target?.querySelector("h1, h2, h3");
  const name = heading?.textContent?.trim() || SCREEN_NAMES[id] || "شاشة جديدة";
  announcer.textContent = "";
  const schedule = document.defaultView.requestAnimationFrame || document.defaultView.setTimeout;
  schedule.call(document.defaultView, () => {
    announcer.textContent = `تم فتح: ${name}`;
  });
  if (target) {
    target.setAttribute("aria-label", name);
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }
}

function hasExplicitName(field, document) {
  if (field.hasAttribute("aria-label") || field.hasAttribute("aria-labelledby")) return true;
  return Boolean(
    field.id && [...document.querySelectorAll("label[for]")].some((label) => label.htmlFor === field.id)
  );
}

export function associateFieldsWithInstructions(root = document) {
  const document = root.ownerDocument || root;
  root.querySelectorAll("input, textarea, select").forEach((field, index) => {
    if (hasExplicitName(field, document)) return;
    if (!field.id) field.id = `accessible-field-${index + 1}`;
    const precedingLabel = field.previousElementSibling;
    if (precedingLabel?.tagName === "LABEL") {
      precedingLabel.htmlFor = field.id;
      return;
    }
    const context = field.closest("section, article, .card, [role='dialog']");
    const instruction = context?.querySelector("h1, h2, h3, .bac-consigne, .lbl");
    if (instruction) {
      if (!instruction.id) instruction.id = `${field.id}-instruction`;
      field.setAttribute("aria-labelledby", instruction.id);
      return;
    }
    const label = document.createElement("label");
    label.className = "sr-only";
    label.htmlFor = field.id;
    label.textContent = field.placeholder || field.name || "حقل إدخال";
    field.before(label);
  });
}

export function bindDiagnosticAnnouncements(window) {
  window.addEventListener("boussole4d:diagnostic", (event) => {
    const { diagnostics } = ensureLiveRegions(window.document);
    diagnostics.textContent = `تعذر إتمام العملية: ${event.detail?.code || "خطأ غير متوقع"}`;
  });
}
