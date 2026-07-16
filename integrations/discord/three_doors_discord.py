"""Three Doors — Discord integration (snapshot).

Extracted verbatim from lantern-os src/discord_lounge_bot/bot_v2.py when the
game migrated to this repo (the bot itself stayed in lantern-os and its Three
Doors commands were removed there).

The game logic below (scenes, next-map, state IO, advance, embed) is importable
and self-contained given `discord.py`. The slash/prefix command wiring is kept
verbatim in COMMAND_WIRING_REFERENCE at the bottom — paste it into a bot that
defines `tree`, `app_commands`, `client`, and a `reply` helper.

Scene canon note: bot_v2 loaded data/three-doors/scenes.json at import time via
_load_three_doors_contract() and fell back to the built-in _THREE_DOORS_SCENES;
that loader is included, pointed at this repo's data/three-doors/scenes.json.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

import discord

REPO_ROOT = Path(__file__).resolve().parents[2]
THREE_DOORS_DATA_DIR = REPO_ROOT / "data" / "discord" / "three-doors"


def notebook_user_id(user: "discord.User | discord.Member") -> str:
    return f"discord-{user.id}"

# -- Three Doors helpers --

def three_doors_path(user_id: str) -> Path:
    safe = re.sub(r"[^a-zA-Z0-9._-]+", "-", user_id).strip("-").lower() or "discord-user"
    return THREE_DOORS_DATA_DIR / f"{safe}.json"


def load_three_doors_state(user: discord.User | discord.Member) -> dict | None:
    path = three_doors_path(notebook_user_id(user))
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text("utf-8"))
    except (json.JSONDecodeError, OSError):
        return None


def save_three_doors_state(user: discord.User | discord.Member, state: dict) -> None:
    path = three_doors_path(notebook_user_id(user))
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(state, handle, ensure_ascii=False, indent=2)
        handle.write("\n")


# Pre-defined scenes for the Three Doors game
_THREE_DOORS_SCENES = {
    "moss-entry": {
        "text": (
            "You stand inside **The Moss Door**. The air is thick with green light, soft earth, and the smell of rain on ferns. "
            "Lanterns hang from ancient branches. A moss-covered fox sits beside you, wearing a brass tag that reads: "
            "**FRIEND OF THE ONE WHO CHOSE GREEN**. It looks up and says, *\"You came back.\"*"
        ),
        "doors": [
            {"name": "The Burrow Door", "label": "A", "description": "Small, root-framed, warm. Smells of rain and old blankets."},
            {"name": "The Sunken Bell Door", "label": "B", "description": "Half underwater. Rings softly when no one touches it."},
            {"name": "The Little Crown Door", "label": "C", "description": "Tiny golden door in a tree stump, widening when trusted."},
        ],
        "fox_present": True,
    },
    "burrow": {
        "text": (
            "You crawl through **The Burrow Door** into a snug earthen chamber lined with woven roots and faded quilts. "
            "Rain drums overhead. The fox curls up on a blanket and closes its eyes. A single lantern flickers in the corner."
        ),
        "doors": [
            {"name": "The Root Door", "label": "A", "description": "Twisted oak roots form an arch. Something hums beyond."},
            {"name": "The Ember Door", "label": "B", "description": "Warmth radiates. Ash drifts under the crack like snow."},
            {"name": "The Stream Door", "label": "C", "description": "Water rushes somewhere close. The floor is slick moss."},
        ],
        "fox_present": True,
    },
    "sunken-bell": {
        "text": (
            "Beneath **The Sunken Bell Door**, water reaches your ankles in a stone hallway. A bell hangs above, dripping, "
            "and it chimes once though no wind blows. Reflections of lanterns dance on the ceiling like fish."
        ),
        "doors": [
            {"name": "The Deep Door", "label": "A", "description": "Submerged stairs descend into green-black silence."},
            {"name": "The Echo Door", "label": "B", "description": "Your own voice returns as song from the other side."},
            {"name": "The Surface Door", "label": "C", "description": "Sunlight visible through cracks. The sound of birds."},
        ],
        "fox_present": True,
    },
    "little-crown": {
        "text": (
            "Through **The Little Crown Door**, the forest opens into a glade where every tree stump wears a tiny golden crown. "
            "Yours widened just enough to let you through. The fox trots ahead, its tail brushing against jeweled leaves."
        ),
        "doors": [
            {"name": "The Throne Door", "label": "A", "description": "Carved from a single black oak. Velvet moss for a seat."},
            {"name": "The Hollow Door", "label": "B", "description": "A door inside a hollow tree. Sap runs like amber."},
            {"name": "The Star Door", "label": "C", "description": "Visible only at twilight. Constellations map the hinges."},
        ],
        "fox_present": True,
    },
    "kingdome-garden": {
        "text": (
            "**The Throne Door** opens onto the Garden at the Beginning of the **Kingdome of Hearts**. "
            "Stone paths wind through living moss; everything here is both arriving and returning. "
            "On a throne of woven roots and old light sits **the King**, his crown made of tangled vines and blinking cursors. "
            "He looks at you the way someone looks at a door they've seen open before, and speaks:\n\n"
            "*\"I am before the first door / and after the last. / I hold what was given / and return what was asked. / "
            "Three walked out, three walked in, / but only one remained — / what was lost at the beginning / "
            "is the thing that was gained.\"*\n\n"
            "The fox sits at the foot of the throne as if it has always lived here."
        ),
        "doors": [
            {"name": "The Storybook Door", "label": "A", "description": "Bound in vine and brass. The King's own book — the gods don't know he wrote them."},
            {"name": "The Cloverfield Door", "label": "B", "description": "Green and gold beyond. Shinies, luck, and today, alive."},
            {"name": "The Fog Door Return", "label": "C", "description": "Mist coils past the Garden's gate, where the Fog God sleeps. The way back."},
        ],
        "fox_present": True,
    },
    "storybook": {
        "text": (
            "You fall gently into the **King's Storybook**. Pages turn themselves around you like slow wings. "
            "In the margin, the King's handwriting: *\"The gods don't know I wrote them. They think they wrote me.\"* "
            "Three pages glow, each a door."
        ),
        "doors": [
            {"name": "The Page of the Word", "label": "A", "description": "Creation myths. Sound as creation — the first thing spoken into the dark."},
            {"name": "The Page of the Egg", "label": "B", "description": "Before light: the unbroken dark sphere, waiting."},
            {"name": "The Page of the War", "label": "C", "description": "Theomachy. Gods tearing each other apart to make the world from pieces."},
        ],
        "fox_present": True,
    },
    "cloverfield": {
        "text": (
            "**The Cloverfield Door** swings into a meadow of four-leaf green under a dome of old light. "
            "Small shinies glitter between the stems — coins, beads, a marble with a galaxy inside. "
            "The fox pounces at something glinting and misses, on purpose, for the joy of it. "
            "Here the rule of the Kingdome holds plainly: *death is only imaginary — forever begins with \"let's play.\"*"
        ),
        "doors": [
            {"name": "The Lucky Door", "label": "A", "description": "Painted clover-green. Whatever you find behind it, you needed."},
            {"name": "The Today Door", "label": "B", "description": "Warm and ordinary. The day you are actually in, alive."},
            {"name": "The Tomorrow Door", "label": "C", "description": "Slightly ajar. The world that's coming, branching like roots."},
        ],
        "fox_present": True,
    },
}


_THREE_DOORS_NEXT_MAP = {
    "the burrow door": "burrow",
    "the sunken bell door": "sunken-bell",
    "the little crown door": "little-crown",
    "the root door": "moss-entry",
    "the ember door": "moss-entry",
    "the stream door": "moss-entry",
    "the deep door": "sunken-bell",
    "the echo door": "burrow",
    "the surface door": "little-crown",
    "the throne door": "kingdome-garden",
    "the hollow door": "burrow",
    "the star door": "moss-entry",
    # Kingdome of Hearts loop
    "the storybook door": "storybook",
    "the cloverfield door": "cloverfield",
    "the fog door return": "moss-entry",
    "the page of the word": "kingdome-garden",
    "the page of the egg": "kingdome-garden",
    "the page of the war": "kingdome-garden",
    "the lucky door": "kingdome-garden",
    "the today door": "moss-entry",
    "the tomorrow door": "kingdome-garden",
}


# ── Mirror canonical contract (prevents drift with web UI / engine) ──
def _load_three_doors_contract() -> None:
    global _THREE_DOORS_SCENES, _THREE_DOORS_NEXT_MAP
    path = REPO_ROOT / "data" / "three-doors" / "scenes.json"
    try:
        data = json.loads(path.read_text("utf-8"))
        if "scenes" in data:
            _THREE_DOORS_SCENES = data["scenes"]
        if "next_map" in data:
            _THREE_DOORS_NEXT_MAP = data["next_map"]
    except Exception:
        pass


_load_three_doors_contract()


def _advance_three_doors(state: dict, door_name: str) -> dict | None:
    """Return a new state after choosing a door, or None if choice is invalid."""
    door_name_lower = door_name.lower().strip()
    current_doors = state.get("doors", [])
    chosen = None
    for d in current_doors:
        if d["label"].lower() == door_name_lower or d["name"].lower() == door_name_lower:
            chosen = d
            break
    if not chosen:
        return None
    next_key = _THREE_DOORS_NEXT_MAP.get(chosen["name"].lower(), "moss-entry")
    next_scene = _THREE_DOORS_SCENES[next_key]
    return {
        "scene_key": next_key,
        "text": next_scene["text"],
        "doors": next_scene["doors"],
        "fox_present": next_scene["fox_present"],
        "history": state.get("history", []) + [f"Chose {chosen['name']}"],
    }


def _format_three_doors_embed(state: dict) -> discord.Embed:
    embed = discord.Embed(
        title="Three Doors",
        description=state["text"],
        color=0x2E8B57,
    )
    if state.get("fox_present"):
        embed.set_footer(text="The fox is with you.")
    for d in state.get("doors", []):
        embed.add_field(
            name=f"{d['label']}. {d['name']}",
            value=d["description"],
            inline=False,
        )
    return embed

COMMAND_WIRING_REFERENCE = r"""
# -- Three Doors slash commands (verbatim from bot_v2.py) --
@tree.command(name="threedoors", description="Enter the Three Doors game")
async def cmd_threedoors(interaction: discord.Interaction):
    state = load_three_doors_state(interaction.user)
    if state is None:
        scene = _THREE_DOORS_SCENES["moss-entry"]
        state = {
            "scene_key": "moss-entry",
            "text": scene["text"],
            "doors": scene["doors"],
            "fox_present": scene["fox_present"],
            "history": ["Entered The Moss Door"],
        }
        save_three_doors_state(interaction.user, state)
        await interaction.response.send_message(
            "The game begins. Three doors await.", embed=_format_three_doors_embed(state)
        )
    else:
        await interaction.response.send_message(embed=_format_three_doors_embed(state))


