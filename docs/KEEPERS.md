# The Keepers — persistent agent personas

Lantern, Eclipse, Blinkbug, and Keystone are the four keepers of Three Doors.
Each is a **persistent agent persona**: a fixed identity + voice (the *persona*)
backed by a memory that grows across every session and loop (the *cube*). A
returning Doorwalker's keepers remember them.

The design is deliberately two-layered — **Hermes + MemOS**:

| Layer | "What am I?" / "What do I remember?" | Where |
|-------|--------------------------------------|-------|
| **Persona** (Hermes-style) | identity, voice, boundaries, what each keeper attends to; drives a structured in-character turn | `data/three-doors/keepers.json` → per-keeper system prompt in `server.js` (`keeperSpeak`) |
| **Memory** (MemOS-style) | a per-keeper *memory cube* — append-only, salience-ranked, **scoped recall** (only what's relevant to the current stage/constellation) | `public/js/keeper-memory.js` (persists in `localStorage`, per player) |

Both are wired into the game by `public/js/keeper-agents.js` and rendered by the
keepers strip in `public/js/loop-ui.js` / `public/css/loop.css`.

## Authorship — Gage owns the voices

`data/three-doors/keepers.json` is **authored by Gage**. The values shipped today
are *seeded only from already-locked canon* (the narrator `SYSTEM` prompt + the
2026-06-30 world-canon handoff) so the wiring has something faithful to run
against — they are a starting point, not the final voices. Gage edits `voice`,
`attends_to`, `boundaries`, and `memory_seed` freely; bump `seed_version` to push
new `memory_seed` entries to existing players (seeding is idempotent — it never
duplicates or overwrites what a keeper already remembers).

**Blinkbug** is intentionally the thinnest persona (least-specified in canon) and
is flagged in the file for Gage to author fully (voice, backstory, anatomy — the
hand-drawn `reference-blinkbug` scan is the canon source once uploaded).

## How a keeper turn works

1. **Recall** — `keeper-memory.recall()` returns the keeper's top-k memories for
   the current stage + constellation (salience + relevance + recency).
2. **Speak** — `POST /api/keeper/speak` builds the keeper's system prompt from its
   persona + the recalled memory block and asks the model (Gemini on Vertex, same
   path as the narrator — **pluggable**) for `{line, remember, mood}`. Offline, the
   keeper speaks one of its **own canon `sample_lines`** instead — the game stays
   playable and the voice stays Gage's.
3. **Witness + form** — after a door is walked every keeper *witnesses* it
   (`keeper-memory.witness()`), forming a neutral memory record **only for turns in
   its scope** (its `home_stages`, a symbol it attends to, or — Lantern — always).
   Any first-person memory the model formed while speaking is stored too.

Speakers per stage: the stage's home keeper(s), plus Lantern on returns / at the
Garden / at the Fog (at most two, so it never crowds).

## Files

- `data/three-doors/keepers.json` — the personas (Gage's source of truth)
- `public/js/keeper-memory.js` — the MemOS-style memory engine (Node-testable)
- `public/js/keeper-agents.js` — client orchestrator (recall → speak → remember)
- `server.js` → `keeperSpeak` + `POST /api/keeper/speak` — the Hermes-style agent turn
- `tests/test_keeper_memory.js` — engine tests (`npm test`)
