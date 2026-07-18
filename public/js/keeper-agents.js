// keeper-agents.js — the four keepers as persistent agent personas, client side.
//
// Ties the persona (data/three-doors/keepers.json, authored by Gage) to the
// persistent memory cube (keeper-memory.js) and the Hermes-style agent turn
// (POST /api/keeper/speak). Each turn, the stage's keeper(s) recall what they
// remember, react in their own voice, and form a new memory — so a returning
// Doorwalker's keepers know them.
//
// Offline (no Vertex), a keeper speaks one of ITS OWN canon sample_lines rather
// than anything invented — the game stays playable and the voice stays Gage's.
(function (global) {
  "use strict";
  var KM = global.KeeperMemory;

  var personas = {};   // id -> persona
  var order = [];
  var store = null;
  var serverLive = false;
  var SEEDV = 1;

  // Minimal embedded personas so the strip still works if the fetch fails
  // (ids/glyphs/one sample line each — full canon lives in keepers.json).
  var EMBED = {
    lantern: { id: "lantern", name: "Lantern", glyph: "🏮", accent: "#ffcf6b", home_stages: ["kingdome-garden", "fog-door-return"], always_present: true, voice: { signature_line: "You came back.", sample_lines: ["You came back.", "I'll hold the light; you pick the door."] } },
    eclipse: { id: "eclipse", name: "Eclipse", glyph: "🔮", accent: "#c4a8ff", home_stages: ["xenon-convergence", "future-doors"], voice: { sample_lines: ["It's wider than it was. It always is."] } },
    keystone: { id: "keystone", name: "Keystone", glyph: "🪨", accent: "#8fd0ff", home_stages: ["sigil-city", "kingdome-garden"], voice: { sample_lines: ["Path's solid. Go.", "Nothing you walked is lost."] } },
    blinkbug: { id: "blinkbug", name: "Blinkbug", glyph: "🐞", accent: "#7fd4ff", home_stages: ["xp-door", "cloverfield"], voice: { sample_lines: ["Ooh — this one booted. Come on."] } },
  };

  async function init(opts) {
    serverLive = !!(opts && opts.serverLive);
    try {
      var j = await fetch("/data/keepers.json").then(function (r) { return r.json(); });
      SEEDV = j.seed_version || 1;
      order = (j.keepers || []).map(function (k) { return k.id; });
      personas = {}; (j.keepers || []).forEach(function (k) { personas[k.id] = k; });
      if (!order.length) throw new Error("empty");
    } catch (_e) {
      personas = EMBED; order = Object.keys(EMBED); SEEDV = 1;
    }
    store = KM.load(SEEDV);
    KM.seedFrom(store, values(personas), SEEDV);
    KM.save(store);
  }

  // Which keeper(s) speak at this stage: the stage's home keeper, plus Lantern
  // on returns / at the Garden / at the Fog. At most two, so it never crowds.
  function speakersFor(stageKey, lastTurn) {
    var set = [];
    order.forEach(function (id) {
      if ((personas[id].home_stages || []).indexOf(stageKey) >= 0) set.push(id);
    });
    var isReturn = !!(lastTurn && lastTurn.tags && lastTurn.tags.indexOf("return") >= 0);
    if ((isReturn || stageKey === "kingdome-garden" || stageKey === "fog-door-return") &&
        personas.lantern && set.indexOf("lantern") < 0) set.unshift("lantern");
    // keep Lantern first if present, cap two
    set.sort(function (a) { return a === "lantern" ? -1 : 0; });
    return set.slice(0, 2);
  }

  // A keeper reacts to the current scene: recall → speak → remember.
  async function speak(keeperId, ctx) {
    var k = personas[keeperId]; if (!k || !store) return null;
    var mems = KM.recall(store, keeperId, { stage: ctx.stage, symbols: ctx.symbols || [], loop: ctx.loop }, 5)
      .map(function (m) { return m.text; });
    var line = "", mood = "", formed = "";
    if (serverLive) {
      try {
        var r = await fetch("/api/keeper/speak", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keeperId: keeperId, memories: mems, scene: ctx.scene, stage: ctx.stage,
            loop: ctx.loop, chosenDoor: ctx.chosenDoor, symbols: (ctx.symbols || []).slice(0, 12),
            loopsWitnessed: KM.loopsWitnessed(store, keeperId),
          }),
        });
        if (r.ok) { var j = await r.json(); if (j.ok) { line = j.line || ""; mood = j.mood || ""; formed = j.remember || ""; } }
      } catch (_e) { /* fall to canon line */ }
    }
    if (!line) line = offlineLine(k, ctx);
    if (!line) return null;
    if (formed) {
      KM.remember(store, keeperId, {
        t: new Date().toISOString(), kind: "formed", text: formed, salience: 0.55,
        loop: ctx.loop, stage: ctx.stage,
        tags: [ctx.stage].concat((ctx.symbols && ctx.symbols[0]) ? [ctx.symbols[0]] : []),
      });
      KM.save(store);
    }
    return { keeperId: keeperId, name: k.name, glyph: k.glyph || "•", accent: k.accent || "#ddd", line: line, mood: mood };
  }

  // Offline voice: one of the keeper's OWN canon sample lines, chosen (not
  // invented) — the signature line only once it's earned (loops witnessed > 0).
  function offlineLine(k, ctx) {
    var v = k.voice || {}; var pool = (v.sample_lines || []).slice();
    if (!pool.length) return "";
    var witnessed = store ? KM.loopsWitnessed(store, k.id) : 0;
    var homeHere = (k.home_stages || []).indexOf(ctx.stage) >= 0;
    if (v.signature_line && witnessed > 0 && homeHere &&
        (ctx.stage === "kingdome-garden" || ctx.stage === "fog-door-return")) return v.signature_line;
    var idx = ((ctx.loop || 1) + hashStr(ctx.stage || "")) % pool.length;
    return pool[idx];
  }

  // After a door is walked, every keeper forms a memory of it (scoped inside).
  function witnessTurn(turn) {
    if (!store || !turn) return;
    values(personas).forEach(function (k) { KM.witness(store, k, turn); });
    KM.save(store);
  }

  function loopsWitnessed(id) { return store ? KM.loopsWitnessed(store, id) : 0; }
  function hashStr(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
  function values(o) { return Object.keys(o).map(function (kk) { return o[kk]; }); }

  global.KeeperAgents = {
    init: init, speakersFor: speakersFor, speak: speak, witnessTurn: witnessTurn,
    loopsWitnessed: loopsWitnessed, personas: function () { return personas; },
  };
})(window);
