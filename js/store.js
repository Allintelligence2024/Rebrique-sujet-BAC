/* ============================================================
   STORE — état applicatif + persistance (localStorage)
   ------------------------------------------------------------
   Améliorations vs v1 :
     - la progression survit à un refresh / une fermeture.
     - les timers sont ancrés sur Date.now() -> pas de dérive,
       pas de gel en arrière-plan d'onglet, pas de reset au F5.
   ============================================================ */

const KEY = "boussole4d.v2";

function emptyExercise() {
  return {
    answeredAny: false,
    scores: { N: 0, S: 0, E: 0, W: 0 },
    text: { N: "", S: "", E: "", W: "" },
    fields: {},                 // zones de saisie multiples (exercice pipeline)
    pipeline: { stream1: [null, null, null, null], stream2: [null, null, null, null] }
  };
}

function defaultState() {
  return {
    activeScreen: "view-hub",
    sessionActive: false,
    yearId: "2025",
    sujetId: 1,
    activeExercise: 1,
    activeStep: 1,
    globalRemaining: 270 * 60,   // 4h30
    globalLastTick: null,
    strategyRemaining: 25 * 60,  // 25 min
    strategyLastTick: null,
    strategyRunning: false,
    subjects: {}                 // { [sujetId]: { [exNum]: emptyExercise() } }
  };
}

export const store = {
  state: defaultState(),
  loaded: false,

  load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.state = { ...defaultState(), ...parsed };
      }
    } catch (e) { /* stockage indisponible -> on garde le défaut */ }
    this.loaded = true;
    // Recalcule le « temps écoulé » pendant l'absence si session active
    this._reconcileTimers();
    return this.state;
  },

  save() {
    try { localStorage.setItem(KEY, JSON.stringify(this.state)); } catch (e) {}
  },

  reset() {
    localStorage.removeItem(KEY);
    this.state = defaultState();
    this.save();
  },

  /** Recompute du temps restant à partir de l'horloge réelle. */
  _reconcileTimers() {
    const now = Date.now();
    if (this.state.sessionActive && this.state.globalLastTick) {
      const elapsedGlobal = Math.max(0, Math.floor((now - this.state.globalLastTick) / 1000));
      if (this.state.globalRemaining > 0) {
        this.state.globalRemaining = Math.max(0, this.state.globalRemaining - elapsedGlobal);
      }
      this.state.globalLastTick = now;
    }
    if (this.state.strategyRunning && this.state.strategyLastTick) {
      const elapsedStrategy = Math.max(0, Math.floor((now - this.state.strategyLastTick) / 1000));
      if (this.state.strategyRemaining > 0) {
        this.state.strategyRemaining = Math.max(0, this.state.strategyRemaining - elapsedStrategy);
      }
      this.state.strategyLastTick = now;
    }
  },

  /** Tick appelé par le moteur de minuteurs (toutes les secondes). */
  tickGlobal(seconds) {
    this.state.globalRemaining = Math.max(0, this.state.globalRemaining - seconds);
    this.state.globalLastTick = Date.now();
  },
  tickStrategy(seconds) {
    this.state.strategyRemaining = Math.max(0, this.state.strategyRemaining - seconds);
    this.state.strategyLastTick = Date.now();
  },

  exercise(sujetId, exNum) {
    if (!this.state.subjects[sujetId]) this.state.subjects[sujetId] = {};
    if (!this.state.subjects[sujetId][exNum]) this.state.subjects[sujetId][exNum] = emptyExercise();
    return this.state.subjects[sujetId][exNum];
  },

  enterSession(yearId, sujetId) {
    this.state.yearId = yearId;
    this.state.sujetId = sujetId || 1;
    this.state.sessionActive = true;
    this.state.globalLastTick = Date.now();
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
