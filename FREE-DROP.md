# Free Drop

`codex-visual-builder-guild` is a free community drop for Codex Desktop, Spark Skill Graphs, and anyone building visual agent workflows with image generation plus vision feedback.

## Public Drop Promise

- Understand it in 30 seconds: Codex looks at real screenshots before judging UI quality.
- Install it in 2 minutes: `npm run install:codex` installs and verifies the native Codex skill.
- Get value in 5 minutes: paste the first-win prompt, fix one visible issue, use at most 1-2 lenses, and get before/after screenshot paths.
- Preserve the evidence: `npm run recommend-workflow`, `npm run create-proof-packet`, `npm run check-proof-packet`, `npm run score-proof-packet`, and `npm run scaffold:playwright-visual` route, create, score, and verify starter artifacts when a screen becomes important.

Start with [`QUICKSTART.md`](QUICKSTART.md) if you are coming from X.

## License

MIT. Use it commercially, privately, publicly, in forks, in demos, in agent runtimes, in your own Spark graph, or as raw YAML.

## What You Can Do

- Copy the skills into your own `spark-skill-graphs` repo.
- Install the native Codex wrapper with `npm run install:codex`.
- Use individual skills as standalone prompt/agent context.
- Use `PROMPTS.md` as a copy-paste spellbook for invoking the full guild or a single specialist.
- Build a dashboard or visualizer around the delegate graph.
- Remix the H70-C+ content for your own design team.
- Add new specialists and open a PR.

## What This Is

A practical skill team for the loop:

```text
build -> run -> screenshot -> vision review -> imagegen/assets -> specialist delegation -> fix -> compare -> capture rules
```

## What This Is Not

- Not a paid product.
- Not locked to one hosted service.
- Not a replacement for Spark Skill Graphs.
- Not magic without screenshots. The whole point is rendered evidence.
- Not a standalone replacement for Codex App vision. Screenshots exist so Codex can actually see the UI.
- Not an invitation to summon every specialist. Most useful runs should stay small.

## Community Rule

If you improve the pack, keep the graph useful:

- preserve H70-C+ structure
- keep delegation contracts explicit
- make disasters concrete
- prefer screenshot evidence over taste arguments
- keep `visual-loop-qa` as the router unless there is a strong reason to split orchestration
