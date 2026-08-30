/* ============================================================
   ARCHIVE — Sujets BAC SVT 2013–2020 (liens externes vérifiés)
   ------------------------------------------------------------
   Rôle : catalogue de consultation, PAS d'entraînement 4D.
   Chaque entrée pointe vers la page annales dzexams qui contient
   le sujet officiel (الموضوعان 1 و 2) et le تصحيح النموذجي dans
   son viewer, ou vers le lien de téléchargement direct observé.

   Honnêteté des vérifications (2026-08-30) :
   - `page: "consulted"`  -> la page annales a été ouverte ; le
     titre, l'en-tête (session), les pièces jointes sujet/correction
     et/ou le lien de téléchargement ont été lus.
   - `page: "index"`      -> l'URL provient de l'index officiel de la
     section dzexams (consultée le jour même) ; la page annales n'a
     PAS été relue ici. Le contenu est annoncé « sujet + تصحيح »
     par dzexams (badge « حل ✅ »).

   Absence revendiquée : dzexams ne propose AUCUNE catégorie
   « علوم الطبيعة والحياة » pour la شعبة تقني رياضي (page racine
   /ar/bac/sciences-naturelles : uniquement se et m, vérifié le
   2026-08-30). Aucun lien n'a donc été inventé pour cette شعبة.

   La session exceptionnelle (« الدورة الاستثنائية ») n'existe sur
   dzexams que pour 2016 et 2017 ; les autres années n'ont qu'une
   entrée sur la source.
   ============================================================ */

const ANNALES = "https://www.dzexams.com/ar/annales";

