# Patches pour Antigravity

Ce dossier contient les patches à appliquer pour finaliser le travail sur l'archive BAC.

## 📋 Liste des patches

### 1. `ci-workflow-fix.patch`
**Fichier cible :** `.github/workflows/quality.yml`
**Objectif :** Étendre la CI pour qu'elle tourne sur `main` et toutes les branches `arena/**`

**Comment appliquer :**
```bash
# Depuis la branche main ou target:
git apply patches/ci-workflow-fix.patch
# Ou manuellement:
# Modifier la ligne 5 de .github/workflows/quality.yml
# De: branches: [arena/01a0376b-rebrique-sujet-bac]
# À:  branches: [main, arena/**]
```

**Pourquoi c'est nécessaire :**
Actuellement, la CI ne tourne **pas sur `main`**, ce qui permet de merger du code non validé.

---

### 2. `antigravity-fix-archive.patch`
**Contenu :** Instructions complètes pour Antigravity
- Fix CI workflow (même que ci-workflow-fix.patch)
- Liste des 9 PDF à vérifier manuellement
- Instructions pour mettre à jour `contentVerified` après vérification
- Checklist de merge

**À faire après application :**
1. Vérifier les 9 PDF bloqués (voir le patch pour les liens)
2. Mettre à jour `data/archive.js` avec `contentVerified: true` pour les PDF valides
3. Pousser les modifications

---

## 🎯 Workflow complet pour Antigravity

### Étape 1: Appliquer le fix CI
```bash
git checkout main
git apply patches/ci-workflow-fix.patch
git add .github/workflows/quality.yml
git commit -m "fix(ci): étend workflow à main et arena/**"
git push origin main
```

### Étape 2: Vérifier les PDF
```bash
# Cloner la branche avec les corrections
git checkout arena/01a0533b-rebrique-sujet-bac

# Exécuter le script de vérification (nécessite accès réseau)
node scripts/verify-archive-pdfs.mjs

# Si tous les PDF sont OK, mettre à jour data/archive.js:
# Pour chaque entrée avec contentVerified: false et viewer: "blocked"
# Changer:
#   page: "access_confirmed" → "consulted"
#   contentVerified: false → true
```

### Étape 3: Merger vers main
```bash
git checkout main
git merge arena/01a0533b-rebrique-sujet-bac
# Attendre CI SUCCESS
```

---

## 📊 Statut actuel

| Tâche | Statut | Responsable |
|-------|--------|-------------|
| Corrections archive.js | ✅ Done | Déjà poussé |
| Tests archive | ✅ Done | Déjà poussé |
| Script vérification PDF | ✅ Done | Déjà poussé |
| Documentation | ✅ Done | Déjà poussé |
| **Fix CI workflow** | ⏳ Pending | Antigravity |
| **Vérification PDF** | ⏳ Pending | Antigravity |
| **Merge final** | ⏳ Pending | Antigravity |

---

## 💡 Notes

- Les commits `c9eb3f1` et `2f7c028` sur `arena/01a0533b-rebrique-sujet-bac` contiennent déjà la plupart des corrections.
- Seuls le workflow CI et la vérification des PDF restent à faire.
- Le patch `ci-workflow-fix.patch` est **minimal** et ne touche qu'une seule ligne.
