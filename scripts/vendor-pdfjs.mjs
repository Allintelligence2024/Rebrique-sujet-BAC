/* ============================================================
   Intégration de pdf.js pour le visionneur embarqué.
   ------------------------------------------------------------
   Le rendu natif du navigateur (<iframe src="….pdf">) n'est pas
   fiable : bloqué par object-src 'none' sur Chromium, et tout
   simplement indisponible sur Safari iOS / Chrome Android, où le
   cadre reste vide. Les pages sont donc rendues sur <canvas> par
   pdf.js, servi par la même origine (CSP script-src 'self').

   Les fichiers sont copiés depuis node_modules vers assets/vendor/
   pour que l'application fonctionne sans npm ni CDN. Relancer après
   une mise à jour de pdfjs-dist :  npm run vendor:pdfjs
   ============================================================ */
import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "node_modules", "pdfjs-dist", "build");
const target = join(root, "assets", "vendor", "pdfjs");
const files = ["pdf.min.js", "pdf.worker.min.js", "LICENSE"];

if (!existsSync(source)) {
  console.error("pdfjs-dist introuvable : lancez d'abord `npm ci`.");
  process.exit(1);
}
mkdirSync(target, { recursive: true });
for (const file of files) {
  const from = file === "LICENSE" ? join(root, "node_modules", "pdfjs-dist", file) : join(source, file);
  if (!existsSync(from)) {
    console.error(`fichier absent: ${from}`);
    process.exit(1);
  }
  copyFileSync(from, join(target, file));
  console.log(`  ${file} — ${(statSync(join(target, file)).size / 1024).toFixed(0)} Ko`);
}
console.log(`pdf.js intégré dans assets/vendor/pdfjs/ (${files.length} fichiers).`);
