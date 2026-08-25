import { APP_CONFIG } from "../../data/subjects.js";
import { evaluateText, scoreBac } from "../../js/engine.js";
import { loadCases } from "./import-copy.mjs";
import { findPole } from "./_find-pole.mjs";

function humanScore(caseObj) {
  if (caseObj.adjudication && Number.isFinite(caseObj.adjudication.score)) return caseObj.adjudication.score;
  const scores = (caseObj.annotations || []).map((entry) => entry.score).filter(Number.isFinite);
  return scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null;
}

function engineScore(caseObj) {
  const found = findPole(caseObj.year, caseObj.sujet, caseObj.exercise, caseObj.pole);
  if (!found) return null;
  const { pole } = found;
  const rule = {
    ...(pole.rule || {}),
    prompt: pole.bacPrompt || pole.prompt,
    modelAnswer: pole.modelAnswer,
    minLength: pole.minLength
  };
  return scoreBac(pole.points, evaluateText(caseObj.answer, rule, caseObj.pole).fraction);
}

function activePoleKeys() {
  const keys = [];
  for (const year of APP_CONFIG.years.filter((item) => item.enabled)) {
    for (const sujet of year.sujets) {
      for (const exercise of sujet.exercises) {
        for (const pole of ["N", "S", "E", "W"])
          keys.push(`${year.id}/S${sujet.id}/E${exercise.number}/${pole}`);
      }
    }
  }
  return keys;
}

/**
 * Compare the heuristic to the double-human reference. This does not declare
 * the engine valid: it exposes the evidence needed to decide that question.
 */
export function buildCalibrationReport(cases = []) {
  const rows = [];
  const coverage = Object.fromEntries(activePoleKeys().map((key) => [key, 0]));
  for (const caseObj of cases) {
    const human = humanScore(caseObj);
    const engine = engineScore(caseObj);
    const key = `${caseObj.year}/S${caseObj.sujet}/E${caseObj.exercise}/${caseObj.pole}`;
    if (key in coverage) coverage[key] += 1;
    if (human === null || engine === null) continue;
    const annotations = caseObj.annotations || [];
    const disagreement =
      annotations.length >= 2 ? Math.abs(annotations[0].score - annotations[1].score) : null;
    rows.push({
      id: caseObj.id,
      key,
      human,
      engine,
      delta: engine - human,
      absoluteError: Math.abs(engine - human),
      disagreement
    });
  }
  const count = rows.length;
  const mean = (values) =>
    values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
  const emptyPoles = Object.entries(coverage)
    .filter(([, value]) => value === 0)
    .map(([key]) => key);
  return {
    calibrated: count > 0,
    copiesCompared: count,
    activePoles: Object.keys(coverage).length,
    coveredPoles: Object.keys(coverage).length - emptyPoles.length,
    emptyPoles,
    coverage,
    meanAbsoluteError: mean(rows.map((row) => row.absoluteError)),
    meanBias: mean(rows.map((row) => row.delta)),
    overEvaluations: rows.filter((row) => row.delta > 0).length,
    underEvaluations: rows.filter((row) => row.delta < 0).length,
    meanInterRaterDifference: mean(rows.map((row) => row.disagreement).filter(Number.isFinite)),
    rows
  };
}

function printReport(report) {
  console.log(`Copies comparées : ${report.copiesCompared}`);
  console.log(`Couverture : ${report.coveredPoles}/${report.activePoles} pôles`);
  if (!report.calibrated) {
    console.log(
      "STATUT : non calibré — aucune copie réelle doublement annotée. Ne pas présenter le score comme une correction professeur."
    );
    return;
  }
  console.log(`MAE moteur/humain : ${report.meanAbsoluteError.toFixed(2)} point(s)`);
  console.log(`Biais moyen moteur-humain : ${report.meanBias.toFixed(2)} point(s)`);
  console.log(`Surévaluations / sous-évaluations : ${report.overEvaluations} / ${report.underEvaluations}`);
  console.log(
    `Écart moyen entre correcteurs : ${report.meanInterRaterDifference?.toFixed(2) ?? "n/a"} point(s)`
  );
  if (report.emptyPoles.length) console.log(`Pôles sans copie : ${report.emptyPoles.join(", ")}`);
}

if (process.argv[1] && new URL(import.meta.url).pathname === process.argv[1])
  printReport(buildCalibrationReport(loadCases().cases));
