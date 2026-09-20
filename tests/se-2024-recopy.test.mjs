/* ============================================================
   2024 SE — consignes officielles relues sur l'image
   ------------------------------------------------------------
   Les pôles de la session 2024 avaient leurs consignes reconstruites,
   lues seulement sur une couche texte bruitée. Les scans locaux
   `subjects/SE/2024/sujet-1.pdf` et `sujet-2.pdf` sont des images
   seules (aucune lettre arabe dans la couche) : la relecture du
   2026-09-16 s'est donc faite sur les images des pages 1, 3, 4, 5
   (sujet 1) puis 8 et 9 (sujet 2), et les pages 6, 7 et 10, d'abord
   transcrites sur photos le 2026-08-31, ont été contrôlées sur le
   scan le même jour.

   Ce test fixe les citations recopiées, avec leur page, et vérifie que
   les pôles sans question imprimée restent honnêtement marqués
   `reconstructed` : un cadrage inventé n'est pas une consigne
   officielle. Il verrouille aussi les deux corrections trouvées en
   relisant les images (S2-E2 E sans « في الأوراق » ; S2-E3 W avec
   « المدروسة » et non « الخلطية »).
   ============================================================ */
import { test } from "node:test";
import assert from "node:assert/strict";
import { officialTaskInventoryFor } from "../data/official-tasks.js";

const url = new URL("../data/years/se/year-2024.js", import.meta.url);
const mod = await import(url.href);
const year = mod.default || Object.values(mod).find((v) => v?.sujets);

const exercice = (sujetId, number) => {
  const sujet = year.sujets.find((s) => s.id === sujetId);
  assert.ok(sujet, `sujet ${sujetId}`);
  const ex = sujet.exercises.find((e) => e.number === number);
  assert.ok(ex, `exercice ${number}`);
  return ex;
};

test("sujet 1 / exercice 1 : les deux questions officielles sont recopiées (page 1)", () => {
  const { poles } = exercice(1, 1);
  assert.deepEqual(Object.keys(poles), ["N", "S", "E", "W"]);

  // Image page 1 : « 1 ـ تعرَّف على المراحل الممثَّلة بالأرقام من ① إلى ⑥. »
  assert.equal(poles.S.bacPromptSource, "official");
  assert.equal(poles.S.bacPrompt, "1 ــ تعرَّف على المراحل الممثَّلة بالأرقام من ① إلى ⑥.");
  assert.equal(poles.S.bacPromptPage, 1);
  assert.match(poles.S.bacPromptVerifiedAt, /^\d{4}-\d{2}-\d{2}$/);

  // Image page 1 : « 2 ـ اشرح في نص علمي مراحل تطور الفيروس (VIH) داخل الخلايا
  // (LT4) وتأثير دواء Zalcitabine على ذلك باستغلال الوثيقة ومعلوماتك. (النص
  // العلمي مُهيكل بمقدّمة وعرض وخاتمة). »
  assert.equal(poles.E.bacPromptSource, "official");
  assert.equal(
    poles.E.bacPrompt,
    "2 ــ اشرح في نص علمي مراحل تطور الفيروس (VIH) داخل الخلايا (LT4) وتأثير دواء Zalcitabine على ذلك باستغلال الوثيقة ومعلوماتك. (النص العلمي مُهيكل بمقدّمة وعرض وخاتمة)."
  );
  assert.equal(poles.E.bacPromptPage, 1);
  assert.match(poles.E.bacPromptVerifiedAt, /^\d{4}-\d{2}-\d{2}$/);
});

test("les deux pôles sans question imprimée restent reconstructed, avec la raison", () => {
  const { poles } = exercice(1, 1);
  for (const letter of ["N", "W"]) {
    assert.equal(poles[letter].bacPromptSource, "reconstructed", `${letter} ne doit pas se dire officiel`);
    assert.equal(poles[letter].bacPromptPage, undefined, `${letter} ne doit pas porter de page`);
    assert.ok(
      poles[letter].bacPromptNotes.length > 40,
      `${letter} doit expliquer pourquoi aucune question officielle n'existe`
    );
    assert.match(poles[letter].bacPromptNotes, /2026-09-16/, `${letter} : date de la vérification`);
  }
});

