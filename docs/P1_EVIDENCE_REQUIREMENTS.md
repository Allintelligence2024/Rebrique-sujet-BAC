# P1 — preuves externes requises pour fermer les trois lots bloqués

Le dépôt peut contrôler les preuves, mais il ne peut pas les fabriquer. `npm run p1:check` doit rester rouge tant que les éléments ci-dessous ne sont pas fournis et audités.

## P1.1 / P1.2 — 38 inventaires officiels

Pour chacun des 38 couples année/sujet configurés :

1. énoncé officiel identifiable et date de vérification ;
2. liste exhaustive des exercices, questions et sous-questions, dans l'ordre ;
3. page de chaque tâche et références exactes aux documents utilisés ;
4. maximum de points vérifié sur un barème officiel traçable ;
5. total par exercice et par sujet cohérent avec la configuration ;
6. mapping explicite tâche officielle → geste(s) N/S/E/W, sans transformer les quatre gestes en quatre fausses questions ;
7. statut `complete` uniquement après relecture exhaustive.

Un thème, un corrigé non attribué ou une consigne reconstruite ne suffit pas. Une URL accessible ne prouve pas que son contenu a été relu. Le premier pilote couvre seulement 2025/S1/E1.

## P1.5 — corpus humain

Le périmètre numérique actuel contient 149 pôles dont la consigne est marquée officielle. La politique exige au minimum 15 copies par pôle : **2 235 réponses réelles** au minimum, chacune avec :

- consentement et anonymisation vérifiables ;
- transcription fidèle ;
- deux corrections indépendantes, aveugles l'une à l'autre et au moteur ;
- arbitrage en cas d'écart matériel ;
- manifeste d'audit et empreintes SHA-256 contrôlés par une troisième personne.

Les quatre catégories (`strong`, `weak`, `scientifically-wrong`, `off-topic`) doivent apparaître pour chaque pôle. Même avec cette couverture, la promotion numérique reste refusée si un seuil échoue :

- MAE normalisée > 15 % ;
- biais normalisé absolu > 5 % ;
- faux positifs > 10 % ;
- faux négatifs > 10 % ;
- désaccord intercorrecteurs normalisé > 15 %.

## Commandes de contrôle

```bash
npm run coverage:official
npm run calibration
npm run calibration:check
npm run p1:status
npm run p1:check # doit échouer aujourd'hui
```

Ne jamais contourner le dernier échec en abaissant les seuils après observation des résultats, en dupliquant une copie, en inventant un correcteur ou en promouvant un inventaire partiel.
