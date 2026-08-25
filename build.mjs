/* ============================================================
   BUILD — génère une version "monofichier" autonome (sans serveur)
   ------------------------------------------------------------
   Le fichier produit (dist/boussole-4d-standalone.html) embarque :
     - le CSS  -> <style> inline
     - tous les modules JS packagés via esbuild -> <script> inline (IIFE)
   Il s'ouvre directement via file:// (aucune dépendance, aucun
   module ES6, aucun CDN) -> parfait pour prévisualiser / partager.
   ============================================================ */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const __dirname = dirname(fileURLToPath(import.meta.url));

function read(p) {
  return readFileSync(join(__dirname, p), "utf8");
}

// 1. Bundle JS complet via esbuild (résolution propre des dépendances ESM)
const jsResult = esbuild.buildSync({
  entryPoints: [join(__dirname, "js/main.js")],
  bundle: true,
  format: "iife",
  minify: false,
  write: false
});

const bundleJs = jsResult.outputFiles[0].text;
const css = read("assets/styles.css");
const html = read("index.html");

// 2. CSS -> <style> inline
let out = html.replace(
  /<link rel="stylesheet" href="assets\/styles\.css">/,
  () => `<style>\n${css}\n</style>`
);

// 3. Retire les liens d'icônes/manifest pour garder un fichier 100% autonome
out = out
  .replace(/<link rel="icon"[^>]*>\s*/, "")
  .replace(/<link rel="apple-touch-icon"[^>]*>\s*/, "")
  .replace(/<link rel="manifest"[^>]*>\s*/, "");

// 4. Retire l'enregistrement du service worker (inutile en file://)
out = out.replace(/<script>\s*if \("serviceWorker"[\s\S]*?<\/script>\s*/, "");

// 5. Script modules -> bundle JS global
out = out.replace(
  /<script type="module" src="js\/main\.js"><\/script>/,
  () => `<script>\n${bundleJs}\n</script>`
);

mkdirSync(join(__dirname, "dist"), { recursive: true });
const target = join(__dirname, "dist", "boussole-4d-standalone.html");
writeFileSync(target, out);
console.log("✅ généré:", target, `(${Math.round(Buffer.byteLength(out) / 1024)} KB)`);
