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

export function appendText(element, text) {
  element.append(document.createTextNode(String(text)));
  return element;
}

/** Central boundary for application-owned templates. Never pass raw user input. */
export function setInternalHTML(element, html) {
  element.innerHTML = String(html);
  return element;
}

export function elementFromInternalHTML(html) {
  const template = document.createElement("template");
  setInternalHTML(template, String(html).trim());
  return template.content.firstElementChild;
}
