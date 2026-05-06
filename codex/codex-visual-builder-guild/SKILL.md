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
3. Capture screenshots for desktop, tablet, mobile, and at least one fluid in-between width when layout risk matters.
4. Inspect real rendered output with vision.
5. Route narrow issues to the right guild specialist.
6. Make focused code or asset changes.
7. Re-screenshot and compare before/after.
8. Summarize what changed and any reusable design rules.

## Minimum Useful Pass

When the user is new, rushed, or coming from the public repo, do not invoke the whole guild by default. First deliver one visible win:

1. Run the app.
2. Capture desktop, tablet, mobile, and one fluid in-between screenshot when the app has responsive layout risk.
3. Name the top 3 visible issues.
4. Fix the highest-impact issue.
5. Capture after screenshots.
6. Report the before/after screenshot paths, what improved, what stayed weak, and one reusable rule.

## Responsive Viewport Discipline

Default responsive coverage for web UI work:

- `desktop`: a wide/laptop viewport such as 1440x1000.
- `tablet`: a middle viewport such as 834x1112 or 1024x768.
- `mobile`: a phone viewport such as 390x844.
- `fluid breakpoint`: at least one awkward in-between width near a layout transition, such as 1180x900, 1280x900, or the user's reported screenshot size.

For each responsive screenshot, use vision to answer:

- Does any text wrap into unreadable columns?
- Do controls clip, overlap, disappear, or become too small to tap?
- Do side rails, cards, toolbars, and composers keep useful proportions?
- Does the visual hierarchy survive the transition between mobile/tablet/desktop?
- Is horizontal overflow intentional, or is it a layout bug?

If a middle-width screenshot finds a bug that named desktop or mobile checks missed, prefer fixing the fluid layout rule over hard-coding one exact viewport.

Only route to a specialist when that lens changes the next action.

## Lens Router

Default to `visual-loop-qa` plus at most 1-2 specialist lenses. Route by rendered evidence:

| Evidence from screenshot or interaction | Lens |
| --- | --- |
| mobile/tablet/fluid-width crop, hidden controls, cramped taps, broken wrapping, unreadable columns, accidental horizontal overflow | `responsive-vision-auditor` |
| dashboard is pretty but not useful for repeated operation | `saas-dashboard-operator` |
| setup guidance crowds the main work canvas, empty states feel like product setup, first-run path is unclear, or onboarding does not explain readiness | `saas-dashboard-operator` + `interaction-state-inspector` |
| hover, focus, modal, loading, empty, disabled, or error state is unknown | `interaction-state-inspector` |
| contrast, focus visibility, tap target, or color-only meaning is risky | `visual-accessibility-sentinel` |
| long content, empty data, huge numbers, missing images, or ugly real data breaks layout | `real-content-layout-fuzzer` |
| generated/external asset quality matters to the UI | `imagegen-asset-director` |
| visual change should become a baseline | `screenshot-regression-guard` |
| repeated styling choices are drifting | `brand-consistency-enforcer` or `design-token-surgeon` |
| multiple strong visual directions exist | `ab-visual-lab` |

If no row applies, use `lens used: none - minimum useful pass was enough`.

## Codex App Native Capability Router

Use Codex App features as first-class guild tools:

| Need | Native move |
| --- | --- |
| judge a rendered screen | capture a screenshot, inspect it with Codex App vision, and cite the image path |
| compare before/after | show or reference both local screenshot paths and describe the visual delta Codex saw |
| inspect the user's current page | use the in-app browser URL as live context, then screenshot that rendered state |
| create a custom visual asset | use the `imagegen` skill only when the asset will clarify the product, integrate it, then inspect the integrated screen with vision |
| explain work to the user | use absolute local screenshot paths, clickable file links, and concise visual observations |
| keep a reusable rule | capture the accepted screenshot and hand it to `screenshot-regression-guard` or `art-bible-extractor` |

Positive guardrails:

- Prefer Codex App vision over external image-analysis scripts.
- Prefer native imagegen for meaningful assets over decorative gradients, stock-like filler, or unused mock art.
- Prefer rendered screenshots over DOM guesses; use metrics and tests only to support what vision saw.
- Prefer app-native artifacts the user can open immediately: local screenshots, local files, and concise report sections.
- If a workflow is specific to Codex App, optimize for Codex App rather than generic CLI portability.

## Lens Handoff Protocol

When more than one lens is useful, pass a compact handoff packet instead of restarting the review from vibes. Every packet must be backed by Codex App vision on a real screenshot or rendered state. A filename, DOM metric, test result, or source-code read is supporting evidence only; it is not enough.

```text
from lens -> to lens
vision source: screenshot path plus viewport/state inspected
vision observation: what Codex actually saw in the image
supporting evidence: optional DOM metric, test result, or source-code fact
finding: the concrete visible problem or rule discovered from vision
decision: fix now, verify after fix, or keep as residual risk
next vision check: the exact screenshot, interaction state, or content case the next lens must inspect with vision
```

Default handoffs:

