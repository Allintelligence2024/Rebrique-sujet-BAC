/* ============================================================
   BAC SVT Algérie 2013 — Sciences expérimentales
   ------------------------------------------------------------
   Barème officiel vérifié sur PDF dzexams :
   Sujet 1 : 08 / 08 / 04 = 20
   Sujet 2 : 08 / 06 / 06 = 20
   Consignes transcrites verbatim depuis
   /subjects/SE/2013/sujet-1.pdf (pages doc 1-4) et
   /subjects/SE/2013/sujet-2.pdf (pages doc 5-8).
   ============================================================ */

const OFFICIAL = (page, notes) => ({
  bacPromptSource: "official",
  bacPromptPage: page,
  bacPromptVerifiedAt: "2026-09-21",
  bacPromptNotes: notes
});

const YEAR_2013_SE = {
  id: "2013",
  stream: "se",
  calendarYear: "2013",
  label: "بكالوريا الجزائر دورة 2013 — شعبة علوم تجريبية",
  theme: "emerald",
  enabled: true,
  sujets: [
    {
      id: 1,
      pdf: null,
      pdfExternalUrl:
        "https://www.dzexams.com/uploads/sujets/officiels/bac/2013/dzexams-bac-sciences-4463279.pdf",
      pdfLocalUrl: "/subjects/SE/2013/sujet-1.pdf",
      pdfNote:
        "PDF local pages 1-4 = document officiel pages 1-4. Barème vérifié 08 08 04. Consignes officielles transcrites verbatim pages 1-4.",
      title: "الموضوع الأول",
      exercises: [
        {
          number: 1,
          ui: "text",
          label: "بناء البروتين — الأسيتابولاريا",
          max: 8,
          desc: "من المورثة إلى البروتين الوظيفي، معايرة ARN والبروتينات، الطاقة",
          poles: {
            N: {
              points: 1,
              prompt: "تأطير الإشكالية حول بناء البروتين",
              bacPrompt: "ما هي المشكلة العلمية التي يراد معالجتها بواسطة التجربة الممثلة بالوثيقة (1)؟",
              ...OFFICIAL(1, "س1 ت1 سؤال 1-ب صفحة 1"),
              placeholder: "صياغة المشكل العلمي...",
              minLength: 30,
              modelAnswer:
                "المشكل العلمي هو تحديد كيف تشرف المورثة على بناء البروتين وما علاقة النواة والـ ARN بكمية البروتين المصنع.",
              rule: {
                prompt: "تأطير الإشكالية",
                keywords: ["مورثة", "بروتين", "مشكل"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2,
              prompt: "استغلال وثيقة تجربة الأسيتابولاريا",
              bacPrompt: "حلّل التجربة ونتائجها.",
              ...OFFICIAL(1, "س1 ت1 سؤال 1-أ صفحة 1"),
              placeholder: "نلاحظ في الوثيقة 1...",
              minLength: 50,
              modelAnswer:
                "نلاحظ في الوثيقة 1 أن الجزء الحاوي على النواة ينمو ويتجدد القبعة بينما الجزء بدون نواة لا يتجدد، مما يدل على دور النواة في الإشراف على البناء.",
              rule: {
                prompt: "استغلال الوثيقة 1",
                keywords: ["نلاحظ", "نواة", "تجربة"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 3,
              prompt: "تفسير معايرة البروتين و ARN والطاقة",
              bacPrompt:
                "ما هي العلاقة التي توجد بين الظاهرتين الملاحظتين في التسجيلين (س) و(ع) وبنية الجزء (ج1)؟ وماذا تستنتج؟",
              ...OFFICIAL(2, "س1 ت1 سؤال 2-ب صفحة 2"),
              placeholder: "العلاقة هي...",
              minLength: 80,
              modelAnswer:
                "العلاقة أن كمية البروتين وكمية الـ ARN ترتفعان في الجزء الحاوي على النواة وتنخفضان في الجزء بدون نواة، مما يدل على أن النواة مصدر الـ ARN الضروري لتركيب البروتين وأن الطاقة تستهلك على شكل ATP خلال الترجمة.",
              rule: {
                prompt: "تفسير العلاقة ARN بروتين نواة",
                keywords: ["ARN", "بروتين", "نواة", "طاقة"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 2,
              prompt: "الخاتمة التركيبية لدور البروتينات",
              bacPrompt: "بيّن كيف تتدخل البروتينات في تحقيق النتائج الممثلة في الوثيقة (1).",
              ...OFFICIAL(2, "س1 ت1 سؤال 5 صفحة 2"),
              placeholder: "في الختام...",
              minLength: 40,
              modelAnswer:
                "في الختام البروتينات تتدخل كبنية ووظيفة حيث القبعة تحدد الشكل والنواة تشرف عبر الـ ARN على تركيبها باستهلاك ATP.",
              rule: {
                prompt: "خاتمة دور البروتينات",
                keywords: ["بروتين", "ختام", "ARN"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 2,
          ui: "text",
          label: "المناعة — الدفتيريا والأجسام المضادة",
          max: 8,
          desc: "تجارب الدفتيريا، نوع الاستجابة، بنية الجسم المضاد",
          poles: {
            N: {
              points: 1,
              prompt: "تأطير نوع الاستجابة المناعية",
              bacPrompt: "ماذا تستنتج فيما يخص نوع الاستجابة المناعية؟ علّل إجابتك.",
              ...OFFICIAL(3, "س1 ت2 سؤال I-3 صفحة 3"),
              placeholder: "نوع الاستجابة...",
              minLength: 40,
              modelAnswer:
                "نستنتج أنها استجابة مناعية خلطية نوعية بوساطة الأجسام المضادة لأن المصل المحتوي على مضادات التوكسين يحمي الحيوانات.",
              rule: {
                prompt: "نوع الاستجابة",
                keywords: ["مناعية", "خلطية", "أجسام"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2,
              prompt: "تحليل نتائج تجارب الدفتيريا",
              bacPrompt: "حلّل هذه النتائج التجريبية.",
              ...OFFICIAL(3, "س1 ت2 سؤال I-1 صفحة 3"),
              placeholder: "نلاحظ موت الحيوانات...",
              minLength: 60,
              modelAnswer:
                "نلاحظ موت الحيوانات 1 و5 غير المحصنة وبقاء 3 و4 المحقونة بمصل يحتوي مضادات التوكسين، مما يدل على دور المصل في الحماية.",
              rule: {
                prompt: "تحليل نتائج الدفتيريا",
                keywords: ["موت", "بقاء", "مصل", "نلاحظ"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 3,
              prompt: "تفسير بنية ووظيفة الجسم المضاد",
              bacPrompt: "بيّن كيف يساهم كل من العنصر(2) والعنصر(3) في تحديد الخواص الوظيفية لهذه الجزيئة.",
              ...OFFICIAL(3, "س1 ت2 سؤال II-3 صفحة 3"),
              placeholder: "العنصر 2 هو...",
              minLength: 80,
              modelAnswer:
                "العنصر 2 هو المنطقة المتغيرة التي تحدد التخصص بالتعرف على مولد الضد، والعنصر 3 هو المنطقة الثابتة التي تحدد الوظيفة بالارتباط بالبالعات وتثبيت المتمم.",
              rule: {
                prompt: "دور المنطقة المتغيرة والثابتة",
                keywords: ["متغيرة", "ثابتة", "مولد", "بالعات"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 2,
              prompt: "رسم تخطيطي لآلية الجسم المضاد",
              bacPrompt:
                "مثّل برسومات تخطيطية طريقة تدخل هذه الجزيئة في تثبيت مولد الضد والتثبت على الخلايا البالعة.",
              ...OFFICIAL(3, "س1 ت2 سؤال II-4 صفحة 3"),
              placeholder: "رسم: جسم مضاد يثبت مولد الضد...",
              minLength: 50,
              modelAnswer:
                "الرسم يوضح جسم مضاد على شكل Y يثبت مولد الضد بمنطقته المتغيرة ويرتبط بالبالعة بمنطقته الثابتة لتسهيل البلعمة.",
              rule: {
                prompt: "رسم آلية الجسم المضاد",
                keywords: ["رسم", "مضاد", "مولد", "بالعة"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 3,
          ui: "text",
          label: "النقل المشبكي — GABA والاستيل كولين",
          max: 4,
          desc: "فعالية التنبيه، تجميع كمونات، تأثير GABA",
          poles: {
            N: {
              points: 1,
              prompt: "فعالية التنبيهات",
              bacPrompt: "هل التنبيهات (ت1) و(ت2) تنبيهات فعالة؟ ولماذا؟",
              ...OFFICIAL(4, "س1 ت3 سؤال I-1 صفحة 4"),
              placeholder: "التنبيهات فعالة لأن...",
              minLength: 30,
              modelAnswer:
                "التنبيهات فعالة لأنها تولد كمون عمل ينتقل وتسجل تغيرات استقطاب في النقاط بعد المشبكية.",
              rule: {
                prompt: "فعالية التنبيه",
                keywords: ["فعالة", "كمون", "استقطاب"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 1,
              prompt: "تفسير تغيرات الاستقطاب",
              bacPrompt: "فسّر تغيرات الاستقطاب عند (م3) في التجربة 1، ثمّ في التجربة 2.",
              ...OFFICIAL(4, "س1 ت3 سؤال I-2 صفحة 4"),
              placeholder: "في التجربة 1 نلاحظ...",
              minLength: 50,
              modelAnswer:
                "في التجربة 1 نسجل PPSE بسيط عند م3 وفي التجربة 2 نسجل PPSI بسبب طبيعة المبلغ الكيميائي المفرز.",
              rule: {
                prompt: "تفسير PPSE و PPSI",
                keywords: ["PPSE", "PPSI", "استقطاب"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 1,
              prompt: "تجميع التنبيهات وتوقع التسجيل",
              bacPrompt: "كيف يكون التسجيل عند (م5) عند إحداث التنبيه (ت1) و(ت2) في نفس الوقت؟",
              ...OFFICIAL(4, "س1 ت3 سؤال I-4 صفحة 4"),
              placeholder: "التجميع...",
              minLength: 50,
              modelAnswer:
                "يحدث تجميع للكمونين PPSE و PPSI في م5 فيلغي أحدهما الآخر جزئيا وقد لا يصل العتبة فلا يتولد كمون عمل.",
              rule: {
                prompt: "تجميع التنبيهات",
                keywords: ["تجميع", "عتبة", "كمون"],
                minHits: 2,
                forbidden: []
              }
            },
            W: {
              points: 1,
              prompt: "مقارنة GABA والأستيل كولين",
              bacPrompt:
                "قارن بين مفعول (GABA) ومفعول الأستيل كولين علما أنّ الأستيل كولين تفرز على مستوى الفراغ المشبكي للعصبون (ع2).",
              ...OFFICIAL(4, "س1 ت3 سؤال II-2 صفحة 4"),
              placeholder: "GABA تثبيطي...",
              minLength: 50,
              modelAnswer:
                "GABA مبلغ تثبيطي يسبب PPSI بزيادة نفاذية K و Cl بينما الأستيل كولين في هذا السياق تنبيهي يسبب PPSE بزيادة نفاذية Na.",
              rule: {
                prompt: "مقارنة GABA",
                keywords: ["GABA", "تثبيطي", "استيل", "تنبيهي"],
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
        "https://www.dzexams.com/uploads/sujets/officiels/bac/2013/dzexams-bac-sciences-4463279.pdf",
      pdfLocalUrl: "/subjects/SE/2013/sujet-2.pdf",
      pdfNote:
        "PDF local pages 1-4 = document officiel pages 5-8. Barème vérifié 08 06 06. Consignes officielles transcrites verbatim pages 5-8.",
      title: "الموضوع الثاني",
      exercises: [
        {
          number: 1,
          ui: "text",
          label: "التركيب الضوئي — الصانعات الخضراء",
          max: 8,
          desc: "شروط انطلاق O2، بنية الصانعة، كاشف هيل",
          poles: {
            N: {
              points: 1,
              prompt: "تأطير شروط التركيب الضوئي",
              bacPrompt: "فسّر نتائج الجدول.",
              ...OFFICIAL(5, "س2 ت1 سؤال 1 صفحة 5"),
              placeholder: "الجدول يوضح...",
              minLength: 40,
              modelAnswer:
                "الجدول يوضح أن انطلاق O2 يتطلب ضوء وثاني أكسيد الكربون وحرارة مناسبة ووجود اليخضور.",
              rule: {
                prompt: "تفسير جدول التركيب الضوئي",
                keywords: ["ضوء", "O2", "يخضور"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2,
              prompt: "استخراج شروط استمرار O2",
              bacPrompt: "استخرج من الجدول شروط استمرار انطلاق الـ O2.",
              ...OFFICIAL(5, "س2 ت1 سؤال 2 صفحة 5"),
              placeholder: "الشروط هي...",
              minLength: 50,
              modelAnswer:
                "الشروط هي وجود الضوء وثاني أكسيد الكربون والماء ودرجة حرارة ملائمة وسلامة الصانعات الخضراء.",
              rule: {
                prompt: "شروط انطلاق O2",
                keywords: ["ضوء", "CO2", "ماء"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 3,
              prompt: "آلية انتقال الإلكترونات",
              bacPrompt: "اشرح آلية انتقال الالكترونات في الأجزاء أ، ب، ج من الشكل (ب).",
              ...OFFICIAL(6, "س2 ت1 سؤال II-2 صفحة 6"),
              placeholder: "في الجزء أ يحدث...",
              minLength: 90,
              modelAnswer:
                "في الجزء أ يحدث انشطار الماء وتحرير O2 والكترونات، في ب انتقال الالكترونات عبر السلسلة التركيبية مع ضخ بروتونات، في ج عودة الالكترونات واختزال NADP إلى NADPH.",
              rule: {
                prompt: "انتقال الالكترونات",
                keywords: ["الكترونات", "NADP", "بروتونات"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 2,
              prompt: "تحليل منحنى كاشف هيل",
              bacPrompt: "حلّل منحنى الشكل (أ) من الوثيقة (2). ماذا تستنتج؟",
              ...OFFICIAL(6, "س2 ت1 سؤال II-1 صفحة 6"),
              placeholder: "المنحنى يوضح...",
              minLength: 60,
              modelAnswer:
                "المنحنى يوضح ارتفاع O2 في الضوء مع أكسدة Fe3 إلى Fe2 وانخفاضه في الظلام، مما يدل أن الضوء مصدر الالكترونات.",
              rule: {
                prompt: "تحليل منحنى هيل",
                keywords: ["O2", "ضوء", "Fe3", "الكترونات"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 2,
          ui: "text",
          label: "النشاط الإنزيمي — ريبونيكلياز",
          max: 6,
          desc: "معقد ES، سرعة التفاعل، تأثير اليوريا",
          poles: {
            N: {
              points: 1,
              prompt: "تعريف معقد ES",
              bacPrompt: "ماذا يمثل (E-S)؟",
              ...OFFICIAL(6, "س2 ت2 سؤال 1-أ صفحة 6"),
              placeholder: "E-S هو...",
              minLength: 30,
              modelAnswer:
                "E-S هو معقد إنزيم مادة التفاعل الناتج عن ارتباط مؤقت بين الإنزيم ومادة التفاعل في الموقع الفعال.",
              rule: {
                prompt: "تعريف ES",
                keywords: ["معقد", "إنزيم", "مادة"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2,
              prompt: "تحليل منحنيي الوثيقة 1",
              bacPrompt: "حلّل منحنيي الوثيقة (1).",
              ...OFFICIAL(6, "س2 ت2 سؤال 2-أ صفحة 6"),
              placeholder: "نلاحظ ارتفاع...",
              minLength: 50,
              modelAnswer:
                "نلاحظ ارتفاع تركيز ES في البداية ثم انخفاضه مع ارتفاع تركيز المنتوج P تدريجيا حتى الثبات مما يدل على تحول ES إلى E+P.",
              rule: {
                prompt: "تحليل منحنيي ES و P",
                keywords: ["ES", "P", "ارتفاع", "انخفاض"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 2,
              prompt: "أسباب فقدان النشاط الإنزيمي",
              bacPrompt: "ما هي الأسباب التي أدت إلى فقدان الإنزيم نشاطه؟ علّل إجابتك.",
              ...OFFICIAL(7, "س2 ت2 سؤال 3 صفحة 7"),
              placeholder: "فقدان النشاط بسبب...",
              minLength: 60,
              modelAnswer:
                "فقدان النشاط بسبب تخريب البنية الفراغية للإنزيم بفعل اليوريا ومركبتوايثانول التي تكسر الجسور الكبريتية والروابط الهيدروجينية.",
              rule: {
                prompt: "أسباب فقدان النشاط",
                keywords: ["بنية", "جسور", "يوريا"],
                minHits: 2,
                forbidden: []
              }
            },
            W: {
              points: 1,
              prompt: "العلاقة البنيوية E و S",
              bacPrompt: "ما هي طبيعة العلاقة البنيوية بين (E) و(S)؟",
              ...OFFICIAL(6, "س2 ت2 سؤال 1-ج صفحة 6"),
              placeholder: "العلاقة تكامل بنيوي...",
              minLength: 30,
              modelAnswer:
                "العلاقة تكامل بنيوي بين الموقع الفعال للإنزيم ومادة التفاعل حيث يتكامل شكلهما كالقفل والمفتاح.",
              rule: {
                prompt: "تكامل بنيوي",
                keywords: ["تكامل", "موقع", "قفل"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 3,
          ui: "text",
          label: "تحديد الذات — الزمر الدموية و HLA",
          max: 6,
          desc: "نقل الدم، الوراثة، توافق HLA",
          poles: {
            N: {
              points: 1,
              prompt: "المعطي الأكثر توافقا",
              bacPrompt: "حدّد المعطي الأكثر توافقا. برّر اختيارك.",
              ...OFFICIAL(7, "س2 ت3 سؤال I-1 صفحة 7"),
              placeholder: "المعطي الأكثر توافقا هو...",
              minLength: 30,
              modelAnswer:
                "المعطي الأكثر توافقا هو الفرد الذي لا يحدث تراص بين دمه ودم الآخذ لتوافق الزمر والمحددات.",
              rule: {
                prompt: "المعطي الأكثر توافقا",
                keywords: ["توافق", "تراص", "زمر"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2,
              prompt: "النمط التكويني للزمر",
              bacPrompt: "استخرج النمط التكويني للزمر الدموية للآباء، ثمّ حدّد الزمر الدموية للأبناء.",
              ...OFFICIAL(8, "س2 ت3 سؤال I-3-أ صفحة 8"),
              placeholder: "النمط التكويني للأب A هو...",
              minLength: 60,
              modelAnswer:
                "الأب A نمطه IAi والأم AB نمطها IAIB فالأبناء يمكن أن يكونوا A أو B أو AB حسب انعزال الأليلات.",
              rule: {
                prompt: "النمط التكويني للزمر",
                keywords: ["نمط", "IA", "IB", "أبناء"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 2,
              prompt: "تفسير توافق HLA",
              bacPrompt: "كيف تفسّر حالة المعطي الأكثر توافقا؟",
              ...OFFICIAL(8, "س2 ت3 سؤال II-ب صفحة 8"),
              placeholder: "التوافق بسبب...",
              minLength: 60,
              modelAnswer:
                "التوافق يفسر بتشابه الأليلات HLA بين المعطي والآخذ فكلما زاد التشابه قل الرفض المناعي.",
              rule: {
                prompt: "تفسير توافق HLA",
                keywords: ["HLA", "أليلات", "توافق", "رفض"],
                minHits: 2,
                forbidden: []
              }
            },
            W: {
              points: 1,
              prompt: "نوع البروتينات الغشائية للذات",
              bacPrompt:
                "من خلال ما توصلت إليه في الدراسة السابقة، استخلص نوع البروتينات الغشائية المتدخلة في تحديد الذات.",
              ...OFFICIAL(8, "س2 ت3 سؤال III صفحة 8"),
              placeholder: "البروتينات هي...",
              minLength: 40,
              modelAnswer:
                "البروتينات الغشائية المتدخلة هي بروتينات HLA من النوع الأول غليكوبروتينات مدمجة في الغشاء تحدد الذات.",
              rule: {
                prompt: "بروتينات تحديد الذات",
                keywords: ["HLA", "غشائية", "ذات"],
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

export { YEAR_2013_SE };
export default YEAR_2013_SE;
