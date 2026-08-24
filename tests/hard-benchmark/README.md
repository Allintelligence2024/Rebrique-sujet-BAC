# Hard Benchmark — Pipeline de collecte de copies réelles

Aucune copie n'est inventée ici. `cases.json` reste vide tant qu'un
correcteur humain n'a pas importé une transcription anonymisée.

## Format `cases.json`

```json
{
  "id": "2025-S1-E1-N-001",
  "year": "2025",
  "sujet": 1,
  "exercise": 1,
  "pole": "N",
  "category": "bonne-forme-fond-faux",
  "answer": "...",
  "humanNote": "...",
  "source": "centre-X / copie anonymisée",
  "collector": "...",
  "annotator": "...",
  "date": "2026-08-23"
}
```

Catégories utiles : `excellent`, `incomplet`, `hors-sujet`, `methode-fausse`,
`bonne-forme-fond-faux`, `confusion-concepts`.

## Pipeline de collecte

Commande :

```bash
node tests/hard-benchmark/import-copy.mjs
# ou avec un fichier JSON :
node tests/hard-benchmark/import-copy.mjs /tmp/copie.json
# validation sans écriture :
node tests/hard-benchmark/import-copy.mjs /tmp/copie.json --dry-run
```

### 5 étapes manuelles

1. **Scan** — scanner le sujet officiel et les copies d'élèves.
2. **Anonymisation** — retirer nom, prénom, établissement, date de naissance.
3. **Transcription** — recopier la réponse mot pour mot (fautes comprises).
4. **Annotation** — un correcteur humain pose la catégorie et la note.
5. **Import** — lancer le script ; il valide le schéma, vérifie que le pôle
   existe dans `data/subjects.js`, génère un `id` `YYYY-SX-EY-P-NNN`,
   alerte en cas de marqueurs LLM, écrit dans `cases.json` trié, puis lance
   `npm run test:hard`.

Le script **n'invente jamais** de copie. Il refuse un pôle inexistant.
Il prévient (sans bloquer en mode fichier) si la réponse ressemble à du texte généré.
