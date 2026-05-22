# Benchmarks

This folder is for honest before/after evidence, not marketing claims.

The goal is to compare two workflows on the same UI task:

- **Plain Codex:** normal request, no guild workflow.
- **Guild Codex:** `codex-visual-builder-guild` with screenshot inspection, vision observations, proof packet, and score.

## Installation / Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up any required environment variables (e.g., API keys) in a `.env` file. Refer to the project documentation for specific variables.

4. Run the benchmark suite:
   ```bash
   npm run benchmark
   ```

For detailed instructions, see the main project README.

## Required Result Shape

Each benchmark run should include:

- target app and commit/version
- exact plain Codex prompt
- exact guild Codex prompt
- before screenshots
- plain Codex after screenshots
- guild after screenshots
- proof packet
- proof packet score
- short verdict: where the guild helped, where it did not

Do not invent results. If a benchmark has not been run, mark it as `not run`.

## Suggested Benchmark Set

| Workflow need | Target failure | Status |
| --- | --- | --- |
| SaaS/admin/dashboard | pretty but not operationally clear | not run |
| mobile reliability | desktop works, mobile cramped or clipped | not run |
| component states | default state works, interaction states unknown | not run |
| accessibility evidence | contrast/focus/tap risk | not run |
| generated asset integration | asset looks good alone but not in UI | not run |
| regression-sensitive screen | after screenshot should become baseline | not run |

## Scoring

Use:

```powershell
npm run score-proof-packet -- --cwd ../target-app
```

A `95+` score means the run has strong proof. It does not mean the design is perfect; it means the claim is well supported.