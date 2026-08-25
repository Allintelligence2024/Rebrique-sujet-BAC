import { store } from "../store.js";

/* Application timer state; kept outside domain scoring. */
export const timers = {
  globalInterval: null,
  strategyInterval: null,
  onChange: null, // callback( which: 'global'|'strategy' )

  _tick(which) {
    const now = Date.now();
    if (which === "global") {
      if (!store.state.sessionActive) return;
      const last = store.state.globalLastTick || now;
      const seconds = Math.max(1, Math.floor((now - last) / 1000));
      store.state.globalLastTick = now;
      store.tickGlobal(seconds);
      if (store.state.globalRemaining <= 0) {
        store.state.globalRemaining = 0;
        clearInterval(this.globalInterval);
        this.globalInterval = null;
      }
    } else {
      if (!store.state.strategyRunning) return;
      const last = store.state.strategyLastTick || now;
      const seconds = Math.max(1, Math.floor((now - last) / 1000));
      store.state.strategyLastTick = now;
      store.tickStrategy(seconds);
      if (store.state.strategyRemaining <= 0) {
        store.state.strategyRemaining = 0;
        clearInterval(this.strategyInterval);
        this.strategyInterval = null;
        store.state.strategyRunning = false;
      }
    }
    store.save();
    if (this.onChange) this.onChange(which);
  },

  startGlobal() {
    if (this.globalInterval) clearInterval(this.globalInterval);
    store.state.sessionActive = true;
    store.state.globalLastTick = Date.now();
    this.globalInterval = setInterval(() => this._tick("global"), 1000);
    store.save();
    if (this.onChange) this.onChange("global");
  },

  startStrategy() {
    if (this.strategyInterval) clearInterval(this.strategyInterval);
    store.state.strategyRunning = true;
    store.state.strategyLastTick = Date.now();
    this.strategyInterval = setInterval(() => this._tick("strategy"), 1000);
    store.save();
    if (this.onChange) this.onChange("strategy");
  },

  stopStrategy() {
    if (this.strategyInterval) {
      clearInterval(this.strategyInterval);
      this.strategyInterval = null;
    }
    store.state.strategyRunning = false;
    store.save();
  },

  stopAll() {
    if (this.globalInterval) clearInterval(this.globalInterval);
    if (this.strategyInterval) clearInterval(this.strategyInterval);
    this.globalInterval = this.strategyInterval = null;
    store.state.strategyRunning = false;
  }
};
