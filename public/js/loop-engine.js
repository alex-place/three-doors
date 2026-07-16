// loop-engine.js — the Three Doors convergence loop, infinitely recursive.
//
// The game IS the loop:  Observe → Remember → Reason → Act → Verify → Converge.
// One turn walks the six stages once (the micro-loop). Seven gates walk the
// timeline once (the macro-loop). Finishing the Fog gate begins the next loop
// — nothing resets: symbols, journey and records carry forward, the world
// remembers, and every scene draws deeper art and deeper echoes. There is no
// end state anywhere in this file, by design.
//
// Pure state machine — no DOM, no fetch. Works in the browser (window.LoopEngine)
// and under Node for tests (module.exports).
(function (global) {
  "use strict";

  const STAGES = [
    { key: "kingdome-garden", name: "The Garden at the Beginning", theme: "Love, courage, memory, and play; the hub and home of the Kingdome", lesson: "Home is the place that recognizes you." },
    { key: "cloverfield", name: "The Cloverfield", theme: "Small joy; the sacredness of an ordinary day noticed", lesson: "Today, noticed, is enough." },
    { key: "future-doors", name: "Future Doors", theme: "Branching futures; hope that admits it doesn't know", lesson: "The unwritten door still has your hand on the hinge." },
    { key: "xp-door", name: "The XP Door", theme: "Safe nostalgia; returning to what shaped you without living there", lesson: "You can visit a saved point without staying." },
    { key: "xenon-convergence", name: "Xenon Starship", theme: "Convergence; witnessing every version of a moment at once", lesson: "All of your versions were true — pick one to carry." },
    { key: "sigil-city", name: "Sigil, City of Doors", theme: "Every threshold you've ever walked, visible at once", lesson: "The path itself is a place you built." },
    { key: "fog-door-return", name: "The Fog Door Return", theme: "Trust and homecoming; the courage it takes to return", lesson: "Coming back is also a door." },
  ];

  // Canon fallback doors per stage — used offline, and always the routing truth
  // (a door flavors the story and the symbols; the spine still advances).
  const CANON_DOORS = {
    "kingdome-garden": [
      { name: "The Wishing Rail", whisper: "The worn stone rail where great wishes are made. Something warm already rests there." },
      { name: "The Knee-High Door", whisper: "A small warm door at the foot of the wall. Joy is already reaching for it." },
      { name: "The Brass Spyglass", whisper: "Trained on a new light far out on the water — a door that wasn't there last night." },
    ],
    "cloverfield": [
      { name: "The Lucky Door", whisper: "Painted clover-green. Whatever you find behind it, you needed." },
      { name: "The Today Door", whisper: "Warm and ordinary. The day you are actually in, alive." },
      { name: "The Tomorrow Door", whisper: "Slightly ajar. The world that's coming, branching like roots in the dark." },
    ],
    "future-doors": [
      { name: "The Bright Branch", whisper: "Warm gold light spills out. A future where the gardens won." },
      { name: "The Unwritten Door", whisper: "Plain, unfinished wood. The hinge waits for your hand to decide." },
      { name: "The Recursive Door", whisper: "Opens onto a hallway of itself, smaller each time, all the way in." },
    ],
    "xp-door": [
      { name: "System Restore", whisper: "Roll back to a saved point. The smell of an old summer loads first." },
      { name: "My Documents", whisper: "Every picture you ever saved, sorted by feeling instead of date." },
      { name: "unknown.exe", whisper: "Publisher: unknown. Lantern nods its flame. You run it anyway." },
    ],
    "xenon-convergence": [
      { name: "The Mirror Door", whisper: "Shows you as you were, as you are, as you might be. All at once." },
      { name: "The Branch Door", whisper: "Splits into infinite versions, each one leading somewhere true." },
      { name: "The Merge Door", whisper: "Where all paths collapse into a single point of perfect understanding." },
    ],
    "sigil-city": [
      { name: "The Gallery of Walked Doors", whisper: "Your whole path hung in one hall. It rearranges when you understand it." },
      { name: "The Key Market", whisper: "Stalls of keys for doors not yet dreamed. One of them is warm." },
      { name: "The Lady's Gate", whisper: "Silent, watched, absolutely fair. It opens only for what is honest." },
    ],
    "fog-door-return": [
      { name: "The Garden Gate", whisper: "Straight home to the Beginning. The King will be glad — he always is." },
      { name: "The Long Way Round", whisper: "Drift through the fog first. Arrive when you're ready, not before." },
      { name: "Lantern's Shortcut", whisper: "Follow the steady flame through the mist. Trust is the fastest road." },
    ],
  };

  const CANON_SCENES = {
    "kingdome-garden": "The Garden at the Beginning opens around you — stone paths through living moss, the throne of woven roots, seven door-portals shimmering at the garden's edge. Lantern stands at the foot of the throne as if its light has always lived here, and says what it always says, and means it: \"You came back.\"",
    "cloverfield": "The Cloverfield rolls out in every green there is. Somewhere near, a kettle; somewhere nearer, luck. Joy trumpets softly at a shiny thing in the grass, and the ordinary day stands very still so you can finally see it.",
    "future-doors": "An orchard where every tree grew into a doorway. The futures hang like weather — some golden, some unwritten, one folded into itself over and over. Blinkbug lands on your shoulder to watch them ripen.",
    "xp-door": "A green hill under an impossible blue sky, rendered slightly wrong in the kindest way. A cursor blinks in the air. Somewhere a machine you loved boots its chime, and the past waits politely to be visited, not lived in.",
    "xenon-convergence": "The Xenon Starship holds the midway of everything — a ring of ships, a wheel of planets, every version of this moment arriving at once. Eclipse charts them without hurry. Convergence, the crew calls it. Coming home at every scale.",
    "sigil-city": "Sigil, the City of Doors, where every threshold you've ever walked hangs lit in the long streets. Keystone walks beside you past the Gallery, the Key Market, the quiet Gate. Nothing here is lost; it is all catalogued in lantern-light.",
    "fog-door-return": "The fog gathers itself into a threshold. Odin the Fog God stands vast and gentle at the edge of seeing, and beyond him, faint and certain, the Garden light. This is the way back — the loop closing so it can open.",
  };

  const MICRO = ["observe", "remember", "reason", "act", "verify", "converge"];

  function newGame() {
    return {
      v: 2,
      loop: 1,
      stageIndex: 0,
      phase: "observe",
      symbols: {},           // word -> count (the constellation)
      journey: [],           // append-only turn log (never truncated, never rewritten)
      records: [],           // convergence records, one per turn
      startedAt: null,       // stamped by the UI layer
    };
  }

  function stage(state) { return STAGES[state.stageIndex]; }

  // Remember: surface echoes — the world citing the player's own past.
  // Deeper loops reach deeper: loop N can echo anything from loops 1..N.
  function echoesFor(state, limit) {
    const out = [];
    const turns = state.journey.filter((t) => t.kind === "turn");
    if (!turns.length) return out;
    // most recent turn, the same stage one loop ago, and the very first door
    const last = turns[turns.length - 1];
    out.push(`Last door: ${last.door} (${last.stageName}, loop ${last.loop}).`);
    const sameStagePrior = [...turns].reverse().find((t) => t.stageKey === stage(state).key && t.loop < state.loop);
    if (sameStagePrior) out.push(`Here on loop ${sameStagePrior.loop}, you chose ${sameStagePrior.door}.`);
    if (turns.length > 2) out.push(`Your first door ever was ${turns[0].door}.`);
    const topSymbols = Object.entries(state.symbols).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([w]) => w);
    if (topSymbols.length) out.push(`Your constellation leans ${topSymbols.join(", ")}.`);
    return out.slice(0, limit || 4);
  }

  // Reason: the three doors for this stage (canon; a narrator may re-whisper them).
  function doorsFor(state) {
    return CANON_DOORS[stage(state).key].map((d) => ({ ...d }));
  }

  function sceneFor(state) {
    const base = CANON_SCENES[stage(state).key];
    return state.loop > 1
      ? `${base} (Loop ${state.loop} — the light knows you now.)`
      : base;
  }

  // Act + Verify + Converge in one commit: the player walked a door.
  // `narrated` (optional) carries the model's beat/echo/symbol for the record.
  function choose(state, doorName, opts) {
    const o = opts || {};
    const st = stage(state);
    const canonNames = CANON_DOORS[st.key].map((d) => d.name.toLowerCase());
    const custom = !canonNames.includes(String(doorName).toLowerCase());
    const beat = o.beat || `Chose ${doorName} at ${st.name}.`;
    const symbol = (o.symbol || String(doorName).toLowerCase().replace(/^the /, "").split(/\s+/)[0]).replace(/[^a-z-]/g, "") || "door";

    state.symbols[symbol] = (state.symbols[symbol] || 0) + 1;

    const turn = {
      kind: "turn", ts: o.ts || null,
      loop: state.loop, stageKey: st.key, stageName: st.name,
      door: doorName, custom, beat, symbol, playerWords: o.playerWords || "",
      art: o.art || null,   // {url,title} — the picture the player stepped through
    };
    state.journey.push(turn);

    // Convergence record — hypothesis / evidence / result / confidence,
    // the same four-field shape the Convergence Core uses.
    state.records.push({
      kind: "three-doors-turn",
      hypothesis: `${doorName} serves the Doorwalker's path through ${st.name}.`,
      evidence_ids: echoesFor(state, 3),
      result: { stage: st.key, loop: state.loop, door: doorName, symbol },
      confidence: custom ? 0.7 : 0.9,
      verified: true,
      verification_notes: beat,
    });

    // Converge: advance the spine. Fog gate closes the macro-loop → recurse.
    if (state.stageIndex === STAGES.length - 1) {
      state.loop += 1;             // the recursion — unbounded by design
      state.stageIndex = 0;
    } else {
      state.stageIndex += 1;
    }
    state.phase = "observe";
    return turn;
  }

  // Art: rotate through the stage's hand-sorted folder so each loop shows the
  // next image in the curated order — recursion made visible.
  function artIndexFor(state, folderLen) {
    if (!folderLen) return 0;
    return (state.loop - 1) % folderLen;
  }

  const api = { STAGES, CANON_DOORS, CANON_SCENES, MICRO, newGame, stage, echoesFor, doorsFor, sceneFor, choose, artIndexFor };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else global.LoopEngine = api;
})(typeof window !== "undefined" ? window : globalThis);
