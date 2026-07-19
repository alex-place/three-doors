// three-doors-keepers.js — the four keepers as conversational companions in the
// restored game. Each is a persistent persona (data/three-doors/keepers.json,
// grounded server-side in the lore corpus) backed by a MemOS memory cube
// (keeper-memory.js). They SPEAK after each beat (dialog), and the Doorwalker
// can talk to them — they answer in character and remember it.
(function (global) {
  "use strict";
  var KM = global.KeeperMemory;
  var personas = {}, order = [], store = null, serverLive = false, SEEDV = 1;
  var convo = {};   // keeperId -> [{who,text}] recent conversation

  var EMBED = {
    lantern: { id: "lantern", name: "Lantern", glyph: "🏮", accent: "#ffcf6b", home_stages: ["kingdome-garden", "fog-door-return"], always_present: true, voice: { sample_lines: ["You came back.", "I'll hold the light; you pick the door."] } },
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
    } catch (_e) { personas = EMBED; order = Object.keys(EMBED); SEEDV = 1; }
    if (KM) { store = KM.load(SEEDV); KM.seedFrom(store, vals(personas), SEEDV); KM.save(store); }
  }

  // Which keeper(s) speak at this scene — the scene's home keeper(s), plus
  // Lantern at home / on a return. At most two, so it never crowds.
  function speakersFor(sceneKey) {
    var set = order.filter(function (id) { return (personas[id].home_stages || []).indexOf(sceneKey) >= 0; });
    var homeScene = sceneKey === "kingdome-garden" || sceneKey === "castle-balcony" || sceneKey === "fog-door-return";
    if (homeScene && personas.lantern && set.indexOf("lantern") < 0) set.unshift("lantern");
    if (!set.length && personas.lantern) set.push("lantern");
    var seen = {}; return set.filter(function (x) { return seen[x] ? false : (seen[x] = 1); }).slice(0, 2);
  }

  function recall(id, ctx) {
    if (!store || !KM) return [];
    return KM.recall(store, id, { stage: ctx.sceneKey, symbols: ctx.symbols || [], loop: 1 }, 5).map(function (m) { return m.text; });
  }

  async function callSpeak(id, ctx, extra) {
    var payload = {
      keeperId: id,
      memories: recall(id, ctx),
      loopsWitnessed: (store && KM) ? KM.loopsWitnessed(store, id) : 0,
      scene: ctx.scene || "", chosenDoor: ctx.chosenDoor || "", doorLore: ctx.doorLore || "",
    };
    for (var kk in (extra || {})) payload[kk] = extra[kk];
    if (serverLive) {
      try {
        var r = await fetch("/api/keeper/speak", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (r.ok) {
          var j = await r.json();
          if (j.ok !== false && j.line) {
            if (j.remember && store && KM) {
              KM.remember(store, id, { t: new Date().toISOString(), kind: "formed", text: j.remember, salience: 0.55, stage: ctx.sceneKey, tags: [ctx.sceneKey].filter(Boolean) });
              KM.save(store);
            }
            return { line: j.line, mood: j.mood || "" };
          }
        }
      } catch (_e) { /* fall to a canon line */ }
    }
    var k = personas[id], pool = (k && k.voice && k.voice.sample_lines) || [];
    return pool.length ? { line: pool[(Math.random() * pool.length) | 0], mood: "" } : null;
  }

  // After a beat: every keeper witnesses the door walked, then the stage
  // keeper(s) speak — the dialog half of the turn.
  async function afterScene(sceneKey, ctx) {
    ctx = ctx || {}; ctx.sceneKey = sceneKey;
    if (store && KM && ctx.turn) { vals(personas).forEach(function (k) { KM.witness(store, k, ctx.turn); }); KM.save(store); }
    var speakers = speakersFor(sceneKey);
    for (var i = 0; i < speakers.length; i++) {
      var said = await callSpeak(speakers[i], ctx);
      if (said && said.line) renderKeeperLine(speakers[i], said.line, said.mood, i * 130);
    }
  }

  // The Doorwalker talks to a keeper (addressed by name, else the stage keeper).
  async function talk(text, sceneKey, ctx) {
    ctx = ctx || {}; ctx.sceneKey = sceneKey;
    var id = addressed(text) || speakersFor(sceneKey)[0] || "lantern";
    convo[id] = (convo[id] || []).concat([{ who: "player", text: text }]).slice(-8);
    var said = await callSpeak(id, ctx, { playerSays: text, history: convo[id].slice(-6) });
    if (said && said.line) {
      convo[id] = convo[id].concat([{ who: "keeper", text: said.line }]).slice(-8);
      renderKeeperLine(id, said.line, said.mood, 0);
      return id;
    }
    return null;
  }

  function addressed(text) {
    var t = String(text).toLowerCase();
    for (var i = 0; i < order.length; i++) {
      var id = order[i], nm = (personas[id].name || "").toLowerCase();
      if (t.indexOf(id) >= 0 || (nm && t.indexOf(nm) >= 0)) return id;
    }
    return null;
  }

  function renderKeeperLine(id, line, mood, delay) {
    var k = personas[id], chat = document.getElementById("chat");
    if (!chat) return;
    var el = document.createElement("div");
    el.className = "keeper-line";
    el.style.setProperty("--k", k.accent || "#ddd");
    el.innerHTML = '<span class="kglyph">' + (k.glyph || "•") + '</span>' +
      '<span class="ktext"><b class="kname">' + esc(k.name) + (mood ? ' <span class="kmood">· ' + esc(mood) + '</span>' : '') + '</b>' + esc(line) + '</span>';
    chat.appendChild(el);
    chat.scrollTop = chat.scrollHeight;
    setTimeout(function () { el.classList.add("in"); }, 40 + (delay || 0));
  }

  function esc(s) { return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function vals(o) { return Object.keys(o).map(function (k) { return o[k]; }); }

  global.ThreeDoorsKeepers = { init: init, afterScene: afterScene, talk: talk, speakersFor: speakersFor };
})(window);
