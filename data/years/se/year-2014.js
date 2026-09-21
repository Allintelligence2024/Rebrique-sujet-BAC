/* ============================================================
   BAC SVT Algérie 2014 — Sciences expérimentales
   ------------------------------------------------------------
   Barème officiel vérifié sur PDF dzexams :
   Sujet 1 : 06 / 06 / 08 = 20
   Sujet 2 : 5.5 / 7.5 / 07 = 20
   Consignes transcrites verbatim depuis
   /subjects/SE/2014/sujet-1.pdf (5 pages) et
   /subjects/SE/2014/sujet-2.pdf (5 pages, doc 6-10).
   ============================================================ */

const OFFICIAL = (page, notes) => ({
  bacPromptSource: "official",
  bacPromptPage: page,
  bacPromptVerifiedAt: "2026-09-21",
  bacPromptNotes: notes
});

const YEAR_2014_SE = {
  id: "2014",
  stream: "se",
  calendarYear: "2014",
  label: "بكالوريا الجزائر دورة 2014 — شعبة علوم تجريبية",
  theme: "amber",
  enabled: true,
  sujets: [
    {
      id: 1,
      pdf: null,
      pdfExternalUrl:
        "https://www.dzexams.com/uploads/sujets/officiels/bac/2014/dzexams-bac-sciences-4380238.pdf",
      pdfLocalUrl: "/subjects/SE/2014/sujet-1.pdf",
      pdfNote:
        "PDF local pages 1-5 = doc pages 1-5. Barème officiel 06 06 08. Consignes officielles verbatim pages 1-5.",
      title: "الموضوع الأول",
      exercises: [
        {
          number: 1,
          ui: "text",
          label: "تركيب البروتين — الأسيتابولاريا",
          max: 6,
          desc: "فصل عضيات، معايرة ARN وبروتين، Anagène",
          poles: {
            N: {
              points: 1,
              prompt: "تأطير الإشكالية",
              bacPrompt:
                "ما هي المشكلة العلمية التي يراد معالجتها بواسطة التجربة الممثلة بالوثيقة (1)؟",
              ...OFFICIAL(1, "س1 ت1 سؤال 1-ب صفحة 1"),
              placeholder: "المشكل...",
              minLength: 30,
              modelAnswer:
                "المشكل هو كيف تشرف النواة على تركيب البروتين وما علاقة ARN بذلك.",
              rule: {
                prompt: "المشكل العلمي",
                keywords: ["نواة", "بروتين", "ARN"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 1.5,
              prompt: "تسمية الأجزاء المفصولة",
              bacPrompt:
                "باستغلالك لمعطيات جدول الوثيقة (1)، سمّ الأجزاء (1، 2، 3) المفصولة محددا المعيار الذي اعتمدت عليه.",
              ...OFFICIAL(1, "س1 ت1 سؤال 1 جدول 1 صفحة 1"),
              placeholder: "الأجزاء هي...",
              minLength: 40,
              modelAnswer:
                "الجزء 1 مستخلص كلي، الجزء 2 ميتوكوندري وشبكة، الجزء 3 ريبوزومات، المعيار سرعة الطرد المركزي وحجم العضية.",
              rule: {
                prompt: "تسمية الأجزاء",
                keywords: ["ريبوزوم", "طرد", "عضية"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 2.5,
              prompt: "تفسير معايرة ARN وبروتين ووحدة الشفرة",
              bacPrompt:
                "ما هي العلاقة التي توجد بين الظاهرتين الملاحظتين في التسجيلين (س) و(ع) وبنية الجزء (ج1)؟ وماذا تستنتج؟",
              ...OFFICIAL(2, "س1 ت1 سؤال 2-ب صفحة 2"),
              placeholder: "العلاقة...",
              minLength: 60,
              modelAnswer:
                "العلاقة طردية بين كمية ARN وكمية البروتين في الجزء الحاوي نواة، مما يدل أن النواة تصنع ARN رسول ضروري لتركيب البروتين.",
              rule: {
                prompt: "علاقة ARN بروتين",
                keywords: ["ARN", "بروتين", "نواة"],
                minHits: 2,
                forbidden: []
              }
            },
            W: {
              points: 1,
              prompt: "تفسير دور البروتينات و Anagène",
              bacPrompt:
                "أوجد عدد الأحماض الأمينية في البروتين الوظيفي الناتج عن هذه المورثة، مع التوضيح.",
              ...OFFICIAL(2, "س1 ت1 سؤال 1-د صفحة 2"),
              placeholder: "عدد الأحماض...",
              minLength: 40,
              modelAnswer:
                "عدد الأحماض 60 حمضا بعد حذف كودونات التوقف، لأن المورثة طولها 183 نكليوتيد أي 61 كودون ناقص التوقف.",
              rule: {
                prompt: "عدد الأحماض الأمينية",
                keywords: ["حمض", "كودون", "مورثة"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 2,
          ui: "text",
          label: "الميتوكوندري — تدرج البروتونات و ATP",
          max: 6,
          desc: "بنية الغشاء، تأثير DNP، حويصلات",
          poles: {
            N: {
              points: 1,
              prompt: "تأطير دور الغشاء الداخلي",
              bacPrompt:
                "بيّن بأن النتائج المعبر عنها بالجزء (أ، ب، ج) من المنحنى تعكس دور الغشاء الداخلي تجاه البروتونات.",
              ...OFFICIAL(3, "س1 ت2 سؤال II-1-أ صفحة 3"),
              placeholder: "المنحنى يوضح...",
              minLength: 50,
              modelAnswer:
                "المنحنى يوضح ارتفاع pH الخارجي عند حقن O2 مما يدل على دخول بروتونات إلى الماتريس عبر السلسلة التنفسية.",
              rule: {
                prompt: "دور الغشاء الداخلي",
                keywords: ["غشاء", "بروتون", "pH"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 1.5,
              prompt: "بيانات الميتوكوندري",
              bacPrompt: "اكتب البيانات المرقمة من 1 إلى 5 من الوثيقة (1) الشكل (أ).",
              ...OFFICIAL(3, "س1 ت2 سؤال I-1 صفحة 3"),
              placeholder: "البيانات...",
              minLength: 40,
              modelAnswer:
                "1 غشاء خارجي، 2 فراغ بين غشائي، 3 غشاء داخلي، 4 ماتريس، 5 كريستات.",
              rule: {
                prompt: "بيانات الميتوكوندري",
                keywords: ["غشاء", "ماتريس", "كريستات"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 2.5,
              prompt: "تفسير تأثير DNP والحويصلات",
              bacPrompt:
                "ما أثر إضافة الـ DNP على استعمال الـ O2 وفسفرة الـ ADP؟ علّل إجابتك.",
              ...OFFICIAL(4, "س1 ت2 سؤال II-2-ج صفحة 4"),
              placeholder: "DNP يزيد...",
              minLength: 60,
              modelAnswer:
                "DNP يزيد استهلاك O2 لأنه يلغي تدرج البروتونات فيفصل الأكسدة عن الفسفرة فلا يتركب ATP.",
              rule: {
                prompt: "تأثير DNP",
                keywords: ["DNP", "O2", "ATP", "تدرج"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1,
              prompt: "رسم وظيفي لدور الغشاء الداخلي",
              bacPrompt: "لخص برسم تخطيطي وظيفي دور الغشاء الداخلي للميتوكوندري في إنتاج الـ ATP.",
              ...OFFICIAL(4, "س1 ت2 سؤال III صفحة 4"),
              placeholder: "رسم...",
              minLength: 40,
              modelAnswer:
                "الرسم يوضح سلسلة نقل الكترونات تضخ بروتونات، عودة عبر ATP سنتاز لتركيب ATP من ADP و Pi.",
              rule: {
                prompt: "رسم ATP",
                keywords: ["ATP", "سنتاز", "بروتون"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 3,
          ui: "text",
          label: "المناعة — نوعية الأجسام المضادة",
          max: 8,
          desc: "بلعميات، بنية الجسم المضاد، إحصائيات تغير الأحماض",
          poles: {
            N: {
              points: 1,
              prompt: "تسمية الجزيئة",
              bacPrompt: "سمّ الجزيئة الموضحة على الوثيقة (1أ)، اكتب بياناتها.",
              ...OFFICIAL(4, "س1 ت3 سؤال I-1 صفحة 4"),
              placeholder: "الجزيئة هي...",
              minLength: 30,
              modelAnswer:
                "الجزيئة هي جسم مضاد، بياناتها سلسلتين ثقيلتين وخفيفتين ومنطقتين متغيرة وثابتة.",
              rule: {
                prompt: "تسمية الجسم المضاد",
                keywords: ["جسم", "مضاد", "سلسلة"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2,
              prompt: "مميزات الخلية البلعمية",
              bacPrompt:
                "استخرج المميزات البنيوية التي تدل على أن الخلية الموضحة على الوثيقة (1ب) ليست الخلية المنتجة لجزيئات الوثيقة (1أ).",
              ...OFFICIAL(4, "س1 ت3 سؤال I-2 صفحة 4"),
              placeholder: "المميزات...",
              minLength: 50,
              modelAnswer:
                "الخلية كبيرة بفجوات وارجل كاذبة ونواة غير مركزية، ليست بلازمية التي بها شبكة هيولية فعالة لإنتاج الأجسام.",
              rule: {
                prompt: "مميزات البلعمية",
                keywords: ["بلعمية", "فجوات", "بلازمية"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 3,
              prompt: "تفسير تغير الأحماض وتقارب المواقع",
              bacPrompt:
                "كيف تفسّر وجود أحماض أمينية ذات أرقام متباعدة في مواقع متقاربة من الجسم المضاد؟",
              ...OFFICIAL(5, "س1 ت3 سؤال II-2 صفحة 5"),
              placeholder: "التفسير...",
              minLength: 70,
              modelAnswer:
                "التفسير أن الطي ثلاثي الأبعاد للسلسلة يقرب أحماض متباعدة في التسلسل لتكون موقع ارتباط مولد الضد.",
              rule: {
                prompt: "تقارب مواقع الجسم المضاد",
                keywords: ["طي", "موقع", "مولد"],
                minHits: 2,
                forbidden: []
              }
            },
            W: {
              points: 2,
              prompt: "استخلاص الدعامة الجزيئية للنوعية",
              bacPrompt:
                "من خلال تحليلك لمعطيات الوثيقة 2 (أ، ب، ج) استخرج المعلومات التي تؤكد ما ورد في مقدمة التمرين مستخلصا الدعامة الجزيئية المتسببة في ميزة النوعية للاستجابة المناعية الخلطية.",
              ...OFFICIAL(5, "س1 ت3 سؤال II-3 صفحة 5"),
              placeholder: "المعلومات تؤكد...",
              minLength: 70,
              modelAnswer:
                "المعلومات تؤكد أن تنوع الأجسام يعود لتغير أحماض المنطقة المتغيرة، الدعامة هي المنطقة المتغيرة للسلاسل الثقيلة والخفيفة.",
              rule: {
                prompt: "دعامة النوعية",
                keywords: ["متغيرة", "تنوع", "نوعية"],
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
        "https://www.dzexams.com/uploads/sujets/officiels/bac/2014/dzexams-bac-sciences-4380238.pdf",
      pdfLocalUrl: "/subjects/SE/2014/sujet-2.pdf",
      pdfNote:
        "PDF local pages 1-5 = doc pages 6-10. Barème officiel 5.5 7.5 07. Consignes officielles verbatim pages 6-10.",
      title: "الموضوع الثاني",
      exercises: [
        {
          number: 1,
          ui: "text",
          label: "التنظيم الحجيري والنشاط الأنزيمي — الليزوزيم",
          max: 5.5,
          desc: "pH الأوساط، بروتياز، هكسوكيناز، بنية الليزوزيم",
          poles: {
            N: {
              points: 1,
              prompt: "تأطير التنظيم الحجيري",
              bacPrompt:
                "بيّن بأن الليزوزوم هو مثال جيد لإبراز أهمية التنظيم الحجيري في المحافظة على النشاط الأنزيمي.",
              ...OFFICIAL(6, "س2 ت1 سؤال I-1-ب صفحة 6"),
              placeholder: "الليزوزوم مثال...",
              minLength: 40,
              modelAnswer:
                "الليزوزوم مثال لأن pH داخله 5.5 حمضي ملائم لبروتياز بينما الهيولى pH 7.3 فيحمي الخلية من التحلل الذاتي.",
              rule: {
                prompt: "التنظيم الحجيري",
                keywords: ["ليزوزوم", "pH", "تنظيم"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 1.5,
              prompt: "تفسير نتائج الجدول ب",
              bacPrompt:
                "بالاعتماد على المعطيات السابقة فسّر نتائج الجدول (ب)، ماذا تستنتج؟",
              ...OFFICIAL(6, "س2 ت1 سؤال I-1-أ صفحة 6"),
              placeholder: "نلاحظ...",
              minLength: 50,
              modelAnswer:
                "نلاحظ أن بروتياز يعمل فقط في وسط حمضي مع بروتينات بكتيريا وهكسوكيناز يعمل في هيولى مع غلوكوز وATP، مما يدل على تخصص الأنزيمات بظروف pH ومادة تفاعل.",
              rule: {
                prompt: "تفسير جدول النشاط الأنزيمي",
                keywords: ["بروتياز", "هكسوكيناز", "pH", "ATP"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 2,
              prompt: "بنية الليزوزيم ودور الجسور",
              bacPrompt: "صف بنية الليزوزيم مبرزا دور الجسور ثنائية الكبريت.",
              ...OFFICIAL(7, "س2 ت1 سؤال 2-ب صفحة 7"),
              placeholder: "بنية الليزوزيم...",
              minLength: 60,
              modelAnswer:
                "الليزوزيم سلسلة بيبتيدية واحدة مطوية بثمانية جسور ثنائية الكبريت تثبت الموقع الفعال وتحافظ على البنية ثلاثية الأبعاد.",
              rule: {
                prompt: "بنية الليزوزيم",
                keywords: ["جسور", "كبريت", "موقع", "بنية"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1,
              prompt: "شروط عمل الأنزيم",
              bacPrompt: "استنتج، مما سبق، شروط عمل الأنزيم.",
              ...OFFICIAL(7, "س2 ت1 سؤال 3 صفحة 7"),
              placeholder: "شروط عمل الأنزيم...",
              minLength: 40,
              modelAnswer:
                "شروط عمل الأنزيم هي بنية فراغية محددة وموقع فعال متكامل مع مادة التفاعل وpH وحرارة مناسبة.",
              rule: {
                prompt: "شروط عمل الأنزيم",
                keywords: ["بنية", "موقع", "pH", "حرارة"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 2,
          ui: "text",
          label: "النقل العصبي — المنعكس الأخيلي وتجميع المشابك",
          max: 7.5,
          desc: "أنواع العصبونات، PPSE PPSI، معالجة العصبون المحرك",
          poles: {
            N: {
              points: 1,
              prompt: "أنواع العصبونات في المنعكس",
              bacPrompt:
                "حدّد أنواع العصبونات المتدخلة في عمل العضلتين المتضادتين أثناء المنعكس الأخيلي.",
              ...OFFICIAL(8, "س2 ت2 سؤال 1 صفحة 8"),
              placeholder: "الأنواع...",
              minLength: 40,
              modelAnswer:
                "تتدخل عصبونات حسية تنقل التنبيه، عصبونات بينية مثبطة، وعصبونات محركة للعضلة الباسطة والقابضة.",
              rule: {
                prompt: "أنواع العصبونات",
                keywords: ["حسية", "بينية", "محركة"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2,
              prompt: "تحليل تسجيلات الوثيقة 1 ب ج",
              bacPrompt: "حلّل التسجيلات الممثلة على الوثيقة 1 (ب، ج)، ماذا تستنتج؟",
              ...OFFICIAL(8, "س2 ت2 سؤال 2 صفحة 8"),
              placeholder: "نلاحظ...",
              minLength: 50,
              modelAnswer:
                "نلاحظ في ب PPSE عند ع1 وفي ج PPSI عند ع3، مما يدل أن نفس المنبه يسبب تنبيه عضلة وتثبيط العضلة المتضادة.",
              rule: {
                prompt: "تحليل PPSE PPSI",
                keywords: ["PPSE", "PPSI", "تنبيه", "تثبيط"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 3,
              prompt: "آلية عمل المبلغين الكيميائيين",
              bacPrompt:
                "انطلاقا من معلوماتك ومعطيات الوثيقة 1 (أ، ب، ج) اشرح آلية عمل كل من المبلغين العصبيين الكيميائيين في المشبكين م1 و م3 لضمان عمل العضلتين المتضادتين.",
              ...OFFICIAL(8, "س2 ت2 سؤال 4 صفحة 8"),
              placeholder: "المبلغ التنبيهي...",
              minLength: 80,
              modelAnswer:
                "المبلغ التنبيهي يفتح قنوات Na فيسبب زوال استقطاب PPSE، والمبلغ التثبيطي يفتح قنوات Cl فيسبب فرط استقطاب PPSI فيضمن تقلص عضلة واسترخاء الأخرى.",
              rule: {
                prompt: "آلية المبلغين",
                keywords: ["Na", "Cl", "PPSE", "PPSI"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1.5,
              prompt: "معالجة العصبون المحرك للمعلومات",
              bacPrompt:
                "فسّر نتائج الوثيقة (2)، ماذا تستنتج فيما يخص معالجة العصبون المحرك للمعلومات الواردة إليه؟",
              ...OFFICIAL(9, "س2 ت2 سؤال II صفحة 9"),
              placeholder: "العصبون المحرك يجمع...",
              minLength: 60,
              modelAnswer:
                "العصبون المحرك يجمع الكمونات بعد مشبكية بالتجميع الزماني والمكاني، إذا بلغ العتبة يولد كمون عمل في R وإلا لا.",
              rule: {
                prompt: "تجميع العصبون المحرك",
                keywords: ["تجميع", "عتبة", "كمون", "محرك"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 3,
          ui: "text",
          label: "التركيب الضوئي — اقتناص الطاقة و RudiP",
          max: 7,
          desc: "بنية التيلاكويد، كمون الأكسدة، ستروما و CO2",
          poles: {
            N: {
              points: 1,
              prompt: "تسمية العضية والعناصر",
              bacPrompt: "سمّ العضية (س) و العناصر المشار إليها بالأحرف و الأرقام.",
              ...OFFICIAL(10, "س2 ت3 سؤال I-1 صفحة 9"),
              placeholder: "العضية س هي...",
              minLength: 40,
              modelAnswer:
                "العضية س هي الصانعة الخضراء، أ غشاء خارجي، ب تيلاكويد، العناصر سلسلة نقل الكترونات و ATP سنتاز.",
              rule: {
                prompt: "تسمية الصانعة الخضراء",
                keywords: ["صانعة", "تيلاكويد", "غشاء"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2,
              prompt: "تحليل منحنى CO2 في الستروما",
              bacPrompt: "حلّل منحنى الشكل (أ) من ز0 إلى ز3. ماذا تستنتج؟",
              ...OFFICIAL(10, "س2 ت3 سؤال II-1-أ صفحة 10"),
              placeholder: "المنحنى يوضح...",
              minLength: 60,
              modelAnswer:
                "المنحنى يوضح ثبات CO2 في الظلام ثم انخفاض سريع في الضوء مع حقن ATP و TH2 مما يدل أن تثبيت CO2 يحتاج نواتج المرحلة الضوئية.",
              rule: {
                prompt: "تحليل منحنى CO2",
                keywords: ["CO2", "ضوء", "ATP", "TH2"],
                minHits: 3,
                forbidden: []
              }
            },
            E: {
              points: 2.5,
              prompt: "مصير CO2 الممتص",
              bacPrompt: "انطلاقا من معطيات الوثيقة 2 (ب)، وضّح مصير CO2 الممتص.",
              ...OFFICIAL(10, "س2 ت3 سؤال II-2 صفحة 10"),
              placeholder: "CO2 يتحول...",
              minLength: 60,
              modelAnswer:
                "CO2 يثبت على RudiP بواسطة روبيسكو ليعطي APG ثم هكسوزات، كمية RudiP تنخفض ثم تسترجع في حلقة كالفن.",
              rule: {
                prompt: "مصير CO2",
                keywords: ["RudiP", "APG", "روبيسكو", "كالفن"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1.5,
              prompt: "العلاقة بين المرحلتين الضوئية والظلامية",
              bacPrompt:
                "مثّل في رسم تخطيطي وظيفي العلاقة بين الآليات المدروسة في الجزأين I و II.",
              ...OFFICIAL(10, "س2 ت3 سؤال III صفحة 10"),
              placeholder: "رسم يوضح...",
              minLength: 50,
              modelAnswer:
                "الرسم يوضح أن المرحلة الضوئية تنتج ATP و NADPH في التيلاكويد تستعمل في الستروما لتثبيت CO2 وإنتاج سكر.",
              rule: {
                prompt: "رسم العلاقة مرحلتين",
                keywords: ["ATP", "NADPH", "ستروما", "تيلاكويد"],
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

export { YEAR_2014_SE };
export default YEAR_2014_SE;
