/* ============================================================
   ENGINE — évaluation sémantique réelle + minuteurs fiables
   ------------------------------------------------------------
   Améliorations P1 :
     - Tolérance aux variantes de mots-clés et clitiques arabes.
     - Évaluation pondérée : zéro concept biologique = zéro point.
     - Feedback précis (notions acquises vs manquantes vs interdits).
   ============================================================ */

import { normalizeArabic, stripArabicClitics } from "../data/subjects.js";
import { store } from "./store.js";

/* ---------- Lexique méthodologique & outils de profilage ---------- */
const CONNECTORS = [
  "في", "من", "علي", "الي", "عن", "مع", "خلال", "عبر", "داخل", "خارج",
  "ان", "انها", "حيث", "اذ", "عند", "عندما", "بينما", "حين", "اما",
  "بواسطه", "عن طريق", "مما", "ادي", "يؤدي", "يعمل", "يقوم", "يلعب",
  "يتم", "نلاحظ", "يبين", "يوضح", "يمثل", "يعود", "يرتبط", "يثبت",
  "يتثبت", "ينتج", "بالتالي", "نستنتج", "ومنه", "اذن", "خلاصه", "مقارنه",
  "تفسير", "دورا", "اساسيا", "نتيجه", "تاثير", "بسبب", "العلاقه", "رغم"
];

const ARABIC_STOPWORDS = new Set([
  "من","في","على","علي","الى","الي","عن","مع","هذا","هذه","ذلك","تلك","ثم","كما","بعد","قبل",
  "عند","بين","حيث","اذا","اذ","او","ام","بل","فان","فانه","لان","لانها","لانهم","قد","لقد","تم",
  "يتم","هو","هي","هم","هن","كان","كانت","يكون","تكون","الى","حتي","حتى","كل","جدا","جداً","اي",
  "ايضا","ايضاً","ما","ماذا","هل","كيف","لماذا","التي","الذي","الذين","اللاتي","ذلك","هنا","هناك",
  "دون","ضمن","حسب","عبر","فقط","تمثل","يوضح","تبين","نلاحظ","نستنتج","خلاصه","خلاصة","اذن","ومنه"
]);

const POLE_MARKERS = {
  N: {
    title: "تأطير المشكلة",
    primary: ["مشكل", "اشكالي", "اشكاليه", "تساؤل", "تحديد", "علاقه", "دور", "تاثير", "كيف"],
    secondary: ["متغير", "مستقل", "تابع", "فرضيه", "فرضيات", "يدرس", "تدخل", "يتدخل"],
    summary: "كان يجب صياغة المشكل العلمي أو المتغيرات بوضوح، لا مجرد تكرار كلمات الدرس."
  },
  S: {
    title: "استغلال السندات",
    primary: ["نلاحظ", "نسجل", "يبين", "يوضح", "يظهر", "يمثل", "مقارنه", "في حين", "بينما"],
    secondary: ["قيمه", "قيم", "نسبه", "تركيز", "تركيزات", "تزايد", "تناقص", "يرتفع", "ينخفض", "استنتاج", "مما يدل"],
    summary: "في هذا القطب يجب قراءة الوثيقة ومقارنتها واستخراج الاستنتاج، لا القفز مباشرة إلى التفسير السببي."
  },
  E: {
    title: "الربط والتفسير",
    primary: ["يعود", "نتيجه", "بسبب", "مما يؤدي", "يفسر", "لذلك", "بالتالي", "اذن"],
    secondary: ["يرتبط", "يفعل", "ينشط", "يثبط", "يمنع", "يسمح", "يفتح", "يغلق", "يحرر", "ينتج", "يتثبت"],
    summary: "المطلوب هنا سلسلة سببية وآلية دقيقة، لا ملاحظات وصفية عامة."
  },
  W: {
    title: "التركيب والمصادقة",
    primary: ["خلاصه", "خلاصة", "نستنتج", "اذن", "في الختام", "بالتالي", "وعليه", "يتضح"],
    secondary: ["يثبت", "يصادق", "مصادقه", "نهائيا", "بناء", "اجمالا", "اجمالاً"],
    summary: "كان يجب جمع النتائج في خلاصة نهائية أو مصادقة صريحة، لا إعادة شرح جزئي غير مكتمل."
  }
};

function stemArabicToken(token) {
  if (!token) return "";
  let t = stripArabicClitics(normalizeArabic(token));
  if (t.length >= 6 && /(كما|هما|يات)$/.test(t)) t = t.slice(0, -3);
  else if (t.length >= 5 && /(كم|كن|نا|ها|هم|هن|ات|ون|ين|ان)$/.test(t)) t = t.slice(0, -2);
  if (t.length >= 5 && /(ه|ي)$/.test(t)) t = t.slice(0, -1);
  return t.trim();
}

function flattenKeywords(keywords = []) {
  return keywords.flatMap(concept => Array.isArray(concept) ? concept : [concept]);
}

function tokenizeArabic(text) {
  return normalizeArabic(text)
    .split(/\s+/)
    .map(stemArabicToken)
    .filter(Boolean);
}

function extractInformativeTokens(text) {
  const uniq = [];
  const seen = new Set();
  tokenizeArabic(text).forEach(token => {
    if (token.length < 3) return;
    if (ARABIC_STOPWORDS.has(token)) return;
    if (seen.has(token)) return;
    seen.add(token);
    uniq.push(token);
  });
  return uniq;
}

function countMarkerHits(normText, markers = []) {
  return markers.filter(marker => matchConcept(normText, marker)).length;
}

function computeReferenceOverlap(text, rule = {}) {
  const answerTokens = extractInformativeTokens(text);
  const answerSet = new Set(answerTokens);
  const keywordTokens = extractInformativeTokens(flattenKeywords(rule.keywords || []).join(" "));
  const modelTokens = extractInformativeTokens([rule.modelAnswer, rule.prompt].filter(Boolean).join(" "));
  const referenceTokens = [...new Set([...keywordTokens, ...modelTokens])].slice(0, 12);
  const matchedTokens = referenceTokens.filter(token => answerSet.has(token));
  const missingTokens = referenceTokens.filter(token => !answerSet.has(token));
  const target = Math.max(1, Math.min(6, referenceTokens.length || keywordTokens.length || 1));
  return {
    matchedTokens,
    missingTokens,
    referenceTokens,
    ratio: Math.min(1, matchedTokens.length / target),
    answerTokens
  };
}

const CONCEPT_ALIASES = {
  "تركيب": ["اصطناع", "تخليق"],
  "اصطناع": ["تركيب", "تخليق"],
  "بروتين": ["بروتينات", "عديدات الببتيد"],
  "رسول": ["مرنا", "mrna", "arnm"],
  "ناقل": ["ارنت", "arnt", "trna"],
  "ريبوزوم": ["ريبوزومي", "ريبوزومات"],
  "طبيعي": ["الشاهد", "سليم"],
  "طافر": ["طفرة", "الطافر"],
  "نمو": ["تكاثر"],
  "انزيم": ["إنزيم", "انزيمات"],
  "تدرج": ["تدرج بروتوني", "التدرج البروتوني"],
  "كريه": ["كرية", "الكرية المذنبة"],
  "مستضد": ["مولد الضد", "antigene"],
  "مضاده": ["مضاد", "جسم مضاد"],
  "بلعمه": ["البلعمة", "phagocytose"],
  "sod": ["سوبر اكسيد"],
  "rubisco": ["روبيسكو"]
};

function aliasesFor(term) {
  const key = normalizeArabic(term);
  const extra = CONCEPT_ALIASES[key] || CONCEPT_ALIASES[key.replace(/^ال/, "")] || [];
  return [term, ...extra];
}

/* ---------- Vérification d'un concept sémantique ---------- */
export function matchConcept(text, conceptDef) {
  if (!text) return false;
  const normText = normalizeArabic(text);
  if (!normText) return false;

  const synonyms = (Array.isArray(conceptDef) ? conceptDef : [conceptDef]).flatMap(aliasesFor);
  const words = normText.split(/\s+/).filter(Boolean);
  const strippedWords = words.map(stripArabicClitics).map(stemArabicToken);

  for (const syn of synonyms) {
    const normSyn = normalizeArabic(syn);
    if (!normSyn) continue;

    if (normText.includes(normSyn)) return true;

    const strippedSyn = stemArabicToken(normSyn);
    // Stems trop courts (لأن → ان) collent à أنه / أن — faux positifs méthodologiques.
    if (strippedSyn.length >= 3 && strippedWords.some(w => w === strippedSyn || (strippedSyn.length >= 4 && w.startsWith(strippedSyn)))) {
      return true;
    }
  }
  return false;
}

/* ---------- Analyse de la structure syntaxique et méthodologique ---------- */
export function analyzeSentenceStructure(normText, poleType) {
  if (!normText) {
    return {
      wordCount: 0,
      connectorHits: 0,
      sentenceSignals: 0,
      informativeWords: 0,
      isKeywordDump: true,
      hasConnectors: false,
      lexicalDensity: 0
    };
  }

  const words = normText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const informativeWords = extractInformativeTokens(normText).length;
  const connectorHits = CONNECTORS.filter(c => normText.includes(c)).length;
  const sentenceSignals = ["ي", "ت", "ن", "س"].reduce((count, prefix) => count + words.filter(w => w.startsWith(prefix) && w.length >= 4).length, 0);
  const hasConnectors = connectorHits > 0;
  const lexicalDensity = wordCount ? informativeWords / wordCount : 0;
  const isKeywordDump = wordCount < 5 || (wordCount <= 8 && connectorHits === 0) || (informativeWords >= 2 && sentenceSignals === 0 && connectorHits === 0);

  return {
    wordCount,
    connectorHits,
    sentenceSignals,
    informativeWords,
    isKeywordDump,
    hasConnectors,
    lexicalDensity,
    poleType
  };
}

