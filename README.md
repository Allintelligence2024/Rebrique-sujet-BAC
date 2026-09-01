# 🧭 بوصلة كنز المنهجية 4D — المنصة التفاعلية لبكالوريا الجزائر

**مادة علوم الطبيعة والحياة** — أداة تتحقق من تغطية الإجابة للعناصر العلمية والمنهجية المنتظرة وفق نظام «الأقطاب 4D»
(N = تأطير المسألة، S = استغلال السندات، E = الربط والتفسير، W = التركيب والمصادقة). Elle ne prétend pas corriger une copie à la place d'un professeur.

> ⚠️ **Positionnement honnête : outil d'entraînement méthodologique non calibré.** Les scores sont des estimations automatiques fondées sur des règles ; ils ne sont ni une correction ministérielle ni une note attribuée par un professeur. Les consignes marquées `reconstructed` ne sont pas des énoncés officiels. Le benchmark vérifié contient actuellement **0 copie réelle doublement annotée** : aucune métrique de fiabilité ne peut donc être publiée.

> ✅ **Version intégrée à la racine.** L'ancien site monolithique est conservé dans
> [`_v1_backup/`](_v1_backup) au cas où.

---

## ✨ Ce que propose l'application

Parcours en 5 étapes pensé pour la **gestion du stress** et la **méthode** :

1. **Hub** — choix entre accès rapide à un exercice et parcours guidé.
2. **Sérénité** _(parcours guidé uniquement)_ — respiration + micro-conseils méthodologiques.
3. **Stratégie** _(optionnelle)_ — consultation des PDF et calculatrice de choix (25 min).
4. **Choix d'exercice** — sujet et exercice à travailler (accès rapide : les deux depuis le hub ; parcours guidé : sujet fixé à l'étape Stratégie, puis exercice).
5. **Espace de travail 4D** — consigne et réponse prioritaires, diagnostic de couverture, aide contextuelle et indicateur chiffré secondaire.

L'interface propose des thèmes clair et sombre persistants. Les outils secondaires sont regroupés afin de ne pas concurrencer la consigne.

---

## 🗂️ Architecture (modulaire & data-driven)

```
.
├── index.html                        # squelette des 5 écrans (remplis par js/)
├── assets/
│   ├── styles.css                    # design 100% autonome (aucun CDN)
│   └── icon-192.png / icon-512.png   # icônes de marque (boussole 4D)
├── data/
│   ├── subjects.js                   # ⭐ CONFIG : 2020+2022–2026 SE + 2021–2026 Maths (4D)
│   ├── year-2026-se.js               # BAC 2026 علوم تجريبية (énoncé + corrigé eddirasa)
│   ├── year-2020-se.js               # BAC 2020 علوم تجريبية (énoncé + corrigé eddirasa)
│   ├── year-2021-m.js                # BAC 2021 رياضيات (énoncé + corrigé dzexams)
│   ├── year-2022-m.js … year-2026-m.js  # BAC 2022–2026 رياضيات (énoncé + corrigé eddirasa)
│   ├── archive.js                    # consultation (hors cartes 4D affichées)
│   └── brouillon.js                  # canevas du brouillon méthodologique et verbes BAC
├── js/
│   ├── main.js                       # point d'entrée
│   ├── ui.js                         # façade d'orchestration (taille mesurée dans le bloc « Tests »)
│   ├── engine.js                     # façade du moteur heuristique + minuteurs
│   ├── store.js                      # état + persistance localStorage + timers reconciliés
│   ├── app-version.js                # version PWA (générée par scripts/generate-pwa-version.mjs)
│   ├── method-scripts.js             # scripts de méthode (conseils contextuels)
│   ├── application/timers.js         # minuteurs globaux et stratégie
│   ├── domain/evaluation/            # règles d'analyse et d'évaluation (5 modules)
│   ├── services/                     # son, reconnaissance vocale et diagnostics récupérables
│   └── ui/
│       ├── dom.js · dialogs.js · navigation.js · accessibility.js  # infrastructure UI partagée
│       ├── atlas.js · demo-diagnostic.js                           # atlas des techniques + démo avant/après
│       ├── screens/            # hub, guide (sérénité), strategy (PDF + calculatrice), onboarding (choix d'exercice), workspace
│       ├── workspace/          # texte, pipeline, brouillon, feedback, rapport
│       └── reports/            # calcul du rapport, exports CSV/JSON et impression
├── tests/                            # tests automatisés (moteur, données, UI, sécurité) — `npm test`
│   ├── *.test.mjs                    # 19 fichiers, exécutés par `node --test` (compte dans le bloc « Tests »)
│   ├── e2e/                          # Playwright (mode hors-ligne PWA) — `npm run test:e2e`
│   └── hard-benchmark/               # pipeline de copies réelles (corpus : 0 copie)
├── scripts/
│   ├── generate-pwa-version.mjs      # génère js/app-version.js (appelé par `npm run build`)
│   └── update-doc-metrics.mjs        # régénère / vérifie les métriques du README
├── docs/                             # protocoles (accessibilité, handoff)
├── server.mjs                        # serveur statique avec CSP — `npm start`
├── playwright.config.mjs             # config e2e (lance server.mjs sur 127.0.0.1:4173)
├── tsconfig.services.json            # typecheck des services — `npm run typecheck`
├── build.mjs                         # fabrique dist/boussole-4d-standalone.html
├── sw.js                             # service worker (mode hors-ligne)
├── manifest.webmanifest              # PWA (installable)
├── BAC2025_SVT_Sujet1.pdf / BAC2025_SVT_Sujet2.pdf  # seuls PDF versés dans le dépôt (scans 2025)
├── _v1_backup/                       # ancien site monolithique conservé
├── dist/                             # généré par `npm run build` (ignoré par git)
│   └── boussole-4d-standalone.html   # version monofichier (ouvre en file://)
└── package.json                      # npm start / npm test / npm run build
```

