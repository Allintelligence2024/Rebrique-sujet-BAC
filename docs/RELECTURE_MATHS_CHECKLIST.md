# Checklist de relecture — BAC maths (شعبة رياضيات)

**Date :** 2026-09-13. Branche `arena/01a09be6-rebrique-sujet-bac` (PR #26).

Périmètre : toutes les consignes officielles de la filière maths encodées dans
`data/years/m/`. Règle appliquée : une tâche n'est marquée `official` que si le
`bacPrompt` a été relu **sur l'image de la page** ; le reste reste
`reconstructed` (badge ⚠️) et aucun texte n'est inventé.

## Pourquoi la couche texte ne suffit pas

Les scans ministériels portent une couche texte inversée ou bruitée. Exemples
relevés : `2222` pour 2022, `20 سا و02 د` pour 2 h 30, `إمتحان`/`امتحان`
mélangés. Recopier une consigne depuis cette couche produit une faute que
l'élève recopie ensuite en épreuve.

Outil ajouté : `node scripts/render-pdf-pages.mjs <pdf> <pages> [scale]`
→ `rendered/<chemin>_pN.png` (dossier ignoré par git). Elle demande un canvas
Node ; sous ce dépôt, l'alias local `node_modules/canvas` → `@napi-rs/canvas`
suffit (procédure dans l'en-tête du script).

Audit d'un sujet (pôles, points, provenance, page) :
`node scripts/report-subject-inventory.mjs 2024-m`.

## Pages relues en image

| Sujet                       | Page               | Contenu                                                     | Décision                                                                                                                                                                    |
| --------------------------- | ------------------ | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2023-m S1 (scan `-1077342`) | 1                  | ت1 (8ن) الإيثانول / بنية البروتين                           | S = Q1+Q2 mot à mot, E = Q3 (نص علمي)                                                                                                                                       |
| 2023-m S1                   | 2                  | ت2 (12ن) القصور المناعي / PRF1, الجزء الأول                 | N = consigne officielle mot à mot                                                                                                                                           |
| 2023-m S1                   | 3                  | ت2, الجزء الثاني + الثالث                                   | E et W alignés sur le scan                                                                                                                                                  |
| 2023-m S1                   | 4                  | S2 ت1 : التعاون الخلوي                                      | S, E confirmés                                                                                                                                                              |
| 2023-m S2                   | 5                  | ت2 (13ن) Halofuginone / ملاريا, الجزء الأول                 | N confirmé                                                                                                                                                                  |
| 2023-m S2                   | 6                  | ت2, الجزء الثاني + الثالث                                   | E = Q1+Q2 (نصيحة), W confirmé                                                                                                                                               |
| 2024-m S1                   | 1                  | ت1 (7ن) الكورديسبين                                         | S = Q1+Q2, E = Q3                                                                                                                                                           |
| 2024-m S2                   | 1 (page 4 du scan) | ت1 (7ن) PID / الرد الخلطي                                   | S = Q1+Q2 (جدول المنشأ), E = Q3                                                                                                                                             |
| 2025-m S1                   | 1                  | ت1 (8ن) Q/D / الريبوزوم                                     | S = Q1+Q2+Q3, E = Q4                                                                                                                                                        |
| 2020-m S1 (scan `-2273619`) | 1                  | ت1 (8ن) بنية البروتين / هجرة كهربائية                       | S = Q1+Q2+Q3, E = Q4 ; N/W reconstruits                                                                                                                                     |
| 2020-m S1                   | 2-3                | ت2 (12ن) Ras / p53 / سرطان الجلد                            | N = « صُغ المشكل العلمي », S = فرضية+بيّن+ترجم, E = اشرح+نص علمي                                                                                                            |
| 2020-m S2                   | 4                  | ت1 (8ن) جزيئات HLA                                          | S = Q1+Q2+Q3, E = Q4 ; N/W reconstruits                                                                                                                                     |
| 2020-m S2                   | 5                  | ت2 (12ن) الأنيميا المنجلية HbS                              | N = « أبرز المشكلة المطروحة », S = فرضية+قارن, E = تحقق+نص علمي                                                                                                             |
| 2020-m corrigé              | 6-10               | corrigé officiel complet                                    | réponses modèle rédigées depuis l'image (رابطة شاردية، (س)=R2…، T→A position 20)                                                                                            |
| 2018-m S1                   | 1, 2, 3            | ت1 (7ن) المورثة والبروتين ; ت2 (13ن) العجز المناعي          | Q1–Q4 mot à mot (بيانات+الظاهرتان، مرحلتا (ص)، هجرة كهربائية، نص علمي) ; W reconstruit ; ت2 : كل السلم mot à mot (منحنى، مقارنة، (a)/(b) وCMH II، تحليل الوثيقة 4، نص علمي) |
| 2018-m S2                   | 4, 5, 6            | ت1 (6ن) اللقاح والجسم المضاد ; ت2 (14ن) مورثة الريبونوكلياز | huit consignes mot à mot (تعرّف/مثّل، الظاهرة، الاستجابة الثانوية، نص علمي، البيانات 1–3، جدول الشفرة، متتالية الأحماض، سبب RNas غير عادي)                                  |
| 2019-m S1                   | 1                  | ت1 (6ن) بنية البروتين / الرابطة الببتيدية                   | Q1–Q4 mot à mot (بيانات، صيغة + كتلة مولية، تعليل، نص علمي)                                                                                                                 |
| 2019-m S1                   | 2, 3               | ت2 (14ن) الخلايا المناعية / الغرفتان                        | N, S, E mot à mot ; W reconstruit                                                                                                                                           |
| 2019-m S2                   | 4, 5               | ت1 (6ن) البالعة ; ت2 (14ن) الشفرة الوراثية                  | consignes mot à mot                                                                                                                                                         |

## Consignes corrigées ou ajoutées (cette passe)

- **2023-m S1-E1** — la tâche E recopiait la question 2 et la question du texte
  scientifique n'existait nulle part ; les trois questions officielles sont
  maintenant encodées.
- **2023-m S1-E2** — la consigne du الجزء الأول était une paraphrase
  (« توضحان » au lieu de « توضّح بهما … باستغلالك لنتائج الوثيقة 1 »).
- **2023-m S2-E2** — « قدّم نصيحة مُبرَّرة لتفادي ذلك » (الجزء الثاني, Q2)
  n'était mappée nulle part.
- **2024-m S1-E1** — « أكمل التتابع النيكليوتيدي للعنصر 4 في حالة غياب (COR) »
  (Q2) manquait ; « الجدول منشأ ومقر اكتساب الكفاءة » n'existait pas non plus.
- **2024-m S2-E1** — idem : table du منشأ / مقر الاكتساب ajoutée.
- **2025-m S1-E1** — « مثّل الجزء المؤطر (م)… » et « أعطِ الصيغة الكيميائية
  للأحماض الأمينية (Lys, Asp, Ala)… » (Q2, Q3) manquaient.
- Notes de provenance : elles citaient « corrigé page N » alors que la consigne
  a été relue sur le **scan** ; chaque note porte désormais la page relue.
- **2018-m** : deux réponses modèle ont été réécrites pendant la relecture pour
  ne rien inventer — (1) la الوثيقة (4) compte les **خلايا بلازمية** (et non des
  بلاعم) ; (2) le tableau du الشكل (أ) n'étant pas lisible cellule par cellule,
  la réponse décrit la méthode (lecture par ثلاثيات + جدول الشفرة المرفق) au
  lieu de recopier une séquence de رامزات déduite sans preuve.
- **2018-m S1-E1-Q4** et **S1-E2-W** : le pôle W de ت1 est signalé `reconstructed`
  (simple clôture) ; les huit consignes du sujet 2 sont toutes imprimées dans le
  sujet, donc `official`.

## Passe 2018-m (2026-09-13)

```bash
node scripts/render-pdf-pages.mjs subjects/M/2018/sujet-1.pdf 1,2,3
node scripts/render-pdf-pages.mjs subjects/M/2018/sujet-2.pdf 1,2,3
node scripts/report-subject-inventory.mjs 2018-m
node scripts/generate-official-inventories.mjs && npm run inventory:check
npm run calibration:update && npm run pwa:version && npm test
```

Format retrouvé sur l'image : **2 sujets × 2 exercices (7 + 13 / 6 + 14)**,
durée imprimée 02 سا و30 د. Le corrigé 2018 n'est pas dans le dépôt : les
réponses modèle sont rédigées depuis les figures, les données du sujet et le
programme, sans jamais se réclamer d'un corrigé officiel.

Bilan maths 2018–2026 : **102 tâches officielles sur 144** (la relecture 2018
ajoute 15 consignes officielles sur 16 ; la session 2020 avait ajouté 10 consignes
officielles : les questions de cadrage « صُغ المشكل العلمي » et « أبرز المشكلة
المطروحة » existent réellement dans le sujet).

## Reste à faire (assumé)

1. **Neuf consignes encore notées « non mappée »** dans les notes de payload :
   - 2021-m : حدد النمط الوراثي لولدين ; اشرح آلية التأثير على التكاثر ;
     قدم نصيحة حول الاستعمال المفرط ; حدد مراحل تدخل واكتب معادلة ثنائي
     الببتيد ; فسّر الشكل (ب) وناقش الفرضية وبيّن خطورة انخفاض pH ;
   - 2022-m : المعادلة الكيميائية وحساب الوزن الجزيئي ; رتّب المراحل أ ب ج ;
   - 2026-m : برّر تثبيط PCSK9 ; قدّم نصيحة.
2. **2022-m S2-E1-Q2** : recouvrement 0 % lors de la vérification automatique
   (`probe-verify`) — à relire sur l'image avant de la déclarer officielle.
3. **Années maths 2013–2017** : les PDF sont présents
   (`subjects/M/2013…2017`, listés dans `subjects/manifest.json`) mais aucune
   donnée n'existe encore dans `data/years/m/` → ces années restent en
   consultation externe, sans mode BAC. **2020, 2019 et 2018 sont désormais
   encodées** (`data/years/m/year-2020.js`, `year-2019.js`, `year-2018.js`).
   Encoder 2017 puis 2016… demande la même relecture page à page et ne doit pas
   être fait à l'aveugle. Deux scans ont une police incomplète : 2019 (quelques
   séries de mots non dessinées) et 2018 (le nom du virus dans « فيروس الـ ( ) »
   n'est pas dessiné). Ils sont signalés dans `bacPromptNotes` et jamais
   complétés au hasard (la couche texte, lue par `scripts/dump-pdf-text.mjs`,
   tranche les cas lisibles par fragments).
4. Corrections officielles maths restant à relire :
   `M/dzexams-bac-sciences-1967487.pdf` (2018), `-2280992.pdf` (2019),
   `-2068087.pdf` (2021), `-1777391.pdf` (2022). Celle de **2020**
   (`-2273619.pdf`, pp. 6–10) a été relue le 2026-09-13 : c'est elle qui
   fonde les réponses modèle de `year-2020.js`.

## Vérifications

```bash
node scripts/render-pdf-pages.mjs subjects/M/2024/sujet-1.pdf 1
node scripts/report-subject-inventory.mjs 2024-m
node scripts/generate-official-inventories.mjs && npm run inventory:check
npm run pwa:version && npm test
```