function inferTaskSignals(rule = {}, poleType = "") {
  const promptRef = normalizeArabic(rule.prompt || "");
  const answerRef = normalizeArabic(rule.modelAnswer || "");
  const mergedRef = normalizeArabic([rule.prompt, rule.modelAnswer].filter(Boolean).join(" "));
  const wrap = txt => ` ${txt} `;
  const containsToken = (txt, term) => wrap(txt).includes(` ${normalizeArabic(term)} `);
  const hasTokenIn = (txt, ...terms) => terms.some(term => containsToken(txt, term));
  const hasTextIn = (txt, ...terms) => terms.some(term => txt.includes(normalizeArabic(term)));
  const promptHasToken = (...terms) => hasTokenIn(promptRef, ...terms);
  const promptHasText = (...terms) => hasTextIn(promptRef, ...terms);
  const anyHasToken = (...terms) => hasTokenIn(mergedRef, ...terms);
  const anyHasText = (...terms) => hasTextIn(mergedRef, ...terms);

  const usesPreciserVerb = promptHasToken("حدد");
  const docDriven = poleType === "S" || anyHasText("وثيقه", "وثيقة", "منحني", "منحنى", "جدول", "شكل", "سند", "السند") || promptHasText("باستغلال", "اعتمادا", "انطلاقا");
  const openVerbTerms = ["اشرح", "وضح", "بين", "فسر", "علق", "استخرج", "استنتج", "استدل", "ناقش", "برهن", "اثبت", "أثبت", "صادق"];
  const openVerbCount = openVerbTerms.filter(term => promptHasToken(term) || promptHasText(term)).length;
  const requiresRelation = promptHasText("حدد العلاقة", "العلاقة بين") || (usesPreciserVerb && promptHasToken("العلاقة"));
  const requiresVariables = promptHasText("المتغير", "المتغيرات") || (usesPreciserVerb && (promptHasToken("المستقل", "التابع") || promptHasText("المتغير")));
  const requiresImportance = promptHasText("الاهمية", "الأهمية") || (usesPreciserVerb && promptHasText("اهمية", "أهمية"));
  const requiresMechanismPrecision = promptHasText("حدد كيف", "حدد آلية", "حدد الية", "حدد طريقة") || (usesPreciserVerb && (promptHasToken("كيف") || promptHasText("آليه", "آلية", "طريقة")));
  const requiresDirectPrecision = usesPreciserVerb && (promptHasText("مكونات", "مراحل", "عناصر", "خطوات", "شروط", "بيانات") || promptHasToken("المكونات", "المراحل", "العناصر", "الخطوات", "الشروط", "البيانات"));
  const requiresDiscussion = promptHasToken("ناقش") || promptHasText("مناقشة");
  const requiresCommentary = promptHasToken("علق") || promptHasText("تعليق");
  const requiresExtraction = promptHasToken("استخرج", "استنتج") || promptHasText("استخلص", "الاستخلاص");
  const explanationVerbRequested = promptHasToken("اشرح", "وضح", "بين");
  const openInstruction = docDriven && (openVerbCount === 1 || promptHasText("باستغلال", "اعتمادا", "انطلاقا"));
  const requiresOpenExplanation = explanationVerbRequested && openInstruction && !requiresCommentary && !requiresDiscussion;

  return {
    usesPreciserVerb,
    docDriven,
    openInstruction,
    requiresQuestion: poleType === "N" || promptHasText("اشكاليه", "اشكالية", "مشكل", "تساؤل") || promptHasToken("سؤال") || anyHasText("المشكل العلمي", "الإشكالية"),
    requiresObservationVerb: poleType === "S" || promptHasToken("تحليل", "حلل", "استغلال", "علق") || anyHasText("وثيقه", "وثيقة", "بالارقام", "بالأرقام", "منحني", "منحنى", "جدول", "شكل"),
    requiresComparison: promptHasToken("قارن", "مقارنه", "مقارنة") || promptHasText("تحليل مقارن", "بالتوازي"),
    requiresDefinition: promptHasToken("عرف", "تعريف") || promptHasText("قدم تعريفا", "ما هو", "ما هي", "ماهي"),
    requiresDescription: promptHasToken("صف", "وصف") || promptHasText("قدم وصفا"),
    requiresNaming: promptHasToken("تعرف", "سم", "سمي") || promptHasText("تعرف على", "سم البيانات", "اكتب البيانات"),
    requiresListing: promptHasToken("اذكر", "عدد") || requiresDirectPrecision,
    requiresClassification: promptHasToken("صنف", "تصنيف"),
    requiresDistinction: promptHasToken("ميز", "التمييز"),
    requiresRelation,
    requiresVariables,
    requiresImportance,
    requiresMechanismPrecision,
    requiresDocumentIntro: docDriven,
    requiresConclusion: poleType === "W" || promptHasToken("استنتج") || anyHasText("استنتاج", "استخلاص", "خلاصه", "خلاصة", "خاتمه", "خاتمة", "مصادقه", "مصادقة"),
    requiresCausalChain: poleType === "E" || promptHasToken("تفسير", "فسر", "علل", "اشرح", "وضح", "بين") || anyHasText("الربط", "اليه", "آليه", "آلية", "استدلال") || requiresMechanismPrecision || requiresImportance,
    requiresScientificText: poleType === "W" || promptHasText("نص علمي", "حرر نصا علميا", "اكتب نصا علميا", "مهيكل", "منظم") || answerRef.includes(normalizeArabic("مقدمة")) || answerRef.includes(normalizeArabic("خاتمة")),
    requiresHypothesis: promptHasText("اقترح فرضية", "اقترح فرضيتين", "فرضية تفسيرية") || anyHasText("فرضيه", "فرضية", "فرضيات"),
    requiresProblemFormulation: poleType === "N" || promptHasText("حدد المشكل", "صغ المشكل", "المشكل العلمي", "الاشكالية", "الإشكالية"),
    requiresExtraction,
    requiresOpenExtraction: requiresExtraction && openInstruction,
    requiresJustification: promptHasToken("علل", "برر") || requiresImportance,
    requiresCritique: promptHasToken("انقد", "نقد"),
    requiresCommentary,
    requiresOpenCommentary: requiresCommentary && openInstruction,
    requiresDiscussion,
    requiresOpenDiscussion: requiresDiscussion && openInstruction,
    requiresOpenExplanation,
    requiresValidation: promptHasText("صادق على", "تحقق من صحة", "تأكد من صحة", "ناقش مدى صحة") || promptHasToken("اثبت", "أثبت", "برهن"),
    requiresOpenReasoning: promptHasToken("اشرح", "وضح", "بين", "استدل", "ناقش", "برهن", "اثبت", "أثبت", "علق", "استخرج", "فسر") || requiresRelation || requiresMechanismPrecision,
    allowsCausalTerms: !(poleType === "S" || promptHasToken("تحليل", "حلل", "استغلال") || promptHasText("بالارقام", "بالأرقام"))
  };
}

function buildTaskProfile(id, label, summary, options = {}) {
  return {
    id,
    label,
    summary,
    mode: options.mode || "open",
    toleratesShortAnswer: !!options.toleratesShortAnswer
  };
}

