# Prompt Spellbook

Copy these into Codex Desktop when you want the guild to do specific visual work. Replace bracketed parts with your project details.

If you installed the native Codex skill with `npm run install:codex`, start prompts with `Use codex-visual-builder-guild`. If you are using the raw H70-C+ YAML in Spark, the specialist IDs still map to the same skills.

## Shortest Useful Prompt

```text
Use codex-visual-builder-guild on this app. Run it, screenshot desktop and mobile, fix the single highest-impact visual issue, use at most 1-2 specialist lenses only if screenshots prove they are needed, then finish with the Run Report Contract: goal, viewport matrix, state matrix, screenshots inspected, top issues, chosen issue, lens used, exact fix, verification, accepted visual change, still weak, reusable rule, automation notes.
```

## Install Then Invoke

```powershell
git clone https://github.com/vibeforge1111/codex-visual-builder-guild.git
cd codex-visual-builder-guild
npm install
npm run install:codex
```

Then restart Codex Desktop or start a new session and say:

```text
Use codex-visual-builder-guild to run the visual builder loop on this app.
```

## First 5-Minute Win

Use this first if you just installed the guild and want to see whether it works.

```text
Use codex-visual-builder-guild on this app.

Run it locally, take desktop and mobile screenshots, inspect the rendered UI with vision, name the top 3 visual issues, fix the highest-impact one, then capture after screenshots.

End with the Run Report Contract: goal, viewport matrix, state matrix, screenshots inspected with screenshot paths, top issues, chosen issue, lens used, exact fix, verification, accepted visual change, still weak, reusable rule, automation notes.
```

Good output should include:

- the first desktop and mobile screenshots
- the highest-impact issue chosen
- the specialist lens used only if it helped the fix; otherwise `lens used: none`
- the after screenshots
- what improved, what stayed weak, and one reusable design rule
- automation notes saying whether this was manual-only or protected by Playwright, axe, Storybook/Chromatic, Lighthouse, or a project-local check

Optional scaffold before the run:

```powershell
npm run recommend-workflow -- --need "first demo polish"
npm run create-proof-packet -- --cwd ../my-app
npm run check-proof-packet -- --cwd ../my-app
```

## No-Ceremony Routed Pass

Use this after the first run, or when you know the guild was getting too theatrical.

```text
Use codex-visual-builder-guild on this app as a no-ceremony visual QA pass.

Run the app, capture before screenshots on desktop and mobile, inspect the rendered UI, and route to at most two specialist lenses based only on screenshot evidence. If no specialist lens changes the next action, say so and use none.

Fix the single highest-impact issue, capture matching after screenshots, and finish with the full Run Report Contract including viewport matrix, state matrix, accepted visual change, and automation notes.
```

## Regression Hardening Pass

Use this when a screen became important enough to protect.

```text
Use codex-visual-builder-guild with the screenshot-regression-guard lens.

Run the app, capture stable before screenshots for the important viewport and state matrix, identify volatile elements that should be masked or excluded, then add the smallest project-local visual regression recipe that fits this repo. Prefer Playwright toHaveScreenshot if Playwright is already installed; otherwise document the manual screenshot baseline path.

Verify the check or explain why it stayed manual. Finish with screenshot paths, accepted visual change, and automation notes.
```

Optional scaffold before asking Codex:

```powershell
npm run scaffold:playwright-visual -- --cwd ../my-app --url http://127.0.0.1:5173 --name dashboard
```

## Accessibility Evidence Pass

```text
Use codex-visual-builder-guild with the visual-accessibility-sentinel lens.

Inspect the rendered UI for contrast, focus visibility, keyboard reachability, tap targets, color-only meaning, and motion risk. If Playwright and axe are already available, run or add a minimal axe check for the relevant page state. Do not claim full accessibility from automated checks alone.

Finish with screenshot paths, any automated accessibility result, remaining manual risks, and the reusable rule.
```

## Full Guild

```text
Use codex-visual-builder-guild as a visual product team.

Goal: [describe what we are building].

Run the app locally, take screenshots on desktop and mobile, inspect the rendered UI with vision, and delegate issues to the right specialists. Use at most 1-2 specialist lenses unless screenshot evidence proves more are needed. Use imagegen when custom assets would improve the product. Focus on hierarchy, spacing, contrast, text fit, responsive layout, interaction states, accessibility, and visual consistency.

Do not stop at the first draft. Iterate until the UI feels polished, compare before/after screenshots, and summarize the final design rules plus any automation notes.
```

## First Draft To Polished UI

```text
Use codex-visual-builder-guild. Run this app as a Codex visual builder loop.

Build the smallest working version, open it locally, screenshot desktop and mobile, inspect with vision, and fix the highest-impact visual issues first. Delegate to specialist skills when the issue is about assets, responsiveness, accessibility, interaction states, design tokens, or screenshot regression.

Finish only after the before/after screenshots show a clearly more polished product.
```

## Visual Loop QA

```text
Use codex-visual-builder-guild with the visual-loop-qa lens.

Run the app, capture screenshots on desktop and mobile, inspect the rendered UI with vision, identify the highest-impact visual issues, delegate each issue to the right specialist lens, apply fixes, and compare before/after screenshots before finishing.
```

