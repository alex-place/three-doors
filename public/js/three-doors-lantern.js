// ── Three Doors — talking to the keepers ───────────────────────────────────────
// Anything the Doorwalker types that isn't a door is spoken TO a keeper. They
// answer in character, grounded in the lore + what they remember, and remember
// the exchange (three-doors-keepers.js → /api/keeper/speak). Address one by name
// ("Eclipse, what do you see?") or the scene's keeper answers.
let lanternBusy = false;

async function askLantern(text) {
  if (lanternBusy) return;
  lanternBusy = true;
  appendUserMsg(text); // appendUserMsg escapes
  appendTyping();

  const scene = SCENES[gameState?.scene_key] || {};
  let spoke = null;
  try {
    if (window.ThreeDoorsKeepers) {
      spoke = await window.ThreeDoorsKeepers.talk(text, gameState?.scene_key, {
        sceneKey: gameState?.scene_key,
        scene: (scene.text || "").replace(/\*/g, "").slice(0, 400),
        chosenDoor: gameState?.last_choice || "",
        doorLore: (scene.theme || "") + (scene.lesson ? " — " + scene.lesson : ""),
      });
    }
  } catch (e) { /* fall through */ }

  removeTyping();
  if (!spoke) {
    const chat = document.getElementById("chat");
    const el = document.createElement("div");
    el.className = "message agent";
    el.innerHTML = `<div class="agent-avatar">🏮</div><div class="message-content"><em>The keepers' voices are far off just now. Try again, or step through a door.</em></div>`;
    chat.appendChild(el);
    chat.scrollTop = chat.scrollHeight;
  }
  lanternBusy = false;
}
