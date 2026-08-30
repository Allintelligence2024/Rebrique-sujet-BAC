# 🎯 TODO LIST POUR ANTIGRAVITY

**Contexte :** Le travail sur l'archive BAC a été partiellement complété. Il reste 2 tâches critiques à finaliser.

---

## 🚨 TACHES CRITIQUES (BLOQUANTES POUR LE MERGE)

### Tâche 1: Corriger le workflow CI
**Fichier :** `.github/workflows/quality.yml`
**Ligne à modifier :** 5
**Modification :**
```yaml
# AVANT:
branches: [arena/01a0376b-rebrique-sujet-bac]

# APRÈS:
branches: [main, arena/**]
```

**Pourquoi :**
- Actuellement, la CI **ne tourne pas sur `main`**
- On peut merger du code non validé sans preuve CI
- Cela viole la règle: *attendre la CI sur le nouveau SHA avant de merger*

**Comment appliquer :**
```bash
# Méthode 1: Patch automatique
git apply patches/ci-workflow-fix.patch

# Méthode 2: Manuel
nano .github/workflows/quality.yml  # Modifier la ligne 5
```

**Validation :**
```bash
git diff .github/workflows/quality.yml
# Doit afficher: - branches: [arena/01a0376b-rebrique-sujet-bac]
#               + branches: [main, arena/**]
```

---

### Tâche 2: Vérifier les 9 PDF bloqués
**Fichier :** `data/archive.js` (9 entrées avec `contentVerified: false`)

**Liste des PDF à vérifier :**

| # | Année | Filière | Session | Lien PDF | Action |
|---|-------|---------|---------|----------|--------|
| 1 | 2018 | SE | main | [Lien](https://www.dzexams.com/uploads/sujets/officiels/bac/2018/dzexams-bac-sciences-3509975.pdf) | ⬜ |
| 2 | 2016 | SE | exceptional | [Lien](https://www.dzexams.com/uploads/sujets/officiels/bac/2016-2/dzexams-bac-sciences-3814840.pdf) | ⬜ |
| 3 | 2014 | SE | main | [Lien](https://www.dzexams.com/uploads/sujets/officiels/bac/2014/dzexams-bac-sciences-4380238.pdf) | ⬜ |
| 4 | 2019 | M | main | [Lien](https://www.dzexams.com/uploads/sujets/officiels/bac/2019/dzexams-bac-sciences-2280992.pdf) | ⬜ |
| 5 | 2018 | M | main | [Lien](https://www.dzexams.com/uploads/sujets/officiels/bac/2018/dzexams-bac-sciences-1967487.pdf) | ⬜ |
| 6 | 2017 | M | main | [Lien](https://www.dzexams.com/uploads/sujets/officiels/bac/2017/dzexams-bac-sciences-2275712.pdf) | ⬜ |
| 7 | 2015 | M | main | [Lien](https://www.dzexams.com/uploads/sujets/officiels/bac/2015/dzexams-bac-sciences-2723927.pdf) | ⬜ |
| 8 | 2014 | M | main | [Lien](https://www.dzexams.com/uploads/sujets/officiels/bac/2014/dzexams-bac-sciences-2369148.pdf) | ⬜ |
| 9 | 2013 | M | main | [Lien](https://www.dzexams.com/uploads/sujets/officiels/bac/2013/dzexams-bac-sciences-2770867.pdf) | ⬜ |

**Comment vérifier :**
```bash
# Méthode 1: Script automatique (recommandé)
node scripts/verify-archive-pdfs.mjs

# Méthode 2: Manuel (navigateur)
# Ouvrir chaque lien et vérifier:
# - Le PDF s'affiche correctement
# - Il contient sujet + correction
# - Le fichier n'est pas corrompu

# Méthode 3: cURL
curl -I "https://www.dzexams.com/uploads/sujets/officiels/bac/2018/dzexams-bac-sciences-3509975.pdf"
# Doit retourner: HTTP/2 200
```

**Après vérification :**
Pour chaque PDF valide, mettre à jour `data/archive.js`:
```javascript
// Trouver l'entrée correspondante et modifier:
{
  year: "2018",
  stream: "se",
  session: "main",
  page: "access_confirmed",    // ← Changer en "consulted"
  contentVerified: false,      // ← Changer en true
  viewer: "blocked",
  // ...
}
```

**Validation :**
```bash
# Vérifier que toutes les entrées ont contentVerified: true
grep -c "contentVerified: false" data/archive.js
# Doit retourner: 0
```

---

## ✅ TACHES DÉJÀ TERMINÉES (NE PAS REFAIRE)

| Tâche | Statut | Commit |
|-------|--------|--------|
| Ajout `contentVerified` à toutes les entrées | ✅ Done | c9eb3f1 |
| Correction des statuts `page` | ✅ Done | c9eb3f1 |
| Ajout des tests de validation | ✅ Done | c9eb3f1 |
| Création du script de vérification PDF | ✅ Done | c9eb3f1 |
| Documentation complète | ✅ Done | 2f7c028 |

---

## 📋 CHECKLIST FINALE AVANT MERGE

- [ ] ✅ Workflow CI corrigé (tourne sur `main` et `arena/**`)
- [ ] ✅ Tous les 9 PDF bloqués vérifiés et `contentVerified: true`
- [ ] ✅ `grep -c "contentVerified: false" data/archive.js` retourne 0
- [ ] ✅ `npm test` passe sans erreur
- [ ] ✅ CI SUCCESS sur le commit de merge
- [ ] ✅ Merge de `arena/01a0533b-rebrique-sujet-bac` vers `main`

---

## 🎯 COMMANDES RAPIDES

```bash
# 1. Appliquer le fix CI
git apply patches/ci-workflow-fix.patch

# 2. Vérifier les PDF
node scripts/verify-archive-pdfs.mjs

# 3. Mettre à jour les statuts (si tous les PDF sont OK)
# Éditer data/archive.js et changer contentVerified: false → true
# pour les 9 entrées bloquées

# 4. Tester
npm test

# 5. Merger
git checkout main
git merge arena/01a0533b-rebrique-sujet-bac
```

---

## 💡 NOTES IMPORTANTES

1. **Ne pas merger avant d'avoir complété les 2 tâches critiques**
2. **La branche `arena/01a0533b-rebrique-sujet-bac` contient déjà toutes les corrections** (sauf le workflow CI)
3. **Le patch `ci-workflow-fix.patch` ne modifie qu'une seule ligne** dans un seul fichier
4. **La vérification des PDF nécessite un accès réseau** à dzexams.com (impossible depuis la sandbox)

---

## 📞 EN CAS DE PROBLÈME

- Voir `scripts/VERIFY_PDFS.md` pour des instructions détaillées
- Voir `antigravity-fix-archive.patch` pour le contexte complet
- Consulter l'issue [#13](https://github.com/Allintelligence2024/Rebrique-sujet-BAC/issues/13) pour le workflow CI

---

**Statut :** 2 tâches critiques restantes (CI workflow + vérification PDF)
**Temps estimé :** 10-15 minutes (si réseau disponible)
**Risque :** Élevé si merge sans vérification (47% de l'archive non validé)
