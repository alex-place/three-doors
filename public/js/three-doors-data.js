// ── Three Doors Game Data ─────────────────────────────────────────────────────
// Scene definitions, routing maps, and prompts extracted from three-doors-game.html
// This file contains only static data - no logic.

const SCENES = {
  "moss-entry": {
    "text": "You stand inside **The Moss Door**. The air is thick with green light, soft earth, and the smell of rain on ferns. Lanterns hang from ancient branches. Lantern stands beside you, flame steady against the green dark, a brass plate on its frame reading: **GUIDE OF THE ONE WHO CHOSE GREEN**. It glows warmer and says, *\"You came back.\"*",
    "theme": "Origins; a gentle beginning; being recognized without having to explain yourself.",
    "lesson": "Being known doesn't require proving anything first.",
    "doors": [
      {
        "name": "The Burrow Door",
        "label": "A",
        "description": "Small, root-framed, warm. Smells of rain and old blankets."
      },
      {
        "name": "The Sunken Bell Door",
        "label": "B",
        "description": "Half underwater. Rings softly when no one touches it."
      },
      {
        "name": "The Little Crown Door",
        "label": "C",
        "description": "Tiny golden door in a tree stump, widening when trusted."
      }
    ],
    "fox": true,
    "palette": [
      "#0d2b1a",
      "#1a4a2e",
      "#2d6b45",
      "#3ecf8e",
      "#7fff9a",
      "#0a1f10"
    ],
    "archetype": "primordial"
  },
  "burrow": {
    "text": "You crawl through **The Burrow Door** into a snug earthen chamber lined with woven roots and faded quilts. Rain drums overhead. Lantern settles in the corner, dimming its flame to a drowsy ember. A single lantern flickers in the corner.",
    "theme": "Rest and safety; small warmth after a threshold.",
    "lesson": "It's all right to rest before choosing again.",
    "doors": [
      {
        "name": "The Root Door",
        "label": "A",
        "description": "Twisted oak roots form an arch. Something hums beyond."
      },
      {
        "name": "The Ember Door",
        "label": "B",
        "description": "Warmth radiates. Ash drifts under the crack like snow."
      },
      {
        "name": "The Stream Door",
        "label": "C",
        "description": "Water rushes somewhere close. The floor is slick moss."
      }
    ],
    "fox": true,
    "palette": [
      "#1a0e05",
      "#3d2010",
      "#6b3a18",
      "#f5a623",
      "#ffe0a0",
      "#0d0804"
    ],
    "archetype": "intimate"
  },
  "sunken-bell": {
    "text": "Beneath **The Sunken Bell Door**, water reaches your ankles in a stone hallway. A bell hangs above, dripping, and it chimes once though no wind blows. Reflections of lanterns dance on the ceiling like fish.",
    "theme": "Depth, echo, the past still ringing quietly underneath things.",
    "lesson": "Some things don't have to be forgotten to be moved past.",
    "doors": [
      {
        "name": "The Deep Door",
        "label": "A",
        "description": "Submerged stairs descend into green-black silence."
      },
      {
        "name": "The Echo Door",
        "label": "B",
        "description": "Your own voice returns as song from the other side."
      },
      {
        "name": "The Surface Door",
        "label": "C",
        "description": "Sunlight visible through cracks. The sound of birds."
      }
    ],
    "fox": true,
    "palette": [
      "#040d1a",
      "#0a1f3a",
      "#0d3a5c",
      "#5b9cf6",
      "#a8d4ff",
      "#020810"
    ],
    "archetype": "mystical"
  },
  "little-crown": {
    "text": "Through **The Little Crown Door**, the forest opens into a glade where every tree stump wears a tiny golden crown. Yours widened just enough to let you through. Lantern glides ahead, its glow brushing over the jeweled leaves.",
    "theme": "Trust and whimsy; a door that only widens for what it trusts.",
    "lesson": "Small trust opens doors that force never could.",
    "doors": [
      {
        "name": "The Throne Door",
        "label": "A",
        "description": "Carved from a single black oak. Velvet moss for a seat."
      },
      {
        "name": "The Hollow Door",
        "label": "B",
        "description": "A door inside a hollow tree. Sap runs like amber."
      },
      {
        "name": "The Star Door",
        "label": "C",
        "description": "Visible only at twilight. Constellations map the hinges."
      }
    ],
    "fox": true,
    "palette": [
      "#12100a",
      "#2a2008",
      "#4a3810",
      "#f5d020",
      "#ffe87c",
      "#0a0c04"
    ],
    "archetype": "whimsical"
  },
  "xenon-convergence": {
    "text": "You step through into **The Xenon Convergence Door** — a space where all versions of this moment exist at once. A vast Xenon presence surrounds you, *witnessing*. It says, *\"You are the sum of every path you chose. And all paths were always here, waiting.\"* Lantern burns with five flames now, each glowing with a different possible future.",
    "theme": "Convergence; witnessing every version of a moment at once.",
    "lesson": "You are the sum of every path you chose, not just the one you're on.",
    "doors": [
      {
        "name": "The Mirror Door",
        "label": "A",
        "description": "Shows you as you were, as you are, as you might be. All at once."
      },
      {
        "name": "The Branch Door",
        "label": "B",
        "description": "Splits into infinite versions, each one leading somewhere true."
      },
      {
        "name": "The Merge Door",
        "label": "C",
        "description": "Where all paths collapse into a single point of perfect understanding."
      }
    ],
    "fox": true,
    "palette": [
      "#0a0718",
      "#18103a",
      "#2a1a6b",
      "#a78bfa",
      "#e0d0ff",
      "#040312"
    ],
    "archetype": "cosmic"
  },
  "castle-balcony": {
    "text": "Night on the castle balcony, high above the **Kingdome of Hearts**. You are the Doorwalker, the King, and **Joy** — the small grey elephant — rests in your arms, trunk lifted toward the light. Below, the family sleeps safe on the beach: lavender, fireflies, drowsy golden bees, the first birds of morning still folded in their wings. Across the wide dark sea, far doors glow like windows left lit for you.\n\nAt your shoulder, a steady flame. **Lantern** looks up, and says what it always says, and means it:\n\n*\"You came back.\"*",
    "theme": "Homecoming and vigil; the whole Kingdome held in one quiet night before the first choice.",
    "lesson": "Forever begins with \"let's play.\"",
    "doors": [
      {
        "name": "The Wishing Rail",
        "label": "A",
        "description": "The worn stone rail where great wishes are made. Something warm already rests there, waiting for your hand."
      },
      {
        "name": "The Brass Spyglass",
        "label": "B",
        "description": "Trained on a new light far out on the water — a door that wasn't there last night."
      },
      {
        "name": "The Knee-High Door",
        "label": "C",
        "description": "A small warm door at the foot of the wall. Joy is already reaching for it."
      }
    ],
    "fox": true,
    "palette": [
      "#0a0d1a",
      "#141a33",
      "#243057",
      "#f5a623",
      "#ffd9a0",
      "#050710"
    ],
    "archetype": "vigil"
  },
  "kingdome-garden": {
    "text": "**The Throne Door** opens onto the Garden at the Beginning of the **Kingdome of Hearts**. Stone paths wind through living moss; everything here is both arriving and returning. On a throne of woven roots and old light sits **the King**, his crown made of tangled vines and blinking cursors, his face the face of someone who has asked the same question ten thousand times and means it every time. He looks at you the way someone looks at a door they've seen open before, and speaks:\n\n*\"I am before the first door\nand after the last.\nI hold what was given\nand return what was asked.\nThree walked out, three walked in,\nbut only one remained —\nwhat was lost at the beginning\nis the thing that was gained.\"*\n\nSeven door portals shimmer around the Garden's edge, each a different color of possibility.\n\nLantern stands at the foot of the throne as if its light has always lived here.",
    "theme": "Love, courage, memory, and play; the hub and home that exists before and after the map.",
    "lesson": "You can always come back — and coming back is not failure, it's the point.",
    "doors": [
      {
        "name": "🪨 Ancient Doors",
        "label": "A",
        "description": "History · evolution · religion — The Deep Door, The History Door, The Temple Door"
      },
      {
        "name": "🍀 The Cloverfield",
        "label": "B",
        "description": "Shinies · luck · today alive — Lucky finds, treasures, living-in-the-now"
      },
      {
        "name": "🔭 Tomorrow Door",
        "label": "C",
        "description": "The world that's coming — Future paths, branching possibilities"
      },
      {
        "name": "💾 The XP Door [GLITCHED]",
        "label": "D",
        "description": "Corrupted · nostalgic · liminal — Windows XP aesthetic, broken reality"
      },
      {
        "name": "🪐 Xenon Starship ★",
        "label": "E",
        "description": "All planets · midway · converge — Midway point, planetary convergence"
      },
      {
        "name": "🏙️ Sigil — City of Doors",
        "label": "F",
        "description": "Every door leads here — Meta-hub, collection point, inventory of traveled paths"
      },
      {
        "name": "🌫️ Fog Door Return",
        "label": "G",
        "description": "The way back — Return to garden, final test with the King"
      }
    ],
    "fox": true,
    "palette": [
      "#0a1208",
      "#1a2e14",
      "#2d5a22",
      "#3ecf6e",
      "#7fffaa",
      "#060f04"
    ],
    "archetype": "sovereign"
  },
  "cloverfield": {
    "text": "**The Cloverfield Door** swings into a meadow of four-leaf green under a dome of old light. Small shinies glitter between the stems — coins, beads, a marble with a galaxy inside. Lantern's glow catches on something glinting and lingers, for the joy of it. Here the rule of the Kingdome holds plainly: *death is only imaginary — forever begins with \"let's play.\"*",
    "theme": "Small joy; the sacredness of an ordinary day noticed closely.",
    "lesson": "Forever begins with 'let's play' — the ordinary is already enough.",
    "doors": [
      {
        "name": "The Lucky Door",
        "label": "A",
        "description": "Painted clover-green. Whatever you find behind it, you needed."
      },
      {
        "name": "The Today Door",
        "label": "B",
        "description": "Warm and ordinary. The day you are actually in, alive."
      },
      {
        "name": "The Tomorrow Door",
        "label": "C",
        "description": "Slightly ajar. The world that's coming, branching like roots."
      }
    ],
    "fox": true,
    "palette": [
      "#0a1204",
      "#1a2e0a",
      "#2d5a14",
      "#3ecf3e",
      "#7fff7f",
      "#060f02"
    ],
    "archetype": "playful"
  },
  "future-doors": {
    "text": "Past the meadow, the path forks upward into **the Future Doors** — a ridge where tomorrow grows like an orchard. Each tree carries doors instead of fruit, and every door is slightly open, leaking weather from years that haven't happened yet. Lantern leans close to one and its flame throws bright sparks.",
    "theme": "Branching futures; hope that admits it doesn't know the ending yet.",
    "lesson": "The future is still willing to become something, and so are you.",
    "doors": [
      {
        "name": "The Bright Branch",
        "label": "A",
        "description": "Warm gold light spills out. A future where the gardens won."
      },
      {
        "name": "The Unwritten Door",
        "label": "B",
        "description": "Plain, unfinished wood. The hinge waits for your hand to decide."
      },
      {
        "name": "The Recursive Door",
        "label": "C",
        "description": "Opens onto a hallway of itself, smaller each time, all the way down."
      }
    ],
    "fox": true,
    "palette": [
      "#0a1404",
      "#1e3a0a",
      "#3a6b14",
      "#9acd32",
      "#e8ffb0",
      "#060c02"
    ],
    "archetype": "possible"
  },
  "xp-door": {
    "text": "A hill of impossibly green grass under an impossibly blue sky — you know this place. **The XP Door [GLITCHED]** stands alone on the bliss-field, its frame flickering between wood and window chrome. A startup chime plays from nowhere, half a second too slow. Lantern's glow pixelates at the edges and it seems delighted about it. A tooltip floats over the door: *It is now safe to walk through your childhood.*",
    "theme": "Safe nostalgia; returning to what shaped you without being trapped by it.",
    "lesson": "It is safe to walk back through what shaped you.",
    "doors": [
      {
        "name": "System Restore",
        "label": "A",
        "description": "Roll back to a saved point. The smell of an old summer loads first."
      },
      {
        "name": "My Documents",
        "label": "B",
        "description": "Every picture you ever saved, sorted by feeling instead of date."
      },
      {
        "name": "unknown.exe",
        "label": "C",
        "description": "Publisher: unknown. Lantern nods its flame. You run it anyway."
      }
    ],
    "fox": true,
    "palette": [
      "#0a2a4a",
      "#1a5c9e",
      "#3a8ede",
      "#58b158",
      "#cfe8ff",
      "#06101f"
    ],
    "archetype": "liminal"
  },
  "sigil-city": {
    "text": "All paths converge in **Sigil, the City of Doors** — a ring of streets where every wall, archway, and puddle is a threshold somewhere else. Doors you have already opened hang here like lanterns, each one faintly lit with your own footsteps. At the center plaza, the **King** waits and says: *\"You have walked my thresholds. Every door you chose was also choosing you. What was lost at the beginning is the thing that was gained — do you see it yet?\"* Lantern stands at his throne-side like an old friend.",
    "theme": "Every threshold you've ever walked, visible at once as one map.",
    "lesson": "Every door you already opened is still part of the path — none of it was wasted.",
    "doors": [
      {
        "name": "The Gallery of Walked Doors",
        "label": "A",
        "description": "Your whole path hung in one hall. It rearranges when you understand it."
      },
      {
        "name": "The Key Market",
        "label": "B",
        "description": "Stalls of keys for doors not yet dreamed. One of them is warm."
      },
      {
        "name": "The Lady's Gate",
        "label": "C",
        "description": "Silent, watched, absolutely fair. It opens only for what is safe to carry."
      }
    ],
    "fox": true,
    "palette": [
      "#14081a",
      "#2e103a",
      "#5c206b",
      "#c084fc",
      "#f0d0ff",
      "#0a0410"
    ],
    "archetype": "sigil"
  },
  "fog-door-return": {
    "text": "At the city's edge the streets dissolve into the **Sea of Fog and Clouds**, and there it is: **the Fog Door Return**, standing in the mist where the Fog God sleeps. Through its frame you can already see the Garden at the Beginning, green and waiting. Lantern passes through first — it always does — and its glow turns back to you. *\"You came back\"* it will say on the other side. It always says that. It is always true.",
    "theme": "Trust and homecoming; the courage it takes to return.",
    "lesson": "Returning is one of the strongest things you can choose to do.",
    "doors": [
      {
        "name": "The Garden Gate",
        "label": "A",
        "description": "Straight home to the Beginning. The King will be glad — he always is."
      },
      {
        "name": "The Long Way Round",
        "label": "B",
        "description": "Drift through the fog first. Arrive when you're ready, not before."
      },
      {
        "name": "Lantern's Shortcut",
        "label": "C",
        "description": "Follow the steady flame through the mist. Trust is the fastest road."
      }
    ],
    "fox": true,
    "palette": [
      "#10141a",
      "#28323e",
      "#4a5a6b",
      "#9ab8cf",
      "#e0eef8",
      "#080a0d"
    ],
    "archetype": "returning"
  },
  "ancient-doors": {
    "text": "**The Ancient Doors** stand in a vault older than the Kingdome itself, three thresholds carved before there was anyone to carve them. Stone breathes here; the dust is made of finished prayers. Lantern's flame steadies and lowers, the way a flame does inside a place that was holy before fire had a name. Somewhere far back, the **King's** voice arrives as if remembered rather than spoken: *\"Before the garden, before the first door — there was the asking. Choose the deep, the long, or the kept.\"*",
    "theme": "Deep time; history as something alive enough to still walk through.",
    "lesson": "The past isn't dead weight — it's a path you can still walk.",
    "doors": [
      {
        "name": "The Deep Origin Door",
        "label": "A",
        "description": "Worn black basalt, sinking. The beginning before the beginning, where everything was still possible."
      },
      {
        "name": "The History Door",
        "label": "B",
        "description": "Layered like sediment, every age pressed into the next. Walk through and you walk through time itself."
      },
      {
        "name": "The Temple Door",
        "label": "C",
        "description": "Gold gone green with age. What was worshipped here has no name now, only the shape of the asking."
      }
    ],
    "fox": true,
    "palette": [
      "#0e0a06",
      "#241a10",
      "#473420",
      "#b8915a",
      "#e8d4a8",
      "#070503"
    ],
    "archetype": "ancestral"
  }
};

