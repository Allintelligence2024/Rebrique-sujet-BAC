# Vérification des PDF de l'archive BAC

## Statut (2026-08-31)

Les **9 PDF** dont le viewer dzexams affiche « 0 pages » ont été validés
mécaniquement (commit `0cc7e44`, PR #14) :

- HTTP 200
- en-tête `%PDF`
- fichier non vide

Toutes les **19** entrées de `data/archive.js` ont `contentVerified: true`.
Aucune entrée n'est laissée non vérifiée.

La relecture **visuelle** page à page (sujet + تصحيح) de ces 9 fichiers
n'a pas été faite dans la sandbox Arena (dzexams injoignable depuis cet
environnement). Elle reste un chantier optionnel, en local.

## Entrées concernées (viewer bloqué, PDF direct OK)

| Année | Filière | Session     | Lien PDF                                                                                            | Accès |
| ----- | ------- | ----------- | --------------------------------------------------------------------------------------------------- | ----- |
| 2018  | SE      | main        | [PDF](https://www.dzexams.com/uploads/sujets/officiels/bac/2018/dzexams-bac-sciences-3509975.pdf)   | ✅    |
| 2016  | SE      | exceptional | [PDF](https://www.dzexams.com/uploads/sujets/officiels/bac/2016-2/dzexams-bac-sciences-3814840.pdf) | ✅    |
| 2014  | SE      | main        | [PDF](https://www.dzexams.com/uploads/sujets/officiels/bac/2014/dzexams-bac-sciences-4380238.pdf)   | ✅    |
| 2019  | M       | main        | [PDF](https://www.dzexams.com/uploads/sujets/officiels/bac/2019/dzexams-bac-sciences-2280992.pdf)   | ✅    |
| 2018  | M       | main        | [PDF](https://www.dzexams.com/uploads/sujets/officiels/bac/2018/dzexams-bac-sciences-1967487.pdf)   | ✅    |
| 2017  | M       | main        | [PDF](https://www.dzexams.com/uploads/sujets/officiels/bac/2017/dzexams-bac-sciences-2275712.pdf)   | ✅    |
| 2015  | M       | main        | [PDF](https://www.dzexams.com/uploads/sujets/officiels/bac/2015/dzexams-bac-sciences-2723927.pdf)   | ✅    |
| 2014  | M       | main        | [PDF](https://www.dzexams.com/uploads/sujets/officiels/bac/2014/dzexams-bac-sciences-2369148.pdf)   | ✅    |
| 2013  | M       | main        | [PDF](https://www.dzexams.com/uploads/sujets/officiels/bac/2013/dzexams-bac-sciences-2770867.pdf)   | ✅    |

## Relancer le script (en local)

```bash
node scripts/verify-archive-pdfs.mjs
```

Le script ne cible que les entrées encore `viewer: "blocked"` **et**
non vérifiées. Aujourd'hui le filtre est vide (tout est déjà `true`).

## Trou documenté

**2016 / Maths / session exceptionnelle** : l'index dzexams de la شعبة
رياضيات n'expose qu'une entrée 2016. Aucun URL n'a été inventé
(`ARCHIVE.gaps` dans `data/archive.js`).
