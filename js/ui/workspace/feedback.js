export function poleConfidence(pole, yearId) {
  if (pole.bacPromptSource === "official") return { level: "high", label: "ثقة مرتفعة" };
  if (yearId === "2024") return { level: "low", label: "ثقة منخفضة" };
  return { level: "medium", label: "ثقة متوسطة" };
}

export function mayScorePole(pole, reviewMode) {
  return !reviewMode && pole.bacPromptSource === "official";
}
