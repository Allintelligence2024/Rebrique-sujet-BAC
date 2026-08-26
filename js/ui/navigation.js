import { node, replaceContent } from "./dom.js";

export function createScreenNavigator({ screens, onNavigate }) {
  return function showScreen(id) {
    screens().forEach((screen) => screen.classList.add("hidden"));
    const target = document.getElementById(id);
    if (!target) throw new Error(`Unknown screen: ${id}`);
    target.classList.remove("hidden");
    onNavigate(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}

export function renderStepNavigation(container, steps, onSelect) {
  const buttons = steps.map((step) => {
    const button = node("button", { dataset: { step: step.index } });
    button.append(node("span", { className: "pole", text: step.pole }), node("span", { text: step.label }));
    button.addEventListener("click", () => onSelect(step.index));
    return button;
  });
  replaceContent(container, buttons);
}
