# Audit — barème officiel et consignes officielles

Constat du propriétaire (2026-09-21), vérifié sur les PDF du dépôt :

1. « le barème des bac doit être par point de chaque année comme distribué
   suivant le sujet » ;
2. « les questions ne sont pas identiques au sujet, il faut qu'elles soient
   identiques ».

Cet audit **chiffre** les deux écarts et **localise** le travail restant. Il ne
corrige rien à lui seul : les corrections sont du travail de relecture humaine
page à page (voir « Méthode »).

Rappel : l'écriture des PDF n'est pas en cause. Les 58 fichiers `subjects/**`
ont été mesurés (ouverture pdf.js, nombre de pages, rendu page 1) :
**0 fichier corrompu**. Ce qui est illisible par endroits, c'est la
photocopie d'origine — traitée séparément par le mode « وضوح » du lecteur
(`js/ui/pdf-renderer.js`).

---

## 1. Le barème encodé est un gabarit, pas le barème du sujet

### Ce que le dépôt encode aujourd'hui

Le barème est **identique pour toutes les années d'une même filière**, et
**identique entre le sujet 1 et le sujet 2** d'une même année :

| Filière | Sujets | Barème encodé, quelle que soit l'année |
| ------- | ------ | -------------------------------------- |
| SE      | 1 et 2 | `5 + 7 + 8`                            |
| M       | 1 et 2 | `10 + 10` (2013-2015), `8 + 12` (2018-2021), `7 + 13` (2024) |

`144 exercices`, `1 160 points` cumulés, `0` exercice sans barème.

### Ce que disent les sujets officiels

Relevé à la lecture de l'image des PDF (les chiffres ne sont pas extractibles :
la couche texte est absente ou transposée, voir `npm run pdftext:status`) :

| Sujet        | Exercice | PDF officiel  | Données encodées | Verdict |
| ------------ | -------- | ------------- | ---------------- | ------- |
| SE 2013, s1  | 1        | **08 نقاط**   | 5                | ✗       |
| SE 2013, s1  | 2        | **08 نقاط**   | 7                | ✗       |
| SE 2013, s1  | 3        | **04 نقاط**   | 8                | ✗       |
| SE 2014, s1  | 1        | **06 نقاط**   | 5                | ✗       |
| SE 2014, s1  | 2        | **06 نقاط**   | 7                | ✗       |
| M 2018, s1   | 1        | **07 نقاط**   | 8                | ✗       |
| M 2018, s1   | 2        | **13 نقطة**   | 12               | ✗       |
| SE 2024, s1  | 1 / 2 / 3| **05 / 07 / 08** | 5 / 7 / 8     | ✓       |

Deux conséquences que le gabarit masque :

- l'**ordre de grandeur** peut être faux, pas seulement la valeur : SE 2013
  exercice 3 pèse 4 points, pas 8 — le sujet donne 8 points à l'exercice 1
  et 8 au deuxième, pas 5 et 7 ;
- le gabarit ne peut pas être juste par construction : il est le même pour
  deux sujets différents de la même session, alors que les exercices changent
  de thème et de taille d'un sujet à l'autre.

À l'inverse, `SE 2024 s1` est conforme : le gabarit `5 + 7 + 8` s'y trouve être
le vrai barème. C'est ce qui rend l'erreur difficile à voir sans relecture.

### Pourquoi l'OCR ne suffit pas

Les extractions déjà présentes (`scripts/extracted/**`) contiennent les
en-têtes, mais les **chiffres y sont corrompus** — mesuré :

| Fichier OCR                    | Ligne extraite       | Réel      |
| ------------------------------ | -------------------- | --------- |
| `SE/2018/sujet-2.txt`          | `40 نقاط` ×3         | 5, 7, 8   |
| `SE/2016/sujet-2.txt`          | `46 / 47 / 47 نقاط`  | 6, 7, 7   |
| `SE/2017/sujet-1.txt`          | `45 / 17 / 48 نقاط`  | 5, 7, 8   |

Aucune correction automatique n'est donc possible : **la seule source fiable
est l'image de la page**, comme le note déjà `scripts/VERIFY_PDFS.md`.

---

## 2. Les consignes : 52 % ne viennent pas du sujet

