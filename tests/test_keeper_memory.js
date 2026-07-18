// test_keeper_memory.js — the MemOS-style keeper memory engine.
const assert = require("assert");
const KM = require("../public/js/keeper-memory.js");
const fs = require("fs");
const path = require("path");

const KEEPERS = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "three-doors", "keepers.json"), "utf8"));
const personas = KEEPERS.keepers;
const SEEDV = KEEPERS.seed_version;
let n = 0; const ok = (m) => { n++; console.log("  ok -", m); };

// seed installs once, is idempotent, and bumps seedVersion
let store = KM.newStore(0);
KM.seedFrom(store, personas, SEEDV);
const lanternSeeds = store.keepers.lantern.cube.filter((m) => m.kind === "seed").length;
assert(lanternSeeds >= 3, "lantern seeded");
KM.seedFrom(store, personas, SEEDV); // idempotent
assert.strictEqual(store.keepers.lantern.cube.filter((m) => m.kind === "seed").length, lanternSeeds, "seed idempotent");
assert.strictEqual(store.seedVersion, SEEDV, "seedVersion bumped");
ok("seedFrom installs canon seeds once");

// remember: dedup reinforces, distinct appends
const before = store.keepers.eclipse.cube.length;
KM.remember(store, "eclipse", { text: "A new wonder.", salience: 0.4, tags: ["xenon-convergence"] });
const r2 = KM.remember(store, "eclipse", { text: "a new wonder.", salience: 0.4 }); // same (norm)
assert.strictEqual(store.keepers.eclipse.cube.length, before + 1, "dedup by normalized text");
assert(r2.salience > 0.4, "dedup reinforces salience");
ok("remember dedups + reinforces");

// witness: keeper only records home-stage / attended turns; Lantern always
const lantern = personas.find((k) => k.id === "lantern");
const eclipse = personas.find((k) => k.id === "eclipse");
const keystone = personas.find((k) => k.id === "keystone");
const turnSigil = { stageKey: "sigil-city", stageName: "Sigil, City of Doors", door: "The Key Market", symbol: "key", loop: 1, custom: false, ts: "t1" };
assert(KM.witness(store, keystone, turnSigil), "keystone witnesses its home stage (sigil)");
assert.strictEqual(KM.witness(store, eclipse, turnSigil), null, "eclipse ignores a stage it doesn't attend");
assert(KM.witness(store, lantern, turnSigil), "lantern witnesses everywhere (always_present)");
ok("witness is scoped by home_stages / always_present");

// return detection raises salience the second time through a stage
const turnSigil2 = { stageKey: "sigil-city", stageName: "Sigil, City of Doors", door: "The Lady's Gate", symbol: "lady", loop: 2, custom: false, ts: "t2" };
const w2 = KM.witness(store, keystone, turnSigil2);
assert(w2.tags.indexOf("return") >= 0, "revisit tagged as return");
ok("witness detects returns across loops");

// recall: scoped + top-k; a sigil-tagged memory outranks an unrelated one here
const rec = KM.recall(store, "keystone", { stage: "sigil-city", symbols: ["key"], loop: 2 }, 3);
assert(rec.length > 0 && rec.length <= 3, "recall returns <=k");
assert(rec.some((m) => (m.tags || []).indexOf("sigil-city") >= 0), "recall surfaces stage-relevant memory");
ok("recall is scoped + bounded to k");

// cube cap: never evicts seeds, stays <= CUBE_CAP
for (let i = 0; i < 200; i++) KM.remember(store, "keystone", { text: "filler " + i, salience: 0.1, tags: ["x"] });
assert(store.keepers.keystone.cube.length <= KM.CUBE_CAP, "cube capped");
assert(store.keepers.keystone.cube.filter((m) => m.kind === "seed").length >= 2, "seeds survive eviction");
ok("cube caps and protects seeds");

// loopsWitnessed drives greetings
assert.strictEqual(KM.loopsWitnessed(store, "keystone") >= 2, true, "loopsWitnessed counts distinct loops");
ok("loopsWitnessed counts distinct loops");

console.log("\n" + n + " keeper-memory assertions passed.");
