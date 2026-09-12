/* Note « ce que la plateforme vérifie » — partagée par la façade UI et le
   rapport d'entraînement. Aucune valeur dynamique : gabarit applicatif. */

// The scorer is a training heuristic. It must never be presented as a ministry
// correction or a substitute for a human BAC marker.
export function trainingLimitHTML(compact = false) {
  const detail = compact
    ? "نفحص تغطية العناصر العلمية والمنهجية نوعياً؛ لا نعرض نقطة آلية قبل اكتمال المعايرة البشرية."
    : "تتحقق المنصة نوعياً من تغطية العناصر العلمية والمنهجية المنتظرة. لا تصحح نسختك ولا تستبدل الأستاذ؛ حُجبت النقاط الآلية حتى تنجح المعايرة على نسخ حقيقية مزدوجة التصحيح، وبعض التعليمات معاد بناؤها.";
  return `<div class="feedback mid ${compact ? "small" : "mb-2"}" role="note"><b>🔎 ما الذي تفحصه المنصة؟</b> — ${detail}</div>`;
}
