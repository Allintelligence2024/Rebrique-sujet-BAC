/* ============================================================
   BAC SVT Algérie 2021 — شعبة علوم تجريبية
   ------------------------------------------------------------
   Les CONSIGNES (questions demandées) des deux sujets ont été
   recopiées à partir du PDF officiel : relecture image page à page
   des dix pages (`rendered/`), les symboles latins que le rendu ne
   dessine pas (A, ARNm, ARNt, VIH, LT4, Tetrahymena, pH, cpm…)
   étant restitués d'après la couche texte du PDF — dont les
   chiffres, eux, sont faux (police à encodage décalé) et n'ont donc
   jamais été lus autrement que sur l'image.
   Ce qui est encodé : la structure officielle (2 sujets × 3
   exercices, barème 5 + 7 + 8 = 20 points par sujet), le THÈME de
   chaque exercice, les FICHIERS du sujet, et les questions
   officielles (`consignes`). Les énoncés des documents (tableaux,
   courbes, protocoles) restent dans le PDF : seules les questions
   sont recopiées, et chaque bloc porte sa page source.
   Ce qui n'est PAS encodé, et ne le sera pas sans corrigé local :
   aucun pôle (`poles: {}`), donc aucun inventaire officiel, aucun
   corrigé et aucune note. L'épreuve reste une « copie libre » : lire
   le sujet, rédiger une réponse par exercice, rendre la copie.
   ============================================================ */

const PDF_DZEXAMS =
  "https://www.dzexams.com/uploads/sujets/officiels/bac/2021/dzexams-bac-sciences-2728849.pdf";

const NOTE_2021 =
  "PDF officiel lu dans l'application : /subjects/SE/2021/sujet-N.pdf — les cinq pages du sujet (le document " +
  "officiel en compte dix, cinq par sujet ; la pagination « من 10 » imprimée le confirme). Source miroir : " +
  "https://www.dzexams.com/uploads/sujets/officiels/bac/2021/dzexams-bac-sciences-2728849.pdf. " +
  "Les questions officielles sont recopiées page par page (relecture image) et affichées dans l'application ; les " +
  "symboles latins que le rendu ne dessine pas (A, ARNm, ARNt, VIH, LT4, Tetrahymena, pH…) sont restitués d'après la " +
  "couche texte du PDF, dont les chiffres sont faux et n'ont donc jamais été lus autrement que sur l'image. Aucune " +
  "note n'est calculée : ni pôle ni corrigé local, et le sujet complet (documents, tableaux, courbes) reste dans le PDF.";

/* Provenance commune aux six exercices : même méthode, mêmes limites. */
const CONSIGNES_SOURCE =
  "منقولة من ملف الموضوع الرسمي (قراءة الصور صفحة صفحة)؛ الرموز اللاتينية مستعادة من طبقة نص الملف، والأرقام من الصورة.";

/** Un exercice : thème + barème + questions recopiées, zéro pôle (= zéro note). */
const skeleton = (number, max, label, desc, pages, consignes) => ({
  number,
  ui: "text",
  label,
  max,
  desc,
  consignesSource: CONSIGNES_SOURCE,
  consignesPages: pages,
  consignes,
  poles: {}
});

