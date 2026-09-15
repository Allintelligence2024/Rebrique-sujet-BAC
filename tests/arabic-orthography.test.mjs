/* ============================================================
   Orthographe arabe des données d'annales (maths + sciences)
   ------------------------------------------------------------
   Le 2026-09-15, une passe d'orthographe a corrigé les données
   recopiées des sujets/corrigés : ة finale écrite ه (بنيه → بنية),
   hamza de coupure manquante (اجسام → أجسام, إنزيم → أنزيم),
   hamzat wasl écrit avec hamza (إستجابة → استجابة) et quelques
   coquilles de recopie (البيبتيدية → الببتيدية, التماز → التمايز,
   التكزري → الكزازي, البلاسمية → البلازمية, الضمحل الييني →
   الحمض الأميني d'après le corrigé 2022 « روابط بين CoEM والحمض
   الأميني Arg120 »).

   Trois formes de plus le 2026-09-15, chacune tranchée par une preuve :
     - « الأراكيدونيك » → « الأراشيدونيك » : le sujet SE-2020 imprime
       « حمض أراشيدونيك » (relu en image, page 2 : diagramme + question) ;
     - « تركيض » → « ارتباط » : le jeton n'existe nulle part (0 dans le
       corpus des scans, 0 dans la réponse modèle) et le corrigé officiel
       SE-2022 dit « يمنع 3-NOP ارتباط CoEM بالأنزيم » ;
     - « للرفاق » → « المرافق » : le corrigé écrit « الموقع الخاص بتثبيت
       المرافق الأنزيمي ».

   Ces tests verrouillent le résultat :
   1. aucune des formes fautives corrigées ne revient (jeton par jeton,
      pour ne pas confondre « سكره » « son sucre » avec une coquille) ;
   2. le ة reste toujours en finale de jeton — invariant du corpus,
      vérifié sur HEAD avant la passe ; il attrape la classe de bug
      introduite en insérant un ة devant un suffixe possessif
      (لتترجمه → لتترجمةا) ;
   3. les formes corrigées sont bien présentes, y compris dans les
      consignes affichées à l'élève.
   ============================================================ */

import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { matchConcept } from "../js/engine.js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const STREAMS = ["m", "se"];

/** Un fichier d'année = un payload autonome ; l'inventaire généré est exclu. */
function yearFiles() {
  const files = [];
  for (const stream of STREAMS) {
    const dir = join(root, "data", "years", stream);
    for (const name of readdirSync(dir).filter((x) => x.endsWith(".js") && x !== "official-tasks.js")) {
      files.push({ stream, name, text: readFileSync(join(dir, name), "utf8") });
    }
  }
  return files;
}

const FILES = yearFiles();
const TOKEN = /[\u0621-\u0652\u0670\u0640]+/g;

function tokensOf(text) {
  return text.match(TOKEN) || [];
}

