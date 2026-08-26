export function buildTrainingReport({ appConfig, year, sujet, store, poles }) {
  const rows = sujet.exercises.map((exercise) => {
    const progress = store.exercise(store.state.yearId, store.state.sujetId, exercise.number);
    const officialPoles = poles.filter((pole) => exercise.poles[pole].bacPromptSource === "official");
    const total = officialPoles.reduce((sum, pole) => sum + progress.scores[pole], 0);
    const max = officialPoles.reduce((sum, pole) => sum + exercise.poles[pole].points, 0);
    return {
      exercise: `ت${exercise.number}`,
      label: exercise.label,
      max,
      N: progress.scores.N,
      S: progress.scores.S,
      E: progress.scores.E,
      W: progress.scores.W,
      total: Math.round(total * 100) / 100,
      filled: progress.answeredAny
    };
  });
  const grand = rows.reduce((sum, row) => sum + row.total, 0);
  const grandMax = rows.reduce((sum, row) => sum + row.max, 0);
  return {
    title: appConfig.appTitle,
    year: year.id,
    sujet: sujet.id,
    sujetTitle: sujet.title,
    generatedAt: new Date().toISOString(),
    globalRemaining: store.state.globalRemaining,
    rows,
    grand: Math.round(grand * 100) / 100,
    grandMax,
    percent: grandMax ? Math.round((grand / grandMax) * 100) : 0
  };
}
