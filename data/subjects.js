/* ============================================================
   CONFIGURATION DATA-DRIVEN  (contenu réel BAC 2025 - SVT)
   ------------------------------------------------------------
   Contenu reconstitué à partir du sujet officiel (scanné) et du
   corrigé modèle ("الإجابة النموذجية") du BAC 2025 - شعبة علوم
   تجريبية. Les mots-clés et intitulés sont extraits de l'OCR ;
   à vérifier humainement avant diffusion.

   Le barème est adapté à la méthode « Boussole 4D » (N/S/E/W) :
   la somme des pôles = les points officiels de chaque exercice.
   ============================================================ */

/** Normalisation du texte arabe : harmonise les variantes de lettres. */
export function normalizeArabic(text) {
  if (!text) return "";
  return text
    .replace(/[إأآا]/g, "ا")
    .replace(/[ىي]/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[ًٌٍَُِّْ]/g, "")
    .toLowerCase()
    .trim();
}

export const APP_CONFIG = {
  appTitle: "بوصلة كنز المنهجية 4D",
  appSubtitle: "مخبر التفوق والهدوء | منصة حل امتحانات بكالوريا علوم الطبيعة والحياة",
  globalExamMinutes: 270,       // 4h30
  strategyMinutes: 25,          // temps de choix du sujet
  note: "المحتوى مُستخرج من المرجع الرسمي (dzexams) — يُراجع قبل النشر.",
  years: [
    {
      id: "2025",
      label: "بكالوريا الجزائر دورة 2025",
      badge: "دورة نموذجية",
      theme: "emerald",
      enabled: true,
      sujets: [
        /* ============================ الموضوع الأول ============================ */
        {
          id: 1,
          pdf: "BAC2025_SVT_Sujet1.pdf",
          pdfAvailable: true,
          pdfNote: "PDF officiel fourni dans le dépôt.",
          title: "الموضوع الأول",
          exercises: [
            {
              number: 1,
              ui: "text",
              label: "دور الـ ARN في تركيب البروتين",
              max: 5,
              desc: "أنواع الأحماض الريبية النووية (ARN) ودورها في تركيب البروتين وتأثير مادة تُفكّك الرابطة أدنين–ريبوز",
              poles: {
                N: { points: 1, prompt: "تأطير الإشكالية: دور مختلف أنواع ARN في تركيب البروتين وتأثير المادة المُعطِّلة على الأورام السرطانية", placeholder: "صياغة المشكل العلمي بدقة...", minLength: 40,
                     rule: { keywords: ["الحمض", "الريبوزي", "النووي", "البروتين", "تركيب"], minHits: 2, forbidden: [] } },
                S: { points: 1, prompt: "انتقاء المفاهيم: أنواع ARN المتواجدة في الهيولى خلال وخارج فترة تركيب البروتين", placeholder: "رسول، ناقل، ريبوزومي، ريبوزوم، هيولى...", minLength: 30,
                     rule: { keywords: ["رسول", "ناقل", "ريبوزوم", "هيولي"], minHits: 2, forbidden: [] } },
                E: { points: 2, prompt: "هيكلة العرض السببي: دور كل نوع من ARN + أثر المادة المعطِّلة (كسر الرابطة أدنين–ريبوز)", placeholder: "الـARN الرسول ينقل المعلومة، الـARN الناقل يحمل الأحماض الأمينية...", minLength: 120,
                     rule: { keywords: ["الرسول", "الناقل", "الريبوزوم", "الادنين", "السكر", "العرض"], minHits: 3, forbidden: [] } },
                W: { points: 1, prompt: "الخاتمة التركيبية: كيف يُثبِّط الدواء تكاثر الخلايا السرطانية", placeholder: "الخاتمة كإجابة نهائية مختصرة...", minLength: 40,
                     rule: { keywords: ["الانواع", "الثلاثه", "البروتين", "يتوقف"], minHits: 2, forbidden: [] } }
              }
            },
            {
              number: 2,
              ui: "text",
              label: "الطحالب الخضراء وثاني أكسيد الكربون",
              max: 7,
              desc: "بنية الصانعات الخضراء وآلية استغلال CO₂ عند الطحالب الطبيعية والطافرة (المظهر الضوئي للطاقة)",
              poles: {
                N: { points: 1, prompt: "تأطير الإشكالية: العلاقة بين بنية الصانعات الخضراء وآلية استغلال CO₂ وتحويل الطاقة الضوئية", placeholder: "المتغيرات والمشكل العلمي...", minLength: 30,
                     rule: { keywords: ["الصانعات", "الخضراء", "اكسيد", "الكربون", "الضوئيه"], minHits: 2, forbidden: [] } },
                S: { points: 2.5, prompt: "مصفوفة استغلال الوثائق بالأرقام: مقارنة النمو بين النمط الطبيعي والطافر عند تراكيز CO₂ مختلفة", placeholder: "حلّل الشكل (أ): قارن بالتوازي النطبيعي والطافر...", minLength: 90,
                     rule: { keywords: ["نمو", "طبيعي", "طافر", "التركيز", "نسبه"], minHits: 3, forbidden: ["بسبب"] } },
                E: { points: 2.5, prompt: "الربط السببي: دور أنزيم RUBISCO والبِرينويد والتيلاكوئيد في تثبيت CO₂ وتحويل الطاقة", placeholder: "يتشرب CO₂ من الوسط، أنزيم RUBISCO يثبّته على RuBP...", minLength: 110,
                     rule: { keywords: ["الانزيم", "تثبيت", "البيرينويد", "التيلاكوئيد", "الضوئيه"], minHits: 3, forbidden: [] } },
                W: { points: 1, prompt: "الاستخلاص: تبرير حماية الطحالب الطبيعية حفاظاً على البيئة البحرية", placeholder: "الطاقة الكيميائية الكامنة رغم انخفاض CO₂...", minLength: 40,
                     rule: { keywords: ["حمایه", "تلوث", "اكسجين", "يثبت"], minHits: 2, forbidden: [] } }
              }
            },
            {
              number: 3,
              ui: "pipeline",
              label: "الأدينوزين، الكافيين والنشاط العصبي",
              max: 8,
              desc: "أثر الكافيين على دور الأدينوزين في النشاط العصبي (اليقظة/النوم) — المخطط التحصيلي ذو المسارين",
              poles: {
                N: { points: 0.5, prompt: "تأطير المسعى: ضبط المتغيرات (تركيز أدينوزين/كافيين، النشاط الدماغي)، وصياغة الفرضيتين", minLength: 30 },
                S: { points: 2.0, prompt: "مصفوفة استغلال الوثيقة 1 (الشكل أ: النشاط العصبي / الشكل ب: شدة الارتباط بـ A1R) بالأرقام", minLength: 60 },
                E: { points: 4.0, prompt: "الاستدلال: تتبّع سلسلة A1R → Gi/Go → قنوات K⁺/Ca²⁺ → إفراز النورإبينفرين (NE) مع المصادقة", minLength: 80 },
                W: { points: 1.5, prompt: "المصادقة والمخطط المقارن: الحالة الطبيعية (نقص اليقظة) مقابل وجود الكافيين (زيادة اليقظة)", minLength: 0 }
              },
              blocksBank: [
                { id: "b1", text: "تشكل معقد (أدينوزين-A1R) على الغشاء",              stream: 1, slot: 0 },
                { id: "b2", text: "تفعيل البروتينات الغشائية Gi و Go",                  stream: 1, slot: 1 },
                { id: "b3", text: "زيادة خروج K⁺ وتثبيط دخول شوارد Ca²⁺",                stream: 1, slot: 2 },
                { id: "b4", text: "انخفاض إفراز المبلغ العصبي (NE)",                    stream: 1, slot: 3 },
                { id: "b5", text: "تنافس الكافيين على مستقبل A1R مع الأدينوزين",         stream: 2, slot: 0 },
                { id: "b6", text: "عدم تفعيل البروتينات الغشائية Gi و Go",               stream: 2, slot: 1 },
                { id: "b7", text: "زوال تثبيط Ca²⁺ واستمرار تدفقها",                     stream: 2, slot: 2 },
                { id: "b8", text: "تحرير المبلغ العصبي (NE) في الشق المشبكي",            stream: 2, slot: 3 }
              ],
              streams: [
                { id: 1, title: "المسار 1: الحالة الطبيعية (نقص اليقظة)", theme: "rose",
                  slots: ["الاستقبال الغشائي لأدينوزين", "البروتينات Gi/Go", "قنوات K⁺/Ca²⁺", "إفراز النورإبينفرين"] },
                { id: 2, title: "المسار 2: في وجود الكافيين (زيادة اليقظة)", theme: "emerald",
                  slots: ["التنافس / الحجب على A1R", "عدم تفعيل Gi/Go", "استمرار تدفق Ca²⁺", "تحرير النورإبينفرين"] }
              ]
            }
          ]
        },
        /* ============================ الموضوع الثاني ============================ */
        {
          id: 2,
          pdf: "BAC2025_SVT_Sujet2.pdf",
          pdfAvailable: true,
          pdfNote: "PDF officiel fourni dans le dépôt.",
          title: "الموضوع الثاني",
          exercises: [
            {
              number: 1,
              ui: "text",
              label: "التحلل السكري وطاقة الجلوكوز",
              max: 5,
              desc: "تحويل الطاقة الكيميائية الكامنة في جزيئة الجلوكوز إلى طاقة قابلة للاستعمال (ATP) خلال التحلل السكري + أثر دواء",
              poles: {
                N: { points: 1, prompt: "تأطير الإشكالية: كيف تُحَّول طاقة الجلوكوز خلال التحلل السكري وما أثر الدواء المُثبِّط للخطوة 1", placeholder: "...", minLength: 40,
                     rule: { keywords: ["التحلل", "السكري", "الجلوكوز", "الطاقه"], minHits: 2, forbidden: [] } },
                S: { points: 1, prompt: "التعرف على المركبات (أ، ب، ج، د، هـ) في المخطط + كتابة المعادلة الإجمالية", placeholder: "جلوكوز، فركتوز ثنائي الفوسفات، حمض البيروفيك...", minLength: 40,
                     rule: { keywords: ["حمض", "البيروفيك", "فركتوز", "جلوكوز"], minHits: 2, forbidden: [] } },
                E: { points: 2, prompt: "العرض السببي: تسلسل تفاعلات التحلل السكري وإنتاج ATP + أثر الدواء على الخطوة 1", placeholder: "الخطوة 1/الخطوة 2، أنزيم، ATP، البيروفيك...", minLength: 120,
                     rule: { keywords: ["الخطوه", "انزيم", "فوسفات", "ثنائي", "الطاقه"], minHits: 3, forbidden: [] } },
                W: { points: 1, prompt: "الخاتمة: دور التحلل السكري في إنتاج الطاقة وتأثير الدواء على تكاثر الخلايا السرطانية", placeholder: "...", minLength: 40,
                     rule: { keywords: ["الطاقه", "يتوقف", "الخلایا", "تتكاثر"], minHits: 2, forbidden: [] } }
              }
            },
            {
              number: 2,
              ui: "text",
              label: "أنزيم SOD والتصلب الجانبي الضموري",
              max: 7,
              desc: "نشاط أنزيم SOD ضد أنواع الأكسجين التفاعلية (ROS) وعلاقته بتلف الخلايا العصبية الحركية في مرض ALS",
              poles: {
                N: { points: 1, prompt: "تأطير الإشكالية: آلية حماية أنزيم SOD للخلايا العصبية من ROS وعلاقته بمرض ALS", placeholder: "...", minLength: 30,
                     rule: { keywords: ["الانزيم", "الاكسجين", "التفاعلي", "الخلايا", "العصبیه"], minHits: 2, forbidden: [] } },
                S: { points: 2.5, prompt: "تحليل الشكل (أ): نسبة نشاط SOD وتراكيز ROS ونسبة تلف الخلايا عند السليم والمصاب", placeholder: "قارن بالتوازي: نشاط SOD، تراكيز ROS، تلف الخلايا...", minLength: 90,
                     rule: { keywords: ["نشاط", "تراكيز", "تلف", "الخلايا", "سليم"], minHits: 3, forbidden: ["بسبب"] } },
                E: { points: 2.5, prompt: "الربط السببي: دور الموقع الفعّال وشوارد النحاس/الزّنك وسبب الخلل في وظيفة الأنزيم عند المصاب", placeholder: "الموقع الفعّال، النحاس، الزنك، طفرة/خلل...", minLength: 110,
                     rule: { keywords: ["الموقع", "الفعال", "النحاس", "الزنك", "خلل"], minHits: 3, forbidden: [] } },
                W: { points: 1, prompt: "التبرير: استعمال (SOD) كدواء لعلاج ALS واقتراح علاج آخر", placeholder: "...", minLength: 40,
                     rule: { keywords: ["علاج", "اكسده", "سميه", "اقترح"], minHits: 2, forbidden: [] } }
              }
            },
            {
              number: 3,
              ui: "text",
              label: "زمر الدم والتسامح المناعي",
              max: 8,
              desc: "منظومة الزمر ABO، نقل الدم وقبول/رفض المتبرّع، والتسامح المناعي (نقل بين الزمرتين A و O)",
              poles: {
                N: { points: 1, prompt: "تأطير الإشكالية: آلية تحقيق التسامح المناعي عند نقل الدم من مانح زمرته A إلى مستقل زمرته O", placeholder: "...", minLength: 30,
                     rule: { keywords: ["الزمر", "المستضد", "الاجسام", "المضاده"], minHits: 2, forbidden: [] } },
                S: { points: 2.5, prompt: "استغلال الشكل (أ): شدة انحلال خلايا الدم الحمراء (هيموغلوبين/بيليروبين) وزمرة وكمية الدم", placeholder: "حلّل العمليتين وقارن بالتوازي...", minLength: 90,
                     rule: { keywords: ["انحلال", "هيموغلوبين", "بيليروبين", "زمري"], minHits: 3, forbidden: ["بسبب"] } },
                E: { points: 2.5, prompt: "الفرضية والربط: دور الجسم المضاد anti-A/anti-B ونشاط الأنزيم المُعدَّل وراثياً (تحويل المستضد)", placeholder: "فرضية حول آلية التحمل المناعي + دور الأنزيم...", minLength: 110,
                     rule: { keywords: ["فرضیه", "انزیم", "مستضد", "الاجسام", "التحول"], minHits: 3, forbidden: [] } },
                W: { points: 1, prompt: "الاستخلاص: كيف يُحقَّق التسامح المناعي لنقل آمن بين الزمرتين", placeholder: "التسامح المناعي: إمكانية نقل الدم بين الزمرتين...", minLength: 40,
                     rule: { keywords: ["التسامح", "المناعي", "مانح", "مستقبل"], minHits: 2, forbidden: [] } }
              }
            }
          ]
        }
      ]
    },
    {
      id: "2024",
      label: "بكالوريا الجزائر دورة 2024",
      badge: "دورة رسمية",
      theme: "indigo",
      enabled: false,
      sujets: [
        {
          id: 1,
          pdf: null,
          pdfAvailable: false,
          pdfExternalUrl: "https://bac-algerie.net/sujets/2024/bac2024-Sciences-experimentales.pdf",
          pdfNote: "PDF non redistribué dans le dépôt ; source externe: bac-algerie.net (consulté 2026-08-23). Session de remplacement non localisée.",
          title: "الموضوع الأول",
          exercises: []
        },
        {
          id: 2,
          pdf: null,
          pdfAvailable: false,
          pdfExternalUrl: "https://bac-algerie.net/sujets/2024/bac2024-Sciences-experimentales.pdf",
          pdfNote: "PDF non redistribué dans le dépôt ; source externe: bac-algerie.net (consulté 2026-08-23). Session de remplacement non localisée.",
          title: "الموضوع الثاني",
          exercises: []
        }
      ]
    },
    {
      id: "2023",
      label: "بكالوريا الجزائر دورة 2023",
      badge: "تدريب منهجي",
      theme: "amber",
      enabled: false,
      loadingNote: "Sujets 2023 non localisés au 2026-08-23 — source bac-algerie.net identifiée mais extraction texte en attente.",
      sujets: []
    }
  ]
};