/** Formes fautives supprimées le 2026-09-15 (comparaison par jeton entier). */
const FORBIDDEN = [
  // hamza de coupure manquante ou hamzat wasl hamzée
  "إستجابة",
  "إستنساخ",
  "إستطالة",
  "إستخلاص",
  "إرتباط",
  "إكتساب",
  "إنعطاف",
  "إنطلاق",
  "إنتقاء",
  "إختلافات",
  // « أكتب » reste banni partout sauf dans la transcription du sujet
  // officiel 2021 SE (voir le test dédié « le sujet officiel 2021 SE … »).
  "انجز",
  "اجسام",
  "احماض",
  "اشعه",
  "اصابه",
  "اضافه",
  "اميني",
  "اترازين",
  "اكسيد",
  "ادينوزين",
  "اسيتيل",
  "الأستيل",
  "اليل",
  "انزيم",
  "إنزيم",
  "انترلوكين",
  "إنترلوكين",
  "استراديول",
  "البومين",
  "البورت",
  "اللآذات",
  "اكسجين",
  "الاكسجين",
  "اشعاع",
  "ايثانول",
  "ايبوبروفين",
  "افلات",
  "افرار",
  "ارثروكين",
  "انسان",
  "الانواع",
  "الادنين",
  "اثار",
  "اعلي",
  "ارض",
  "كره",
  // ة finale écrite ه
  "فرضيه",
  "طفره",
  "مورثه",
  "نواه",
  "ركيزه",
  "سرعه",
  "حراره",
  "مسافه",
  "حمايه",
  "مراقبه",
  "هويه",
  "وراثه",
  "مقاومه",
  "قليله",
  "عصبيه",
  "كهربائيه",
  "سرطانيه",
  "فولطيه",
  "الضوئيه",
  "كبريتيه",
  "هيوليه",
  "دمويه",
  "معايره",
  "حيويه",
  "بلعمه",
  "شفره",
  "جلطه",
  "فجوه",
  "ثالثيه",
  "شحنه",
  "هجره",
  "عضله",
  "الحلقه",
  "سريعه",
  "قشره",
  "ممرضه",
  "يقظه",
  "طاقه",
  "بالعه",
  "نيكليوتيده",
  "فلوره",
  "كارهه",
  "نسبه",
  "عتبه",
  "سامه",
  "منعدمه",
  "مستنسخه",
  "مخزنه",
  "ممتصه",
  "طافره",
  "قناه",
  "ذره",
  "حشوه",
  "سميه",
  "كليه",
  "زمره",
  "راحه",
  "مضخه",
  "ثقيله",
  "رساله",
  "حركيه",
  "اغلفه",
  "بيئه",
  "الخطوه",
  "كفاءه",
  "وذمه",
  "اعظميه",
  "اكسده",
  "اخوه",
  "ثانويه",
  "حلزونيه",
  "سياده",
  "ليمفاويه",
  "أمفوتيريه",
  "رقابه",
  "ناسخه",
  "الثلاثه",
  "ذاكره",
  // coquilles de recopie
  "البيبتيدية",
  "البيتيد",
  "التماز",
  "رابعه",
  "التكزري",
  "الغرأنزيم",
  "المحسة",
  "البلاسمية",
  "البلاسموديوم",
  "البلاسموسيت",
  // Seconde passe du 2026-09-15 : ces formes n'avaient pas d'article défini
  // dans la liste, donc « بلاسموسيت » / « برفورين » passaient au travers.
  "بلاسموسيت",
  "بلاسمية",
  "بالمسموتسيت",
  "بالمسموتسيات",
  "بروفيرين",
  "برفورين",
  "تيموسيه",
  "لالذات",
  "فوسفوهيدنية",
  "تحضى",
  "لأمينين",
  "محأليل",
  "يترجمة",
  "ويترجمة",
  // Troisième passe du 2026-09-15 (2013-m, corrigé relu en image) : le
  // corrigé écrit « خلية بلازمية », « تمايز » et « التنشيط : التكاثر و
  // التمايز ». Le jeton nu « لازمية » ne peut pas entrer ici : le préfixe
  // « ب » le rendrait égal à la forme correcte « بلازمية » ; un test dédié
  // ci-dessous compare donc le jeton entier.
  "اللازمية",
  "تماز",
  "تمازت",
  "تشطيم",
  // Quatrième passe du 2026-09-15 : « السيستينين » (2018-m, deux cystéines
  // reliées par un pont disulfure) s'écrivait « السيسيتين », et le slug
  // « النطبيعي » de la SE-2025 fusionnait « النمط » et « الطبيعي ».
  "سيسيتين",
  "النطبيعي",
  // Radicaux de mots-clés morts : « بلاسم » ne pouvait plus rien attraper
  // après « بلاسموسيت » → « بلازموسيت », et « زمري » n'était le radical
  // d'aucun mot du corpus (le pôle voisin utilise déjà « الزمر »).
  "بلاسم",
  "زمري",
  // Restes de hamzat wasl (formes VII/VIII/X) : « إستعاد »/« إكتسب »/
  // « إرتصاص »/« إنطواء » en 2014-m, alors que le même fichier écrit
  // ارتصاص (18 fois) et le corpus استعادة / يكتسب / انطواء.
  "إستعاد",
  "إكتسب",
  "إرتصاص",
  "إنطواء",
  // Cinquième passe (2026-09-15, après la recopie SE-2021) : voir l'en-tête.
  "أراكيدونيك",
  "تركيض",
  "للرفاق",
  // Trois graphies du mot « nucléotide » vivent dans les scans : نيكليوتيد
  // (49), نكليوتيدة (21) et نيوكليوتيد avec wāw (10). Le payload 2017-m
  // employait la troisième une seule fois contre huit fois la première :
  // aligné sur sa propre majorité (test dédié ci-dessous pour la famille).
  "نيوكليوتيد"
];

