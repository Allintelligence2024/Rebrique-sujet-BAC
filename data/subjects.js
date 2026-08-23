/* ============================================================
   CONFIGURATION DATA-DRIVEN  (BAC SVT Algérie)
   ------------------------------------------------------------
   2025 : consignes confrontées au PDF scanné du dépôt
          (rendu visuel page par page, 2026-08-23).
   2024 : exercices reconstruits à partir du banc de tests du
          dépôt — PDF officiel non relu ici (SSL sortant KO).
   2023 : année désactivée, sujets non extraits.
   ============================================================ */

/** Normalisation du texte arabe : variantes, tatweel, ponctuation. */
export function normalizeArabic(text) {
  if (!text) return "";
  return String(text)
    .replace(/[إأآا]/g, "ا")
    .replace(/[ىي]/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[ًٌٍَُِّْ]/g, "")
    .replace(/\u0640/g, "")
    .replace(/[؟?!.,،؛:«»"“”‘’()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

/** Retire les préfixes / clitiques arabes les plus fréquents. */
export function stripArabicClitics(word) {
  if (!word) return "";
  const t = normalizeArabic(word);
  if (/^(كال|بال|فال|وال|لل)/.test(t)) return t.replace(/^(كال|بال|فال|وال|لل)/, "");
  if (/^ال/.test(t)) return t.replace(/^ال/, "");
  return t.replace(/^[كبفول]/, "");
}

const OFFICIAL = (page, notes) => ({
  bacPromptSource: "official",
  bacPromptPage: page,
  bacPromptVerifiedAt: "2026-08-23",
  bacPromptNotes: notes
});

const RECON = (notes) => ({
  bacPromptSource: "reconstructed",
  bacPromptNotes: notes
});

export const APP_CONFIG = {
  appTitle: "بوصلة كنز المنهجية 4D",
  appSubtitle: "مخبر التفوق والهدوء | منصة حل امتحانات بكالوريا علوم الطبيعة والحياة",
  globalExamMinutes: 270,
  strategyMinutes: 25,
  note: "المحتوى 2025 مُراجع على PDF المستودع. 2024 مُعاد بناؤه ولم يُعاد استخراج نصه من PDF وزاري في هذه الجلسة.",
  years: [
    {
      id: "2025",
      label: "بكالوريا الجزائر دورة 2025",
      badge: "دورة نموذجية",
      theme: "emerald",
      enabled: true,
      sujets: [
        {
          id: 1,
          pdf: "BAC2025_SVT_Sujet1.pdf",
          pdfAvailable: true,
          pdfNote: "PDF officiel fourni dans le dépôt (scan dzexams).",
          title: "الموضوع الأول",
          exercises: [
            {
              number: 1,
              ui: "text",
              label: "دور الـ ARN في تركيب البروتين",
              max: 5,
              desc: "أنواع الأحماض الريبية النووية (ARN) ودورها في تركيب البروتين وتأثير مادة RIP التي تكسر الرابطة أدنين–ريبوز",
              poles: {
                N: {
                  points: 1,
                  prompt: "تأطير الإشكالية: دور مختلف أنواع ARN في تركيب البروتين وتأثير المادة المُعطِّلة على الأورام السرطانية",
                  bacPrompt: "كيف تتدخل مختلف أنواع الـ ARN في تركيب البروتين، وما أثر مادة RIP على هذا التركيب؟",
                  ...RECON("Pas de question officielle autonome de type « حدد المشكل ». Reformulation pédagogique du préambule page 1."),
                  placeholder: "صياغة المشكل العلمي بدقة...",
                  minLength: 40,
                  modelAnswer: "المشكل العلمي: كيف تتدخل مختلف أنواع الـ ARN في تركيب البروتين، وما أثر تكسير الرابطة أدنين–ريبوز بمادة RIP على تكاثر الخلايا السرطانية؟",
                  rule: { prompt: "حدد المشكل العلمي حول دور أنواع ARN", keywords: [["الحمض", "ARN"], "الريبوزي", "النووي", "البروتين", ["تركيب", "اصطناع"]], minHits: 2, forbidden: [] }
                },
                S: {
                  points: 1,
                  prompt: "انتقاء المفاهيم: أنواع ARN المتواجدة في الهيولى خلال وخارج فترة تركيب البروتين",
                  bacPrompt: "اذكر مختلف أنواع الـ ARN المتواجدة في الهيولى خلال وخارج فترة تركيب البروتين.",
                  ...OFFICIAL(1, "Relecture visuelle du scan page 1 (Sujet 1). Verbe officiel : اذكر. Question 1 du التمرين الأول."),
                  placeholder: "رسول، ناقل، ريبوزومي، ريبوزوم، هيولى...",
                  minLength: 30,
                  modelAnswer: "خلال تركيب البروتين تتواجد في الهيولى ARN رسول وARN ناقل وARN ريبوزومي. خارج فترة التركيب يبقى أساسا ARN ناقل وARN ريبوزومي.",
                  rule: { prompt: "اذكر مختلف أنواع ARN", keywords: ["رسول", "ناقل", "ريبوزوم", "هيولي"], minHits: 2, forbidden: [] }
                },
                E: {
                  points: 2,
                  prompt: "هيكلة العرض السببي: دور كل نوع من ARN + أثر المادة المعطِّلة (كسر الرابطة أدنين–ريبوز)",
                  bacPrompt: "اشرح في نصٍ علميٍ دور مختلف أنواع الـ ARN في تركيب البروتين مبرزا تأثير مادة الـ RIP في علاج بعض الأورام السرطانية. (النص العلمي مُهيكل بمقدمة وعرض وخاتمة)",
                  ...OFFICIAL(1, "Relecture visuelle du scan page 1. Verbe officiel : اشرح. Question 2 du التمرين الأول."),
                  placeholder: "الـARN الرسول ينقل المعلومة، الـARN الناقل يحمل الأحماض الأمينية...",
                  minLength: 120,
                  modelAnswer: "ينقل ARN الرسول المعلومة الوراثية، وينقل ARN الناقل الأحماض الأمينية إلى الريبوزوم حيث يضمن ARN الريبوزومي الترجمة. تكسر مادة RIP الرابطة أدنين–ريبوز فتتوقف الاستطالة ويتوقف تكاثر الخلايا السرطانية.",
                  rule: { prompt: "اشرح دور أنواع ARN وأثر RIP", keywords: ["الرسول", "الناقل", "الريبوزوم", "الادنين", "السكر", "العرض"], minHits: 3, forbidden: [] }
                },
                W: {
                  points: 1,
                  prompt: "الخاتمة التركيبية: كيف يُثبِّط الدواء تكاثر الخلايا السرطانية",
                  bacPrompt: "كيف يُفضي تكسير الرابطة أدنين–ريبوز بمادة RIP إلى توقف تركيب البروتين وتثبيط تكاثر الخلايا السرطانية؟",
                  ...RECON("La question officielle est un texte scientifique unique (pôle E). Ce pôle isole pédagogiquement la clôture, ce n'est pas une question BAC autonome."),
                  placeholder: "الخاتمة كإجابة نهائية مختصرة...",
                  minLength: 40,
                  modelAnswer: "في الختام، بتكسير الرابطة أدنين–ريبوز يتوقف تركيب البروتين فتتوقف الخلايا السرطانية عن التكاثر.",
                  rule: { prompt: "اكتب خاتمة حول تأثير RIP", keywords: ["الانواع", "الثلاثه", "البروتين", "يتوقف"], minHits: 2, forbidden: [] }
                }
              }
            },
            {
              number: 2,
              ui: "text",
              label: "الطحالب الخضراء وثاني أكسيد الكربون",
              max: 7,
              desc: "بنية الصانعات الخضراء وآلية استغلال CO₂ عند الطحالب الطبيعية والطافرة (T.pseudonana)",
              poles: {
                N: {
                  points: 1,
                  prompt: "تأطير الإشكالية: العلاقة بين بنية الصانعات الخضراء وآلية استغلال CO₂ وتحويل الطاقة الضوئية",
                  bacPrompt: "ما العلاقة بين بنية الصانعات الخضراء وآلية استغلال CO₂ عند طحالب T.pseudonana؟",
                  ...RECON("Le préambule page 1-2 pose le cadre ; aucune question officielle autonome « حدد المشكل » pour ce pôle."),
                  placeholder: "المتغيرات والمشكل العلمي...",
                  minLength: 30,
                  modelAnswer: "المشكل العلمي: كيف تسمح البنية النسيجية للصانعة الخضراء (البيرينويد) باستغلال تراكيز منخفضة من CO₂؟",
                  rule: { prompt: "حدد العلاقة بين بنية الصانعات واستغلال CO2", keywords: ["الصانعات", "الخضراء", "اكسيد", "الكربون", "الضوئيه"], minHits: 2, forbidden: [] }
                },
                S: {
                  points: 2.5,
                  prompt: "مصفوفة استغلال الوثائق بالأرقام: مقارنة النمو بين النمط الطبيعي والطافر عند تراكيز CO₂ مختلفة",
                  bacPrompt: "حلّل نتائج الشكل(أ) من الوثيقة1.",
                  ...OFFICIAL(2, "Relecture visuelle page 2. Verbe officiel : حلّل. Question 1 du الجزء الأول."),
                  placeholder: "حلّل الشكل (أ): قارن بالتوازي النطبيعي والطافر...",
                  minLength: 90,
                  modelAnswer: "تمثل الوثيقة نسبة نمو النمط الطبيعي والطافر بدلالة تركيز HCO3⁻. نلاحظ نموا مرتفعا عند الطبيعي في التركيز المنخفض بينما ينخفض نمو الطافر، ومنه نستنتج أن النمط الطبيعي يستغل التراكيز المنخفضة بكفاءة أعلى.",
                  rule: { prompt: "حلل نتائج الشكل أ من الوثيقة 1", keywords: ["نمو", "طبيعي", "طافر", "التركيز", "نسبه"], minHits: 3, forbidden: ["بسبب"] }
                },
                E: {
                  points: 2.5,
                  prompt: "الربط السببي: دور أنزيم RUBISCO والبِرينويد والتيلاكوئيد في تثبيت CO₂ وتحويل الطاقة",
                  bacPrompt: "اشرح الآلية التي تسمح للطحالب T.P من النمط الطبيعي بتحويل الطاقة الضوئية في أوساط ذات تراكيز CO₂ منخفضة، وذلك باستغلالك لأشكال الوثيقة 2 ومكتسباتك.",
                  ...OFFICIAL(3, "Relecture visuelle page 3. Verbe officiel : اشرح. Question 1 après الوثيقة 2."),
                  placeholder: "يتشرب CO₂ من الوسط، أنزيم RUBISCO يثبّته على RuBP...",
                  minLength: 110,
                  modelAnswer: "يعود ذلك إلى تجميع HCO3⁻ في البيرينويد وتحويله إلى CO₂ بواسطة CA ثم تثبيته بأنزيم RUBISCO على RudIP مما يسمح بتحويل الطاقة الضوئية رغم انخفاض CO₂ الخارجي.",
                  rule: { prompt: "اشرح آلية تحويل الطاقة عند النمط الطبيعي", keywords: ["الانزيم", "تثبيت", "البيرينويد", "التيلاكوئيد", "الضوئيه"], minHits: 3, forbidden: [] }
                },
                W: {
                  points: 1,
                  prompt: "الاستخلاص: تبرير حماية الطحالب الطبيعية حفاظاً على البيئة البحرية",
                  bacPrompt: "برر تأكيد الباحثين على حماية الطحالب T.P الطبيعية حفاظا على البيئة البحرية، انطلاقا من الدراسة السابقة.",
                  ...OFFICIAL(3, "Relecture visuelle page 3. Verbe officiel : برر. Question 2 de clôture du التمرين الثاني."),
                  placeholder: "الطاقة الكيميائية الكامنة رغم انخفاض CO₂...",
                  minLength: 40,
                  modelAnswer: "في الختام يجب حماية الطحالب الطبيعية لأنها تثبّت CO₂ وتنتج O₂ وتحفظ توازن البيئة البحرية حتى عند انخفاض التركيز.",
                  rule: { prompt: "برر حماية الطحالب الطبيعية", keywords: ["حمایه", "تلوث", "اكسجين", "يثبت"], minHits: 2, forbidden: [] }
                }
              }
            },
            {
              number: 3,
              ui: "pipeline",
              label: "الأدينوزين، الكافيين والنشاط العصبي",
              max: 8,
              desc: "أثر Methylthéobromine (Mtb) على دور الأدينوزين (Ado) في النشاط العصبي (اليقظة/النوم)",
              poles: {
                N: {
                  points: 0.5,
                  prompt: "تأطير المسعى: ضبط المتغيرات (تركيز أدينوزين/كافيين، النشاط الدماغي)، وصياغة الفرضيتين",
                  bacPrompt: "اقترح فرضيتين حول آلية تأثير مادة الـ Mtb على دور الـ Ado في النشاط العصبي الخاص باليقظة والنوم باستغلالك لشكلي الوثيقة1 ومعلوماتك.",
                  ...OFFICIAL(4, "Relecture visuelle page 4. Verbe officiel : اقترح فرضيتين. Seule consigne chiffrée du الجزء الأول."),
                  minLength: 30,
                  modelAnswer: "الفرضية 1: يتنافس Mtb مع Ado على المستقبل A1R. الفرضية 2: يثبط Mtb إفراز Ado نفسه.",
                  rule: { prompt: "اقترح فرضيتين حول تأثير Mtb", keywords: ["فرضيه", "ادينوزين", "مستقبل"], minHits: 1, forbidden: [] }
                },
                S: {
                  points: 2.0,
                  prompt: "مصفوفة استغلال الوثيقة 1 (الشكل أ: النشاط العصبي / الشكل ب: شدة الارتباط بـ A1R) بالأرقام",
                  bacPrompt: "حلّل شكلي الوثيقة 1: نسبة النشاط العصبي الدماغي وشدة ارتباط Ado بـ A1R بدلالة تراكيز Ado و Mtb.",
                  ...RECON("Page 4 donne le tableau et la courbe mais la seule consigne écrite est « اقترح فرضيتين ». L'analyse chiffrée est une étape pédagogique, pas une question officielle autonome."),
                  minLength: 60,
                  modelAnswer: "نلاحظ انخفاض النشاط العصبي بارتفاع Ado عند المجموعة 1 أكثر من المجموعة 2، وانخفاض شدة الارتباط بارتفاع Mtb.",
                  rule: { prompt: "حلل الوثيقة 1 بالأرقام", keywords: ["نشاط", "ارتباط", "تركيز"], minHits: 2, forbidden: ["بسبب"] }
                },
                E: {
                  points: 4.0,
                  prompt: "الاستدلال: تتبّع سلسلة A1R → Gi/Go → قنوات K⁺/Ca²⁺ → إفراز النورإبينفرين (NE) مع المصادقة",
                  bacPrompt: "تأكد من صحة إحدى الفرضيتين المقترحتين باستغلالك لشكلي الوثيقة2 ومعلوماتك.",
                  ...OFFICIAL(5, "Relecture visuelle page 5. Verbe officiel : تأكد. Question 1 du الجزء الثاني."),
                  minLength: 80,
                  modelAnswer: "تتأكد الفرضية الأولى لأن Mtb ينافس Ado على A1R فلا تُفعَّل Gi/Go ويستمر تدفق Ca²⁺ فيتحرر NE وترتفع اليقظة.",
                  rule: { prompt: "تأكد من صحة الفرضية باستغلال الوثيقة 2", keywords: ["مستقبل", "نوريبنفرين", "كافيين"], minHits: 2, forbidden: [] }
                },
                W: {
                  points: 1.5,
                  prompt: "المصادقة والمخطط المقارن: الحالة الطبيعية (نقص اليقظة) مقابل وجود الكافيين (زيادة اليقظة)",
                  bacPrompt: "وضّح في مخطط كيف يؤدي تراكم الـ Ado إلى الشعور بالنعاس وتأثير استهلاك مادة Methylthéobromine (Mtb) على ذلك، بناءً على ما توصلت إليه من نتائج هذه الدراسة ومعلوماتك.",
                  ...OFFICIAL(5, "Relecture visuelle page 5. Verbe officiel : وضّح في مخطط. Consigne du الجزء الثالث."),
                  minLength: 0,
                  modelAnswer: "Ado → A1R → Gi/Go → انخفاض Ca²⁺ → انخفاض NE → نعاس. في وجود Mtb ينعكس المسار فترتفع اليقظة.",
                  rule: { prompt: "وضح في مخطط مسار Ado و Mtb", keywords: ["مخطط", "نعاس", "يقظه"], minHits: 1, forbidden: [] }
                }
              },
              blocksBank: [
                { id: "b1", text: "تشكل معقد (أدينوزين-A1R) على الغشاء", stream: 1, slot: 0 },
                { id: "b2", text: "تفعيل البروتينات الغشائية Gi و Go", stream: 1, slot: 1 },
                { id: "b3", text: "زيادة خروج K⁺ وتثبيط دخول شوارد Ca²⁺", stream: 1, slot: 2 },
                { id: "b4", text: "انخفاض إفراز المبلغ العصبي (NE)", stream: 1, slot: 3 },
                { id: "b5", text: "تنافس الكافيين على مستقبل A1R مع الأدينوزين", stream: 2, slot: 0 },
                { id: "b6", text: "عدم تفعيل البروتينات الغشائية Gi و Go", stream: 2, slot: 1 },
                { id: "b7", text: "زوال تثبيط Ca²⁺ واستمرار تدفقها", stream: 2, slot: 2 },
                { id: "b8", text: "تحرير المبلغ العصبي (NE) في الشق المشبكي", stream: 2, slot: 3 }
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
        {
          id: 2,
          pdf: "BAC2025_SVT_Sujet2.pdf",
          pdfAvailable: true,
          pdfNote: "PDF officiel fourni dans le dépôt (scan dzexams).",
          title: "الموضوع الثاني",
          exercises: [
            {
              number: 1,
              ui: "text",
              label: "التحلل السكري وطاقة الجلوكوز",
              max: 5,
              desc: "تحويل الطاقة الكيميائية الكامنة في جزيئة الجلوكوز إلى ATP خلال التحلل السكري + أثر 2-DG",
              poles: {
                N: {
                  points: 1,
                  prompt: "تأطير الإشكالية: كيف تُحَّول طاقة الجلوكوز خلال التحلل السكري وما أثر الدواء المُثبِّط للخطوة 1",
                  bacPrompt: "كيف تُحوَّل طاقة الجلوكوز خلال التحلل السكري وما أثر 2-Désoxyglucose على الخطوة 1؟",
                  ...RECON("Préambule page 6 (Sujet 2). Pas de question officielle autonome de type « حدد المشكل »."),
                  placeholder: "...",
                  minLength: 40,
                  modelAnswer: "المشكل العلمي: كيف تُحوَّل طاقة الجلوكوز إلى ATP خلال التحلل السكري، وما أثر تثبيط الخطوة 1 بـ 2-DG؟",
                  rule: { prompt: "حدد المشكل العلمي حول التحلل السكري", keywords: ["التحلل", "السكري", "الجلوكوز", "الطاقه"], minHits: 2, forbidden: [] }
                },
                S: {
                  points: 1,
                  prompt: "التعرف على المركبات (أ، ب، ج، د، هـ) في المخطط + كتابة المعادلة الإجمالية",
                  bacPrompt: "تعرّف على المركبات المشار إليها بالأحرف: A.B.C.D.D′",
                  ...OFFICIAL(6, "Relecture visuelle page 1 du sujet 2 (page 6 du PDF). Verbe officiel : تعرّف. Question 1."),
                  placeholder: "جلوكوز، فركتوز ثنائي الفوسفات، حمض البيروفيك...",
                  minLength: 40,
                  modelAnswer: "A و B مانحا/مستقبلا الفوسفات (ATP/ADP)، المركب الوسط فركتوز ثنائي الفوسفات، الناتج حمض البيروفيك، D/D′ NADH/NAD⁺.",
                  rule: { prompt: "تعرف على المركبات المشار إليها", keywords: ["حمض", "البيروفيك", "فركتوز", "جلوكوز"], minHits: 2, forbidden: [] }
                },
                E: {
                  points: 2,
                  prompt: "العرض السببي: تسلسل تفاعلات التحلل السكري وإنتاج ATP + أثر الدواء على الخطوة 1",
                  bacPrompt: "اشرح في نصٍ علميٍ مدعّم بمعادلة كيميائية إجمالية تفاعلات تحويل الطاقة الكيميائية الكامنة في جزيئة الغلوكوز خلال مرحلة التحلل السكري المشار إليها في الوثيقة وأثر مادة 2-Désoxyglucose على ذلك.",
                  ...OFFICIAL(6, "Relecture visuelle page 6. Verbe officiel : اشرح. Question 2 — texte scientifique structuré."),
                  placeholder: "الخطوة 1/الخطوة 2، أنزيم، ATP، البيروفيك...",
                  minLength: 120,
                  modelAnswer: "خلال التحلل السكري يُفسفر الغلوكوز ثم يُشق إلى جزيئتي حمض بيروفيك مع إنتاج صافٍ من ATP. يثبط 2-DG الإنزيم المنشط للخطوة 1 فيتوقف التحويل وتتوقف الخلايا السرطانية عن التكاثر.",
                  rule: { prompt: "اشرح تفاعلات التحلل السكري وأثر 2-DG", keywords: ["الخطوه", "انزيم", "فوسفات", "ثنائي", "الطاقه"], minHits: 3, forbidden: [] }
                },
                W: {
                  points: 1,
                  prompt: "الخاتمة: دور التحلل السكري في إنتاج الطاقة وتأثير الدواء على تكاثر الخلايا السرطانية",
                  bacPrompt: "ما النتيجة النهائية لتثبيط الخطوة 1 بـ 2-DG على الحصيلة الطاقوية وتكاثر الخلايا السرطانية؟",
                  ...RECON("La clôture est incluse dans le texte scientifique officiel (pôle E). Pas une question BAC autonome."),
                  placeholder: "...",
                  minLength: 40,
                  modelAnswer: "في الختام يتوقف إنتاج الطاقة القابلة للاستعمال فتتوقف الخلايا السرطانية عن التكاثر.",
                  rule: { prompt: "اكتب خاتمة حول أثر 2-DG", keywords: ["الطاقه", "يتوقف", "الخلایا", "تتكاثر"], minHits: 2, forbidden: [] }
                }
              }
            },
            {
              number: 2,
              ui: "text",
              label: "أنزيم SOD والتصلب الجانبي الضموري",
              max: 7,
              desc: "نشاط أنزيم SOD ضد أنواع الأكسجين التفاعلية (ROS) وعلاقته بتلف الخلايا العصبية الحركية في مرض ALS",
              poles: {
                N: {
                  points: 1,
                  prompt: "تأطير الإشكالية: آلية حماية أنزيم SOD للخلايا العصبية من ROS وعلاقته بمرض ALS",
                  bacPrompt: "كيف يحمي أنزيم SOD الخلايا العصبية الحركية من ROS وما علاقته بمرض ALS؟",
                  ...RECON("Préambule pages 6-7. Pas de question officielle autonome de cadrage."),
                  placeholder: "...",
                  minLength: 30,
                  modelAnswer: "المشكل العلمي: كيف يحمي SOD الخلايا العصبية من ROS، وما سبب الخلل عند المصاب بـ ALS؟",
                  rule: { prompt: "حدد المشكل العلمي حول SOD و ALS", keywords: ["الانزيم", "الاكسجين", "التفاعلي", "الخلايا", "العصبیه"], minHits: 2, forbidden: [] }
                },
                S: {
                  points: 2.5,
                  prompt: "تحليل الشكل (أ): نسبة نشاط SOD وتراكيز ROS ونسبة تلف الخلايا عند السليم والمصاب",
                  bacPrompt: "حلّل النتائج الممثّلة في الشكل(أ) من الوثيقة1.",
                  ...OFFICIAL(7, "Relecture visuelle page 7 (2e page du sujet 2). Verbe officiel : حلّل. Question 1."),
                  placeholder: "قارن بالتوازي: نشاط SOD، تراكيز ROS، تلف الخلايا...",
                  minLength: 90,
                  modelAnswer: "نلاحظ عند السليم نشاط SOD مرتفعا وROS وتلفا منخفضين، بينما عند المصاب ينخفض النشاط وترتفع ROS ونسبة التلف. ومنه نستنتج ارتباط التلف بانخفاض نشاط SOD.",
                  rule: { prompt: "حلل الشكل أ من الوثيقة 1", keywords: ["نشاط", "تراكيز", "تلف", "الخلايا", "سليم"], minHits: 3, forbidden: ["بسبب"] }
                },
                E: {
                  points: 2.5,
                  prompt: "الربط السببي: دور الموقع الفعّال وشوارد النحاس/الزّنك وسبب الخلل في وظيفة الأنزيم عند المصاب",
                  bacPrompt: "بيّن سبب الخلل في وظيفة الأنزيم SOD عند الشخص المصاب باستغلالك للشكل(ب) والمعلومة المستخلصة من الشكل(أ) من الوثيقة1.",
                  ...OFFICIAL(7, "Relecture visuelle page 7. Verbe officiel : بيّن. Question 2."),
                  placeholder: "الموقع الفعّال، النحاس، الزنك، طفرة/خلل...",
                  minLength: 110,
                  modelAnswer: "يعود الخلل إلى تغير بقايا الموقع الفعال فلا تُثبَّت شوارد النحاس/الزنك فيفقد الإنزيم قدرته على تحويل O₂⁻.",
                  rule: { prompt: "بين سبب الخلل في وظيفة SOD", keywords: ["الموقع", "الفعال", "النحاس", "الزنك", "خلل"], minHits: 3, forbidden: [] }
                },
                W: {
                  points: 1,
                  prompt: "التبرير: استعمال (SOD) كدواء لعلاج ALS واقتراح علاج آخر",
                  bacPrompt: "برّر استعمال EDA كدواء لعلاج التصلّب الجانبي الضموري ALS باستغلالك لأشكال الوثيقة2 ومعلوماتك.",
                  ...OFFICIAL(8, "Relecture visuelle page 8. Verbe officiel : برّر. Question 1 après الوثيقة 2."),
                  placeholder: "...",
                  minLength: 40,
                  modelAnswer: "EDA يلتقط O₂⁻ ويعوّض نقص SOD فتنخفض السمية ويتراجع تلف الخلايا العصبية الحركية.",
                  rule: { prompt: "برر استعمال EDA كدواء لـ ALS", keywords: ["علاج", "اكسده", "سميه", "اقترح"], minHits: 2, forbidden: [] }
                }
              }
            },
            {
              number: 3,
              ui: "text",
              label: "زمر الدم والتسامح المناعي",
              max: 8,
              desc: "منظومة الزمر ABO، نقل الدم وقبول/رفض المتبرّع، والتسامح المناعي (نقل بين الزمرتين A و O)",
              poles: {
                N: {
                  points: 1,
                  prompt: "تأطير الإشكالية: آلية تحقيق التسامح المناعي عند نقل الدم من مانح زمرته A إلى مستقل زمرته O",
                  bacPrompt: "اقترح فرضية حول الآلية المستخدمة لتحقيق التسامح المناعي عند نقل الدم من مانح زمرته A إلى مستقبل زمرته O باستغلالك لشكلي الوثيقة1 ومعلوماتك.",
                  ...OFFICIAL(9, "Relecture visuelle page 9. Verbe officiel : اقترح فرضية. Consigne unique du الجزء الأول."),
                  placeholder: "...",
                  minLength: 30,
                  modelAnswer: "نفترض أن تحويلا إنزيميا للمستضد A إلى مستضد H يلغي التعرف بالـ anti-A فيصبح النقل آمنا.",
                  rule: { prompt: "اقترح فرضية حول التسامح المناعي", keywords: ["الزمر", "المستضد", "الاجسام", "المضاده"], minHits: 2, forbidden: [] }
                },
                S: {
                  points: 2.5,
                  prompt: "استغلال الشكل (أ): شدة انحلال خلايا الدم الحمراء (هيموغلوبين/بيليروبين) وزمرة وكمية الدم",
                  bacPrompt: "استغل شكلي الوثيقة 1: شدة انحلال خلايا الدم الحمراء وكميات الهيموغلوبين والبيليروبين حسب الزمرة المنقولة.",
                  ...RECON("Page 9 présente le tableau et la courbe ; la seule consigne écrite est « اقترح فرضية ». L'exploitation chiffrée est pédagogique."),
                  placeholder: "حلّل العمليتين وقارن بالتوازي...",
                  minLength: 90,
                  modelAnswer: "نلاحظ ارتفاع الهيموغلوبين والبيليروبين عند نقل الزمرة A إلى O مقارنة بالعكس، مما يدل على انحلال أقوى.",
                  rule: { prompt: "حلل الشكل أ حول انحلال الدم", keywords: ["انحلال", "هيموغلوبين", "بيليروبين", "زمري"], minHits: 3, forbidden: ["بسبب"] }
                },
                E: {
                  points: 2.5,
                  prompt: "الفرضية والربط: دور الجسم المضاد anti-A/anti-B ونشاط الأنزيم المُعدَّل وراثياً (تحويل المستضد)",
                  bacPrompt: "ناقش صحة الفرضية المقترحة باستغلالك لشكلي الوثيقة2.",
                  ...OFFICIAL(10, "Relecture visuelle page 10. Verbe officiel : ناقش. Question 1 du الجزء الثاني."),
                  placeholder: "فرضية حول آلية التحمل المناعي + دور الأنزيم...",
                  minLength: 110,
                  modelAnswer: "تتأكد الفرضية لأن الإنزيم NAGA يزيل السكر الطرفي للمستضد A فيختفي التعرف بـ anti-A ولا يحدث انحلال.",
                  rule: { prompt: "ناقش صحة الفرضية باستغلال الوثيقة 2", keywords: ["فرضیه", "انزیم", "مستضد", "الاجسام", "التحول"], minHits: 3, forbidden: [] }
                },
                W: {
                  points: 2,
                  prompt: "الاستخلاص: كيف يُحقَّق التسامح المناعي لنقل آمن بين الزمرتين",
                  bacPrompt: "وضّح في فقرة علمية الخطوات التي اتّبعها الباحثون في تحقيق التسامح المناعي عند نقل الدم من شخص زمرته A إلى آخر زمرته O من خلال ما توصلت إليه من هذه الدراسة ومعارفك.",
                  ...OFFICIAL(10, "Relecture visuelle page 10. Verbe officiel : وضّح في فقرة علمية. Consigne du الجزء الثالث."),
                  placeholder: "التسامح المناعي: إمكانية نقل الدم بين الزمرتين...",
                  minLength: 40,
                  modelAnswer: "في الختام يتحقق التسامح بتحويل المستضد A إنزيميا إلى شكل غير متعرف عليه من anti-A فيصبح النقل آمنا.",
                  rule: { prompt: "وضح فقرة علمية حول التسامح المناعي", keywords: ["التسامح", "المناعي", "مانح", "مستقبل"], minHits: 2, forbidden: [] }
                }
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
      enabled: true,
      sujets: [
        {
          id: 1,
          pdf: null,
          pdfAvailable: false,
          pdfExternalUrl: "https://eddirasa.com/wp-content/uploads/2024/06/bac-sc-sciences-2024.pdf",
          pdfNote: "PDF non redistribué dans le dépôt ; source: https://eddirasa.com/bac-science-2024-se/ (consulté 2026-08-23). Miroir dzexams: https://www.dzexams.com/ar/annales/bkVXVzlvRTlpV1RMYUk5cGNyS3oxdz09. Session de remplacement non localisée. Texte des questions : reconstructed (PDF distant non extrait dans cette session, SSL sortant en échec).",
          title: "الموضوع الأول",
          exercises: [
            {
              number: 1,
              ui: "text",
              label: "إندولمايسين وتنشيط الأحماض الأمينية",
              max: 5,
              desc: "تأثير المضاد الحيوي إندولمايسين في تثبيط تنشيط الأحماض الأمينية وتركيب البروتين لدى البكتيريا",
              poles: {
                N: {
                  points: 1,
                  prompt: "تأطير المشكل العلمي حول تأثير إندولمايسين على تنشيط الأحماض الأمينية",
                  bacPrompt: "حدد المشكل العلمي الدقيق حول كيفية تأثير المضاد الحيوي إندولمايسين في تثبيط تنشيط الأحماض الأمينية وتركيب البروتين لدى البكتيريا.",
                  ...RECON("Wording repris du banc de tests du dépôt (BAC 2024 / S1 / E1). Non relu sur le PDF ministériel dans cette session."),
                  placeholder: "صغ المشكل بعلامة ؟",
                  minLength: 40,
                  modelAnswer: "المشكل العلمي: كيف يؤثر المضاد الحيوي إندولمايسين في تثبيط تنشيط الأحماض الأمينية وتركيب البروتين لدى البكتيريا؟",
                  rule: {
                    prompt: "حدد المشكل العلمي حول تأثير إندولمايسين",
                    modelAnswer: "كيف يؤثر المضاد الحيوي إندولمايسين في تثبيط تنشيط الأحماض الأمينية وتركيب البروتين لدى البكتيريا؟",
                    keywords: [["اندولمايسين", "إندولمايسين"], ["احماض", "الأحماض"], "امينيه", "بروتين", "تنشيط"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                S: {
                  points: 1,
                  prompt: "استخراج معطيات السند المتعلقة بمرحلة التنشيط",
                  bacPrompt: "استخرج من الوثيقة مراحل تنشيط الأحماض الأمينية والعناصر المتدخلة.",
                  ...RECON("Reconstruction pédagogique 2024 — non certifiée PDF."),
                  placeholder: "ARNt، إنزيم، حمض أميني...",
                  minLength: 40,
                  modelAnswer: "تمثل الوثيقة مرحلة التنشيط حيث يرتبط كل حمض أميني بـ ARNt الموافق بوساطة إنزيم نوعي.",
                  rule: { prompt: "استخرج مراحل تنشيط الأحماض الأمينية", keywords: ["ARNt", "انزيم", "حمض", "امينيه"], minHits: 2, forbidden: ["بسبب"] }
                },
                E: {
                  points: 2,
                  prompt: "تفسير آلية تثبيط الموقع الفعال بالإندولمايسين",
                  bacPrompt: "فسّر كيف يمنع إندولمايسين تشكل aminoacyl-ARNt.",
                  ...RECON("Reconstruction pédagogique 2024 — non certifiée PDF."),
                  placeholder: "الموقع الفعال، تثبيط، ترجمة...",
                  minLength: 110,
                  modelAnswer: "يعود ذلك إلى ارتباط إندولمايسين بالموقع الفعال للإنزيم المنشط مما يمنع تشكل aminoacyl-ARNt فتتوقف الترجمة.",
                  rule: { prompt: "فسر آلية تأثير إندولمايسين", keywords: ["موقع", "فعال", "اندولمايسين", "ترجمه"], minHits: 2, forbidden: [] }
                },
                W: {
                  points: 1,
                  prompt: "نص علمي حول أهمية مرحلة التنشيط",
                  bacPrompt: "اكتب نصا علميا منظما حول أهمية مرحلة التنشيط في سلامة التعبير المورثي.",
                  ...RECON("Wording aligné sur le banc de tests (BAC 2024 / S1 / E1 / W). Non relu PDF."),
                  placeholder: "مقدمة، عرض، خاتمة...",
                  minLength: 80,
                  modelAnswer: "تمثل مرحلة التنشيط خطوة نوعية أساسية في سلامة التعبير المورثي، إذ تسمح بربط كل حمض أميني بـ ARNt الموافق له بوساطة إنزيم نوعي. وأي تثبيط للموقع الفعال كما يحدث بالإندولمايسين يمنع تشكل aminoacyl-ARNt ويشل الترجمة، مما يؤدي إلى غياب البروتينات وموت الخلية.",
                  rule: {
                    prompt: "اكتب نصا علميا حول أهمية مرحلة التنشيط",
                    modelAnswer: "مقدمة: تعد مرحلة التنشيط خطوة نوعية. عرض: يرتبط الحمض الأميني بـ ARNt. خاتمة: التثبيط يوقف الترجمة.",
                    keywords: ["تنشيط", "ARNt", "حمض", "توافق", "انزيم", "ترجمه", "اندولمايسين"],
                    minHits: 5,
                    minLength: 70,
                    forbidden: []
                  }
                }
              }
            },
            {
              number: 2,
              ui: "text",
              label: "تمرين 2 — في انتظار إعادة قراءة PDF 2024",
              max: 7,
              desc: "Exercice 2 du sujet 1 (2024) : consigne officielle non relue dans cette session.",
              poles: {
                N: { points: 1, prompt: "تأطير المطلوب للتمرين 2 (بانتظار PDF).", bacPrompt: "حدد المطلوب الرسمي للتمرين 2 بعد إعادة قراءة المصدر الخارجي.", ...RECON("2024 S1 E2 : consigne officielle non relue."), placeholder: "...", minLength: 30, modelAnswer: "يُستكمل بعد استخراج نص السؤال.", rule: { prompt: "حدد المطلوب", keywords: ["مطلوب"], minHits: 1, forbidden: [] } },
                S: { points: 2.5, prompt: "استغلال سندات التمرين 2 (بانتظار PDF).", bacPrompt: "حلّل سندات التمرين 2 بعد توفير النص الرسمي.", ...RECON("2024 S1 E2 non relu."), placeholder: "...", minLength: 40, modelAnswer: "يُستكمل بعد استخراج النص.", rule: { prompt: "حلل السند", keywords: ["سند"], minHits: 1, forbidden: ["بسبب"] } },
                E: { points: 2.5, prompt: "تفسير آلية التمرين 2 (بانتظار PDF).", bacPrompt: "فسّر آلية التمرين 2 بعد توفير النص الرسمي.", ...RECON("2024 S1 E2 non relu."), placeholder: "...", minLength: 40, modelAnswer: "يُستكمل بعد استخراج النص.", rule: { prompt: "فسر الآلية", keywords: ["اليه"], minHits: 1, forbidden: [] } },
                W: { points: 1, prompt: "خلاصة التمرين 2 (بانتظار PDF).", bacPrompt: "استخلص جواب التمرين 2 بعد توفير النص الرسمي.", ...RECON("2024 S1 E2 non relu."), placeholder: "...", minLength: 30, modelAnswer: "يُستكمل بعد استخراج النص.", rule: { prompt: "استخلص الجواب", keywords: ["خلاصه"], minHits: 1, forbidden: [] } }
              }
            },
            {
              number: 3,
              ui: "pipeline",
              label: "المناعة الخلطية والخلوية",
              max: 8,
              desc: "مساران متوازيان للاستجابة المناعية: خلطية (أجسام مضادة) وخلوية (LT)",
              poles: {
                N: {
                  points: 0.5,
                  prompt: "تأطير مساري الاستجابة المناعية ضد المستضد الفيروسي",
                  bacPrompt: "حدد عناصر الدراسة في الاستجابة المناعية الخلطية والخلوية.",
                  ...RECON("Reconstruction 2024 pour le pipeline d'immunité du banc de tests. Non certifiée PDF."),
                  minLength: 30,
                  modelAnswer: "المتغير المستقل: نوع المستضد / المتغير التابع: شدة الاستجابة الخلطية أو الخلوية.",
                  rule: { prompt: "حدد عناصر الدراسة المناعية", keywords: ["مستضد", "مناعه"], minHits: 1, forbidden: [] }
                },
                S: {
                  points: 2.0,
                  prompt: "استغلال سندات تشكل المعقدات المناعية",
                  bacPrompt: "استخرج من الوثيقة شروط تشكل المعقدات المناعية.",
                  ...RECON("Reconstruction 2024 — non certifiée PDF."),
                  minLength: 60,
                  modelAnswer: "نلاحظ تشكل أقواس ترسيب عند تلاقي الجسم المضاد والمستضد النوعي.",
                  rule: { prompt: "استخرج شروط تشكل المعقدات", keywords: ["معقد", "جسم", "مضاد"], minHits: 2, forbidden: ["بسبب"] }
                },
                E: {
                  points: 4.0,
                  prompt: "تفسير كيفية تشكل المعقدات المناعية وتعطيل الفيروس",
                  bacPrompt: "بين كيفية تشكل المعقدات المناعية ودور القطعة Fc في تسهيل البلعمة.",
                  ...RECON("Wording aligné sur le banc de tests (BAC 2024 / S1 / E3 / E). Non relu PDF."),
                  minLength: 80,
                  modelAnswer: "ترتبط الأجسام المضادة نوعياً بمحددات المستضد الفيروسي عبر مواقعها المتغيرة فتتشكل معقدات مناعية تعطل تثبته على الخلايا، كما تسهل البلعمة بارتباط القطعة Fc بمستقبلات البالعات الكبيرة. ثم يوجه المعقد نحو البالعات بالانسونين.",
                  rule: {
                    prompt: "فسّر آلية تشكل المعقدات المناعية ودور القطعة Fc",
                    modelAnswer: "ترتبط الأجسام المضادة نوعياً بمحددات المستضد الفيروسي عبر مواقعها المتغيرة فتتشكل معقدات مناعية تعطل تثبته على الخلايا، كما تسهل البلعمة بارتباط القطعة Fc بمستقبلات البالعات الكبيرة. ثم يوجه المعقد نحو البالعات بالانسونين.",
                    keywords: ["يوجه", "انسونين", "اجسام", "مضاده", "مستضد", "معقد", "بلعمه"],
                    minHits: 7,
                    forbidden: []
                  }
                },
                W: {
                  points: 1.5,
                  prompt: "مخطط مقارن للمسار الخلطي والمسار الخلوي",
                  bacPrompt: "أنجز مخططا مقارنا للمسار الخلطي والمسار الخلوي.",
                  ...RECON("Reconstruction 2024 — non certifiée PDF."),
                  minLength: 0,
                  modelAnswer: "خلطي: LB → بلازمية → جسم مضاد. خلوي: LT → سامة → قتل الخلية المصابة.",
                  rule: { prompt: "انجز مخطط المسارين المناعيين", keywords: ["خلطي", "خلوي"], minHits: 1, forbidden: [] }
                }
              },
              blocksBank: [
                { id: "b1", text: "تعرف LB على المستضد النوعي", stream: 1, slot: 0 },
                { id: "b2", text: "تكاثر وتمايز إلى بلازميات", stream: 1, slot: 1 },
                { id: "b3", text: "إفراز أجسام مضادة نوعية", stream: 1, slot: 2 },
                { id: "b4", text: "تشكل معقدات مناعية وتعطيل الفيروس", stream: 1, slot: 3 },
                { id: "b5", text: "تعرف LT على الخلية المصابة", stream: 2, slot: 0 },
                { id: "b6", text: "تفعيل LT السامة", stream: 2, slot: 1 },
                { id: "b7", text: "إفراز البرفورين والغرانيزيم", stream: 2, slot: 2 },
                { id: "b8", text: "قتل الخلية المصابة بالفيروس", stream: 2, slot: 3 }
              ],
              streams: [
                { id: 1, title: "المسار 1: الاستجابة الخلطية", theme: "rose",
                  slots: ["تعرف LB", "التمايز", "الأجسام المضادة", "المعقد المناعي"] },
                { id: 2, title: "المسار 2: الاستجابة الخلوية", theme: "emerald",
                  slots: ["تعرف LT", "التفعيل", "وسائط سامة", "قتل الخلية"] }
              ]
            }
          ]
        },
        {
          id: 2,
          pdf: null,
          pdfAvailable: false,
          pdfExternalUrl: "https://eddirasa.com/wp-content/uploads/2024/06/bac-sc-sciences-2024.pdf",
          pdfNote: "PDF non redistribué dans le dépôt ; source: https://eddirasa.com/bac-science-2024-se/ (consulté 2026-08-23). Même fichier session normale (sujets 1 et 2). Texte reconstructed.",
          title: "الموضوع الثاني",
          exercises: [
            {
              number: 1,
              ui: "text",
              label: "تركيب ATP في الميتوكوندريا",
              max: 5,
              desc: "التدرج البروتوني وعمل الكرية المذنبة في تركيب ATP داخل الميتوكوندريا",
              poles: {
                N: {
                  points: 1,
                  prompt: "تأطير المشكل العلمي حول تركيب ATP داخل الميتوكوندريا",
                  bacPrompt: "حدد المشكل العلمي: كيف يتم تركيب ATP داخل الميتوكوندريا بفضل التدرج البروتوني وعمل الكرية المذنبة؟",
                  ...RECON("Wording repris du banc de tests (BAC 2024 / S2 / E1 / N). Non relu PDF."),
                  placeholder: "صغ المشكل بعلامة ؟",
                  minLength: 40,
                  modelAnswer: "كيف يتم تركيب ATP داخل الميتوكوندريا بفضل التدرج البروتوني وعمل الكرية المذنبة، وما أثر تثبيط هذه الآلية على الحصيلة الطاقوية؟",
                  rule: {
                    prompt: "حدد المشكل العلمي حول تركيب ATP",
                    modelAnswer: "كيف يتم تركيب ATP داخل الميتوكوندريا بفضل التدرج البروتوني؟",
                    keywords: ["ATP", "ميتوكوندريا", "تدرج", "بروتوني", "كريه"],
                    minHits: 3,
                    forbidden: []
                  }
                },
                S: {
                  points: 1,
                  prompt: "استخراج شروط تركيب ATP من الوثيقة",
                  bacPrompt: "استخرج شروط تركيب ATP انطلاقاً من معطيات التجربة.",
                  ...RECON("Wording repris du banc de tests (BAC 2024 / S2 / E1 / S). Non relu PDF."),
                  placeholder: "ADP، Pi، تدرج بروتوني...",
                  minLength: 40,
                  modelAnswer: "تمثل الوثيقة شروط تركيب ATP، حيث نلاحظ أنه يركب فقط عند توفر ADP وPi ووجود تدرج بروتوني بين الفراغ بين الغشائين والحشوة، ومنه نستنتج أن التدرج البروتوني شرط أساسي يحرك الكرية المذنبة.",
                  rule: {
                    prompt: "حلل نتائج الوثيقة المتعلقة بشروط تركيب ATP",
                    modelAnswer: "يركب ATP فقط بوجود ADP و Pi وتدرج بروتوني.",
                    keywords: ["ADP", "Pi", ["تدرج بروتوني", "التدرج البروتوني"], "ATP", "كريه"],
                    minHits: 4,
                    forbidden: ["بسبب"]
                  }
                },
                E: {
                  points: 2,
                  prompt: "تفسير دور التدرج البروتوني والكرية المذنبة",
                  bacPrompt: "فسّر كيف يحرك التدرج البروتوني الكرية المذنبة لتركيب ATP.",
                  ...RECON("Reconstruction 2024 — non certifiée PDF."),
                  placeholder: "تدفق H+، كرية مذنبة، فسفرة...",
                  minLength: 110,
                  modelAnswer: "يعود تركيب ATP إلى عودة البروتونات عبر الكرية المذنبة مما يوفر طاقة ربط Pi على ADP.",
                  rule: { prompt: "فسر آلية الكرية المذنبة", keywords: ["كريه", "تدرج", "ATP"], minHits: 2, forbidden: [] }
                },
                W: {
                  points: 1,
                  prompt: "خلاصة حول الحصيلة الطاقوية",
                  bacPrompt: "استخلص أثر تثبيط التدرج البروتوني على الحصيلة الطاقوية.",
                  ...RECON("Reconstruction 2024 — non certifiée PDF."),
                  placeholder: "في الختام...",
                  minLength: 40,
                  modelAnswer: "في الختام، بدون تدرج بروتوني تتوقف الكرية المذنبة فتنهار الحصيلة الطاقوية.",
                  rule: { prompt: "استخلص أثر التثبيط على الحصيلة", keywords: ["حصيله", "ATP", "تثبيط"], minHits: 2, forbidden: [] }
                }
              }
            }
          ]
        }
      ]
    },
    {
      id: "2023",
      label: "بكالوريا الجزائر دورة 2023",
      badge: "تدريب منهجي",
      theme: "amber",
      enabled: false,
      loadingNote: "Sujets 2023 non extraits au 2026-08-23 — page dzexams localisée (https://www.dzexams.com/ar/annales/STRDZEowcCtwN0JmT1NwS3p4cEVmdz09) mais PDF distant inaccessible (SSL sortant en échec) ; aucun texte de question relu. Session de remplacement non localisée.",
      sujets: []
    }
  ]
};
