# INDEX DES PATCHES POUR ANTIGRAVITY

Ce dossier contient tous les fichiers nécessaires pour que **Antigravity** termine le travail sur l'archive BAC.

---

## 📁 STRUCTURE

```
patches/
├── INDEX.md                    # Ce fichier
├── README.md                   # Documentation complète
├── ANTIGRAVITY_TODO.md          # Checklist détaillée
├── apply-patches.sh            # Script d'application automatique
├── ci-workflow-fix.patch       # Patch Git pour le workflow CI
└── antigravity-fix-archive.patch # Instructions complètes
```

---

## 🎯 QUE FAIRE ?

### Si tu es **Antigravity** :
1. **Lis `ANTIGRAVITY_TODO.md`** → C'est ta checklist complète
2. **Exécute `./apply-patches.sh`** → Applique automatiquement le patch CI
3. **Vérifie les 9 PDF** → `node scripts/verify-archive-pdfs.mjs`
4. **Merge la branche** → `git merge arena/01a0533b-rebrique-sujet-bac`

### Si tu veux tout faire manuellement :
1. **Applique le patch CI** : `git apply ci-workflow-fix.patch`
2. **Vérifie les PDF** : Ouvre les 9 liens dans `ANTIGRAVITY_TODO.md`
3. **Met à jour `data/archive.js`** : Change `contentVerified: false` → `true`
4. **Teste** : `npm test`
5. **Merge** : Vers `main`

---

## 📊 ÉTAT DES LIEUX

| Élément | Branche | Statut | Commit |
|---------|---------|--------|--------|
| Corrections archive | `arena/01a0533b-rebrique-sujet-bac` | ✅ Poussé | c9eb3f1, 2f7c028 |
| Fix CI workflow | `fix/ci-workflow-permissions` | ⏳ À appliquer | aaf40aa |
| Vérification PDF | Local | ⏳ À faire | - |

---

## 🔥 PRIORITÉS

### 🔴 CRITIQUE (BLOQUANT)
1. **Appliquer `ci-workflow-fix.patch`** → Sans ça, la CI ne tourne pas sur main
2. **Vérifier les 9 PDF** → Sans ça, 47% de l'archive reste non validé

### 🟡 IMPORTANT
3. **Mettre à jour `contentVerified`** après vérification des PDF
4. **Tester avec `npm test`** avant de merger

### 🟢 OPTIONNEL
5. **Lire `antigravity-fix-archive.patch`** pour le contexte complet

---

## 💬 RÉSUMÉ EN 30 SECONDES

```
Antigravity doit:
1. git apply patches/ci-workflow-fix.patch
2. node scripts/verify-archive-pdfs.mjs
3. Éditer data/archive.js → contentVerified: true pour les 9 entrées
4. git commit -am "fix: vérification PDF terminée"
5. git push
6. git checkout main && git merge arena/01a0533b-rebrique-sujet-bac
```

---

## 📞 AIDE

- **Problème avec le patch ?** → Voir `README.md`
- **Problème avec les PDF ?** → Voir `scripts/VERIFY_PDFS.md`
- **Problème avec la CI ?** → Voir l'issue [#13](https://github.com/Allintelligence2024/Rebrique-sujet-BAC/issues/13)
