// loop-ui.js — renders the convergence loop.
//
// Text: POST /api/loop/turn (Gemini on Vertex) with graceful fallback to the
// inline canon engine — the game is always playable. Art: the hand-curated
// picks for scene heroes and door cards; deeper loops rotate through each
// stage's hand-sorted timeline folder, so recursion changes what you see.
(function () {
  "use strict";
  const E = window.LoopEngine;
  const LS_KEY = "three-doors-loop-v2";
  const $ = (id) => document.getElementById(id);

  // per-stage palettes (from the original canon scene palettes)
  const PALETTES = {
    "kingdome-garden": ["#2f6b45", "#7fff9a"],
    "cloverfield": ["#4a7a2a", "#c8f57f"],
    "future-doors": ["#8a6a1a", "#ffd27f"],
    "xp-door": ["#2a5c8a", "#7fd4ff"],
    "xenon-convergence": ["#5a3a9a", "#c4a8ff"],
    "sigil-city": ["#7a3a6a", "#ff9dd4"],
    "fog-door-return": ["#5a6a72", "#cfe0e8"],
  };
  const LOOP_HUE_STEP = 18; // degrees per loop — the world slowly turns

  let state = null;
  let art = { base: "", items: {}, timeline: {}, picks: null };
  let serverLive = false;
  let pendingNarration = null; // narration for the CURRENT scene (from the last choice)
  let lastKeeperToken = null;  // one keeper reaction per distinct scene

  function save() { try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (_e) {} }
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(LS_KEY) || "null");
      if (s && s.v === 2 && Array.isArray(s.journey)) return s;
    } catch (_e) {}
    return null;
  }

  async function boot() {
    // art data (all three are static repo files)
    try {
      const [manifest, timeline, picks] = await Promise.all([
        fetch("/assets/content/koh/manifest.json").then((r) => r.json()),
        fetch("/data/art-timeline.json").then((r) => r.json()),
        fetch("/data/door-art-picks.json").then((r) => r.json()),
      ]);
      art.base = manifest.base;
      for (const it of manifest.items) art.items[it.id] = it;
      art.timeline = timeline;
      art.picks = picks;
    } catch (_e) { /* art degrades to none; the words still work */ }

    // is the narrator awake?
    try {
      const r = await fetch("/api/loop/turn", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      serverLive = r.status !== 503 && r.status !== 404;
    } catch (_e) { serverLive = false; }
    $("mode").classList.toggle("live", serverLive);
    $("mode").innerHTML = '<span class="dot"></span>' + (serverLive ? "Lantern awake — Gemini on Vertex" : "Offline — inline canon engine");

    // the keepers — persistent agent personas (persona + memory cube)
    if (window.KeeperAgents) { try { await window.KeeperAgents.init({ serverLive: serverLive }); } catch (_e) {} }

    state = load() || E.newGame();
    if (!state.startedAt) state.startedAt = new Date().toISOString();
    render(true);
    openingNarration();
  }

  // Every game opens with FRESH Vertex-written text too — narrated from the
  // garden hero image and whatever memory the save already carries.
  async function openingNarration() {
    if (!serverLive || state.journey.length || pendingNarration) return;
    const st = E.stage(state);
    const hero = heroArt();
    try {
      const r = await fetch("/api/loop/turn", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loop: state.loop, stage: st.name, theme: st.theme, lesson: st.lesson,
          chosenDoor: "(game start — the Doorwalker arrives)",
          canonDoors: E.CANON_DOORS[st.key].map((d) => d.name),
          symbols: Object.keys(state.symbols), echoes: E.echoesFor(state, 5),
          imageUrl: hero && hero.url, imageTitle: hero && hero.title,
        }),
      });
      if (!r.ok) return;
      const n = await r.json();
      if (state.journey.length) return; // a door was walked while we narrated
      pendingNarration = n;
      render(true);
    } catch (_e) { /* the canon opening stands */ }
  }

  // The hero image is THE PICTURE THE PLAYER STEPPED THROUGH — the art on the
  // door card they clicked last turn. Game start falls back to the curated
  // stage hero (loop 1) / the stage folder rotated by loop depth.
  function heroArt() {
    const lastTurn = [...state.journey].reverse().find((t) => t.kind === "turn");
    if (lastTurn && lastTurn.art && lastTurn.art.url) return lastTurn.art;
    const key = E.stage(state).key;
    if (!art.picks) return null;
    if (state.loop === 1) {
      const pick = art.picks.heroes[key];
      const it = pick && art.items[pick.pick];
      if (it) return { url: art.base + it.full, title: it.title || "" };
    }
    const folder = (art.timeline[key] || []).filter((id) => art.items[id]);
    if (!folder.length) return null;
    const it = art.items[folder[E.artIndexFor(state, folder.length)]];
    return it ? { url: art.base + it.full, title: it.title || "" } : null;
  }

  // Doors point FORWARD: each card previews art from the folder of the stage
  // the door leads to — you glimpse the picture through the door, and stepping
  // through makes it the next scene. Canon doors keep their hand-picked card
  // art; narrator-invented doors rotate the next stage's curated order.
  function doorArt(doorName, idx) {
    if (!art.picks) return null;
    const key = E.stage(state).key;
    const slot = Object.keys(art.picks.doors).find((k) => {
      const [sceneKey, dn] = k.split("/");
      return sceneKey === key && dn.toLowerCase() === String(doorName).toLowerCase();
    });
    if (slot) {
      const it = art.items[art.picks.doors[slot].pick];
      if (it) return { url: art.base + it.full, title: it.title || "" };
    }
    const nextKey = E.STAGES[(state.stageIndex + 1) % E.STAGES.length].key;
    const folder = (art.timeline[nextKey] || []).filter((id) => art.items[id]);
    if (!folder.length) return null;
    const it = art.items[folder[(E.artIndexFor(state, folder.length) * 3 + idx) % folder.length]];
    return it ? { url: art.base + it.full, title: it.title || "" } : null;
  }

  function setPhase(upTo) {
    const idx = E.MICRO.indexOf(upTo);
    document.querySelectorAll("#ring .seg").forEach((seg, i) => seg.classList.toggle("lit", i <= idx));
  }

  function render(initial) {
    const st = E.stage(state);
    const [a, b] = PALETTES[st.key];
    document.documentElement.style.setProperty("--stage-a", a);
    document.documentElement.style.setProperty("--stage-b", b);
    document.documentElement.style.setProperty("--loop-hue", ((state.loop - 1) * LOOP_HUE_STEP) % 360 + "deg");

    // rail
    const rail = $("rail");
    rail.innerHTML = "";
    E.STAGES.forEach((s, i) => {
      const g = document.createElement("div");
      g.className = "gate" + (i < state.stageIndex ? " walked" : i === state.stageIndex ? " here" : "");
      g.innerHTML = "<span>" + s.name.replace(/^The /, "") + "</span>";
      rail.appendChild(g);
    });
    const badge = document.createElement("div");
    badge.id = "loopBadge";
    badge.textContent = "Loop " + state.loop;
    rail.appendChild(badge);

    // observe
    setPhase("observe");
    $("stageName").textContent = st.name + " — gate " + (state.stageIndex + 1) + " of 7";
    const hero = heroArt();
    if (hero) { $("sceneArt").src = hero.url; $("sceneArt").style.display = ""; }
    else $("sceneArt").style.display = "none";

    const n = pendingNarration;
    $("sceneText").innerHTML = mdLite((n && n.scene) || E.sceneFor(state));
    $("beat").textContent = (n && n.beat) || (state.journey.length ? state.journey[state.journey.length - 1].beat : "");
    $("sceneBody").classList.remove("fade"); void $("sceneBody").offsetWidth; $("sceneBody").classList.add("fade");

    // remember
    const echoes = E.echoesFor(state, 3);
    if (n && n.echo) echoes.unshift(n.echo);
    const eBox = $("echoes");
    eBox.innerHTML = "";
    echoes.forEach((line, i) => {
      const div = document.createElement("div");
      div.className = "echo";
      div.textContent = line;
      eBox.appendChild(div);
      setTimeout(() => { div.classList.add("in"); if (i === echoes.length - 1) setPhase("remember"); }, 350 + i * 450);
    });
    if (!echoes.length) setPhase("remember");

    // reason: the three doors
    const canonDoors = E.doorsFor(state);
    const doors = (n && n.doors && n.doors.length === 3)
      ? canonDoors.map((c, i) => ({ name: n.doors[i].name || c.name, whisper: n.doors[i].whisper || c.whisper }))
      : canonDoors;
    const dBox = $("doors");
    dBox.innerHTML = "";
    doors.forEach((d, i) => {
      const btn = document.createElement("button");
      btn.className = "door fade";
      btn.style.animationDelay = 0.15 * i + "s";
      const a = doorArt(d.name, i);
      btn.innerHTML = (a ? '<img loading="lazy" alt="" src="' + a.url + '">' : "")
        + '<div class="label">' + "ABC"[i] + "</div>"
        + '<div class="name">' + escapeHtml(d.name) + "</div>"
        + '<div class="whisper">' + escapeHtml(d.whisper) + "</div>";
      btn.onclick = () => act(d.name, "", a);
      dBox.appendChild(btn);
    });
    setTimeout(() => setPhase("reason"), 800);

    // ledger
    const top = Object.entries(state.symbols).sort((x, y) => y[1] - x[1]).slice(0, 8);
    $("constellation").innerHTML = top.length
      ? "Constellation: " + top.map(([w, c]) => "<b>" + escapeHtml(w) + "</b>&thinsp;×" + c).join(" · ")
      : "Your constellation is unwritten — walk a door.";
    const rec = state.records[state.records.length - 1];
    $("recordLine").textContent = rec
      ? "cr: " + rec.hypothesis + "  [conf " + rec.confidence + " · verified]"
      : "";
    if (!initial) save();
    renderKeepers();
  }

  // The keepers speak: after the scene settles, the stage's keeper(s) recall
  // what they remember of the Doorwalker and react in their own voice. One
  // reaction per distinct scene; on the opening scene we wait for the narrated
  // text (when the server is live) so they react to the real scene, not canon.
  async function renderKeepers() {
    if (!window.KeeperAgents) return;
    const box = $("keepers");
    const token = state.loop + ":" + state.stageIndex + ":" + state.journey.length;
    if (serverLive && !pendingNarration && state.journey.length === 0) return; // opening narration pending
    if (token === lastKeeperToken) return;
    lastKeeperToken = token;
    box.innerHTML = "";
    const st = E.stage(state);
    const lastTurn = [...state.journey].reverse().find((t) => t.kind === "turn") || null;
    const ctx = {
      stage: st.key, stageName: st.name,
      scene: (pendingNarration && pendingNarration.scene) || E.sceneFor(state),
      loop: state.loop, chosenDoor: (lastTurn && lastTurn.door) || "(arriving)",
      symbols: Object.keys(state.symbols),
    };
    const speakers = window.KeeperAgents.speakersFor(st.key, lastTurn);
    for (let i = 0; i < speakers.length; i++) {
      if (token !== lastKeeperToken) return;         // a new scene began while we waited
      let said = null;
      try { said = await window.KeeperAgents.speak(speakers[i], ctx); } catch (_e) {}
      if (token !== lastKeeperToken) return;
      if (!said || !said.line) continue;
      const div = document.createElement("div");
      div.className = "keeper";
      div.style.setProperty("--k", said.accent);
      div.innerHTML = '<div class="glyph">' + escapeHtml(said.glyph) + "</div>"
        + '<div class="said"><div class="who">' + escapeHtml(said.name)
        + (said.mood ? '<span class="mood">· ' + escapeHtml(said.mood) + "</span>" : "")
        + '</div><div class="line">' + escapeHtml(said.line) + "</div></div>";
      box.appendChild(div);
      void div.offsetWidth;
      setTimeout(() => div.classList.add("in"), 60 + i * 140);
    }
  }

  async function act(doorName, playerWords, doorArtPicked) {
    setPhase("act");
    document.querySelectorAll("#doors .door").forEach((b) => (b.disabled = true));
    $("customGo").disabled = true;

    // ask the narrator for the NEXT scene (the result of this choice)
    let narrated = null;
    const stBefore = E.stage(state);
    const nextIndex = state.stageIndex === E.STAGES.length - 1 ? 0 : state.stageIndex + 1;
    const nextStage = E.STAGES[nextIndex];
    const nextLoop = nextIndex === 0 && state.stageIndex === E.STAGES.length - 1 ? state.loop + 1 : state.loop;
    if (serverLive) {
      try {
        const r = await fetch("/api/loop/turn", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            loop: nextLoop, stage: nextStage.name, theme: nextStage.theme, lesson: nextStage.lesson,
            chosenDoor: doorName, playerWords,
            canonDoors: E.CANON_DOORS[nextStage.key].map((d) => d.name),
            symbols: Object.keys(state.symbols),
            echoes: E.echoesFor(state, 5),
            lastBeat: state.journey.length ? state.journey[state.journey.length - 1].beat : "",
            imageUrl: doorArtPicked && doorArtPicked.url,
            imageTitle: doorArtPicked && doorArtPicked.title,
          }),
        });
        if (r.ok) narrated = await r.json();
      } catch (_e) { /* canon narrates */ }
    }

    setPhase("verify");
    const turn = E.choose(state, doorName, {
      ts: new Date().toISOString(),
      playerWords,
      beat: narrated && narrated.beat,
      symbol: narrated && narrated.symbol,
      art: doorArtPicked || null,
    });
    // the keepers witness the door just walked (each forms its own memory)
    if (window.KeeperAgents) window.KeeperAgents.witnessTurn(turn);
    setPhase("converge");
    pendingNarration = narrated;
    save();
    setTimeout(() => { $("customGo").disabled = false; $("customName").value = ""; render(); window.scrollTo({ top: 0, behavior: "smooth" }); }, 350);
    void stBefore;
  }

  function mdLite(s) {
    return escapeHtml(s).replace(/\*\*([^*]+)\*\*/g, "<em>$1</em>").replace(/\*([^*]+)\*/g, "<em>$1</em>");
  }
  function escapeHtml(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // custom door + ledger buttons
  document.addEventListener("DOMContentLoaded", () => {
    $("customGo").onclick = () => {
      const v = $("customName").value.trim();
      if (v) act(v.length > 60 ? v.slice(0, 60) : v, v);
    };
    $("customName").addEventListener("keydown", (e) => { if (e.key === "Enter") $("customGo").click(); });
    $("exportBtn").onclick = () => {
      const lines = state.journey.map((t) => JSON.stringify(t)).join("\n") + "\n";
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([lines], { type: "application/jsonl" }));
      a.download = "journey.jsonl";
      a.click();
    };
    $("newBtn").onclick = () => {
      if (!confirm("Begin again at Loop 1? (The current journey stays in this browser until you export.)")) return;
      state = E.newGame();
      state.startedAt = new Date().toISOString();
      pendingNarration = null;
      lastKeeperToken = null;
      save(); render();
    };
    boot();
  });
})();
