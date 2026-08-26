export function textEvaluationRule(pole, relatedProblem = "") {
  const rule = {
    ...(pole.rule || {}),
    prompt: pole.bacPrompt || pole.prompt,
    modelAnswer: pole.modelAnswer,
    minLength: pole.minLength
  };
  if (relatedProblem) rule.relatedProblem = relatedProblem;
  return rule;
}

export function restoreTextDrafts(poles, progress, findField) {
  for (const pole of poles) {
    const field = findField(`fld-${pole}`);
    if (field && progress.text[pole]) field.value = progress.text[pole];
  }
}
