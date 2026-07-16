// build-verify-gallery.js — the 7 canonical door folders (the timeline), every CDN
// image in its hand-sorted folder, with the chosen scene-hero / door-card picks
// starred. This page is the human verification surface: eyeball a folder, spot a
// misfit, move its id in data/three-doors/art-timeline.json.
const fs = require("fs");
const m = require("../public/assets/content/koh/manifest.json");
const timeline = require("../data/three-doors/art-timeline.json");
const picks = require("../data/three-doors/door-art-picks.json");
const byId = Object.fromEntries(m.items.map((i) => [i.id, i]));
const base = m.base;

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
];

let html = `<!doctype html><meta charset=utf-8><title>Three Doors — art timeline (7 folders)</title><style>
body{background:#0c0b10;color:#e8e2d8;font:14px/1.4 Georgia,serif;margin:0;padding:20px;max-width:1240px;margin-inline:auto}
h1{font-size:21px;color:#ffd27f} p.intro{color:#9a93a8}
h2{margin:30px 0 8px;font-size:16px;color:#ffd27f;border-bottom:1px solid #2c2a33;padding-bottom:5px}
.g{display:grid;grid-template-columns:repeat(6,1fr);gap:7px}
.c{background:#16161d;padding:4px;border-radius:4px;position:relative}
.c img{width:100%;height:130px;object-fit:cover;display:block;border-radius:3px}
.c .t{font:11px monospace;color:#8fd6b8;padding:3px 1px 0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.c .i{font:10px monospace;color:#5d5870}
.c.pick{outline:2px solid #ffd27f}
.c .badge{position:absolute;top:6px;left:6px;background:#ffd27fee;color:#201a08;font:10px monospace;padding:1px 5px;border-radius:3px;max-width:85%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
</style>
<h1>Three Doors — the seven canonical door folders (the timeline)</h1>
<p class=intro>Every CDN image, hand-sorted. ★-outlined tiles are the chosen scene-hero / door-card art. To move an image, edit <code>data/three-doors/art-timeline.json</code>; to change a pick, edit <code>data/three-doors/door-art-picks.json</code>.</p>`;

for (const [key, label] of FOLDERS) {
  const ids = timeline[key] || [];
  html += `<h2>${label} — ${ids.length} images</h2><div class=g>`;
  for (const id of ids) {
    const it = byId[id];
    if (!it) continue;
    const badge = heroOf[id] || doorOf[id];
    html += `<div class="c${badge ? " pick" : ""}">${badge ? `<div class=badge>★ ${badge}</div>` : ""}<img loading=eager src="${base}${it.thumb}"><div class=t>${it.title || "(untitled)"}</div><div class=i>${id}</div></div>`;
  }
  html += `</div>`;
}
fs.writeFileSync(require("path").join(__dirname, "../public/art-verify.html"), html);
console.log("timeline gallery:", FOLDERS.length, "folders");
