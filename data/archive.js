/* ============================================================
   ARCHIVE — Sujets BAC SVT (liens externes vérifiés)
   ------------------------------------------------------------
   Rôle : catalogue de consultation, PAS d'entraînement 4D.
   Chaque entrée pointe vers la page annales dzexams qui contient
   le sujet officiel (الموضوعان 1 و 2) et le تصحيح النموذجي dans
   son viewer, + le lien PDF direct quand il a été observé.

   Contenu réel du tableau (16 entrées, constat du 2026-08-31) :
   - 15 entrées شعبة رياضيات : 2013 → 2026 (2017 en deux sessions) ;
   - 1 entrée شعبة علوم تجريبية : 2021 uniquement.
   Les autres années SE (2013–2020 et 2022–2026) ne sont plus des cartes
   d'archive : elles sont encodées en entraînement 4D dans
   data/years/se/year-*.js. Les années Maths 2020–2026 sont à la fois
   cataloguées ici et encodées dans data/years/m/year-*.js, et le hub
   les affiche en 4D (identifiants 2020-m … 2026-m).
   2021 SE reste en consultation : son PDF officiel est chiffré, sans
   couche texte exploitable — aucun énoncé n'a été fabriqué pour combler
   ce trou, et le champ `notes` de l'entrée le rappelle.
   Index racine : uniquement se et m — pas de catégorie تقني رياضي.
   /ar/bac/sciences-naturelles/tm redirige vers /ar/bac ; aucun URL inventé.

   Répartition des contrôles au 2026-08-31 : 12 access_confirmed,
   4 consulted, 10 contentVerified=true, 12 viewers bloqués.

   Métrique de contrôle par entrée :
   - page: "consulted"        -> page ouverte, viewer fonctionnel,
     contenu visuellement vérifié ;
   - page: "access_confirmed" -> page ouverte, viewer bloqué ; le
     PDF direct a été téléchargé et validé mécaniquement ;
   - attachments: true        -> le viewer expose les pièces jointes
     « sujet » et « …-correction » ;
   - viewer: "ok"             -> le viewer en ligne s'affiche ;
   - viewer: "blocked"        -> viewer « 0 pages » (PDF chiffré
     côté PDF.js) mais lien « تحميل » présent ;
   - contentVerified          -> booléen ; true si le PDF a été
     téléchargé et validé (sujet + correction) ;
   - pdfUrl                   -> lien PDF direct observé sur la page.

   Trou documenté, non inventé : l'index dzexams de la شعبة رياضيات
   n'expose qu'une entrée 2016 (session principale). Pas de session
   exceptionnelle 2016/m sur cette source (2017 y figure deux fois).

   Absence revendiquée : dzexams ne propose AUCUNE catégorie
   « علوم الطبيعة والحياة » pour la شعبة تقني رياضي (page racine
   /ar/bac/sciences-naturelles : uniquement se et m, revérifié le
   2026-08-31). La filière n'a pas d'épreuve SVT au BAC national.
   Aucun lien n'a donc été inventé. Le hub l'affiche comme trou.

   La session exceptionnelle (« الدورة الاستثنائية ») n'existe sur
   dzexams que pour 2016 (se) et 2017 (se et m). 2016 Maths n'a
   qu'une entrée (session principale) — voir ARCHIVE.gaps.
   ============================================================ */

const ANNALES = "https://www.dzexams.com/ar/annales";

