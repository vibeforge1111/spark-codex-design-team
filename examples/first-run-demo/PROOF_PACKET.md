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
Use codex-visual-builder-guild on this app. Run it, screenshot desktop and mobile, fix the single highest-impact visual issue, then show before/after screenshot paths and what changed.
```

Expected flow:

1. Run the demo locally.
2. Capture desktop and mobile screenshots.
3. Use vision to inspect the rendered UI.
4. Pick one highest-impact issue.
5. Fix it.
6. Capture after screenshots.
7. Finish with the Run Report Contract.

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
Accepted visual change:
Still weak:
Reusable rule:
Automation notes:
```

## Example Finding

Problem: the `Before` card text is low contrast, so the most important proof area is hard to read.

Evidence: desktop and mobile screenshots show muted body text on a dark brown panel.

Fix: increase contrast on the proof card text and make the before/after purpose clearer.

Verification: after screenshots show the proof card can be read without zooming, and the final response names the remaining weaknesses.

## What Success Looks Like

A good first run says something like:

```text
Improved: the proof card is now readable on desktop and mobile, and the primary action has clearer hierarchy.
Still weak: the hero copy is broad and the demo still needs real product screenshots.
Screenshots:
- screenshots/before-desktop.png
- screenshots/before-mobile.png
- screenshots/after-desktop.png
- screenshots/after-mobile.png
Reusable rule: proof areas need readable contrast before visual polish counts.
Automation notes: manual screenshot pass only; no Playwright baseline added for the disposable demo.
```

If the output only says "looks better" without screenshot paths, the loop did not do its job.