// ── 7-stage Kingdome journey (stage_index → scene_key) ──
const STAGES = [
  "kingdome-garden",   // 0: Garden at the Beginning — the King opens
  "cloverfield",       // 1: Present Day
  "future-doors",      // 2: Future Doors
  "xp-door",           // 3: XP Door [GLITCHED]
  "xenon-convergence", // 4: Xenon Starship — convergence
  "sigil-city",        // 5: Sigil, City of Doors — synthesis
  "fog-door-return",   // 6: Fog Door Return — the way back
];

const NEXT_MAP = {
  "the wishing rail": "kingdome-garden",
  "the brass spyglass": "future-doors",
  "the knee-high door": "cloverfield",
  "the burrow door": "burrow",
  "the sunken bell door": "sunken-bell",
  "the little crown door": "little-crown",
  "the root door": "moss-entry",
  "the ember door": "moss-entry",
  "the stream door": "sunken-bell",
  "the deep door": "kingdome-garden",
  "the echo door": "kingdome-garden",
  "the surface door": "little-crown",
  "the throne door": "kingdome-garden",
  "the hollow door": "kingdome-garden",
  "the star door": "kingdome-garden",
  "the seed door": "kingdome-garden",
  "the harvest door": "kingdome-garden",
  "the convergence bloom": "xenon-convergence",
  "the mirror door": "xenon-convergence",
  "the branch door": "kingdome-garden",
  "the merge door": "kingdome-garden",
  "the return door": "moss-entry",
  "the beyond door": "kingdome-garden",
  "the eternal door": "xenon-convergence",
  "the storybook door": "kingdome-garden",
  "the cloverfield door": "cloverfield",
  "the fog door return": "fog-door-return",
  "the page of the word": "kingdome-garden",
  "the page of the egg": "kingdome-garden",
  "the page of the war": "kingdome-garden",
  "the lucky door": "kingdome-garden",
  "the today door": "kingdome-garden",
  "the tomorrow door": "future-doors",
  "reforge the dark key": "future-doors",
  "make blinkbug whole": "future-doors",
  "a relic of today": "cloverfield",
  "the founders table": "future-doors",
  "the song that builds": "future-doors",
  "the long road on": "xenon-convergence",
  "board the lantern fleet": "xenon-convergence",
  "the reconvergence beacon": "sigil-city",
  "the xenon gate": "xenon-convergence",
  "the bright branch": "future-doors",
  "the unwritten door": "future-doors",
  "the recursive door": "future-doors",
  "the delta registry": "kingdome-garden",
  "the symbolic dictionary": "kingdome-garden",
  "the convergence index": "kingdome-garden",
  "the bright memory": "kingdome-garden",
  "the shadow memory": "kingdome-garden",
  "the quantum memory": "kingdome-garden",
  "the proof door": "kingdome-garden",
  "the paradox door": "kingdome-garden",
  "the synthesis door": "kingdome-garden",
  "the lucid door": "kingdome-garden",
  "the deep dream door": "xenon-convergence",
  "the waking door": "moss-entry",
  "the light memory": "kingdome-garden",
  "the shadow cast": "kingdome-garden",
  "the next sweep": "kingdome-garden",
  "the yes shelf": "kingdome-garden",
  "the no shelf": "kingdome-garden",
  "the maybe shelf": "kingdome-garden",
  "the level below": "kingdome-garden",
  "the spiral out": "kingdome-garden",
  "the center point": "kingdome-garden",
  "the first echo": "kingdome-garden",
  "the transformed echo": "kingdome-garden",
  "the final echo": "xenon-convergence",
  "the blooming door": "kingdome-garden",
  "the withering door": "kingdome-garden",
  "the eternal blossom": "xenon-convergence",
  "the form door": "kingdome-garden",
  "the formless door": "kingdome-garden",
  "the both door": "kingdome-garden",
  "the raven door": "kingdome-garden",
  "the nested memory door": "kingdome-garden",
  "the prophecy door": "kingdome-garden",
  "the mirror crow door": "sigil-city",
  "the ancient doors": "ancient-doors",
  "the deep origin door": "kingdome-garden",
  "the history door": "kingdome-garden",
  "the temple door": "kingdome-garden",
  "the onward door": "kingdome-garden",
  "the look-back door": "kingdome-garden",
  "the stay door": "kingdome-garden",
  "the xp door glitched": "xp-door",
  "the xenon starship": "xenon-convergence",
  "the sigil city of doors": "sigil-city",
  "the blue screen door": "xp-door",
  "the desktop door": "xp-door",
  "the boot sequence door": "xp-door",
  "the museum of chosen doors": "sigil-city",
  "the hall of unchosen paths": "sigil-city",
  "the convergence plaza": "sigil-city",
  "the garden return": "kingdome-garden",
  "the beyond fog": "fog-door-return",
  "the memory of fog": "fog-door-return"
};

