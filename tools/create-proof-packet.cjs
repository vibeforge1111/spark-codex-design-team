#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function parseArgs(argv) {
  const args = {
    cwd: process.cwd(),
    out: path.join("artifacts", "visual-guild", "PROOF_PACKET.md"),
    goal: "Improve one rendered UI surface with screenshot evidence.",
    force: false
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--force") {
      args.force = true;
    } else if (arg === "--cwd") {
      args.cwd = argv[++i];
    } else if (arg === "--out") {
      args.out = argv[++i];
    } else if (arg === "--goal") {
      args.goal = argv[++i];
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function help() {
  return `Create a Codex Visual Builder Guild proof packet.

Usage:
  npm run create-proof-packet -- --cwd ../my-app
  node tools/create-proof-packet.cjs --cwd ../my-app --out artifacts/visual-guild/PROOF_PACKET.md

Options:
  --cwd <path>    Target project directory. Defaults to current directory.
  --out <path>    Output markdown path relative to cwd.
  --goal <text>   Initial goal text.
  --force         Overwrite an existing proof packet.
`;
}

function proofPacketTemplate(goal) {
  return `# Visual Guild Proof Packet

Goal: ${goal}

## Run Report Contract

\`\`\`text
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
\`\`\`

## Viewport Matrix

| Viewport | Before screenshot | After screenshot | Result |
| --- | --- | --- | --- |
| desktop |  |  | not checked |
| mobile |  |  | not checked |
| tablet |  |  | optional |
| wide desktop |  |  | optional |

## State Matrix

| State | Screenshot or check | Result |
| --- | --- | --- |
| default |  | not checked |
| hover/focus |  | not checked |
| loading |  | not checked |
| empty |  | not checked |
| error |  | not checked |

## Screenshot Review

Vision observations:

- desktop before:
- mobile before:
- after comparison:

Top issues:

1. 
2. 
3. 

Chosen issue:

Lens used:

Exact fix:

Verification:

Post-fix ruthlessness:

Accepted visual change:

Still weak:

Reusable rule:

Automation notes:

## Suggested Codex Prompt

\`\`\`text
Use codex-visual-builder-guild on this app. Run it, screenshot desktop, tablet, mobile, and one awkward in-between width, inspect the actual screenshots with Codex App vision, record specific vision observations for each viewport, check whether the user flow has a clear next action and whether reusable patterns follow the art bible/component system, fix the single highest-impact visual issue or flow issue, use at most 1-2 specialist lenses only if screenshots prove they are needed, then run the Post-Fix Ruthlessness Check for awkward leftover onboarding, duplicated actions, floating copy, box soup, text-first clutter, and responsive regressions. Make one more focused fix if that check reveals a higher-impact visible issue. Finish with the Run Report Contract: goal, viewport matrix, state matrix, screenshots inspected, vision observations, top issues, chosen issue, lens used, exact fix, verification, post-fix ruthlessness, accepted visual change, still weak, reusable rule, automation notes.
\`\`\`
`;
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(help());
    return;
  }

  const cwd = path.resolve(args.cwd);
  const outPath = path.resolve(cwd, args.out);

  if (!fs.existsSync(cwd)) {
    throw new Error(`Target cwd does not exist: ${cwd}`);
  }

  if (fs.existsSync(outPath) && !args.force) {
    throw new Error(`Refusing to overwrite existing proof packet: ${outPath}\nPass --force to overwrite.`);
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, proofPacketTemplate(args.goal), "utf8");

  console.log("Visual Guild proof packet created.");
  console.log(`  ${outPath}`);
  console.log("");
  console.log("Next:");
  console.log("  Run the app, capture before/after screenshots, and fill the Run Report Contract.");
}

try {
  main();
} catch (error) {
  console.error(`create-proof-packet failed: ${error.message}`);
  process.exit(1);
}
