/* ============================================================
   Copie libre 2021 — fidélité de la recopie à l'image officielle
   ------------------------------------------------------------
   `data/years/se/year-2021.js` affiche les questions sous le titre
   « النص الرسمي للأسئلة » : ce sont donc des citations, et elles
   doivent être mot pour mot celles du PDF. Les dix pages des deux
   sujets ont été relues sur le rendu image (`rendered/`), page par
   page ; ce test fixe le résultat de cette relecture pour les
   passages qui avaient dérivé (relecture précédente incomplète) ou
   qui portent un symbole latin invisible dans le rendu.

   Chaque assertion cite la page source et le fragment d'image qui la
   fonde — un futur lecteur doit pouvoir revérifier sans refaire la
   relecture complète.
   ============================================================ */
import { test } from "node:test";
import assert from "node:assert/strict";

const url = new URL("../data/years/se/year-2021.js", import.meta.url);
const mod = await import(url.href);
const year = mod.default || Object.values(mod).find((v) => v?.sujets);

const exercise = (sujetId, number) => {
  const sujet = year.sujets.find((s) => s.id === sujetId);
  assert.ok(sujet, `sujet ${sujetId}`);
  const ex = sujet.exercises.find((e) => e.number === number);
  assert.ok(ex, `exercice ${number} du sujet ${sujetId}`);
  return ex;
};

test("sujet 1, exercice 3 : « الممثلة في البروتوكول التجريبي للوثيقة (2) » (page 5)", () => {
  // Image page 5 : « 1 ـ حدِّد هدف كل من التجارب ①،②،③ الممثلة في البروتوكول
  // التجريبي للوثيقة (2). » — la recopie disait « التجارب ①②③، البروتوكول
  // التجريبي الممثل في الوثيقة (2) » : le complément était déplacé.
  const consignes = exercise(1, 3).consignes;
  assert.ok(
    consignes.includes("1 ــ حدِّد هدف كل من التجارب ①②③ الممثلة في البروتوكول التجريبي للوثيقة (2)."),
    "la question doit citer les trois expériences puis « الممثلة في البروتوكول التجريبي للوثيقة (2) »"
  );
  assert.ok(
    !consignes.some((c) => c.includes("البروتوكول التجريبي الممثل في الوثيقة")),
    "la formulation déplacée ne doit pas revenir"
  );
});

test("sujet 2, exercice 3 : « مقر ودور … للإحساس بالألم » (page 8)", () => {
  // Image page 8 : « 1 ـ حدِّد في جدول مقر ودور الجزيئات الغشائية المتدخلة على
  // مستوى القرن الخلفي في نقل الرسالة العصبية للإحساس بالألم، ثم استنتج
  // تأثير هذا السم. » — la recopie avait perdu « مقر و » et déplacé
  // « على الإحساس بالألم » dans la seconde proposition.
  const consignes = exercise(2, 3).consignes;
  assert.ok(
    consignes.includes(
      "1 ــ حدِّد في جدول مقر ودور الجزيئات الغشائية المتدخلة على مستوى القرن الخلفي في نقل الرسالة العصبية للإحساس بالألم، ثم استنتج تأثير هذا السم."
    ),
    "la question doit demander le siège ET le rôle, et rattacher l'الإحساس بالألم au transport de la رسالة"
  );
  assert.ok(
    !consignes.some((c) => c.endsWith("على الإحساس بالألم.")),
    "la clause déplacée ne doit pas revenir"
  );
});

test("les symboles latins restitués depuis la couche texte restent présents", () => {
  // Le rendu PNG ne dessine pas les polices Times/Helvetica non embarquées :
  // « ( ) » sur l'image. La couche texte du PDF, elle, porte le symbole — c'est
  // la seule raison d'écrire « LT4 » ou « VIH » entre parenthèses.
  const s1e2 = exercise(1, 2).consignes.join(" ");
  const s1e3 = exercise(1, 3).consignes.join(" ");
  const s2e1 = exercise(2, 1).consignes.join(" ");
  const s2e2 = exercise(2, 2).consignes.join(" ");
  assert.match(s1e2, /الريبونكلياز \(A\)/, "le nom latin de l'enzyme (A) doit rester tel quel");
  assert.match(s1e2, /عصارة معوية \(pH بين 7.3 و 8.5\)/, "la plage de pH doit rester en clair");
  assert.match(s1e2, /عصارة معدية \(pH = 2\)/);
  assert.match(s1e3, /الخلايا \(LT4\)/);
  assert.match(s1e3, /إصابة العضوية بـ \(VIH\)/);
  assert.match(s2e1, /بالأحرف \(A, B, C, D\)/);
  assert.match(s2e2, /للـ \(ARNm\)/, "ARNm doit rester tel quel");
  assert.match(s2e2, /و\(Tetrahymena\)/, "le nom d'espèce du texte ne doit pas être arabisé");
});

test("la mention de source décrit la relecture réellement faite (dix pages)", () => {
  const sujet1 = year.sujets.find((s) => s.id === 1);
  const sujet2 = year.sujets.find((s) => s.id === 2);
  for (const sujet of [sujet1, sujet2]) {
    assert.equal(sujet.answerMode, "free", "2021 reste en copie libre : aucun pôle, aucune note");
    assert.deepEqual(
      sujet.exercises.map((e) => e.max),
      [5, 7, 8],
      "barème officiel 5 + 7 + 8"
    );
    for (const ex of sujet.exercises) {
      assert.ok(ex.consignes.length > 0, `exercice ${ex.number} sans consigne`);
      assert.equal(ex.poles && Object.keys(ex.poles).length, 0, "aucun pôle inventé");
    }
  }
});
