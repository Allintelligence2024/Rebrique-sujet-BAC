/* ============================================================
   Tests d'intégrité de l'archive 2013–2020 (data/archive.js)
   ------------------------------------------------------------
   Garde-fous :
   1. Toute année 2013–2020 doit avoir une session principale
      cataloguée pour se ET m.
   2. Les URLs doivent être des annales dzexams https valides et
      uniques (pas de liens inventés, pas de doublons).
   3. Les sessions/filières doivent être des valeurs contrôlées.
   4. Provenance datée + notes non vides (transparence exigée).
   5. Aucun mot-clé synthétique dans les provenances.
   6. Les années archivées ne doivent PAS être des années
      d'entraînement 4D activées (deux produits distincts).
   ============================================================ */
import { test } from "node:test";
import assert from "node:assert/strict";
import { ARCHIVE } from "../data/archive.js";

const BAD_KEYWORDS = ["synthetic", "généré", "LLM", "GPT", "Claude", "Gemini", "chatbot", "fabriqué"];

test("chaque année 2013–2020 a une session principale pour se et m", () => {
  for (let y = 2013; y <= 2020; y++) {
    const year = String(y);
    for (const stream of ["se", "m"]) {
      assert.ok(
        ARCHIVE.entries.some((e) => e.year === year && e.stream === stream && e.session === "main"),
        `session principale manquante pour ${year}/${stream}`
      );
    }
  }
});

test("les URLs annales sont https, dzexams et uniques", () => {
  const urls = ARCHIVE.entries.map((e) => e.url);
  assert.equal(new Set(urls).size, urls.length, "doublon d'URL d'annales");
  for (const e of ARCHIVE.entries) {
    assert.ok(
      e.url.startsWith("https://www.dzexams.com/ar/annales/"),
      `URL annales invalide pour ${e.year}/${e.stream}/${e.session}: ${e.url}`
    );
    assert.ok(!e.url.includes(" "), `URL avec espace pour ${e.year}`);
    if (e.pdfUrl) {
      assert.ok(e.pdfUrl.startsWith("https://"), `pdfUrl non https pour ${e.year}/${e.stream}/${e.session}`);
      assert.ok(
        e.pdfUrl.includes("dzexams.com/uploads/sujets/"),
        `pdfUrl hors des téléchargements dzexams pour ${e.year}/${e.stream}/${e.session}`
      );
    }
  }
});

test("sessions et filières contrôlées, valeurs de page contrôlées", () => {
  for (const e of ARCHIVE.entries) {
    assert.ok(["se", "m"].includes(e.stream), `filière inconnue: ${e.stream}`);
    assert.ok(["main", "exceptional"].includes(e.session), `session inconnue: ${e.session}`);
    assert.ok(["consulted", "index"].includes(e.page), `valeur page inconnue: ${e.page}`);
  }
});

test("provenance datée et notes de vérification non vides", () => {
  assert.match(ARCHIVE.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
  for (const e of ARCHIVE.entries) {
    assert.ok(e.notes && e.notes.length > 20, `notes trop courtes pour ${e.year}/${e.stream}/${e.session}`);
  }
});

test("aucun mot-clé synthétique dans les provenances", () => {
  const corpus = ARCHIVE.entries.map((e) => e.notes).join(" ") + " " + ARCHIVE.sourceLabel;
  const hits = BAD_KEYWORDS.filter((k) => corpus.toLowerCase().includes(k.toLowerCase()));
  assert.deepEqual(hits, [], `mot-clé interdit détecté: ${hits.join(", ")}`);
});

test("les années archivées ne sont pas des années d'entraînement 4D activées", async () => {
  const { APP_CONFIG } = await import("../data/subjects.js");
  const enabledIds = APP_CONFIG.years.filter((y) => y.enabled).map((y) => y.id);
  for (const e of ARCHIVE.entries) {
    assert.ok(
      !enabledIds.includes(e.year),
      `${e.year} est à la fois une année d'archive et une année d'entraînement activée — confusion de produits`
    );
  }
});