test("aucune des formes fautives corrigées ne revient dans les données", () => {
  // Comparaison par jeton entier, mais un jeton peut porter un préfixe :
  // « والتماز » échappait à la liste où figure « التماز », de même qu'un
  // article collé (« اللأمينين », corruption de « اللامينين »). On essaie
  // donc les préfixes connus avant de comparer.
  const PREFIXES = ["و", "ف", "ب", "ك", "ل", "ال", "وال", "فال", "بال", "كال", "لل"];
  const wrongForms = new Set(FORBIDDEN);
  const hits = [];
  for (const { stream, name, text } of FILES) {
    for (const token of new Set(tokensOf(text))) {
      if (wrongForms.has(token)) {
        hits.push(`${stream}/${name} : ${token}`);
        continue;
      }
      for (const prefix of PREFIXES) {
        const bare = token.slice(prefix.length);
        if (token.startsWith(prefix) && wrongForms.has(bare)) {
          hits.push(`${stream}/${name} : ${token} (→ ${bare})`);
          break;
        }
      }
    }
  }
  assert.deepEqual(hits, [], `formes fautives réintroduites :\n${hits.join("\n")}`);
});

test("« أكتب » (hamza) n'existe que dans la transcription du sujet officiel 2021 SE", () => {
  // Le corrigé et nos rédactions écrivent « اكتب » (sans hamza). Le sujet
  // officiel 2021 SE, lui, imprime « أكتب » : la recopie est mot à mot, on
  // ne réécrit donc pas la source. L'exception est nominative : tout autre
  // fichier qui se remet à écrire « أكتب » fait échouer ce test.
  const hits = [];
  for (const { stream, name, text } of FILES) {
    for (const token of new Set(tokensOf(text))) {
      const bare = ["و", "ف"].some((p) => token.startsWith(p)) ? token.slice(1) : token;
      if (bare === "أكتب") hits.push(`${stream}/${name} : ${token}`);
    }
  }
  assert.deepEqual(hits, ["se/year-2021.js : أكتب"], `occurrences de « أكتب » :\n${hits.join("\n")}`);
  const subject = FILES.find((f) => f.name === "year-2021.js" && f.stream === "se");
  assert.match(
    subject.text,
    /2 ــ أكتب نصا علميا توضح فيه المؤهلات/,
    "la phrase officielle doit rester recopiée telle quelle"
  );
});

test("le jeton nu « لازمية » n'existe nulle part (forme correcte : بلازمية)", () => {
  // Corrigé 2013-m p. 4 relu en image : « خلية بلازمية LBP ». La comparaison
  // est exacte, jeton entier, parce que la boucle de préfixes du premier test
  // ne peut pas distinguer « لازمية » de « بلازمية » (préfixe « ب »).
  const hits = [];
  for (const { stream, name, text } of FILES) {
    for (const token of new Set(tokensOf(text))) {
      if (token === "لازمية") hits.push(`${stream}/${name} : ${token}`);
    }
  }
  assert.deepEqual(hits, [], `forme fautive réintroduite :\n${hits.join("\n")}`);
});

