/* ============================================================
   ENGINE — évaluation sémantique réelle + minuteurs fiables
   ------------------------------------------------------------
   Améliorations P1 :
     - Tolérance aux variantes de mots-clés et clitiques arabes.
     - Évaluation pondérée : zéro concept biologique = zéro point.
     - Feedback précis (notions acquises vs manquantes vs interdits).
   ============================================================ */

import { normalizeArabic, stripArabicClitics } from "../data/subjects.js";
import { store } from "./store.js";

/* ---------- Vérification d'un concept sémantique ---------- */
export function matchConcept(text, conceptDef) {
  if (!text) return false;
  const normText = normalizeArabic(text);
  if (!normText) return false;

  const synonyms = Array.isArray(conceptDef) ? conceptDef : [conceptDef];
  const words = normText.split(/\s+/).filter(Boolean);
  const strippedWords = words.map(stripArabicClitics);

  for (const syn of synonyms) {
    const normSyn = normalizeArabic(syn);
    if (!normSyn) continue;

    // 1. Correspondance sous-chaîne directe
    if (normText.includes(normSyn)) return true;

    // 2. Correspondance au niveau mot (sans clitiques / préfixes arabes)
    const strippedSyn = stripArabicClitics(normSyn);
    if (strippedWords.some(w => w === strippedSyn || (strippedSyn.length >= 4 && w.startsWith(strippedSyn)))) {
      return true;
    }
  }
  return false;
}

/* ---------- Analyse de la structure syntaxique et méthodologique ---------- */
export function analyzeSentenceStructure(normText, poleType) {
  if (!normText) return { wordCount: 0, connectorHits: 0, isKeywordDump: true, hasConnectors: false };
  const words = normText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Verbes et connecteurs syntaxiques essentiels de l'arabe scientifique
  const CONNECTORS = [
    "في", "من", "علي", "الي", "عن", "مع", "خلال", "عبر", "داخل", "خارج",
    "ان", "انها", "حيث", "اذ", "عند", "عندما", "بينما", "حين",
    "بواسطه", "عن طريق", "مما", "ادي", "يؤدي", "يعمل", "يقوم", "يلعب",
    "يتم", "نلاحظ", "يبين", "يوضح", "يمثل", "يعود", "يرتبط", "يثبت",
    "يتثبت", "ينتج", "بالتالي", "نستنتج", "ومنه", "اذن", "خلاصه", "مقارنه",
    "تفسير", "دورا", "اساسيا", "نتيجه", "تاثير", "بسبب", "العلاقه"
  ];

  const connectorHits = CONNECTORS.filter(c => normText.includes(c)).length;
  // Détection d'un simple empilement de mots-clés sans phrase structurée
  const isKeywordDump = wordCount < 5 || (wordCount <= 8 && connectorHits === 0);
  const hasConnectors = connectorHits > 0;

  return {
    wordCount,
    connectorHits,
    isKeywordDump,
    hasConnectors
  };
}