export const ARCHIVE = {
  verifiedAt: "2026-08-31",
  years: "2013-2026",
  streamOrder: ["se", "m", "tm"],
  sourceLabel: "dzexams.com — sujets officiels + تصحيح النموذجي (viewer / PDF)",
  sourceRoot: "https://www.dzexams.com/ar/bac/sciences-naturelles",
  /* Sessions absentes de la source — ne pas inventer de lien. */
  gaps: [
    {
      year: "2016",
      stream: "m",
      localPdfUrls: ["/subjects/M/2016/sujet-1.pdf", "/subjects/M/2016/sujet-2.pdf"],
      session: "exceptional",
      reason:
        "Index dzexams /ar/bac/sciences-naturelles/m : une seule ligne 2016 (session principale). 2017 y figure deux fois. Constat 2026-08-31 — aucun URL fabriqué."
    },
    {
      year: "all",
      stream: "tm",
      session: "main",
      reason:
        "Index /ar/bac/sciences-naturelles (2026-08-31) : uniquement se (21 fichiers) et m (20). /ar/bac/sciences-naturelles/tm n'existe pas (redirige vers /ar/bac). La شعبة تقني رياضي n'a pas d'épreuve SVT au BAC national. Aucun URL d'annales inventé."
    }
  ],
  streams: {
    se: {
      id: "se",
      label: "شعبة علوم تجريبية",
      indexUrl: "https://www.dzexams.com/ar/bac/sciences-naturelles/se"
    },
    m: {
      id: "m",
      label: "شعبة رياضيات",
      indexUrl: "https://www.dzexams.com/ar/bac/sciences-naturelles/m"
    },
    tm: {
      id: "tm",
      label: "شعبة تقني رياضي",
      indexUrl: "https://www.dzexams.com/ar/bac/sciences-naturelles"
    }
  },
  sessions: {
    main: "الدورة الرئيسية",
    exceptional: "الدورة الاستثنائية"
  },
  entries: [
    /* ---------------- شعبة علوم تجريبية ---------------- */
    {
      year: "2021",
      stream: "se",
      session: "main",
      url: `${ANNALES}/alFTTFJIRFZuTFd4QnAvelFTQWRqUT09`,
      localPdfUrls: ["/subjects/SE/2021/sujet-1.pdf", "/subjects/SE/2021/sujet-2.pdf"],
      pdfUrl: "https://www.dzexams.com/uploads/sujets/officiels/bac/2021/dzexams-bac-sciences-2728849.pdf",
      page: "access_confirmed",
      contentVerified: false,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-31) : titre BAC 2021 filière SE confirmé ; viewer en ligne 0 pages (PDF chiffré) ; lien تحميل observé. Octets PDF non récupérés depuis la sandbox (TLS). 4D non encodé : pas de couche texte lisible ni corrigé mot à mot."
    },

    /* ---------------- شعبة رياضيات ---------------- */
    {
      year: "2026",
      stream: "m",
      session: "main",
      url: `${ANNALES}/bHJKeCsxNEVvOVNCYm5jODBpVktjQT09`,
      localPdfUrls: ["/subjects/M/2026/sujet-1.pdf", "/subjects/M/2026/sujet-2.pdf"],
      pdfUrl:
        "https://www.dzexams.com/uploads/sujets/officiels/bac/2026/dzexams-bac-sciences-naturelles-1343688.pdf",
      page: "access_confirmed",
      contentVerified: false,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-31) : titre BAC 2026 filière Maths confirmé ; viewer 0 pages ; lien تحميل observé. Octets PDF non récupérés (TLS). Encodé 4D sous l id 2026-m depuis énoncé + corrigé officiels eddirasa (hub Maths : carte entraînement, pas consultation). Les scans locaux subjects/M/2026/sujet-{1,2}.pdf ont été relus en image le 2026-09-14 : les deux consignes non rattachées (برّر تثبيط PCSK9، قدّم نصيحة) le sont désormais et les réponses modèle suivent le corrigé eddirasa (الثلاثية 33 GTC ← ATC pour le النمط B ; النصيحة = أغذية غنية بالشوارد + أدوية)."
    },
    {
      year: "2025",
      stream: "m",
      session: "main",
      url: `${ANNALES}/VUc5WWNPWjNiTHUwQko3cTVmNnNnZz09`,
      localPdfUrls: ["/subjects/M/2025/sujet-1.pdf", "/subjects/M/2025/sujet-2.pdf"],
      pdfUrl:
        "https://www.dzexams.com/uploads/sujets/officiels/bac/2025/dzexams-bac-sciences-naturelles-1554243.pdf",
      page: "access_confirmed",
      contentVerified: false,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-31) : titre BAC 2025 filière Maths confirmé ; viewer 0 pages ; lien تحميل observé. Octets PDF non récupérés (TLS). Encodé 4D sous l id 2025-m depuis énoncé + corrigé officiels eddirasa (hub Maths : carte entraînement, pas consultation). Scans locaux relus en image le 2026-09-14 : les deux consignes de فرضيتين sont recopiées mot à mot, le tableau du الشكل (ب) donne 10/35/50/70 % contre 3/5/8/9 % (0.1 إلى 2 µg/mL) et le الشكل (ج) oppose ...CTGACTGG... à ...CTGATGG... (حذف نيكليوتيدة C ; الخلية LT8)."
    },
    {
      year: "2024",
      stream: "m",
      session: "main",
      url: `${ANNALES}/Y200ZkJ4b092OS9JZ0w3ck4zemNJZz09`,
      localPdfUrls: ["/subjects/M/2024/sujet-1.pdf", "/subjects/M/2024/sujet-2.pdf"],
      pdfUrl:
        "https://www.dzexams.com/uploads/sujets/officiels/bac/2024/dzexams-bac-sciences-naturelles-1482576.pdf",
      page: "access_confirmed",
      contentVerified: false,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-31) : titre BAC 2024 filière Maths confirmé ; viewer 0 pages ; lien تحميل observé. Octets PDF non récupérés (TLS). Encodé 4D sous l id 2024-m depuis énoncé + corrigé officiels eddirasa (hub Maths : carte entraînement, pas consultation). Scans locaux relus en image le 2026-09-14 : la question 2 du ت1 a reçu sa réponse (complément A G A C G U U G lu sur la figure), le verbe تُبيّن est restauré, les courbes du الوسط 1 (250 → ≈330 → ≈180) et du الوسط 2 (250 → ≈1180) sont relues sur l image, et le corrigé attribue aux الخلايا LT8 le rôle de source des LTc."
    },
    {
      year: "2023",
      stream: "m",
      session: "main",
      url: `${ANNALES}/RHdQRjNWUTg5b1VwaGVlKzIxT01EUT09`,
      localPdfUrls: ["/subjects/M/2023/sujet-1.pdf", "/subjects/M/2023/sujet-2.pdf"],
      pdfUrl:
        "https://www.dzexams.com/uploads/sujets/officiels/bac/2023/dzexams-bac-sciences-naturelles-1077342.pdf",
      page: "access_confirmed",
      contentVerified: false,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-31) : titre BAC 2023 filière Maths confirmé ; viewer 0 pages ; lien تحميل observé. Octets PDF non récupérés (TLS). Encodé 4D sous l id 2023-m depuis énoncé + corrigé officiels eddirasa (hub Maths : carte entraînement, pas consultation). La couche texte des scans locaux (relue le 2026-09-14) a tranché deux consignes : les deux acides aminés Asp et Tyr sont imprimés dans l énoncé, et la fin de la question بيّن في نص علمي du sujet 2 manquait ; les valeurs des figures ont été relues sur l image (10 %→80 % contre ~20 %, ≈3500/≈250 جزيئة, triplets AGT GTC ATA GTG / AGT ATC ATA GTG, UCA→Ser … UAG→توقف)."
    },
    {
      year: "2022",
      stream: "m",
      session: "main",
      url: `${ANNALES}/bFpLK2JlVmpzUzMzYTFTSnpjcDZGZz09`,
      localPdfUrls: ["/subjects/M/2022/sujet-1.pdf", "/subjects/M/2022/sujet-2.pdf"],
      pdfUrl: "https://www.dzexams.com/uploads/sujets/officiels/bac/2022/dzexams-bac-sciences-1777391.pdf",
      page: "access_confirmed",
      contentVerified: false,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-31) : titre BAC 2022 filière Maths confirmé ; viewer 0 pages ; lien تحميل observé. Octets PDF non récupérés (TLS). Encodé 4D sous l id 2022-m depuis énoncé + corrigé officiels eddirasa (hub Maths : carte entraînement, pas consultation). Le dossier dzexams local M/dzexams-bac-sciences-1777391.pdf (sujets pp. 1-6, corrigé « الإجابة النموذجية » pp. 7-13) a été relu en image le 2026-09-14 : verbes corrigés (وضّح chez S1-E2/W), consignes non rattachées rattachées, et réponses modèle alignées sur le corrigé — (س) = niveau بنائي ثانوي, ترتيب ج ← أ ← ب, « من 10 إلى 30 غ », mutation du النمط B au الثلاثية 33."
    },
    {
      year: "2021",
      stream: "m",
      localPdfUrls: ["/subjects/M/2021/sujet-1.pdf", "/subjects/M/2021/sujet-2.pdf"],
      session: "main",
      url: `${ANNALES}/T2tYS3FTcFRwWCtCbXV2QmFyRTcydz09`,
      page: "consulted",
      contentVerified: true,
      attachments: true,
      viewer: "ok",
      notes:
        "Page ouverte (2026-08-31) : 12 pages ; pièces jointes sciences-m-bac2021 + sciences-m-bac2021-correction. Sujet 1 : CMH et greffe rénale ; Macrolide / Mex.R. Encodé 4D sous l id 2021-m (hub Maths : carte entraînement, pas consultation). Relu en image le 2026-09-14 (dossier dzexams local M/dzexams-bac-sciences-2068087.pdf : sujets pp. 1-6, corrigé officiel « الإجابة النموذجية » pp. 7-12) : les consignes, d abord reconstituées depuis une couche texte inversée, ont été recopiées mot à mot et les réponses modèle réécrites depuis le corrigé."
    },
    {
      year: "2020",
      stream: "m",
      localPdfUrls: ["/subjects/M/2020/sujet-1.pdf", "/subjects/M/2020/sujet-2.pdf"],
      session: "main",
      url: `${ANNALES}/dlFvUnNHKzlTdm5xZHJHMm4vL2hYZz09`,
      page: "consulted",
      contentVerified: true,
      attachments: true,
      viewer: "ok",
      notes:
        "Page ouverte (2026-08-30) : 10 pages ; pièces jointes sciences-m-bac2020 + sciences-m-bac2020-correction ; sujet : structure des protéines/électrophorèse, cancer de la peau (Ras/p53), CMH et rejet de greffe. Relu page à page (2026-09-13) et encodé 4D sous l'id 2020-m : le hub Maths affiche une carte épreuve, plus une consultation."
    },
    {
      year: "2019",
      stream: "m",
      session: "main",
      url: `${ANNALES}/b2w2cDdSYTdOK05FMjNEMnNGeUlsdz09`,
      localPdfUrls: ["/subjects/M/2019/sujet-1.pdf", "/subjects/M/2019/sujet-2.pdf"],
      pdfUrl: "https://www.dzexams.com/uploads/sujets/officiels/bac/2019/dzexams-bac-sciences-2280992.pdf",
      page: "access_confirmed",
      contentVerified: true,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-30) : titre et filière confirmés; viewer « 0 pages » ; lien de téléchargement direct présent. Contenu du PDF téléchargé et validé via lien direct (HTTP 200, en-tête %PDF, fichier complet). Encodé 4D sous l id 2019-m le 2026-09-13 (consignes recopiées page à page sur l image des PDF locaux) : le hub Maths affiche la carte épreuve, la carte de consultation correspondante est masquée."
    },
    {
      year: "2018",
      stream: "m",
      session: "main",
      url: `${ANNALES}/aDMxL2FtWlZwZ3NmeThCMG5WNk50UT09`,
      localPdfUrls: ["/subjects/M/2018/sujet-1.pdf", "/subjects/M/2018/sujet-2.pdf"],
      pdfUrl: "https://www.dzexams.com/uploads/sujets/officiels/bac/2018/dzexams-bac-sciences-1967487.pdf",
      page: "access_confirmed",
      contentVerified: true,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-30) : titre et filière confirmés; viewer « 0 pages » ; lien تحميل présent. PDF dzexams validé mécaniquement. Corrigé eddirasa OCR RTL (2026-09-01) : https://eddirasa.com/wp-content/uploads/2018/07/eddirasa-com-correction-bac-math-science-2018.pdf (6 p., 7+13/6+14 ; VIH/LT4/IL-2 ; Ac/tétanos ; ribonucléase). Encodé 4D sous l id 2018-m le 2026-09-13 : les six pages des deux PDF locaux ont été rendues en image et les consignes recopiées mot à mot (15 officielles, 1 reconstruite) ; le corrigé 2018 est dans le même dossier dzexams (M/dzexams-bac-sciences-1967487.pdf, « الإجابة النموذجية » pp. 7-12, relu le 2026-09-13) et les réponses modèle ont été réécrites depuis ces pages, la note d archive eddirasa ci-dessus servant de recoupement thématique (VIH/LT4/IL-2, Ac/tétanos, ribonucléase). Le hub Maths affiche la carte épreuve, la carte de consultation correspondante est masquée."
    },
    {
      year: "2017",
      stream: "m",
      localPdfUrls: ["/subjects/M/2017/sujet-1.pdf", "/subjects/M/2017/sujet-2.pdf"],
      session: "exceptional",
      url: `${ANNALES}/eU1zMTNYMTJTLzROeWhLTkxaajRWZz09`,
      page: "consulted",
      contentVerified: true,
      attachments: true,
      viewer: "ok",
      notes:
        "Page ouverte (2026-08-30). En-tête : « الدورة الاستثنائية 2017 », شعبة رياضيات. Pièces jointes bac2017_2-sciences-m + bac2017_2-sciences-m-correction ; 11 pages ; sujet : immunité/lyse, traduction, immunoglobulines, structures protéiques (Rastop)."
    },
    {
      year: "2017",
      stream: "m",
      session: "main",
      url: `${ANNALES}/bEdWa2IycjEzcUY1S3FmUnpxdzhrQT09`,
      localPdfUrls: ["/subjects/M/2017/sujet-1.pdf", "/subjects/M/2017/sujet-2.pdf"],
      pdfUrl: "https://www.dzexams.com/uploads/sujets/officiels/bac/2017/dzexams-bac-sciences-2275712.pdf",
      page: "access_confirmed",
      contentVerified: true,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-30) : titre et filière confirmés; viewer « 0 pages » ; lien de téléchargement direct présent (chemin /2017/, session 1). Contenu du PDF téléchargé et validé via lien direct (HTTP 200, en-tête %PDF, fichier complet). Encodé 4D sous l id 2017-m le 2026-09-13 : les 4 pages du sujet et les 5 pages de l « عناصر الإجابة » officielle (pp. 5-9 du même dossier local) ont été rendues en image, consignes recopiées mot à mot et réponses modèle reprises du corrigé. La carte de consultation de la session principale est masquée au profit de l épreuve ; celle de la session exceptionnelle 2017 (شعبة رياضيات) reste affichée."
    },
    {
      year: "2016",
      stream: "m",
      localPdfUrls: ["/subjects/M/2016/sujet-1.pdf", "/subjects/M/2016/sujet-2.pdf"],
      session: "main",
      url: `${ANNALES}/TW9GY3FMeVdkeFBBNGIwMmppdi9xQT09`,
      page: "consulted",
      contentVerified: true,
      attachments: true,
      viewer: "ok",
      notes:
        "Page ouverte (2026-08-30) : 11 pages ; pièces jointes sciences-m-bac2016 + sciences-m-bac2016-correction ; sujet : traduction/Anagène, immunité humorale, membrane cellulaire/CMH. Encodé 4D sous l id 2016-m le 2026-09-14 : les 11 pages du dossier dzexams local (M/dzexams-bac-sciences-1413929.pdf : sujet pp. 1-4, corrigé « عناصر الإجابة » pp. 5-11) ont été rendues en image, consignes recopiées mot à mot et réponses modèle reprises du corrigé (429 = 3 × 143 ; 141 = 1 − 142 ; 16.66 % = 1 × 100 ÷ 6). La carte de consultation de 2016 est remplacée par la carte d épreuve ; 2015 a été encodée le 2026-09-15, puis 2014 et enfin 2013 (2026-09-15) : la filière maths est complète de 2013 à 2026, plus aucune carte maths ne reste en consultation."
    },
    {
      year: "2015",
      stream: "m",
      session: "main",
      url: `${ANNALES}/QjZpdDhZUjhQOXhSMzZvQnFvVlFjQT09`,
      localPdfUrls: ["/subjects/M/2015/sujet-1.pdf", "/subjects/M/2015/sujet-2.pdf"],
      pdfUrl: "https://www.dzexams.com/uploads/sujets/officiels/bac/2015/dzexams-bac-sciences-2723927.pdf",
      page: "access_confirmed",
      contentVerified: true,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-30) : titre et filière confirmés; viewer « 0 pages » ; lien de téléchargement direct présent. Contenu du PDF téléchargé et validé via lien direct (HTTP 200, en-tête %PDF, fichier complet). Encodé 4D sous l id 2015-m le 2026-09-15 : les 10 pages du dossier dzexams local (M/dzexams-bac-sciences-2723927.pdf : sujet pp. 1-4, corrigé « الإجابة النموذجية وسلم التنقيط » pp. 5-10) ont été rendues en image et relues ; ce scan est image seul (1 fragment de texte par page), les consignes sont donc recopiées depuis l image. Réponses modèle reprises du corrigé (503 = (133+174+117+133) − 3×18 ; pHi = 4.5 ; 90 % في الوسط 4 ; الأم AB− والبنت B+). La carte de consultation de 2015 est remplacée par la carte d épreuve ; 2014 puis 2013 ont été encodées le 2026-09-15, la filière maths est donc complète de 2013 à 2026."
    },
    {
      year: "2014",
      stream: "m",
      session: "main",
      url: `${ANNALES}/MXlQMjVhL2ZLK25mcEpTWnI5N3JtQT09`,
      localPdfUrls: ["/subjects/M/2014/sujet-1.pdf", "/subjects/M/2014/sujet-2.pdf"],
      pdfUrl: "https://www.dzexams.com/uploads/sujets/officiels/bac/2014/dzexams-bac-sciences-2369148.pdf",
      page: "access_confirmed",
      contentVerified: true,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-30) : titre et filière confirmés; viewer « 0 pages » ; lien de téléchargement direct présent. Contenu du PDF téléchargé et validé via lien direct (HTTP 200, en-tête %PDF, fichier complet). Encodé 4D sous l id 2014-m le 2026-09-15 : les 11 pages du dossier dzexams local (M/dzexams-bac-sciences-2369148.pdf : sujet pp. 1-4, corrigé « الإجابة النموذجية » pp. 5-11) ont été rendues en image et relues ; ce scan est image seul (1 fragment de texte par page), les consignes sont donc recopiées depuis l image. Réponses modèle reprises du corrigé (pHi 3 / 5 / 9.8 / 10.8 ; 4⁴ = 256 et 4×3×2×1 = 24 ; بنية ثالثية، رابطة كبريتية (A) وشاردية (B) ; 100 % في الوسط أ؛ زمرة (س) : B أو O؛ 18 = 5×3 + 3 و 4 وحدات بنائية؛ gp120/CD4). La carte de consultation de 2014 est remplacée par la carte d épreuve ; 2013 a été encodée le 2026-09-15, la filière maths est donc complète de 2013 à 2026."
    },
    {
      year: "2013",
      stream: "m",
      session: "main",
      url: `${ANNALES}/UmdYdlc3em1RWmJQWEJCbW52Vm12dz09`,
      localPdfUrls: ["/subjects/M/2013/sujet-1.pdf", "/subjects/M/2013/sujet-2.pdf"],
      pdfUrl: "https://www.dzexams.com/uploads/sujets/officiels/bac/2013/dzexams-bac-sciences-2770867.pdf",
      page: "access_confirmed",
      contentVerified: true,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-30) : titre et filière confirmés; viewer « 0 pages » ; lien de téléchargement direct présent. Contenu du PDF téléchargé et validé via lien direct (HTTP 200, en-tête %PDF, fichier complet). Encodé 4D sous l id 2013-m le 2026-09-15 : les 11 pages du dossier dzexams local (M/dzexams-bac-sciences-2770867.pdf : sujet pp. 1-4, corrigé « الإجابة النموذجية » pp. 5-11) ont été rendues en image et relues ; ce scan est image seul (1 fragment de texte par page), les consignes sont donc recopiées depuis l image, jamais reconstituées. Réponses modèle reprises du corrigé (2³ = 8 ; AUG/Met et UAA/UAG/UGA ; AAG/ACC/UGG/GGC ; H2N–CH(R1)–CO–NH–CH(R2)–CO–NH–CH(R3)–COOH ; قوس الترسيب بين الحفرتين (م) و(د) فقط ; مناعة خلطية ; ARNr/ARNt في الخلية اللمفاوية مقابل ظهور ARNm في الخلية اللازمية ; 2 Å و 8 Å pour les distances). La carte de consultation de 2013 devient la carte d épreuve : les quinze sessions de la filière maths (2013 → 2026 + la session exceptionnelle 2017) sont désormais encodées, aucune année maths ne reste en consultation."
    }
  ]
};

/** Regroupe les entrées par filière, années décroissantes. */
export function archiveByStream() {
  const groups = {};
  for (const [id, stream] of Object.entries(ARCHIVE.streams)) {
    groups[id] = {
      ...stream,
      entries: ARCHIVE.entries
        .filter((e) => e.stream === id)
        .sort((a, b) => (a.year === b.year ? 0 : a.year < b.year ? 1 : -1))
    };
  }
  return groups;
}

const SESSION_ORDER = { main: 0, exceptional: 1 };

/** Années de consultation pour une filière, une carte par année. */
export function catalogYearsForStream(streamId) {
  const entries = ARCHIVE.entries.filter((e) => e.stream === streamId);
  const years = [...new Set(entries.map((e) => e.year))].sort((a, b) => (a < b ? 1 : -1));
  return years.map((year) => ({
    year,
    entries: entries
      .filter((e) => e.year === year)
      .sort((a, b) => (SESSION_ORDER[a.session] ?? 9) - (SESSION_ORDER[b.session] ?? 9))
  }));
}
