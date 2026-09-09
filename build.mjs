/* ============================================================
   Builds two deterministic, offline-capable deliverables:
   1. dist/site/ — exact production static surface + release.json;
   2. dist/boussole-4d-standalone.html — single file for file://.
   The standalone embeds the two local PDFs once. The PWA site does not:
   PDFs are fetched explicitly by the student and runtime-cached afterwards.
   ============================================================ */
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";
import {
  computeBuildMetadata,
  fileMetadata,
  listPublicAssets,
  sha256
} from "./scripts/lib/public-assets.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const LOCAL_PDFS = ["BAC2025_SVT_Sujet1.pdf", "BAC2025_SVT_Sujet2.pdf"];

function readText(path) {
  return readFileSync(join(root, path), "utf8");
}

function pdfDataUrl(path) {
  return `data:application/pdf;base64,${readFileSync(join(root, path)).toString("base64")}`;
}

function verifiedBuildMetadata() {
  const metadata = computeBuildMetadata(root);
  const version = readText("js/app-version.js");
  const declared = version.match(/APP_BUILD_ID\s*=\s*"([a-f0-9]{12})"/)?.[1];
  if (declared !== metadata.buildId) {
    throw new Error(
      `js/app-version.js is stale (${declared || "missing"} != ${metadata.buildId}). Run npm run pwa:version.`
    );
  }
  return metadata;
}

function buildStandalone() {
  const jsResult = esbuild.buildSync({
    entryPoints: [join(root, "js/main.js")],
    bundle: true,
    format: "iife",
    minify: false,
    write: false
  });

  let bundleJs = jsResult.outputFiles[0].text;
  for (const pdf of LOCAL_PDFS) {
    const pdfProperty = `pdf: ${JSON.stringify(pdf)}`;
    if (!bundleJs.includes(pdfProperty)) {
      throw new Error(`Standalone build cannot find data property for ${pdf}`);
    }
    // Replace only the subject runtime property. Provenance strings containing
    // the same filename must not duplicate a multi-megabyte data URL.
    bundleJs = bundleJs.replace(pdfProperty, `pdf: ${JSON.stringify(pdfDataUrl(pdf))}`);
  }

  const css = readText("assets/styles.css");
  const appVersion = readText("js/app-version.js");
  let out = readText("index.html").replace(
    /<link\s+rel="stylesheet"\s+href="assets\/styles\.css"\s*\/?>/,
    () => `<style>\n${css}\n</style>`
  );

  out = out
    .replace(/\s*<link\s+rel="icon"[^>]*\/?>/g, "")
    .replace(/\s*<link\s+rel="apple-touch-icon"[^>]*\/?>/g, "")
    .replace(/\s*<link\s+rel="manifest"[^>]*\/?>/g, "")
    .replace(/<script\s+src="js\/app-version\.js"><\/script>/, () => `<script>\n${appVersion}\n</script>`)
    .replace(
      /<script\s+type="module"\s+src="js\/main\.js"><\/script>/,
      () => `<script>\n${bundleJs}\n</script>`
    );

  for (const reference of [
    'href="assets/styles.css"',
    'src="js/app-version.js"',
    'src="js/main.js"',
    'href="manifest.webmanifest"',
    'href="assets/icon-192.png"',
    'href="assets/icon-512.png"'
  ]) {
    if (out.includes(reference)) {
      throw new Error(`Standalone build still contains external reference: ${reference}`);
    }
  }
  for (const pdf of LOCAL_PDFS) {
    if (out.includes(`pdf: "${pdf}"`)) throw new Error(`Standalone build did not embed ${pdf}`);
  }

  const target = join(root, "dist", "boussole-4d-standalone.html");
  writeFileSync(target, out);
  return { target, bytes: Buffer.byteLength(out), sha256: sha256(out) };
}

function releaseDigest(files) {
  return sha256(files.map((file) => `${file.path}\0${file.sha256}\0`).join(""));
}

function buildProductionSite(metadata) {
  const targetRoot = join(root, "dist", "site");
  rmSync(targetRoot, { recursive: true, force: true });
  mkdirSync(targetRoot, { recursive: true });

  const assets = listPublicAssets(root);
  for (const path of assets) {
    const destination = join(targetRoot, path);
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(join(root, path), destination);
  }
  const files = assets.map((path) => fileMetadata(targetRoot, path));
  const release = {
    schemaVersion: 1,
    buildId: metadata.buildId,
    entrypoint: "index.html",
    fileCount: files.length,
    contentSha256: releaseDigest(files),
    files
  };
  writeFileSync(join(targetRoot, "release.json"), `${JSON.stringify(release, null, 2)}\n`);
  return { targetRoot, release };
}

mkdirSync(join(root, "dist"), { recursive: true });
const metadata = verifiedBuildMetadata();
const standalone = buildStandalone();
const production = buildProductionSite(metadata);
console.log(
  `✅ production: ${production.targetRoot} (${production.release.fileCount} files, build ${metadata.buildId})`
);
console.log(
  `✅ standalone: ${standalone.target} (${Math.round(standalone.bytes / 1024)} KB, sha256 ${standalone.sha256.slice(0, 12)})`
);
