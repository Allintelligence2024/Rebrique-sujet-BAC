import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { YEAR_CATALOG } from "../data/subjects.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFileSync(join(root, path), "utf8");

function shellAssets(serviceWorker) {
  const block = serviceWorker.match(/const SHELL_ASSETS = \[([\s\S]*?)\];/);
  return block ? [...block[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]) : [];
}

function revisionMatches(versionSource, path) {
  const digest = createHash("sha256")
    .update(readFileSync(join(root, path)))
    .digest("hex");
  return versionSource.includes(`"${path}"`) && versionSource.includes(`sha256: "${digest}"`);
}

export function buildP3Status() {
  const subjects = read("data/subjects.js");
  const strategy = read("js/ui/screens/strategy.js");
  const serviceWorker = read("sw.js");
  const diagnostics = read("js/services/diagnostics.js");
  const build = read("build.mjs");
  const version = read("js/app-version.js");
  const shell = shellAssets(serviceWorker);
  const yearPaths = YEAR_CATALOG.map((year) => year.modulePath);
  const revisioned = [
    "manifest.webmanifest",
    "assets/icon-192.png",
    "assets/icon-512.png",
    "BAC2025_SVT_Sujet1.pdf",
    "BAC2025_SVT_Sujet2.pdf"
  ];
  const lazyData =
    YEAR_CATALOG.length === 19 &&
    YEAR_CATALOG.every(
      (year) =>
        !("sujets" in year) &&
        existsSync(join(root, year.modulePath)) &&
        subjects.includes(`import("./${year.modulePath.replace(/^data\//, "")}")`)
    ) &&
    !/^import .*years\//m.test(subjects);
  const explicitPdf =
    !shell.some((asset) => asset.endsWith(".pdf") || asset.includes("data/years/")) &&
    strategy.includes("pdfBytes") &&
    strategy.includes("download=") &&
    strategy.includes("لا يُنزّل الملف تلقائياً") &&
    !strategy.includes("<iframe");
  const versionedAssets = revisioned.every((path) => revisionMatches(version, path));
  const runtimeMaximum = Number(serviceWorker.match(/const RUNTIME_MAX_ENTRIES = (\d+);/)?.[1]);
  const boundedRuntime =
    runtimeMaximum > 0 &&
    runtimeMaximum <= 32 &&
    serviceWorker.includes("trimRuntimeCache") &&
    serviceWorker.includes("response?.ok === true") &&
    serviceWorker.includes("response.status === 200") &&
    serviceWorker.includes("CURRENT_CACHES");
  const privateObservability =
    diagnostics.includes("getOperationalSnapshot") &&
    diagnostics.includes("initializeOperationalObservability") &&
    diagnostics.includes("errorBuckets") &&
    !diagnostics.includes("localStorage") &&
    !diagnostics.includes("fetch(") &&
    existsSync(join(root, "js/ui/operational-status.js"));
  const deterministicRelease =
    build.includes('"dist", "site"') &&
    build.includes("release.json") &&
    build.includes("contentSha256") &&
    !build.includes("new Date") &&
    existsSync(join(root, "scripts/verify-release.mjs")) &&
    existsSync(join(root, "docs/DEPLOYMENT.md"));

  const gates = [
    {
      id: "P3.1",
      complete: lazyData,
      evidence: `${yearPaths.length} payloads filière/année, catalogue sans sujets, imports dynamiques littéraux`
    },
    {
      id: "P3.2",
      complete: explicitPdf,
      evidence: `${shell.length} ressources shell; 0 payload annuel/PDF précaché; téléchargement PDF avec taille`
    },
    {
      id: "P3.3",
      complete: versionedAssets,
      evidence: `${revisioned.filter((path) => revisionMatches(version, path)).length}/${revisioned.length} manifeste/icônes/PDF révisionnés par SHA-256`
    },
    {
      id: "P3.4",
      complete: boundedRuntime,
      evidence: `runtime limité à ${runtimeMaximum || "?"} entrées; HTTP 200 local seulement; éviction et purge par build`
    },
    {
      id: "P3.5",
      complete: privateObservability,
      evidence:
        "compteurs d'erreurs locaux sans payload, build visible, transitions online/offline et événements SW agrégés"
    },
    {
      id: "P3.6",
      complete: deterministicRelease,
      evidence:
        "dist/site + release.json déterministe, vérificateur d'empreintes et procédure déploiement/rollback"
    }
  ];
  return {
    complete: gates.every((gate) => gate.complete),
    completedGates: gates.filter((gate) => gate.complete).length,
    totalGates: gates.length,
    gates
  };
}

function print(status) {
  console.log("lot\tétat\tpreuve");
  for (const gate of status.gates) {
    console.log(`${gate.id}\t${gate.complete ? "terminé" : "bloqué"}\t${gate.evidence}`);
  }
  console.log(
    `\nP3: ${status.complete ? "TERMINÉ" : "INCOMPLET"} (${status.completedGates}/${status.totalGates} critères d'acceptation fermés).`
  );
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const status = buildP3Status();
  print(status);
  if (process.argv.includes("--check-complete") && !status.complete) process.exitCode = 1;
}
