/* ============================================================
   BAC SVT Algérie 2018 — شعبة رياضيات — entraînement 4D
   ------------------------------------------------------------
   Énoncé ET corrigé officiels : M/dzexams-bac-sciences-1967487.pdf
   (12 pages) porte le sujet (pp. 1–6) puis l'« الإجابة النموذجية »
   (pp. 7–12). Les réponses modèle reprennent celles du corrigé, relu
   page à page en image le 2026-09-13.
   PDF locaux déjà livrés :
     subjects/M/2018/sujet-1.pdf (3 pages, الموضوع الأول, pp. 1–3)
     subjects/M/2018/sujet-2.pdf (3 pages, الموضوع الثاني, pp. 4–6)
   source : M/dzexams-bac-sciences-1967487.pdf
   Relecture 2026-09-13 : les six pages ont été rendues en image
   (`node scripts/render-pdf-pages.mjs subjects/M/2018/sujet-1.pdf 1,2,3`,
   idem sujet-2) et les consignes recopiées mot à mot depuis l'image.
   Format Maths : 2 sujets × 2 exercices (7 + 13 / 6 + 14) ; durée
   officielle 02 سا و30 د (المدة imprimée en tête du sujet) = 150 min.
   id = 2018-m pour ne pas collisionner avec l'année SE 2018.
   ============================================================ */

const OFFICIAL = (page, notes) => ({
  bacPromptSource: "official",
  bacPromptPage: page,
  bacPromptVerifiedAt: "2026-09-13",
  bacPromptNotes: notes
});

const RECON = (notes) => ({
  bacPromptSource: "reconstructed",
  bacPromptNotes: notes
});

const PDF = "https://www.dzexams.com/ar/annales/aDMxL2FtWlZwZ3NmeThCMG5WNk50UT09";
const PDF_NOTE =
  "PDF officiel non redistribué dans le dépôt. Source locale du sujet dans l'application : /subjects/M/2018/sujet-N.pdf (sujet pp. 1-6 du dossier dzexams 2018 filière رياضيات, M/dzexams-bac-sciences-1967487.pdf). Consignes recopiées mot à mot depuis l'image des pages rendues par scripts/render-pdf-pages.mjs (relecture 2026-09-13), jamais depuis la couche texte du scan. Le corrigé officiel 2018 se trouve dans le même dossier local (M/dzexams-bac-sciences-1967487.pdf, « الإجابة النموذجية » pp. 7-12) : les réponses modèle en sont issues.";

