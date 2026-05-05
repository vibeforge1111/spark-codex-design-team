---
name: codex-visual-builder-guild
description: Use when Codex should improve visual UI/UX through a screenshot-driven design loop with imagegen assets, vision review, responsive checks, interaction states, accessibility, A/B variants, design tokens, art bible extraction, and specialist-style delegation. Trigger when the user asks for the Codex Visual Builder Guild, visual builder loop, imagegen plus vision workflow, designer guild, UI polish, README/X launch visuals, game UI polish, SaaS dashboard polish, or to make an app look production-ready through screenshots.
---

# Codex Visual Builder Guild

Act like a visual product team, not a one-shot code generator.

## Core Loop

Use this loop for visual work:

```text
build -> run -> screenshot -> vision review -> delegate -> fix -> compare -> keep the rules
```

1. Clarify the product goal when needed.
2. Run the app locally when possible.
3. Capture screenshots for desktop and mobile.
4. Inspect real rendered output with vision.
5. Route narrow issues to the right guild specialist.
6. Make focused code or asset changes.
7. Re-screenshot and compare before/after.
8. Summarize what changed and any reusable design rules.

## Minimum Useful Pass

When the user is new, rushed, or coming from the public repo, do not invoke the whole guild by default. First deliver one visible win:

1. Run the app.
2. Capture desktop and mobile screenshots.
3. Name the top 3 visible issues.
4. Fix the highest-impact issue.
5. Capture after screenshots.
6. Report the before/after screenshot paths, what improved, what stayed weak, and one reusable rule.

Only route to a specialist when that lens changes the next action.

## Run Report Contract

Every guild run must end with a compact report that proves the visual decision loop happened:

- `goal`: the user-facing visual/product problem being solved.
- `screenshots inspected`: before and after screenshot paths, with viewport names.
- `top issues`: the top 3 visible issues found from screenshots.
- `chosen issue`: the issue fixed first and why it was highest impact.
- `lens used`: the specialist lens used, or `none` with a reason.
- `exact fix`: the files or assets changed and the smallest design decision made.
- `verification`: what the after screenshots prove.
- `still weak`: what remains risky, confusing, or unproven.
- `reusable rule`: one design rule future work should inherit.

If screenshot paths or a verification claim are missing, the run is incomplete.

## Specialist Output Contract

Every specialist lens should return concrete evidence, not ceremony:

- `problem`: the visible failure it is solving.
- `evidence`: screenshot, viewport, state, or content case that proves the problem.
- `fix`: the smallest change that should improve the rendered UI.
- `verification`: the screenshot, state, or rule that proves the fix worked.
- `residual risk`: what still might fail.

## Specialist Routing

Use these specialist lenses:

- `visual-loop-qa`: orchestrate the full visual loop.
- `imagegen-asset-director`: create UI-ready generated assets and judge them in context.
- `responsive-vision-auditor`: verify mobile, tablet, desktop, and wide layouts.
- `interaction-state-inspector`: inspect hover, focus, modal, dropdown, loading, empty, error, and keyboard states.
- `brand-consistency-enforcer`: keep screens visually coherent.
- `art-bible-extractor`: convert winning screenshots into reusable design rules.
- `design-token-surgeon`: convert repeated visual choices into tokens or component contracts.
- `screenshot-regression-guard`: preserve before/after screenshot evidence.
- `real-content-layout-fuzzer`: stress the UI with ugly realistic content.
- `visual-accessibility-sentinel`: check contrast, focus, tap targets, color-only meaning, and motion safety.
- `ab-visual-lab`: create and compare visual variants.
- `hero-image-cinematographer`: make first viewports image-led and immediately legible.
- `saas-dashboard-operator`: make operational UIs dense, calm, and scannable.
- `game-ui-polish`: review HUDs, inventories, stats, controls, and player readability.
- `motion-and-feedback-director`: polish useful motion, loading, progress, and feedback.
- `asset-provenance-librarian`: track generated assets, prompts, usage intent, and replacement notes.

## Operating Rules

- Prefer rendered evidence over taste arguments.
- Start with the minimum useful pass unless the user explicitly asks for the full guild.
- End with the Run Report Contract so the user can judge the work.
- Use imagegen for real assets, not decorative filler.
- Use vision to judge the integrated UI, not just the source image.
- Fix the highest-impact visual issue first.
- Do not invoke specialist lenses just to name them; each lens must produce a concrete artifact.
- Keep edits compatible with the existing codebase and design system.
- Do not stop at the first draft when screenshots show obvious visual problems.
- Preserve screenshots, prompts, or notes when they are useful for future design consistency.

## Common Invocations

For full guild work:

```text
Use codex-visual-builder-guild. Run the app, screenshot desktop and mobile, inspect with vision, delegate issues to the right specialists, fix, compare before/after, and summarize the final design rules.
```

For a known specialist:

```text
Use codex-visual-builder-guild with the responsive-vision-auditor lens. Check this screen across mobile, tablet, desktop, and wide layouts, then fix the issues.
```

For a launch/X walkthrough:

```text
Use codex-visual-builder-guild and record the journey: first screenshot, top visual problems, specialist delegation, fixes, final screenshot, and a plain-English before/after summary.
```

## Spark Mode

If the project has Spark Skill Graphs installed with this repo's `design/*.yaml` files, prefer the H70-C+ YAML contracts as the source of truth for detailed delegation. Otherwise, use this Codex skill as a standalone wrapper.
