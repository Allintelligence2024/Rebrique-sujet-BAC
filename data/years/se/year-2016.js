/* ============================================================
   BAC SVT Algérie 2016 — archive pédagogique reconstruite
   ------------------------------------------------------------
   Aucune consigne n'est marquée official. Les champs de provenance
   restent attachés à chaque pôle. Chargé à la demande par le shell.
   ============================================================ */

const RECON = (notes) => ({
  bacPromptSource: "reconstructed",
  bacPromptNotes: notes
});

const YEAR_2016_SE = {
  id: "2016",
  stream: "se",
  calendarYear: "2016",
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
              modelAnswer: "في الختام، ترتبط النتيجة النهائية بـ استنساخ وبوليميراز فتُغلق الظاهرة على نواه.",
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
              modelAnswer: "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ التخمر والتنفس في الظاهرة المدروسة؟",
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
};

export { YEAR_2016_SE };
export default YEAR_2016_SE;
