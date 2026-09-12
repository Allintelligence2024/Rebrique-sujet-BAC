export const DEMO_COPY = {
  before: "يزداد النشاط لأن الإنزيم يعمل أكثر.",
  after:
    "نلاحظ أن نشاط الإنزيم يرتفع من 20 إلى 80 وحدة عند الانتقال من 10 إلى 30 درجة، بينما ينخفض إلى 25 وحدة عند 50 درجة. نستنتج أن للإنزيم درجة حرارة مثلى تقارب 30 درجة، وأن الحرارة المرتفعة تغيّر بنيته فتخفض نشاطه."
};

/**
 * Rule written against the schema actually consumed by `evaluateText`
 * (`keywords`, `minLength`, `modelAnswer`, `document`). The previous
 * `taskType/groups/required/document.requiresValues` fields were legacy
 * leftovers: the evaluator ignored them, so the "after" example could reach a
 * perfect fraction without matching a single concept.
 */
export const DEMO_RULE = {
  minLength: 35,
  keywords: [
    ["نشاط", "فعالية"],
    ["درجة حرارة", "حرارة"],
    ["يرتفع", "يزداد"],
    ["ينخفض", "يتناقص"],
    ["بنية", "شكل فراغي"]
  ],
  minHits: 3,
  // Les valeurs attendues dans le « après » : le « avant » n'en cite aucune.
  document: { values: ["20", "80", "25"], strictValues: false },
  modelAnswer: DEMO_COPY.after
};

export const DEMO_LIMITS = [
  "يفحص مؤشرات لغوية وعلمية محددة في هذه الإجابة، لا فهم التلميذ أو نيته.",
  "لا يضمن صحة كل معلومة غير ممثلة في القاعدة.",
  "لا يضمن علامة البكالوريا ولا يستبدل تصحيح أستاذ.",
  "قد يفوّت صياغة صحيحة جديدة أو يقبل عبارة تحتوي الكلمات المنتظرة في سياق خاطئ."
];

export function buildDemoDiagnostic(evaluateText) {
  const summarize = (text) => {
    const result = evaluateText(text, DEMO_RULE, "S");
    return {
      text,
      detected: [
        ...(result.matched || []).map((item) => `مفهوم: ${item}`),
        ...(result.methodology?.strengths || []).map((item) => `منهجية: ${item}`),
        ...(result.rubric?.steps || [])
          .filter((step) => step.passed)
          .map((step) => `شبكة التحليل: ${step.label}`)
      ],
      missing: [
        ...(result.missing || []),
        ...(result.document?.gaps || []),
        ...(result.methodology?.missing || [])
      ],
      fraction: result.fraction
    };
  };
  return {
    before: summarize(DEMO_COPY.before),
    after: summarize(DEMO_COPY.after),
    limits: DEMO_LIMITS
  };
}
