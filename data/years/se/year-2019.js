/* ============================================================
   BAC SVT Algérie 2019 — archive pédagogique reconstruite
   ------------------------------------------------------------
   Aucune consigne n'est marquée official. Les champs de provenance
   restent attachés à chaque pôle. Chargé à la demande par le shell.
   ============================================================ */

const RECON = (notes) => ({
  bacPromptSource: "reconstructed",
  bacPromptNotes: notes
});

const YEAR_2019_SE = {
  id: "2019",
  stream: "se",
  calendarYear: "2019",
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
};

export { YEAR_2019_SE };
export default YEAR_2019_SE;
