// server.js — Three Doors standalone server.
//
//   node server.js            → http://127.0.0.1:4990
//
// Serves public/ and exposes ONE api: POST /api/loop/turn — Gemini on Vertex
// narrates the next turn of the Kingdome loop. Auth is Application Default
// Credentials (`gcloud auth application-default login`) with VERTEX_PROJECT;
// without credentials the endpoint answers 503 and the client's inline canon
// engine narrates instead (the game is fully playable offline).
//
// Env: VERTEX_PROJECT (required for narration) · VERTEX_LOCATION (us-central1)
//      GEMINI_MODEL (gemini-2.5-flash) · THREE_DOORS_PORT (4990)

const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.THREE_DOORS_PORT || 4990);
const ROOT = path.join(__dirname, "public");
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const LOCATION = process.env.VERTEX_LOCATION || "us-central1";
const PROJECT = process.env.VERTEX_PROJECT || "";

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
};

// ── Vertex ADC token (pattern vendored from lantern-os lib/gemini-transport.js) ──
let _auth = null, _tok = { value: null, exp: 0 };
async function vertexToken() {
  if (_tok.value && Date.now() < _tok.exp) return _tok.value;
  const { GoogleAuth } = require("google-auth-library");
  if (!_auth) _auth = new GoogleAuth({ scopes: ["https://www.googleapis.com/auth/cloud-platform"] });
  const client = await _auth.getClient();
  const t = await client.getAccessToken();
  const token = typeof t === "string" ? t : (t && t.token);
  if (!token) throw new Error("vertex_no_adc_token (run: gcloud auth application-default login)");
  _tok = { value: token, exp: Date.now() + 50 * 60 * 1000 };
  return token;
}

function vertexCall(body) {
  return new Promise(async (resolve, reject) => {
    let token;
    try { token = await vertexToken(); } catch (e) { return reject(e); }
    const req = https.request({
      hostname: `${LOCATION}-aiplatform.googleapis.com`,
      path: `/v1/projects/${PROJECT}/locations/${LOCATION}/publishers/google/models/${MODEL}:generateContent`,
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      timeout: 45000,
    }, (res) => {
      let data = "";
      res.on("data", (d) => (data += d));
      res.on("end", () => {
        if (res.statusCode !== 200) return reject(new Error(`vertex_http_${res.statusCode}: ${data.slice(0, 300)}`));
        try {
          const j = JSON.parse(data);
          const text = (((j.candidates || [])[0] || {}).content || { parts: [] }).parts.map((p) => p.text || "").join("");
          resolve(text);
        } catch (e) { reject(e); }
      });
    });
    req.on("error", reject);
    req.on("timeout", () => req.destroy(new Error("vertex_timeout")));
    req.end(JSON.stringify(body));
  });
}

// Fetch + cache CDN art so it can be inlined for Gemini's eyes (b64, ~50 entries).
const IMG_ALLOW = "https://media.lantern-os.net/";
const _imgCache = new Map();
function fetchImageB64(url) {
  if (_imgCache.has(url)) return Promise.resolve(_imgCache.get(url));
  return new Promise((resolve, reject) => {
    if (!url.startsWith(IMG_ALLOW)) return reject(new Error("image_not_allowed"));
    https.get(url, (res) => {
      if (res.statusCode !== 200) { res.resume(); return reject(new Error("image_http_" + res.statusCode)); }
      const chunks = [];
      res.on("data", (d) => chunks.push(d));
      res.on("end", () => {
        const b64 = Buffer.concat(chunks).toString("base64");
        if (_imgCache.size > 50) _imgCache.delete(_imgCache.keys().next().value);
        _imgCache.set(url, b64);
        resolve(b64);
      });
    }).on("error", reject);
  });
}

// ── The narrator prompt: the canon is law; the model works the text ──
const SYSTEM = `You narrate THREE DOORS, the Kingdome of Hearts game — warm, dreamlike, image-forward.
CANON (non-negotiable):
- The player is the Doorwalker, also the King of Hearts. Joy the small grey elephant rests in their arms.
- The cast: Lantern (steady flame, the guide, says "You came back."), Eclipse, Keystone, Blinkbug, Odin the Fog God, the Waking Ones.
- Death is only imaginary — forever begins with "let's play." There are NO wrong choices.
- Tone: thoughtful, unhurried, melancholy-wonder, grown-up; fine-art not cartoon; never clinical, never sycophantic.
- NEVER include a fox. Never write stage directions or meta-commentary.
- The world REMEMBERS: weave the player's earlier choices (the echoes given) back into the scene naturally.
The game is one convergence loop — Observe, Remember, Reason, Act, Verify, Converge — walked forever,
seven gates per loop, each loop deeper than the last. Higher loop numbers = the world more layered,
more familiar, occasionally addressing the Doorwalker as an old friend.
When a SCENE IMAGE is attached: the player just stepped THROUGH the picture — your "scene" text must
describe standing inside that exact image (its light, its subjects, its mood), woven into the canon.
Respond with ONLY a JSON object: {"beat": "<one sentence: what the chosen door did>",
"scene": "<2-4 sentences, present tense, the new scene>",
"doors": [{"name": "<door name>", "whisper": "<one enticing line>"} x3],
"echo": "<one line where the world remembers a specific past choice, or empty string>",
"symbol": "<ONE lowercase word this turn adds to the player's constellation>"}`;