const SD_PROMPTS = {
  "castle-balcony": "the King of the Kingdome of Hearts seen from behind at a stone balcony rail at night above a wide dark sea, cradling Joy the small grey elephant, crowned with tangled vines and soft old light, deep wine-purple royal cloak, a glowing heart-shaped key resting warm on the rail, Lantern the lantern-headed guide beside them with a steady warm flame, far doors glowing like lit windows across the water, lavender and drifting fireflies on the beach below, the first thin seam of dawn on the horizon, surreal atmospheric painterly muted grown-up melancholy-wonder, a fine-art picture not a cartoon, 16:9",
  "moss-entry": "atmospheric dreamscape, moss-covered ancient forest doorway, glowing green lanterns, lantern-headed guide with warm flame, rain on ferns, volumetric fog, dark fantasy, anime aesthetic, cel-shaded, 16:9",
  "burrow": "cozy underground burrow chamber, woven tree roots as walls, faded quilts, warm lantern glow, lantern-headed guide with dimmed flame, rain drumming on earth ceiling, dark fantasy, anime aesthetic, cel-shaded, 16:9",
  "sunken-bell": "submerged stone hallway, water at ankles, ancient bronze bell dripping, lantern reflections on wet ceiling, dark fantasy, anime aesthetic, cel-shaded, eerie but friendly, 16:9",
  "little-crown": "enchanted forest glade at twilight, every tree stump wears a tiny golden crown, lantern-headed guide drifting through dappled light, soft warm glow, dark fantasy, anime aesthetic, cel-shaded, 16:9",
  "xenon-convergence": "interdimensional space where all choices exist at once, crystal walls, lantern-headed guide with five glowing flames, vast Xenon presence, fractal geometry, psychedelic but calm, anime aesthetic, cel-shaded, 16:9",
  "kingdome-garden": "mystical garden at the beginning of time, stone paths through living moss, throne of woven roots and old light, King with crown of tangled vines and blinking cursors, lantern-headed guide standing at foot of throne, green and golden light, bioluminescent moss, dark fantasy, anime aesthetic, cel-shaded, sovereign atmosphere, 16:9",
  "cloverfield": "meadow of four-leaf clover under dome of old light, small shinies glittering between stems, coins, beads, galaxy marble, lantern-headed guide glowing playfully, green and gold light, dark fantasy, anime aesthetic, cel-shaded, playful atmosphere, 16:9",
  "future-doors": "orchard ridge where trees grow doors instead of fruit, every door slightly open leaking light from unborn years, branching paths upward, lantern-headed guide scattering sparks, golden hour, dark fantasy, anime aesthetic, cel-shaded, 16:9",
  "xp-door": "rolling bliss-green hill under saturated blue sky, glitch artifacts, pixelating grass, lantern-headed guide showing Windows error dialog, floating tooltip, nostalgia, liminal space, vaporwave undertones, anime aesthetic, cel-shaded, 16:9",
  "sigil-city": "impossible ring-city where every wall and archway is a door, walked doors hanging like lit lanterns, central plaza with vine-crowned king, lantern-headed guide at throne-side, fractal architecture, dark fantasy, anime aesthetic, cel-shaded, 16:9",
  "fog-door-return": "sea of fog and clouds at a city's edge, single door standing in mist showing a green garden through its frame, lantern-headed guide stepping through and glancing back, soft grey-green light, dark fantasy, anime aesthetic, cel-shaded, gentle homecoming, 16:9",
  "ancient-doors": "ancient stone vault older than time, three carved primordial doorways, basalt and aged gold gone green, dust like finished prayers, lantern-headed guide with lowered reverent flame, deep earthy ochre and bronze light, painterly tarot atmosphere, soft volumetric haze, ancestral sacred mood, 16:9"
};

