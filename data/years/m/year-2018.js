/* ============================================================
   BAC SVT Algérie 2018 — شعبة رياضيات — ARMATURE « COPIE LIBRE »
   ------------------------------------------------------------
   Ce fichier n'encode AUCUNE consigne, aucun thème et aucun barème.

   Mesures du 2026-09-19, faites avec le classifieur du dépôt
   (scripts/report-pdf-text-layers.mjs — extractPdfText + classifyTextLayer,
   le même que `npm run pdftext:status`) :

     sujet 1 — couche texte : transposé (3 024 car.)
     sujet 2 — couche texte : transposé (2 559 car.)
     en-têtes « التمرين الأول » et « التمرين الثاني » extraits : oui
     barème : NON MESURÉ (chiffres corrompus sur ce corpus)
     consignes : aucune recopiée (TRAVAIL C — relecture humaine requise)

   Ce qui EST encodé, et rien d'autre :
     - les deux fichiers du sujet, servis par l'application ;
     - la page annales de la source, déjà documentée dans data/archive.js ;
     - le découpage officiel mesuré : 2 exercices par sujet.
   L'élève répond donc en « copie libre » : il lit le PDF dans la visionneuse
   intégrée et rédige sa réponse. `poles: {}` — aucun inventaire officiel
   n'est dérivé de cette année et aucune note n'est calculée.
   ============================================================ */

const ANNALS_PAGE = "https://www.dzexams.com/ar/annales/aDMxL2FtWlZwZ3NmeThCMG5WNk50UT09";
const PDF_SOURCE = "https://www.dzexams.com/uploads/sujets/officiels/bac/2018/dzexams-bac-sciences-1967487.pdf";

const PDF_NOTE =
  "PDF officiel servi par l'application : /subjects/M/2018/sujet-N.pdf. " +
  "Page annales de la source : https://www.dzexams.com/ar/annales/aDMxL2FtWlZwZ3NmeThCMG5WNk50UT09. " +
  "Couche texte : transposé / transposé — chiffres corrompus : aucun barème ni consigne n'a été recopié. " +
  "Le corrigé n'est pas dans l'application : seules les pages du sujet sont affichées.";

/* Une copie libre par exercice : ni consigne, ni thème, ni barème.
   `max: null` n'est pas un zéro déguisé : c'est un barème non mesuré, et
   l'écran d'épreuve le dit à la place d'afficher un nombre faux. */
const freeExercise = (number) => ({
  number,
  ui: "text",
  label: null,
  max: null,
  poles: {}
});

export const YEAR_2018_M = {
  id: "2018-m",
  stream: "m",
  calendarYear: "2018",
  label: "بكالوريا الجزائر دورة 2018 — شعبة رياضيات",
  badge: "ورقة حرة",
  theme: "emerald",
  enabled: true,
  /* Marque l'année « copie libre » : l'épreuve est ouverte (chronomètre, PDF,
     rédaction, تسليم الورقة) mais aucune consigne n'est encodée et aucune note
     n'est calculée — il n'y a rien à corriger ici. */
  answerMode: "free",
  answerModeNote:
    "تعليمات هذه الدورة غير مُشفَّرة في التطبيق: تعرض الشاشة الموضوع الرسمي وخانة إجابة حرة لكل تمرين، بلا تصحيح ولا نقطة. بارم التمارين غير مُقاس على هذا الملف فلا يُعرض أي عدد نقاط.",
  /* Traceabilité : ce qui a été mesuré, et ce qui ne l'a pas été. */
  freeMeasurements: {
    measuredAt: "2026-09-19",
    exerciseSplitMeasured: true,
    pointsMeasured: false,
    promptsEncoded: false,
    method: "scripts/report-pdf-text-layers.mjs — extractPdfText + classifyTextLayer"
  },
  sujets: [
    {
      id: 1,
      pdf: null,
      pdfExternalUrl: PDF_SOURCE,
      pdfLocalUrl: "/subjects/M/2018/sujet-1.pdf",
      pdfNote: PDF_NOTE,
      title: "الموضوع الأول",
      answerMode: "free",
      exercises: [freeExercise(1), freeExercise(2)]
    },
    {
      id: 2,
      pdf: null,
      pdfExternalUrl: PDF_SOURCE,
      pdfLocalUrl: "/subjects/M/2018/sujet-2.pdf",
      pdfNote: PDF_NOTE,
      title: "الموضوع الثاني",
      answerMode: "free",
      exercises: [freeExercise(1), freeExercise(2)]
    }
  ]
};

export default YEAR_2018_M;
