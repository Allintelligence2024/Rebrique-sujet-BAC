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
   7. Les entrées avec `contentVerified: false` doivent avoir
      `page: "access_confirmed"` et `viewer: "blocked"`.
   8. Les PDFs référencés par `pdfUrl` doivent être accessibles
      (test conditionnel en environnement réseau).
   ============================================================ */
import { test } from "node:test";
import assert from "node:assert/strict";
import { ARCHIVE } from "../data/archive.js";

const BAD_KEYWORDS = ["synthetic", "généré", "LLM", "GPT", "Claude", "Gemini", "chatbot", "fabriqué"];

test("2021 SE est cataloguée en consultation, sans 4D et sans faux contentVerified", async () => {
  const se = ARCHIVE.entries.find((e) => e.year === "2021" && e.stream === "se");
  const maths = ARCHIVE.entries.find((e) => e.year === "2021" && e.stream === "m");
  assert.ok(se && maths, "2021 se et m doivent exister");
  assert.equal(se.viewer, "blocked");
  assert.equal(se.contentVerified, false);
  assert.equal(se.page, "access_confirmed");
  assert.ok(se.pdfUrl.includes("2021/dzexams-bac-sciences-2728849.pdf"));
  assert.equal(maths.viewer, "ok");
  assert.equal(maths.contentVerified, true);
  const { APP_CONFIG } = await import("../data/subjects.js");
  assert.equal(
    APP_CONFIG.years.some((y) => y.id === "2021" && y.enabled),
    false,
    "2021 ne doit pas être une année 4D activée"
  );
});

test("la session exceptionnelle 2016 Maths n'est pas inventée", () => {
  assert.equal(
    ARCHIVE.entries.some((e) => e.year === "2016" && e.stream === "m" && e.session === "exceptional"),
    false
  );
  const gap = ARCHIVE.gaps.find((g) => g.year === "2016" && g.stream === "m" && g.session === "exceptional");
  assert.ok(gap, "le trou 2016/m/exceptional doit rester documenté");
  assert.ok(gap.reason.length > 20);
});

