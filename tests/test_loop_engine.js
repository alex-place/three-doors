// Tests for the infinitely recursive convergence-loop engine.
// Run: node tests/test_loop_engine.js
const assert = require("assert");
const E = require("../public/js/loop-engine.js");

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); console.log("  ✓ " + name); passed++; }
  catch (e) { console.error("  ✗ " + name + "\n    " + e.message); failed++; }
}

test("seven stages, six micro-phases, three doors everywhere", () => {
  assert.strictEqual(E.STAGES.length, 7);
  assert.deepStrictEqual(E.MICRO, ["observe", "remember", "reason", "act", "verify", "converge"]);
  for (const s of E.STAGES) {
    assert.strictEqual(E.CANON_DOORS[s.key].length, 3, s.key + " needs 3 doors");
    assert.ok(E.CANON_SCENES[s.key], s.key + " needs a canon scene");
  }
});

test("a full macro-loop of 7 turns recurses into loop 2 at the garden", () => {
  const s = E.newGame();
  for (let i = 0; i < 7; i++) {
    assert.strictEqual(s.loop, 1);
    E.choose(s, E.doorsFor(s)[0].name);
  }
  assert.strictEqual(s.loop, 2, "fog gate closes the loop");
  assert.strictEqual(s.stageIndex, 0, "recursion re-enters the garden");
  assert.strictEqual(s.journey.length, 7);
  assert.strictEqual(s.records.length, 7);
});

test("recursion is unbounded: 10 loops deep, nothing resets", () => {
  const s = E.newGame();
  for (let i = 0; i < 70; i++) E.choose(s, E.doorsFor(s)[i % 3].name);
  assert.strictEqual(s.loop, 11);
  assert.strictEqual(s.journey.length, 70, "journey is append-only across loops");
  assert.strictEqual(s.records.length, 70);
  assert.ok(Object.keys(s.symbols).length >= 5, "symbols accumulate across loops");
});

test("the world remembers: echoes cite the same stage one loop earlier", () => {
  const s = E.newGame();
  E.choose(s, "The Wishing Rail");                   // garden, loop 1
  for (let i = 0; i < 6; i++) E.choose(s, E.doorsFor(s)[0].name); // finish loop 1
  assert.strictEqual(s.loop, 2);
  const echoes = E.echoesFor(s, 4).join(" | ");
  assert.ok(/loop 1, you chose The Wishing Rail|chose The Wishing Rail/.test(echoes),
    "garden on loop 2 remembers the loop-1 garden door: " + echoes);
});

test("scene text deepens with loop count", () => {
  const s = E.newGame();
  const l1 = E.sceneFor(s);
  for (let i = 0; i < 7; i++) E.choose(s, E.doorsFor(s)[0].name);
  const l2 = E.sceneFor(s);
  assert.ok(!/Loop 1/.test(l1));
  assert.ok(/Loop 2/.test(l2), "loop 2 garden acknowledges the depth");
});

test("custom doors are first-class: named door flavors symbol + lower confidence", () => {
  const s = E.newGame();
  const t = E.choose(s, "The Salt Door", { playerWords: "I name the salt door" });
  assert.strictEqual(t.custom, true);
  assert.ok(s.symbols["salt"], "custom door seeds its symbol");
  assert.strictEqual(s.records[0].confidence, 0.7);
  assert.strictEqual(s.records[0].verified, true);
});

test("convergence records carry the four-field shape", () => {
  const s = E.newGame();
  E.choose(s, "The Knee-High Door");
  const r = s.records[0];
  for (const k of ["hypothesis", "evidence_ids", "result", "confidence"]) assert.ok(k in r, "record has " + k);
  assert.strictEqual(r.result.stage, "kingdome-garden");
});

test("art rotates through the stage folder by loop depth", () => {
  const s = E.newGame();
  assert.strictEqual(E.artIndexFor(s, 49), 0);
  s.loop = 2; assert.strictEqual(E.artIndexFor(s, 49), 1);
  s.loop = 50; assert.strictEqual(E.artIndexFor(s, 49), 0, "wraps — infinite loops, finite art, no crash");
  assert.strictEqual(E.artIndexFor(s, 0), 0, "empty folder safe");
});

console.log(`\n[loop-engine] ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
