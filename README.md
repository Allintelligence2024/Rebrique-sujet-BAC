# 🧭 بوصلة كنز المنهجية 4D — المنصة التفاعلية لبكالوريا الجزائر

**مادة علوم الطبيعة والحياة** — منصة الحل الميكانيكي المنظم لامتحانات البكالوريا وفق نظام «الأقطاب 4D»
(N = تأطير المسألة، S = استغلال السندات، E = الربط والتفسير، W = التركيب والمصادقة).

> ✅ **Version intégrée à la racine.** L'ancien site monolithique est conservé dans
> [`_v1_backup/`](_v1_backup) au cas où.

---

## ✨ Ce que propose l'application

Parcours en 5 étapes pensé pour la **gestion du stress** et la **méthode** :
1. **Hub** — choix de la session (année → sujet).
2. **Sérénité** — respiration « box breathing » + micro-conseils méthodologiques.
3. **Stratégie** — consultation des PDF officiels des 2 sujets + **calculatrice de choix** (25 min).
4. **Onboarding** — isoler le sujet choisi et planifier les 3 exercices.
5. **Espace de travail 4D** — boussole animée, barème réel, **feedback pédagogique**, aide « anti-panique ».

---

## 🗂️ Architecture (modulaire & data-driven)

```
.
├── index.html              # squelette des 5 écrans (remplis par js/ui.js)
├── assets/
│   ├── styles.css          # design 100% autonome (aucun CDN)
│   └── icon-192/512.png    # icône de marque (boussole 4D)
├── data/subjects.js        # ⭐ CONFIG : années → sujets → exercices → barème & mots-clés
├── js/
│   ├── store.js            # état + persistance localStorage + timers reconciliés
│   ├── engine.js           # évaluation réelle (mots-clés/pipeline) + minuteurs fiables
│   ├── ui.js               # rendu, boussole, exercices, toasts, rapport
│   └── main.js             # point d'entrée
├── tests/                  # 11 tests (moteur + intégration UI)
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

| Sujet | Exercice | Thème |
|------|----------|-------|
| **1** | ت1 (5ن) | دور الـ **ARN** في **تركيب البروتين** + تأثير مادة تُفكّك الرابطة أدنين–ريبوز |
| **1** | ت2 (7ن) | **الطحالب الخضراء**، بنية الصانعات، استغلال **CO₂** وأنزيم **RUBISCO** |
| **1** | ت3 (8ن) | **الأدينوزين، الكافيين والنشاط العصبي** (المخطط التحصيلي ذو المسارين) |
| **2** | ت1 (5ن) | **التحلل السكري** وتحويل طاقة الجلوكوز (ATP) + أثر دواء |
| **2** | ت2 (7ن) | أنزيم **SOD** و**التصلب الجانبي الضموري (ALS)** |
| **2** | ت3 (8ن) | **زمر الدم ABO** و**التسامح المناعي** (نقل بين الزمرتين A / O) |

Le **barème 4D** adapte les points officiels à la méthode (N/S/E/W), et l'évaluation
compare les réponses à des **mots-clés normalisés** (via `normalizeArabic`) + inter-dits
(ex. « بسبب » pénalisé à l'étape S) + longueur minimale.

> ⚠️ Les PDF sont **scannés** : le barème/mots-clés est une reconstruction fidèle de
> l'OCR du corrigé officiel, mais **à vérifier humainement** avant diffusion.

---

## 🧪 Tests

```bash
npm install      # installe jsdom (devDependency)
npm test         # 11 tests : moteur (6) + intégration UI (5)
npm run test:hard # tests du pipeline hard-benchmark + intégrité des données
```

---

## 🧱 Pipeline de collecte de copies réelles (hard benchmark)

Le dossier `tests/hard-benchmark/` contient le pipeline pour ajouter des copies
d'élèves réelles au format `cases.json`.

### Commande

```bash
node tests/hard-benchmark/import-copy.mjs
```

Le script accepte soit un fichier JSON en argument, soit un mode interactif.

### 5 étapes manuelles

1. **Scan** — scanner le sujet officiel et les copies d'élèves anonymisées.
2. **Anonymisation** — retirer nom/prénom/établissement/date de naissance.
3. **Transcription** — transcrire la réponse de l'élève mot pour mot.
4. **Annotation** — un correcteur humain attribue la catégorie et une note.
5. **Import** — lancer le script ci-dessus ; il valide, génère l'ID, détecte
   les marqueurs LLM et écrit dans `cases.json`.

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
