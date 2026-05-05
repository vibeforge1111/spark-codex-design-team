# spark-codex-design-team

H70-C+ Spark Skill Graphs for Codex Desktop visual product building.

This pack turns the imagegen plus vision workflow into a disciplined specialist team:

```text
prompt -> build -> run -> screenshot -> vision review -> specialist delegation -> revise -> compare -> extract rules
```

Imagegen creates source material. Vision judges the rendered product. The skills in this repo keep that loop grounded in screenshots, responsive states, interaction states, accessibility, brand consistency, design tokens, and regression safety.

## What's Included

- `design/*.yaml`: 16 H70-C+ design skills
- `bundles/codex-visual-builder-loop.yaml`: recommended load order for the team
- `tools/validate-h70-cplus.js`: H70-C+ structure validator

## Core Team

- `visual-loop-qa`: router and visual QA orchestrator
- `imagegen-asset-director`: UI-ready generated asset direction
- `responsive-vision-auditor`: viewport truth across mobile, tablet, desktop, and wide screens
- `interaction-state-inspector`: hover, focus, modal, dropdown, loading, error, and keyboard states
- `brand-consistency-enforcer`: cross-screen product language consistency
- `art-bible-extractor`: screenshot-derived visual rules
- `design-token-surgeon`: durable tokens and component contracts
- `screenshot-regression-guard`: before/after visual baselines
- `real-content-layout-fuzzer`: ugly real data stress states
- `visual-accessibility-sentinel`: contrast, focus, tap target, colorblind, and motion safety

## Optional Specialists

- `ab-visual-lab`
- `hero-image-cinematographer`
- `saas-dashboard-operator`
- `game-ui-polish`
- `motion-and-feedback-director`
- `asset-provenance-librarian`

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

## Validate This Package

```powershell
npm install
npm run validate
```

Expected result:

```text
Valid H70-C+: 16
Invalid: 0
With warnings: 0
```

## Design Principle

The pack is intentionally hub-and-specialist:

- `visual-loop-qa` owns orchestration and final visual judgment.
- Specialists own narrow failure classes.
- `delegates_version: 2` makes every handoff carry context, expected output, and timing.
- Winning screens get converted into art bibles, tokens, or screenshot baselines so taste does not evaporate.
