export function poleConfidence(pole, yearId) {
  if (pole.bacPromptSource === "official") return { level: "high", label: "ثقة مرتفعة" };
  const year = Number(yearId);
  if (yearId === "2024" || (year >= 2013 && year <= 2020)) {
    return { level: "low", label: "ثقة منخفضة" };
  }
  return { level: "medium", label: "ثقة متوسطة" };
}

export function mayScorePole(pole, reviewMode) {
  return !reviewMode && pole.bacPromptSource === "official";
}