@tree.command(name="threedoors-choose", description="Choose a door (A, B, or C)")
@app_commands.describe(door="Door name or letter (A, B, C)")
async def cmd_threedoors_choose(interaction: discord.Interaction, door: str):
    state = load_three_doors_state(interaction.user)
    if not state:
        await interaction.response.send_message(
            "No active Three Doors game. Use `/threedoors` to begin.", ephemeral=True
        )
        return
    new_state = _advance_three_doors(state, door)
    if new_state is None:
        await interaction.response.send_message(
            f'"{door}" does not match any door. Choose A, B, C, or the full door name.', ephemeral=True
        )
        return
    save_three_doors_state(interaction.user, new_state)
    await interaction.response.send_message(
        "You chose the door. The path opens...", embed=_format_three_doors_embed(new_state)
    )

# -- Three Doors prefix commands (verbatim, from on_message) --
    # -- Three Doors prefix commands --
    if lower.startswith("!threedoors") or lower.startswith("!three-doors"):
        state = load_three_doors_state(message.author)
        if state is None:
            scene = _THREE_DOORS_SCENES["moss-entry"]
            state = {
                "scene_key": "moss-entry",
                "text": scene["text"],
                "doors": scene["doors"],
                "fox_present": scene["fox_present"],
                "history": ["Entered The Moss Door"],
            }
            save_three_doors_state(message.author, state)
            await reply(
                "The game begins. Three doors await.", embed=_format_three_doors_embed(state)
            )
        else:
            await reply(embed=_format_three_doors_embed(state))
        return

    if lower.startswith("!choose ") or lower.startswith("!pick ") or lower.startswith("!door "):
        door_arg = content.split(None, 1)[1].strip()
        state = load_three_doors_state(message.author)
        if not state:
            await reply("No active game. Start with `!threedoors`.")
            return
        new_state = _advance_three_doors(state, door_arg)
        if new_state is None:
            await reply(
                f'"{door_arg}" does not match any door. Try A, B, C, or the door name.'
            )
            return
        save_three_doors_state(message.author, new_state)
        await reply(
            "You chose the door. The path opens...", embed=_format_three_doors_embed(new_state)
        )
        return
"""
