# Checklist de relecture — BAC maths (شعبة رياضيات)

**Date :** 2026-09-15 (dernières passes : 2015-m, 2016-m, 2021-m, 2022-m, 2026-m, puis
2023-m, 2024-m et 2025-m revérifiés sur les scans locaux). Branche
`arena/01a09be6-rebrique-sujet-bac` (PR #26).

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

| Sujet                       | Page                   | Contenu                                                                         | Décision                                                                                                                                                                                                                                 |
| --------------------------- | ---------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2023-m S1 (scan `-1077342`) | 1                      | ت1 (8ن) الإيثانول / بنية البروتين                                               | S = Q1+Q2 mot à mot, E = Q3 (نص علمي)                                                                                                                                                                                                    |
| 2023-m S1                   | 2                      | ت2 (12ن) القصور المناعي / PRF1, الجزء الأول                                     | N = consigne officielle mot à mot                                                                                                                                                                                                        |
| 2023-m S1                   | 3                      | ت2, الجزء الثاني + الثالث                                                       | E et W alignés sur le scan                                                                                                                                                                                                               |
| 2023-m S1                   | 4                      | S2 ت1 : التعاون الخلوي                                                          | S, E confirmés                                                                                                                                                                                                                           |
| 2023-m S2                   | 5                      | ت2 (13ن) Halofuginone / ملاريا, الجزء الأول                                     | N confirmé                                                                                                                                                                                                                               |
| 2023-m S2                   | 6                      | ت2, الجزء الثاني + الثالث                                                       | E = Q1+Q2 (نصيحة), W confirmé                                                                                                                                                                                                            |
| 2024-m S1                   | 1                      | ت1 (7ن) الكورديسبين                                                             | S = Q1+Q2, E = Q3                                                                                                                                                                                                                        |
| 2024-m S2                   | 1 (page 4 du scan)     | ت1 (7ن) PID / الرد الخلطي                                                       | S = Q1+Q2 (جدول المنشأ), E = Q3                                                                                                                                                                                                          |
| 2025-m S1                   | 1                      | ت1 (8ن) Q/D / الريبوزوم                                                         | S = Q1+Q2+Q3, E = Q4                                                                                                                                                                                                                     |
| 2020-m S1 (scan `-2273619`) | 1                      | ت1 (8ن) بنية البروتين / هجرة كهربائية                                           | S = Q1+Q2+Q3, E = Q4 ; N/W reconstruits                                                                                                                                                                                                  |
| 2020-m S1                   | 2-3                    | ت2 (12ن) Ras / p53 / سرطان الجلد                                                | N = « صُغ المشكل العلمي », S = فرضية+بيّن+ترجم, E = اشرح+نص علمي                                                                                                                                                                         |
| 2020-m S2                   | 4                      | ت1 (8ن) جزيئات HLA                                                              | S = Q1+Q2+Q3, E = Q4 ; N/W reconstruits                                                                                                                                                                                                  |
| 2020-m S2                   | 5                      | ت2 (12ن) الأنيميا المنجلية HbS                                                  | N = « أبرز المشكلة المطروحة », S = فرضية+قارن, E = تحقق+نص علمي                                                                                                                                                                          |
| 2020-m corrigé              | 6-10                   | corrigé officiel complet                                                        | réponses modèle rédigées depuis l'image (رابطة شاردية، (س)=R2…، T→A position 20)                                                                                                                                                         |
| 2017-m S1                   | 1, 2                   | ت1 (6ن) المعقد المناعي ; ت2 (14ن) النسخ والترجمة                                | quatre consignes mot à mot par exercice ; réponses modèle = corrigé officiel (`-2275712` pp. 5-7)                                                                                                                                        |
| 2017-m S2                   | 3, 4                   | ت1 (6ن) الأحماض الأمينية ; ت2 (14ن) الجزيئات الدفاعية                           | huit consignes mot à mot ; réponses modèle = corrigé officiel (pp. 7-9)                                                                                                                                                                  |
| 2019-m corrigé              | 6-10                   | corrigé officiel complet des deux sujets                                        | réponses modèle réécrites : (1) β / (2) α / (3) انعطاف et 257 غ/مول ; (س)=LT4، (ع)=LT8، (ص)=LB، (ل)=بالعة ; الغرفة (3) بلا استجابة ; n = 3، UUU/AAA/CCC، 4 أحماض، UCC/CUC/ACA/CAC، رامزات التوقف                                         |
| 2018-m S1                   | 1, 2, 3                | ت1 (7ن) المورثة والبروتين ; ت2 (13ن) العجز المناعي                              | Q1–Q4 mot à mot (بيانات+الظاهرتان، مرحلتا (ص)، هجرة كهربائية، نص علمي) ; W reconstruit ; ت2 : كل السلم mot à mot (منحنى، مقارنة، (a)/(b) وCMH II، تحليل الوثيقة 4، نص علمي)                                                              |
| 2018-m S2                   | 4, 5, 6                | ت1 (6ن) اللقاح والجسم المضاد ; ت2 (14ن) مورثة الريبونوكلياز                     | huit consignes mot à mot (تعرّف/مثّل، الظاهرة، الاستجابة الثانوية، نص علمي، البيانات 1–3، جدول الشفرة، متتالية الأحماض، سبب RNas غير عادي)                                                                                               |
| 2019-m S1                   | 1                      | ت1 (6ن) بنية البروتين / الرابطة الببتيدية                                       | Q1–Q4 mot à mot (بيانات، صيغة + كتلة مولية، تعليل، نص علمي)                                                                                                                                                                              |
| 2019-m S1                   | 2, 3                   | ت2 (14ن) الخلايا المناعية / الغرفتان                                            | N, S, E mot à mot ; W reconstruit                                                                                                                                                                                                        |
| 2019-m S2                   | 4, 5                   | ت1 (6ن) البالعة ; ت2 (14ن) الشفرة الوراثية                                      | consignes mot à mot                                                                                                                                                                                                                      |
| 2015-m S1                   | 1, 2                   | ت1 (10ن) الهجرة الكهربائية والببتيد 503 ; ت2 (10ن) الزمر الدموية                | consignes mot à mot (تحليل النتائج، الفرضية، II-1/II-2، الاختباران، الرسم، المقارنة، المخطط) ; les deux pôles N reconstruits et le W de ت2 reconstruit                                                                                   |
| 2015-m S2                   | 3, 4                   | ت1 (10ن) البروتين amphotère والبنية الثالثية ; ت2 (10ن) فيروس الالتهاب الكبدي B | consignes mot à mot (المنحنى، pHi، II-1/II-2/II-3، وصف البنية، فسّر، الرسم، المراحل، استخرج) ; les deux pôles N reconstruits                                                                                                             |
| 2015-m corrigé              | 5-10                   | corrigé officiel « الإجابة النموذجية وسلم التنقيط » des deux sujets             | réponses modèle réécrites : 503 = (133+174+117+133) − 3×18 ; pHi = 4.5 ; قوس ترسيب Hbs/Hbe ; 90 % في الوسط 4 ; O+ / AB− / B+ / A+ ; N أسيتيل غلوكوزامين و الغالاكتوز                                                                     |
| 2016-m S1                   | 1, 2                   | ت1 (10ن) تركيب البروتين ; ت2 (10ن) البالعة والأجسام المضادة                     | consignes mot à mot (Q1/Q2، الجدول، الوثيقة 2) ; les deux pôles N reconstruits                                                                                                                                                           |
| 2016-m S2                   | 3, 4                   | ت1 (10ن) من الـ ADN إلى البروتين ; ت2 (10ن) الغشاء وCMH                         | consignes mot à mot (Anagène، الترجمة والحساب، الفلورة، CMH والنمط الوراثي) ; les deux pôles N reconstruits                                                                                                                              |
| 2016-m corrigé              | 5-11                   | corrigé officiel « عناصر الإجابة » des deux sujets                              | réponses modèle réécrites : 429 = 3 × 143 و141 = 1 − 142 ; 16.66 % = 1 × 100 ÷ 6 (الأليل C3 متماثل) ; الجزء الثابت والمتغير للجسم المضاد ; فسيفسائي ومائع ; نظام CMH ونظام ABO والريزوس                                                  |
| 2021-m S1                   | 1, 2, 3                | ت1 (8ن) CMH / زرع الكلية ; ت2 (12ن) الماكروليد (Mex.R)                          | S1 : S = Q1+Q2 (النمط الوراثي لولدين rattachée), E = Q3 ; S2 : N = question du préambule, S = Q1, E = Q2أ+Q2ب puis Q1 du الجزء الثاني, W = نصيحة + نص علمي du الجزء الثالث                                                               |
| 2021-m S2                   | 4, 5, 6                | ت1 (8ن) النسخ والترجمة ; ت2 (12ن) الهيموغلوبين R/T                              | S2-E1 : S = Q1+Q2, E = Q3+Q4 ; S2-E2 : N = Q2, S = Q1, E = Q1+Q2أ+Q2ب+Q3 (الفرضية والخطورة rattachées), W = Q3 du الجزء الثالث                                                                                                           |
| 2022-m S1                   | 1, 2, 3                | ت1 (8ن) دور الريبوزوم ; ت2 (12ن) اختبار RADT Cov19                              | S1 : S = Q1, E = Q2+Q4, W = Q3 ; S2 : N = فرضيتان, E = Q du الجزء الثاني (الشكل (ج) et les trois sites), W = Q du الجزء الثالث (وضّح)                                                                                                    |
| 2022-m S2                   | 4, 5, 6                | ت1 (8ن) البنية الفراغية للجسم المضاد ; ت2 (12ن) الهيبسيدين                      | S2-E1 : S = Q1+Q2 (رتب المراحل rattachée), E = Q3 ; S2-E2 : N = Q1, S = exploitation du tableau 1, E = Q du الجزء الثاني, W = Q du الجزء الثالث                                                                                          |
| 2022-m corrigé              | 7-13                   | corrigé officiel « الإجابة النموذجية » des deux sujets                          | réponses modèle réécrites : 0→40 د n'existe pas ici ; R/T absent ; points clés = (س) ثانوي، ج←أ←ب، 10-30 غ، الثلاثية 33 G→A, sites S/T/C, وضّح chez 2022-m S1-E2/W                                                                       |
| 2026-m S1                   | 1, 2, 3 (scan local)   | ت1 (6ن) LTc ; ت2 (14ن) HCF/LDLR/PCSK9                                           | S1-E1 : S = Q1, E = Q2 (mention « مُهيكل بمقدمة وعرض وخاتمة ») ; S1-E2 : N = فرضيتان, E = Q1+Q2 (برّر تثبيط PCSK9 rattachée), W = خلاصة du الجزء الثالث                                                                                  |
| 2026-m S2                   | 4, 5, 6 (scan local)   | ت1 (8ن) IL-2 ; ت2 (12ن) غيتلمان/SLC12A3                                         | S2-E1 : N = Q1, S = Q2, E = Q3, W = خاتمة ; S2-E2 : N = Q1, E = Q1+Q2 (قدّم نصيحة rattachée), W = مخطط وظيفي du الجزء الثالث                                                                                                             |
| 2021-m corrigé              | 7-12                   | corrigé officiel « الإجابة النموذجية » des deux sujets                          | réponses modèle réécrites : 0→40 د, 70 %/10 % ; Mex.R (الثلاثية 114 : TGC → TGA, رامزة توقف, 7 أحماض بديلة عن 9) ; R/T (روابط كارِهة للماء، تثبيت/تحرير O2) ; 7.4 → 7.3 ; رابطة شاردية His146–Asp94                                      |
| 2023-m (relu 2026-09-14)    | couche texte 1-3 + 4-6 | consignes et figures des deux sujets                                            | deux consignes corrigées (Asp/Tyr imprimés ; fin de بيّن في نص علمي) ; valeurs des figures relues : courbe 0.6→10 et 10→80 %, barres ≈3500/≈250 جزيئة, triplets AGT GTC ATA GTG / AGT ATC ATA GTG, UCA→Ser…UAG→توقف                      |
| 2024-m (relu 2026-09-14)    | 1, 2 (S1) + 1 (S2)     | ت1 الكورديسبين ; ت2 الورم ; ت1 PID                                              | Q2 de ت1 reçue sa réponse (complément AGACGUUG lu sur la figure) ; verbe تُبيّن restauré ; courbe du الوسط 1 (250→≈330→≈180) et du الوسط 2 (250→≈1180) ; corrigé : LT8 source des LTc ; consigne restituée avec الأولي et نص علمي مُهيكل |
| 2025-m (relu 2026-09-14)    | 2, 3 (S1) + 2 (S2)     | ت2 TAP ; ت2 UV-C/Spike                                                          | deux consignes de فرضيتين recopiées mot à mot ; tableau du الشكل (ب) : 10/35/50/70 % contre 3/5/8/9 % pour 0.1→2 µg/mL ; تتابع ...CTGACTGG... / ...CTGATGG... (حذف C) ; LT8                                                              |

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
- **2018-m** : réponses modèle **réécrites depuis le corrigé officiel** (le
  dossier local `M/dzexams-bac-sciences-1967487.pdf` porte l'« الإجابة
  النموذجية » pp. 7–12). Les hypothèses de la première passe étaient fausses :
  (س) = الاستنساخ (النواة) et (ص) = الترجمة (الهيولى) — et non « تضاعف ADN /
  تعبير مورثي » ; les stades des figures du ت2 sont **مرحلة النهاية / مرحلة
  الاستطالة** ; (a) = CD4 et (b) = TCR (et non CMH II) ; les phases de
  l'infection sont **الإصابة الأولية / الكمون / العجز المناعي** (seuil
  numérique : 200 خلية/مم³, fenêtre 9–12 شهرا) ; le tableau du الشكل (أ) donne
  **His–Phe–Asp–Pro–Ser–Val** et **His–Tyr–Asp–Pro–Ser–Val**, avec les
  séquences GTA AAA CTA GGA AGT CAG ATT / CAT TTT GAT CCT TCA GTC TAA ; la
  mutation est l'**استبدال النيكليوتيد A رقم 362 → T** (حمض أميني 120 :
  Phe → Tyr).
