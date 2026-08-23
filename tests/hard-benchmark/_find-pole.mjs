import { APP_CONFIG } from "../../data/subjects.js";

export function findPole(yearId, sujetId, exerciseNum, poleLetter) {
  const year = APP_CONFIG.years.find(y => y.id === String(yearId));
  if (!year || !year.enabled) return null;
  const sujet = year.sujets.find(s => s.id === sujetId);
  if (!sujet) return null;
  const exercise = sujet.exercises.find(e => e.number === exerciseNum);
  if (!exercise) return null;
  const pole = exercise.poles[poleLetter];
  if (!pole) return null;
  return { year, sujet, exercise, pole };
}
