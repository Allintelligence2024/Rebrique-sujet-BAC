# 🔑 مفتاح الكنز — منهجية الإجابة في بكالوريا الجزائر

**مادة علوم الطبيعة والحياة** — أداة تتحقق من تغطية الإجابة للعناصر العلمية والمنهجية المنتظرة وفق أربع خطوات:
N = اقرأ — تأطير المسألة، S = اجمع — استغلال السندات، E = اربط — الربط والتفسير، W = اختُم — التركيب والمصادقة. Les identifiants techniques restent N/S/E/W ; l'interface emploie une seule représentation visible : le parcours en quatre étapes. Elle ne prétend pas corriger une copie à la place d'un professeur.

> ⚠️ **Positionnement honnête : outil d'entraînement méthodologique non calibré.** Le moteur calcule des signaux heuristiques pour ses tests, mais l'interface masque toute note numérique tant que les seuils de calibration humaine ne sont pas franchis. Les consignes marquées `reconstructed` ne sont pas des énoncés officiels. Le benchmark vérifié contient actuellement **0 copie réelle doublement annotée** : aucune métrique de fiabilité ne peut donc être publiée.

> ✅ **Version intégrée à la racine.** L'ancien site monolithique est conservé dans
> [`_v1_backup/`](_v1_backup) au cas où.

---

## ✨ Ce que propose l'application

Parcours en cinq temps pensé pour la **gestion du stress** et la **méthode** — soit quatre écrans (`view-hub`, `view-guide`, `view-strategy`, `view-workspace` dans `index.html`) plus une section d'outils repliée :

1. **Hub** — une seule action par carte-sujet : **▶ ابدأ الإمتحان**. Chaque carte annonce la durée officielle selon la filière (4 h 30 en Sciences expérimentales, 2 h 30 en Maths) et rappelle que le jumeau numérique du sujet est partiel : certaines consignes sont reconstruites.
2. **Sérénité** _(parcours guidé uniquement)_ — volontairement dépouillé : respiration, rappel des quatre étapes (اقرأ ← اجمع ← اربط ← اختُم), plan de session. Cet écran prépare à l'épreuve, il n'est pas une simulation certifiée.
3. **تدريب الخطوات الأربع** _(hub, section repliée)_ — outils d'entraînement formulés littéralement : décision **سند/معارف**, décision **وصف/تفسير**, exercice rapide de 12 instructions, niveau avancé après 12/12 ×3, cinq erreurs, carte imprimable, **أطلس التقنيات** et **تشخيص تجريبي**. Ils restent repliés par défaut.
4. **Stratégie** _(optionnelle)_ — le sujet s'affiche **dans l'application** (visionneuse PDF intégrée, les fichiers suivis dans `subjects/**` étant servis par la même origine), avec estimation personnelle et choix du sujet. Chaque carte rappelle l'état réel de l'inventaire : `جرد المهام: N مهمة، منها M تعليمة رسمية موثّقة`. Le lien dzexams ne reste qu'en source de repli, et `⬇️ تنزيل PDF` permet de travailler hors ligne.
5. **Épreuve — le seul mode** — l'application propose uniquement l'épreuve : les tâches inventoriées du sujet, un champ de réponse par tâche, le chronomètre officiel et **✓ تسليم الورقة** pour rendre la copie avant la fin. Aucune aide, aucun modèle, aucun diagnostic pendant l'épreuve ; après remise, les réponses sont verrouillées et une relecture distincte devient disponible. Aucune note BAC n'est affichée : le moteur n'est pas calibré, et l'écran le dit (`التنقيط غير معاير`).

> 📱 **Responsive** : l'interface est utilisable sur téléphone (grilles qui se replient, cibles tactiles ≥ 44 px, champs 16 px sans zoom iOS, modales scrollables). Verrouillé par `tests/e2e/responsive.spec.mjs` (3 viewports réels, zéro défilement horizontal) dans la CI.

> ⚡ **Chargement progressif et mode hors-ligne maîtrisé** : le démarrage ne charge que le catalogue des 19 années. Le sujet complet d'une année est importé au clic, puis peut être conservé dans un cache runtime local borné. Le shell ne précache ni les payloads d'années ni les PDF. Un badge discret affiche la version du build et l'état hors-ligne ; les diagnostics restent des compteurs techniques agrégés sur l'appareil.

L'interface propose des thèmes clair et sombre persistants. Dans l'espace de travail, toute l'aide
méthodologique (décisions سند/معارف et وصف/تفسير, canevas, الفحص الرباعي) est regroupée dans **un seul dépliant
fermé** « توجيه هذه الخطوة » : la consigne et la zone de réponse restent l'élément central.

