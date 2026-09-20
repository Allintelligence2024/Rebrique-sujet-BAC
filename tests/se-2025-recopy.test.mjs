/* ============================================================
   2025 SE — consignes officielles relues sur l'image
   ------------------------------------------------------------
   Les scans locaux `subjects/SE/2025/sujet-1.pdf` (pages 1 à 5 du
   sujet officiel) et `subjects/SE/2025/sujet-2.pdf` (pages 6 à 10)
   sont des images seules : la relecture du 2026-09-16 s'est faite sur
   les images, page par page, en agrandissant les zones de consignes.

   Ce test fixe les seize consignes `official`, leur page, leur date et
   les quatre regroupements imposés par la contrainte « un pôle = une
   consigne d'affichage » :

   - S1-E2-S : les deux questions imprimées du الجزء الأول (page 2) ;
   - S1-E3-W : question 2 du الجزء الثاني (نصيحتان) + الجزء الثالث ;
   - S2-E2-W : les deux questions du الجزء الثاني (page 8) ;
   - S2-E3-W : question 2 du الجزء الثاني + consigne du الجزء الثالث.

   Il verrouille aussi les huit pôles restés `reconstructed` : aucun
   n'a de question imprimée sur l'image, ils ne doivent donc pas être
   promus `official`.
   ============================================================ */
import { test } from "node:test";
import assert from "node:assert/strict";
import { officialTaskInventoryFor } from "../data/official-tasks.js";

const url = new URL("../data/years/se/year-2025.js", import.meta.url);
const mod = await import(url.href);
const year = mod.default || Object.values(mod).find((v) => v?.sujets);

const exercice = (sujetId, number) => {
  const sujet = year.sujets.find((s) => s.id === sujetId);
  assert.ok(sujet, `sujet ${sujetId}`);
  const ex = sujet.exercises.find((e) => e.number === number);
  assert.ok(ex, `exercice ${number}`);
  return ex;
};