---

## 🌐 Lancer l'application

```bash
python3 -m http.server 8080     # ou : npm start
# ouvrir http://localhost:8080
```

> ⚠️ Ouvrir `index.html` via `file://` peut bloquer les modules ES6.
> Pour un fichier 100 % autonome, ouvrir directement
> `dist/boussole-4d-standalone.html` (aucune dépendance, aucun serveur).

---

## 📄 Contenu réel — entraînement 4D

**12 années** dans `APP_CONFIG.years` : 2020 et 2022–2026 علوم تجريبية + 2021–2026 رياضيات.
Le hub SE affiche 2020 et 2022–2026 en 4D ; le hub Maths affiche 2021–2026 en 4D.

### Contenu BAC 2025 (شعبة علوم تجريبية)

Le contenu a été reconstitué à partir du sujet officiel **et de son corrigé modèle**
(« الإجابة النموذجية ») :

| Sujet | Exercice | Thème                                                                         |
| ----- | -------- | ----------------------------------------------------------------------------- |
| **1** | ت1 (5ن)  | دور الـ **ARN** في **تركيب البروتين** + تأثير مادة تُفكّك الرابطة أدنين–ريبوز |
| **1** | ت2 (7ن)  | **الطحالب الخضراء**، بنية الصانعات، استغلال **CO₂** وأنزيم **RUBISCO**        |
| **1** | ت3 (8ن)  | **الأدينوزين، الكافيين والنشاط العصبي** (المخطط التحصيلي ذو المسارين)         |
| **2** | ت1 (5ن)  | **التحلل السكري** وتحويل طاقة الجلوكوز (ATP) + أثر دواء                       |
| **2** | ت2 (7ن)  | أنزيم **SOD** و**التصلب الجانبي الضموري (ALS)**                               |
| **2** | ت3 (8ن)  | **زمر الدم ABO** و**التسامح المناعي** (نقل بين الزمرتين A / O)                |

> ⚠️ Les PDF 2025 du dépôt sont **scannés**. Les `bacPrompt` marqués `official`
> ont été relus visuellement page par page (2026-08-23). Le reste reste `reconstructed`.

### Contenu BAC 2024 (شعبة علوم تجريبية)

Pages 2, 6, 7 et 10 relues sur photos du sujet officiel (2026-08-31) :
pôles concernés en `official`. Le reste (pages 1, 3–5, 8–9 et cadrages N/W)
reste `reconstructed` :

