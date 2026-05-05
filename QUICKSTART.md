# Quickstart

This is the shortest path from "I saw the guild on X" to "Codex improved a real rendered UI."

## 30 Seconds: What It Does

Codex Visual Builder Guild makes Codex stop guessing from source code. It runs your app, captures desktop and mobile screenshots, uses vision to inspect what actually rendered, fixes the biggest visual issue, and compares before/after screenshots.

Use it when an AI-made UI is "almost there" but still has weak hierarchy, mobile breakage, contrast problems, awkward spacing, missing states, or unclear visual proof.

## 2 Minutes: Install It

```powershell
git clone https://github.com/vibeforge1111/codex-visual-builder-guild.git
cd codex-visual-builder-guild
npm install
npm run install:codex
```

The installer should print:

- `CODEX_HOME`
- the installed skill path
- copied-file verification
- a reminder to restart Codex Desktop or open a new session
- a first-run prompt

If Codex does not recognize `codex-visual-builder-guild`, restart Codex Desktop or open a new session. Existing sessions may not see newly installed skills.

## 5 Minutes: Paste This

Open the project you want Codex to improve, then paste:

```text
Use codex-visual-builder-guild on this app. Run it, screenshot desktop and mobile, fix the single highest-impact visual issue, then show before/after screenshot paths and what changed.
```

Good output includes:

- first desktop and mobile screenshots
- the top visible issue
- the fix that was made
- after screenshots
- what improved
- what stayed weak
- one reusable design rule

## What Codex Must Report

Every useful guild run should end with this compact report:

```text
Goal:
Screenshots inspected:
Top issues:
Chosen issue:
Lens used:
Exact fix:
Verification:
Still weak:
Reusable rule:
```

If the final answer does not include screenshot paths and a verification claim, the guild did not finish the loop.

## Want A Safe First Target?

Use the disposable demo:

```powershell
cd examples/first-run-demo
python -m http.server 5177
```

Open `http://127.0.0.1:5177`, then paste the 5-minute prompt above.

The demo has intentional visual problems so the guild has something obvious to catch. See [`examples/first-run-demo/PROOF_PACKET.md`](examples/first-run-demo/PROOF_PACKET.md) for the shape of a successful run.

## Which Mode Should I Use?

Use **Codex Desktop** if you just want the guild to work.

Use **standalone YAML** if you are building your own agent runtime.

Use **Spark Skill Graphs** if you already run Spark and want graph nodes, delegate edges, bundle loading, and dashboard inspection.

If you are unsure, choose Codex Desktop.