const OFFICIELS = {
  "1-1-S": [1, "1 ــ اذكر مختلف أنواع الـ ARN المتواجدة في الهيولى خلال وخارج فترة تركيب البروتين."],
  "1-1-E": [
    1,
    "2 ــ اشرح في نصٍ علميٍ دور مختلف أنواع الـ ARN في تركيب البروتين مبرزا تأثير مادة الـ RIP في علاج بعض الأورام السرطانية، (النص العلمي مُهيكل بمقدمة وعرض وخاتمة)"
  ],
  "1-2-S": [
    2,
    "1 ــ حلّل نتائج الشكل(أ) من الوثيقة1. 2 ــ أبرز أثر الخصائص البنيوية للصانعات الخضراء على النمو عند كل من الطحالب T.P من النمط الطبيعي والنمط الطافر باستغلال الشكل(ب) والمعلومة المستخلصة من الشكل(أ) من الوثيقة1."
  ],
  "1-2-E": [
    3,
    "1 ــ اشرح الآلية التي تسمح للطحالب T.P من النمط الطبيعي بتحويل الطاقة الضوئية في أوساط ذات تراكيز CO2 منخفضة. وذلك باستغلالك لأشكال الوثيقة 2 ومكتسباتك."
  ],
  "1-2-W": [
    3,
    "2 ــ برر تأكيد الباحثين على حماية الطحالب T.P الطبيعية حفاظا على البيئة البحرية، انطلاقا من الدراسة السابقة."
  ],
  "1-3-N": [
    4,
    "اقترح فرضيتين حول آلية تأثير مادة الـ Mtb على دور الـ Ado في النشاط العصبي الخاص باليقظة والنوم باستغلالك لشكلي الوثيقة1 ومعلوماتك."
  ],
  "1-3-E": [5, "1 ــ تأكد من صحة إحدى الفرضيتين المقترحتين باستغلالك لشكلي الوثيقة2 ومعلوماتك."],
  "1-3-W": [
    5,
    "2 ــ قدّم على ضوء ما سبق ومعرفتك نصيحتين صحيتين لمستهلكي الشاي. وضّح في مخطط كيف يؤدي تراكم الـ Ado إلى الشعور بالنعاس وتأثير استهلاك مادة Methylthéobromine (Mtb) على ذلك، بناءً على ما توصلت إليه من نتائج هذه الدراسة ومعلوماتك."
  ],
  "2-1-S": [6, "1 ــ تعرّف على المركبات المشار إليها بالأحرف: A.B.C.D.D′"],
  "2-1-E": [
    6,
    "2 ــ اشرح في نصٍ علميٍ مدعّم بمعادلة كيميائية إجمالية تفاعلات تحويل الطاقة الكيميائية الكامنة في جزيئة الغلوكوز خلال مرحلة التحلل السكري المشار إليها في الوثيقة وأثر مادة 2-Désoxyglucose على ذلك. (النص العلمي مُهيكل بمقدمة وعرض وخاتمة)"
  ],
  "2-2-S": [7, "1 ــ حلّل النتائج الممثّلة في الشكل(أ) من الوثيقة1."],
  "2-2-E": [
    7,
    "2 ــ بيّن سبب الخلل في وظيفة الأنزيم SOD عند الشخص المصاب باستغلالك للشكل(ب) والمعلومة المستخلصة من الشكل(أ) من الوثيقة1."
  ],
  "2-2-W": [
    8,
    "1 ــ برّر استعمال EDA كدواء لعلاج التصلّب الجانبي الضموري ALS باستغلالك لأشكال الوثيقة2 ومعلوماتك. 2 ــ اقترح علاجا آخر لمرض التصلب الجانبي الضموري ALS."
  ],
  "2-3-N": [
    9,
    "اقترح فرضية حول الآلية المستخدمة لتحقيق التسامح المناعي عند نقل الدم من مانح زمرته A إلى مستقبل زمرته O باستغلالك لشكلي الوثيقة1 ومعلوماتك."
  ],
  "2-3-E": [10, "1 ــ ناقش صحة الفرضية المقترحة باستغلالك لشكلي الوثيقة2."],
  "2-3-W": [
    10,
    "2 ــ اقترح طريقة أخرى لضمان نقل آمن للدم من شخص زمرته A إلى آخر زمرته O. وضّح في فقرة علمية الخطوات التي اتّبعها الباحثون في تحقيق التسامح المناعي عند نقل الدم من شخص زمرته A إلى آخر زمرته O من خلال ما توصلت إليه من هذه الدراسة ومعارفك."
  ]
};

const RECONSTRUITS = ["1-1-N", "1-1-W", "1-2-N", "1-3-S", "2-1-N", "2-1-W", "2-2-N", "2-3-S"];

test("les seize consignes officielles sont recopiées mot à mot, avec page et date", () => {
  const vus = [];
  for (const [cle, [page, texte]] of Object.entries(OFFICIELS)) {
    const [sujetId, numero, lettre] = cle.split("-");
    const { poles } = exercice(Number(sujetId), Number(numero));
    const pole = poles[lettre];
    assert.ok(pole, `${cle} introuvable`);
    assert.equal(pole.bacPromptSource, "official", `${cle} doit être official`);
    assert.equal(pole.bacPrompt, texte, `${cle} : consigne recopiée de l'image`);
    assert.equal(pole.bacPromptPage, page, `${cle} : page`);
    assert.equal(pole.bacPromptVerifiedAt, "2026-09-16", `${cle} : date de relecture`);
    assert.ok(pole.bacPromptNotes.length > 40, `${cle} : note motivée absente`);
    assert.doesNotMatch(
      pole.bacPromptNotes,
      /non mappée/,
      `${cle} : la note ne doit plus dire « non mappée »`
    );
    vus.push(cle);
  }
  assert.equal(vus.length, 16, "les seize consignes officielles de la session 2025");
});

