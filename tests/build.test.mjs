import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("le build monofichier embarque le shell et les PDF locaux", () => {
  execFileSync(process.execPath, [join(root, "build.mjs")], { cwd: root, stdio: "pipe" });
  const output = readFileSync(join(root, "dist", "boussole-4d-standalone.html"), "utf8");

  assert.match(output, /<style>/);
  assert.match(output, /data:application\/pdf;base64,/);
  assert.match(output, /location\?\.protocol !== "file:"/);
  assert.doesNotMatch(output, /href="assets\/styles\.css"/);
  assert.doesNotMatch(output, /src="js\/main\.js"/);
  assert.doesNotMatch(output, /href="manifest\.webmanifest"/);
  assert.doesNotMatch(output, /"BAC2025_SVT_Sujet[12]\.pdf"/);
});
