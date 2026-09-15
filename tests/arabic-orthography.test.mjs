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
  "أكتب",
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
  "التكزري",
  "الغرأنزيم",
  "المحسة",
  "البلاسمية",
  "البلاسموديوم",
  "البلاسموسيت",
  "لأمينين",
  "محأليل",
  "يترجمة",
  "ويترجمة"
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
    "التمايز"
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
