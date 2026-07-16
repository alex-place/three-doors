// build-verify-gallery.js — emits public/art-verify.html: the interactive art
// curation tool for the 7 canonical door folders (the timeline).
//
//   · drag a tile to another folder (or between tiles) to re-sort the timeline
//   · click a title to edit it (Enter or click-away commits)
//   · every change autosaves to localStorage; Export downloads the updated
//     art-timeline.json + manifest.json to commit back to the repo
//
// Order within a folder is meaningful: it is the curated preference order the
// game uses when drawing loop art for that stage.
const fs = require("fs");
const path = require("path");
const m = require("../public/assets/content/koh/manifest.json");
const timeline = require("../data/three-doors/art-timeline.json");
const picks = require("../data/three-doors/door-art-picks.json");

const heroOf = {};
for (const [scene, p] of Object.entries(picks.heroes)) heroOf[p.pick] = "HERO " + scene;
const doorOf = {};
for (const [slot, p] of Object.entries(picks.doors)) doorOf[p.pick] = slot.split("/")[1];

const FOLDERS = [
  ["kingdome-garden", "1 · Garden at the Beginning — origins, the King's court, the green first world"],
  ["cloverfield", "2 · The Cloverfield — Present Day: taverns, feasts, luck, the realm's ordinary life"],
  ["future-doors", "3 · Future Doors — the world that's coming: wishes, sketches, the unwritten"],
  ["xp-door", "4 · The XP Door — glitched nostalgia: saved rooms, neon, backrooms"],
  ["xenon-convergence", "5 · Xenon Starship — cosmic midway: fleets, mandalas, every version converging"],
  ["sigil-city", "6 · Sigil, City of Doors — synthesis: galleries, markets, boards, the museum of the game"],
  ["fog-door-return", "7 · Fog Door Return — the way back: mist, wastes, dark tests, homecoming"],
  ["reference", "✎ Cast canon — Alex's hand-drawn references (outside the timeline)"],
  ["_removed", "🗑 Removed from the timeline — excluded from exports; use a tile's dropdown (or drag it) to restore"],
];

const ITEMS = {};
for (const it of m.items) ITEMS[it.id] = { title: it.title || "", thumb: it.thumb, cat: it.cat || null };

const DATA = {
  base: m.base,
  folders: FOLDERS,
  timeline: Object.fromEntries(FOLDERS.map(([k]) => [k, timeline[k] || []])),  // _removed starts empty
  items: ITEMS,
  badges: { ...heroOf, ...doorOf },
};