test("l'inventaire rattache les deux nouvelles consignes à la page 1, sans changer le total", () => {
  const inventory = officialTaskInventoryFor("2024", 1);
  assert.ok(inventory, "l'inventaire 2024/S1 doit exister");
  const tasks = inventory.tasks.filter((task) => task.exerciseNumber === 1);
  const official = tasks.filter((task) => task.promptSource === "official");
  assert.equal(official.length, 2, "les deux questions officielles doivent être inventoriées");
  for (const task of official) {
    assert.ok(task.id.startsWith("2024-S1-E1-"), task.id);
    assert.equal(task.page, 1);
  }
  for (const task of tasks.filter((task) => task.promptSource === "reconstructed")) {
    assert.equal(task.page, null, "une étape reconstruite ne porte jamais de page");
  }
});

test("la note du sujet date la relecture des pages 1, 3, 4 et 5", () => {
  const sujet = year.sujets.find((s) => s.id === 1);
  assert.match(sujet.pdfNote, /page 1 : scan local, 2026-09-16/);
  assert.match(sujet.pdfNote, /pages 3, 4 et 5 : scan local, 2026-09-16/);
});

test("sujet 1 / exercice 2 : la clôture recopie les deux questions du الجزء الثاني (page 3)", () => {
  const { poles } = exercice(1, 2);

  // Image page 3 : « 1 ـ بيّن أصل الاعتلال الدماغي المُسبّب لحالة الصُّرع المدروسة
  // باستغلال النتائج المُثبتة في شكلي الوثيقة 2. 2 ـ اقترح حلا علاجيًا للتخفيف
  // من أعراض نوبات الصُّرع بناءً على ما توصلت إليه من خلال هذه الدراسة. »
  assert.equal(poles.W.bacPromptSource, "official");
  assert.equal(
    poles.W.bacPrompt,
    "1 ــ بيّن أصل الاعتلال الدماغي المُسبّب لحالة الصُّرع المدروسة باستغلال النتائج المُثبتة في شكلي الوثيقة 2. 2 ــ اقترح حلا علاجيًا للتخفيف من أعراض نوبات الصُّرع بناءً على ما توصلت إليه من خلال هذه الدراسة."
  );
  assert.equal(poles.W.bacPromptPage, 3);
  assert.equal(poles.W.bacPromptVerifiedAt, "2026-09-16");
  assert.ok(poles.W.bacPromptNotes.length > 40);

  // Le cadrage reste reconstructed : l'énoncé du التمرين الثاني (page 2) n'imprime
  // aucune question, et le pole N ne doit pas hériter d'une question de la partie 2.
  assert.equal(poles.N.bacPromptSource, "reconstructed");
  assert.equal(poles.N.bacPromptPage, undefined);
  assert.match(poles.N.bacPromptNotes, /2026-09-16/);
});

test("sujet 1 / exercice 3 : les quatre consignes imprimées sont recopiées (pages 3, 4 et 5)", () => {
  const { poles } = exercice(1, 3);
  const attendu = {
    // Page 3 (énoncé du التمرين الثالث) — la question de cadrage imprimée.
    N: [3, "فما هي العلاقة بين مكوّنات التبغ وارتفاع نسبة احتمال الإصابة بسرطان الرئة عند المدخّنين؟"],
    // Page 4 (الجزء الأول) — la question qui demande la فرضية.
    S: [
      4,
      "اقترح فرضية توضّح من خلالها العلاقة بين Benzopyrène وارتفاع نسبة احتمال الإصابة بسرطان الرئة عند المدخّنين باستغلالك شكلي الوثيقة 1 ومعلوماتك."
    ],
    // Page 5 (الجزء الثاني) — la validation de la فرضية.
    E: [5, "1 ــ صادق على صحة الفرضية المقترحة باستغلالك لأشكال الوثيقة 2 ومعلوماتك."],
    // Page 5 (الجزء الثاني + الجزء الثالث) — prévention puis schéma de synthèse.
    W: [
      5,
      "2 ــ قدّم إرشادات للمدخّنين وغير المدخّنين لتقادي الإصابة بمرض السرطان الرئوي. لخّص في مخطط دور البروتينين P53 في إصلاح اختلال الـ ADN المسبب للسرطان عند المدخّنين وغير المدخّنين بناءً على ما سبق ومعلوماتك."
    ]
  };
  for (const [lettre, [page, texte]] of Object.entries(attendu)) {
    assert.equal(poles[lettre].bacPromptSource, "official", `${lettre} doit être official`);
    assert.equal(poles[lettre].bacPrompt, texte, `${lettre} : consigne recopiée`);
    assert.equal(poles[lettre].bacPromptPage, page, `${lettre} : page`);
    assert.equal(poles[lettre].bacPromptVerifiedAt, "2026-09-16", `${lettre} : date`);
    assert.ok(poles[lettre].bacPromptNotes.length > 40, `${lettre} : note motivée`);
  }
});