Comptage de `bacPromptSource` sur `data/years/**` :

| Source           | Nombre | Part |
| ---------------- | ------ | ---- |
| `official`       | 277    | 48 % |
| `reconstructed`  | 299    | **52 %** |

`reconstructed` = étape pédagogique **écrite par le projet**, pas une question
du sujet. Répartition par année (consignes reconstruites / total) :

| Filière | Années 100 % reconstruites | Années partiellement reconstruites |
| ------- | -------------------------- | ---------------------------------- |
| SE      | **2013 → 2019** (24/24 chacune) | 2020 (7/24), 2021 (8/24), 2022 (10/24), 2023 (10/24), 2024 (16/24), 2025 (8/24), 2026 (7/24) |
| M       | —                          | 2024 (7/16), 2013-2016 (4/16), 2017 (4/16), 2025 (6/16), 2023 (6/16) |

Autrement dit : **toute la filière SE de 2013 à 2019 est à recopier depuis les
PDF**.

Le dépôt ne ment pas : ces étapes sont badgées `⚠️` et la politique
`data/bac-mode-policy.js` les autorise explicitement en connaissance de cause
(`allowReconstructedPrompts`). Mais elles ne répondent pas à l'exigence
« questions identiques au sujet ».

### Ce que « identique » exige, sujet par sujet

Le relevé de `SE 2013, s1` montre que l'écart n'est pas seulement la
formulation : le découpage en pôles `N/S/E/W` est lui-même une invention du
projet, la structure officielle étant `I-` / `II-` :

| Exercice | Structure officielle                                  | Pôles encodés |
| -------- | ----------------------------------------------------- | ------------- |
| 1        | `1-a, 1-b, 1-c, 1-d, 2-a, 2-b, 2-c, 3, 4-a, 4-b, 4-c, 5` | N, S, E, W |
| 2        | `I-1, I-2, I-3, II-1, II-2, II-3, II-4-a, II-4-b`     | N, S, E, W |
| 3        | `I-1, I-2, I-3, I-4, II-1, II-2`                      | N, S, E, W |

Recopier les consignes suppose donc aussi de **redécouper les pôles** sur la
numérotation réelle — et de redistribuer les points à l'intérieur de chaque
exercice. C'est un travail de données, pas un remplacement de chaînes.

---

## 3. Méthode de vérification (à réutiliser)

```bash
npm ci                                   # jsdom/pdfjs requis par les outils
node scripts/render-pdf-pages.mjs subjects/SE/2013/sujet-1.pdf 1,2,3,4 1.8
# -> rendered/*.png, à lire à l'œil : c'est la seule source fiable du barème
npm run pdftext:status                   # classe la couche texte des 58 PDF
node review/render.tmp.mjs <pdf> all 1.8 # variante : rendu page par page
```

Le fichier `review/render.tmp.mjs` est un outil de travail (non suivi par git)
équivalent à `scripts/render-pdf-pages.mjs` ; le second, déjà versionné, suffit.

Ordre de travail retenu avec le propriétaire :

1. **barème** — année par année, les deux filières ensemble ;
2. **consignes** — filière SE en priorité (2013 → 2019 d'abord) ;
3. lisibilité — fait (mode « وضوح », voir `js/ui/pdf-renderer.js`).

---

## 4. État du chantier

| Chantier                                  | État |
| ----------------------------------------- | ---- |
| Lisibilité des photocopies pâles          | **fait** — mode « وضوح » + zoom jusqu'à 300 % |
| Intégrité des 58 PDF                      | **vérifié** — 0 fichier corrompu |
| Barème officiel                           | à corriger — 8 relevés ci-dessus, 58 sujets à relire |
| Consignes officielles (SE 2013 → 2019)    | à corriger — 144 consignes à recopier |
| Consignes officielles (SE 2020 → 2026)    | à corriger — 66 consignes reconstruites |
| Consignes officielles (M)                 | à corriger — 44 consignes reconstruites |

Aucune correction de barème ou de consigne n'est encodée tant que la page
n'a pas été relue : c'est la règle que le dépôt s'est déjà donnée
(`PROMPT_RESTANT.md`, TRAVAIL C) et l'inverse produirait exactement l'erreur
constatée ici.
