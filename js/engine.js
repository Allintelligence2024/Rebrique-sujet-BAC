/* ============================================================
   ENGINE FACADE
   ------------------------------------------------------------
   Public compatibility boundary for the application. Domain scoring,
   application timers, and browser audio now live in dedicated modules.
   Import this file when a stable application-level API is preferable.
   ============================================================ */

export {
  METHOD_SCRIPTS,
  matchConcept,
  analyzeSentenceStructure,
  evaluateScience,
  evaluateDocument,
  evaluateArtifact,
  evaluateHypotheses,
  evaluateClosingCover,
  evaluateTechnique,
  evaluateAnalysisRubric,
  evaluateText,
  scoreFromFraction,
  scoreBac
} from "./domain/evaluation/text-evaluator.js";

export { evaluatePipeline } from "./domain/evaluation/pipeline-evaluator.js";
export { timers } from "./application/timers.js";
export { soundEngine } from "./services/sound-engine.js";