/* ---------- Évaluation d'un champ de texte (pôles N/S/E/W) ---------- */
export function evaluateText(text, rule = {}, poleType = "") {
  const norm = normalizeArabic(text);
  const keywords = rule.keywords || [];
  const forbidden = rule.forbidden || [];
  const req = rule.minHits || (keywords.length ? Math.min(2, keywords.length) : 0);
  const minLen = rule.minLength || 0;

  if (!norm || norm.length === 0) {
    return {
      fraction: 0,
      hits: 0,
      req,
      matched: [],
      missing: keywords.map(k => Array.isArray(k) ? k[0] : k),
      forbiddenFound: [],
      length: 0,
      minLen,
      isKeywordDump: false,
      wordCount: 0,
      empty: true
    };
  }

  const structure = analyzeSentenceStructure(norm, poleType);
  const matched = [];
  const missing = [];

  keywords.forEach(concept => {
    if (matchConcept(norm, concept)) {
      matched.push(Array.isArray(concept) ? concept[0] : concept);
    } else {
      missing.push(Array.isArray(concept) ? concept[0] : concept);
    }
  });

  const hits = matched.length;

  const forbiddenFound = [];
  forbidden.forEach(term => {
    if (matchConcept(norm, term)) {
      forbiddenFound.push(Array.isArray(term) ? term[0] : term);
    }
  });

  const lengthRatio = minLen ? Math.min(1, norm.length / minLen) : 1;
  const contentRatio = req ? Math.min(1, hits / req) : (hits > 0 ? 1 : 0);

  let fraction = 0;
  if (hits > 0) {
    // Si l'élève a juste listé des mots sans faire de phrase -> 0 point
    if (structure.isKeywordDump) {
      fraction = 0;
    } else {
      // La note dépend d'abord des concepts clés (70%), modulée par la cohérence et longueur (30%)
      fraction = Math.min(1, contentRatio * (0.7 + 0.3 * lengthRatio));
    }
  }

  // Mot interdit (ex: raisonnement causal prématuré lors de l'exploitation de données) -> plafonne la note
  if (forbiddenFound.length > 0) {
    fraction = Math.min(fraction, 0.3);
  }

  return {
    fraction,
    hits,
    req,
    matched,
    missing,
    forbiddenFound,
    length: norm.length,
    minLen,
    isKeywordDump: structure.isKeywordDump,
    wordCount: structure.wordCount,
    empty: false
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
      const blkStream = blk ? (blk.stream ?? blk.correctStream) : null;
      const blkSlot = blk ? (blk.slot ?? blk.correctSlot) : null;
      const ok = blk && blkStream === streamIdx && blkSlot === slot;
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

/* ---------- Calming Audio & Focus Generator (Web Audio API) ---------- */
export const soundEngine = {
  ctx: null,
  currentMode: "off", // "off" | "rain" | "waves" | "binaural"
  gainNode: null,
  nodes: [],
  volume: 0.15,

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  },

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  },

  stop() {
    this.nodes.forEach(n => {
      try { n.stop(); } catch (e) {}
      try { n.disconnect(); } catch (e) {}
    });
    this.nodes = [];
    this.currentMode = "off";
  },

  play(mode) {
    this.init();
    if (mode === "off") {
      this.stop();
      return "off";
    }

    this.currentMode = mode;

    if (!this.ctx) {
      return this.currentMode;
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    this.stop();

    this.currentMode = mode;

    try {
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);

      if (mode === "rain") {
        this._playRain();
      } else if (mode === "waves") {
        this._playWaves();
      } else if (mode === "binaural") {
        this._playBinaural();
      }
    } catch (e) {
      // Graceful fallback for non-standard audio environments
    }

    return this.currentMode;
  },

  cycle() {
    const modes = ["off", "rain", "waves", "binaural"];
    const nextIdx = (modes.indexOf(this.currentMode) + 1) % modes.length;
    return this.play(modes[nextIdx]);
  },

  _playRain() {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(900, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.gainNode);
    noise.start();
    this.nodes.push(noise, filter);
  },

  _playWaves() {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(220, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    noise.connect(filter);
    filter.connect(this.gainNode);
    noise.start();
    this.nodes.push(noise, filter, lfo, lfoGain);
  },

  _playBinaural() {
    const oscL = this.ctx.createOscillator();
    const oscR = this.ctx.createOscillator();
    oscL.frequency.setValueAtTime(210, this.ctx.currentTime);
    oscR.frequency.setValueAtTime(250, this.ctx.currentTime);

    const merger = this.ctx.createChannelMerger(2);
    oscL.connect(merger, 0, 0);
    oscR.connect(merger, 0, 1);
    merger.connect(this.gainNode);

    oscL.start();
    oscR.start();
    this.nodes.push(oscL, oscR, merger);
  }
};
