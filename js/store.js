/* ============================================================
   STORE — état applicatif, persistance et migrations validées
   ============================================================ */

import { reportDiagnostic } from "./services/diagnostics.js";

const KEY = "boussole4d.v3";
const LEGACY_KEY = "boussole4d.v2";
export const CURRENT_SCHEMA_VERSION = 2;
const POLES = ["N", "S", "E", "W"];
const SCREENS = new Set(["view-hub", "view-guide", "view-strategy", "view-onboarding", "view-workspace"]);

const isRecord = (value) => !!value && typeof value === "object" && !Array.isArray(value);
const asString = (value) => (typeof value === "string" ? value : "");
const asFiniteNumber = (value, fallback, min = -Infinity, max = Infinity) =>
  typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

function emptyExercise() {
  return {
    answeredAny: false,
    scores: { N: 0, S: 0, E: 0, W: 0 },
    text: { N: "", S: "", E: "", W: "" },
    scratch: { N: "", S: "", E: "", W: "", free: "" },
    fields: {},
    pipeline: { stream1: [null, null, null, null], stream2: [null, null, null, null] }
  };
}

function defaultState() {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    activeScreen: "view-hub",
    sessionActive: false,
    reviewMode: true,
    yearId: "2025",
    sujetId: 1,
    activeExercise: 1,
    activeStep: 1,
    globalRemaining: 270 * 60,
    globalLastTick: null,
    strategyRemaining: 25 * 60,
    strategyLastTick: null,
    strategyRunning: false,
    // { [yearId]: { [sujetId]: { [exNum]: emptyExercise() } } }
    progress: {}
  };
}

function sanitizeExercise(value) {
  const raw = isRecord(value) ? value : {};
  const safe = emptyExercise();
  safe.answeredAny = raw.answeredAny === true;
  for (const pole of POLES) {
    safe.scores[pole] = asFiniteNumber(raw.scores?.[pole], 0, 0, 20);
    safe.text[pole] = asString(raw.text?.[pole]);
    safe.scratch[pole] = asString(raw.scratch?.[pole]);
  }
  safe.scratch.free = asString(raw.scratch?.free);
  if (isRecord(raw.fields)) {
    for (const [key, value] of Object.entries(raw.fields)) {
      if (typeof value === "string" && key.length <= 100) safe.fields[key] = value;
    }
  }
  for (const stream of ["stream1", "stream2"]) {
    const values = Array.isArray(raw.pipeline?.[stream]) ? raw.pipeline[stream] : [];
    safe.pipeline[stream] = Array.from({ length: 4 }, (_, index) => {
      const block = values[index];
      return typeof block === "string" && block.length <= 100 ? block : null;
    });
  }
  return safe;
}

function sanitizeProgress(value) {
  const progress = {};
  if (!isRecord(value)) return progress;
  for (const [yearId, subjects] of Object.entries(value)) {
    if (!/^\d{4}$/.test(yearId) || !isRecord(subjects)) continue;
    progress[yearId] = {};
    for (const [sujetId, exercises] of Object.entries(subjects)) {
      if (!/^[1-9]\d*$/.test(sujetId) || !isRecord(exercises)) continue;
      progress[yearId][sujetId] = {};
      for (const [exerciseId, exercise] of Object.entries(exercises)) {
        if (!/^[1-9]\d*$/.test(exerciseId)) continue;
        progress[yearId][sujetId][exerciseId] = sanitizeExercise(exercise);
      }
    }
  }
  return progress;
}

/** Migrates only known, unambiguous local schemas. Never guesses an exercise year. */
export function migrateState(candidate) {
  if (!isRecord(candidate)) throw new Error("state is not an object");
  const version = candidate.schemaVersion;
  if (version === undefined && isRecord(candidate.progress)) {
    // v3 introduced year-keyed progress but did not persist a schema version.
    return { ...candidate, schemaVersion: CURRENT_SCHEMA_VERSION, reviewMode: true };
  }
  if (version === 1) return { ...candidate, schemaVersion: 2, reviewMode: true };
  if (version === CURRENT_SCHEMA_VERSION) return candidate;
  if (typeof version === "number" && version > CURRENT_SCHEMA_VERSION) {
    throw new Error(`unsupported future schema ${version}`);
  }
  throw new Error(`unsupported schema ${String(version)}`);
}

