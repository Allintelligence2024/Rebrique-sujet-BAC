/* ============================================================
   Tests unitaires — moteur d'évaluation + normalisation
   Lancer : npm test   (ou : node --test tests/engine.test.mjs)
   ============================================================ */
import { test } from "node:test";
import assert from "node:assert/strict";
import { APP_CONFIG, normalizeArabic } from "../data/subjects.js";
import { evaluateText, evaluatePipeline, scoreFromFraction } from "../js/engine.js";

const ex1 = APP_CONFIG.years[0].sujets[0].exercises[0];
const ex3 = APP_CONFIG.years[0].sujets[0].exercises.find(e => e.ui === "pipeline");

test("normalizeArabic harmonise les variantes de lettres", () => {
  // أ/ا interchangeables
  assert.equal(normalizeArabic("الأدينوزين"), normalizeArabic("الادينوزين"));
  // ة/ه interchangeables
  assert.equal(normalizeArabic("اليقظة"), normalizeArabic("اليقظه"));
  // diacritiques retirés
  assert.equal(normalizeArabic("يقظةٍ"), normalizeArabic("يقظة"));
});

test("évaluation texte — réponse riche = score plein", () => {
  const poleN = ex1.poles.N; // ex1 = ARN / synthèse protéique
  const res = evaluateText("يلعب الحمض الريبوزي النووي دورا في تركيب البروتين داخل الهيولى", poleN.rule);
  assert.ok(res.fraction >= 0.75);
  assert.equal(scoreFromFraction(poleN.points, res.fraction), 1);
});

test("évaluation texte — mot interdit plafonne la note", () => {
  // Pôle S de l'exercice 2 du sujet 1 : interdit "بسبب"
  const poleS = APP_CONFIG.years[0].sujets[0].exercises[1].poles.S;
  const res = evaluateText("بسبب ارتفاع التركيز", poleS.rule);
  assert.ok(res.fraction <= 0.3);
  assert.deepEqual(res.forbiddenFound, ["بسبب"]);
});

test("évaluation texte — réponse vide = zéro", () => {
  const res = evaluateText("", ex1.poles.N.rule);
  assert.equal(res.empty, true);
  assert.equal(res.fraction, 0);
});

test("évaluation pipeline — arrangement parfait = 100%", () => {
  const perfect = { stream1: ["b1","b2","b3","b4"], stream2: ["b5","b6","b7","b8"] };
  const res = evaluatePipeline(ex3.blocksBank, perfect);
  assert.equal(res.correct, 8);
  assert.equal(res.fraction, 1);
});

test("évaluation pipeline — 2 erreurs détectées", () => {
  const wrong = { stream1: ["b1","b2","b3","b4"], stream2: ["b5","b7","b6","b8"] };
  const res = evaluatePipeline(ex3.blocksBank, wrong);
  assert.equal(res.correct, 6);
  assert.equal(res.total, 8);
  assert.equal(res.wrongSlots.length, 2);
});