test("l'inventaire rattache les consignes des exercices 2 et 3 aux pages relues", () => {
  const inventory = officialTaskInventoryFor("2024", 1);
  assert.ok(inventory, "l'inventaire 2024/S1 doit exister");
  const attendu = new Map([
    [
      2,
      [
        ["S", 2],
        ["E", 2],
        ["W", 3]
      ]
    ],
    [
      3,
      [
        ["N", 3],
        ["S", 4],
        ["E", 5],
        ["W", 5]
      ]
    ]
  ]);
  for (const [numero, poles] of attendu) {
    const taches = inventory.tasks.filter((task) => task.exerciseNumber === numero);
    const officielles = taches.filter((task) => task.promptSource === "official");
    assert.equal(officielles.length, poles.length, `exercice ${numero}`);
    for (const [pole, page] of poles) {
      const task = officielles.find((candidate) => candidate.pole === pole);
      assert.ok(task, `exercice ${numero} / pôle ${pole} absent de l'inventaire`);
      assert.equal(task.page, page, `${task.id} : page`);
    }
    for (const task of taches.filter((candidate) => candidate.promptSource === "reconstructed")) {
      if (numero === 2 && task.pole === "N") assert.equal(task.page, null, task.id);
    }
  }
});

// ---------------------------------------------------------------------------
// Sujet 2 — pages 8 et 9 relues le 2026-09-16 (les pages 6, 7 et 10 l'avaient
// été sur photos le 2026-08-31, puis contrôlées sur le scan).
// ---------------------------------------------------------------------------

test("sujet 2 / exercice 2 : la clôture recopie la consigne du الجزء الثاني (page 8)", () => {
  const { poles } = exercice(2, 2);

  assert.equal(poles.W.bacPromptSource, "official");
  assert.equal(
    poles.W.bacPrompt,
    "اشرح آلية تأثير عامل الظلام على تفاعلات تثبيت جزيئة الـ CO2 باستغلال أشكال الوثيقة 2 ومعلوماتك."
  );
  assert.equal(poles.W.bacPromptPage, 8);
  assert.equal(poles.W.bacPromptVerifiedAt, "2026-09-16");
  assert.ok(poles.W.bacPromptNotes.length > 40);

  // Le cadrage N reste reconstructed : l'énoncé du التمرين الثاني (page 6)
  // annonce l'objectif sans poser de question.
  assert.equal(poles.N.bacPromptSource, "reconstructed");
  assert.equal(poles.N.bacPromptPage, undefined);
});

test("sujet 2 / exercice 2 : la consigne E est corrigée d'après l'image (page 7)", () => {
  const { poles } = exercice(2, 2);
  assert.equal(poles.E.bacPromptSource, "official");
  assert.equal(
    poles.E.bacPrompt,
    "أبرز العلاقة بين كمية (CA1P) ونسبة نشاط الأنزيم (Rubisco) انطلاقا من نتائج الشكل (ب) والمعلومة المستخلصة من الشكل (أ) من الوثيقة 1."
  );
  assert.doesNotMatch(poles.E.bacPrompt, /في الأوراق/, "l'incise imprimée n'existe pas");
  assert.equal(poles.E.bacPromptPage, 7);
  assert.equal(poles.E.bacPromptVerifiedAt, "2026-09-16");
});