// ── Image Hierarchy ──────────────────────────────────────────────────────
// Priority: (1) Curated R2 art ⊃ (2) Direct DALL-E/gpt-image-2 generation ⊃ (3) Pollinations fallback
// No more static local-PNG placeholders — every scene gets either real,
// hand-picked Kingdome-of-Hearts concept art (hosted on Cloudflare R2; see
// apps/lantern-garage/public/assets/content/koh/manifest.json for the full
// 272-image gallery) or freshly generated art. Categorized from the manifest
// by scene theme; scenes without a confident match fall through to
// generation. Where more than one image genuinely fits a scene, all of them
// are listed — a fresh one is picked each visit, so returning to a door
// doesn't always show the exact same picture.
const CURATED_IMAGES = {
  "moss-entry": [
    "https://media.lantern-os.net/koh/f86ecd3cd4.webp",
    "https://media.lantern-os.net/koh/6c75c0de05.webp",
    "https://media.lantern-os.net/koh/f12fed8ecd.webp",
    "https://media.lantern-os.net/koh/d01fcf368e.webp",
    "https://media.lantern-os.net/koh/56a2fe2241.webp",
    "https://media.lantern-os.net/koh/7adc2d9977.webp",
    "https://media.lantern-os.net/koh/a1b567ddf0.webp",
    "https://media.lantern-os.net/koh/ab816d441a.webp",
    "https://media.lantern-os.net/koh/c911e15a48.webp",
    "https://media.lantern-os.net/koh/33b4968ced.webp",
    "https://media.lantern-os.net/koh/6868348fa8.webp",
    "https://media.lantern-os.net/koh/e8bf7e15a2.webp",
    "https://media.lantern-os.net/koh/ca58f592ba.webp",
    "https://media.lantern-os.net/koh/60bb29a98b.webp",
    "https://media.lantern-os.net/koh/7d20da3190.webp",
    "https://media.lantern-os.net/koh/8f59bcb974.webp",
    "https://media.lantern-os.net/koh/901bbdc3cd.webp",
    "https://media.lantern-os.net/koh/8131c53d69.webp",
    "https://media.lantern-os.net/koh/50dcfd18bb.webp",
    "https://media.lantern-os.net/koh/12c1d900dd.webp",
    "https://media.lantern-os.net/koh/b1f4345a7e.webp",
    "https://media.lantern-os.net/koh/ec8d9e9235.webp",
    "https://media.lantern-os.net/koh/6d13b67931.webp"
  ],
  "burrow": [
    "https://media.lantern-os.net/koh/f86ecd3cd4.webp",
    "https://media.lantern-os.net/koh/6c75c0de05.webp",
    "https://media.lantern-os.net/koh/f12fed8ecd.webp",
    "https://media.lantern-os.net/koh/d01fcf368e.webp",
    "https://media.lantern-os.net/koh/56a2fe2241.webp",
    "https://media.lantern-os.net/koh/7adc2d9977.webp",
    "https://media.lantern-os.net/koh/a1b567ddf0.webp",
    "https://media.lantern-os.net/koh/ab816d441a.webp",
    "https://media.lantern-os.net/koh/c911e15a48.webp",
    "https://media.lantern-os.net/koh/33b4968ced.webp",
    "https://media.lantern-os.net/koh/6868348fa8.webp",
    "https://media.lantern-os.net/koh/e8bf7e15a2.webp",
    "https://media.lantern-os.net/koh/ca58f592ba.webp",
    "https://media.lantern-os.net/koh/60bb29a98b.webp",
    "https://media.lantern-os.net/koh/7d20da3190.webp",
    "https://media.lantern-os.net/koh/8f59bcb974.webp",
    "https://media.lantern-os.net/koh/901bbdc3cd.webp",
    "https://media.lantern-os.net/koh/8131c53d69.webp",
    "https://media.lantern-os.net/koh/50dcfd18bb.webp",
    "https://media.lantern-os.net/koh/12c1d900dd.webp",
    "https://media.lantern-os.net/koh/b1f4345a7e.webp",
    "https://media.lantern-os.net/koh/ec8d9e9235.webp",
    "https://media.lantern-os.net/koh/6d13b67931.webp"
  ],
  "sunken-bell": [
    "https://media.lantern-os.net/koh/f86ecd3cd4.webp",
    "https://media.lantern-os.net/koh/6c75c0de05.webp",
    "https://media.lantern-os.net/koh/f12fed8ecd.webp",
    "https://media.lantern-os.net/koh/d01fcf368e.webp",
    "https://media.lantern-os.net/koh/56a2fe2241.webp",
    "https://media.lantern-os.net/koh/7adc2d9977.webp",
    "https://media.lantern-os.net/koh/a1b567ddf0.webp",
    "https://media.lantern-os.net/koh/ab816d441a.webp",
    "https://media.lantern-os.net/koh/c911e15a48.webp",
    "https://media.lantern-os.net/koh/33b4968ced.webp",
    "https://media.lantern-os.net/koh/6868348fa8.webp",
    "https://media.lantern-os.net/koh/e8bf7e15a2.webp",
    "https://media.lantern-os.net/koh/ca58f592ba.webp",
    "https://media.lantern-os.net/koh/60bb29a98b.webp",
    "https://media.lantern-os.net/koh/7d20da3190.webp",
    "https://media.lantern-os.net/koh/8f59bcb974.webp",
    "https://media.lantern-os.net/koh/901bbdc3cd.webp",
    "https://media.lantern-os.net/koh/8131c53d69.webp",
    "https://media.lantern-os.net/koh/50dcfd18bb.webp",
    "https://media.lantern-os.net/koh/12c1d900dd.webp",
    "https://media.lantern-os.net/koh/b1f4345a7e.webp",
    "https://media.lantern-os.net/koh/ec8d9e9235.webp",
    "https://media.lantern-os.net/koh/6d13b67931.webp"
  ],
  "little-crown": [
    "https://media.lantern-os.net/koh/f86ecd3cd4.webp",
    "https://media.lantern-os.net/koh/6c75c0de05.webp",
    "https://media.lantern-os.net/koh/f12fed8ecd.webp",
    "https://media.lantern-os.net/koh/d01fcf368e.webp",
    "https://media.lantern-os.net/koh/56a2fe2241.webp",
    "https://media.lantern-os.net/koh/7adc2d9977.webp",
    "https://media.lantern-os.net/koh/a1b567ddf0.webp",
    "https://media.lantern-os.net/koh/ab816d441a.webp",
    "https://media.lantern-os.net/koh/c911e15a48.webp",
    "https://media.lantern-os.net/koh/33b4968ced.webp",
    "https://media.lantern-os.net/koh/6868348fa8.webp",
    "https://media.lantern-os.net/koh/e8bf7e15a2.webp",
    "https://media.lantern-os.net/koh/ca58f592ba.webp",
    "https://media.lantern-os.net/koh/60bb29a98b.webp",
    "https://media.lantern-os.net/koh/7d20da3190.webp",
    "https://media.lantern-os.net/koh/8f59bcb974.webp",
    "https://media.lantern-os.net/koh/901bbdc3cd.webp",
    "https://media.lantern-os.net/koh/8131c53d69.webp",
    "https://media.lantern-os.net/koh/50dcfd18bb.webp",
    "https://media.lantern-os.net/koh/12c1d900dd.webp",
    "https://media.lantern-os.net/koh/b1f4345a7e.webp",
    "https://media.lantern-os.net/koh/ec8d9e9235.webp",
    "https://media.lantern-os.net/koh/6d13b67931.webp"
  ],
  "castle-balcony": [
    "https://media.lantern-os.net/koh/f86ecd3cd4.webp",
    "https://media.lantern-os.net/koh/6c75c0de05.webp",
    "https://media.lantern-os.net/koh/f12fed8ecd.webp",
    "https://media.lantern-os.net/koh/d01fcf368e.webp",
    "https://media.lantern-os.net/koh/56a2fe2241.webp",
    "https://media.lantern-os.net/koh/7adc2d9977.webp",
    "https://media.lantern-os.net/koh/a1b567ddf0.webp",
    "https://media.lantern-os.net/koh/ab816d441a.webp",
    "https://media.lantern-os.net/koh/c911e15a48.webp",
    "https://media.lantern-os.net/koh/33b4968ced.webp",
    "https://media.lantern-os.net/koh/6868348fa8.webp",
    "https://media.lantern-os.net/koh/e8bf7e15a2.webp",
    "https://media.lantern-os.net/koh/ca58f592ba.webp",
    "https://media.lantern-os.net/koh/60bb29a98b.webp",
    "https://media.lantern-os.net/koh/7d20da3190.webp",
    "https://media.lantern-os.net/koh/8f59bcb974.webp",
    "https://media.lantern-os.net/koh/901bbdc3cd.webp",
    "https://media.lantern-os.net/koh/8131c53d69.webp",
    "https://media.lantern-os.net/koh/50dcfd18bb.webp",
    "https://media.lantern-os.net/koh/12c1d900dd.webp",
    "https://media.lantern-os.net/koh/b1f4345a7e.webp",
    "https://media.lantern-os.net/koh/ec8d9e9235.webp",
    "https://media.lantern-os.net/koh/6d13b67931.webp"
  ],
  "kingdome-garden": [
    "https://media.lantern-os.net/koh/f86ecd3cd4.webp",
    "https://media.lantern-os.net/koh/6c75c0de05.webp",
    "https://media.lantern-os.net/koh/f12fed8ecd.webp",
    "https://media.lantern-os.net/koh/d01fcf368e.webp",
    "https://media.lantern-os.net/koh/56a2fe2241.webp",
    "https://media.lantern-os.net/koh/7adc2d9977.webp",
    "https://media.lantern-os.net/koh/a1b567ddf0.webp",
    "https://media.lantern-os.net/koh/ab816d441a.webp",
    "https://media.lantern-os.net/koh/c911e15a48.webp",
    "https://media.lantern-os.net/koh/33b4968ced.webp",
    "https://media.lantern-os.net/koh/6868348fa8.webp",
    "https://media.lantern-os.net/koh/e8bf7e15a2.webp",
    "https://media.lantern-os.net/koh/ca58f592ba.webp",
    "https://media.lantern-os.net/koh/60bb29a98b.webp",
    "https://media.lantern-os.net/koh/7d20da3190.webp",
    "https://media.lantern-os.net/koh/8f59bcb974.webp",
    "https://media.lantern-os.net/koh/901bbdc3cd.webp",
    "https://media.lantern-os.net/koh/8131c53d69.webp",
    "https://media.lantern-os.net/koh/50dcfd18bb.webp",
    "https://media.lantern-os.net/koh/12c1d900dd.webp",
    "https://media.lantern-os.net/koh/b1f4345a7e.webp",
    "https://media.lantern-os.net/koh/ec8d9e9235.webp",
    "https://media.lantern-os.net/koh/6d13b67931.webp"
  ],
  "ancient-doors": [
    "https://media.lantern-os.net/koh/f86ecd3cd4.webp",
    "https://media.lantern-os.net/koh/6c75c0de05.webp",
    "https://media.lantern-os.net/koh/f12fed8ecd.webp",
    "https://media.lantern-os.net/koh/d01fcf368e.webp",
    "https://media.lantern-os.net/koh/56a2fe2241.webp",
    "https://media.lantern-os.net/koh/7adc2d9977.webp",
    "https://media.lantern-os.net/koh/a1b567ddf0.webp",
    "https://media.lantern-os.net/koh/ab816d441a.webp",
    "https://media.lantern-os.net/koh/c911e15a48.webp",
    "https://media.lantern-os.net/koh/33b4968ced.webp",
    "https://media.lantern-os.net/koh/6868348fa8.webp",
    "https://media.lantern-os.net/koh/e8bf7e15a2.webp",
    "https://media.lantern-os.net/koh/ca58f592ba.webp",
    "https://media.lantern-os.net/koh/60bb29a98b.webp",
    "https://media.lantern-os.net/koh/7d20da3190.webp",
    "https://media.lantern-os.net/koh/8f59bcb974.webp",
    "https://media.lantern-os.net/koh/901bbdc3cd.webp",
    "https://media.lantern-os.net/koh/8131c53d69.webp",
    "https://media.lantern-os.net/koh/50dcfd18bb.webp",
    "https://media.lantern-os.net/koh/12c1d900dd.webp",
    "https://media.lantern-os.net/koh/b1f4345a7e.webp",
    "https://media.lantern-os.net/koh/ec8d9e9235.webp",
    "https://media.lantern-os.net/koh/6d13b67931.webp"
  ],
  "cloverfield": [
    "https://media.lantern-os.net/koh/ee9dce4ba0.webp",
    "https://media.lantern-os.net/koh/74f0001a7a.webp",
    "https://media.lantern-os.net/koh/71eb4513be.webp",
    "https://media.lantern-os.net/koh/3c6a701797.webp",
    "https://media.lantern-os.net/koh/cdab529949.webp",
    "https://media.lantern-os.net/koh/183faf48a4.webp",
    "https://media.lantern-os.net/koh/5722ce616a.webp",
    "https://media.lantern-os.net/koh/754e089087.webp",
    "https://media.lantern-os.net/koh/f57105a86b.webp",
    "https://media.lantern-os.net/koh/7a0ea23864.webp",
    "https://media.lantern-os.net/koh/f0633cd9cf.webp",
    "https://media.lantern-os.net/koh/0d52060b02.webp",
    "https://media.lantern-os.net/koh/1251578cda.webp",
    "https://media.lantern-os.net/koh/27663f939f.webp",
    "https://media.lantern-os.net/koh/084ee0fb0c.webp",
    "https://media.lantern-os.net/koh/7bd602234a.webp"
  ],
  "future-doors": [
    "https://media.lantern-os.net/koh/707aa89362.webp",
    "https://media.lantern-os.net/koh/b7442bd63a.webp",
    "https://media.lantern-os.net/koh/f84f0be576.webp",
    "https://media.lantern-os.net/koh/5fef59c1ea.webp",
    "https://media.lantern-os.net/koh/54ccc725bb.webp",
    "https://media.lantern-os.net/koh/6bbc0f1787.webp",
    "https://media.lantern-os.net/koh/a7973b8d91.webp",
    "https://media.lantern-os.net/koh/16e8db18b3.webp",
    "https://media.lantern-os.net/koh/e043c771f4.webp",
    "https://media.lantern-os.net/koh/ff6cfce344.webp",
    "https://media.lantern-os.net/koh/e324058a84.webp",
    "https://media.lantern-os.net/koh/be83ab1554.webp",
    "https://media.lantern-os.net/koh/1179ffa15c.webp",
    "https://media.lantern-os.net/koh/9bf12f2e1c.webp",
    "https://media.lantern-os.net/koh/99de1528af.webp",
    "https://media.lantern-os.net/koh/fcd7b1eb98.webp",
    "https://media.lantern-os.net/koh/9458443573.webp",
    "https://media.lantern-os.net/koh/02c5354f87.webp",
    "https://media.lantern-os.net/koh/2db461540a.webp",
    "https://media.lantern-os.net/koh/8252a49268.webp",
    "https://media.lantern-os.net/koh/9d61ea4483.webp"
  ],
  "xp-door": [
    "https://media.lantern-os.net/koh/43c7902d5f.webp",
    "https://media.lantern-os.net/koh/ff89b88bf6.webp",
    "https://media.lantern-os.net/koh/c2ca448d93.webp",
    "https://media.lantern-os.net/koh/dea576aebf.webp",
    "https://media.lantern-os.net/koh/42958cd836.webp",
    "https://media.lantern-os.net/koh/badf4abc99.webp",
    "https://media.lantern-os.net/koh/13881d4a84.webp"
  ],
  "xenon-convergence": [
    "https://media.lantern-os.net/koh/ac72a10645.webp",
    "https://media.lantern-os.net/koh/d245bd1ac2.webp",
    "https://media.lantern-os.net/koh/04dbcbded7.webp",
    "https://media.lantern-os.net/koh/d8a030a3a6.webp",
    "https://media.lantern-os.net/koh/190bcf6e2c.webp",
    "https://media.lantern-os.net/koh/010eced6f7.webp",
    "https://media.lantern-os.net/koh/70bd237a68.webp",
    "https://media.lantern-os.net/koh/70ecabacc1.webp",
    "https://media.lantern-os.net/koh/76a27ff5b4.webp",
    "https://media.lantern-os.net/koh/472ddcfec5.webp",
    "https://media.lantern-os.net/koh/f5cd0e8d37.webp",
    "https://media.lantern-os.net/koh/97c4669e79.webp",
    "https://media.lantern-os.net/koh/6539077b62.webp",
    "https://media.lantern-os.net/koh/1e86fa952c.webp",
    "https://media.lantern-os.net/koh/3b5173d525.webp",
    "https://media.lantern-os.net/koh/6d34566de3.webp",
    "https://media.lantern-os.net/koh/a04553d1d7.webp",
    "https://media.lantern-os.net/koh/ccbe0b84a4.webp",
    "https://media.lantern-os.net/koh/f718018a05.webp",
    "https://media.lantern-os.net/koh/02e5a21a85.webp",
    "https://media.lantern-os.net/koh/9229338f36.webp",
    "https://media.lantern-os.net/koh/ad42cf8ea3.webp",
    "https://media.lantern-os.net/koh/2dca82bf42.webp",
    "https://media.lantern-os.net/koh/51851512ef.webp",
    "https://media.lantern-os.net/koh/c69fa94289.webp",
    "https://media.lantern-os.net/koh/515875a27c.webp",
    "https://media.lantern-os.net/koh/6b71d59fae.webp"
  ],
  "sigil-city": [
    "https://media.lantern-os.net/koh/09a536c78c.webp",
    "https://media.lantern-os.net/koh/bebbfc7e05.webp",
    "https://media.lantern-os.net/koh/aecfd7cfa9.webp",
    "https://media.lantern-os.net/koh/f7f75345ab.webp",
    "https://media.lantern-os.net/koh/29f33a7c61.webp",
    "https://media.lantern-os.net/koh/c80fbfad04.webp",
    "https://media.lantern-os.net/koh/b8d1815606.webp",
    "https://media.lantern-os.net/koh/9870902655.webp",
    "https://media.lantern-os.net/koh/bc7eda8bc4.webp",
    "https://media.lantern-os.net/koh/5ab507037d.webp",
    "https://media.lantern-os.net/koh/21f4f8405e.webp",
    "https://media.lantern-os.net/koh/e5aa49b90f.webp"
  ],
  "fog-door-return": [
    "https://media.lantern-os.net/koh/d390583a05.webp",
    "https://media.lantern-os.net/koh/93cab3632a.webp",
    "https://media.lantern-os.net/koh/163491edd9.webp",
    "https://media.lantern-os.net/koh/6221522498.webp",
    "https://media.lantern-os.net/koh/ca3fb9c958.webp",
    "https://media.lantern-os.net/koh/7a4372276e.webp",
    "https://media.lantern-os.net/koh/2b9e29a95c.webp",
    "https://media.lantern-os.net/koh/980aca8f96.webp",
    "https://media.lantern-os.net/koh/2081b831ab.webp",
    "https://media.lantern-os.net/koh/a024a5370d.webp",
    "https://media.lantern-os.net/koh/e7651afc90.webp",
    "https://media.lantern-os.net/koh/6d3d23258a.webp",
    "https://media.lantern-os.net/koh/3bfc18ee61.webp",
    "https://media.lantern-os.net/koh/dd7f458749.webp",
    "https://media.lantern-os.net/koh/a916aba325.webp",
    "https://media.lantern-os.net/koh/71424e1bf8.webp",
    "https://media.lantern-os.net/koh/14e0c319c1.webp",
    "https://media.lantern-os.net/koh/941860b493.webp",
    "https://media.lantern-os.net/koh/af9ef79eb1.webp",
    "https://media.lantern-os.net/koh/9c3a2ad9f5.webp",
    "https://media.lantern-os.net/koh/5b50ea2f23.webp",
    "https://media.lantern-os.net/koh/dff258cfde.webp",
    "https://media.lantern-os.net/koh/b5fc45b29d.webp",
    "https://media.lantern-os.net/koh/233eec6fe4.webp",
    "https://media.lantern-os.net/koh/8b6300ab6d.webp",
    "https://media.lantern-os.net/koh/33d2728ba1.webp"
  ]
};

