import { node, replaceContent, setInternalHTML } from "./dom.js";

export function createDialogManager({ $, $$ }) {
  let modal = null;
  let lastFocusedElement = null;

  function restoreFocus() {
    lastFocusedElement?.focus?.();
    lastFocusedElement = null;
  }

  function closeModal() {
    modal?.remove();
    modal = null;
    restoreFocus();
  }

  function trapFocus(event, container, close) {
    if (event.key === "Escape") return close();
    if (event.key !== "Tab") return;
    const focusable = $$(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      container
    ).filter((item) => !item.disabled);
    if (!focusable.length) return event.preventDefault();
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function openModal(title, body, extra = "") {
    closeModal();
    lastFocusedElement = document.activeElement;
    const overlay = node("div", { className: "overlay", dataset: { close: "overlay" } });
    const dialog = node("div", {
      className: "modal",
      attrs: { role: "dialog", "aria-modal": "true", "aria-label": title, tabindex: "-1" }
    });
    const head = node("div", { className: "modal-head" });
    head.append(
      node("strong", { className: "text-amber", text: title }),
      node("button", { className: "btn btn-ghost btn-sm", text: "✕", dataset: { close: "btn" } })
    );
    const content = node("div", { className: "small" });
    setInternalHTML(content, body);
    const extraContent = node("div");
    setInternalHTML(extraContent, extra);
    const actions = node("div", { className: "flex", attrs: { style: "justify-content:flex-end" } });
    actions.append(
      node("button", { className: "btn btn-emerald", text: "فهمت، سأواصل", dataset: { close: "ok" } })
    );
    replaceContent(dialog, [head, content, extraContent, actions]);
    overlay.append(dialog);
    modal = overlay;
    document.body.append(overlay);
    $$("[data-close]", modal).forEach((button) => button.addEventListener("click", closeModal));
    modal.addEventListener("keydown", (event) => trapFocus(event, modal, closeModal));
    $("[data-close='btn']", modal)?.focus();
    return modal;
  }

  function openDrawer(side, title, body) {
    closeModal();
    lastFocusedElement = document.activeElement;
    $$(".drawer").forEach((drawer) => drawer.remove());
    const drawer = node("div", {
      className: `drawer ${side} open`,
      attrs: { role: "dialog", "aria-modal": "true", "aria-label": title, tabindex: "-1" }
    });
    const head = node("div", { className: "drawer-head" });
    head.append(
      node("strong", { text: title }),
      node("button", { className: "btn btn-ghost btn-sm", text: "✕", attrs: { "data-close": "" } })
    );
    const content = node("div", { className: "drawer-body" });
    setInternalHTML(content, body);
    drawer.append(head, content);
    document.body.append(drawer);
    const closeDrawer = () => {
      drawer.remove();
      restoreFocus();
    };
    $$("[data-close]", drawer).forEach((button) => button.addEventListener("click", closeDrawer));
    drawer.addEventListener("keydown", (event) => trapFocus(event, drawer, closeDrawer));
    $("[data-close]", drawer)?.focus();
    return drawer;
  }

  return { openModal, closeModal, openDrawer };
}
