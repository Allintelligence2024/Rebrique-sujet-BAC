import { downloadFile, printCurrentExercise, reportToCSV } from "../reports/exports.js";
import { buildTrainingReport } from "../reports/report.js";

export function createReportController({
  $,
  APP_CONFIG,
  POLE_ORDER,
  openModal,
  store,
  trainingLimitHTML,
  yearObj,
  sujetObj
}) {
  function computeReport() {
    return buildTrainingReport({
      appConfig: APP_CONFIG,
      year: yearObj(store.state.yearId),
      sujet: sujetObj(),
      store,
      poles: POLE_ORDER
    });
  }

  function showReport() {
    const rep = computeReport();
    const summary = store.state.reviewMode
      ? `<div class="card" style="background:var(--bg)"><strong>وضع المراجعة</strong><p class="small text-muted mt-1">لا يعرض هذا الوضع نقاطاً أو نسبة؛ راجع feedback المنهجي لكل قطب.</p></div>`
      : `<div class="card" style="background:var(--bg)">
      <div class="flex spread"><strong>الحصيلة التدريبية الرسمية فقط</strong>
        <span class="mono text-emerald" style="font-size:1.4rem">${rep.grand.toFixed(2)} / ${rep.grandMax.toFixed(2)}</span></div>
      <div class="progress mt-1"><span style="width:${rep.percent}%"></span></div>
      <p class="small text-muted mt-1">النسبة الرسمية المتاحة فقط: ${rep.percent}%</p>
    </div>`;
    const body = `
    ${trainingLimitHTML()}
    ${summary}
    <div class="stack mt-2">
      ${rep.rows
        .map(
          (row) => `
        <div class="flex spread" style="border-bottom:1px solid var(--line);padding-bottom:.4rem">
          <span class="bold">${row.exercise}: ${row.label} ${row.filled ? "" : "(غير مكتمل)"}</span>
          ${store.state.reviewMode ? `<span class="text-muted">feedback فقط</span>` : `<span class="mono ${row.total >= row.max * 0.7 ? "text-emerald" : "text-amber"}">${row.total.toFixed(2)} / ${row.max.toFixed(2)} رسمي فقط</span>`}
        </div>`
        )
        .join("")}
    </div>
    <div class="flex mt-2">
      <button class="btn btn-emerald btn-sm" id="dl-csv">⬇️ تنزيل CSV</button>
      <button class="btn btn-ghost btn-sm" id="dl-json">⬇️ تنزيل JSON</button>
      <button class="btn btn-indigo btn-sm" id="btn-print-exam">🖨️ طباعة</button>
    </div>`;
    openModal(`📊 تقرير النتائج — ${rep.rows.length} تمارين`, body);
    $("#dl-csv")?.addEventListener("click", () =>
      downloadFile(`boussole4d_${rep.year}_sujet${rep.sujet}.csv`, reportToCSV(rep))
    );
    $("#dl-json")?.addEventListener("click", () =>
      downloadFile(`boussole4d_${rep.year}_sujet${rep.sujet}.json`, JSON.stringify(rep, null, 2))
    );
    $("#btn-print-exam")?.addEventListener("click", printCurrentExercise);
  }

  return { computeReport, showReport };
}