function deriveTaskProfile(signals, poleType) {
  if (signals.requiresScientificText) {
    return buildTaskProfile("scientific-text", "نص علمي", "المطلوب نص علمي منظم: مقدمة، عرض، خاتمة.", { mode: "open" });
  }
  if (signals.requiresProblemFormulation) {
    return buildTaskProfile("problem", "طرح مشكل علمي", signals.requiresVariables ? "المطلوب صياغة الإشكالية مع تحديد المتغيرات أو عناصر الدراسة بدقة." : "المطلوب صياغة الإشكالية أو تحديد المتغيرات بدقة.", { mode: "open" });
  }
  if (signals.requiresVariables) {
    return buildTaskProfile("variables", "تحديد متغيرات", "المطلوب تعيين المتغير المستقل والتابع أو عناصر الضبط بعبارة دقيقة ومباشرة.", { mode: "closed", toleratesShortAnswer: true });
  }
  if (signals.requiresRelation) {
    return buildTaskProfile("relation", "تحديد علاقة", "المطلوب بيان العلاقة بين عنصرين أو أكثر بصياغة علمية واضحة مثل: كلما... أو علاقة طردية/عكسية.", { mode: signals.openInstruction ? "open" : "closed" });
  }
  if (signals.requiresNaming) {
    return buildTaskProfile("naming", "تسمية / تعرف", "المطلوب تعيين العنصر بالاسم العلمي الدقيق دون شرح مطول.", { mode: "closed", toleratesShortAnswer: true });
  }
  if (signals.requiresDefinition) {
    return buildTaskProfile("definition", "تعريف علمي", "في التعريف يجب ذكر ماهية العنصر ثم وصفه ودوره أو مقره عند الحاجة.", { mode: "closed" });
  }
  if (signals.requiresDescription) {
    return buildTaskProfile("description", "وصف علمي", "الوصف يتطلب إبراز الخصائص أو البنية أو المقر بتفصيل أوضح من مجرد التعريف.", { mode: "closed" });
  }
  if (signals.requiresClassification) {
    return buildTaskProfile("classification", "تصنيف", "التصنيف يقتضي ترتيب العناصر في مجموعات واضحة وفق معيار محدد.", { mode: "closed" });
  }
  if (signals.requiresListing) {
    return buildTaskProfile("listing", "ذكر / تعداد", "المطلوب سرد العناصر مباشرة وباختصار دون تفسير زائد.", { mode: "closed", toleratesShortAnswer: true });
  }
  if (signals.requiresDistinction) {
    return buildTaskProfile("distinction", "تمييز", "المطلوب إبراز أوجه الاختلاف بين العنصرين بعبارات مقابلة واضحة.", { mode: "closed" });
  }
  if (signals.requiresComparison) {
    return buildTaskProfile("comparison", "مقارنة", "المطلوب إبراز أوجه الشبه والاختلاف باستعمال عبارات مقارنة واضحة.", { mode: "open" });
  }
  if (signals.requiresCritique) {
    return buildTaskProfile("critique", "نقد علمي", "النقد الجيد يذكر الإيجابيات والسلبيات ثم ينتهي بموقف معلل.", { mode: "open" });
  }
  if (signals.requiresValidation) {
    return buildTaskProfile("validation", "مصادقة / تحقق", "المطلوب استغلال المعطيات ثم تأكيد الفرضية الصحيحة أو نفي الخاطئة صراحة.", { mode: "open" });
  }
  if (signals.requiresDiscussion) {
    return buildTaskProfile("discussion", "مناقشة علمية", "المطلوب تفكيك المعطيات ثم مناقشتها بحجج أو تفسير أو حكم نهائي واضح.", { mode: "open" });
  }
  if (signals.requiresCommentary) {
    return buildTaskProfile("commentary", "تعليق علمي", "التعليق يجمع بين الملاحظة والشرح والوصول إلى نتيجة مرتبطة بالهدف.", { mode: "open" });
  }
  if (signals.requiresExtraction) {
    return buildTaskProfile("extraction", "استخراج / استنتاج", "المطلوب استخراج المعلومة العلمية الصحيحة من السند لا إعادة نسخه حرفياً فقط.", { mode: signals.requiresOpenExtraction ? "open" : "closed" });
  }
  if (signals.requiresOpenExplanation) {
    return buildTaskProfile("analysis-explanation", "تحليل ثم تفسير", "في هذا النوع لا يكفي الشرح المباشر؛ يجب أولاً استغلال الوثيقة أو السند ثم تفسير النتائج والربط بينها.", { mode: "open" });
  }
  if (signals.requiresJustification || signals.requiresImportance) {
    return buildTaskProfile(signals.requiresImportance ? "importance" : "justification", signals.requiresImportance ? "تحديد أهمية" : "تعليل / تبرير", signals.requiresImportance ? "المطلوب بيان الأهمية أو الفائدة أو الدور العلمي صراحة لا مجرد تسمية العنصر." : "التبرير العلمي يحتاج حججاً من السند ومكتسبات قبلية مع رابطة سببية صريحة.", { mode: signals.openInstruction ? "open" : "closed" });
  }
  if (signals.requiresHypothesis) {
    return buildTaskProfile("hypothesis", "فرضية علمية", "الفرضية يجب أن تكون تفسيرية، معقولة، وقابلة للفحص.", { mode: "open" });
  }
  if (poleType === "S") {
    return buildTaskProfile("analysis", "تحليل وثيقة", "المطلوب تقديم الوثيقة، الملاحظة، المقارنة، ثم الاستنتاج دون تفسير سببي.", { mode: "open" });
  }
  if (poleType === "E" || signals.requiresCausalChain || signals.requiresMechanismPrecision || signals.requiresOpenReasoning) {
    return buildTaskProfile("explanation", "تفسير / استدلال", "المطلوب شرح سببي وآلية بيولوجية مترابطة.", { mode: "open" });
  }
  return buildTaskProfile("synthesis", "تركيب / خلاصة", "المطلوب جمع النتائج في خلاصة نهائية واضحة.", { mode: "open" });
}

