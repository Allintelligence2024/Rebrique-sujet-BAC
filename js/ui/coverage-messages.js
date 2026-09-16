const BLOCKER_LABELS = Object.freeze({
  "inventory-missing": "جرد المهام الرسمية غير موجود",
  "inventory-partial": "جرد المهام الرسمية غير مكتمل",
  "exercise-inventory-incomplete": "بعض التمارين غير مجرودة",
  "task-mapping-incomplete": "ربط المهام بخطوات المنهجية غير مكتمل",
  "scoring-unverified": "سلم التنقيط غير متحقق منه",
  "documents-unreviewed": "بعض الوثائق أو الصفحات غير مراجعة",
  "points-incomplete": "مجموع النقاط غير مكتمل",
  "metadata-invalid": "بيانات الجرد غير صالحة",
  "coverage-unknown": "نسبة التغطية الرسمية غير معروفة"
});

export function simulationBlockersArabic(blockers = []) {
  const values = blockers.length ? blockers : ["coverage-unknown"];
  return values.map((blocker) => BLOCKER_LABELS[blocker] || "دليل الأهلية غير مكتمل").join("؛ ");
}

/* ------------------------------------------------------------
   Accord du nom compté en arabe (règle 3–10).
   « 8 مهام » — trois à dix appellent le pluriel ; au-delà de 10
   c'est le singulier qui revient : « 12 مهمة ». Annoncer
   « 8 مهمة » est une faute de langue visible à l'écran.
   ------------------------------------------------------------ */
function countedForm(count, { few, many }) {
  const remainder = Math.abs(Number(count) || 0) % 100;
  return remainder >= 3 && remainder <= 10 ? few : many;
}

/** « 8 مهام » / « 12 مهمة ». */
export function taskCountArabic(count) {
  const value = Number(count) || 0;
  return `${value} ${countedForm(value, { few: "مهام", many: "مهمة" })}`;
}

/** « 5 تعاليم رسمية موثّقة » / « 12 تعليمة رسمية موثّقة ». */
export function officialTaskCountArabic(count) {
  const value = Number(count) || 0;
  return `${value} ${countedForm(value, {
    few: "تعاليم رسمية موثّقة",
    many: "تعليمة رسمية موثّقة"
  })}`;
}

/** « 3 خطوات » / « 4 خطوات » — même règle, pour les libellés de méthode. */
export function stepCountArabic(count, { few = "خطوات", many = "خطوة" } = {}) {
  const value = Number(count) || 0;
  return `${value} ${countedForm(value, { few, many })}`;
}
