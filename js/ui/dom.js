/* Small DOM construction boundary for UI values that may be dynamic. */
export function node(tag, { className, text, attrs = {}, dataset = {} } = {}) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = String(text);
  for (const [name, value] of Object.entries(attrs)) {
    if (value !== undefined && value !== null) element.setAttribute(name, String(value));
  }
  for (const [name, value] of Object.entries(dataset)) {
    if (value !== undefined && value !== null) element.dataset[name] = String(value);
  }
  return element;
}

export function replaceContent(element, children = []) {
  element.replaceChildren(...children.filter(Boolean));
  return element;
}

/** Central boundary for application-owned templates. Never pass raw user input. */
export function setInternalHTML(element, html) {
  element.innerHTML = String(html);
  return element;
}

/* Any value that can originate from localStorage or user input must cross this
   boundary before being interpolated in HTML. Prefer .textContent/.value
   elsewhere. Implémentation unique : elle était recopiée à l'identique dans
   js/ui.js, js/ui/pdf-viewer.js et js/ui/screens/simulation.js, donc trois
   endroits à corriger si l'échappement devait changer. */
export const escapeHTML = (value = "") =>
  String(value).replace(
    /[&<>'"]/g,
    (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]
  );
