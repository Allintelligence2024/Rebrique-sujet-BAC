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
4. **Choix d'exercice** — sujet puis exercice à travailler.
5. **Espace de travail 4D** — consigne et réponse prioritaires, diagnostic de couverture, aide contextuelle et indicateur chiffré secondaire.

L'interface propose des thèmes clair et sombre persistants. Les outils secondaires sont regroupés afin de ne pas concurrencer la consigne.

---

## 🗂️ Architecture (modulaire & data-driven)

```
.
├── index.html              # squelette des 5 écrans (remplis par js/ui.js)
├── assets/
│   ├── styles.css          # design 100% autonome (aucun CDN)
│   └── icon-192/512.png    # icône de marque (boussole 4D)
├── data/subjects.js        # ⭐ CONFIG : années → sujets → exercices → barème & mots-clés
├── data/brouillon.js       # canevas du brouillon méthodologique et verbes BAC
├── js/
│   ├── store.js            # état + persistance localStorage + timers reconciliés
│   ├── engine.js           # façade du moteur heuristique + minuteurs
│   ├── domain/             # règles d'analyse et d'évaluation
│   ├── services/           # son, reconnaissance vocale et diagnostics récupérables
│   ├── ui/
│   │   ├── screens/workspace.js      # contrôleur de l'espace de travail
│   │   ├── workspace/                # texte, pipeline, brouillon et feedback
│   │   ├── reports/                  # calcul, CSV/JSON et impression
│   │   └── dialogs/navigation/dom.js # infrastructure UI partagée
│   ├── ui.js               # façade d'orchestration (< 700 lignes)
│   └── main.js             # point d'entrée
├── tests/                  # 117 tests automatisés (moteur, données, UI, sécurité)
├── dist/
│   └── boussole-4d-standalone.html   # version monofichier (ouvre en file://)
├── manifest.webmanifest     # PWA (installable)
├── sw.js                    # service worker (mode hors-ligne)
├── build.mjs                # fabrique la version monofichier
└── package.json             # npm start / npm test
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

## 📄 Contenu réel (BAC 2025 — شعبة علوم تجريبية)

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

### Contenu BAC 2024 (شعبة علوم تجريبية)

Thèmes relus sur la couche texte du PDF eddirasa (bruitée : OCR + traduction parasite) ; wording `reconstructed` :

| Sujet | Exercice | Thème                                                                |
| ----- | -------- | -------------------------------------------------------------------- |
| **1** | ت1 (5ن)  | **فيروس VIH** والخلايا **LT4** + دواء **Zalcitabine**                |
| **1** | ت2 (7ن)  | **الصرع** وتوازن التنبيه/التثبيط (**Glutamate / GABA**, الجين Scn1a) |
| **1** | ت3 (8ن)  | بروتين **P53** والبنزوبيرين وسرطان الرئة                             |
| **2** | ت1 (5ن)  | **الترجمة** وتأثير **Tetracycline / Oxazolidinone**                  |
| **2** | ت2 (7ن)  | **RUBISCO** وتثبيت **CO₂** عند الفاصولياء (CA1P)                     |
| **2** | ت3 (8ن)  | **المناعة** ضد الدفتيريا والمكورات العنقودية (بروتين SPA)            |

Le **barème 4D** adapte les points officiels à la méthode (N/S/E/W), et l'évaluation
compare les réponses à des **mots-clés normalisés** (via `normalizeArabic`) + inter-dits
(ex. « بسبب » pénalisé à l'étape S) + longueur minimale.

> ⚠️ Les PDF 2025 du dépôt sont **scannés**. Les `bacPrompt` marqués `official`
> ont été relus visuellement page par page (2026-08-23). Le reste reste `reconstructed`.

### Provenance des consignes

| Année    | État        | PDF local                                          | Source externe                                                                                                                                                                                                                 | Consignes                                                                                                                                               |
| -------- | ----------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **2025** | activée     | `BAC2025_SVT_Sujet1.pdf`, `BAC2025_SVT_Sujet2.pdf` | —                                                                                                                                                                                                                              | Pôles `official` relus sur le scan ; autres `reconstructed`                                                                                             |
| **2024** | activée     | aucun (droit d'auteur)                             | [eddirasa sujet](https://eddirasa.com/bac-science-2024-se/) · [PDF](https://eddirasa.com/wp-content/uploads/2024/06/bac-sc-sciences-2024.pdf) · [dzexams](https://www.dzexams.com/ar/annales/bkVXVzlvRTlpV1RMYUk5cGNyS3oxdz09) | `reconstructed` — couche texte distante bruitée (OCR + traduction parasite), non certifiable `official` ici. Session de remplacement non localisée.     |
| **2023** | **activée** | aucun (droit d'auteur)                             | [dzexams 2023](https://www.dzexams.com/ar/annales/STRDZEowcCtwN0JmT1NwS3p4cEVmdz09) · [PDF](https://www.dzexams.com/uploads/sujets/officiels/bac/2023/dzexams-bac-sciences-naturelles-1780707.pdf)                             | Consignes `official` relues sur la couche texte du PDF (inversée, reconstituée mot à mot, 2026-08-25) ; pôles sans question autonome en `reconstructed` |

Aucun PDF 2024/2023 n'est versé dans le dépôt.

---

## 🧪 Tests

<!-- AUTO-METRICS:START -->

- Déclarations `test()` détectées statiquement : **119**
- Copies vérifiées dans le hard benchmark : **0**
- Taille de la façade UI : **409 lignes**

<!-- AUTO-METRICS:END -->

Ces valeurs sont régénérées par `npm run docs:update` et vérifiées en CI par
`npm run docs:check`, afin d'éviter que le README diverge du dépôt.

```bash
npm install       # installe jsdom + esbuild (devDependencies)
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
