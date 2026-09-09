# Plan de correction et d’amélioration

> État de référence : audit du commit `3a4b2409ca5862e7fe323bd08319db4ceb5a8bc9`.
> Verdict produit : **assistant de méthodologie supervisé**, pas « examen BAC complet » ni correcteur automatique.

## Règles de pilotage

1. **Ne plus promettre ce que les données ne couvrent pas.** Une consigne reconstruite doit être visible comme telle.
2. **Séparer entraînement guidé et simulation chronométrée.** Le mode actuel reste un entraînement tant que le mapping officiel est incomplet.
3. **Ne pas promouvoir une note automatique.** Les diagnostics heuristiques restent qualitatifs jusqu’à calibration sur des copies réelles doublement annotées.
4. **Aucun P1 avant fermeture des bloqueurs P0.** Sécurité, livraison, chronométrage et persistance passent avant de nouvelles fonctions.
5. Chaque lot doit ajouter des tests qui échouaient avant le correctif.

## P0 — Bloqueurs avant toute publication

| Lot  | Correctif             | Critère d’acceptation                                                                                                                                                                 | État    |
| ---- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| P0.1 | Vérité produit        | Aucune mention « examen complet » ; l’interface annonce un entraînement partiel ; la provenance officielle/reconstruite est visible dans la copie.                                    | Terminé |
| P0.2 | Serveur public        | Seuls `index.html`, `assets/`, `js/`, `data/`, le manifeste, le service worker et les deux PDF publics sont servis. `.git`, tests, sources de build et métadonnées retournent 404.    | Terminé |
| P0.3 | CSP et build autonome | L’application rend ses styles sous la CSP livrée. Le monofichier embarque CSS, JS et PDF locaux, ne référence ni manifeste/icône externe ni service worker sous `file://`.            | Terminé |
| P0.4 | Identifiants Maths    | Les identifiants `YYYY-m` survivent à la validation, à la persistance et au pipeline hard-benchmark.                                                                                  | Terminé |
| P0.5 | Durées et stratégie   | Sciences expérimentales = 270 min, Maths = 150 min. La calculatrice lit le nombre d’exercices et les maxima du sujet sélectionné ; un input trafiqué ne peut pas dépasser le maximum. | Terminé |
| P0.6 | Cycle de session      | Démarrage frais, restauration guide/stratégie/copie, fin manuelle, expiration automatique, verrouillage de la saisie et état persistant cohérent.                                     | Terminé |
| P0.7 | Régression            | Lint, typecheck, format, documentation, tests Node, build et E2E CI sont verts. Les routes privées font l’objet d’un test HTTP.                                                       | Terminé |

### Décisions P0 explicites

- La progression d’une année est conservée, mais **un nouveau démarrage remet le chronomètre et la navigation de session à zéro**.
- Quitter vers l’accueil termine la session chronométrée en cours sans effacer les réponses.
- À zéro, la session passe à `completed`, les champs et actions d’évaluation sont verrouillés, et aucune note BAC n’est inventée.
- La CSP P0 autorisait temporairement les styles inline (`style-src 'unsafe-inline'`). P1.6 les a supprimés et impose désormais `style-src 'self'`.

## P1 — Fiabilité pédagogique et architecture des sujets

| Lot                                      | État    | Avancement au 7 septembre 2026                                                                                                           |
| ---------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| P1.1 — Inventaire des tâches officielles | Bloqué  | 0/38 inventaires complets. Pilote 2025/S1/E1 : 2 tâches reliées à 4 étapes ; les autres ne seront pas inventés sans sources vérifiables. |
| P1.2 — Mesure de couverture              | Bloqué  | Moteur et rapport terminés, mais 0/38 sujets à 100 % ; un inventaire partiel reste `unknown`.                                            |
| P1.3 — Garde de simulation               | Terminé | Contrôle à la sélection et au rendu ; restauration altérée refusée ; 0 sujet réel éligible.                                              |
| P1.4 — Parcours séparés                  | Terminé | Entraînement guidé, simulation silencieuse par tâches officielles, puis relecture verrouillée après remise.                              |
| P1.5 — Corpus réel et calibration        | Bloqué  | Seuils et statut généré terminés ; 0/2 235 copies minimales réelles, consenties et doublement corrigées. Notes numériques masquées.      |
| P1.6 — CSP stricte et découpage UI       | Terminé | 0 style inline, `style-src 'self'`, simulation et présentation extraites du contrôleur workspace.                                        |

1. Modéliser les **questions officielles** indépendamment des quatre gestes méthodologiques N/S/E/W.
2. Mapper toutes les sous-questions, barèmes, documents et pages ; calculer automatiquement un taux de couverture par sujet.
3. Refuser le mode simulation si la couverture officielle n’atteint pas 100 %.
4. Séparer les écrans :
   - entraînement guidé avec indices et modèles ;
   - simulation sans indice, sans réponse modèle et sans diagnostic pendant l’épreuve ;
   - relecture après remise.
5. Construire un corpus réel, consenti et anonymisé : deux correcteurs indépendants, bornes de score contextuelles, arbitrage documenté.
6. Définir avant promotion : MAE maximale, biais maximal, taux de faux positifs/négatifs et couverture minimale par catégorie/pôle.
7. Supprimer les notes numériques heuristiques tant que ces seuils ne sont pas satisfaits.
8. Éliminer les styles inline, passer à une CSP stricte sans `unsafe-inline`, et réduire les responsabilités de `ui.js`/`workspace.js`.

### Définition mesurable de « P1 terminé »

