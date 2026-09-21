/* ============================================================
   BAC SVT Algérie 2017 — Sciences expérimentales
   ------------------------------------------------------------
   Barème officiel vérifié sur PDF :
   Sujet 1 : 05 / 07 / 08 = 20  (p1, p2, p3)
   Sujet 2 : 05 / 07 / 08 = 20  (p5, p6, p7)
   Consignes verbatim pages 1-8.
   ============================================================ */

const OFFICIAL = (page, notes) => ({
  bacPromptSource: "official",
  bacPromptPage: page,
  bacPromptVerifiedAt: "2026-09-21",
  bacPromptNotes: notes
});

const YEAR_2017_SE = {
  id: "2017",
  stream: "se",
  calendarYear: "2017",
  label: "بكالوريا الجزائر دورة 2017 — شعبة علوم تجريبية",
  theme: "rose",
  enabled: true,
  sujets: [
    {
      id: 1,
      pdf: null,
      pdfExternalUrl:
        "https://www.dzexams.com/uploads/sujets/officiels/bac/2017/dzexams-bac-sciences-2581269.pdf",
      pdfLocalUrl: "/subjects/SE/2017/sujet-1.pdf",
      pdfNote: "PDF local 4p = doc 1-4. Barème 05/07/08. Verbatim officiel pages 1-4.",
      title: "الموضوع الأول",
      exercises: [
        {
          number: 1,
          ui: "text",
          label: "تركيب البروتين عند حقيقية النواة",
          max: 5,
          desc: "مراحل أ و ب، 8 عناصر، حساب وحدات بنائية 327 نكليوتيد",
          poles: {
            N: {
              points: 1,
              prompt: "البيانات الموافقة للأرقام وسم المرحلتين",
              bacPrompt: "اكتب البيانات الموافقة للأرقام وسم المرحلتين (أ) و (ب).",
              ...OFFICIAL(1, "س1 ت1 سؤال 1 صفحة 1"),
              placeholder: "البيانات...",
              minLength: 40,
              modelAnswer:
                "1 غشاء هيولي، 2 أحماض أمينية، 3 ARNm، 4 ريبوزوم، 5 ARNm، 6 بروتين، 7 ADN، 8 تحت وحدة، أ نسخ، ب ترجمة.",
              rule: { prompt: "بيانات 1-8 ومرحلتان", keywords: ["نسخ", "ترجمة", "ريبوزوم"], minHits: 2, forbidden: [] }
            },
            S: {
              points: 1.5,
              prompt: "جدول العناصر الضرورية ودور كل عنصر",
              bacPrompt: "حدد في جدول العناصر الضرورية لحدوث كل من المرحلة (أ) والمرحلة (ب) ودور كل عنصر.",
              ...OFFICIAL(1, "س1 ت1 سؤال 2 صفحة 1"),
              placeholder: "العناصر...",
              minLength: 50,
              modelAnswer: "المرحلة أ تحتاج ADN، بوليميراز، نكليوتيدات؛ المرحلة ب تحتاج ARNm، ريبوزوم، ARNt، أحماض أمينية، طاقة.",
              rule: { prompt: "عناصر ضرورية ودورها", keywords: ["ADN", "ARNm", "ريبوزوم"], minHits: 2, forbidden: [] }
            },
            E: {
              points: 1.5,
              prompt: "حساب عدد الوحدات البنائية في العنصر 6",
              bacPrompt: "احسب عدد الوحدات البنائية في العنصر 6 الوظيفي إذا كان عدد النكليوتيدات في العنصر 3 يساوي 327.",
              ...OFFICIAL(1, "س1 ت1 سؤال 3 صفحة 1"),
              placeholder: "327/3...",
              minLength: 30,
              modelAnswer: "327/3 =109 كودون، ناقص كودون توقف =108 حمض أميني في البروتين.",
              rule: { prompt: "حساب أحماض أمينية", keywords: ["327", "كودون", "حمض"], minHits: 2, forbidden: [] }
            },
            W: {
              points: 1,
              prompt: "نص علمي كيف يتحكم العنصر 7 في تحديد البنية الفراغية للعنصر 6",
              bacPrompt: "بين في نص علمي كيف يتحكم العنصر 7 في تحديد البنية الفراغية للعنصر 6.",
              ...OFFICIAL(1, "س1 ت1 سؤال 4 صفحة 1"),
              placeholder: "العنصر 7 هو المورثة...",
              minLength: 60,
              modelAnswer: "العنصر 7 مورثة تحدد تتابع أحماض أمينية فيحدد روابط كيميائية وتطوي البروتين فتتحدد بنيته الفراغية ووظيفته.",
              rule: { prompt: "تحكم مورثة في بنية", keywords: ["مورثة", "بنية", "فراغية", "وظيفة"], minHits: 2, forbidden: [] }
            }
          }
        },
        {
          number: 2,
          ui: "text",
          label: "الرد المناعي الخلطي والخلوي — تجارب زرع جيلاتيني",
          max: 7,
          desc: "الوثيقة 1 شكلين، الوثيقة 2 5 أوساط زرع",
          poles: {
            N: {
              points: 1,
              prompt: "تعرف على الخلية a و b وتحديد المرحلة",
              bacPrompt: "تعرف على الخلية a والخلية b. حدد المرحلة الممثلة في الوثيقة 1 ونوع الاستجابة المناعية المعنية.",
              ...OFFICIAL(2, "س1 ت2 سؤال 1 صفحة 2"),
              placeholder: "a بلاسموسيت...",
              minLength: 40,
              modelAnswer: "a بلاسموسيت ينتج أجسام مضادة، b لمفاوية B، المرحلة تنفيذ الاستجابة الخلطية.",
              rule: { prompt: "خلية a b ومرحلة", keywords: ["بلاسموسيت", "B", "خلطية"], minHits: 2, forbidden: [] }
            },
            S: {
              points: 1.5,
              prompt: "رسم تفسيري للشكل 1 وشرح الظاهرة للشكل 2",
              bacPrompt: "أ- أنجز رسما تخطيطيا تفسيريا للشكل (1). ب- اشرح الظاهرة الممثلة بالشكل (2).",
              ...OFFICIAL(2, "س1 ت2 سؤال 2 صفحة 2"),
              placeholder: "الرسم يوضح...",
              minLength: 50,
              modelAnswer: "الشكل 1 إفراز أجسام مضادة من بلاسموسيت، الشكل 2 انحلال خلوي بوساطة LTc.",
              rule: { prompt: "رسم وشرح", keywords: ["أجسام", "مضادة", "LTc"], minHits: 2, forbidden: [] }
            },
            E: {
              points: 3,
              prompt: "تحليل مقارن للأوساط 1-5 واستنتاج العلاقة بين الخلايا",
              bacPrompt: "قدم تحليلا مقارنا للنتائج التجريبية للأوساط (1، 2 و 3) والوسطين (4 و 5)، استنتج العلاقة بين الخلايا اللمفاوية المستعملة.",
              ...OFFICIAL(3, "س1 ت2 سؤال 1-أ صفحة 3"),
              placeholder: "الأوساط...",
              minLength: 70,
              modelAnswer: "LB مع مستضد X تعطي أجسام مضادة فقط بوجود LT4 محسة ضد X، وLT8 تقتل سرطانية فقط بوجود LT4 محسة، مما يدل على تعاون.",
              rule: { prompt: "تحليل أوساط وتعاون", keywords: ["LT4", "LB", "LT8", "تعاون"], minHits: 3, forbidden: [] }
            },
            W: {
              points: 1.5,
              prompt: "نص علمي مراحل الرد المناعي مبرزا دور 4",
              bacPrompt: "لخص في نص علمي مراحل الرد المناعي مبرزا دور 4.",
              ...OFFICIAL(3, "س1 ت2 سؤال 2 صفحة 3"),
              placeholder: "المراحل...",
              minLength: 60,
              modelAnswer: "المراحل انتقاء لمي، تكاثر وتمايز بتحفيز LT4، تنفيذ بإفراز أجسام مضادة أو قتل خلوي.",
              rule: { prompt: "مراحل الرد المناعي", keywords: ["انتقاء", "تكاثر", "تنفيذ", "LT4"], minHits: 2, forbidden: [] }
            }
          }
        },
        {
          number: 3,
          ui: "text",
          label: "التركيب الضوئي — تجارب CO2 مشع وATP",
          max: 8,
          desc: "معلق صانعات خضراء، منحنيات ADP ATP O2",
          poles: {
            N: {
              points: 1,
              prompt: "معلومات الشكل 1 واسم الظاهرة ومعادلتها",
              bacPrompt: "استخرج المعلومات التي تقدمها نتائج تجربة الشكل (1) من الوثيقة 1. سم الظاهرة المدروسة في الشكل (1) من الوثيقة 1. اكتب المعادلة الإجمالية التي تعبر عن الظاهرة المدروسة.",
              ...OFFICIAL(3, "س1 ت3 سؤال أ ب ج صفحة 3"),
              placeholder: "المعلومات...",
              minLength: 50,
              modelAnswer: "الشكل 1 يبين دخول CO2 وخروج O2 وتركيب C6H12O6 في وجود ضوء، الظاهرة تركيب ضوئي، المعادلة 6CO2+6H2O→C6H12O6+6O2.",
              rule: { prompt: "معلومات تركيب ضوئي", keywords: ["CO2", "O2", "تركيب", "ضوئي"], minHits: 2, forbidden: [] }
            },
            S: {
              points: 1.5,
              prompt: "تحليل منحنى كمية CO2 المثبتة",
              bacPrompt: "حلل المنحنى وماذا تستنتج؟",
              ...OFFICIAL(3, "س1 ت3 سؤال 2 صفحة 3"),
              placeholder: "المنحنى يظهر...",
              minLength: 40,
              modelAnswer: "في الإضاءة كمية CO2 ثابتة، في الظلام تتناقص لأن التركيب الضوئي يتوقف.",
              rule: { prompt: "منحنى CO2", keywords: ["ضوء", "ظلام", "CO2"], minHits: 2, forbidden: [] }
            },
            E: {
              points: 3.5,
              prompt: "تفسير نتائج التجربتين 1 و2 وإبراز نواتج المرحلة",
              bacPrompt: "فسر النتائج التجريبية الممثلة بالشكل (1) من الوثيقة 2 مع إبراز نواتج المرحلة المعنية. لخص بمعادلات كيميائية مختلف التفاعلات التي تسمح بتشكيل نواتج هذه المرحلة.",
              ...OFFICIAL(4, "س1 ت3 سؤال II-1 صفحة 4"),
              placeholder: "التفسير...",
              minLength: 80,
              modelAnswer: "المرحلة الكيموضوئية تنتج ATP وNADPH وO2، إضاءة مثلى تزيد ATP وO2 وتنقص ADP ومستقبل e-.",
              rule: { prompt: "تفسير ATP NADPH", keywords: ["ATP", "NADPH", "ضوء", "O2"], minHits: 3, forbidden: [] }
            },
            W: {
              points: 2,
              prompt: "رسم تخطيطي وظيفي يبرز العلاقة بين مراحل الظاهرة",
              bacPrompt: "من خلال نتائج الدراسة السابقة ومعلوماتك المكتسبة أنجز رسما تخطيطيا وظيفيا تبرز فيه العلاقة بين مراحل الظاهرة المعنية في هذه الدراسة.",
              ...OFFICIAL(4, "س1 ت3 سؤال ختامي صفحة 4"),
              placeholder: "الرسم...",
              minLength: 60,
              modelAnswer: "الرسم يوضح مرحلة كيموضوئية في التيلاكويد تنتج ATP وNADPH تستعمل في حلقة كالفن في الحشوة لتركيب سكر.",
              rule: { prompt: "رسم علاقي تركيب ضوئي", keywords: ["تيلاكويد", "كالفن", "ATP", "سكر"], minHits: 2, forbidden: [] }
            }
          }
        }
      ]
    },
    {
      id: 2,
      pdf: null,
      pdfExternalUrl:
        "https://www.dzexams.com/uploads/sujets/officiels/bac/2017/dzexams-bac-sciences-2581269.pdf",
      pdfLocalUrl: "/subjects/SE/2017/sujet-2.pdf",
      pdfNote: "PDF local 4p = doc 5-8. Barème 05/07/08. Verbatim officiel pages 5-8.",
      title: "الموضوع الثاني",
      exercises: [
        {
          number: 1,
          ui: "text",
          label: "تحولات المادة والطاقة — الخلية النباتية والحيوانية",
          max: 5,
          desc: "العضيتين س ص، تصنيف الخليتين حسب نمط التغذية",
          poles: {
            N: {
              points: 1,
              prompt: "سم العضيتين س ص وصنف الخليتين",
              bacPrompt: "سم العضيتين (س، ص)، صنف الخليتين (أ) و (ب) حسب نمط التغذية.",
              ...OFFICIAL(5, "س2 ت1 سؤال 1 صفحة 5"),
              placeholder: "س ميتوكوندري...",
              minLength: 30,
              modelAnswer: "س ميتوكوندري، ص صانعة خضراء، أ ذاتية التغذية، ب غير ذاتية.",
              rule: { prompt: "عضيتين وتصنيف", keywords: ["ميتوكوندري", "صانعة", "ذاتية"], minHits: 2, forbidden: [] }
            },
            S: {
              points: 1.5,
              prompt: "استخراج ما يحدث في الخلية أ وعلاقته بما يحدث في ب",
              bacPrompt: "مستغلا الوثيقة استخرج ما يحدث في الخلية (أ) وعلاقته بما يحدث في الخلية (ب) من حيث التحولات الطاقوية مدعما إجابتك بمعادلات كيميائية إجمالية.",
              ...OFFICIAL(5, "س2 ت1 سؤال 2 صفحة 5"),
              placeholder: "الخلية أ...",
              minLength: 50,
              modelAnswer: "أ تقوم بتركيب ضوئي ينتج مادة عضوية وO2 تستعملها ب في التنفس لإنتاج ATP.",
              rule: { prompt: "علاقة أ و ب طاقوية", keywords: ["تركيب", "تنفس", "ATP", "O2"], minHits: 2, forbidden: [] }
            },
            E: {
              points: 1.5,
              prompt: "استعمال ATP في الخلية",
              bacPrompt: "تستعمل الخلايا الحية جزيئات الـ ATP للقيام بوظائفها المختلفة، من خلال ما تقدم ومعلوماتك اكتب نصا علميا توضح فيه ترافق تحولات المادة والطاقة عند الخلية (ب) مبرزا أهم النشاطات التي تستهلك فيها الطاقة.",
              ...OFFICIAL(5, "س2 ت1 سؤال 3 صفحة 5"),
              placeholder: "ATP...",
              minLength: 60,
              modelAnswer: "التنفس يحول طاقة كيميائية كامنة في المادة العضوية إلى ATP يستعمل في نقل نشط وتركيب وحركة.",
              rule: { prompt: "نص ATP ونشاطات", keywords: ["ATP", "تنفس", "نشط", "تركيب"], minHits: 2, forbidden: [] }
            },
            W: {
              points: 1,
              prompt: "رسم تحولات المادة والطاقة عند الخلية ب",
              bacPrompt: "ارسم مخططا يوضح تحولات المادة والطاقة عند الخلية (ب).",
              ...OFFICIAL(5, "س2 ت1 سؤال رسم صفحة 5"),
              placeholder: "رسم...",
              minLength: 40,
              modelAnswer: "الرسم يوضح دخول غلوكوز وO2 إلى ميتوكوندري، خروج CO2 وATP، استعمال ATP في وظائف الخلية.",
              rule: { prompt: "رسم تحولات ب", keywords: ["غلوكوز", "ميتوكوندري", "ATP", "CO2"], minHits: 2, forbidden: [] }
            }
          }
        },
        {
          number: 2,
          ui: "text",
          label: "النقل المشبكي — كمون عمل وتيارات شوارد",
          max: 7,
          desc: "الوثيقة 1 تسجيل أ و ب، الوثيقة 2 عدد قنوات مفتوحة",
          poles: {
            N: {
              points: 1,
              prompt: "سم التسجيلين أ و ب",
              bacPrompt: "سم التسجيلين (أ)، (ب).",
              ...OFFICIAL(6, "س2 ت2 سؤال 1-أ صفحة 6"),
              placeholder: "أ كمون عمل...",
              minLength: 30,
              modelAnswer: "أ كمون عمل، ب تيارات شوارد داخلة وخارجة عبر الغشاء.",
              rule: { prompt: "تسمية تسجيلين", keywords: ["كمون", "تيار", "عمل"], minHits: 2, forbidden: [] }
            },
            S: {
              points: 1.5,
              prompt: "حلّل التسجيلين واستنتج العلاقة",
              bacPrompt: "حلل التسجيلين (أ)، (ب) واستنتج العلاقة بينهما.",
              ...OFFICIAL(6, "س2 ت2 سؤال 1-ب صفحة 6"),
              placeholder: "التحليل...",
              minLength: 40,
              modelAnswer: "التسجيل أ يظهر زوال استقطاب ثم عودة، ب يظهر تيار داخلي Na+ يسبب زوال استقطاب ثم خارجي K+ يعيد الاستقطاب.",
              rule: { prompt: "تحليل وعلاقة", keywords: ["Na", "K", "استقطاب", "تيار"], minHits: 2, forbidden: [] }
            },
            E: {
              points: 2.5,
              prompt: "ترجمة نتائج جدول عدد القنوات إلى منحنيين",
              bacPrompt: "ترجم نتائج الجدول إلى منحنيين على نفس المعلم. أوجد العلاقة بين المنحنيين والتسجيلين (أ) و (ب) من الوثيقة 1. حدد نمطي القنوات المقصودة في هذه الدراسة ومصدر كل تيار.",
              ...OFFICIAL(6, "س2 ت2 سؤال 2-أ ب ج صفحة 6"),
              placeholder: "المنحنيان...",
              minLength: 70,
              modelAnswer: "قنوات النمط 1 تفتح مبكرا مسؤولة عن تيار Na+ الداخل، النمط 2 متأخرة مسؤولة عن K+ الخارج، تفسر كمون العمل.",
              rule: { prompt: "قنوات Na K", keywords: ["قنوات", "Na", "K", "كمون"], minHits: 3, forbidden: [] }
            },
            W: {
              points: 2,
              prompt: "دور البروتينات المدروسة في نقل المعلومة العصبية قبل المشبك",
              bacPrompt: "وضح دور البروتينات المدروسة في نقل المعلومة العصبية عند إحداث تنبيه فعال على مستوى الخلية قبل المشبكية.",
              ...OFFICIAL(7, "س2 ت2 سؤال II-2 صفحة 7"),
              placeholder: "الدور...",
              minLength: 50,
              modelAnswer: "البروتينات قنوات فولطية تسمح بدخول Na+ وخروج K+ فتتولد كمون عمل ينتقل إلى النهاية المحورية.",
              rule: { prompt: "دور قنوات في نقل", keywords: ["قنوات", "فولطية", "كمون", "عصبية"], minHits: 2, forbidden: [] }
            }
          }
        },
        {
          number: 3,
          ui: "text",
          label: "Xéroderma pigmentosum وإنزيم XPA",
          max: 8,
          desc: "جدول ADN وXPA سليم ومريض، 215 حمض أميني",
          poles: {
            N: {
              points: 1,
              prompt: "تعرف على البرنامج المقدم به جدول الوثيقة 1 وحدد الغرض",
              bacPrompt: "تعرف على البرنامج الذي قدم به جدول الوثيقة 1. حدد الغرض من استعماله.",
              ...OFFICIAL(7, "س2 ت3 سؤال 1 صفحة 7"),
              placeholder: "البرنامج Anagène...",
              minLength: 30,
              modelAnswer: "البرنامج Anagène لمقارنة تسلسلات نكليوتيدية وأحماض أمينية لاستخراج طفرة.",
              rule: { prompt: "Anagène", keywords: ["Anagène", "مقارنة", "تسلسل"], minHits: 2, forbidden: [] }
            },
            S: {
              points: 2,
              prompt: "أعط تتالي نكليوتيدات ARNm عند الشخصين وأنجز جدولا للشفرة",
              bacPrompt: "أعط تتالي نكليوتيدات الـ ARNm عند الشخصين وأنجز جدولا للشفرة الوراثية انطلاقا من معطيات الوثيقة 1.",
              ...OFFICIAL(7, "س2 ت3 سؤال 2 صفحة 7"),
              placeholder: "ARNm...",
              minLength: 50,
              modelAnswer: "ARNm سليم AUG...، مريض AUG... مع طفرة، جدول الشفرة يوضح كودونات.",
              rule: { prompt: "ARNm وجدول شفرة", keywords: ["ARNm", "كودون", "شفرة"], minHits: 2, forbidden: [] }
            },
            E: {
              points: 3,
              prompt: "نوع الطفرة وآثارها على البروتين",
              bacPrompt: "استخرج نوع الطفرة وحدد آثارها على البروتين ووظيفته وعلاقتها بالمرض.",
              ...OFFICIAL(7, "س2 ت3 سؤال 3 صفحة 7"),
              placeholder: "الطفرة...",
              minLength: 70,
              modelAnswer: "طفرة حذف/استبدال تؤدي إلى بروتين قصير غير وظيفي، فلا يصحح أخطاء ADN الناتجة عن UV فيتسبب Xeroderma.",
              rule: { prompt: "طفرة ومرض", keywords: ["طفرة", "XPA", "UV", "ADN"], minHits: 3, forbidden: [] }
            },
            W: {
              points: 2,
              prompt: "نص علمي آلية إصلاح ADN ودور XPA",
              bacPrompt: "بين في نص علمي آلية إصلاح ADN ودور الإنزيم XPA في الحفاظ على سلامة المعلومة الوراثية.",
              ...OFFICIAL(7, "س2 ت3 سؤال ختامي صفحة 7"),
              placeholder: "الآلية...",
              minLength: 60,
              modelAnswer: "آلية الإصلاح بالاستئصال، XPA يتعرف على الضرر ويجند إنزيمات تقطع وتعيد تركيب ADN سليم.",
              rule: { prompt: "إصلاح ADN", keywords: ["إصلاح", "استئصال", "XPA", "ADN"], minHits: 2, forbidden: [] }
            }
          }
        }
      ]
    }
  ]
};

export { YEAR_2017_SE };
export default YEAR_2017_SE;
