import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ui =
  readFileSync(join(root, "js", "ui.js"), "utf8") +
  readFileSync(join(root, "js", "ui", "screens", "workspace.js"), "utf8") +
  readFileSync(join(root, "js", "ui", "workspace", "brouillon.js"), "utf8");
const dialogs = readFileSync(join(root, "js", "ui", "dialogs.js"), "utf8");
const server = readFileSync(join(root, "server.mjs"), "utf8");

test("les brouillons persistés sont échappés avant interpolation HTML", () => {
  assert.match(ui, /function escapeHTML/);
  assert.match(ui, /escapeHTML\(st\.scratch\[p\]\)/);
  assert.match(ui, /escapeHTML\(st\.scratch\.free\)/);
  assert.match(ui, /escapeHTML\(drafts\.current\)/);
  assert.match(ui, /escapeHTML\(drafts\.full\)/);
});

test("les dialogues centralisés supportent clavier, échappement et retour de focus", () => {
  assert.match(dialogs, /function trapFocus/);
  assert.match(dialogs, /event\.key === "Escape"/);
  assert.match(dialogs, /lastFocusedElement\?\.focus/);
});

test("les erreurs récupérables passent par le service de diagnostic", () => {
  for (const file of ["main.js", "store.js", "services/sound-engine.js", "services/speech-recognition.js"]) {
    const source = readFileSync(join(root, "js", file), "utf8");
    assert.match(source, /reportDiagnostic/, `${file} ne rapporte pas ses erreurs récupérables`);
  }
});

test("le serveur de production définit une CSP et des en-têtes de sécurité", () => {
  assert.match(server, /Content-Security-Policy/);
  assert.match(server, /X-Content-Type-Options/);
  assert.match(server, /Referrer-Policy/);
  assert.match(server, /Permissions-Policy/);
  assert.match(server, /Cache-Control/);
  assert.match(server, /relative\(root, path\)/);
  assert.match(server, /GET, HEAD/);
});
