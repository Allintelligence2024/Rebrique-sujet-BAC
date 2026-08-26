# Prompt de reprise pour Antigravity

Travaille sur le dépôt `Allintelligence2024/Rebrique-sujet-BAC` après le commit `892a18b`. Ne fabrique aucun résultat de test et conserve les avertissements pédagogiques existants.

## Trois tâches restantes

1. **Exécuter réellement Playwright avec Chromium**
   - Utiliser un environnement où Chromium et ses dépendances système peuvent être installés.
   - Exécuter `npm ci`, `npx playwright install --with-deps chromium`, puis `npm run test:e2e`.
   - Corriger les éventuels défauts applicatifs ou E2E, sans contourner ni désactiver les assertions.
   - Consigner la version de Chromium, la commande et le résultat exact.

2. **Confirmer la CI distante sur le commit final**
   - Vérifier que le workflow GitHub Actions `Quality` s'exécute sur la branche ou la PR finale.
   - Exiger la réussite de lint, typecheck, format, docs, tests unitaires, build, installation Chromium et Playwright.
   - Ne pas conclure que la CI est confirmée à partir d'un run d'une autre branche ou d'un autre SHA.
   - Fournir l'URL et le SHA du run réussi.

3. **Poursuivre la réduction de `js/ui/screens/workspace.js`**
   - Le fichier compte actuellement environ 765 lignes.
   - Extraire en priorité un contrôleur cohérent supplémentaire, par exemple le brouillon ou le pipeline, sans simple déplacement artificiel de dépendances.
   - Ajouter des tests unitaires directs pour chaque nouveau module.
   - Conserver les tests de parcours existants et vérifier qu'aucune régression d'accessibilité n'est introduite.

## Validation finale obligatoire

```bash
npm run lint
npm run typecheck
npm run format:check
npm run docs:check
npm test
npm run calibration
npm run build
npm run test:e2e
git diff --check
```

Signaler clairement toute étape impossible ou non exécutée au lieu de la présenter comme réussie.
