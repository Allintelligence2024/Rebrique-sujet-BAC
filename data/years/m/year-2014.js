/* ============================================================
   BAC SVT Algérie 2014 — شعبة رياضيات — ARMATURE « COPIE LIBRE »
   ------------------------------------------------------------
   Ce fichier n'encode AUCUNE consigne, aucun thème et aucun barème.

   Mesures du 2026-09-19, faites avec le classifieur du dépôt
   (scripts/report-pdf-text-layers.mjs — extractPdfText + classifyTextLayer,
   le même que `npm run pdftext:status`) :

     sujet 1 — couche texte : scan (0 car.)
     sujet 2 — couche texte : scan (0 car.)
     en-têtes « التمرين الأول » et « التمرين الثاني » extraits : non
     barème : NON MESURÉ (scan : aucune couche texte)
     consignes : aucune recopiée (TRAVAIL C — relecture humaine requise)

   Ce qui EST encodé, et rien d'autre :
     - les deux fichiers du sujet, servis par l'application ;
     - la page annales de la source, déjà documentée dans data/archive.js ;
     - le découpage officiel NON mesurable (scan) : une copie libre pour le sujet entier.
   L'élève répond donc en « copie libre » : il lit le PDF dans la visionneuse
   intégrée et rédige sa réponse. `poles: {}` — aucun inventaire officiel
   n'est dérivé de cette année et aucune note n'est calculée.
   ============================================================ */

const ANNALS_PAGE = "https://www.dzexams.com/ar/annales/MXlQMjVhL2ZLK25mcEpTWnI5N3JtQT09";
const PDF_SOURCE = "https://www.dzexams.com/uploads/sujets/officiels/bac/2014/dzexams-bac-sciences-2369148.pdf";

const PDF_NOTE =
  "PDF officiel servi par l'application : /subjects/M/2014/sujet-N.pdf. " +
  "Page annales de la source : https://www.dzexams.com/ar/annales/MXlQMjVhL2ZLK25mcEpTWnI5N3JtQT09. " +
  "Aucune couche texte (scan) : ni barème ni consigne n'a été recopiés. " +
  "Le corrigé n'est pas dans l'application : seules les pages du sujet sont affichées.";

/* Le découpage en exercices n'est pas mesurable sur un scan : une seule copie
   libre pour le sujet entier. `max: null` n'est pas un zéro déguisé : c'est un
   barème non mesuré, et l'écran d'épreuve le dit à la place d'un nombre faux. */
const wholeSubjectCopy = () => ({
  number: 1,
  ui: "text",
  label: null,
  max: null,
  poles: {},
  wholeSubject: true
});

export const YEAR_2014_M = {
  id: "2014-m",
  stream: "m",
  calendarYear: "2014",
  label: "بكالوريا الجزائر دورة 2014 — شعبة رياضيات",
  badge: "ورقة حرة",
  theme: "amber",
  enabled: true,
  /* Marque l'année « copie libre » : l'épreuve est ouverte (chronomètre, PDF,
     rédaction, تسليم الورقة) mais aucune consigne n'est encodée et aucune note
     n'est calculée — il n'y a rien à corriger ici. */
  answerMode: "free",
  answerModeNote:
    "تعليمات هذه الدورة غير مُشفَّرة في التطبيق: تعرض الشاشة الموضوع الرسمي وخانة إجابة حرة واحدة للموضوع كاملاً، بلا تصحيح ولا نقطة. بارم التمارين غير مُقاس على هذا الملف فلا يُعرض أي عدد نقاط.",
  /* Traceabilité : ce qui a été mesuré, et ce qui ne l'a pas été. */
  freeMeasurements: {
    measuredAt: "2026-09-19",
    exerciseSplitMeasured: false,
    pointsMeasured: false,
    promptsEncoded: false,
    method: "scripts/report-pdf-text-layers.mjs — extractPdfText + classifyTextLayer"
  },
  sujets: [
    {
      id: 1,
      pdf: null,
      pdfExternalUrl: PDF_SOURCE,
      pdfLocalUrl: "/subjects/M/2014/sujet-1.pdf",
      pdfNote: PDF_NOTE,
      title: "الموضوع الأول",
      answerMode: "free",
      exercises: [wholeSubjectCopy()]
    },
    {
      id: 2,
      pdf: null,
      pdfExternalUrl: PDF_SOURCE,
      pdfLocalUrl: "/subjects/M/2014/sujet-2.pdf",
      pdfNote: PDF_NOTE,
      title: "الموضوع الثاني",
      answerMode: "free",
      exercises: [wholeSubjectCopy()]
    }
  ]
};

export default YEAR_2014_M;