## Imagegen Asset Direction

```text
Use codex-visual-builder-guild with the imagegen-asset-director lens.

Create UI-ready assets for [product/screen/game]. Match the existing style, generate only assets that will be used in the interface, and avoid generic filler. After generating, integrate the assets, screenshot them in context, and revise if they clash with the UI.
```

## Responsive Review

```text
Use codex-visual-builder-guild with the responsive-vision-auditor lens.

Check this screen at mobile, tablet, desktop, and wide desktop sizes. Use screenshots and vision review to find cramped spacing, overflowing text, broken grids, weak tap targets, hidden controls, and awkward hierarchy. Fix the layout and re-screenshot the important breakpoints.
```

## Interaction States

```text
Use codex-visual-builder-guild with the interaction-state-inspector lens.

Click through the main user flows. Inspect hover, focus, active, disabled, loading, empty, error, modal, dropdown, and keyboard states. Fix states that are missing, confusing, visually inconsistent, or hard to use.
```

## Brand Consistency

```text
Use codex-visual-builder-guild with the brand-consistency-enforcer lens.

Compare the main screens and make them feel like one product. Look for mismatched spacing, button styles, colors, typography, icon style, card treatment, tone, and visual density. Fix drift and summarize the product's visual rules.
```

## Art Bible Extraction

```text
Use codex-visual-builder-guild with the art-bible-extractor lens.

Study the best screenshots in this app and extract a reusable art bible: palette, typography, spacing, layout patterns, component rules, image style, motion feel, and things to avoid. Make it practical enough that future screens can follow it.
```

## Design Tokens

```text
Use codex-visual-builder-guild with the design-token-surgeon lens.

Find repeated visual decisions in the UI and turn them into durable design tokens or component rules. Focus on color, type, spacing, radius, shadows, borders, states, and layout constants. Keep the implementation simple and compatible with the existing codebase.
```

## Screenshot Regression

```text
Use codex-visual-builder-guild with the screenshot-regression-guard lens.

Capture before screenshots for the important screens and states. After changes, capture after screenshots and compare them. Flag unexpected visual regressions and fix them before finishing.
```

## Real Content Stress Test

```text
Use codex-visual-builder-guild with the real-content-layout-fuzzer lens.

Stress the UI with realistic messy content: long names, short names, empty states, dense rows, missing images, long translations, error messages, large numbers, and awkward edge cases. Screenshot failures and fix the layout so it survives real use.
```

## Accessibility Review

```text
Use codex-visual-builder-guild with the visual-accessibility-sentinel lens.

Review the UI for contrast, readable text size, focus visibility, keyboard reachability, tap target size, color-only meaning, reduced-motion concerns, and disabled/error state clarity. Fix issues and verify with screenshots.
```

## A/B Visual Lab

```text
Use codex-visual-builder-guild with the ab-visual-lab lens.

Create three visual variants for [screen/section/component]. Screenshot each on desktop and mobile. Compare them for readability, hierarchy, brand fit, clarity, and user flow. Pick the winner, apply it, and explain why it won.
```

## Hero Image Cinematography

```text
Use codex-visual-builder-guild with the hero-image-cinematographer lens.

Make the first viewport communicate the product immediately. Use a strong image-led composition, clear hierarchy, real product context, and enough hint of the next section. Avoid generic decorative gradients or stock-like filler. Screenshot and revise until the hero works at desktop and mobile sizes.
```

## SaaS Dashboard Polish

```text
Use codex-visual-builder-guild with the saas-dashboard-operator lens.

Polish this dashboard for repeated work. Prioritize scanability, dense but calm layout, clear tables, useful filters, predictable navigation, readable metrics, and low-friction actions. Avoid marketing-page styling. Screenshot the final desktop and mobile states.
```

## Game UI Polish

```text
Use codex-visual-builder-guild with the game-ui-polish lens.

Review this game screen like a player. Check HUD readability, inventory clarity, stats, controls, feedback, mobile layout, hit targets, icon meaning, and whether the most important state is obvious at a glance. Fix issues and re-test with screenshots.
```

## Motion And Feedback

```text
Use codex-visual-builder-guild with the motion-and-feedback-director lens.

Polish the app's motion and feedback. Check hover, press, loading, progress, transitions, success, failure, and empty-state feedback. Keep motion useful and restrained. Verify that the app feels responsive without distracting the user.
```

## Asset Provenance

```text
Use codex-visual-builder-guild with the asset-provenance-librarian lens.

Inventory generated or external visual assets. Record what each asset is for, where it came from, the prompt or source notes, replacement guidance, and any usage constraints. Keep the project easy to audit and remix.
```

## Quick X Demo Prompt

```text
Use codex-visual-builder-guild on this project and record the journey:

1. Show the first screenshot.
2. Name the top visual problems.
3. Delegate each problem to the right specialist.
4. Apply the fixes.
5. Show the final screenshot.
6. Summarize the before/after in plain English.

Make the result easy for builders on X to understand.
```
