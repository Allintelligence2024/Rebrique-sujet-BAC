import { test } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import {
  announceScreen,
  associateFieldsWithInstructions,
  bindDiagnosticAnnouncements,
  ensureLiveRegions
} from "../js/ui/accessibility.js";

function dom(html = "") {
  return new JSDOM(`<body>${html}</body>`, { pretendToBeVisual: true });
}

test("les régions live annoncent écrans, diagnostics et notifications", async () => {
  const { window } = dom('<section id="view-hub"><h1>Accueil</h1></section>');
  window.requestAnimationFrame = (callback) => callback();
  ensureLiveRegions(window.document);
  bindDiagnosticAnnouncements(window);
  announceScreen(window.document, "view-hub");
  assert.equal(window.document.querySelector("#screen-announcer").getAttribute("aria-live"), "polite");
  assert.match(window.document.querySelector("#screen-announcer").textContent, /Accueil/);
  window.dispatchEvent(
    new window.CustomEvent("boussole4d:diagnostic", { detail: { code: "storage.failure" } })
  );
  assert.equal(window.document.querySelector("#diagnostic-announcer").getAttribute("aria-live"), "assertive");
  assert.match(window.document.querySelector("#diagnostic-announcer").textContent, /storage.failure/);
});

test("chaque champ reçoit un nom explicite lié à sa consigne", () => {
  const { window } = dom(`
    <section id="exercise"><h2>Consigne scientifique</h2>
      <textarea id="answer"></textarea>
      <label>Valeur</label><input id="value">
      <input id="named" aria-label="Recherche">
    </section>`);
  associateFieldsWithInstructions(window.document);
  const answer = window.document.querySelector("#answer");
  const value = window.document.querySelector("#value");
  assert.equal(answer.getAttribute("aria-labelledby"), "answer-instruction");
  assert.equal(value.previousElementSibling.htmlFor, "value");
  for (const field of window.document.querySelectorAll("input, textarea, select")) {
    const labelled =
      field.hasAttribute("aria-label") ||
      field.hasAttribute("aria-labelledby") ||
      [...window.document.querySelectorAll("label[for]")].some((label) => label.htmlFor === field.id);
    assert.equal(labelled, true, `${field.id} n'a pas de nom accessible`);
  }
});

test("les contrôles interactifs personnalisés restent des éléments clavier natifs", async () => {
  const atlas = await import("../js/ui/atlas.js");
  const workspace = await import("../js/ui/screens/workspace.js");
  assert.match(atlas.createAtlas.toString(), /type=\\?"button\\?" class=\\?"flashcard/);
  assert.match(workspace.createWorkspaceController.toString(), /type=\\?"button\\?" class=\\?"slot/);
});