- **2018-m S1-E1-Q4** et **S1-E2-W** : le pôle W de ت1 est signalé `reconstructed`
  (simple clôture) ; les huit consignes du sujet 2 sont toutes imprimées dans le
  sujet, donc `official`.

## Passe 2022-m et 2026-m (2026-09-14)

Dossier dzexams local `M/dzexams-bac-sciences-1777391.pdf` (sujets pp. 1-6,
corrigé « الإجابة النموذجية » pp. 7-13), relu en image, et scans locaux
`subjects/M/2026/sujet-{1,2}.pdf` (3 pages chacun) relus en image, corrigé
eddirasa 2026 lu via l'extraction texte de la même URL.

```bash
node scripts/render-pdf-pages.mjs M/dzexams-bac-sciences-1777391.pdf 1,2,3,4,5,6 2
node scripts/render-pdf-pages.mjs M/dzexams-bac-sciences-1777391.pdf 7,8,9,10,11,12,13 2
node scripts/render-pdf-pages.mjs subjects/M/2026/sujet-1.pdf 1,2,3 2
node scripts/render-pdf-pages.mjs subjects/M/2026/sujet-2.pdf 1,2,3 2
```

**2022-m.** Les consignes venaient d'un OCR RTL mixte ; la relecture image les a
corrigées : `S1-E2/W` imprime « **وضّح** كيف تُساهم هذه الدراسة » (et non
« بيّن »), `S1-E2/N` imprime « توضّح » avec la référence « الوثيقة (1) ». Les
trois consignes « non mappée » sont rattachées : la معادلة chimique (Q2) dans
`S1-E1/E`, le ترتيب المراحل (Q2) dans `S2-E1/S`, et l'analyse chiffrée du
tableau 1 dans `S2-E2/S`. Trois réponses modèle étaient fausses :
`S2-E1/S` classait (س) comme niveau **primaire** alors que le corrigé écrit
« (س) مستوى بنائي **ثانوي** » et le ترتيب est **ج ← أ ← ب** ; `S2-E2/S` donnait
« من 11 إلى 13 غ » alors que le tableau du sujet **et** le corrigé donnent
**من 10 إلى 30 غ** ; `S2-E2/E` restait muet sur la position de la mutation, que
le corrigé situe au **الثلاثية 33** (استبدال G بـ A : GTC ← ATC →
سلسلة ببتيدية غير مكتملة). Le texte du `S2-E1/E` suit désormais mot pour mot
les éléments du corrigé (تنتقل… إلى الثانوي بتقالف… / تكسب… بنية ثالثية… ).

