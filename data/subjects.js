/* ============================================================
   Catalogue léger et chargeur de sujets BAC
   ------------------------------------------------------------
   Ce module fait partie du shell PWA. Il ne contient aucun sujet
   complet et n'importe statiquement aucun payload d'année.
   Les fichiers data/years/<filière>/year-<année>.js sont chargés
   uniquement lorsque l'élève ouvre l'année correspondante.
   ============================================================ */

/** Normalisation du texte arabe : variantes, tatweel, ponctuation. */
export function normalizeArabic(text) {
  if (!text) return "";
  return String(text)
    .replace(/[إأآاٱ]/g, "ا")
    .replace(/[ىيی]/g, "ي")
    .replace(/ک/g, "ك")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[ًٌٍَُِّْ]/g, "")
    .replace(/\u0640/g, "")
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/٫/g, ".")
    .replace(/[\u00A0\u200B\u200C\u200D\uFEFF]/g, " ")
    .replace(/[؟?!.,،؛:«»"“”‘’()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
  // Le hamza isolé ء reste distinct : le retirer fusionnerait ماء (eau)
  // avec ما (particule) et créerait des faux positifs.
}

/** Retire les préfixes / clitiques arabes les plus fréquents. */
export function stripArabicClitics(word) {
  if (!word) return "";
  const normalized = normalizeArabic(word);
  if (/^(كال|بال|فال|وال|لل)/.test(normalized)) {
    return normalized.replace(/^(كال|بال|فال|وال|لل)/, "");
  }
  if (/^ال/.test(normalized)) return normalized.replace(/^ال/, "");
  return normalized.replace(/^[كبفول]/, "");
}

export const EXAM_MINUTES_BY_STREAM = Object.freeze({
  se: 270,
  m: 150
});

/** Durée officielle de l'épreuve SVT selon la filière, surchargeable par session. */
export function examMinutesForYear(year) {
  if (Number.isFinite(year?.examMinutes) && year.examMinutes > 0) return year.examMinutes;
  return EXAM_MINUTES_BY_STREAM[year?.stream || "se"] || EXAM_MINUTES_BY_STREAM.se;
}

const catalogEntry = (entry) => Object.freeze(entry);

/**
 * Métadonnées suffisantes pour afficher le hub sans télécharger les sujets.
 * `modulePath` est public afin que les audits PWA puissent prouver le découpage,
 * mais seuls les chargeurs à spécificateurs littéraux ci-dessous font les imports.
 */
export const YEAR_CATALOG = Object.freeze([
  catalogEntry({
    id: "2025",
    stream: "se",
    calendarYear: "2025",
    label: "بكالوريا الجزائر دورة 2025",
    badge: "دورة نموذجية",
    theme: "emerald",
    enabled: true,
    subjectCount: 2,
    exerciseCounts: [3, 3],
    modulePath: "data/years/se/year-2025.js"
  }),
  catalogEntry({
    id: "2024",
    stream: "se",
    calendarYear: "2024",
    label: "بكالوريا الجزائر دورة 2024",
    badge: "دورة رسمية",
    theme: "indigo",
    enabled: true,
    subjectCount: 2,
    exerciseCounts: [3, 3],
    modulePath: "data/years/se/year-2024.js"
  }),
  catalogEntry({
    id: "2023",
    stream: "se",
    calendarYear: "2023",
    label: "بكالوريا الجزائر دورة 2023",
    badge: "دورة رسمية",
    theme: "amber",
    enabled: true,
    subjectCount: 2,
    exerciseCounts: [3, 3],
    modulePath: "data/years/se/year-2023.js"
  }),
  catalogEntry({
    id: "2022",
    stream: "se",
    calendarYear: "2022",
    label: "بكالوريا الجزائر دورة 2022",
    badge: "دورة رسمية",
    theme: "rose",
    enabled: true,
    subjectCount: 2,
    exerciseCounts: [3, 3],
    modulePath: "data/years/se/year-2022.js"
  }),
  catalogEntry({
    id: "2026",
    stream: "se",
    calendarYear: "2026",
    label: "بكالوريا الجزائر دورة 2026",
    badge: "دورة رسمية",
    theme: "emerald",
    enabled: true,
    subjectCount: 2,
    exerciseCounts: [3, 3],
    modulePath: "data/years/se/year-2026.js"
  }),
  catalogEntry({
    id: "2020",
    stream: "se",
    calendarYear: "2020",
    label: "بكالوريا الجزائر دورة 2020",
    badge: "دورة رسمية",
    theme: "emerald",
    enabled: true,
    subjectCount: 2,
    exerciseCounts: [3, 3],
    modulePath: "data/years/se/year-2020.js"
  }),
  ...[
    ["2019", "amber"],
    ["2018", "emerald"],
    ["2017", "rose"],
    ["2016", "purple"],
    ["2015", "indigo"],
    ["2014", "amber"],
    ["2013", "emerald"]
  ].map(([id, theme]) =>
    catalogEntry({
      id,
      stream: "se",
      calendarYear: id,
      label: `بكالوريا الجزائر دورة ${id}`,
      badge: "أرشيف مُعاد بناؤه",
      theme,
      enabled: true,
      subjectCount: 2,
      exerciseCounts: [3, 3],
      modulePath: `data/years/se/year-${id}.js`
    })
  ),
  ...["2021", "2022", "2023", "2024", "2025", "2026"].map((calendarYear) =>
    catalogEntry({
      id: `${calendarYear}-m`,
      stream: "m",
      calendarYear,
      label: `بكالوريا الجزائر دورة ${calendarYear} — شعبة رياضيات`,
      badge: "دورة رسمية",
      theme: "indigo",
      enabled: true,
      subjectCount: 2,
      exerciseCounts: [2, 2],
      modulePath: `data/years/m/year-${calendarYear}.js`
    })
  )
]);

// Les spécificateurs littéraux sont intentionnels : le navigateur ne télécharge
// que le module choisi et esbuild peut inclure tous les payloads dans le fichier
// autonome destiné à file://.
const YEAR_LOADERS = Object.freeze({
  2013: () => import("./years/se/year-2013.js"),
  2014: () => import("./years/se/year-2014.js"),
  2015: () => import("./years/se/year-2015.js"),
  2016: () => import("./years/se/year-2016.js"),
  2017: () => import("./years/se/year-2017.js"),
  2018: () => import("./years/se/year-2018.js"),
  2019: () => import("./years/se/year-2019.js"),
  2020: () => import("./years/se/year-2020.js"),
  2022: () => import("./years/se/year-2022.js"),
  2023: () => import("./years/se/year-2023.js"),
  2024: () => import("./years/se/year-2024.js"),
  2025: () => import("./years/se/year-2025.js"),
  2026: () => import("./years/se/year-2026.js"),
  "2021-m": () => import("./years/m/year-2021.js"),
  "2022-m": () => import("./years/m/year-2022.js"),
  "2023-m": () => import("./years/m/year-2023.js"),
  "2024-m": () => import("./years/m/year-2024.js"),
  "2025-m": () => import("./years/m/year-2025.js"),
  "2026-m": () => import("./years/m/year-2026.js")
});

const loadedYears = new Map();
const pendingYears = new Map();

function validateLoadedYear(id, year) {
  const metadata = YEAR_CATALOG.find((entry) => entry.id === id);
  if (!metadata || !year || typeof year !== "object") throw new Error(`بيانات السنة ${id} غير صالحة.`);
  if (year.id !== id || (year.stream || "se") !== metadata.stream) {
    throw new Error(`هوية بيانات السنة ${id} غير متطابقة.`);
  }
  if (!Array.isArray(year.sujets) || year.sujets.length !== metadata.subjectCount) {
    throw new Error(`عدد مواضيع السنة ${id} غير متطابق.`);
  }
  const exercisesMatch = year.sujets.every(
    (subject, index) =>
      subject?.id === index + 1 &&
      Array.isArray(subject.exercises) &&
      subject.exercises.length === metadata.exerciseCounts[index]
  );
  if (!exercisesMatch) throw new Error(`بنية تمارين السنة ${id} غير متطابقة.`);
  return year;
}

/** Retourne une année déjà chargée, sans provoquer de requête réseau. */
export function getLoadedYear(id) {
  return loadedYears.get(String(id)) || null;
}

/** Charge et valide un seul payload. Les appels concurrents partagent la même promesse. */
export function loadYear(id) {
  const normalizedId = String(id || "");
  if (loadedYears.has(normalizedId)) return Promise.resolve(loadedYears.get(normalizedId));
  if (pendingYears.has(normalizedId)) return pendingYears.get(normalizedId);
  const loader = YEAR_LOADERS[normalizedId];
  if (!loader) return Promise.reject(new RangeError(`سنة غير معروفة: ${normalizedId || "—"}`));

  const pending = loader()
    .then((module) => validateLoadedYear(normalizedId, module.default))
    .then((year) => {
      loadedYears.set(normalizedId, year);
      pendingYears.delete(normalizedId);
      return year;
    })
    .catch((error) => {
      pendingYears.delete(normalizedId);
      throw error;
    });
  pendingYears.set(normalizedId, pending);
  return pending;
}

/** Utilisé par les audits et tests exhaustifs, jamais par le démarrage du navigateur. */
export async function loadAllYears() {
  return Promise.all(YEAR_CATALOG.map((entry) => loadYear(entry.id)));
}

/** Configuration complète destinée aux outils hors navigateur. */
export async function loadFullAppConfig() {
  return { ...APP_CONFIG, years: await loadAllYears() };
}

export function loadedYearIds() {
  return YEAR_CATALOG.map((entry) => entry.id).filter((id) => loadedYears.has(id));
}

export const APP_CONFIG = Object.freeze({
  appTitle: "مفتاح الكنز",
  appSubtitle: "منهجية الإجابة — بكالوريا علوم الطبيعة والحياة",
  examMinutesByStream: EXAM_MINUTES_BY_STREAM,
  strategyMinutes: 25,
  dataLoading: "on-demand",
  note: "تُحمّل بيانات كل سنة عند اختيارها فقط. 2025 مُراجع على PDF المستودع؛ بقية حالات المصدر الرسمية أو المعاد بناؤها موثقة داخل كل تعليمة.",
  years: YEAR_CATALOG
});