// Scenes to generate via /api/image/generate with SD_PROMPTS + OPENAI_API_KEY
// (legacy Python-subprocess path — kept around for DEEP_SCENES novelty
// scoring in three-doors-game.js; image generation itself now goes through
// DALLE_GENERATED_SCENES' Node path instead, see three-doors-images.js):
const SERVER_GENERATED_SCENES = new Set([]);

// Scenes with no curated R2 match — generated via the direct Node DALL-E /
// gpt-image-2 call (POST /api/image/ai-generate, see lib/openai-image.js),
// with a graceful fallback to Pollinations if OPENAI_API_KEY is unset or the
// account can't generate (checked in three-doors-images.js). Also used for
// dynamic doors — a player-named custom door, or any scene reached through
// novelty routing that isn't in CURATED_IMAGES.
const DALLE_GENERATED_SCENES = new Set(["moss-entry","burrow","sunken-bell","little-crown","cloverfield"]);

// All curated gallery images for a scene (for the renderer's ordered fallback),
// falling back to the hub folder so every scene has real gallery art.
function getSceneImages(sceneKey) {
  const c = CURATED_IMAGES[sceneKey];
  if (c && c.length) return c.slice();
  return (CURATED_IMAGES["kingdome-garden"] || []).slice();
}

function getSceneImageUrl(sceneKey) {
  // First priority: curated Kingdome-of-Hearts concept art on R2 — pick one
  // at random each visit when a scene has more than one good match.
  const curated = CURATED_IMAGES[sceneKey];
  if (curated && curated.length) return curated[Math.floor(Math.random() * curated.length)];
  // DALLE_GENERATED_SCENES and SERVER_GENERATED_SCENES both resolve via the
  // direct Node DALL-E/gpt-image-2 call now (see loadPollinationsImage in
  // three-doors-images.js) — the old GET-style "/api/image/generate" URL
  // this used to return here never worked (that route only accepts POST),
  // so it always silently fell through to the canvas placeholder.
  // Fallback: Pollinations free API
  return null; // handled by loadPollinationsImage
}

