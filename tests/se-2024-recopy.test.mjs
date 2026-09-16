/* ============================================================
   2024 SE, sujet 1 / exercice 1 — consignes officielles (page 1)
   ------------------------------------------------------------
   L'exercice 1 du sujet 1 (VIH / LT4 / Zalcitabine) avait ses quatre
   pôles reconstruits : les questions n'avaient été lues que sur une
   couche texte bruitée. Le scan local
   `subjects/SE/2024/sujet-1.pdf` est une image seule (aucune lettre
   arabe dans la couche) : la relecture du 2026-09-16 s'est donc faite
   sur l'image de la page 1, agrandie deux fois.

   Les deux questions officielles de l'exercice sont désormais des
   citations : ce test les fixe, avec leur page, et vérifie que les
   deux pôles sans question imprimée (cadrage et clôture) restent
   honnêtement marqués `reconstructed`.
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

test("la note du sujet date la relecture de la page 1", () => {
  const sujet = year.sujets.find((s) => s.id === 1);
  assert.match(sujet.pdfNote, /page 1 : scan local, 2026-09-16/);
});
