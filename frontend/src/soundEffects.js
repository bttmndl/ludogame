import blinkSoundUrl from "./assets/BlinkSound.wav";
import diceThrowUrl from "./assets/diceThrow.mp3";
import gotiOpenUrl from "./assets/gotiOpen.wav";
import moveUrl from "./assets/move.wav";
import playerMoveUrl from "./assets/playerMove.mp3";

const isBrowser = typeof window !== "undefined";
const isTest = process.env.NODE_ENV === "test";
const kenneyBasePath = `${process.env.PUBLIC_URL || ""}/kenney`;

function kenneySound(path) {
  return `${kenneyBasePath}/${path}`;
}

const SOUND_SOURCES = {
  blocked: [kenneySound("interface/error_002.wav"), blinkSoundUrl],
  capture: [kenneySound("interface/error_004.wav"), blinkSoundUrl],
  dice: [kenneySound("casino_audio/dice_roll.wav"), diceThrowUrl],
  finish: [kenneySound("interface/confirmation_004.wav"), gotiOpenUrl],
  land: [kenneySound("interface/click_004.wav"), moveUrl],
  open: [kenneySound("interface/whoosh_001.wav"), gotiOpenUrl],
  room: [kenneySound("interface/confirmation_001.wav"), moveUrl],
  select: [kenneySound("interface/click_002.wav"), playerMoveUrl],
  status: [kenneySound("interface/notification_001.wav")],
  step: [kenneySound("interface/click_002.wav"), playerMoveUrl],
  turn: [kenneySound("interface/notification_001.wav")],
  ui: [kenneySound("interface/click_002.wav"), playerMoveUrl],
  win: [kenneySound("interface/confirmation_001.wav"), gotiOpenUrl],
};

function getSoundSources(name) {
  const sources = SOUND_SOURCES[name];
  if (!sources) return [];
  return Array.isArray(sources) ? sources : [sources];
}

const SOUND_SETTINGS = {
  blocked: { volume: 0.16, cooldown: 120, rateJitter: 0.02 },
  capture: { volume: 0.46, cooldown: 120, rateJitter: 0.03 },
  dice: { volume: 0.62, cooldown: 180, rateJitter: 0.04 },
  finish: { volume: 0.5, cooldown: 150, rateJitter: 0.02 },
  land: { volume: 0.28, cooldown: 80, rateJitter: 0.03 },
  open: { volume: 0.42, cooldown: 120, rateJitter: 0.02 },
  room: { volume: 0.24, cooldown: 180, rateJitter: 0.02 },
  select: { volume: 0.28, cooldown: 70, rateJitter: 0.04 },
  status: { volume: 0.12, cooldown: 220, rateJitter: 0.02 },
  step: { volume: 0.18, cooldown: 45, rateJitter: 0.06 },
  turn: { volume: 0.18, cooldown: 180, rateJitter: 0.02 },
  ui: { volume: 0.12, cooldown: 60, rateJitter: 0.03 },
  win: { volume: 0.58, cooldown: 600, rateJitter: 0.02 },
};

function decodeAudioData(context, arrayBuffer) {
  return new Promise((resolve, reject) => {
    const decodeResult = context.decodeAudioData(arrayBuffer, resolve, reject);
    if (decodeResult && typeof decodeResult.then === "function") {
      decodeResult.then(resolve).catch(reject);
    }
  });
}

function jitterRate(baseRate, amount = 0) {
  if (!amount) return baseRate;
  const offset = (Math.random() * 2 - 1) * amount;
  return Math.max(0.75, Math.min(1.25, baseRate + offset));
}

class SoundEffectsEngine {
  constructor() {
    this.audioPools = new Map();
    this.bufferPromises = new Map();
    this.buffers = new Map();
    this.context = null;
    this.enabled = true;
    this.failedSources = new Set();
    this.initialized = false;
    this.lastPlayedAt = new Map();
    this.masterGain = null;
    this.masterVolume = 0.86;
  }

  init() {
    if (!isBrowser || isTest || this.initialized) return;
    this.initialized = true;
    this.bindUnlockEvents();
    this.schedulePreload();
  }

