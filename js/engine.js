/* ============================================================
   ENGINE — évaluation réelle + minuteurs fiables
   ------------------------------------------------------------
   Améliorations vs v1 :
     - la note n'est plus "au clic" : on analyse la réponse
       (mots-clés normalisés, inter-dits, longueur minimale).
     - on renvoie un feedback pédagogique (ce qui manque, ce
       qu'il ne faut pas écrire).
     - timers ancrés sur Date.now() (aucune dérive / gel).
   ============================================================ */

import { normalizeArabic } from "../data/subjects.js";
import { store } from "./store.js";

/* ---------- Évaluation d'un champ de texte (pôles N/S/E/W) ---------- */
export function evaluateText(text, rule) {
  const norm = normalizeArabic(text);
  const keywords = rule.keywords || [];
  const forbidden = rule.forbidden || [];
  const req = rule.minHits || 0;
  const minLen = rule.minLength || 0;

  const hits = keywords.filter(k => norm.includes(normalizeArabic(k))).length;
  const missing = keywords.filter(k => !norm.includes(normalizeArabic(k)));
  const forbiddenFound = forbidden.filter(k => norm.includes(normalizeArabic(k)));

  const lengthRatio = minLen ? Math.min(1, norm.length / minLen) : 1;
  const contentRatio = req ? Math.min(1, hits / req) : (hits > 0 ? 1 : 0);

  let fraction = 0;
  if (norm.length > 0) {
    fraction = Math.min(1, 0.6 * contentRatio + 0.4 * lengthRatio);
  }
  if (forbiddenFound.length) {
    fraction = Math.min(fraction, 0.3); // mot interdit (ex: "بسبب" à l'étape S) -> plafonne
  }

  return {
    fraction,
    hits, missing, forbiddenFound,
    length: norm.length, minLen,
    empty: norm.length === 0
  };
}

export function scoreFromFraction(points, fraction) {
  return Math.round(points * fraction * 100) / 100;
}

/* ---------- Évaluation du pipeline (exercice 3) ---------- */
export function evaluatePipeline(blocksBank, arrangement) {
  let correct = 0, total = 0;
  const wrongSlots = [];
  for (const [key, arr] of Object.entries(arrangement || {})) {
    const streamIdx = key === "stream1" ? 1 : 2;
    (arr || []).forEach((blockId, slot) => {
      if (!blockId) return;
      total++;
      const blk = blocksBank.find(b => b.id === blockId);
      const ok = blk && blk.stream === streamIdx && blk.slot === slot;
      if (ok) correct++;
      else wrongSlots.push({ stream: streamIdx, slot, id: blockId });
    });
  }
  return { correct, total, fraction: total ? correct / total : 0, wrongSlots };
}

/* ---------- Minuteurs (ancrés sur l'horloge réelle) ---------- */
export const timers = {
  globalInterval: null,
  strategyInterval: null,
  onChange: null,   // callback( which: 'global'|'strategy' )

  _tick(which) {
    const now = Date.now();
    let seconds = 0;
    if (which === "global") {
      seconds = Math.floor((now - (store.state.globalLastTick || now)) / 1000);
      store.state.globalLastTick = now;
      if (seconds > 0) store.tickGlobal(Math.min(seconds, 60)); // borne anti-rafale
      if (store.state.globalRemaining <= 0) { clearInterval(this.globalInterval); this.globalInterval = null; }
    } else {
      seconds = Math.floor((now - (store.state.strategyLastTick || now)) / 1000);
      store.state.strategyLastTick = now;
      if (seconds > 0) store.tickStrategy(Math.min(seconds, 60));
      if (store.state.strategyRemaining <= 0) { clearInterval(this.strategyInterval); this.strategyInterval = null; }
    }
    store.save();
    if (this.onChange) this.onChange(which);
  },

  startGlobal() {
    if (this.globalInterval) clearInterval(this.globalInterval);
    store.state.globalLastTick = Date.now();
    this.globalInterval = setInterval(() => this._tick("global"), 1000);
    if (this.onChange) this.onChange("global");
  },

  startStrategy() {
    if (this.strategyInterval) clearInterval(this.strategyInterval);
    store.state.strategyLastTick = Date.now();
    this.strategyInterval = setInterval(() => this._tick("strategy"), 1000);
    if (this.onChange) this.onChange("strategy");
  },

  stopStrategy() { if (this.strategyInterval) { clearInterval(this.strategyInterval); this.strategyInterval = null; } },
  stopAll() {
    if (this.globalInterval) clearInterval(this.globalInterval);
    if (this.strategyInterval) clearInterval(this.strategyInterval);
    this.globalInterval = this.strategyInterval = null;
  }
};
