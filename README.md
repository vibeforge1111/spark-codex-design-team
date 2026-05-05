# codex-visual-builder-guild

[![CI](https://github.com/vibeforge1111/codex-visual-builder-guild/actions/workflows/ci.yml/badge.svg)](https://github.com/vibeforge1111/codex-visual-builder-guild/actions/workflows/ci.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-gold.svg)](LICENSE)

![Codex Visual Builder Guild hero](assets/hero-guild-banner.png)

Welcome to the **Codex Visual Builder Guild**: a free, open-source guild of H70-C+ Spark Skill Graphs that helps Codex build better-looking apps with imagegen, screenshots, vision review, and specialist delegation.

Think of it like hiring a tiny fantasy design studio for your Codex Desktop session. One specialist checks spacing. One makes assets. One stress-tests mobile. One guards accessibility. One turns the winning design into reusable rules. Together, they help Codex stop guessing and start looking.

Free community drop. MIT licensed. Fork it, remix it, install it into Spark Skill Graphs, or use the YAML skills directly in your own agent runtime.

## 30 Seconds, 2 Minutes, 5 Minutes

**In 30 seconds:** this makes Codex look at the real UI before it claims the design is good.

**In 2 minutes:** install one Codex skill:

```powershell
git clone https://github.com/vibeforge1111/codex-visual-builder-guild.git
cd codex-visual-builder-guild
npm install
npm run install:codex
```

**In 5 minutes:** restart Codex Desktop, open your app, and paste the [first-win prompt](#your-first-5-minute-win). Codex should return before/after screenshots, the biggest visual issue, the fix, what still needs work, and whether any specialist lens was actually useful.

For the shortest path, read [`QUICKSTART.md`](QUICKSTART.md).

## If You Are New, Choose This Path

Most builders should start with **Codex Desktop**. You do not need Spark Skill Graphs for the first win.

| You are... | Use this path | What you install |
| --- | --- | --- |
| using Codex Desktop and want visual QA now | **Codex wrapper** | one native Codex skill |
| building your own agent runtime | standalone YAML | files from `design/*.yaml` |
| already running Spark Skill Graphs | Spark dashboard path | `design/*.yaml` plus the bundle |

If you are unsure, choose the Codex wrapper. It is the fastest path from "I saw this on X" to "Codex fixed a rendered UI after looking at screenshots."

## Install For Codex

If you just want to use the guild inside Codex Desktop, install the native Codex wrapper skill:

```powershell
git clone https://github.com/vibeforge1111/codex-visual-builder-guild.git
cd codex-visual-builder-guild
npm install
npm run install:codex
```

The installer prints the exact skill folder, verifies that `SKILL.md` was copied, and gives you the smoke prompt.

**Important:** restart Codex Desktop or open a new Codex session after installing. Already-open sessions may not see newly installed skills.

Then say:

```text
Use codex-visual-builder-guild to run the visual builder loop on this app.
```

That gives Codex one easy skill to invoke. The wrapper skill knows the full 16-specialist guild and can route work through the right specialist lens.

The default is intentionally small: one visible win first, at most 1-2 specialist lenses, and screenshot proof before claims.

## Your First 5-Minute Win

Use this when you want proof that the guild works, not a long design ceremony:

```text
Use codex-visual-builder-guild on this app.

Run it locally, take desktop and mobile screenshots, inspect the rendered UI with vision, name the top 3 visual issues, fix the highest-impact one, then capture after screenshots.

End with a plain-English before/after summary and the screenshot paths.
```

Expected result:

- Codex runs the app instead of guessing from source code.
- You get desktop and mobile screenshots.
- The guild names the biggest visible problem.
- The guild uses at most 1-2 specialist lenses unless screenshots prove more are needed.
- Codex fixes one high-impact issue and screenshots the result.
- The final answer follows the Run Report Contract: goal, viewport matrix, state matrix, screenshots inspected, top issues, chosen issue, lens used, exact fix, verification, accepted visual change, still weak, reusable rule, automation notes.

Want a disposable target? Open [`examples/first-run-demo`](examples/first-run-demo) and ask the guild to improve it.

See the shape of a successful result: [`examples/first-run-demo/PROOF_PACKET.md`](examples/first-run-demo/PROOF_PACKET.md).

## The 10-Second Pitch

![What you get](assets/what-you-get.png)

Most AI-made UIs fail because the agent writes code once and never really sees the result.

This guild gives Codex a loop:

```text
build -> run -> screenshot -> vision review -> delegate -> fix -> compare -> keep the rules
```

That means Codex can:

- generate UI-ready image assets instead of waiting on placeholders
- inspect real screenshots instead of guessing from code
- catch mobile, spacing, contrast, and interaction problems
- hand narrow problems to specialist skills
- turn great screens into design rules, tokens, and regression baselines
- work standalone or inside Spark Skill Graphs

## Start With This Prompt

Paste this into Codex Desktop when you want the full guild experience. If you installed the Codex skill, start with `Use codex-visual-builder-guild`.

```text
Use codex-visual-builder-guild as a visual product team.

Goal: [describe what we are building].

Run the app locally, take screenshots on desktop and mobile, inspect the rendered UI with vision, and delegate issues to the right specialists. Use imagegen when custom assets would improve the product. Focus on hierarchy, spacing, contrast, text fit, responsive layout, interaction states, accessibility, and visual consistency.

Do not stop at the first draft. Iterate until the UI feels polished, compare before/after screenshots, and summarize the final design rules.
```

More copy-paste prompts live in [PROMPTS.md](PROMPTS.md).

## No-Ceremony Workflow

The best dogfood runs showed that the guild helps most when it behaves like a compact visual QA loop, not a parade of roles.

Use this order:

1. Start with the minimum useful pass.
2. Route to a specialist only when screenshot evidence proves the failure class.
3. Fix one high-impact issue.
4. Preserve before/after screenshots.
5. Leave a proof packet another builder can inspect.

See [`WORKFLOW.md`](WORKFLOW.md) for the lens router, stronger proof packet, and optional Playwright, Storybook/Chromatic, axe, and Web Vitals recipes.

You can also scaffold the proof artifacts:

```powershell
npm run recommend-workflow -- --need "dashboard mobile regression"
npm run create-proof-packet -- --cwd ../my-app
npm run check-proof-packet -- --cwd ../my-app
npm run scaffold:playwright-visual -- --cwd ../my-app --url http://127.0.0.1:5173 --name dashboard
```

## How It Works

![How it works](assets/how-it-works.png)

The guild is not a design theory packet. It is a working loop:

1. Codex builds or changes the app.
2. Codex runs it locally.
3. Codex captures screenshots.
4. Vision inspects what actually rendered.
5. The guild routes problems to specialists.
6. Codex fixes the product and screenshots it again.
7. Winning choices become reusable rules.

Imagegen creates source material. Vision judges the real interface. Specialist lenses make the routing explicit. Spark Skill Graphs are optional unless you want the full graph/dashboard path.

## Summon The Right Specialist

Use the full guild prompt when you want the whole team. Use a specialist lens when you already know the problem. For most runs, start with `visual-loop-qa` and route to at most two lenses.

| If you want... | Summon... | Prompt starter |
| --- | --- | --- |
| a full visual QA loop | `visual-loop-qa` | "Use codex-visual-builder-guild with the visual-loop-qa lens. Run the app, screenshot desktop and mobile, inspect with vision, delegate issues, fix, and compare before/after." |
| custom UI art or product visuals | `imagegen-asset-director` | "Use codex-visual-builder-guild with the imagegen-asset-director lens. Generate UI-ready assets that match this product, then integrate and screenshot them in context." |
| mobile/tablet/desktop confidence | `responsive-vision-auditor` | "Use codex-visual-builder-guild with the responsive-vision-auditor lens. Check the layout across mobile, tablet, desktop, and wide screens." |
| hover, focus, modal, loading, and error polish | `interaction-state-inspector` | "Use codex-visual-builder-guild with the interaction-state-inspector lens. Click through the main flows and inspect every important interaction state." |
| consistent product taste | `brand-consistency-enforcer` | "Use codex-visual-builder-guild with the brand-consistency-enforcer lens. Compare screens and enforce one coherent visual language." |
| a reusable style guide | `art-bible-extractor` | "Use codex-visual-builder-guild with the art-bible-extractor lens. Turn the best screenshots into an art bible." |
| durable design tokens | `design-token-surgeon` | "Use codex-visual-builder-guild with the design-token-surgeon lens. Extract repeated visual decisions into tokens and component contracts." |
| before/after safety | `screenshot-regression-guard` | "Use codex-visual-builder-guild with the screenshot-regression-guard lens. Capture baselines and compare screenshots after changes." |
| ugly real data testing | `real-content-layout-fuzzer` | "Use codex-visual-builder-guild with the real-content-layout-fuzzer lens. Stress the UI with ugly realistic content." |
| accessibility confidence | `visual-accessibility-sentinel` | "Use codex-visual-builder-guild with the visual-accessibility-sentinel lens. Check contrast, focus, tap targets, color-only meaning, and motion sensitivity." |
| visual variants | `ab-visual-lab` | "Use codex-visual-builder-guild with the ab-visual-lab lens. Create three visual variants, screenshot them, compare them, and choose the winner." |
| stronger hero sections | `hero-image-cinematographer` | "Use codex-visual-builder-guild with the hero-image-cinematographer lens. Make the first viewport communicate the product immediately." |
| calmer SaaS/admin screens | `saas-dashboard-operator` | "Use codex-visual-builder-guild with the saas-dashboard-operator lens. Make this dashboard dense, readable, scannable, and easy to operate repeatedly." |
| game UI polish | `game-ui-polish` | "Use codex-visual-builder-guild with the game-ui-polish lens. Review the HUD, inventory, stats, controls, and mobile layout like a player." |
| motion and feedback | `motion-and-feedback-director` | "Use codex-visual-builder-guild with the motion-and-feedback-director lens. Polish hover, loading, transitions, progress, and feedback." |
| asset traceability | `asset-provenance-librarian` | "Use codex-visual-builder-guild with the asset-provenance-librarian lens. Track generated assets, prompts, usage intent, and replacement notes." |

## Delegation Map

![Delegation map](assets/delegation-map.png)

`visual-loop-qa` is the guild captain. It does not try to solve every problem alone. It looks at the screenshot, names the failure class, and sends the right job to the right specialist.

```mermaid
flowchart TD
  V["visual-loop-qa"]
  V --> Asset["imagegen-asset-director"]
  V --> Resp["responsive-vision-auditor"]
  V --> State["interaction-state-inspector"]
  V --> Brand["brand-consistency-enforcer"]
  V --> Bible["art-bible-extractor"]
  V --> Tokens["design-token-surgeon"]
  V --> Regress["screenshot-regression-guard"]
  V --> Fuzz["real-content-layout-fuzzer"]
  V --> A11y["visual-accessibility-sentinel"]

  Asset --> Provenance["asset-provenance-librarian"]
  State --> Motion["motion-and-feedback-director"]
  Bible --> Tokens
  Fuzz --> Resp
  A11y --> State
```

Every handoff uses H70-C+ `delegates_version: 2` contracts:

- `pass_context`: what the specialist receives
- `expect_back`: what the specialist must return
- `sla`: whether the handoff is synchronous or async

## Specialist Wing

![Specialist wing](assets/specialist-wing.png)

The delegation map shows the core routing. The specialist wing rounds out the full 16-skill roster with the skills that tend to activate after a visual issue becomes more specific.

The point is simple: one big vague prompt like "make it look better" becomes a team of smaller, sharper jobs.

## Three Ways To Use It

![Use it in Codex, standalone YAML, or Spark Skill Graphs](assets/use-it-two-ways.png)

**Codex Desktop**: install `codex/codex-visual-builder-guild` as a native Codex skill with `npm run install:codex`, then invoke it by name. This is the easiest path for most people.

**Standalone YAML**: load any file in `design/*.yaml` directly into an agent, prompt system, CLI tool, or custom runtime. Each H70-C+ skill is self-contained. This is the lightest path for agent builders.

**Spark Skill Graphs**: copy the same files into a Spark Skill Graphs checkout. `design/*.yaml` become graph nodes, `delegates` become graph edges, and `bundles/codex-visual-builder-loop.yaml` becomes the recommended guild load order. This is the full graph/dashboard path.

You can ignore the Spark section if you only want the Codex Desktop skill. Spark is for people who want visible graph routing, dashboard inspection, or to reuse the H70-C+ YAML directly.

## Install Into Spark Skill Graphs

From this repo root:

```powershell
Copy-Item -Recurse -Force .\design\*.yaml C:\Users\USER\Desktop\spark-skill-graphs\design\
Copy-Item -Force .\bundles\codex-visual-builder-loop.yaml C:\Users\USER\Desktop\spark-skill-graphs\bundles\
```

Then validate from `spark-skill-graphs`:

```powershell
$env:NODE_PATH='C:\Users\USER\Desktop\spawner-ui\node_modules'
$env:SPAWNER_H70_SKILLS_DIR='C:\Users\USER\Desktop\spark-skill-graphs\design'
node C:\Users\USER\Desktop\spark-skill-graphs\tools\validate-h70-cplus.js
```

If you use the Spark MCP server or dashboard, restart/re-index it after copying the files. Already-running MCP/dashboard processes may keep an older in-memory skill index and return `Skill not found` until restarted.

## Tested Before Ship

![Tested before ship](assets/tested-before-ship.png)

This package includes local checks for the parts that matter most:

- H70-C+ structure
- required 12-section coverage
- embedded disaster detection commands
- embedded anti-pattern detection
- delegate contract completeness
- bundle load order resolution
- common Codex visual-loop invocation cues
- Codex wrapper install and invocation coverage
- beginner first-run documentation coverage
- demo app presence

Validate this package:

```powershell
npm install
npm test
```

Expected result:

```text
Valid H70-C+: 16
Invalid: 0
With warnings: 0
Smoke test passed
Usage audit passed
```

## What Is Inside

- `design/*.yaml`: 16 H70-C+ design skills
- `QUICKSTART.md`: the 30-second, 2-minute, 5-minute path for new users
- `codex/codex-visual-builder-guild/SKILL.md`: native Codex wrapper skill
- `bundles/codex-visual-builder-loop.yaml`: recommended guild load order
- `tools/validate-h70-cplus.js`: H70-C+ structure validator
- `tools/smoke-test.cjs`: practical package smoke test
- `tools/usage-audit.cjs`: Codex install and invocation coverage audit
- `tools/install-codex-skill.cjs`: one-command Codex skill installer
- `PROMPTS.md`: copy-paste prompts for the whole guild and each specialist
- `assets/*.png`: README and X-ready visual explainers

## Infographic Set

- `assets/hero-guild-banner.png`: X and README hero
- `assets/what-you-get.png`: install value
- `assets/how-it-works.png`: visual builder loop
- `assets/delegation-map.png`: specialist routing
- `assets/specialist-wing.png`: remaining specialist roster
- `assets/use-it-two-ways.png`: Codex, standalone YAML, and Spark dashboard usage
- `assets/tested-before-ship.png`: validation and trust
