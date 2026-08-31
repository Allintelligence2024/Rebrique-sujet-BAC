/* ============================================================
   CONFIGURATION DATA-DRIVEN  (BAC SVT Algérie)
   ------------------------------------------------------------
   2025 : consignes confrontées au PDF scanné du dépôt
          (rendu visuel page par page, 2026-08-23).
   2024 : consignes des pages 2, 6, 7 et 10 relues sur photos du
          sujet officiel ONEC (2026-08-31) ; le reste reconstructed.
   2023 : consignes lues sur le PDF dzexams (couche texte inversée,
          reconstituée mot à mot, 2026-08-25).
   2022 : consignes relues sur le PDF dzexams officiel (ONEC,
          couche texte inversée, reconstituée mot à mot,
          2026-08-27) ; corrigé officiel (الإجابة النموذجية)
          joint au même PDF (pp. 11-21), croisé avec eddirasa
          (textes concordants).
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
  note: "المحتوى 2025 مُراجع على PDF المستودع. 2024: صفحات 2 و6 و7 و10 مُراجعة على صور الموضوع الرسمي؛ الباقي مُعاد بناؤه. 2023 مُستخرج من PDF dzexams (نص معكوس مُعاد بناؤه).",
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
            "PDF non redistribué dans le dépôt ; source: https://eddirasa.com/bac-science-2024-se/ (consulté 2026-08-25). Miroir dzexams: https://www.dzexams.com/ar/annales/bkVXVzlvRTlpV1RMYUk5cGNyS3oxdz09 · PDF: https://www.dzexams.com/uploads/sujets/officiels/bac/2024/dzexams-bac-sciences-naturelles-1751784.pdf. Pages 2, 6, 7 et 10 relues sur photos du sujet officiel (2026-08-31). Viewer dzexams bloqué (0 pages) dans la sandbox. Session de remplacement non localisée.",
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
                  bacPrompt: "حلّل النتائج الممثّلة في الشكل (أ) من الوثيقة 1.",
                  ...OFFICIAL(
                    2,
                    "Relecture visuelle photo page 2 du sujet officiel 2024 (ONEC). Verbe officiel : حلّل. Question 1 du الجزء الأول (Sujet 1, Ex2).",
                    "2026-08-31"
                  ),
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
                  ...OFFICIAL(
                    2,
                    "Relecture visuelle photo page 2 du sujet officiel 2024 (ONEC). Verbe officiel : بيّن. Question 2 du الجزء الأول (Sujet 1, Ex2).",
                    "2026-08-31"
                  ),
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
            "PDF non redistribué dans le dépôt ; même fichier que le sujet 1 (session normale, sujets 1 et 2). Pages 6, 7 et 10 relues sur photos du sujet officiel (2026-08-31). Viewer dzexams bloqué dans la sandbox.",
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
                  bacPrompt: "اذكر العناصر المتدخّلة في حدوث هذه المرحلة.",
                  ...OFFICIAL(
                    6,
                    "Relecture visuelle photo page 6 du sujet officiel 2024 (ONEC). Verbe officiel : اذكر. Question 1 du التمرين الأول (Sujet 2).",
                    "2026-08-31"
                  ),
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
                    "اشرح في نص علمي خطوات الترجمة وتأثير كل من Oxazolidinone و Tetracycline عليها باستغلال الوثيقة ومعلوماتك (النص العلمي مهيكل في مقدمة وعرض وخاتمة).",
                  ...OFFICIAL(
                    6,
                    "Relecture visuelle photo page 6 du sujet officiel 2024 (ONEC). Verbe officiel : اشرح. Question 2 du التمرين الأول (Sujet 2).",
                    "2026-08-31"
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
                  bacPrompt: "حلّل النتائج الممثّلة في الشكل (أ) من الوثيقة 1.",
                  ...OFFICIAL(
                    7,
                    "Relecture visuelle photo page 7 du sujet officiel 2024 (ONEC). Verbe officiel : حلّل. Question 1 du الجزء الأول (Sujet 2, Ex2).",
                    "2026-08-31"
                  ),
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
                    "أبرز العلاقة بين كمية (CA1P) في الأوراق ونسبة نشاط الأنزيم (Rubisco) انطلاقا من نتائج الشكل (ب) والمعلومة المستخلصة من الشكل (أ) من الوثيقة 1.",
                  ...OFFICIAL(
                    7,
                    "Relecture visuelle photo page 7 du sujet officiel 2024 (ONEC). Verbe officiel : أبرز. Question 2 du الجزء الأول (Sujet 2, Ex2). Consigne du الجزء الثاني (mécanisme du الظلام) non mappée (un pôle = une consigne).",
                    "2026-08-31"
                  ),
                  placeholder: "CA1P، الموقع الفعال، تثبيط...",
                  minLength: 110,
                  modelAnswer:
                    "في الظلام يتراكم مثبط CA1P الذي يتثبت على الموقع الفعال لأنزيم RUBISCO فيمنع تثبيت CO2 على الريبولوز ثنائي الفوسفات، فلا يتشكل المركب السداسي ولا حمض الفوسفوغليسيريك، فتتوقف تفاعلات تثبيت CO2 في أوراق الفاصولياء.",
                  rule: {
                    prompt: "أبرز العلاقة بين كمية CA1P ونشاط Rubisco",
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
                  prompt: "مناقشة صحة الفرضية حول بروتين SPA والإفلات المناعي",
                  bacPrompt: "ناقش صحة إحدى الفرضيتين المقترحتين باستغلالك لأشكال الوثيقة 2 ومعلوماتك.",
                  ...OFFICIAL(
                    10,
                    "Relecture visuelle photo page 10 du sujet officiel 2024 (ONEC). Verbe officiel : ناقش. Question 1 du الجزء الثاني (Sujet 2, Ex3). Consigne اقترح حلا للمشكل non mappée (un pôle = une consigne).",
                    "2026-08-31"
                  ),
                  placeholder: "SPA، جسم مضاد، بلعمة...",
                  minLength: 110,
                  modelAnswer:
                    "يرتبط بروتين SPA الموجود على جدار Staphylococcus aureus بالقطعة Fc للأجسام المضادة فيمنع تثبيتها عبر مواقعها المتغيرة على المستضد ويعطل البلعمة، فتستفيد البكتيريا من الإفلات المناعي. وللقضاء عليها تُستعمل سيرورة تحييد SPA لاستعادة التعرف النوعي وتسهيل البلعمة.",
                  rule: {
                    prompt: "ناقش صحة الفرضية باستغلال الوثيقة 2",
                    keywords: ["SPA", "جسم", "مضاد", "بلعمه", "مستضد"],
                    minHits: 3,
                    forbidden: []
                  }
                },
                W: {
                  points: 1.5,
                  prompt: "مخطط الاستجابة المناعية الخلطية في وجود وغياب البكتيريا",
                  bacPrompt:
                    "لخّص في مخطط مراحل الاستجابة المناعية الخلطية في وجود وغياب بكتيريا Staphylococcus aureus اعتمادا على ما سبق ومعلوماتك.",
                  ...OFFICIAL(
                    10,
                    "Relecture visuelle photo page 10 du sujet officiel 2024 (ONEC). Verbe officiel : لخّص في مخطط. Question du الجزء الثالث (Sujet 2, Ex3).",
                    "2026-08-31"
                  ),
                  placeholder: "في الختام...",
                  minLength: 0,
                  modelAnswer:
                    "عنوان المخطط: الاستجابة المناعية الخلطية. في غياب SPA: مستضد → جسم مضاد → بلعمة. في وجود Staphylococcus aureus و SPA: ارتباط SPA بالقطعة Fc يعطل البلعمة.",
                  rule: {
                    prompt: "لخص في مخطط الاستجابة المناعية الخلطية",
                    keywords: ["مخطط", "SPA", "بلعمه"],
                    minHits: 1,
                    forbidden: [],
                    schema: { arrows: true, title: "استجابة", ordered: ["مستضد", "جسم", "بلعمه"] }
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
    },
    {
      id: "2022",
      label: "بكالوريا الجزائر دورة 2022",
      badge: "دورة رسمية",
      theme: "rose",
      enabled: true,
      sujets: [
        {
          id: 1,
          pdf: null,
          pdfAvailable: false,
          pdfExternalUrl:
            "https://www.dzexams.com/uploads/sujets/officiels/bac/2022/dzexams-bac-sciences-2311208.pdf",
          pdfNote:
            "PDF officiel (ONEC, pp. 1-5 pour ce sujet) non redistribué dans le dépôt ; page : https://www.dzexams.com/ar/annales/eVlXSFRFOEJaN2ozSlE3NytzWkRHQT09 (consulté 2026-08-27). La couche texte du PDF est inversée (miroir mot à mot) ; les consignes ont été reconstituées mot à mot à partir de cette couche. Corrigé officiel (الإجابة النموذجية) joint au même PDF (pp. 11-21) et croisé avec : https://eddirasa.com/correction-bac-science-2022-se/ — textes concordants.",
          title: "الموضوع الأول",
          exercises: [
            {
              number: 1,
              ui: "text",
              label: "الغشاء الهيولي: التمييز بين الذات واللاذات",
              max: 5,
              desc: "بنية الغشاء الهيولي (طبقتان فسفوليبيد + بروتينات) ودور مكوناته (CMH, ABO, Rh, BCR, TCR) في تحديد الذات والتعرف على اللاذات",
              poles: {
                N: {
                  points: 1,
                  prompt: "تأطير الإشكالية: كيف يحدد الغشاء الهيولي ذات الخلية ويتعرف على اللاذات؟",
                  bacPrompt:
                    "المشكل: كيف يحدد الغشاء الهيولي ذات الخلية ويتعرف على اللاذات انطلاقا من مكوناته البروتينية؟",
                  ...RECON(
                    "Pas de question officielle autonome de type « حدد المشكل ». Reformulation pédagogique du préambule page 1 (lisible : « يتميّز الغشاء الهيولي بتركيب كميائي وتنظيم جزئي أكسبه قدرة التمييز بين الذات واللاذات بواسطة جزيئات بروتينية »)."
                  ),
                  placeholder: "صياغة المشكل العلمي...",
                  minLength: 30,
                  modelAnswer:
                    "المشكل العلمي: كيف تتيح مكونات الغشاء الهيولي البروتينية (CMH, ABO, Rh, BCR, TCR) للخلية تحديد ذاتها والتعرف على اللاذات؟",
                  rule: {
                    prompt: "حدد المشكل العلمي حول الغشاء الهيولي",
                    keywords: ["ذات", "لاذات", "بروتين"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                S: {
                  points: 1,
                  prompt: "وصف بنية الغشاء الهيولي ومميزات مكوناته",
                  bacPrompt: "صف بنية الغشاء الهيولي واذكر مميزات مكوناته.",
                  ...OFFICIAL(
                    1,
                    "Relecture du PDF dzexams 2022 (couche texte inversée, reconstituée). Verbes officiels : صف / اذكر. Question 1 du التمرين الأول (Sujet 1). Le corrigé officiel (p. 11) détaille la réponse attendue (2 couches, rôle des protéines, tête hydrophile).",
                    "2026-08-27"
                  ),
                  placeholder: "طبقتان فسفوليبيد، رأس محب للماء، ذيل كاره للماء...",
                  minLength: 30,
                  modelAnswer:
                    "الغشاء الهيولي مكوّن من طبقتين فسفوليبيد تشكلان الطبقة الوسطى ذات الطبيعة الليبوفيلية (كارهة للماء) المحاطة بأطراف قطبية محبة للماء، واختلاف وظائفه وبنية مكوناته ناتج عن البروتينات (بروتينات سطحية خارجية وداخلية وبروتين ضمني). مميزات المكونات: الرأس الفسفوي (القطب الكيميائي) محب للماء، والذيل الليبيدي كاره للماء.",
                  rule: {
                    prompt: "صف بنية الغشاء الهيولي ومميزات مكوناته",
                    keywords: ["فسفوليب", "بروتين", "طبقتين", "كارهه"],
                    minHits: 3,
                    forbidden: []
                  }
                },
                E: {
                  points: 2,
                  prompt: "النص العلمي: دور مكونات الغشاء الهيولي في تحديد الذات والتعرف على اللاذات",
                  bacPrompt:
                    "وضح في نص علمي مهيكل ومنظم دور مختلف مكونات الغشاء الهيولي المتدخلة في تحديد الذات والتعرف على اللاذات انطلاقا مما تقدمه الوثيقة واعتمادا على معلوماتك.",
                  ...OFFICIAL(
                    1,
                    "Relecture du PDF dzexams 2022 (couche texte inversée, reconstituée). Verbe officiel : وضّح في نص علمي مهيكل ومنظم. Question 2 du التمرين الأول (Sujet 1). Le corrigé officiel (p. 11) fournit le texte attendu : CMH I/II, ABO, Rh, BCR, TCR.",
                    "2026-08-27"
                  ),
                  placeholder: "مقدمة، عرض (CMH, ABO, Rh, BCR, TCR)، خاتمة...",
                  minLength: 110,
                  modelAnswer:
                    "الغشاء الهيولي يكتسب بواسطة بروتيناته الغشائية القدرة على تحديد الذات والتعرف على اللاذات: نظام CMH (HLA) يتكون من بروتينات سكريات دهنية توجد على سطح جميع الخلايا حقيقية النواة (النوع I) وعلى سطح بعض الخلايا المناعية أساسا (النوع II - الخلايا العارضة). نظام ABO: بروتينات سكرية دهنية توجد على غشاء كريات الدم الحمراء يحدد رمزها المجموعة الدموية. نظام Rh: بروتينات المستضد (D) توجد على غشاء كريات الدم الحمراء في حالة المجموعة (Rh+). المستقبل BCR: غليكوبروتين يوجد على سطح الخلايا LB يسمح للخلية بالتعرف على مستضد معين. المستقبل TCR: غليكوبروتين يوجد على سطح الخلايا LT4 يسمح بالتعرف على الببتيد المستضد معروض على CMHII، وعلى سطح الخلايا LT8 يسمح بالتعرف على الببتيد المستضد معروض على CMHI (تعرّف مزدوج). بضم هذه البروتينات الغشائية يكون للغشاء الهيولي القدرة على تحديد الذات والتعرف على اللاذات، فكل ما لا يحمل هذه المكونات يُعد عنصرا غريبا (لاذاتيا).",
                  rule: {
                    prompt: "اكتب نصا علميا حول مكونات الغشاء الهيولي",
                    keywords: ["cmh", "abo", "rh", "bcr", "tcr", "ذات", "لاذات"],
                    minHits: 3,
                    forbidden: []
                  }
                },
                W: {
                  points: 1,
                  prompt: "الخاتمة: الدور الحاسم للبروتينات الغشائية في تحديد الذات",
                  bacPrompt:
                    "ما الدور الحاسم للبروتينات الغشائية في قدرة الخلية على التمييز بين الذات واللاذات؟",
                  ...RECON(
                    "Clôture issue du corrigé officiel (p. 11) : « بروتينات الغشاء تضيف للغشاء القدرة على تحديد الذات والتعرف على اللاذات ». Ce pôle isole pédagogiquement la clôture (question BAC autonome introuvable)."
                  ),
                  placeholder: "في الختام...",
                  minLength: 40,
                  modelAnswer:
                    "في الختام، بروتينات الغشاء الهيولي هي التي تمنحه القدرة على تحديد الذات والتعرف على اللاذات، فكل جزيء غريب عن هذه المكونات يُعامل كعنصر لاذاتي.",
                  rule: {
                    prompt: "اكتب خاتمة حول دور البروتينات الغشائية",
                    keywords: ["بروتين", "ذات", "لاذات"],
                    minHits: 2,
                    forbidden: []
                  }
                }
              }
            },
            {
              number: 2,
              ui: "text",
              label: "منطقة التشابك على مستوى النخاع الشوكي (الغلوتامات و GABA)",
              max: 7,
              desc: "أنواع المشابك (منبّهة/مثبطة) على مستوى المادة الرمادية للنخاع الشوكي، ودور مستقبلات GABA (a/b) في كبح الرسالة العصبية وتأمين استرخاء العضلة",
              poles: {
                N: {
                  points: 1,
                  prompt:
                    "تأطير الإشكالية: كيف تؤمن البروتينات الغشائية تقلص العضلة واسترخائها خلال المنعكسات؟",
                  bacPrompt:
                    "المشكل: كيف تؤمن البروتينات الغشائية على مستوى مناطق التشابك في النخاع الشوكي تقلص العضلة واسترخائها (المنعكس العضلي)؟",
                  ...RECON(
                    "Pas de question officielle autonome de type « حدد المشكل ». Reformulation pédagogique du préambule page 2 (lisible : « يؤمن نشاط العضلات خلال المنعكسات العضلية بروتينات غشائية نوعية بعضها تعمل بتأثير مبلغات عصبية على مستوى مناطق التشابك »)."
                  ),
                  placeholder: "صياغة المشكل العلمي...",
                  minLength: 30,
                  modelAnswer:
                    "المشكل العلمي: كيف تتدخل البروتينات الغشائية (المستقبلات النوعية) على مستوى مناطق التشابك في النخاع الشوكي لتأمين تقلص العضلة واسترخائها خلال المنعكسات العضلية؟",
                  rule: {
                    prompt: "حدد المشكل العلمي حول مناطق التشابك",
                    keywords: ["تشابك", "عضله", "بروتين"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                S: {
                  points: 2.5,
                  prompt: "بيان العلاقة بين أنواع المشابك والمبلغات العصبية المدروسة",
                  bacPrompt:
                    "بيّن باستغلالك لنتائج الشكل (ب) العلاقة بين أنواع المشابك الممثّلة في الشكل (أ) والمبلغات العصبية المدروسة.",
                  ...OFFICIAL(
                    2,
                    "Relecture du PDF dzexams 2022 (couche texte inversée, reconstituée). Verbe officiel : بيّن. Question du الجزء الأول (Sujet 1, Ex2). Le corrigé officiel (p. 12) détaille les 3 enregistrements (ج1/ج2/ج3) et les 2 conclusions (الغلوتامات / GABA).",
                    "2026-08-27"
                  ),
                  placeholder: "عند التنبيه 1: PPSE... عند التنبيه 2: PPSI... نستنتج...",
                  minLength: 90,
                  modelAnswer:
                    "عند التنبيه 1: يسجل الجهاز (ج1) جهدا بعد مشبكي تنبيها (PPSE) والجهاز (ج2) كمونا مستقرا والجهاز (ج3) جهدا بعد مشبكي تنبيها (PPSE). عند التنبيه 2 (تثبيط GABA على المنطقة (س)): يسجل الجهازان (ج1) و(ج3) جهدا بعد مشبكي تثبيطا (PPSI) والجهاز (ج2) كمونا مستقرا. نستنتج أن المشبك (ع3-ع1) من النوع المنبّه يحرر مبلغا عصبيّا هو الغلوتامات، وأن المشبك (ع3-ع2) من النوع المثبط يحرر مبلغا عصبيّا هو GABA على مستوى كل منهما.",
                  rule: {
                    prompt: "بيّن العلاقة بين أنواع المشابك والمبلغات",
                    keywords: ["مشبك", "منبه", "مثبط", "غلوتامات", "gaba", "تسجيل"],
                    minHits: 3,
                    forbidden: ["بسبب"]
                  }
                },
                E: {
                  points: 2.5,
                  prompt: "اشرح تدخّل البروتينات الغشائية في كبح الرسالة العصبية وتأمين استرخاء العضلة",
                  bacPrompt:
                    "اشرح كيف تتدخّل البروتينات الغشائية على مستوى المشابك في كبح وصول الرسالة العصبية إلى العضلة وتأمين استرخائها وذلك باستغلال معطيات الشكل (ب) من الوثيقة (2).",
                  ...OFFICIAL(
                    2,
                    "Relecture du PDF dzexams 2022 (couche texte inversée, reconstituée). Verbe officiel : اشرح. Question 2 du الجزء الثاني (Sujet 1, Ex2). Consigne « أبرز مختلف الظواهر الناتجة عن وصول الرسالة العصبية إلى نهاية العصبون (ع1)... » (question 1 du même الجزء) non mappée (un pôle = une consigne).",
                    "2026-08-27"
                  ),
                  placeholder: "يتنشط العصبون (ع2) فيحفز فتح قنوات الكالسيوم...",
                  minLength: 110,
                  modelAnswer:
                    "يتنشط العصبون (ع2) فيحفز فتح القنوات الفسفوليبيدية للكالسيوم ودخوله إلى النهاية العصبية (ع2)، فيؤدي إلى هجرة الحويصلات المشبكية وتحرير المبلغ الكيميائي GABA في الشق المشبكي لكل من المشبك (ع1-ع2) و(ع2-ع3). على مستوى المشبك (ع1-ع2): يثبت GABA على المستقبلات GABA-b الموجودة على الغشاء بعد المشبكي للعصبون (ع1) ما ينشّط قنوات البوتاسيوم التي يخرج من خلالها أيون K⁺ إلى خارج الخلية بعد المشبكية؛ ومن جهة أخرى يثبّت GABA القنوات الفسفوليبيدية للكالسيوم ما يؤدي إلى عدم دخول Ca²⁺ وعدم تحرر الغلوتامات رغم وصول رسالة عصبية إلى العصبون (ع1)، فيكبح اقتران الرسالة من العصبون (ع1) إلى العصبون (ع3). على مستوى المشبك (ع2-ع3): يثبت GABA على المستقبلات GABA-b فينشّط قنوات البوتاسيوم فيخرج أيون K⁺ من الغشاء بعد المشبكي للعصبون (ع3)، ويثبت على المستقبلات GABA-a فيفتح القنوات الأيونية ويدخل أيون Cl⁻ إلى الهيولى بعد المشبكية فيحدث فرط استقطاب الغشاء بعد المشبكي للعصبون (ع3).",
                  rule: {
                    prompt: "اشرح تدخّل مستقبلات GABA في الاسترخاء",
                    keywords: ["gaba", "مستقبل", "كالسيوم", "استقطاب"],
                    minHits: 3,
                    forbidden: []
                  }
                },
                W: {
                  points: 1,
                  prompt: "الخاتمة: أثر تثبيط GABA على الرسالة الموجهة إلى العضلة",
                  bacPrompt:
                    "ما أثر تثبيط GABA على مستوى المشابكين (ع1-ع2) و(ع2-ع3) على الرسالة العصبية الموجهة إلى العضلة؟",
                  ...RECON(
                    "Clôture issue du corrigé officiel (p. 13) : « GABA على مستوى المشابكين يضمن ردة فعل تثبيطية بعد مشبكية ديلوت من المكونات التنبيهية فيكبح رسالة عصبية على العصبون (ع3) المحرك للعضلة ما يؤدي إلى استرخائها ». Ce pôle isole pédagogiquement la clôture."
                  ),
                  placeholder: "في الختام...",
                  minLength: 40,
                  modelAnswer:
                    "في الختام، يضمن GABA على مستوى المشابكين (ع1-ع2) و(ع2-ع3) ردة فعل تثبيطية بعد مشبكية ديلوت من المكونات التنبيهية، فيكبح الرسالة العصبية على العصبون (ع3) المحرك للعضلة ما يؤدي إلى استرخائها.",
                  rule: {
                    prompt: "اكتب خاتمة حول أثر GABA على العضلة",
                    keywords: ["gaba", "تثبيطي", "استرخاء"],
                    minHits: 2,
                    forbidden: []
                  }
                }
              }
            },
            {
              number: 3,
              ui: "text",
              label: "الجينتامسين وانحلال البشرة الفقاعية",
              max: 8,
              desc: "تأثير المضاد الحيوي الجينتامسين على البكتيريا (مضاد حيوي) وعلى الشخص المصاب (بروتين اللامينين المكتمل)، وقراءة خاطئة للرموز خلال الترجمة",
              poles: {
                N: {
                  points: 0.5,
                  prompt: "اقترح فرضية حول طريقة تأثير الجينتامسين (الشكل د)",
                  bacPrompt:
                    "اقترح فرضية وجيهة تسمح بتحديد طريقة تأثير الجينتامسين اعتمادا على معطيات الشكل (د) من الوثيقة (1).",
                  ...OFFICIAL(
                    4,
                    "Relecture du PDF dzexams 2022 (couche texte inversée, reconstituée). Verbe officiel : اقترح فرضية. Question 2 du الجزء الأول (Sujet 1, Ex3). Le corrigé officiel (p. 14) : « الجينتاميسين يتسبب في قراءة بعض رموز ARNm خاطئة خلال عملية الترجمة » (تقبل فرضيات أخرى وجيهة لها نفس المحتوى).",
                    "2026-08-27"
                  ),
                  placeholder: "الفرضية: يتسبب الجينتامسين في...",
                  minLength: 30,
                  modelAnswer:
                    "الفرضية: يتسبب الجينتامسين في قراءة بعض رموز ARNm قراءة خاطئة خلال عملية الترجمة على مستوى الريبوزوم (الموقع A) مما يؤدي إلى تغيير طبيعة البروتين الكيماوية.",
                  rule: {
                    prompt: "اقترح فرضية حول تأثير الجينتامسين",
                    keywords: ["فرضيه", "ترجمه", "جينتاميسين"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                S: {
                  points: 2.0,
                  prompt: "استغلال منهجي للأشكال (أ، ب، ج): البكتيريا، اللوسين، اللامينين + المشكل المطروح",
                  bacPrompt:
                    "بيّن تأثير المعالجة بالجينتامسين ضد البكتيريا وعلى الشخص المصاب مبرزا المشكل المطروح وذلك باستغلال منهجي للأشكال (أ، ب، ج) من الوثيقة (1).",
                  ...OFFICIAL(
                    3,
                    "Relecture du PDF dzexams 2022 (couche texte inversée, reconstituée). Verbe officiel : بيّن. Question 1 du الجزء الأول (Sujet 1, Ex3). Le corrigé officiel (p. 13-14) détaille la lecture des 3 figures (colonies / leucine 13% / laminine 21%) et le « المشكل المطرح ».",
                    "2026-08-27"
                  ),
                  placeholder:
                    "الشكل (أ): يتناقص عدد المستعمرات... الشكل (ب): الاندماج 13%... الشكل (ج): اللامينين 21%...",
                  minLength: 90,
                  modelAnswer:
                    "الشكل (أ): يتناقص عدد مستعمرات البكتيريا E.coli في غياب الجينتامسين عن 333 مستعمرة، ويتناقص أكثر بزيادة تركيز الجينتامسين حتى ينعدم عند تركيز 11 mg/l: الجينتامسين مضاد حيوي. الشكل (ب): يتناقص معدل اندماج اللوسين في الببتيد في وجود مختلف تراكيز الجينتامسين، حيث يبلغ الاندماج 13% من الاندماج في غيابه عند تركيز 9 µM: في وجود الجينتامسين تُترجم رامزة مشفرة للفنيل ألانين إلى لوسين. الشكل (ج): نسبة التعبير عن بروتين اللامينين المكتمل الوظيفي عند الشخص المصاب منخفضة في غياب الجينتامسين وتزداد مع وجوده بتغير تركيز المضاد الحيوي لتبلغ 21% عند تركيز 25 µg/ml: يحمي المضاد الحيوي الجينتامسين من تركيب بروتين كامل وظيفي في خلايا البشرة عند الشخص المصاب بالمرض. المشكل المطرح: كيف يؤدي الجينتامسين إلى تركيب بروتين كامل وظيفي عند الشخص المصاب بانحلال البشرة الفقاعية بينما ينتج عنه بروتين غير وظيفي عند البكتيريا؟",
                  rule: {
                    prompt: "بيّن تأثير الجينتامسين بالاستغلال المنهجي",
                    keywords: ["مستعمرة", "اندماج", "تركيز", "لامينين"],
                    minHits: 3,
                    forbidden: ["بسبب"]
                  }
                },
                E: {
                  points: 4.0,
                  prompt: "وضّح طريقة تأثير الجينتامسين مصادقا على صحة الفرضية (وثيقة 2)",
                  bacPrompt:
                    "وضح باستغلال معطيات الوثيقة (2) طريقة تأثير الجينتامسين مصادقا على صحة الفرضية المقترحة.",
                  ...OFFICIAL(
                    5,
                    "Relecture du PDF dzexams 2022 (couche texte inversée, reconstituée). Verbe officiel : وضّح. Question du الجزء الثاني (Sujet 1, Ex3). Le corrigé officiel (p. 14-15) donne les 2 traductions (CGC→stop / UAG→Gln) et la validation de la hypothèse.",
                    "2026-08-27"
                  ),
                  placeholder: "في غياب الجينتامسين يترجم... بينما في وجوده تتوقف الترجمة عند CGC...",
                  minLength: 110,
                  modelAnswer:
                    "في غياب الجينتامسين يترجم جزء من مورثة بروتين النمو عند البكتيريا (الجزء TAC GCG CCT AGG GGG TGG → رموز ARNm: AUG CGC GGA UCC CCC ACC) إلى السلسلة ثريوبرولين-برولين-سيرين-جليسين-أرجينين-ميثيونين، بينما في وجوده تتوقف الترجمة عند الرامزة الثانية CGC الدالة على أرجينين إذ تُقرأ كرامزة توقف فيتوقف تركيب البروتين. في الشخص المصاب: في غياب الجينتامسين يترجم الجزء (TAC TTG ACC ATC CGT AGC → AUG AAC UGG UAG GCA UCG) إلى تريبان-أسباراجين-ميثيونين... (بروتين غير مكتمل)، بينما في وجود الجينتامسين تُقرأ رامزة التوقف UAG إلى Gln ما يرتجل الترجمة إلى تركيب بروتين كامل وظيفي. هكذا تصح الفرضية المقترحة: يتسبب الجينتامسين في قراءة خاطئة لبعض رموز ARNm خلال عملية الترجمة مما يؤدي إلى تغيير طبيعة البروتين الكيماوية.",
                  rule: {
                    prompt: "وضّح طريقة تأثير الجينتامسين مع المصادقة",
                    keywords: ["ترجمه", "رامزه", "بروتين", "فرضيه"],
                    minHits: 3,
                    forbidden: [],
                    wrongConcepts: ["ميثان", "nop"]
                  }
                },
                W: {
                  points: 1.5,
                  prompt: "برّر الاهتمامات المتزايدة بالجينتامسين في الأساليب العلاجية",
                  bacPrompt:
                    "برّر انطلاقا مما توصلت إليه من هذه الدراسة الاهتمامات المتزايدة بالمضاد الحيوي الجينتامسين (gentamicine) في الأساليب العلاجية.",
                  ...OFFICIAL(
                    5,
                    "Relecture du PDF dzexams 2022 (couche texte inversée, reconstituée). Verbe officiel : برّر. Question du الجزء الثالث (Sujet 1, Ex3).",
                    "2026-08-27"
                  ),
                  placeholder: "يعمل الجينتامسين من خلال دوره في...",
                  minLength: 50,
                  modelAnswer:
                    "يعمل الجينتامسين من خلال دوره في منع تركيب البروتينات غير الوظيفية في البكتيريا (فعل مضاد حيوي). ويعمل على علاج بعض الضراير الناتجة عن طفرات مؤدية إلى تركيب بروتينات مبتورة من خلال تركيب بروتينات مكتملة وظيفية عند الإنسان.",
                  rule: {
                    prompt: "برّر الاهتمامات بالجينتامسين",
                    keywords: ["علاج", "طفرات", "بروتين", "بكتيريا"],
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
          pdfExternalUrl:
            "https://www.dzexams.com/uploads/sujets/officiels/bac/2022/dzexams-bac-sciences-2311208.pdf",
          pdfNote:
            "PDF officiel (ONEC, pp. 6-10 pour ce sujet) non redistribué dans le dépôt ; page : https://www.dzexams.com/ar/annales/eVlXSFRFOEJaN2ozSlE3NytzWkRHQT09 (consulté 2026-08-27). La couche texte du PDF est inversée (miroir mot à mot) ; les consignes ont été reconstituées mot à mot à partir de cette couche. Corrigé officiel (الإجابة النموذجية) joint au même PDF (pp. 16-20) et croisé avec : https://eddirasa.com/correction-bac-science-2022-se/ — textes concordants.",
          title: "الموضوع الثاني",
          exercises: [
            {
              number: 1,
              ui: "text",
              label: "السّيانور وكمون الراحة للليف العصبي",
              max: 5,
              desc: "مصدر كمون الراحة (توزيع Na⁺/K⁺ وقنوات التسرب ومضخة Na⁺/K⁺)، وتأثير مادة السّيانور (منع تركيب ATP) على كمون الراحة وقابلية تنبيه الليف العصبي",
              poles: {
                N: {
                  points: 1,
                  prompt: "تأطير الإشكالية: كيف تؤثر مادة السّيانور على الكمون الغشائي أثناء الراحة؟",
                  bacPrompt:
                    "المشكل: كيف تؤثر مادة السّيانور (المانعة لتركيب ATP) على الكمون الغشائي للليف العصبي أثناء الراحة؟",
                  ...RECON(
                    "Pas de question officielle autonome de type « حدد المشكل ». Reformulation pédagogique du préambule page 6 (lisible : « يتميّز غشاء العصبون بالاستقطاب أثناء الراحة لكونه قابلا للتنبيه بتدخل بروتينات عالية التخصص. بعض المركبات السامة مثل السّيانور (يمنع تركيب ATP) فقد غشاء الليف العصبي هذه الخاصية »)."
                  ),
                  placeholder: "صياغة المشكل العلمي...",
                  minLength: 30,
                  modelAnswer:
                    "المشكل العلمي: كيف يؤدي منع مادة السّيانور لتركيب ATP إلى التأثير على الكمون الغشائي للليف العصبي أثناء الراحة وعلى قابليته للتنبيه؟",
                  rule: {
                    prompt: "حدد المشكل العلمي حول السّيانور وكمون الراحة",
                    keywords: ["سيانور", "atp", "كمون"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                S: {
                  points: 1,
                  prompt: "تحديد مصدر كمون الراحة",
                  bacPrompt: "حدّد مصدر كمون الراحة.",
                  ...OFFICIAL(
                    6,
                    "Relecture du PDF dzexams 2022 (couche texte inversée, reconstituée). Verbe officiel : حدّد. Question 1 du التمرين الأول (Sujet 2). Le corrigé officiel (p. 16) : distribution Na⁺/K⁺ + nombre de canaux ouverts.",
                    "2026-08-27"
                  ),
                  placeholder: "توزيع غير متساو لشوارد Na⁺/K⁺، قنوات مفتوحة أكبر لـ K⁺...",
                  minLength: 50,
                  modelAnswer:
                    "يتميّز غشاء العصبون أثناء الراحة بالقطبية (كمون راحة سالب داخل الخلية) ينتج عن: توزيع غير متساو لشوارد Na⁺ وK⁺ بين داخل الغشاء وخارجه (تركيز شوارد K⁺ أكبر في الداخل وشوارد Na⁺ أكبر في الخارج)، وعدد القنوات المفتوحة في الغشاء أكبر لـ K⁺ منه لـ Na⁺.",
                  rule: {
                    prompt: "حدّد مصدر كمون الراحة",
                    keywords: ["شوارد", "قنوات", "توزيع"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                E: {
                  points: 2,
                  prompt: "النص العلمي: كيفية تأثير السّيانور على الكمون الغشائي أثناء الراحة",
                  bacPrompt:
                    "اشرح مستعينا بالوثيقة واعتمادا على معلوماتك في نص علمي منظم ومهيكل، كيفية تأثير مادة السّيانور على الكمون الغشائي للليف العصبي أثناء الراحة.",
                  ...OFFICIAL(
                    6,
                    "Relecture du PDF dzexams 2022 (couche texte inversée, reconstituée). Verbe officiel : اشرح في نص علمي منظم ومهيكل. Question 2 du التمرين الأول (Sujet 2). Le corrigé officiel (p. 16) structure le texte (مقدمة / عرض: الحالة الطبيعية ثم وجود السّيانور / خاتمة).",
                    "2026-08-27"
                  ),
                  placeholder: "في الحالة الطبيعية: تتسرب الشوارد... في وجود السّيانور: يمنع تركيب ATP...",
                  minLength: 110,
                  modelAnswer:
                    "تتوقف قابلية تنبيه الليف العصبي على حالة كهربائية تعرف بكمون الراحة والتي يلزمها بروتينات غشائية خاصة، غير أن بعض المواد الكيميائية مثل السّيانور تسبب خللا في نشاط بعضها فتؤثر على كمون الراحة. في الحالة الطبيعية: تتسرب شوارد الصوديوم نحو الداخل عبر قنوات التسرب وفق تدرج تركيزها، كما تتسرب شوارد البوتاسيوم نحو الخارج عبر قنوات التسرب وفق تدرج تركيزها، ويعمل مضخة Na⁺/K⁺ على نقل الشاردتين عكس تدرج تركيزهما باستهلاك الطاقة على شكل ATP ما يحافظ على التوزيع المتباين لشوارد Na⁺ وK⁺ على جانبي الغشاء ومنه على كمون الراحة. في وجود السّيانور: يمنع السّيانور تركيب ATP في الليف العصبي، في غياب ATP يتوقف نشاط المضخة فيؤدي تسرب الشوارد عبر القنوات إلى تساوي تركيزها على جانبي غشاء الليف ومنه زوال كمون الراحة وقابلية تنبيه الليف العصبي.",
                  rule: {
                    prompt: "اشرح تأثير السّيانور على كمون الراحة",
                    keywords: ["atp", "مضخه", "تسرب", "قنوات", "سيانور"],
                    minHits: 3,
                    forbidden: [],
                    wrongConcepts: ["جينتامسين", "جينتاميسين", "gentamicine", "ميثان"]
                  }
                },
                W: {
                  points: 1,
                  prompt: "الخاتمة: الخطر الصحي للسّيانور على الإنسان",
                  bacPrompt: "ما الخطر الصحي لمادة السّيانور على الإنسان من خلال تأثيرها على كمون الراحة؟",
                  ...RECON(
                    "Clôture issue du corrigé officiel (p. 16) : « السيانور من المواد السامة التي تؤثر سلبا على صحة الإنسان بتأثيرها على كمون الراحة وبالتالي على قابلية تنبيه الليف العصبي ». Ce pôle isole pédagogiquement la clôture."
                  ),
                  placeholder: "في الختام...",
                  minLength: 40,
                  modelAnswer:
                    "في الختام، السّيانور من المواد السامة التي تؤثر سلبا على صحة الإنسان بتأثيرها على كمون الراحة وبالتالي على قابلية تنبيه الليف العصبي.",
                  rule: {
                    prompt: "اكتب خاتمة حول الخطر الصحي للسّيانور",
                    keywords: ["سامه", "كمون", "تنبيه"],
                    minHits: 2,
                    forbidden: []
                  }
                }
              }
            },
            {
              number: 2,
              ui: "text",
              label: "α-amanitine وعلاج الأورام السرطانية (ATAC)",
              max: 7,
              desc: "تثبيط أنزيم ARN بوليميراز بمادة α-amanitine (الحلقة TL)، واستغلال تأثيرها في علاج الأورام السرطانية عبر الدواء ATAC (جسم مضاد + α-amanitine)",
              poles: {
                N: {
                  points: 1,
                  prompt: "تأطير الإشكالية: تأثير α-amanitine على تركيب البروتين واستغلالها في علاج الأورام",
                  bacPrompt:
                    "المشكل: كيف تؤثر مادة (α-amanitine) على تركيب البروتين، وكيف يستغل الباحثون خاصيتها في علاج بعض الأورام السرطانية؟",
                  ...RECON(
                    "Pas de question officielle autonome de type « حدد المشكل ». Reformulation pédagogique du préambule page 6 (lisible : « يمكن لبعض المواد مثل مادة (α-amanitine) المستخرجة من فطر Amanita Phalloïde أن تؤثر على عملية تركيب البروتين، استغل الباحثون خصائص تأثير هذه المادة في علاج بعض الأورام السرطانية »)."
                  ),
                  placeholder: "صياغة المشكل العلمي...",
                  minLength: 30,
                  modelAnswer:
                    "المشكل العلمي: كيف تثبط مادة (α-amanitine) تركيب البروتين في الخلايا، وكيف يمكن استغلال هذا التثبيط في علاج بعض الأورام السرطانية؟",
                  rule: {
                    prompt: "حدد المشكل العلمي حول α-amanitine",
                    keywords: ["amanitine", "بروتين", "سرطانيه"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                S: {
                  points: 2.5,
                  prompt: "وضّح تأثير α-amanitine على تركيب البروتين (شكلا 1 أ/ب)",
                  bacPrompt:
                    "وضّح كيفية تأثير مادة (α-amanitine) على تركيب البروتين باستغلالك لشكلي الوثيقة (1).",
                  ...OFFICIAL(
                    7,
                    "Relecture du PDF dzexams 2022 (couche texte inversée, reconstituée). Verbe officiel : وضّح. Question du الجزء الأول (Sujet 2, Ex2). Le corrigé officiel (p. 17) : activité de l'ARN polymérase (100% → 30% à 13 µg/ml) + boucle TL.",
                    "2026-08-27"
                  ),
                  placeholder: "في غياب α-amanitine يبلغ النشاط 100%... على المستوى الجزئي: الحلقة TL...",
                  minLength: 90,
                  modelAnswer:
                    "في غياب α-amanitine يبلغ نشاط أنزيم ARN بوليميراز 100%، بينما في وجوده ينخفض نشاط الأنزيم إلى 30% عند تركيز 13 µg/ml: α-amanitine يثبط نشاط أنزيم ARN بوليميراز. على المستوى الجزئي: في الحالة الطبيعية (الغياب) تغيّر الحلقة TL في أنزيم ARN بوليميراز شكلها ما يسمح بدمج نيكليوتيدات جديدة في سلسلة الـ ARNm المتشكلة، بينما في وجود α-amanitine يثبت الأنزيم على الحلقة TL فيحافظ على شكلها ومنه عدم دمج نيكليوتيدات جديدة في الـ ARNm. ومنه يثبط α-amanitine نشاط ARN بوليميراز بتثبيته على الحلقة TL (منع دمج النيكليوتيدات الجديدة) ما يوقف عملية النسخ.",
                  rule: {
                    prompt: "وضّح تأثير α-amanitine بالاستغلال",
                    keywords: ["بوليميراز", "نشاط", "الحلقه", "نسخ", "تركيز"],
                    minHits: 3,
                    forbidden: ["بسبب"]
                  }
                },
                E: {
                  points: 2.5,
                  prompt: "اشرح آلية تأثير دواء ATAC مبرزا دور الأجسام المضادة (وثيقة 2)",
                  bacPrompt:
                    "اشرح آلية تأثير دواء (ATAC) على الخلايا السرطانية مبرزا دور الأجسام المضادة في ذلك، انطلاقا من استغلال معطيات الوثيقة (2).",
                  ...OFFICIAL(
                    7,
                    "Relecture du PDF dzexams 2022 (couche texte inversée, reconstituée). Verbe officiel : اشرح. Question du الجزء الثاني (Sujet 2, Ex2). Le corrigé officiel (p. 17-18) : volumes de tumeurs (100→1000 mm³ ; 4 mg/kg) + complexe (anticorps-amanitine) + lysosomes.",
                    "2026-08-27"
                  ),
                  placeholder: "في غياب الدواء يزداد حجم الورم... آلية التأثير: معقد من أجسام مضادة...",
                  minLength: 90,
                  modelAnswer:
                    "في غياب الدواء يزداد حجم الورم السرطاني من أقل من 100 mm³ إلى أكثر من 1000 mm³ خلال 15 يوما، بينما في وجود الدواء بتركيز 4 mg/kg يتناقص حجم الورم حتى يختفي بعد 15 يوما: الدواء ATAC فعال في علاج السرطان بتركيز 4 mg/kg. آلية التأثير: الدواء ATAC معقد من جزيئات α-amanitine مع أجسام مضادة نوعية اتجاه البروتينات الغشائية للخلايا السرطانية، فيرتبط المعقد (بروتين غشائي — دواء) على البروتينات الغشائية للخلية السرطانية، وبعد دخوله هيولى الخلية السرطانية تعمل الأنزيمات الليزوزومية على تفكيك الجسم المضاد فتتحرر جزيئات α-amanitine التي تثبت على أنزيم ARN بوليميراز في النواة فتوقف عمله ومنه توقف عملية النسخ وتركيب البروتين في الخلايا السرطانية.",
                  rule: {
                    prompt: "اشرح آلية تأثير ATAC ودور الأجسام المضادة",
                    keywords: ["amanitine", "جسم", "سرطانيه", "نسخ", "ورم"],
                    minHits: 3,
                    forbidden: [],
                    causalOrder: ["amanitine", "نسخ"]
                  }
                },
                W: {
                  points: 1,
                  prompt: "الخاتمة: النتيجة العلاجية لتوقف النسخ في الخلايا السرطانية",
                  bacPrompt: "ما النتيجة العلاجية لتوقف النسخ في الخلايا السرطانية بواسطة الدواء ATAC؟",
                  ...RECON(
                    "Clôture issue du corrigé officiel (p. 18) : « يستهدف الدواء الخلايا السرطانية بواسطة الأجسام المضادة النوعية... يعمل هذا الدواء على وقف النسخ وتركيب البروتين في الخلايا السرطانية مما يوقف نمو الورم ما يؤدي إلى تراجعه ». Ce pôle isole pédagogiquement la clôture."
                  ),
                  placeholder: "في الختام...",
                  minLength: 40,
                  modelAnswer:
                    "في الختام، يستهدف الدواء الخلايا السرطانية بواسطة الأجسام المضادة النوعية اتجاه البروتينات الغشائية لها، ومن خلال ما يحتويه من جزيئات α-amanitine يوقف عملية النسخ وتركيب البروتين في الخلايا السرطانية مما يوقف نمو الورم ما يؤدي إلى تراجعه.",
                  rule: {
                    prompt: "اكتب خاتمة حول النتيجة العلاجية لـ ATAC",
                    keywords: ["ورم", "نسخ", "جسم"],
                    minHits: 2,
                    forbidden: []
                  }
                }
              }
            },
            {
              number: 3,
              ui: "text",
              label: "غاز الميثان في الأبقار والمكمل الغذائي (3-NOP)",
              max: 8,
              desc: "إنتاج غاز الميثان (CH₄) أثناء الاجتراء بتدخل أنزيم M (المرافق CoEM)، وتأثير المكمل الغذائي (3-NOP) التنافسي على الموقع الخاص للمرافق الإنزيمي",
              poles: {
                N: {
                  points: 0.5,
                  prompt: "تأطير المسعى: استغلال خصائص أنزيم M للتقليل من الانبعاثات",
                  bacPrompt:
                    "المشكل: كيف يمكن استغلال خصائص أنزيم M (وخلطائه) للتقليل من انبعاث غاز الميثان (CH₄) دون الإضرار بالتفاعلات الهضمية للأبقار؟",
                  ...RECON(
                    "Pas de question officielle autonome de type « حدد المشكل ». Reformulation pédagogique du préambule page 9 (lisible : « تحفز الأنزيمات العديد من التفاعلات الأيضية... فكيف يمكن استغلال خصائص هذه الأنزيمات للتقليل من الانبعاثات ؟ »)."
                  ),
                  placeholder: "صياغة المشكل العلمي...",
                  minLength: 30,
                  modelAnswer:
                    "المشكل العلمي: كيف يمكن استغلال طبيعة ارتباط أنزيم M بمرافقه CoEM للتقليل من إنتاج وانبعاث غاز الميثان (CH₄) دون الإضرار بالتفاعلات الهضمية للأبقار؟",
                  rule: {
                    prompt: "حدد المشكل العلمي حول غاز الميثان",
                    keywords: ["ميثان", "coem", "انزيم"],
                    minHits: 2,
                    forbidden: []
                  }
                },
                S: {
                  points: 2.0,
                  prompt: "بيّن أن التفاعلات الهضمية تفضي إلى إنتاج غاز الميثان (شكلا 1 أ/ب)",
                  bacPrompt:
                    "بيّن أن التفاعلات الهضمية تفضي إلى إنتاج غاز الميثان أثناء الاجتراء باستغلال الأشكال (أ) و(ب) من الوثيقة (1).",
                  ...RECON(
                    "Consigne du الجزء الأول partiellement lisible dans la couche texte (OCR tronquée) ; reformulation pédagogique fidèle au corrigé officiel (p. 18) : « استغلال الشكل (أ)... استغلال الشكل (ب)... التفاعلات الهضمية لمادة السليلوز عند الأبقار تنتج عنها غازات منها غاز الميثان / أنزيم M يحوّل CO₂ إلى غاز الميثان »."
                  ),
                  placeholder:
                    "الشكل (أ): تنتج تفاعلات هضمية غازات... الشكل (ب): السليلوز → غلوكوز → CO₂ + H₂ → ميثان...",
                  minLength: 80,
                  modelAnswer:
                    "الشكل (أ): عند استهلاك الأغذية النباتية على مستوى الكرش تنتج تفاعلات هضمية بتدخل بكتيريا تنتج غاز CO₂ وغاز الميثان. الشكل (ب): يهضم السليلوز إلى غلوكوز بتدخل أنزيمات السليليز، يتم هدم الغلوكوز من جهة إلى مواد أيضية (أحماض عضوية) يتم امتصاصها ومن جهة أخرى يتحول جزء منه إلى غاز CO₂ وفي وجود أنزيم M والهيدروجين ينتج غاز الميثان والماء. نستنتج: أنزيم M يحوّل CO₂ إلى غاز الميثان. (تتم التفاعلات الهضمية لمادة السليلوز عند الأبقار بتدخل أنزيمات الكائنات الدقيقة التي تعيش في الكرش ما يؤدي إلى إنتاج غاز الميثان بتدخل أنزيم M.)",
                  rule: {
                    prompt: "بيّن إنتاج غاز الميثان أثناء الاجتراء",
                    keywords: ["ميثان", "سليلوز", "غلوكوز", "co"],
                    minHits: 3,
                    forbidden: []
                  }
                },
                E: {
                  points: 4.0,
                  prompt: "وضّح تأثير 3-NOP على إنتاج وانبعاث CH₄ مع المصادقة (وثيقة 2)",
                  bacPrompt:
                    "وضّح تأثير المكمل الغذائي (3-NOP) على إنتاج وانبعاث غاز (CH₄) ما سمح بالمصادقة على الفرضية المقترحة مستغلا معطيات أشكال الوثيقة (2).",
                  ...OFFICIAL(
                    9,
                    "Relecture du PDF dzexams 2022 (couche texte inversée, reconstituée). Verbe officiel : وضّح. Question du الجزء الثاني (Sujet 2, Ex3). Le corrigé officiel (p. 18-19) : figures A/B/C (330→230 g/jour ; CO₂+H₂ ; compétition CoEM/3-NOP sur Arg120/Tyr333).",
                    "2026-08-27"
                  ),
                  placeholder:
                    "الشكل (أ): في غياب 3-NOP... في وجوده... الشكل (ب): CO₂ + H₂... الشكل (ج): يتنافس 3-NOP مع CoEM...",
                  minLength: 110,
                  modelAnswer:
                    "الشكل (أ): في غياب 3-NOP يترفع إنتاج الميثان من 130 غ/اليوم إلى 330 غ/اليوم ثم يثبت، بينما في وجود 3-NOP يتناقص إنتاج الميثان من 330 غ/اليوم إلى 230 غ/اليوم ثم يثبت: يقلل المكمل الغذائي 3-NOP من غاز الميثان. الشكل (ب): في وجود CO₂ وبإضافة الهيدروجين ينتج أنزيم M (مرافقه CoEM) غاز الميثان والماء: يستخدم أنزيم M مرافقه CoEM التي يربطها لتحويل CO₂ إلى غاز الميثان. الشكل (ج): يتنافس المكمل الغذائي 3-NOP مع المرافق الإنزيمي CoEM على تثبيت الموقع الخاص للرفاق الإنزيمي على أنزيم M؛ في غياب CoEM يكون الأنزيم غير وظيفي، وفي وجود CoEM يثبت على جزء من الأنزيم حيث تتشكل روابط بين الضمحل الييني وArg120 وTyr333 ما يجعله وظيفيا؛ وفي وجود CoEM و3-NOP يأخذ 3-NOP مكان CoEM فتتوقف التفاعلات فيصبح الأنزيم غير وظيفي. (يعمل 3-NOP على منع ارتباط CoEM ما يوقف نشاط أنزيم M، فينخفض إنتاج وانبعاث غاز الميثان مع الحفاظ على التفاعلات الأيضية الهضمية للأبقار : تتأكد الفرضية المقترحة.)",
                  rule: {
                    prompt: "وضّح تأثير 3-NOP مع المصادقة",
                    keywords: ["nop", "coem", "ميثان", "تركيض"],
                    minHits: 3,
                    forbidden: [],
                    causalOrder: ["nop", "coem"]
                  }
                },
                W: {
                  points: 1.5,
                  prompt: "مخطط الآلية: التقليل من CH₄ دون الإضرار بالتفاعلات الهضمية",
                  bacPrompt:
                    "لخّص في مخطط الآلية التي تسمح بالتقليل من التلوث بغاز (CH₄) دون الإضرار بالتفاعلات الهضمية للأبقار.",
                  ...OFFICIAL(
                    10,
                    "Relecture du PDF dzexams 2022 (couche texte inversée, reconstituée). Verbe officiel : لخّص في مخطط. Question du الجزء الثالث (Sujet 2, Ex3). Le corrigé officiel (p. 20) fournit le schéma (سليلوز → غلوكوز → CO₂/H₂ → Mth + 3-NOP/EM-CoEM).",
                    "2026-08-27"
                  ),
                  placeholder: "سليلوز → غلوكوز → CO₂ + H₂ → ميثان؛ 3-NOP يمنع CoEM...",
                  minLength: 0,
                  modelAnswer:
                    "عنوان المخطط: عمل المكمل الغذائي 3-NOP على أنزيم M. سليلوز → غلوكوز (أنزيمات السليليز للكائنات الدقيقة) → مواد أيضية ممتصة + CO₂ + H₂ → (أنزيم M + CoEM) → غاز الميثان. في وجود 3-NOP: معقد (3-NOP-EM) يمنع ارتباط CoEM-EM فلا يُنتج غاز الميثان مع الحفاظ على التفاعلات الهضمية.",
                  rule: {
                    prompt: "لخص في مخطط آلية تقليل غاز الميثان",
                    keywords: ["مخطط", "ميثان", "غلوكوز"],
                    minHits: 1,
                    forbidden: [],
                    schema: { arrows: true, title: "ميثان", ordered: ["سليلوز", "غلوكوز", "ميثان"] }
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
