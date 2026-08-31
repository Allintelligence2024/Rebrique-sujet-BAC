/* ============================================================
   BAC SVT Algérie 2020 — شعبة علوم تجريبية — entraînement 4D
   ------------------------------------------------------------
   Énoncé : PDF officiel eddirasa
     https://eddirasa.com/wp-content/uploads/2020/09/eddirasa.com-bac-se-science-2020.pdf
     (OCR RTL inversé reconstitué mot à mot, 9 pages, 2 sujets × 3
     exercices 5+7+8, 2026-08-31).
   Corrigé : PDF officiel eddirasa
     https://eddirasa.com/wp-content/uploads/2020/09/eddirasa.com-correction-bac-sc-science-2020.pdf
     (12 pages, couche inversée reconstituée).
   Miroir dzexams (viewer consulté) :
     https://www.dzexams.com/ar/annales/SUFqL0VzRjNzdmd6ek1EekpsOTFMdz09
   Un pôle = une consigne. Les questions surnuméraires restent
   non mappées (notes).
   ============================================================ */

const OFFICIAL = (page, notes) => ({
  bacPromptSource: "official",
  bacPromptPage: page,
  bacPromptVerifiedAt: "2026-08-31",
  bacPromptNotes: notes
});

const RECON = (notes) => ({
  bacPromptSource: "reconstructed",
  bacPromptNotes: notes
});

const PDF =
  "https://eddirasa.com/wp-content/uploads/2020/09/eddirasa.com-bac-se-science-2020.pdf";
const PDF_NOTE =
  "PDF officiel non redistribué dans le dépôt. Source énoncé: https://eddirasa.com/wp-content/uploads/2020/09/eddirasa.com-bac-se-science-2020.pdf (consulté 2026-08-31). Corrigé: https://eddirasa.com/wp-content/uploads/2020/09/eddirasa.com-correction-bac-sc-science-2020.pdf. Miroir dzexams: https://www.dzexams.com/ar/annales/SUFqL0VzRjNzdmd6ek1EekpsOTFMdz09.";

