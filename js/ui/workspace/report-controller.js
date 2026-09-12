/* ============================================================
   Rapport d'entraînement — câblé depuis l'espace de travail
   (bouton « 📊 تقرير », #ws-report, instancié dans js/ui.js).
   ------------------------------------------------------------
   Garde-fou produit : tant que CALIBRATION_STATUS.scorePromotionAllowed
   est faux, le rapport n'affiche AUCUNE valeur chiffrée et les exports
   CSV/JSON (qui contiennent les notes par pôle) ne sont pas proposés.
   Seules restent visibles : la limite de l'outil (trainingLimitHTML),
   le diagnostic qualitatif par exercice et l'impression de la copie.
   Le déblocage des notes passe par la calibration humaine, pas par ici
   (voir data/calibration-policy.js).
   ============================================================ */
import { CALIBRATION_STATUS } from "../../../data/calibration-status.js";
import { appendText } from "../dom.js";
import { trainingLimitHTML } from "../training-limit.js";
import { downloadFile, printCurrentExercise, reportToCSV } from "../reports/exports.js";
import { buildTrainingReport } from "../reports/report.js";

export function createReportController({ $, APP_CONFIG, POLE_ORDER, openModal, store, yearObj, sujetObj }) {
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
    const overlay = openModal(`📊 تقرير التدريب — ${rep.rows.length} تمارين`, body);
    // Valeur dynamique : elle n'entre jamais dans le gabarit HTML, elle est
    // ajoutée comme nœud texte après coup (format ISO court, stable partout).
    const reportBody = $(".modal .small", overlay);
    if (reportBody) {
      const stamp = rep.generatedAt.replace("T", " ").slice(0, 16);
      appendText(reportBody, ` — أُنشئ آلياً ${stamp}`);
    }
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