function evaluateMethodology(text, normText, poleType, structure, hits, req, rule = {}, taskProfile = null, signals = null) {
  const meta = POLE_MARKERS[poleType] || null;
  const resolvedSignals = signals || inferTaskSignals(rule, poleType);
  const resolvedTaskProfile = taskProfile || deriveTaskProfile(resolvedSignals, poleType);
  const rawHasQuestion = /[؟?]/.test(text) || matchConcept(normText, ["كيف", "ما", "هل"]);
  const hasNumbers = /[0-9٠-٩]/.test(text);
  const usesObservationVerb = matchConcept(normText, ["نلاحظ", "نسجل", "يبين", "يوضح", "يظهر", "نشاهد", "نعاين", "يمثل", "يتبين"]);
  const hasDocumentIntro = matchConcept(normText, ["يمثل", "تتمثل", "الوثيقه", "الوثيقة", "المنحني", "المنحنى", "الجدول", "الشكل", "الصوره", "الصورة"]);
  const usesComparison = hasNumbers || matchConcept(normText, ["بينما", "في حين", "مقارنه", "مقارنة", "اكثر", "أكثر", "اقل", "أقل", "مقابل", "بالتوازي", "بالمقابل", "يقابله"]);
  const usesConclusion = matchConcept(normText, ["استنتاج", "نستنتج", "مما يدل", "يدل", "خلاصه", "خلاصة", "وعليه", "اذن", "بالتالي", "في الختام", "يتضح", "ومنه"]);
  const usesCausal = matchConcept(normText, ["بسبب", "يعود", "نتيجه", "نتيجة", "مما يؤدي", "يفسر", "لذلك", "لان", "لأن", "بما ان", "بما أن", "راجع الى", "راجع إلى"]);
  const usesMechanism = matchConcept(normText, ["يرتبط", "ترتبط", "يتثبت", "ينشط", "يفعل", "يثبط", "يمنع", "يسمح", "يفتح", "يغلق", "يحرر", "ينتج", "يتحول", "يفرز", "ينقسم", "يحفز", "تحفز", "يسد", "تسهل", "تعطل", "تتشكل", "تشكل", "فسفره", "فسفرة", "تدفق"]);
  const usesHypothesisRegister = matchConcept(normText, ["فرضيه", "فرضية", "نفترض", "قد", "ربما"]);
  const hasOpening = matchConcept(normText, ["يعد", "تعد", "تعتبر", "يتمثل", "تتمثل", "تلعب", "يحدث", "تحدث", "في البدايه", "في البداية"]);
  const hasParagraphBreak = /\r?\n/.test(text);
  const hasListMarkers = /[،,؛;:\n]/.test(text) || matchConcept(normText, ["ثم", "تليها", "اخيرا", "أخيرا", "اولا", "أولا"]);
  const hasCategory = matchConcept(normText, ["جزيئه", "جزيئة", "ظاهره", "ظاهرة", "عضيه", "عضية", "حمض", "بروتين", "انزيم", "إنزيم", "خليه", "خلية", "بنيه", "بنية", "مورثه", "مورثة", "مستقبل", "معقد", "ريبوزوم"]);
  const hasDescriptor = matchConcept(normText, ["يتكون", "يتالف", "يتألف", "يحدث", "يتوضع", "يوجد", "يحمل", "يتمثل", "يتميز", "عباره", "عبارة", "يحتوي"]);
  const hasRole = matchConcept(normText, ["دور", "وظيفه", "وظيفة", "يسمح", "ينقل", "يثبت", "يحفز", "مسؤول", "يساهم", "اهميه", "أهمية", "ضروري", "ضرورية", "يفيد"]);
  const hasDifference = matchConcept(normText, ["بينما", "في حين", "اما", "أمّا", "يختلف", "على عكس", "بالمقابل", "يقابله"]);
  const hasCriterion = matchConcept(normText, ["حسب", "معيار", "فئات", "مجموعات", "انواع", "أنواع"]);
  const hasEvidenceRegister = usesObservationVerb || hasDocumentIntro || matchConcept(normText, ["من الوثيقة", "يتبين", "تظهر", "تبين", "نلاحظ"]);
  const hasKnowledgeRegister = matchConcept(normText, ["نعلم", "بما ان", "بما أن", "لان", "لأن", "بحكم", "ذلك أن"]);
  const hasValidationJudgement = matchConcept(normText, ["صحه", "صحة", "تثبت", "يثبت", "تؤكد", "يؤكد", "تنفي", "يفند", "مصادقه", "مصادقة", "مرفوضه", "مرفوضة"]);
  const hasPros = matchConcept(normText, ["ايجابيات", "إيجابيات", "محاسن", "فوائد", "مزايا", "يسمح", "يفيد"]);
  const hasCons = matchConcept(normText, ["سلبيات", "مساوئ", "مخاطر", "عيوب", "لكن", "رغم ذلك", "غير ان", "غير أن"]);
  const hasBalancedJudgement = matchConcept(normText, ["لذلك", "من الافضل", "من الأفضل", "ينبغي", "يفضل", "ولهذا"]);
  const hasRelationPhrase = matchConcept(normText, ["العلاقه", "العلاقة", "كلما", "علاقه طرديه", "علاقة طردية", "علاقه عكسيه", "علاقة عكسية", "يتناسب", "تتناسب", "ترتبط"]);
  const mentionsIndependent = matchConcept(normText, ["مستقل", "المستقل"]);
  const mentionsDependent = matchConcept(normText, ["تابع", "التابع"]);
  const strengths = [];
  const missing = [];
  let passed = 0;
  let total = 0;

  const check = (ok, okMsg, failMsg) => {
    total += 1;
    if (ok) {
      passed += 1;
      if (okMsg) strengths.push(okMsg);
    } else if (failMsg) {
      missing.push(failMsg);
    }
  };

  if (resolvedTaskProfile.id === "scientific-text") {
    check(hasOpening || structure.wordCount >= 12, "هناك مدخل أو تمهيد مقبول", "النص العلمي يحتاج مدخلاً قصيراً يهيئ للمشكل قبل العرض.");
    check(!resolvedSignals.requiresQuestion || rawHasQuestion || structure.wordCount >= 15, "المشكل أو الفكرة المحورية واضحان", "في النص العلمي الأفضل إبراز الإشكالية أو السؤال المحوري بوضوح.");
    check(structure.connectorHits >= 2 && structure.wordCount >= 12, "العرض مترابط وغني بالروابط", "العرض ضعيف أو مفكك؛ النص العلمي يحتاج عرضاً مترابطاً لا أفكاراً مبعثرة.");
    check(usesConclusion || (hasParagraphBreak && structure.wordCount >= 16), "الخاتمة أو الحوصلة النهائية حاضرة", "الخاتمة غائبة: اجمع النتيجة في سطر نهائي واضح.");
    return { score: total ? passed / total : 0, strengths, missing, summary: resolvedTaskProfile.summary, taskType: resolvedTaskProfile.id, taskLabel: resolvedTaskProfile.label, taskMode: resolvedTaskProfile.mode };
  }

  if (resolvedTaskProfile.id === "naming") {
    check(hits > 0 || structure.informativeWords >= 1, "تمت تسمية العنصر بمصطلح علمي", "المطلوب هنا تسمية العنصر بالاسم العلمي الدقيق، لا شرح عام أو كلام مرسل.");
    check(structure.wordCount <= 8 || !hasParagraphBreak, "الجواب موجز كما يقتضي فعل التسمية", "فعل التسمية يتطلب جواباً قصيراً ودقيقاً، لا فقرة مطولة.");
    check(!usesCausal || structure.wordCount <= 10, "لم تُثقِل الجواب بشرح خارج المطلوب", "أضفت شرحاً خارج المطلوب؛ في فعل التسمية يكفي الاسم العلمي.");
    return { score: total ? passed / total : 0, strengths, missing, summary: resolvedTaskProfile.summary, taskType: resolvedTaskProfile.id, taskLabel: resolvedTaskProfile.label, taskMode: resolvedTaskProfile.mode };
  }

  if (resolvedTaskProfile.id === "definition") {
    check(hasCategory, "ذكرت ماهية العنصر أو تصنيفه العلمي", "في التعريف يجب أن تبدأ بذكر ماهية العنصر: جزيئة، ظاهرة، إنزيم، عضية...");
    check(hasDescriptor, "أضفت وصفاً علمياً يوضح التعريف", "التعريف ما زال ناقصاً: يجب إضافة وصف أو خصائص أساسية للعنصر.");
    check(hasRole || structure.wordCount >= 10, "تم توضيح الدور أو الخاصية الأساسية", "التعريف لا يبين الدور أو الفائدة العلمية للعنصر بما يكفي.");
    return { score: total ? passed / total : 0, strengths, missing, summary: resolvedTaskProfile.summary, taskType: resolvedTaskProfile.id, taskLabel: resolvedTaskProfile.label, taskMode: resolvedTaskProfile.mode };
  }

  if (resolvedTaskProfile.id === "description") {
    check(structure.wordCount >= 8, "الجواب أخذ شكل وصف لا مجرد تسمية", "الوصف ناقص أو مختزل أكثر من اللازم؛ يجب تفصيل الخصائص أو البنية.");
    check(hasDescriptor, "ذُكرت خصائص أو مميزات واضحة", "في الوصف يجب ذكر الخصائص أو المميزات الأساسية لا الاكتفاء بالاسم.");
    check(hasRole || matchConcept(normText, ["داخل", "خارج", "في", "على", "منطقة", "مقر", "يتوضع", "يوجد"]) || structure.wordCount >= 12, "تمت الإشارة إلى المقر أو الدور أو الهيئة", "الوصف ما زال سطحياً: أضف المقر أو الدور أو الشكل أو العلاقات البنيوية المهمة.");
    return { score: total ? passed / total : 0, strengths, missing, summary: resolvedTaskProfile.summary, taskType: resolvedTaskProfile.id, taskLabel: resolvedTaskProfile.label, taskMode: resolvedTaskProfile.mode };
  }

  if (resolvedTaskProfile.id === "listing") {
    check(hits > 0 || structure.wordCount >= 2, "تم ذكر عناصر مطلوبة بشكل مباشر", "في أفعال الذكر/العدد يجب سرد العناصر المطلوبة مباشرة.");
    check(hasListMarkers || structure.wordCount <= 12, "العناصر معروضة بصيغة سرد أو تعداد", "الأفضل في فعل الذكر/العدد أن تعرض العناصر كسرد واضح أو تعداد مرتب.");
    check(!usesCausal || structure.wordCount >= 10, "لم يتحول الجواب إلى تفسير زائد", "المطلوب هنا تعداد العناصر، لا فقرة تفسيرية طويلة تشتت الجواب.");
    return { score: total ? passed / total : 0, strengths, missing, summary: resolvedTaskProfile.summary, taskType: resolvedTaskProfile.id, taskLabel: resolvedTaskProfile.label, taskMode: resolvedTaskProfile.mode };
  }

  if (resolvedTaskProfile.id === "classification") {
    check(hasCriterion || structure.wordCount >= 6, "ظهر معيار أو منطق للتصنيف", "التصنيف يجب أن يكون وفق معيار واضح: حسب البنية، الوظيفة، المصدر...");
    check(hasListMarkers || structure.wordCount >= 6, "العناصر وُزعت في مجموعات أو فئات", "المطلوب ليس مجرد تعداد؛ بل توزيع العناصر في مجموعات أو أقسام واضحة.");
    check(structure.wordCount >= 5, "التصنيف ليس مبتوراً", "التصنيف ناقص جداً ولا يبين الأقسام أو الفئات كما يجب.");
    return { score: total ? passed / total : 0, strengths, missing, summary: resolvedTaskProfile.summary, taskType: resolvedTaskProfile.id, taskLabel: resolvedTaskProfile.label, taskMode: resolvedTaskProfile.mode };
  }

  if (resolvedTaskProfile.id === "distinction") {
    const hasTwoSides = (normText.match(/و/g) || []).length >= 1 || structure.wordCount >= 8;
    check(hasDifference || usesComparison, "استُعملت عبارات تمييز أو مقابلة", "التمييز يتطلب عبارات صريحة: بينما، في حين، على عكس، بالمقابل...");
    check(hasTwoSides, "الجواب يتناول العنصرين معاً", "الجواب يوحي بطرف واحد فقط؛ فعل التمييز يفرض ذكر العنصرين.");
    check(structure.wordCount >= 6, "تم إبراز الفروق الأساسية", "التمييز مختصر جداً ولا يوضح أوجه الاختلاف الكافية.");
    return { score: total ? passed / total : 0, strengths, missing, summary: resolvedTaskProfile.summary, taskType: resolvedTaskProfile.id, taskLabel: resolvedTaskProfile.label, taskMode: resolvedTaskProfile.mode };
  }

  if (resolvedTaskProfile.id === "variables") {
    check((mentionsIndependent && mentionsDependent) || hits >= 2 || structure.wordCount >= 4, "تم تحديد طرفي الدراسة أو المتغيرين بوضوح", "في تحديد المتغيرات يجب تمييز المستقل عن التابع أو ذكر كلا الطرفين بدقة.");
    check(structure.wordCount <= 18 || hasListMarkers, "الجواب مباشر ومركز", "سؤال تحديد المتغيرات يحتاج جواباً مباشرًا لا فقرة طويلة مشتتة.");
    check(!usesCausal || structure.wordCount >= 6, "لم ينزلق الجواب إلى تفسير مبكر", "بدأت بالتفسير قبل حسم المتغيرات المطلوبة.");
    return { score: total ? passed / total : 0, strengths, missing, summary: resolvedTaskProfile.summary, taskType: resolvedTaskProfile.id, taskLabel: resolvedTaskProfile.label, taskMode: resolvedTaskProfile.mode };
  }

  if (resolvedTaskProfile.id === "relation") {
    check(hasRelationPhrase || usesComparison || usesCausal, "العلاقة صيغت بشكل صريح", "عند طلب تحديد العلاقة يجب استعمال صيغة واضحة مثل: كلما...، علاقة طردية/عكسية...");
    check(structure.wordCount >= 5, "العلاقة ليست مبتورة", "العلاقة المقترحة قصيرة أو غامضة أكثر من اللازم.");
    check(hasNumbers || hits >= 2 || usesComparison || usesCausal, "رُبطت العلاقة بمعطيات أو عنصرين على الأقل", "الجواب لا يبرز طرفي العلاقة أو معطياتها بما يكفي.");
    return { score: total ? passed / total : 0, strengths, missing, summary: resolvedTaskProfile.summary, taskType: resolvedTaskProfile.id, taskLabel: resolvedTaskProfile.label, taskMode: resolvedTaskProfile.mode };
  }

  if (resolvedTaskProfile.id === "importance") {
    check(hasRole, "ذُكر الدور أو الفائدة العلمية", "تحديد الأهمية يعني ذكر الفائدة أو الدور العلمي صراحة.");
    check(usesCausal || matchConcept(normText, ["مما يسمح", "مما يؤدي", "لذلك", "ولهذا"]), "رُبطت الأهمية بأثر أو نتيجة", "اذكر لماذا تُعد هذه البنية أو الظاهرة مهمة، لا تكتف بالاسم.");
    check(structure.wordCount >= 4, "الجواب كافٍ لتحديد الأهمية", "الجواب قصير جداً ولا يحدد الأهمية علمياً.");
    return { score: total ? passed / total : 0, strengths, missing, summary: resolvedTaskProfile.summary, taskType: resolvedTaskProfile.id, taskLabel: resolvedTaskProfile.label, taskMode: resolvedTaskProfile.mode };
  }

  if (resolvedTaskProfile.id === "comparison") {
    const hasContrast = matchConcept(normText, ["بينما", "في حين", "يشترك", "يتشابه", "يختلف", "اكبر", "أكبر", "اقل", "أقل", "مقابل", "بالمقابل", "يقابله"]);
    const hasTwoSides = (normText.match(/و/g) || []).length >= 1 || structure.wordCount >= 10;
    check(hasContrast || usesComparison, "استُعملت عبارات مقارنة صريحة", "المقارنة يجب أن تُكتب بألفاظ واضحة: بينما، في حين، يتشابه، يختلف...");
    check(hasTwoSides, "الجواب يتناول طرفي المقارنة", "الجواب يوحي بطرف واحد فقط؛ المقارنة تتطلب عرض الجانبين.");
    check(structure.wordCount >= 8, "المقارنة ليست مبتورة", "المقارنة مختصرة زيادة عن اللازم ولا تبرز أوجه الشبه والاختلاف كفاية.");
    return { score: total ? passed / total : 0, strengths, missing, summary: resolvedTaskProfile.summary, taskType: resolvedTaskProfile.id, taskLabel: resolvedTaskProfile.label, taskMode: resolvedTaskProfile.mode };
  }

  if (resolvedTaskProfile.id === "justification") {
    check(hasEvidenceRegister || hits > 0, "استندت إلى معطيات أو ملاحظات من السند", "التبرير العلمي يجب أن يستند إلى معطيات أو ملاحظات لا إلى رأي عام فقط.");
    check(usesCausal || hasKnowledgeRegister, "ظهرت رابطة سببية أو معرفة داعمة", "في التبرير يجب أن تقول لماذا باستعمال: لأن، بما أن، يعود ذلك إلى...");
    check(structure.wordCount >= 6, "التبرير ليس مبتوراً", "التبرير قصير جداً ولا يبني حجة علمية كافية.");
    return { score: total ? passed / total : 0, strengths, missing, summary: resolvedTaskProfile.summary, taskType: resolvedTaskProfile.id, taskLabel: resolvedTaskProfile.label, taskMode: resolvedTaskProfile.mode };
  }

  if (resolvedTaskProfile.id === "critique") {
    check(hasPros, "ذكرت جانباً إيجابياً أو منفعة", "النقد العلمي لا يكتفي بالرفض؛ اذكر الإيجابيات أو الفوائد أولاً.");
    check(hasCons, "ذكرت حدوداً أو سلبيات", "النقد ناقص لأنه لا يبين المخاطر أو السلبيات أو الحدود.");
    check(hasBalancedJudgement, "أنهيت بموقف معلل أو اقتراح", "اختم النقد بموقف علمي معلل: من الأفضل/ينبغي/لذلك...");
    return { score: total ? passed / total : 0, strengths, missing, summary: resolvedTaskProfile.summary, taskType: resolvedTaskProfile.id, taskLabel: resolvedTaskProfile.label, taskMode: resolvedTaskProfile.mode };
  }

  if (resolvedTaskProfile.id === "hypothesis") {
    check((usesHypothesisRegister && !matchConcept(normText, ["ربما"])) || rawHasQuestion || usesCausal, "هناك محاولة واضحة لصياغة فرضية", "يجب أن تصاغ الفرضية كاقتراح تفسيري معقول، لا كإجابة مبهمة أو محفوظة فقط.");
    check(usesCausal || usesMechanism, "الفرضية ذات طابع تفسيري", "الفرضية يجب أن تحمل تفسيراً أولياً للنتيجة أو المشكل، لا مجرد إعادة صياغة السؤال.");
    check(structure.wordCount >= 6, "الفرضية مفهومة ومكتملة", "الفرضية قصيرة جداً أو غير مكتملة.");
    return { score: total ? passed / total : 0, strengths, missing, summary: resolvedTaskProfile.summary, taskType: resolvedTaskProfile.id, taskLabel: resolvedTaskProfile.label, taskMode: resolvedTaskProfile.mode };
  }

  if (resolvedTaskProfile.id === "validation") {
    check(hasEvidenceRegister || hits > 0, "استُعملت معطيات السند في المناقشة", "المصادقة على الفرضية لا تكون رأياً عاماً؛ يجب ربطها بمعطيات السند.");
    check(usesCausal || usesMechanism, "ربطت النتائج بسبب أو آلية", "المصادقة تتطلب تفسيراً يربط النتائج بالآلية أو السبب.");
    check(hasValidationJudgement, "صدر حكم صريح على الفرضية", "اختم المناقشة بحكم صريح: الفرضية صحيحة/مرفوضة/تتأكد.");
    return { score: total ? passed / total : 0, strengths, missing, summary: resolvedTaskProfile.summary, taskType: resolvedTaskProfile.id, taskLabel: resolvedTaskProfile.label, taskMode: resolvedTaskProfile.mode };
  }

  if (resolvedTaskProfile.id === "discussion") {
    check(hasDocumentIntro || hasEvidenceRegister || hits > 0, "انطلقت المناقشة من معطيات السند", "المناقشة العلمية يجب أن تُبنى على معطيات السند لا على رأي عام.");
    check(usesObservationVerb || usesComparison || hits > 0, "المناقشة تضمنت تفكيكاً للمعطيات", "ينقص الجواب استغلال فعلي للوثيقة: ملاحظة/مقارنة/استخراج.");
    check(usesCausal || hasPros || hasCons || hasValidationJudgement, "المناقشة لم تبق وصفية فقط", "المناقشة الجيدة تحتاج تفسيراً أو مفاضلة أو حكماً على الفرضية/الفكرة.");
    check(usesConclusion || hasBalancedJudgement || hasValidationJudgement, "أنهيت المناقشة بحكم أو خلاصة", "اختم المناقشة بحكم واضح أو نتيجة نهائية مرتبطة بالسؤال.");
    return { score: total ? passed / total : 0, strengths, missing, summary: resolvedTaskProfile.summary, taskType: resolvedTaskProfile.id, taskLabel: resolvedTaskProfile.label, taskMode: resolvedTaskProfile.mode };
  }

  if (resolvedTaskProfile.id === "commentary") {
    check(hasDocumentIntro, "بدأت بتحديد السند أو الوثيقة", "التعليق المنهجي يبدأ بتعريف الوثيقة أو السند.");
    check(usesObservationVerb, "قدمت ملاحظات واضحة من السند", "في التعليق يجب أولاً تسجيل الملاحظات والمعطيات الظاهرة.");
    check(usesCausal || usesMechanism || usesComparison || hits > 0, "أرفقت الملاحظة بشرح أو تفسير", "التعليق لا يكتفي بالملاحظة؛ يجب إضافة شرح علمي مدعوم بالمكتسبات.");
    check(hasRelationPhrase || usesConclusion || structure.wordCount >= 8, "ربطت المعطيات بخلاصة مفهومة", "التعليق ما زال تجميع ملاحظات فقط؛ اربطها باستنتاج أو خلاصة واضحة.");
    return { score: total ? passed / total : 0, strengths, missing, summary: resolvedTaskProfile.summary, taskType: resolvedTaskProfile.id, taskLabel: resolvedTaskProfile.label, taskMode: resolvedTaskProfile.mode };
  }

  if (resolvedTaskProfile.id === "extraction") {
    const openExtraction = resolvedSignals.requiresOpenExtraction || resolvedSignals.openInstruction || resolvedSignals.docDriven;
    if (openExtraction) {
      check(hasDocumentIntro || usesObservationVerb || hasEvidenceRegister, "استندت إلى الوثيقة أو السند", "في الاستخراج المفتوح يجب أولاً استغلال السند أو الإحالة عليه.");
      check(hits > 0 || usesConclusion || hasRelationPhrase, "المعلومة المستخرجة ظاهرة في الجواب", "الجواب عام جداً ولا يبرز المعلومة المستخرجة بوضوح.");
      check(usesConclusion || structure.wordCount >= 6, "الجواب انتهى بنتيجة مستخلصة", "ينقص الجواب تصريح نهائي بالمعلومة المستخلصة: نستنتج أن...");
      check(!resolvedSignals.requiresCausalChain || usesCausal || usesMechanism || structure.wordCount >= 8, "تم تجاوز مجرد النسخ إلى بناء معنى", "في هذا النوع من الاستخراج لا يكفي نسخ ألفاظ من السند؛ يجب بناء معنى علمي واضح.");
    } else {
      check(hits > 0 || structure.wordCount >= 2, "تم استخراج المعلومة المطلوبة", "ينقص الجواب المعلومة الأساسية المستخرجة من السند.");
      check(structure.wordCount >= 2, "الجواب ليس مبتوراً", "الاستخراج مباشر لكنه ناقص أو مبهم جداً.");
    }
    return { score: total ? passed / total : 0, strengths, missing, summary: resolvedTaskProfile.summary, taskType: resolvedTaskProfile.id, taskLabel: resolvedTaskProfile.label, taskMode: resolvedTaskProfile.mode };
  }

  if (resolvedTaskProfile.id === "analysis-explanation") {
    check(hasDocumentIntro || hasEvidenceRegister, "بدأت باستغلال الوثيقة أو السند", "عند وضح/بين/اشرح في تعليمة مفتوحة، لا تبدأ بالتفسير مباشرة؛ ابدأ بتقديم السند أو الوثيقة.");
    check(usesObservationVerb || usesComparison || hits > 0, "مررت أولاً عبر الملاحظة أو التحليل", "الجواب قفز إلى الشرح دون المرور بتحليل أولي للمعطيات أو الملاحظات.");
    check(usesCausal, "التفسير السببي حاضر", "بعد التحليل يجب الانتقال إلى تفسير سببي صريح: لأن، يعود ذلك إلى، مما يؤدي إلى...");
    check(usesMechanism || countMarkerHits(normText, meta?.secondary || []) > 0, "تمت الإشارة إلى عناصر الآلية", "الشرح ما زال عاماً؛ اذكر عناصر الآلية أو الوسائط البيولوجية المتدخلة.");
    check(usesConclusion || hasRelationPhrase || structure.wordCount >= 10, "انتهى الجواب بخلاصة أو ربط واضح", "أنهِ الجواب بربط النتيجة أو الآلية المستخلصة بدل تركه مجرد شرح مبتور.");
    return { score: total ? passed / total : 0, strengths, missing, summary: resolvedTaskProfile.summary, taskType: resolvedTaskProfile.id, taskLabel: resolvedTaskProfile.label, taskMode: resolvedTaskProfile.mode };
  }

  if (!meta) {
    check(structure.hasConnectors || resolvedTaskProfile.toleratesShortAnswer, "الصياغة مناسبة لنوع المهمة", "الصياغة ما زالت جافة وتحتاج قدراً أوضح من التنظيم أو الربط العلمي.");
    check(structure.wordCount >= (resolvedTaskProfile.toleratesShortAnswer ? 1 : 7), "الجواب ليس مبتوراً", resolvedTaskProfile.toleratesShortAnswer ? "الجواب قصير جداً حتى بالنسبة لمهمة مختصرة." : "الجواب قصير أكثر من اللازم");
    return { score: total ? passed / total : 0.35, strengths, missing, summary: resolvedTaskProfile.summary, taskType: resolvedTaskProfile.id, taskLabel: resolvedTaskProfile.label, taskMode: resolvedTaskProfile.mode };
  }

  if (poleType === "N") {
    check(!resolvedSignals.requiresQuestion || rawHasQuestion, "تمت صياغة المشكل في هيئة سؤال أو تساؤل واضح", "يجب صياغة الإشكالية أو المشكل العلمي بصيغة سؤال واضح.");
    check(hits >= 2 || countMarkerHits(normText, meta.secondary) > 0, "ذُكرت عناصر المشكلة أو المتغيرات الأساسية", "المشكل مطروح بطريقة عامة جداً وينقصه تحديد العناصر أو المتغيرات.");
    if (resolvedSignals.requiresVariables) {
      check((mentionsIndependent && mentionsDependent) || structure.wordCount >= 4, "تم التمييز بين عناصر الدراسة أو متغيراتها", "بما أن المطلوب شمل المتغيرات، يجب تمييز طرفي الدراسة أو عناصرها بدقة.");
    }
    check(structure.wordCount >= 8, "الصياغة ليست مبتورة", "المشكل قصير ومشوّش؛ يجب أن يكون أوضح وأدق.");
    if (resolvedSignals.requiresHypothesis) {
      check((usesHypothesisRegister && !matchConcept(normText, ["ربما"])) || usesCausal, "هناك محاولة لصياغة فرضية تفسيرية", "إذا طُلبت فرضية، فيجب أن تظهر كاقتراح تفسيري قابل للفحص لا كعبارة عامة فارغة.");
    }
    return { score: total ? passed / total : 0, strengths, missing, summary: resolvedTaskProfile.summary || meta.summary, taskType: resolvedTaskProfile.id, taskLabel: resolvedTaskProfile.label, taskMode: resolvedTaskProfile.mode };
  }

  if (poleType === "S") {
    check(!resolvedSignals.requiresDocumentIntro || hasDocumentIntro, "بدأت الجواب بتقديم ما تمثله الوثيقة أو السند", "في التحليل المنهجي يجب أولاً تعريف الوثيقة أو ما تمثله.");
    check(!resolvedSignals.requiresObservationVerb || usesObservationVerb, "استُعملت أفعال الملاحظة والتحليل", "التحليل يجب أن يستعمل لغة الملاحظة: نلاحظ، نسجل، يبين، يوضح...");
    check(!resolvedSignals.requiresComparison || usesComparison || countMarkerHits(normText, meta.secondary) > 0, "الجواب يتضمن مقارنة أو اتجاهاً أو قيمة", "المقارنة أو الاتجاهات الوثائقية غير كافية: اذكر تزايد/تناقص/قيم/مقارنة بالتوازي.");
    check(usesConclusion, "الاستنتاج الصريح حاضر", "أنهِ التحليل باستنتاج صريح: مما يدل / نستنتج أن...");
    if (!resolvedSignals.allowsCausalTerms) {
      check(!usesCausal, "حافظت على التحليل دون القفز إلى التفسير", "قفزت إلى التفسير السببي داخل التحليل، وهذا خطأ منهجي في البكالوريا.");
    }
    return { score: total ? passed / total : 0, strengths, missing, summary: resolvedTaskProfile.summary || meta.summary, taskType: resolvedTaskProfile.id, taskLabel: resolvedTaskProfile.label, taskMode: resolvedTaskProfile.mode };
  }

  if (poleType === "E") {
    const mechanismHits = countMarkerHits(normText, meta.secondary);
    check(!resolvedSignals.requiresCausalChain || usesCausal || mechanismHits >= 1 || (usesMechanism && structure.connectorHits >= 2), "الربط السببي حاضر", "التفسير يحتاج سببية واضحة أو تتبعاً آلياً صريحاً: يعود ذلك إلى / نتيجة / مما يؤدي إلى... أو سلسلة آلية واضحة.");
    check(mechanismHits >= 2 || (usesMechanism && hits >= 2), "ذُكرت عناصر الآلية البيولوجية", "الجواب يذكر نتيجة عامة دون آلية دقيقة أو وسائط بيولوجية كافية.");
    check(structure.connectorHits >= 2 && structure.wordCount >= 12, "السلسلة التفسيرية مترابطة", "التفسير يحتاج تسلسلاً أوضح للأحداث، لا جملة واحدة مبهمة أو مختصرة جداً.");
    if (resolvedSignals.requiresHypothesis || resolvedSignals.requiresValidation) {
      check(hasValidationJudgement || matchConcept(normText, ["الفرضيه", "الفرضية"]), "تم ربط التفسير بالفرضية أو الحكم عليها", "إذا كان السؤال مرتبطاً بفرضية، فيجب أن تربط تفسيرك بصحتها أو رفضها.");
    }
    return { score: total ? passed / total : 0, strengths, missing, summary: resolvedTaskProfile.summary || meta.summary, taskType: resolvedTaskProfile.id, taskLabel: resolvedTaskProfile.label, taskMode: resolvedTaskProfile.mode };
  }

  check(countMarkerHits(normText, meta.primary) > 0, "الخلاصة أو الحكم النهائي حاضر", "الخلاصة النهائية غير واضحة أو غير صريحة.");
  check(countMarkerHits(normText, meta.secondary) > 0 || hits >= Math.max(2, req), "تم تجميع النتائج في حكم نهائي", "التركيب ما زال ناقصاً ولا يجمع الفكرة النهائية.");
  check(structure.wordCount >= 8 && structure.hasConnectors, "الصياغة النهائية متماسكة", "الخلاصة تحتاج جملة علمية أشد تماسكاً.");
  return { score: total ? passed / total : 0, strengths, missing, summary: resolvedTaskProfile.summary || meta.summary, taskType: resolvedTaskProfile.id, taskLabel: resolvedTaskProfile.label, taskMode: resolvedTaskProfile.mode };
}