export const YEAR_2020_SE = {
  id: "2020",
  stream: "se",
  calendarYear: "2020",
  label: "بكالوريا الجزائر دورة 2020",
  badge: "دورة رسمية",
  theme: "emerald",
  enabled: true,
  sujets: [
    {
      id: 1,
      pdf: null,
      pdfAvailable: false,
      pdfExternalUrl: PDF,
      pdfNote: PDF_NOTE,
      title: "الموضوع الأول",
      exercises: [
        {
          number: 1,
          ui: "text",
          label: "البنية الداخلية للكرة الأرضية",
          max: 5,
          desc: "طبقات الكرة الأرضية وتقطعات موهو وغوتنبرغ وليمان من المعطيات الزلزالية",
          poles: {
            N: {
              points: 1,
              prompt: "تأطير الإشكالية: كيف سمحت المعطيات الزلزالية بمعرفة البنية الداخلية للكرة الأرضية؟",
              bacPrompt:
                "كيف سمحت المعطيات الزلزالية بمعرفة البنية الداخلية للكرة الأرضية رغم أن أعمق نقطة بلغت 13 كيلومترا؟",
              ...RECON(
                "Pas de question officielle autonome de type حدد المشكل. Reformulation pédagogique du préambule page 1."
              ),
              placeholder: "صياغة المشكل العلمي...",
              minLength: 40,
              modelAnswer:
                "المشكل العلمي: كيف سمحت سرعة انتشار الموجات الزلزالية P و S والتقطعات الفاصلة بين الأغلفة ببناء نموذج لبنية الكرة الأرضية الداخلية؟",
              rule: {
                prompt: "حدد المشكل العلمي حول البنية الداخلية للكرة الأرضية",
                keywords: ["زلزالي", "كره", "ارض"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 1,
              prompt: "نقل الجدول على ورقة الإجابة وملء أسماء البيانات المرقمة",
              bacPrompt:
                "انقل الجدول على ورقة إجابتك ثم املأ الخانات وفق البيانات المرقمة.",
              ...OFFICIAL(
                1,
                "Relecture du PDF eddirasa 2020 (OCR RTL reconstitué page 1) et du corrigé. Verbe officiel : انقل / املأ. Question 1 du التمرين الأول."
              ),
              placeholder: "1 قشرة قارية، 2 رداء، تقطع موهو...",
              minLength: 40,
              modelAnswer:
                "1 قشرة قارية. 2 رداء (برنس). 3 ليثوسفير. 4 قشرة محيطية. 5 رداء. 6 ليثوسفير محيطي. 7 أستينوسفير. 8 رداء سفلي. 9 نواة خارجية سائلة. 10 نواة داخلية صلبة. 11 نواة. الصخر المميز: A غرانيت، 1 غرانيت، 2 بيريدوتيت، 4 غابرو. التقطعات: A موهو، B غوتنبرغ، C ليمان.",
              rule: {
                prompt: "املأ أسماء البيانات المرقمة للطبقات والتقطعات",
                keywords: ["قشره", "موهو", "نواه", "غوتنبرغ"],
                minHits: 3,
                forbidden: []
              }
            },
            E: {
              points: 2,
              prompt: "النص العلمي: استغلال المعطيات الزلزالية لمعرفة البنية الداخلية",
              bacPrompt:
                "بيّن في نص علمي كيف تم استغلال المعطيات الزلزالية لمعرفة البنية الداخلية للكرة الأرضية اعتمادا على معلوماتك.",
              ...OFFICIAL(
                1,
                "Relecture du PDF eddirasa 2020 (page 1) et du corrigé (page 1-2). Verbe officiel : بيّن في نص علمي. Question 2 du التمرين الأول."
              ),
              placeholder: "مقدمة، عرض: موجات P و S، تقطعات، خاتمة...",
              minLength: 120,
              modelAnswer:
                "تزداد سرعة الموجات الزلزالية بزيادة كثافة الوسط الذي تخترقه، وكل تغير في السرعة يدل على وجود تقطع. تنتشر موجات P في الأوساط الصلبة والسائلة بينما تنتشر موجات S في الأوساط الصلبة فقط. يفصل تقطع موهو القشرة عن البرنس، ويفصل تقطع غوتنبرغ البرنس الصلب عن النواة الخارجية السائلة، ويفصل تقطع ليمان النواة الخارجية عن النواة الداخلية الصلبة. سمحت هذه الدراسات ببناء تصور نموذجي للكرة الأرضية مكونة من أغلفة متمركزة تفصلها تقطعات.",
              rule: {
                prompt: "بين استغلال المعطيات الزلزالية للبنية الداخلية",
                keywords: ["موجات", "موهو", "غوتنبرغ", "نواه"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1,
              prompt: "الخاتمة: نموذج الأغلفة المفصولة بتقطعات",
              bacPrompt: "ما النموذج الذي سمحت الدراسات الزلزالية ببنائه لبنية الكرة الأرضية؟",
              ...RECON(
                "Clôture issue du corrigé officiel (الخاتمة). Pas une question BAC autonome."
              ),
              placeholder: "في الختام...",
              minLength: 40,
              modelAnswer:
                "في الختام، الكرة الأرضية مكونة من أغلفة متمركزة تفصلها تقطعات (موهو، غوتنبرغ، ليمان) عُرفت من تغير سرعة الموجات P و S.",
              rule: {
                prompt: "اكتب خاتمة حول نموذج الكرة الأرضية",
                keywords: ["اغلفه", "تقطع", "زلزالي"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 2,
          ui: "text",
          label: "أنزيما Cox-1 و Cox-2 ودواء الإيبوبروفين",
          max: 7,
          desc: "ازدواجية تأثير الأنزيم على مادة التفاعل، ودور الإيبوبروفين وآثاره الجانبية",
          poles: {
            N: {
              points: 1,
              prompt: "تأطير الإشكالية: خصوصية الموقع الفعال لأنزيمي Cox ودور الإيبوبروفين",
              bacPrompt: "كيف يختلف أنزيما Cox-1 و Cox-2 في الخصوصية، وما دور دواء الإيبوبروفين وآثاره الجانبية؟",
              ...RECON("Préambule pages 1-2. Pas de question officielle autonome de cadrage."),
              placeholder: "صياغة المشكل العلمي...",
              minLength: 30,
              modelAnswer:
                "المشكل العلمي: كيف يؤثر أنزيما Cox-1 و Cox-2 على المادة نفسها بخصوصيتين مختلفتين، وكيف يثبط الإيبوبروفين الألم مع آثار جانبية؟",
              rule: {
                prompt: "حدد المشكل العلمي حول Cox والإيبوبروفين",
                keywords: ["Cox", "ايبوبروفين", "انزيم"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2.5,
              prompt: "تحليل مخطط الشكل (أ) من الوثيقة 1: نشاط Cox-1 و Cox-2",
              bacPrompt: "حلّل مخطط الشكل (أ) من الوثيقة 1.",
              ...OFFICIAL(
                2,
                "Relecture du PDF eddirasa 2020 et du corrigé. Verbe officiel : حلّل. Question 1 du الجزء الأول. Consigne وضّح دور الإيبوبروفين non mappée."
              ),
              placeholder: "Cox-1 يحول حمض الأراكيدونيك إلى Pg1...",
              minLength: 90,
              modelAnswer:
                "تمثل الوثيقة نشاط الأنزيمين Cox-1 و Cox-2 بدلالة الركيزة. يحول Cox-1 حمض الأراكيدونيك إلى Pg1 الذي يحمي جدار المعدة بإفراز المخاط، بينما يحول Cox-2 حمض الأراكيدونيك إلى Pg2 المسبب للألم والحمى. ومنه نستنتج أن الأنزيمين يؤثران على المادة نفسها ويختلفان في الخصوصية.",
              rule: {
                prompt: "حلل مخطط نشاط Cox-1 و Cox-2",
                keywords: ["Cox", "اراكيدونيك", "الم", "مخاط"],
                minHits: 3,
                forbidden: ["بسبب"],
                document: {
                  kind: "curve",
                  axes: ["نشاط", "انزيم"],
                  comparisons: [["Cox-1", "Cox-2"]],
                  trends: [
                    { about: "Cox-1", expect: ["حمايه", "مخاط"] },
                    { about: "Cox-2", expect: ["الم", "حمى"] }
                  ],
                  relations: [{ type: "parallel", a: "Cox-1", b: "Cox-2" }],
                  values: [],
                  strictValues: false
                }
              }
            },
            E: {
              points: 2.5,
              prompt: "تفسير منحنى الشكل (ب) من الوثيقة 2: CI50 لأنزيمي Cox",
              bacPrompt: "فسّر منحنى الشكل (ب) من الوثيقة 2.",
              ...OFFICIAL(
                2,
                "Relecture du corrigé officiel eddirasa 2020 (page 3). Verbe officiel : فسّر. Question 2 du الجزء الثاني. Consigne علّل تأثير الإيبوبروفين على نفس التركيز non mappée."
              ),
              placeholder: "نشاط Cox-1 بطيء حتى CI50=15... Cox-2 ينخفض سريعا CI50=9.5...",
              minLength: 110,
              modelAnswer:
                "يكون نشاط أنزيم Cox-1 بطيئا ويصل إلى CI50 عند 15 ميكرومول/ل ثم ينعدم، لضعف ارتباط الدواء بالموقع الفعال. ينخفض نشاط Cox-2 سريعا ويصل إلى CI50=9.5 ميكرومول/ل ويكاد ينعدم من البداية لقوة ارتباط الإيبوبروفين بموقعه الفعال. يؤثر الإيبوبروفين على الأنزيمين معا فيثبط Cox-2 فيختفي الألم والحمى، وتظهر آثار جانبية من تثبيط Cox-1 الواقي لجدار المعدة.",
              rule: {
                prompt: "فسر منحنى CI50 لأنزيمي Cox",
                keywords: ["CI", "Cox", "ايبوبروفين", "موقع"],
                minHits: 3,
                forbidden: [],
                causalOrder: ["ايبوبروفين", "Cox"]
              }
            },
            W: {
              points: 1,
              prompt: "اقتراح حل لدواء فعال بآثار جانبية محدودة",
              bacPrompt: "اقترح حلا.",
              ...OFFICIAL(
                2,
                "Relecture du corrigé officiel eddirasa 2020. Verbe officiel : اقترح حلا. Question 3 du الجزء الثاني."
              ),
              placeholder: "دواء يستهدف Cox-2 فقط...",
              minLength: 40,
              modelAnswer:
                "يقترح دواء يستهدف نشاط أنزيم Cox-2 دون التأثير على Cox-1، أو عدم تناول الدواء إلا باستشارة طبية والتقليل من استهلاك الأدوية.",
              rule: {
                prompt: "اقترح حلا لدواء بآثار جانبية محدودة",
                keywords: ["Cox", "دواء", "اثار"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 3,
          ui: "text",
          label: "بروتين Her2 والعلاج بالتراستوزوماب",
          max: 8,
          desc: "العلاقة بين كمية Her2 وتكاثر خلايا سرطان الثدي، وآلية تراستوزوماب",
          poles: {
            N: {
              points: 0.5,
              prompt: "اقتراح طريقة علاجية للحد من تكاثر خلايا سرطان الثدي",
              bacPrompt: "اقترح فرضية تبين طريقة علاجية للحد من تكاثر خلايا سرطان الثدي.",
              ...OFFICIAL(
                3,
                "Relecture du PDF eddirasa 2020 (page 3) et du corrigé. Verbe officiel : اقترح فرضية. Question 2 du الجزء الأول."
              ),
              placeholder: "الفرضية: تستعمل مواد تثبط بروتين Her2...",
              minLength: 30,
              modelAnswer:
                "الفرضية: تستعمل مواد تثبط بروتين Her2 للحد من تكاثر خلايا هذا النمط من سرطان الثدي.",
              rule: {
                prompt: "اقترح فرضية علاجية حول Her2",
                keywords: ["فرضيه", "Her", "سرطان"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2,
              prompt: "تحليل جدول الشكل (أ) من الوثيقة 2: عدد الخلايا بوجود تراستوزوماب",
              bacPrompt: "حلّل النتائج الموضحة في الجدول الشكل (أ) من الوثيقة 2.",
              ...OFFICIAL(
                4,
                "Relecture du PDF eddirasa 2020 (page 4) et du corrigé (pages 3-4). Verbe officiel : حلّل. Question 1 du الجزء الثاني. Consigne استخرج علاقة Her2 بتطور الخلايا (الجزء الأول) non mappée."
              ),
              placeholder: "في غياب تراستوزوماب يصل عدد خلايا A إلى 655...",
              minLength: 90,
              modelAnswer:
                "يمثل الجدول تطور عدد الخلايا السرطانية A و B في غياب ووجود تراكيز مختلفة من تراستوزوماب. في غياب الدواء يصل عدد خلايا A إلى 655 خلية وهو مرتفع جدا بينما يبقى عدد خلايا B منخفضا. بوجود تراستوزوماب ينخفض عدد خلايا A إلى 50 ثم إلى 5 بزيادة التركيز بينما يبقى عدد خلايا B ثابتا. ومنه نستنتج أن تراستوزوماب يحد من تكاثر الخلايا A ولا يؤثر على الخلايا B.",
              rule: {
                prompt: "حلل جدول عدد الخلايا بوجود تراستوزوماب",
                keywords: ["تراستوزوماب", "خلايا", "A", "B"],
                minHits: 3,
                forbidden: ["بسبب"],
                document: {
                  kind: "table",
                  axes: ["عدد", "تركيز"],
                  comparisons: [["A", "B"]],
                  cells: [["تراستوزوماب", "خلايا"]],
                  values: ["655"],
                  strictValues: true
                }
              }
            },
            E: {
              points: 4,
              prompt: "تفسير آلية تأثير تراستوزوماب والمصادقة على الفرضية",
              bacPrompt:
                "فسّر آلية تأثير جزيئة تراستوزوماب على الخلايا السرطانية باستغلال معطيات الشكلين (ب) و(ج) من الوثيقة 2 معللا صحة الفرضية المقترحة.",
              ...OFFICIAL(
                4,
                "Relecture du PDF eddirasa 2020 (page 4) et du corrigé (pages 4-5). Verbe officiel : فسّر. Question 2 du الجزء الثاني."
              ),
              placeholder: "يرتبط تراستوزوماب نوعيا بـ Her2 فيتوقف التحفيز...",
              minLength: 110,
              modelAnswer:
                "يرتبط تراستوزوماب نوعيا بالبروتين الغشائي Her2 فيتوقف تحفيزه ولا تتكاثر الخلايا السرطانية A. قبل العلاج يزداد عدد الخلايا A سريعا لغياب الأجسام المضادة. بعد العلاج بالأجسام المضادة ينخفض العدد تدريجيا نتيجة الارتباط النوعي بـ Her2 فتقل سرع تكاثر A. بعد العلاج بالبلعمات ينخفض العدد سريعا حتى الانعدام بتنشيط البلعمات ذات المستقبلات الغشائية المكملة للأجسام المضادة. تتأكد الفرضية: تستهدف الأجسام المضادة Her2 لتسهيل بلعمة الخلايا السرطانية.",
              rule: {
                prompt: "فسر آلية تراستوزوماب وصادق على الفرضية",
                keywords: ["تراستوزوماب", "Her", "فرضيه", "بلعمه"],
                minHits: 3,
                forbidden: [],
                wrongConcepts: ["Cox", "ريسين"]
              }
            },
            W: {
              points: 1.5,
              prompt: "اقتراح للكشف المبكر عن سرطان الثدي",
              bacPrompt: "قدّم مقترحا حول إمكانية استغلال نتائج هذه الدراسة في الكشف المبكر عن سرطان الثدي.",
              ...OFFICIAL(
                4,
                "Relecture du corrigé officiel eddirasa 2020. Verbe officiel : قدّم مقترحا. Question 3 du الجزء الثاني. Consigne النص العلمي للجزء الثالث (دور الأجسام المضادة) non mappée."
              ),
              placeholder: "تحديد كمية Her2 بتقنية الفلورة...",
              minLength: 40,
              modelAnswer:
                "يمكن الكشف المبكر عن سرطان الثدي بتحديد كمية Her2 في الخلايا السرطانية بتقنية الفلورة المناعية عبر الأجسام المضادة (تراستوزوماب) ومتابعة تغير كميته خلال مراحل المرض.",
              rule: {
                prompt: "قدم مقترحا للكشف المبكر عن سرطان الثدي",
                keywords: ["كشف", "Her", "ثدي"],
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
      pdfExternalUrl: PDF,
      pdfNote: PDF_NOTE,
      title: "الموضوع الثاني",
      exercises: [
        {
          number: 1,
          ui: "text",
          label: "انتقاء الببتيد المستضدي ونمط الاستجابة المناعية",
          max: 5,
          desc: "عرض الببتيد المستضدي على CMH I أو II وتحديد نمط الاستجابة الخلطية أو الخلوية",
          poles: {
            N: {
              points: 1,
              prompt: "تأطير الإشكالية: كيف يحدد مصدر الببتيد المستضدي نمط الاستجابة المناعية؟",
              bacPrompt: "كيف يتوقف انتقاء الببتيد المستضدي على مصدره لدى الخلايا العارضة، فيتحدد نمط الاستجابة المناعية النوعية؟",
              ...RECON("Préambule page 5. Pas de question officielle autonome de cadrage."),
              placeholder: "صياغة المشكل العلمي...",
              minLength: 40,
              modelAnswer:
                "المشكل العلمي: كيف يحدد مصدر الببتيد المستضدي المعروض على CMH نمط الاستجابة المناعية النوعية الخلطية أو الخلوية؟",
              rule: {
                prompt: "حدد المشكل العلمي حول انتقاء الببتيد المستضدي",
                keywords: ["ببتيد", "مستضد", "استجابه"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 1,
              prompt: "تسمية البيانات المرقمة من 1 إلى 11 والتعرف على الخليتين (س) و(ع) ونمطي الاستجابة",
              bacPrompt:
                "سمّ العناصر المرقمة من 1 إلى 11 ثم تعرّف على الخليتين (س) و(ع) ونمطي الاستجابة (أ) و(ب).",
              ...OFFICIAL(
                5,
                "Relecture du PDF eddirasa 2020 (page 5) et du corrigé (page 6). Verbe officiel : سمّ / تعرّف. Question 1 du التمرين الأول (Sujet 2)."
              ),
              placeholder: "1 بروتين مستضد، 2 مستضد، 3 معقد CMHI...",
              minLength: 40,
              modelAnswer:
                "1 بروتين مستضد. 2 مستضد. 3 معقد (ببتيد مستضدي–CMH I). 4 معقد (ببتيد مستضدي–CMH II). 5 LT8. 6 LT4. الخلية (س): خلية عارضة أو بلعم كبير. الخلية (ع): خلية مصابة أو مستهدفة. النمط (أ): استجابة مناعية ذات وساطة خلطية. النمط (ب): استجابة مناعية ذات وساطة خلوية.",
              rule: {
                prompt: "سم البيانات المرقمة ونمطي الاستجابة",
                keywords: ["CMH", "LT4", "LT8", "خلطيه"],
                minHits: 3,
                forbidden: []
              }
            },
            E: {
              points: 2,
              prompt: "النص العلمي: دور مصدر الببتيد المستضدي في تحديد نمط الاستجابة",
              bacPrompt:
                "اكتب نصا علميا تبين فيه دور مصدر الببتيد المستضدي في انتقاء وتحديد نمط الاستجابة المناعية النوعية انطلاقا من معطيات الوثيقة ومكتسباتك.",
              ...OFFICIAL(
                5,
                "Relecture du PDF eddirasa 2020 (page 5) et du corrigé (page 6). Verbe officiel : اكتب نصا علميا. Question 2 du التمرين الأول (Sujet 2)."
              ),
              placeholder: "مقدمة، عرض، خاتمة...",
              minLength: 120,
              modelAnswer:
                "تُهضم البروتينات الفيروسية جزئيا داخل الخلية المصابة وتُعرض مرتبطة بجزيئات CMH I على أغشيتها فتنشط الاستجابة ذات الوساطة الخلوية بتعرف LT8. تبتلع الخلية العارضة المستضد وتهضمه في الليزوزوم فيرتبط محدد المستضد بجزيئات CMH II وتُقدم الببتيدات إلى LT4 فتنشط الاستجابة ذات الوساطة الخلطية. يحدد نوع CMH والخلية المنشطة طبيعة الاستجابة المناعية. يتسبب دخول مولد الضد في الخلية العارضة أو المصابة باختيار نمط الاستجابة النوعية الذي يضمن إقصاء المستضد.",
              rule: {
                prompt: "اكتب نصا علميا حول مصدر الببتيد ونمط الاستجابة",
                keywords: ["CMH", "LT4", "LT8", "عرض"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1,
              prompt: "الخاتمة: عرض الببتيد في الخلية العارضة أو المصابة",
              bacPrompt: "ما الذي يحدد نمط الاستجابة المناعية النوعية عند عرض الببتيد المستضدي؟",
              ...RECON("Clôture issue du corrigé officiel. Pas une question BAC autonome."),
              placeholder: "في الختام...",
              minLength: 40,
              modelAnswer:
                "في الختام، يحدد عرض الببتيد المستضدي في الخلية العارضة أو المصابة نمط الاستجابة المناعية النوعية.",
              rule: {
                prompt: "اكتب خاتمة حول تحديد نمط الاستجابة",
                keywords: ["عرض", "نمط", "استجابه"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 2,
          ui: "text",
          label: "مادة الريسين وتثبيط تركيب البروتين",
          max: 7,
          desc: "تثبيط تكاثر الخلايا السرطانية بالريسين عبر تعطيل تشكل الريبوزوم الوظيفي على ARNr 28s",
          poles: {
            N: {
              points: 1,
              prompt: "تأطير الإشكالية: كيف تثبط مادة الريسين تركيب البروتين في الخلايا السرطانية؟",
              bacPrompt: "كيف تؤثر مادة الريسين المستخرجة من بذور الخروع على تركيب البروتين وعلاج الأورام السرطانية؟",
              ...RECON("Préambule page 5. Pas de question officielle autonome de cadrage."),
              placeholder: "صياغة المشكل العلمي...",
              minLength: 30,
              modelAnswer:
                "المشكل العلمي: كيف تثبط مادة الريسين تكاثر الخلايا السرطانية عبر تعطيل تركيب البروتين؟",
              rule: {
                prompt: "حدد المشكل العلمي حول الريسين",
                keywords: ["ريسين", "بروتين", "سرطان"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2.5,
              prompt: "تحليل شكلي الوثيقة 1: تكاثر الخلايا وإدماج الثيميدين واللوسين",
              bacPrompt:
                "حلّل الوثيقة 1 مبرزا العلاقة بين تكاثر الخلايا السرطانية والظواهر الحيوية المبينة في الشكل (ب).",
              ...OFFICIAL(
                5,
                "Relecture du PDF eddirasa 2020 (pages 5-6) et du corrigé (page 7). Verbe officiel : حلّل. Question du الجزء الأول."
              ),
              placeholder: "في غياب الريسين تتكاثر الخلايا بكثافة... إدماج 100%...",
              minLength: 90,
              modelAnswer:
                "يمثل الشكل (أ) تطور الخلايا السرطانية في غياب ووجود الريسين بتركيز 15 ميكروغرام/مل بدلالة التركيز. في الغياب تتكاثر الخلايا بكثافة وعشوائية، بينما في الوجود تتكاثر بضعف وبانتظام. يمثل الشكل (ب) متابعة نسبة إدماج الثيميدين المشع واللوسين المشع. في الغياب يبلغ الإدماج 100 بالمئة، وفي الوجود حتى 15 ميكروغرام/مل تنخفض نسبة إدماج الثيميدين في ADN إلى 55 بالمئة واللوسين في البروتين إلى 25 بالمئة. نلاحظ تناسبا عكسيا بين الريسين وتكاثر الخلايا. ومنه نستنتج أن الريسين يثبط تكاثر الخلايا السرطانية بتشبيط تركيب البروتين وبالتالي تضاعف ADN.",
              rule: {
                prompt: "حلل تكاثر الخلايا وإدماج الثيميدين واللوسين",
                keywords: ["ريسين", "ثيميدين", "لوسين", "تكاثر"],
                minHits: 3,
                forbidden: ["بسبب"],
                document: {
                  kind: "curve",
                  axes: ["ادماج", "تركيز"],
                  comparisons: [["ثيميدين", "لوسين"]],
                  trends: [
                    { about: "غياب", expect: ["تكاثر", "100"] },
                    { about: "وجود", expect: ["ينخفض", "يثبط"] }
                  ],
                  relations: [{ type: "inverse", a: "ريسين", b: "تكاثر" }],
                  values: ["15"],
                  strictValues: true
                }
              }
            },
            E: {
              points: 2.5,
              prompt: "تقديم حل للمشكل باستغلال الوثيقة 3: تأثير الريسين على الريبوزوم",
              bacPrompt: "قدّم حلا للمشكل المطروح انطلاقا من استغلالك لمعطيات الوثيقة 3.",
              ...OFFICIAL(
                7,
                "Relecture du PDF eddirasa 2020 (page 7) et du corrigé (page 8). Verbe officiel : قدّم حلا. Question 2 du الجزء الثاني. Consigne حلّل منحنيي الشكلين أ و ب (الوثيقة 2) non mappée."
              ),
              placeholder: "في غياب الريسين يتشكل ريبوزوم وظيفي... في وجوده يثبت على ARNr 28s...",
              minLength: 110,
              modelAnswer:
                "في غياب الريسين يتشكل ريبوزوم وظيفي وتتم عملية الترجمة فيتركب البروتين. في وجود الريسين لا يتشكل ريبوزوم وظيفي فلا تتم الترجمة ولا يتركب البروتين: تتثبت مادة الريسين على ARNr 28s للوحدة الكبرى الريبوزومية فتعيق تشكل الريبوزوم الوظيفي وتتوقف الترجمة.",
              rule: {
                prompt: "قدم حلا بتأثير الريسين على الريبوزوم",
                keywords: ["ريسين", "ريبوزوم", "ARNr", "ترجمه"],
                minHits: 3,
                forbidden: [],
                causalOrder: ["ريسين", "ريبوزوم"]
              }
            },
            W: {
              points: 1,
              prompt: "الخلاصة: مستوى تأثير الريسين على الترجمة لا النسخ",
              bacPrompt: "إذا كانت مادة الريسين لا تؤثر على عملية النسخ وتعيق عملية الترجمة، فما مستوى تأثيرها؟",
              ...RECON(
                "Question pédagogique issue du corrigé (المشكل المطروح). Pas une consigne BAC autonome isolée."
              ),
              placeholder: "في الختام...",
              minLength: 40,
              modelAnswer:
                "في الختام، يؤثر الريسين على مرحلة الترجمة بتثبيته على ARNr 28s فلا يتشكل ريبوزوم وظيفي ويتوقف تركيب البروتين وتكاثر الخلايا السرطانية.",
              rule: {
                prompt: "اكتب خلاصة حول مستوى تأثير الريسين",
                keywords: ["ترجمه", "ريبوزوم", "سرطان"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 3,
          ui: "text",
          label: "المشبك المثبط ونضج GABA بعد الولادة",
          max: 8,
          desc: "تحول المشبك المثبط من تنبيه إلى تثبيط بنضج الخلايا العصبية عبر المضختين NKCC1 و KCC2",
          poles: {
            N: {
              points: 0.5,
              prompt: "اقتراح فرضية تفسر تغير تدفق شوارد الكلور بعد الولادة",
              bacPrompt: "اقترح فرضية لحل هذه المشكلة.",
              ...OFFICIAL(
                8,
                "Relecture du PDF eddirasa 2020 (page 8) et du corrigé (page 8). Verbe officiel : اقترح فرضية. Question 2 du الجزء الأول. Consigne حلّل الوثيقة 1 non mappée."
              ),
              placeholder: "قبل النضج تتراكم Cl- داخل الخلية... بعد النضج في الخارج...",
              minLength: 30,
              modelAnswer:
                "الفرضية: قبل النضج تتراكم شوارد Cl- داخل الخلية فيسمح تثبيت GABA بتدفقها نحو الخارج حسب تدرج التركيز محدثا زوال استقطاب. بعد النضج تتراكم في الخارج فيسمح التثبيت بتدفقها نحو الداخل محدثا فرط استقطاب.",
              rule: {
                prompt: "اقترح فرضية حول تدفق الكلور بعد الولادة",
                keywords: ["فرضيه", "كلور", "GABA"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2,
              prompt: "استخراج أهم مميزات البروتينات الغشائية في الشكل (أ) من الوثيقة 2",
              bacPrompt: "استخرج أهم مميزات البروتينات الغشائية الممثلة في الشكل (أ) من الوثيقة 2.",
              ...OFFICIAL(
                9,
                "Relecture du PDF eddirasa 2020 (page 9) et du corrigé (page 9). Verbe officiel : استخرج. Question 1 du الجزء الثاني."
              ),
              placeholder: "مستقبلات GABA قنوات كيميائية... NKCC1 مضخة...",
              minLength: 60,
              modelAnswer:
                "تمثل الوثيقة بروتينات النقل بدلالة شوارد الكلور. مستقبلات GABA بروتينات قنوية تعمل وفق تدرج التركيز (ظاهرة الميز). بروتين NKCC1 يلعب دور مضخة تدخل شوارد Cl- عكس تدرج التركيز بالنقل الفعال، بينما بروتين KCC2 يلعب دور مضخة تخرج شوارد Cl- عكس تدرج التركيز بالنقل الفعال.",
              rule: {
                prompt: "استخرج مميزات مستقبلات GABA و NKCC1 و KCC2",
                keywords: ["GABA", "NKCC1", "KCC2", "كلور"],
                minHits: 3,
                forbidden: ["بسبب"],
                document: {
                  kind: "table",
                  axes: ["بروتين", "كلور"],
                  comparisons: [["NKCC1", "KCC2"]],
                  cells: [["GABA", "مضخه"]],
                  values: [],
                  strictValues: false
                }
              }
            },
            E: {
              points: 4,
              prompt: "التأكد من صحة الفرضية باستغلال معطيات الوثيقة 2",
              bacPrompt: "تأكد من صحة الفرضية المقترحة باستغلالك لمعطيات الوثيقة 2.",
              ...OFFICIAL(
                9,
                "Relecture du PDF eddirasa 2020 (page 9) et du corrigé (pages 9-10). Verbe officiel : تأكد. Question 2 du الجزء الثاني."
              ),
              placeholder: "اليوم الأول: مضخات NKCC1... اليوم 65: مضخات KCC2...",
              minLength: 110,
              modelAnswer:
                "في اليوم الأول بعد الولادة يحوي الغشاء بعد المشبكي مضخات NKCC1 تضخ Cl- نحو الداخل فيسمح تنشيط مستقبلات GABA بتدفق Cl- نحو الخارج. في اليوم 65 يتميز الغشاء بمضخات KCC2 تضخ Cl- نحو الخارج فيسمح التنشيط بتدفق Cl- نحو الداخل. يرتفع التركيز الداخلي لـ Cl- حتى اليوم 10 ثم ينخفض تدريجيا حتى اليوم 45 ويثبت عند 1 م.و. يكون تعبير ARNm لـ NKCC1 مرتفعا عند الولادة بينما ينعدم تعبير KCC2 ثم ينعكس بعد اليوم 10. تتأكد الفرضية: يطرأ على مشبك GABA تحول فيزيولوجي من منبّه إلى مثبّط بنضج الخلية بعد المشبكية.",
              rule: {
                prompt: "تأكد من صحة الفرضية باستغلال الوثيقة 2",
                keywords: ["فرضيه", "NKCC1", "KCC2", "GABA"],
                minHits: 3,
                forbidden: [],
                causalOrder: ["NKCC1", "KCC2"]
              }
            },
            W: {
              points: 1.5,
              prompt: "تقديم حل علمي لعلاج اضطرابات عصبية ناتجة عن تراكم Cl- عند البالغين",
              bacPrompt:
                "قدّم حلا مبنيا على أسس علمية لعلاج أشخاص بالغين يعانون من اضطرابات عصبية ناتجة عن تراكم شوارد Cl- في هيولى الخلية بعد المشبكية.",
              ...OFFICIAL(
                9,
                "Relecture du PDF eddirasa 2020 (page 9) et du corrigé (page 10). Verbe officiel : قدّم حلا. Question 3 du الجزء الثاني. Consigne النص العلمي للجزء الثالث (آلية المشبك المثبط) non mappée."
              ),
              placeholder: "مواد تثبط NKCC1 أو أدوية تنشط KCC2...",
              minLength: 0,
              modelAnswer:
                "يستعمل مواد كيميائية تثبط عمل مضخات NKCC1 أو أدوية تنشط عمل مضخات KCC2 لإعادة تركيز Cl- الداخلي إلى قيمته الطبيعية عند البالغ.",
              rule: {
                prompt: "قدم حلا لعلاج تراكم الكلور عند البالغين",
                keywords: ["NKCC", "KCC2", "كلور"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        }
      ]
    }
  ]
};
