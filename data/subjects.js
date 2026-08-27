/* ============================================================
   CONFIGURATION DATA-DRIVEN  (BAC SVT Algérie)
   ------------------------------------------------------------
   2025 : consignes confrontées au PDF scanné du dépôt
          (rendu visuel page par page, 2026-08-23).
   2024 : exercices reconstruits à partir du banc de tests du
          dépôt — PDF officiel non relu ici (texte distant bruité).
   2023 : consignes lues sur le PDF dzexams (couche texte inversée,
          reconstituée mot à mot, 2026-08-25).
   ============================================================ */

/** Normalisation du texte arabe : variantes, tatweel, ponctuation. */
export function normalizeArabic(text) {
  if (!text) return "";
  return String(text)
    .replace(/[إأآاٱ]/g, "ا")
    .replace(/[ىيی]/g, "ي")
    .replace(/ک/g, "ك")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[ًٌٍَُِّْ]/g, "")
    .replace(/\u0640/g, "")
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/٫/g, ".")
    .replace(/[\u00A0\u200B\u200C\u200D\uFEFF]/g, " ")
    .replace(/[؟?!.,،؛:«»"“”‘’()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
  // NOTE délibérée : le hamza isolé ء n'est PAS supprimé — le retirer fusionnerait
  // ماء (eau) avec ما (particule) et créerait des faux positifs. Ne pas "compléter"
  // cette normalisation sans un cas d'échec réel documenté.
}

/** Retire les préfixes / clitiques arabes les plus fréquents. */
export function stripArabicClitics(word) {
  if (!word) return "";
  const t = normalizeArabic(word);
  if (/^(كال|بال|فال|وال|لل)/.test(t)) return t.replace(/^(كال|بال|فال|وال|لل)/, "");
  if (/^ال/.test(t)) return t.replace(/^ال/, "");
  return t.replace(/^[كبفول]/, "");
}

const OFFICIAL = (page, notes, verifiedAt = "2026-08-23") => ({
  bacPromptSource: "official",
  bacPromptPage: page,
  bacPromptVerifiedAt: verifiedAt,
  bacPromptNotes: notes
});

const RECON = (notes) => ({
  bacPromptSource: "reconstructed",
  bacPromptNotes: notes
});

export const APP_CONFIG = {
  appTitle: "بوصلة كنز المنهجية 4D",
  appSubtitle: "مخبر التفوق والهدوء | منصة تدريب منهجي لبكالوريا علوم الطبيعة والحياة",
  globalExamMinutes: 270,
  strategyMinutes: 25,
  note: "المحتوى 2025 مُراجع على PDF المستودع. 2024 مُعاد بناؤه ولم يُعاد استخراج نصه من PDF وزاري في هذه الجلسة. 2023 مُستخرج من PDF dzexams (نص معكوس مُعاد بناؤه).",
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
                  prompt:
                    "تأطير الإشكالية: دور مختلف أنواع ARN في تركيب البروتين وتأثير المادة المُعطِّلة على الأورام السرطانية",
                  bacPrompt:
                    "كيف تتدخل مختلف أنواع الـ ARN في تركيب البروتين، وما أثر مادة RIP على هذا التركيب؟",
                  ...RECON(
                    "Pas de question officielle autonome de type « حدد المشكل ». Reformulation pédagogique du préambule page 1."
                  ),
                  placeholder: "صياغة المشكل العلمي بدقة...",
                  minLength: 40,
                  modelAnswer:
                    "المشكل العلمي: كيف تتدخل مختلف أنواع الـ ARN في تركيب البروتين، وما أثر تكسير الرابطة أدنين–ريبوز بمادة RIP على تكاثر الخلايا السرطانية؟",
                  rule: {
                    prompt: "حدد المشكل العلمي حول دور أنواع ARN",
                    keywords: [["الحمض", "ARN"], "الريبوزي", "النووي", "البروتين", ["تركيب", "اصطناع"]],
                    minHits: 2,
                    forbidden: []
                  }
                },
                S: {
                  points: 1,
                  prompt: "انتقاء المفاهيم: أنواع ARN المتواجدة في الهيولى خلال وخارج فترة تركيب البروتين",
                  bacPrompt: "اذكر مختلف أنواع الـ ARN المتواجدة في الهيولى خلال وخارج فترة تركيب البروتين.",
                  ...OFFICIAL(
                    1,
                    "Relecture visuelle du scan page 1 (Sujet 1). Verbe officiel : اذكر. Question 1 du التمرين الأول."
                  ),
                  placeholder: "رسول، ناقل، ريبوزومي، ريبوزوم، هيولى...",
                  minLength: 30,
                  modelAnswer:
                    "خلال تركيب البروتين تتواجد في الهيولى ARN رسول وARN ناقل وARN ريبوزومي. خارج فترة التركيب يبقى أساسا ARN ناقل وARN ريبوزومي.",
                  rule: {
                    prompt: "اذكر مختلف أنواع ARN",
                    keywords: ["رسول", "ناقل", "ريبوزوم", "هيولي"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                E: {
                  points: 2,
                  prompt:
                    "هيكلة العرض السببي: دور كل نوع من ARN + أثر المادة المعطِّلة (كسر الرابطة أدنين–ريبوز)",
                  bacPrompt:
                    "اشرح في نصٍ علميٍ دور مختلف أنواع الـ ARN في تركيب البروتين مبرزا تأثير مادة الـ RIP في علاج بعض الأورام السرطانية. (النص العلمي مُهيكل بمقدمة وعرض وخاتمة)",
                  ...OFFICIAL(
                    1,
                    "Relecture visuelle du scan page 1. Verbe officiel : اشرح. Question 2 du التمرين الأول."
                  ),
                  placeholder: "الـARN الرسول ينقل المعلومة، الـARN الناقل يحمل الأحماض الأمينية...",
                  minLength: 120,
                  modelAnswer:
                    "ينقل ARN الرسول المعلومة الوراثية، وينقل ARN الناقل الأحماض الأمينية إلى الريبوزوم حيث يضمن ARN الريبوزومي الترجمة. تكسر مادة RIP الرابطة أدنين–ريبوز فتتوقف الاستطالة ويتوقف تكاثر الخلايا السرطانية.",
                  rule: {
                    prompt: "اشرح دور أنواع ARN وأثر RIP",
                    keywords: ["الرسول", "الناقل", "الريبوزوم", "الادنين", "السكر", "العرض"],
                    minHits: 3,
                    forbidden: [],
                    wrongConcepts: ["SOD", "RUBISCO"]
                  }
                },
                W: {
                  points: 1,
                  prompt: "الخاتمة التركيبية: كيف يُثبِّط الدواء تكاثر الخلايا السرطانية",
                  bacPrompt:
                    "كيف يُفضي تكسير الرابطة أدنين–ريبوز بمادة RIP إلى توقف تركيب البروتين وتثبيط تكاثر الخلايا السرطانية؟",
                  ...RECON(
                    "La question officielle est un texte scientifique unique (pôle E). Ce pôle isole pédagogiquement la clôture, ce n'est pas une question BAC autonome."
                  ),
                  placeholder: "الخاتمة كإجابة نهائية مختصرة...",
                  minLength: 40,
                  modelAnswer:
                    "في الختام، بتكسير الرابطة أدنين–ريبوز يتوقف تركيب البروتين فتتوقف الخلايا السرطانية عن التكاثر.",
                  rule: {
                    prompt: "اكتب خاتمة حول تأثير RIP",
                    keywords: ["الانواع", "الثلاثه", "البروتين", "يتوقف"],
                    minHits: 2,
                    forbidden: []
                  }
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
                  prompt:
                    "تأطير الإشكالية: العلاقة بين بنية الصانعات الخضراء وآلية استغلال CO₂ وتحويل الطاقة الضوئية",
                  bacPrompt: "ما العلاقة بين بنية الصانعات الخضراء وآلية استغلال CO₂ عند طحالب T.pseudonana؟",
                  ...RECON(
                    "Le préambule page 1-2 pose le cadre ; aucune question officielle autonome « حدد المشكل » pour ce pôle."
                  ),
                  placeholder: "المتغيرات والمشكل العلمي...",
                  minLength: 30,
                  modelAnswer:
                    "المشكل العلمي: كيف تسمح البنية النسيجية للصانعة الخضراء (البيرينويد) باستغلال تراكيز منخفضة من CO₂؟",
                  rule: {
                    prompt: "حدد العلاقة بين بنية الصانعات واستغلال CO2",
                    keywords: ["الصانعات", "الخضراء", "اكسيد", "الكربون", "الضوئيه"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                S: {
                  points: 2.5,
                  prompt:
                    "مصفوفة استغلال الوثائق بالأرقام: مقارنة النمو بين النمط الطبيعي والطافر عند تراكيز CO₂ مختلفة",
                  bacPrompt: "حلّل نتائج الشكل(أ) من الوثيقة1.",
                  ...OFFICIAL(
                    2,
                    "Relecture visuelle page 2. Verbe officiel : حلّل. Question 1 du الجزء الأول. Consigne page 2 « أبرز أثر الخصائص البنيوية… » non mappée (un pôle = une consigne)."
                  ),
                  placeholder: "حلّل الشكل (أ): قارن بالتوازي النطبيعي والطافر...",
                  minLength: 90,
                  modelAnswer:
                    "تمثل الوثيقة نسبة نمو النمط الطبيعي والطافر بدلالة تركيز HCO3⁻. نلاحظ نموا مرتفعا عند الطبيعي في التركيز المنخفض بينما ينخفض نمو الطافر، ومنه نستنتج أن النمط الطبيعي يستغل التراكيز المنخفضة بكفاءة أعلى.",
                  rule: {
                    prompt: "حلل نتائج الشكل أ من الوثيقة 1",
                    keywords: ["نمو", "طبيعي", "طافر", "التركيز", "نسبه"],
                    minHits: 3,
                    forbidden: ["بسبب"],
                    document: {
                      kind: "curve",
                      axes: ["نمو", "تركيز"],
                      comparisons: [["طبيعي", "طافر"]],
                      trends: [
                        { about: "طبيعي", expect: ["مرتفع", "نمو"] },
                        { about: "طافر", expect: ["ينخفض", "منخفض"] }
                      ],
                      domains: [
                        { about: "طبيعي", expect: ["مرتفع", "منخفض"] },
                        { about: "طافر", expect: ["ينخفض", "منخفض"] }
                      ],
                      relations: [{ type: "parallel", a: "طبيعي", b: "طافر" }],
                      values: ["منخفض", "مرتفع", "نسبه"],
                      strictValues: true
                    }
                  }
                },
                E: {
                  points: 2.5,
                  prompt:
                    "الربط السببي: دور أنزيم RUBISCO والبِرينويد والتيلاكوئيد في تثبيت CO₂ وتحويل الطاقة",
                  bacPrompt:
                    "اشرح الآلية التي تسمح للطحالب T.P من النمط الطبيعي بتحويل الطاقة الضوئية في أوساط ذات تراكيز CO₂ منخفضة، وذلك باستغلالك لأشكال الوثيقة 2 ومكتسباتك.",
                  ...OFFICIAL(
                    3,
                    "Relecture visuelle page 3. Verbe officiel : اشرح. Question 1 après الوثيقة 2."
                  ),
                  placeholder: "يتشرب CO₂ من الوسط، أنزيم RUBISCO يثبّته على RuBP...",
                  minLength: 110,
                  modelAnswer:
                    "يعود ذلك إلى تجميع HCO3⁻ في البيرينويد وتحويله إلى CO₂ بواسطة CA ثم تثبيته بأنزيم RUBISCO على RudIP مما يسمح بتحويل الطاقة الضوئية رغم انخفاض CO₂ الخارجي.",
                  rule: {
                    prompt: "اشرح آلية تحويل الطاقة عند النمط الطبيعي",
                    keywords: ["الانزيم", "تثبيت", "البيرينويد", "التيلاكوئيد", "الضوئيه"],
                    minHits: 3,
                    forbidden: [],
                    wrongConcepts: ["SOD", "اميلاد", "هيموغلوبين"],
                    causalOrder: ["البيرينويد", "تثبيت", "الضوئيه"]
                  }
                },
                W: {
                  points: 1,
                  prompt: "الاستخلاص: تبرير حماية الطحالب الطبيعية حفاظاً على البيئة البحرية",
                  bacPrompt:
                    "برر تأكيد الباحثين على حماية الطحالب T.P الطبيعية حفاظا على البيئة البحرية، انطلاقا من الدراسة السابقة.",
                  ...OFFICIAL(
                    3,
                    "Relecture visuelle page 3. Verbe officiel : برر. Question 2 de clôture du التمرين الثاني."
                  ),
                  placeholder: "الطاقة الكيميائية الكامنة رغم انخفاض CO₂...",
                  minLength: 40,
                  modelAnswer:
                    "في الختام يجب حماية الطحالب الطبيعية لأنها تثبّت CO₂ وتنتج O₂ وتحفظ توازن البيئة البحرية حتى عند انخفاض التركيز.",
                  rule: {
                    prompt: "برر حماية الطحالب الطبيعية",
                    keywords: ["حمايه", "تلوث", "اكسجين", "يثبت", "طحالب", "طبيعي", "بيئه"],
                    minHits: 2,
                    forbidden: []
                  }
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
                  prompt:
                    "تأطير المسعى: ضبط المتغيرات (تركيز أدينوزين/كافيين، النشاط الدماغي)، وصياغة الفرضيتين",
                  bacPrompt:
                    "اقترح فرضيتين حول آلية تأثير مادة الـ Mtb على دور الـ Ado في النشاط العصبي الخاص باليقظة والنوم باستغلالك لشكلي الوثيقة1 ومعلوماتك.",
                  ...OFFICIAL(
                    4,
                    "Relecture visuelle page 4. Verbe officiel : اقترح فرضيتين. Seule consigne chiffrée du الجزء الأول."
                  ),
                  minLength: 30,
                  modelAnswer:
                    "الفرضية 1: يتنافس Mtb مع Ado على المستقبل A1R. الفرضية 2: يثبط Mtb إفراز Ado نفسه.",
                  rule: {
                    prompt: "اقترح فرضيتين حول تأثير Mtb",
                    keywords: ["فرضيه", "ادينوزين", "مستقبل"],
                    minHits: 1,
                    forbidden: [],
                    hypotheses: { min: 2, distinct: true }
                  }
                },
                S: {
                  points: 2.0,
                  prompt:
                    "مصفوفة استغلال الوثيقة 1 (الشكل أ: النشاط العصبي / الشكل ب: شدة الارتباط بـ A1R) بالأرقام",
                  bacPrompt:
                    "حلّل شكلي الوثيقة 1: نسبة النشاط العصبي الدماغي وشدة ارتباط Ado بـ A1R بدلالة تراكيز Ado و Mtb.",
                  ...RECON(
                    "Page 4 donne le tableau et la courbe mais la seule consigne écrite est « اقترح فرضيتين ». L'analyse chiffrée est une étape pédagogique, pas une question officielle autonome."
                  ),
                  minLength: 60,
                  modelAnswer:
                    "نلاحظ انخفاض النشاط العصبي بارتفاع Ado عند المجموعة 1 أكثر من المجموعة 2، وانخفاض شدة الارتباط بارتفاع Mtb.",
                  rule: {
                    prompt: "حلل الوثيقة 1 بالأرقام",
                    keywords: ["نشاط", "ارتباط", "تركيز"],
                    minHits: 2,
                    forbidden: ["بسبب"],
                    document: {
                      kind: "curve",
                      axes: ["نشاط", "ارتباط"],
                      comparisons: [["Ado", "Mtb"]],
                      trends: [
                        { about: "نشاط", expect: ["انخفاض", "Ado"] },
                        { about: "ارتباط", expect: ["انخفاض", "Mtb"] }
                      ],
                      values: ["نشاط", "ارتباط"],
                      strictValues: true
                    }
                  }
                },
                E: {
                  points: 4.0,
                  prompt:
                    "الاستدلال: تتبّع سلسلة A1R → Gi/Go → قنوات K⁺/Ca²⁺ → إفراز النورإبينفرين (NE) مع المصادقة",
                  bacPrompt: "تأكد من صحة إحدى الفرضيتين المقترحتين باستغلالك لشكلي الوثيقة2 ومعلوماتك.",
                  ...OFFICIAL(
                    5,
                    "Relecture visuelle page 5. Verbe officiel : تأكد. Question 1 du الجزء الثاني."
                  ),
                  minLength: 80,
                  modelAnswer:
                    "تتأكد الفرضية الأولى لأن Mtb ينافس Ado على A1R فلا تُفعَّل Gi/Go ويستمر تدفق Ca²⁺ فيتحرر NE وترتفع اليقظة.",
                  rule: {
                    prompt: "تأكد من صحة الفرضية باستغلال الوثيقة 2",
                    keywords: ["مستقبل", "نوريبنفرين", "كافيين"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                W: {
                  points: 1.5,
                  prompt:
                    "المصادقة والمخطط المقارن: الحالة الطبيعية (نقص اليقظة) مقابل وجود الكافيين (زيادة اليقظة)",
                  bacPrompt:
                    "وضّح في مخطط كيف يؤدي تراكم الـ Ado إلى الشعور بالنعاس وتأثير استهلاك مادة Methylthéobromine (Mtb) على ذلك، بناءً على ما توصلت إليه من نتائج هذه الدراسة ومعلوماتك.",
                  ...OFFICIAL(
                    5,
                    "Relecture visuelle page 5. Verbe officiel : وضّح في مخطط. Consigne du الجزء الثالث. Consigne « قدّم نصيحتين » non mappée (un pôle = une consigne)."
                  ),
                  minLength: 0,
                  modelAnswer:
                    "Ado → A1R → Gi/Go → انخفاض Ca²⁺ → انخفاض NE → نعاس. في وجود Mtb ينعكس المسار فترتفع اليقظة.",
                  rule: {
                    prompt: "وضح في مخطط مسار Ado و Mtb",
                    keywords: ["مخطط", "نعاس", "يقظه"],
                    minHits: 1,
                    forbidden: [],
                    schema: { arrows: true, title: "Ado", ordered: ["Ado", "A1R", "نعاس"] }
                  }
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
                {
                  id: 1,
                  title: "المسار 1: الحالة الطبيعية (نقص اليقظة)",
                  theme: "rose",
                  slots: [
                    "الاستقبال الغشائي لأدينوزين",
                    "البروتينات Gi/Go",
                    "قنوات K⁺/Ca²⁺",
                    "إفراز النورإبينفرين"
                  ]
                },
                {
                  id: 2,
                  title: "المسار 2: في وجود الكافيين (زيادة اليقظة)",
                  theme: "emerald",
                  slots: [
                    "التنافس / الحجب على A1R",
                    "عدم تفعيل Gi/Go",
                    "استمرار تدفق Ca²⁺",
                    "تحرير النورإبينفرين"
                  ]
                }
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
                  prompt:
                    "تأطير الإشكالية: كيف تُحَّول طاقة الجلوكوز خلال التحلل السكري وما أثر الدواء المُثبِّط للخطوة 1",
                  bacPrompt:
                    "كيف تُحوَّل طاقة الجلوكوز خلال التحلل السكري وما أثر 2-Désoxyglucose على الخطوة 1؟",
                  ...RECON(
                    "Préambule page 6 (Sujet 2). Pas de question officielle autonome de type « حدد المشكل »."
                  ),
                  placeholder: "...",
                  minLength: 40,
                  modelAnswer:
                    "المشكل العلمي: كيف تُحوَّل طاقة الجلوكوز إلى ATP خلال التحلل السكري، وما أثر تثبيط الخطوة 1 بـ 2-DG؟",
                  rule: {
                    prompt: "حدد المشكل العلمي حول التحلل السكري",
                    keywords: ["التحلل", "السكري", "الجلوكوز", "الطاقه"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                S: {
                  points: 1,
                  prompt: "التعرف على المركبات (أ، ب، ج، د، هـ) في المخطط + كتابة المعادلة الإجمالية",
                  bacPrompt: "تعرّف على المركبات المشار إليها بالأحرف: A.B.C.D.D′",
                  ...OFFICIAL(
                    6,
                    "Relecture visuelle page 1 du sujet 2 (page 6 du PDF). Verbe officiel : تعرّف. Question 1."
                  ),
                  placeholder: "جلوكوز، فركتوز ثنائي الفوسفات، حمض البيروفيك...",
                  minLength: 40,
                  modelAnswer:
                    "A و B مانحا/مستقبلا الفوسفات (ATP/ADP)، المركب الوسط فركتوز ثنائي الفوسفات، الناتج حمض البيروفيك، D/D′ NADH/NAD⁺.",
                  rule: {
                    prompt: "تعرف على المركبات المشار إليها",
                    keywords: ["حمض", "البيروفيك", "فركتوز", "جلوكوز"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                E: {
                  points: 2,
                  prompt: "العرض السببي: تسلسل تفاعلات التحلل السكري وإنتاج ATP + أثر الدواء على الخطوة 1",
                  bacPrompt:
                    "اشرح في نصٍ علميٍ مدعّم بمعادلة كيميائية إجمالية تفاعلات تحويل الطاقة الكيميائية الكامنة في جزيئة الغلوكوز خلال مرحلة التحلل السكري المشار إليها في الوثيقة وأثر مادة 2-Désoxyglucose على ذلك.",
                  ...OFFICIAL(
                    6,
                    "Relecture visuelle page 6. Verbe officiel : اشرح. Question 2 — texte scientifique structuré."
                  ),
                  placeholder: "الخطوة 1/الخطوة 2، أنزيم، ATP، البيروفيك...",
                  minLength: 120,
                  modelAnswer:
                    "خلال التحلل السكري يُفسفر الغلوكوز ثم يُشق إلى جزيئتي حمض بيروفيك مع إنتاج صافٍ من ATP. يثبط 2-DG الإنزيم المنشط للخطوة 1 فيتوقف التحويل وتتوقف الخلايا السرطانية عن التكاثر.",
                  rule: {
                    prompt: "اشرح تفاعلات التحلل السكري وأثر 2-DG",
                    keywords: ["الخطوه", "انزيم", "فوسفات", "ثنائي", "الطاقه"],
                    minHits: 3,
                    forbidden: [],
                    equation: { tokens: ["ATP", "ADP", "جلوكوز", "بيروفيك"], minTokens: 2 },
                    wrongConcepts: ["SOD", "RUBISCO"]
                  }
                },
                W: {
                  points: 1,
                  prompt:
                    "الخاتمة: دور التحلل السكري في إنتاج الطاقة وتأثير الدواء على تكاثر الخلايا السرطانية",
                  bacPrompt:
                    "ما النتيجة النهائية لتثبيط الخطوة 1 بـ 2-DG على الحصيلة الطاقوية وتكاثر الخلايا السرطانية؟",
                  ...RECON(
                    "La clôture est incluse dans le texte scientifique officiel (pôle E). Pas une question BAC autonome."
                  ),
                  placeholder: "...",
                  minLength: 40,
                  modelAnswer:
                    "في الختام يتوقف إنتاج الطاقة القابلة للاستعمال فتتوقف الخلايا السرطانية عن التكاثر.",
                  rule: {
                    prompt: "اكتب خاتمة حول أثر 2-DG",
                    keywords: ["الطاقه", "يتوقف", "الخلايا", "تتكاثر"],
                    minHits: 2,
                    forbidden: []
                  }
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
                  modelAnswer:
                    "المشكل العلمي: كيف يحمي SOD الخلايا العصبية من ROS، وما سبب الخلل عند المصاب بـ ALS؟",
                  rule: {
                    prompt: "حدد المشكل العلمي حول SOD و ALS",
                    keywords: ["الانزيم", "الاكسجين", "التفاعلي", "الخلايا", "العصبيه"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                S: {
                  points: 2.5,
                  prompt: "تحليل الشكل (أ): نسبة نشاط SOD وتراكيز ROS ونسبة تلف الخلايا عند السليم والمصاب",
                  bacPrompt: "حلّل النتائج الممثّلة في الشكل(أ) من الوثيقة1.",
                  ...OFFICIAL(
                    7,
                    "Relecture visuelle page 7 (2e page du sujet 2). Verbe officiel : حلّل. Question 1."
                  ),
                  placeholder: "قارن بالتوازي: نشاط SOD، تراكيز ROS، تلف الخلايا...",
                  minLength: 90,
                  modelAnswer:
                    "نلاحظ عند السليم نشاط SOD مرتفعا وROS وتلفا منخفضين، بينما عند المصاب ينخفض النشاط وترتفع ROS ونسبة التلف. ومنه نستنتج ارتباط التلف بانخفاض نشاط SOD.",
                  rule: {
                    prompt: "حلل الشكل أ من الوثيقة 1",
                    keywords: ["نشاط", "تراكيز", "تلف", "الخلايا", "سليم"],
                    minHits: 3,
                    forbidden: ["بسبب"],
                    document: {
                      kind: "curve",
                      axes: ["نشاط", "تلف"],
                      comparisons: [["سليم", "مصاب"]],
                      trends: [
                        { about: "سليم", expect: ["مرتفع", "نشاط"] },
                        { about: "مصاب", expect: ["ينخفض", "تلف", "ترتفع"] }
                      ],
                      domains: [
                        { about: "سليم", expect: ["مرتفع", "نشاط"] },
                        { about: "مصاب", expect: ["ينخفض", "تلف"] }
                      ],
                      relations: [{ type: "inverse", a: "نشاط", b: "تلف" }],
                      values: ["نشاط", "تلف"],
                      strictValues: true
                    }
                  }
                },
                E: {
                  points: 2.5,
                  prompt:
                    "الربط السببي: دور الموقع الفعّال وشوارد النحاس/الزّنك وسبب الخلل في وظيفة الأنزيم عند المصاب",
                  bacPrompt:
                    "بيّن سبب الخلل في وظيفة الأنزيم SOD عند الشخص المصاب باستغلالك للشكل(ب) والمعلومة المستخلصة من الشكل(أ) من الوثيقة1.",
                  ...OFFICIAL(7, "Relecture visuelle page 7. Verbe officiel : بيّن. Question 2."),
                  placeholder: "الموقع الفعّال، النحاس، الزنك، طفرة/خلل...",
                  minLength: 110,
                  modelAnswer:
                    "يعود الخلل إلى تغير بقايا الموقع الفعال فلا تُثبَّت شوارد النحاس/الزنك فيفقد الإنزيم قدرته على تحويل O₂⁻.",
                  rule: {
                    prompt: "بين سبب الخلل في وظيفة SOD",
                    keywords: ["الموقع", "الفعال", "النحاس", "الزنك", "خلل"],
                    minHits: 3,
                    forbidden: [],
                    wrongConcepts: ["RUBISCO", "روبيسكو", "هيموغلوبين"],
                    causalOrder: ["الموقع", "النحاس"]
                  }
                },
                W: {
                  points: 1,
                  prompt: "التبرير: استعمال (SOD) كدواء لعلاج ALS واقتراح علاج آخر",
                  bacPrompt:
                    "برّر استعمال EDA كدواء لعلاج التصلّب الجانبي الضموري ALS باستغلالك لأشكال الوثيقة2 ومعلوماتك.",
                  ...OFFICIAL(
                    8,
                    "Relecture visuelle page 8. Verbe officiel : برّر. Question 1 après الوثيقة 2. Consigne « اقترح علاجا آخر » non mappée (un pôle = une consigne)."
                  ),
                  placeholder: "...",
                  minLength: 40,
                  modelAnswer:
                    "EDA يلتقط O₂⁻ ويعوّض نقص SOD فتنخفض السمية ويتراجع تلف الخلايا العصبية الحركية.",
                  rule: {
                    prompt: "برر استعمال EDA كدواء لـ ALS",
                    keywords: ["علاج", "اكسده", "سميه", "اقترح", "دواء", "استعمال", "EDA"],
                    minHits: 2,
                    forbidden: []
                  }
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
                  prompt:
                    "تأطير الإشكالية: آلية تحقيق التسامح المناعي عند نقل الدم من مانح زمرته A إلى مستقل زمرته O",
                  bacPrompt:
                    "اقترح فرضية حول الآلية المستخدمة لتحقيق التسامح المناعي عند نقل الدم من مانح زمرته A إلى مستقبل زمرته O باستغلالك لشكلي الوثيقة1 ومعلوماتك.",
                  ...OFFICIAL(
                    9,
                    "Relecture visuelle page 9. Verbe officiel : اقترح فرضية. Consigne unique du الجزء الأول."
                  ),
                  placeholder: "...",
                  minLength: 30,
                  modelAnswer:
                    "نفترض أن تحويلا إنزيميا للمستضد A إلى مستضد H يلغي التعرف بالـ anti-A فيصبح النقل آمنا.",
                  rule: {
                    prompt: "اقترح فرضية حول التسامح المناعي",
                    keywords: ["الزمر", "المستضد", "الاجسام", "المضاده"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                S: {
                  points: 2.5,
                  prompt:
                    "استغلال الشكل (أ): شدة انحلال خلايا الدم الحمراء (هيموغلوبين/بيليروبين) وزمرة وكمية الدم",
                  bacPrompt:
                    "استغل شكلي الوثيقة 1: شدة انحلال خلايا الدم الحمراء وكميات الهيموغلوبين والبيليروبين حسب الزمرة المنقولة.",
                  ...RECON(
                    "Page 9 présente le tableau et la courbe ; la seule consigne écrite est « اقترح فرضية ». L'exploitation chiffrée est pédagogique."
                  ),
                  placeholder: "حلّل العمليتين وقارن بالتوازي...",
                  minLength: 90,
                  modelAnswer:
                    "نلاحظ ارتفاع الهيموغلوبين والبيليروبين عند نقل الزمرة A إلى O مقارنة بالعكس، مما يدل على انحلال أقوى.",
                  rule: {
                    prompt: "حلل الشكل أ حول انحلال الدم",
                    keywords: ["انحلال", "هيموغلوبين", "بيليروبين", "زمري"],
                    minHits: 3,
                    forbidden: ["بسبب"],
                    document: {
                      kind: "table",
                      axes: ["انحلال", "زمره"],
                      comparisons: [["هيموغلوبين", "بيليروبين"]],
                      cells: [
                        ["A", "انحلال"],
                        ["O", "هيموغلوبين"]
                      ],
                      values: ["هيموغلوبين", "بيليروبين"],
                      strictValues: true
                    }
                  }
                },
                E: {
                  points: 2.5,
                  prompt:
                    "الفرضية والربط: دور الجسم المضاد anti-A/anti-B ونشاط الأنزيم المُعدَّل وراثياً (تحويل المستضد)",
                  bacPrompt: "ناقش صحة الفرضية المقترحة باستغلالك لشكلي الوثيقة2.",
                  ...OFFICIAL(
                    10,
                    "Relecture visuelle page 10. Verbe officiel : ناقش. Question 1 du الجزء الثاني."
                  ),
                  placeholder: "فرضية حول آلية التحمل المناعي + دور الأنزيم...",
                  minLength: 110,
                  modelAnswer:
                    "تتأكد الفرضية لأن الإنزيم NAGA يزيل السكر الطرفي للمستضد A فيختفي التعرف بـ anti-A ولا يحدث انحلال.",
                  rule: {
                    prompt: "ناقش صحة الفرضية باستغلال الوثيقة 2",
                    keywords: ["فرضيه", "انزيم", "مستضد", "الاجسام", "التحول"],
                    minHits: 3,
                    forbidden: []
                  }
                },
                W: {
                  points: 2,
                  prompt: "الاستخلاص: كيف يُحقَّق التسامح المناعي لنقل آمن بين الزمرتين",
                  bacPrompt:
                    "وضّح في فقرة علمية الخطوات التي اتّبعها الباحثون في تحقيق التسامح المناعي عند نقل الدم من شخص زمرته A إلى آخر زمرته O من خلال ما توصلت إليه من هذه الدراسة ومعارفك.",
                  ...OFFICIAL(
                    10,
                    "Relecture visuelle page 10. Verbe officiel : وضّح في فقرة علمية. Consigne du الجزء الثالث."
                  ),
                  placeholder: "التسامح المناعي: إمكانية نقل الدم بين الزمرتين...",
                  minLength: 40,
                  modelAnswer:
                    "في الختام يتحقق التسامح بتحويل المستضد A إنزيميا إلى شكل غير متعرف عليه من anti-A فيصبح النقل آمنا.",
                  rule: {
                    prompt: "وضح فقرة علمية حول التسامح المناعي",
                    keywords: ["التسامح", "المناعي", "مانح", "مستقبل"],
                    minHits: 2,
                    forbidden: []
                  }
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
          pdfNote:
            "PDF non redistribué dans le dépôt ; source: https://eddirasa.com/bac-science-2024-se/ (consulté 2026-08-25). Miroir dzexams: https://www.dzexams.com/ar/annales/bkVXVzlvRTlpV1RMYUk5cGNyS3oxdz09. Session de remplacement non localisée. Thèmes relus sur la couche texte (bruitée : OCR + traduction parasite) ; wording reconstructed, non certifiable official.",
          title: "الموضوع الأول",
          exercises: [
            {
              number: 1,
              ui: "text",
              label: "فيروس VIH والخلايا LT4",
              max: 5,
              desc: "مراحل تطور فيروس VIH داخل الخلايا التائية LT4 وتأثير دواء Zalcitabine المثبط لإحدى مراحل التطور على فقدان المناعة المكتسبة",
              poles: {
                N: {
                  points: 1,
                  prompt: "تأطير الإشكالية: كيف يتطور فيروس VIH داخل الخلايا LT4 وما أثر تثبيط إحدى مراحله؟",
                  bacPrompt:
                    "كيف يتطور فيروس VIH داخل الخلايا LT4 مسببا فقدان المناعة المكتسبة، وما أثر تثبيط إحدى مراحل هذا التطور بدواء Zalcitabine؟",
                  ...RECON(
                    "Thème lu sur la couche texte bruitée (2026-08-25). Pas de question autonome de cadrage ; reformulation pédagogique du préambule."
                  ),
                  placeholder: "صياغة المشكل العلمي...",
                  minLength: 40,
                  modelAnswer:
                    "المشكل العلمي: كيف يتطور فيروس VIH داخل الخلايا التائية LT4 مسببا فقدان المناعة المكتسبة، وما أثر تثبيط إحدى مراحل تطوره بدواء Zalcitabine على تكاثره؟",
                  rule: {
                    prompt: "حدد المشكل العلمي حول تطور VIH في LT4",
                    keywords: ["فيروس", "LT4", "مناعه", "تطور"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                S: {
                  points: 1,
                  prompt: "استخراج مراحل تطور الفيروس من الوثيقة",
                  bacPrompt: "استخرج من الوثيقة المراحل المختلفة لتطور فيروس VIH داخل الخلايا LT4.",
                  ...RECON(
                    "Reconstruction pédagogique 2024 — thème (VIH/LT4/Zalcitabine) lu sur la couche texte bruitée."
                  ),
                  placeholder: "التصاق، نسخ عكسي، إدماج، تبرعم...",
                  minLength: 40,
                  modelAnswer:
                    "تمثل الوثيقة رسما تخطيطيا لمراحل تطور فيروس VIH داخل الخلية LT4: الالتصاق بالخلية، النسخ العكسي للـ ARN الفيروسي، إدماج الـ ADN في مورثة الخلية، التعبير وتشكل فيروسات جديدة ثم تبرعمها خارج الخلية.",
                  rule: {
                    prompt: "استخرج مراحل تطور فيروس VIH",
                    keywords: ["التصاق", "نسخ", "عكسي", "ادماج", "تبرعم"],
                    minHits: 2,
                    forbidden: ["بسبب"]
                  }
                },
                E: {
                  points: 2,
                  prompt: "النص العلمي: مراحل تطور الفيروس وتأثير Zalcitabine",
                  bacPrompt:
                    "بيّن في نص علمي مراحل تطور فيروس VIH في الخلايا LT4 وتأثير دواء Zalcitabine على ذلك.",
                  ...RECON(
                    "Verbe officiel lu (بيّن في نص علمي) sur la couche texte bruitée ; wording reconstruit mot à mot."
                  ),
                  placeholder: "مقدمة، عرض، خاتمة...",
                  minLength: 120,
                  modelAnswer:
                    "يلتصق فيروس VIH بمستقبلات الخلية التائية LT4 ثم يحقن محتواه، فيُنسخ ARNه عكسيا إلى ADN يتكامل في مورثة الخلية، فتُعبَّر المورثة وتُنتج فيروسات جديدة تبرعم خارجا. يثبط دواء Zalcitabine مرحلة النسخ العكسي (المرحلة 2) فيمنع تشكل الـ ADN الفيروسي، فيتوقف تكاثر الفيروس ويحد من فقدان المناعة المكتسبة.",
                  rule: {
                    prompt: "بين مراحل تطور VIH وتأثير Zalcitabine",
                    keywords: ["LT4", "نسخ", "عكسي", "Zalcitabine", "تكاثر"],
                    minHits: 3,
                    forbidden: []
                  }
                },
                W: {
                  points: 1,
                  prompt: "الخاتمة: أثر تثبيط النسخ العكسي على المناعة",
                  bacPrompt: "ما أثر تثبيط النسخ العكسي بدواء Zalcitabine على فقدان المناعة المكتسبة؟",
                  ...RECON(
                    "La clôture est incluse dans le texte scientifique officiel (pôle E). Pas une question BAC autonome."
                  ),
                  placeholder: "في الختام...",
                  minLength: 40,
                  modelAnswer:
                    "في الختام، بتثبيط النسخ العكسي يحد دواء Zalcitabine من تكاثر الفيروس داخل LT4 فيحمي الخلايا التائية من التلف ويحد من فقدان المناعة المكتسبة.",
                  rule: {
                    prompt: "اكتب خاتمة حول أثر Zalcitabine",
                    keywords: ["نسخ", "تكاثر", "مناعه"],
                    minHits: 2,
                    forbidden: []
                  }
                }
              }
            },
            {
              number: 2,
              ui: "text",
              label: "الصرع وتوازن التنبيه والتثبيط",
              max: 7,
              desc: "فقدان التوازن بين التنبيه (Glutamate) والتثبيط (GABA) على مستوى مشابك القشرة المخية عند المصابين بالصرع، ودور طفرة الجين Scn1a",
              poles: {
                N: {
                  points: 1,
                  prompt: "تأطير الإشكالية: أصل اختلال توازن التنبيه والتثبيط في الصرع",
                  bacPrompt:
                    "ما أصل اختلال التوازن بين التنبيه والتثبيط في اضطرابات الصرع، وما دور طفرة الجين Scn1a في ذلك؟",
                  ...RECON(
                    "Thème (Excitation/Inhibition, Glutamate/GABA, Scn1a) lu sur la couche texte bruitée ; pas de question autonome de cadrage."
                  ),
                  placeholder: "صياغة المشكل العلمي...",
                  minLength: 40,
                  modelAnswer:
                    "المشكل العلمي: ما أصل اختلال التوازن بين التنبيه والتثبيط على مستوى مشابك القشرة المخية في حالة الصرع، وما دور طفرة الجين Scn1a؟",
                  rule: {
                    prompt: "حدد المشكل العلمي حول الصرع",
                    keywords: ["توازن", "تنبيه", "تثبيط", "صرع"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                S: {
                  points: 2.5,
                  prompt: "تحليل تواتر كمونات العمل في الشكل (أ) من الوثيقة 1",
                  bacPrompt: "حلّل النتائج الممثلة في الشكل (أ) من الوثيقة 1.",
                  ...RECON("Verbe officiel lu (حلّل) sur la couche texte bruitée ; wording reconstruit."),
                  placeholder: "تواتر كمونات العمل، مصاب/طبيعي...",
                  minLength: 90,
                  modelAnswer:
                    "تمثل الوثيقة تواتر كمونات العمل في وحدة الزمن على مستوى أغشية الخلايا العصبية قبل المشبكية. نلاحظ ارتفاع تواتر كمونات العمل لدى المصابين بالصرع، بينما يبقى منخفضا لدى الأفراد الطبيعيين، ومنه نستنتج فرط النشاط العصبي لدى المصابين.",
                  rule: {
                    prompt: "حلل تواتر كمونات العمل في الشكل أ",
                    keywords: ["تواتر", "كمون", "مصاب", "طبيعي"],
                    minHits: 2,
                    forbidden: ["بسبب"],
                    document: {
                      kind: "curve",
                      axes: ["تواتر", "كمون"],
                      comparisons: [["مصاب", "طبيعي"]],
                      trends: [{ about: "مصاب", expect: ["ارتفاع", "مرتفع"] }],
                      relations: [{ type: "inverse", a: "مصاب", b: "طبيعي" }],
                      values: [],
                      strictValues: false
                    }
                  }
                },
                E: {
                  points: 2.5,
                  prompt: "بيان فقدان التوازن بين التنبيه والتثبيط في حالة الصرع",
                  bacPrompt:
                    "بيّن فقدان التوازن بين التنبيه والتثبيط على مستوى مشابك القشرة المخية في حالة الصرع انطلاقا من نتائج الشكل (ب) من الوثيقة 1.",
                  ...RECON("Verbe officiel lu (بيّن) sur la couche texte bruitée ; wording reconstruit."),
                  placeholder: "Glutamate، GABA، تنبيه، تثبيط...",
                  minLength: 110,
                  modelAnswer:
                    "يفقد التوازن بين التنبيه والتثبيط لأن كمية Glutamate المفرزة من العصبون (G) المنبّه ترتفع بينما تنخفض كمية GABA المفرزة من العصبون (A) المثبّط، فيغلب الاستثارة على التثبيط في مشابك القشرة المخية وتظهر نوبة الصرع. وتعود هذه العلامة المرضية إلى طفرة الجين Scn1a المشفّر لقناة الصوديوم.",
                  rule: {
                    prompt: "بين فقدان التوازن بين التنبيه والتثبيط",
                    keywords: ["غلوتامات", "GABA", "تنبيه", "تثبيط", "توازن"],
                    minHits: 3,
                    forbidden: []
                  }
                },
                W: {
                  points: 1,
                  prompt: "الخلاصة: دور طفرة Scn1a في الصرع",
                  bacPrompt: "ما دور طفرة الجين Scn1a في ظهور اضطرابات الصرع؟",
                  ...RECON(
                    "La clôture est incluse dans l'explication officielle (pôle E). Pas une question BAC autonome."
                  ),
                  placeholder: "في الختام...",
                  minLength: 40,
                  modelAnswer:
                    "في الختام، تؤدي طفرة الجين Scn1a المشفّر لقناة الصوديوم إلى خلل في نقل الإشارة العصبية فتختل وظيفة العصبونات المثبطة ويسود التنبيه فتظهر نوبات الصرع.",
                  rule: {
                    prompt: "اكتب خلاصة حول دور طفرة Scn1a",
                    keywords: ["طفره", "Scn1a", "قناه", "صرع"],
                    minHits: 2,
                    forbidden: []
                  }
                }
              }
            },
            {
              number: 3,
              ui: "text",
              label: "بروتين P53 والبنزوبيرين",
              max: 8,
              desc: "أثر طفرة الجين P53 الناتجة عن التعرض للبنزوبيرين (BZP) في فقدان وظيفة البروتين الكابحة للأورام ونشأة سرطان الرئة",
              poles: {
                N: {
                  points: 0.5,
                  prompt: "تأطير الإشكالية: علاقة طفرة P53 بسرطان الرئة",
                  bacPrompt: "كيف تؤدي طفرة الجين P53 الناتجة عن التعرض للبنزوبيرين إلى نشأة سرطان الرئة؟",
                  ...RECON(
                    "Thème (P53, Benzopyrène, cancer du poumon) lu sur la couche texte bruitée ; pas de question autonome de cadrage."
                  ),
                  placeholder: "صياغة المشكل العلمي...",
                  minLength: 30,
                  modelAnswer:
                    "المشكل العلمي: كيف تؤدي طفرة الجين P53 الناتجة عن التعرض للبنزوبيرين إلى فقدان وظيفة البروتين الكابحة للأورام ونشأة سرطان الرئة؟",
                  rule: {
                    prompt: "حدد المشكل العلمي حول P53 والبنزوبيرين",
                    keywords: ["P53", "طفره", "بنزوبيرين", "سرطان"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                S: {
                  points: 2,
                  prompt: "استغلال الوثائق: تتابع الجين P53 السليم والسرطاني وعلاقة البنزوبيرين بالإصابة",
                  bacPrompt:
                    "استغل الوثائق: مقارنة تتابع الجين P53 السليم والسرطاني (Anagène) وتغير تركيز البنزوبيرين بدلالة نسبة احتمال الإصابة بسرطان الرئة.",
                  ...RECON("Reconstruction pédagogique 2024 — thème lu sur la couche texte bruitée."),
                  placeholder: "تتابع، طفرة، تركيز، نسبة إصابة...",
                  minLength: 60,
                  modelAnswer:
                    "تمثل الوثائق مقارنة تتابع الجين P53 السليم والسرطاني وتغير نسبة احتمال الإصابة بسرطان الرئة بدلالة عدد السجائر وتركيز البنزوبيرين. نلاحظ ظهور طفرة نقطية في التتابع السرطاني وارتفاع نسبة احتمال الإصابة بارتفاع تركيز البنزوبيرين، ومنه نستنتج علاقة البنزوبيرين بطفرة P53 ونشأة السرطان.",
                  rule: {
                    prompt: "استغل الوثائق حول P53 والبنزوبيرين",
                    keywords: ["تتابع", "طفره", "بنزوبيرين", "اصابه"],
                    minHits: 2,
                    forbidden: ["بسبب"],
                    document: {
                      kind: "table",
                      axes: ["تتابع", "تركيز"],
                      comparisons: [["سليم", "سرطاني"]],
                      cells: [["P53", "طفره"]],
                      values: [],
                      strictValues: false
                    }
                  }
                },
                E: {
                  points: 4,
                  prompt: "تفسير أثر طفرة P53 على وظيفته الكابحة للورم",
                  bacPrompt:
                    "فسّر كيف تفقد بروتينة P53 وظيفتها الكابحة للأورام عند حدوث طفرة ناتجة عن البنزوبيرين.",
                  ...RECON("Reconstruction pédagogique 2024 — thème lu sur la couche texte bruitée."),
                  placeholder: "الموقع الفعال، تتابع، وظيفة كابحة...",
                  minLength: 110,
                  modelAnswer:
                    "يعود فقدان الوظيفة الكابحة للأورام إلى طفرة نقطية في الجين P53 (استبدال نوكليوتيد) تغيّر حمضا أمينيا في البروتين، فيتغير تتابع الأحماض الأمينية وتفقد البروتينة قدرتها على تثبيط الانقسامات الشاذة، فتتكاثر الخلايا السرطانية ويتكون ورم الرئة تحت تأثير البنزوبيرين.",
                  rule: {
                    prompt: "فسر أثر طفرة P53 على وظيفته الكابحة",
                    keywords: ["طفره", "P53", "بروتين", "انقسام", "ورم"],
                    minHits: 3,
                    forbidden: []
                  }
                },
                W: {
                  points: 1.5,
                  prompt: "الخلاصة: مسار البنزوبيرين نحو الورم",
                  bacPrompt: "لخّص المسار الذي يربط البنزوبيرين بطفرة P53 ونشأة ورم الرئة.",
                  ...RECON(
                    "La clôture est incluse dans l'explication (pôle E). Pas une question BAC autonome."
                  ),
                  placeholder: "بنزوبيرين → طفرة → فقدان الوظيفة → ورم...",
                  minLength: 40,
                  modelAnswer:
                    "في الختام، يحدث البنزوبيرين طفرة في الجين P53 فتفقد البروتينة وظيفتها الكابحة للأورام، فتتكاثر الخلايا دون رقابة ويتكون ورم الرئة.",
                  rule: {
                    prompt: "لخص مسار البنزوبيرين نحو الورم",
                    keywords: ["بنزوبيرين", "طفره", "ورم"],
                    minHits: 2,
                    forbidden: []
                  }
                }
              }
            }
          ]
        },
        {
          id: 2,
          pdf: null,
          pdfAvailable: false,
          pdfExternalUrl: "https://eddirasa.com/wp-content/uploads/2024/06/bac-sc-sciences-2024.pdf",
          pdfNote:
            "PDF non redistribué dans le dépôt ; même fichier que le sujet 1 (session normale, sujets 1 et 2). Thèmes relus sur la couche texte bruitée (2026-08-25) ; wording reconstructed.",
          title: "الموضوع الثاني",
          exercises: [
            {
              number: 1,
              ui: "text",
              label: "الترجمة وتأثير المضادات الحيوية",
              max: 5,
              desc: "ترجمة المعلومة الوراثية المحمولة على ARNm إلى متتالية أحماض أمينية في الهيولى، وتأثير مركبي Tetracycline وOxazolidinone المثبطين لهذه المرحلة",
              poles: {
                N: {
                  points: 1,
                  prompt: "تأطير الإشكالية: كيف تُترجم معلومة ARNm وما أثر تثبيطها؟",
                  bacPrompt:
                    "كيف تُترجم المعلومة الوراثية المحمولة على ARNm إلى متتالية أحماض أمينية في الهيولى، وما أثر تثبيط هذه المرحلة بمركبات كيميائية؟",
                  ...RECON(
                    "Thème (traduction, Tetracycline, Oxazolidinone) lu sur la couche texte bruitée ; pas de question autonome de cadrage."
                  ),
                  placeholder: "صياغة المشكل العلمي...",
                  minLength: 40,
                  modelAnswer:
                    "المشكل العلمي: كيف تُترجم المعلومة الوراثية المحمولة على ARNm إلى متتالية أحماض أمينية في الهيولى، وما أثر تثبيط الترجمة بمركبات كيميائية مختلفة؟",
                  rule: {
                    prompt: "حدد المشكل العلمي حول الترجمة",
                    keywords: ["ترجمه", "ARNm", "احماض", "هيولي"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                S: {
                  points: 1,
                  prompt: "ذكر العناصر المتدخلة في حدوث الترجمة",
                  bacPrompt: "اذكر العناصر المتدخلة في حدوث هذه المرحلة (الترجمة).",
                  ...RECON("Verbe officiel lu (اذكر) sur la couche texte bruitée ; wording reconstruit."),
                  placeholder: "ARNm، ريبوزوم، ARNt...",
                  minLength: 30,
                  modelAnswer:
                    "العناصر المتدخلة في الترجمة: ARNm، الريبوزوم، ARNt، الأحماض الأمينية المنشطة، الأنزيمات المنشطة وطاقة ATP.",
                  rule: {
                    prompt: "اذكر العناصر المتدخلة في الترجمة",
                    keywords: ["ARNm", "ريبوزوم", "ARNt", "احماض"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                E: {
                  points: 2,
                  prompt: "النص العلمي: خطوات الترجمة وتأثير المركبين",
                  bacPrompt:
                    "اشرح في نص علمي خطوات الترجمة وتأثير كل من Oxazolidinone وTetracycline باستغلال الوثيقة ومعلوماتك (النص العلمي مهيكل بمقدمة وعرض وخاتمة).",
                  ...RECON(
                    "Verbe officiel lu (اشرح في نص علمي) sur la couche texte bruitée ; wording reconstruit."
                  ),
                  placeholder: "مقدمة، عرض، خاتمة...",
                  minLength: 120,
                  modelAnswer:
                    "تبدأ الترجمة بارتباط الريبوزوم بالـ ARNm ثم تنقل أحماض أمينية منشطة محمولة على ARNt وفق الرامزات فتتشكل روابط بيبتيدية وتستطيل السلسلة. يثبط مركب Tetracycline تثبيت ARNt على الريبوزوم فيتوقف البدء أو الاستطالة، بينما يمنع مركب Oxazolidinone تشكل المركب البدئي للترجمة، فيتوقف تركيب البروتين.",
                  rule: {
                    prompt: "اشرح خطوات الترجمة وتأثير المركبين",
                    keywords: ["ريبوزوم", "ARNt", "ترجمه", "Tetracycline", "Oxazolidinone"],
                    minHits: 3,
                    forbidden: []
                  }
                },
                W: {
                  points: 1,
                  prompt: "الخاتمة: أثر تثبيط الترجمة على تركيب البروتين",
                  bacPrompt: "ما أثر تثبيط الترجمة بمركبين كيميائيين على تركيب البروتين؟",
                  ...RECON(
                    "La clôture est incluse dans le texte scientifique officiel (pôle E). Pas une question BAC autonome."
                  ),
                  placeholder: "في الختام...",
                  minLength: 40,
                  modelAnswer:
                    "في الختام، بتثبيط الترجمة بمركب Tetracycline أو Oxazolidinone يتوقف تركيب البروتين في الخلية.",
                  rule: {
                    prompt: "اكتب خاتمة حول أثر تثبيط الترجمة",
                    keywords: ["ترجمه", "تثبيط", "بروتين"],
                    minHits: 2,
                    forbidden: []
                  }
                }
              }
            },
            {
              number: 2,
              ui: "text",
              label: "RUBISCO وتثبيت CO2 عند الفاصولياء",
              max: 7,
              desc: "تثبيت جزيئة CO2 على الريبولوز ثنائي الفوسفات بأنزيم RUBISCO وأثر عامل الظلام على تفاعلات التثبيت عند أوراق نبات الفاصولياء Phaseolus",
              poles: {
                N: {
                  points: 1,
                  prompt: "تأطير الإشكالية: أثر الظلام على تثبيت CO2",
                  bacPrompt:
                    "كيف يؤثر عامل الظلام على تفاعلات تثبيت جزيئة CO2 بأنزيم RUBISCO عند أوراق نبات الفاصولياء؟",
                  ...RECON(
                    "Thème (RUBISCO, CO2, RuBP, Phaseolus, CA1P) lu sur la couche texte bruitée ; pas de question autonome de cadrage."
                  ),
                  placeholder: "صياغة المشكل العلمي...",
                  minLength: 40,
                  modelAnswer:
                    "المشكل العلمي: كيف يؤثر عامل الظلام على تفاعلات تثبيت جزيئة CO2 على الريبولوز ثنائي الفوسفات بأنزيم RUBISCO عند أوراق نبات الفاصولياء؟",
                  rule: {
                    prompt: "حدد المشكل العلمي حول تثبيت CO2",
                    keywords: ["RUBISCO", "تثبيت", "CO2", "ظلام"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                S: {
                  points: 2.5,
                  prompt: "تحليل نتائج تثبيت CO2 ونشاط RUBISCO",
                  bacPrompt:
                    "حلّل نتائج الوثيقة المتعلقة بنشاط أنزيم RUBISCO وتكوين CA1P وتثبيت CO2 عند أوراق الفاصولياء.",
                  ...RECON("Reconstruction pédagogique 2024 — thème lu sur la couche texte bruitée."),
                  placeholder: "نشاط RUBISCO، CA1P، تثبيت CO2...",
                  minLength: 90,
                  modelAnswer:
                    "تمثل الوثيقة نشاط أنزيم RUBISCO ونسبة تكوين CA1P وتثبيت CO2 بدلالة الزمن. نلاحظ ارتفاع نشاط RUBISCO في الضوء مع ارتفاع تثبيت CO2، بينما ينخفض النشاط في الظلام مع تكون CA1P المثبط، ومنه نستنتج أن الظلام يثبط نشاط RUBISCO عبر CA1P.",
                  rule: {
                    prompt: "حلل نتائج نشاط RUBISCO وتكوين CA1P",
                    keywords: ["RUBISCO", "CA1P", "تثبيت", "ضوء"],
                    minHits: 2,
                    forbidden: ["بسبب"],
                    document: {
                      kind: "curve",
                      axes: ["نشاط", "زمن"],
                      comparisons: [["ضوء", "ظلام"]],
                      trends: [{ about: "ضوء", expect: ["ارتفاع", "مرتفع"] }],
                      relations: [{ type: "inverse", a: "ظلام", b: "نشاط" }],
                      values: [],
                      strictValues: false
                    }
                  }
                },
                E: {
                  points: 2.5,
                  prompt: "شرح أثر الظلام على نشاط RUBISCO عبر CA1P",
                  bacPrompt:
                    "اشرح آلية تأثير عامل الظلام على تفاعلات تثبيت CO2 بأنزيم RUBISCO عند أوراق الفاصولياء.",
                  ...RECON("Reconstruction pédagogique 2024 — thème lu sur la couche texte bruitée."),
                  placeholder: "CA1P، الموقع الفعال، تثبيط...",
                  minLength: 110,
                  modelAnswer:
                    "في الظلام يتراكم مثبط CA1P الذي يتثبت على الموقع الفعال لأنزيم RUBISCO فيمنع تثبيت CO2 على الريبولوز ثنائي الفوسفات، فلا يتشكل المركب السداسي ولا حمض الفوسفوغليسيريك، فتتوقف تفاعلات تثبيت CO2 في أوراق الفاصولياء.",
                  rule: {
                    prompt: "اشرح أثر الظلام على نشاط RUBISCO",
                    keywords: ["RUBISCO", "CA1P", "تثبيت", "ظلام", "موقع"],
                    minHits: 3,
                    forbidden: []
                  }
                },
                W: {
                  points: 1,
                  prompt: "الخلاصة: أهمية الضوء لتثبيت CO2",
                  bacPrompt: "ما أهمية الضوء في الحفاظ على نشاط RUBISCO وتثبيت CO2؟",
                  ...RECON(
                    "La clôture est incluse dans l'explication (pôle E). Pas une question BAC autonome."
                  ),
                  placeholder: "في الختام...",
                  minLength: 40,
                  modelAnswer:
                    "في الختام، يحافظ الضوء على نشاط أنزيم RUBISCO بمنع تراكم مثبط CA1P، فيستمر تثبيت CO2 وإنتاج المادة العضوية عند النبات.",
                  rule: {
                    prompt: "اكتب خلاصة حول أهمية الضوء لتثبيت CO2",
                    keywords: ["ضوء", "RUBISCO", "تثبيت"],
                    minHits: 2,
                    forbidden: []
                  }
                }
              }
            },
            {
              number: 3,
              ui: "text",
              label: "المناعة ضد البكتيريا الممرضة",
              max: 8,
              desc: "الاستجابة المناعية ضد Corynebacterium diphtheriae وStaphylococcus aureus ودور بروتين SPA في تحديد أفضل سيرورة للقضاء على البكتيريا",
              poles: {
                N: {
                  points: 0.5,
                  prompt: "تأطير الإشكالية: آلية القضاء على البكتيريا الممرضة",
                  bacPrompt:
                    "كيف تقضي المناعة على البكتيريا الممرضة (Corynebacterium وStaphylococcus aureus)، وما دور بروتين SPA في ذلك؟",
                  ...RECON(
                    "Thème (diphtérie, S. aureus, SPA) lu sur la couche texte bruitée ; pas de question autonome de cadrage."
                  ),
                  placeholder: "صياغة المشكل العلمي...",
                  minLength: 30,
                  modelAnswer:
                    "المشكل العلمي: كيف تقضي المناعة على البكتيريا الممرضة Corynebacterium وStaphylococcus aureus، وما دور بروتين SPA في تحديد أفضل سيرورة للقضاء عليها؟",
                  rule: {
                    prompt: "حدد المشكل العلمي حول المناعة ضد البكتيريا",
                    keywords: ["مناعه", "بكتيريا", "مستضد", "ممرضه"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                S: {
                  points: 2,
                  prompt: "استغلال الوثائق: نسبة الروابط الميكروبية ضد الممرضين",
                  bacPrompt:
                    "استغل الوثائق: نسبة الارتباط بالمستضدات (AgCd) و(AgSa) والبروتينات المناعية ضد Corynebacterium وStaphylococcus aureus.",
                  ...RECON("Reconstruction pédagogique 2024 — thème lu sur la couche texte bruitée."),
                  placeholder: "أجسام مضادة، مستضد، نسبة ارتباط...",
                  minLength: 60,
                  modelAnswer:
                    "تمثل الوثائق نسبة ارتباط الأجسام المضادة بمستضدات البكتيريا Corynebacterium (AgCd) وStaphylococcus aureus (AgSa). نلاحظ ارتباطا نوعيا مرتفعا للأجسام المضادة بمستضدها الموافق، ومنه نستنتج خصوصية الاستجابة المناعية الخلطية ضد كل بكتيريا.",
                  rule: {
                    prompt: "استغل الوثائق حول المناعة ضد البكتيريا",
                    keywords: ["مستضد", "اجسام", "مضاده", "ارتباط"],
                    minHits: 2,
                    forbidden: ["بسبب"],
                    document: {
                      kind: "table",
                      axes: ["ارتباط", "مستضد"],
                      comparisons: [["AgCd", "AgSa"]],
                      cells: [["مستضد", "ارتباط"]],
                      values: [],
                      strictValues: false
                    }
                  }
                },
                E: {
                  points: 4,
                  prompt: "تفسير دور بروتين SPA في الإفلات المناعي",
                  bacPrompt:
                    "فسّر كيف يحدد بروتين SPA أفضل سيرورة للقضاء على Staphylococcus aureus معتمدا على الوثيقة ومعلوماتك.",
                  ...RECON("Reconstruction pédagogique 2024 — thème lu sur la couche texte bruitée."),
                  placeholder: "SPA، جسم مضاد، بلعمة...",
                  minLength: 110,
                  modelAnswer:
                    "يرتبط بروتين SPA الموجود على جدار Staphylococcus aureus بالقطعة Fc للأجسام المضادة فيمنع تثبيتها عبر مواقعها المتغيرة على المستضد ويعطل البلعمة، فتستفيد البكتيريا من الإفلات المناعي. وللقضاء عليها تُستعمل سيرورة تحييد SPA لاستعادة التعرف النوعي وتسهيل البلعمة.",
                  rule: {
                    prompt: "فسر دور بروتين SPA في الإفلات المناعي",
                    keywords: ["SPA", "جسم", "مضاد", "بلعمه", "مستضد"],
                    minHits: 3,
                    forbidden: []
                  }
                },
                W: {
                  points: 1.5,
                  prompt: "الخلاصة: أفضل سيرورة للقضاء على البكتيريا",
                  bacPrompt: "ما أفضل سيرورة للقضاء على Staphylococcus aureus معتمدا على معطيات الوثيقة؟",
                  ...RECON(
                    "La clôture est incluse dans l'explication (pôle E). Pas une question BAC autonome."
                  ),
                  placeholder: "في الختام...",
                  minLength: 40,
                  modelAnswer:
                    "في الختام، تقضي أفضل سيرورة على Staphylococcus aureus بتحييد بروتين SPA لاستعادة التعرف النوعي بالأجسام المضادة وتسهيل البلعمة.",
                  rule: {
                    prompt: "اكتب خلاصة حول القضاء على S. aureus",
                    keywords: ["SPA", "بلعمه", "بكتيريا"],
                    minHits: 2,
                    forbidden: []
                  }
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
      badge: "دورة رسمية",
      theme: "amber",
      enabled: true,
      sujets: [
        {
          id: 1,
          pdf: null,
          pdfAvailable: false,
          pdfExternalUrl:
            "https://www.dzexams.com/uploads/sujets/officiels/bac/2023/dzexams-bac-sciences-naturelles-1780707.pdf",
          pdfNote:
            "PDF non redistribué dans le dépôt ; source : https://www.dzexams.com/ar/annales/STRDZEowcCtwN0JmT1NwS3p4cEVmdz09 (consulté 2026-08-25). La couche texte du PDF est inversée (miroir mot à mot) ; les consignes ont été reconstituées mot à mot à partir de cette couche. Session de remplacement non localisée.",
          title: "الموضوع الأول",
          exercises: [
            {
              number: 1,
              ui: "text",
              label: "البروتينات الغشائية في المشبك وذيفان الكزاز",
              max: 5,
              desc: "دور البروتينات الغشائية (مستقبلات وقنوات) للخلية بعد المشبكية في النقل المشبكي، وأثر ذيفان بكتيريا الكزاز (Clostridium tetani) المثبط للإفراز",
              poles: {
                N: {
                  points: 1,
                  prompt:
                    "تأطير الإشكالية: كيف تعمل البروتينات الغشائية في المشبك وما أثر ذيفان الكزاز عليها؟",
                  bacPrompt:
                    "كيف تتدخل مختلف البروتينات الغشائية في عمل المشبك، وما أثر ذيفان الكزاز على هذا العمل؟",
                  ...RECON(
                    "Pas de question officielle autonome de type « حدد المشكل ». Reformulation pédagogique du préambule page 1."
                  ),
                  placeholder: "صياغة المشكل العلمي...",
                  minLength: 30,
                  modelAnswer:
                    "المشكل العلمي: كيف تتدخل مختلف البروتينات الغشائية للخلية بعد المشبكية في عمل المشبك، وما أثر تثبيط إفراز GABA بذيفان الكزاز على النقل العصبي؟",
                  rule: {
                    prompt: "حدد المشكل العلمي حول البروتينات الغشائية في المشبك",
                    keywords: ["مشبك", "بروتين", "غشائي", "كزاز"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                S: {
                  points: 1,
                  prompt: "تسمية التسجيلين والبروتين الغشائي المسؤول عن كل تسجيل",
                  bacPrompt:
                    "سمّ التسجيلين المتوقع الحصول عليهما في جهاز راسم الاهتزاز المهبطي (أ) و(ب)، وكذلك البروتين الغشائي للخلية بعد المشبكية المسؤول عن كل تسجيل.",
                  ...OFFICIAL(
                    1,
                    "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : سمّ. Question 1 du التمرين الأول (Sujet 1).",
                    "2026-08-25"
                  ),
                  placeholder: "تسجيل تنبيهي/تثبيطي، مستقبل غشائي...",
                  minLength: 30,
                  modelAnswer:
                    "التسجيل (أ) جهد بعد مشبكي تنبيهي PPSE والتسجيل (ب) جهد بعد مشبكي تثبيطي PPSI. البروتين الغشائي المسؤول: مستقبل غشائي للمبلغ العصبي (مستقبل الأستيل كولين المنبّه ومستقبل GABA المثبط).",
                  rule: {
                    prompt: "سم التسجيلين والبروتين الغشائي المسؤول",
                    keywords: ["مشبكي", "مستقبل", "تسجيل", "غشائي"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                E: {
                  points: 2,
                  prompt: "النص العلمي: دور البروتينات الغشائية في عمل المشبك وأثر ذيفان الكزاز",
                  bacPrompt:
                    "بيّن في نص علمي دور مختلف البروتينات الغشائية في عمل المشبك وتأثير ذيفان الكزاز على ذلك انطلاقا من معطيات الوثيقة ومعلوماتك (النص العلمي مهيكل بمقدمة وعرض وخاتمة).",
                  ...OFFICIAL(
                    1,
                    "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : بيّن. Question 2 (texte scientifique structuré) du التمرين الأول.",
                    "2026-08-25"
                  ),
                  placeholder: "مقدمة، عرض، خاتمة...",
                  minLength: 120,
                  modelAnswer:
                    "ترتبط المبالغ العصبية بمستقبلات غشائية نوعية على الغشاء بعد المشبكي فتتفتح قنوات شاردية نوعية: يرتبط GABA بمستقبله المثبط فيدخل Cl⁻ ويتولد جهد تثبيطي، بينما يرتبط الأستيل كولين بمستقبله المنبّه فيدخل Na⁺ ويتولد جهد تنبيهي، ويُدمج المحصّل على مستوى العصبون. يمنع ذيفان الكزاز تحرير GABA فيغيب التثبيط وتسيطر المكونات التنبيهية فيحدث تقلص عضلي عنيف.",
                  rule: {
                    prompt: "بين دور البروتينات الغشائية وأثر ذيفان الكزاز",
                    keywords: ["مستقبل", "غشائي", "تثبيط", "تنبيه", "تحرير"],
                    minHits: 3,
                    forbidden: []
                  }
                },
                W: {
                  points: 1,
                  prompt: "الخاتمة: أثر ذيفان الكزاز على النقل العصبي",
                  bacPrompt: "ما أثر تثبيط إفراز GABA بذيفان الكزاز على عمل المشبك والنقل العصبي؟",
                  ...RECON(
                    "La clôture est incluse dans le texte scientifique officiel (pôle E). Ce pôle isole pédagogiquement la clôture, ce n'est pas une question BAC autonome."
                  ),
                  placeholder: "في الختام...",
                  minLength: 40,
                  modelAnswer:
                    "في الختام، بتثبيط تحرير GABA يختل توازن المشبك فتهيمن المكونات التنبيهية ويحدث تقلص عضلي عنيف.",
                  rule: {
                    prompt: "اكتب خاتمة حول أثر ذيفان الكزاز",
                    keywords: ["تثبيط", "مشبك", "تقلص"],
                    minHits: 2,
                    forbidden: []
                  }
                }
              }
            },
            {
              number: 2,
              ui: "text",
              label: "دواء ML901 والملاريا",
              max: 7,
              desc: "تثبيط تركيب البروتين لدى طفيلي البلاسموديوم المسبب للملاريا بدواء ML901، دون التأثير على خلايا الإنسان",
              poles: {
                N: {
                  points: 1,
                  prompt: "تأطير الإشكالية: كيف يستغل دواء ML901 تثبيط تركيب البروتين لعلاج الملاريا؟",
                  bacPrompt:
                    "كيف يستغل دواء ML901 تثبيط تركيب البروتين لعلاج الملاريا دون الإضرار بخلايا الإنسان؟",
                  ...RECON(
                    "Pas de question officielle autonome de type « حدد المشكل ». Reformulation pédagogique du préambule."
                  ),
                  placeholder: "صياغة المشكل العلمي...",
                  minLength: 30,
                  modelAnswer:
                    "المشكل العلمي: كيف يثبط دواء ML901 تركيب البروتين لدى طفيلي البلاسموديوم دون التأثير على خلايا الإنسان؟",
                  rule: {
                    prompt: "حدد المشكل العلمي حول دواء ML901",
                    keywords: ["ML901", "بروتين", "طفيلي", "تركيب"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                S: {
                  points: 2.5,
                  prompt: "مقارنة النتائج التجريبية للشكل (أ) من الوثيقة 1",
                  bacPrompt: "قارن بين النتائج التجريبية الموضحة في الشكل (أ) من الوثيقة 1.",
                  ...OFFICIAL(
                    2,
                    "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : قارن. Question 1 du الجزء الأول. Consigne « حلّل منحنى الشكل (ب) من الوثيقة 1 » (question 2 du même الجزء) non mappée (un pôle = une consigne).",
                    "2026-08-25"
                  ),
                  placeholder: "قارن بالتوازي: في غياب العلاج وفي وجوده...",
                  minLength: 90,
                  modelAnswer:
                    "تمثل الوثيقة تغير معدل الطفيليات في الدم بدلالة الزمن. نلاحظ في غياب العلاج ارتفاعا متواصلا لمعدل الطفيليات حتى اليوم السابع، بينما ينخفض هذا المعدل مع استعمال ML901 حتى الانعدام. ومنه نستنتج أن دواء ML901 يثبط تكاثر الطفيلي المسبب للملاريا.",
                  rule: {
                    prompt: "قارن بين النتائج التجريبية للشكل أ",
                    keywords: ["علاج", "طفيلي", "معدل", "زمن"],
                    minHits: 2,
                    forbidden: ["بسبب"],
                    document: {
                      kind: "curve",
                      axes: ["معدل", "زمن"],
                      comparisons: [["علاج", "غياب"]],
                      trends: [
                        { about: "علاج", expect: ["انخفاض", "ينخفض"] },
                        { about: "غياب", expect: ["ارتفاع", "يرتفع"] }
                      ],
                      relations: [{ type: "inverse", a: "علاج", b: "معدل" }],
                      values: [],
                      strictValues: false
                    }
                  }
                },
                E: {
                  points: 2.5,
                  prompt: "تبرير أهمية استعمال دواء ML901",
                  bacPrompt: "برّر أهمية استعمال دواء ML901 انطلاقا من معلوماتك ونتائج الوثيقتين 2 و3.",
                  ...OFFICIAL(
                    2,
                    "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : برّر. Question du الجزء الثاني.",
                    "2026-08-25"
                  ),
                  placeholder: "الموقع الفعال، Tyr-ARNt، تثبيط الترجمة...",
                  minLength: 110,
                  modelAnswer:
                    "يستعمل ML901 لعلاج الملاريا لأن الطفيلي لا يستطيع إنتاج بروتيناته بدون الحمض الأميني تيروزين المنشط، إذ يرتبط ML901 بالموقع الفعال لأنزيم تنشيط التيروزين في مكان AMP فيمنع تشكل معقد Tyr-ARNt فتتوقف الترجمة ويموت الطفيلي، بينما لا يتأثر الإنسان لأن أنزيمه لا يثبت الدواء.",
                  rule: {
                    prompt: "برر أهمية استعمال ML901",
                    keywords: ["ML901", "تيروزين", "ARNt", "تنشيط", "ترجمه"],
                    minHits: 3,
                    forbidden: []
                  }
                },
                W: {
                  points: 1,
                  prompt: "الخلاصة: انتقائية دواء ML901",
                  bacPrompt: "ما أهمية انتقائية دواء ML901 في التمييز بين خلايا الطفيلي وخلايا الإنسان؟",
                  ...RECON(
                    "La clôture est incluse dans le justificatif officiel (pôle E). Pas une question BAC autonome."
                  ),
                  placeholder: "في الختام...",
                  minLength: 40,
                  modelAnswer:
                    "في الختام، تكمن أهمية ML901 في انتقائيته: يثبط تنشيط التيروزين عند الطفيلي فقط فيتوقف تركيبه البروتيني دون المساس بخلايا الإنسان.",
                  rule: {
                    prompt: "اكتب خلاصة حول انتقائية ML901",
                    keywords: ["انتقائي", "انسان", "طفيلي"],
                    minHits: 2,
                    forbidden: []
                  }
                }
              }
            },
            {
              number: 3,
              ui: "text",
              label: "سرطان الثدي ومادة الكيرسيتين",
              max: 8,
              desc: "تكاثر خلايا سرطان الثدي بدفع من الأستراديول ودور أنزيم الأروماتاز، واستغلال مادة الكيرسيتين (Quercetin) لإيجاد حلول علاجية",
              poles: {
                N: {
                  points: 0.5,
                  prompt: "اقتراح فرضيتين للحد من تطور سرطان الثدي",
                  bacPrompt:
                    "اقترح فرضيتين للحد من تطور سرطان الثدي باستغلال معلوماتك ونتائج شكلي الوثيقة 1.",
                  ...OFFICIAL(
                    3,
                    "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : اقترح فرضيتين. Question unique du الجزء الأول.",
                    "2026-08-25"
                  ),
                  placeholder: "فرضية 1، فرضية 2...",
                  minLength: 30,
                  modelAnswer:
                    "الفرضية 1: مادة تثبط عمل أنزيم الأروماتاز فتمنع تركيب الأستراديول ولا تتكاثر الخلايا السرطانية. الفرضية 2: مادة تثبت على مستقبلات الأستراديول فتمنع تحفيز تكاثر الخلايا السرطانية.",
                  rule: {
                    prompt: "اقترح فرضيتين للحد من سرطان الثدي",
                    keywords: ["فرضيه", "استراديول", "تكاثر"],
                    minHits: 1,
                    forbidden: [],
                    hypotheses: { min: 2, distinct: true }
                  }
                },
                S: {
                  points: 2.0,
                  prompt: "استغلال الوثيقة 1: تكاثر الخلايا بدلالة الأستراديول ودور البروتينات",
                  bacPrompt:
                    "استغل شكلي الوثيقة 1: تكاثر الخلايا السرطانية بدلالة تراكيز الأستراديول، ودور مستقبل الأستراديول وأنزيم الأروماتاز في هذا التكاثر.",
                  ...RECON(
                    "La page 3 décrit les figures (أ) et (ب) mais la seule consigne écrite est « اقترح فرضيتين ». L'exploitation chiffrée est une étape pédagogique, pas une question officielle autonome."
                  ),
                  placeholder: "قارن بالتوازي: قبل/بعد حقن الأستراديول...",
                  minLength: 60,
                  modelAnswer:
                    "تمثل الوثيقة تكاثر الخلايا السرطانية بدلالة الزمن. نلاحظ ارتفاع تكاثر الخلايا بسرعة بعد حقن الأستراديول مقارنة بما قبله، ويمثل الشكل (ب) كيف يحوّل أنزيم الأروماتاز الأندروجينات إلى أستراديول الذي يثبت على مستقبله الغشائي ويحفز التكاثر.",
                  rule: {
                    prompt: "استغل الوثيقة 1 حول تكاثر الخلايا",
                    keywords: ["تكاثر", "استراديول", "خليه", "اروماتاز"],
                    minHits: 2,
                    forbidden: ["بسبب"],
                    document: {
                      kind: "curve",
                      axes: ["تكاثر", "زمن"],
                      comparisons: [["قبل", "بعد"]],
                      trends: [{ about: "بعد", expect: ["ارتفاع", "يرتفع"] }],
                      values: [],
                      strictValues: false
                    }
                  }
                },
                E: {
                  points: 4.0,
                  prompt: "مناقشة صحة الفرضيتين وتقديم نصيحة",
                  bacPrompt:
                    "ناقش صحة الفرضيتين المقترحتين اعتمادا على معلوماتك ونتائج الوثيقتين 2 و3، ثم قدّم نصيحة للوقاية من سرطان الثدي.",
                  ...OFFICIAL(
                    4,
                    "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : ناقش. Question du الجزء الثاني (la نصيحة finale est incluse dans la même consigne).",
                    "2026-08-25"
                  ),
                  placeholder: "الموقع الفعال للأروماتاز، مستقبل الأستراديول...",
                  minLength: 110,
                  modelAnswer:
                    "تثبت مادة الكيرسيتين على الموقع الفعال لأنزيم الأروماتاز فتثبط نشاطه وتمنع تركيب الأستراديول، كما تثبت على مستقبل الأستراديول فتمنع تشكل معقد أستراديول-مستقبل؛ ومنه تتراجع وتيرة تكاثر الخلايا السرطانية ونمو الورم، فتتأكد الفرضيتان معا. النصيحة: تناول الخضروات الغنية بالكيرسيتين للوقاية من سرطان الثدي.",
                  rule: {
                    prompt: "ناقش صحة الفرضيتين باستغلال الوثيقتين 2 و3",
                    keywords: ["اروماتاز", "كيرسيتين", "مستقبل", "استراديول", "فرضيه"],
                    minHits: 3,
                    forbidden: []
                  }
                },
                W: {
                  points: 1.5,
                  prompt: "المخطط: تطور الورم في غياب ووجود الكيرسيتين",
                  bacPrompt:
                    "لخّص في مخطط بيانات ما توصلت إليه في هذه الدراسة حول تطور الورم السرطاني في غياب ووجود مادة الكيرسيتين معتمدا على معلوماتك ومكتسباتك.",
                  ...OFFICIAL(
                    4,
                    "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : لخّص في مخطط. Question du الجزء الثالث.",
                    "2026-08-25"
                  ),
                  placeholder: "أستراديول → تكاثر → ورم؛ وفي وجود الكيرسيتين...",
                  minLength: 0,
                  modelAnswer:
                    "عنوان المخطط: تطور الورم السرطاني. أستراديول → مستقبله → تكاثر الخلايا السرطانية → نمو الورم، وفي وجود الكيرسيتين يتوقف التكاثر ويتراجع الورم.",
                  rule: {
                    prompt: "لخص في مخطط تطور الورم",
                    keywords: ["مخطط", "ورم", "كيرسيتين"],
                    minHits: 1,
                    forbidden: [],
                    schema: { arrows: true, title: "تطور الورم", ordered: ["استراديول", "تكاثر", "كيرسيتين"] }
                  }
                }
              }
            }
          ]
        },
        {
          id: 2,
          pdf: null,
          pdfAvailable: false,
          pdfExternalUrl:
            "https://www.dzexams.com/uploads/sujets/officiels/bac/2023/dzexams-bac-sciences-naturelles-1780707.pdf",
          pdfNote:
            "PDF non redistribué dans le dépôt ; même fichier que le sujet 1 (session normale, sujets 1 et 2 réunis). Couche texte inversée reconstituée mot à mot (2026-08-25).",
          title: "الموضوع الثاني",
          exercises: [
            {
              number: 1,
              ui: "text",
              label: "البنية الفراغية للبروتين والطفرات",
              max: 5,
              desc: "الروابط المسؤولة عن استقرار البنية الفراغية للبروتين، ودور التتابع النوكليوتيدي للمورثة في الحفاظ على وظيفة البروتين وأثر الطفرات",
              poles: {
                N: {
                  points: 1,
                  prompt: "تأطير الإشكالية: كيف تضمن المورثة استقرار بنية البروتين ووظيفته؟",
                  bacPrompt:
                    "كيف يضمن التتابع النوكليوتيدي في المورثة استقرار البنية الفراغية للبروتين ووظيفته، وكيف تؤثر الطفرات في ذلك؟",
                  ...RECON(
                    "Pas de question officielle autonome de type « حدد المشكل ». Reformulation pédagogique du préambule."
                  ),
                  placeholder: "صياغة المشكل العلمي...",
                  minLength: 30,
                  modelAnswer:
                    "المشكل العلمي: كيف يضمن التتابع النوكليوتيدي في المورثة استقرار البنية الفراغية للبروتين ووظيفته، وكيف يؤثر تغيره (الطفرة) في فقدان التخصص الوظيفي؟",
                  rule: {
                    prompt: "حدد المشكل العلمي حول بنية البروتين",
                    keywords: ["نوكليوتيد", "بروتين", "طفره", "بنيه"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                S: {
                  points: 1,
                  prompt: "اختيار العبارات الصحيحة حول البنية الفراغية للبروتين",
                  bacPrompt:
                    "اختر العبارة الصحيحة من العبارات المقترحة لإكمال الجمل التالية: أ- الروابط التكافئية التي تساهم في استقرار البنية الفراغية للبروتينات هي… ب- تتوقف البنية الفراغية وبالتالي التخصص الوظيفي للبروتينات على… ت- إن ترتيب الأحماض الأمينية في السلسلة البيبتيدية يفرضه ترتيب… في… ث- أصل الطفرة الوراثية هو تغير على مستوى…",
                  ...OFFICIAL(
                    5,
                    "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : اختر العبارة الصحيحة. Question 1 (QCM à 4 items : جسور ثنائية الكبريت، الروابط بين أحماض أمينية، ARNm، ADN).",
                    "2026-08-25"
                  ),
                  placeholder: "أ- جسور ثنائية الكبريت، ب- …، ت- ARNm، ث- ADN...",
                  minLength: 30,
                  modelAnswer:
                    "أ- جسور ثنائية الكبريت فقط. ب- الروابط التي تنشأ بين أحماض أمينية محددة وموضعة بشكل دقيق في السلسلة البيبتيدية. ت- ترتيب الترميزات في ARNm. ث- تغير على مستوى ADN.",
                  rule: {
                    prompt: "اختر العبارة الصحيحة حول بنية البروتين",
                    keywords: ["كبريت", "ARNm", "ADN", "امينيه"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                E: {
                  points: 2,
                  prompt: "النص العلمي: دور مكونات المورثة وأثر الطفرات",
                  bacPrompt:
                    "أبرز في نص علمي دور بعض مكونات المورثة في الحفاظ على التتابع النوكليوتيدي وفي وظيفة البروتين وكيف تؤثر الطفرات في فقدان التخصص الوظيفي (النص العلمي مهيكل بمقدمة وعرض وخاتمة).",
                  ...OFFICIAL(
                    5,
                    "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : أبرز. Question 2 (texte scientifique structuré).",
                    "2026-08-25"
                  ),
                  placeholder: "مقدمة، عرض، خاتمة...",
                  minLength: 120,
                  modelAnswer:
                    "يتحدد التتابع النوكليوتيدي للـ ARNm بالنسخ انطلاقا من إحدى سلسلتي ADN بتدخل أنزيم ARNp، وكل رامزة (ثلاثية نوكليوتيدات) ترمز لحمض أميني محدد تُربط أثناء الترجمة وفق ترتيب الترميزات فتتشكل السلسلة البيبتيدية وتنطوي إلى بنية فراغية محددة تحدد وظيفتها. أي تغير (طفرة) في تتابع النوكليوتيدات يغيّر نوع أو عدد الأحماض الأمينية فيفقد البروتين بنيته الفراغية وتخصصه الوظيفي.",
                  rule: {
                    prompt: "اكتب نصا علميا حول مكونات المورثة والطفرات",
                    keywords: ["تتابع", "نوكليوتيد", "بروتين", "طفره", "تخصص"],
                    minHits: 3,
                    forbidden: []
                  }
                },
                W: {
                  points: 1,
                  prompt: "الخاتمة: أثر الطفرة على وظيفة البروتين",
                  bacPrompt: "ما أثر تغير التتابع النوكليوتيدي على البنية الفراغية والتخصص الوظيفي للبروتين؟",
                  ...RECON(
                    "La clôture est incluse dans le texte scientifique officiel (pôle E). Pas une question BAC autonome."
                  ),
                  placeholder: "في الختام...",
                  minLength: 40,
                  modelAnswer:
                    "في الختام، أي طفرة في التتابع النوكليوتيدي قد تغير البنية الفراغية للبروتين فيفقد تخصصه الوظيفي.",
                  rule: {
                    prompt: "اكتب خاتمة حول أثر الطفرة",
                    keywords: ["طفره", "وظيفه", "بروتين"],
                    minHits: 2,
                    forbidden: []
                  }
                }
              }
            },
            {
              number: 2,
              ui: "text",
              label: "الخلايا التائية السامة والبيرفورين",
              max: 7,
              desc: "إقصاء الخلايا المصابة ببروتين البيرفورين الذي تفرزه الخلايا التائية السامة (LTc)، وآلية حماية هذه الخلايا لنفسها من تأثيره",
              poles: {
                N: {
                  points: 1,
                  prompt: "تأطير الإشكالية: كيف تحمي الخلايا LTc نفسها من البيرفورين؟",
                  bacPrompt:
                    "كيف تحمي الخلايا التائية السامة (LTc) نفسها من تأثير بروتين البيرفورين الذي تفرزه لإقصاء الخلايا المصابة؟",
                  ...RECON(
                    "Pas de question officielle autonome de type « حدد المشكل ». Reformulation pédagogique du préambule."
                  ),
                  placeholder: "صياغة المشكل العلمي...",
                  minLength: 30,
                  modelAnswer:
                    "المشكل العلمي: كيف تحمي الخلايا التائية السامة (LTc) نفسها من تأثير البيرفورين الذي تفرزه، بينما تتأثر به الخلايا المصابة؟",
                  rule: {
                    prompt: "حدد المشكل العلمي حول حماية LTc",
                    keywords: ["لمفاويه", "بيرفورين", "مصابه", "خليه"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                S: {
                  points: 2.5,
                  prompt: "تحليل مقارن للبنية الجزيئية لغشاء LTc والخلايا المصابة",
                  bacPrompt:
                    "قدّم تحليلا مقارنا للبنية الجزيئية لغشاء الـ LTc والخلايا المصابة الممثلة في الشكل (أ) من الوثيقة 1.",
                  ...OFFICIAL(
                    6,
                    "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : قدّم تحليلا مقارنا. Question 1 du الجزء الأول. Consigne « برّر الاختلاف بين بنية غشاء LTc والخلايا المصابة » (question 2) non mappée (un pôle = une consigne).",
                    "2026-08-25"
                  ),
                  placeholder: "قارن: الكوليسترول، البيرفورين، الغشاء...",
                  minLength: 90,
                  modelAnswer:
                    "تمثل الوثيقة البنية الجزيئية لغشاء LTc وغشاء الخلية المصابة. يتشابه الغشاءان في كونهما طبقة ثنائية فوسفوليبيدية تحتوي كوليسترول، بينما يختلفان في نسبة الكوليسترول (أعلى عند LTc) وفي وجود قنوات البيرفورين المتشكلة فقط على غشاء الخلية المصابة. ومنه نستنتج أن غشاء LTc يتميز عن غشاء الخلية المصابة بنسبة الكوليسترول وغياب قنوات البيرفورين.",
                  rule: {
                    prompt: "حلل البنية الجزيئية لغشائي LTc والمصابة",
                    keywords: ["غشاء", "كوليسترول", "بيرفورين", "لمفاويه"],
                    minHits: 2,
                    forbidden: ["بسبب"],
                    document: {
                      kind: "curve",
                      axes: ["بنيه", "غشاء"],
                      comparisons: [["LTc", "مصابه"]],
                      trends: [{ about: "LTc", expect: ["كوليسترول", "اعلي"] }],
                      relations: [{ type: "parallel", a: "LTc", b: "مصابه" }],
                      values: [],
                      strictValues: false
                    }
                  }
                },
                E: {
                  points: 2.5,
                  prompt: "شرح آلية حماية الخلايا LTc لنفسها من البيرفورين",
                  bacPrompt:
                    "اشرح الآلية التي تحمي بها الخلايا (LTc) نفسها من تأثير البيرفورين انطلاقا من النتائج المبينة في أشكال الوثيقة 2.",
                  ...OFFICIAL(
                    6,
                    "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : اشرح. Question du الجزء الثاني.",
                    "2026-08-25"
                  ),
                  placeholder: "الكوليسترول، السيولة الغشائية، تثبيت البيرفورين...",
                  minLength: 110,
                  modelAnswer:
                    "تعود حماية الخلايا LTc لنفسها إلى ارتفاع نسبة الكوليسترول والفينغومييلين (SM) في غشائها مما يخفض سيولته الغشائية، فيتعذر تثبيت البيرفورين وتشكل القنوات، فلا تتسرب إنزيمات الغرانزيم إلى داخل LTc؛ عكس غشاء الخلية المصابة الأفقر في الكوليسترول الذي يسمح بتثبيت البيرفورين وتشكل القنوات فتُخرَّب الخلية.",
                  rule: {
                    prompt: "اشرح آلية حماية LTc من البيرفورين",
                    keywords: ["غشاء", "بيرفورين", "كوليسترول", "حمايه", "تثبيت"],
                    minHits: 3,
                    forbidden: []
                  }
                },
                W: {
                  points: 1,
                  prompt: "الخلاصة: حماية الذات أثناء الإقصاء المناعي",
                  bacPrompt: "ما الميزة البنيوية التي تحمي الخلايا LTc أثناء إقصائها للخلايا المصابة؟",
                  ...RECON(
                    "La clôture est incluse dans l'explication officielle (pôle E). Pas une question BAC autonome."
                  ),
                  placeholder: "في الختام...",
                  minLength: 40,
                  modelAnswer:
                    "في الختام، يحمي ارتفاع الكوليسترول والفينغومييلين غشاء LTc من تشكل قنوات البيرفورين فتنجو الخلية المناعية أثناء تخريبها للخلايا المصابة.",
                  rule: {
                    prompt: "اكتب خلاصة حول حماية LTc",
                    keywords: ["حمايه", "لمفاويه", "بيرفورين"],
                    minHits: 2,
                    forbidden: []
                  }
                }
              }
            },
            {
              number: 3,
              ui: "text",
              label: "مبيد DCMU والمرحلة الكيميائية الضوئية",
              max: 8,
              desc: "آلية تأثير مبيد DCMU على المرحلة الكيميائية الضوئية (النظام الضوئي الثاني PSII) وتحويل الطاقة الضوئية عند النباتات",
              poles: {
                N: {
                  points: 0.5,
                  prompt: "اقتراح فرضيتين حول آلية تأثير DCMU",
                  bacPrompt:
                    "اقترح فرضيتين حول آلية تأثير DCMU على المرحلة الكيميائية الضوئية مستغلا معلوماتك ونتائج أشكال الوثيقة 1.",
                  ...OFFICIAL(
                    7,
                    "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : اقترح فرضيتين. Question unique du الجزء الأول.",
                    "2026-08-25"
                  ),
                  placeholder: "فرضية 1، فرضية 2...",
                  minLength: 30,
                  modelAnswer:
                    "الفرضية 1: يثبط DCMU أكسدة الماء (النظام الضوئي الثاني) فيتوقف تحرر الإلكترونات. الفرضية 2: يمنع DCMU انتقال الإلكترونات نحو الناقل الأول T1 فتتوقف السلسلة التركيبية الضوئية.",
                  rule: {
                    prompt: "اقترح فرضيتين حول تأثير DCMU",
                    keywords: ["فرضيه", "DCMU", "ضوء"],
                    minHits: 1,
                    forbidden: [],
                    hypotheses: { min: 2, distinct: true }
                  }
                },
                S: {
                  points: 2.0,
                  prompt: "استغلال الوثيقة 1: تحرر O2 واختزال DCPIP في الضوء والظلام",
                  bacPrompt:
                    "استغل أشكال الوثيقة 1: نسبة الأكسجين المطروح واختزال DCPIP بدلالة الزمن في وجود الضوء وفي الظلام وبدلالة تراكيز DCMU.",
                  ...RECON(
                    "La page 7 décrit les figures (أ/ب/ج) mais la seule consigne écrite est « اقترح فرضيتين ». L'exploitation chiffrée est une étape pédagogique, pas une question officielle autonome."
                  ),
                  placeholder: "في الضوء/في الظلام، DCPIP، O₂...",
                  minLength: 60,
                  modelAnswer:
                    "تمثل الوثيقة نسبة الأكسجين المطروح واختزال DCPIP بدلالة الزمن. نلاحظ في الضوء ارتفاعا في تحرر O2 واختزال DCPIP، بينما لا يحدث أي تحرر في الظلام، كما ينخفض تحرر O2 بارتفاع تركيز DCMU حتى الانعدام. ومنه نستنتج أن الضوء ضروري لأكسدة الماء وأن DCMU يثبط المرحلة الكيميائية الضوئية.",
                  rule: {
                    prompt: "استغل الوثيقة 1 حول تأثير DCMU",
                    keywords: ["اكسجين", "DCPIP", "ضوء", "ظلام"],
                    minHits: 2,
                    forbidden: ["بسبب"],
                    document: {
                      kind: "curve",
                      axes: ["اكسجين", "زمن"],
                      comparisons: [["ضوء", "ظلام"]],
                      trends: [{ about: "ضوء", expect: ["ارتفاع", "يرتفع"] }],
                      relations: [{ type: "inverse", a: "DCMU", b: "اكسجين" }],
                      values: [],
                      strictValues: false
                    }
                  }
                },
                E: {
                  points: 4.0,
                  prompt: "مناقشة صحة إحدى الفرضيتين",
                  bacPrompt:
                    "ناقش صحة إحدى الفرضيتين المقترحتين مستغلا معلوماتك والنتائج الممثلة في أشكال الوثيقة 2.",
                  ...OFFICIAL(
                    9,
                    "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : ناقش. Question 1 du الجزء الثاني. Consigne « قدّم نصيحة للمزارعين » (question 2 du même الجزء) non mappée (un pôle = une consigne).",
                    "2026-08-25"
                  ),
                  placeholder: "PSII، الناقل T1، انتقال الإلكترونات...",
                  minLength: 110,
                  modelAnswer:
                    "تتأكد الفرضية الثانية: عند غياب DCMU يواصل PSII امتصاص الفوتونات الضوئية وأكسدة الماء فيحرر إلكترونين يختزلان الناقل T1، أما في وجود DCMU فيثبت المبيد على جزء من PSII مانعا انتقال الإلكترونات نحو T1 فتتوقف أكسدة الماء وخض البروتونات نحو جوف التيلاكوئيد. النصيحة: ترشيد استعمال المبيدات أو استبدالها بمبيدات بيولوجية.",
                  rule: {
                    prompt: "ناقش صحة الفرضية حول تأثير DCMU",
                    keywords: ["DCMU", "PSII", "الكترون", "ناقل", "اكسده"],
                    minHits: 3,
                    forbidden: []
                  }
                },
                W: {
                  points: 1.5,
                  prompt: "رسم تخطيطي وظيفي لتحويل الطاقة الضوئية",
                  bacPrompt:
                    "حوّل في رسم تخطيطي وظيفي آليات تحويل الطاقة الضوئية خلال المرحلة الكيميائية الضوئية معتمدا على البيانات ومعلوماتك في غياب المبيد ووجوده (DCMU).",
                  ...OFFICIAL(
                    11,
                    "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : حوّل في رسم تخطيطي. Question du الجزء الثالث.",
                    "2026-08-25"
                  ),
                  placeholder: "ضوء → PSII → إلكترونات → T1 → H⁺...",
                  minLength: 0,
                  modelAnswer:
                    "عنوان المخطط: تحويل الطاقة الضوئية. في غياب DCMU: ضوء → PSII → أكسدة الماء → إلكترونات → الناقل T1 → خض H⁺ إلى جوف التيلاكوئيد. في وجود DCMU: يثبت المبيد على PSII فيتوقف انتقال الإلكترونات إلى T1 وتتوقف أكسدة الماء.",
                  rule: {
                    prompt: "حول في رسم تخطيطي آليات تحويل الطاقة",
                    keywords: ["ضوء", "PSII", "DCMU"],
                    minHits: 1,
                    forbidden: [],
                    schema: { arrows: true, title: "تحويل الطاقة", ordered: ["ضوء", "PSII", "الكترون"] }
                  }
                }
              }
            }
          ]
        }
      ]
    }
  ]
};
