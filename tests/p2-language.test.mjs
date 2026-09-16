import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  officialTaskCountArabic,
  simulationBlockersArabic,
  taskCountArabic
} from "../js/ui/coverage-messages.js";

const source = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const visibleUi = [
  "js/ui/screens/workspace.js",
  "js/ui/screens/strategy.js",
  "js/ui/screens/guide.js",
  "js/ui/screens/hub.js",
  "js/ui/screens/simulation.js",
  "js/ui/pdf-viewer.js",
  "data/bac-mode-policy.js"
]
  .map(source)
  .join("\n");

test("la présentation visible n’emploie plus les anciennes métaphores concurrentes", () => {
  for (const term of [
    "السنّ",
    "الأسنان",
    "بوصلة",
    "🧭",
    "♞",
    "ورقة أم رأس",
    "صورة أم فيلم",
    "شريط فيديو",
    "فكّ القفل"
  ]) {
    assert.doesNotMatch(visibleUi, new RegExp(term), `ancienne métaphore encore visible: ${term}`);
  }
  assert.match(visibleUi, /الخطوات الأربع/);
});

test("les anciens avertissements français du parcours élève ont une version arabe", () => {
  for (const term of [
    "Objectif méthodologique",
    "consigne brute BAC",
    "consigne reconstruite",
    "Contrôle brouillon",
    "tu n’as pas mis de comparaison",
    "tu as expliqué sans observer",
    "ta conclusion ne répond pas au problème",
    "PDF non disponible localement",
    "PDF du sujet"
  ]) {
    assert.doesNotMatch(visibleUi, new RegExp(term), `texte français encore visible: ${term}`);
  }
  assert.match(visibleUi, /الخطوات الأربع/);
  assert.match(visibleUi, /لا يوجد ملف موضوع متاح لهذه الدورة في التطبيق/);
  // Les avis d'épreuve sont en arabe : provenance des consignes et barème.
  assert.match(visibleUi, /مُعاد بناؤها/);
  assert.match(visibleUi, /التنقيط غير معاير/);
  assert.doesNotMatch(
    visibleUi,
    /subject\?\.pdfNote/,
    "une note d’audit française ne doit pas fuiter dans l’UI"
  );
});

test("les bloqueurs techniques de simulation sont annoncés en arabe", () => {
  const message = simulationBlockersArabic([
    "inventory-partial",
    "task-mapping-incomplete",
    "documents-unreviewed"
  ]);
  assert.match(message, /جرد المهام الرسمية غير مكتمل/);
  assert.match(message, /ربط المهام/);
  assert.match(message, /الوثائق/);
  assert.doesNotMatch(message, /inventory|mapping|unreviewed/);
});

test("l'orthographe arabe de l'écran est celle des sujets officiels (امتحان, pas إمتحان)", () => {
  /* Le scan ministériel écrit « امتحان » (hamza non écrite) : l'interface
     affichait « إمتحان », une graphie que l'élève ne retrouve nulle part
     dans le sujet. On verrouille la forme officielle. */
  assert.doesNotMatch(visibleUi, /إمتحان/);
  assert.match(visibleUi, /ابدأ الامتحان/);
  assert.doesNotMatch(visibleUi, /(?<!أ)ساس الهدوء/, "translittération française du « sas »");
  assert.match(visibleUi, /أساس الهدوء/);
});

test("les noms comptés suivent la règle arabe 3–10", () => {
  // 3 à 10 → pluriel ; au-delà (et 1, 2) → singulier.
  assert.equal(taskCountArabic(4), "4 مهام");
  assert.equal(taskCountArabic(8), "8 مهام");
  assert.equal(taskCountArabic(10), "10 مهام");
  assert.equal(taskCountArabic(12), "12 مهمة");
  assert.equal(taskCountArabic(101), "101 مهمة");
  assert.equal(officialTaskCountArabic(5), "5 تعاليم رسمية موثّقة");
  assert.equal(officialTaskCountArabic(12), "12 تعليمة رسمية موثّقة");
});
