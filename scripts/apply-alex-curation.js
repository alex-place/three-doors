// apply-alex-curation.js — one-shot: commit Alex's in-browser curation pass
// (2026-07-16, 114 moves + 65 removals, pasted from art-verify.html) into
// data/three-doors/art-timeline.json + public/assets/content/koh/manifest.json.
// Titles are matched against the manifest; the "Dream Doors" duplicate pair is
// resolved as a set (both removed).
const fs = require("fs");
const path = require("path");
const REPO = path.join(__dirname, "..");
const manifestPath = path.join(REPO, "public/assets/content/koh/manifest.json");
const timelinePath = path.join(REPO, "data/three-doors/art-timeline.json");
const m = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const byTitle = {};
for (const it of m.items) (byTitle[it.title] = byTitle[it.title] || []).push(it.id);

const FOLDERS = {
  "kingdome-garden": ["Garden Gate Crossing","Wizard's Garden","Elephant Oasis Door","Gothic Bridge Night","Verdant Doors","Verdant Doorway","Forest Portal","Three Doors Elephant Moss Steps Next Candidates Tesseract","Three Doors Elephant Raven Garden Tesseract Signed","Three Doors Moss Steps Exit Known Doors Tesseract","Library of Babylon","Keeper of the Library","Book Mages","Dwarf Scribe","The Lecture","Lantern Bearer","Lantern Storytime","Chibi Cast Card","Lion Altar","Kingdome of Hearts — title sketch","The Fool and Fein Stonewalled Lodge Origin","Battlefield","Cavern of the Lantern","Moonlit Garden Door","Founder Key sketch","Three Doors poster","Three Doors — board"],
  "cloverfield": ["Tavern Scene","Tavern Council","Moonlit Village","Balcony Sunset","Three Doors — jeweled","I Spy Door","Three Doors — owl","Three Doors — green board","Three Doors Convergence Sprawl Outer Rim Homes","Hero Party","Scavenger Girl","Treasure Keeper","Axe King","Caped Hero","The Sage","Sunset Pilgrim","Pilgrims' Door","Three Doors Emblem"],
  "future-doors": ["Three Future Paths","Three Glowing Doorways","Golden Portal Door","Light Doors","Founder's Wish Door card","Founder's Wish Door — board","Tower of Signals","Portal Crossing","Wizard's Door","Moonlit Doorway","The Castle Opens","Sphinx Ruins","The Grand Feast","Three Doors Banner Dispute Deathmaw Border Location","The Fool and Fein Hero Pose","The Fool and Fein Lore Accurate UHD","The Fool Masked Trickster Horns","Dwarf at the Table","Mountain King","Moonlit Lounge","Velvet Lounge","Cosmic Bedroom","The Round Window Hall","The Gathering Hall","Raven Room Mirror Girl Silver Bathhouse Branch","Raven Room 03 Neon Mermaid Fairy Noir","Raven Room 02 Moonlit Greek Villa","Raven Lord","Raven & Wanderer","Alex Doors"],
  "xp-door": ["Gage's XP Door","The Arcade Door","Glitch Cat Room","Glitch Monster","Starlit Bedroom","Neon Blinkbug","Neon Vista","Blinkbug Trio","Doors Storybook","Storybook Door","Atrium of Doors"],
  "xenon-convergence": ["Xenon Door","Cosmic Doors — blue","Cosmic Doors card","Three Doors Xenon Ring of Ships Twelve Point Mandala","Three Doors Xenon Sol Alliance Party Command Bridge","Three Doors Xenon Wedding Planner Arrival Mandala","Xenon Wedding Rehearsal Dinner Three Doors","Wedding at Convergence sci-fi Mermaid Fairy Fool","Wedding at the Convergence","Valtoris Fein Convergence Cinematic","Valtoris Fein Faceless Mask Gear Sheet","Valtoris Fein Shadow Trainer Key Art","Valtoris Fein Three States Concept","Doors Triptych II","Three Doors — triptych","Mandala","Cosmic Orrery","The Spiral","Violet Grotto","Violet Doorway Portrait","Lantern OS Agent Fleet Blackhole Core 04","Lantern OS Founder Sacred Tesseract","Lantern OS Founder Tesseract Blackhole","Lantern OS Infinity Mural Agents Love 03","Lantern OS Matrix Mural Agents Love 01","Lantern OS Superjarvis Command Chamber 02","Convergence Board","Convergence Collage","Cosmic King card","Queen of Diamonds","Shelby Queen of Clubs Kingdome Card","Shelby Queen of the Kingdome of Clubs Corrected Card","Kingdome of Hearts Original Card UHD Sharp","Planescapey Kingdom of Hearts Painterly Pass","Three Doors D&D Council Road to Miliways","Three Doors Border Parley Rim Protection","Courtney Coven Door All Girls Space Buns Balanced","Courtney Coven Door Interior lo-fi Witch","Raven Room Velvet Observatory Door Candidate","Three Doors Lantern Roads Status Cube","Robed Assembly"],
  "sigil-city": ["City of Doors Yggdrasil Convergence","City of Doors Csf Refined","Kingdome Hall","Sigil Back Doors","Cathedral Stair","Stained-Glass Doors","Gallery of Frames","Hall of Whispers","Tower of Nobel Hall","The Sound Bridge","Gothic Bridges","Raven Door Perfected Style","Raven Bride card","Robed Wanderers","The Great Battle","The War Table","Planescapey Kingdom of Hearts Style Merge Variant 3","Backrooms Dead God Sigil"],
  "fog-door-return": ["The Fog Door","The Threshold Mist","Rainy Threshold","The Long March","March of Ruins","Drowned City","Ruined City Dawn","Ruined Town","Wasteland Banner","Wasteland III","Wasteland Leviathan","Wasteland Vigil","Wasteland Vigil II","Graveyard Wraiths","The Pale Spirit","Shadow Reach","Shadow at the Door","Dark Warden","Shrouded Knight","Crimson Door Chamber","Crimson Rite Doors","Crimson Chamber","Deathmaw Throne Inside Fleet Door UHD Sharp","Deathmaw Kingdome of Spades Corrected Poster","Garden Xenon Eve Sigil","Deathmaw Throne Inside Fleet Door","Heart Swirl Sketch","Vortex Sketch","Swirl Door Sketch","Doorway Sketch III","Doorway Sketch I","Doorway Sketch II"],
  "reference": ["How I draw Lantern — hand-drawn character reference","How I draw Eclipse — hand-drawn character reference","How I draw Keystone — hand-drawn character reference","How I draw Blinkbug — hand-drawn character reference","The Horned One","Fog God Door cast"],
};

