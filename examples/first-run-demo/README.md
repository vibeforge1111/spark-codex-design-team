# First-Run Demo

This is a tiny static app with intentional visual problems. It exists so new users can prove the guild works before pointing it at their real product.

## Run It

From this folder:

```powershell
python -m http.server 5177
```

Open:

```text
http://127.0.0.1:5177
```

Then paste this into Codex Desktop:

```text
Use codex-visual-builder-guild on this demo app.

Run it locally, take desktop, tablet, mobile, and awkward in-between screenshots, inspect the rendered UI with Codex App vision, name the top 3 visual issues, fix the highest-impact one, then capture after screenshots.

End with a plain-English before/after summary and the screenshot paths.
```

## What The Guild Should Notice

- The hero claim is vague.
- The action area has weak hierarchy.
- The "Before" proof card is low contrast.
- Long creator/project text stresses the layout.
- Mobile should be checked with desktop, tablet, mobile, and awkward in-between screenshots, not guessed from CSS.

The goal is not to make this demo fancy. The goal is to show the screenshot loop catching real, intentional visual problems quickly.

See [`PROOF_PACKET.md`](PROOF_PACKET.md) for what a useful first run should return.
