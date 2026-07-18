// keeper-memory.js — MemOS-style persistent memory for the four keepers.
//
// Each keeper owns a MEMORY CUBE: an append-only, salience-ranked, scoped store
// of what THAT keeper has witnessed across every session and loop. This is the
// "persistent" half of a persistent agent persona — the persona (voice, in
// data/three-doors/keepers.json, authored by Gage) is fixed; the cube is what
// grows. Retrieval is scoped (MemOS-style): recall returns the memories most
// relevant to the current stage/constellation, not the whole history.
//
// One store per player, mirrored to localStorage so a returning Doorwalker's
// keepers remember them. Pure functions over a plain `store` object — no DOM,
// no fetch — so it runs in the browser (window.KeeperMemory) and under Node for
// tests (module.exports).
(function (global) {
  "use strict";

  var STORE_KEY = "three-doors-keepers-v1";
  var CUBE_CAP = 80;          // per-keeper memory ceiling; lowest-salience non-seed evicted
  var SEED_FLOOR = 0.5;       // seed/origin memories never decay below this

  function newStore(seedVersion) {
    return { v: 1, seedVersion: seedVersion || 0, keepers: {} };
  }

  function cube(store, keeperId) {
    if (!store.keepers[keeperId]) store.keepers[keeperId] = { cube: [] };
    return store.keepers[keeperId].cube;
  }

  function norm(s) { return String(s || "").toLowerCase().replace(/\s+/g, " ").trim(); }

  // Ensure every keeper's canon memory_seed is present. Idempotent by content
  // (dedup on normalized text), so it seeds fresh stores AND repairs existing
  // ones after a seed bump — no version gate that could skip an unseeded store.
  function seedFrom(store, keepers, seedVersion) {
    (keepers || []).forEach(function (k) {
      var c = cube(store, k.id);
      (k.memory_seed || []).forEach(function (m) {
        if (c.some(function (e) { return e.kind === "seed" && norm(e.text) === norm(m.text); })) return;
        c.push({
          t: null, kind: "seed", text: m.text,
          salience: typeof m.salience === "number" ? m.salience : 0.8,
          loop: 0, stage: (m.tags || [])[1] || null, tags: (m.tags || []).slice(),
        });
      });
    });
    if (seedVersion) store.seedVersion = seedVersion;
    return store;
  }

  // Append a memory to a keeper's cube (dedup near-identical text; cap the cube).
  function remember(store, keeperId, mem) {
    var c = cube(store, keeperId);
    var text = String(mem.text || "").trim();
    if (!text) return null;
    var existing = c.find(function (e) { return norm(e.text) === norm(text); });
    if (existing) {                    // reinforce rather than duplicate
      existing.salience = Math.min(1, existing.salience + 0.08);
      if (mem.tags) existing.tags = uniq(existing.tags.concat(mem.tags));
      return existing;
    }
    var entry = {
      t: mem.t || null,
      kind: mem.kind || "formed",
      text: text,
      salience: clamp(typeof mem.salience === "number" ? mem.salience : 0.5),
      loop: mem.loop || 0,
      stage: mem.stage || null,
      tags: (mem.tags || []).slice(),
    };
    c.push(entry);
    prune(c);
    return entry;
  }

  function prune(c) {
    if (c.length <= CUBE_CAP) return;
    // evict the lowest-salience NON-seed memory until under cap
    while (c.length > CUBE_CAP) {
      var worstIdx = -1, worst = Infinity;
      for (var i = 0; i < c.length; i++) {
        if (c[i].kind === "seed") continue;
        if (c[i].salience < worst) { worst = c[i].salience; worstIdx = i; }
      }
      if (worstIdx < 0) break;         // all seeds — leave them
      c.splice(worstIdx, 1);
    }
  }

  // Scoped recall (MemOS): score each memory by salience + relevance to the
  // current context (stage, constellation symbols) + a mild recency nudge, and
  // return the top-k. `ctx = { stage, symbols[], loop }`.
  function recall(store, keeperId, ctx, k) {
    var c = cube(store, keeperId);
    if (!c.length) return [];
    ctx = ctx || {};
    var syms = (ctx.symbols || []).map(norm);
    var n = c.length;
    var scored = c.map(function (m, i) {
      var score = m.salience;
      var tags = (m.tags || []).map(norm);
      if (ctx.stage && tags.indexOf(norm(ctx.stage)) >= 0) score += 0.3;
      var overlap = 0;
      for (var s = 0; s < syms.length; s++) if (tags.indexOf(syms[s]) >= 0) overlap++;
      score += Math.min(0.3, overlap * 0.12);
      score += (i / n) * 0.12;                          // recency: later entries slightly favored
      if (m.kind === "seed") score += 0.05;             // origin steadies the voice
      return { m: m, score: score };
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored.slice(0, k || 4).map(function (x) { return x.m; });
  }

  // Witness: form a keeper-specific MEMORY RECORD from a walked turn — a neutral
  // fact ("at Sigil on loop 2, the Doorwalker chose the Key Market"), NOT a
  // spoken line (voice is Gage's/the model's). A keeper only witnesses turns in
  // its home stages, turns whose symbol it attends to, or (Lantern) always.
  // `keeper` is the persona object; `turn` is a loop-engine turn. Returns mem|null.
  function witness(store, keeper, turn) {
    if (!keeper || !turn) return null;
    var home = (keeper.home_stages || []).indexOf(turn.stageKey) >= 0;
    var attendsSymbol = symbolAttended(keeper, turn.symbol);
    var revisit = revisited(store, keeper.id, turn.stageKey, turn.loop);
    if (!home && !attendsSymbol && !keeper.always_present) return null;

    var sal = 0.4;
    if (home) sal += 0.2;
    if (attendsSymbol) sal += 0.12;
    if (turn.custom) sal += 0.1;                        // a door the player named themselves
    if (revisit) sal += 0.15;                           // returning matters — Lantern especially

    var text = keeper.name + " remembers: at " + turn.stageName + " (loop " + turn.loop + "), " +
      "the Doorwalker chose " + turn.door +
      (turn.symbol ? " — a turn toward " + turn.symbol + "." : ".");

    return remember(store, keeper.id, {
      t: turn.ts || null, kind: "witness", text: text, salience: clamp(sal),
      loop: turn.loop, stage: turn.stageKey,
      tags: uniq([turn.stageKey, turn.symbol, revisit ? "return" : null].filter(Boolean)),
    });
  }

  function revisited(store, keeperId, stageKey, loop) {
    return cube(store, keeperId).some(function (m) {
      return m.kind === "witness" && m.stage === stageKey && m.loop < loop;
    });
  }
  function symbolAttended(keeper, symbol) {
    if (!symbol) return false;
    var s = norm(symbol);
    return (keeper.attends_to || []).some(function (a) { return norm(a).indexOf(s) >= 0; });
  }

  // How many loops has this keeper witnessed the Doorwalker? (drives greetings)
  function loopsWitnessed(store, keeperId) {
    var loops = {};
    cube(store, keeperId).forEach(function (m) { if (m.kind === "witness") loops[m.loop] = 1; });
    return Object.keys(loops).length;
  }

  function clamp(x) { return Math.max(0, Math.min(1, x)); }
  function uniq(a) { return a.filter(function (v, i) { return a.indexOf(v) === i; }); }

  // ── browser persistence wrappers (no-ops of value under Node) ──
  function load(seedVersion) {
    try {
      var s = JSON.parse(global.localStorage.getItem(STORE_KEY) || "null");
      if (s && s.v === 1 && s.keepers) return s;
    } catch (_e) {}
    return newStore(seedVersion || 0);
  }
  function save(store) {
    try { global.localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (_e) {}
  }

  var api = {
    STORE_KEY: STORE_KEY, CUBE_CAP: CUBE_CAP,
    newStore: newStore, seedFrom: seedFrom, remember: remember, recall: recall,
    witness: witness, loopsWitnessed: loopsWitnessed, load: load, save: save,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else global.KeeperMemory = api;
})(typeof window !== "undefined" ? window : globalThis);
