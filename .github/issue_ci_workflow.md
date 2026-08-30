**Problème:**
Le workflow `.github/workflows/quality.yml` ne tourne que sur la branche `arena/01a0376b-rebrique-sujet-bac`, et **pas sur `main`**.

**Impact:**
- Après un merge sur main, **la CI ne s'exécute pas**
- On peut merger du code non validé sans preuve CI
- Cela viole la règle: *attendre la CI sur le nouveau SHA avant de merger*

**Solution:**
Modifier le workflow pour qu'il tourne sur `main` et toutes les branches `arena/**`:

```yaml
on:
  push:
    branches: [main, arena/**]
  pull_request:
```

**Fichier à modifier:** `.github/workflows/quality.yml`
**Ligne à changer:** `branches: [arena/01a0376b-rebrique-sujet-bac]` → `branches: [main, arena/**]`

**Note:** Cette modification nécessite la permission `workflows` sur le dépôt.