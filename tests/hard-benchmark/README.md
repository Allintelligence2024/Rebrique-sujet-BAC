# Hard Benchmark — validation sur copies réelles à double correction

`cases.json` est volontairement vide : **ne jamais inventer une copie d'élève**.
Le moteur de notation n'est pas considéré comme fiable tant qu'il n'existe pas un
corpus de copies réelles, anonymisées, et évaluées indépendamment par deux
correcteurs humains distincts.

## Règle de validation

Chaque copie doit contenir **deux annotations indépendantes**. Une annotation
porte une note chiffrée pour le pôle et une justification. Si les deux notes
s'écartent matériellement, ajoutez une `adjudication` par un troisième
correcteur avant de l'utiliser pour calibrer le moteur.

```json
{
  "id": "2025-S1-E1-N-001",
  "year": "2025",
  "sujet": 1,
  "exercise": 1,
  "pole": "N",
  "category": "bonne-forme-fond-faux",
  "answer": "... transcription fidèle, fautes comprises ...",
  "source": "centre-X / copie anonymisée",
  "collector": "collecteur-01",
  "annotations": [
    { "annotator": "correcteur-01", "score": 0.5, "note": "notion ARN présente, problème mal formulé" },
    { "annotator": "correcteur-02", "score": 0.5, "note": "réponse partielle, formulation insuffisante" }
  ],
  "date": "2026-08-25"
}
```

Les identifiants des correcteurs et des collecteurs doivent être pseudonymisés.
Ne stockez jamais nom, prénom, établissement, numéro de candidat, date de
naissance, signature, scan non anonymisé ou toute autre donnée personnelle.

## Collecte obligatoire

1. Obtenir l'autorisation de collecte et anonymiser la copie avant toute saisie.
2. Transcrire mot pour mot, y compris les erreurs utiles à l'évaluation.
3. Faire noter séparément la réponse par **deux correcteurs** sans leur montrer
   l'autre annotation ni le score du moteur.
4. En cas de désaccord important, faire arbitrer par un troisième correcteur et
   renseigner `adjudication`.
5. Importer uniquement le JSON anonymisé et exécuter les tests.

## Import

```bash
node tests/hard-benchmark/import-copy.mjs /tmp/copie.json --dry-run
node tests/hard-benchmark/import-copy.mjs /tmp/copie.json
npm run test:hard
```

L'import refuse les copies avec une annotation unique ou avec deux annotations
portant le même identifiant de correcteur. Il vérifie aussi que le pôle existe
réellement dans `data/subjects.js`.

## Métriques et révision des règles

```bash
npm run calibration
```

Le rapport affiche la couverture par pôle, l'erreur absolue moyenne entre le
moteur et la référence humaine, le biais de sur/sous-évaluation et l'écart
moyen entre les deux correcteurs. Avec zéro copie, il affiche explicitement
`non calibré` : aucune métrique ne doit être inventée.

Toute évolution de règle après copies réelles suit
[`RULE_REVIEW.md`](RULE_REVIEW.md) et doit commencer par un test de régression
sur la copie anonymisée concernée.

## Seuil avant toute promesse de « correcteur »

Ne présentez pas les scores comme une correction BAC avant d'avoir, au minimum :

- 15 copies réelles par pôle actif, couvrant réponses fortes, faibles, fausses
  et hors sujet ;
- deux annotations indépendantes par copie ;
- des mesures publiées d'écart score moteur / score humain, de sur- et
  sous-évaluation, et de désaccord entre correcteurs.

Avant ces mesures, le produit reste un **outil de feedback méthodologique**.
