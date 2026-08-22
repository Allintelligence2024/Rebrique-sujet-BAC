/* ============================================================
   Tests unitaires — moteur d'évaluation + normalisation
   Lancer : npm test   (ou : node --test tests/engine.test.mjs)
   ============================================================ */
import { test } from "node:test";
import assert from "node:assert/strict";
import { APP_CONFIG, normalizeArabic, stripArabicClitics } from "../data/subjects.js";
import { evaluateText, evaluatePipeline, scoreFromFraction, matchConcept } from "../js/engine.js";

const ex1 = APP_CONFIG.years[0].sujets[0].exercises[0];
const ex3 = APP_CONFIG.years[0].sujets[0].exercises.find(e => e.ui === "pipeline");

test("normalizeArabic harmonise les variantes de lettres, tatweel et ponctuation", () => {
  // أ/ا interchangeables
  assert.equal(normalizeArabic("الأدينوزين"), normalizeArabic("الادينوزين"));
  // ة/ه interchangeables
  assert.equal(normalizeArabic("اليقظة"), normalizeArabic("اليقظه"));
  // diacritiques retirés
  assert.equal(normalizeArabic("يقظةٍ"), normalizeArabic("يقظة"));
  // Tatweel / Kashida retiré
  assert.equal(normalizeArabic("البروتــــــين"), "البروتين");
  // Ponctuation arabe et occidentale nettoyée
  assert.equal(normalizeArabic("هل الأدينوزين يثبط، أم ينشط؟"), "هل الادينوزين يثبط ام ينشط");
});

test("stripArabicClitics nettoie les préfixes arabes", () => {
  assert.equal(stripArabicClitics("كالبروتين"), "بروتين");
  assert.equal(stripArabicClitics("بالاحماض"), "احماض");
  assert.equal(stripArabicClitics("الادينوزين"), "ادينوزين");
});

test("matchConcept valide les synonymes et les formes préfixées", () => {
  const concept = ["حمض", "احماض"];
  assert.equal(matchConcept("تتكون الخلية من احماض امينية", concept), true);
  assert.equal(matchConcept("بالأحماض النووية", concept), true);
  assert.equal(matchConcept("لا توجد مادة هنا", concept), false);
});

test("évaluation texte — réponse riche = score plein", () => {
  const poleN = ex1.poles.N; // ex1 = ARN / synthèse protéique
  const res = evaluateText("يلعب الحمض الريبوزي النووي دورا في تركيب البروتين داخل الهيولى", poleN.rule);
  assert.ok(res.fraction >= 0.75);
  assert.equal(scoreFromFraction(poleN.points, res.fraction), 1);
  assert.ok(res.matched.length >= 2);
});

test("évaluation texte — texte de remplissage sans concept biologique = zéro point", () => {
  const poleN = ex1.poles.N;
  // 100 caractères de texte sans rapport avec la biologie
  const res = evaluateText("هذا نص عشوائي طويل جدا لا يحتوي على اي فكرة علمية او منهجية مفيدة للحل ابدا بتاتا", poleN.rule);
  assert.equal(res.hits, 0);
  assert.equal(res.fraction, 0);
  assert.equal(scoreFromFraction(poleN.points, res.fraction), 0);
});

test("évaluation texte — mot interdit plafonne la note", () => {
  // Pôle S de l'exercice 2 du sujet 1 : interdit "بسبب"
  const poleS = APP_CONFIG.years[0].sujets[0].exercises[1].poles.S;
  const res = evaluateText("نلاحظ نمو وتطور النمط الطبيعي بتركيز متزايد مقارنة بالطافر بسبب الحرارة", poleS.rule);
  assert.ok(res.fraction <= 0.3);
  assert.ok(res.forbiddenFound.includes("بسبب"));
});

test("évaluation texte — liste de mots-clés sans phrase structurée = zéro point", () => {
  const poleN = ex1.poles.N;
  // L'élève tape une simple liste de mots-clés sans structure ni verbe
  const res = evaluateText("حمض ريبوزي بروتين تركيب", poleN.rule, "N");
  assert.equal(res.isKeywordDump, true);
  assert.equal(res.fraction, 0);
  assert.equal(scoreFromFraction(poleN.points, res.fraction), 0);
});

test("évaluation texte — paraphrase avec synonymes et connecteurs = score plein", () => {
  const poleN = ex1.poles.N;
  // Formulation différente avec synonymes (ARN / اصطناع / خلايا / مما يؤدي)
  const res = evaluateText("يقوم الـ ARN باصطناع البروتين في الهيولى مما يؤدي إلى استمرار نشاط الخلية", poleN.rule, "N");
  assert.equal(res.isKeywordDump, false);
  assert.ok(res.fraction >= 0.75);
  assert.equal(scoreFromFraction(poleN.points, res.fraction), 1);
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

test("BAC 2024 — évaluation exercice 1 (Indolmycine / تنشيط الأحماض الأمينية)", () => {
  const y2024 = APP_CONFIG.years.find(y => y.id === "2024");
  assert.ok(y2024);
  assert.equal(y2024.enabled, true);
  assert.equal(y2024.sujets.length, 2);

  const ex1_2024 = y2024.sujets[0].exercises[0];
  const poleN = ex1_2024.poles.N;
  const res = evaluateText("ما هو المشكل العلمي الدقيق حول كيفية تاثير المضاد الحيوي اندولمايسين في تثبيط تنشيط الاحماض الامينية وتركيب البروتين لدى البكتيريا", poleN.rule, "N");
  assert.ok(res.fraction >= 0.75);
  assert.equal(scoreFromFraction(poleN.points, res.fraction), 1);
  assert.ok(poleN.modelAnswer.includes("إندولمايسين"));
});

test("BAC 2024 — évaluation exercice 3 (Pipeline Immunité خلطية / خلوية)", () => {
  const y2024 = APP_CONFIG.years.find(y => y.id === "2024");
  const ex3_2024 = y2024.sujets[0].exercises[2];
  assert.equal(ex3_2024.ui, "pipeline");
  assert.equal(ex3_2024.blocksBank.length, 8);

  const perfect = { stream1: ["b1","b2","b3","b4"], stream2: ["b5","b6","b7","b8"] };
  const res = evaluatePipeline(ex3_2024.blocksBank, perfect);
  assert.equal(res.correct, 8);
  assert.equal(res.fraction, 1);
});
