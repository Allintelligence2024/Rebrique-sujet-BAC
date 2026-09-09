import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { createStaticServer, isPublicRoute, securityHeaders } from "../server.mjs";

let server;
let origin;

before(async () => {
  server = createStaticServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  origin = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
});

test("la liste blanche ne reconnaît que les routes de déploiement", () => {
  for (const route of [
    "index.html",
    "manifest.webmanifest",
    "release.json",
    "sw.js",
    "assets/styles.css",
    "js/main.js",
    "data/subjects.js",
    "BAC2025_SVT_Sujet1.pdf"
  ]) {
    assert.equal(isPublicRoute(route), true, `${route} devrait être publique`);
  }
  for (const route of [
    ".git/HEAD",
    ".git/config",
    "package.json",
    "server.mjs",
    "build.mjs",
    "tests/ui.test.mjs",
    "docs/REMEDIATION_PLAN.md",
    "patches/README.md",
    "_v1_backup/index.html",
    "assets/../package.json"
  ]) {
    assert.equal(isPublicRoute(route), false, `${route} ne doit jamais être publique`);
  }
});

test("le serveur livre le shell avec CSP et refuse les fichiers privés", async () => {
  const home = await globalThis.fetch(`${origin}/`);
  assert.equal(home.status, 200);
  assert.match(home.headers.get("content-type"), /^text\/html/);
  assert.equal(home.headers.get("content-security-policy"), securityHeaders["Content-Security-Policy"]);
  assert.match(home.headers.get("content-security-policy"), /script-src 'self'/);
  assert.match(home.headers.get("content-security-policy"), /style-src 'self'/);
  assert.doesNotMatch(home.headers.get("content-security-policy"), /(?:script|style)-src[^;]*unsafe-inline/);

  for (const path of [
    "/.git/HEAD",
    "/.git/config",
    "/package.json",
    "/server.mjs",
    "/tests/ui.test.mjs",
    "/docs/REMEDIATION_PLAN.md",
    "/patches/README.md",
    "/_v1_backup/index.html"
  ]) {
    const response = await globalThis.fetch(origin + path);
    assert.equal(response.status, 404, `${path} a été exposé`);
  }
});

test("les PDF annoncent leur taille sans être servis dans le shell HTML", async () => {
  const home = await globalThis.fetch(`${origin}/index.html`);
  assert.doesNotMatch(await home.text(), /<iframe[^>]+\.pdf/);
  const pdf = await globalThis.fetch(`${origin}/BAC2025_SVT_Sujet1.pdf`, { method: "HEAD" });
  assert.equal(pdf.status, 200);
  assert.equal(pdf.headers.get("content-length"), "1099674");
  assert.equal(pdf.headers.get("cache-control"), "public, max-age=0, must-revalidate");
  assert.match(pdf.headers.get("x-miftah-build"), /^[a-f0-9]{12}$/);
});

test("les méthodes d'écriture sont refusées", async () => {
  const response = await globalThis.fetch(`${origin}/index.html`, { method: "POST", body: "x" });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET, HEAD");
});
