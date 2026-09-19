/* Mesure l'impact d'une bascule des 58 PDF locaux vers des liens externes.
 * Tout est mesuré sur l'arbre : aucune estimation.
 * Usage: node scripts/measure-external-links-impact.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (p) => readFileSync(join(root, p), "utf8");
const manifest = JSON.parse(read("subjects/manifest.json"));

// 1. pdfLocalUrl / pdfExternalUrl par sujet dans data/years.
const externalByLocalFile = new Map();
const localRefs = new Set();
const walkYears = (dir) => {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) {
      walkYears(full);
      continue;
    }
    if (!full.endsWith(".js")) continue;
    const text = readFileSync(full, "utf8");
    const constUrls = {};
    for (const cm of text.matchAll(/const\s+([A-Z_0-9]+)\s*=\s*"([^"]+)"/g)) constUrls[cm[1]] = cm[2];
    for (const lm of [...text.matchAll(/pdfLocalUrl:\s*"([^"]+)"/g)]) {
      const local = lm[1].replace(/^\//, "");
      localRefs.add(local);
      const before = text.slice(0, lm.index);
      const exts = [...before.matchAll(/pdfExternalUrl:\s*([A-Z_0-9]+|"[^"]+")/g)];
      if (!exts.length) continue;
      const raw = exts[exts.length - 1][1];
      const resolved = raw.startsWith('"') ? raw.slice(1, -1) : constUrls[raw] || null;
      if (!resolved) continue;
      if (!externalByLocalFile.has(local)) externalByLocalFile.set(local, new Set());
      externalByLocalFile.get(local).add(resolved);
    }
  }
};
walkYears(join(root, "data", "years"));

// 2. Consommateurs mesures (chaines litterales presentes dans le code).
const viewer = read("js/ui/pdf-viewer.js");
const renderer = read("js/ui/pdf-renderer.js");
const strategy = read("js/ui/screens/strategy.js");
const hub = read("js/ui/screens/hub.js");
const sw = read("sw.js");
const server = read("server.mjs");
const build = read("build.mjs");
const publicAssets = read("scripts/lib/public-assets.mjs");
const verifyRelease = read("scripts/verify-release.mjs");
const pdfIntegrity = read("tests/pdf-content-integrity.test.mjs");
const pdfViewerTest = read("tests/pdf-viewer.test.mjs");
const swRuntimeTest = read("tests/service-worker-runtime.test.mjs");
const serverTest = read("tests/server.test.mjs");
const lazyTest = read("tests/lazy-loading.test.mjs");
const extBranch = viewer.slice(viewer.indexOf("if (external) {"));
const consumers = {
  "pdf-viewer branche locale (canvas + iframe masquee + ouverture + download)": [
    viewer.includes("subject?.pdfLocalUrl"),
    viewer.includes("data-pdf-src"),
    viewer.includes('iframe class="pdf-frame"'),
    viewer.includes("download")
  ],
  "pdf-viewer branche externe existante (sans local, sans iframe, sans download)": [
    viewer.includes("if (external) {"),
    extBranch.includes("فتح المصدر الخارجي") &&
      !extBranch.includes("download") &&
      !extBranch.includes("<iframe")
  ],
  "pdf-renderer rendu canvas + repli iframe": [
    renderer.includes("fallbackToFrame"),
    renderer.includes("iframe.pdf-frame")
  ],
  "strategy affichage via pdfViewerHTML(subject)": [strategy.includes("pdfViewerHTML(subject)")],
  "hub consultation archive via localPdfUrls": [hub.includes("entry.localPdfUrls")],
  "SW: PDF sujets en cache runtime borne, jamais precache": [
    sw.includes("Les data/years/** et les PDF sont volontairement absents"),
    sw.includes("/subjects\\/"),
    sw.includes("RUNTIME_MAX_ENTRIES")
  ],
  "server + public-assets: subjects servi et publie": [
    server.includes('"subjects/"'),
    publicAssets.includes('"subjects"')
  ],
  "build: dist/site recopie subjects, standalone sans PDF": [
    build.includes("mirrors the repository's `subjects/` directory"),
    build.includes("contains no PDF at all")
  ],
  "verify-release: verifie dist/site dont PDF": [
    verifyRelease.includes("release.json") && verifyRelease.includes("contentSha256")
  ],
  "test integrite: refs data existent, aucun orphelin, SW borne": [
    pdfIntegrity.includes("toute référence PDF écrite dans data/ existe réellement"),
    pdfIntegrity.includes("aucun PDF présent sur le disque n'est orphelin")
  ],
  "test viewer: externe sans iframe verrouille": [
    pdfViewerTest.includes("un sujet sans fichier local garde le lien source")
  ],
  "test SW runtime: PDF via cache borne": [
    swRuntimeTest.includes("un PDF de sujet doit passer par le cache borné")
  ],
  "test server Range via subjects/SE/2025/sujet-1.pdf": [serverTest.includes("subjects/SE/2025/sujet-1.pdf")],
  "test lazy via pdfLocalUrl + pdfExternalUrl dzexams": [
    lazyTest.includes("sujet-1"),
    lazyTest.includes("pdfExternalUrl")
  ]
};

const rows = manifest.map((e) => ({
  ...e,
  manifestUrl: /^https:\/\//.test(e.source || "") ? e.source : null,
  payloadUrls: [...(externalByLocalFile.get(e.file) || [])].sort()
}));
const DIRECT_PDF = /\/uploads\/sujets\/officiels\/.*\.pdf$/;
const withDirectPdf = rows.filter(
  (r) => (r.manifestUrl && DIRECT_PDF.test(r.manifestUrl)) || r.payloadUrls.some((u) => DIRECT_PDF.test(u))
);
const withoutDirectPdf = rows.filter((r) => !withDirectPdf.includes(r));
console.log(
  JSON.stringify(
    {
      manifestEntries: rows.length,
      manifestLocalRefsInYears: localRefs.size,
      payloadSubjectsLocal: externalByLocalFile.size,
      withDirectPdfExternal: withDirectPdf.length,
      withoutDirectPdfExternal: withoutDirectPdf.length,
      missing: withoutDirectPdf.map((r) => r.file),
      consumers: Object.fromEntries(Object.entries(consumers).map(([k, v]) => [k, v.every(Boolean)]))
    },
    null,
    2
  )
);