const html = `<!doctype html><meta charset=utf-8><title>Three Doors — art timeline curator</title><style>
body{background:#0c0b10;color:#e8e2d8;font:14px/1.4 Georgia,serif;margin:0;padding:20px 20px 90px;max-width:1240px;margin-inline:auto}
h1{font-size:21px;color:#ffd27f} p.intro{color:#9a93a8;max-width:70em}
h2{margin:30px 0 8px;font-size:16px;color:#ffd27f;border-bottom:1px solid #2c2a33;padding-bottom:5px}
h2 .count{color:#66607a;font-size:13px}
.g{display:grid;grid-template-columns:repeat(6,1fr);gap:7px;min-height:80px;border-radius:6px;padding:4px}
.g.dragover{outline:2px dashed #ffd27f;background:#17140c}
.c{background:#16161d;padding:4px;border-radius:4px;position:relative;cursor:grab}
.c.dragging{opacity:.35}
.c.dropbefore::before{content:"";position:absolute;left:-5px;top:4px;bottom:4px;width:3px;background:#ffd27f;border-radius:2px}
.c img{width:100%;height:130px;object-fit:cover;display:block;border-radius:3px;pointer-events:none}
.c .t{font:11px monospace;color:#8fd6b8;padding:3px 1px 0;min-height:14px;outline:none;border-radius:2px}
.c .t:focus{background:#0d2b22}
.c .t.edited{color:#ffd27f}
.c .i{font:10px monospace;color:#5d5870}
.c.pick{outline:2px solid #ffd27f}
.c .badge{position:absolute;top:6px;left:6px;background:#ffd27fee;color:#201a08;font:10px monospace;padding:1px 5px;border-radius:3px;max-width:85%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;pointer-events:none}
#bar{position:fixed;left:0;right:0;bottom:0;background:#14121aee;border-top:1px solid #2c2a33;padding:10px 22px;display:flex;gap:14px;align-items:center;font:13px monospace;backdrop-filter:blur(4px)}
#bar .stat{color:#9a93a8;flex:1}
#bar button{background:#ffd27f;color:#201a08;border:0;border-radius:5px;padding:7px 14px;font:600 13px monospace;cursor:pointer}
#bar button.ghost{background:transparent;color:#9a93a8;border:1px solid #3a3745}
.c select.mv{width:100%;margin-top:3px;background:#0f0e14;color:#9a93a8;border:1px solid #2c2a33;border-radius:3px;font:10px monospace;padding:2px}
.c select.mv:hover{color:#e8e2d8;border-color:#4a4658}
</style>
<h1>Three Doors — art timeline curator</h1>
<p class=intro>Every CDN image, hand-sorted into the seven canonical door folders (the timeline).
<b>Drag</b> a tile to reorder within a folder or move it to another era — or use the tile's
<b>dropdown</b> to send it straight to a folder or remove it from the timeline. <b>Click a title</b> to rename it.
★-outlined tiles are the chosen scene-hero / door-card art. Order within a folder is the preference
order the game uses when drawing loop art. Changes autosave in this browser; <b>Export</b> downloads
the updated <code>art-timeline.json</code> + <code>manifest.json</code> to commit.</p>
<div id=root></div>
<div id=bar>
  <span class=stat id=stat>no local changes</span>
  <button class=ghost id=reset>Reset to committed</button>
  <button id=exportTimeline>Export art-timeline.json</button>
  <button id=exportManifest>Export manifest.json</button>
</div>
<script>
const DATA = ${JSON.stringify(DATA)};
const MANIFEST_ITEMS = ${JSON.stringify(m.items)};
const LS_KEY = "three-doors-art-curation-v1";
let state = { timeline: JSON.parse(JSON.stringify(DATA.timeline)), titles: {} };
try {
  const saved = JSON.parse(localStorage.getItem(LS_KEY) || "null");
  if (saved && saved.timeline) {
    // keep only ids that still exist; append newly committed ids at folder ends
    const valid = new Set(Object.keys(DATA.items));
    const savedSet = new Set(Object.values(saved.timeline).flat());
    for (const k of Object.keys(state.timeline)) {
      const savedIds = (saved.timeline[k] || []).filter((id) => valid.has(id));
      const fresh = DATA.timeline[k].filter((id) => !savedSet.has(id));
      state.timeline[k] = [...savedIds, ...fresh];
    }
    state.titles = saved.titles || {};
  }
} catch (_e) {}

let moves = 0;
function persist() {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
  const retitles = Object.keys(state.titles).length;
  const removed = (state.timeline._removed || []).length;
  document.getElementById("stat").textContent = (moves || retitles || removed)
    ? moves + " move(s) this session · " + retitles + " retitle(s) · " + removed + " removed — autosaved locally, Export to commit"
    : "no local changes";
}

function titleOf(id) { return state.titles[id] != null ? state.titles[id] : DATA.items[id].title; }

const root = document.getElementById("root");
function render() {
  root.innerHTML = "";
  for (const [key, label] of DATA.folders) {
    const h = document.createElement("h2");
    h.innerHTML = label + ' <span class=count>— ' + state.timeline[key].length + " images</span>";
    root.appendChild(h);
    const g = document.createElement("div");
    g.className = "g"; g.dataset.folder = key;
    for (const id of state.timeline[key]) {
      const it = DATA.items[id];
      if (!it) continue;
      const c = document.createElement("div");
      c.className = "c" + (DATA.badges[id] ? " pick" : "");
      c.draggable = true; c.dataset.id = id;
      let sel = '<select class=mv title="Move to folder">';
      for (const [fk, fl] of DATA.folders) {
        if (fk === "_removed") continue;
        sel += '<option value="' + fk + '"' + (fk === key ? " selected" : "") + ">" + fl.split(" — ")[0].replace(/<[^>]+>/g, "") + "</option>";
      }
      sel += '<option value="_removed"' + (key === "_removed" ? " selected" : "") + '>✕ remove from timeline</option></select>';
      c.innerHTML = (DATA.badges[id] ? '<div class=badge>★ ' + DATA.badges[id] + "</div>" : "")
        + '<img loading=lazy src="' + DATA.base + it.thumb + '">'
        + '<div class="t' + (state.titles[id] != null ? " edited" : "") + '" contenteditable spellcheck=false>' + titleOf(id).replace(/</g, "&lt;") + "</div>"
        + '<div class=i>' + id + "</div>" + sel;
      g.appendChild(c);
    }
    root.appendChild(g);
  }
}

function moveTo(id, to, beforeId) {
  const from = Object.keys(state.timeline).find((k) => state.timeline[k].includes(id));
  if (!from || (from === to && !beforeId)) return;
  state.timeline[from] = state.timeline[from].filter((x) => x !== id);
  if (beforeId && state.timeline[to].includes(beforeId)) {
    state.timeline[to].splice(state.timeline[to].indexOf(beforeId), 0, id);
  } else {
    state.timeline[to].push(id);
  }
  moves++;
  persist(); render();
}
root.addEventListener("change", (e) => {
  const sel = e.target.closest("select.mv");
  if (!sel) return;
  moveTo(sel.closest(".c").dataset.id, sel.value);
});

// ── drag & drop ──
let dragId = null;

// Edge auto-scroll while grabbing: hold a tile near the top/bottom of the
// viewport and the page scrolls, so a tile can be carried between distant
// eras. Speed ramps with proximity to the edge; runs on rAF so it keeps
// scrolling even when the pointer holds still at the edge.
let _dragClientY = null, _scrollRaf = null;
function autoScrollTick() {
  if (_dragClientY == null) { _scrollRaf = null; return; }
  const EDGE = 120, MAX = 26;
  let dy = 0;
  if (_dragClientY < EDGE) dy = -MAX * (1 - _dragClientY / EDGE);
  else if (_dragClientY > innerHeight - EDGE) dy = MAX * (1 - (innerHeight - _dragClientY) / EDGE);
  if (dy) window.scrollBy(0, dy);
  _scrollRaf = requestAnimationFrame(autoScrollTick);
}
document.addEventListener("dragover", (e) => {
  if (!dragId) return;
  _dragClientY = e.clientY;
  if (_scrollRaf == null) _scrollRaf = requestAnimationFrame(autoScrollTick);
});

root.addEventListener("dragstart", (e) => {
  const c = e.target.closest(".c");
  if (!c) return;
  dragId = c.dataset.id;
  c.classList.add("dragging");
  e.dataTransfer.setData("text/plain", dragId);
  e.dataTransfer.effectAllowed = "move";
});
document.addEventListener("dragend", () => {
  dragId = null;
  _dragClientY = null;
  root.querySelectorAll(".dragging,.dropbefore").forEach((x) => x.classList.remove("dragging", "dropbefore"));
  root.querySelectorAll(".g.dragover").forEach((x) => x.classList.remove("dragover"));
});
root.addEventListener("dragover", (e) => {
  if (!dragId) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  root.querySelectorAll(".dropbefore").forEach((x) => x.classList.remove("dropbefore"));
  root.querySelectorAll(".g.dragover").forEach((x) => x.classList.remove("dragover"));
  const tile = e.target.closest(".c");
  const grid = e.target.closest(".g");
  if (tile && tile.dataset.id !== dragId) tile.classList.add("dropbefore");
  else if (grid) grid.classList.add("dragover");
});
root.addEventListener("drop", (e) => {
  if (!dragId) return;
  e.preventDefault();
  const tile = e.target.closest(".c");
  const grid = e.target.closest(".g");
  if (!grid) return;
  const to = grid.dataset.folder;
  if (!to) return;
  _dragClientY = null;
  moveTo(dragId, to, tile && tile.dataset.id !== dragId ? tile.dataset.id : null);
});

// ── editable titles (commit live on input; focusout just re-normalizes) ──
function commitTitle(t) {
  const id = t.closest(".c").dataset.id;
  const v = t.textContent.trim();
  if (v === DATA.items[id].title) delete state.titles[id];
  else state.titles[id] = v;
  t.classList.toggle("edited", state.titles[id] != null);
  persist();
}
root.addEventListener("input", (e) => {
  const t = e.target.closest(".t");
  if (t) commitTitle(t);
});
root.addEventListener("focusout", (e) => {
  const t = e.target.closest(".t");
  if (t) commitTitle(t);
});
root.addEventListener("keydown", (e) => {
  if (e.target.closest(".t") && e.key === "Enter") { e.preventDefault(); e.target.blur(); }
});

// ── export / reset ──
function download(name, obj) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(obj, null, 2) + "\\n"], { type: "application/json" }));
  a.download = name;
  a.click();
}
document.getElementById("exportTimeline").onclick = () => {
  const out = {};
  for (const [k, ids] of Object.entries(state.timeline)) if (k !== "_removed") out[k] = ids;
  download("art-timeline.json", Object.assign(
    { _comment: "Every KOH CDN image hand-sorted into one of the 7 canonical door folders (the timeline). Order within a folder = curated preference order for loop art. Exported from art-verify.html." },
    out));
};
document.getElementById("exportManifest").onclick = () => {
  const gone = new Set(state.timeline._removed || []);
  const items = MANIFEST_ITEMS.filter((it) => !gone.has(it.id)).map((it) => state.titles[it.id] != null
    ? Object.assign({}, it, { title: state.titles[it.id], titled_by: "curator" })
    : it);
  download("manifest.json", { base: DATA.base, items });
};
document.getElementById("reset").onclick = () => {
  if (!confirm("Discard local moves and retitles, back to the committed sort?")) return;
  localStorage.removeItem(LS_KEY);
  location.reload();
};

render(); persist();
</script>`;

fs.writeFileSync(path.join(__dirname, "../public/art-verify.html"), html);
console.log("interactive curator written:", FOLDERS.length, "folders,", Object.keys(ITEMS).length, "items");