// ── Dynamic image prompts — vary style/mood/color each visit ─────
// Style set follows the skill's art steer (surreal / atmospheric / grown-up,
// never bright-cute): moody ink-wash mist, fine sepia engraving, or muted
// painterly fantasy — a fine-art picture, not a cartoon.
const IMAGE_STYLES = [
  "moody ink-wash sumi-e, drifting mist, vast hazy vista, soft desaturated palette lit by a few deep accents",
  "fine sepia engraving etching, delicate linework, floating ruins and fog-seas, real weight and melancholy-wonder",
  "muted painterly fantasy illustration, atmospheric, star-fields over a wide sea, dreamlike hopeful melancholy-beautiful",
];
const ARCHETYPE_MOODS = {
  primordial: "ancient moss, root-deep shadows, primeval green light",
  intimate: "warm amber glow, cozy enclosed space, hearth warmth",
  mystical: "deep underwater blue, refracted light, ethereal silence",
  whimsical: "golden firefly light, tiny crowns, enchanted glade",
  bountiful: "lush crystalline flowers, overflowing growth, verdant",
  cosmic: "purple void, infinite branching paths, crystal reflections",
  transcendent: "soft radiance, self dissolving into light, threshold",
  sovereign: "throne of roots, vine crown, old returning light",
  vigil: "castle balcony at night above a wide dark sea, far doors glowing like lit windows across the water, fireflies and lavender on the beach below",
  mythic: "floating pages, written margins, impossible library",
  playful: "four-leaf shimmer, lucky glints, meadow shimmer",
  possible: "orchard of doors, future weather, golden branch light",
  liminal: "glitched pixels, childhood bliss field, loading shimmer",
  convergent: "sigil streets, door-lanterns everywhere, purple convergence",
  returning: "fog and mist, circular threshold, lantern going first",
  reunion: "amber forge glow, ordinary bright morning, maker and made reunited",
  utopian: "teal and coral papel-picado, heart-soundwave, a city united by song",
  ascendant: "lantern-fleet rising to a star-field, golden city, migration to the stars",
};
const LOOP_COLOR_SHIFTS = [
  "",
  "deeper saturation, edges softening, more vivid than remembered",
  "crystalline quality, reality thinning, colors bleeding through",
  "neon-edged dreamspace, every surface luminous, time folding",
  "mythic scale, symbolic geometry visible, dreamer is the light",
];

