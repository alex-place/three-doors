// ── Three Doors Lantern Conversation ───────────────────────────────────────────
// Freeform conversation with Lantern — the guide answers mid-scene
// Depends on three-doors-data.js for SCENES

// ── Freeform conversation with Lantern — the guide answers mid-scene ──
const lanternHistory = [];
let lanternBusy = false;

async function askLantern(text) {
  if (lanternBusy) return;
  lanternBusy = true;
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  appendUserMsg(esc(text));
  appendTyping();

  // Freeform reply from the game's own narrator (/api/scene/narrate), anchored
  // in the current scene + its theme/lesson, folding the player's words in as
  // authored canon. Warm and in-character — never a graded answer.
  const scene = SCENES[gameState?.scene_key] || {};
  const sceneText = (scene.text || gameState?.text || "").replace(/\*/g, "").slice(0, 300);

  let fullText = "";
  try {
    const resp = await fetch("/api/scene/narrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sceneKey: gameState?.scene_key || "the Kingdome",
        sceneText, theme: scene.theme || "", lesson: scene.lesson || "",
        playerWords: text,
        canon: (playerProgress?.customDesires || []).slice(-8),
      }),
      signal: AbortSignal.timeout(30000),
    });
    if (resp.ok) { const d = await resp.json(); fullText = (d.reply || "").trim(); }
  } catch (e) { /* fall through to fallback below */ }

  removeTyping();
  if (fullText) {
    const chat = document.getElementById("chat");
    const el = document.createElement("div");
    el.className = "message agent";
    el.innerHTML = `<div class="agent-avatar">🏮</div><div class="message-content">${md(esc(fullText))}</div>`;
    chat.appendChild(el);
    chat.scrollTop = chat.scrollHeight;
    lanternHistory.push({ role: "user", text }, { role: "assistant", text: fullText });
  }
  if (!fullText) {
    const chat = document.getElementById("chat");
    const el = document.createElement("div");
    el.className = "message agent";
    el.innerHTML = `<div class="agent-avatar">🏮</div><div class="message-content"><em>Lantern's flame flickers — it can't find words right now. Try again, or choose a door.</em></div>`;
    chat.appendChild(el);
    chat.scrollTop = chat.scrollHeight;
  }
  lanternBusy = false;
}
