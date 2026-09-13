/* ============================================================
   Couche texte d'une page PDF, avec coordonnées
   ------------------------------------------------------------
   La couche texte des scans ministériels est souvent inversée ou
   bruitée ; mais les libellés de figures y sont parfois intacts et
   leur position (x, y) dit sans ambiguïté à quel élément dessiné ils
   correspondent. Cet outil imprime chaque fragment avec sa position,
   ce qui permet de reconstituer un schéma sans se fier à l'ordre de
   lecture du PDF.

   Usage :
     node scripts/dump-pdf-text.mjs subjects/M/2020/sujet-1.pdf 1
     node scripts/dump-pdf-text.mjs M/dzexams-…-2273619.pdf 4 --raw
   ============================================================ */
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const pdfjs = require("pdfjs-dist/legacy/build/pdf.js");

const file = process.argv[2];
const pageNumber = Number(process.argv[3] || 1);
const raw = process.argv.includes("--raw");
if (!file) {
  console.error("usage: node scripts/dump-pdf-text.mjs <pdf> <page> [--raw]");
  process.exit(2);
}

const doc = await pdfjs.getDocument({ data: new Uint8Array(readFileSync(file)) }).promise;
const page = await doc.getPage(pageNumber);
const content = await page.getTextContent();
console.log(`${file} — page ${pageNumber}/${doc.numPages} — ${content.items.length} fragments`);
for (const item of content.items) {
  if (typeof item.str !== "string" || !item.str.trim()) continue;
  const [a, , , d, x, y] = item.transform;
  if (raw) {
    console.log(`${x.toFixed(0)}\t${y.toFixed(0)}\t${item.str}`);
  } else {
    // Lecture : hauteur de ligne déduite de la matrice, texte débarrassé des
    // caractères de contrôle que les scans laissent dans la couche texte.
    const text = item.str.replace(/[\u0000-\u001f\u202a-\u202e]/g, "").trim();
    if (text)
      console.log(
        `x=${x.toFixed(0).padStart(5)} y=${y.toFixed(0).padStart(5)} h=${Math.abs(d).toFixed(0)}  ${text}`
      );
  }
}
process.exit(0);
