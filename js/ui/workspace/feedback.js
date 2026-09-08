import { CALIBRATION_STATUS } from "../../../data/calibration-status.js";

export function poleConfidence(pole, yearId) {
  if (pole.bacPromptSource === "official") return { level: "high", label: "ثقة مرتفعة" };
  const year = Number(yearId);
  if (yearId === "2024" || (year >= 2013 && year <= 2020)) {
    return { level: "low", label: "ثقة منخفضة" };
  }
  return { level: "medium", label: "ثقة متوسطة" };
}

export function mayScorePole(pole, reviewMode, calibrationStatus = CALIBRATION_STATUS) {
  return (
    calibrationStatus?.scorePromotionAllowed === true && !reviewMode && pole?.bacPromptSource === "official"
  );
}
