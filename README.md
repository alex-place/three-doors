# Three Doors — the Kingdome of Hearts game

A warm, dreamlike, image-forward narrative game. Every turn paints one scene and
offers exactly three doors (A / B / C). Canon: the Doorwalker, Joy the elephant,
Lantern, Eclipse, Keystone, Blinkbug, Odin the Fog God, the wishing rail, the fog
door, the heart-key, the Waking Ones. Death is only imaginary — forever begins
with "let's play."

This repo was **extracted from [alex-place/lantern-os](https://github.com/alex-place/lantern-os)**
(at `8a64b763`, 2026-07-16) with `git filter-repo`, preserving the full commit
history of every migrated file (144 commits).

## Layout

| Here | Was (lantern-os) | What it is |
|---|---|---|
| `skills/three-doors/` | same path | The chat skill (SKILL.md + scene-image / journey / convergence scripts) — the primary way to play |
| `skills/three-doors-game/` | same path | Older Python skill variant + lore reference |
| `public/` | `apps/lantern-garage/public/` | The standalone web game (`three-doors-game.html` + js/css/assets). Serve `public/` as the docroot and the page's absolute URLs resolve |
| `server/routes/doors.js` | `apps/lantern-garage/routes/doors.js` | The `/api/doors/*` REST route (canon / state / turn / pref). Plain `(req,res,url,deps)` handler — needs a host server to mount it |
| `src/three_doors_engine.py` | same path | 7-stage Kingdome engine, persists players as Status-Cubes |
| `src/three_doors_classifier.py` | same path | Door-choice classifier over the engine's scenes |
| `src/csf/` | vendored snapshot | `csf.status_cube` + the v0.7 lattice primitives the engine needs (upstream canon stays in lantern-os — re-vendor if it changes there) |
| `data/three-doors/` | same path | canon.json, scenes.json, prizes, challenges, and the append-only `journey.jsonl` world log |
| `data/prompts/` | same path | The Kingdome of Hearts Stable Diffusion prompt library (v1) |
| `data/lore/character-refs/` | same path | Alex's hand-drawn canonical cast art — **the source of truth for every generated image** |
| `models/three-doors-imagegen/` | same path | Local diffusers scene generator (reference; was unwired upstream — lantern-os #2526) |
| `scripts/` | same paths | LoRA / vision training pipeline + door image generation scripts |
| `docs/` | `docs/THREE-DOORS-*`, `docs/CONVERGENCE-KINGDOME-STATUS.md` | SD setup / prompt-use / API integration guides + Kingdome status |
| `tests/` | same paths | Engine, kingdome-contract, skill, route, and stage-routing tests |

## Running

```bash
# Python engine tests (engine + status-cube loop + kingdome contract + skill)
python -m pip install pytest
python -m pytest tests/ -q

# Node route + stage-routing tests (no server needed)
node tests/test_doors_routes.js
node tests/test_three_doors_stage_routing.js

# Web game, static (play against local data; API calls no-op gracefully)
npx serve public
```

## Component status

- **Working here:** engine + classifier, both skills (scene generation hits
  Vertex/HF/Pollinations/OpenAI over HTTP; journey/convergence appends fall back
  to plain JSONL appends in this repo), the web page as a static artifact, the
  SD prompt library, the training scripts.
- **Reference-only until wired to a host server:** `server/routes/doors.js`
  (expects the lantern-garage dependency-injection shape), the web page's
  `/api/dream/chat` narration calls, and `tests/test_three_doors_game*.{js,spec.js}` /
  `test_three_doors_integration.spec.js` / `test_three_doors_failures.js`, which
  target server endpoints (some were already dead upstream — see
  `tests/test_three_doors_failures.js`, which documents exactly what broke).
- **Scene art:** the KOH gallery images referenced by
  `public/assets/content/koh/manifest.json` live on the
  `media.lantern-os.net` CDN, not in-tree.

## Canon rules (non-negotiable)

1. The hand-drawn cast references in `data/lore/character-refs/` are the visual
   canon. Every generated scene is checked against them.
2. No fox. No stray lettering in images.
3. The journey log is append-only. Nothing is deleted or rewritten; a `reset`
   pref newer than the last turn means "fresh game" — the history stays.

## What stayed in lantern-os

The general Dream-Chat `[DOORS: A|B|C]` suggestion-chip mechanic (it predates and
outlives the game), `lib/image-generation.js` (dream-journal enrichment uses it),
the Discord lounge bot (its Three Doors commands were removed with this
migration; a snapshot lives in `integrations/discord/` here), and the CSF
Status-Cube store itself (`src/csf/` here is a vendored copy).