  bindUnlockEvents() {
    const unlock = () => {
      this.resumeContext();
      this.schedulePreload();
    };

    ["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
      window.addEventListener(eventName, unlock, {
        capture: true,
        once: true,
        passive: true,
      });
    });
  }

  schedulePreload() {
    if (!isBrowser || isTest) return;

    const load = () => {
      Object.keys(SOUND_SOURCES).forEach((name) => {
        this.preload(name);
      });
    };

    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(load, { timeout: 1200 });
      return;
    }

    window.setTimeout(load, 250);
  }

  getContext() {
    if (!isBrowser || isTest) return null;
    if (this.context) return this.context;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    try {
      this.context = new AudioContextClass({ latencyHint: "interactive" });
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = this.masterVolume;
      this.masterGain.connect(this.context.destination);
      return this.context;
    } catch (error) {
      return null;
    }
  }

  resumeContext() {
    const context = this.getContext();
    if (context?.state === "suspended") {
      context.resume().catch(() => {});
    }
  }

  preload(name) {
    const sources = getSoundSources(name);
    if (!sources.length || !isBrowser || isTest) return Promise.resolve(null);

    const context = this.getContext();
    if (!context || typeof window.fetch !== "function") {
      this.primeAudioPool(sources[sources.length - 1]);
      return Promise.resolve(null);
    }

    return this.preloadFirstAvailableSource(sources);
  }

  preloadFirstAvailableSource(sources, index = 0) {
    const src = sources[index];
    if (!src) return Promise.resolve(null);
    const context = this.getContext();
    if (!context) {
      this.primeAudioPool(sources[sources.length - 1]);
      return Promise.resolve(null);
    }

    if (this.buffers.has(src)) {
      return Promise.resolve(this.buffers.get(src));
    }

    if (this.failedSources.has(src)) {
      return this.preloadFirstAvailableSource(sources, index + 1);
    }

    if (!this.bufferPromises.has(src)) {
      const promise = window
        .fetch(src)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Unable to load sound: ${src}`);
          }
          return response.arrayBuffer();
        })
        .then((arrayBuffer) => decodeAudioData(context, arrayBuffer))
        .then((buffer) => {
          this.buffers.set(src, buffer);
          return buffer;
        })
        .catch(() => {
          this.failedSources.add(src);
          return this.preloadFirstAvailableSource(sources, index + 1);
        });

      this.bufferPromises.set(src, promise);
    }

    return this.bufferPromises.get(src);
  }

  primeAudioPool(src, size = 4) {
    if (!isBrowser || isTest || this.audioPools.has(src)) return;

    const pool = {
      cursor: 0,
      items: Array.from({ length: size }, () => {
        const audio = new Audio(src);
        audio.preload = "auto";
        audio.load();
        return audio;
      }),
    };

    this.audioPools.set(src, pool);
  }

  play(name, options = {}) {
    if (!this.enabled || !isBrowser || isTest) return;

    const sources = getSoundSources(name);
    if (!sources.length) return;

    const settings = SOUND_SETTINGS[name] || {};
    const now = performance.now();
    const cooldown = options.cooldown ?? settings.cooldown ?? 0;
    const lastPlayedAt = this.lastPlayedAt.get(name) || 0;

    if (cooldown && now - lastPlayedAt < cooldown) return;
    this.lastPlayedAt.set(name, now);

    const volume = Math.max(
      0,
      Math.min(1, options.volume ?? settings.volume ?? 0.35),
    );
    const playbackRate = jitterRate(
      options.playbackRate ?? 1,
      options.rateJitter ?? settings.rateJitter ?? 0,
    );

    this.preload(name);

    const src =
      sources.find((source) => this.buffers.has(source)) ||
      sources[sources.length - 1];
    const context = this.getContext();
    const buffer = this.buffers.get(src);

    if (context && buffer && this.masterGain) {
      if (context.state === "suspended") {
        context.resume().catch(() => {});
      }

      const source = context.createBufferSource();
      const gain = context.createGain();
      source.buffer = buffer;
      source.playbackRate.value = playbackRate;
      gain.gain.value = volume;
      source.connect(gain);
      gain.connect(this.masterGain);
      source.start(0);
      return;
    }

    this.playWithAudioPool(src, volume, playbackRate);
  }

  playWithAudioPool(src, volume, playbackRate) {
    this.primeAudioPool(src);
    const pool = this.audioPools.get(src);
    if (!pool) return;

    const audio = pool.items[pool.cursor];
    pool.cursor = (pool.cursor + 1) % pool.items.length;

    audio.pause();
    audio.currentTime = 0;
    audio.volume = volume * this.masterVolume;
    audio.playbackRate = playbackRate;
    audio.play().catch(() => {});
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
  }
}

const soundEffects = new SoundEffectsEngine();

export function initSoundEffects() {
  soundEffects.init();
}

export function playSound(name, options) {
  soundEffects.play(name, options);
}

export function setSoundEffectsEnabled(enabled) {
  soundEffects.setEnabled(enabled);
}
