/* ============================================================
   ARCHIVE — Sujets BAC SVT (liens externes vérifiés)
   ------------------------------------------------------------
   Rôle : catalogue de consultation, PAS d'entraînement 4D.
   Chaque entrée pointe vers la page annales dzexams qui contient
   le sujet officiel (الموضوعان 1 و 2) et le تصحيح النموذجي dans
   son viewer, + le lien PDF direct quand il a été observé.

    Vérification (2026-08-31) : les 19 pages 2013–2020 ont été ouvertes
   et leurs 9 PDF au viewer « 0 pages » validés mécaniquement
   (HTTP 200, en-tête %PDF). 2021 SE/Maths, Maths 2022–2026 et SE 2026
   ont été ajoutées le même jour. Index racine : uniquement se (21) et
   m (20) — pas de catégorie تقني رياضي. /ar/bac/sciences-naturelles/tm
   redirige vers /ar/bac ; aucun URL inventé.

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
      year: "2026",
      stream: "se",
      session: "main",
      url: `${ANNALES}/L0tWNjNjZ1pNQ1RmU3JUOUFUbFpTdz09`,
      pdfUrl:
        "https://www.dzexams.com/uploads/sujets/officiels/bac/2026/dzexams-bac-sciences-naturelles-2667863.pdf",
      page: "consulted",
      contentVerified: true,
      attachments: false,
      viewer: "ok",
      notes:
        "Page ouverte (2026-08-31) : titre BAC 2026 filière SE ; viewer 23 pages (corrigé inversé lisible : albumine/Edema, SIRT1/P53A, RSV). Lien تحميل observé. 4D non encodé : énoncé mot à mot non recopié."
    },
    {
      year: "2021",
      stream: "se",
      session: "main",
      url: `${ANNALES}/alFTTFJIRFZuTFd4QnAvelFTQWRqUT09`,
      pdfUrl: "https://www.dzexams.com/uploads/sujets/officiels/bac/2021/dzexams-bac-sciences-2728849.pdf",
      page: "access_confirmed",
      contentVerified: false,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-31) : titre BAC 2021 filière SE confirmé ; viewer en ligne 0 pages (PDF chiffré) ; lien تحميل observé. Octets PDF non récupérés depuis la sandbox (TLS). 4D non encodé : pas de couche texte lisible ni corrigé mot à mot."
    },
    {
      year: "2020",
      stream: "se",
      session: "main",
      url: `${ANNALES}/SUFqL0VzRjNzdmd6ek1EekpsOTFMdz09`,
      pdfUrl: "https://www.dzexams.com/uploads/sujets/officiels/bac/2020/dzexams-bac-sciences-2356016.pdf",
      page: "consulted",
      contentVerified: true,
      attachments: true,
      viewer: "ok",
      notes:
        "Page ouverte (2026-08-30) : 19 pages ; pièces jointes sciences-se-bac2020 + sciences-se-bac2020-correction ; sujet : sismicité et structure de la Terre, Ibuprofène/Cox-1-Cox-2, immunothérapie du cancer du sein (HER2). Une seule entrée sur la source pour 2020."
    },
    {
      year: "2019",
      stream: "se",
      session: "main",
      url: `${ANNALES}/OHlmRldmdmdDVUNVRHBadTE5em0vdz09`,
      page: "consulted",
      contentVerified: true,
      attachments: true,
      viewer: "ok",
      notes:
        "Page ouverte (2026-08-30) : 19 pages ; pièces jointes sciences-se-bac2019 + sciences-se-bac2019-correction ; sujet : péridotite/dorsale océanique, enzyme glucose oxydase (Rastop/Anagène), immunité."
    },
    {
      year: "2018",
      stream: "se",
      session: "main",
      url: `${ANNALES}/RGZmd0lTRW0xNmZTRUFjR0F5QzMwZz09`,
      pdfUrl: "https://www.dzexams.com/uploads/sujets/officiels/bac/2018/dzexams-bac-sciences-3509975.pdf",
      page: "access_confirmed",
      contentVerified: true,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-30) : titre et filière confirmés; viewer en ligne « 0 pages » (PDF chiffré) mais lien de téléchargement direct présent. Contenu du PDF téléchargé et validé via lien direct (HTTP 200, en-tête %PDF, fichier complet)."
    },
    {
      year: "2017",
      stream: "se",
      session: "exceptional",
      url: `${ANNALES}/TmZOSDV6eSt0UGxySFM1RFlTR3M4dz09`,
      page: "consulted",
      contentVerified: true,
      attachments: true,
      viewer: "ok",
      notes:
        "Page ouverte (2026-08-30). En-tête : « الدورة الاستثنائية 2017 ». Pièces jointes bac2017_2-sciences-se + bac2017_2-sciences-se-correction ; 18 pages."
    },
    {
      year: "2017",
      stream: "se",
      session: "main",
      url: `${ANNALES}/dFRNWk1JWkt2aC8vdFZtZVNMWGRwZz09`,
      page: "consulted",
      contentVerified: true,
      attachments: true,
      viewer: "ok",
      notes:
        "Page ouverte (2026-08-30). En-tête : « دورة 2017 ». Pièces jointes sciences-se-bac2017 + sciences-se-bac2017-correction ; 16 pages."
    },
    {
      year: "2016",
      stream: "se",
      session: "exceptional",
      url: `${ANNALES}/M09NK2ZYVHFzQXg3KzZHazBaTk5IUT09`,
      pdfUrl: "https://www.dzexams.com/uploads/sujets/officiels/bac/2016-2/dzexams-bac-sciences-3814840.pdf",
      page: "access_confirmed",
      contentVerified: true,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-30) : titre et filière confirmés; viewer « 0 pages » ; lien de téléchargement direct présent (chemin /2016-2/ = session 2). Contenu du PDF téléchargé et validé via lien direct (HTTP 200, en-tête %PDF, fichier complet)."
    },
    {
      year: "2016",
      stream: "se",
      session: "main",
      url: `${ANNALES}/MWliZ2dVaHJFejVUMjdiV3VZS2oxdz09`,
      page: "consulted",
      contentVerified: true,
      attachments: true,
      viewer: "ok",
      notes:
        "Page ouverte (2026-08-30). En-tête : « دورة 2016 ». Pièces jointes sciences-se-bac2016 + sciences-se-bac2016-correction ; 21 pages ; sujet : gène et ARN (Anagène), immunité (LT, IL2/CMH), ATP."
    },
    {
      year: "2015",
      stream: "se",
      session: "main",
      url: `${ANNALES}/aTlRWGREbDN3Qit2cVdRaHNmK0FYQT09`,
      pdfUrl: "https://www.dzexams.com/uploads/sujets/officiels/bac/2015/dzexams-bac-sciences-5906014.pdf",
      page: "consulted",
      contentVerified: true,
      attachments: false,
      viewer: "ok",
      notes:
        "Page ouverte (2026-08-30) : 20 pages dans le viewer (lien « تحميل » présent) ; pas de pièces jointes labellisées sur cette page ; en-tête de session non lisible dans le texte extrait."
    },
    {
      year: "2014",
      stream: "se",
      session: "main",
      url: `${ANNALES}/SzdNaHlPbThvaEhSSUJjWDRsdUljdz09`,
      pdfUrl: "https://www.dzexams.com/uploads/sujets/officiels/bac/2014/dzexams-bac-sciences-4380238.pdf",
      page: "access_confirmed",
      contentVerified: true,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-30) : 22 pages déclarées ; viewer « 0 pages » (PDF chiffré) mais lien de téléchargement direct présent ; pas de pièces jointes labellisées. Contenu du PDF téléchargé et validé via lien direct (HTTP 200, en-tête %PDF, fichier complet)."
    },
    {
      year: "2013",
      stream: "se",
      session: "main",
      url: `${ANNALES}/bjdJbVBZMHFKeUZTcExKSEw4REVNQT09`,
      page: "consulted",
      contentVerified: true,
      attachments: true,
      viewer: "ok",
      notes:
        "Page ouverte (2026-08-30) : pièces jointes sciences-se-bac2013 + sciences-se-bac2013-correction + pages scannées BAC2013_Page_004..020 ; 17 pages."
    },

    /* ---------------- شعبة رياضيات ---------------- */
    {
      year: "2026",
      stream: "m",
      session: "main",
      url: `${ANNALES}/bHJKeCsxNEVvOVNCYm5jODBpVktjQT09`,
      pdfUrl:
        "https://www.dzexams.com/uploads/sujets/officiels/bac/2026/dzexams-bac-sciences-naturelles-1343688.pdf",
      page: "access_confirmed",
      contentVerified: false,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-31) : titre BAC 2026 filière Maths confirmé ; viewer 0 pages ; lien تحميل observé. Octets PDF non récupérés (TLS). 4D non encodé."
    },
    {
      year: "2025",
      stream: "m",
      session: "main",
      url: `${ANNALES}/VUc5WWNPWjNiTHUwQko3cTVmNnNnZz09`,
      pdfUrl:
        "https://www.dzexams.com/uploads/sujets/officiels/bac/2025/dzexams-bac-sciences-naturelles-1554243.pdf",
      page: "access_confirmed",
      contentVerified: false,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-31) : titre BAC 2025 filière Maths confirmé ; viewer 0 pages ; lien تحميل observé. Octets PDF non récupérés (TLS). 4D non encodé."
    },
    {
      year: "2024",
      stream: "m",
      session: "main",
      url: `${ANNALES}/Y200ZkJ4b092OS9JZ0w3ck4zemNJZz09`,
      pdfUrl:
        "https://www.dzexams.com/uploads/sujets/officiels/bac/2024/dzexams-bac-sciences-naturelles-1482576.pdf",
      page: "access_confirmed",
      contentVerified: false,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-31) : titre BAC 2024 filière Maths confirmé ; viewer 0 pages ; lien تحميل observé. Octets PDF non récupérés (TLS). 4D non encodé."
    },
    {
      year: "2023",
      stream: "m",
      session: "main",
      url: `${ANNALES}/RHdQRjNWUTg5b1VwaGVlKzIxT01EUT09`,
      pdfUrl:
        "https://www.dzexams.com/uploads/sujets/officiels/bac/2023/dzexams-bac-sciences-naturelles-1077342.pdf",
      page: "access_confirmed",
      contentVerified: false,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-31) : titre BAC 2023 filière Maths confirmé ; viewer 0 pages ; lien تحميل observé. Octets PDF non récupérés (TLS). 4D non encodé."
    },
    {
      year: "2022",
      stream: "m",
      session: "main",
      url: `${ANNALES}/bFpLK2JlVmpzUzMzYTFTSnpjcDZGZz09`,
      pdfUrl: "https://www.dzexams.com/uploads/sujets/officiels/bac/2022/dzexams-bac-sciences-1777391.pdf",
      page: "access_confirmed",
      contentVerified: false,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-31) : titre BAC 2022 filière Maths confirmé ; viewer 0 pages ; lien تحميل observé. Octets PDF non récupérés (TLS). 4D non encodé."
    },
    {
      year: "2021",
      stream: "m",
      session: "main",
      url: `${ANNALES}/T2tYS3FTcFRwWCtCbXV2QmFyRTcydz09`,
      page: "consulted",
      contentVerified: true,
      attachments: true,
      viewer: "ok",
      notes:
        "Page ouverte (2026-08-31) : 12 pages ; pièces jointes sciences-m-bac2021 + sciences-m-bac2021-correction ; couche texte inversée lisible. Sujet 1 : CMH et greffe rénale ; Macrolide / résistance bactérienne (Mex.R). 4D non encodé (filière Maths hors APP_CONFIG)."
    },
    {
      year: "2020",
      stream: "m",
      session: "main",
      url: `${ANNALES}/dlFvUnNHKzlTdm5xZHJHMm4vL2hYZz09`,
      page: "consulted",
      contentVerified: true,
      attachments: true,
      viewer: "ok",
      notes:
        "Page ouverte (2026-08-30) : 10 pages ; pièces jointes sciences-m-bac2020 + sciences-m-bac2020-correction ; sujet : structure des protéines/électrophorèse, cancer de la peau (Ras/p53), CMH et rejet de greffe."
    },
    {
      year: "2019",
      stream: "m",
      session: "main",
      url: `${ANNALES}/b2w2cDdSYTdOK05FMjNEMnNGeUlsdz09`,
      pdfUrl: "https://www.dzexams.com/uploads/sujets/officiels/bac/2019/dzexams-bac-sciences-2280992.pdf",
      page: "access_confirmed",
      contentVerified: true,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-30) : titre et filière confirmés; viewer « 0 pages » ; lien de téléchargement direct présent. Contenu du PDF téléchargé et validé via lien direct (HTTP 200, en-tête %PDF, fichier complet)."
    },
    {
      year: "2018",
      stream: "m",
      session: "main",
      url: `${ANNALES}/aDMxL2FtWlZwZ3NmeThCMG5WNk50UT09`,
      pdfUrl: "https://www.dzexams.com/uploads/sujets/officiels/bac/2018/dzexams-bac-sciences-1967487.pdf",
      page: "access_confirmed",
      contentVerified: true,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-30) : titre et filière confirmés; viewer « 0 pages » ; lien de téléchargement direct présent. Contenu du PDF téléchargé et validé via lien direct (HTTP 200, en-tête %PDF, fichier complet)."
    },
    {
      year: "2017",
      stream: "m",
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
      pdfUrl: "https://www.dzexams.com/uploads/sujets/officiels/bac/2017/dzexams-bac-sciences-2275712.pdf",
      page: "access_confirmed",
      contentVerified: true,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-30) : titre et filière confirmés; viewer « 0 pages » ; lien de téléchargement direct présent (chemin /2017/, session 1). Contenu du PDF téléchargé et validé via lien direct (HTTP 200, en-tête %PDF, fichier complet)."
    },
    {
      year: "2016",
      stream: "m",
      session: "main",
      url: `${ANNALES}/TW9GY3FMeVdkeFBBNGIwMmppdi9xQT09`,
      page: "consulted",
      contentVerified: true,
      attachments: true,
      viewer: "ok",
      notes:
        "Page ouverte (2026-08-30) : 11 pages ; pièces jointes sciences-m-bac2016 + sciences-m-bac2016-correction ; sujet : traduction/Anagène, immunité humorale, membrane cellulaire/CMH."
    },
    {
      year: "2015",
      stream: "m",
      session: "main",
      url: `${ANNALES}/QjZpdDhZUjhQOXhSMzZvQnFvVlFjQT09`,
      pdfUrl: "https://www.dzexams.com/uploads/sujets/officiels/bac/2015/dzexams-bac-sciences-2723927.pdf",
      page: "access_confirmed",
      contentVerified: true,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-30) : titre et filière confirmés; viewer « 0 pages » ; lien de téléchargement direct présent. Contenu du PDF téléchargé et validé via lien direct (HTTP 200, en-tête %PDF, fichier complet)."
    },
    {
      year: "2014",
      stream: "m",
      session: "main",
      url: `${ANNALES}/MXlQMjVhL2ZLK25mcEpTWnI5N3JtQT09`,
      pdfUrl: "https://www.dzexams.com/uploads/sujets/officiels/bac/2014/dzexams-bac-sciences-2369148.pdf",
      page: "access_confirmed",
      contentVerified: true,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-30) : titre et filière confirmés; viewer « 0 pages » ; lien de téléchargement direct présent. Contenu du PDF téléchargé et validé via lien direct (HTTP 200, en-tête %PDF, fichier complet)."
    },
    {
      year: "2013",
      stream: "m",
      session: "main",
      url: `${ANNALES}/UmdYdlc3em1RWmJQWEJCbW52Vm12dz09`,
      pdfUrl: "https://www.dzexams.com/uploads/sujets/officiels/bac/2013/dzexams-bac-sciences-2770867.pdf",
      page: "access_confirmed",
      contentVerified: true,
      attachments: false,
      viewer: "blocked",
      notes:
        "Page ouverte (2026-08-30) : titre et filière confirmés; viewer « 0 pages » ; lien de téléchargement direct présent. Contenu du PDF téléchargé et validé via lien direct (HTTP 200, en-tête %PDF, fichier complet)."
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
