# Hard Benchmark — Pipeline de collecte de copies réelles

## Format `cases.json`

Chaque entrée représente une copie d'élève réelle pour un pôle donné.

```json
{
  "id": "2025-S1-E1-N-001",
  "year": "2025",
  "sujet": 1,
  "exercise": 1,
  "pole": "N",
  "category": "reconstructed",
  "answer": "...",
  "humanNote": "...",
  "source": "...",
  "collector": "...",
  "annotator": "...",
  "date": "2025-08-23"
}
```

## Commande d'import

```bash
node tests/hard-benchmark/import-copy.mjs
```

## Étapes manuelles

1. Scan du sujet officiel
2. Anonymisation des copies
3. Transcription des réponses
4. Annotation par un correcteur
5. Import via le script ci-dessus
