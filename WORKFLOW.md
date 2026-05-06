# Evidence-First Workflow

The guild should feel like a small visual QA system, not a role-playing ceremony. Use the smallest pass that can prove a better rendered product.

## Default: Minimum Useful Pass

Use this when a builder wants value fast.

1. Run the app locally.
2. Capture before screenshots for desktop, tablet, mobile, and one awkward in-between width.
3. Inspect the screenshots with actual Codex App vision.
4. Record concrete vision observations by viewport.
5. Name the top 3 visible issues.
6. Pick the single highest-impact issue.
7. Use at most 1-2 specialist lenses, only if they change the next action.
8. Fix the issue.
9. Capture matching after screenshots.
10. Finish with the Run Report Contract.

Screenshots are not the value by themselves. They are the evidence Codex App vision needs before making a visual claim.

## Lens Router

Start with `visual-loop-qa`, then route only when the screenshot proves a specific failure class.

| Screenshot evidence | Lens to use | Why |
| --- | --- | --- |
| Mobile, tablet, or fluid-width crop, wrapping, hidden controls, cramped taps, unreadable columns, or horizontal overflow | `responsive-vision-auditor` | The issue depends on viewport behavior. |
| Dashboard is pretty but not operationally clear | `saas-dashboard-operator` | The issue is information architecture and repeated use. |
| Hover, focus, modal, loading, disabled, or error states are unknown | `interaction-state-inspector` | The issue is a state, not a static screen. |
| Contrast, focus visibility, target size, or color-only meaning is risky | `visual-accessibility-sentinel` | The issue affects whether people can use the UI. |
| Long real content, empty states, huge numbers, or missing media break layout | `real-content-layout-fuzzer` | The issue depends on realistic data. |
| A generated or external asset is central to the UI | `imagegen-asset-director` | The issue needs an asset judged in context. |
| A visual change should be preserved as a baseline | `screenshot-regression-guard` | The issue needs before/after evidence for future runs. |
| Repeated styling choices are drifting across screens | `brand-consistency-enforcer` or `design-token-surgeon` | The issue is system consistency. |
| Multiple plausible directions exist | `ab-visual-lab` | The issue needs compared variants, not taste debate. |

If no row applies, do not invoke a specialist. Say `lens used: none - minimum useful pass was enough`.

## Workflow Needs Matrix

Different builders need different proof. Pick the smallest lane that matches the job.

Ask the repo for a recommendation:

```powershell
npm run recommend-workflow -- --need "dashboard mobile regression"
```

| Need | Default output | Extra proof when it matters |
| --- | --- | --- |
| first public demo polish | before/after desktop, tablet, mobile, and fluid-width screenshots | proof packet checked with `npm run check-proof-packet` |
| SaaS/admin/dashboard work | command surface, scannable metrics, clear next action | `saas-dashboard-operator` plus real-content stress |
| mobile reliability | mobile, tablet, and fluid-width screenshots before/after plus tap-target review | wide matrix if layout has breakpoints |
| component library work | state matrix for component states | Storybook/Chromatic visual review |
| accessibility confidence | contrast/focus/tap/color review | axe check plus manual focus screenshot |
| generated visual assets | asset in the real UI, not isolated | asset provenance notes and replacement guidance |
| messy production data | long labels, empty states, large numbers | `real-content-layout-fuzzer` cases preserved |
| regression-sensitive screen | accepted visual change recorded | Playwright `toHaveScreenshot` scaffold |
| performance-sensitive visual change | loading/interactivity/visual stability note | Lighthouse/Web Vitals or project-local perf check |

If the output is only a prettier screenshot with no proof lane, the workflow failed.

## Strong Proof Packet

Every serious run should leave a proof packet that another builder can inspect.

Create the starter file from this repo:

```powershell
npm run create-proof-packet -- --cwd ../my-app
```

After the run, check that the packet has real fields and screenshot paths:

```powershell
npm run check-proof-packet -- --cwd ../my-app
npm run score-proof-packet -- --cwd ../my-app
```

Aim for `95/100` only when the packet has screenshots, actual vision observations, viewport coverage, a specific fix, verification, residual risk, and automation notes. A low score is useful; it means the run was still mostly talk.

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

The `State matrix` can say `not checked` for a quick pass. The `Automation notes` can say `manual screenshot pass only` unless Playwright, Storybook, axe, or Lighthouse checks were actually run.

## Automation Recipes

These are optional. They are for teams that want the guild's Codex loop to become repeatable project infrastructure.

### Playwright Visual Baseline

Use when a screen is important enough to protect from accidental regressions.

Scaffold a starter test from this repo:

```powershell
npm run scaffold:playwright-visual -- --cwd ../my-app --url http://127.0.0.1:5173 --name dashboard
```

```ts
import { expect, test } from '@playwright/test';

test('dashboard visual baseline', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173');
  await expect(page).toHaveScreenshot('dashboard.png', { maxDiffPixels: 100 });
});
```

Playwright supports screenshot baselines, visual diff thresholds, and stylesheet masking for volatile UI. See [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots).

### Storybook Or Chromatic Component States

Use when the product has reusable components with many states. Storybook and Chromatic turn stories into visual test cases and let teams review or accept visual changes as baselines. See [Storybook visual tests](https://storybook.js.org/docs/writing-tests/visual-testing) and [Chromatic visual testing](https://www.chromatic.com/docs/visual/).

### Axe Accessibility Check

Use when the screenshot suggests contrast, focus, semantics, or target-size risk.

```ts
import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('page has no automatic WCAG A/AA violations', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});
```

Automated accessibility scans do not prove full accessibility. They catch a useful subset and should be paired with visual/focus review. See [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing).

### Performance And Visual Stability Note

If the visual change affects loading, layout shift, or heavy media, run Lighthouse or another project-local performance check. Web Vitals frames user experience around loading, interactivity, and visual stability. See [web.dev Web Vitals](https://web.dev/articles/vitals).

## What To Avoid

- Do not invoke many lenses just because they exist.
- Do not claim improvement without screenshot paths.
- Do not treat a pretty desktop screenshot as mobile proof.
- Do not add visual baselines for volatile, unmasked UI.
- Do not confuse axe passing with complete accessibility.
- Do not turn a one-off Codex improvement into CI unless the screen is important enough to maintain.