| Sujet | Exercice | Thème                                                                |
| ----- | -------- | -------------------------------------------------------------------- |
| **1** | ت1 (5ن)  | **فيروس VIH** والخلايا **LT4** + دواء **Zalcitabine**                |
| **1** | ت2 (7ن)  | **الصرع** وتوازن التنبيه/التثبيط (**Glutamate / GABA**, الجين Scn1a) |
| **1** | ت3 (8ن)  | بروتين **P53** والبنزوبيرين وسرطان الرئة                             |
| **2** | ت1 (5ن)  | **الترجمة** وتأثير **Tetracycline / Oxazolidinone**                  |
| **2** | ت2 (7ن)  | **RUBISCO** وتثبيت **CO₂** عند الفاصولياء (CA1P)                     |
| **2** | ت3 (8ن)  | **المناعة** ضد الدفتيريا والمكورات العنقودية (بروتين SPA)            |

### Contenu BAC 2023 (شعبة علوم تجريبية)

Consignes relues sur la couche texte du PDF dzexams (inversée, reconstituée mot à mot) :

| Sujet | Exercice | Thème                                                                     |
| ----- | -------- | ------------------------------------------------------------------------- |
| **1** | ت1 (5ن)  | **البروتينات الغشائية في المشبك** وذيفان **الكزاز** (Clostridium tetani)  |
| **1** | ت2 (7ن)  | دواء **ML901** وتثبيط **تركيب البروتين** لدى طفيلي **الملاريا**           |
| **1** | ت3 (8ن)  | **سرطان الثدي**، الأستراديول، أنزيم الأروماتاز ومادة **الكيرسيتين**       |
| **2** | ت1 (5ن)  | **البنية الفراغية للبروتين** (QCM) ودور **التتابع النوكليوتيدي** والطفرات |
| **2** | ت2 (7ن)  | الخلايا التائية السامة **LTc** وبروتين **البيرفورين**                     |
| **2** | ت3 (8ن)  | مبيد **DCMU** و**المرحلة الكيميائية الضوئية** (PSII)                      |

### Contenu BAC 2022 (شعبة علوم تجريبية)

