/* ============================================================
   OFFICIAL TASK INVENTORIES
   ------------------------------------------------------------
   Official BAC questions live here independently from the four
   pedagogical N/S/E/W stages. An inventory may remain partial;
   partial or unverified data must never unlock simulation mode.
   ============================================================ */

const INVENTORY_SCHEMA_VERSION = 1;

/**
 * First P1 vertical slice: the official task inventory for exercise 1 of
 * BAC 2025, subject 1. The two official questions are mapped onto the four
 * training stages without pretending that N/S/E/W are four BAC questions.
 * The point split remains provisional, so the subject is not simulation-ready.
 */
const BAC_2025_S1 = {
  schemaVersion: INVENTORY_SCHEMA_VERSION,
  status: "partial",
  source: {
    kind: "local-pdf",
    locator: "https://www.dzexams.com/ar/bac/sciences-naturelles",
    verifiedAt: "2026-08-23",
    notes:
      "Questions relues visuellement sur la page 1 du scan local. Inventaire P1 limité au premier exercice."
  },
  scope: {
    inventoriedExerciseNumbers: [1],
    taskCompleteExerciseNumbers: [1]
  },
  tasks: [
    {
      id: "2025-S1-E1-Q1",
      exerciseNumber: 1,
      order: 1,
      page: 1,
      prompt: "اذكر مختلف أنواع الـ ARN المتواجدة في الهيولى خلال وخارج فترة تركيب البروتين.",
      maxPoints: 1,
      scoringReviewStatus: "provisional",
      documentReviewStatus: "reviewed",
      documentRefs: [{ id: "exercise-1-statement", pages: [1] }],
      trainingMappings: [{ exerciseNumber: 1, pole: "S", kind: "direct" }]
    },
    {
      id: "2025-S1-E1-Q2",
      exerciseNumber: 1,
      order: 2,
      page: 1,
      prompt:
        "اشرح في نصٍ علميٍ دور مختلف أنواع الـ ARN في تركيب البروتين مبرزا تأثير مادة الـ RIP في علاج بعض الأورام السرطانية. (النص العلمي مُهيكل بمقدمة وعرض وخاتمة)",
      maxPoints: 4,
      scoringReviewStatus: "provisional",
      documentReviewStatus: "reviewed",
      documentRefs: [{ id: "exercise-1-statement", pages: [1] }],
      trainingMappings: [
        { exerciseNumber: 1, pole: "N", kind: "decomposition" },
        { exerciseNumber: 1, pole: "E", kind: "direct" },
        { exerciseNumber: 1, pole: "W", kind: "decomposition" }
      ]
    }
  ]
};

export const OFFICIAL_TASK_INVENTORIES = Object.freeze({
  "2025/S1": BAC_2025_S1
});

export function officialTaskInventoryFor(yearId, subjectId) {
  return OFFICIAL_TASK_INVENTORIES[`${yearId}/S${subjectId}`] || null;
}

export { INVENTORY_SCHEMA_VERSION };
