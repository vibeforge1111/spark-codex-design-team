# Quickstart

This is the shortest path from "I saw the guild on X" to "Codex improved a real rendered UI."

## 30 Seconds: What It Does

Codex Visual Builder Guild makes Codex stop guessing from source code. It runs your app, captures desktop, tablet, mobile, and awkward in-between screenshots, uses Codex App vision to inspect what actually rendered, fixes the biggest visual issue, runs a post-fix ruthlessness check, and compares before/after screenshots.

Use it when an AI-made UI is "almost there" but still has weak hierarchy, mobile breakage, contrast problems, awkward spacing, missing states, confusing user flow, overwhelming setup, component drift, or unclear visual proof.

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
Use codex-visual-builder-guild on this app. Run it, screenshot desktop, tablet, mobile, and one awkward in-between width, inspect screenshots with Codex App vision, fix the single highest-impact visual issue, run the Post-Fix Ruthlessness Check for awkward leftovers, then show before/after screenshot paths and what changed.
```

Good output includes:

- first desktop, tablet, mobile, and awkward in-between screenshots
- concrete Codex App vision observations from those screenshots
- the top visible issue
- at most 1-2 specialist lenses, only when screenshot evidence justifies them
- the fix that was made
- after screenshots
- the post-fix ruthlessness check: what still looked awkward, and whether it changed the next action
- what improved
- what stayed weak
- one reusable design rule
- automation notes saying whether this was manual-only or protected by a project check

## What Codex Must Report

Every useful guild run should end with this compact report:

```text
Goal:
Viewport matrix:
State matrix:
Screenshots inspected:
Vision observations:
Top issues:
Chosen issue:
Lens used:
Exact fix:
Verification:
Accepted visual change:
Still weak:
Reusable rule:
Automation notes:
```

If the final answer does not include screenshot paths, vision observations, and a verification claim, the guild did not finish the loop.

To create a fill-in proof packet before the run:

```powershell
npm run recommend-workflow -- --need "dashboard mobile regression"
npm run create-proof-packet -- --cwd ../my-app
```

After the run, validate that the packet is not just a blank ritual:

```powershell
npm run check-proof-packet -- --cwd ../my-app
npm run score-proof-packet -- --cwd ../my-app
```

If the screen is important enough to protect with a repeatable screenshot check:

```powershell
npm run scaffold:playwright-visual -- --cwd ../my-app --url http://127.0.0.1:5173 --name dashboard
```

## Lens Router

Do not summon the whole guild by default. Start with the minimum useful pass, then add a specialist only when the screenshot proves a specific failure:

- mobile or tablet breakage: `responsive-vision-auditor`
- unclear next action, confusing first-run path, or overwhelm: `user-flow-friction-auditor`
- dashboard is pretty but not operationally useful: `saas-dashboard-operator`
- hover, focus, modal, loading, empty, or error states: `interaction-state-inspector`
- contrast, focus, target size, or color-only meaning: `visual-accessibility-sentinel`
- ugly real data breaks layout: `real-content-layout-fuzzer`
- generated assets matter to the UI: `imagegen-asset-director`
- art bible, design tokens, or component-system compliance matters: `component-system-steward`
- baseline or regression proof is needed: `screenshot-regression-guard`

If no specialist changes the next action, the correct answer is `lens used: none`.

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