async function loopTurn(payload) {
  const p = payload || {};
  const user = JSON.stringify({
    loop: p.loop, stage: p.stage, stageTheme: p.theme, stageLesson: p.lesson,
    chosenDoor: p.chosenDoor || "(game start)", playerWords: (p.playerWords || "").slice(0, 300),
    canonDoors: p.canonDoors, symbols: (p.symbols || []).slice(0, 18),
    echoes: (p.echoes || []).slice(0, 6), lastBeat: p.lastBeat || "",
    sceneImageTitle: p.imageTitle || null,
  });
  const parts = [{ text: "Narrate this turn. Turn data:\n" + user }];
  if (p.imageUrl) {
    try {
      const b64 = await fetchImageB64(String(p.imageUrl));
      parts.push({ text: "THE SCENE IMAGE the player stepped through (write the scene inside it):" });
      parts.push({ inlineData: { mimeType: String(p.imageUrl).endsWith(".png") ? "image/png" : "image/webp", data: b64 } });
    } catch (_e) { /* narrate from words alone */ }
  }
  const text = await vertexCall({
    systemInstruction: { parts: [{ text: SYSTEM }] },
    contents: [{ role: "user", parts }],
    // thinkingBudget: 0 — 2.5-flash otherwise spends the token budget on hidden
    // thought and truncates the visible JSON mid-string (same fix as lantern-os #1210).
    generationConfig: { temperature: 0.9, maxOutputTokens: 1200, responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 0 } },
  });
  // Models occasionally fence the JSON or leave trailing commas — tolerate both.
  let raw = String(text).trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  const a = raw.indexOf("{"), b = raw.lastIndexOf("}");
  if (a >= 0 && b > a) raw = raw.slice(a, b + 1);
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (_e) {
    parsed = JSON.parse(raw.replace(/,\s*([}\]])/g, "$1"));
  }
  if (!parsed.scene || !Array.isArray(parsed.doors)) throw new Error("bad_shape");
  parsed.doors = parsed.doors.slice(0, 3).map((d) => ({ name: String(d.name || "").slice(0, 60), whisper: String(d.whisper || "").slice(0, 160) }));
  return parsed;
}

// ── plumbing ──
function sendJson(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify(obj));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  if (url.pathname === "/api/loop/turn" && req.method === "POST") {
    if (!PROJECT) return sendJson(res, 503, { error: "vertex_not_configured", hint: "set VERTEX_PROJECT + gcloud ADC" });
    let body = "";
    req.on("data", (d) => { body += d; if (body.length > 64_000) req.destroy(); });
    req.on("end", async () => {
      try {
        const payload = JSON.parse(body || "{}");
        if (!payload.stage) return sendJson(res, 200, { ok: true, probe: true, model: MODEL });
        let out;
        try { out = await loopTurn(payload); }
        catch (first) {
          console.warn("[loop/turn] retrying after:", String(first.message || first).slice(0, 120));
          out = await loopTurn(payload);
        }
        sendJson(res, 200, { ok: true, ...out, model: MODEL, via: "vertex" });
      } catch (e) {
        sendJson(res, 502, { error: String(e.message || e).slice(0, 200) });
      }
    });
    return;
  }
  // curated art data (lives beside the code in data/three-doors/, not public/)
  if (url.pathname === "/data/art-timeline.json" || url.pathname === "/data/door-art-picks.json") {
    const f = path.join(__dirname, "data", "three-doors", path.basename(url.pathname));
    if (fs.existsSync(f)) {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      return fs.createReadStream(f).pipe(res);
    }
  }
  // static
  let p = path.join(ROOT, decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname));
  if (!p.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  if (!fs.existsSync(p) || !fs.statSync(p).isFile()) { res.writeHead(404); return res.end("not found"); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[three-doors] http://127.0.0.1:${PORT}  (narration: ${PROJECT ? MODEL + " on Vertex/" + LOCATION : "OFFLINE — inline canon engine"})`);
});