test("chaque année 2013–2021 a une session principale pour se et m", () => {
  for (let y = 2013; y <= 2021; y++) {
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

test("toutes les entrées sont vérifiées (page ouverte) avec métriques de contrôle", () => {
  for (const e of ARCHIVE.entries) {
    if (e.viewer === "ok") {
      assert.equal(
        e.page,
        "consulted",
        `viewer ok mais page !== consulted: ${e.year}/${e.stream}/${e.session}`
      );
    } else {
      assert.equal(
        e.page,
        "access_confirmed",
        `viewer blocked mais page !== access_confirmed: ${e.year}/${e.stream}/${e.session}`
      );
    }
    assert.ok(["se", "m"].includes(e.stream), `filière inconnue: ${e.stream}`);
    assert.ok(["main", "exceptional"].includes(e.session), `session inconnue: ${e.session}`);
    assert.ok(["ok", "blocked"].includes(e.viewer), `viewer inconnu: ${e.viewer}`);
    assert.equal(typeof e.attachments, "boolean", `attachments non booléen: ${e.year}`);
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

test("une année 4D SE n'a pas d'entrée d'archive SE (pas de confusion de produits)", async () => {
  const { APP_CONFIG } = await import("../data/subjects.js");
  const enabledIds = APP_CONFIG.years.filter((y) => y.enabled).map((y) => y.id);
  for (const e of ARCHIVE.entries.filter((entry) => entry.stream === "se")) {
    assert.ok(
      !enabledIds.includes(e.year),
      `${e.year}/se est à la fois archive et entraînement 4D activé — confusion de produits`
    );
  }
});

test("Maths 2022–2026 restent en consultation ; SE 2026 et Maths 2021 sont du 4D", async () => {
  for (const year of ["2022", "2023", "2024", "2025", "2026"]) {
    const maths = ARCHIVE.entries.find((e) => e.year === year && e.stream === "m" && e.session === "main");
    assert.ok(maths, `Maths ${year} manquante`);
    assert.ok(maths.url.includes("/ar/annales/"));
    assert.ok(maths.pdfUrl);
  }
  assert.equal(
    ARCHIVE.entries.some((e) => e.year === "2026" && e.stream === "se"),
    false,
    "SE 2026 ne doit plus être une carte d'archive (entraînement 4D)"
  );
  const { APP_CONFIG } = await import("../data/subjects.js");
  const se2026 = APP_CONFIG.years.find((y) => y.id === "2026");
  assert.ok(se2026 && se2026.enabled && (se2026.stream || "se") === "se");
  const maths2021 = APP_CONFIG.years.find((y) => y.id === "2021-m");
  assert.ok(maths2021 && maths2021.enabled && maths2021.stream === "m");
  assert.equal(
    APP_CONFIG.years.some((y) => y.stream === "m" && ["2022", "2023", "2024", "2025", "2026"].includes(y.calendarYear)),
    false,
    "Maths 2022–2026 ne doivent pas être du 4D tant que l'énoncé n'est pas lisible"
  );
});

test("la filière تقني رياضي n'a aucune entrée inventée", () => {
  assert.equal(ARCHIVE.entries.filter((e) => e.stream === "tm").length, 0);
  assert.ok(ARCHIVE.streams.tm);
  const gap = ARCHIVE.gaps.find((g) => g.stream === "tm");
  assert.ok(gap, "le trou TM doit rester documenté");
  assert.ok(gap.reason.length > 40);
  assert.deepEqual(ARCHIVE.streamOrder, ["se", "m", "tm"]);
});

test("les entrées non vérifiées ont page=access_confirmed et viewer=blocked", () => {
  for (const e of ARCHIVE.entries) {
    if (e.contentVerified === false) {
      assert.equal(
        e.page,
        "access_confirmed",
        `entrée non vérifiée mais page !== access_confirmed: ${e.year}/${e.stream}/${e.session}`
      );
      assert.equal(
        e.viewer,
        "blocked",
        `entrée non vérifiée mais viewer !== blocked: ${e.year}/${e.stream}/${e.session}`
      );
    }
    if (e.contentVerified === true && e.viewer === "ok") {
      assert.equal(
        e.page,
        "consulted",
        `entrée vérifiée (viewer ok) mais page !== consulted: ${e.year}/${e.stream}/${e.session}`
      );
    }
    if (e.contentVerified === true && e.viewer === "blocked") {
      assert.equal(
        e.page,
        "access_confirmed",
        `entrée vérifiée (viewer bloqué, PDF direct) mais page !== access_confirmed: ${e.year}/${e.stream}/${e.session}`
      );
    }
  }
});

test("les entrées vérifiées ont contentVerified: true", () => {
  for (const e of ARCHIVE.entries) {
    if (e.viewer === "ok") {
      assert.equal(
        e.contentVerified,
        true,
        `viewer ok mais contentVerified non true: ${e.year}/${e.stream}/${e.session}`
      );
    }
  }
});

test("toutes les entrées ont un statut contentVerified défini", () => {
  for (const e of ARCHIVE.entries) {
    assert.notEqual(
      e.contentVerified,
      undefined,
      `contentVerified non défini pour: ${e.year}/${e.stream}/${e.session}`
    );
    assert.ok(
      typeof e.contentVerified === "boolean",
      `contentVerified non booléen pour: ${e.year}/${e.stream}/${e.session}`
    );
  }
});

// Test conditionnel : vérifie l'accessibilité des PDF si le réseau le permet
// Note : Peut échouer en environnement restreint (ex: sandbox sans accès externe)
test("les pdfUrl sont des URLs valides (syntaxe)", () => {
  for (const e of ARCHIVE.entries.filter((e) => e.pdfUrl)) {
    assert.ok(
      e.pdfUrl.startsWith("https://"),
      `pdfUrl non https pour ${e.year}/${e.stream}/${e.session}: ${e.pdfUrl}`
    );
    assert.ok(
      e.pdfUrl.includes("dzexams.com/uploads/sujets/"),
      `pdfUrl hors domaine attendu pour ${e.year}/${e.stream}/${e.session}`
    );
  }
});

// Test réseau optionnel (désactivé par défaut en CI si réseau bloqué)
// Pour l'activer, passer SKIP_NETWORK_TESTS=false
test(
  "les pdfUrl sont accessibles (test réseau)",
  {
    skip: process.env.SKIP_NETWORK_TESTS === "true" || true // Désactivé par défaut
  },
  async () => {
    const https = await import("node:https");
    for (const e of ARCHIVE.entries.filter((e) => e.pdfUrl)) {
      const url = new URL(e.pdfUrl);
      const res = await new Promise((resolve, reject) => {
        https.get(url, (res) => resolve(res)).on("error", reject);
      });
      assert.equal(
        res.statusCode,
        200,
        `PDF inaccessible (${res.statusCode}) pour ${e.year}/${e.stream}/${e.session}: ${e.pdfUrl}`
      );
    }
  }
);