**2026-m.** Les deux consignes « non mappée » sont rattachées : « برّر أنّ
تثبيط بروتين PCSK9 يمكن أن يكون علاجا مناسبا للشخص المصاب بالنمط A دون
المصاب بالنمط B » dans `S1-E2/E`, et « قدّم نصيحة لتحسين الحالة الصحية
للمصابين بمتلازمة غيتلمان » dans `S2-E2/E`. Deux consignes ont été complétées
d'après le scan : la mention « النصّ العلمي: مُهيكل بمقدمة وعرض وخاتمة » fait
partie de la consigne imprimée, et `S2-E2/W` demande un **مخطط وظيفي**.
Réponses modèle complétées depuis le corrigé : `S1-E2/E` chiffre la mutation
(النمط B : الثلاثية 33 GTC ← ATC → LDLR غير مكتمل) et répond au برّر
(تثبيط PCSK9 يفيد النمط A لأن الإفراط في PCSK9 هو السبب، بينما النمط B خلله في
بنية LDLR) ; `S2-E2/E` détaille les trois figures (1.5 و.إ / 1 و.إ ; CUG ← CCG
Leu ← Pro ; تجاذب الجذور الكارهة للماء) et donne la نصيحة du corrigé (أغذية غنية
بالشوارد + أدوية تنشط إعادة الامتصاص).

