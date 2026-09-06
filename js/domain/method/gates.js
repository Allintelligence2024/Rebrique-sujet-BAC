/* ============================================================
   GATES & DRILL — البوابتان + شحذ المفتاح (تدريب 60 ثانية)
   ------------------------------------------------------------
   القرار قبل الكتابة لا أثناءها (MIFTAH v3.1):
     البوابة 1: ورقة أم رأس؟ (هل يذكر السؤال سنداً وثائقياً؟)
     البوابة 2: صورة أم فيلم؟ (فعل وصف مقابل فعل تفسير)
   التدريب يقتني 12 تعليمة في كل جولة؛ شرط الخروج: 12/12
   ثلاث مرات متتالية ← يُفتح المفتاح+.
   منطق خالص: لا اعتماد على DOM هنا.
   ملاحظة حدودية: التصنيف إرشادي منهجي — ليس سلم تنقيط رسمياً.
   ============================================================ */

import { normalizeArabic } from "../../../data/subjects.js";

/** كلمات السند الوثائقي (بوابة 1: ورقة) — صيغ المفرد والمثنى والجمع. */
export const DOC_SOURCE_TERMS = [
  "وثيقة",
  "وثيقت",
  "وثائق",
  "شكل",
  "أشكال",
  "جدول",
  "جداول",
  "منحنى",
  "منحني",
  "رسم",
  "رسوم",
  "مخطط",
  "تخطيط",
  "خريطة",
  "خرايط",
  "مبيان",
  "سجل",
  "معطيات"
];

/** علامات الاعتماد على الذاكرة مع السند ← عمودان في المسودة. */
export const MEMORY_SOURCE_MARKERS = ["معلوماتك", "مكتسباتك", "معارفك", "معلوماتك العامة"];

/** أفعال الوصف/الاستخراج (بوابة 2: صورة — مسار 1→2→4). */
export const IMAGE_VERBS = [
  "استخرج",
  "انتقاء",
  "صف",
  "وصف",
  "حلل",
  "تحليل",
  "قارن",
  "مقارنة",
  "حدد",
  "عين",
  "سم",
  "اذكر",
  "عدد",
  "وضح",
  "لخص"
];

/** أفعال التفسير/الاستنتاج (بوابة 2: فيلم — مسار 1→2→3→4). */
export const FILM_VERBS = [
  "فسر",
  "تفسير",
  "اشرح",
  "شرح",
  "علل",
  "تعليل",
  "استنتج",
  "استنتاج",
  "برر",
  "تبرير",
  "كيف",
  "لماذا"
];

export const DRILL_ROUND_SIZE = 12;
export const DRILL_UNLOCK_STREAK = 3;
export const DRILL_ROUND_SECONDS = 60;

/**
 * يصنّف تعليمة وفق البوابتين. أولوية «فيلم» على «صورة» عندما يتواجد
 * فعلا النوعان («استخرج ثم فسّر» = المسار الأطول، وهو أشمل دائماً).
 * فعل غير مصنف مع سند ← افتراض «صورة» (استخراج) مع verbMatched=false.
 */
export function classifyInstruction(text) {
  const norm = normalizeArabic(text || "");
  const hasDoc = DOC_SOURCE_TERMS.some((term) => norm.includes(normalizeArabic(term)));
  const hasMemory = MEMORY_SOURCE_MARKERS.some((term) => norm.includes(normalizeArabic(term)));
  const film = FILM_VERBS.some((term) => norm.includes(normalizeArabic(term)));
  const image = IMAGE_VERBS.some((term) => norm.includes(normalizeArabic(term)));
  const verbMatched = film || image;

  if (!hasDoc) {
    return {
      source: "memory",
      mode: "head",
      twoColumns: false,
      gate2: null,
      teeth: [1, 4],
      pathLabel: "1 → 4",
      verbMatched
    };
  }
  const gate2 = film ? "film" : "image";
  return {
    source: "doc",
    mode: "paper",
    twoColumns: hasMemory,
    gate2,
    teeth: gate2 === "film" ? [1, 2, 3, 4] : [1, 2, 4],
    pathLabel: gate2 === "film" ? "1 → 2 → 3 → 4" : "1 → 2 → 4",
    verbMatched
  };
}

