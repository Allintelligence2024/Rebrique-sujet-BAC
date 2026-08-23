import { test } from "node:test";
import assert from "node:assert/strict";
import { APP_CONFIG } from "../data/subjects.js";
import { evaluateText, scoreFromFraction } from "../js/engine.js";

function getPole(yearId, sujetId, exNumber, poleKey) {
  const year = APP_CONFIG.years.find(y => y.id === yearId);
  assert.ok(year, `Année introuvable: ${yearId}`);
  const sujet = year.sujets.find(s => s.id === sujetId);
  assert.ok(sujet, `Sujet introuvable: ${yearId}/${sujetId}`);
  const exercise = sujet.exercises.find(e => e.number === exNumber);
  assert.ok(exercise, `Exercice introuvable: ${yearId}/${sujetId}/ex${exNumber}`);
  const pole = exercise.poles[poleKey];
  assert.ok(pole, `Pôle introuvable: ${yearId}/${sujetId}/ex${exNumber}/${poleKey}`);
  return pole;
}

function assertBetween(value, min, max, label) {
  assert.ok(value >= min, `${label} trop bas: ${value} < ${min}`);
  assert.ok(value <= max, `${label} trop haut: ${value} > ${max}`);
}

const BENCHMARK_CASES = [
  {
    label: "BAC 2024 / Sujet 2 / Ex1 / N — حدد المشكل العلمي",
    poleType: "N",
    expectedTask: "problem",
    pole: getPole("2024", 2, 1, "N"),
    variants: {
      excellent: {
        answer: "تأطير المشكل العلمي: كيف يتم تركيب ATP داخل الميتوكوندريا بفضل التدرج البروتوني وعمل الكرية المذنبة، وما أثر تثبيط هذه الآلية على الحصيلة الطاقوية؟",
        fraction: [0.95, 1],
        methodology: [0.9, 1],
        scoreRatio: [0.95, 1]
      },
      acceptable: {
        answer: "كيف يتم تركيب ATP داخل الميتوكوندريا؟",
        fraction: [0.7, 0.85],
        methodology: [0.6, 0.7],
        scoreRatio: [0.7, 0.85]
      },
      falseAnswer: {
        answer: "النشاط الخلوي",
        fraction: [0, 0.05],
        methodology: [0, 0.1],
        scoreRatio: [0, 0.05]
      }
    }
  },
  {
    label: "BAC 2024 / Sujet 2 / Ex1 / S — استخرج شروط تركيب ATP",
    poleType: "S",
    expectedTask: "analysis",
    pole: getPole("2024", 2, 1, "S"),
    variants: {
      excellent: {
        answer: "تمثل الوثيقة شروط تركيب ATP، حيث نلاحظ أنه يركب فقط عند توفر ADP وPi ووجود تدرج بروتوني بين الفراغ بين الغشائين والحشوة، ومنه نستنتج أن التدرج البروتوني شرط أساسي يحرك الكرية المذنبة.",
        fraction: [0.95, 1],
        methodology: [0.95, 1],
        scoreRatio: [0.95, 1]
      },
      acceptable: {
        answer: "تمثل الوثيقة شروط تركيب ATP، حيث نلاحظ وجود ADP وPi فقط.",
        fraction: [0.7, 0.8],
        methodology: [0.75, 0.85],
        scoreRatio: [0.7, 0.8]
      },
      falseAnswer: {
        answer: "ATP يحتاج طاقة فقط.",
        fraction: [0, 0.05],
        methodology: [0.35, 0.45],
        scoreRatio: [0, 0.05]
      }
    }
  },
  {
    label: "BAC 2024 / Sujet 1 / Ex3 / E — بين كيفية تشكل المعقدات المناعية",
    poleType: "E",
    expectedTask: "explanation",
    pole: getPole("2024", 1, 3, "E"),
    variants: {
      excellent: {
        answer: getPole("2024", 1, 3, "E").modelAnswer,
        fraction: [0.95, 1],
        methodology: [0.95, 1],
        scoreRatio: [0.95, 1]
      },
      acceptable: {
        answer: "ترتبط الأجسام المضادة نوعياً بمحددات المستضد الفيروسي عبر مواقعها المتغيرة فتتشكل معقدات مناعية تعطل تثبته على الخلايا، كما تسهل البلعمة بارتباط القطعة Fc بمستقبلات البالعات الكبيرة.",
        fraction: [0.85, 0.93],
        methodology: [0.95, 1],
        scoreRatio: [0.85, 0.93]
      },
      falseAnswer: {
        answer: "يتم شل الفيروس لأن الجسم المضاد يمنعه من الحركة فقط.",
        fraction: [0.3, 0.45],
        methodology: [0.3, 0.4],
        scoreRatio: [0.3, 0.45]
      }
    }
  },
  {
    label: "BAC 2024 / Sujet 1 / Ex1 / W — نص علمي حول أهمية مرحلة التنشيط",
    poleType: "W",
    expectedTask: "scientific-text",
    pole: getPole("2024", 1, 1, "W"),
    variants: {
      excellent: {
        answer: "تمثل مرحلة التنشيط خطوة نوعية أساسية في سلامة التعبير المورثي، إذ تسمح بربط كل حمض أميني بـ ARNt الموافق له بوساطة إنزيم نوعي. وأي تثبيط للموقع الفعال كما يحدث بالإندولمايسين يمنع تشكل aminoacyl-ARNt ويشل الترجمة، مما يؤدي إلى غياب البروتينات وموت الخلية.",
        fraction: [0.95, 1],
        methodology: [0.7, 0.8],
        scoreRatio: [0.95, 1]
      },
      acceptable: {
        answer: "مرحلة التنشيط ضرورية لأنها تضمن التوافق بين الحمض الأميني وARNt، وتعطيلها يوقف تركيب البروتين.",
        fraction: [0.8, 0.86],
        methodology: [0.7, 0.8],
        scoreRatio: [0.8, 0.86]
      },
      falseAnswer: {
        answer: "تركيب البروتين يتم في الخلية.",
        fraction: [0, 0.05],
        methodology: [0.2, 0.3],
        scoreRatio: [0, 0.05]
      }
    }
  }
];

