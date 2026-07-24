# Discord lounge bot — migrated from lantern-os (2026-07-24)

Moved here by operator decision: the bot is community/game surface, which is this repo's domain.
Origin: `alex-place/lantern-os` `src/discord_lounge_bot/` (history preserved there).

Notes for wiring in this repo:
- `bot_v2.py` is the live entrypoint (`bot.py` is v1).
- `archive_curator.py` + `voice_curator.py` were registered as MCP tools in lantern-os's
  `src/mcp_server/server.py` — that registration was removed with the migration; re-register here
  if three-doors grows an MCP server, or run them as bot cogs only.
- Env: `DISCORD_TOKEN` (+ see `requirements_v2.txt`).
- Tests: `tests/test_discord_bot.py`, `tests/test_discord_voice_gate.py` (self-skip via
  importorskip when discord/dpytest absent).