/** بنك التعليمات: 16 تعليمة واقعية؛ كل جولة تقتني 12 عشوائياً. */
export const DRILL_BANK = [
  {
    text: "اذكر من الوثيقة 2 العناصر المشتركة بين المنحنيين.",
    source: "doc",
    gate2: "image",
    note: "فعل استخراج + سند مذكور: ورقة وصورة — تحليل دون تفسير."
  },
  {
    text: "اذكر مراحل الترجمة خلال اصطناع البروتين.",
    source: "memory",
    gate2: null,
    note: "لا سند في السؤال: وضع الحفظ — قائمة مرقمة بلا جُمَل، 1 ثم 4."
  },
  {
    text: "فسّر بالاعتماد على معلوماتك والشكل 3 نتائج التجربة.",
    source: "doc",
    gate2: "film",
    twoColumns: true,
    note: "سند + معلوماتك: ورقة بعمودين [من الوثيقة | من الدرس]، وفعل تفسير: فيلم."
  },
  {
    text: "عرّف الإنزيم.",
    source: "memory",
    gate2: null,
    note: "تعريف = وضع الحفظ: انتماء + خاصية مميزة + دور إن وُجد."
  },
  {
    text: "حلّل المنحنى بدلالة الزمن.",
    source: "doc",
    gate2: "image",
    note: "المنحنى سند وثائقي، والحلّ وصف بمجالات وقيم: صورة."
  },
  {
    text: "استخرج من الجدول قيمة التركيز النهائي عند 20 دقيقة.",
    source: "doc",
    gate2: "image",
    note: "استخراج صرف من جدول: رقم + وحدة، صورة."
  },
  {
    text: "علّل النتيجة المسجلة في الوثيقة.",
    source: "doc",
    gate2: "film",
    note: "تعليل = ملاحظة ثم سبب وآلية: فيلم — المسار الكامل."
  },
  {
    text: "سمّ المراحل المرقمة من 1 إلى 3 على الرسم.",
    source: "doc",
    gate2: "image",
    note: "تسمية على رسم مذكور: ورقة وصورة — أسماء دقيقة دون شرح."
  },
  {
    text: "قارن بين النمطين الظاهريين السليم والمصاب وفق الجدول.",
    source: "doc",
    gate2: "image",
    note: "مقارنة متوازية وفق جدول: صورة — بينما / في حين."
  },
  {
    text: "استنتج دور الأنسولين بالاعتماد على معطيات الوثيقتين.",
    source: "doc",
    gate2: "film",
    note: "استنتاج من سند: فيلم — من المعطيات ومنه النتيجة."
  },
  {
    text: "عدّد خصائص المناعة الاكتسابية.",
    source: "memory",
    gate2: null,
    note: "لا سند: وضع الحفظ — عدد المطلوب في السؤال هو الفحص الأخير."
  },
  {
    text: "بيّن كيف يُحدث هرمون النمو أثره وفق المخطط.",
    source: "doc",
    gate2: "film",
    note: "«كيف» تطلب الآلية: فيلم — سلسلة سببية كاملة."
  },
  {
    text: "فسّر آلية عمل الجيلاكوزيداز في العصارة المعوية بالاستعانة بالوثيقة.",
    source: "doc",
    gate2: "film",
    note: "تفسير آلية بسند: فيلم — من الوثيقة ثم الآلية من الدرس."
  },
  {
    text: "حدّد المتغير المستقل والمتغير التابع في التجربة الموضحة بالشكل.",
    source: "doc",
    gate2: "image",
    note: "تحديد من شكل مذكور: ورقة وصورة — تسمية صريحة للمتغيرين."
  },
  {
    text: "اشرح كيف تمنع الخلايا القاتلة الطبيعية انتشار الورم.",
    source: "memory",
    gate2: null,
    note: "البوابة 1 قبل البوابة 2: لا سند مذكور → رأس (1 ثم 4) ولو كان الفعل تفسيرياً."
  },
  {
    text: "وضّح بالرسم التحولات التي مرّ بها الجرثوم.",
    source: "doc",
    gate2: "image",
    note: "إنجاز رسم من سند مذكور: ورقة وصورة — نفس عناصر السند فقط."
  }
];

function shuffle(array, rand) {
  const out = [...array];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * محرك جولة التدريب: آلة حالات صريحة (idle → gate1 → (gate2) → … → done).
 * سقف الجولة 12 بنداً؛ البند يُحتسب صحيحاً فقط إذا صحّت إجابتا البوابتين.
 */
export function createDrillEngine({
  bank = DRILL_BANK,
  roundSize = DRILL_ROUND_SIZE,
  rand = Math.random
} = {}) {
  if (!Array.isArray(bank) || bank.length < roundSize) throw new Error("بنك التدريب أصغر من حجم الجولة");
  let items = [];
  let index = 0;
  let correct = 0;
  let mistakes = [];
  let stage = "idle";

  function view() {
    if (stage === "done") return { stage, total: items.length, correct };
    if (stage === "idle") return { stage, total: items.length };
    return { stage, index, total: items.length, item: items[index] };
  }

  return {
    start() {
      items = shuffle(bank, rand).slice(0, roundSize);
      index = 0;
      correct = 0;
      mistakes = [];
      stage = "gate1";
      return view();
    },
    view,
    answerGate1(choice) {
      if (stage !== "gate1") throw new Error("البوابة 1 مطلوبة الآن");
      const item = items[index];
      const expected = item.source === "doc" ? "paper" : "head";
      if (choice !== expected) {
        mistakes.push({ index, text: item.text, gate: 1, expected, got: choice });
        return { ok: false, expected, note: item.note, advance: true };
      }
      if (expected === "head") {
        correct += 1;
        return { ok: true, expected, note: item.note, advance: true };
      }
      stage = "gate2";
      return { ok: true, expected, advance: false };
    },
    answerGate2(choice) {
      if (stage !== "gate2") throw new Error("البوابة 2 مطلوبة الآن");
      const item = items[index];
      const ok = choice === item.gate2;
      if (ok) correct += 1;
      else mistakes.push({ index, text: item.text, gate: 2, expected: item.gate2, got: choice });
      return { ok, expected: item.gate2, note: item.note, advance: true };
    },
    next() {
      if (index < items.length - 1) {
        index += 1;
        stage = "gate1";
      } else {
        stage = "done";
      }
      return view();
    },
    result() {
      return {
        stage: "done",
        correct,
        total: items.length,
        perfect: correct === items.length,
        mistakes
      };
    }
  };
}