/** Whitelist and normalize persisted values; never shallow-merge untrusted storage. */
export function validateState(candidate) {
  if (!isRecord(candidate) || candidate.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    throw new Error("invalid schema version");
  }
  const state = defaultState();
  state.activeScreen = SCREENS.has(candidate.activeScreen) ? candidate.activeScreen : state.activeScreen;
  state.sessionActive = candidate.sessionActive === true;
  state.reviewMode = candidate.reviewMode === true;
  state.yearId = /^\d{4}$/.test(candidate.yearId) ? candidate.yearId : state.yearId;
  state.sujetId = asFiniteNumber(candidate.sujetId, state.sujetId, 1, 9);
  state.activeExercise = asFiniteNumber(candidate.activeExercise, state.activeExercise, 1, 9);
  state.activeStep = asFiniteNumber(candidate.activeStep, state.activeStep, 1, 4);
  state.globalRemaining = asFiniteNumber(candidate.globalRemaining, state.globalRemaining, 0, 24 * 60 * 60);
  state.globalLastTick = asFiniteNumber(candidate.globalLastTick, null, 0);
  state.strategyRemaining = asFiniteNumber(
    candidate.strategyRemaining,
    state.strategyRemaining,
    0,
    24 * 60 * 60
  );
  state.strategyLastTick = asFiniteNumber(candidate.strategyLastTick, null, 0);
  state.strategyRunning = candidate.strategyRunning === true;
  state.progress = sanitizeProgress(candidate.progress);
  return state;
}

function backupMalformed(raw) {
  try {
    localStorage.setItem(`${KEY}.corrupt-${Date.now()}`, raw);
  } catch (error) {
    reportDiagnostic("store.backup-malformed", error);
  }
}

export const store = {
  state: defaultState(),
  loaded: false,

  load() {
    this.state = defaultState();
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        try {
          this.state = validateState(migrateState(JSON.parse(raw)));
          // Persist migration/normalization immediately so it runs once.
          this.save();
        } catch (error) {
          reportDiagnostic("store.load-invalid-state", error);
          backupMalformed(raw);
        }
      } else {
        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy) {
          // v2 had no year in exercise keys. Keeping it is safer than a false migration.
          localStorage.setItem(`${LEGACY_KEY}.legacy-unmigrated`, legacy);
          localStorage.removeItem(LEGACY_KEY);
        }
      }
    } catch (error) {
      reportDiagnostic("store.load-unavailable", error);
      /* Storage unavailable: retain a safe default state. */
    }
    this.loaded = true;
    this._reconcileTimers();
    return this.state;
  },

  save() {
    try {
      this.state.schemaVersion = CURRENT_SCHEMA_VERSION;
      localStorage.setItem(KEY, JSON.stringify(this.state));
    } catch (error) {
      reportDiagnostic("store.save", error);
    }
  },

  reset() {
    try {
      localStorage.removeItem(KEY);
    } catch (error) {
      reportDiagnostic("store.reset", error);
    }
    this.state = defaultState();
    this.save();
  },

  _reconcileTimers() {
    const now = Date.now();
    if (this.state.sessionActive && this.state.globalLastTick) {
      const elapsed = Math.max(0, Math.floor((now - this.state.globalLastTick) / 1000));
      this.state.globalRemaining = Math.max(0, this.state.globalRemaining - elapsed);
      this.state.globalLastTick = now;
    }
    if (this.state.strategyRunning && this.state.strategyLastTick) {
      const elapsed = Math.max(0, Math.floor((now - this.state.strategyLastTick) / 1000));
      this.state.strategyRemaining = Math.max(0, this.state.strategyRemaining - elapsed);
      this.state.strategyLastTick = now;
    }
  },

  tickGlobal(seconds) {
    this.state.globalRemaining = Math.max(0, this.state.globalRemaining - seconds);
    this.state.globalLastTick = Date.now();
  },
  tickStrategy(seconds) {
    this.state.strategyRemaining = Math.max(0, this.state.strategyRemaining - seconds);
    this.state.strategyLastTick = Date.now();
  },

  exercise(yearId, sujetId, exNum) {
    if (!yearId) throw new Error("yearId est requis pour isoler la progression BAC.");
    if (!this.state.progress[yearId]) this.state.progress[yearId] = {};
    if (!this.state.progress[yearId][sujetId]) this.state.progress[yearId][sujetId] = {};
    if (!this.state.progress[yearId][sujetId][exNum])
      this.state.progress[yearId][sujetId][exNum] = emptyExercise();
    return this.state.progress[yearId][sujetId][exNum];
  },

  enterSession(yearId, sujetId) {
    this.state.yearId = yearId;
    this.state.sujetId = sujetId || 1;
    this.state.sessionActive = true;
    this.state.globalLastTick = Date.now();
    this.save();
  },
  setReviewMode(enabled) {
    this.state.reviewMode = enabled === true;
    this.save();
  },
  setActiveExercise(n) {
    this.state.activeExercise = n;
    this.state.activeStep = 1;
    this.save();
  },
  setActiveStep(step) {
    this.state.activeStep = step;
    this.save();
  },
  setActiveScreen(screenId) {
    this.state.activeScreen = screenId;
    this.save();
  }
};

export const helpers = {
  fmt(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const p = (n) => String(n).padStart(2, "0");
    return h > 0 ? `${p(h)}:${p(m)}:${p(s)}` : `${p(m)}:${p(s)}`;
  }
};
