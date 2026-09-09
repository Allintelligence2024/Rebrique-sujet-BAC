import { after, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { JSDOM } = require("jsdom");
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(root, "index.html"), "utf8");
const dom = new JSDOM(html, { url: "http://localhost/" });

globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.localStorage = dom.window.localStorage;
dom.window.scrollTo = () => {};

const { store } = await import("../js/store.js");
const { timers } = await import("../js/engine.js");
const { init } = await import("../js/ui.js");

after(() => {
  timers.stopAll();
  dom.window.close();
});

test("l'expiration globale termine la session et verrouille la copie affichée", async () => {
  store.reset();
  store.enterSession("2024", 1, 60, 25 * 60);
  store.state.activeScreen = "view-workspace";
  store.state.globalRemaining = 1;
  store.state.globalLastTick = Date.now();
  store.save();

  init();
  assert.ok(!document.querySelector("#view-workspace").classList.contains("hidden"));
  await new Promise((resolve) => setTimeout(resolve, 1150));

  assert.equal(store.state.sessionStatus, "completed");
  assert.equal(store.state.sessionEndReason, "time-expired");
  assert.equal(document.querySelector("#fld-N").disabled, true);
  assert.ok(document.querySelector("#session-complete-notice"));
  assert.ok(document.querySelector("#global-timer-bar").classList.contains("hidden"));
});