test("sujet 2 / exercice 3 : les consignes des pages 9 et 10 sont recopiées", () => {
  const { poles } = exercice(2, 3);
  const attendu = {
    // Page 9 (الجزء الأول) — la question qui demande les deux فرضيتان.
    S: [
      9,
      "اقترح فرضيتين تُبيّن من خلالهما آلية تأثير البكتيريا Staphylococcus aureus على الاستجابة المناعية باستغلالك شكلي الوثيقة 1 ومعلوماتك."
    ],
    // Page 10 (الجزء الثاني) — la discussion d'une فرضية.
    E: [10, "ناقش صحة إحدى الفرضيتين المقترحتين باستغلالك لأشكال الوثيقة 2 ومعلوماتك."],
    // Page 10 (الجزء الثاني + الجزء الثالث) — solution puis schéma de synthèse.
    W: [
      10,
      "2 ــ اقترح بناءً على أساس علمي حلاً للمشكل الذي تثيره بكتيريا Staphylococcus aureus. لخّص في مخطط مراحل الاستجابة المناعية المدروسة في وجود وغياب بكتيريا Staphylococcus aureus اعتمادا على ما سبق ومعلوماتك."
    ]
  };
  for (const [lettre, [page, texte]] of Object.entries(attendu)) {
    assert.equal(poles[lettre].bacPromptSource, "official", `${lettre} doit être official`);
    assert.equal(poles[lettre].bacPrompt, texte, `${lettre} : consigne recopiée`);
    assert.equal(poles[lettre].bacPromptPage, page, `${lettre} : page`);
    assert.equal(poles[lettre].bacPromptVerifiedAt, "2026-09-16", `${lettre} : date`);
    assert.ok(poles[lettre].bacPromptNotes.length > 40, `${lettre} : note motivée`);
  }
  // Le mot imprimé est المدروسة : « الخلطية » venait d'une lecture antérieure.
  assert.doesNotMatch(poles.W.bacPrompt, /الخلطية/);
  // Le cadrage N reste reconstructed (l'énoncé annonce une piste, sans question).
  assert.equal(poles.N.bacPromptSource, "reconstructed");
  assert.equal(poles.N.bacPromptPage, undefined);
  assert.match(poles.N.bacPromptNotes, /2026-09-16/);
});

test("l'inventaire du sujet 2 rattache les consignes aux pages 6 à 10", () => {
  const inventory = officialTaskInventoryFor("2024", 2);
  assert.ok(inventory, "l'inventaire 2024/S2 doit exister");
  const attendu = new Map([
    [
      1,
      [
        ["S", 6],
        ["E", 6]
      ]
    ],
    [
      2,
      [
        ["S", 7],
        ["E", 7],
        ["W", 8]
      ]
    ],
    [
      3,
      [
        ["S", 9],
        ["E", 10],
        ["W", 10]
      ]
    ]
  ]);
  for (const [numero, poles] of attendu) {
    const taches = inventory.tasks.filter((task) => task.exerciseNumber === numero);
    const officielles = taches.filter((task) => task.promptSource === "official");
    assert.equal(officielles.length, poles.length, `exercice ${numero}`);
    for (const [pole, page] of poles) {
      const task = officielles.find((candidate) => candidate.pole === pole);
      assert.ok(task, `exercice ${numero} / pôle ${pole} absent de l'inventaire`);
      assert.equal(task.page, page, `${task.id} : page`);
    }
  }
  const nonLocalisees = inventory.tasks.filter((task) => task.promptSource !== "official");
  for (const task of nonLocalisees) {
    assert.equal(task.page, null, "une étape reconstruite ne porte jamais de page");
  }
});

test("la note du sujet 2 date la relecture des pages 8 et 9", () => {
  const sujet = year.sujets.find((s) => s.id === 2);
  assert.match(sujet.pdfNote, /pages 8 et 9 relues sur le scan local/);
  assert.match(sujet.pdfNote, /2026-09-16/);
});