## Passe 2023-m, 2024-m et 2025-m (2026-09-14)

Ces trois années avaient été encodées le 2026-08-31 depuis l'OCR eddirasa des
sujets. Leurs scans locaux (`subjects/M/2023…2025/sujet-{1,2}.pdf`) ont été
rouverts : ceux de 2023 portent une couche texte lisible, ceux de 2024 et 2025
sont image seul. Les corrigés eddirasa n'ont servi qu'à recouper la structure
(leurs chiffres sont inversés par l'OCR : ils ne sont jamais repris sans
l'image).

```bash
node scripts/dump-pdf-text.mjs subjects/M/2023/sujet-1.pdf 1 --lines   # pages 1 à 6
node scripts/render-pdf-pages.mjs subjects/M/2024/sujet-1.pdf 1,2 2
node scripts/render-pdf-pages.mjs subjects/M/2024/sujet-2.pdf 1 2
node scripts/render-pdf-pages.mjs subjects/M/2025/sujet-1.pdf 2,3 2
node scripts/render-pdf-pages.mjs subjects/M/2025/sujet-2.pdf 2,3 2
```

Ce qui a changé dans les données :

- **2023-m S1-E1** : l'énoncé imprime bien `(Asp و Tyr)` (la transcription
  laissait deux parenthèses vides, comme si l'élève devait les identifier).
- **2023-m S2-E1/E** : la fin de la consigne (الاستجابة المناعية النوعية مستغلا
  معارفك ومعطيات الوثيقة) manquait.
- **2023-m S1-E2** : chiffres relus sur les figures — courbe du milieu 1 de
  ~10 % à ~80 % quand celle du milieu 2 reste vers 20 %, barres du الشكل (أ)
  ≈3500 / ≈250 جزيئة (l'OCR donnait 3066 et 166), triplets
  `AGT GTC ATA GTG` / `AGT ATC ATA GTG` et table des codons du الشكل (ج).
- **2023-m S2-E2** : courbes relues (croissance à 100 % jusqu'à 1.5 و.ت puis
  quasi nulle dès 4 و.ت ; barres 100 / 60 / 40 / ~10 %) et نصيحة alignée sur
  le corrigé (الجرعات الضعيفة بلا مفعول والعالية تؤثر سلبا على العضوية).
- **2024-m S1-E1** : la question 2 (أكمل التتابع) n'avait aucune réponse
  modèle ; la figure donne la trame `G A C A T C T G C A A` + (س) C, l'ARNm
  déjà dessiné `C U G U` et la cordycépine en face du T → complément
  `A G A C G U U G` (ce que donne aussi le corrigé).
- **2024-m S1-E2** : le verbe officiel est `تُبيّن` (et non تفسر) ; la courbe
  donne 250 → ≈330 (اليوم 6) → ≈180 pour le الوسط 1 et 250 → ≈1180 pour le
  الوسط 2 (le corrigé arrondissait à 100 et 1250).
- **2024-m S2-E1** : la consigne officielle porte الأولي et la forme du
  نص علمي (مقدّمة، عرض وخاتمة) ; la réponse du corrigé attribue aux الخلايا
  LT8 le rôle de source des LTc (la transcription écrivait LTh/IL).
- **2025-m S1-E2** : les deux consignes de فرضيتين sont recopiées mot à mot ;
  le tableau du الشكل (ب) donne 10 / 35 / 50 / 70 % chez le sujet sain contre
  3 / 5 / 8 / 9 % chez le malade pour des concentrations de 0.1 à 2 µg/mL (et
  non un « 3 % » constant) ; le الشكل (ج) oppose `...CTGACTGG...` à
  `...CTGATGG...` (حذف نيكليوتيدة) et la cellule est LT8.
- **2025-m S2-E2** : consigne officielle de فرضيتين recopiée mot à mot (آلية
  تأثير شدة الأشعة UV-C على الفيروس).

Les réponses modèle restent verrouillées par `tests/maths-model-answers.test.mjs`
(la réponse modèle doit satisfaire sa propre règle de mots-clés).

## Passe 2015-m (2026-09-15)

Cinquième année encodée hors programme de rattrapage, et première dont le scan
est **image seul** : le dossier dzexams local
`M/dzexams-bac-sciences-2723927.pdf` (10 pages) porte le sujet (pp. 1-4) ET son
corrigé officiel « الإجابة النموذجية وسلم التنقيط » (pp. 5-10), mais
`scripts/dump-pdf-text.mjs` n'y trouve **1 fragment de texte par page** — aucune
couche texte ne peut donc servir de source, tout est recopié depuis l'image.

```bash
node scripts/render-pdf-pages.mjs M/dzexams-bac-sciences-2723927.pdf 1,2,3,4,5 2
node scripts/render-pdf-pages.mjs M/dzexams-bac-sciences-2723927.pdf 6,7,8,9,10 2
node scripts/report-subject-inventory.mjs 2015-m
```

Format retrouvé sur l'image : **2 sujets × 2 exercices (10 + 10)**, durée
imprimée 02 سا و30 د. Sujet 1 : البروتين (الهجرة الكهربائية لثلاث وحدات بنائية،
السلسلة الناسخة وجدول الشفرة، pHi والجذور) puis الزمر الدموية (اختبار المصل
وكريات الدم الحمراء، Ouchterlony). Sujet 2 : البروتين amphotère (منحنى
الرحلان، Rastop، الجلوتاميك 63 والأرجنين 87، سيستيين) puis التصدي لفيروس
الالتهاب الكبدي B (Ouchterlony، الثيمين المشع، LTc والبرفورين).

Onze consignes imprimées deviennent des tâches `official` ; les quatre étapes de
cadrage N restent reconstruites (aucune question de ce type n'est imprimée) et
le disent dans leur note, comme le pôle W de 2015-m S1-E2 (l'exercice n'a pas de
جزء ثالث imprimé).

Valeurs reprises du corrigé : `503 = (133 + 174 + 117 + 133) − 3 (18) = 557 − 54`
(où `3 (18)` est le nombre de molécules d'eau retirées pour former le
tétrapeptide) ; `pHi = 4.5` et la relation inverse entre pH et distance de
migration ; `AUG-GAC-GUC-AGA-GAU-UAA` → `Asp-Val-Arg-Asp` ; l'aspartate migre
vers le pôle positif et l'arginine vers le pôle négatif ; la liaison ionique
`COO− … NH3+` entre le glutamate 63 (`pHi = 3.08`) et l'arginine 87
(`pHi = 10.7`) ; la source du soufre est le cystéine (Cys) ; les zones de la
famille sont **الأب O+ ، الأم AB− ، البنت B+ ، الابن A+** ; `1 %` dans les milieux
1-3 et `90 %` dans le milieu 4 avec la double reconnaissance LTc/CMH I.

Le catalogue maths ouvre donc en **2015** (12 cartes-épreuve 2015-m … 2026-m,
3 cartes de consultation pour 2013-2014 + la session exceptionnelle 2017) et
`tests/maths-2015.test.mjs` verrouille la session (barème, inventaire mappé,
liste des 11 pôles officiels, valeurs du corrigé, badge ⚠️).

## Passe 2016-m (2026-09-14)

Première année encodée hors du programme de rattrapage initial : son dossier
dzexams local `M/dzexams-bac-sciences-1413929.pdf` porte le sujet (pp. 1-4) ET le
corrigé officiel « عناصر الإجابة » (pp. 5-11). Les onze pages ont été relues en
image ; la couche texte du fichier est accentuée à l'envers (`عمى` pour `على`,
`خمية` pour `خلية`) et n'a servi qu'à recouper.

```bash
node scripts/render-pdf-pages.mjs M/dzexams-bac-sciences-1413929.pdf 1,2,3,4 2
node scripts/render-pdf-pages.mjs M/dzexams-bac-sciences-1413929.pdf 5,6,7,8,9,10,11 2
node scripts/report-subject-inventory.mjs 2016-m
```

Format retrouvé sur l'image : **2 sujets × 2 exercices (10 + 10)**, durée
imprimée 02 سا و30 د. Sujet 1 : تركيب البروتين (نسخ وترجمة) puis البالعة وتطور
الأجسام المضادة. Sujet 2 : من الـ ADN إلى البروتين (Anagène، الهيموغلوبين) puis
الغشاء الهيولي ونظام CMH. Douze consignes imprimées deviennent des tâches
`official` ; les quatre étapes de cadrage N restent reconstruites (aucune
question de ce type n'est imprimée) et le disent dans leur note.

Valeurs reprises du corrigé : `429 = 3 × 143` niqueotides et `141 = 1 − 142`
acides aminés (2016-m S2-E1) ; الموقع التحفيزي A فارغ مقابل رامزة التوقف UAG ;
`16.66 % = 1 × 100 ÷ 6` avec l'allèle C3 identique chez les deux parents
(2016-m S2-E2) ; الجزء الثابت والمتغير du corps anticorps ; الغشاء الهيولي
فسيفسائي ومائع ; النمط الوراثي المحتمل A2 C5 B12 / A17 C6 B34.

## Passe 2021-m (2026-09-14)

Le dossier dzexams local `M/dzexams-bac-sciences-2068087.pdf` réunit les sujets
(pp. 1-6) et le corrigé officiel « الإجابة النموذجية » (pp. 7-12) ; les douze
pages ont été relues en image.

```bash
node scripts/render-pdf-pages.mjs M/dzexams-bac-sciences-2068087.pdf 1,2,3,4,5,6 2
node scripts/render-pdf-pages.mjs M/dzexams-bac-sciences-2068087.pdf 7,8,9,10,11,12 2
node scripts/report-subject-inventory.mjs 2021-m
```

Consignes : deux verbes du sujet avaient été mal reconstitués depuis la couche
texte inversée — le scan imprime « بيّن في نص علمي دقيق » (2021-m S1-E2/W, la
version précédente portait « أنشئ »), « فسّر كيف اكتسبت إحدى السلالتين »
(S1-E2/E, et non « تكتسب ») et « مبرزا تأثر هذه العلاقة بعوامل الوسط »
(S2-E2/W, et non « وأثر هذه العلاقة »). Cinq consignes imprimées n'étaient
rattachées à aucun pôle : النمط الوراثي لولدين (S1-E1/S), اشرح آلية تأثير
المضاد الحيوي + اقترح فرضية (S1-E2/E), قدم نصيحة حول الاستعمال المفرط
(S1-E2/W), حدد في أيّ مرحلة يتدخل العنصران + اكتب معادلة تشكُّل ثنائي الببتيد
(S2-E1/S et /E), فسّر الشكل (ب) + ناقش صحة الفرضية + بَيِّن خطورة انخفاض
الـ pH (S2-E2/E). Les lettres R et T de l'exercice 2 (sujet 2) et les valeurs
7.4 / 7.3 sont dans la couche texte du sujet mais ne sont pas dessinées : elles
sont restituées et signalées dans les notes.

Réponses modèle : deux valeurs de 2021-m S1-E2/S étaient fausses — 0→10 د et
50 %/5 % au lieu de **0→40 د** et **70 % / 10 %** du corrigé — et la règle
associée (اتجاهات 50/5, `strictValues`) a suivi. Les réponses de S1-E2/E
(الموقع A، الرابطة الببتيدية، Mex.R, الثلاثية 114 : TGC → TGA = رامزة توقف,
7 أحماض أمينية بدل 9) et de S2-E2/E (رابطة شاردية His146–Asp94، 2 Å et 8 Å,
7.4 → 7.3، خطورة الـ CO) sont désormais celles du corrigé.

## Passe 2018-m (2026-09-13)

```bash
node scripts/render-pdf-pages.mjs subjects/M/2018/sujet-1.pdf 1,2,3
node scripts/render-pdf-pages.mjs subjects/M/2018/sujet-2.pdf 1,2,3
node scripts/report-subject-inventory.mjs 2018-m
node scripts/generate-official-inventories.mjs && npm run inventory:check
npm run calibration:update && npm run pwa:version && npm test
```

Format retrouvé sur l'image : **2 sujets × 2 exercices (7 + 13 / 6 + 14)**,
durée imprimée 02 سا و30 د. Le corrigé 2018 est dans le dépôt, dans le même
dossier dzexams que le sujet (`M/dzexams-bac-sciences-1967487.pdf`,
« الإجابة النموذجية » pp. 7–12) : les réponses modèle ont été réécrites depuis
ces pages (commit `d4d286e`) et non depuis le programme.

La passe 2021-m du 2026-09-14 ne change pas le total officiel (12/16) :
cinq consignes imprimées dans le sujet et qui n'étaient mappées nulle part sont
désormais recopiées dans un pôle déjà officiel (aucune consigne n'est inventée),
et sept libellés paraphrasés depuis la couche texte inversée sont recopiés mot à
mot. Le pôle N de 2021-m S1-E2 accueille la question du préambule (page 2),
recopiée mot à mot : la note du pôle dit qu'elle n'est pas numérotée.

Bilan maths 2015–2026 : **141 tâches officielles sur 192** (l'encodage 2015
ajoute 11 consignes officielles sur 16 ; l'encodage 2016
ajoute 12 consignes officielles sur 16, format 10+10 par sujet ; la relecture 2018
ajoute 15 consignes officielles sur 16 ; la session 2020 avait ajouté 10 consignes
officielles : les questions de cadrage « صُغ المشكل العلمي » et « أبرز المشكلة
المطروحة » existent réellement dans le sujet ; 2017 est intégralement officielle,
corrigé local à l'appui).

## Reste à faire (assumé)

1. **Plus aucune consigne « non mappée »** dans les notes de payload : les
   neuf consignes recensées le 2026-09-13 ont été rattachées — cinq pour 2021-m
   (النمط الوراثي لولدين → S1-E1/S ; اشرح آلية التأثير + اقترح فرضية →
   S1-E2/E ; قدم نصيحة → S1-E2/W ; مرحلة التدخل + المعادلة → S2-E1/S et /E ;
   فسّر الشكل (ب) + ناقش الفرضية + خطورة الـ pH → S2-E2/E), trois pour 2022-m
   (المعادلة الكيميائية → S1-E1/E ; رتّب المراحل → S2-E1/S ; analyse du
   tableau 1 → S2-E2/S) et deux pour 2026-m (برّر تثبيط PCSK9 → S1-E2/E ;
   قدّم نصيحة → S2-E2/E). La relecture montre aussi pourquoi elles n'avaient pas
   de pôle : ce sont des **questions d'un même exercice** que la carte BAC
   regroupe volontairement dans une seule étape.

2. **Recouvrement 2022-m S2-E1-Q2** : la question « رتّب المراحل » a été relue
   sur l'image (page 4) et son corrigé donne **ج ← أ ← ب** ; la réponse modèle et
   les mots-clés (`ثانوي`, `LB`) ont été alignés. Le 0 % du probe venait de la
   réponse précédente, qui classait (س) en « أولي ».
3. **Années maths 2013–2014** : les PDF sont présents
   (`subjects/M/2013…2014`, listés dans `subjects/manifest.json`) mais aucune
   donnée n'existe encore dans `data/years/m/` → ces années restent en
   consultation externe, sans mode BAC. **2020…2015 sont désormais encodées**
   (`year-2020.js` … `year-2015.js`). Encoder 2014 puis 2013 demande la même
   relecture page à page (scans image seul) et ne doit pas être fait à
   l'aveugle. Deux scans ont une police
   incomplète : 2019 (quelques séries de mots non dessinées) et 2018 (le nom du
   virus dans « فيروس الـ ( ) » n'est pas dessiné). Ils sont signalés dans
   `bacPromptNotes` et jamais complétés au hasard (la couche texte, lue par
   `scripts/dump-pdf-text.mjs`, tranche les cas lisibles par fragments).
4. Corrections officielles maths : **toutes les années encodées ont leur corrigé
   relu**. Le corrigé est dans le même dossier dzexams que le sujet : 2015
   (`-2723927.pdf`, « الإجابة النموذجية وسلم التنقيط » pp. 5–10, relu le
   2026-09-15, scan image seul), 2016
   (`-1413929.pdf`, عناصر الإجابة pp. 5–11, relu le 2026-09-14), 2017
   (`-2275712.pdf`, pp. 5–9), 2018 (`-1967487.pdf`, pp. 7–12), 2019
   (`-2280992.pdf`, pp. 6–10, relu le 2026-09-14), 2020
   (`-2273619.pdf`, pp. 6–10), 2021 (`-2068087.pdf`, pp. 7–12, relu le
   2026-09-14) et 2022 (`-1777391.pdf`, pp. 7–13, relu le 2026-09-14).
   2023, 2024, 2025 et 2026 disposent du corrigé eddirasa (2026 et 2023–2025
   revérifiés le 2026-09-14, chiffres relus sur les figures des scans locaux car
   l'OCR inverse les nombres). Les seules années sans corrigé localisé sont
   **2013 et 2014**, dont les scans sont image seul : c'est le chantier
   d'encodage restant (cf. point 3).
5. Cohérence mots-clés / réponses modèle : **traité le 2026-09-14**, étendu le
   2026-09-15 aux 16 pôles de 2015-m. Sonde
   `evaluateText(réponse modèle, règle)` sur les 176 pôles maths :
   `hits >= req` partout (0 échec). Quatre règles ne pouvaient pas être
   satisfaites par la réponse modèle officielle et ont été ajustées
   (2017-m S2E2W, 2018-m S2E2E, 2018-m S2E2W, 2020-m S1E1W) ; deux réponses
   modèle de 2018-m ont gagné les termes exacts du corrigé (الرامزة، المورثة،
   ARNm). Le contrôle est verrouillé par `tests/maths-model-answers.test.mjs`.

## Vérifications

```bash
node scripts/render-pdf-pages.mjs subjects/M/2024/sujet-1.pdf 1
node scripts/report-subject-inventory.mjs 2024-m
node scripts/generate-official-inventories.mjs && npm run inventory:check
npm run pwa:version && npm test
```