export const YEAR_2021_SE = {
  id: "2021",
  stream: "se",
  calendarYear: "2021",
  label: "بكالوريا الجزائر دورة 2021",
  badge: "دورة رسمية",
  theme: "emerald",
  enabled: true,
  /* Marque l'année « copie libre » : l'épreuve est ouverte (chronomètre,
     PDF, rédaction, تسليم الورقة) et les questions officielles sont
     affichées, mais aucune note n'est calculée — il n'y a rien à corriger
     ici, faute de pôles et de corrigé local. */
  answerMode: "free",
  answerModeNote:
    "تعليمات هذه الدورة مكتوبة في هذه الشاشة بلا تصحيح: تعرض الشاشة الموضوع الرسمي والأسئلة المنقولة وخانة إجابة حرة لكل تمرين، بلا نقطة.",
  sujets: [
    {
      id: 1,
      pdf: null,
      pdfAvailable: false,
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
          "أنواع الـ ARN والبنية الفراغية للبروتين (الجزيئة س، الروابط الكيميائية)",
          "الصفحة 1 من 10",
          [
            "1 ــ تعرَّف على المرحلتين (أ) و(ب) من الشكل (أ) وعلى الروابط المرقمة من 1 إلى 4 من الشكل (ج) ثم حدِّد مستوى البنية الفراغية للبروتين (س) الممثلة في الشكل (ب) مع التعليل.",
            "2 ــ بيِّن في نص علمي آليات تركيب البروتين وكيفية اكتسابه تخصصا وظيفيا من معطيات الوثيقة ومكتسباتك."
          ]
        ),
        skeleton(
          2,
          7,
          "الأنزيمات",
          "الريبونكلياز (A): الموقع الفعال، نشاط الأنزيم حسب pH، طفرة استبدال الحمض الأميني (His119)",
          "الصفحتان 2 و3 من 10",
          [
            "الجزء الأول:",
            "1 ــ بيِّن أن معطيات الشكل (أ) من الوثيقة (1) تسمح بتحديد المستوى البنيوي لجزيئة الريبونكلياز (A).",
            "2 ــ استدِلَّ من المعطيات السابقة:",
            "ــ لتُثبِت أن ارتباط الأنزيم بالركيزة يتم بفضل تكامل بنيوي يُترجَمُ على المستوى الجزيئي.",
            "ــ ولتُفسِّر النتائج التجريبية المذكورة أعلاه.",
            "الجزء الثاني:",
            "1 ــ حلِّل النتائج الممثلة في الوثيقة (2) ثم بيِّن اعتمادا على بنية الموقع الفعال سبب النشاط الطبيعي للأنزيم في عصارة معوية (pH بين 7.3 و 8.5)، وعدم نشاطه في عصارة معدية (pH = 2).",
            "2 ــ فسِّر النتائج الممثلة في الوثيقة (3).",
            "3 ــ استخلص شروط عمل الموقع الفعال للأنزيم التي تم إبرازها في هذه الدراسة."
          ]
        ),
        skeleton(
          3,
          8,
          "المناعة",
          "دخول فيروس الـ (VIH) إلى العضوية: الاستجابة المناعية ثم تعطيل الآليات المناعية",
          "الصفحتان 4 و5 من 10",
          [
            "الجزء الأول:",
            "1 ــ حلِّل معطيات الوثيقة (1).",
            "2 ــ اقترِح فرضية تُفسِّر بها دور الخلايا (LT4) في الاستجابة المناعية النوعية.",
            "الجزء الثاني:",
            "1 ــ حدِّد هدف كل من التجارب ①②③، البروتوكول التجريبي الممثل في الوثيقة (2).",
            "2 ــ باستغلالك للوثيقتين (2) و(3)، وباستدلال علمي دقيق: استخرِج المعلومات الأساسية التي تمكّنك من تأكيد صحة الفرضية وحل مشكلة تعطيل الآليات المناعية إثر إصابة العضوية بـ (VIH).",
            "الجزء الثالث:",
            "أنجِز مخططا تفسيريا للتغيرات التي تطرأ على الاستجابة المناعية النوعية إثر إصابة العضوية بفيروس (VIH) مستعينا بنتائج هذه الدراسات ومكتسباتك."
          ]
        )
      ]
    },
    {
      id: 2,
      pdf: null,
      pdfAvailable: false,
      pdfExternalUrl: PDF_DZEXAMS,
      pdfLocalUrl: "/subjects/SE/2021/sujet-2.pdf",
      pdfNote: NOTE_2021,
      title: "الموضوع الثاني",
      answerMode: "free",
      exercises: [
        skeleton(
          1,
          5,
          "المناعة",
          "الجهاز المناعي: قدرة الخلايا على التمييز بين مكونات الذات واللاذات",
          "الصفحة 6 من 10",
          [
            "1 ــ تعرَّف على البيانات المرقمة والمراحل المعبر عنها بالأحرف (A, B, C, D).",
            "2 ــ أكتب نصا علميا توضح فيه المؤهلات التي سمحت للخلايا المُبيَّنة في الوثيقة بأداء وظائفها."
          ]
        ),
        skeleton(
          2,
          7,
          "الشفرة الوراثية",
          "وحدة الشفرة الوراثية وترجمة الـ ARNm إلى بروتينات نوعية: استثناءات القاعدة وعلاج بعض الاختلالات الوراثية",
          "الصفحتان 6 و7 من 10",
          [
            "الجزء الأول:",
            "1 ــ حلِّل نتائج المرحلتين الأولى والثانية.",
            "2 ــ باستغلال شكلي الوثيقة (1) اشرح سبب الاختلاف الملاحظ في نتائج المرحلتين الأولى والثانية.",
            "الجزء الثاني:",
            "1 ــ باستغلال الشكلين (أ) و(ب) من الوثيقة (2): فسِّر اختلاف ناتج التعبير المورثي للـ (ARNm) المُبيَّن في الشكل (أ) من الوثيقة (1) عند الأرنب و(Tetrahymena).",
            "2 ــ اقترح حلا يؤدي إلى تركيب الكازيين في حليب الأم العاجزة عن تركيبه."
          ]
        ),
        skeleton(
          3,
          8,
          "الرسالة العصبية وتسكين الألم",
          "نقل الخلايا العصبية لرسائل الألم: المورفين وسم العنكبوت (Psp3TX1)",
          "الصفحات 8 إلى 10 من 10",
          [
            "الجزء الأول:",
            "1 ــ حدِّد في جدول دور الجزيئات الغشائية المتدخلة على مستوى القرن الخلفي في نقل الرسالة العصبية، ثم استنتج تأثير هذا السم على الإحساس بالألم.",
            "2 ــ اقترح ثلاث فرضيات لتفسير تأثير هذا السم على الجزيئات الغشائية المسؤولة عن نقل الإحساس بالألم.",
            "الجزء الثاني:",
            "1 ــ فسِّر نتائج التجارب الموضحة في الوثيقتين (2) و(3) ثم تحقَّق من مدى صحة الفرضيات المقترحة.",
            "2 ــ استخلص أن استعمال سم العنكبوت بديلا للمورفين كعلاج مسكن للألم أكثر فعالية وأقل ضرر على الجسم.",
            "الجزء الثالث:",
            "لخِّص في مخطط نتائج تأثير سم العنكبوت على آلية نقل الرسالة العصبية المتدخلة في الإحساس بالألم على مستوى المشبك العصبي."
          ]
        )
      ]
    }
  ]
};

export default YEAR_2021_SE;
