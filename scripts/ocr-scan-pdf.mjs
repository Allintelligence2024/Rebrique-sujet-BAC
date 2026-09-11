/* OCR one scanned PDF using pdfjs-dist + @napi-rs/canvas + tesseract.js.
 * Renders each page at 2x scale to PNG, runs Arabic+English OCR.
 * Usage: node scripts/ocr-scan-pdf.mjs subjects/SE/2025/sujet-1.pdf */
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
process.chdir(root);
const require = createRequire(import.meta.url);
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
const { createCanvas } = require("@napi-rs/canvas");

const pdfPath = process.argv[2];
if (!pdfPath) { console.error("usage: node scripts/ocr-scan-pdf.mjs <path>"); process.exit(1); }

// Tell pdfjs how to create canvases
class NodeCanvasFactory {
  create(w, h) {
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext("2d");
    return { canvas, context: ctx };
  }
  reset({ canvas }, w, h) {
    canvas.width = w; canvas.height = h;
  }
  destroy() {}
}
pdfjsLib.GlobalWorkerOptions.workerSrc = require.resolve("pdfjs-dist/legacy/build/pdf.worker.js");

const data = new Uint8Array(readFileSync(join(root, pdfPath)));
const doc = await pdfjsLib.getDocument({
  data,
  disableWorker: true,
  isEvalSupported: false,
  canvasFactory: new NodeCanvasFactory(),
}).promise;
console.log(`PDF ${pdfPath}: ${doc.numPages} pages`);

const Tesseract = (await import("tesseract.js")).default;
const tjsRoot = require.resolve("tesseract.js/src/worker-script/node/index.js");
const corePath = require.resolve("tesseract.js-core/tesseract-core-lstm.wasm.js");
console.log("Loading tesseract ara+eng from /tmp/tessdata...", { worker: tjsRoot, corePath });
const worker = await Tesseract.createWorker(["ara", "eng"], 1, {
  langPath: "/tmp/tessdata",
  workerPath: tjsRoot,
  corePath: corePath,
  cachePath: "/tmp/tesscache",
  logger: (m) => { if (m.status === "recognizing text") process.stderr.write(`\r  ${m.status} ${(m.progress*100|0)}%`); }
});

let full = "";
const outRel = "scripts/extracted/" + pdfPath + ".ocr.txt";
mkdirSync(join(root, dirname(outRel)), { recursive: true });

for (let i = 1; i <= doc.numPages; i++) {
  process.stderr.write(`\nPage ${i}/${doc.numPages} rendering...\n`);
  const page = await doc.getPage(i);
  const viewport = page.getViewport({ scale: 2.0 });
  const canvas = createCanvas(viewport.width, viewport.height);
  const ctx = canvas.getContext("2d");
  await page.render({ canvasContext: ctx, viewport, canvasFactory: new NodeCanvasFactory() }).promise;
  const png = canvas.toBuffer("image/png");
  const { data: { text, confidence } } = await worker.recognize(png);
  full += `\n\n===== PAGE ${i} (confiance ${confidence.toFixed(0)}%) =====\n${text}`;
}
await worker.terminate();
writeFileSync(join(root, outRel), full, "utf8");
console.log(`\nWrote ${outRel} (${full.length} chars)`);