function getPoleWeights(poleType, taskProfile = null) {
  if (["naming", "variables"].includes(taskProfile?.id)) return { content: 0.88, methodology: 0.08, richness: 0.04 };
  if (taskProfile?.id === "listing") return { content: 0.82, methodology: 0.12, richness: 0.06 };
  if (["classification", "distinction", "definition", "description", "relation", "importance"].includes(taskProfile?.id)) {
    return { content: 0.72, methodology: 0.18, richness: 0.10 };
  }
  if (taskProfile?.id === "scientific-text") return { content: 0.40, methodology: 0.40, richness: 0.20 };
  if (["validation", "commentary", "justification", "critique", "discussion", "extraction", "analysis-explanation"].includes(taskProfile?.id)) {
    return { content: 0.45, methodology: 0.40, richness: 0.15 };
  }

  switch (poleType) {
    case "S": return { content: 0.45, methodology: 0.35, richness: 0.20 };
    case "E": return { content: 0.50, methodology: 0.35, richness: 0.15 };
    case "W": return { content: 0.45, methodology: 0.35, richness: 0.20 };
    case "N": return { content: 0.50, methodology: 0.30, richness: 0.20 };
    default: return { content: 0.65, methodology: 0.20, richness: 0.15 };
  }
}

export function evaluateScience(text, rule = {}) {
  const errors = [];
  (rule.wrongConcepts || []).forEach(concept => {
    if (matchConcept(text, concept)) {
      errors.push({
        type: "wrong-concept",
        label: Array.isArray(concept) ? concept[0] : concept,
        message: `مفهوم علمي غير مناسب هنا: ${Array.isArray(concept) ? concept[0] : concept}`
      });
    }
  });

  const order = rule.causalOrder || [];
  if (order.length >= 2) {
    const norm = normalizeArabic(text);
    const positions = order.map(concept => {
      const syns = (Array.isArray(concept) ? concept : [concept]).flatMap(aliasesFor).map(normalizeArabic);
      let idx = -1;
      syns.forEach(s => {
        const at = s ? norm.indexOf(s) : -1;
        if (at >= 0 && (idx < 0 || at < idx)) idx = at;
      });
      return idx;
    });
    const known = positions.filter(p => p >= 0);
    const causal = matchConcept(norm, ["مما يؤدي", "يعود", "بسبب", "لذلك", "فتتوقف", "فيمنع"]);
    if (causal && known.length >= 2) {
      const firstKnown = positions.findIndex(p => p >= 0);
      const lastKnown = positions.length - 1 - [...positions].reverse().findIndex(p => p >= 0);
      if (firstKnown >= 0 && lastKnown > firstKnown && positions[firstKnown] > positions[lastKnown]) {
        errors.push({
          type: "inverted-causal",
          label: "سلسلة سببية مقلوبة",
          message: "الاتجاه السببي مقلوب بالنسبة للآلية المطلوبة."
        });
      }
    }
  }
  return {
    errors,
    score: errors.length ? Math.max(0, 1 - 0.5 * errors.length) : 1
  };
}

