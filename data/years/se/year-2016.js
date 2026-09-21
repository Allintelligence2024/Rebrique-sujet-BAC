/* ============================================================
   BAC SVT Algérie 2016 — Sciences expérimentales
   ------------------------------------------------------------
   Barème officiel vérifié sur PDF dzexams :
   Sujet 1 : 06 / 07 / 07 = 20  (p1, p2, p4)
   Sujet 2 : 06 / 07 / 07 = 20  (p6, p7, p9)
   Consignes transcrites verbatim depuis
   /subjects/SE/2016/sujet-1.pdf (5p) et sujet-2.pdf (5p, doc 6-10).
   ============================================================ */

const OFFICIAL = (page, notes) => ({
  bacPromptSource: "official",
  bacPromptPage: page,
  bacPromptVerifiedAt: "2026-09-21",
  bacPromptNotes: notes
});

const YEAR_2016_SE = {
  id: "2016",
  stream: "se",
  calendarYear: "2016",
  label: "بكالوريا الجزائر دورة 2016 — شعبة علوم تجريبية",
  theme: "purple",
  enabled: true,
  sujets: [
    {
      id: 1,
      pdf: null,
      pdfExternalUrl:
        "https://www.dzexams.com/ar/annales/M09NK2ZYVHFzQXg3KzZHazBaTk5IUT09",
      pdfLocalUrl: "/subjects/SE/2016/sujet-1.pdf",
      pdfNote:
        "PDF local pages 1-5 = doc 1-5. Barème officiel 06 07 07. Consignes officielles verbatim pages 1-5.",
      title: "الموضوع الأول",
      exercises: [
        {
          number: 1,
          ui: "text",
          label: "العلاقة بين المورثة وتعبيرها المورثي عند حقيقيات النواة",
          max: 6,
          desc: "صورة مجهر إلكتروني لوحدة متمايزة، Anagène",
          poles: {
            N: {
              points: 1,
              prompt: "عنوان للشكلين أ و ب",
              bacPrompt: "قدّم عنوانا مناسبا لكل من الشكلين (أ) و (ب) للوثيقة (1).",
              ...OFFICIAL(1, "س1 ت1 سؤال 1 صفحة 1"),
              placeholder: "العنوان...",
              minLength: 30,
              modelAnswer:
                "الشكل أ وحدات نسخ على ADN مع بوليمراز، الشكل ب بنية ADN حلزوني.",
              rule: {
                prompt: "عنوان الشكلين",
                keywords: ["نسخ", "ADN", "بوليمراز"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 1.5,
              prompt: "بيانات الشكلين وعلاقة وظيفية",
              bacPrompt:
                "اكتب أسماء البيانات المرقمة في الشكلين (أ) و (ب) للوثيقة (1). ب- وضح العلاقة الوظيفية بين الشكلين (أ) و (ب) للوثيقة (1).",
              ...OFFICIAL(1, "س1 ت1 سؤال 2 صفحة 1"),
              placeholder: "البيانات...",
              minLength: 50,
              modelAnswer:
                "البيانات هي ARN بوليميراز وADN وARNm، العلاقة أن الشكل أ يمثل نسخ ADN إلى ARNm الذي يترجم.",
              rule: {
                prompt: "بيانات وعلاقة",
                keywords: ["ARN", "ADN", "بوليمراز"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 2.5,
              prompt: "تحليل نتائج Anagène وخصائص الشفرة",
              bacPrompt:
                "انطلاقا من نتائج الوثيقة (2): أ- بين الجوانب التي عالجتها دراسة هذه المورثات باستعمال مبرمج Anagène. علل إجابتك. ب- حدد وحدة الشفرة الوراثية مع التعليل. ج- استخرج خصائص الشفرة الوراثية.",
              ...OFFICIAL(2, "س1 ت1 سؤال 1 صفحة 2"),
              placeholder: "الجوانب...",
              minLength: 80,
              modelAnswer:
                "الجوانب هي بداية ونهاية المورثة، وحدة الشفرة 3 نكليوتيدات، خصائص الشفرة عالمية وغير متراكبة بفواصل ومتوقفة.",
              rule: {
                prompt: "Anagène وشفرة وراثية",
                keywords: ["شفرة", "كودون", "Anagène", "مورثة"],
                minHits: 2,
                forbidden: []
              }
            },
            W: {
              points: 1,
              prompt: "رسم العلاقة مورثة → تعبيرها",
              bacPrompt:
                "مما سبق ومن معارفك أنجز رسما تخطيطيا تفصيليا تبرز فيه مراحل العلاقة بين المورثة وناتج تعبيرها المورثي.",
              ...OFFICIAL(2, "س1 ت1 سؤال III صفحة 2"),
              placeholder: "رسم...",
              minLength: 40,
              modelAnswer:
                "الرسم يوضح ADN → نسخ → ARNm → نضج → ترجمة في الريبوزوم → بروتين وظيفي.",
              rule: {
                prompt: "رسم علاقة مورثة تعبير",
                keywords: ["ADN", "ARNm", "ترجمة", "بروتين"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 2,
          ui: "text",
          label: "المناعة — الخلية اللمفاوية السامة س",
          max: 7,
          desc: "تعرف على الخلية، رسم تخطيطي للمستوى الجزيئي، LT4 LT8 LB",
          poles: {
            N: {
              points: 1,
              prompt: "تعرف على الخلية اللمفاوية س والعناصر",
              bacPrompt: "تعرف على الخلية اللمفاوية (س) والعناصر (ح).",
              ...OFFICIAL(2, "س1 ت2 سؤال 1 صفحة 2"),
              placeholder: "الخلية س هي LTc...",
              minLength: 30,
              modelAnswer:
                "الخلية س هي LTc سامة، العناصر ح هي بيرفورين وغرانزيم.",
              rule: {
                prompt: "تعرف الخلية س",
                keywords: ["LTc", "سام", "بيرفورين"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 1.5,
              prompt: "رسم المستوى الجزيئي للجزء المؤطر وشرح نشاط س",
              bacPrompt:
                "أ- أنجز رسما تخطيطيا على المستوى الجزيئي للجزء المؤطر في الشكل (أ) للوثيقة (1). ب- اشرح نشاط الخلية اللمفاوية (س) الذي نتج عنه مظهر الغشاء الهيولي الممثل في الشكل (ب).",
              ...OFFICIAL(3, "س1 ت2 سؤال 2 صفحة 3"),
              placeholder: "الرسم يوضح...",
              minLength: 50,
              modelAnswer:
                "الرسم يوضح تعرف TCR على HLA-I مع ببتيد فيروسي، ثم إفراز بيرفورين يثقب غشاء الخلية المصابة.",
              rule: {
                prompt: "رسم تعرف LTc",
                keywords: ["TCR", "HLA", "بيرفورين", "غشاء"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 3,
              prompt: "مصدر الخلية س وتفسير IL2",
              bacPrompt:
                "بين مصدر الخلية (س) باستغلال نتائج جدول الوثيقة (2). أ- حلل الشكل (أ) من الوثيقة (2). ب- فسر النتائج المحصل عليها في الشكل (ب) للوثيقة (2).",
              ...OFFICIAL(3, "س1 ت2 سؤال 1 صفحة 3"),
              placeholder: "مصدر س هو LT8...",
              minLength: 70,
              modelAnswer:
                "مصدر س هو LT8 التي تنشط بواسطة LT4 وIL2، الطافرة لا تنتج IL2 فلا تتكاثر LT8 ولا تخرب الخلايا.",
              rule: {
                prompt: "مصدر س و IL2",
                keywords: ["LT8", "LT4", "IL2", "طافر"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1.5,
              prompt: "نص علمي مراحل الاستجابة بوساطة س",
              bacPrompt:
                "مما سبق ومن معلوماتك بين في نص علمي مراحل الاستجابة المناعية التي تتوسطها الخلايا اللمفاوية (س).",
              ...OFFICIAL(3, "س1 ت2 سؤال III صفحة 3"),
              placeholder: "المراحل...",
              minLength: 60,
              modelAnswer:
                "المراحل هي انتقاء لمي من LT8، تكاثر بتحفيز LT4 وIL2، تمايز إلى LTc فعالة تخرب الخلايا المصابة ببيرفورين.",
              rule: {
                prompt: "مراحل LTc",
                keywords: ["انتقاء", "تكاثر", "تمايز", "بيرفورين"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 3,
          ui: "text",
          label: "إنتاج ATP في الخلية",
          max: 7,
          desc: "تيلاكويد وميتوكوندري، تفاعلات أكسدة وإرجاع V",
          poles: {
            N: {
              points: 1,
              prompt: "نوع الخلية التي يتواجد بها الشكلان",
              bacPrompt: "حدد نوع الخلية التي يتواجد بها الشكلان (أ) و (ب) معا.",
              ...OFFICIAL(4, "س1 ت3 سؤال 1 صفحة 4"),
              placeholder: "خلية نباتية...",
              minLength: 30,
              modelAnswer:
                "خلية نباتية حقيقية النواة تحتوي صانعات خضراء وميتوكوندريات لإنتاج ATP.",
              rule: {
                prompt: "نوع الخلية",
                keywords: ["نباتية", "صانعة", "ميتوكوندري"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2,
              prompt: "ترجمة الشكلين إلى رسم تخطيطي وآلية ATP",
              bacPrompt:
                "أ- ترجم كل من شكلي الوثيقة (1) إلى رسم تخطيطي عليه البيانات اللازمة. ب- سم الآلية التي تسمح بتركيب الـ ATP في كل من شكلي الوثيقة (1).",
              ...OFFICIAL(4, "س1 ت3 سؤال 2 صفحة 4"),
              placeholder: "الشكل أ تيلاكويد...",
              minLength: 50,
              modelAnswer:
                "الشكل أ تيلاكويد بتركيب ضوئي، الشكل ب غشاء داخلي ميتوكوندري بتنفس، الآلية هي التناضح الكيميائي.",
              rule: {
                prompt: "ترجمة شكلين وآلية ATP",
                keywords: ["تيلاكويد", "ميتوكوندري", "تناضح"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 2.5,
              prompt: "تعرف على المركبات س ص ع ل م ومقر التفاعلين",
              bacPrompt:
                "أ- تعرف على المركبات الكيميائية الممثلة بالأحرف (س، ص، ع، ل، م) في الشكل (أ) للوثيقة (2). ب- حدد بدقة على المستوى الجزيئي مقر حدوث كل من التفاعلين (1) و (2).",
              ...OFFICIAL(4, "س1 ت3 سؤال II-1 صفحة 4"),
              placeholder: "س هو H2O...",
              minLength: 70,
              modelAnswer:
                "س H2O، ص NADP، ع NADPH، ل ADP، م ATP، التفاعل 1 في التيلاكويد (فسفرة ضوئية)، 2 في الميتوكوندري (أكسدة).",
              rule: {
                prompt: "مركبات ومقر تفاعلين",
                keywords: ["H2O", "ATP", "تيلاكويد", "ميتوكوندري"],
                minHits: 2,
                forbidden: []
              }
            },
            W: {
              points: 1.5,
              prompt: "رسم آلية تحويل الطاقة",
              bacPrompt:
                "من معلوماتك ومما سبق، وضح برسم تخطيطي آلية تحويل الطاقة خلال الظاهرة البيولوجية المدروسة.",
              ...OFFICIAL(4, "س1 ت3 سؤال ختامي صفحة 4"),
              placeholder: "رسم...",
              minLength: 50,
              modelAnswer:
                "الرسم يوضح تحويل طاقة ضوئية إلى كيميائية في التيلاكويد ثم إلى ATP في الميتوكوندري.",
              rule: {
                prompt: "رسم تحويل طاقة",
                keywords: ["طاقة", "ضوئية", "ATP", "ميتوكوندري"],
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
        "https://www.dzexams.com/ar/annales/M09NK2ZYVHFzQXg3KzZHazBaTk5IUT09",
      pdfLocalUrl: "/subjects/SE/2016/sujet-2.pdf",
      pdfNote:
        "PDF local pages 1-5 = doc 6-10. Barème officiel 06 07 07. Consignes officielles verbatim pages 6-10.",
      title: "الموضوع الثاني",
      exercises: [
        {
          number: 1,
          ui: "text",
          label: "التخصص الوظيفي للأنزيم — الأميلاز و α غلوكوزيداز",
          max: 6,
          desc: "الجزء المؤطر س، تجارب طفرات، Glucobay",
          poles: {
            N: {
              points: 1,
              prompt: "ماذا يمثل الجزء المؤطر س؟",
              bacPrompt: "ماذا يمثل الجزء المؤطر (س)؟ علل إجابتك.",
              ...OFFICIAL(6, "س2 ت1 سؤال 1 صفحة 6"),
              placeholder: "س هو الموقع الفعال...",
              minLength: 30,
              modelAnswer:
                "س هو الموقع الفعال للأنزيم لأنه يتثبت فيه النشاء بشكل متخصص.",
              rule: {
                prompt: "الجزء المؤطر",
                keywords: ["موقع", "فعال", "نشاء"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 1.5,
              prompt: "المستوى البنائي وروابط ثبات البنية",
              bacPrompt:
                "أ- تعرف على المستوى البنائي لجزيئة الأميلاز مع التعليل. ب- اذكر الروابط الكيميائية المساهمة في ثبات هذه البنية.",
              ...OFFICIAL(6, "س2 ت1 سؤال 2 صفحة 6"),
              placeholder: "المستوى ثالثي...",
              minLength: 50,
              modelAnswer:
                "المستوى ثالثي بسبب الطي والجسور، الروابط هيدروجينية وكبريتية وشاردية وكارهة للماء.",
              rule: {
                prompt: "مستوى وروابط",
                keywords: ["ثالثي", "هيدروجينية", "كبريتية"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 2.5,
              prompt: "تفسير نتائج تجارب الطفرات",
              bacPrompt: "فسر النتائج التجريبية. ماذا تستخلص بخصوص الجزء المؤطر (س)؟",
              ...OFFICIAL(6, "س2 ت1 سؤال 1-أ صفحة 6"),
              placeholder: "التجارب تظهر...",
              minLength: 60,
              modelAnswer:
                "التجارب تظهر أن طفرة خارج س لا تؤثر، داخل س تثبط التثبيت والإماهة، مما يدل أن س هو الموقع الفعال المسؤول عن النوعية.",
              rule: {
                prompt: "تفسير تجارب الطفرات",
                keywords: ["طفرة", "موقع", "فعال", "تثبيت"],
                minHits: 2,
                forbidden: []
              }
            },
            W: {
              points: 1,
              prompt: "كيف يعمل Glucobay على تخفيض سكر الدم؟",
              bacPrompt:
                "فسر معتمدا على الوثيقة (2) كيف يعمل هذا الدواء على تخفيض نسبة السكر في دم المصاب.",
              ...OFFICIAL(7, "س2 ت1 سؤال 2-ب صفحة 7"),
              placeholder: "Glucobay يثبط...",
              minLength: 50,
              modelAnswer:
                "Glucobay يشبه الركيزة فيثبط α غلوكوزيداز تنافسيا، يقلل إماهة سكريات قليلة التعدد إلى غلوكوز فيخفض سكر الدم.",
              rule: {
                prompt: "آلية Glucobay",
                keywords: ["Glucobay", "تثبيط", "غلوكوز", "تنافسي"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 2,
          ui: "text",
          label: "التركيب الضوئي — الصانعة الخضراء و Rubisco",
          max: 7,
          desc: "عناصر 1-4، تفاعل أكسدة إرجاع، ATP سنتاز",
          poles: {
            N: {
              points: 1,
              prompt: "تعرف على العضية وبياناتها",
              bacPrompt: "تعرف على هذه العضية. اكتب بيانات العناصر المرقمة.",
              ...OFFICIAL(7, "س2 ت2 سؤال 1 صفحة 7"),
              placeholder: "العضية صانعة خضراء...",
              minLength: 40,
              modelAnswer:
                "العضية صانعة خضراء، 1 غشاء خارجي، 2 غشاء داخلي، 3 تيلاكويد، 4 حبيبة نشاء.",
              rule: {
                prompt: "بيانات الصانعة الخضراء",
                keywords: ["صانعة", "تيلاكويد", "غشاء"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2,
              prompt: "نمط التحويل الطاقوي ومعادلته",
              bacPrompt:
                "حدد نمط التحويل الطاقوي الذي يحدث على مستوى هذه العضية. ما هي الظاهرة البيولوجية المعنية؟ اكتب معادلتها الإجمالية.",
              ...OFFICIAL(7, "س2 ت2 سؤال 2 صفحة 7"),
              placeholder: "النمط ضوئي...",
              minLength: 50,
              modelAnswer:
                "النمط ضوئي كيميائي، الظاهرة تركيب ضوئي: 6CO2+6H2O+ضوء → C6H12O6+6O2.",
              rule: {
                prompt: "معادلة التركيب الضوئي",
                keywords: ["ضوئي", "CO2", "غلوكوز", "O2"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 2.5,
              prompt: "نشاط جزيئة الشكل أ وتجربة ATP",
              bacPrompt:
                "تنشط جزيئة الشكل (أ) تفاعلا أساسيا خلال مرحلة من الظاهرة المدروسة. أ- تعرف على جزيئة الشكل (أ) محددا طبيعتها الكيميائية. ب- سم المرحلة المعنية واكتب معادلتها الكيميائية.",
              ...OFFICIAL(8, "س2 ت2 سؤال 1 صفحة 8"),
              placeholder: "الجزيئة روبيسكو...",
              minLength: 70,
              modelAnswer:
                "الجزيئة روبيسكو أنزيم، تثبت CO2 على RudiP في المرحلة الكيموحيوية: CO2+RudiP → 2APG.",
              rule: {
                prompt: "روبيسكو ومرحلة",
                keywords: ["روبيسكو", "CO2", "RudiP", "APG"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1.5,
              prompt: "دور الأنزيم E والمركب المتحرر P",
              bacPrompt:
                "يتدخل الأنزيم (E) للشكل (ب) من الوثيقة (2) في المرحلة التي تلي المرحلة السابقة في الظاهرة المدروسة. أ- تعرف على الأنزيم (E) ثم حدد مادة تفاعله (الركيزة S) والناتج المتحرر (P).",
              ...OFFICIAL(8, "س2 ت2 سؤال 3-أ صفحة 8"),
              placeholder: "E هو ATP سنتاز...",
              minLength: 60,
              modelAnswer:
                "E هو ATP سنتاز، الركيزة ADP+Pi، الناتج ATP، يتدخل في الفسفرة الضوئية باستخدام تدرج البروتونات.",
              rule: {
                prompt: "دور ATP سنتاز",
                keywords: ["ATP", "سنتاز", "ADP", "تدرج"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 3,
          ui: "text",
          label: "التنظيم العصبي — المنعكس العضلي واختلال المشبك",
          max: 7,
          desc: "عصبون جامع ومحرك، تسجيلات ر.ذ.م، أدوية",
          poles: {
            N: {
              points: 1,
              prompt: "تحليل تسجيلات ر.ذ.م 1",
              bacPrompt: "حلّل النتائج الممثلة في الشكل (ب) للوثيقة (1).",
              ...OFFICIAL(9, "س2 ت3 سؤال 1-أ صفحة 9"),
              placeholder: "التسجيلات...",
              minLength: 40,
              modelAnswer:
                "التسجيلات تظهر غياب كمون بعد مشبكي في كل الشروط، مما يدل على أن المشبك بين الجامع والمحرك معطل.",
              rule: {
                prompt: "تحليل تسجيلات المنعكس",
                keywords: ["كمون", "مشبك", "جامع", "محرك"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 1.5,
              prompt: "نوع المشبك بين الجامع والمحرك",
              bacPrompt: "ما نوع المشبك بين العصبون الجامع والعصبون الحركي؟",
              ...OFFICIAL(9, "س2 ت3 سؤال 1-ب صفحة 9"),
              placeholder: "مشبك تنبيهي...",
              minLength: 30,
              modelAnswer:
                "مشبك تنبيهي يعمل بالأستيل كولين، يولد PPSE.",
              rule: {
                prompt: "نوع المشبك",
                keywords: ["تنبيهي", "أستيل", "PPSE"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 3,
              prompt: "أهمية المشبك في تنسيق عمل العضلتين المتضادتين",
              bacPrompt:
                "اشرح أهمية تدخل هذا المشبك في تنسيق عمل العضلتين المتضادتين خلال المنعكس العضلي.",
              ...OFFICIAL(9, "س2 ت3 سؤال 2 صفحة 9"),
              placeholder: "المشبك يضمن...",
              minLength: 70,
              modelAnswer:
                "المشبك يضمن نقل التنبيه من الجامع إلى المحرك للعضلة الباسطة، بينما العصبون المثبط يثبط القابضة فيضمن تنسيق التضاد.",
              rule: {
                prompt: "أهمية تنسيق المنعكس",
                keywords: ["منعكس", "عضلي", "تضاد", "تنسيق"],
                minHits: 2,
                forbidden: []
              }
            },
            W: {
              points: 1.5,
              prompt: "رسم تخطيطي للمنعكس العضلي",
              bacPrompt: "وضح برسم تخطيطي آلية المنعكس العضلي.",
              ...OFFICIAL(9, "س2 ت3 سؤال ختامي صفحة 9"),
              placeholder: "رسم...",
              minLength: 40,
              modelAnswer:
                "الرسم يوضح مستقبل حسي → عصبون حسي → جامع → محرك → عضلة، مع عصبون مثبط للمتضادة.",
              rule: {
                prompt: "رسم منعكس عضلي",
                keywords: ["حسي", "محرك", "عضلة", "منعكس"],
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

export { YEAR_2016_SE };
export default YEAR_2016_SE;
