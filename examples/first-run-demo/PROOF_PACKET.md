# Demo Proof Packet

This file shows what a useful first run should produce. It is not a promise that every app has the same issue; it is the expected evidence shape.

## Before

The demo starts with intentional problems:

- Vague hero promise: "Ship prettier AI UI faster" does not show what changed.
- Weak action hierarchy: both actions compete without enough context.
- Low-contrast proof card: the `Before` card is hard to read.
- Real-content stress: a very long generated project title tests wrapping.
- Mobile uncertainty: CSS alone does not prove the layout works.

## Minimum Useful Guild Pass

Prompt:

```text
Use codex-visual-builder-guild on this app. Run it, screenshot desktop, tablet, mobile, and one awkward in-between width, inspect screenshots with Codex App vision, fix the single highest-impact visual issue, run the Post-Fix Ruthlessness Check, then show before/after screenshot paths and what changed.
```

Expected flow:

1. Run the demo locally.
2. Capture desktop, tablet, mobile, and awkward in-between screenshots.
3. Use Codex App vision to inspect the rendered UI.
4. Pick one highest-impact issue.
5. Fix it.
6. Capture after screenshots.
7. Run the Post-Fix Ruthlessness Check for awkward leftovers.
8. Finish with the Run Report Contract.

## Run Report Contract

Every useful run should answer:

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
Post-fix ruthlessness:
Accepted visual change:
Still weak:
Reusable rule:
Automation notes:
```

## Example Finding

Problem: the `Before` card text is low contrast, so the most important proof area is hard to read.

Evidence: desktop, tablet, mobile, and awkward in-between screenshots show muted body text on a dark brown panel.

Fix: increase contrast on the proof card text and make the before/after purpose clearer.

Verification: after screenshots show the proof card can be read without zooming, and the final response names the remaining weaknesses.

Post-fix ruthlessness: after screenshots still show the demo is intentionally simple, but no higher-impact leftover onboarding copy, duplicated action, or box soup remains for the disposable target.

## What Success Looks Like

A good first run says something like:

```text
Improved: the proof card is now readable on desktop, tablet, mobile, and awkward in-between, and the primary action has clearer hierarchy.
Still weak: the hero copy is broad and the demo still needs real product screenshots.
Screenshots:
- screenshots/before-desktop.png
- screenshots/before-tablet.png
- screenshots/before-mobile.png
- screenshots/before-fluid.png
- screenshots/after-desktop.png
- screenshots/after-tablet.png
- screenshots/after-mobile.png
- screenshots/after-fluid.png
Reusable rule: proof areas need readable contrast before visual polish counts.
Post-fix ruthlessness: no higher-impact leftover issue beat the proof-card contrast fix in the after screenshots.
Automation notes: manual screenshot pass only; no Playwright baseline added for the disposable demo.
```

If the output only says "looks better" without screenshot paths and vision observations, the loop did not do its job.
