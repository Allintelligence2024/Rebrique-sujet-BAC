/* ============================================================
   BAC SVT Algérie 2015 — Sciences expérimentales
   ------------------------------------------------------------
   Barème officiel vérifié sur PDF dzexams :
   Sujet 1 : 07 / 06 / 07 = 20  (p1, p3, p4)
   Sujet 2 : 06 / 07 / 07 = 20  (p6, p7, p9)
   Consignes transcrites verbatim depuis
   /subjects/SE/2015/sujet-1.pdf (5 pages) et
   /subjects/SE/2015/sujet-2.pdf (5 pages, doc 6-10).
   ============================================================ */

const OFFICIAL = (page, notes) => ({
  bacPromptSource: "official",
  bacPromptPage: page,
  bacPromptVerifiedAt: "2026-09-21",
  bacPromptNotes: notes
});

const YEAR_2015_SE = {
  id: "2015",
  stream: "se",
  calendarYear: "2015",
  label: "بكالوريا الجزائر دورة 2015 — شعبة علوم تجريبية",
  theme: "indigo",
  enabled: true,
  sujets: [
    {
      id: 1,
      pdf: null,
      pdfExternalUrl:
        "https://www.dzexams.com/uploads/sujets/officiels/bac/2015/dzexams-bac-sciences-5906014.pdf",
      pdfLocalUrl: "/subjects/SE/2015/sujet-1.pdf",
      pdfNote:
        "PDF local pages 1-5 = doc pages 1-5. Barème officiel 07 06 07. Consignes officielles verbatim pages 1-5.",
      title: "الموضوع الأول",
      exercises: [
        {
          number: 1,
          ui: "text",
          label: "الإنزيم — الكربوكسي بيبتيداز",
          max: 7,
          desc: "بنية الموقع الفعال، pH وحرارة، النوعية الأنزيمية",
          poles: {
            N: {
              points: 1,
              prompt: "تأطير دور الأحماض في النوعية",
              bacPrompt:
                "هل كل الأحماض الأمينية الداخلة في تركيب الأنزيم تحدد تأثيره النوعي؟ علل إجابتك.",
              ...OFFICIAL(1, "س1 ت1 سؤال 1 صفحة 1"),
              placeholder: "ليست كل الأحماض...",
              minLength: 40,
              modelAnswer:
                "ليست كل الأحماض تحدد النوعية، فقط أحماض الموقع الفعال المرقمة هي التي تحدد التكامل مع مادة التفاعل.",
              rule: {
                prompt: "دور الأحماض الأمينية",
                keywords: ["موقع", "فعال", "نوعي"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2,
              prompt: "مقارنة الشكلين وتشكل المعقد",
              bacPrompt:
                "قارن بين الشكلين (أ) و (ب) من الوثيقة (1) من الوثيقة (1)، ثم وضح كيفية تشكل المعقد [أنزيم – مادة التفاعل]. ماذا تستنتج؟",
              ...OFFICIAL(1, "س1 ت1 سؤال 2 صفحة 1"),
              placeholder: "المقارنة...",
              minLength: 60,
              modelAnswer:
                "الشكل أ بدون ركيزة موقع مفتوح، ب مع ركيزة يحدث تغير بنيوي للموقع ليصبح متكامل، يتشكل معقد ES ثم يتحول.",
              rule: {
                prompt: "تشكل المعقد",
                keywords: ["معقد", "موقع", "تكامل"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 3,
              prompt: "تفسير pH وحرارة وتأثيرها",
              bacPrompt:
                "كيف تفسر النشاط الأنزيمي عند القيم التالية: أ- عند pH = 8 وعند القيم الأخرى للـ pH. ب- عند درجة حرارة 35م وعند القيم الأخرى لدرجة الحرارة.",
              ...OFFICIAL(2, "س1 ت1 سؤال 2 صفحة 2"),
              placeholder: "عند pH 8...",
              minLength: 80,
              modelAnswer:
                "عند pH 8 نشاط أعظمي لأن شحنة أحماض الموقع الفعال مناسبة، باقي pH يغير الشحنة فيفقد التكامل. عند 35° حرارة مثلى، 0 و60° توقف النشاط لتخريب البنية.",
              rule: {
                prompt: "تفسير pH وحرارة",
                keywords: ["pH", "حرارة", "موقع", "بنية"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1,
              prompt: "النوعية الأنزيمية",
              bacPrompt: "لخص مفهوم النوعية الأنزيمية.",
              ...OFFICIAL(2, "س1 ت1 سؤال III-2 صفحة 2"),
              placeholder: "النوعية...",
              minLength: 40,
              modelAnswer:
                "النوعية الأنزيمية هي تخصص الأنزيم لمادة تفاعل محددة ونوع تفاعل محدد بفضل بنية الموقع الفعال.",
              rule: {
                prompt: "مفهوم النوعية",
                keywords: ["نوعية", "مادة", "موقع"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 2,
          ui: "text",
          label: "النقل العصبي — المحور الأسطواني وتجميع المشابك",
          max: 6,
          desc: "قنوات Na/K، البروناز و TEA، تجميع كمونات",
          poles: {
            N: {
              points: 1,
              prompt: "إعادة رسم منحنى كمون العمل",
              bacPrompt:
                "أعد رسم المنحنى (أ) مبرزا على أجزائه عدد وحالة القنوات الغشائية المتأثرة بتغير الكمون الغشائي (انفتاح أو انغلاق).",
              ...OFFICIAL(3, "س1 ت2 سؤال I-1 صفحة 3"),
              placeholder: "المنحنى...",
              minLength: 40,
              modelAnswer:
                "المنحنى يمثل كمون عمل: راحة قنوات Na مغلقة K مفتوحة، زوال استقطاب Na مفتوحة، إعادة K مفتوحة.",
              rule: {
                prompt: "قنوات كمون العمل",
                keywords: ["Na", "K", "قناة"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 1.5,
              prompt: "استخراج معلومات المنحنيات ب ج د",
              bacPrompt:
                "ما هي المعلومات التي يمكن استخراجها من تحليلك للمنحنيات (ب، ج، د) في الوثيقة 1(ب)؟",
              ...OFFICIAL(3, "س1 ت2 سؤال I-2 صفحة 3"),
              placeholder: "نستنتج...",
              minLength: 50,
              modelAnswer:
                "نستنتج أن نقص Na يقلل سعة كمون العمل، البروناز يمنع انغلاق Na فيطيل زوال الاستقطاب، TEA يمنع انفتاح K فيطيل الكمون.",
              rule: {
                prompt: "معلومات ب ج د",
                keywords: ["Na", "K", "بروناز", "TEA"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 2.5,
              prompt: "تفسير تجميع المشابك",
              bacPrompt: "فسر التسجيلات المبينة في الوثيقة 2 (ب).",
              ...OFFICIAL(3, "س1 ت2 سؤال II-1 صفحة 3"),
              placeholder: "التسجيل 1...",
              minLength: 60,
              modelAnswer:
                "التسجيل 1 تنبيه A وحيد لا يبلغ العتبة، 2 تنبيهان A متقاربان تجميع زماني يبلغ العتبة، 3 A+B تجميع مكاني، 4 تثبيط C يلغي.",
              rule: {
                prompt: "تفسير تسجيلات التجميع",
                keywords: ["تجميع", "زماني", "مكاني", "عتبة"],
                minHits: 2,
                forbidden: []
              }
            },
            W: {
              points: 1,
              prompt: "أثر الحقن بالإستيراز",
              bacPrompt:
                "ارسم التسجيلات التي تتوقع الحصول عليها بإعادة نفس التنبيهات بعد حقن الأستيل كولين إستيراز في المشابك (1،2،3). (المشبكان 1 و3 يعملان بالأستيل كولين والمشبك 2 يعمل بالـ GABA)",
              ...OFFICIAL(3, "س1 ت2 سؤال III صفحة 3"),
              placeholder: "بعد حقن الإستيراز...",
              minLength: 50,
              modelAnswer:
                "بعد حقن الإستيراز يبقى الأستيل كولين في الشق فيطيل PPSE/PPSI، التسجيلات تصبح ممتدة وزائدة.",
              rule: {
                prompt: "أثر الإستيراز",
                keywords: ["إستيراز", "أستيل", "GABA"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 3,
          ui: "text",
          label: "التركيب الضوئي — تجربة هيل",
          max: 7,
          desc: "كيس تيلاكويد، أكسدة الماء، APG TP HP",
          poles: {
            N: {
              points: 1,
              prompt: "تحليل منحنى O2 وكاشف هيل",
              bacPrompt: "حلّل النتائج الممثلة في الوثيقة (1).",
              ...OFFICIAL(4, "س1 ت3 سؤال 1-أ صفحة 4"),
              placeholder: "المنحنى...",
              minLength: 40,
              modelAnswer:
                "المنحنى يوضح أن O2 لا ينطلق في الظلام ولا بدون كاشف هيل، وينطلق في الضوء الأبيض والأحمر مع كاشف.",
              rule: {
                prompt: "تحليل وثيقة 1",
                keywords: ["O2", "هيل", "ضوء"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2,
              prompt: "شروط المرحلة الكيموضوئية",
              bacPrompt:
                "استنتج الشروط التجريبية اللازمة لحدوث تفاعلات المرحلة الكيموضوئية في الكيس (التيلاكويد).",
              ...OFFICIAL(4, "س1 ت3 سؤال 1-ب صفحة 4"),
              placeholder: "الشروط...",
              minLength: 50,
              modelAnswer:
                "الشروط هي ضوء، ماء، يخضور، كاشف هيل مؤكسد كمستقبل إلكترونات، صانعات مفتوحة.",
              rule: {
                prompt: "شروط الكيموضوئية",
                keywords: ["ضوء", "ماء", "يخضور", "هيل"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 2.5,
              prompt: "أهمية التجربة ومصدر O2",
              bacPrompt:
                "ما أهمية هذه التجربة بخصوص إظهار ما يلي: أ- علاقة أكسدة الماء بتثبيت CO2. ب- مصدر الأكسجين المنطلق أثناء عملية التركيب الضوئي. ج- مراحل التركيب الضوئي.",
              ...OFFICIAL(4, "س1 ت3 سؤال 3 صفحة 4"),
              placeholder: "التجربة تظهر...",
              minLength: 80,
              modelAnswer:
                "التجربة تظهر أن أكسدة الماء مستقلة عن CO2، مصدر O2 هو الماء، وأن التركيب الضوئي مرحلتان كيموضوئية وكيموحيوية.",
              rule: {
                prompt: "أهمية تجربة هيل",
                keywords: ["ماء", "O2", "مرحلة", "CO2"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1.5,
              prompt: "معلومات APG TP HP والمرحلة الكيموحيوية",
              bacPrompt:
                "ما هي المعلومات الأساسية المستخرجة من نتائج الوثيقة (2)؟ ماذا تستخلص؟",
              ...OFFICIAL(5, "س1 ت3 سؤال III-1 صفحة 5"),
              placeholder: "APG يظهر أولا...",
              minLength: 60,
              modelAnswer:
                "APG أول مركب مشع يظهر ثم يتناقص، TP يظهر بعده، HP يظهر متأخرا، يدل على أن CO2 يثبت أولا في APG ثم يتحول.",
              rule: {
                prompt: "تحليل APG TP HP",
                keywords: ["APG", "TP", "HP", "CO2"],
                minHits: 3,
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
      pdfExternalUrl:
        "https://www.dzexams.com/uploads/sujets/officiels/bac/2015/dzexams-bac-sciences-5906014.pdf",
      pdfLocalUrl: "/subjects/SE/2015/sujet-2.pdf",
      pdfNote:
        "PDF local pages 1-5 = doc pages 6-10. Barème officiel 06 07 07. Consignes officielles verbatim pages 6-10.",
      title: "الموضوع الثاني",
      exercises: [
        {
          number: 1,
          ui: "text",
          label: "تركيب البروتين — من يتعرف على الرامزة؟",
          max: 6,
          desc: "Cys-ARNtCys إلى Ala-ARNtCys، ARNm اصطناعي UGUU",
          poles: {
            N: {
              points: 1,
              prompt: "المرحلة 1 من التجربة",
              bacPrompt: "ماذا تمثل المرحلة 1 من الوثيقة (1)؟ اشرح خطواتها.",
              ...OFFICIAL(6, "س2 ت1 سؤال 1 صفحة 6"),
              placeholder: "المرحلة 1...",
              minLength: 40,
              modelAnswer:
                "المرحلة 1 تمثل ارتباط الحمض الأميني Cys بـ ARNtCys بواسطة أنزيم Cys-ARNt سنتتاز مع استهلاك ATP.",
              rule: {
                prompt: "مرحلة ارتباط ARNt",
                keywords: ["ARNt", "Cys", "أنزيم"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 1.5,
              prompt: "من يتعرف على الرامزة؟",
              bacPrompt:
                "حدد العنصر الذي يتعرف على رامزات الـ ARNm، مستدلا على ذلك من معطيات الوثيقة (1).",
              ...OFFICIAL(6, "س2 ت1 سؤال 2 صفحة 6"),
              placeholder: "العنصر الذي يتعرف...",
              minLength: 50,
              modelAnswer:
                "العنصر هو ARNt، لأن Ala-ARNtCys ترجم UGU الخاصة بـ Cys فأنتج Ala، مما يدل أن الرامزة المضادة للـ ARNt هي التي تتعرف.",
              rule: {
                prompt: "التعرف على الرامزة",
                keywords: ["ARNt", "رامزة", "UGU", "Ala"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 2.5,
              prompt: "تسمية عناصر الشكلين وإثبات أن ع يحمل نفس معلومة ADN",
              bacPrompt:
                "يعتبر العنصر (ع) وسيطا ينقل الرسالة الوراثية. أثبت أن هذا الوسيط يحمل نفس المعلومة الموجودة في الـ ADN.",
              ...OFFICIAL(6, "س2 ت1 سؤال 4 صفحة 6"),
              placeholder: "العنصر ع هو ARNm...",
              minLength: 70,
              modelAnswer:
                "العنصر ع هو ARNm، تتابع قواعده مكمل لسلسلة ADN الناسخة ومماثل للسلسلة غير الناسخة مع استبدال U بـ T، فيحمل نفس المعلومة.",
              rule: {
                prompt: "ARNm يحمل معلومة ADN",
                keywords: ["ARNm", "ADN", "معلومة", "مكمل"],
                minHits: 2,
                forbidden: []
              }
            },
            W: {
              points: 1,
              prompt: "دور العناصر س ع ص ل",
              bacPrompt:
                "بناء على معلوماتك وما جاء في هذه الدراسة وضح دور كل من العناصر (س، ع، ص، ل) الممثلة في الوثيقة (2) في تركيب البروتين.",
              ...OFFICIAL(6, "س2 ت1 سؤال III صفحة 6"),
              placeholder: "س هو ADN...",
              minLength: 50,
              modelAnswer:
                "س هو ADN يحمل المعلومة، ع ARNm ينقلها، ص ريبوزوم يترجم، ل ARNt ينقل الأحماض.",
              rule: {
                prompt: "دور العناصر في الترجمة",
                keywords: ["ADN", "ARNm", "ريبوزوم", "ARNt"],
                minHits: 3,
                forbidden: []
              }
            }
          }
        },
        {
          number: 2,
          ui: "text",
          label: "التنفس و التخمر عند الخميرة",
          max: 7,
          desc: "منحنيات O2 CO2 وزن جاف، ميتوكوندري",
          poles: {
            N: {
              points: 1,
              prompt: "تحليل الشكل أ وتسمية الظاهرة",
              bacPrompt: "حلّل نتائج الشكل (أ) من الوثيقة (1). ماذا تستنتج؟",
              ...OFFICIAL(7, "س2 ت2 سؤال 1 صفحة 7"),
              placeholder: "المنحنيات...",
              minLength: 50,
              modelAnswer:
                "O2 يتناقص وCO2 والوزن الجاف يتزايدان، مما يدل على نمو الخميرة واستهلاك O2 في التنفس.",
              rule: {
                prompt: "تحليل منحنيات الخميرة",
                keywords: ["O2", "CO2", "خميرة", "وزن"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 1.5,
              prompt: "المعادلة الإجمالية",
              bacPrompt: "سم الظاهرة التي تمت خلال هذه الدراسة. اكتب معادلتها الإجمالية.",
              ...OFFICIAL(7, "س2 ت2 سؤال 2 صفحة 7"),
              placeholder: "الظاهرة هي التنفس...",
              minLength: 40,
              modelAnswer:
                "الظاهرة هي التنفس: C6H12O6 + 6O2 → 6CO2 + 6H2O + طاقة.",
              rule: {
                prompt: "معادلة التنفس",
                keywords: ["تنفس", "غلوكوز", "O2", "CO2"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 3,
              prompt: "علاقة بنية الخميرة بالظاهرة وتغير بعد 400s",
              bacPrompt:
                "وضح علاقة: مميزات بنية خلية خميرة الشكل (ب) من الوثيقة (1) بالظاهرة المدروسة. هل تحافظ خلية الخميرة على نفس المميزات البنيوية بعد الزمن (400 ثانية (s))؟ علل.",
              ...OFFICIAL(7, "س2 ت2 سؤال 3 صفحة 7"),
              placeholder: "الشكل ب يظهر...",
              minLength: 70,
              modelAnswer:
                "الشكل ب يظهر ميتوكوندريات كثيرة وغشاء ونواة، مما يسمح بالتنفس. بعد 400s ينفد O2 فتتحول إلى تخمر بلا ميتوكوندريات نشطة.",
              rule: {
                prompt: "بنية الخميرة والتنفس",
                keywords: ["ميتوكوندري", "تنفس", "خميرة", "O2"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1.5,
              prompt: "مراحل الوثيقة 2 والمعادلات",
              bacPrompt:
                "سم المراحل المرقمة في الوثيقة (2)، ثم اكتب المعادلة الإجمالية لكل مرحلة.",
              ...OFFICIAL(8, "س2 ت2 سؤال II-1 صفحة 8"),
              placeholder: "المرحلة 1 انحلال سكر...",
              minLength: 60,
              modelAnswer:
                "1 انحلال سكر في الهيولى، 2 حلقة كريبس، 3 سلسلة تنفسية وأكسدة فوسفورية في الغشاء الداخلي للميتوكوندري.",
              rule: {
                prompt: "مراحل التنفس",
                keywords: ["انحلال", "كريبس", "ميتوكوندري", "تنفسية"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 3,
          ui: "text",
          label: "المناعة الخلطية — مصدر الأجسام المضادة",
          max: 7,
          desc: "تجربة جيلاتين، فأر سالمونيلا، بلعميات ولمفاويات",
          poles: {
            N: {
              points: 1,
              prompt: "صحة معلومات الوثيقة 1",
              bacPrompt:
                "انطلاقا من معطيات ونتائج الوثيقة (1) حدد مدى صحة أو خطأ المعلومات التالية مع التعليل: 1- الخلايا التي أفرزت الأجسام المضادة (ضد مولد الضد (س)) موجودة في طحال الفأر.",
              ...OFFICIAL(9, "س2 ت3 سؤال I صفحة 9"),
              placeholder: "المعلومة صحيحة...",
              minLength: 50,
              modelAnswer:
                "المعلومة صحيحة، لأن الخلايا المثبتة على الجيلاتين+س أفرزت أجساما مضادة، وهي مستخلصة من الطحال.",
              rule: {
                prompt: "صحة معلومات المناعة",
                keywords: ["طحال", "جسم", "مضاد", "جيلاتين"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2,
              prompt: "تحليل الوثيقة 2أ ونوع الجزيئات المعطلة للحركة",
              bacPrompt:
                "استدل من نتائج الوثيقتين 2 (أ) و 2 (ب) عن نوع الجزيئات التي عطلت حركة بكتيريا السالمونيل.",
              ...OFFICIAL(10, "س2 ت3 سؤال II-2 صفحة 10"),
              placeholder: "الجزيئات هي أجسام مضادة...",
              minLength: 50,
              modelAnswer:
                "الجزيئات هي أجسام مضادة ضد السالمونيل، لأن المنحنى أ يظهر ارتفاع أجسام بعد 1-2 أسبوع وتثبيط الحركة في ب يتوافق مع وجود لمفاويات B.",
              rule: {
                prompt: "نوع الجزيئات",
                keywords: ["جسم", "مضاد", "سالمونيل", "حركة"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 2.5,
              prompt: "التعرف على الخليتين والمضادين ص وع",
              bacPrompt:
                "اعتمادا على الوثيقة 2 (ج) بين أن مميزات التعاضي الخلوي تمكنك من التعرف على الخليتين (أ) و(ب) من جهة وتسمح لك بتحديد الصنفين من الأجسام المضادة (ص) و (ع) من جهة أخرى.",
              ...OFFICIAL(10, "س2 ت3 سؤال II-4-أ صفحة 10"),
              placeholder: "الخلية أ بلازمية...",
              minLength: 70,
              modelAnswer:
                "الخلية أ بلازمية بها شبكة هيولية فعالة لإنتاج الأجسام، ب لمفاوية B، ص IgM كبير، ع IgG صغير.",
              rule: {
                prompt: "التعرف على الخلايا والأجسام",
                keywords: ["بلازمية", "IgM", "IgG", "شبكة"],
                minHits: 2,
                forbidden: []
              }
            },
            W: {
              points: 1.5,
              prompt: "نص علمي تدخل الجسمين ص وع",
              bacPrompt:
                "من المعارف المكتسبة سابقا وضح في نص علمي مختصر كيف يتدخل كل من الجسم المضاد (ص) والجسم المضاد (ع) المشار إليهما في الوثيقة 2 (ج) في الاستجابة المناعية النوعية الخلطية.",
              ...OFFICIAL(10, "س2 ت3 سؤال III صفحة 10"),
              placeholder: "IgM يتدخل أولا...",
              minLength: 60,
              modelAnswer:
                "IgM يتدخل أولا في الاستجابة الأولية بتراص وتثبيط، IgG يتدخل ثانيا بفعالية أكبر وعمر أطول وعبور المشيمة.",
              rule: {
                prompt: "تدخل IgM IgG",
                keywords: ["IgM", "IgG", "خلطية", "مناعة"],
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

export { YEAR_2015_SE };
export default YEAR_2015_SE;
