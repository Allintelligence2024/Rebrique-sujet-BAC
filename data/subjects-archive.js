/* ============================================================
   ARCHIVE BAC SVT Algérie — 2013 à 2020 (شعبة علوم تجريبية)
   ------------------------------------------------------------
   Contrat pédagogique :
   - Aucune consigne n'est marquée official.
   - 2018 et 2020/sujet 1 : thèmes relus sur couche texte dzexams
     (OCR bruité / inversé, 2026-08-30), wording reconstructed.
   - 2013-2017, 2019, 2020/sujet 2 : thèmes pédagogiques du
     programme 3AS, non certifiables comme énoncés ministériels.
   - PDF non redistribués. Liens externes dzexams uniquement.
   ============================================================ */

const RECON = (notes) => ({
  bacPromptSource: "reconstructed",
  bacPromptNotes: notes
});

export const ARCHIVE_YEARS = [
  {
    id: "2020",
    label: "بكالوريا الجزائر دورة 2020",
    badge: "أرشيف مُعاد بناؤه",
    theme: "indigo",
    enabled: true,
    sujets: [
      {
        id: 1,
        pdf: null,
        pdfAvailable: false,
        pdfExternalUrl:
          "https://www.dzexams.com/uploads/sujets/officiels/bac/2020/dzexams-bac-sciences-2356016.pdf",
        pdfNote:
          "PDF non redistribué dans le dépôt. Page dzexams : https://www.dzexams.com/ar/annales/SUFqL0VzRjNzdmd6ek1EekpsOTFMdz09. Sujet 1 : thèmes relus sur la couche texte dzexams (OCR bruité, 2026-08-30). Sujet 2 : couche texte incomplète ; thèmes pédagogiques du programme, non certifiables.",
        title: "الموضوع الأول",
        exercises: [
          {
            number: 1,
            ui: "text",
            label: "البنية الداخلية للكرة الأرضية",
            max: 5,
            desc: "استغلال المعطيات الزلزالية لمعرفة بنية وخصائص الكرة الأرضية رغم أن أعمق نقطة لا تتعدى 12 كيلومترا",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية: كيف كشفت المعطيات الزلزالية البنية الداخلية للكرة الأرضية؟",
                bacPrompt: "كيف تم استغلال المعطيات الزلزالية لمعرفة البنية الداخلية للكرة الأرضية؟",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف تسمح المعطيات الزلزالية بمعرفة البنية الداخلية للكرة الأرضية وحالة الأوساط والصخور المميزة رغم استحالة الوصول المباشر؟",
                rule: {
                  prompt: "تأطير الإشكالية: كيف كشفت المعطيات الزلزالية البنية الداخلية للكرة الأرضية؟",
                  keywords: ["زلزاليه", "بنيه", "ارض"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 1,
                prompt: "ملء الجدول: الحالة الفيزيائية والصخر الاندساسي واسم الانقطاع",
                bacPrompt: "انقل الجدول على ورقة إجابتك ثم املأ الخانات وفق التعليمات المطلوبة.",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "صلب، لدن، سائل، غرانيت، بازلت، انقطاع موهو...",
                minLength: 40,
                modelAnswer:
                  "نحدد الحالة الفيزيائية للأوساط: القشرة صلبة، الرداء العلوي لدن في جزء منه، النواة الخارجية سائلة. الصخور الاندساسية المميزة: غرانيت في القشرة القارية وبازلت في القشرة المحيطية. الانقطاعات: موهو بين القشرة والرداء، وغوتنبرغ بين الرداء والنواة.",
                rule: {
                  prompt: "ملء الجدول: الحالة الفيزيائية والصخر الاندساسي واسم الانقطاع",
                  keywords: ["صلب", "سائل", "انقطاع", "موهو"],
                  minHits: 2,
                  forbidden: ["بسبب"]
                }
              },
              E: {
                points: 2,
                prompt: "نص علمي: كيف كشفت المعطيات الزلزالية البنية الداخلية",
                bacPrompt:
                  "بيّن في نص علمي كيف تم استغلال المعطيات الزلزالية لمعرفة البنية الداخلية للكرة الأرضية اعتمادا على معلوماتك.",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "مقدمة، عرض، خاتمة...",
                minLength: 120,
                modelAnswer:
                  "تنتشر الموجات الزلزالية بسرعات مختلفة حسب طبيعة الأوساط. يتغير مسارها عند الانقطاعات فيظهر انعكاس وانكسار، ويختفي بعض الموجات في منطقة الظل، مما يدل على وسط سائل في النواة الخارجية. ومن تغير السرعة والحالة الفيزيائية والصخور المميزة تُبنى صورة طبقية للكرة الأرضية.",
                rule: {
                  prompt: "نص علمي: كيف كشفت المعطيات الزلزالية البنية الداخلية",
                  keywords: ["موجات", "انقطاع", "نواه", "سرعه", "ظل"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة: حدود الاستغلال المباشر وضرورة الزلازل",
                bacPrompt: "لماذا تبقى المعطيات الزلزالية ضرورية لمعرفة باطن الأرض؟",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer:
                  "في الختام، يتعذر الحفر المباشر إلى الأعماق، فتبقى الموجات الزلزالية الوسيلة الأساسية لكشف تتابع الأوساط والانقطاعات داخل الكرة الأرضية.",
                rule: {
                  prompt: "الخاتمة: حدود الاستغلال المباشر وضرورة الزلازل",
                  keywords: ["زلزاليه", "اعماق", "انقطاع"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 2,
            ui: "text",
            label: "أنزيما Cox وإيبوبروفان وسلكوكزيب",
            max: 7,
            desc: "التأثير النوعي للأنزيم عبر الموقع الفعال، وأنزيما Cox-1 وCox-2، ودور إيبوبروفان وسلكوكزيب والأعراض الجانبية",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية: كيف يُستغل الموقع الفعال لإنتاج دواء أقل أعراضا جانبية؟",
                bacPrompt: "كيف استغل الخبراء خاصية الموقع الفعال لإنتاج دواء ناجع بأعراض جانبية محدودة؟",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف يرتبط إيبوبروفان وأنزيما Cox-1 وCox-2 بالموقع الفعال، وكيف يقلل سلكوكزيب الأعراض الجانبية؟",
                rule: {
                  prompt: "تأطير الإشكالية: كيف يُستغل الموقع الفعال لإنتاج دواء أقل أعراضا جانبية؟",
                  keywords: ["cox", "موقع", "فعال", "دواء"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2.5,
                prompt: "تحليل مخطط نشاط Cox-1 وCox-2 وجدول IC50 لإيبوبروفان",
                bacPrompt:
                  "حلّل مخطط الشكل أ من الوثيقة 1 ثم وضّح دور دواء إيبوبروفان مبرزا أعراضه الجانبية.",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "قارن نشاط الأنزيمين وتركيز إيبوبروفان...",
                minLength: 90,
                modelAnswer:
                  "تمثل الوثيقة مخطط نشاط أنزيمي Cox-1 وCox-2 وتركيز إيبوبروفان اللازم لخفض النشاط إلى النصف. نلاحظ أن إيبوبروفان يخفض نشاط الأنزيمين معا، وأن تركيزه اللازم لـ Cox-1 أقل مما هو لـ Cox-2، ومنه نستنتج تثبيطا غير انتقائي يفسر الأعراض الجانبية.",
                rule: {
                  prompt: "تحليل مخطط نشاط Cox-1 وCox-2 وجدول IC50 لإيبوبروفان",
                  keywords: ["cox", "ايبوبروفان", "نشاط", "تركيز"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "table",
                    axes: ["نشاط", "تركيز"],
                    comparisons: [["Cox-1", "Cox-2"]],
                    cells: [["ايبوبروفان", "نشاط"]],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2.5,
                prompt: "تفسير تأثير إيبوبروفان وسلكوكزيب على الموقع الفعال",
                bacPrompt:
                  "علل تأثير الأنزيمين على نفس الركيزة وتأثير إيبوبروفان عليهما، ثم فسّر منحنى نشاط سلكوكزيب.",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "حمض أراشيدونيك، موقع فعال، سلكوكزيب...",
                minLength: 110,
                modelAnswer:
                  "يعود تأثير الأنزيمين على حمض الأراشيدونيك إلى تشابه جزء من الموقع الفعال. يثبت إيبوبروفان على الموقعين فيثبط Cox-1 وCox-2 معا. أما سلكوكزيب فيرتبط تفضيليا بـ Cox-2 فينخفض نشاطه بينما يبقى Cox-1 تقريبا وظيفيا، فتقل الأعراض الجانبية.",
                rule: {
                  prompt: "تفسير تأثير إيبوبروفان وسلكوكزيب على الموقع الفعال",
                  keywords: ["موقع", "فعال", "ايبوبروفان", "سلكوكزيب", "cox"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "اقتراح حل لتخفيف الأعراض الجانبية",
                bacPrompt:
                  "اقترح حلا يبيّن كيفية تخفيف الأعراض الجانبية للأدوية التي تستهدف النشاط الأنزيمي.",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer:
                  "في الختام، يُختار دواء انتقائي اتجاه Cox-2 مثل سلكوكزيب حتى يُحفظ نشاط Cox-1 المسؤول عن حماية الغشاء المخاطي فتخف الأعراض الجانبية.",
                rule: {
                  prompt: "اقتراح حل لتخفيف الأعراض الجانبية",
                  keywords: ["انتقائي", "cox", "اعراض"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 3,
            ui: "text",
            label: "الأجسام المضادة وHer2 وسرطان الثدي",
            max: 8,
            desc: "تدخل الأجسام المضادة في القضاء على سرطان الثدي عبر البروتين الغشائي Her2 كعلاج مناعي",
            poles: {
              N: {
                points: 0.5,
                prompt: "اقتراح فرضية حول آلية القضاء على خلايا سرطان الثدي",
                bacPrompt: "كيف تتدخل الأجسام المضادة في القضاء على سرطان الثدي؟",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "الفرضية...",
                minLength: 30,
                modelAnswer:
                  "الفرضية: ترتبط أجسام مضادة نوعية بالبروتين الغشائي Her2 على الخلايا السرطانية فتوقف تكاثرها وتسهّل تخريبها.",
                rule: {
                  prompt: "اقتراح فرضية حول آلية القضاء على خلايا سرطان الثدي",
                  keywords: ["فرضيه", "her2", "مضاده"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2,
                prompt: "استغلال كمية Her2 وعدد الخلايا السرطانية بعد الحضن",
                bacPrompt:
                  "استغل الشكل أ من الوثيقة: كمية البروتين الغشائي Her2 عند خليتين سرطانيتين وعدد الخلايا بعد سبعة أيام من الحضن.",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "قارن الخلايا A وB...",
                minLength: 60,
                modelAnswer:
                  "تمثل الوثيقة كمية البروتين Her2 وعدد الخلايا السرطانية بعد الحضن. نلاحظ عند الخلايا A المأخوذة من ثدي مصاب كمية Her2 أعلى وعددا أكبر بعد سبعة أيام مقارنة بالخلايا B، ومنه نستنتج ارتباط التكاثر بارتفاع Her2.",
                rule: {
                  prompt: "استغلال كمية Her2 وعدد الخلايا السرطانية بعد الحضن",
                  keywords: ["her2", "خلايا", "سرطانيه", "كميه"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "table",
                    axes: ["كميه", "عدد"],
                    comparisons: [["A", "B"]],
                    cells: [["her2", "خلايا"]],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 4,
                prompt: "تفسير آلية العلاج المناعي ضد Her2",
                bacPrompt:
                  "فسّر كيف تسمح الأجسام المضادة النوعية بالقضاء على خلايا سرطان الثدي الحاملة لـ Her2.",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "ارتباط، تكاثر، تخريب...",
                minLength: 110,
                modelAnswer:
                  "يعود ذلك إلى تثبيت الجسم المضاد النوعي على Her2 فيُحجب مستقبل النمو ويتوقف التكاثر، كما يُعلَّم الغشاء فتتدخل خلايا مناعية تخرب الخلية السرطانية. العلاج المناعي يستغل هذه النوعية.",
                rule: {
                  prompt: "تفسير آلية العلاج المناعي ضد Her2",
                  keywords: ["مضاد", "her2", "تكاثر", "سرطانيه", "مناعي"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1.5,
                prompt: "مخطط مسار العلاج المناعي",
                bacPrompt: "لخّص في مخطط كيف يقضي الجسم المضاد على الخلية السرطانية الحاملة لـ Her2.",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "Her2 → جسم مضاد → توقف التكاثر...",
                minLength: 40,
                modelAnswer:
                  "عنوان المخطط: علاج مناعي ضد Her2. Her2 على الغشاء → جسم مضاد نوعي → حجب مستقبل النمو → توقف التكاثر → تخريب الخلية السرطانية.",
                rule: {
                  prompt: "مخطط مسار العلاج المناعي",
                  keywords: ["مخطط", "her2", "مضاد"],
                  minHits: 2,
                  forbidden: [],
                  schema: { arrows: true, title: "Her2", ordered: ["her2", "مضاد", "تكاثر"] }
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
          "https://www.dzexams.com/uploads/sujets/officiels/bac/2020/dzexams-bac-sciences-2356016.pdf",
        pdfNote:
          "PDF non redistribué dans le dépôt. Page dzexams : https://www.dzexams.com/ar/annales/SUFqL0VzRjNzdmd6ek1EekpsOTFMdz09. Sujet 1 : thèmes relus sur la couche texte dzexams (OCR bruité, 2026-08-30). Sujet 2 : couche texte incomplète ; thèmes pédagogiques du programme, non certifiables.",
        title: "الموضوع الثاني",
        exercises: [
          {
            number: 1,
            ui: "text",
            label: "الشفرة الوراثية وتركيب البروتين",
            max: 5,
            desc: "علاقة تتابع النوكليوتيدات في ARNm بترتيب الأحماض الأمينية أثناء الترجمة — موضوع 2 غير مكتمل في طبقة النص",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية: كيف تُترجم معلومة ARNm إلى بروتين؟",
                bacPrompt: "كيف تُترجم المعلومة الوراثية المحمولة على ARNm إلى متتالية أحماض أمينية؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف يفرض تتابع نوكليوتيدات ARNm ترتيب الأحماض الأمينية أثناء الترجمة في الهيولى؟",
                rule: {
                  prompt: "تأطير الإشكالية: كيف تُترجم معلومة ARNm إلى بروتين؟",
                  keywords: ["ARNm", "ترجمه", "احماض"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 1,
                prompt: "ذكر العناصر المتدخلة في الترجمة",
                bacPrompt: "اذكر العناصر المتدخلة في حدوث الترجمة.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "ريبوزوم، ARNt...",
                minLength: 40,
                modelAnswer: "العناصر المتدخلة: ARNm، الريبوزوم، ARNt، الأحماض الأمينية المنشطة، طاقة ATP.",
                rule: {
                  prompt: "ذكر العناصر المتدخلة في الترجمة",
                  keywords: ["ريبوزوم", "ARNt", "ARNm"],
                  minHits: 2,
                  forbidden: ["بسبب"]
                }
              },
              E: {
                points: 2,
                prompt: "نص علمي حول خطوات الترجمة",
                bacPrompt: "اشرح في نص علمي خطوات الترجمة من البداية إلى النهاية.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "بداية، استطالة، نهاية...",
                minLength: 120,
                modelAnswer:
                  "ترتبط تحت الوحدة الصغرى بـ ARNm ثم يثبت ARNt الحامل للميثيونين على رامزة الانطلاق، فتستطيل السلسلة بروابط بيبتيدية وفق الرامزات حتى رامزة التوقف فينفصل متعدد الببتيد.",
                rule: {
                  prompt: "نص علمي حول خطوات الترجمة",
                  keywords: ["رامزه", "استطاله", "توقف", "ريبوزوم", "ARNt"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة: نتيجة توقف الترجمة",
                bacPrompt: "ما نتيجة غياب أحد عناصر الترجمة على تركيب البروتين؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer: "في الختام، بغياب ريبوزوم أو ARNt أو طاقة يتوقف تركيب البروتين الوظيفي.",
                rule: {
                  prompt: "الخاتمة: نتيجة توقف الترجمة",
                  keywords: ["ترجمه", "بروتين", "يتوقف"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 2,
            ui: "text",
            label: "النقل المشبكي والمبلغ العصبي",
            max: 7,
            desc: "آلية النقل المشبكي الكيميائي ودور المبلغ العصبي — موضوع 2 غير مكتمل في طبقة النص",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية: كيف تنتقل الرسالة عبر المشبك الكيميائي؟",
                bacPrompt: "كيف تنتقل الرسالة العصبية من خلية قبل مشبكية إلى خلية بعد مشبكية؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف يحرَّر المبلغ العصبي في الشق المشبكي فيولّد جهدا بعد مشبكي على الغشاء التالي؟",
                rule: {
                  prompt: "تأطير الإشكالية: كيف تنتقل الرسالة عبر المشبك الكيميائي؟",
                  keywords: ["مشبك", "مبلغ", "عصبي"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2.5,
                prompt: "تحليل تسجيلات قبل وبعد المشبك",
                bacPrompt: "حلّل التسجيلات المحصل عليها قبل المشبك وبعده.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "كمون عمل، PPSE...",
                minLength: 90,
                modelAnswer:
                  "تمثل الوثيقة تسجيلات الكمون بدلالة الزمن قبل المشبك وبعده. نلاحظ كمون عمل في الغشاء قبل المشبكي وجهدا بعد مشبكي تنبيهيا على الغشاء التالي بعد تأخير مشبكي، ومنه نستنتج انتقالا كيميائيا عبر المبلغ.",
                rule: {
                  prompt: "تحليل تسجيلات قبل وبعد المشبك",
                  keywords: ["كمون", "مشبكي", "تسجيل"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["كمون", "زمن"],
                    comparisons: [["قبل", "بعد"]],
                    trends: [{ about: "بعد", expect: ["كمون", "مشبكي"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2.5,
                prompt: "شرح آلية تحرير المبلغ العصبي",
                bacPrompt: "اشرح آلية تحرير المبلغ العصبي وتوليد الجهد بعد المشبكي.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "كالسيوم، حويصلات، مستقبل...",
                minLength: 110,
                modelAnswer:
                  "يدخل Ca²⁺ إلى النهاية قبل المشبكية فتهاجر الحويصلات ويتحرر المبلغ في الشق، فيثبت على مستقبل بعد مشبكي فتنفتح قنوات شاردية ويتولد جهد بعد مشبكي.",
                rule: {
                  prompt: "شرح آلية تحرير المبلغ العصبي",
                  keywords: ["كالسيوم", "حويصلات", "مستقبل", "مبلغ", "قناه"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة: طبيعة المشبك",
                bacPrompt: "ما طبيعة هذا المشبك انطلاقا من وجود تأخير ومبلغ كيميائي؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer: "في الختام، وجود تأخير مشبكي ومبلغ كيميائي يدل على مشبك كيميائي لا كهربائي.",
                rule: {
                  prompt: "الخاتمة: طبيعة المشبك",
                  keywords: ["مشبك", "كيميائي", "مبلغ"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 3,
            ui: "text",
            label: "الفسفرة التأكسدية وATP",
            max: 8,
            desc: "آلية تشكل ATP على مستوى الغشاء الداخلي للميتوكوندري — موضوع 2 غير مكتمل في طبقة النص",
            poles: {
              N: {
                points: 0.5,
                prompt: "اقتراح فرضية حول مصدر ATP في الميتوكوندري",
                bacPrompt: "اقترح فرضية حول آلية تشكل ATP في الميتوكوندري.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "الفرضية...",
                minLength: 30,
                modelAnswer:
                  "الفرضية: ينشأ تدرج بروتونات عبر الغشاء الداخلي فتمر H⁺ عبر ATP سنتاز فيتشكل ATP.",
                rule: {
                  prompt: "اقتراح فرضية حول مصدر ATP في الميتوكوندري",
                  keywords: ["فرضيه", "ATP", "بروتون"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2,
                prompt: "استغلال استهلاك O2 وإنتاج ATP",
                bacPrompt: "استغل تغيرات استهلاك O2 وإنتاج ATP في وجود نواقل مرجعة.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "O2، NADH، ATP...",
                minLength: 60,
                modelAnswer:
                  "تمثل الوثيقة استهلاك O2 وإنتاج ATP بدلالة الزمن. نلاحظ انخفاض O2 وارتفاع ATP بعد إضافة نواقل مرجعة، ومنه نستنتج اقتران أكسدة النواقل بفسفرة ADP.",
                rule: {
                  prompt: "استغلال استهلاك O2 وإنتاج ATP",
                  keywords: ["اكسجين", "ATP", "نواقل"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["ATP", "زمن"],
                    comparisons: [["O2", "ATP"]],
                    trends: [{ about: "ATP", expect: ["ارتفاع", "ATP"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 4,
                prompt: "شرح السلسلة التنفسية وتشكل ATP",
                bacPrompt: "اشرح كيف تؤدي أكسدة النواقل إلى تشكل ATP عبر السلسلة التنفسية.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "إلكترونات، بروتونات، ATP سنتاز...",
                minLength: 110,
                modelAnswer:
                  "تتأكسد النواقل فتنتقل الإلكترونات في السلسلة التنفسية نحو O2، وتُضخ البروتونات إلى الفراغ بين الغشاءين، ثم تعود عبر ATP سنتاز فيتشكل ATP.",
                rule: {
                  prompt: "شرح السلسلة التنفسية وتشكل ATP",
                  keywords: ["سلسله", "الكترون", "بروتون", "ATP", "اكسجين"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1.5,
                prompt: "مخطط تحويل الطاقة",
                bacPrompt: "لخّص في مخطط تحويل الطاقة الكيميائية الكامنة إلى ATP.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نواقل → سلسلة → تدرج H⁺ → ATP...",
                minLength: 40,
                modelAnswer:
                  "عنوان المخطط: فسفرة تأكسدية. نواقل مرجعة → سلسلة تنفسية → تدرج بروتونات → ATP سنتاز → ATP.",
                rule: {
                  prompt: "مخطط تحويل الطاقة",
                  keywords: ["مخطط", "ATP", "بروتون"],
                  minHits: 2,
                  forbidden: [],
                  schema: { arrows: true, title: "ATP", ordered: ["نواقل", "بروتون", "ATP"] }
                }
              }
            }
          }
        ]
      }
    ]
  },
  {
    id: "2019",
    label: "بكالوريا الجزائر دورة 2019",
    badge: "أرشيف مُعاد بناؤه",
    theme: "amber",
    enabled: true,
    sujets: [
      {
        id: 1,
        pdf: null,
        pdfAvailable: false,
        pdfExternalUrl:
          "https://www.dzexams.com/uploads/sujets/officiels/bac/2019/dzexams-bac-sciences-3051478.pdf",
        pdfNote:
          "PDF non redistribué dans le dépôt. Page dzexams : https://www.dzexams.com/ar/annales/OHlmRldmdmdDVUNVRHBadTE5em0vdz09. PDF dzexams محمي بكلمة مرور في العارض. Thèmes reconstruits pédagogiquement, non certifiables.",
        title: "الموضوع الأول",
        exercises: [
          {
            number: 1,
            ui: "text",
            label: "الاستنساخ وتركيب ARNm",
            max: 5,
            desc: "آلية الاستنساخ ودور إنزيم ARN بوليميراز في تركيب ARNm",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية: كيف يُستنسخ ARNm من ADN؟",
                bacPrompt: "كيف يتم استنساخ المعلومة الوراثية من ADN إلى ARNm؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer: "المشكل العلمي: كيف يقرأ ARN بوليميراز السلسلة الناسخة فيركب ARNm مكملا؟",
                rule: {
                  prompt: "تأطير الإشكالية: كيف يُستنسخ ARNm من ADN؟",
                  keywords: ["استنساخ", "ARNm", "بوليميراز"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 1,
                prompt: "تعرف على مراحل الاستنساخ",
                bacPrompt: "تعرّف على مراحل الاستنساخ: بداية واستطالة ونهاية.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "بداية، استطالة، نهاية...",
                minLength: 40,
                modelAnswer:
                  "البداية: يرتبط ARN بوليميراز ببداية المورثة ويفتح السلسلتين. الاستطالة: يقرأ السلسلة الناسخة ويربط نوكليوتيدات مكملة. النهاية: يصل إلى نهاية المورثة فينفصل ARNm.",
                rule: {
                  prompt: "تعرف على مراحل الاستنساخ",
                  keywords: ["بدايه", "استطاله", "نهايه"],
                  minHits: 2,
                  forbidden: ["بسبب"]
                }
              },
              E: {
                points: 2,
                prompt: "نص علمي حول الاستنساخ",
                bacPrompt: "اشرح في نص علمي آلية الاستنساخ داخل النواة.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "مقدمة، عرض، خاتمة...",
                minLength: 120,
                modelAnswer:
                  "في النواة يرتبط ARN بوليميراز بالمورثة ويكسر الروابط الهيدروجينية، ثم يركب ARNm وفق تتابع السلسلة الناسخة حتى نهاية المورثة فينفصل الجزيء حاملا المعلومة إلى الهيولى.",
                rule: {
                  prompt: "نص علمي حول الاستنساخ",
                  keywords: ["نواه", "بوليميراز", "ARNm", "ناسخه", "هيولي"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة: مصير ARNm",
                bacPrompt: "ما مصير ARNm بعد نهاية الاستنساخ؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer: "في الختام، ينتقل ARNm إلى الهيولى ليُترجم إلى بروتين ثم يُهدم بعد استعماله.",
                rule: {
                  prompt: "الخاتمة: مصير ARNm",
                  keywords: ["ARNm", "هيولي", "ترجمه"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 2,
            ui: "text",
            label: "الموقع الفعال والتخصص الإنزيمي",
            max: 7,
            desc: "العلاقة بين بنية الموقع الفعال ومادة التفاعل وتأثير درجة الحرارة وpH",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية: ما أصل التخصص الإنزيمي؟",
                bacPrompt: "كيف تضمن البنية الفراغية للإنزيم تخصصه الوظيفي؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف يتكامل الموقع الفعال مع مادة التفاعل فيحدد التخصص، وكيف تؤثر الحرارة وpH؟",
                rule: {
                  prompt: "تأطير الإشكالية: ما أصل التخصص الإنزيمي؟",
                  keywords: ["موقع", "فعال", "تخصص"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2.5,
                prompt: "تحليل تغيرات السرعة بدلالة pH والحرارة",
                bacPrompt: "حلّل تغيرات السرعة الابتدائية بدلالة pH ودرجة الحرارة.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "درجة مثلى، انخفاض على الطرفين...",
                minLength: 90,
                modelAnswer:
                  "نلاحظ سرعة أعظمية عند درجة pH وحرارة مثلى، بينما تنخفض السرعة في الطرفين، ومنه نستنتج وجود ظروف مثلى للنشاط الإنزيمي.",
                rule: {
                  prompt: "تحليل تغيرات السرعة بدلالة pH والحرارة",
                  keywords: ["سرعه", "حراره", "نشاط"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["سرعه", "PH"],
                    comparisons: [["مثلى", "طرف"]],
                    trends: [{ about: "مثلى", expect: ["اعظميه", "سرعه"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2.5,
                prompt: "تفسير تأثير pH والحرارة على الموقع الفعال",
                bacPrompt: "فسّر تأثير تغير pH وارتفاع الحرارة على الموقع الفعال.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "شحنات، تشوه، تخريب...",
                minLength: 110,
                modelAnswer:
                  "يغيّر pH شحنات الأحماض الأمينية في الموقع الفعال فيضعف التكامل مع الركيزة. وارتفاع الحرارة يخرب البنية الفراغية فيفقد الإنزيم تخصصه.",
                rule: {
                  prompt: "تفسير تأثير pH والحرارة على الموقع الفعال",
                  keywords: ["موقع", "فعال", "شحنات", "بنيه", "تخريب"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة: شروط النشاط",
                bacPrompt: "ما الشروط التي تحفظ النشاط الإنزيمي؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer:
                  "في الختام، يحفظ النشاط عند pH وحرارة قريبين من الوسط الخلوي حتى يبقى الموقع الفعال متكاملا.",
                rule: {
                  prompt: "الخاتمة: شروط النشاط",
                  keywords: ["نشاط", "موقع", "خلوي"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 3,
            ui: "text",
            label: "الاستجابة المناعية النوعية",
            max: 8,
            desc: "تعرف نوعي على المستضد وتدخل LB وLT في الاستجابة الفاعلة",
            poles: {
              N: {
                points: 0.5,
                prompt: "اقتراح فرضيتين حول آلية القضاء على المستضد",
                bacPrompt: "اقترح فرضيتين حول آلية الاستجابة المناعية النوعية ضد مستضد.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "فرضية 1، فرضية 2...",
                minLength: 30,
                modelAnswer:
                  "الفرضية 1: تستجيب LB بإنتاج أجسام مضادة نوعية. الفرضية 2: تستجيب LTc بتخريب الخلايا المصابة.",
                rule: {
                  prompt: "اقتراح فرضيتين حول آلية القضاء على المستضد",
                  keywords: ["فرضيه", "مستضد", "مضاده"],
                  minHits: 2,
                  forbidden: [],
                  hypotheses: { min: 2, distinct: true }
                }
              },
              S: {
                points: 2,
                prompt: "استغلال نتائج حقن المستضد",
                bacPrompt: "استغل تطور كمية الأجسام المضادة وعدد LTc بعد حقن المستضد.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "طور كموني ثم ارتفاع...",
                minLength: 60,
                modelAnswer:
                  "تمثل الوثيقة كمية الأجسام المضادة وعدد LTc بدلالة الزمن. نلاحظ بعد الحقن طورا كمونيا ثم ارتفاع كمية الأجسام المضادة وعدد LTc، ومنه نستنتج استجابة نوعية خلطية وخلوية.",
                rule: {
                  prompt: "استغلال نتائج حقن المستضد",
                  keywords: ["اجسام", "مضاده", "LTc"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["كميه", "زمن"],
                    comparisons: [["مضاده", "LTc"]],
                    trends: [{ about: "مضاده", expect: ["ارتفاع", "كميه"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 4,
                prompt: "تفسير التعاون المناعي",
                bacPrompt: "فسّر دور LT4 في التعاون بين الاستجابة الخلطية والخلوية.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "إنترلوكينات، تكاثر، تمايز...",
                minLength: 110,
                modelAnswer:
                  "تتعرف LT4 على الببتيد المعروض مع CMH II فتفرز إنترلوكينات تحفّز تكاثر LB وتمايزها إلى بلاسموسيت وتكاثر LTc، فتتأكد الفرضيتان بالتعاون المناعي.",
                rule: {
                  prompt: "تفسير التعاون المناعي",
                  keywords: ["LT4", "انترلوكين", "LB", "LTc", "تعاون"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1.5,
                prompt: "مخطط الاستجابة النوعية",
                bacPrompt: "لخّص في مخطط مسار الاستجابة المناعية النوعية.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "مستضد → LT4 → LB/LTc...",
                minLength: 40,
                modelAnswer:
                  "عنوان المخطط: استجابة نوعية. مستضد → عرض على CMH → LT4 → إنترلوكينات → أجسام مضادة وتخريب خلوي.",
                rule: {
                  prompt: "مخطط الاستجابة النوعية",
                  keywords: ["مخطط", "مستضد", "LT4"],
                  minHits: 2,
                  forbidden: [],
                  schema: { arrows: true, title: "استجابة نوعية", ordered: ["مستضد", "LT4", "مضاده"] }
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
          "https://www.dzexams.com/uploads/sujets/officiels/bac/2019/dzexams-bac-sciences-3051478.pdf",
        pdfNote:
          "PDF non redistribué dans le dépôt. Page dzexams : https://www.dzexams.com/ar/annales/OHlmRldmdmdDVUNVRHBadTE5em0vdz09. PDF dzexams محمي بكلمة مرور في العارض. Thèmes reconstruits pédagogiquement, non certifiables.",
        title: "الموضوع الثاني",
        exercises: [
          {
            number: 1,
            ui: "text",
            label: "كمون العمل والقنوات الفولطية",
            max: 5,
            desc: "دور قنوات Na⁺ وK⁺ الفولطية في توليد كمون العمل",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية: كيف يتولد كمون العمل؟",
                bacPrompt: "كيف تتدخل القنوات الفولطية في توليد كمون العمل؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer: "المشكل العلمي: كيف يؤدي تتابع انفتاح قنوات Na⁺ ثم K⁺ الفولطية إلى كمون العمل؟",
                rule: {
                  prompt: "تأطير الإشكالية: كيف يتولد كمون العمل؟",
                  keywords: ["كمون", "عمل", "قنوات"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 1,
                prompt: "تعرف على أطوار كمون العمل",
                bacPrompt: "سمّ أطوار كمون العمل والشوارد المتدخلة في كل طور.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "زوال استقطاب، عودة استقطاب...",
                minLength: 40,
                modelAnswer:
                  "زوال الاستقطاب بدخول Na⁺ عبر قنوات فولطية، ثم عودة الاستقطاب بخروج K⁺، يليه فرط استقطاب عابر قبل العودة إلى كمون الراحة.",
                rule: {
                  prompt: "تعرف على أطوار كمون العمل",
                  keywords: ["استقطاب", "صوديوم", "بوتاسيوم"],
                  minHits: 2,
                  forbidden: ["بسبب"]
                }
              },
              E: {
                points: 2,
                prompt: "نص علمي حول آلية كمون العمل",
                bacPrompt: "اشرح في نص علمي آلية توليد كمون العمل على غشاء العصبون.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "عتبة، قنوات فولطية...",
                minLength: 120,
                modelAnswer:
                  "عند بلوغ العتبة تنفتح قنوات Na⁺ الفولطية فيدخل الصوديوم ويزول الاستقطاب، ثم تنفتح قنوات K⁺ فيخرج البوتاسيوم وتعود القطبية، فينتشر كمون العمل على طول الليف.",
                rule: {
                  prompt: "نص علمي حول آلية كمون العمل",
                  keywords: ["عتبه", "قنوات", "صوديوم", "بوتاسيوم", "ليف"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة: قابلية التنبيه",
                bacPrompt: "ما شرط قابلية تنبيه الليف العصبي؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer: "في الختام، تبقى قابلية التنبيه مرتبطة بوجود كمون راحة وقنوات فولطية وظيفية.",
                rule: {
                  prompt: "الخاتمة: قابلية التنبيه",
                  keywords: ["تنبيه", "كمون", "قنوات"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 2,
            ui: "text",
            label: "التنفس الخلوي والحصيلة الطاقوية",
            max: 7,
            desc: "مراحل هدم الغلوكوز في وجود O2 وحصيلة ATP",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية: كيف تُحوَّل طاقة الغلوكوز إلى ATP؟",
                bacPrompt: "كيف تُحوَّل الطاقة الكيميائية الكامنة في الغلوكوز إلى ATP في وجود O2؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف تتكامل التحلل السكري وحلقة كريبس والفسفرة التأكسدية لإنتاج ATP؟",
                rule: {
                  prompt: "تأطير الإشكالية: كيف تُحوَّل طاقة الغلوكوز إلى ATP؟",
                  keywords: ["غلوكوز", "ATP", "تنفس"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2.5,
                prompt: "تحليل استهلاك O2 وإنتاج CO2 وATP",
                bacPrompt: "حلّل تغيرات O2 وCO2 وATP خلال التنفس.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "انخفاض O2، ارتفاع CO2 وATP...",
                minLength: 90,
                modelAnswer:
                  "تمثل الوثيقة تغيرات الأكسجين وATP بدلالة الزمن. نلاحظ انخفاض O2 وارتفاع CO2 وATP في وجود الغلوكوز، ومنه نستنتج أكسدة الغلوكوز المقترنة بإنتاج طاقة قابلة للاستعمال.",
                rule: {
                  prompt: "تحليل استهلاك O2 وإنتاج CO2 وATP",
                  keywords: ["اكسجين", "ATP", "غلوكوز"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["اكسجين", "زمن"],
                    comparisons: [["O2", "ATP"]],
                    trends: [{ about: "ATP", expect: ["ارتفاع", "ATP"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2.5,
                prompt: "شرح مراحل التنفس",
                bacPrompt: "اشرح مراحل هدم الغلوكوز في وجود الأكسجين.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "تحلل سكري، كريبس، سلسلة تنفسية...",
                minLength: 110,
                modelAnswer:
                  "يتحلل الغلوكوز في الهيولى إلى حمض بيروفيك، ثم تتأكسد في المادة الأساسية للميتوكوندري داخل حلقة كريبس، وتُؤكسَد النواقل في السلسلة التنفسية فينتج ATP وماء.",
                rule: {
                  prompt: "شرح مراحل التنفس",
                  keywords: ["تحلل", "كريبس", "سلسله", "بيروفيك", "ATP"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة: أهمية O2",
                bacPrompt: "ما دور O2 في استمرار إنتاج ATP؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer:
                  "في الختام، يستقبل O2 الإلكترونات في نهاية السلسلة فيستمر تدرج البروتونات وتشكل ATP.",
                rule: {
                  prompt: "الخاتمة: أهمية O2",
                  keywords: ["اكسجين", "ATP", "الكترون"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 3,
            ui: "text",
            label: "التكتونية العامة للصفائح",
            max: 8,
            desc: "حركة الصفائح وعلاقتها بالظهرة المحيطية وآلية الحمل الحراري",
            poles: {
              N: {
                points: 0.5,
                prompt: "اقتراح فرضية حول محرك الصفائح",
                bacPrompt: "اقترح فرضية حول الآلية المحركة للصفائح التكتونية.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "الفرضية...",
                minLength: 30,
                modelAnswer:
                  "الفرضية: تيارات الحمل الحراري في الرداء تحرك الصفائح عند الظهرة والمناطق الهابطة.",
                rule: {
                  prompt: "اقتراح فرضية حول محرك الصفائح",
                  keywords: ["فرضيه", "صفائح", "حمل"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2,
                prompt: "استغلال أعمار البازلت وتدفق الحرارة",
                bacPrompt: "استغل توزع أعمار البازلت وتدفق الحرارة على جانبي الظهرة.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "العمر يزداد بالابتعاد عن الظهرة...",
                minLength: 60,
                modelAnswer:
                  "تمثل الوثيقة عمر البازلت وتدفق الحرارة بدلالة المسافة. نلاحظ عند الظهرة حرارة أعلى وعمرا أصغر، بينما عند الطرف يزداد العمر وتنخفض الحرارة، ومنه نستنتج توسعا محيطيا.",
                rule: {
                  prompt: "استغلال أعمار البازلت وتدفق الحرارة",
                  keywords: ["ظهره", "بازلت", "حراره"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "table",
                    axes: ["عمر", "مسافه"],
                    comparisons: [["ظهره", "طرف"]],
                    cells: [["بازلت", "حراره"]],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 4,
                prompt: "تفسير محرك الصفائح",
                bacPrompt: "فسّر كيف تحرك تيارات الحمل الصفائح التكتونية.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صعود مادة ساخنة، غوص...",
                minLength: 110,
                modelAnswer:
                  "تصعد مادة ساخنة قليلة الكثافة عند الظهرة فتتكون قشرة جديدة، وتهبط الصفيحة الباردة في مناطق الغوص، فتتأكد فرضية الحمل الحراري كمحرك.",
                rule: {
                  prompt: "تفسير محرك الصفائح",
                  keywords: ["حمل", "ظهره", "غوص", "صفائح", "رداء"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1.5,
                prompt: "مخطط دورة الصفيحة",
                bacPrompt: "لخّص في مخطط دورة المادة من الظهرة إلى منطقة الغوص.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "ظهرة → صفيحة → غوص...",
                minLength: 40,
                modelAnswer: "عنوان المخطط: دورة تكتونية. ظهرة → صفائح → غوص.",
                rule: {
                  prompt: "مخطط دورة الصفيحة",
                  keywords: ["مخطط", "ظهره", "غوص"],
                  minHits: 2,
                  forbidden: [],
                  schema: { arrows: true, title: "تكتونية", ordered: ["ظهره", "صفائح", "غوص"] }
                }
              }
            }
          }
        ]
      }
    ]
  },
  {
    id: "2018",
    label: "بكالوريا الجزائر دورة 2018",
    badge: "أرشيف مُعاد بناؤه",
    theme: "emerald",
    enabled: true,
    sujets: [
      {
        id: 1,
        pdf: null,
        pdfAvailable: false,
        pdfExternalUrl: "https://www.dzexams.com/ar/annales/RGZmd0lTRW0xNmZTRUFjR0F5QzMwZz09",
        pdfNote:
          "PDF non redistribué dans le dépôt. Page dzexams : https://www.dzexams.com/ar/annales/RGZmd0lTRW0xNmZTRUFjR0F5QzMwZz09. Thèmes relus sur la couche texte dzexams (OCR inversé, 2026-08-30). Wording reconstructed.",
        title: "الموضوع الأول",
        exercises: [
          {
            number: 1,
            ui: "text",
            label: "البروتينات الغشائية والرسالة العصبية",
            max: 5,
            desc: "بروتينات أغشية الخلايا العصبية المتدخلة في توليد وانتشار الرسالة العصبية وآلية دمجها على العصبون المحرك",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية: كيف تؤمن البروتينات الغشائية نقل الرسالة العصبية ودمجها؟",
                bacPrompt: "كيف تتدخل البروتينات الغشائية في توليد وانتشار الرسالة العصبية ودمجها؟",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل مختلف البروتينات الغشائية في توليد وانتشار الرسالة العصبية ودمجها على مستوى العصبون المحرك؟",
                rule: {
                  prompt: "تأطير الإشكالية: كيف تؤمن البروتينات الغشائية نقل الرسالة العصبية ودمجها؟",
                  keywords: ["غشائي", "رساله", "عصبيه"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 1,
                prompt: "ذكر البروتينات الغشائية ودور كل منها",
                bacPrompt:
                  "اذكر مختلف البروتينات الغشائية المتدخلة في توليد وانتشار الرسالة العصبية عبر سلسلة عصبونية محددا دور كل منها.",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "قنوات فولطية، مضخة، مستقبلات...",
                minLength: 40,
                modelAnswer:
                  "القنوات الفولطية لـ Na⁺ وK⁺ تولد كمون العمل. مضخة Na⁺/K⁺ تحفظ كمون الراحة. قنوات الكالسيوم الفولطية تسمح بالتحرير. مستقبلات بعد مشبكية تولد PPSE أو PPSI.",
                rule: {
                  prompt: "ذكر البروتينات الغشائية ودور كل منها",
                  keywords: ["قنوات", "مضخه", "مستقبل"],
                  minHits: 2,
                  forbidden: ["بسبب"]
                }
              },
              E: {
                points: 2,
                prompt: "نص علمي حول دمج الرسائل على العصبون المحرك",
                bacPrompt: "اكتب نصا علميا تبيّن فيه آلية دمج الرسائل العصبية على مستوى العصبون المحرك.",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "تجميع فضائي وزماني...",
                minLength: 120,
                modelAnswer:
                  "تصل إلى العصبون المحرك جهود بعد مشبكية تنبيهية وتثبيطية. يُدمج المحصّل تجميعا فضائيا وزمانيا على مستوى القطعة الابتدائية، فإذا بلغ العتبة تولد كمون عمل وانتشر نحو العضلة.",
                rule: {
                  prompt: "نص علمي حول دمج الرسائل على العصبون المحرك",
                  keywords: ["دمج", "تنبيهي", "تثبيطي", "عتبه", "محرك"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة: شرط صدور الرسالة الحركية",
                bacPrompt: "ما شرط صدور رسالة عصبية حركية بعد الدمج؟",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer: "في الختام، لا تصدر رسالة حركية إلا إذا بلغ محصّل الدمج عتبة توليد كمون العمل.",
                rule: {
                  prompt: "الخاتمة: شرط صدور الرسالة الحركية",
                  keywords: ["دمج", "عتبه", "حركيه"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 2,
            ui: "text",
            label: "مستقبل LDL وتصلب الشرايين",
            max: 7,
            desc: "دخول LDL عبر المستقبل الغشائي R، ودور الأحماض الأمينية في ثبات بنيته، وأثر طفرة الأليل على تصلب الشرايين",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية: كيف تؤدي طفرة مستقبل LDL إلى تصلب الشرايين؟",
                bacPrompt: "كيف ترتبط بنية المستقبل الغشائي لـ LDL بالحالة الصحية وتصلب الشرايين؟",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف تضمن أحماض أمينية محددة ثبات مستقبل LDL، وكيف تفقد الطفرة هذا التخصص فيرتفع الكولسترول؟",
                rule: {
                  prompt: "تأطير الإشكالية: كيف تؤدي طفرة مستقبل LDL إلى تصلب الشرايين؟",
                  keywords: ["LDL", "مستقبل", "طفره"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2.5,
                prompt: "تحديد دور الأحماض الأمينية في ثبات المستقبل",
                bacPrompt:
                  "حدد بدقة دور الأحماض الأمينية في كشف وثبات البنية الفراغية للمستقبل R باستغلال الشكلين أ و ب.",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "جسور، شحنات، تموضع...",
                minLength: 90,
                modelAnswer:
                  "تمثل الوثيقة تتابع الأحماض الأمينية في المستقبل LDL بدلالة الموضع عند السليم والمصاب. نلاحظ تموضعا دقيقا لأحماض مشحونة وكبريتية عند السليم، بينما يختل التموضع عند المصاب، ومنه نستنتج أن الروابط تثبّت البنية الفراغية اللازمة للتعرف على LDL.",
                rule: {
                  prompt: "تحديد دور الأحماض الأمينية في ثبات المستقبل",
                  keywords: ["احماض", "بنيه", "مستقبل", "LDL"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "table",
                    axes: ["حمض", "موضع"],
                    comparisons: [["سليم", "مصاب"]],
                    cells: [["LDL", "مستقبل"]],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2.5,
                prompt: "مناقشة العلاقة بين الطفرة وتصلب الشرايين",
                bacPrompt:
                  "ناقش العلاقة بين بنية المستقبل الغشائي لـ LDL والحالة الصحية للشخص السليم مقارنة بالمصاب.",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "أليل R1 وR2، كولسترول...",
                minLength: 110,
                modelAnswer:
                  "عند السليم يثبت LDL على مستقبل وظيفي فيُقتنص. عند المصاب تغيّر الطفرة حمضا أمينيا فيفقد المستقبل شكله فلا يدخل LDL، فيرتفع الكولسترول في الدم ويتصلب الشريان.",
                rule: {
                  prompt: "مناقشة العلاقة بين الطفرة وتصلب الشرايين",
                  keywords: ["طفره", "كولسترول", "مستقبل", "شرايين", "LDL"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة: أصل المرض",
                bacPrompt: "ما أصل تصلب الشرايين في هذه الدراسة؟",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer:
                  "في الختام، أصل المرض طفرة في مورثة المستقبل تمنع اقتناص LDL فيتراكم الكولسترول.",
                rule: {
                  prompt: "الخاتمة: أصل المرض",
                  keywords: ["طفره", "LDL", "كولسترول"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 3,
            ui: "text",
            label: "العقم والنطاف وCoenzyme Q10",
            max: 8,
            desc: "علاقة نقص حركة النطاف بتحول الطاقة، ودور Coenzyme Q10 في السلسلة التنفسية",
            poles: {
              N: {
                points: 0.5,
                prompt: "اقتراح فرضية حول سبب قلة حركة النطاف",
                bacPrompt: "اقترح فرضية تفسر قلة حركة النطاف عند الشخص س.",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "الفرضية...",
                minLength: 30,
                modelAnswer:
                  "الفرضية: يعود نقص الحركة إلى خلل في أكسدة النواقل المرجعة فلا يتشكل ATP الكافي لحركة النطفة.",
                rule: {
                  prompt: "اقتراح فرضية حول سبب قلة حركة النطاف",
                  keywords: ["فرضيه", "نطاف", "ATP"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2,
                prompt: "تحليل استهلاك O2 في معلق النطاف",
                bacPrompt: "حلّل نتائج تغيرات نسبة O2 في المعلقين بعد إضافة الناقل TH2.",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "معلق سليم ومعلق الشخص س...",
                minLength: 60,
                modelAnswer:
                  "تمثل الوثيقة نسبة الأكسجين بدلالة الزمن في المعلق السليم والمصاب. نلاحظ عند السليم انخفاضا واضحا في O2 بعد إضافة TH2، بينما يبقى الانخفاض ضعيفا عند المصاب، ومنه نستنتج ضعفا في أكسدة النواقل عند المصاب.",
                rule: {
                  prompt: "تحليل استهلاك O2 في معلق النطاف",
                  keywords: ["اكسجين", "نطاف", "ناقل"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["اكسجين", "زمن"],
                    comparisons: [["سليم", "مصاب"]],
                    trends: [{ about: "سليم", expect: ["انخفاض", "اكسجين"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 4,
                prompt: "تفسير تأثير Coenzyme Q10",
                bacPrompt:
                  "فسّر آلية تأثير الدواء المكون من Coenzyme Q10 على حركة النطاف مع المصادقة على الفرضية.",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "سلسلة تنفسية، ATP، حركة...",
                minLength: 110,
                modelAnswer:
                  "يعيد Coenzyme Q10 نقل الإلكترونات في السلسلة التنفسية فيستأنف تدرج البروتونات ويتشكل ATP فتعود حركة النطاف، فتتأكد فرضية الخلل الطاقوي.",
                rule: {
                  prompt: "تفسير تأثير Coenzyme Q10",
                  keywords: ["Q10", "سلسله", "ATP", "نطاف", "الكترون"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1.5,
                prompt: "مخطط العلاقة أيض-O2-وظائف حيوية",
                bacPrompt: "اشرح العلاقة بين هدم مادة الأيض واستهلاك O2 والقيام بالوظائف الحيوية.",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "فركتوز → نواقل → O2 → ATP → حركة...",
                minLength: 40,
                modelAnswer:
                  "عنوان المخطط: طاقة النطفة. فركتوز → نواقل مرجعة → سلسلة تنفسية تستهلك O2 → ATP → نطاف. في وجود Q10 تُستأنف السلسلة.",
                rule: {
                  prompt: "مخطط العلاقة أيض-O2-وظائف حيوية",
                  keywords: ["مخطط", "ATP", "نطاف"],
                  minHits: 2,
                  forbidden: [],
                  schema: { arrows: true, title: "ATP", ordered: ["فركتوز", "ATP", "نطاف"] }
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
        pdfExternalUrl: "https://www.dzexams.com/ar/annales/RGZmd0lTRW0xNmZTRUFjR0F5QzMwZz09",
        pdfNote:
          "PDF non redistribué dans le dépôt. Page dzexams : https://www.dzexams.com/ar/annales/RGZmd0lTRW0xNmZTRUFjR0F5QzMwZz09. Thèmes relus sur la couche texte dzexams (OCR inversé, 2026-08-30). Wording reconstructed.",
        title: "الموضوع الثاني",
        exercises: [
          {
            number: 1,
            ui: "text",
            label: "نظام الزمر الدموية ABO",
            max: 5,
            desc: "المؤشرات الغشائية لنظام ABO على كريات الدم الحمراء ودور الأليلات IA وIB وi",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية: كيف يظهر النمط الظاهري للزمرة؟",
                bacPrompt: "كيف تفسر اختلاف المؤشرات الغشائية لنظام ABO بين الزمر؟",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف تحدد الأليلات IA وIB وi نوع المستضد الغشائي على كرية الدم الحمراء؟",
                rule: {
                  prompt: "تأطير الإشكالية: كيف يظهر النمط الظاهري للزمرة؟",
                  keywords: ["زمره", "مستضد", "اليل"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 1,
                prompt: "المقارنة بين الزمر والمؤشرات",
                bacPrompt: "قارن بين المؤشرات الغشائية المميزة لكل زمرة دموية.",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "مستضد H، A، B...",
                minLength: 40,
                modelAnswer:
                  "الزمرة O تحمل مستضد H فقط، والزمرة A تضيف غالاكتوز أمين على H، والزمرة B تضيف غالاكتوز، والزمرة AB تحمل المستضدين A وB.",
                rule: {
                  prompt: "المقارنة بين الزمر والمؤشرات",
                  keywords: ["مستضد", "زمره", "غشاء"],
                  minHits: 2,
                  forbidden: ["بسبب"]
                }
              },
              E: {
                points: 2,
                prompt: "نص علمي حول وراثة الزمر",
                bacPrompt: "اكتب نصا علميا تشرح فيه كيف يتحكم النمط الوراثي في النمط الظاهري لنظام ABO.",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "سيادة، غياب سيادة...",
                minLength: 120,
                modelAnswer:
                  "يشرف الصبغي 9 على أليلات IA وIB السائدتين بالنسبة إلى i المتنحي، وبين IA وIB غياب سيادة. يركّب كل أليل سائد إنزيما يضيف سكرا نوعيا على المستضد H فيظهر النمط الظاهري للزمرة.",
                rule: {
                  prompt: "نص علمي حول وراثة الزمر",
                  keywords: ["اليل", "سياده", "مستضد", "زمره", "نمط"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة: أهمية معرفة الزمرة",
                bacPrompt: "ما أهمية معرفة مؤشرات الزمرة عند نقل الدم؟",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer:
                  "في الختام، تحدد المؤشرات الغشائية التوافق عند النقل، فكل مستضد غريب يُرفض بالأجسام المضادة.",
                rule: {
                  prompt: "الخاتمة: أهمية معرفة الزمرة",
                  keywords: ["زمره", "مستضد", "نقل"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 2,
            ui: "text",
            label: "اللاكتاز وعدم تحمل اللاكتوز",
            max: 7,
            desc: "نشاط إنزيم اللاكتاز وتأثير pH والحرارة والثيولاكتوز، وعلاقة نقصه بأعراض عدم التحمل",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية: ما أصل عدم تحمل اللاكتوز؟",
                bacPrompt: "كيف يرتبط نشاط اللاكتاز بأعراض عدم تحمل اللاكتوز؟",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer: "المشكل العلمي: كيف يؤثر نقص اللاكتاز على هضم اللاكتوز فتظهر أعراض عدم التحمل؟",
                rule: {
                  prompt: "تأطير الإشكالية: ما أصل عدم تحمل اللاكتوز؟",
                  keywords: ["لاكتاز", "لاكتوز", "تحمل"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2.5,
                prompt: "تحليل أثر pH والحرارة على السرعة الابتدائية",
                bacPrompt:
                  "أنشئ منحنى تغير السرعة الابتدائية بدلالة pH الوسط مفسرا تأثيرها، ثم استنتج أثر الحرارة.",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "pH أمثل، حرارة منخفضة أو مرتفعة...",
                minLength: 90,
                modelAnswer:
                  "تمثل الوثيقة تغير السرعة بدلالة pH. نلاحظ سرعة أعظمية عند pH قريب من المعتدل وحرارة متوسطة، بينما تنعدم عند الطرف، ومنه نستنتج أن اللاكتاز يعمل في ظروف المعي الدقيق.",
                rule: {
                  prompt: "تحليل أثر pH والحرارة على السرعة الابتدائية",
                  keywords: ["سرعه", "لاكتاز", "حراره"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["سرعه", "PH"],
                    comparisons: [["معتدل", "طرف"]],
                    trends: [{ about: "معتدل", expect: ["اعظميه", "سرعه"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2.5,
                prompt: "تفسير أعراض عدم التحمل",
                bacPrompt: "اشرح سبب ظهور أعراض عدم تحمل اللاكتوز عند المصاب وعدم ظهورها عند السليم.",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "تخمرات في المعي الغليظ...",
                minLength: 110,
                modelAnswer:
                  "عند السليم يهضم اللاكتاز اللاكتوز في المعي الدقيق فلا يصل إلى الغليظ. عند المصاب ينقص اللاكتاز فيصل اللاكتوز إلى المعي الغليظ حيث تخمره البكتيريا فتتكون غازات وأحماض مسببة الانتفاخ والآلام.",
                rule: {
                  prompt: "تفسير أعراض عدم التحمل",
                  keywords: ["لاكتاز", "تخمر", "معي", "غازات", "مصاب"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة: مفهوم الإنزيم",
                bacPrompt: "ما المفهوم الدقيق للإنزيم انطلاقا من هذه الدراسة؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer:
                  "في الختام، الإنزيم وسيط حيوي نوعي يسرّع التفاعل في ظروف ملائمة دون أن يُستهلك، ونقصه يعطل الهضم.",
                rule: {
                  prompt: "الخاتمة: مفهوم الإنزيم",
                  keywords: ["انزيم", "نوعي", "تفاعل"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 3,
            ui: "text",
            label: "Cyanobacter وتحويل الطاقة الضوئية",
            max: 8,
            desc: "قدرة بكتيريا Cyanobacter على تحويل الطاقة الضوئية إلى طاقة كيميائية كامنة مع طرح O2",
            poles: {
              N: {
                points: 0.5,
                prompt: "اقتراح فرضية حول مصدر O2 المطروح",
                bacPrompt: "اقترح فرضية فيما يخص مصدر وآلية طرح ثنائي الأكسجين عند Cyanobacter.",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "الفرضية...",
                minLength: 30,
                modelAnswer: "الفرضية: ينتج O2 من أكسدة الماء خلال المرحلة الكيميائية الضوئية بوجود الضوء.",
                rule: {
                  prompt: "اقتراح فرضية حول مصدر O2 المطروح",
                  keywords: ["فرضيه", "اكسجين", "ضوء"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2,
                prompt: "استغلال ارتفاع O2 في الضوء",
                bacPrompt: "استغل ارتفاع نسبة O2 عند تعريض Cyanobacter للضوء.",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "في الضوء يرتفع O2...",
                minLength: 60,
                modelAnswer:
                  "تمثل الوثيقة نسبة الأكسجين بدلالة الزمن في الضوء والظلام. نلاحظ ارتفاع O2 في الضوء وعدم ارتفاعه في الظلام، ومنه نستنتج أن الضوء ضروري لطرح الأكسجين.",
                rule: {
                  prompt: "استغلال ارتفاع O2 في الضوء",
                  keywords: ["اكسجين", "ضوء", "ظلام"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["اكسجين", "زمن"],
                    comparisons: [["ضوء", "ظلام"]],
                    trends: [{ about: "ضوء", expect: ["ارتفاع", "اكسجين"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 4,
                prompt: "تفسير آلية طرح O2",
                bacPrompt: "فسّر الآلية التي تسمح لـ Cyanobacter بطرح O2 وتحويل الطاقة الضوئية.",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "فوتونات، أكسدة الماء، نواقل...",
                minLength: 110,
                modelAnswer:
                  "تمتص الأنظمة الضوئية الفوتونات فتتأكسد جزيئة الماء وينطلق O2 وتتحرر إلكترونات تختزل النواقل، فتتحول الطاقة الضوئية إلى طاقة كيميائية كامنة. تتأكد الفرضية.",
                rule: {
                  prompt: "تفسير آلية طرح O2",
                  keywords: ["ضوء", "ماء", "اكسجين", "الكترون", "طاقه"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1.5,
                prompt: "مخطط تحويل الطاقة الضوئية",
                bacPrompt: "لخّص في مخطط تحويل الطاقة الضوئية إلى طاقة كيميائية كامنة مع طرح O2.",
                ...RECON(
                  "Couche texte dzexams bruitée ou inversée, relue le 2026-08-30. Wording reconstructed, non certifiable official. Pas de question autonome de cadrage pour N/W quand la consigne officielle est unique."
                ),
                placeholder: "ضوء → ماء → اكسجين",
                minLength: 40,
                modelAnswer: "عنوان المخطط: ضوء. ضوء → ماء → اكسجين.",
                rule: {
                  prompt: "مخطط تحويل الطاقة الضوئية",
                  keywords: ["مخطط", "ضوء", "اكسجين"],
                  minHits: 2,
                  forbidden: [],
                  schema: { arrows: true, title: "ضوء", ordered: ["ضوء", "ماء", "اكسجين"] }
                }
              }
            }
          }
        ]
      }
    ]
  },
  {
    id: "2017",
    label: "بكالوريا الجزائر دورة 2017",
    badge: "أرشيف مُعاد بناؤه",
    theme: "rose",
    enabled: true,
    sujets: [
      {
        id: 1,
        pdf: null,
        pdfAvailable: false,
        pdfExternalUrl:
          "https://www.dzexams.com/uploads/sujets/officiels/bac/2017/dzexams-bac-sciences-2581269.pdf",
        pdfNote:
          "PDF non redistribué dans le dépôt. Page dzexams : https://www.dzexams.com/ar/annales/dFRNWk1JWkt2aC8vdFZtZVNMWGRwZz09. Session normale 2017. PDF dzexams محمي في العارض. Thèmes pédagogiques reconstruits.",
        title: "الموضوع الأول",
        exercises: [
          {
            number: 1,
            ui: "text",
            label: "الشفرة الوراثية والترجمة",
            max: 5,
            desc: "علاقة الرامزة بتتابع الأحماض الأمينية أثناء الترجمة",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية حول: الشفرة الوراثية والترجمة",
                bacPrompt: "ما المشكل العلمي المرتبط بـ الشفرة الوراثية والترجمة؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ الشفرة الوراثية والترجمة في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: الشفرة الوراثية والترجمة",
                  keywords: ["رامزه", "ترجمه"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 1,
                prompt: "استغلال الوثيقة المتعلقة بـ الشفرة الوراثية والترجمة",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ الشفرة الوراثية والترجمة.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 40,
                modelAnswer:
                  "تمثل الوثيقة تغيرات رامزه بدلالة الزمن مقارنة بـ ترجمه. نلاحظ تغيرا واضحا في رامزه مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع ترجمه.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ الشفرة الوراثية والترجمة",
                  keywords: ["رامزه", "ترجمه", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["رامزه", "زمن"],
                    comparisons: [["رامزه", "ترجمه"]],
                    trends: [{ about: "رامزه", expect: ["رامزه", "ترجمه"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2,
                prompt: "تفسير الآلية المرتبطة بـ الشفرة الوراثية والترجمة",
                bacPrompt: "اشرح الآلية التي تفسر الشفرة الوراثية والترجمة انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 120,
                modelAnswer:
                  "يعود ذلك إلى تدخل رامزه وترجمه عبر آلية دقيقة تؤدي إلى ARNm، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ الشفرة الوراثية والترجمة",
                  keywords: ["رامزه", "ترجمه", "ARNm"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة التركيبية حول الشفرة الوراثية والترجمة",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ الشفرة الوراثية والترجمة.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer: "في الختام، ترتبط النتيجة النهائية بـ رامزه وترجمه فتُغلق الظاهرة على ARNm.",
                rule: {
                  prompt: "الخاتمة التركيبية حول الشفرة الوراثية والترجمة",
                  keywords: ["رامزه", "ARNm", "ختام"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 2,
            ui: "text",
            label: "البنية الفراغية للبروتين",
            max: 7,
            desc: "الروابط المسؤولة عن ثبات البنية الفراغية وأثر الطفرة",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية حول: البنية الفراغية للبروتين",
                bacPrompt: "ما المشكل العلمي المرتبط بـ البنية الفراغية للبروتين؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ البنية الفراغية للبروتين في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: البنية الفراغية للبروتين",
                  keywords: ["بنيه", "روابط"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2.5,
                prompt: "استغلال الوثيقة المتعلقة بـ البنية الفراغية للبروتين",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ البنية الفراغية للبروتين.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 90,
                modelAnswer:
                  "تمثل الوثيقة تغيرات بنيه بدلالة الزمن مقارنة بـ روابط. نلاحظ تغيرا واضحا في بنيه مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع روابط.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ البنية الفراغية للبروتين",
                  keywords: ["بنيه", "روابط", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["بنيه", "زمن"],
                    comparisons: [["بنيه", "روابط"]],
                    trends: [{ about: "بنيه", expect: ["بنيه", "روابط"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2.5,
                prompt: "تفسير الآلية المرتبطة بـ البنية الفراغية للبروتين",
                bacPrompt: "اشرح الآلية التي تفسر البنية الفراغية للبروتين انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 110,
                modelAnswer:
                  "يعود ذلك إلى تدخل بنيه وروابط عبر آلية دقيقة تؤدي إلى طفره، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ البنية الفراغية للبروتين",
                  keywords: ["بنيه", "روابط", "طفره"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة التركيبية حول البنية الفراغية للبروتين",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ البنية الفراغية للبروتين.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer: "في الختام، ترتبط النتيجة النهائية بـ بنيه وروابط فتُغلق الظاهرة على طفره.",
                rule: {
                  prompt: "الخاتمة التركيبية حول البنية الفراغية للبروتين",
                  keywords: ["بنيه", "طفره", "ختام"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 3,
            ui: "text",
            label: "المرحلة الكيميائية الضوئية",
            max: 8,
            desc: "تحويل الطاقة الضوئية على مستوى التيلاكوئيد وطرح O2",
            poles: {
              N: {
                points: 0.5,
                prompt: "تأطير الإشكالية حول: المرحلة الكيميائية الضوئية",
                bacPrompt: "ما المشكل العلمي المرتبط بـ المرحلة الكيميائية الضوئية؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 30,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ المرحلة الكيميائية الضوئية في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: المرحلة الكيميائية الضوئية",
                  keywords: ["تيلاكوئيد", "ضوء"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2,
                prompt: "استغلال الوثيقة المتعلقة بـ المرحلة الكيميائية الضوئية",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ المرحلة الكيميائية الضوئية.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 60,
                modelAnswer:
                  "تمثل الوثيقة تغيرات تيلاكوئيد بدلالة الزمن مقارنة بـ ضوء. نلاحظ تغيرا واضحا في تيلاكوئيد مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع ضوء.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ المرحلة الكيميائية الضوئية",
                  keywords: ["تيلاكوئيد", "ضوء", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["تيلاكوئيد", "زمن"],
                    comparisons: [["تيلاكوئيد", "ضوء"]],
                    trends: [{ about: "تيلاكوئيد", expect: ["تيلاكوئيد", "ضوء"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 4,
                prompt: "تفسير الآلية المرتبطة بـ المرحلة الكيميائية الضوئية",
                bacPrompt: "اشرح الآلية التي تفسر المرحلة الكيميائية الضوئية انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 110,
                modelAnswer:
                  "يعود ذلك إلى تدخل تيلاكوئيد وضوء عبر آلية دقيقة تؤدي إلى اكسجين، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ المرحلة الكيميائية الضوئية",
                  keywords: ["تيلاكوئيد", "ضوء", "اكسجين"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1.5,
                prompt: "الخاتمة التركيبية حول المرحلة الكيميائية الضوئية",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ المرحلة الكيميائية الضوئية.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "تيلاكوئيد → ضوء → اكسجين",
                minLength: 40,
                modelAnswer: "عنوان المخطط: تيلاكوئيد. تيلاكوئيد → ضوء → اكسجين.",
                rule: {
                  prompt: "الخاتمة التركيبية حول المرحلة الكيميائية الضوئية",
                  keywords: ["مخطط", "تيلاكوئيد", "اكسجين"],
                  minHits: 2,
                  forbidden: [],
                  schema: { arrows: true, title: "تيلاكوئيد", ordered: ["تيلاكوئيد", "ضوء", "اكسجين"] }
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
          "https://www.dzexams.com/uploads/sujets/officiels/bac/2017/dzexams-bac-sciences-2581269.pdf",
        pdfNote:
          "PDF non redistribué dans le dépôt. Page dzexams : https://www.dzexams.com/ar/annales/dFRNWk1JWkt2aC8vdFZtZVNMWGRwZz09. Session normale 2017. PDF dzexams محمي في العارض. Thèmes pédagogiques reconstruits.",
        title: "الموضوع الثاني",
        exercises: [
          {
            number: 1,
            ui: "text",
            label: "الذات واللاذات",
            max: 5,
            desc: "دور CMH والمستضدات الغشائية في تمييز الذات",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية حول: الذات واللاذات",
                bacPrompt: "ما المشكل العلمي المرتبط بـ الذات واللاذات؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ الذات واللاذات في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: الذات واللاذات",
                  keywords: ["CMH", "ذات"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 1,
                prompt: "استغلال الوثيقة المتعلقة بـ الذات واللاذات",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ الذات واللاذات.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 40,
                modelAnswer:
                  "تمثل الوثيقة تغيرات CMH بدلالة الزمن مقارنة بـ ذات. نلاحظ تغيرا واضحا في CMH مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع ذات.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ الذات واللاذات",
                  keywords: ["CMH", "ذات", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["CMH", "زمن"],
                    comparisons: [["CMH", "ذات"]],
                    trends: [{ about: "CMH", expect: ["CMH", "ذات"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2,
                prompt: "تفسير الآلية المرتبطة بـ الذات واللاذات",
                bacPrompt: "اشرح الآلية التي تفسر الذات واللاذات انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 120,
                modelAnswer:
                  "يعود ذلك إلى تدخل CMH وذات عبر آلية دقيقة تؤدي إلى لاذات، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ الذات واللاذات",
                  keywords: ["CMH", "ذات", "لاذات"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة التركيبية حول الذات واللاذات",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ الذات واللاذات.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer: "في الختام، ترتبط النتيجة النهائية بـ CMH وذات فتُغلق الظاهرة على لاذات.",
                rule: {
                  prompt: "الخاتمة التركيبية حول الذات واللاذات",
                  keywords: ["CMH", "لاذات", "ختام"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 2,
            ui: "text",
            label: "تأثير pH على النشاط الإنزيمي",
            max: 7,
            desc: "تغير شحنات الموقع الفعال بدلالة pH الوسط",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية حول: تأثير pH على النشاط الإنزيمي",
                bacPrompt: "ما المشكل العلمي المرتبط بـ تأثير pH على النشاط الإنزيمي؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ تأثير pH على النشاط الإنزيمي في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: تأثير pH على النشاط الإنزيمي",
                  keywords: ["PH", "موقع"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2.5,
                prompt: "استغلال الوثيقة المتعلقة بـ تأثير pH على النشاط الإنزيمي",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ تأثير pH على النشاط الإنزيمي.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 90,
                modelAnswer:
                  "تمثل الوثيقة تغيرات PH بدلالة الزمن مقارنة بـ موقع. نلاحظ تغيرا واضحا في PH مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع موقع.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ تأثير pH على النشاط الإنزيمي",
                  keywords: ["PH", "موقع", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["PH", "زمن"],
                    comparisons: [["PH", "موقع"]],
                    trends: [{ about: "PH", expect: ["PH", "موقع"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2.5,
                prompt: "تفسير الآلية المرتبطة بـ تأثير pH على النشاط الإنزيمي",
                bacPrompt: "اشرح الآلية التي تفسر تأثير pH على النشاط الإنزيمي انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 110,
                modelAnswer:
                  "يعود ذلك إلى تدخل PH وموقع عبر آلية دقيقة تؤدي إلى نشاط، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ تأثير pH على النشاط الإنزيمي",
                  keywords: ["PH", "موقع", "نشاط"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة التركيبية حول تأثير pH على النشاط الإنزيمي",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ تأثير pH على النشاط الإنزيمي.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer: "في الختام، ترتبط النتيجة النهائية بـ PH وموقع فتُغلق الظاهرة على نشاط.",
                rule: {
                  prompt: "الخاتمة التركيبية حول تأثير pH على النشاط الإنزيمي",
                  keywords: ["PH", "نشاط", "ختام"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 3,
            ui: "text",
            label: "فيروس VIH والمناعة",
            max: 8,
            desc: "استهداف الخلايا LT4 وتعطيل التعاون المناعي",
            poles: {
              N: {
                points: 0.5,
                prompt: "تأطير الإشكالية حول: فيروس VIH والمناعة",
                bacPrompt: "ما المشكل العلمي المرتبط بـ فيروس VIH والمناعة؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 30,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ فيروس VIH والمناعة في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: فيروس VIH والمناعة",
                  keywords: ["VIH", "LT4"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2,
                prompt: "استغلال الوثيقة المتعلقة بـ فيروس VIH والمناعة",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ فيروس VIH والمناعة.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 60,
                modelAnswer:
                  "تمثل الوثيقة تغيرات VIH بدلالة الزمن مقارنة بـ LT4. نلاحظ تغيرا واضحا في VIH مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع LT4.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ فيروس VIH والمناعة",
                  keywords: ["VIH", "LT4", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["VIH", "زمن"],
                    comparisons: [["VIH", "LT4"]],
                    trends: [{ about: "VIH", expect: ["VIH", "LT4"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 4,
                prompt: "تفسير الآلية المرتبطة بـ فيروس VIH والمناعة",
                bacPrompt: "اشرح الآلية التي تفسر فيروس VIH والمناعة انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 110,
                modelAnswer:
                  "يعود ذلك إلى تدخل VIH وLT4 عبر آلية دقيقة تؤدي إلى مناعه، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ فيروس VIH والمناعة",
                  keywords: ["VIH", "LT4", "مناعه"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1.5,
                prompt: "الخاتمة التركيبية حول فيروس VIH والمناعة",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ فيروس VIH والمناعة.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "VIH → LT4 → مناعه",
                minLength: 40,
                modelAnswer: "عنوان المخطط: VIH. VIH → LT4 → مناعه.",
                rule: {
                  prompt: "الخاتمة التركيبية حول فيروس VIH والمناعة",
                  keywords: ["مخطط", "VIH", "مناعه"],
                  minHits: 2,
                  forbidden: [],
                  schema: { arrows: true, title: "VIH", ordered: ["VIH", "LT4", "مناعه"] }
                }
              }
            }
          }
        ]
      }
    ]
  },
  {
    id: "2016",
    label: "بكالوريا الجزائر دورة 2016",
    badge: "أرشيف مُعاد بناؤه",
    theme: "purple",
    enabled: true,
    sujets: [
      {
        id: 1,
        pdf: null,
        pdfAvailable: false,
        pdfExternalUrl: "https://www.dzexams.com/ar/annales/M09NK2ZYVHFzQXg3KzZHazBaTk5IUT09",
        pdfNote:
          "PDF non redistribué dans le dépôt. Page dzexams : https://www.dzexams.com/ar/annales/M09NK2ZYVHFzQXg3KzZHazBaTk5IUT09. 2016 : session de remplacement retenue. Thèmes pédagogiques reconstruits.",
        title: "الموضوع الأول",
        exercises: [
          {
            number: 1,
            ui: "text",
            label: "الاستنساخ داخل النواة",
            max: 5,
            desc: "دور ARN بوليميراز في تركيب ARNm",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية حول: الاستنساخ داخل النواة",
                bacPrompt: "ما المشكل العلمي المرتبط بـ الاستنساخ داخل النواة؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ الاستنساخ داخل النواة في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: الاستنساخ داخل النواة",
                  keywords: ["استنساخ", "بوليميراز"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 1,
                prompt: "استغلال الوثيقة المتعلقة بـ الاستنساخ داخل النواة",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ الاستنساخ داخل النواة.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 40,
                modelAnswer:
                  "تمثل الوثيقة تغيرات استنساخ بدلالة الزمن مقارنة بـ بوليميراز. نلاحظ تغيرا واضحا في استنساخ مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع بوليميراز.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ الاستنساخ داخل النواة",
                  keywords: ["استنساخ", "بوليميراز", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["استنساخ", "زمن"],
                    comparisons: [["استنساخ", "بوليميراز"]],
                    trends: [{ about: "استنساخ", expect: ["استنساخ", "بوليميراز"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2,
                prompt: "تفسير الآلية المرتبطة بـ الاستنساخ داخل النواة",
                bacPrompt: "اشرح الآلية التي تفسر الاستنساخ داخل النواة انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 120,
                modelAnswer:
                  "يعود ذلك إلى تدخل استنساخ وبوليميراز عبر آلية دقيقة تؤدي إلى نواه، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ الاستنساخ داخل النواة",
                  keywords: ["استنساخ", "بوليميراز", "نواه"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة التركيبية حول الاستنساخ داخل النواة",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ الاستنساخ داخل النواة.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer:
                  "في الختام، ترتبط النتيجة النهائية بـ استنساخ وبوليميراز فتُغلق الظاهرة على نواه.",
                rule: {
                  prompt: "الخاتمة التركيبية حول الاستنساخ داخل النواة",
                  keywords: ["استنساخ", "نواه", "ختام"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 2,
            ui: "text",
            label: "التخصص الوظيفي للإنزيم",
            max: 7,
            desc: "تكامل الموقع الفعال مع مادة التفاعل",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية حول: التخصص الوظيفي للإنزيم",
                bacPrompt: "ما المشكل العلمي المرتبط بـ التخصص الوظيفي للإنزيم؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ التخصص الوظيفي للإنزيم في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: التخصص الوظيفي للإنزيم",
                  keywords: ["انزيم", "ركيزه"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2.5,
                prompt: "استغلال الوثيقة المتعلقة بـ التخصص الوظيفي للإنزيم",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ التخصص الوظيفي للإنزيم.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 90,
                modelAnswer:
                  "تمثل الوثيقة تغيرات انزيم بدلالة الزمن مقارنة بـ ركيزه. نلاحظ تغيرا واضحا في انزيم مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع ركيزه.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ التخصص الوظيفي للإنزيم",
                  keywords: ["انزيم", "ركيزه", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["انزيم", "زمن"],
                    comparisons: [["انزيم", "ركيزه"]],
                    trends: [{ about: "انزيم", expect: ["انزيم", "ركيزه"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2.5,
                prompt: "تفسير الآلية المرتبطة بـ التخصص الوظيفي للإنزيم",
                bacPrompt: "اشرح الآلية التي تفسر التخصص الوظيفي للإنزيم انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 110,
                modelAnswer:
                  "يعود ذلك إلى تدخل انزيم وركيزه عبر آلية دقيقة تؤدي إلى تخصص، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ التخصص الوظيفي للإنزيم",
                  keywords: ["انزيم", "ركيزه", "تخصص"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة التركيبية حول التخصص الوظيفي للإنزيم",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ التخصص الوظيفي للإنزيم.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer: "في الختام، ترتبط النتيجة النهائية بـ انزيم وركيزه فتُغلق الظاهرة على تخصص.",
                rule: {
                  prompt: "الخاتمة التركيبية حول التخصص الوظيفي للإنزيم",
                  keywords: ["انزيم", "تخصص", "ختام"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 3,
            ui: "text",
            label: "المناعة الخلطية",
            max: 8,
            desc: "إنتاج الأجسام المضادة من البلاسموسيت",
            poles: {
              N: {
                points: 0.5,
                prompt: "تأطير الإشكالية حول: المناعة الخلطية",
                bacPrompt: "ما المشكل العلمي المرتبط بـ المناعة الخلطية؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 30,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ المناعة الخلطية في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: المناعة الخلطية",
                  keywords: ["مضاده", "بلاسموسيت"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2,
                prompt: "استغلال الوثيقة المتعلقة بـ المناعة الخلطية",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ المناعة الخلطية.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 60,
                modelAnswer:
                  "تمثل الوثيقة تغيرات مضاده بدلالة الزمن مقارنة بـ بلاسموسيت. نلاحظ تغيرا واضحا في مضاده مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع بلاسموسيت.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ المناعة الخلطية",
                  keywords: ["مضاده", "بلاسموسيت", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["مضاده", "زمن"],
                    comparisons: [["مضاده", "بلاسموسيت"]],
                    trends: [{ about: "مضاده", expect: ["مضاده", "بلاسموسيت"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 4,
                prompt: "تفسير الآلية المرتبطة بـ المناعة الخلطية",
                bacPrompt: "اشرح الآلية التي تفسر المناعة الخلطية انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 110,
                modelAnswer:
                  "يعود ذلك إلى تدخل مضاده وبلاسموسيت عبر آلية دقيقة تؤدي إلى مستضد، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ المناعة الخلطية",
                  keywords: ["مضاده", "بلاسموسيت", "مستضد"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1.5,
                prompt: "الخاتمة التركيبية حول المناعة الخلطية",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ المناعة الخلطية.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "مضاده → بلاسموسيت → مستضد",
                minLength: 40,
                modelAnswer: "عنوان المخطط: مضاده. مضاده → بلاسموسيت → مستضد.",
                rule: {
                  prompt: "الخاتمة التركيبية حول المناعة الخلطية",
                  keywords: ["مخطط", "مضاده", "مستضد"],
                  minHits: 2,
                  forbidden: [],
                  schema: { arrows: true, title: "مضاده", ordered: ["مضاده", "بلاسموسيت", "مستضد"] }
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
        pdfExternalUrl: "https://www.dzexams.com/ar/annales/M09NK2ZYVHFzQXg3KzZHazBaTk5IUT09",
        pdfNote:
          "PDF non redistribué dans le dépôt. Page dzexams : https://www.dzexams.com/ar/annales/M09NK2ZYVHFzQXg3KzZHazBaTk5IUT09. 2016 : session de remplacement retenue. Thèmes pédagogiques reconstruits.",
        title: "الموضوع الثاني",
        exercises: [
          {
            number: 1,
            ui: "text",
            label: "المشبك الكيميائي",
            max: 5,
            desc: "تحرير المبلغ العصبي وتوليد الجهد بعد المشبكي",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية حول: المشبك الكيميائي",
                bacPrompt: "ما المشكل العلمي المرتبط بـ المشبك الكيميائي؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ المشبك الكيميائي في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: المشبك الكيميائي",
                  keywords: ["مشبك", "مبلغ"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 1,
                prompt: "استغلال الوثيقة المتعلقة بـ المشبك الكيميائي",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ المشبك الكيميائي.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 40,
                modelAnswer:
                  "تمثل الوثيقة تغيرات مشبك بدلالة الزمن مقارنة بـ مبلغ. نلاحظ تغيرا واضحا في مشبك مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع مبلغ.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ المشبك الكيميائي",
                  keywords: ["مشبك", "مبلغ", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["مشبك", "زمن"],
                    comparisons: [["مشبك", "مبلغ"]],
                    trends: [{ about: "مشبك", expect: ["مشبك", "مبلغ"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2,
                prompt: "تفسير الآلية المرتبطة بـ المشبك الكيميائي",
                bacPrompt: "اشرح الآلية التي تفسر المشبك الكيميائي انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 120,
                modelAnswer:
                  "يعود ذلك إلى تدخل مشبك ومبلغ عبر آلية دقيقة تؤدي إلى كالسيوم، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ المشبك الكيميائي",
                  keywords: ["مشبك", "مبلغ", "كالسيوم"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة التركيبية حول المشبك الكيميائي",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ المشبك الكيميائي.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer: "في الختام، ترتبط النتيجة النهائية بـ مشبك ومبلغ فتُغلق الظاهرة على كالسيوم.",
                rule: {
                  prompt: "الخاتمة التركيبية حول المشبك الكيميائي",
                  keywords: ["مشبك", "كالسيوم", "ختام"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 2,
            ui: "text",
            label: "التخمر والتنفس",
            max: 7,
            desc: "مقارنة الحصيلة الطاقوية في وجود O2 وفي غيابه",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية حول: التخمر والتنفس",
                bacPrompt: "ما المشكل العلمي المرتبط بـ التخمر والتنفس؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ التخمر والتنفس في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: التخمر والتنفس",
                  keywords: ["تخمر", "تنفس"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2.5,
                prompt: "استغلال الوثيقة المتعلقة بـ التخمر والتنفس",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ التخمر والتنفس.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 90,
                modelAnswer:
                  "تمثل الوثيقة تغيرات تخمر بدلالة الزمن مقارنة بـ تنفس. نلاحظ تغيرا واضحا في تخمر مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع تنفس.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ التخمر والتنفس",
                  keywords: ["تخمر", "تنفس", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["تخمر", "زمن"],
                    comparisons: [["تخمر", "تنفس"]],
                    trends: [{ about: "تخمر", expect: ["تخمر", "تنفس"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2.5,
                prompt: "تفسير الآلية المرتبطة بـ التخمر والتنفس",
                bacPrompt: "اشرح الآلية التي تفسر التخمر والتنفس انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 110,
                modelAnswer:
                  "يعود ذلك إلى تدخل تخمر وتنفس عبر آلية دقيقة تؤدي إلى ATP، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ التخمر والتنفس",
                  keywords: ["تخمر", "تنفس", "ATP"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة التركيبية حول التخمر والتنفس",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ التخمر والتنفس.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer: "في الختام، ترتبط النتيجة النهائية بـ تخمر وتنفس فتُغلق الظاهرة على ATP.",
                rule: {
                  prompt: "الخاتمة التركيبية حول التخمر والتنفس",
                  keywords: ["تخمر", "ATP", "ختام"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 3,
            ui: "text",
            label: "بنية الكرة الأرضية",
            max: 8,
            desc: "الانقطاعات والحالة الفيزيائية للأوساط الداخلية",
            poles: {
              N: {
                points: 0.5,
                prompt: "تأطير الإشكالية حول: بنية الكرة الأرضية",
                bacPrompt: "ما المشكل العلمي المرتبط بـ بنية الكرة الأرضية؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 30,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ بنية الكرة الأرضية في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: بنية الكرة الأرضية",
                  keywords: ["انقطاع", "رداء"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2,
                prompt: "استغلال الوثيقة المتعلقة بـ بنية الكرة الأرضية",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ بنية الكرة الأرضية.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 60,
                modelAnswer:
                  "تمثل الوثيقة تغيرات انقطاع بدلالة الزمن مقارنة بـ رداء. نلاحظ تغيرا واضحا في انقطاع مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع رداء.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ بنية الكرة الأرضية",
                  keywords: ["انقطاع", "رداء", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["انقطاع", "زمن"],
                    comparisons: [["انقطاع", "رداء"]],
                    trends: [{ about: "انقطاع", expect: ["انقطاع", "رداء"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 4,
                prompt: "تفسير الآلية المرتبطة بـ بنية الكرة الأرضية",
                bacPrompt: "اشرح الآلية التي تفسر بنية الكرة الأرضية انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 110,
                modelAnswer:
                  "يعود ذلك إلى تدخل انقطاع ورداء عبر آلية دقيقة تؤدي إلى نواه، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ بنية الكرة الأرضية",
                  keywords: ["انقطاع", "رداء", "نواه"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1.5,
                prompt: "الخاتمة التركيبية حول بنية الكرة الأرضية",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ بنية الكرة الأرضية.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "انقطاع → رداء → نواه",
                minLength: 40,
                modelAnswer: "عنوان المخطط: انقطاع. انقطاع → رداء → نواه.",
                rule: {
                  prompt: "الخاتمة التركيبية حول بنية الكرة الأرضية",
                  keywords: ["مخطط", "انقطاع", "نواه"],
                  minHits: 2,
                  forbidden: [],
                  schema: { arrows: true, title: "انقطاع", ordered: ["انقطاع", "رداء", "نواه"] }
                }
              }
            }
          }
        ]
      }
    ]
  },
  {
    id: "2015",
    label: "بكالوريا الجزائر دورة 2015",
    badge: "أرشيف مُعاد بناؤه",
    theme: "indigo",
    enabled: true,
    sujets: [
      {
        id: 1,
        pdf: null,
        pdfAvailable: false,
        pdfExternalUrl:
          "https://www.dzexams.com/uploads/sujets/officiels/bac/2015/dzexams-bac-sciences-5906014.pdf",
        pdfNote:
          "PDF non redistribué dans le dépôt. Page dzexams : https://www.dzexams.com/ar/annales/aTlRWGREbDN3Qit2cVdRaHNmK0FYQT09. 2015 : PDF dzexams دون طبقة نص قابلة للشهادة هنا. Thèmes pédagogiques reconstruits.",
        title: "الموضوع الأول",
        exercises: [
          {
            number: 1,
            ui: "text",
            label: "الترجمة في الهيولى",
            max: 5,
            desc: "العناصر المتدخلة في تركيب السلسلة البيبتيدية",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية حول: الترجمة في الهيولى",
                bacPrompt: "ما المشكل العلمي المرتبط بـ الترجمة في الهيولى؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ الترجمة في الهيولى في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: الترجمة في الهيولى",
                  keywords: ["هيولي", "ريبوزوم"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 1,
                prompt: "استغلال الوثيقة المتعلقة بـ الترجمة في الهيولى",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ الترجمة في الهيولى.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 40,
                modelAnswer:
                  "تمثل الوثيقة تغيرات هيولي بدلالة الزمن مقارنة بـ ريبوزوم. نلاحظ تغيرا واضحا في هيولي مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع ريبوزوم.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ الترجمة في الهيولى",
                  keywords: ["هيولي", "ريبوزوم", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["هيولي", "زمن"],
                    comparisons: [["هيولي", "ريبوزوم"]],
                    trends: [{ about: "هيولي", expect: ["هيولي", "ريبوزوم"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2,
                prompt: "تفسير الآلية المرتبطة بـ الترجمة في الهيولى",
                bacPrompt: "اشرح الآلية التي تفسر الترجمة في الهيولى انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 120,
                modelAnswer:
                  "يعود ذلك إلى تدخل هيولي وريبوزوم عبر آلية دقيقة تؤدي إلى ARNt، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ الترجمة في الهيولى",
                  keywords: ["هيولي", "ريبوزوم", "ARNt"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة التركيبية حول الترجمة في الهيولى",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ الترجمة في الهيولى.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer: "في الختام، ترتبط النتيجة النهائية بـ هيولي وريبوزوم فتُغلق الظاهرة على ARNt.",
                rule: {
                  prompt: "الخاتمة التركيبية حول الترجمة في الهيولى",
                  keywords: ["هيولي", "ARNt", "ختام"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 2,
            ui: "text",
            label: "الكربوكسي بيبتيداز والموقع الفعال",
            max: 7,
            desc: "علاقة البنية الفراغية للإنزيم بمادة التفاعل",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية حول: الكربوكسي بيبتيداز والموقع الفعال",
                bacPrompt: "ما المشكل العلمي المرتبط بـ الكربوكسي بيبتيداز والموقع الفعال؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ الكربوكسي بيبتيداز والموقع الفعال في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: الكربوكسي بيبتيداز والموقع الفعال",
                  keywords: ["بيبتيداز", "موقع"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2.5,
                prompt: "استغلال الوثيقة المتعلقة بـ الكربوكسي بيبتيداز والموقع الفعال",
                bacPrompt:
                  "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ الكربوكسي بيبتيداز والموقع الفعال.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 90,
                modelAnswer:
                  "تمثل الوثيقة تغيرات بيبتيداز بدلالة الزمن مقارنة بـ موقع. نلاحظ تغيرا واضحا في بيبتيداز مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع موقع.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ الكربوكسي بيبتيداز والموقع الفعال",
                  keywords: ["بيبتيداز", "موقع", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["بيبتيداز", "زمن"],
                    comparisons: [["بيبتيداز", "موقع"]],
                    trends: [{ about: "بيبتيداز", expect: ["بيبتيداز", "موقع"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2.5,
                prompt: "تفسير الآلية المرتبطة بـ الكربوكسي بيبتيداز والموقع الفعال",
                bacPrompt:
                  "اشرح الآلية التي تفسر الكربوكسي بيبتيداز والموقع الفعال انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 110,
                modelAnswer:
                  "يعود ذلك إلى تدخل بيبتيداز وموقع عبر آلية دقيقة تؤدي إلى فعال، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ الكربوكسي بيبتيداز والموقع الفعال",
                  keywords: ["بيبتيداز", "موقع", "فعال"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة التركيبية حول الكربوكسي بيبتيداز والموقع الفعال",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ الكربوكسي بيبتيداز والموقع الفعال.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer: "في الختام، ترتبط النتيجة النهائية بـ بيبتيداز وموقع فتُغلق الظاهرة على فعال.",
                rule: {
                  prompt: "الخاتمة التركيبية حول الكربوكسي بيبتيداز والموقع الفعال",
                  keywords: ["بيبتيداز", "فعال", "ختام"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 3,
            ui: "text",
            label: "الاستجابة ضد VIH",
            max: 8,
            desc: "حدود المراقبة المناعية بعد إصابة LT4",
            poles: {
              N: {
                points: 0.5,
                prompt: "تأطير الإشكالية حول: الاستجابة ضد VIH",
                bacPrompt: "ما المشكل العلمي المرتبط بـ الاستجابة ضد VIH؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 30,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ الاستجابة ضد VIH في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: الاستجابة ضد VIH",
                  keywords: ["VIH", "LT4"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2,
                prompt: "استغلال الوثيقة المتعلقة بـ الاستجابة ضد VIH",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ الاستجابة ضد VIH.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 60,
                modelAnswer:
                  "تمثل الوثيقة تغيرات VIH بدلالة الزمن مقارنة بـ LT4. نلاحظ تغيرا واضحا في VIH مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع LT4.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ الاستجابة ضد VIH",
                  keywords: ["VIH", "LT4", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["VIH", "زمن"],
                    comparisons: [["VIH", "LT4"]],
                    trends: [{ about: "VIH", expect: ["VIH", "LT4"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 4,
                prompt: "تفسير الآلية المرتبطة بـ الاستجابة ضد VIH",
                bacPrompt: "اشرح الآلية التي تفسر الاستجابة ضد VIH انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 110,
                modelAnswer:
                  "يعود ذلك إلى تدخل VIH وLT4 عبر آلية دقيقة تؤدي إلى مراقبه، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ الاستجابة ضد VIH",
                  keywords: ["VIH", "LT4", "مراقبه"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1.5,
                prompt: "الخاتمة التركيبية حول الاستجابة ضد VIH",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ الاستجابة ضد VIH.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "VIH → LT4 → مراقبه",
                minLength: 40,
                modelAnswer: "عنوان المخطط: VIH. VIH → LT4 → مراقبه.",
                rule: {
                  prompt: "الخاتمة التركيبية حول الاستجابة ضد VIH",
                  keywords: ["مخطط", "VIH", "مراقبه"],
                  minHits: 2,
                  forbidden: [],
                  schema: { arrows: true, title: "VIH", ordered: ["VIH", "LT4", "مراقبه"] }
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
          "https://www.dzexams.com/uploads/sujets/officiels/bac/2015/dzexams-bac-sciences-5906014.pdf",
        pdfNote:
          "PDF non redistribué dans le dépôt. Page dzexams : https://www.dzexams.com/ar/annales/aTlRWGREbDN3Qit2cVdRaHNmK0FYQT09. 2015 : PDF dzexams دون طبقة نص قابلة للشهادة هنا. Thèmes pédagogiques reconstruits.",
        title: "الموضوع الثاني",
        exercises: [
          {
            number: 1,
            ui: "text",
            label: "النقل المشبكي",
            max: 5,
            desc: "تأخير مشبكي ودور المبلغ الكيميائي",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية حول: النقل المشبكي",
                bacPrompt: "ما المشكل العلمي المرتبط بـ النقل المشبكي؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ النقل المشبكي في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: النقل المشبكي",
                  keywords: ["مشبك", "تاخير"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 1,
                prompt: "استغلال الوثيقة المتعلقة بـ النقل المشبكي",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ النقل المشبكي.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 40,
                modelAnswer:
                  "تمثل الوثيقة تغيرات مشبك بدلالة الزمن مقارنة بـ تاخير. نلاحظ تغيرا واضحا في مشبك مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع تاخير.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ النقل المشبكي",
                  keywords: ["مشبك", "تاخير", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["مشبك", "زمن"],
                    comparisons: [["مشبك", "تاخير"]],
                    trends: [{ about: "مشبك", expect: ["مشبك", "تاخير"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2,
                prompt: "تفسير الآلية المرتبطة بـ النقل المشبكي",
                bacPrompt: "اشرح الآلية التي تفسر النقل المشبكي انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 120,
                modelAnswer:
                  "يعود ذلك إلى تدخل مشبك وتاخير عبر آلية دقيقة تؤدي إلى مبلغ، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ النقل المشبكي",
                  keywords: ["مشبك", "تاخير", "مبلغ"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة التركيبية حول النقل المشبكي",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ النقل المشبكي.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer: "في الختام، ترتبط النتيجة النهائية بـ مشبك وتاخير فتُغلق الظاهرة على مبلغ.",
                rule: {
                  prompt: "الخاتمة التركيبية حول النقل المشبكي",
                  keywords: ["مشبك", "مبلغ", "ختام"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 2,
            ui: "text",
            label: "أنزيم RUBISCO وتثبيت CO2",
            max: 7,
            desc: "تثبيت CO2 على RudIP في الحشوة",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية حول: أنزيم RUBISCO وتثبيت CO2",
                bacPrompt: "ما المشكل العلمي المرتبط بـ أنزيم RUBISCO وتثبيت CO2؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ أنزيم RUBISCO وتثبيت CO2 في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: أنزيم RUBISCO وتثبيت CO2",
                  keywords: ["RUBISCO", "تثبيت"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2.5,
                prompt: "استغلال الوثيقة المتعلقة بـ أنزيم RUBISCO وتثبيت CO2",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ أنزيم RUBISCO وتثبيت CO2.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 90,
                modelAnswer:
                  "تمثل الوثيقة تغيرات RUBISCO بدلالة الزمن مقارنة بـ تثبيت. نلاحظ تغيرا واضحا في RUBISCO مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع تثبيت.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ أنزيم RUBISCO وتثبيت CO2",
                  keywords: ["RUBISCO", "تثبيت", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["RUBISCO", "زمن"],
                    comparisons: [["RUBISCO", "تثبيت"]],
                    trends: [{ about: "RUBISCO", expect: ["RUBISCO", "تثبيت"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2.5,
                prompt: "تفسير الآلية المرتبطة بـ أنزيم RUBISCO وتثبيت CO2",
                bacPrompt: "اشرح الآلية التي تفسر أنزيم RUBISCO وتثبيت CO2 انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 110,
                modelAnswer:
                  "يعود ذلك إلى تدخل RUBISCO وتثبيت عبر آلية دقيقة تؤدي إلى CO2، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ أنزيم RUBISCO وتثبيت CO2",
                  keywords: ["RUBISCO", "تثبيت", "CO2"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة التركيبية حول أنزيم RUBISCO وتثبيت CO2",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ أنزيم RUBISCO وتثبيت CO2.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer: "في الختام، ترتبط النتيجة النهائية بـ RUBISCO وتثبيت فتُغلق الظاهرة على CO2.",
                rule: {
                  prompt: "الخاتمة التركيبية حول أنزيم RUBISCO وتثبيت CO2",
                  keywords: ["RUBISCO", "CO2", "ختام"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 3,
            ui: "text",
            label: "الصفائح التكتونية",
            max: 8,
            desc: "التوسع المحيطي ومناطق الغوص",
            poles: {
              N: {
                points: 0.5,
                prompt: "تأطير الإشكالية حول: الصفائح التكتونية",
                bacPrompt: "ما المشكل العلمي المرتبط بـ الصفائح التكتونية؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 30,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ الصفائح التكتونية في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: الصفائح التكتونية",
                  keywords: ["صفائح", "ظهره"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2,
                prompt: "استغلال الوثيقة المتعلقة بـ الصفائح التكتونية",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ الصفائح التكتونية.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 60,
                modelAnswer:
                  "تمثل الوثيقة تغيرات صفائح بدلالة الزمن مقارنة بـ ظهره. نلاحظ تغيرا واضحا في صفائح مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع ظهره.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ الصفائح التكتونية",
                  keywords: ["صفائح", "ظهره", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["صفائح", "زمن"],
                    comparisons: [["صفائح", "ظهره"]],
                    trends: [{ about: "صفائح", expect: ["صفائح", "ظهره"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 4,
                prompt: "تفسير الآلية المرتبطة بـ الصفائح التكتونية",
                bacPrompt: "اشرح الآلية التي تفسر الصفائح التكتونية انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 110,
                modelAnswer:
                  "يعود ذلك إلى تدخل صفائح وظهره عبر آلية دقيقة تؤدي إلى غوص، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ الصفائح التكتونية",
                  keywords: ["صفائح", "ظهره", "غوص"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1.5,
                prompt: "الخاتمة التركيبية حول الصفائح التكتونية",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ الصفائح التكتونية.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صفائح → ظهره → غوص",
                minLength: 40,
                modelAnswer: "عنوان المخطط: صفائح. صفائح → ظهره → غوص.",
                rule: {
                  prompt: "الخاتمة التركيبية حول الصفائح التكتونية",
                  keywords: ["مخطط", "صفائح", "غوص"],
                  minHits: 2,
                  forbidden: [],
                  schema: { arrows: true, title: "صفائح", ordered: ["صفائح", "ظهره", "غوص"] }
                }
              }
            }
          }
        ]
      }
    ]
  },
  {
    id: "2014",
    label: "بكالوريا الجزائر دورة 2014",
    badge: "أرشيف مُعاد بناؤه",
    theme: "amber",
    enabled: true,
    sujets: [
      {
        id: 1,
        pdf: null,
        pdfAvailable: false,
        pdfExternalUrl:
          "https://www.dzexams.com/uploads/sujets/officiels/bac/2014/dzexams-bac-sciences-4380238.pdf",
        pdfNote:
          "PDF non redistribué dans le dépôt. Page dzexams : https://www.dzexams.com/ar/annales/SzdNaHlPbThvaEhSSUJjWDRsdUljdz09. 2014 : PDF dzexams دون طبقة نص قابلة للشهادة هنا. Thèmes pédagogiques reconstruits.",
        title: "الموضوع الأول",
        exercises: [
          {
            number: 1,
            ui: "text",
            label: "مراحل تركيب البروتين",
            max: 5,
            desc: "تكامل الاستنساخ والترجمة",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية حول: مراحل تركيب البروتين",
                bacPrompt: "ما المشكل العلمي المرتبط بـ مراحل تركيب البروتين؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ مراحل تركيب البروتين في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: مراحل تركيب البروتين",
                  keywords: ["استنساخ", "ترجمه"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 1,
                prompt: "استغلال الوثيقة المتعلقة بـ مراحل تركيب البروتين",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ مراحل تركيب البروتين.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 40,
                modelAnswer:
                  "تمثل الوثيقة تغيرات استنساخ بدلالة الزمن مقارنة بـ ترجمه. نلاحظ تغيرا واضحا في استنساخ مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع ترجمه.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ مراحل تركيب البروتين",
                  keywords: ["استنساخ", "ترجمه", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["استنساخ", "زمن"],
                    comparisons: [["استنساخ", "ترجمه"]],
                    trends: [{ about: "استنساخ", expect: ["استنساخ", "ترجمه"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2,
                prompt: "تفسير الآلية المرتبطة بـ مراحل تركيب البروتين",
                bacPrompt: "اشرح الآلية التي تفسر مراحل تركيب البروتين انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 120,
                modelAnswer:
                  "يعود ذلك إلى تدخل استنساخ وترجمه عبر آلية دقيقة تؤدي إلى بروتين، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ مراحل تركيب البروتين",
                  keywords: ["استنساخ", "ترجمه", "بروتين"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة التركيبية حول مراحل تركيب البروتين",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ مراحل تركيب البروتين.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer: "في الختام، ترتبط النتيجة النهائية بـ استنساخ وترجمه فتُغلق الظاهرة على بروتين.",
                rule: {
                  prompt: "الخاتمة التركيبية حول مراحل تركيب البروتين",
                  keywords: ["استنساخ", "بروتين", "ختام"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 2,
            ui: "text",
            label: "التثبيط الإنزيمي",
            max: 7,
            desc: "تثبيط تنافسي وغير تنافسي على الموقع الفعال",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية حول: التثبيط الإنزيمي",
                bacPrompt: "ما المشكل العلمي المرتبط بـ التثبيط الإنزيمي؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ التثبيط الإنزيمي في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: التثبيط الإنزيمي",
                  keywords: ["تثبيط", "موقع"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2.5,
                prompt: "استغلال الوثيقة المتعلقة بـ التثبيط الإنزيمي",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ التثبيط الإنزيمي.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 90,
                modelAnswer:
                  "تمثل الوثيقة تغيرات تثبيط بدلالة الزمن مقارنة بـ موقع. نلاحظ تغيرا واضحا في تثبيط مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع موقع.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ التثبيط الإنزيمي",
                  keywords: ["تثبيط", "موقع", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["تثبيط", "زمن"],
                    comparisons: [["تثبيط", "موقع"]],
                    trends: [{ about: "تثبيط", expect: ["تثبيط", "موقع"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2.5,
                prompt: "تفسير الآلية المرتبطة بـ التثبيط الإنزيمي",
                bacPrompt: "اشرح الآلية التي تفسر التثبيط الإنزيمي انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 110,
                modelAnswer:
                  "يعود ذلك إلى تدخل تثبيط وموقع عبر آلية دقيقة تؤدي إلى ركيزه، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ التثبيط الإنزيمي",
                  keywords: ["تثبيط", "موقع", "ركيزه"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة التركيبية حول التثبيط الإنزيمي",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ التثبيط الإنزيمي.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer: "في الختام، ترتبط النتيجة النهائية بـ تثبيط وموقع فتُغلق الظاهرة على ركيزه.",
                rule: {
                  prompt: "الخاتمة التركيبية حول التثبيط الإنزيمي",
                  keywords: ["تثبيط", "ركيزه", "ختام"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 3,
            ui: "text",
            label: "الدفاع عن الذات",
            max: 8,
            desc: "آليات التعرف النوعي على اللاذات",
            poles: {
              N: {
                points: 0.5,
                prompt: "تأطير الإشكالية حول: الدفاع عن الذات",
                bacPrompt: "ما المشكل العلمي المرتبط بـ الدفاع عن الذات؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 30,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ الدفاع عن الذات في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: الدفاع عن الذات",
                  keywords: ["ذات", "لاذات"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2,
                prompt: "استغلال الوثيقة المتعلقة بـ الدفاع عن الذات",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ الدفاع عن الذات.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 60,
                modelAnswer:
                  "تمثل الوثيقة تغيرات ذات بدلالة الزمن مقارنة بـ لاذات. نلاحظ تغيرا واضحا في ذات مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع لاذات.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ الدفاع عن الذات",
                  keywords: ["ذات", "لاذات", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["ذات", "زمن"],
                    comparisons: [["ذات", "لاذات"]],
                    trends: [{ about: "ذات", expect: ["ذات", "لاذات"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 4,
                prompt: "تفسير الآلية المرتبطة بـ الدفاع عن الذات",
                bacPrompt: "اشرح الآلية التي تفسر الدفاع عن الذات انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 110,
                modelAnswer:
                  "يعود ذلك إلى تدخل ذات ولاذات عبر آلية دقيقة تؤدي إلى تعرف، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ الدفاع عن الذات",
                  keywords: ["ذات", "لاذات", "تعرف"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1.5,
                prompt: "الخاتمة التركيبية حول الدفاع عن الذات",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ الدفاع عن الذات.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "ذات → لاذات → تعرف",
                minLength: 40,
                modelAnswer: "عنوان المخطط: ذات. ذات → لاذات → تعرف.",
                rule: {
                  prompt: "الخاتمة التركيبية حول الدفاع عن الذات",
                  keywords: ["مخطط", "ذات", "تعرف"],
                  minHits: 2,
                  forbidden: [],
                  schema: { arrows: true, title: "ذات", ordered: ["ذات", "لاذات", "تعرف"] }
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
          "https://www.dzexams.com/uploads/sujets/officiels/bac/2014/dzexams-bac-sciences-4380238.pdf",
        pdfNote:
          "PDF non redistribué dans le dépôt. Page dzexams : https://www.dzexams.com/ar/annales/SzdNaHlPbThvaEhSSUJjWDRsdUljdz09. 2014 : PDF dzexams دون طبقة نص قابلة للشهادة هنا. Thèmes pédagogiques reconstruits.",
        title: "الموضوع الثاني",
        exercises: [
          {
            number: 1,
            ui: "text",
            label: "كمون الراحة",
            max: 5,
            desc: "توزيع Na⁺ وK⁺ ودور مضخة الصوديوم-بوتاسيوم",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية حول: كمون الراحة",
                bacPrompt: "ما المشكل العلمي المرتبط بـ كمون الراحة؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer: "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ كمون الراحة في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: كمون الراحة",
                  keywords: ["راحه", "مضخه"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 1,
                prompt: "استغلال الوثيقة المتعلقة بـ كمون الراحة",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ كمون الراحة.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 40,
                modelAnswer:
                  "تمثل الوثيقة تغيرات راحه بدلالة الزمن مقارنة بـ مضخه. نلاحظ تغيرا واضحا في راحه مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع مضخه.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ كمون الراحة",
                  keywords: ["راحه", "مضخه", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["راحه", "زمن"],
                    comparisons: [["راحه", "مضخه"]],
                    trends: [{ about: "راحه", expect: ["راحه", "مضخه"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2,
                prompt: "تفسير الآلية المرتبطة بـ كمون الراحة",
                bacPrompt: "اشرح الآلية التي تفسر كمون الراحة انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 120,
                modelAnswer:
                  "يعود ذلك إلى تدخل راحه ومضخه عبر آلية دقيقة تؤدي إلى شوارد، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ كمون الراحة",
                  keywords: ["راحه", "مضخه", "شوارد"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة التركيبية حول كمون الراحة",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ كمون الراحة.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer: "في الختام، ترتبط النتيجة النهائية بـ راحه ومضخه فتُغلق الظاهرة على شوارد.",
                rule: {
                  prompt: "الخاتمة التركيبية حول كمون الراحة",
                  keywords: ["راحه", "شوارد", "ختام"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 2,
            ui: "text",
            label: "تحويل الطاقة في الميتوكوندري",
            max: 7,
            desc: "أكسدة النواقل وتشكل ATP",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية حول: تحويل الطاقة في الميتوكوندري",
                bacPrompt: "ما المشكل العلمي المرتبط بـ تحويل الطاقة في الميتوكوندري؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ تحويل الطاقة في الميتوكوندري في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: تحويل الطاقة في الميتوكوندري",
                  keywords: ["ميتوكوندري", "نواقل"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2.5,
                prompt: "استغلال الوثيقة المتعلقة بـ تحويل الطاقة في الميتوكوندري",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ تحويل الطاقة في الميتوكوندري.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 90,
                modelAnswer:
                  "تمثل الوثيقة تغيرات ميتوكوندري بدلالة الزمن مقارنة بـ نواقل. نلاحظ تغيرا واضحا في ميتوكوندري مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع نواقل.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ تحويل الطاقة في الميتوكوندري",
                  keywords: ["ميتوكوندري", "نواقل", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["ميتوكوندري", "زمن"],
                    comparisons: [["ميتوكوندري", "نواقل"]],
                    trends: [{ about: "ميتوكوندري", expect: ["ميتوكوندري", "نواقل"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2.5,
                prompt: "تفسير الآلية المرتبطة بـ تحويل الطاقة في الميتوكوندري",
                bacPrompt: "اشرح الآلية التي تفسر تحويل الطاقة في الميتوكوندري انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 110,
                modelAnswer:
                  "يعود ذلك إلى تدخل ميتوكوندري ونواقل عبر آلية دقيقة تؤدي إلى ATP، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ تحويل الطاقة في الميتوكوندري",
                  keywords: ["ميتوكوندري", "نواقل", "ATP"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة التركيبية حول تحويل الطاقة في الميتوكوندري",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ تحويل الطاقة في الميتوكوندري.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer: "في الختام، ترتبط النتيجة النهائية بـ ميتوكوندري ونواقل فتُغلق الظاهرة على ATP.",
                rule: {
                  prompt: "الخاتمة التركيبية حول تحويل الطاقة في الميتوكوندري",
                  keywords: ["ميتوكوندري", "ATP", "ختام"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 3,
            ui: "text",
            label: "النشاط التكتوني",
            max: 8,
            desc: "العلاقة بين الزلازل والحدود بين الصفائح",
            poles: {
              N: {
                points: 0.5,
                prompt: "تأطير الإشكالية حول: النشاط التكتوني",
                bacPrompt: "ما المشكل العلمي المرتبط بـ النشاط التكتوني؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 30,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ النشاط التكتوني في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: النشاط التكتوني",
                  keywords: ["زلزال", "حدود"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2,
                prompt: "استغلال الوثيقة المتعلقة بـ النشاط التكتوني",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ النشاط التكتوني.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 60,
                modelAnswer:
                  "تمثل الوثيقة تغيرات زلزال بدلالة الزمن مقارنة بـ حدود. نلاحظ تغيرا واضحا في زلزال مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع حدود.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ النشاط التكتوني",
                  keywords: ["زلزال", "حدود", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["زلزال", "زمن"],
                    comparisons: [["زلزال", "حدود"]],
                    trends: [{ about: "زلزال", expect: ["زلزال", "حدود"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 4,
                prompt: "تفسير الآلية المرتبطة بـ النشاط التكتوني",
                bacPrompt: "اشرح الآلية التي تفسر النشاط التكتوني انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 110,
                modelAnswer:
                  "يعود ذلك إلى تدخل زلزال وحدود عبر آلية دقيقة تؤدي إلى صفائح، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ النشاط التكتوني",
                  keywords: ["زلزال", "حدود", "صفائح"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1.5,
                prompt: "الخاتمة التركيبية حول النشاط التكتوني",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ النشاط التكتوني.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "زلزال → حدود → صفائح",
                minLength: 40,
                modelAnswer: "عنوان المخطط: زلزال. زلزال → حدود → صفائح.",
                rule: {
                  prompt: "الخاتمة التركيبية حول النشاط التكتوني",
                  keywords: ["مخطط", "زلزال", "صفائح"],
                  minHits: 2,
                  forbidden: [],
                  schema: { arrows: true, title: "زلزال", ordered: ["زلزال", "حدود", "صفائح"] }
                }
              }
            }
          }
        ]
      }
    ]
  },
  {
    id: "2013",
    label: "بكالوريا الجزائر دورة 2013",
    badge: "أرشيف مُعاد بناؤه",
    theme: "emerald",
    enabled: true,
    sujets: [
      {
        id: 1,
        pdf: null,
        pdfAvailable: false,
        pdfExternalUrl:
          "https://www.dzexams.com/uploads/sujets/officiels/bac/2013/dzexams-bac-sciences-4463279.pdf",
        pdfNote:
          "PDF non redistribué dans le dépôt. Page dzexams : https://www.dzexams.com/ar/annales/bjdJbVBZMHFKeUZTcExKSEw4REVNQT09. 2013 : PDF dzexams محمي في العارض. Thèmes pédagogiques reconstruits.",
        title: "الموضوع الأول",
        exercises: [
          {
            number: 1,
            ui: "text",
            label: "النسخ والترجمة",
            max: 5,
            desc: "من المورثة إلى البروتين الوظيفي",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية حول: النسخ والترجمة",
                bacPrompt: "ما المشكل العلمي المرتبط بـ النسخ والترجمة؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ النسخ والترجمة في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: النسخ والترجمة",
                  keywords: ["مورثه", "نسخ"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 1,
                prompt: "استغلال الوثيقة المتعلقة بـ النسخ والترجمة",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ النسخ والترجمة.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 40,
                modelAnswer:
                  "تمثل الوثيقة تغيرات مورثه بدلالة الزمن مقارنة بـ نسخ. نلاحظ تغيرا واضحا في مورثه مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع نسخ.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ النسخ والترجمة",
                  keywords: ["مورثه", "نسخ", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["مورثه", "زمن"],
                    comparisons: [["مورثه", "نسخ"]],
                    trends: [{ about: "مورثه", expect: ["مورثه", "نسخ"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2,
                prompt: "تفسير الآلية المرتبطة بـ النسخ والترجمة",
                bacPrompt: "اشرح الآلية التي تفسر النسخ والترجمة انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 120,
                modelAnswer:
                  "يعود ذلك إلى تدخل مورثه ونسخ عبر آلية دقيقة تؤدي إلى ترجمه، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ النسخ والترجمة",
                  keywords: ["مورثه", "نسخ", "ترجمه"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة التركيبية حول النسخ والترجمة",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ النسخ والترجمة.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer: "في الختام، ترتبط النتيجة النهائية بـ مورثه ونسخ فتُغلق الظاهرة على ترجمه.",
                rule: {
                  prompt: "الخاتمة التركيبية حول النسخ والترجمة",
                  keywords: ["مورثه", "ترجمه", "ختام"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 2,
            ui: "text",
            label: "الموقع الفعال للإنزيم",
            max: 7,
            desc: "الأحماض الأمينية المحددة للتخصص",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية حول: الموقع الفعال للإنزيم",
                bacPrompt: "ما المشكل العلمي المرتبط بـ الموقع الفعال للإنزيم؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ الموقع الفعال للإنزيم في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: الموقع الفعال للإنزيم",
                  keywords: ["امينيه", "موقع"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2.5,
                prompt: "استغلال الوثيقة المتعلقة بـ الموقع الفعال للإنزيم",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ الموقع الفعال للإنزيم.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 90,
                modelAnswer:
                  "تمثل الوثيقة تغيرات امينيه بدلالة الزمن مقارنة بـ موقع. نلاحظ تغيرا واضحا في امينيه مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع موقع.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ الموقع الفعال للإنزيم",
                  keywords: ["امينيه", "موقع", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["امينيه", "زمن"],
                    comparisons: [["امينيه", "موقع"]],
                    trends: [{ about: "امينيه", expect: ["امينيه", "موقع"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2.5,
                prompt: "تفسير الآلية المرتبطة بـ الموقع الفعال للإنزيم",
                bacPrompt: "اشرح الآلية التي تفسر الموقع الفعال للإنزيم انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 110,
                modelAnswer:
                  "يعود ذلك إلى تدخل امينيه وموقع عبر آلية دقيقة تؤدي إلى تخصص، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ الموقع الفعال للإنزيم",
                  keywords: ["امينيه", "موقع", "تخصص"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة التركيبية حول الموقع الفعال للإنزيم",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ الموقع الفعال للإنزيم.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer: "في الختام، ترتبط النتيجة النهائية بـ امينيه وموقع فتُغلق الظاهرة على تخصص.",
                rule: {
                  prompt: "الخاتمة التركيبية حول الموقع الفعال للإنزيم",
                  keywords: ["امينيه", "تخصص", "ختام"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 3,
            ui: "text",
            label: "الأجسام المضادة",
            max: 8,
            desc: "التعرف النوعي على مولد الضد في المرحلة الفاعلة",
            poles: {
              N: {
                points: 0.5,
                prompt: "تأطير الإشكالية حول: الأجسام المضادة",
                bacPrompt: "ما المشكل العلمي المرتبط بـ الأجسام المضادة؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 30,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ الأجسام المضادة في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: الأجسام المضادة",
                  keywords: ["مضاده", "مولد"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2,
                prompt: "استغلال الوثيقة المتعلقة بـ الأجسام المضادة",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ الأجسام المضادة.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 60,
                modelAnswer:
                  "تمثل الوثيقة تغيرات مضاده بدلالة الزمن مقارنة بـ مولد. نلاحظ تغيرا واضحا في مضاده مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع مولد.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ الأجسام المضادة",
                  keywords: ["مضاده", "مولد", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["مضاده", "زمن"],
                    comparisons: [["مضاده", "مولد"]],
                    trends: [{ about: "مضاده", expect: ["مضاده", "مولد"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 4,
                prompt: "تفسير الآلية المرتبطة بـ الأجسام المضادة",
                bacPrompt: "اشرح الآلية التي تفسر الأجسام المضادة انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 110,
                modelAnswer:
                  "يعود ذلك إلى تدخل مضاده ومولد عبر آلية دقيقة تؤدي إلى ضد، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ الأجسام المضادة",
                  keywords: ["مضاده", "مولد", "ضد"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1.5,
                prompt: "الخاتمة التركيبية حول الأجسام المضادة",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ الأجسام المضادة.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "مضاده → مولد → ضد",
                minLength: 40,
                modelAnswer: "عنوان المخطط: مضاده. مضاده → مولد → ضد.",
                rule: {
                  prompt: "الخاتمة التركيبية حول الأجسام المضادة",
                  keywords: ["مخطط", "مضاده", "ضد"],
                  minHits: 2,
                  forbidden: [],
                  schema: { arrows: true, title: "مضاده", ordered: ["مضاده", "مولد", "ضد"] }
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
          "https://www.dzexams.com/uploads/sujets/officiels/bac/2013/dzexams-bac-sciences-4463279.pdf",
        pdfNote:
          "PDF non redistribué dans le dépôt. Page dzexams : https://www.dzexams.com/ar/annales/bjdJbVBZMHFKeUZTcExKSEw4REVNQT09. 2013 : PDF dzexams محمي في العارض. Thèmes pédagogiques reconstruits.",
        title: "الموضوع الثاني",
        exercises: [
          {
            number: 1,
            ui: "text",
            label: "كمون العمل",
            max: 5,
            desc: "دور القنوات الفولطية في زوال وعودة الاستقطاب",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية حول: كمون العمل",
                bacPrompt: "ما المشكل العلمي المرتبط بـ كمون العمل؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer: "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ كمون العمل في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: كمون العمل",
                  keywords: ["عمل", "قنوات"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 1,
                prompt: "استغلال الوثيقة المتعلقة بـ كمون العمل",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ كمون العمل.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 40,
                modelAnswer:
                  "تمثل الوثيقة تغيرات عمل بدلالة الزمن مقارنة بـ قنوات. نلاحظ تغيرا واضحا في عمل مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع قنوات.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ كمون العمل",
                  keywords: ["عمل", "قنوات", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["عمل", "زمن"],
                    comparisons: [["عمل", "قنوات"]],
                    trends: [{ about: "عمل", expect: ["عمل", "قنوات"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2,
                prompt: "تفسير الآلية المرتبطة بـ كمون العمل",
                bacPrompt: "اشرح الآلية التي تفسر كمون العمل انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 120,
                modelAnswer:
                  "يعود ذلك إلى تدخل عمل وقنوات عبر آلية دقيقة تؤدي إلى فولطيه، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ كمون العمل",
                  keywords: ["عمل", "قنوات", "فولطيه"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة التركيبية حول كمون العمل",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ كمون العمل.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer: "في الختام، ترتبط النتيجة النهائية بـ عمل وقنوات فتُغلق الظاهرة على فولطيه.",
                rule: {
                  prompt: "الخاتمة التركيبية حول كمون العمل",
                  keywords: ["عمل", "فولطيه", "ختام"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 2,
            ui: "text",
            label: "ATP في الميتوكوندري",
            max: 7,
            desc: "دور تدرج البروتونات وATP سنتاز",
            poles: {
              N: {
                points: 1,
                prompt: "تأطير الإشكالية حول: ATP في الميتوكوندري",
                bacPrompt: "ما المشكل العلمي المرتبط بـ ATP في الميتوكوندري؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 40,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ ATP في الميتوكوندري في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: ATP في الميتوكوندري",
                  keywords: ["بروتون", "سنتاز"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2.5,
                prompt: "استغلال الوثيقة المتعلقة بـ ATP في الميتوكوندري",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ ATP في الميتوكوندري.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 90,
                modelAnswer:
                  "تمثل الوثيقة تغيرات بروتون بدلالة الزمن مقارنة بـ سنتاز. نلاحظ تغيرا واضحا في بروتون مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع سنتاز.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ ATP في الميتوكوندري",
                  keywords: ["بروتون", "سنتاز", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["بروتون", "زمن"],
                    comparisons: [["بروتون", "سنتاز"]],
                    trends: [{ about: "بروتون", expect: ["بروتون", "سنتاز"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 2.5,
                prompt: "تفسير الآلية المرتبطة بـ ATP في الميتوكوندري",
                bacPrompt: "اشرح الآلية التي تفسر ATP في الميتوكوندري انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 110,
                modelAnswer:
                  "يعود ذلك إلى تدخل بروتون وسنتاز عبر آلية دقيقة تؤدي إلى ATP، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ ATP في الميتوكوندري",
                  keywords: ["بروتون", "سنتاز", "ATP"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1,
                prompt: "الخاتمة التركيبية حول ATP في الميتوكوندري",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ ATP في الميتوكوندري.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "في الختام...",
                minLength: 40,
                modelAnswer: "في الختام، ترتبط النتيجة النهائية بـ بروتون وسنتاز فتُغلق الظاهرة على ATP.",
                rule: {
                  prompt: "الخاتمة التركيبية حول ATP في الميتوكوندري",
                  keywords: ["بروتون", "ATP", "ختام"],
                  minHits: 2,
                  forbidden: []
                }
              }
            }
          },
          {
            number: 3,
            ui: "text",
            label: "الحمل الحراري والصفائح",
            max: 8,
            desc: "تيارات الرداء كمحرك لحركة الصفائح",
            poles: {
              N: {
                points: 0.5,
                prompt: "تأطير الإشكالية حول: الحمل الحراري والصفائح",
                bacPrompt: "ما المشكل العلمي المرتبط بـ الحمل الحراري والصفائح؟",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "صياغة المشكل العلمي...",
                minLength: 30,
                modelAnswer:
                  "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ الحمل الحراري والصفائح في الظاهرة المدروسة؟",
                rule: {
                  prompt: "تأطير الإشكالية حول: الحمل الحراري والصفائح",
                  keywords: ["حمل", "حراري"],
                  minHits: 2,
                  forbidden: []
                }
              },
              S: {
                points: 2,
                prompt: "استغلال الوثيقة المتعلقة بـ الحمل الحراري والصفائح",
                bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ الحمل الحراري والصفائح.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "نلاحظ... بينما... ومنه نستنتج...",
                minLength: 60,
                modelAnswer:
                  "تمثل الوثيقة تغيرات حمل بدلالة الزمن مقارنة بـ حراري. نلاحظ تغيرا واضحا في حمل مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع حراري.",
                rule: {
                  prompt: "استغلال الوثيقة المتعلقة بـ الحمل الحراري والصفائح",
                  keywords: ["حمل", "حراري", "نلاحظ"],
                  minHits: 2,
                  forbidden: ["بسبب"],
                  document: {
                    kind: "curve",
                    axes: ["حمل", "زمن"],
                    comparisons: [["حمل", "حراري"]],
                    trends: [{ about: "حمل", expect: ["حمل", "حراري"] }],
                    values: [],
                    strictValues: false
                  }
                }
              },
              E: {
                points: 4,
                prompt: "تفسير الآلية المرتبطة بـ الحمل الحراري والصفائح",
                bacPrompt: "اشرح الآلية التي تفسر الحمل الحراري والصفائح انطلاقا من الوثيقة ومعلوماتك.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "يعود ذلك إلى...",
                minLength: 110,
                modelAnswer:
                  "يعود ذلك إلى تدخل حمل وحراري عبر آلية دقيقة تؤدي إلى رداء، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
                rule: {
                  prompt: "تفسير الآلية المرتبطة بـ الحمل الحراري والصفائح",
                  keywords: ["حمل", "حراري", "رداء"],
                  minHits: 3,
                  forbidden: []
                }
              },
              W: {
                points: 1.5,
                prompt: "الخاتمة التركيبية حول الحمل الحراري والصفائح",
                bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ الحمل الحراري والصفائح.",
                ...RECON(
                  "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
                ),
                placeholder: "حمل → حراري → رداء",
                minLength: 40,
                modelAnswer: "عنوان المخطط: حمل. حمل → حراري → رداء.",
                rule: {
                  prompt: "الخاتمة التركيبية حول الحمل الحراري والصفائح",
                  keywords: ["مخطط", "حمل", "رداء"],
                  minHits: 2,
                  forbidden: [],
                  schema: { arrows: true, title: "حمل", ordered: ["حمل", "حراري", "رداء"] }
                }
              }
            }
          }
        ]
      }
    ]
  }
];
