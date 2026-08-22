/* ============================================================
   BUILD — génère une version "monofichier" autonome (sans serveur)
   ------------------------------------------------------------
   Le fichier produit (dist/boussole-4d-standalone.html) embarque :
     - le CSS  -> <style> inline
     - tous les modules JS -> un seul <script> (imports/exports retirés)
   Il s'ouvre directement via file:// (aucune dépendance, aucun
   module ES6, aucun CDN) -> parfait pour prévisualiser / partager.
   ============================================================ */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function read(p) { return readFileSync(join(__dirname, p), "utf8"); }

/* Retire les imports/exports pour assembler un unique script global. */
function stripModules(src) {
  return src
    .replace(/^\s*import\s+.*?from\s+["'][^"']+["'];\s*$/gm, "")
    .replace(/^\s*import\s+["'][^"']+["'];\s*$/gm, "")
    .replace(/^\s*export\s+default\s+/gm, "")
    .replace(/^\s*export\s+function\s+/gm, "function ")
    .replace(/^\s*export\s+const\s+/gm, "const ")
    .replace(/^\s*export\s+let\s+/gm, "let ")
    .replace(/^\s*export\s+class\s+/gm, "class ")
    .replace(/^\s*export\s*\{[^}]*\}\s*;?\s*$/gm, "")
    // sépare chaque module et colle le tout dans une IIFE stricte
    .replace(/^\s*$/, "");
}

const modules = [
  "data/subjects.js",
  "js/store.js",
  "js/engine.js",
  "js/ui.js"
].map(f => `/* ---- ${f} ---- */\n` + stripModules(read(f))).join("\n\n");

// appel direct d'init() (le script est en fin de <body>, tout le DOM existe)
const bundle = modules + "\n\ninit();\n";

const css = read("assets/styles.css");
const html = read("index.html");

// CSS -> <style>  (replacer en fonction : évite l'interprétation des "$" du CSS)
let out = html.replace(
  /<link rel="stylesheet" href="assets\/styles\.css">/,
  () => `<style>\n${css}\n</style>`
);

// retire les liens d'icônes/manifest pour garder un fichier 100% autonome
out = out.replace(/<link rel="icon"[^>]*>\s*/, "")
         .replace(/<link rel="apple-touch-icon"[^>]*>\s*/, "")
         .replace(/<link rel="manifest"[^>]*>\s*/, "");

// retire l'enregistrement du service worker (inutile en file://)
out = out.replace(/<script>\s*if \("serviceWorker"[\s\S]*?<\/script>\s*/, "");

// script modules -> script global (IIFE)
//  IMPORTANT : remplacement par une FONCTION, sinon "$$" du bundle serait
//  interprété comme "$" littéral par String.replace.
out = out.replace(
  /<script type="module" src="js\/main\.js"><\/script>/,
  () => `<script>\n(function(){\n"use strict";\n${bundle}\n})();\n</script>`
);

mkdirSync(join(__dirname, "dist"), { recursive: true });
const target = join(__dirname, "dist", "boussole-4d-standalone.html");
writeFileSync(target, out);
console.log("✅ généré:", target, `(${Math.round(Buffer.byteLength(out) / 1024)} KB)`);