export function evaluateDocument(text, rule = {}) {
  const doc = rule.document;
  if (!doc) return { applicable: false, score: 1, gaps: [] };
  const gaps = [];
  let passed = 0;
  let total = 0;

  (doc.comparisons || []).forEach(pair => {
    const [a, b] = pair;
    total += 1;
    if (matchConcept(text, a) && matchConcept(text, b)) passed += 1;
    else gaps.push(`المقارنة الوثائقية ناقصة: ${a} / ${b}`);
  });

  (doc.trends || []).forEach(trend => {
    total += 1;
    const aboutOk = matchConcept(text, trend.about);
    const expectOk = (trend.expect || []).some(item => matchConcept(text, item));
    if (aboutOk && expectOk) passed += 1;
    else gaps.push(`اتجاه الوثيقة غير مقروء: ${Array.isArray(trend.about) ? trend.about[0] : trend.about}`);
  });

  if (Array.isArray(doc.values) && doc.values.length) {
    total += 1;
    const norm = normalizeArabic(text);
    const hasValue = doc.values.some(v => norm.includes(normalizeArabic(String(v)))) || /[0-9٠-٩]/.test(text);
    if (hasValue) passed += 1;
    else gaps.push("لا توجد قيمة أو اتجاه رقمي مستخرج من السند");
  }

  return { applicable: total > 0, score: total ? passed / total : 1, gaps };
}