Consignes relues sur la couche texte du PDF officiel ONEC (dzexams, inversée,
reconstituée mot à mot, 2026-08-27) ; corrigé officiel (الإجابة النموذجية) joint au
même PDF (pp. 11-21) et croisé avec une seconde source ([eddirasa](https://eddirasa.com/correction-bac-science-2022-se/))
— textes concordants :

| Sujet | Exercice | Thème                                                                       |
| ----- | -------- | --------------------------------------------------------------------------- |
| **1** | ت1 (5ن)  | **الغشاء الهیولي** : تحديد الذات والتعرف على اللادوات (CMH, ABO, BCR, TCR)  |
| **1** | ت2 (7ن)  | **مناطق التشابك** في النخاع الشوكي : **الغلوتامات** و**GABA** (الاسترخاء)   |
| **1** | ت3 (8ن)  | المضاد الحيوي **الجینتامسین** و**انحلال البشرة الفقاعية** (الترجمة)         |
| **2** | ت1 (5ن)  | **السّيانور** (منع ATP) و**كمون الراحة** للليف العصبي                       |
| **2** | ت2 (7ن)  | **α-amanitine** (ARN بوليميراز) ودواء **ATAC** ضد الأورام السرطانية         |
| **2** | ت3 (8ن)  | **غاز الميثان (CH₄)** في الأبقار والمكمل الغذائي **(3-NOP)** (أنزيم M/CoEM) |

Le **barème 4D** adapte les points officiels à la méthode (N/S/E/W), et l'évaluation
compare les réponses à des **mots-clés normalisés** (via `normalizeArabic`) + inter-dits
(ex. « بسبب » pénalisé à l'étape S) + longueur minimale.

### Provenance des consignes

| Année    | État        | PDF local                                          | Source externe                                                                                                                                                                                                                                                          | Consignes                                                                                                                                                                                                         |
| -------- | ----------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **2025** | activée     | `BAC2025_SVT_Sujet1.pdf`, `BAC2025_SVT_Sujet2.pdf` | —                                                                                                                                                                                                                                                                       | Pôles `official` relus sur le scan ; autres `reconstructed`                                                                                                                                                       |
| **2024** | activée     | aucun (droit d'auteur)                             | [eddirasa sujet](https://eddirasa.com/bac-science-2024-se/) · [PDF eddirasa](https://eddirasa.com/wp-content/uploads/2024/06/bac-sc-sciences-2024.pdf) · [dzexams](https://www.dzexams.com/ar/annales/bkVXVzlvRTlpV1RMYUk5cGNyS3oxdz09) · [PDF dzexams](https://www.dzexams.com/uploads/sujets/officiels/bac/2024/dzexams-bac-sciences-naturelles-1751784.pdf) | Mixte : 8 pôles `official` recopiés mot à mot sur photos des pages 2, 6, 7, 10 (2026-08-31) ; le reste `reconstructed`. Viewer dzexams bloqué dans la sandbox. Session de remplacement non localisée. |
| **2023** | **activée** | aucun (droit d'auteur)                             | [dzexams 2023](https://www.dzexams.com/ar/annales/STRDZEowcCtwN0JmT1NwS3p4cEVmdz09) · [PDF](https://www.dzexams.com/uploads/sujets/officiels/bac/2023/dzexams-bac-sciences-naturelles-1780707.pdf)                                                                      | Consignes `official` relues sur la couche texte du PDF (inversée, reconstituée mot à mot, 2026-08-25) ; pôles sans question autonome en `reconstructed`                                                           |
| **2022** | **activée** | aucun (droit d'auteur)                             | [dzexams 2022](https://www.dzexams.com/ar/annales/eVlXSFRFOEJaN2ozSlE3NytzWkRHQT09) · [PDF ONEC](https://www.dzexams.com/uploads/sujets/officiels/bac/2022/dzexams-bac-sciences-2311208.pdf) · [corrigé eddirasa](https://eddirasa.com/correction-bac-science-2022-se/) | Consignes `official` relues sur la couche texte du PDF ONEC (inversée, reconstituée mot à mot, 2026-08-27) ; corrigé officiel croisé sur 2 sources concordantes ; pôles sans question autonome en `reconstructed` |
| **2026 SE** | **activée** | aucun (droit d'auteur) | [énoncé eddirasa](https://eddirasa.com/uploads/2026/08/bac-science-2026-se.pdf) · [corrigé](https://eddirasa.com/uploads/2026/08/correction-bac-science-2026-se.pdf) | `official` / `reconstructed` depuis OCR du PDF officiel (2026-08-31) |
| **2020 SE** | **activée** | aucun (droit d'auteur) | [énoncé eddirasa](https://eddirasa.com/wp-content/uploads/2020/09/eddirasa.com-bac-se-science-2020.pdf) · [corrigé](https://eddirasa.com/wp-content/uploads/2020/09/eddirasa.com-correction-bac-sc-science-2020.pdf) | `official` / `reconstructed` depuis OCR RTL (2026-08-31) |
| **2021 Maths** | **activée** | aucun (droit d'auteur) | [dzexams 2021 m](https://www.dzexams.com/ar/annales/T2tYS3FTcFRwWCtCbXV2QmFyRTcydz09) | `official` / `reconstructed` depuis viewer 12 pages (couche inversée, 2026-08-31) |
| **2022 Maths** | **activée** | aucun (droit d'auteur) | [énoncé eddirasa](https://eddirasa.com/wp-content/uploads/2022/06/eddirasa.com-bac-math-science-2022.pdf) · [corrigé](https://eddirasa.com/wp-content/uploads/2022/06/eddirasa.com-correction-bac-math-science-2022.pdf) | `official` / `reconstructed` depuis OCR (2026-08-31) ; format 8+12 / 8+12 |
| **2023 Maths** | **activée** | aucun (droit d'auteur) | [énoncé eddirasa](https://eddirasa.com/wp-content/uploads/2023/07/eddirasa.com-bac-sciences-math-2023.pdf) · [corrigé](https://eddirasa.com/wp-content/uploads/2023/07/eddirasa.com-correction-bac-sciences-math-2023.pdf) | `official` / `reconstructed` depuis OCR (2026-08-31) ; format 8+12 / 7+13 |
| **2024 Maths** | **activée** | aucun (droit d'auteur) | [énoncé eddirasa](https://eddirasa.com/wp-content/uploads/2024/06/bac-math-sciences-2024.pdf) · [corrigé](https://eddirasa.com/wp-content/uploads/2024/05/correction-bac-math-sciences-2024.pdf) | `official` / `reconstructed` depuis OCR (2026-08-31) ; format 7+13 / 7+13 |
| **2025 Maths** | **activée** | aucun (droit d'auteur) | [énoncé eddirasa](https://eddirasa.com/wp-content/uploads/2025/06/bac-math-science-2025.pdf) · [corrigé](https://eddirasa.com/wp-content/uploads/2025/06/correction-bac-math-science-2025.pdf) | `official` / `reconstructed` depuis OCR (2026-08-31) ; format 8+12 / 8+12 |
| **2026 Maths** | **activée** | aucun (droit d'auteur) | [énoncé eddirasa](https://eddirasa.com/uploads/2026/08/bac-math-sciences-2026.pdf) · [corrigé](https://eddirasa.com/uploads/2026/08/correction-bac-math-sciences-2026.pdf) | `official` / `reconstructed` depuis OCR (2026-08-31) ; format 6+14 / 8+12 |

Aucun PDF 2020/2022/2023/2024/2026/2021 n'est versé dans le dépôt.

### Contenu BAC 2026 (شعبة علوم تجريبية)

Énoncé + corrigé officiels [eddirasa](https://eddirasa.com/uploads/2026/08/bac-science-2026-se.pdf)
· [corrigé](https://eddirasa.com/uploads/2026/08/correction-bac-science-2026-se.pdf)
(OCR, 2026-08-31). 2 sujets × 3 exercices (5+7+8). Fichier : `data/year-2026-se.js`.

| Sujet | Exercice | Thème |
| ----- | -------- | ----- |
| **1** | ت1 (5ن) | **الألبومين**، الجذور الهيدروكسيل (OH•) و**Edema** |
| **1** | ت2 (7ن) | **SIRT1 / P53A / NAD+** ومركب **RSV** |
| **1** | ت3 (8ن) | مبيد **Atrazine** ومقاومة الزنجبيل الأرقطي (GST) |
| **2** | ت1 (5ن) | غشاء **التيلاكوئيد** ومبيد **Oxyfluorfen** |
| **2** | ت2 (7ن) | **AVC** وقناة **ASIC1a** (PcTx1) |
| **2** | ت3 (8ن) | **ألزهايمر**، Anti-Aβ و**ATV-Aβ** (TfR) |

### Contenu BAC 2020 (شعبة علوم تجريبية)

Énoncé + corrigé officiels [eddirasa](https://eddirasa.com/wp-content/uploads/2020/09/eddirasa.com-bac-se-science-2020.pdf)
· [corrigé](https://eddirasa.com/wp-content/uploads/2020/09/eddirasa.com-correction-bac-sc-science-2020.pdf)
(OCR RTL, 2026-08-31). 2 sujets × 3 exercices (5+7+8). Fichier : `data/year-2020-se.js`.

| Sujet | Exercice | Thème |
| ----- | -------- | ----- |
| **1** | ت1 (5ن) | **البنية الداخلية للكرة الأرضية** (Moho / Gutenberg / Lehmann) |
| **1** | ت2 (7ن) | أنزيما **Cox-1 / Cox-2** ودواء **الإيبوبروفين** |
| **1** | ت3 (8ن) | بروتين **Her2** والعلاج بـ **التراستوزوماب** |
| **2** | ت1 (5ن) | انتقاء الببتيد المستضدي و**CMH** |
| **2** | ت2 (7ن) | مادة **الريسين** وتثبيط تركيب البروتين (ARNr 28s) |
| **2** | ت3 (8ن) | المشبك المثبط ونضج **GABA** (NKCC1 → KCC2) |

### Contenu BAC 2022–2026 (شعبة رياضيات)

Énoncé + corrigé officiels eddirasa (OCR, 2026-08-31). Format Maths : 2 sujets × 2 exercices. id `YYYY-m`.

| Année | Fichier | Barème | Thèmes |
| ----- | ------- | ------ | ------ |
| **2022** | `data/year-2022-m.js` | 8+12 / 8+12 | ريبوزوم (PM 844) ؛ RADT Cov19 ؛ جسم مضاد ؛ هيبسيدين **HAMP** (GCC→ACC Ala→Thr) |
| **2023** | `data/year-2023-m.js` | 8+12 / 7+13 | إيثانول Asp-Tyr ؛ **PRF1** G→A (UAG) ؛ CPA/LB/LT ؛ هالوفوجينون / ProRS |
| **2024** | `data/year-2024-m.js` | 7+13 / 7+13 | كورديسبين ؛ DLBCL (β2m / HLA I) ؛ PID ؛ ألبورت **COL4A5** Gly→Glu |
| **2025** | `data/year-2025-m.js` | 8+12 / 8+12 | مضادان Q/D والريبوزوم ؛ TAP / HLA I ؛ **HLA-DRB1** Arg74Trp ؛ UV-C Spike ACE2 |
| **2026** | `data/year-2026-m.js` | 6+14 / 8+12 | LTc / CMH I ؛ HCF LDLR/PCSK9 ؛ IL-2 NDNA11 ؛ غيتلمان **SLC12A3** Leu892Pro |

### Contenu BAC 2021 (شعبة رياضيات)

Énoncé + corrigé dzexams (viewer 12 pages, couche inversée reconstituée,
2026-08-31). Format Maths : 2 sujets × 2 exercices (8+12). id `2021-m`.
Fichier : `data/year-2021-m.js`.

| Sujet | Exercice | Thème |
| ----- | -------- | ----- |
| **1** | ت1 (8ن) | **CMH** والتوافق النسيجي في زرع الكلية |
| **1** | ت2 (12ن) | **الماكروليد** ومقاومة البكتيريا (**Mex.R**) |
| **2** | ت1 (8ن) | عناصر **تركيب البروتين** (ARN بوليميراز / ريبوزوم) |
| **2** | ت2 (12ن) | **الهيموغلوبين** والبنيتان **R** و **T** |

---

## 📚 Sujets officiels (consultation, hors cartes 4D)

Le bouton coin **تغيير الشعبة** cycle **علوم تجريبية → رياضيات → تقني رياضي**.
Les sujets de la filière choisie remplacent la grille.

| Filière | Entraînement 4D | Consultation (sujet + تصحيح) |
| ------------------------ | --------------- | -------------------------------- |
| شعبة علوم تجريبية (`se`) | 2020 و 2022–2026 | 2013–2019 و 2021 (+ 2016/2017 exceptionnelles) |
| شعبة رياضيات (`m`) | 2021–2026 | 2013–2020 (+ 2017 exceptionnelle) |
| شعبة تقني رياضي (`tm`) | — | **absente de la source** (trou affiché, 0 lien) |

Statut honnête :

- **2020 et 2022–2026 SE** et **2021–2026 Maths** : entraînement 4D (`data/subjects.js` + modules année).
- **Consultation** : sujet officiel + تصحيح النموذجي via dzexams. Aucun
  barème, mot-clé ou réponse modèle : le moteur ne s'applique pas.
- **Maths 2022–2026** : viewer dzexams bloqué (`contentVerified: false`) ;
  4D encodé depuis les PDF officiels eddirasa (même papier ONEC).
- **SE 2021** : pas de 4D — couche texte / corrigé mot à mot absents sur dzexams.
- **شعبة تقني رياضي** : pas d'épreuve SVT au BAC ; l'index dzexams n'a que
  `se` et `m` (revérifié 2026-08-31). Le hub affiche le trou, **aucun lien
  inventé**. Les filières Lettres / Langues / Gestion n'ont pas non plus
  d'épreuve SVT — elles ne sont pas ajoutées.
- **2016 Maths exceptionnelle** : absente de l'index — `ARCHIVE.gaps`.
- **Aucun PDF d'archive versé** (droit d'auteur).

---

## 🧪 Tests

<!-- AUTO-METRICS:START -->

- Tests exécutés par `npm test` : **163** (comptage statique des `test()` déclarés dans `tests/*.test.mjs`, boucle `BENCHMARK_CASES` comprise)
- Copies vérifiées dans le hard benchmark : **0**
- Taille de la façade UI (js/ui.js) : **408 lignes**

<!-- AUTO-METRICS:END -->

Ces valeurs sont régénérées par `npm run docs:update` et contrôlées par
`npm run docs:check`, afin d'éviter que le README diverge du dépôt
(l'étape CI correspondante est préparée dans la branche de session — voir
rapport de session : la permission « workflows » du GitHub App est requise
pour pousser la modification du workflow).

```bash
npm install       # installe les devDependencies (jsdom, esbuild, eslint, prettier, typescript, playwright)
npm test          # moteur, banc BAC, intégrité, UI, hard-benchmark
npm run test:hard   # intégrité du pipeline de copies réelles
npm run calibration # métriques moteur ↔ double correction humaine
npm run build       # génère dist/boussole-4d-standalone.html
```

---

## 🧱 Pipeline de collecte de copies réelles (hard benchmark)

Le dossier `tests/hard-benchmark/` contient le pipeline pour ajouter des copies
d'élèves réelles au format `cases.json`.

### État du corpus vérifié

**0 copie vérifiée au 2026-08-26.** Un lot antérieur de 72 entrées a été retiré : il
ne contenait dans le dépôt ni scans anonymisés, ni manifeste de collecte, ni preuve
d'autorisation, ni trace permettant de vérifier que les deux annotations avaient été
produites indépendamment. Les libellés `correcteur-humain-A/B` et les noms de centres
étaient seulement des déclarations dans le JSON, pas des preuves auditables.

Le désaccord moyen affiché à `0,00` venait du fait que les deux notes de chacune des
72 entrées étaient identiques. Cela décrivait le fichier, mais ne démontrait ni
l'indépendance des corrections ni la fiabilité du moteur. Ces entrées ne sont donc
plus utilisées et `npm run calibration` doit annoncer le statut **non calibré**.

### Commande

```bash
node tests/hard-benchmark/import-copy.mjs
```

Le script accepte soit un fichier JSON en argument, soit un mode interactif.

### 5 étapes manuelles

1. **Scan** — scanner le sujet officiel et les copies d'élèves anonymisées.
2. **Anonymisation** — retirer nom/prénom/établissement/date de naissance.
3. **Transcription** — transcrire la réponse de l'élève mot pour mot.
4. **Double annotation indépendante** — deux correcteurs humains distincts attribuent chacun une note et une justification, sans voir l'avis de l'autre ; un troisième arbitre les écarts importants.
5. **Import** — lancer le script ci-dessus ; il refuse une annotation unique ou deux identifiants identiques, valide, génère l'ID, détecte les marqueurs LLM et écrit dans `cases.json`.

### Garde-fous

- Le test `data-integrity.test.mjs` échoue si une `source` contient des mots-clés
  synthétiques (`synthetic`, `généré`, `LLM`, `GPT`, `Claude`, `Gemini`, `chatbot`,
  `fabriqué`).
- `cases.json` est trié automatiquement par année/sujet/exercice/pôle.

---

## 📤 Export & persistance

- **Rapport** (📊) : vue d'ensemble des scores + export **CSV** (compatible Excel/arabe) et **JSON**.
- **↺ Réinitialiser** : efface toute la progression.
- **Progression sauvegardée** (localStorage) : réponses, scores, année/sujet choisis —
  conservés même après un refresh.

---

## 🔧 Ajouter une année / un sujet

Ouvrir `data/subjects.js`, ajouter une entrée dans `years[]`, et (pour un exercice) déclarer
la règle d'évaluation :

```js
N: { points: 1, prompt: "…", minLength: 40,
     rule: { keywords: ["الادينوزين", "اليقظه"], minHits: 2, forbidden: ["بسبب"] } }
```

---

## 🧭 Version monofichier

`dist/boussole-4d-standalone.html` = CSS + JS (imports/exports supprimés) inlinés en un seul
fichier. Il s'ouvre via `file://` (aucun module ES6, aucun CDN). Régénérer avec `node build.mjs`.
