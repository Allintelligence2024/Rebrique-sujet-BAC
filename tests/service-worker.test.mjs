import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const source = readFileSync(join(root, "sw.js"), "utf8");

/* ------------------------------------------------------------------
   La liste de precache est vérifiée contre le GRAPHE D'IMPORT réel de
   l'app (racine : js/main.js, chargée par index.html), pas contre une
   liste recopiée à la main.

   Pourquoi : un test qui duplique la liste de sw.js ne peut pas
   détecter la dérive — il reste vert pendant que des modules manquent
   au cache. Conséquence côté élève : `caches.match()` rate, le fetch
   de repli échoue hors-ligne, et comme le fallback index.html est
   réservé aux navigations (`Response.error()` sinon), l'import du
   module casse et l'app ne démarre pas à froid sans réseau.
   ------------------------------------------------------------------ */

// Modules présents sur le disque mais hors du graphe ESM rooted sur js/main.js.
// Chaque entrée DOIT correspondre à une décision explicite : cette liste est la
// seule place où un module peut se tenir sans être signalé comme code mort.
const OUT_OF_GRAPH = {
  // Généré par scripts/generate-pwa-version.mjs, chargé par sw.js via
  // importScripts (pas par le graphe ESM de l'app).
  "js/app-version.js": "chargé par sw.js via importScripts",
  // Rapport + exports CSV/JSON/impression : retirés de la copie (épure élève,
  // verrouillé par tests/all-buttons.test.mjs). Le contrôleur n'est plus appelé
  // par l'UI, donc ces trois modules ne sont plus embarqués dans le bundle
  // (~7 KB qui étaient livrés à l'élève sans être atteignables). Ils restent
  // testés au niveau module (tests/workspace-modules.test.mjs).
  // DÉCISION PRODUIT EN ATTENTE du propriétaire : les ré-exposer HORS de la
  // copie (hub ou fin de session) — et alors les remettre dans le graphe — ou
  // les supprimer. Voir docs/ANTIGRAVITY_HANDOFF.md §3.
  "js/ui/workspace/report-controller.js": "plus appelé par l'UI ; décision produit en attente",
  "js/ui/reports/report.js": "atteignable uniquement via report-controller",
  "js/ui/reports/exports.js": "atteignable uniquement via report-controller"
};

function toRepoPath(p) {
  return relative(root, p).split(sep).join("/");
}

function listFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...listFiles(full));
    else if (entry.endsWith(".js")) out.push(toRepoPath(full));
  }
  return out;
}

function importGraph(entry) {
  const seen = new Set();
  const stack = [entry];
  while (stack.length) {
    const current = stack.pop();
    if (seen.has(current)) continue;
    seen.add(current);
    const code = readFileSync(join(root, current), "utf8");
    for (const m of code.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)["']([^"']+)["']/g)) {
      const spec = m[1];
      if (!spec.startsWith(".")) continue; // aucun paquet externe dans ce dépôt
      const target = toRepoPath(resolve(dirname(join(root, current)), spec));
      if (existsSync(join(root, target))) stack.push(target);
    }
  }
  return seen;
}

function precachedAssets() {
  const block = source.match(/const ASSETS = \[([\s\S]*?)\];/);
  assert.ok(block, "const ASSETS introuvable dans sw.js");
  return [...block[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

const assets = precachedAssets();
const precachedFiles = new Set(assets.map((a) => a.replace(/^\.\//, "")));
const graph = importGraph("js/main.js");
const dataModules = listFiles(join(root, "data"));

test("le graphe d'import de js/main.js est bien parcouru (garde-fou du test lui-même)", () => {
  assert.ok(graph.has("js/main.js"), "racine absente du graphe : walk cassé");
  assert.ok(graph.has("js/ui.js"), "js/ui.js absent du graphe : walk cassé");
  assert.ok(
    graph.size > 30,
    `graphe suspiciously petit (${graph.size} modules) : la détection d'imports est cassée`
  );
});

test("tous les modules du graphe applicatif sont pré-cachés", () => {
  const missing = [...graph].filter((m) => !precachedFiles.has(m));
  assert.deepEqual(
    missing,
    [],
    `modules importés par l'app mais absents du precache (démarrage hors-ligne cassé) : ${missing.join(", ")}`
  );
});

test("tous les modules de données sont pré-cachés", () => {
  const missing = dataModules.filter((m) => !precachedFiles.has(m));
  assert.deepEqual(missing, [], `fichiers data/ absents du precache : ${missing.join(", ")}`);
});

test("chaque module js/ du dépôt est soit dans le graphe, soit déclaré hors-graphe", () => {
  // Empêche un module de disparaître silencieusement de toute couverture.
  const unaccounted = listFiles(join(root, "js")).filter((m) => !graph.has(m) && !(m in OUT_OF_GRAPH));
  assert.deepEqual(
    unaccounted,
    [],
    `modules ni importés par l'app ni déclarés dans OUT_OF_GRAPH (code mort ou graphe incomplet) : ${unaccounted.join(", ")}`
  );
  const ghosts = Object.keys(OUT_OF_GRAPH).filter((m) => !existsSync(join(root, m)));
  assert.deepEqual(ghosts, [], `entrées OUT_OF_GRAPH devenues fantômes : ${ghosts.join(", ")}`);
});

test("toutes les entrées du precache existent sur le disque", () => {
  // c.addAll() rejette au premier 404 : une entrée fantôme fait échouer
  // l'installation du service worker, donc aucun controller, donc pas de PWA.
  const ghost = assets
    .filter((a) => a !== "./")
    .map((a) => a.replace(/^\.\//, ""))
    .filter((p) => !existsSync(join(root, p)));
  assert.deepEqual(ghost, [], `entrées de precache inexistantes : ${ghost.join(", ")}`);
});

test("les ressources non-modules de l'app sont pré-cachées", () => {
  for (const asset of [
    "./",
    "./index.html",
    "./manifest.webmanifest",
    "./assets/styles.css",
    "./assets/icon-192.png",
    "./assets/icon-512.png"
  ]) {
    assert.ok(assets.includes(asset), `${asset} manque au precache`);
  }
});

test("les PDF réellement servis par l'app sont pré-cachés", () => {
  const data = readFileSync(join(root, "data", "subjects.js"), "utf8");
  const served = new Set([...data.matchAll(/pdf:\s*"([^"]+\.pdf)"/g)].map((m) => m[1]));
  assert.ok(served.size > 0, "aucun PDF local trouvé dans data/subjects.js : regex cassée ?");
  for (const pdf of served) {
    assert.ok(precachedFiles.has(pdf), `${pdf} servi par l'app mais absent du precache`);
    assert.ok(existsSync(join(root, pdf)), `${pdf} référencé mais absent du dépôt`);
  }
});

test("le cache PWA est versionné par le build", () => {
  assert.match(source, /importScripts\("\.\/js\/app-version\.js"\)/);
  assert.match(source, /boussole4d-\$\{self\.APP_BUILD_ID/);
});

test("le fallback index.html est réservé aux navigations", () => {
  assert.match(source, /e\.request\.mode === "navigate"/);
  assert.match(source, /return Response\.error\(\)/);
});