export function evaluateArtifact(text, rule = {}) {
  const gaps = [];
  let passed = 0;
  let total = 0;
  const schema = rule.schema;
  const equation = rule.equation;

  if (schema?.ordered?.length) {
    total += 1;
    const norm = normalizeArabic(text);
    const idxs = schema.ordered.map(step => {
      const syns = (Array.isArray(step) ? step : [step]).flatMap(aliasesFor).map(normalizeArabic);
      let at = -1;
      syns.forEach(s => {
        const i = s ? norm.indexOf(s) : -1;
        if (i >= 0 && (at < 0 || i < at)) at = i;
      });
      return at;
    });
    const found = idxs.filter(i => i >= 0);
    const ordered = found.length >= Math.min(3, schema.ordered.length) &&
      found.every((v, i, arr) => i === 0 || v >= arr[i - 1]);
    if (ordered) passed += 1;
    else gaps.push("ترتيب المخطط أو السلسلة غير مطابق");
  }

  if (schema?.arrows) {
    total += 1;
    if (/→|->|=>|⟶/.test(text) || matchConcept(text, ["ثم", "يليها"])) passed += 1;
    else gaps.push("المخطط يفتقد الأسهم أو التسلسل الصريح");
  }

  if (equation?.tokens?.length) {
    total += 1;
    const hits = equation.tokens.filter(tok => matchConcept(text, tok)).length;
    const need = equation.minTokens || Math.min(2, equation.tokens.length);
    if (hits >= need) passed += 1;
    else gaps.push("المعادلة الكيميائية ناقصة أو غير مكتملة");
  }

  return { applicable: total > 0, score: total ? passed / total : 1, gaps };
}

function buildProfessorVerdict(fraction, methodologyScore, overlapRatio) {
  if (fraction >= 0.9) return "جواب قريب جداً من تصحيح الأستاذ.";
  if (fraction >= 0.75) return methodologyScore < 0.55
    ? "المعرفة العلمية موجودة، لكن المنهجية ما زالت دون مستوى الإجابة الوزارية الكاملة."
    : "جواب قوي وقابل للحصول على علامة مرتفعة.";
  if (fraction >= 0.5) return overlapRatio < 0.4
    ? "هناك فهم جزئي، لكن عناصر التصحيح الرسمي لم تُستثمر بما يكفي."
    : "الجواب مقبول جزئياً، لكنه ناقص أو غير محكم.";
  return "الجواب ضعيف: إما المفاهيم ناقصة أو المنهجية غير محترمة.";
}

/* ---------- Évaluation d'un champ de texte (pôles N/S/E/W) ---------- */
export function evaluateText(text, rule = {}, poleType = "") {
  const norm = normalizeArabic(text);
  const keywords = rule.keywords || [];
  const forbidden = rule.forbidden || [];
  const req = rule.minHits || (keywords.length ? Math.min(2, keywords.length) : 0);
  const minLen = rule.minLength || 0;

  if (!norm || norm.length === 0) {
    return {
      fraction: 0,
      hits: 0,
      req,
      matched: [],
      missing: keywords.map(k => Array.isArray(k) ? k[0] : k),
      forbiddenFound: [],
      length: 0,
      minLen,
      isKeywordDump: false,
      wordCount: 0,
      empty: true,
      methodology: { score: 0, strengths: [], missing: [], summary: "" },
      overlap: { ratio: 0, matchedTokens: [], missingTokens: [], referenceTokens: [], answerTokens: [] },
      richnessScore: 0,
      verdict: "",
      taskProfile: null,
      science: { errors: [], score: 1 },
      document: { applicable: false, score: 1, gaps: [] },
      artifact: { applicable: false, score: 1, gaps: [] }
    };
  }

  const signals = inferTaskSignals(rule, poleType);
  const taskProfile = deriveTaskProfile(signals, poleType);
  const structure = analyzeSentenceStructure(norm, poleType);
  const matched = [];
  const missing = [];

  keywords.forEach(concept => {
    if (matchConcept(norm, concept)) matched.push(Array.isArray(concept) ? concept[0] : concept);
    else missing.push(Array.isArray(concept) ? concept[0] : concept);
  });

  const hits = matched.length;
  const forbiddenFound = [];
  forbidden.forEach(term => {
    if (matchConcept(norm, term)) forbiddenFound.push(Array.isArray(term) ? term[0] : term);
  });

  const lengthRatio = minLen ? Math.min(1, norm.length / minLen) : 1;
  const contentRatio = req ? Math.min(1, hits / req) : (hits > 0 ? 1 : 0);
  const overlap = computeReferenceOverlap(text, rule);
  const methodology = evaluateMethodology(text, norm, poleType, structure, hits, req, rule, taskProfile, signals);
  const science = evaluateScience(text, rule);
  const documentEval = evaluateDocument(text, rule);
  const artifact = evaluateArtifact(text, rule);
  const richnessScore = Math.min(1, ((structure.informativeWords >= 5 ? 1 : structure.informativeWords / 5) + (structure.hasConnectors ? 1 : Math.min(1, structure.connectorHits / 2))) / 2);
  const weights = getPoleWeights(poleType, taskProfile);
  const toleratesShortAnswer = !!taskProfile.toleratesShortAnswer;
  const perfectMethodologyThreshold = taskProfile?.id === "analysis-explanation" ? 0.95 : (toleratesShortAnswer ? 0.6 : 0.55);
  const perfectOverlapThreshold = taskProfile?.id === "analysis-explanation" ? 0.55 : 0.4;
  const perfectLengthThreshold = taskProfile?.id === "analysis-explanation" ? 0.65 : (toleratesShortAnswer ? 0.2 : 0.55);

  let fraction = 0;
  if (hits > 0 && (!structure.isKeywordDump || toleratesShortAnswer)) {
    const conceptualScore = Math.min(1, contentRatio * (toleratesShortAnswer ? 0.9 : 0.75) + overlap.ratio * (toleratesShortAnswer ? 0.1 : 0.25));
    fraction = (
      conceptualScore * weights.content +
      methodology.score * weights.methodology +
      richnessScore * weights.richness
    );
    fraction *= toleratesShortAnswer ? (0.8 + 0.2 * lengthRatio) : (0.55 + 0.45 * lengthRatio);
    if (!toleratesShortAnswer && methodology.score < 0.25 && poleType) fraction *= 0.55;
    if (!poleType && contentRatio >= 1 && ((toleratesShortAnswer && methodology.score >= 0.6) || (!toleratesShortAnswer && overlap.ratio >= 0.45 && structure.wordCount >= 6))) {
      fraction = 1;
    }
    fraction = Math.min(1, fraction);
  }

  const thinContent = !toleratesShortAnswer && keywords.length >= 4 && hits <= 2 && overlap.ratio < 0.45;
  if (thinContent && fraction > 0) fraction = Math.min(fraction, 0.72);

  if (documentEval.applicable) fraction *= (0.6 + 0.4 * documentEval.score);
  if (artifact.applicable) fraction *= (0.75 + 0.25 * artifact.score);
  if (science.errors.length) {
    fraction = Math.min(fraction * science.score, 0.45);
  }

  if (structure.isKeywordDump && !toleratesShortAnswer) fraction = 0;
  if (forbiddenFound.length > 0) fraction = Math.min(fraction, 0.3);
  const allowPerfect = science.errors.length === 0 && (!documentEval.applicable || documentEval.score >= 0.99) && (!artifact.applicable || artifact.score >= 0.99) && !thinContent;
  if (allowPerfect && (!structure.isKeywordDump || toleratesShortAnswer) && forbiddenFound.length === 0 && hits >= req && methodology.score >= perfectMethodologyThreshold && (toleratesShortAnswer || overlap.ratio >= perfectOverlapThreshold) && lengthRatio >= perfectLengthThreshold) {
    fraction = 1;
  }

  return {
    fraction,
    hits,
    req,
    matched,
    missing,
    forbiddenFound,
    length: norm.length,
    minLen,
    isKeywordDump: structure.isKeywordDump,
    wordCount: structure.wordCount,
    empty: false,
    methodology,
    overlap,
    richnessScore,
    structure,
    lengthRatio,
    verdict: buildProfessorVerdict(fraction, methodology.score, overlap.ratio),
    taskProfile,
    science,
    document: documentEval,
    artifact
  };
}