const timeline = { _comment: "Every KOH CDN image hand-sorted into one of the 7 canonical door folders (the timeline). Order within a folder = curated preference order for loop art. This IS Alex's 2026-07-16 curation pass (114 moves, 65 removals), applied verbatim." };
const used = new Set();
let missing = [];
for (const [folder, titles] of Object.entries(FOLDERS)) {
  timeline[folder] = [];
  for (const title of titles) {
    const ids = (byTitle[title] || []).filter((id) => !used.has(id));
    if (!ids.length) { missing.push(folder + " :: " + title); continue; }
    used.add(ids[0]);
    timeline[folder].push(ids[0]);
  }
}
const removed = m.items.filter((it) => !used.has(it.id));
console.log("kept:", used.size, "| removed:", removed.length, "| unresolved titles:", missing.length);
missing.forEach((x) => console.log("  MISSING:", x));
if (missing.length) process.exit(1);

fs.writeFileSync(timelinePath, JSON.stringify(timeline, null, 2) + "\n");
m.items = m.items.filter((it) => used.has(it.id));
fs.writeFileSync(manifestPath, JSON.stringify(m, null, 2) + "\n");
console.log("removed titles:", removed.map((r) => r.title).slice(0, 100).join(" | "));
console.log("timeline + manifest written");
