# My notes on this copy

This is my own copy of [rar-file/claude-rpc](https://github.com/rar-file/claude-rpc) (MIT; keep `LICENSE`).

## How it runs on my PC

- Runs **from this folder's source** with Node (`node src/cli.js ...`), not the release exe.
- Claude Code hooks in `~/.claude/settings.json` point at `src/hook.js` here.
- Autostart: `HKCU\...\Run\ClaudeRPC` launches the daemon at login.
- My card settings live in `config.json` in this folder (git-ignored, not committed).
- After editing code or config: `node src/cli.js restart`.
- Check health: `node src/cli.js doctor` · see frames: `node src/cli.js preview`.
- Log: `%LOCALAPPDATA%\Temp\claude-rpc\daemon.log`.
- Old installed exe (stopped, unused): `%APPDATA%\claude-rpc\bin\claude-rpc.exe`.

## Remotes

- `origin` = my repo (Horali/claude-rpc)
- `upstream` = original. Pull their updates with `git fetch upstream && git merge upstream/main`.

## Changes I've made so far (config only)

- Idle card trimmed to: Chatting in project · usage % · this week · lifetime hours · lifetime tokens.
- "Idle" relabelled "Chatting", typing image instead of sleeping one.
- Party size "(2 of 2)" off (`showPartySize: false`).
- My private repos show as "PrivateRepo" via a git-ignored `.claude-rpc.json` in each.

## Code changes done

- New `chatting` status: after Claude finishes, card says "Chatting in …" (main line only).
  Only after `chatIdleMin` (10) minutes with no activity does it become real "Idle" with the stats rotation.
- Card setup: Working = main line only · Chatting = main line only · Idle = usage %, lifetime hours/prompts, lifetime tokens/tools.

- Activity Controller link: `src/controller-light.js` (+ `src/controller-client.mjs`, a copy) and a few lines in `pushPresence`.
  The daemon checks in at `127.0.0.1:47400` every 2 s. A red light clears the card. No controller = works alone.
  The CLI pause shows as "Own switch off" in the controller. The controller switch does not write the pause file yet.

## Active tasks

- Activity Controller link (Phase 2): task file `handoffs/phase5-phone-control.md` in the DiscordActivityController repo.

## Ideas to build (code changes)

- Every GitHub-private repo shows as "PrivateRepo" automatically (today it's hidden unless the repo has a `.claude-rpc.json`).
- Remove parts I don't use (leaderboard, community stats, worker, dashboard app, "Get claude-rpc" button).
