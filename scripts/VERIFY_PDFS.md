# Vérification des PDF de l'archive BAC

## Statut (2026-08-31)

Les **9 PDF** dont le viewer dzexams affiche « 0 pages » ont été validés
mécaniquement (commit `0cc7e44`, PR #14) :

- HTTP 200
- en-tête `%PDF`
- fichier non vide

Toutes les **19** entrées 2013–2020 de `data/archive.js` ont
`contentVerified: true`.

La relecture **visuelle** page à page (sujet + تصحيح) de ces 9 fichiers
n'a **pas** été faite dans la sandbox Arena : `curl` / `wget` /
`urllib` vers dzexams et eddirasa échouent (`SSL_ERROR_SYSCALL`,
fichier de taille 0) ; `fetch_page` sur les URL PDF échoue ; le viewer
HTML de ces 9 pages reste à « 0 pages ». **Ne pas marquer une relecture
visuelle qui n'a pas eu lieu.**

## Entrées concernées (viewer bloqué, PDF direct OK en session précédente)

| Année | Filière | Session     | Lien PDF                                                                                            | Accès mécanique | Relecture visuelle sandbox |
| ----- | ------- | ----------- | --------------------------------------------------------------------------------------------------- | --------------- | -------------------------- |
| 2018  | SE      | main        | [PDF](https://www.dzexams.com/uploads/sujets/officiels/bac/2018/dzexams-bac-sciences-3509975.pdf)   | ✅              | non                        |
| 2016  | SE      | exceptional | [PDF](https://www.dzexams.com/uploads/sujets/officiels/bac/2016-2/dzexams-bac-sciences-3814840.pdf) | ✅              | non                        |
| 2014  | SE      | main        | [PDF](https://www.dzexams.com/uploads/sujets/officiels/bac/2014/dzexams-bac-sciences-4380238.pdf)   | ✅              | non                        |
| 2019  | M       | main        | [PDF](https://www.dzexams.com/uploads/sujets/officiels/bac/2019/dzexams-bac-sciences-2280992.pdf)   | ✅              | non                        |
| 2018  | M       | main        | [PDF](https://www.dzexams.com/uploads/sujets/officiels/bac/2018/dzexams-bac-sciences-1967487.pdf)   | ✅              | non                        |
| 2017  | M       | main        | [PDF](https://www.dzexams.com/uploads/sujets/officiels/bac/2017/dzexams-bac-sciences-2275712.pdf)   | ✅              | non                        |
| 2015  | M       | main        | [PDF](https://www.dzexams.com/uploads/sujets/officiels/bac/2015/dzexams-bac-sciences-2723927.pdf)   | ✅              | non                        |
| 2014  | M       | main        | [PDF](https://www.dzexams.com/uploads/sujets/officiels/bac/2014/dzexams-bac-sciences-2369148.pdf)   | ✅              | non                        |
| 2013  | M       | main        | [PDF](https://www.dzexams.com/uploads/sujets/officiels/bac/2013/dzexams-bac-sciences-2770867.pdf)   | ✅              | non                        |

## 2021 ajouté en consultation (pas de 4D)

| Année | Filière | Viewer sandbox | PDF observé                                                                                                                   | 4D                                  |
| ----- | ------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| 2021  | SE      | 0 pages        | [lien](https://www.dzexams.com/uploads/sujets/officiels/bac/2021/dzexams-bac-sciences-2728849.pdf) (`contentVerified: false`) | non — pas de couche texte           |
| 2021  | M       | 12 pages, OK   | pièces jointes visibles ; pas de `pdfUrl` inventé                                                                             | non — filière Maths hors APP_CONFIG |

2020 SE : lien PDF
[observé](https://www.dzexams.com/uploads/sujets/officiels/bac/2020/dzexams-bac-sciences-2356016.pdf)
le 2026-08-31 (viewer alors à 0 pages). 4D non encodé.

## Relancer le script (en local)

```bash
node scripts/verify-archive-pdfs.mjs
```

Le script ne cible que les entrées encore `viewer: "blocked"` **et**
non vérifiées : 2021 SE + Maths 2022–2026 (`contentVerified: false`).

## Maths 2022–2026 et SE 2026 (consultation, pas de 4D)

Pages ouvertes le 2026-08-31. Viewer Maths bloqué ; `pdfUrl` observé.
SE 2026 : viewer 23 pages (corrigé inversé).

## Trous documentés

**2016 / Maths / session exceptionnelle** : une seule ligne 2016 sur l'index.
**تقني رياضي** : pas de catégorie SVT (index racine = se + m seulement).
Aucun URL inventé (`ARCHIVE.gaps`).