for (const benchmarkCase of BENCHMARK_CASES) {
  test(`mini banc BAC — ${benchmarkCase.label}`, () => {
    const order = ["excellent", "acceptable", "falseAnswer"];
    const results = {};

    for (const variantName of order) {
      const variant = benchmarkCase.variants[variantName];
      const evaluation = evaluateText(variant.answer, benchmarkCase.pole.rule, benchmarkCase.poleType);
      const normalizedScore = scoreFromFraction(benchmarkCase.pole.points, evaluation.fraction) / benchmarkCase.pole.points;

      assert.equal(evaluation.taskProfile?.id, benchmarkCase.expectedTask, `${benchmarkCase.label} → tâche détectée incorrecte pour ${variantName}`);
      assertBetween(evaluation.fraction, variant.fraction[0], variant.fraction[1], `${benchmarkCase.label} → fraction ${variantName}`);
      assertBetween(evaluation.methodology.score, variant.methodology[0], variant.methodology[1], `${benchmarkCase.label} → méthodologie ${variantName}`);
      assertBetween(normalizedScore, variant.scoreRatio[0], variant.scoreRatio[1], `${benchmarkCase.label} → score normalisé ${variantName}`);

      results[variantName] = evaluation;
    }

    assert.ok(results.excellent.fraction > results.acceptable.fraction, `${benchmarkCase.label} → excellente réponse non supérieure à l'acceptable`);
    assert.ok(results.acceptable.fraction > results.falseAnswer.fraction, `${benchmarkCase.label} → réponse acceptable non supérieure à la fausse`);
  });
}