export function scoreFromFraction(points, fraction, options = {}) {
  const raw = Number(points) * Number(fraction);
  const step = options.step ?? 0.01;
  if (step === 0.25) return Math.round(raw * 4) / 4;
  return Math.round(raw * 100) / 100;
}

export function scoreBac(points, fraction) {
  return scoreFromFraction(points, fraction, { step: 0.25 });
}

/* ---------- Évaluation du pipeline (exercice 3) ---------- */
export function evaluatePipeline(blocksBank, arrangement) {
  const expectedTotal = Array.isArray(blocksBank) ? blocksBank.length : 0;
  let exactMatches = 0;
  let weightedScore = 0;
  const wrongSlots = [];
  const missingSlots = [];
  const streamBreakdown = { 1: { exact: 0, partial: 0, missing: 0 }, 2: { exact: 0, partial: 0, missing: 0 } };

  for (const [key, arr] of Object.entries(arrangement || {})) {
    const streamIdx = key === "stream1" ? 1 : 2;
    const expectedLength = (arr || []).length;

    for (let slot = 0; slot < expectedLength; slot++) {
      const blockId = arr[slot];
      if (!blockId) {
        missingSlots.push({ stream: streamIdx, slot });
        streamBreakdown[streamIdx].missing++;
        continue;
      }

      const blk = blocksBank.find(b => b.id === blockId);
      const blkStream = blk ? (blk.stream ?? blk.correctStream) : null;
      const blkSlot = blk ? (blk.slot ?? blk.correctSlot) : null;

      if (blk && blkStream === streamIdx && blkSlot === slot) {
        exactMatches++;
        weightedScore += 1;
        streamBreakdown[streamIdx].exact++;
      } else if (blk && blkStream === streamIdx) {
        weightedScore += 0.5;
        streamBreakdown[streamIdx].partial++;
        wrongSlots.push({ stream: streamIdx, slot, id: blockId, reason: "wrong-order" });
      } else {
        wrongSlots.push({ stream: streamIdx, slot, id: blockId, reason: "wrong-stream" });
      }
    }
  }

  return {
    correct: exactMatches,
    total: expectedTotal,
    fraction: expectedTotal ? Math.min(1, weightedScore / expectedTotal) : 0,
    weightedScore,
    wrongSlots,
    missingSlots,
    streamBreakdown
  };
}

/* ---------- Minuteurs (ancrés sur l'horloge réelle) ---------- */
export const timers = {
  globalInterval: null,
  strategyInterval: null,
  onChange: null,   // callback( which: 'global'|'strategy' )

  _tick(which) {
    const now = Date.now();
    if (which === "global") {
      if (!store.state.sessionActive) return;
      const last = store.state.globalLastTick || now;
      const seconds = Math.max(1, Math.floor((now - last) / 1000));
      store.state.globalLastTick = now;
      store.tickGlobal(seconds);
      if (store.state.globalRemaining <= 0) {
        store.state.globalRemaining = 0;
        clearInterval(this.globalInterval);
        this.globalInterval = null;
      }
    } else {
      if (!store.state.strategyRunning) return;
      const last = store.state.strategyLastTick || now;
      const seconds = Math.max(1, Math.floor((now - last) / 1000));
      store.state.strategyLastTick = now;
      store.tickStrategy(seconds);
      if (store.state.strategyRemaining <= 0) {
        store.state.strategyRemaining = 0;
        clearInterval(this.strategyInterval);
        this.strategyInterval = null;
        store.state.strategyRunning = false;
      }
    }
    store.save();
    if (this.onChange) this.onChange(which);
  },

  startGlobal() {
    if (this.globalInterval) clearInterval(this.globalInterval);
    store.state.sessionActive = true;
    store.state.globalLastTick = Date.now();
    this.globalInterval = setInterval(() => this._tick("global"), 1000);
    store.save();
    if (this.onChange) this.onChange("global");
  },

  startStrategy() {
    if (this.strategyInterval) clearInterval(this.strategyInterval);
    store.state.strategyRunning = true;
    store.state.strategyLastTick = Date.now();
    this.strategyInterval = setInterval(() => this._tick("strategy"), 1000);
    store.save();
    if (this.onChange) this.onChange("strategy");
  },

  stopStrategy() {
    if (this.strategyInterval) {
      clearInterval(this.strategyInterval);
      this.strategyInterval = null;
    }
    store.state.strategyRunning = false;
    store.save();
  },

  stopAll() {
    if (this.globalInterval) clearInterval(this.globalInterval);
    if (this.strategyInterval) clearInterval(this.strategyInterval);
    this.globalInterval = this.strategyInterval = null;
    store.state.strategyRunning = false;
  }
};

/* ---------- Calming Audio & Focus Generator (Web Audio API) ---------- */
export const soundEngine = {
  ctx: null,
  currentMode: "off", // "off" | "rain" | "waves" | "binaural"
  gainNode: null,
  nodes: [],
  volume: 0.15,

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  },

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  },

  stop() {
    this.nodes.forEach(n => {
      try { n.stop(); } catch (e) {}
      try { n.disconnect(); } catch (e) {}
    });
    this.nodes = [];
    this.currentMode = "off";
  },

  play(mode) {
    this.init();
    if (mode === "off") {
      this.stop();
      return "off";
    }

    this.currentMode = mode;

    if (!this.ctx) {
      return this.currentMode;
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    this.stop();

    this.currentMode = mode;

    try {
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);

      if (mode === "rain") {
        this._playRain();
      } else if (mode === "waves") {
        this._playWaves();
      } else if (mode === "binaural") {
        this._playBinaural();
      }
    } catch (e) {
      // Graceful fallback for non-standard audio environments
    }

    return this.currentMode;
  },

  cycle() {
    const modes = ["off", "rain", "waves", "binaural"];
    const nextIdx = (modes.indexOf(this.currentMode) + 1) % modes.length;
    return this.play(modes[nextIdx]);
  },

  _playRain() {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(900, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.gainNode);
    noise.start();
    this.nodes.push(noise, filter);
  },

  _playWaves() {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(220, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    noise.connect(filter);
    filter.connect(this.gainNode);
    noise.start();
    this.nodes.push(noise, filter, lfo, lfoGain);
  },

  _playBinaural() {
    const oscL = this.ctx.createOscillator();
    const oscR = this.ctx.createOscillator();
    oscL.frequency.setValueAtTime(210, this.ctx.currentTime);
    oscR.frequency.setValueAtTime(250, this.ctx.currentTime);

    const merger = this.ctx.createChannelMerger(2);
    oscL.connect(merger, 0, 0);
    oscR.connect(merger, 0, 1);
    merger.connect(this.gainNode);

    oscL.start();
    oscR.start();
    this.nodes.push(oscL, oscR, merger);
  }
};
