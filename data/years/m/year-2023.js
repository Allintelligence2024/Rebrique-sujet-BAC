/* ============================================================
   BAC SVT Algérie 2023 — شعبة رياضيات — entraînement 4D
   ------------------------------------------------------------
   Énoncé : PDF officiel eddirasa
     https://eddirasa.com/wp-content/uploads/2023/07/eddirasa.com-bac-sciences-math-2023.pdf
     (OCR, 6 pages, 2 sujets × 2 exercices 8+12 / 7+13, 2026-08-31).
   Les scans locaux subjects/M/2023/sujet-{1,2}.pdf portent une couche texte
   lisible ; elle a été relue le 2026-09-14 et a corrigé deux consignes
   (les deux acides aminés Asp/Tyr sont imprimés dans l'énoncé ; la fin de la
   question بيّن في نص علمي du sujet 2 était tronquée). Ce scan porte aussi des
   mots à police non dessinée (البلازموديوم, febrifugine, Dichroa febrifuga)
   que seule la couche texte restitue — jamais complétés au hasard.
   Corrigé : PDF officiel eddirasa
     https://eddirasa.com/wp-content/uploads/2023/07/eddirasa.com-correction-bac-sciences-math-2023.pdf
     (7 pages).
   id = 2023-m.
   ============================================================ */

const OFFICIAL = (page, notes) => ({
  bacPromptSource: "official",
  bacPromptPage: page,
  bacPromptVerifiedAt: "2026-08-31",
  bacPromptNotes: notes
});

const RECON = (notes) => ({
  bacPromptSource: "reconstructed",
  bacPromptNotes: notes
});

const PDF = "https://eddirasa.com/wp-content/uploads/2023/07/eddirasa.com-bac-sciences-math-2023.pdf";
const PDF_NOTE =
  "PDF officiel non redistribué dans le dépôt. Source énoncé: https://eddirasa.com/wp-content/uploads/2023/07/eddirasa.com-bac-sciences-math-2023.pdf (consulté 2026-08-31). Corrigé: https://eddirasa.com/wp-content/uploads/2023/07/eddirasa.com-correction-bac-sciences-math-2023.pdf.";

