# Analyse d'impact — bascule des 58 PDF locaux vers des liens externes

_Date : 19 septembre 2026. Tout est mesuré sur l'arbre (HEAD `db399d7`) : aucune estimation._
_Mesure source : `node scripts/measure-external-links-impact.mjs`._

## 1. Ce qui consomme les fichiers locaux de `subjects/`

Commande : `node scripts/measure-external-links-impact.mjs` → 14/14 consommateurs confirmés `true`.

- `js/ui/pdf-viewer.js` — branche locale : `subject?.pdfLocalUrl`, rendu `<canvas>` via `data-pdf-src`, `<iframe class="pdf-frame">` masquée en repli, liens d'ouverture et `download`. Branche externe déjà existante : `if (external) {` → lien `فتح المصدر الخارجي` en `_blank`, sans `<iframe>` ni `download` (verrouillé par `tests/pdf-viewer.test.mjs` : « un sujet sans fichier local garde le lien source, sans cadre vide »).
- `js/ui/pdf-renderer.js` — rendu pdf.js sur canvas (`fallbackToFrame`, `iframe.pdf-frame`) : ne sait lire qu'une URL même origine servie par l'application.
- `js/ui/screens/strategy.js` — affichage épreuve via `pdfViewerHTML(subject)` : sans `pdfLocalUrl`, bascule automatique vers la branche externe.
- `js/ui/screens/hub.js` — cartes de consultation d'archive via `entry.localPdfUrls` + `pdfViewerHTML({ pdfLocalUrl: href })`.
- `sw.js` — PDF sujets reconnus par `isRuntimeAsset` (`/subjects\//`), jamais précachés (« Les data/years/** et les PDF sont volontairement absents »), cache runtime borné `RUNTIME_MAX_ENTRIES = 20`.
- `server.mjs:52` + `scripts/lib/public-assets.mjs:6` — `subjects/` servi au public et copié dans la release.
- `build.mjs` — `dist/site` recopie `subjects/` (« mirrors the repository's `subjects/` directory ») ; le monofichier standalone « contains no PDF at all ».
- `scripts/verify-release.mjs` — vérifie `release.json` + `contentSha256` de `dist/site`, PDF inclus.
- Tests verrouillant le local : `tests/pdf-content-integrity.test.mjs` (toute ref `data/` existe, aucun PDF orphelin, SW borné), `tests/service-worker-runtime.test.mjs` (PDF via cache borné), `tests/server.test.mjs` (Range via `subjects/SE/2025/sujet-1.pdf`), `tests/lazy-loading.test.mjs` (`pdfLocalUrl` + `pdfExternalUrl`).

## 2. Ce qui existe déjà en externe (mesuré fichier par fichier)

- `subjects/manifest.json` : **58 entrées · 44 avec URL directe `source` (`/uploads/sujets/officiels/*.pdf`) · 14 sans URL**.
- `data/years/**` : 40 références `pdfLocalUrl` (20 payloads × 2 sujets), 40 `pdfExternalUrl` mesurés (page annales, PDF direct ou miroir eddirasa).
- `data/archive.js` : 16 entrées de consultation, dont 12 avec `pdfUrl` direct observé.

## 3. Verdict chiffré

- **44/58 sujets basculables sans perte** : PDF direct externe mesuré dans le manifeste (`source`) et/ou `data/years`.
- **14/58 sujets perdus ou à re-sourcer** (aucun PDF direct externe mesuré) :

```bash
node scripts/measure-external-links-impact.mjs  # champ "missing"
```

`subjects/M/2016/sujet-1.pdf`, `subjects/M/2016/sujet-2.pdf`, `subjects/M/2020/sujet-1.pdf`, `subjects/M/2020/sujet-2.pdf`, `subjects/M/2021/sujet-1.pdf`, `subjects/M/2021/sujet-2.pdf`, `subjects/SE/2016/sujet-1.pdf`, `subjects/SE/2016/sujet-2.pdf`, `subjects/SE/2026/sujet-1.pdf`, `subjects/SE/2026/sujet-2.pdf`, `subjects/M/2017/exceptional/sujet-1.pdf`, `subjects/M/2017/exceptional/sujet-2.pdf`, `subjects/SE/2025/sujet-1.pdf`, `subjects/SE/2025/sujet-2.pdf`.

Cas mesurés : 2016/2020/2021-M et 2017-M exceptionnelle = sessions consultées avec pièces jointes dzexams mais sans PDF direct observé (`viewer: "ok"`, `attachments: true`, pas de `pdfUrl`) ; 2016-SE = page annales seulement ; 2026-SE = miroir eddirasa mesuré dans `data/years` (pas dzexams) ; 2025-SE = sujets strictement locaux, page annales seulement.

Conséquence : sans autorisation, ces 14 sujets deviendraient inaccessibles en lecture intégrée, ou exigeraient une source alternative à documenter — jamais devinée.

## 4. Effets collatéraux d'une bascule

- Lecture intégrée (canvas + iframe de repli même origine), téléchargement `⬇️ تنزيل PDF` et prévisualisation stratégie : perdus pour tout sujet sans local (le rendu pdf.js ne peut pas lire un domaine tiers via la CSP).
- Hors ligne : le cache runtime borné (`sw.js`) ne couvre qu'une même origine — les sujets externes ne sont plus disponibles hors connexion.
- `dist/site` : −41,10 Mio de PDF ; le monofichier standalone est déjà sans PDF (aucun changement).
- Tests à réécrire : `tests/pdf-content-integrity.test.mjs` (« aucun PDF orphelin », refs `data/` existantes), `tests/lazy-loading.test.mjs` (`pdfLocalUrl` de 2025), `tests/server.test.mjs` (Range PDF local), `tests/service-worker-runtime.test.mjs` (cache borné d'un PDF de sujet), `tests/e2e/offline-pwa.spec.mjs` (téléchargement PDF).
- Le garde-fou P3.2 (`scripts/report-p3-status.mjs:71-77`) exige la branche externe sans iframe ni download — il resterait vert, la branche existe déjà.