test("les réponses modèle disent المبلغات العصبية, jamais المبالغ", () => {
  // SE-2023 : « ترتبط المبالغ العصبية بمستقبلات غشائية نوعية » — « المبالغ »
  // (les montants) n'a aucun sens ici et contredit la même session, qui écrit
  // « مستقبل غشائي للمبلغ العصبي » (L. 61), comme 2026-m « المبلغات الكيميائية ».
  // Le vocabulaire des scans ne connaît pas non plus المبالغ (0 contre 28 formes
  // en مبلغ). Le mot seul reste licite ailleurs : on verrouille la phrase.
  const hits = [];
  let good = 0;
  for (const { stream, name, text } of FILES) {
    if (text.includes("المبالغ العصبية")) hits.push(`${stream}/${name} : المبالغ العصبية`);
    good += (text.match(/المبلغات العصبية/g) || []).length;
  }
  assert.deepEqual(hits, [], `contresens réintroduit :\n${hits.join("\n")}`);
  assert.ok(good >= 1, "forme corrigée المبلغات العصبية absente");
});

test("le ة reste en finale de jeton dans les deux filières", () => {
  const hits = [];
  for (const { stream, name, text } of FILES) {
    for (const raw of tokensOf(text)) {
      const token = raw.replace(/[\u064B-\u0652\u0670\u0640]/g, "");
      const index = token.indexOf("ة");
      if (index >= 0 && index < token.length - 1) hits.push(`${stream}/${name} : ${token}`);
    }
  }
  assert.deepEqual(hits, [], `jetons avec un ة non final :\n${hits.join("\n")}`);
});

test("les corrections du 2026-09-15 sont bien en place (échantillon maths)", () => {
  const maths = FILES.filter((f) => f.stream === "m");
  const text = maths.map((f) => f.text).join("\n");
  const tokens = new Set(tokensOf(text));
  for (const good of [
    "أنزيم",
    "استجابة",
    "أجسام",
    "أحماض",
    "بنية",
    "رامزة",
    "ببتيدية",
    "بلعمة",
    "أكسجين",
    "مضادة",
    "التمايز",
    "فوسفودهنية",
    "غليكوبروتينية",
    "تحظى",
    "بيرفورين",
    "بلازموسيت",
    "بلازمية",
    "لمفاوية",
    "لاذات",
    "تيموسية",
    "وريقية",
    "السيستينين",
    "ارتصاص",
    "انطواء"
  ]) {
    assert.ok(tokens.has(good), `forme corrigée absente : ${good}`);
  }
  // Locatifs et valeurs recopiés des corrigés : la consigne 2017 nomme la
  // cellule productrice, la phrase 2022 (SE) la liaison du cofacteur.
  const y2017 = FILES.find((f) => f.stream === "m" && f.name === "year-2017.js");
  assert.match(y2017.text, /الخلية البلازمية/);
  const y2018 = FILES.find((f) => f.stream === "m" && f.name === "year-2018.js");
  assert.match(y2018.text, /الأناتوكسين الكزازي/);
  const se2022 = FILES.find((f) => f.stream === "se" && f.name === "year-2022.js");
  assert.match(se2022.text, /بين الحمض الأميني Arg120/);
  assert.match(se2022.text, /اللامينين/, "le nom du laminin ne doit pas être hamzé");
  const m2015 = FILES.find((f) => f.stream === "m" && f.name === "year-2015.js");
  assert.match(m2015.text, /محاليل/, "les solutions de pH restent محاليل");
});

test("la réponse modèle 2021 conserve les possessifs رامزها / تركيزها", () => {
  // Régression de la passe orthographique : un ة inséré devant le suffixe
  // possessif produisait « رامزةا » / « تركيزةا ».
  const text = FILES.map((f) => f.text).join("\n");
  assert.match(text, /رامزها المضادة/);
  assert.doesNotMatch(text, /ةا\b/);
});