export const YEAR_2023_M = {
  id: "2023-m",
  stream: "m",
  calendarYear: "2023",
  label: "بكالوريا الجزائر دورة 2023 — شعبة رياضيات",
  badge: "دورة رسمية",
  theme: "indigo",
  enabled: true,
  sujets: [
    {
      id: 1,
      pdf: null,
      pdfAvailable: false,
      pdfExternalUrl: PDF,
      pdfLocalUrl: "/subjects/M/2023/sujet-1.pdf",
      pdfNote: PDF_NOTE,
      title: "الموضوع الأول",
      exercises: [
        {
          number: 1,
          ui: "text",
          label: "الإيثانول وبنية البروتين الغشائي للبكتيريا",
          max: 8,
          desc: "تخريب الروابط الهيدروجينية بالإيثانول (Asp و Tyr) وفقدان التخصص الوظيفي",
          poles: {
            N: {
              points: 1,
              prompt: "تأطير الإشكالية: كيف يؤثر الإيثانول على البنية الفراغية للبروتين البكتيري؟",
              bacPrompt:
                "كيف تتأثر البنى الفراغية المستقرة للبروتينات بعوامل خارجية مثل الكحول الإيثيلي المستعمل كمطهر ضد البكتيريا؟",
              ...RECON("Préambule page 1. Pas de question officielle autonome de cadrage."),
              placeholder: "صياغة المشكل العلمي...",
              minLength: 30,
              modelAnswer:
                "المشكل العلمي: كيف يفكك الإيثانول الروابط الهيدروجينية في البروتين الغشائي للبكتيريا فيفقد تخصصه الوظيفي؟",
              rule: {
                prompt: "حدد المشكل العلمي حول تأثير الإيثانول",
                keywords: ["إيثانول", "بروتين", "بكتيريا"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2,
              prompt: "التعرف على البيانات وتحديد الرابطة المستهدفة ثم كتابة صيغتي الحمضين الأمينيين",
              // Les deux questions officielles du PDF (page 1 relue en image) :
              // Q1 تعرّف/حدّد + Q2 اكتب الصيغة. Aucun intitulé ajouté.
              bacPrompt:
                "تعرّف على البيانات المرقّمة من 1 إلى 4 وحدّد من الوثيقة نوع الرابطة المستهدفة من طرف الإيثانول. اُكتب الصِّيغة الكيميائية للحمضين الأمينيين (Asp و Tyr) ضمن السلسلة الببتيدية الممثلة في العنصر (ع).",
              ...OFFICIAL(
                1,
                "Relecture du scan 2023 Maths (page 1) et du corrigé (page 1). Questions 1 et 2 du التمرين الأول. La couche texte du PDF local subjects/M/2023/sujet-1.pdf (2026-09-14) tranche la parenthèse : l'énoncé imprime (Asp و Tyr) — l'élève ne les identifie donc pas lui-même."
              ),
              placeholder:
                "1 منطقة الانعطاف... الرابطة الهيدروجينية... Asp: HOOC-CH2-... Tyr: HO-C6H4-CH2-...",
              minLength: 40,
              modelAnswer:
                "1 منطقة الانعطاف. 2 جسر ثنائي الكبريت. 3 البنية الثانوية الحلزونية. 4 رابطة هيدروجينية. نوع الرابطة المستهدفة من طرف الإيثانول هي الرابطة الهيدروجينية. ضمن السلسلة الببتيدية يظهر Asp بجذر -CH2-COOH وTyr بجذر فينول -CH2-C6H4-OH مرتبطين برابطة ببتيدية CO-NH.",
              rule: {
                prompt: "تعرف على البيانات وحدد الرابطة المستهدفة واكتب الصيغتين",
                keywords: ["هيدروجينية", "حلزونية", "إيثانول", "ببتيدية"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 4,
              prompt: "النص العلمي: استقرار البنية الفراغية وتأثير الكحول الإيثيلي",
              // Question 3 du PDF (page 1 relue en image) : le verbe officiel est
              // « بيّن في نص علمي » — l'ancienne entrée recopiait la question 2.
              bacPrompt:
                "بيّن في نص علمي كيفية تأمين استقرار البنية الفراغية للبروتين ووظيفته وتأثير الكحول على ذلك مستعينا بالوثيقة ومكتسباتك.",
              ...OFFICIAL(
                1,
                "Relecture du PDF eddirasa 2023 Maths (page 1) et du corrigé (page 1). Verbe officiel : بيّن في نص علمي. Question 3 du التمرين الأول."
              ),
              placeholder: "مقدمة، عرض: الروابط المسؤولة عن الاستقرار، تأثير الإيثانول، خاتمة...",
              minLength: 120,
              modelAnswer:
                "يُؤمَّن استقرار البنية الفراغية للبروتين بروابط تنشأ بين جذور الأحماض الأمينية ومتوضعة بدقة في السلسلة الببتيدية: روابط هيدروجينية وشاردية وكارهة للماء وجسور ثنائية الكبريت. أي تغير في هذه الروابط يغير البنية الفراغية فيفقد البروتين تخصصه الوظيفي. يفكك الإيثانول الروابط الهيدروجينية بين جذور الأحماض الأمينية في البروتين الغشائي للبكتيريا، فتصبح بنيته الفراغية غير مستقرة ويفقد وظيفته فتُقضى على البكتيريا؛ لذلك يُستعمل الكحول مطهرا.",
              rule: {
                prompt: "بين في نص علمي استقرار البنية وتأثير الكحول",
                keywords: ["هيدروجينية", "بنية", "إيثانول", "بكتيريا"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1,
              prompt: "الخاتمة: استعمال الكحول مطهرا بتخريب بنية البروتينات الغشائية",
              bacPrompt: "لماذا يُستعمل الكحول مطهرا ضد البكتيريا من خلال تأثيره على البروتين؟",
              ...RECON(
                "Clôture issue du corrigé officiel (النص العلمي). Pas une question BAC autonome isolée ; le texte scientifique structuré du corrigé n'est pas une consigne écrite séparée."
              ),
              placeholder: "في الختام...",
              minLength: 40,
              modelAnswer:
                "في الختام، يفكك الإيثانول الروابط الهيدروجينية بين جذور الأحماض الأمينية فتصبح البنية الفراغية غير مستقرة والبروتين غير وظيفي، فيُقضى على البكتيريا. لذلك يُستعمل الكحول مطهرا.",
              rule: {
                prompt: "اكتب خاتمة حول استعمال الكحول مطهرا",
                keywords: ["كحول", "بنية", "بكتيريا"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 2,
          ui: "text",
          label: "القصور المناعي ومورثة البيرفورين PRF1",
          max: 12,
          desc: "عجز LTc عن تخريب الخلايا المصابة بطفرة تُظهر رامزة توقف في PRF1",
          poles: {
            N: {
              points: 1,
              prompt: "اقتراح فرضيتين توضّحان سبب القصور المناعي الحادّ باستغلال نتائج الوثيقة 1",
              bacPrompt: "اقترح فرضيتين توضّح بهما سبب القصور المناعي الحادّ باستغلالك لنتائج الوثيقة 1.",
              ...OFFICIAL(
                2,
                "Relecture du scan 2023 Maths (page 2 du sujet 1, relue en image le 2026-09-13). Verbe officiel : اقترح فرضيتين. Question unique du الجزء الأول, recopiée mot à mot."
              ),
              placeholder: "الفرضية 1: خلل في إنتاج البيرفورين... الفرضية 2: عدم وجود تكامل بنيوي...",
              minLength: 30,
              modelAnswer:
                "الفرضية 1: وجود خلل في إنتاج البيرفورين في الخلايا LTc عند الطفل المريض. الفرضية 2: عدم وجود تكامل بنيوي بين الخلايا LTc والخلايا المصابة بالفيروس عند الطفل المريض.",
              rule: {
                prompt: "اقترح فرضيتين حول سبب القصور المناعي",
                keywords: ["فرضية", "بيرفورين", "LTc"],
                minHits: 2,
                forbidden: [],
                hypotheses: { min: 2, distinct: true }
              }
            },
            S: {
              points: 3,
              prompt: "استغلال الوثيقة 1: نسبة الخلايا المصابة المخربة بدلالة نسبة LTc",
              bacPrompt:
                "استغل الوثيقة 1: تغيرات نسبة الخلايا المصابة المخربة بدلالة نسبة الخلايا LTc في الوسطين.",
              ...RECON(
                "Le corrigé analyse la courbe avant les hypothèses (0.50 x2 + 3.00 au corrigé). Valeurs relues sur la courbe du scan local (2026-09-14) : abscisses 0.6 / 1.2 / 2.5 / 5 / 10, courbe du milieu 1 de ~10 % à ~80 %, celle du milieu 2 de ~10 % à ~20 %. L'OCR eddirasa du corrigé inverse les chiffres (0.6/1.6, 16/60) : elles ne sont pas reprises."
              ),
              placeholder: "الوسط 1 الطفل السليم: ارتفاع كبير من 6 إلى 16%... الوسط 2 المريض: ارتفاع طفيف...",
              minLength: 90,
              modelAnswer:
                "تُظهر الوثيقة تغير نسبة الخلايا المصابة المخربة بدلالة نسبة الخلايا LTc إلى الخلايا المصابة. عند الطفل السليم بزيادة نسبة LTc من 0.6 إلى 10 ترتفع نسبة الخلايا المصابة المخربة من حوالي 10% إلى حوالي 80% (ارتفاع كبير)، بينما عند الطفل المريض وبنفس الزيادة ترتفع النسبة من حوالي 10% إلى حوالي 20% فقط (ارتفاع طفيف) لوجود نسبة قليلة من خلايا LTc القادرة على تخريب الخلايا المصابة. الاستنتاج: يعود تطور المرض إلى عجز الخلايا التائية السامة (LTc) عن تخريب الخلايا المصابة.",
              rule: {
                prompt: "استغل الوثيقة 1 حول تخريب الخلايا المصابة",
                keywords: ["LTc", "مصابة", "سليم", "مريض"],
                minHits: 3,
                forbidden: ["بسبب"],
                document: {
                  kind: "curve",
                  axes: ["نسبة", "LTc", "مصابة"],
                  comparisons: [["سليم", "مريض"]],
                  trends: [
                    { about: "سليم", expect: ["ارتفاع", "كبير"] },
                    { about: "مريض", expect: ["طفيف", "قليلة"] }
                  ],
                  relations: [{ type: "parallel", a: "سليم", b: "مريض" }],
                  values: ["0.6", "10", "80", "20"],
                  strictValues: true
                }
              }
            },
            E: {
              points: 6,
              prompt: "تبيان سبب مرض القصور المناعي والمصادقة على إحدى الفرضيتين من الوثيقة 2",
              bacPrompt:
                "بيّن سبب مرض القصور المناعي بما يسمح لك بالمصادقة على صحة إحدى الفرضيتين باستغلالك لمعارفك وأشكال الوثيقة 2.",
              ...OFFICIAL(
                3,
                "Relecture du scan 2023 Maths (page 3 du sujet 1, relue en image le 2026-09-14) et du corrigé (pages 2-3). Verbe officiel : بيّن. Question du الجزء الثاني, recopiée mot à mot. Valeurs relues sur les figures locales : barres ~3500 / ~250 جزيئة (الشكل أ) ; tableau des triplets 47-50 (AGT GTC ATA GTG sain / AGT ATC ATA GTG malade) et table des codons du الشكل (ج) (UCA→Ser, CAG→Gln, UAU→Tyr, CAC→His, UAG→توقف)."
              ),
              placeholder: "عدد جزيئات البيرفورين 3066 عند السليم و 166 عند المريض... G→A رامزة توقف UAG...",
              minLength: 110,
              modelAnswer:
                "من الشكل (أ): عدد جزيئات البرفورين في الخلية LTc أعظمي عند الطفل السليم (حوالي 3500 جزيئة) وقليل جدا عند الطفل المريض (حوالي 250 جزيئة): خلايا LTc عند المريض غير قادرة على تركيب البرفورين بكميات طبيعية. من الشكلين (ب) و(ج): بمقارنة تتابع جزء مورثة PRF1 نلاحظ تماثل الثلاثيات 47 و49 و50 واختلافا في الثلاثية 48 حيث استُبدلت القاعدة الأزوتية G بالقاعدة A (GTC ← ATC) فصار الـ ARNm عند المريض UCA UAG UAU CAC بدل UCA CAG UAU CAC عند الطفل السليم: ظهرت رامزة التوقف UAG فيتوقف تركيب السلسلة الببتيدية عند الحمض الأميني Ser ويُركَّب برفورين غير مكتمل البنية. وهذا يؤكد صحة الفرضية 1: خلل في إنتاج البرفورين عند الطفل المريض (كمية قليلة جدا وبنية غير مكتملة).",
              rule: {
                prompt: "بين سبب القصور المناعي وصادق على الفرضية",
                keywords: ["بيرفورين", "فرضية", "توقف", "PRF1"],
                minHits: 3,
                forbidden: [],
                causalOrder: ["طفرة", "بيرفورين"]
              }
            },
            W: {
              points: 2,
              prompt: "مخطط مراحل الرد المناعي النوعي الخلوي عند طفل سليم وآخر مصاب بالقصور المناعي",
              bacPrompt:
                "لخّص بمخطط مراحل الرد المناعي النوعي الخلوي بعد إصابة العضوية بأحد أنواع الفيروسات عند طفل سليم وآخر مريض بالقصور المناعي انطلاقا مما توصلت إليه في هذه الدراسة ومكتسباتك.",
              ...OFFICIAL(
                3,
                "Relecture du scan 2023 Maths (page 3 du sujet 1, relue en image le 2026-09-13) et du corrigé (page 3). Verbe officiel : لخّص بمخطط. Question du الجزء الثالث, recopiée mot à mot."
              ),
              placeholder: "طفل سليم: LTc → بيرفورين مكتمل → تخريب... طفل مريض: بيرفورين مبتور...",
              minLength: 0,
              modelAnswer:
                "عنوان المخطط: الرد المناعي الخلوي. طفل سليم: إصابة فيروسية → عرض المعقد → تكاثر وتمايز LTc → إفراز بيرفورين مكتمل → تخريب الخلايا المصابة. طفل مريض بالقصور المناعي: طفرة PRF1 → بيرفورين غير مكتمل وبكمية قليلة → عدم تخريب الخلايا المصابة.",
              rule: {
                prompt: "لخص بمخطط الرد المناعي الخلوي",
                keywords: ["مخطط", "بيرفورين", "LTc"],
                minHits: 1,
                forbidden: [],
                schema: { arrows: true, title: "قصور", ordered: ["LTc", "بيرفورين", "تخريب"] }
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
      pdfExternalUrl: PDF,
      pdfLocalUrl: "/subjects/M/2023/sujet-2.pdf",
      pdfNote: PDF_NOTE,
      title: "الموضوع الثاني",
      exercises: [
        {
          number: 1,
          ui: "text",
          label: "البروتينات وأنماط التعاون بين الخلايا المناعية",
          max: 7,
          desc: "دور BCR و TCR/HLA و IL-2 في أنماط التعاون لإقصاء اللاذات",
          poles: {
            N: {
              points: 1,
              prompt: "تأطير الإشكالية: دور البروتينات في أنماط التعاون بين الخلايا المناعية",
              bacPrompt: "ما دور هذه البروتينات في أنماط التعاون بين الخلايا المناعية لإقصاء اللاذات؟",
              ...RECON("Le préambule page 4 pose la question. Pas de consigne autonome حدد المشكل."),
              placeholder: "صياغة المشكل العلمي...",
              minLength: 30,
              modelAnswer:
                "المشكل العلمي: كيف تؤمن البروتينات المناعية أنماط التعاون بين الخلايا المناعية أثناء الاستجابة النوعية لإقصاء اللاذات؟",
              rule: {
                prompt: "حدد المشكل العلمي حول التعاون المناعي",
                keywords: ["بروتين", "تعاون", "مناعية"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2,
              prompt: "التعرف على الخلايا A و B و C و D وتسمية مكونات العناصر 1 و 2 و 3",
              bacPrompt:
                "تعرّف على الخلايا (A، B، C، D). سمّ مكونات العناصر (1 و 2 و 3) وحدّد العلاقة البنيوية بين مكونات كل عنصر.",
              ...OFFICIAL(
                4,
                "Relecture du scan 2023 Maths (page 4 du dossier = page 1 du sujet 2) et du corrigé (page 4). Verbes officiels : تعرّف / سمّ / حدّد. Questions 1 et 2 du التمرين الأول (Sujet 2)."
              ),
              placeholder: "A بلعم كبير عارض، B خلية LB، C خلية LT8، D خلية LTh...",
              minLength: 40,
              modelAnswer:
                "A بلعم كبير (خلية عارضة للمستضد). B خلية لمفاوية بائية LB. C خلية LT8. D خلية لمفاوية تائية LTh. العنصر 1: معقد BCR / مستضد — تكامل بين محدد المستضد وموقع التثبيت. العنصر 2: معقد (TCR و CD4) / (محدد مستضد و HLA II) — تكامل مزدوج. العنصر 3: معقد IL-2 / مستقبل IL-2 — تكامل بينهما.",
              rule: {
                prompt: "تعرف على الخلايا ومكونات التعاون",
                keywords: ["LB", "LT8", "BCR", "IL"],
                minHits: 3,
                forbidden: []
              }
            },
            E: {
              points: 3,
              prompt: "النص العلمي: دور البروتينات في أنماط التعاون أثناء الاستجابة المناعية",
              bacPrompt:
                "بيّن في نص علمي دور البروتينات في مختلف أنماط التعاون بين الخلايا المناعية أثناء الاستجابة المناعية النوعية مستغلا معارفك ومعطيات الوثيقة. (النص العلمي مُهيكل في مقدّمة، عرض وخاتمة).",
              ...OFFICIAL(
                4,
                "Relecture du scan 2023 Maths (page 4) : question 3 du التمرين الأول (sujet 2). La couche texte du PDF local a restitué la fin de la consigne (الاستجابة المناعية النوعية مستغلا معارفك ومعطيات الوثيقة), absente de la transcription du 2026-08-31."
              ),
              placeholder: "مقدمة، عرض: التعرف، التنشيط، التنفيذ، خاتمة...",
              minLength: 120,
              modelAnswer:
                "خلال التعرف تقدم كل من CPA والخلية المصابة محدد مستضد محمول على HLA I تتعرف عليه خلايا LT8 بواسطة TCR و CD8 (تعرف مزدوج). تقدم CPA محدد مستضد محمول على HLA II تتعرف عليه خلايا LT4 بواسطة TCR و CD4. تتعرف LB بواسطة BCR على محدد المستضد. خلال التنشيط تفرز CPA الـ IL-1 لتنشيط LT4 و LT8، وتفرز LTh الـ IL-2 لتحفيز LB و LT8 المحسستين على التكاثر والتمايز إلى LTc وخلايا بلازمية وخلايا ذاكرة. خلال التنفيذ تفرز LTc البيرفورين وأنزيمات الحالة لتحليل الخلايا المصابة، وتفرز الخلايا البلازمية أجساما مضادة تشكل معقدات مناعية تُثبَّت على مستقبل خاص على أغشية البلعمات. تؤمن البروتينات المناعية مختلف أنماط التعاون بين الخلايا الدفاعية.",
              rule: {
                prompt: "بين دور البروتينات في أنماط التعاون",
                keywords: ["HLA", "IL", "بيرفورين", "مضادة"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1,
              prompt: "الخاتمة: أنماط التعاون بين الخلايا الدفاعية",
              bacPrompt: "ما الذي تؤمنه البروتينات المناعية أثناء الاستجابة؟",
              ...RECON("Clôture issue du corrigé. Pas une question BAC autonome."),
              placeholder: "في الختام...",
              minLength: 40,
              modelAnswer:
                "في الختام، تؤمن البروتينات المناعية مختلف أنماط التعاون بين الخلايا الدفاعية أثناء الاستجابة لإقصاء اللاذات.",
              rule: {
                prompt: "اكتب خاتمة حول أنماط التعاون المناعي",
                keywords: ["تعاون", "بروتين", "مناعي"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 2,
          ui: "text",
          label: "دواء هالوفوجينون والملاريا (ProRS)",
          max: 13,
          desc: "تثبيط تنشيط البرولين بـ Halofuginone على أنزيم ProRS فيتوقف تركيب بروتين الطفيلي",
          poles: {
            N: {
              points: 1,
              prompt: "اقتراح فرضيتين حول تأثير دواء Halofuginone على طفيلي الملاريا",
              bacPrompt:
                "اقترح فرضيتين حول تأثير هذا الدواء على الطفيلي المسبب لمرض الملاريا باستغلال الوثيقة 1 ومعلوماتك.",
              ...OFFICIAL(
                5,
                "Relecture du scan 2023 Maths (page 5 du dossier = page 2 du sujet 2) et du corrigé (page 5). Verbe officiel : اقترح فرضيتين. Question du الجزء الأول."
              ),
              placeholder: "الفرضية 1: يثبط النسخ... الفرضية 2: يثبط الترجمة...",
              minLength: 30,
              modelAnswer:
                "الفرضية 1: يثبط دواء Halofuginone عملية النسخ. الفرضية 2: يثبط دواء Halofuginone عملية الترجمة.",
              rule: {
                prompt: "اقترح فرضيتين حول تأثير هالوفوجينون",
                keywords: ["فرضية", "Halofuginone", "طفيلي"],
                minHits: 2,
                forbidden: [],
                hypotheses: { min: 2, distinct: true }
              }
            },
            S: {
              points: 3,
              prompt: "استغلال الوثيقة 1: نسبة نمو الطفيلي ونسبة بروتيناته المركبة",
              bacPrompt:
                "استغل الشكل (أ) والشكل (ب) من الوثيقة 1: نسبة نمو الطفيلي ونسبة بروتيناته المركبة بدلالة تراكيز Halofuginone.",
              ...RECON(
                "Le corrigé analyse les courbes avant les hypothèses. Exploitation pédagogique. Valeurs relues sur les deux graphiques du scan local (2026-09-14) : croissance à 100 % jusqu'à 1.5 و.ت puis quasi nulle dès 4 و.ت ; barres des protéines 100 / 60 / 40 / ~10 % pour 1 / 2 / 3 / 4 و.ت."
              ),
              placeholder: "في غياب الدواء تثبت نسبة النمو عند 100%... من 1.5 إلى 5 ت.و تتناقص...",
              minLength: 90,
              modelAnswer:
                "من الشكل (أ): في غياب الدواء تثبت نسبة نمو الطفيلي عند 100% حتى التركيز 1.5 و.ت، بينما في وجود Halofuginone تتناقص نسبة النمو تدريجيا لتنعدم تقريبا ابتداء من التركيز 4 و.ت. من الشكل (ب): تتناقص نسبة البروتينات المركبة عند الطفيلي من 100% عند التركيز 1 و.ت إلى حوالي 10% عند التركيز 4 و.ت (حوالي 60% عند 2 و.ت و40% عند 3 و.ت). ومنه يثبط Halofuginone تركيب البروتينات فتتوقف سلسلة نمو الطفيلي.",
              rule: {
                prompt: "استغل الوثيقة 1 حول نمو الطفيلي وتركيب البروتين",
                keywords: ["نمو", "بروتين", "Halofuginone", "100"],
                minHits: 3,
                forbidden: ["بسبب"],
                document: {
                  kind: "curve",
                  axes: ["نمو", "تركيز"],
                  comparisons: [["غياب", "وجود"]],
                  trends: [
                    { about: "غياب", expect: ["ثبات", "100"] },
                    { about: "وجود", expect: ["تناقص", "تنعدم"] }
                  ],
                  relations: [{ type: "inverse", a: "Halofuginone", b: "نمو" }],
                  values: ["100"],
                  strictValues: true
                }
              }
            },
            E: {
              points: 6,
              prompt: "تبيان آلية تأثير Halofuginone والمصادقة على إحدى الفرضيتين من الوثيقة 2",
              bacPrompt:
                "بيّن آلية تأثير دواء Halofuginone على الطفيلي مما يسمح لك بالمصادقة على صحة إحدى الفرضيتين المقترحتين سابقا باستغلال معلوماتك وأشكال الوثيقة 2. يتناول بعض المرضى أحيانا الأدوية دون احترام المقادير المحدّدة في الوصفات الطبية، قدّم نصيحة مُبرَّرة لتفادي ذلك.",
              ...OFFICIAL(
                6,
                "Relecture du scan 2023 Maths (page 3 du sujet 2 = page 6 du dossier) et du corrigé (pages 5-6). Verbes officiels : بيّن / قدّم نصيحة. Questions 1 et 2 du الجزء الثاني, recopiées mot à mot."
              ),
              placeholder:
                "الوسط 1 تركيب البروتين... الوسط 2 لا يتركب... الوسط 3 يتركب بأحماض منشطة... يمنع ARNt-Pro...",
              minLength: 110,
              modelAnswer:
                "في الوسط 1 بتوفر عناصر الترجمة وفي غياب الدواء يتم تركيب البروتين. في الوسط 2 بوجود الدواء بتركيز 3 ت.و لا يتم التركيب. في الوسط 3 باستبدال عناصر التنشيط بأحماض أمينية منشطة يتم التركيب رغم وجود الدواء. يثبط الدواء عملية تنشيط الأحماض الأمينية. تبقى نسبة تشكل معقدات ARNt-aa أعظمية 100 بالمئة لكل الأحماض ما عدا البرولين حيث تتناقص حتى تنعدم: يمنع تشكل معقد ARNt-Pro. يتوضع Halofuginone في موقع تثبيت البرولين وARNt على أنزيم ProRS. تتوقف الترجمة فيُثبَّط تركيب بروتين الطفيلي ويتوقف نموه. تتأكد الفرضية 2: يثبط الدواء عملية الترجمة. نصيحة مُبرَّرة: الالتزام بالمقادير المسجلة في الوصفات الطبية، لأن الجرعات الضعيفة ليس لها مفعول والجرعات العالية تؤثر سلبا على العضوية.",
              rule: {
                prompt: "بين آلية هالوفوجينون وصادق على الفرضية",
                keywords: ["فرضية", "ProRS", "برولين", "ترجمة"],
                minHits: 3,
                forbidden: [],
                causalOrder: ["ProRS", "ترجمة"]
              }
            },
            W: {
              points: 3,
              prompt: "مخطط آلية تركيب البروتين في غياب ووجود Halofuginone",
              bacPrompt:
                "لخّص في مخطط آلية تركيب البروتين في غياب ووجود Halofuginone معتمدا على ما توصلت إليه في هذه الدراسة ومكتسباتك.",
              ...OFFICIAL(
                6,
                "Relecture du scan 2023 Maths (page 6 du dossier = page 3 du sujet 2) et du corrigé (page 7). Verbe officiel : لخّص في مخطط. Question du الجزء الثالث."
              ),
              placeholder: "غياب: ATP+ARNt+aa → ARNt-aa → ريبوزوم... وجود: لا يتشكل ARNt-Pro...",
              minLength: 0,
              modelAnswer:
                "عنوان المخطط: تركيب البروتين بوجود وغياب هالوفوجينون. في الغياب: أحماض أمينية + ATP → تنشيط → معقدات ARNt-aa بما فيها ARNt-Pro → ريبوزوم → تركيب البروتين. في الوجود: يتوضع الدواء على ProRS فلا يتشكل ARNt-Pro فتتوقف الترجمة.",
              rule: {
                prompt: "لخص في مخطط تركيب البروتين بوجود هالوفوجينون",
                keywords: ["مخطط", "ProRS", "ريبوزوم"],
                minHits: 1,
                forbidden: [],
                schema: { arrows: true, title: "هالوفوجينون", ordered: ["تنشيط", "ARNt", "ريبوزوم"] }
              }
            }
          }
        }
      ]
    }
  ]
};

export default YEAR_2023_M;
