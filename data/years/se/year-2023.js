/* 2023 — Sciences expérimentales. Données extraites du catalogue historique sans modifier les champs de contenu ni de provenance.
 * Chargé à la demande par data/subjects.js.
 */
const YEAR_2023_SE = {
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
              prompt: "تأطير الإشكالية: كيف تعمل البروتينات الغشائية في المشبك وما أثر ذيفان الكزاز عليها؟",
              bacPrompt:
                "كيف تتدخل مختلف البروتينات الغشائية في عمل المشبك، وما أثر ذيفان الكزاز على هذا العمل؟",
              bacPromptSource: "reconstructed",
              bacPromptNotes:
                "Pas de question officielle autonome de type « حدد المشكل ». Reformulation pédagogique du préambule page 1.",
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
              bacPromptSource: "official",
              bacPromptPage: 1,
              bacPromptVerifiedAt: "2026-08-25",
              bacPromptNotes:
                "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : سمّ. Question 1 du التمرين الأول (Sujet 1).",
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
              bacPromptSource: "official",
              bacPromptPage: 1,
              bacPromptVerifiedAt: "2026-08-25",
              bacPromptNotes:
                "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : بيّن. Question 2 (texte scientifique structuré) du التمرين الأول.",
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
              bacPromptSource: "reconstructed",
              bacPromptNotes:
                "La clôture est incluse dans le texte scientifique officiel (pôle E). Ce pôle isole pédagogiquement la clôture, ce n'est pas une question BAC autonome.",
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
              bacPromptSource: "reconstructed",
              bacPromptNotes:
                "Pas de question officielle autonome de type « حدد المشكل ». Reformulation pédagogique du préambule.",
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
              bacPromptSource: "official",
              bacPromptPage: 2,
              bacPromptVerifiedAt: "2026-08-25",
              bacPromptNotes:
                "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : قارن. Question 1 du الجزء الأول. Consigne « حلّل منحنى الشكل (ب) من الوثيقة 1 » (question 2 du même الجزء) non mappée (un pôle = une consigne).",
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
                    {
                      about: "علاج",
                      expect: ["انخفاض", "ينخفض"]
                    },
                    {
                      about: "غياب",
                      expect: ["ارتفاع", "يرتفع"]
                    }
                  ],
                  relations: [
                    {
                      type: "inverse",
                      a: "علاج",
                      b: "معدل"
                    }
                  ],
                  values: [],
                  strictValues: false
                }
              }
            },
            E: {
              points: 2.5,
              prompt: "تبرير أهمية استعمال دواء ML901",
              bacPrompt: "برّر أهمية استعمال دواء ML901 انطلاقا من معلوماتك ونتائج الوثيقتين 2 و3.",
              bacPromptSource: "official",
              bacPromptPage: 2,
              bacPromptVerifiedAt: "2026-08-25",
              bacPromptNotes:
                "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : برّر. Question du الجزء الثاني.",
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
              bacPromptSource: "reconstructed",
              bacPromptNotes:
                "La clôture est incluse dans le justificatif officiel (pôle E). Pas une question BAC autonome.",
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
              bacPrompt: "اقترح فرضيتين للحد من تطور سرطان الثدي باستغلال معلوماتك ونتائج شكلي الوثيقة 1.",
              bacPromptSource: "official",
              bacPromptPage: 3,
              bacPromptVerifiedAt: "2026-08-25",
              bacPromptNotes:
                "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : اقترح فرضيتين. Question unique du الجزء الأول.",
              placeholder: "فرضية 1، فرضية 2...",
              minLength: 30,
              modelAnswer:
                "الفرضية 1: مادة تثبط عمل أنزيم الأروماتاز فتمنع تركيب الأستراديول ولا تتكاثر الخلايا السرطانية. الفرضية 2: مادة تثبت على مستقبلات الأستراديول فتمنع تحفيز تكاثر الخلايا السرطانية.",
              rule: {
                prompt: "اقترح فرضيتين للحد من سرطان الثدي",
                keywords: ["فرضيه", "استراديول", "تكاثر"],
                minHits: 1,
                forbidden: [],
                hypotheses: {
                  min: 2,
                  distinct: true
                }
              }
            },
            S: {
              points: 2,
              prompt: "استغلال الوثيقة 1: تكاثر الخلايا بدلالة الأستراديول ودور البروتينات",
              bacPrompt:
                "استغل شكلي الوثيقة 1: تكاثر الخلايا السرطانية بدلالة تراكيز الأستراديول، ودور مستقبل الأستراديول وأنزيم الأروماتاز في هذا التكاثر.",
              bacPromptSource: "reconstructed",
              bacPromptNotes:
                "La page 3 décrit les figures (أ) et (ب) mais la seule consigne écrite est « اقترح فرضيتين ». L'exploitation chiffrée est une étape pédagogique, pas une question officielle autonome.",
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
                  trends: [
                    {
                      about: "بعد",
                      expect: ["ارتفاع", "يرتفع"]
                    }
                  ],
                  values: [],
                  strictValues: false
                }
              }
            },
            E: {
              points: 4,
              prompt: "مناقشة صحة الفرضيتين وتقديم نصيحة",
              bacPrompt:
                "ناقش صحة الفرضيتين المقترحتين اعتمادا على معلوماتك ونتائج الوثيقتين 2 و3، ثم قدّم نصيحة للوقاية من سرطان الثدي.",
              bacPromptSource: "official",
              bacPromptPage: 4,
              bacPromptVerifiedAt: "2026-08-25",
              bacPromptNotes:
                "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : ناقش. Question du الجزء الثاني (la نصيحة finale est incluse dans la même consigne).",
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
              bacPromptSource: "official",
              bacPromptPage: 4,
              bacPromptVerifiedAt: "2026-08-25",
              bacPromptNotes:
                "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : لخّص في مخطط. Question du الجزء الثالث.",
              placeholder: "أستراديول → تكاثر → ورم؛ وفي وجود الكيرسيتين...",
              minLength: 0,
              modelAnswer:
                "عنوان المخطط: تطور الورم السرطاني. أستراديول → مستقبله → تكاثر الخلايا السرطانية → نمو الورم، وفي وجود الكيرسيتين يتوقف التكاثر ويتراجع الورم.",
              rule: {
                prompt: "لخص في مخطط تطور الورم",
                keywords: ["مخطط", "ورم", "كيرسيتين"],
                minHits: 1,
                forbidden: [],
                schema: {
                  arrows: true,
                  title: "تطور الورم",
                  ordered: ["استراديول", "تكاثر", "كيرسيتين"]
                }
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
              bacPromptSource: "reconstructed",
              bacPromptNotes:
                "Pas de question officielle autonome de type « حدد المشكل ». Reformulation pédagogique du préambule.",
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
              bacPromptSource: "official",
              bacPromptPage: 5,
              bacPromptVerifiedAt: "2026-08-25",
              bacPromptNotes:
                "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : اختر العبارة الصحيحة. Question 1 (QCM à 4 items : جسور ثنائية الكبريت، الروابط بين أحماض أمينية، ARNm، ADN).",
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
              bacPromptSource: "official",
              bacPromptPage: 5,
              bacPromptVerifiedAt: "2026-08-25",
              bacPromptNotes:
                "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : أبرز. Question 2 (texte scientifique structuré).",
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
              bacPromptSource: "reconstructed",
              bacPromptNotes:
                "La clôture est incluse dans le texte scientifique officiel (pôle E). Pas une question BAC autonome.",
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
              bacPromptSource: "reconstructed",
              bacPromptNotes:
                "Pas de question officielle autonome de type « حدد المشكل ». Reformulation pédagogique du préambule.",
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
              bacPromptSource: "official",
              bacPromptPage: 6,
              bacPromptVerifiedAt: "2026-08-25",
              bacPromptNotes:
                "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : قدّم تحليلا مقارنا. Question 1 du الجزء الأول. Consigne « برّر الاختلاف بين بنية غشاء LTc والخلايا المصابة » (question 2) non mappée (un pôle = une consigne).",
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
                  trends: [
                    {
                      about: "LTc",
                      expect: ["كوليسترول", "اعلي"]
                    }
                  ],
                  relations: [
                    {
                      type: "parallel",
                      a: "LTc",
                      b: "مصابه"
                    }
                  ],
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
              bacPromptSource: "official",
              bacPromptPage: 6,
              bacPromptVerifiedAt: "2026-08-25",
              bacPromptNotes:
                "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : اشرح. Question du الجزء الثاني.",
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
              bacPromptSource: "reconstructed",
              bacPromptNotes:
                "La clôture est incluse dans l'explication officielle (pôle E). Pas une question BAC autonome.",
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
              bacPromptSource: "official",
              bacPromptPage: 7,
              bacPromptVerifiedAt: "2026-08-25",
              bacPromptNotes:
                "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : اقترح فرضيتين. Question unique du الجزء الأول.",
              placeholder: "فرضية 1، فرضية 2...",
              minLength: 30,
              modelAnswer:
                "الفرضية 1: يثبط DCMU أكسدة الماء (النظام الضوئي الثاني) فيتوقف تحرر الإلكترونات. الفرضية 2: يمنع DCMU انتقال الإلكترونات نحو الناقل الأول T1 فتتوقف السلسلة التركيبية الضوئية.",
              rule: {
                prompt: "اقترح فرضيتين حول تأثير DCMU",
                keywords: ["فرضيه", "DCMU", "ضوء"],
                minHits: 1,
                forbidden: [],
                hypotheses: {
                  min: 2,
                  distinct: true
                }
              }
            },
            S: {
              points: 2,
              prompt: "استغلال الوثيقة 1: تحرر O2 واختزال DCPIP في الضوء والظلام",
              bacPrompt:
                "استغل أشكال الوثيقة 1: نسبة الأكسجين المطروح واختزال DCPIP بدلالة الزمن في وجود الضوء وفي الظلام وبدلالة تراكيز DCMU.",
              bacPromptSource: "reconstructed",
              bacPromptNotes:
                "La page 7 décrit les figures (أ/ب/ج) mais la seule consigne écrite est « اقترح فرضيتين ». L'exploitation chiffrée est une étape pédagogique, pas une question officielle autonome.",
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
                  trends: [
                    {
                      about: "ضوء",
                      expect: ["ارتفاع", "يرتفع"]
                    }
                  ],
                  relations: [
                    {
                      type: "inverse",
                      a: "DCMU",
                      b: "اكسجين"
                    }
                  ],
                  values: [],
                  strictValues: false
                }
              }
            },
            E: {
              points: 4,
              prompt: "مناقشة صحة إحدى الفرضيتين",
              bacPrompt:
                "ناقش صحة إحدى الفرضيتين المقترحتين مستغلا معلوماتك والنتائج الممثلة في أشكال الوثيقة 2.",
              bacPromptSource: "official",
              bacPromptPage: 9,
              bacPromptVerifiedAt: "2026-08-25",
              bacPromptNotes:
                "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : ناقش. Question 1 du الجزء الثاني. Consigne « قدّم نصيحة للمزارعين » (question 2 du même الجزء) non mappée (un pôle = une consigne).",
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
              bacPromptSource: "official",
              bacPromptPage: 11,
              bacPromptVerifiedAt: "2026-08-25",
              bacPromptNotes:
                "Relecture du PDF dzexams 2023 (couche texte inversée, reconstituée). Verbe officiel : حوّل في رسم تخطيطي. Question du الجزء الثالث.",
              placeholder: "ضوء → PSII → إلكترونات → T1 → H⁺...",
              minLength: 0,
              modelAnswer:
                "عنوان المخطط: تحويل الطاقة الضوئية. في غياب DCMU: ضوء → PSII → أكسدة الماء → إلكترونات → الناقل T1 → خض H⁺ إلى جوف التيلاكوئيد. في وجود DCMU: يثبت المبيد على PSII فيتوقف انتقال الإلكترونات إلى T1 وتتوقف أكسدة الماء.",
              rule: {
                prompt: "حول في رسم تخطيطي آليات تحويل الطاقة",
                keywords: ["ضوء", "PSII", "DCMU"],
                minHits: 1,
                forbidden: [],
                schema: {
                  arrows: true,
                  title: "تحويل الطاقة",
                  ordered: ["ضوء", "PSII", "الكترون"]
                }
              }
            }
          }
        }
      ]
    }
  ],
  stream: "se",
  calendarYear: "2023"
};

export { YEAR_2023_SE };
export default YEAR_2023_SE;
