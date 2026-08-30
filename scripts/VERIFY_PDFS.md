# Vérification manuelle des PDF de l'archive BAC

## Contexte

9 entrées de l'archive (`data/archive.js`) ont un `viewer: "blocked"` sur dzexams.com.
Ces PDF sont **accessibles via lien direct** (`pdfUrl`), mais leur contenu n'a **pas été vérifié**.

## Entrées concernées

| Année | Filière | Session | Lien PDF | Statut |
|-------|---------|---------|----------|--------|
| 2018 | SE | main | [Lien](https://www.dzexams.com/uploads/sujets/officiels/bac/2018/dzexams-bac-sciences-3509975.pdf) | ❌ Non vérifié |
| 2016 | SE | exceptional | [Lien](https://www.dzexams.com/uploads/sujets/officiels/bac/2016-2/dzexams-bac-sciences-3814840.pdf) | ❌ Non vérifié |
| 2014 | SE | main | [Lien](https://www.dzexams.com/uploads/sujets/officiels/bac/2014/dzexams-bac-sciences-4380238.pdf) | ❌ Non vérifié |
| 2019 | M | main | [Lien](https://www.dzexams.com/uploads/sujets/officiels/bac/2019/dzexams-bac-sciences-2280992.pdf) | ❌ Non vérifié |
| 2018 | M | main | [Lien](https://www.dzexams.com/uploads/sujets/officiels/bac/2018/dzexams-bac-sciences-1967487.pdf) | ❌ Non vérifié |
| 2017 | M | main | [Lien](https://www.dzexams.com/uploads/sujets/officiels/bac/2017/dzexams-bac-sciences-2275712.pdf) | ❌ Non vérifié |
| 2015 | M | main | [Lien](https://www.dzexams.com/uploads/sujets/officiels/bac/2015/dzexams-bac-sciences-2723927.pdf) | ❌ Non vérifié |
| 2014 | M | main | [Lien](https://www.dzexams.com/uploads/sujets/officiels/bac/2014/dzexams-bac-sciences-2369148.pdf) | ❌ Non vérifié |
| 2013 | M | main | [Lien](https://www.dzexams.com/uploads/sujets/officiels/bac/2013/dzexams-bac-sciences-2770867.pdf) | ❌ Non vérifié |

## Instructions pour vérification manuelle

### Méthode 1: Script Node.js (recommandé)

```bash
# Exécuter le script de vérification
node scripts/verify-archive-pdfs.mjs
```

Le script va:
1. Télécharger chaque PDF
2. Vérifier que le code HTTP est 200
3. Vérifier que c'est bien un PDF (header `%PDF`)
4. Vérifier que le fichier n'est pas vide
5. Générer un rapport

**Si tous les PDF sont accessibles:**
- Mettre à jour `data/archive.js` pour chaque entrée concernée:
  ```javascript
  // AVANT:
  contentVerified: false,
  page: "access_confirmed",
  
  // APRÈS:
  contentVerified: true,
  page: "consulted",
  ```

### Méthode 2: Vérification manuelle via navigateur

1. Ouvrir chaque lien PDF dans un navigateur
2. Vérifier que le PDF s'affiche correctement
3. Vérifier qu'il contient bien **sujet + correction**
4. Noter les résultats

### Méthode 3: cURL

```bash
# Pour un PDF spécifique
curl -I "https://www.dzexams.com/uploads/sujets/officiels/bac/2018/dzexams-bac-sciences-3509975.pdf"
# Doit retourner: HTTP/2 200

# Pour télécharger et vérifier
curl -L "https://www.dzexams.com/uploads/sujets/officiels/bac/2018/dzexams-bac-sciences-3509975.pdf" -o test.pdf
file test.pdf  # Doit afficher: PDF document
```

## Critères de validation

Un PDF est considéré **valide** si:
- ✅ Code HTTP = 200
- ✅ Fichier non vide (> 100 Ko typiquement)
- ✅ Header du fichier = `%PDF` (fichier PDF valide)
- ✅ Contient visuellement **sujet + correction** (à vérifier manuellement)

## Après vérification

1. **Si tous les PDF sont valides:**
   - Mettre à jour `contentVerified: true` pour les 9 entrées
   - Mettre à jour `page: "consulted"` pour les 9 entrées
   - Commit et push

2. **Si certains PDF sont invalides:**
   - Documenter les liens morts dans une issue GitHub
   - Rechercher des sources alternatives pour ces années

## Notes

- Les PDF bloqués sur dzexams.com sont probablement **chiffrés ou protégés** côté serveur
- Le lien direct de téléchargement (`تحميل`) contourne cette protection
- La vérification doit être faite **en local** (le site est inaccessible depuis la sandbox Arena)