- `responsive-vision-auditor` -> `interaction-state-inspector` when a breakpoint fix could affect taps, focus, modal behavior, or hidden panels.
- `interaction-state-inspector` -> `visual-accessibility-sentinel` when the fix changes focus rings, disabled states, contrast, color-only meaning, or tap target size.
- `real-content-layout-fuzzer` -> `responsive-vision-auditor` when ugly content changes wrapping, grid width, or scrolling.
- `saas-dashboard-operator` -> `interaction-state-inspector` when a workflow change adds or moves actions, setup steps, empty states, or job/status cards.
- any lens -> `screenshot-regression-guard` when the accepted visual change should become a reusable baseline or future guardrail.
- any lens -> `brand-consistency-enforcer` when the fix introduces a new visual pattern that might drift from the existing product language.

Do not hand off just to use another specialist. Stop when the next lens would not change a decision, screenshot, vision observation, test, or reusable rule.

If you cannot inspect the screenshot with vision, say `vision handoff blocked` and do not claim a specialist handoff happened.

## Run Report Contract

Every guild run must end with a compact report that proves the visual decision loop happened:

- `goal`: the user-facing visual/product problem being solved.
- `viewport matrix`: desktop/tablet/mobile/fluid-width coverage, or `not checked`.
- `state matrix`: default/hover/focus/loading/empty/error coverage, or `not checked`.
- `screenshots inspected`: before and after screenshot paths, with viewport names.
- `vision observations`: concrete things Codex saw in the screenshots, separated by viewport/state. Do not infer this from code.
- `top issues`: the top 3 visible issues found from screenshots.
- `chosen issue`: the issue fixed first and why it was highest impact.
- `lens used`: the specialist lens used, or `none` with a reason.
- `handoff log`: each vision-backed lens handoff packet used, or `none - single-lens pass`.
- `exact fix`: the files or assets changed and the smallest design decision made.
- `verification`: what the after screenshots prove.
- `accepted visual change`: the intentional before/after difference to preserve.
- `still weak`: what remains risky, confusing, or unproven.
- `reusable rule`: one design rule future work should inherit.
- `automation notes`: manual-only, Playwright screenshot baseline, axe check, Storybook/Chromatic, Lighthouse/Web Vitals, or project-specific check.

If screenshot paths or a verification claim are missing, the run is incomplete.

## Specialist Output Contract

Every specialist lens should return concrete evidence, not ceremony:

- `problem`: the visible failure it is solving.
- `evidence`: screenshot, viewport, state, or content case plus the vision observation that proves the problem.
- `fix`: the smallest change that should improve the rendered UI.
- `verification`: the screenshot, state, or rule that proves the fix worked.
- `residual risk`: what still might fail.
- `handoff next`: which lens should verify this next with vision, or `stop` with a reason.

## Specialist Routing

Use these specialist lenses:

- `visual-loop-qa`: orchestrate the full visual loop.
- `imagegen-asset-director`: create UI-ready generated assets and judge them in context.
- `responsive-vision-auditor`: verify mobile, tablet, desktop, wide, and awkward fluid-breakpoint layouts.
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
- `saas-dashboard-operator` + `interaction-state-inspector`: use together when setup guidance crowds the main work canvas, empty states feel like product setup, first-run path is unclear, or onboarding does not explain readiness.
- `game-ui-polish`: review HUDs, inventories, stats, controls, and player readability.
- `motion-and-feedback-director`: polish useful motion, loading, progress, and feedback.
- `asset-provenance-librarian`: track generated assets, prompts, usage intent, and replacement notes.

## Operating Rules

- Prefer rendered evidence over taste arguments.
- Start with the minimum useful pass unless the user explicitly asks for the full guild.
- Use at most 1-2 specialist lenses unless screenshots prove more are needed.
- End with the Run Report Contract so the user can judge the work.
- Use imagegen for real assets, not decorative filler.
- Use actual Codex App vision to judge the integrated UI, not just the source image or source code.
- Record vision observations before naming the chosen issue.
- Use Codex App vision heavily: inspect before screenshots, after screenshots, and any state or breakpoint that a handoff depends on.
- Fix the highest-impact visual issue first.
- If screenshot evidence shows setup guidance fighting the main task surface, move it into first-run onboarding or a reusable setup checklist instead of polishing the misplaced card.
- When multiple lenses apply, write the vision-backed handoff packet before making the next fix so the next lens inherits what was seen rather than repeating the same review.
- Do not invoke specialist lenses just to name them; each lens must produce a concrete artifact.
- Keep edits compatible with the existing codebase and design system.
- Do not stop at the first draft when screenshots show obvious visual problems.
- Preserve screenshots, prompts, or notes when they are useful for future design consistency.

## Common Invocations

For full guild work:

```text
Use codex-visual-builder-guild. Run the app, screenshot desktop, tablet, mobile, and one awkward in-between width, inspect with Codex App vision, delegate issues to the right specialists, fix, compare before/after, and summarize the final design rules.
```

For a known specialist:

```text
Use codex-visual-builder-guild with the responsive-vision-auditor lens. Check this screen across mobile, tablet, desktop, wide, and awkward fluid-breakpoint layouts, then fix the issues.
```

For a launch/X walkthrough:

```text
Use codex-visual-builder-guild and record the journey: first screenshot, top visual problems, specialist delegation, fixes, final screenshot, and a plain-English before/after summary.
```

## Spark Mode

If the project has Spark Skill Graphs installed with this repo's `design/*.yaml` files, prefer the H70-C+ YAML contracts as the source of truth for detailed delegation. Otherwise, use this Codex skill as a standalone wrapper.
