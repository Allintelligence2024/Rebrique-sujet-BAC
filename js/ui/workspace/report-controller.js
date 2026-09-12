/* ============================================================
   Rapport d'entraînement : module VOLONTAIREMENT non câblé.
   ------------------------------------------------------------
   Depuis le retrait des notes chiffrées de l'interface (voir
   data/calibration-policy.js), aucun écran n'expose de bouton
   « تقرير » : createReportController n'est instancié nulle part dans
   js/ui.js, et l'absence des identifiants #ws-report / #ws-reset est
   verrouillée par tests/ui.test.mjs. Ce module et ses dépendances
   (reports/report.js, reports/exports.js) sont donc couverts par les
   tests uniquement (tests/workspace-modules.test.mjs).
   Ne pas le recâbler sans rouvrir la question des notes : le rapport
   n'affiche des scores numériques que si CALIBRATION_STATUS
   .scorePromotionAllowed est vrai.
   ============================================================ */
import { CALIBRATION_STATUS } from "../../../data/calibration-status.js";
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
    const numericAllowed = CALIBRATION_STATUS.scorePromotionAllowed === true;
    const summary = numericAllowed
      ? `<div class="card card-inset">
          <div class="flex spread"><strong>الحصيلة التدريبية</strong>
            <span class="mono text-emerald report-score">${rep.grand.toFixed(2)} / ${rep.grandMax.toFixed(2)}</span>
          </div>
          <progress class="native-progress mt-1" max="100" value="${rep.percent}">${rep.percent}%</progress>
        </div>`
      : `<div class="card card-inset"><strong>تشخيص نوعي فقط</strong><p class="small text-muted mt-1">النقاط والنسب الآلية محجوبة: لم تتحقق بعد عتبات المعايرة البشرية المزدوجة.</p></div>`;
    const body = `
      ${trainingLimitHTML()}
      ${summary}
      <div class="stack mt-2">
        ${rep.rows
          .map(
            (row) => `<div class="flex spread report-row">
              <span class="bold">${row.exercise}: ${row.label} ${row.filled ? "" : "(غير مكتمل)"}</span>
              ${numericAllowed ? `<span class="mono ${row.total >= row.max * 0.7 ? "text-emerald" : "text-amber"}">${row.total.toFixed(2)} / ${row.max.toFixed(2)}</span>` : `<span class="text-muted">feedback فقط</span>`}
            </div>`
          )
          .join("")}
      </div>
      <div class="flex mt-2">
        ${numericAllowed ? `<button class="btn btn-emerald btn-sm" id="dl-csv">⬇️ تنزيل CSV</button><button class="btn btn-ghost btn-sm" id="dl-json">⬇️ تنزيل JSON</button>` : ""}
        <button class="btn btn-indigo btn-sm" id="btn-print-exam">🖨️ طباعة</button>
      </div>`;
    openModal(`📊 تقرير التدريب — ${rep.rows.length} تمارين`, body);
    if (numericAllowed) {
      $("#dl-csv")?.addEventListener("click", () =>
        downloadFile(`boussole4d_${rep.year}_sujet${rep.sujet}.csv`, reportToCSV(rep))
      );
      $("#dl-json")?.addEventListener("click", () =>
        downloadFile(`boussole4d_${rep.year}_sujet${rep.sujet}.json`, JSON.stringify(rep, null, 2))
      );
    }
    $("#btn-print-exam")?.addEventListener("click", printCurrentExercise);
  }

  return { computeReport, showReport };
}