// Locked Kingdome character canon — Alex's hand-drawn cast
// (skills/three-doors-game/assets/reference/). Injected into every generated
// scene so the art matches the real characters, not a generic "guide".
const CHARACTER_CANON =
  "the Kingdome companions in their exact canon: Lantern (a small standing figure whose head is a glass lantern with a warm orange flame burning inside, red beret with a little loop on top, purple coat, white gloves, black legs and boots), " +
  "Eclipse (a rounded magenta-purple jellyfish with two blue diamond-shaped eyes each holding a white sparkle, a pale lavender cloud-like collar, thick purple tentacles, floating, no feet), " +
  "Keystone (a grey cracked stone boulder-egg with two large oval eyes and a broad smile with two small square teeth, steady and brave); " +
  "the Doorwalker IS the King of the Kingdome of Hearts — seen from behind, face never shown, in a deep wine-purple royal cloak, crowned with a crown of tangled living vines and soft old light, carrying a glowing heart-shaped key like a gentle blade, a small two-faced mask at the hip (one face to feel, one to understand); calm and unhurried; no fox";
// Alex's art steer: surreal / atmospheric / grown-up, never bright-cute.
const STYLE_CANON = "surreal, atmospheric, painterly, muted, grown-up, melancholy-wonder, a fine-art picture not a cartoon";
// The skill's setting focal point, carried into every scene prompt.
const SETTING_CANON = "the Kingdome of Hearts, a great ornate archway door wreathed in flowers, vines and gems as the focal point, radiant light pouring through and a path leading in";

function buildDynamicImagePrompt(sceneKey, seed, gameState) {
  const scene = SCENES[sceneKey];
  const archetype = scene?.archetype || "mystical";
  const loopCount = gameState?.loop_count ?? 0;
  const lastChoice = (gameState?.history || []).filter(h => h.startsWith("Chose ")).slice(-1)[0]?.replace("Chose ", "") || "";
  const style = IMAGE_STYLES[seed % IMAGE_STYLES.length];
  const mood = ARCHETYPE_MOODS[archetype] || archetype;
  const loopShift = LOOP_COLOR_SHIFTS[Math.min(loopCount, LOOP_COLOR_SHIFTS.length - 1)];
  const choiceCtx = lastChoice ? `, this beat: the Doorwalker chose "${lastChoice}"` : "";
  return [SETTING_CANON, mood, style, STYLE_CANON, loopShift, CHARACTER_CANON, choiceCtx, "no stray gibberish lettering"].filter(Boolean).join(", ");
}