test("le résumé SE-2025 nomme le receveur (مستقبل), pas مستقل", () => {
  // Le résumé du pôle N disait « نقل الدم من مانح زمرته A إلى مستقل زمرته O »
  // alors que l'énoncé officiel du même pôle (page 9, vérifié le 2026-08-23)
  // écrit « إلى مستقبل زمرته O ». « مستقل » (indépendant) n'a pas de sens ici.
  const hits = [];
  let good = 0;
  for (const { stream, name, text } of FILES) {
    if (text.includes("مستقل زمرته")) hits.push(`${stream}/${name} : مستقل زمرته`);
    good += (text.match(/مستقبل زمرته/g) || []).length;
  }
  assert.deepEqual(hits, [], `forme fautive réintroduite :\n${hits.join("\n")}`);
  assert.ok(good >= 1, "forme correcte مستقبل زمرته absente");
});

test("les mots-clés acceptent la graphie que l'élève lit dans le sujet officiel", () => {
  // Un mot-clé écrit dans une seule graphie peut être « mort » pour l'élève
  // qui recopie le sujet : le sujet SE-2022 imprime « الجينتامسين » (س) quand
  // son corrigé écrit « الجينتاميسين », et le sujet 2021-m imprime « البكتريا ».
  // Les trois règles ci-dessous doivent accepter les deux lectures.
  const cases = [
    {
      label: "SE-2020/S1E2/S — حمض أراشيدونيك",
      keywords: ["Cox", "اراشيدونيك", "الم", "مخاط"],
      minHits: 3,
      student: "يحول Cox-1 حمض أراشيدونيك إلى برستاغلوندين يفرز المخاط فيحمي جدار المعدة"
    },
    {
      label: "SE-2022/S1E3/N — الجينتامسين",
      keywords: ["فرضية", "ترجمة", "جينتامسين"],
      minHits: 2,
      student: "الفرضية: يتسبب الجينتامسين في قراءة خاطئة للرموز خلال الترجمة"
    },
    {
      label: "2021-m/S1E2/W — البكتريا",
      keywords: ["مضادات", "مقاومة", "بكتريا"],
      minHits: 2,
      student:
        "تثبط المضادات الحيوية تركيب بروتينات البكتريا فتوقف نموها، والاستعمال المفرط ينتج سلالات مقاومة"
    }
  ];
  const se2022 = FILES.find((f) => f.stream === "se" && f.name === "year-2022.js");
  const m2021 = FILES.find((f) => f.stream === "m" && f.name === "year-2021.js");
  // La graphie du sujet doit être présente dans le fichier, dans un groupe d'alias.
  assert.match(se2022.text, /\["جينتامسين", "جينتاميسين"\]/);
  assert.match(m2021.text, /\["بكتيريا", "بكتريا"\]/);
  for (const c of cases) {
    for (const k of c.keywords) {
      assert.ok(
        matchConcept(c.student, k),
        `${c.label} : mot-clé « ${k} » non attrapé (minHits ${c.minHits})`
      );
    }
  }
});

test("la famille نيوكليوتيد (avec wāw) n'existe plus ; nos rédactions disent نيكليوتيد", () => {
  // Le corpus officiel atteste trois graphies : نيكليوتيد (49 occurrences),
  // نكليوتيدة (21) et نيوكليوتيد avec wāw (10). Le corrigé 2017 imprime la
  // deuxième (« استبدال النكليوتيدة T ... بالنكليوتيدة U ») et le sujet
  // 2017-m cite « تسلسل نكليوتيدات المورثة » : ces citations restent telles
  // quelles. En revanche nos propres phrases suivent la forme majoritaire
  // نيكليوتيد, et non la troisième — un mot qui n'était écrit qu'une fois
  // contre huit dans le même fichier.
  const withWaw = [];
  for (const { stream, name, text } of FILES) {
    const n = (text.match(/نيوكليوت/g) || []).length;
    if (n) withWaw.push(`${stream}/${name} : ${n}`);
  }
  assert.deepEqual(withWaw, [], `famille avec wāw réintroduite :\n${withWaw.join("\n")}`);
  const good = FILES.reduce((sum, f) => sum + (f.text.match(/نيكليوت/g) || []).length, 0);
  assert.ok(good >= 1, "forme نيكليوتيد absente des données");
});
