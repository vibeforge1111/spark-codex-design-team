#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const RUBRIC = [
  {
    label: "screenshot evidence",
    points: 16,
    test: context => context.screenshotCount >= 4 ? 1 : context.screenshotCount >= 2 ? 0.7 : 0,
    note: context => `${context.screenshotCount} screenshot path(s)`
  },
  {
    label: "actual vision observations",
    points: 16,
    test: context => hasSubstance(context.fields["Vision observations"]) ? 1 : 0,
    note: context => hasSubstance(context.fields["Vision observations"]) ? "vision observations present" : "missing vision observations"
  },
  {
    label: "viewport coverage",
    points: 10,
    test: context => {
      const value = lower(context.fields["Viewport matrix"]);
      const desktop = value.includes("desktop") && !value.includes("desktop |  |  | not checked");
      const mobile = value.includes("mobile") && !value.includes("mobile |  |  | not checked");
      return desktop && mobile ? 1 : desktop || mobile ? 0.5 : 0;
    },
    note: context => compact(context.fields["Viewport matrix"])
  },
  {
    label: "state honesty",
    points: 8,
    test: context => hasSubstance(context.fields["State matrix"]) ? 1 : 0,
    note: context => compact(context.fields["State matrix"])
  },
  {
    label: "top issues",
    points: 10,
    test: context => issueCount(context.fields["Top issues"]) >= 3 ? 1 : issueCount(context.fields["Top issues"]) > 0 ? 0.5 : 0,
    note: context => `${issueCount(context.fields["Top issues"])} issue(s) listed`
  },
  {
    label: "chosen issue quality",
    points: 8,
    test: context => hasSubstance(context.fields["Chosen issue"]) ? 1 : 0,
    note: context => compact(context.fields["Chosen issue"])
  },
  {
    label: "specific fix",
    points: 8,
    test: context => hasSubstance(context.fields["Exact fix"]) ? 1 : 0,
    note: context => compact(context.fields["Exact fix"])
  },
  {
    label: "verification quality",
    points: 8,
    test: context => hasSubstance(context.fields["Verification"]) ? 1 : 0,
    note: context => compact(context.fields["Verification"])
  },
  {
    label: "post-fix ruthlessness",
    points: 6,
    test: context => hasSubstance(context.fields["Post-fix ruthlessness"]) ? 1 : 0,
    note: context => compact(context.fields["Post-fix ruthlessness"])
  },
  {
    label: "residual risk honesty",
    points: 5,
    test: context => hasSubstance(context.fields["Still weak"]) ? 1 : 0,
    note: context => compact(context.fields["Still weak"])
  },
  {
    label: "automation notes",
    points: 5,
    test: context => hasSubstance(context.fields["Automation notes"]) ? 1 : 0,
    note: context => compact(context.fields["Automation notes"])
  }
];

const FIELD_LABELS = [
  "Goal",
  "Viewport matrix",
  "State matrix",
  "Screenshots inspected",
  "Vision observations",
  "Top issues",
  "Chosen issue",
  "Lens used",
  "Exact fix",
  "Verification",
  "Post-fix ruthlessness",
  "Accepted visual change",
  "Still weak",
  "Reusable rule",
  "Automation notes"
];

function parseArgs(argv) {
  const args = {
    cwd: process.cwd(),
    file: path.join("artifacts", "visual-guild", "PROOF_PACKET.md"),
    json: false
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--cwd") {
      args.cwd = argv[++i];
    } else if (arg === "--file") {
      args.file = argv[++i];
    } else if (arg === "--json") {
      args.json = true;
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function help() {
  return `Score a Visual Guild proof packet from 0-100.

Usage:
  npm run score-proof-packet -- --cwd ../my-app
  node tools/score-proof-packet.cjs --cwd ../my-app --file artifacts/visual-guild/PROOF_PACKET.md

Options:
  --cwd <path>   Target project directory. Defaults to current directory.
  --file <path>  Proof packet path relative to cwd.
  --json         Print machine-readable output.
`;
}

function stripFencedCode(text) {
  return text.replace(/```[\s\S]*?```/g, "");
}

function escapeRegex(label) {
  return label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function fieldValue(text, label) {
  const stripped = stripFencedCode(text);
  const match = new RegExp(`^${escapeRegex(label)}:\\s*(.*)$`, "im").exec(stripped);
  if (!match) return "";
  const start = match.index + match[0].length;
  const rest = stripped.slice(start);
  const nextField = new RegExp(`\\n(?:${FIELD_LABELS.map(escapeRegex).join("|")}):\\s*`, "i");
  const nextHeading = /\n#{1,6}\s+/;
  const nextFieldMatch = nextField.exec(rest);
  const nextHeadingMatch = nextHeading.exec(rest);
  const nextIndexes = [nextFieldMatch?.index, nextHeadingMatch?.index].filter(index => typeof index === "number");
  const end = nextIndexes.length ? Math.min(...nextIndexes) : rest.length;
  return `${match[1]}\n${rest.slice(0, end)}`.trim();
}

function screenshotPaths(text) {
  const stripped = stripFencedCode(text);
  const paths = new Set();
  const markdownPath = /!?\[[^\]]*]\(([^)]+\.(?:png|jpe?g|webp))\)/gi;
  const plainPath = /(?:(?:[A-Za-z]:)?[./\\][^\s|)]+|[A-Za-z0-9_.-]+[\\/][^\s|)]+)\.(?:png|jpe?g|webp)/gi;
  for (const match of stripped.matchAll(markdownPath)) paths.add(match[1].trim());
  for (const match of stripped.matchAll(plainPath)) paths.add(match[0].trim());
  return [...paths].filter(candidate => !candidate.startsWith("http://") && !candidate.startsWith("https://"));
}

function lower(value) {
  return String(value || "").toLowerCase();
}

function hasSubstance(value) {
  const normalized = lower(value)
    .replace(/\|/g, "")
    .replace(/-/g, "")
    .replace(/not checked/g, "")
    .replace(/optional/g, "")
    .trim();
  return normalized.length >= 12;
}

function issueCount(value) {
  return String(value || "")
    .split(/\n+/)
    .filter(line => /^\s*(?:[-*]|\d+\.)\s+\S+/.test(line))
    .length;
}

function compact(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 90) || "missing";
}

function scorePacket(text) {
  const fields = Object.fromEntries(FIELD_LABELS.map(label => [label, fieldValue(text, label)]));
  const context = { fields, screenshotCount: screenshotPaths(text).length };
  const items = RUBRIC.map(item => {
    const ratio = item.test(context);
    const earned = Math.round(item.points * ratio);
    return {
      label: item.label,
      points: item.points,
      earned,
      note: item.note(context)
    };
  });
  const score = items.reduce((sum, item) => sum + item.earned, 0);
  const verdict = score >= 95 ? "excellent" : score >= 85 ? "strong" : score >= 70 ? "usable" : "weak";
  return { score, verdict, items };
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(help());
    return;
  }

  const cwd = path.resolve(args.cwd);
  const proofPath = path.resolve(cwd, args.file);
  if (!fs.existsSync(proofPath)) {
    throw new Error(`Proof packet not found: ${proofPath}`);
  }

  const result = scorePacket(fs.readFileSync(proofPath, "utf8"));
  if (args.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(`Proof packet score: ${result.score}/100 (${result.verdict})`);
  for (const item of result.items) {
    console.log(`- ${item.label}: ${item.earned}/${item.points} - ${item.note}`);
  }
}

try {
  main();
} catch (error) {
  console.error(`score-proof-packet failed: ${error.message}`);
  process.exit(1);
}