`npm run p1:status` publie les preuves des six lots ; `npm run p1:check` échoue tant qu'un seul reste bloqué. P1.1 exige 38 inventaires officiels complets et valides. P1.2 exige 100 % de couverture explicite pour ces 38 sujets. P1.5 exige au minimum 15 copies par pôle officiellement vérifié, les quatre catégories et le respect des cinq seuils d'erreur/désaccord de `data/calibration-policy.js`. Au 7 septembre 2026, **3 critères sur 6** sont fermés : P1 est donc incomplet, indépendamment de la quantité de code livrée.

Les données manquantes ne peuvent pas être synthétisées : il faut les sujets et barèmes officiels vérifiables pour les 37 inventaires absents, puis un processus humain de consentement, anonymisation et double correction. Falsifier ces éléments pour afficher 100 % violerait les règles de pilotage 1 et 3.

## P2 — Parcours élève, accessibilité et design

1. Réparer le lien d’évitement, le focus de route, les libellés uniques, les modales et les annonces live.
2. Rendre l’ordre des exercices libre ; réserver les verrous aux règles pédagogiques justifiées.
3. Simplifier le vocabulaire visuel autour d’une seule métaphore : **le parcours méthodologique en quatre gestes**.
4. Uniformiser la langue principale de l’interface ; retirer les avertissements français au milieu du flux arabe.
5. Corriger le contraste de `--dim`, augmenter les petites tailles arabes et tester à 200 % de zoom.
6. Donner un vrai flux au brouillon : édition, insertion vérifiable, sauvegarde et retour dans la copie.
7. Tester avec au moins cinq élèves sur mobile bas de gamme ; mesurer abandon, temps d’accès à une question et incompréhensions.

### Suivi P2 — 8 septembre 2026

| Lot  | Preuve d’acceptation                                                                                                                                 | État    |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| P2.1 | Lien d’évitement arabe, focus sur le titre à chaque route, identifiants de champs uniques, annonces live, modales/tiroirs isolés et retour de focus. | Terminé |
| P2.2 | Les boutons d’exercice changent directement d’exercice ; aucune réponse préalable n’est exigée.                                                      | Terminé |
| P2.3 | Le vocabulaire visible emploie le parcours en quatre étapes ; boussole, dents, cheval et décisions imagées ont été retirés de la présentation.       | Terminé |
| P2.4 | Les libellés et avertissements du parcours élève sont en arabe ; les anciens messages français du brouillon et du lecteur PDF ont été traduits.      | Terminé |
| P2.5 | `--dim` atteint AA, les petits textes arabes ont un plancher de 0,9 rem et la CI teste le reflow équivalent à 200 % sur une largeur utile de 640 px. | Terminé |
| P2.6 | Le brouillon permet édition, contrôle bloquant, sauvegarde, insertion, fermeture du tiroir et retour de focus dans la réponse.                       | Terminé |
| P2.7 | Cinq élèves distincts, consentants, avec sessions pseudonymisées sur mobile bas de gamme selon `docs/P2_USABILITY_PROTOCOL.md`. État actuel : 0/5.   | Bloqué  |

`npm run p2:status` publie ces preuves et `npm run p2:check` reste rouge jusqu’à cinq sessions humaines valides. Les six corrections techniques ne remplacent pas le test utilisateur.

## P3 — PWA, performance et exploitation

1. Découper les données par filière/année et charger à la demande.
2. Ne précacher que le shell ; mettre les PDF en téléchargement explicite avec taille annoncée.
3. Inclure manifeste, icônes et PDF dans le versionnage ou utiliser des noms de fichiers hachés.
4. Borner le cache runtime, ne jamais mettre en cache une réponse en échec, prévoir une stratégie d’éviction.
5. Ajouter observabilité sans données personnelles : erreurs techniques agrégées, version de build, état offline.
6. Publier un artefact de production déterministe et documenter le déploiement/rollback.

## P4 — Publication responsable

1. Choisir et ajouter une licence compatible avec les données et le code.
2. Documenter les droits de redistribution des sujets/corrigés et retirer tout document sans droit clair.
3. Ajouter politique de confidentialité, durée de conservation locale, procédure d’effacement et avertissement appareils partagés.
4. Expliquer l’usage du microphone avant permission ; aucun enregistrement audio ne doit être conservé.
5. Ajouter mentions légales, responsable éditorial scientifique et procédure de signalement d’erreur.
6. Ne déclarer « prêt production » qu’après revue scientifique indépendante et validation P0–P3.

## Ordre d’exécution immédiat

1. Fermer P0.2 et P0.3, car le serveur actuel expose le dépôt et la CSP casse le rendu.
2. Fermer P0.4 et P0.5 avec tests unitaires sur une année Maths et une année Sciences.
3. Fermer P0.6 avec tests de migration, démarrage, restauration et expiration.
4. Fermer P0.1 dans tous les textes visibles et le README.
5. Exécuter toute la matrice P0.7, corriger les régressions, puis seulement ouvrir P1.

## Validation du lot

Validation du 7 septembre 2026 : `lint`, `typecheck`, `format:check`, `docs:check`, les 215 tests Node et le build autonome passent. Le test HTTP confirme la liste blanche et les 404 sur les routes privées. Le téléchargement Chromium local échoue sur le CDN Playwright avec `ECONNRESET`, mais la CI Quality `34146913531` a installé Chromium et validé toute la matrice, dont les 13 tests E2E et le nouveau parcours Maths.

## Définition de « P0 terminé »

P0 n’est terminé que si les sept lignes P0 sont cochées, si l’arbre Git ne contient aucun artefact de build, si toutes les commandes qualité passent, et si la CI E2E confirme le parcours Sciences **et** Maths sur le commit livré.
