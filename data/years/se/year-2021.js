/* ============================================================
   BAC SVT Algérie 2021 — شعبة علوم تجريبية — ARMATURE, PAS D'ÉNONCÉ
   ------------------------------------------------------------
   Ce fichier ne contient volontairement AUCUNE consigne.

   État mesuré de la couche texte (`npm run pdftext:status`, 2026-09-18) :
   contrairement à ce que ce commentaire affirmait auparavant, elle n'est
   PAS illisible — c'est même la plus saine du corpus (classe « propre »,
   en-tête officiel extrait verbatim, aucune transposition de ligature,
   7 505 et 7 666 caractères). Elle reste néanmoins INEXPLOITABLE pour un
   encodage automatique, pour deux défauts mesurés :
     - les CHIFFRES sont corrompus : le barème s'extrait « 05 / 40 / 00 »
       alors que le barème réel est 5 + 7 + 8 ;
     - des coupures parasites scindent les mots (248 détectées sur le
       sujet 1 ; 59,6 % des tokens font 3 lettres ou moins).
   Recopier sans relecture humaine injecterait donc des consignes et des
   barèmes faux. Le garde-fou n° 1 s'applique : rien ne passe en
   `official` sans relecture humaine.
   Ce qui EST encodé ici, et rien d'autre :
     - la structure officielle lue dans le fichier : 2 sujets × 3
       exercices, barème 5 + 7 + 8 = 20 points par sujet ;
     - le THÈME de chaque exercice, recopié du préambule lisible ;
     - les fichiers du sujet, servis par l'application.
   L'élève répond donc en « copie libre » : il lit le PDF dans la
   visionneuse intégrée et rédige sa réponse par exercice. Aucune
   tâche n'est inventoriée (`poles: {}`), donc aucun inventaire
   officiel n'est dérivé de cette année et aucune note n'est calculée.
   ============================================================ */

const PDF_DZEXAMS =
  "https://www.dzexams.com/uploads/sujets/officiels/bac/2021/dzexams-bac-sciences-2728849.pdf";

const NOTE_2021 =
  "PDF officiel lu dans l'application : /subjects/SE/2021/sujet-N.pdf (5 pages par fichier, 2 sujets). " +
  "Source miroir : https://www.dzexams.com/uploads/sujets/officiels/bac/2021/dzexams-bac-sciences-2728849.pdf. " +
  "Couche texte lisible mais chiffres corrompus : aucune consigne n'est encodée dans ce fichier, seuls le " +
  "thème et le barème (5/7/8) sont relevés. Le corrigé n'est pas dans l'application — seules les pages du " +
  "sujet sont affichées.";

/** Un exercice d'armature : thème + barème, zéro pôle (= zéro consigne). */
const skeleton = (number, max, label, desc) => ({
  number,
  ui: "text",
  label,
  max,
  desc,
  poles: {}
});

export const YEAR_2021_SE = {
  id: "2021",
  stream: "se",
  calendarYear: "2021",
  label: "بكالوريا الجزائر دورة 2021 — شعبة علوم تجريبية",
  theme: "emerald",
  enabled: true,
  /* Marque l'année « copie libre » : l'épreuve est ouverte (chronomètre,
     PDF, rédaction, تسليم الورقة) mais aucune consigne n'est encodée et
     aucune note n'est calculée — il n'y a rien à corriger ici. */
  answerMode: "free",
  sujets: [
    {
      id: 1,
      pdf: null,
      pdfExternalUrl: PDF_DZEXAMS,
      pdfLocalUrl: "/subjects/SE/2021/sujet-1.pdf",
      pdfNote: NOTE_2021,
      title: "الموضوع الأول",
      answerMode: "free",
      exercises: [
        skeleton(
          1,
          5,
          "تركيب البروتين",
          "أنواع الـ ARN والبنية الفراغية للبروتين (الجزيئة س، الروابط الكيميائية)"
        ),
        skeleton(
          2,
          7,
          "الأنزيمات",
          "الريبونكلياز (A): الموقع الفعال، نشاط الأنزيم حسب pH، طفرة استبدال الحمض الأميني (His119)"
        ),
        skeleton(
          3,
          8,
          "المناعة",
          "دخول فيروس الـ (VIH) إلى العضوية: الاستجابة المناعية ثم تعطيل الآليات المناعية"
        )
      ]
    },
    {
      id: 2,
      pdf: null,
      pdfExternalUrl: PDF_DZEXAMS,
      pdfLocalUrl: "/subjects/SE/2021/sujet-2.pdf",
      pdfNote: NOTE_2021,
      title: "الموضوع الثاني",
      answerMode: "free",
      exercises: [
        skeleton(1, 5, "المناعة", "الجهاز المناعي: قدرة الخلايا على التمييز بين مكونات الذات واللاذات"),
        skeleton(
          2,
          7,
          "الشفرة الوراثية",
          "وحدة الشفرة الوراثية وترجمة الـ ARNm إلى بروتينات نوعية: استثناءات القاعدة وعلاج بعض الاختلالات الوراثية"
        ),
        skeleton(
          3,
          8,
          "الرسالة العصبية وتسكين الألم",
          "نقل الخلايا العصبية لرسائل الألم: المورفين وسم العنكبوت (Psp3TX1)"
        )
      ]
    }
  ]
};

export default YEAR_2021_SE;
