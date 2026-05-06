#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const source = path.join(repoRoot, "codex", "codex-visual-builder-guild");

function codexHome() {
  if (process.env.CODEX_HOME) return process.env.CODEX_HOME;
  return path.join(os.homedir(), ".codex");
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    throw new Error(`Missing source skill folder: ${src}`);
  }
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else if (entry.isFile()) {
      fs.copyFileSync(from, to);
    }
  }
}

const targetRoot = path.join(codexHome(), "skills");
const target = path.join(targetRoot, "codex-visual-builder-guild");
const installedSkill = path.join(target, "SKILL.md");
const installedOpenAi = path.join(target, "agents", "openai.yaml");

copyDir(source, target);

if (!fs.existsSync(installedSkill)) {
  throw new Error(`Install verification failed: missing ${installedSkill}`);
}

if (!fs.existsSync(installedOpenAi)) {
  throw new Error(`Install verification failed: missing ${installedOpenAi}`);
}

console.log("Codex Visual Builder Guild installed.");
console.log("");
console.log(`CODEX_HOME: ${codexHome()}`);
console.log("Installed Codex skill:");
console.log(`  ${target}`);
console.log("");
console.log("Verified:");
console.log("  - SKILL.md copied");
console.log("  - agents/openai.yaml copied");
console.log("");
console.log("Restart Codex Desktop or start a new Codex session, then invoke it with:");
console.log("  Use codex-visual-builder-guild to run the visual builder loop on this app.");
console.log("");
console.log("First 5-minute win prompt:");
console.log("  Use codex-visual-builder-guild on this app. For new sections or important surfaces, first state product intent and page intent: target user, core job, success moment, page job, ideal user route, scary/hard/bloated risks, and what design should make easier. Run it, screenshot desktop, tablet, mobile, and one awkward in-between width, inspect screenshots with Codex App vision, record concrete vision observations by viewport, check whether the user flow has a clear next action and whether reusable patterns follow the art bible/component system, fix the single highest-impact visual issue or flow issue, use at most 1-2 specialist lenses only if screenshots prove they are needed, capture after screenshots with local paths, then finish with the Run Report Contract including product intent, page intent, viewport matrix, state matrix, accepted visual change, and automation notes.");
