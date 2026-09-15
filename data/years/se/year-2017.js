/* ============================================================
   BAC SVT Algérie 2017 — archive pédagogique reconstruite
   ------------------------------------------------------------
   Aucune consigne n'est marquée official. Les champs de provenance
   restent attachés à chaque pôle. Chargé à la demande par le shell.
   ============================================================ */

const RECON = (notes) => ({
  bacPromptSource: "reconstructed",
  bacPromptNotes: notes
});

const YEAR_2017_SE = {
  id: "2017",
  stream: "se",
  calendarYear: "2017",
  label: "بكالوريا الجزائر دورة 2017",
  badge: "أرشيف مُعاد بناؤه",
  theme: "rose",
  enabled: true,
  sujets: [
    {
      id: 1,
      pdf: null,
      pdfAvailable: false,
      pdfExternalUrl:
        "https://www.dzexams.com/uploads/sujets/officiels/bac/2017/dzexams-bac-sciences-2581269.pdf",
      pdfLocalUrl: "/subjects/SE/2017/sujet-1.pdf",
      pdfNote:
        "PDF non redistribué dans le dépôt. Page dzexams : https://www.dzexams.com/ar/annales/dFRNWk1JWkt2aC8vdFZtZVNMWGRwZz09. Session normale 2017. PDF dzexams محمي في العارض. Thèmes pédagogiques reconstruits.",
      title: "الموضوع الأول",
      exercises: [
        {
          number: 1,
          ui: "text",
          label: "الشفرة الوراثية والترجمة",
          max: 5,
          desc: "علاقة الرامزة بتتابع الأحماض الأمينية أثناء الترجمة",
          poles: {
            N: {
              points: 1,
              prompt: "تأطير الإشكالية حول: الشفرة الوراثية والترجمة",
              bacPrompt: "ما المشكل العلمي المرتبط بـ الشفرة الوراثية والترجمة؟",
              ...RECON(
                "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
              ),
              placeholder: "صياغة المشكل العلمي...",
              minLength: 40,
              modelAnswer:
                "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ الشفرة الوراثية والترجمة في الظاهرة المدروسة؟",
              answerStatus: "synthetic",
              rule: {
                prompt: "تأطير الإشكالية حول: الشفرة الوراثية والترجمة",
                keywords: ["رامزة", "ترجمة"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 1,
              prompt: "استغلال الوثيقة المتعلقة بـ الشفرة الوراثية والترجمة",
              bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ الشفرة الوراثية والترجمة.",
              ...RECON(
                "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
              ),
              placeholder: "نلاحظ... بينما... ومنه نستنتج...",
              minLength: 40,
              modelAnswer:
                "تمثل الوثيقة تغيرات رامزة بدلالة الزمن مقارنة بـ ترجمة. نلاحظ تغيرا واضحا في رامزة مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع ترجمة.",
              answerStatus: "synthetic",
              rule: {
                prompt: "استغلال الوثيقة المتعلقة بـ الشفرة الوراثية والترجمة",
                keywords: ["رامزة", "ترجمة", "نلاحظ"],
                minHits: 2,
                forbidden: ["بسبب"],
                document: {
                  kind: "curve",
                  axes: ["رامزة", "زمن"],
                  comparisons: [["رامزة", "ترجمة"]],
                  trends: [{ about: "رامزة", expect: ["رامزة", "ترجمة"] }],
                  values: [],
                  strictValues: false
                }
              }
            },
            E: {
              points: 2,
              prompt: "تفسير الآلية المرتبطة بـ الشفرة الوراثية والترجمة",
              bacPrompt: "اشرح الآلية التي تفسر الشفرة الوراثية والترجمة انطلاقا من الوثيقة ومعلوماتك.",
              ...RECON(
                "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
              ),
              placeholder: "يعود ذلك إلى...",
              minLength: 120,
              modelAnswer:
                "يعود ذلك إلى تدخل رامزة وترجمة عبر آلية دقيقة تؤدي إلى ARNm، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
              answerStatus: "synthetic",
              rule: {
                prompt: "تفسير الآلية المرتبطة بـ الشفرة الوراثية والترجمة",
                keywords: ["رامزة", "ترجمة", "ARNm"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1,
              prompt: "الخاتمة التركيبية حول الشفرة الوراثية والترجمة",
              bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ الشفرة الوراثية والترجمة.",
              ...RECON(
                "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
              ),
              placeholder: "في الختام...",
              minLength: 40,
              modelAnswer: "في الختام، ترتبط النتيجة النهائية بـ رامزة وترجمة فتُغلق الظاهرة على ARNm.",
              answerStatus: "synthetic",
              rule: {
                prompt: "الخاتمة التركيبية حول الشفرة الوراثية والترجمة",
                keywords: ["رامزة", "ARNm", "ختام"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 2,
          ui: "text",
          label: "البنية الفراغية للبروتين",
          max: 7,
          desc: "الروابط المسؤولة عن ثبات البنية الفراغية وأثر الطفرة",
          poles: {
            N: {
              points: 1,
              prompt: "تأطير الإشكالية حول: البنية الفراغية للبروتين",
              bacPrompt: "ما المشكل العلمي المرتبط بـ البنية الفراغية للبروتين؟",
              ...RECON(
                "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
              ),
              placeholder: "صياغة المشكل العلمي...",
              minLength: 40,
              modelAnswer:
                "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ البنية الفراغية للبروتين في الظاهرة المدروسة؟",
              answerStatus: "synthetic",
              rule: {
                prompt: "تأطير الإشكالية حول: البنية الفراغية للبروتين",
                keywords: ["بنية", "روابط"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2.5,
              prompt: "استغلال الوثيقة المتعلقة بـ البنية الفراغية للبروتين",
              bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ البنية الفراغية للبروتين.",
              ...RECON(
                "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
              ),
              placeholder: "نلاحظ... بينما... ومنه نستنتج...",
              minLength: 90,
              modelAnswer:
                "تمثل الوثيقة تغيرات بنية بدلالة الزمن مقارنة بـ روابط. نلاحظ تغيرا واضحا في بنية مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع روابط.",
              answerStatus: "synthetic",
              rule: {
                prompt: "استغلال الوثيقة المتعلقة بـ البنية الفراغية للبروتين",
                keywords: ["بنية", "روابط", "نلاحظ"],
                minHits: 2,
                forbidden: ["بسبب"],
                document: {
                  kind: "curve",
                  axes: ["بنية", "زمن"],
                  comparisons: [["بنية", "روابط"]],
                  trends: [{ about: "بنية", expect: ["بنية", "روابط"] }],
                  values: [],
                  strictValues: false
                }
              }
            },
            E: {
              points: 2.5,
              prompt: "تفسير الآلية المرتبطة بـ البنية الفراغية للبروتين",
              bacPrompt: "اشرح الآلية التي تفسر البنية الفراغية للبروتين انطلاقا من الوثيقة ومعلوماتك.",
              ...RECON(
                "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
              ),
              placeholder: "يعود ذلك إلى...",
              minLength: 110,
              modelAnswer:
                "يعود ذلك إلى تدخل بنية وروابط عبر آلية دقيقة تؤدي إلى طفرة، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
              answerStatus: "synthetic",
              rule: {
                prompt: "تفسير الآلية المرتبطة بـ البنية الفراغية للبروتين",
                keywords: ["بنية", "روابط", "طفرة"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1,
              prompt: "الخاتمة التركيبية حول البنية الفراغية للبروتين",
              bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ البنية الفراغية للبروتين.",
              ...RECON(
                "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
              ),
              placeholder: "في الختام...",
              minLength: 40,
              modelAnswer: "في الختام، ترتبط النتيجة النهائية بـ بنية وروابط فتُغلق الظاهرة على طفرة.",
              answerStatus: "synthetic",
              rule: {
                prompt: "الخاتمة التركيبية حول البنية الفراغية للبروتين",
                keywords: ["بنية", "طفرة", "ختام"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 3,
          ui: "text",
          label: "المرحلة الكيميائية الضوئية",
          max: 8,
          desc: "تحويل الطاقة الضوئية على مستوى التيلاكوئيد وطرح O2",
          poles: {
            N: {
              points: 0.5,
              prompt: "تأطير الإشكالية حول: المرحلة الكيميائية الضوئية",
              bacPrompt: "ما المشكل العلمي المرتبط بـ المرحلة الكيميائية الضوئية؟",
              ...RECON(
                "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
              ),
              placeholder: "صياغة المشكل العلمي...",
              minLength: 30,
              modelAnswer:
                "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ المرحلة الكيميائية الضوئية في الظاهرة المدروسة؟",
              answerStatus: "synthetic",
              rule: {
                prompt: "تأطير الإشكالية حول: المرحلة الكيميائية الضوئية",
                keywords: ["تيلاكوئيد", "ضوء"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2,
              prompt: "استغلال الوثيقة المتعلقة بـ المرحلة الكيميائية الضوئية",
              bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ المرحلة الكيميائية الضوئية.",
              ...RECON(
                "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
              ),
              placeholder: "نلاحظ... بينما... ومنه نستنتج...",
              minLength: 60,
              modelAnswer:
                "تمثل الوثيقة تغيرات تيلاكوئيد بدلالة الزمن مقارنة بـ ضوء. نلاحظ تغيرا واضحا في تيلاكوئيد مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع ضوء.",
              answerStatus: "synthetic",
              rule: {
                prompt: "استغلال الوثيقة المتعلقة بـ المرحلة الكيميائية الضوئية",
                keywords: ["تيلاكوئيد", "ضوء", "نلاحظ"],
                minHits: 2,
                forbidden: ["بسبب"],
                document: {
                  kind: "curve",
                  axes: ["تيلاكوئيد", "زمن"],
                  comparisons: [["تيلاكوئيد", "ضوء"]],
                  trends: [{ about: "تيلاكوئيد", expect: ["تيلاكوئيد", "ضوء"] }],
                  values: [],
                  strictValues: false
                }
              }
            },
            E: {
              points: 4,
              prompt: "تفسير الآلية المرتبطة بـ المرحلة الكيميائية الضوئية",
              bacPrompt: "اشرح الآلية التي تفسر المرحلة الكيميائية الضوئية انطلاقا من الوثيقة ومعلوماتك.",
              ...RECON(
                "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
              ),
              placeholder: "يعود ذلك إلى...",
              minLength: 110,
              modelAnswer:
                "يعود ذلك إلى تدخل تيلاكوئيد وضوء عبر آلية دقيقة تؤدي إلى أكسجين، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
              answerStatus: "synthetic",
              rule: {
                prompt: "تفسير الآلية المرتبطة بـ المرحلة الكيميائية الضوئية",
                keywords: ["تيلاكوئيد", "ضوء", "أكسجين"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1.5,
              prompt: "الخاتمة التركيبية حول المرحلة الكيميائية الضوئية",
              bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ المرحلة الكيميائية الضوئية.",
              ...RECON(
                "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
              ),
              placeholder: "تيلاكوئيد → ضوء → أكسجين",
              minLength: 40,
              modelAnswer: "عنوان المخطط: تيلاكوئيد. تيلاكوئيد → ضوء → أكسجين.",
              answerStatus: "synthetic",
              rule: {
                prompt: "الخاتمة التركيبية حول المرحلة الكيميائية الضوئية",
                keywords: ["مخطط", "تيلاكوئيد", "أكسجين"],
                minHits: 2,
                forbidden: [],
                schema: { arrows: true, title: "تيلاكوئيد", ordered: ["تيلاكوئيد", "ضوء", "أكسجين"] }
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
        "https://www.dzexams.com/uploads/sujets/officiels/bac/2017/dzexams-bac-sciences-2581269.pdf",
      pdfLocalUrl: "/subjects/SE/2017/sujet-2.pdf",
      pdfNote:
        "PDF non redistribué dans le dépôt. Page dzexams : https://www.dzexams.com/ar/annales/dFRNWk1JWkt2aC8vdFZtZVNMWGRwZz09. Session normale 2017. PDF dzexams محمي في العارض. Thèmes pédagogiques reconstruits.",
      title: "الموضوع الثاني",
      exercises: [
        {
          number: 1,
          ui: "text",
          label: "الذات واللاذات",
          max: 5,
          desc: "دور CMH والمستضدات الغشائية في تمييز الذات",
          poles: {
            N: {
              points: 1,
              prompt: "تأطير الإشكالية حول: الذات واللاذات",
              bacPrompt: "ما المشكل العلمي المرتبط بـ الذات واللاذات؟",
              ...RECON(
                "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
              ),
              placeholder: "صياغة المشكل العلمي...",
              minLength: 40,
              modelAnswer: "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ الذات واللاذات في الظاهرة المدروسة؟",
              answerStatus: "synthetic",
              rule: {
                prompt: "تأطير الإشكالية حول: الذات واللاذات",
                keywords: ["CMH", "ذات"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 1,
              prompt: "استغلال الوثيقة المتعلقة بـ الذات واللاذات",
              bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ الذات واللاذات.",
              ...RECON(
                "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
              ),
              placeholder: "نلاحظ... بينما... ومنه نستنتج...",
              minLength: 40,
              modelAnswer:
                "تمثل الوثيقة تغيرات CMH بدلالة الزمن مقارنة بـ ذات. نلاحظ تغيرا واضحا في CMH مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع ذات.",
              answerStatus: "synthetic",
              rule: {
                prompt: "استغلال الوثيقة المتعلقة بـ الذات واللاذات",
                keywords: ["CMH", "ذات", "نلاحظ"],
                minHits: 2,
                forbidden: ["بسبب"],
                document: {
                  kind: "curve",
                  axes: ["CMH", "زمن"],
                  comparisons: [["CMH", "ذات"]],
                  trends: [{ about: "CMH", expect: ["CMH", "ذات"] }],
                  values: [],
                  strictValues: false
                }
              }
            },
            E: {
              points: 2,
              prompt: "تفسير الآلية المرتبطة بـ الذات واللاذات",
              bacPrompt: "اشرح الآلية التي تفسر الذات واللاذات انطلاقا من الوثيقة ومعلوماتك.",
              ...RECON(
                "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
              ),
              placeholder: "يعود ذلك إلى...",
              minLength: 120,
              modelAnswer:
                "يعود ذلك إلى تدخل CMH وذات عبر آلية دقيقة تؤدي إلى لاذات، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
              answerStatus: "synthetic",
              rule: {
                prompt: "تفسير الآلية المرتبطة بـ الذات واللاذات",
                keywords: ["CMH", "ذات", "لاذات"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1,
              prompt: "الخاتمة التركيبية حول الذات واللاذات",
              bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ الذات واللاذات.",
              ...RECON(
                "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
              ),
              placeholder: "في الختام...",
              minLength: 40,
              modelAnswer: "في الختام، ترتبط النتيجة النهائية بـ CMH وذات فتُغلق الظاهرة على لاذات.",
              answerStatus: "synthetic",
              rule: {
                prompt: "الخاتمة التركيبية حول الذات واللاذات",
                keywords: ["CMH", "لاذات", "ختام"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 2,
          ui: "text",
          label: "تأثير pH على النشاط الأنزيمي",
          max: 7,
          desc: "تغير شحنات الموقع الفعال بدلالة pH الوسط",
          poles: {
            N: {
              points: 1,
              prompt: "تأطير الإشكالية حول: تأثير pH على النشاط الأنزيمي",
              bacPrompt: "ما المشكل العلمي المرتبط بـ تأثير pH على النشاط الأنزيمي؟",
              ...RECON(
                "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
              ),
              placeholder: "صياغة المشكل العلمي...",
              minLength: 40,
              modelAnswer:
                "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ تأثير pH على النشاط الأنزيمي في الظاهرة المدروسة؟",
              answerStatus: "synthetic",
              rule: {
                prompt: "تأطير الإشكالية حول: تأثير pH على النشاط الأنزيمي",
                keywords: ["PH", "موقع"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2.5,
              prompt: "استغلال الوثيقة المتعلقة بـ تأثير pH على النشاط الأنزيمي",
              bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ تأثير pH على النشاط الأنزيمي.",
              ...RECON(
                "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
              ),
              placeholder: "نلاحظ... بينما... ومنه نستنتج...",
              minLength: 90,
              modelAnswer:
                "تمثل الوثيقة تغيرات PH بدلالة الزمن مقارنة بـ موقع. نلاحظ تغيرا واضحا في PH مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع موقع.",
              answerStatus: "synthetic",
              rule: {
                prompt: "استغلال الوثيقة المتعلقة بـ تأثير pH على النشاط الأنزيمي",
                keywords: ["PH", "موقع", "نلاحظ"],
                minHits: 2,
                forbidden: ["بسبب"],
                document: {
                  kind: "curve",
                  axes: ["PH", "زمن"],
                  comparisons: [["PH", "موقع"]],
                  trends: [{ about: "PH", expect: ["PH", "موقع"] }],
                  values: [],
                  strictValues: false
                }
              }
            },
            E: {
              points: 2.5,
              prompt: "تفسير الآلية المرتبطة بـ تأثير pH على النشاط الأنزيمي",
              bacPrompt: "اشرح الآلية التي تفسر تأثير pH على النشاط الأنزيمي انطلاقا من الوثيقة ومعلوماتك.",
              ...RECON(
                "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
              ),
              placeholder: "يعود ذلك إلى...",
              minLength: 110,
              modelAnswer:
                "يعود ذلك إلى تدخل PH وموقع عبر آلية دقيقة تؤدي إلى نشاط، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
              answerStatus: "synthetic",
              rule: {
                prompt: "تفسير الآلية المرتبطة بـ تأثير pH على النشاط الأنزيمي",
                keywords: ["PH", "موقع", "نشاط"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1,
              prompt: "الخاتمة التركيبية حول تأثير pH على النشاط الأنزيمي",
              bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ تأثير pH على النشاط الأنزيمي.",
              ...RECON(
                "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
              ),
              placeholder: "في الختام...",
              minLength: 40,
              modelAnswer: "في الختام، ترتبط النتيجة النهائية بـ PH وموقع فتُغلق الظاهرة على نشاط.",
              answerStatus: "synthetic",
              rule: {
                prompt: "الخاتمة التركيبية حول تأثير pH على النشاط الأنزيمي",
                keywords: ["PH", "نشاط", "ختام"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 3,
          ui: "text",
          label: "فيروس VIH والمناعة",
          max: 8,
          desc: "استهداف الخلايا LT4 وتعطيل التعاون المناعي",
          poles: {
            N: {
              points: 0.5,
              prompt: "تأطير الإشكالية حول: فيروس VIH والمناعة",
              bacPrompt: "ما المشكل العلمي المرتبط بـ فيروس VIH والمناعة؟",
              ...RECON(
                "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
              ),
              placeholder: "صياغة المشكل العلمي...",
              minLength: 30,
              modelAnswer:
                "المشكل العلمي: كيف تتدخل الآليات المرتبطة بـ فيروس VIH والمناعة في الظاهرة المدروسة؟",
              answerStatus: "synthetic",
              rule: {
                prompt: "تأطير الإشكالية حول: فيروس VIH والمناعة",
                keywords: ["VIH", "LT4"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2,
              prompt: "استغلال الوثيقة المتعلقة بـ فيروس VIH والمناعة",
              bacPrompt: "حلّل أو استخرج من الوثيقة المعطيات المرتبطة بـ فيروس VIH والمناعة.",
              ...RECON(
                "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
              ),
              placeholder: "نلاحظ... بينما... ومنه نستنتج...",
              minLength: 60,
              modelAnswer:
                "تمثل الوثيقة تغيرات VIH بدلالة الزمن مقارنة بـ LT4. نلاحظ تغيرا واضحا في VIH مقارنة بالشاهد، ومنه نستنتج علاقة مباشرة مع LT4.",
              answerStatus: "synthetic",
              rule: {
                prompt: "استغلال الوثيقة المتعلقة بـ فيروس VIH والمناعة",
                keywords: ["VIH", "LT4", "نلاحظ"],
                minHits: 2,
                forbidden: ["بسبب"],
                document: {
                  kind: "curve",
                  axes: ["VIH", "زمن"],
                  comparisons: [["VIH", "LT4"]],
                  trends: [{ about: "VIH", expect: ["VIH", "LT4"] }],
                  values: [],
                  strictValues: false
                }
              }
            },
            E: {
              points: 4,
              prompt: "تفسير الآلية المرتبطة بـ فيروس VIH والمناعة",
              bacPrompt: "اشرح الآلية التي تفسر فيروس VIH والمناعة انطلاقا من الوثيقة ومعلوماتك.",
              ...RECON(
                "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
              ),
              placeholder: "يعود ذلك إلى...",
              minLength: 110,
              modelAnswer:
                "يعود ذلك إلى تدخل VIH وLT4 عبر آلية دقيقة تؤدي إلى مناعة، فتتغير الوظيفة النهائية للظاهرة المدروسة.",
              answerStatus: "synthetic",
              rule: {
                prompt: "تفسير الآلية المرتبطة بـ فيروس VIH والمناعة",
                keywords: ["VIH", "LT4", "مناعة"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1.5,
              prompt: "الخاتمة التركيبية حول فيروس VIH والمناعة",
              bacPrompt: "لخّص النتيجة النهائية المرتبطة بـ فيروس VIH والمناعة.",
              ...RECON(
                "Thème recoupé sur des sources secondaires et le programme 3AS, sans relecture visuelle d un PDF ministériel dans cette session. Wording reconstructed, non certifiable official. À confronter au PDF dzexams avant toute utilisation comme énoncé."
              ),
              placeholder: "VIH → LT4 → مناعة",
              minLength: 40,
              modelAnswer: "عنوان المخطط: VIH. VIH → LT4 → مناعة.",
              answerStatus: "synthetic",
              rule: {
                prompt: "الخاتمة التركيبية حول فيروس VIH والمناعة",
                keywords: ["مخطط", "VIH", "مناعة"],
                minHits: 2,
                forbidden: [],
                schema: { arrows: true, title: "VIH", ordered: ["VIH", "LT4", "مناعة"] }
              }
            }
          }
        }
      ]
    }
  ]
};

export { YEAR_2017_SE };
export default YEAR_2017_SE;
