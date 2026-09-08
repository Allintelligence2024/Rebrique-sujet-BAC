/* ============================================================
   BUILD — génère une version monofichier utilisable hors ligne.
   Le shell, le CSS, le bundle JS et les deux PDF locaux sont embarqués.
   Les liens vers des sources PDF externes restent des liens optionnels.
   ============================================================ */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCAL_PDFS = ["BAC2025_SVT_Sujet1.pdf", "BAC2025_SVT_Sujet2.pdf"];

function readText(path) {
  return readFileSync(join(__dirname, path), "utf8");
}

function pdfDataUrl(path) {
  return `data:application/pdf;base64,${readFileSync(join(__dirname, path)).toString("base64")}`;
}

const jsResult = esbuild.buildSync({
  entryPoints: [join(__dirname, "js/main.js")],
  bundle: true,
  format: "iife",
  minify: false,
  write: false
});

let bundleJs = jsResult.outputFiles[0].text;
for (const pdf of LOCAL_PDFS) {
  const pdfProperty = `pdf: ${JSON.stringify(pdf)}`;
  if (!bundleJs.includes(pdfProperty))
    throw new Error(`Standalone build cannot find data property for ${pdf}`);
  // Replace only the subject's runtime PDF property. The same filename may also
  // appear as provenance metadata and must not duplicate a multi-megabyte data URL.
  bundleJs = bundleJs.replace(pdfProperty, `pdf: ${JSON.stringify(pdfDataUrl(pdf))}`);
}

const css = readText("assets/styles.css");
const html = readText("index.html");

// Embed the stylesheet. Accept both HTML and XHTML-style self-closing links.
let out = html.replace(
  /<link\s+rel="stylesheet"\s+href="assets\/styles\.css"\s*\/?>/,
  () => `<style>\n${css}\n</style>`
);

// A standalone file has no installable manifest or external icon dependency.
out = out
  .replace(/\s*<link\s+rel="icon"[^>]*\/?>/g, "")
  .replace(/\s*<link\s+rel="apple-touch-icon"[^>]*\/?>/g, "")
  .replace(/\s*<link\s+rel="manifest"[^>]*\/?>/g, "");

out = out.replace(
  /<script\s+type="module"\s+src="js\/main\.js"><\/script>/,
  () => `<script>\n${bundleJs}\n</script>`
);

const forbiddenReferences = [
  'href="assets/styles.css"',
  'src="js/main.js"',
  'href="manifest.webmanifest"',
  'href="assets/icon-192.png"',
  'href="assets/icon-512.png"'
];
for (const reference of forbiddenReferences) {
  if (out.includes(reference))
    throw new Error(`Standalone build still contains external reference: ${reference}`);
}
for (const pdf of LOCAL_PDFS) {
  if (out.includes(`pdf: "${pdf}"`)) throw new Error(`Standalone build did not embed ${pdf}`);
}

mkdirSync(join(__dirname, "dist"), { recursive: true });
const target = join(__dirname, "dist", "boussole-4d-standalone.html");
writeFileSync(target, out);
console.log("✅ généré:", target, `(${Math.round(Buffer.byteLength(out) / 1024)} KB)`);
