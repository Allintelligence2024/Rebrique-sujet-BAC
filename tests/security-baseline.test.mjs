import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ui = readFileSync(join(root, "js", "ui.js"), "utf8");
const server = readFileSync(join(root, "server.mjs"), "utf8");

test("les brouillons persistés sont échappés avant interpolation HTML", () => {
  assert.match(ui, /function escapeHTML/);
  assert.match(ui, /escapeHTML\(st\.scratch\[p\]\)/);
  assert.match(ui, /escapeHTML\(st\.scratch\.free\)/);
  assert.match(ui, /escapeHTML\(drafts\.current\)/);
  assert.match(ui, /escapeHTML\(drafts\.full\)/);
});

test("les dialogues supportent clavier, échappement et retour de focus", () => {
  assert.match(ui, /function trapDialogFocus/);
  assert.match(ui, /event\.key === "Escape"/);
  assert.match(ui, /lastFocusedElement\?\.focus/);
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