test("les numéros imprimés « 1 ــ » / « 2 ــ » sont repris ; les deux consignes à tiret restent sans numéro", () => {
  for (const cle of ["1-3-N", "2-3-N"]) {
    const [sujetId, numero, lettre] = cle.split("-");
    const { poles } = exercice(Number(sujetId), Number(numero));
    assert.doesNotMatch(
      poles[lettre].bacPrompt,
      /^[12] ــ/,
      `${cle} : l'image imprime un tiret, pas un numéro`
    );
  }
  const sansNumero = Object.entries(OFFICIELS).filter(
    ([cle]) => !["1-3-N", "2-3-N"].includes(cle) && !/^([12] ــ)/.test(OFFICIELS[cle][1])
  );
  assert.deepEqual(sansNumero, [], "toutes les autres consignes imprimées portent leur numéro");
});

test("les quatre regroupements conservent les deux questions imprimées", () => {
  assert.match(exercice(1, 2).poles.S.bacPrompt, /^1 ــ حلّل نتائج الشكل\(أ\)/);
  assert.match(exercice(1, 2).poles.S.bacPrompt, /2 ــ أبرز أثر الخصائص البنيوية/);
  assert.match(exercice(1, 3).poles.W.bacPrompt, /^2 ــ قدّم على ضوء ما سبق ومعرفتك نصيحتين/);
  assert.match(exercice(1, 3).poles.W.bacPrompt, /الجزء الثالث|وضّح في مخطط/);
  assert.match(exercice(2, 2).poles.W.bacPrompt, /^1 ــ برّر استعمال EDA/);
  assert.match(exercice(2, 2).poles.W.bacPrompt, /2 ــ اقترح علاجا آخر/);
  assert.match(exercice(2, 3).poles.W.bacPrompt, /^2 ــ اقترح طريقة أخرى/);
  assert.match(exercice(2, 3).poles.W.bacPrompt, /وضّح في فقرة علمية/);
});

test("les huit pôles sans question imprimée restent reconstructed et sans page", () => {
  for (const cle of RECONSTRUITS) {
    const [sujetId, numero, lettre] = cle.split("-");
    const { poles } = exercice(Number(sujetId), Number(numero));
    const pole = poles[lettre];
    assert.equal(pole.bacPromptSource, "reconstructed", `${cle} ne doit pas se dire officiel`);
    assert.equal(pole.bacPromptPage, undefined, `${cle} ne porte pas de page`);
    assert.ok(pole.bacPromptNotes.length > 40, `${cle} : la raison doit être écrite`);
  }
});

test("l'inventaire rattache les consignes officielles aux pages relues", () => {
  const attendu = {
    1: [
      [1, ["S", "E"]],
      [2, ["S"]],
      [3, ["E", "W"]]
    ],
    2: [
      [1, ["S", "E"]],
      [2, ["S", "E", "W"]],
      [3, ["N", "E", "W"]]
    ]
  };
  const pages = {
    "1-1-S": 1,
    "1-1-E": 1,
    "1-2-S": 2,
    "1-2-E": 3,
    "1-2-W": 3,
    "1-3-N": 4,
    "1-3-E": 5,
    "1-3-W": 5,
    "2-1-S": 6,
    "2-1-E": 6,
    "2-2-S": 7,
    "2-2-E": 7,
    "2-2-W": 8,
    "2-3-N": 9,
    "2-3-E": 10,
    "2-3-W": 10
  };
  for (const sujetId of [1, 2]) {
    const inventory = officialTaskInventoryFor("2025", sujetId);
    assert.ok(inventory, `l'inventaire 2025/S${sujetId} doit exister`);
    const officielles = inventory.tasks.filter((task) => task.promptSource === "official");
    assert.equal(officielles.length, 8, `sujet ${sujetId} : huit consignes officielles`);
    for (const [, [exerciceNumber, lettres]] of Object.entries(attendu[sujetId])) {
      for (const lettre of lettres) {
        const cle = `${sujetId}-${exerciceNumber}-${lettre}`;
        const task = officielles.find(
          (candidate) => candidate.exerciseNumber === exerciceNumber && candidate.pole === lettre
        );
        assert.ok(task, `${cle} absent de l'inventaire`);
        assert.equal(task.page, pages[cle], `${cle} : page`);
      }
    }
    for (const task of inventory.tasks.filter((candidate) => candidate.promptSource !== "official")) {
      assert.equal(task.page, null, "une étape reconstruite ne porte jamais de page");
    }
  }
});
