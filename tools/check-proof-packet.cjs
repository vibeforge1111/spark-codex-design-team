#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const REQUIRED_FIELDS = [
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
    allowMissingScreenshots: false
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--cwd") {
      args.cwd = argv[++i];
    } else if (arg === "--file") {
      args.file = argv[++i];
    } else if (arg === "--allow-missing-screenshots") {
      args.allowMissingScreenshots = true;
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function help() {
  return `Check that a Visual Guild proof packet contains real evidence.

Usage:
  npm run check-proof-packet -- --cwd ../my-app
  node tools/check-proof-packet.cjs --cwd ../my-app --file artifacts/visual-guild/PROOF_PACKET.md

Options:
  --cwd <path>                    Target project directory. Defaults to current directory.
  --file <path>                   Proof packet path relative to cwd.
  --allow-missing-screenshots     Check the report fields but do not require screenshot files to exist.
`;
}

function stripFencedCode(text) {
  return text.replace(/```[\s\S]*?```/g, "");
}

function fieldRegex(label) {
  return new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}:\\s*(.*)$`, "im");
}

function fieldValue(text, label) {
  const stripped = stripFencedCode(text);
  const match = fieldRegex(label).exec(stripped);
  if (!match) return null;

  const start = match.index + match[0].length;
  const rest = stripped.slice(start);
  const nextField = new RegExp(`\\n(?:${REQUIRED_FIELDS.map(field => field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")}):\\s*`, "i");
  const nextHeading = /\n#{1,6}\s+/;
  const nextFieldMatch = nextField.exec(rest);
  const nextHeadingMatch = nextHeading.exec(rest);
  const nextIndexes = [nextFieldMatch?.index, nextHeadingMatch?.index].filter(index => typeof index === "number");
  const end = nextIndexes.length ? Math.min(...nextIndexes) : rest.length;
  return `${match[1]}\n${rest.slice(0, end)}`.trim();
}

function isBlank(value) {
  if (!value) return true;
  const normalized = value
    .replace(/\|/g, "")
    .replace(/-/g, "")
    .replace(/not checked/gi, "")
    .replace(/optional/gi, "")
    .trim();
  return normalized.length === 0;
}

function screenshotPaths(text) {
  const stripped = stripFencedCode(text);
  const paths = new Set();
  const markdownPath = /!?\[[^\]]*]\(([^)]+\.(?:png|jpe?g|webp))\)/gi;
  const plainPath = /(?:(?:[A-Za-z]:)?[./\\][^\s|)]+|[A-Za-z0-9_.-]+[\\/][^\s|)]+)\.(?:png|jpe?g|webp)/gi;

  for (const match of stripped.matchAll(markdownPath)) {
    paths.add(match[1].trim());
  }
  for (const match of stripped.matchAll(plainPath)) {
    paths.add(match[0].trim());
  }

  return [...paths].filter(candidate => !candidate.startsWith("http://") && !candidate.startsWith("https://"));
}

function resolveScreenshotPath(cwd, candidate) {
  const cleaned = candidate.replace(/^<|>$/g, "");
  if (/^[A-Za-z]:[\\/]/.test(cleaned) || path.isAbsolute(cleaned)) return cleaned;
  return path.resolve(cwd, cleaned);
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

  const text = fs.readFileSync(proofPath, "utf8");
  const failures = [];
  for (const field of REQUIRED_FIELDS) {
    const value = fieldValue(text, field);
    if (value === null) {
      failures.push(`missing field: ${field}`);
    } else if (isBlank(value)) {
      failures.push(`blank field: ${field}`);
    }
  }

  const screenshots = screenshotPaths(text);
  if (screenshots.length < 2) {
    failures.push("expected at least two screenshot paths");
  }

  if (!args.allowMissingScreenshots) {
    for (const screenshot of screenshots) {
      const resolved = resolveScreenshotPath(cwd, screenshot);
      if (!fs.existsSync(resolved)) {
        failures.push(`missing screenshot file: ${screenshot}`);
      }
    }
  }

  if (failures.length) {
    console.error("Proof packet check failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log("Proof packet check passed.");
  console.log(`  ${proofPath}`);
  console.log(`  screenshot paths: ${screenshots.length}`);
}

try {
  main();
} catch (error) {
  console.error(`check-proof-packet failed: ${error.message}`);
  process.exit(1);
}