export const YEAR_2018_M = {
  id: "2018-m",
  stream: "m",
  calendarYear: "2018",
  label: "بكالوريا الجزائر دورة 2018 — شعبة رياضيات",
  badge: "دورة رسمية",
  theme: "indigo",
  enabled: true,
  sujets: [
    {
      id: 1,
      pdf: null,
      pdfAvailable: false,
      pdfExternalUrl: PDF,
      pdfLocalUrl: "/subjects/M/2018/sujet-1.pdf",
      pdfNote: PDF_NOTE,
      title: "الموضوع الأول",
      exercises: [
        {
          number: 1,
          ui: "text",
          label: "من المورثة إلى البروتين: النمط الظاهري",
          max: 7,
          desc: "مرحلتا الظاهرة (ص) وترجمتهما، الهجرة الكهربائية للعنصرين 5 و 8، والعلاقة بين المورثة والبروتين",
          poles: {
            N: {
              points: 1,
              prompt: "كتابة البيانات المرقمة وتسمية الظاهرتين (س) و (ص) ومقرّهما",
              bacPrompt:
                "اكتب البيانات المرقمة من 1 إلى 10 ثم سمِّ الظاهرتين (س) و (ص) وحدّد مقرهما في الخلية.",
              ...OFFICIAL(
                2,
                "Relecture du scan 2018 Maths (Sujet 1, page 2, relue en image). Verbes officiels : اكتب / سمِّ / حدّد. Question 1 du التمرين الأول."
              ),
              placeholder: "1 المورثة، 2 ...، (س) الظاهرة الوراثية، (ص) التعبير المورثي...",
              minLength: 40,
              modelAnswer:
                "كتابة البيانات: 1- ARN بوليميراز، 2- السلسلة المستنسخة، 3- السلسلة غير المستنسخة، 4- ADN، 5- سلسلة ببتيدية ناتجة عن تعبير المورثة (2)، 6- تحت الوحدة الكبرى للريبوزوم، 7- تحت الوحدة الصغرى للريبوزوم، 8- سلسلة ببتيدية ناتجة عن تعبير المورثة (1)، 9- الـ ARNm، 10- ريبوزوم وظيفي. تسمية الظاهرتين: (س) الاستنساخ ومقرها النواة، (ص) الترجمة ومقرها الهيولى.",
              rule: {
                prompt: "اكتب البيانات وسمِّ الظاهرتين",
                keywords: ["وراثه", "تعبير", "ريبوزوم", "نواه"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2,
              prompt: "التعرف على مرحلتي الظاهرة (ص) وتفسير اختلاف الهجرة الكهربائية",
              // Questions 2 et 3 de la page 2 (scan relu en image), mot à mot.
              bacPrompt:
                "تعرّف على مرحلتي الظاهرة (ص) المشار إليهما في الشكلين (أ) و (ب). قدّم تفسيرا لاختلاف نتائج الهجرة الكهربائية للعنصرين 5 و 8.",
              ...OFFICIAL(
                2,
                "Relecture du scan 2018 Maths (Sujet 1, page 2, relue en image). Verbes officiels : تعرّف / قدّم تفسيرا. Questions 2 et 3 du التمرين الأول, recopiées mot à mot. La question 3 renvoie aux éléments 5 et 8 de la figure du sujet."
              ),
              placeholder: "المرحلة 1: النسخ في النواة... المرحلة 2: الترجمة في الهيولى...",
              minLength: 70,
              modelAnswer:
                "مرحلتا الترجمة المشار إليهما: الشكل (أ) مرحلة النهاية، والشكل (ب) مرحلة الاستطالة. تفسير اختلاف نتائج الهجرة الكهربائية: هجرة العنصر (8) نحو القطب (+) لاكتسابه شحنة سالبة نتيجة تأيّن الوظائف الحمضية (سلك سلوك الحمض في وسط قاعدي: pHi أصغر من pH الوسط «7»)، بينما يهاجر العنصر (5) نحو القطب (‒) لاكتسابه شحنة موجبة نتيجة تأيّن الوظائف القاعدية (سلك سلوك القاعدة في وسط حمضي: pHi أكبر من pH الوسط «7»). ومنه فالعنصر 5 تكثر فيه الأحماض الأمينية القاعدية والعنصر 8 تكثر فيه الأحماض الأمينية الحمضية، فالعنصران 5 و 8 يختلفان في نوع الأحماض الأمينية المكوّنة لهما.",
              rule: {
                prompt: "تعرّف على المرحلتين وفسّر الهجرة الكهربائية",
                keywords: ["نسخ", "ترجمه", "شحنه", "هجره"],
                minHits: 3,
                forbidden: []
              }
            },
            E: {
              points: 3,
              prompt: "النص العلمي: العلاقة بين المورثة والبروتين",
              bacPrompt: "ممّا سبق ومعلوماتك وضّح العلاقة بين المورثة والبروتين.",
              ...OFFICIAL(
                2,
                "Relecture du scan 2018 Maths (Sujet 1, page 2, relue en image). Verbe officiel : وضّح. Question 4 du التمرين الأول, recopiée mot à mot."
              ),
              minLength: 90,
              modelAnswer:
                "يُترجَم التعبير المورثي على المستوى الجزيئي بتركيب البروتين، وذلك وفق ظاهرتين: الاستنساخ والترجمة. الاستنساخ: يتم خلاله التصنيع الحيوي لجزيئة الـ ARNm انطلاقا من إحدى سلسلتي الـ ADN (المورثة) التي تنقل نسخة من المعلومة الوراثية، وتتحدد بتتالٍ دقيق عدد ونوع من النيكليوتيدات وحدته الرامزة التي تشفر لحمض أميني. خلال الترجمة يُترجَم تتالي عدد ونوع دقيق من النيكليوتيدات إلى بروتين محدد بتتالٍ دقيق عدد ونوع من الأحماض الأمينية.",
              rule: {
                prompt: "وضّح العلاقة بين المورثة والبروتين",
                keywords: ["مورثه", "ARNm", "ترجمه", "بروتين"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 1,
              prompt: "الخاتمة: لماذا يحدد البروتين النمط الظاهري",
              bacPrompt: "لماذا يُقال إنّ الخلل في المورثة يُترجم إلى خلل في النمط الظاهري؟",
              ...RECON(
                "Pas une question BAC autonome : clôture issue de la question 4 (النص العلمي). Le corrigé officiel 2018 est dans le dépôt (M/dzexams-bac-sciences-1967487.pdf, pp. 7-12) et il ne comporte pas de question de clôture : cette réponse est rédigée à partir du programme, sans se réclamer du corrigé."
              ),
              placeholder: "في الختام...",
              minLength: 40,
              modelAnswer:
                "في الختام، تتحدد البروتينات المسؤولة عن صفات العضوية (نمطها الظاهري) بفضل المورثات، فالخلل في المورثة ينتج بروتينا غير عادي أو غير موجود فيظهر في النمط الظاهري.",
              rule: {
                prompt: "اكتب خاتمة حول المورثة والنمط الظاهري",
                keywords: ["مورثه", "نمط", "بروتين"],
                minHits: 2,
                forbidden: []
              }
            }
          }
        },
        {
          number: 2,
          ui: "text",
          label: "العجز المناعي واللمفاويات T والأنترلوكين 2",
          max: 13,
          desc: "تطور عدد الخلايا اللمفاوية وشحنة الفيروس ثم متابعة كمية الأنترلوكين 2 عند الفئران الطافرة والعلاقة الوظيفية مع الخلايا LB",
          poles: {
            N: {
              points: 2,
              prompt: "إنجاز المنحنى البياني ووضع مراحل تطور الإصابة",
              // Question 1 (أ et ب) du الجزء الأول (page 2), mot à mot.
              bacPrompt:
                "أنجز منحنى بياني يمثل تطور عدد الخلايا اللمفاوية بدلالة الزمن. ضع على المنحنى مراحل تطور الإصابة بالفيروس.",
              ...OFFICIAL(
                2,
                "Relecture du scan 2018 Maths (Sujet 1, page 2, relue en image). Verbes officiels : أنجز / ضع. Question 1 (أ et ب) du الجزء الأول, recopiée mot à mot. Le nom du virus n'est pas dessiné sur le scan ; le corrigé officiel (même dossier local, p. 8) l'imprime « VIH » et le corrigé du texte scientifique l'écrit aussi."
              ),
              placeholder:
                "المحور الأفقي: الزمن (بالأسابيع ثم بالسنوات)، المحور العمودي: عدد الخلايا LT4 (خلية/مم³)...",
              minLength: 60,
              modelAnswer:
                "أ) المنحنى: على المحور الأفقي الزمن (بالأسابيع 0، 3، 6، 9، 12 ثم بالسنوات من 1 إلى 10)، وعلى المحور العمودي عدد الخلايا LT4 (خلية/مم³). يتزايد عدد الخلايا من 1200 عند الأسبوع 0 إلى 800 عند 3 أسابيع ثم يتناقص إلى 500 عند 6 أسابيع، ويرتفع إلى 600 عند 9 أسابيع و700 عند 12 أسبوعا، ثم ينخفض تدريجيا: 400 ثم 350 ثم يواصل الانخفاض إلى 300 و200 و150 و100 ثم 0 في السنة العاشرة، مع تسجيل شحنة الفيروس 10³ و10⁴ و10⁵ و10⁶ ثم 10⁷ في السنوات الموالية. ب) مراحل تطور الإصابة بفيروس VIH: مرحلة الإصابة الأولية (الأسبوعان 0 إلى 3)، مرحلة الكمون (من الأسبوع 3 إلى غاية بداية مرحلة العجز)، ثم مرحلة العجز المناعي. ملاحظة: تُقبل كل بداية مرحلة الكمون إذا حُصرت في المجال بين 9 و12 شهرا، وتبدأ مرحلة العجز عندما يبلغ عدد الخلايا LT4 حوالي 200 خلية/مم³.",
              rule: {
                prompt: "أنجز المنحنى وحدّد مراحل الإصابة",
                keywords: ["زمن", "خلايا", "منحني", "طفيلي"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 4,
              prompt: "المقارنة بين تطور شحنة الفيروس وعدد الخلايا اللمفاوية في الأسابيع الستة الأولى",
              bacPrompt:
                "قارن بين تطور شحنة الفيروس وعدد الخلايا اللمفاوية في الأسابيع الستة الأولى، ماذا تستنتج؟",
              ...OFFICIAL(
                2,
                "Relecture du scan 2018 Maths (Sujet 1, page 2, relue en image). Verbes officiels : قارن … ماذا تستنتج. Question 2 du الجزء الأول, recopiée mot à mot (le mot شحنة فيروس est celui du tableau الوثيقة 1)."
              ),
              minLength: 90,
              modelAnswer:
                "في الأسابيع الستة الأولى: تناقص عدد الخلايا LT4 (من 1200 إلى 800 ثم 500 خلية/مم³) يتزامن مع تزايد شحنة فيروس VIH (من 0 إلى 10⁴ ثم 10⁶). الاستنتاج: يستهدف فيروس VIH الخلايا LT4 (فيتكاثر داخلها ويدمّرها).",
              rule: {
                prompt: "قارن بين الشحنة وعدد الخلايا",
                keywords: ["شحنه", "خلايا", "تناقص", "تزايد"],
                minHits: 3,
                forbidden: []
              }
            },
            E: {
              points: 5,
              prompt: "استغلال الوثيقتين (3) و(4): العنصران (a) و(b) والعلاقة الوظيفية",
              // Questions 1, 2 et 3 du الجزء الثاني (page 3), mot à mot.
              bacPrompt:
                "تعرّف على العنصرين (a) و (b) من الوثيقة (3). اشرح الأهمية البيولوجية للشكل (ب) من الوثيقة (3) انطلاقا من نتائج الوثيقة (2). حلّل الوثيقة (4)، ماذا تستنتج؟",
              ...OFFICIAL(
                3,
                "Relecture du scan 2018 Maths (Sujet 1, page 3, relue en image). Verbes officiels : تعرّف / اشرح / حلّل … ماذا تستنتج. Questions 1, 2 et 3 du الجزء الثاني, recopiées mot à mot."
              ),
              minLength: 110,
              modelAnswer:
                "(a) المؤشر الغشائي CD4، و(b) المستقبل الغشائي TCR. الأهمية البيولوجية للشكل (ب) انطلاقا من نتائج الوثيقة (2): تعرّف الـ TCR على الببتيد المستضدي المعروض على الـ CMH II من طرف الخلية العارضة يؤدي إلى تنشيط الخلية LT4 وبالتالي قدرتها على إفراز المبلّغ الكيميائي الأنترلوكين 2، وفي غياب هذا التعرف نتيجة الطفرة المشار إليها في الوثيقة (2) لا يتم التنشيط وبالتالي عدم إنتاج وإفراز الأنترلوكين 2. تحليل الوثيقة (4): تمثل الوثيقة (4) منحنى تغيّر عدد الخلايا البلازمية (وأ) بدلالة تركيز الأنترلوكين 2، حيث يتزايد عدد الخلايا البلازمية بتزايد تركيز الأنترلوكين 2. الاستنتاج: الأنترلوكين 2 يحفّز الخلايا الـ LB المحسّسة على التكاثر والتمايز إلى خلايا بلازمية.",
              rule: {
                prompt: "استغل الوثيقتين 3 و4 واستنتج",
                keywords: ["CMH", "أنترلوكين", "خلايا", "استجابه"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 2,
              prompt: "النص العلمي: سبب العجز المناعي الذي يحدثه الفيروس",
              bacPrompt:
                "ممّا سبق ومعلوماتك، اكتب نصّا علميا توضّح فيه سبب العجز المناعي الذي يحدثه فيروس الـ ( ) في العضوية.",
              ...OFFICIAL(
                3,
                "Relecture du scan 2018 Maths (Sujet 1, page 3, relue en image). Verbe officiel : اكتب نصّا علميا. Consigne du الجزء الثالث, recopiée mot à mot ; le nom du virus (parenthèses non dessinées dans le scan du sujet) est imprimé « VIH » dans le corrigé officiel du même dossier (pp. 8-9)."
              ),
              minLength: 110,
              modelAnswer:
                "يتضمن النص النقاط التالية: استهداف فيروس VIH للخلايا LT4 التي تنشط بعد تعرّفها على البيتيد المستضدي المعروض مرتبطا بالـ CMH II من الخلية العارضة بواسطة مستقبلها الغشائي TCR بفضل التكامل البنيوي. إكتساب الـ LT4 نتيجة تنشيطها القدرة على إنتاج وإفراز الأنترلوكين 2. تحفيز الأنترلوكين 2 للخلايا اللمفاوية المحسّسة (LB.LT) على التكاثر والتمايز إلى خلايا مناعية منفّذة (البلازمية، LTH، LTC). استهداف الـ VIH للخلايا LT4 التي تلعب دورا محوريا في الاستجابة المناعية النوعية المكتسبة، فتصبح إصابتها وتخريبها يؤدي إلى نقص إفراز الأنترلوكين 2 ينجم عنه العجز المناعي.",
              rule: {
                prompt: "اكتب نصا علميا حول سبب العجز المناعي",
                keywords: ["خلايا", "لمفاويه", "أنترلوكين", "CMH"],
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
      pdfAvailable: false,
      pdfExternalUrl: PDF,
      pdfLocalUrl: "/subjects/M/2018/sujet-2.pdf",
      pdfNote: PDF_NOTE,
      title: "الموضوع الثاني",
      exercises: [
        {
          number: 1,
          ui: "text",
          label: "اللقاح وتصنيع المستضدات المميتة",
          max: 6,
          desc: "بنية الجزيئة الدفاعية (الجسم المضاد)، ظاهرة الارتباط بعصيات الكزاز، الاستجابة الثانوية ودور اللقاح",
          poles: {
            N: {
              points: 1,
              prompt: "التعرف على الجزيئة الممثلة وتمثيلها برسم تخطيطي",
              bacPrompt: "تعرّف على الجزيئة الممثلة في الشكل (أ)، ثم مثّلها برسم تخطيطي عليه كافة البيانات.",
              ...OFFICIAL(
                4,
                "Relecture du scan 2018 Maths (Sujet 2, page 4 du sujet = page 1 du fichier sujet-2, relue en image). Verbes officiels : تعرّف / مثّل. Question 1 du التمرين الأول, recopiée mot à mot. Réponse du corrigé officiel (même dossier local, p. 10)."
              ),
              placeholder: "الجزيئة: جسم مضاد (غليكوبروتين)... الرسم: سلسلتان ثقيلتان وسلسلتان خفيفتان...",
              minLength: 30,
              modelAnswer:
                "الجسم المضاد (غلوبولين مناعي) بنيته على هيئة Y: موقع تثبيت المحدد، جسر ثنائي الكبريت، منطقة متغيرة، سلسلة خفيفة L، سلسلة ثقيلة H، موقع ارتباط خلوي، منطقة ثابتة (أربع بيانات صحيحة على الرسم + العنوان).",
              rule: {
                prompt: "تعرّف على الجزيئة ورسّمها",
                keywords: ["جسم", "مضاد", "سلاسل", "مستضد"],
                minHits: 2,
                forbidden: []
              }
            },
            S: {
              points: 2,
              prompt: "تسمية الظاهرة الناتجة عن الارتباط بعصيات الكزاز وأهميته",
              bacPrompt:
                "سمِّ الظاهرة الناتجة عن ارتباط جزيئات الشكل (أ) بعصيات الكزاز ثم حدّد أهمية هذا الارتباط.",
              ...OFFICIAL(
                4,
                "Relecture du scan 2018 Maths (Sujet 2, page 4 du sujet, relue en image). Verbes officiels : سمِّ / حدّد. Question 2 du التمرين الأول, recopiée mot à mot."
              ),
              minLength: 40,
              modelAnswer:
                "الظاهرة: الارتصاص (تشكيل معقد مناعي) بين الأجسام المضادة ومحددات المستضد (عصيات الكزاز). أهميته: إبطال مفعول عصيات الكزاز، منع انتشارها، منع تكاثرها، وتنشيط البلعمة.",
              rule: {
                prompt: "سمِّ الظاهرة وحدّد أهميتها",
                keywords: ["معقد", "مستضد", "تعطيل", "حمايه"],
                minHits: 2,
                forbidden: []
              }
            },
            E: {
              points: 1,
              prompt: "ما يميز الاستجابة الثانوية من الشكل (ب)",
              bacPrompt: "حدّد ما يميز الاستجابة الثانوية من الشكل (ب).",
              ...OFFICIAL(
                4,
                "Relecture du scan 2018 Maths (Sujet 2, page 4 du sujet, relue en image). Verbe officiel : حدّد. Question 3 du التمرين الأول, recopiée mot à mot."
              ),
              placeholder: "في الاستجابة الثانوية: الزمن أقصر، الكمية أكبر...",
              minLength: 40,
              modelAnswer:
                "تتميز الاستجابة الثانوية بسرعتها (زمن تأخر أقصر) وارتفاع كمية (كثافة) الأجسام المضادة في المصل.",
              rule: {
                prompt: "حدّد ما يميز الاستجابة الثانوية",
                keywords: ["ثانويه", "سريعه", "كميه", "أجسام"],
                minHits: 2,
                forbidden: []
              }
            },
            W: {
              points: 2,
              prompt: "النص العلمي: كيف يؤدي اللقاح إلى مساعدة العضوية في التصدي للمستضدات المميتة",
              bacPrompt:
                "بيّن في نصّ علمي كيف يؤدي اللقاح إلى مساعدة العضوية في التصدي للمستضدات المميتة كعصيات الكزاز، انطلاقا من الوثيقة ومعلوماتك.",
              ...OFFICIAL(
                4,
                "Relecture du scan 2018 Maths (Sujet 2, page 4 du sujet, relue en image). Verbe officiel : بيّن في نصّ علمي. Question 4 du التمرين الأول, recopiée mot à mot."
              ),
              minLength: 100,
              modelAnswer:
                "عصيات الكزاز أجسام غريبة يؤدي دخولها للعضوية إلى توليد استجابة مناعية خلطية، إلا أن مفعولها السام بسبب إفرازها لتوكسين الكزاز يجعلها تقتل الكائن الحي قبل قيام عضويته بإقصائها. ولحمايته يتم حقنه بالأناتوكسين التكزري (اللقاح) حتى تتولد لديه استجابة مناعية أولية (ذاكرة مناعية LBm) تجعل عضويته مهيأة للاستجابة بصورة سريعة وقوية وتركيب أجسام مضادة بكثرة وصورة كثيفة إذا تمت إصابته بمستضد الكزاز (عصيات الكزاز) مرة أخرى، فيتعرف الكائن الحي على هوية المستضد السام لتكوّن ذاكرة مناعية تسمح لها باكتساب حصانة مناعية ضد الكزاز.",
              rule: {
                prompt: "بيّن دور اللقاح في نص علمي",
                keywords: ["لقاح", "أجسام", "ذاكره", "مستضد"],
                minHits: 3,
                forbidden: []
              }
            }
          }
        },
        {
          number: 2,
          ui: "text",
          label: "مورثة الريبونوكلياز والبروتين غير العادي",
          max: 14,
          desc: "بنية الريبونوكلياز (RNase)، استعمال جهاز ترجمتها، ثم جزء المورثة غير العادي ومتتالية الأحماض الأمينية الموافقة",
          poles: {
            N: {
              points: 3,
              prompt: "التعرف على البيانات ومستوى البنية الفراغية مع التعليل ومثّل الصيغة",
              // Questions 1 et 2 du الجزء الأول (page 5), mot à mot.
              bacPrompt:
                "تعرّف على البيانات المرقمة من 1 إلى 3 محدّدا مستوى البنية الفراغية لهذا البروتين مع التّعليل. مثّل الصيغة الكيميائية للجزء (س) الممثّل في الشكل (أ)، مبرزا باقي الروابط الكيميائية المساهمة في تشكيل واستقرار هذه البنية.",
              ...OFFICIAL(
                5,
                "Relecture du scan 2018 Maths (Sujet 2, page 5 du sujet = page 2 du fichier sujet-2, relue en image). Verbes officiels : تعرّف … محدّدا / مثّل. Question 1 et Question 2 du الجزء الأول, recopiées mot à mot."
              ),
              minLength: 80,
              modelAnswer:
                "البيانات المرقمة: 1 منطقة إنعطاف، 2 بنية حلزونية α، 3 بنية وريقية β. مستوى بنية البروتين: بنية ثالثية. التعليل: وجود سلسلة ببتيدية واحدة بها مجموعة من البنيات الثانوية α و β بالإضافة إلى وجود مناطق إنعطاف. تمثيل الصيغة الكيميائية للجزء المؤطر (س): سلسلة ببتيدية تضم السيسيتين المرتبطين بجسر ثنائي الكبريت، مع الأسبارجين والليزين في الطرفين، وتمثل الروابط: الجسور ثنائية الكبريت، الروابط الهيدروجينية، الرابطة الشاردية (الملحية)، والرابطة الكارهة للماء.",
              rule: {
                prompt: "تعرّف على البيانات ومثّل الصيغة",
                keywords: ["حلزون", "بيت", "ببتيديه", "كبريت"],
                minHits: 3,
                forbidden: []
              }
            },
            S: {
              points: 5,
              prompt: "إكمال جدول الشكل (أ) واستخراج جزء المورثة المسؤول",
              // Question 1 (أ et ب) du الجزء الثاني (page 6), mot à mot.
              bacPrompt:
                "أكمل جدول الشكل (أ) بعد نقله على ورقة الإجابة (اعتمادا على جدول الشفرة الوراثية). استخرج جزء المورثة المسؤول عن تركيب متتالية الأحماض الأمينية.",
              ...OFFICIAL(
                6,
                "Relecture du scan 2018 Maths (Sujet 2, page 6 du sujet = page 3 du fichier sujet-2, relue en image). Verbes officiels : أكمل / استخرج. Question 1 (أ et ب) du الجزء الثاني, recopiée mot à mot. Tableau complet, séquences d ADN et calcul : corrigé officiel p. 11."
              ),
              minLength: 90,
              modelAnswer:
                "إكمال الجدول: الأحماض الأمينية His – Phe – Asp – Pro – Ser – Val، ورامزاتها المضادة GUA – AAA – CUA – GGA – AGU – CAG، ورامزات ARNm الموافقة CAU – UUU – GAU – CCU – UCA – GUC. استخراج جزء المورثة المسؤول: السلسلة المستنسخة GTA AAA CTA GGA AGT CAG ATT والسلسلة غير المستنسخة CAT TTT GAT CCT TCA GTC TAA (بحساب الفاصل بين المجموعتين).",
              rule: {
                prompt: "أكمل الجدول واستخرج جزء المورثة",
                keywords: ["رامزه", "ARNm", "جدول", "مورثه"],
                minHits: 3,
                forbidden: []
              }
            },
            E: {
              points: 4,
              prompt: "متتالية الأحماض الأمينية للشكل (ب) وسبب الريبونوكلياز غير العادي",
              // Question 2 (أ et ب) du الجزء الثاني (page 6), mot à mot.
              bacPrompt:
                "مثّل متتالية الأحماض الأمينية الموافقة للجزء الممثّل في الشّكل (ب). حدّد بدقة سبب تركيب ريبونوكلياز غير عادي، مبيّنا النتيجة المترتبة عن ذلك على المستوى الجزيئي.",
              ...OFFICIAL(
                6,
                "Relecture du scan 2018 Maths (Sujet 2, page 6 du sujet, relue en image). Verbes officiels : مثّل / حدّد … مبيّنا. Question 2 (أ et ب) du الجزء الثاني, recopiées mot à mot. Position 362 / codon 120 (Phe → Tyr) : corrigé officiel pp. 11-12."
              ),
              minLength: 110,
              modelAnswer:
                "متتالية الأحماض الأمينية الموافقة للجزء الممثل: السلسلة الببتيدية His–Tyr–Asp–Pro–Ser–Val. سبب تركيب الريبونوكلياز غير العادي: استبدال النيكليوتيد A رقم 362 (أو النيكليوتيد رقم 2 من الرامزة الموافقة للحمض الأميني رقم 120) بالنيكليوتيد T في سلسلة الـ ADN المستنسخة المسؤولة عن تركيب هذا البروتين، أدى إلى تعويض الحمض الأميني رقم 120 Phe بالحمض الأميني Tyr، وهو تعويض أدى إلى تغيّر في البنية الفراغية الأصلية لهذا الأنزيم. النتيجة على المستوى الجزيئي: تصبح جزيئة الريبونوكلياز غير وظيفية.",
              rule: {
                prompt: "مثّل متتالية الأحماض وحدّد سبب الخلل",
                keywords: ["طفره", "رامزه", "بنيه", "استبدال"],
                minHits: 3,
                forbidden: []
              }
            },
            W: {
              points: 2,
              prompt: "النص العلمي: العلاقة بين المورثة ووظيفة البروتين",
              bacPrompt:
                "وضّح في نصّ علمي العلاقة بين المورثة ووظيفة البروتين، من خلال ما توصلت إليه ومعلوماتك.",
              ...OFFICIAL(
                6,
                "Relecture du scan 2018 Maths (Sujet 2, page 6 du sujet, relue en image). Verbe officiel : وضّح في نصّ علمي. Consigne du الجزء الثالث, recopiée mot à mot. Texte : corrigé officiel p. 12."
              ),
              minLength: 100,
              modelAnswer:
                "تترك العضوية الجزيئات البروتينية التي تتميز بتخصص عال، وفق معلومات وراثية، وأي خلل في هذه المعلومة ينتج عنه بروتين غير طبيعي (غير وظيفي). يعود التخصص الوظيفي للبروتين إلى البنية الفراغية التي تتوقف على الروابط التي تنشأ بين أحماض أمينية محددة ومتموضعة بطريقة دقيقة في السلسلة الببتيدية حسب الرسالة الوراثية المنقولة من المورثة على الـ ARNm. أي خلل في هذه الرسالة يؤدي إلى حدوث تغيّر في السلسلة الببتيدية ينتج عنه فقدان البنية الطبيعية وبالتالي فقدان الوظيفة، ويتطلب النشاط العادي للبروتين بنية فراغية طبيعية متعلقة بسلامة الشفرة الوراثية.",
              rule: {
                prompt: "وضّح العلاقة بين المورثة ووظيفة البروتين",
                keywords: ["مورثه", "ARNm", "بنيه", "وظيفه"],
                minHits: 3,
                forbidden: []
              }
            }
          }
        }
      ]
    }
  ]
};

export default YEAR_2018_M;
