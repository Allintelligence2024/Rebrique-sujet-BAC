/* ============================================================
   BAC SVT Algérie 2019 — Sciences expérimentales
   ------------------------------------------------------------
   Barème officiel vérifié sur PDF dzexams :
   Sujet 1 : 05 / 07 / 08 = 20 (p1, p1, p3)
   Sujet 2 : 05 / 07 / 08 = 20 (p6, p6, p8)
   Consignes transcrites verbatim depuis
   /subjects/SE/2019/sujet-1.pdf (5 pages) et
   /subjects/SE/2019/sujet-2.pdf (4 pages, doc 6-9).
   ============================================================ */

const OFFICIAL = (page, notes) => ({
  bacPromptSource: "official",
  bacPromptPage: page,
  bacPromptVerifiedAt: "2026-09-21",
  bacPromptNotes: notes
});

const YEAR_2019_SE = {
  id: "2019",
  stream: "se",
  calendarYear: "2019",
  label: "بكالوريا الجزائر دورة 2019 — شعبة علوم تجريبية",
  theme: "teal",
  enabled: true,
  sujets: [
    {
      id: 1,
      pdf: null,
      pdfExternalUrl:
        "https://www.dzexams.com/uploads/sujets/officiels/bac/2019/dzexams-bac-sciences-3051478.pdf",
      pdfLocalUrl: "/subjects/SE/2019/sujet-1.pdf",
      pdfNote:
        "PDF local pages 1-5 = doc pages 1-5. Barème officiel 05 07 08. Consignes officielles verbatim pages 1-5.",
      title: "الموضوع الأول",
      exercises: [
        {
          number: 1,
          ui: "text",
          label: "التكتونية — الظهرة وسط محيطية",
          max: 5,
          desc: "بيريدوتيت 1300°C، بيانات 1-8، نص علمي عن التباعد",
          poles: {
            N: {
              points: 1,
              prompt: "تأطير التباعد والمغمانية",
              bacPrompt: "ما المشكل العلمي المطروح حول تجديد القشرة المحيطية على مستوى الظهرات؟",
              ...OFFICIAL(1, "س1 ت1 تأطير صفحة 1"),
              placeholder: "المشكل...",
              minLength: 30,
              modelAnswer:
                "المشكل هو كيف يؤدي انصهار بيريدوتيت المعطف في ظروف حرارة وضغط محددة إلى تشكل قشرة محيطية جديدة على مستوى الظهرة.",
              rule: {
                prompt: "مشكل الظهرة",
                keywords: ["ظهرة", "بيريدوتيت", "قشرة"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 1,
              prompt: "تعرف على البيانات 1-8",
              bacPrompt: "تعرف على البيانات المرقمة من 1 إلى 8.",
              ...OFFICIAL(1, "س1 ت1 سؤال 1 صفحة 1"),
              placeholder: "البيانات...",
              minLength: 40,
              modelAnswer:
                "1 قشرة محيطية، 2 موهو، 3 معطف، 4 صهارة، 5 بيريدوتيت، 6 ظهرة، 7 لافا، 8 تباعد الصفائح.",
              rule: {
                prompt: "بيانات الظهرة",
                keywords: ["قشرة", "معطف", "ظهرة"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 2,
              prompt: "نص علمي عن التباعد",
              bacPrompt:
                "قدم في نص علمي الأدلة التي تبين أن مناطق التباعد مرتبطة بمغمانية نشطة مستغلا معطيات الوثيقة ومعلوماتك.",
              ...OFFICIAL(1, "س1 ت1 سؤال 2 صفحة 1"),
              placeholder: "النص العلمي...",
              minLength: 80,
              modelAnswer:
                "النص يوضح أن تباعد الصفائح يخفض الضغط فينصهر بيريدوتيت عند 1300° فيعطي لافا تشكل قشرة جديدة، دليل على مغمانية نشطة.",
              rule: {
                prompt: "نص علمي تباعد",
                keywords: ["تباعد", "انصهار", "لافا", "قشرة"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1,
              prompt: "الخلاصة",
              bacPrompt: "ما علاقة انصهار البيريدوتيت بتجديد القشرة المحيطية؟",
              ...OFFICIAL(1, "س1 ت1 خلاصة صفحة 1"),
              placeholder: "العلاقة...",
              minLength: 30,
              modelAnswer:
                "انصهار بيريدوتيت ينتج صهارة تصعد على مستوى الظهرة وتشكل قشرة محيطية جديدة.",
              rule: {
                prompt: "خلاصة الظهرة",
                keywords: ["انصهار", "قشرة", "ظهرة"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 2,
          ui: "text",
          label: "الأنزيم — غلوكوز أكسيداز Aspergillus vs Penicillium",
          max: 7,
          desc: "خصائص بنيوية 581 حمض، α وβ، موقع فعال، طفرات",
          poles: {
            N: {
              points: 1,
              prompt: "الخطوات العملية",
              bacPrompt:
                "استخرج الخطوات العملية المتبعة التي تسمح بحل المشكلة المطروحة انطلاقا من معطيات الوثيقة (1).",
              ...OFFICIAL(2, "س1 ت2 سؤال 1 صفحة 2"),
              placeholder: "الخطوات...",
              minLength: 40,
              modelAnswer:
                "الخطوات: مقارنة عدد الأحماض وعدد البنيات الثانوية والجسور والموقع الفعال بين الفطرين بواسطة رستوب وأناجين.",
              rule: {
                prompt: "خطوات دراسة GO",
                keywords: ["رستوب", "أناجين", "موقع"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 1.5,
              prompt: "مقارنة الخصائص البنيوية",
              bacPrompt: "قارن بين الخصائص البنيوية لأنزيم عند الفطرين.",
              ...OFFICIAL(2, "س1 ت2 سؤال 2 صفحة 2"),
              placeholder: "المقارنة...",
              minLength: 60,
              modelAnswer:
                "كلا الأنزيمين 581 حمض، 26 α و1 β، بدون جسر ثنائي الكبريت، اختلاف طفيف في أحماض الموقع الفعال.",
              rule: {
                prompt: "مقارنة GO",
                keywords: ["581", "α", "موقع"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 3,
              prompt: "تفسير نتائج الطفرات والموقع الفعال",
              bacPrompt:
                "فسر النتائج التجريبية المحصل عليها باستغلالك لمعطيات الوثيقة (2) ومن معلوماتك.",
              ...OFFICIAL(3, "س1 ت2 سؤال II-1 صفحة 3"),
              placeholder: "الطفرات...",
              minLength: 80,
              modelAnswer:
                "الطفرات في الموقع الفعال تغير الشكل الفراغي فتنقص Vmax، بينما الطفرات خارج الموقع لا تؤثر كثيرا، مما يؤكد أن الوظيفة مرتبطة ببنية الموقع.",
              rule: {
                prompt: "تفسير طفرات الموقع الفعال",
                keywords: ["طفرة", "موقع", "Vmax", "بنية"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1.5,
              prompt: "إجابة ملخصة للمشكلة",
              bacPrompt:
                "قدم إجابة ملخصة للمشكلة العلمية المطروحة في بداية التمرين انطلاقا مما توصلت إليه في هذه الدراسة.",
              ...OFFICIAL(3, "س1 ت2 سؤال II-2 صفحة 3"),
              placeholder: "الخلاصة...",
              minLength: 50,
              modelAnswer:
                "الخلاصة أن اختلاف البنية قد لا يغير الوظيفة إذا كان بعيدا عن الموقع الفعال، لكن تغير الموقع يغير الوظيفة حتما.",
              rule: {
                prompt: "خلاصة علاقة بنية-وظيفة",
                keywords: ["بنية", "وظيفة", "موقع"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 3,
          ui: "text",
          label: "المناعة — إفلات الخلايا السرطانية",
          max: 8,
          desc: "PD-1/PD-L1، LTc، تجارب فئران",
          poles: {
            N: {
              points: 0.5,
              prompt: "فرضية الإفلات",
              bacPrompt: "اقترح فرضية تفسر إفلات الخلايا السرطانية من الجهاز المناعي.",
              ...OFFICIAL(3, "س1 ت3 سؤال N صفحة 3"),
              placeholder: "الفرضية...",
              minLength: 30,
              modelAnswer:
                "الفرضية أن الخلايا السرطانية تعبر عن PD-L1 يرتبط بـ PD-1 على LTc فيثبطه.",
              rule: {
                prompt: "فرضية إفلات سرطاني",
                keywords: ["PD", "LTc", "إفلات"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2,
              prompt: "تحليل تجارب الفئران",
              bacPrompt: "حلل النتائج التجريبية للوثيقة 1 حول تطور الورم عند الفئران.",
              ...OFFICIAL(4, "س1 ت3 سؤال S صفحة 4"),
              placeholder: "نلاحظ...",
              minLength: 60,
              modelAnswer:
                "نلاحظ نمو ورم في الفئران العادية بينما الفئران المحقونة بأجسام مضادة ضد PD-L1 يتقلص الورم مما يدل على استعادة نشاط LTc.",
              rule: {
                prompt: "تحليل نمو الورم",
                keywords: ["ورم", "PD", "LTc"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 4,
              prompt: "تفسير آلية الإفلات",
              bacPrompt: "فسر آلية إفلات الخلايا السرطانية من الجهاز المناعي باستغلال الوثيقة 2.",
              ...OFFICIAL(4, "س1 ت3 سؤال E صفحة 4"),
              placeholder: "الآلية...",
              minLength: 90,
              modelAnswer:
                "الآلية أن PD-L1 على الخلية السرطانية يرتبط بـ PD-1 على LTc فيعطل إفراز البيرفورين والغرانزيم فيفشل القتل.",
              rule: {
                prompt: "آلية PD-1 PD-L1",
                keywords: ["PD-L1", "PD-1", "بيرفورين", "LTc"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1.5,
              prompt: "مقترح علاجي",
              bacPrompt: "اقترح استراتيجية علاجية مبنية على هذه الدراسة.",
              ...OFFICIAL(5, "س1 ت3 سؤال W صفحة 5"),
              placeholder: "المقترح...",
              minLength: 40,
              modelAnswer:
                "المقترح استعمال أجسام مضادة مضادة لـ PD-L1 أو PD-1 لتحرير LTc من التثبيط.",
              rule: {
                prompt: "علاج مناعي",
                keywords: ["جسم", "مضاد", "PD"],
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
      pdfExternalUrl:
        "https://www.dzexams.com/uploads/sujets/officiels/bac/2019/dzexams-bac-sciences-3051478.pdf",
      pdfLocalUrl: "/subjects/SE/2019/sujet-2.pdf",
      pdfNote:
        "PDF local pages 1-4 = doc pages 6-9. Barème officiel 05 07 08. Consignes officielles verbatim pages 6-9.",
      title: "الموضوع الثاني",
      exercises: [
        {
          number: 1,
          ui: "text",
          label: "التكتونية — الأنديز بركان انفجاري",
          max: 5,
          desc: "غوص، صهارة أنديزية، عناصر مرقمة",
          poles: {
            N: {
              points: 1,
              prompt: "تسمية العناصر والنشاط",
              bacPrompt: "سم العناصر المرقمة وتعرف على هذا النشاط التكتوني.",
              ...OFFICIAL(6, "س2 ت1 سؤال 1 صفحة 6"),
              placeholder: "النشاط...",
              minLength: 40,
              modelAnswer:
                "النشاط غوص محيطية تحت قارية، العناصر: صفيحة محيطية غائصة، موشور تراكم، بركان انفجاري.",
              rule: {
                prompt: "نشاط الأنديز",
                keywords: ["غوص", "بركان", "صفيحة"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 1,
              prompt: "رسم تخطيطي للغوص",
              bacPrompt: "ارسم مخططا يوضح ظاهرة الغوص على مستوى الأنديز.",
              ...OFFICIAL(6, "س2 ت1 سؤال رسم صفحة 6"),
              placeholder: "الرسم...",
              minLength: 30,
              modelAnswer:
                "الرسم يوضح صفيحة نازكا تغوص تحت أمريكا الجنوبية مع صهارة أنديزية.",
              rule: {
                prompt: "رسم الغوص",
                keywords: ["غوص", "صفيحة", "صهارة"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 2,
              prompt: "نص علمي عن تشكل البركان الانفجاري",
              bacPrompt:
                "اشرح في نص علمي كيف تشكل البركان الانفجاري معتمدا على معطيات الوثيقة ومكتسباتك.",
              ...OFFICIAL(6, "س2 ت1 سؤال 2 صفحة 6"),
              placeholder: "النص...",
              minLength: 80,
              modelAnswer:
                "النص يشرح انصهار محيطية غائصة مع قشرة قارية ينتج صهارة لزجة غنية بغازات تنفجر مكونة بركان انفجاري.",
              rule: {
                prompt: "تشكل بركان انفجاري",
                keywords: ["غوص", "صهارة", "انفجاري", "غاز"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1,
              prompt: "الخلاصة",
              bacPrompt: "ما الفرق بين بركان الظهرة وبركان الغوص؟",
              ...OFFICIAL(6, "س2 ت1 خلاصة صفحة 6"),
              placeholder: "الفرق...",
              minLength: 30,
              modelAnswer:
                "بركان الظهرة طفحي سائل، بركان الغوص انفجاري لزج بسبب صهارة أنديزية.",
              rule: {
                prompt: "فرق براكين",
                keywords: ["طفحي", "انفجاري", "صهارة"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 2,
          ui: "text",
          label: "DDT — قنوات Na+ و K+ الفولطية",
          max: 7,
          desc: "كمون غشائي، فرضيات، تيارات أيونية",
          poles: {
            N: {
              points: 1,
              prompt: "تمثيل بياني",
              bacPrompt: "مثل بيانيا ثم حلل النتائج الموضحة في الوثيقة (1).",
              ...OFFICIAL(7, "س2 ت2 سؤال 1 صفحة 7"),
              placeholder: "المنحنى...",
              minLength: 40,
              modelAnswer:
                "المنحنى يوضح أن DDT يطيل زمن كمون العمل بمنع انغلاق قنوات Na.",
              rule: {
                prompt: "تمثيل DDT",
                keywords: ["DDT", "Na", "كمون"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 1.5,
              prompt: "فرضيتين لتأثير DDT",
              bacPrompt: "اقترح فرضيتين لتفسير آلية تأثير مادة الـ على الكمون الغشائي.",
              ...OFFICIAL(7, "س2 ت2 سؤال 2 صفحة 7"),
              placeholder: "الفرضية 1...",
              minLength: 40,
              modelAnswer:
                "فرضية 1 DDT يمنع انغلاق Na، فرضية 2 DDT يمنع انفتاح K.",
              rule: {
                prompt: "فرضيات DDT",
                keywords: ["Na", "K", "فرضية"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 3,
              prompt: "تحليل تيارات أيونية",
              bacPrompt:
                "فسر باستغلال معطيات شكلي الوثيقة (2) تأثير الكمون المفروض على القنوات الفولطية في غياب مادة الـ.",
              ...OFFICIAL(7, "س2 ت2 سؤال II-2 صفحة 7"),
              placeholder: "في غياب DDT...",
              minLength: 80,
              modelAnswer:
                "في غياب DDT قناة Na تنفتح بسرعة ثم تغلق، قناة K تنفتح متأخرة، في وجود DDT قناة Na تبقى مفتوحة فيستمر تيار Na داخل.",
              rule: {
                prompt: "تيارات Na K مع DDT",
                keywords: ["Na", "K", "تيار", "DDT"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1.5,
              prompt: "نقاش الفرضيات وآلية DDT",
              bacPrompt:
                "ناقش صحة إحدى الفرضيتين المقترحتين انطلاقا من النتائج السابقة، مبينا آلية تأثير مادة الـ على النشاط العصبي.",
              ...OFFICIAL(7, "س2 ت2 سؤال II-3 صفحة 7"),
              placeholder: "الفرضية الصحيحة...",
              minLength: 60,
              modelAnswer:
                "الفرضية الصحيحة أن DDT يمنع انغلاق قناة Na فيطيل زوال الاستقطاب فيسبب فرط تنبيه عصبي.",
              rule: {
                prompt: "آلية DDT",
                keywords: ["Na", "انغلاق", "تنبيه"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 3,
          ui: "text",
          label: "المضاد الحيوي وتثبيط تركيب البروتين",
          max: 8,
          desc: "نسبة تركيب بروتين، ريبوزوم، بوليميراز",
          poles: {
            N: {
              points: 0.5,
              prompt: "تحليل نسبة التركيب",
              bacPrompt: "حلل النتائج الممثلة في الشكل (أ) من الوثيقة (1).",
              ...OFFICIAL(8, "س2 ت3 سؤال 1 صفحة 8"),
              placeholder: "نلاحظ...",
              minLength: 30,
              modelAnswer:
                "نلاحظ نقص نسبة تركيب البروتين مع زيادة تركيز المضاد الحيوي بشكل جرعي.",
              rule: {
                prompt: "تحليل تثبيط البروتين",
                keywords: ["بروتين", "تركيز", "مضاد"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2,
              prompt: "ثلاث فرضيات لمستوى التأثير",
              bacPrompt:
                "اقترح باستغلال معطيات الشكل (ب) من الوثيقة (1) ثلاث فرضيات تحدد من خلالها مستوى تأثير المضاد الحيوي على تركيب البروتين.",
              ...OFFICIAL(8, "س2 ت3 سؤال 2 صفحة 8"),
              placeholder: "الفرضيات...",
              minLength: 60,
              modelAnswer:
                "فرضية 1 يثبط النسخ، 2 يثبط الترجمة على الريبوزوم، 3 يثبط شحن ARNt.",
              rule: {
                prompt: "فرضيات مستوى التثبيط",
                keywords: ["نسخ", "ترجمة", "ريبوزوم"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 4,
              prompt: "تأكيد مستوى التأثير بالبوليميراز",
              bacPrompt:
                "فسر نتائج الشكل (ب) من الوثيقة (2) حول نشاط بوليميراز في وجود المضاد الحيوي.",
              ...OFFICIAL(9, "س2 ت3 سؤال II صفحة 9"),
              placeholder: "نشاط البوليميراز...",
              minLength: 80,
              modelAnswer:
                "نشاط بوليميراز لا يتغير مع المضاد، مما ينفي فرضية النسخ، يبقى التثبيط على مستوى الترجمة في الريبوزوم.",
              rule: {
                prompt: "تأكيد الترجمة",
                keywords: ["بوليميراز", "نسخ", "ترجمة"],
                minHits: 2,
                forbidden: []
              }
            },
            W: {
              points: 1.5,
              prompt: "الخلاصة واستعمال كأدوية",
              bacPrompt: "لماذا تستعمل هذه المضادات كأدوية للقضاء على البكتيريا دون الإضرار بخلايا الإنسان؟",
              ...OFFICIAL(9, "س2 ت3 سؤال W صفحة 9"),
              placeholder: "لأن...",
              minLength: 40,
              modelAnswer:
                "لأن ريبوزوم البكتيريا 70S يختلف عن ريبوزوم الإنسان 80S فيتثبط انتقائيا.",
              rule: {
                prompt: "انتقائية المضاد",
                keywords: ["ريبوزوم", "70S", "80S"],
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

export { YEAR_2019_SE };
export default YEAR_2019_SE;
