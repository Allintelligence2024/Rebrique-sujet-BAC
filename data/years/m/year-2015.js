/* ============================================================
   BAC SVT Algérie 2015 — شعبة رياضيات — ARMATURE « COPIE LIBRE »
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

   Deux exercices, comme les autres années de la شعبة — ce n'est PAS une
   mesure de CE fichier (scan : rien à lire), c'est la structure constante
   de la شعبة رياضيات, vérifiée ailleurs :
     - 2016, 2017, 2018, 2019, 2020 : « التمرين الأول » + « التمرين الثاني »
       extraits de la couche texte de chaque sujet ;
     - 2021 à 2026 : deux exercices dans les données déjà encodées.
   Dix années, dix fois deux exercices. Le barème, lui, N'EST PAS constant
   dans cette شعبة (8+12 en 2021, 2022, 2025 ; 7+13 en 2023, 2024 ;
   6+14 en 2026) : il reste donc non mesuré ici, jamais recopié d'une autre
   année.

   Ce qui EST encodé, et rien d'autre :
     - les deux fichiers du sujet, servis par l'application ;
     - la page annales de la source, déjà documentée dans data/archive.js ;
     - une copie libre par exercice (deux), sans consigne et sans barème.
   L'élève répond donc en « copie libre » : il lit le PDF dans la visionneuse
   intégrée et rédige sa réponse. `poles: {}` — aucun inventaire officiel
   n'est dérivé de cette année et aucune note n'est calculée.
   ============================================================ */

const ANNALS_PAGE = "https://www.dzexams.com/ar/annales/QjZpdDhZUjhQOXhSMzZvQnFvVlFjQT09";
const PDF_SOURCE = "https://www.dzexams.com/uploads/sujets/officiels/bac/2015/dzexams-bac-sciences-2723927.pdf";

const PDF_NOTE =
  "PDF officiel servi par l'application : /subjects/M/2015/sujet-N.pdf. " +
  "Page annales de la source : https://www.dzexams.com/ar/annales/QjZpdDhZUjhQOXhSMzZvQnFvVlFjQT09. " +
  "Aucune couche texte (scan) : ni barème ni consigne n'a été recopiés. " +
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

export const YEAR_2015_M = {
  id: "2015-m",
  stream: "m",
  calendarYear: "2015",
  label: "بكالوريا الجزائر دورة 2015 — شعبة رياضيات",
  theme: "indigo",
  enabled: true,
  /* Marque l'année « copie libre » : l'épreuve est ouverte (chronomètre, PDF,
     rédaction, تسليم الورقة) mais aucune consigne n'est encodée et aucune note
     n'est calculée — il n'y a rien à corriger ici. */
  answerMode: "free",
  /* Traceabilité : ce qui a été mesuré, et ce qui ne l'a pas été. */
  freeMeasurements: {
    measuredAt: "2026-09-19",
    /* false = non lu sur CE fichier (scan). Les deux exercices viennent de la
       structure de la شعبة, pas d'une mesure de ce PDF. */
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
      pdfLocalUrl: "/subjects/M/2015/sujet-1.pdf",
      pdfNote: PDF_NOTE,
      title: "الموضوع الأول",
      answerMode: "free",
      exercises: [freeExercise(1), freeExercise(2)]
    },
    {
      id: 2,
      pdf: null,
      pdfExternalUrl: PDF_SOURCE,
      pdfLocalUrl: "/subjects/M/2015/sujet-2.pdf",
      pdfNote: PDF_NOTE,
      title: "الموضوع الثاني",
      answerMode: "free",
      exercises: [freeExercise(1), freeExercise(2)]
    }
  ]
};

export default YEAR_2015_M;
