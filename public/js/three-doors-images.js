// ── Three Doors Image Loading ─────────────────────────────────────────────────
// Pollinations.ai async image loader, training data collection, LoRA training
// Depends on three-doors-data.js for SCENES, SD_PROMPTS, and constants

// ── Pollinations.ai async image loader ───────────────────────────
// Shows canvas art immediately; swaps in AI-generated image when ready.
// Also collects images + prompts as LoRA training data.
const POLLINATIONS_BASE = "https://image.pollinations.ai/prompt/";
const pollinationsCache = {}; // keyed by sceneKey_loopCount for fresh art each loop
let trainingImageCount = 0;

// Shared direct Node DALL-E / gpt-image-2 call (POST /api/image/ai-generate,
// see lib/openai-image.js) — used for scenes with no curated R2 art AND for
// dynamic/custom doors (a player-named door, or a novelty-routed "deep"
// scene) that have no fixed art of their own. Returns null on any failure
// so callers can fall through to Pollinations without special-casing.
async function tryDalleGenerate(sceneKey, prompt) {
  try {
    const response = await fetch("/api/image/ai-generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, size: "1024x1024" }),
    });
    const data = await response.json();
    if (data.ok && data.url) return { url: data.url, model: data.model };
  } catch (e) {
    logThreeDoorsEvent('image_error', { sceneKey, error: e.message });
  }
  return null;
}

async function loadPollinationsImage(imgId, canvasId, sceneKey) {
  const loopCount = gameState?.loop_count ?? 0;
  const cacheKey = `${sceneKey}_L${loopCount}`;
  if (pollinationsCache[cacheKey]) return; // already loaded this scene+loop
  const scene = SCENES[sceneKey];
  const sdPrompt = scene?.image_prompt || SD_PROMPTS?.[sceneKey] || (scene?.text?.slice(0, 120) || sceneKey);
  const loopFlair = loopCount > 0 ? `, revisited ${loopCount > 1 ? "again " : ""}with new eyes` : "";
  const seed = Math.floor(Math.random() * 999983) + 1;
  const fullPrompt = buildDynamicImagePrompt(sceneKey, seed, gameState);

  const img = document.getElementById(imgId);
  const cvs = document.getElementById(canvasId);
  if (!img && !cvs) return;

  // Scenes with no curated R2 art (DALLE_GENERATED_SCENES ∪ legacy
  // SERVER_GENERATED_SCENES — both now go through the same direct Node
  // DALL-E / gpt-image-2 call, no Python subprocess, no dead GET endpoint;
  // see lib/openai-image.js): try that first.
  if (DALLE_GENERATED_SCENES.has(sceneKey) || SERVER_GENERATED_SCENES.has(sceneKey)) {
    const dalleImg = await tryDalleGenerate(sceneKey, fullPrompt);
    if (dalleImg) {
      pollinationsCache[cacheKey] = dalleImg.url;
      window.__sceneArt = { sceneKey, prompt: fullPrompt, url: dalleImg.url };
      logThreeDoorsEvent('image_load', { sceneKey, source: dalleImg.model || 'dalle', loop: loopCount });
      if (cvs) cvs.style.display = "none";
      if (img) { img.src = dalleImg.url; img.style.display = ""; }
      collectTrainingImage(sceneKey, fullPrompt, dalleImg.url);
      return;
    }
  }

  // Fallback: Pollinations free API (no key required)
  const pollinationsUrl = POLLINATIONS_BASE + encodeURIComponent(fullPrompt) + `?width=800&height=450&nologo=true&model=flux&seed=${seed}`;
  try {
    const probe = new Image();
    probe.crossOrigin = "anonymous";
    probe.onload = () => {
      pollinationsCache[cacheKey] = pollinationsUrl;
      window.__sceneArt = { sceneKey, prompt: fullPrompt, url: pollinationsUrl };
      logThreeDoorsEvent('image_load', { sceneKey, source: 'pollinations', loop: loopCount, seed });
      if (cvs) cvs.style.display = "none";
      if (img) { img.src = pollinationsUrl; img.style.display = ""; }
      collectTrainingImage(sceneKey, fullPrompt, pollinationsUrl);
    };
    probe.onerror = () => {}; // canvas stays visible
    probe.src = pollinationsUrl;
  } catch { /* silent */ }
}

// Replace a scene's picture with the player's own render (e.g. exported from
// ChatGPT, which draws the cast on-model). Saved server-side and remembered for
// this door, so it wins over the generated art on every future visit.
async function replaceSceneImage(imgId, canvasId, sceneKey) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/png,image/jpeg,image/webp";
  input.onchange = async () => {
    const file = input.files && input.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert("That image is over 10MB — please use a smaller one."); return; }
    const dataUrl = await new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
    const img = document.getElementById(imgId);
    const cvs = document.getElementById(canvasId);
    let url = dataUrl; // optimistic: show immediately
    if (img) { img.src = dataUrl; img.style.display = ""; }
    if (cvs) cvs.style.display = "none";
    try {
      const r = await fetch("/api/scene/image", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl }),
      });
      const d = await r.json();
      if (d.ok && d.url) url = d.url; // persisted server copy
    } catch (_e) { /* keep the inline data URL if the save fails */ }
    if (typeof playerProgress === "object") {
      if (!playerProgress.imageOverrides) playerProgress.imageOverrides = {};
      playerProgress.imageOverrides[sceneKey] = url;
      if (typeof saveProgress === "function") saveProgress();
    }
    if (img && url !== dataUrl) img.src = url;
    logThreeDoorsEvent && logThreeDoorsEvent("image_replaced", { sceneKey });
  };
  input.click();
}

// The LoRA-training pipeline (a training-image collector + a "train" badge)
// was lantern-os-only and has no standalone backend. Kept as a no-op so the
// play loop's image code calls it without hitting a dead endpoint.
function collectTrainingImage() { /* no-op in standalone (migration #2507) */ }