export const ARCHIVE = {
  verifiedAt: "2026-08-30",
  years: "2013-2020",
  sourceLabel: "dzexams.com — sujets officiels + تصحيح النموذجي (viewer / PDF)",
  sourceRoot: "https://www.dzexams.com/ar/bac/sciences-naturelles",
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
    }
  },
  sessions: {
    main: "الدورة الرئيسية",
    exceptional: "الدورة الاستثنائية"
  },
  entries: [
    /* ---------------- شعبة علوم تجريبية ---------------- */
    {
      year: "2020",
      stream: "se",
      session: "main",
      url: `${ANNALES}/SUFqL0VzRjNzdmd6ek1EekpsOTFMdz09`,
      page: "consulted",
      notes:
        "Page consultée (2026-08-30). Pièces jointes : sciences-se-bac2020 + sciences-se-bac2020-correction ; 19 pages ; sujet : sismicité et structure de la Terre, Ibuprofène/Cox-1-Cox-2, immunothérapie du cancer du sein (HER2). Une seule entrée sur la source pour 2020."
    },
    {
      year: "2019",
      stream: "se",
      session: "main",
      url: `${ANNALES}/OHlmRldmdmdDVUNVRHBadTE5em0vdz09`,
      page: "index",
      notes:
        "URL extraite de l'index de la section شعبة علوم تجريبية (consultée le 2026-08-30) ; page annales non relue ici ; dzexams annonce sujet + تصحيح (badge « حل ✅ »)."
    },
    {
      year: "2018",
      stream: "se",
      session: "main",
      url: `${ANNALES}/RGZmd0lTRW0xNmZTRUFjR0F5QzMwZz09`,
      page: "index",
      notes:
        "URL extraite de l'index de la section شعبة علوم تجريبية (consultée le 2026-08-30) ; page annales non relue ici ; dzexams annonce sujet + تصحيح (badge « حل ✅ »)."
    },
    {
      year: "2017",
      stream: "se",
      session: "exceptional",
      url: `${ANNALES}/TmZOSDV6eSt0UGxySFM1RFlTR3M4dz09`,
      page: "consulted",
      notes:
        "Page consultée (2026-08-30). En-tête : « الدورة الاستثنائية 2017 ». Pièces jointes : bac2017_2-sciences-se + bac2017_2-sciences-se-correction ; 18 pages."
    },
    {
      year: "2017",
      stream: "se",
      session: "main",
      url: `${ANNALES}/dFRNWk1JWkt2aC8vdFZtZVNMWGRwZz09`,
      page: "consulted",
      notes:
        "Page consultée (2026-08-30). En-tête : « دورة 2017 ». Pièces jointes : sciences-se-bac2017 + sciences-se-bac2017-correction ; 16 pages."
    },
    {
      year: "2016",
      stream: "se",
      session: "exceptional",
      url: `${ANNALES}/M09NK2ZYVHFzQXg3KzZHazBaTk5IUT09`,
      pdfUrl: "https://www.dzexams.com/uploads/sujets/officiels/bac/2016-2/dzexams-bac-sciences-3814840.pdf",
      page: "consulted",
      notes:
        "Page consultée (2026-08-30). Viewer en ligne vide (0 page) mais lien de téléchargement direct présent : chemin /2016-2/ (session 2). Contenu du PDF non relu."
    },
    {
      year: "2016",
      stream: "se",
      session: "main",
      url: `${ANNALES}/MWliZ2dVaHJFejVUMjdiV3VZS2oxdz09`,
      page: "consulted",
      notes:
        "Page consultée (2026-08-30). En-tête : « دورة 2016 ». Pièces jointes : sciences-se-bac2016 + sciences-se-bac2016-correction ; 21 pages ; sujet : gène et ARN (Anagène), immunité (LT, IL2/CMH), ATP."
    },
    {
      year: "2015",
      stream: "se",
      session: "main",
      url: `${ANNALES}/aTlRWGREbDN3Qit2cVdRaHNmK0FYQT09`,
      page: "index",
      notes:
        "URL extraite de l'index de la section شعبة علوم تجريبية (consultée le 2026-08-30) ; page annales non relue ici ; dzexams annonce sujet + تصحيح (badge « حل ✅ »)."
    },
    {
      year: "2014",
      stream: "se",
      session: "main",
      url: `${ANNALES}/SzdNaHlPbThvaEhSSUJjWDRsdUljdz09`,
      pdfUrl: "https://www.dzexams.com/uploads/sujets/officiels/bac/2014/dzexams-bac-sciences-4380238.pdf",
      page: "consulted",
      notes:
        "Page consultée (2026-08-30). Lien de téléchargement direct présent ; 22 pages au total dans le viewer (sujet + تصحيح attendus). Couche texte du PDF non relue."
    },
    {
      year: "2013",
      stream: "se",
      session: "main",
      url: `${ANNALES}/bjdJbVBZMHFKeUZTcExKSEw4REVNQT09`,
      page: "consulted",
      notes:
        "Page consultée (2026-08-30). Pièces jointes : sciences-se-bac2013 + sciences-se-bac2013-correction + pages scannées BAC2013_Page_004..020 ; 17 pages."
    },

    /* ---------------- شعبة رياضيات ---------------- */
    {
      year: "2020",
      stream: "m",
      session: "main",
      url: `${ANNALES}/dlFvUnNHKzlTdm5xZHJHMm4vL2hYZz09`,
      page: "index",
      notes:
        "URL extraite de l'index de la section شعبة رياضيات (consultée le 2026-08-30) ; page annales non relue ici ; dzexams annonce sujet + تصحيح (badge « حل ✅ »)."
    },
    {
      year: "2019",
      stream: "m",
      session: "main",
      url: `${ANNALES}/b2w2cDdSYTdOK05FMjNEMnNGeUlsdz09`,
      page: "index",
      notes:
        "URL extraite de l'index de la section شعبة رياضيات (consultée le 2026-08-30) ; page annales non relue ici ; dzexams annonce sujet + تصحيح (badge « حل ✅ »)."
    },
    {
      year: "2018",
      stream: "m",
      session: "main",
      url: `${ANNALES}/aDMxL2FtWlZwZ3NmeThCMG5WNk50UT09`,
      page: "index",
      notes:
        "URL extraite de l'index de la section شعبة رياضيات (consultée le 2026-08-30) ; page annales non relue ici ; dzexams annonce sujet + تصحيح (badge « حل ✅ »)."
    },
    {
      year: "2017",
      stream: "m",
      session: "exceptional",
      url: `${ANNALES}/eU1zMTNYMTJTLzROeWhLTkxaajRWZz09`,
      page: "consulted",
      notes:
        "Page consultée (2026-08-30). En-tête : « الدورة الاستثنائية 2017 » ; شعبة رياضيات. Pièces jointes : bac2017_2-sciences-m + bac2017_2-sciences-m-correction ; 11 pages ; sujet : immunité/lyse, traduction, immunoglobulines, structures protéiques (Rastop)."
    },
    {
      year: "2017",
      stream: "m",
      session: "main",
      url: `${ANNALES}/bEdWa2IycjEzcUY1S3FmUnpxdzhrQT09`,
      pdfUrl: "https://www.dzexams.com/uploads/sujets/officiels/bac/2017/dzexams-bac-sciences-2275712.pdf",
      page: "consulted",
      notes:
        "Page consultée (2026-08-30). Viewer en ligne vide (0 page) mais lien de téléchargement direct présent (chemin /2017/, session 1). Contenu du PDF non relu."
    },
    {
      year: "2016",
      stream: "m",
      session: "main",
      url: `${ANNALES}/TW9GY3FMeVdkeFBBNGIwMmppdi9xQT09`,
      page: "index",
      notes:
        "URL extraite de l'index de la section شعبة رياضيات (consultée le 2026-08-30) ; page annales non relue ici ; dzexams annonce sujet + تصحيح (badge « حل ✅ »)."
    },
    {
      year: "2015",
      stream: "m",
      session: "main",
      url: `${ANNALES}/QjZpdDhZUjhQOXhSMzZvQnFvVlFjQT09`,
      page: "index",
      notes:
        "URL extraite de l'index de la section شعبة رياضيات (consultée le 2026-08-30) ; page annales non relue ici ; dzexams annonce sujet + تصحيح (badge « حل ✅ »)."
    },
    {
      year: "2014",
      stream: "m",
      session: "main",
      url: `${ANNALES}/MXlQMjVhL2ZLK25mcEpTWnI5N3JtQT09`,
      page: "index",
      notes:
        "URL extraite de l'index de la section شعبة رياضيات (consultée le 2026-08-30) ; page annales non relue ici ; dzexams annonce sujet + تصحيح (badge « حل ✅ »)."
    },
    {
      year: "2013",
      stream: "m",
      session: "main",
      url: `${ANNALES}/UmdYdlc3em1RWmJQWEJCbW52Vm12dz09`,
      page: "index",
      notes:
        "URL extraite de l'index de la section شعبة رياضيات (consultée le 2026-08-30) ; page annales non relue ici ; dzexams annonce sujet + تصحيح (badge « حل ✅ »)."
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