---

## 🔑 Correspondance fiche MIFTAH ↔ application (cartographie complète)

La fiche élève **MIFTAH v3.1** (recto المفتاح / verso المفتاح+) est intégrée section par section.
Le contenu méthode vit dans les modules testés ; la vue imprimable (`js/ui/keycard.js`,
bouton 🖨️ de l'écran guide) est générée à partir des **mêmes sources** (quick-check.js, gates.js).

| Section de la fiche                                                            | Où elle vit dans l'app                                                                                                  | Test                                             |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| الخطوات 1-4 (اقرأ/اجمع/اربط/اختُم)                                             | parcours linéaire et tiroir brouillon — IDs internes N/S/E/W inchangés                                                  | `ui.test.mjs`                                    |
| قرارا البداية (سند/معارف · وصف/تفسير)                                          | classifieur `js/domain/method/gates.js` : carte interactive, exercice rapide et décision littérale sous chaque consigne | `gates-drill.test.mjs`, `ui.test.mjs`            |
| تدريب القرار (12/12 ×3)                                                        | exercice du hub, série persistée qui ouvre le niveau avancé                                                             | `gates-drill.test.mjs`                           |
| المستوى المتقدم (افتح، قالب التركيب، حساب، شجرة النسب، عامّ/خاصّ، جملة النجاة) | carte dédiée déverrouillable + gradation متوسط/امتياز                                                                   | `gates-drill.test.mjs`                           |
| وضع الحفظ (عرّف / اذكر)                                                        | canevas `definition`/`listing` de `js/method-scripts.js`                                                                | `method-coach.test.mjs`                          |
| الجمل الثلاث الجاهزة                                                           | `sentenceModels` de `data/brouillon.js`                                                                                 | `brouillon.test.mjs`                             |
| الفحص الرباعي المعكوس                                                          | `js/ui/workspace/quick-check.js`, dépliable dans chaque pôle du workspace + keycard                                     | `workspace-modules.test.mjs`, `keycard.test.mjs` |
| خمسة أخطاء تكلّف أكثر من الجهل                                                 | carte de l'écran guide + keycard (reformulés **sans** pourcentages de barème)                                           | `gates-drill.test.mjs`                           |
| التصنيف حسب المستوى (متعثر/متوسط/امتياز)                                       | badges 🟦/🟨 dans le niveau avancé                                                                                      | `gates-drill.test.mjs`                           |
| بطاقة imprimable                                                               | vue générée par `js/ui/keycard.js` (impression A4 isolée), pas de fichier statique dupliqué                             | `keycard.test.mjs`                               |

**Hors périmètre, volontairement :** la colonne « 📝 المصحح » de la fiche (pourcentages, « نصف النقطة
دائما », « إجابة بلا رقم = 0 »…) : aucune source officielle (`عناصر الإجابة والعلامة المترتبة`) ne
les étaye — elles ne peuvent pas entrer dans l'app tant qu'un document officiel ne les confirme pas.
Le disclaimers du hard benchmark (0 copie réelle doublement annotée) reste la limite honnête du projet.

---

## 🗂️ Architecture (modulaire & data-driven)

```
.
├── index.html                        # squelette des 5 écrans (remplis par js/)
├── assets/
│   ├── styles.css                    # design 100% autonome (aucun CDN)
│   └── icon-192.png / icon-512.png   # icônes de marque (مفتاح الكنز)
├── data/
│   ├── subjects.js                   # catalogue léger + chargeurs dynamiques (aucun sujet complet au démarrage)
│   ├── years/
│   │   ├── se/year-2013.js … year-2026.js  # un payload à la demande par année Sciences
│   │   └── m/year-2021.js … year-2026.js   # un payload à la demande par année Maths
│   ├── calibration-policy.js         # seuils quantitatifs préalables à toute promotion de score
│   ├── calibration-status.js         # statut public généré depuis le corpus audité
│   ├── usability-study.js            # agrégats P2 pseudonymisés (aucune session inventée)
│   ├── official-tasks.js             # inventaires explicites des questions BAC, séparés des étapes N/S/E/W
│   ├── archive.js                    # consultation (hors cartes d'épreuve affichées)
│   └── brouillon.js                  # canevas du brouillon méthodologique et verbes BAC
├── js/
│   ├── main.js                       # point d'entrée
│   ├── ui.js                         # façade d'orchestration (taille mesurée dans le bloc « Tests »)
│   ├── engine.js                     # façade du moteur heuristique + minuteurs
│   ├── store.js                      # état + persistance localStorage + timers reconciliés
│   ├── app-version.js                # version PWA (générée par scripts/generate-pwa-version.mjs)
│   ├── method-scripts.js             # scripts de méthode (conseils contextuels)
│   ├── application/                  # minuteurs + démarrage après chargement de l'année demandée
│   ├── domain/evaluation/            # règles d'analyse et d'évaluation (5 modules)
│   ├── domain/subjects/official-coverage.js # audit de couverture et garde de simulation fermée par défaut
│   ├── domain/method/gates.js        # décisions سند/معارف · وصف/تفسير + exercice rapide
│   ├── services/                     # son, dictée et observabilité locale agrégée sans données personnelles
│   └── ui/
│       ├── dom.js · dialogs.js · navigation.js · accessibility.js  # infrastructure UI partagée
│       ├── atlas.js · demo-diagnostic.js                           # atlas des techniques + démo avant/après
│       ├── screens/            # hub, guide, stratégie, épreuve et relecture après remise
│       ├── workspace/          # modules de l'ancien écran d'entraînement (retirés du produit, conservés et testés)
│       └── pdf-viewer.js       # visionneuse du sujet: PDF local en iframe + repli externe + téléchargement
├── tests/                            # tests automatisés (moteur, données, UI, sécurité) — `npm test`
│   ├── *.test.mjs                    # exécutés par `node --test` (compte dans le bloc « Tests »)
│   ├── e2e/                          # Playwright : mode hors-ligne PWA + responsive mobile (3 viewports) — `npm run test:e2e`
│   └── hard-benchmark/               # pipeline de copies réelles (corpus : 0 copie)
├── scripts/
│   ├── generate-pwa-version.mjs      # génère js/app-version.js (appelé par `npm run build`)
│   ├── generate-archive-years.mjs    # régénère les payloads reconstruits 2013–2019
│   ├── report-official-coverage.mjs  # inventaire connu, couverture globale et éligibilité simulation
│   ├── report-p1-status.mjs          # six critères P1, preuves et bloqueurs externes
│   ├── report-p2-status.mjs          # sept critères P2, dont cinq élèves distincts
│   ├── report-p3-status.mjs          # six critères P3 (PWA, cache, observabilité, release)
│   ├── verify-release.mjs            # contrôle le fichier, la taille et le SHA-256 de la release
│   ├── update-calibration-status.mjs # statut public dérivé du corpus audité
│   └── update-doc-metrics.mjs        # régénère / vérifie les métriques du README
├── docs/                             # protocoles, handoff et déploiement/rollback
├── server.mjs                        # serveur statique avec CSP — `npm start`
├── playwright.config.mjs             # config e2e (lance server.mjs sur 127.0.0.1:4173)
├── tsconfig.services.json            # typecheck des services — `npm run typecheck`
├── build.mjs                         # produit la release web déterministe et le monofichier
├── sw.js                             # shell précaché + runtime borné à 12 entrées
├── manifest.webmanifest              # PWA (installable)
├── _v1_backup/                       # ancien site monolithique conservé
├── dist/                             # généré par `npm run build` (ignoré par git)
│   ├── site/                         # artefact de production + release.json vérifiable
│   └── boussole-4d-standalone.html   # version monofichier (ouvre en file://)
└── package.json                      # npm start / npm test / npm run build
```

### Statut P1 mesuré — incomplet tant que les preuves manquent

Les questions BAC ne sont plus supposées équivalentes aux quatre étapes N/S/E/W. Un inventaire indépendant déclare désormais chaque tâche : sa provenance (`official` quand le texte vient de l'énoncé, `reconstructed` quand il s'agit d'une étape pédagogique), sa page quand elle est connue, ses références documentaires et son maximum — **provisoire** partout, puisqu'aucun barème n'a été relu par un humain.

```bash
npm run coverage:official # détail des 38 sujets (tous ouverts à l'épreuve)
npm run inventory:check    # data/official-tasks.js doit être régénéré, jamais édité à la main
npm run p1:status         # verdict des six critères P1
npm run p1:check          # échoue tant que P1 n'est pas réellement terminé
```

Les inventaires couvrent les **38 sujets** et **408 tâches** : **149** consignes officielles (avec page) et **259** étapes reconstruites (sans page — on n'invente pas un numéro de page). Les 38 sujets sont ouverts à l'épreuve, conformément à la décision produit consignée dans `data/bac-mode-policy.js` : le contenu doit être inventorié, mappé et borné (règle stricte), mais les certifications humaines — relecture des documents, barème vérifié — peuvent manquer, à condition que l'écran le dise. La règle stricte reste implémentée (`strictEligible`) et continuera de décider seule dès que les preuves humaines existeront. La couverture globale vaut `unknown` tant que l'inventaire d'un sujet est partiel : elle n'est jamais transformée en 0 % ou 100 %. Les exports chiffrés restent interdits tant que la calibration humaine n'est pas faite.

Le code du parcours est en place : une épreuve silencieuse fondée sur les tâches inventoriées, puis une relecture verrouillée après remise. La CSP n'autorise plus `unsafe-inline` et les sources publiques ne contiennent plus de style inline. Cela ne clôt pas P1 : les inventaires complets et le corpus humain sont des preuves externes absentes, pas des cases que le code peut cocher seul. Le volume et le format des apports nécessaires sont détaillés dans [`docs/P1_EVIDENCE_REQUIREMENTS.md`](docs/P1_EVIDENCE_REQUIREMENTS.md).

### Statut P2 mesuré — validation humaine encore requise

La première tranche P2 ferme les six critères techniques : navigation clavier et focus de route, dialogues isolés, ordre libre des exercices, vocabulaire recentré sur les quatre étapes, interface élève en arabe, contraste et petites tailles, ainsi que le cycle complet du brouillon. Le septième critère reste externe : cinq élèves doivent tester le parcours sur leur téléphone bas de gamme.

```bash
npm run p2:status # verdict des sept critères P2
npm run p2:check  # échoue tant que cinq sessions réelles ne sont pas auditées
```

Le protocole et le format d’agrégats pseudonymisés, sans identifiant direct, sont définis dans [`docs/P2_USABILITY_PROTOCOL.md`](docs/P2_USABILITY_PROTOCOL.md). Une session synthétique ne peut pas fermer P2.7.

---

## ⚖️ Publication responsable

Le code original et la documentation sont sous Apache-2.0 (`LICENSE`). Les droits des sujets, corrigés et scans tiers ne sont pas transférés par cette licence : consultez [`docs/CONTENT_RIGHTS.md`](docs/CONTENT_RIGHTS.md) avant toute redistribution. La politique de confidentialité locale, l’effacement et l’usage du microphone sont décrits dans [`docs/PRIVACY.md`](docs/PRIVACY.md) ; les mentions légales et le signalement d’erreur dans [`docs/LEGAL_NOTICE.md`](docs/LEGAL_NOTICE.md).

La revue P4 reste bloquée pour une mise en production tant qu’une revue juridique du contenu externe n’est pas maintenue et qu’une revue scientifique indépendante n’est pas attestée. Voir [`docs/P4_PUBLICATION.md`](docs/P4_PUBLICATION.md).

## 🌐 Lancer l'application

```bash
npm start
# ouvrir http://localhost:8080
```

Le serveur applique une liste blanche d'assets publics. Ne pas remplacer cette commande par un serveur exposant toute la racine du dépôt.

> ⚠️ Ouvrir `index.html` via `file://` peut bloquer les modules ES6.
> Pour un fichier 100 % autonome, ouvrir directement
> `dist/boussole-4d-standalone.html` (aucune dépendance, aucun serveur).

---

## 📄 Contenu réel — épreuve

**19 années** dans `APP_CONFIG.years` : 2013–2019 et 2020+2022–2026 علوم تجريبية + 2021–2026 رياضيات.
Le hub SE affiche 2013–2020 et 2022–2026 en cartes d'épreuve ; le hub Maths affiche 2021–2026.
**2021 SE est volontairement absente des cartes d'épreuve.** L'archive 2013–2019 n'est pas un énoncé ministériel.

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

> ⚠️ Les PDF d’examen ne sont pas redistribués par le dépôt. Les `bacPrompt` marqués `official`
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

Les points N/S/E/W sont une **allocation pédagogique interne**, pas le barème officiel question par question. Le premier inventaire P1 (`data/official-tasks.js`) sépare les deux tâches officielles de 2025/S1/E1 des quatre étapes méthodologiques et marque encore leur découpage de points comme provisoire. L'évaluation compare les réponses à des **mots-clés normalisés** (via `normalizeArabic`), des interdits contextuels et une longueur minimale ; elle ne produit pas de note BAC.

### Provenance des consignes

| Année          | État        | PDF local                                   | Source externe                                                                                                                                                                                                                                                                                                                                                 | Consignes                                                                                                                                                                                                         |
| -------------- | ----------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **2025**       | activée     | aucun PDF local ; liens externes uniquement | —                                                                                                                                                                                                                                                                                                                                                              | Pôles `official` relus sur le scan ; autres `reconstructed`                                                                                                                                                       |
| **2024**       | activée     | aucun (droit d'auteur)                      | [eddirasa sujet](https://eddirasa.com/bac-science-2024-se/) · [PDF eddirasa](https://eddirasa.com/wp-content/uploads/2024/06/bac-sc-sciences-2024.pdf) · [dzexams](https://www.dzexams.com/ar/annales/bkVXVzlvRTlpV1RMYUk5cGNyS3oxdz09) · [PDF dzexams](https://www.dzexams.com/uploads/sujets/officiels/bac/2024/dzexams-bac-sciences-naturelles-1751784.pdf) | Mixte : 8 pôles `official` recopiés mot à mot sur photos des pages 2, 6, 7, 10 (2026-08-31) ; le reste `reconstructed`. Viewer dzexams bloqué dans la sandbox. Session de remplacement non localisée.             |
| **2023**       | **activée** | aucun (droit d'auteur)                      | [dzexams 2023](https://www.dzexams.com/ar/annales/STRDZEowcCtwN0JmT1NwS3p4cEVmdz09) · [PDF](https://www.dzexams.com/uploads/sujets/officiels/bac/2023/dzexams-bac-sciences-naturelles-1780707.pdf)                                                                                                                                                             | Consignes `official` relues sur la couche texte du PDF (inversée, reconstituée mot à mot, 2026-08-25) ; pôles sans question autonome en `reconstructed`                                                           |
| **2022**       | **activée** | aucun (droit d'auteur)                      | [dzexams 2022](https://www.dzexams.com/ar/annales/eVlXSFRFOEJaN2ozSlE3NytzWkRHQT09) · [PDF ONEC](https://www.dzexams.com/uploads/sujets/officiels/bac/2022/dzexams-bac-sciences-2311208.pdf) · [corrigé eddirasa](https://eddirasa.com/correction-bac-science-2022-se/)                                                                                        | Consignes `official` relues sur la couche texte du PDF ONEC (inversée, reconstituée mot à mot, 2026-08-27) ; corrigé officiel croisé sur 2 sources concordantes ; pôles sans question autonome en `reconstructed` |
| **2026 SE**    | **activée** | aucun (droit d'auteur)                      | [énoncé eddirasa](https://eddirasa.com/uploads/2026/08/bac-science-2026-se.pdf) · [corrigé](https://eddirasa.com/uploads/2026/08/correction-bac-science-2026-se.pdf)                                                                                                                                                                                           | `official` / `reconstructed` depuis OCR du PDF officiel (2026-08-31)                                                                                                                                              |
| **2020 SE**    | **activée** | aucun (droit d'auteur)                      | [énoncé eddirasa](https://eddirasa.com/wp-content/uploads/2020/09/eddirasa.com-bac-se-science-2020.pdf) · [corrigé](https://eddirasa.com/wp-content/uploads/2020/09/eddirasa.com-correction-bac-sc-science-2020.pdf)                                                                                                                                           | `official` / `reconstructed` depuis OCR RTL (2026-08-31)                                                                                                                                                          |
| **2021 Maths** | **activée** | aucun (droit d'auteur)                      | [dzexams 2021 m](https://www.dzexams.com/ar/annales/T2tYS3FTcFRwWCtCbXV2QmFyRTcydz09)                                                                                                                                                                                                                                                                          | `official` / `reconstructed` depuis viewer 12 pages (couche inversée, 2026-08-31)                                                                                                                                 |
| **2022 Maths** | **activée** | aucun (droit d'auteur)                      | [énoncé eddirasa](https://eddirasa.com/wp-content/uploads/2022/06/eddirasa.com-bac-math-science-2022.pdf) · [corrigé](https://eddirasa.com/wp-content/uploads/2022/06/eddirasa.com-correction-bac-math-science-2022.pdf)                                                                                                                                       | `official` / `reconstructed` depuis OCR (2026-08-31) ; format 8+12 / 8+12                                                                                                                                         |
| **2023 Maths** | **activée** | aucun (droit d'auteur)                      | [énoncé eddirasa](https://eddirasa.com/wp-content/uploads/2023/07/eddirasa.com-bac-sciences-math-2023.pdf) · [corrigé](https://eddirasa.com/wp-content/uploads/2023/07/eddirasa.com-correction-bac-sciences-math-2023.pdf)                                                                                                                                     | `official` / `reconstructed` depuis OCR (2026-08-31) ; format 8+12 / 7+13                                                                                                                                         |
| **2024 Maths** | **activée** | aucun (droit d'auteur)                      | [énoncé eddirasa](https://eddirasa.com/wp-content/uploads/2024/06/bac-math-sciences-2024.pdf) · [corrigé](https://eddirasa.com/wp-content/uploads/2024/05/correction-bac-math-sciences-2024.pdf)                                                                                                                                                               | `official` / `reconstructed` depuis OCR (2026-08-31) ; format 7+13 / 7+13                                                                                                                                         |
| **2025 Maths** | **activée** | aucun (droit d'auteur)                      | [énoncé eddirasa](https://eddirasa.com/wp-content/uploads/2025/06/bac-math-science-2025.pdf) · [corrigé](https://eddirasa.com/wp-content/uploads/2025/06/correction-bac-math-science-2025.pdf)                                                                                                                                                                 | `official` / `reconstructed` depuis OCR (2026-08-31) ; format 8+12 / 8+12                                                                                                                                         |
| **2026 Maths** | **activée** | aucun (droit d'auteur)                      | [énoncé eddirasa](https://eddirasa.com/uploads/2026/08/bac-math-sciences-2026.pdf) · [corrigé](https://eddirasa.com/uploads/2026/08/correction-bac-math-sciences-2026.pdf)                                                                                                                                                                                     | `official` / `reconstructed` depuis OCR (2026-08-31) ; format 6+14 / 8+12                                                                                                                                         |

**PDF versés dans le dépôt : aucun**
(aucun PDF local ; liens externes uniquement, à la racine). L'écran stratégie
annonce leur taille exacte et attend un téléchargement volontaire. Ils ne sont jamais précachés ;
une réponse locale HTTP 200 peut seulement entrer dans le cache runtime borné après la demande.
**Aucun PDF des autres années** (2013–2019, 2020, 2021, 2022, 2023, 2024, 2026) n'est versé
(droit d'auteur) : ces années restent en liens externes
(dzexams / eddirasa) dans `data/archive.js` et le tableau ci-dessus.

### Contenu BAC 2026 (شعبة علوم تجريبية)

Énoncé + corrigé officiels [eddirasa](https://eddirasa.com/uploads/2026/08/bac-science-2026-se.pdf)
· [corrigé](https://eddirasa.com/uploads/2026/08/correction-bac-science-2026-se.pdf)
(OCR, 2026-08-31). 2 sujets × 3 exercices (5+7+8). Fichier : `data/years/se/year-2026.js`.

| Sujet | Exercice | Thème                                              |
| ----- | -------- | -------------------------------------------------- |
| **1** | ت1 (5ن)  | **الألبومين**، الجذور الهيدروكسيل (OH•) و**Edema** |
| **1** | ت2 (7ن)  | **SIRT1 / P53A / NAD+** ومركب **RSV**              |
| **1** | ت3 (8ن)  | مبيد **Atrazine** ومقاومة الزنجبيل الأرقطي (GST)   |
| **2** | ت1 (5ن)  | غشاء **التيلاكوئيد** ومبيد **Oxyfluorfen**         |
| **2** | ت2 (7ن)  | **AVC** وقناة **ASIC1a** (PcTx1)                   |
| **2** | ت3 (8ن)  | **ألزهايمر**، Anti-Aβ و**ATV-Aβ** (TfR)            |

### Contenu BAC 2020 (شعبة علوم تجريبية)

Énoncé + corrigé officiels [eddirasa](https://eddirasa.com/wp-content/uploads/2020/09/eddirasa.com-bac-se-science-2020.pdf)
· [corrigé](https://eddirasa.com/wp-content/uploads/2020/09/eddirasa.com-correction-bac-sc-science-2020.pdf)
(OCR RTL, 2026-08-31). 2 sujets × 3 exercices (5+7+8). Fichier : `data/years/se/year-2020.js`.

| Sujet | Exercice | Thème                                                          |
| ----- | -------- | -------------------------------------------------------------- |
| **1** | ت1 (5ن)  | **البنية الداخلية للكرة الأرضية** (Moho / Gutenberg / Lehmann) |
| **1** | ت2 (7ن)  | أنزيما **Cox-1 / Cox-2** ودواء **الإيبوبروفين**                |
| **1** | ت3 (8ن)  | بروتين **Her2** والعلاج بـ **التراستوزوماب**                   |
| **2** | ت1 (5ن)  | انتقاء الببتيد المستضدي و**CMH**                               |
| **2** | ت2 (7ن)  | مادة **الريسين** وتثبيط تركيب البروتين (ARNr 28s)              |
| **2** | ت3 (8ن)  | المشبك المثبط ونضج **GABA** (NKCC1 → KCC2)                     |

### Contenu BAC 2022–2026 (شعبة رياضيات)

Énoncé + corrigé officiels eddirasa (OCR, 2026-08-31). Format Maths : 2 sujets × 2 exercices. id `YYYY-m`.

| Année    | Fichier                     | Barème      | Thèmes                                                                         |
| -------- | --------------------------- | ----------- | ------------------------------------------------------------------------------ |
| **2022** | `data/years/m/year-2022.js` | 8+12 / 8+12 | ريبوزوم (PM 844) ؛ RADT Cov19 ؛ جسم مضاد ؛ هيبسيدين **HAMP** (GCC→ACC Ala→Thr) |
| **2023** | `data/years/m/year-2023.js` | 8+12 / 7+13 | إيثانول Asp-Tyr ؛ **PRF1** G→A (UAG) ؛ CPA/LB/LT ؛ هالوفوجينون / ProRS         |
| **2024** | `data/years/m/year-2024.js` | 7+13 / 7+13 | كورديسبين ؛ DLBCL (β2m / HLA I) ؛ PID ؛ ألبورت **COL4A5** Gly→Glu              |
| **2025** | `data/years/m/year-2025.js` | 8+12 / 8+12 | مضادان Q/D والريبوزوم ؛ TAP / HLA I ؛ **HLA-DRB1** Arg74Trp ؛ UV-C Spike ACE2  |
| **2026** | `data/years/m/year-2026.js` | 6+14 / 8+12 | LTc / CMH I ؛ HCF LDLR/PCSK9 ؛ IL-2 NDNA11 ؛ غيتلمان **SLC12A3** Leu892Pro     |

### Contenu BAC 2021 (شعبة رياضيات)

Énoncé + corrigé dzexams (viewer 12 pages, couche inversée reconstituée,
2026-08-31). Format Maths : 2 sujets × 2 exercices (8+12). id `2021-m`.
Fichier : `data/years/m/year-2021.js`.

| Sujet | Exercice | Thème                                              |
| ----- | -------- | -------------------------------------------------- |
| **1** | ت1 (8ن)  | **CMH** والتوافق النسيجي في زرع الكلية             |
| **1** | ت2 (12ن) | **الماكروليد** ومقاومة البكتيريا (**Mex.R**)       |
| **2** | ت1 (8ن)  | عناصر **تركيب البروتين** (ARN بوليميراز / ريبوزوم) |
| **2** | ت2 (12ن) | **الهيموغلوبين** والبنيتان **R** و **T**           |

---

## 📚 Sujets officiels (consultation, hors cartes d'épreuve)

Le bouton coin **تغيير الشعبة** cycle **علوم تجريبية → رياضيات → تقني رياضي**.
Les sujets de la filière choisie remplacent la grille.

| Filière                  | Épreuve               | Consultation (sujet + تصحيح)                    |
| ------------------------ | --------------------- | ----------------------------------------------- |
| شعبة علوم تجريبية (`se`) | 2013–2020 و 2022–2026 | 2021                                            |
| شعبة رياضيات (`m`)       | 2021–2026             | 2013–2020 (+ 2017 exceptionnelle)               |
| شعبة تقني رياضي (`tm`)   | —                     | **absente de la source** (trou affiché, 0 lien) |

Statut honnête :

- **2013–2019 SE** : sujets reconstruits (`data/years/se/`). Toutes consignes `reconstructed`. **2018** : thèmes relus OCR dzexams. **2013–2017, 2019** : thèmes pédagogiques 3AS, **non certifiables** comme énoncés officiels. Confiance UI basse.
- **2020 et 2022–2026 SE** et **2021–2026 Maths** : sujets chargés à la demande depuis `data/years/{se,m}/`, indexés par le catalogue `data/subjects.js`.
- **Consultation** : sujet officiel + تصحيح النموذجي via dzexams. Aucun
  barème, mot-clé ou réponse modèle : le moteur ne s'applique pas.
- **Maths 2022–2026** : viewer dzexams bloqué (`contentVerified: false`) ;
  Cartes encodées depuis les PDF officiels eddirasa (même papier ONEC).
- **SE 2021** : pas de carte d'épreuve — couche texte / corrigé mot à mot absents sur dzexams.
- **شعبة تقني رياضي** : pas d'épreuve SVT au BAC ; l'index dzexams n'a que
  `se` et `m` (revérifié 2026-08-31). Le hub affiche le trou, **aucun lien
  inventé**. Les filières Lettres / Langues / Gestion n'ont pas non plus
  d'épreuve SVT — elles ne sont pas ajoutées.
- **2016 Maths exceptionnelle** : absente de l'index — `ARCHIVE.gaps`.
- **Aucun PDF d'archive versé** (droit d'auteur) — seule exception, assumée : les deux sujets
  officiels **SVT 2025** à la racine du dépôt. Ils sont servis sur demande et non précachés
  (voir la note « PDF versés dans le dépôt » plus haut).

---

## ⚡ PWA, cache et artefact de production

- `data/subjects.js` expose un catalogue léger ; `loadYear()` importe un seul module `data/years/**`, déduplique les requêtes concurrentes et ne mémorise que les payloads validés.
- `sw.js` précache uniquement le graphe statique nécessaire au shell. Le cache runtime accepte exclusivement les modules d'années répondant HTTP 200 et contourne les requêtes `Range`, et évince au-delà de 12 entrées. Les caches MIFTAH d'un ancien build sont nettoyés sans toucher ceux d'autres applications.
- `npm run build` calcule un identifiant de contenu, produit `dist/site/` et le monofichier, puis écrit `dist/site/release.json` avec la liste exacte des fichiers, octets et SHA-256. `npm run release:verify` refuse tout fichier ajouté, absent, altéré ou incohérent avec le build.
- L'observabilité reste locale : seulement des compteurs bornés par périmètre, noms d'erreurs autorisés, changements de connectivité et événements du service worker. Ni réponse élève, ni sujet, ni texte d'erreur, ni URL ne sont enregistrés.
- La procédure de déploiement atomique, les contrôles post-déploiement et le rollback sont documentés dans [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## 🧪 Tests

<!-- AUTO-METRICS:START -->

- Tests exécutés par `npm test` : **251** (comptage statique des `test()` déclarés dans `tests/*.test.mjs`, boucle `BENCHMARK_CASES` comprise)
- Copies vérifiées dans le hard benchmark : **0/2235 minimum** avant toute promotion numérique
- Inventaires de tâches officielles commencés : **38/38 sujets** (**408 tâches connues**)
- Sujets éligibles à la simulation : **38**
- Critères P1 fermés : **3/6** — statut global : **incomplet**
- Critères P2 fermés : **6/7** — élèves distincts testés : **0/5**
- Critères P3 fermés : **5/6** — statut global : **incomplet**
- Taille de la façade UI (js/ui.js) : **437 lignes**

<!-- AUTO-METRICS:END -->

Ces valeurs sont régénérées par `npm run docs:update` et contrôlées par `npm run docs:check`. La CI exécute aussi les gardes de calibration/couverture, les statuts P1–P3, le build déterministe et la vérification exacte de `release.json` avant d'accepter l'artefact.

```bash
npm ci            # installe exactement le lockfile (jamais `npm install` : le lockfile est le contrat)
npm test          # moteur, banc BAC, intégrité, UI, hard-benchmark, service worker
npm run test:hard   # intégrité du pipeline de copies réelles
npm run calibration       # métriques moteur ↔ double correction humaine
npm run calibration:check # statut public synchronisé avec le corpus audité
npm run coverage:official # couverture connue et garde d'éligibilité simulation
npm run p1:status         # preuve détaillée des critères P1 fermés/bloqués
npm run p2:status         # preuves techniques et état des cinq élèves requis
npm run p3:check          # ferme les six gardes P3 ou échoue
npm run build             # génère dist/site/ + monofichier de façon déterministe
npm run release:verify    # vérifie contenu, octets, SHA-256 et identité du build
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

## 💾 Fin de session et persistance

- **Fin manuelle ou expiration** : sauvegarde immédiate, passage de la session à `completed` et verrouillage de la saisie.
- **Progression sauvegardée** (`localStorage`) : réponses, année/sujet, écran, étape et chronomètres sont validés avant restauration.
- Les identifiants de sessions Maths (`YYYY-m`) sont conservés sans collision avec Sciences expérimentales.
- Le rapport chiffré et les exports CSV/JSON ont été **supprimés** du produit : l'épreuve est le seul mode, et aucune note n'est affichée tant que la calibration humaine n'est pas faite.

---

## 🔧 Ajouter une année / un sujet

Créer un payload `data/years/<filière>/year-<année>.js`, puis ajouter sa métadonnée et son import dynamique à la table `YEAR_CATALOG` de `data/subjects.js`. Pour les archives SE 2013–2019, `scripts/generate-archive-years.mjs` régénère directement ces payloads. Pour un exercice, déclarer notamment la règle d'évaluation :

```js
N: { points: 1, prompt: "…", minLength: 40,
     rule: { keywords: ["الادينوزين", "اليقظه"], minHits: 2, forbidden: ["بسبب"] } }
```

---

## 🧭 Version monofichier

`dist/boussole-4d-standalone.html` embarque le CSS et le bundle JS ; aucun PDF tiers n’est embarqué.
Il s'ouvre via `file://` sans enregistrer de service worker. Les PDF des autres années restent des liens externes optionnels, puisqu'ils ne sont pas redistribués dans le dépôt. Régénérer avec `npm run build`.
