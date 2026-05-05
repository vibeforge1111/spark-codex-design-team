#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");
const yaml = require("yaml");

const ROOT = path.resolve(__dirname, "..");
const DESIGN_DIR = path.join(ROOT, "design");
const README = path.join(ROOT, "README.md");
const QUICKSTART = path.join(ROOT, "QUICKSTART.md");
const WORKFLOW = path.join(ROOT, "WORKFLOW.md");
const PROMPTS = path.join(ROOT, "PROMPTS.md");
const FREE_DROP = path.join(ROOT, "FREE-DROP.md");
const MANIFEST = path.join(ROOT, "MANIFEST.md");
const PACKAGE_JSON = path.join(ROOT, "package.json");
const CODEX_SKILL = path.join(ROOT, "codex", "codex-visual-builder-guild", "SKILL.md");
const CODEX_OPENAI = path.join(ROOT, "codex", "codex-visual-builder-guild", "agents", "openai.yaml");
const INSTALLER = path.join(ROOT, "tools", "install-codex-skill.cjs");
const DEMO_README = path.join(ROOT, "examples", "first-run-demo", "README.md");
const DEMO_PROOF = path.join(ROOT, "examples", "first-run-demo", "PROOF_PACKET.md");
const DEMO_INDEX = path.join(ROOT, "examples", "first-run-demo", "index.html");
const DEMO_STYLES = path.join(ROOT, "examples", "first-run-demo", "styles.css");

let failures = 0;

function fail(message) {
  failures += 1;
  console.error(`FAIL: ${message}`);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function loadSkills() {
  return fs.readdirSync(DESIGN_DIR)
    .filter(file => file.endsWith(".yaml"))
    .map(file => yaml.parse(read(path.join(DESIGN_DIR, file))));
}

function words(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function scoreSkill(skill, query) {
  const queryWords = words(query);
  const haystack = words([
    skill.id,
    skill.name,
    skill.description,
    (skill.triggers || []).join(" "),
    (skill.owns || []).join(" "),
    (skill.tags || []).join(" ")
  ].join(" "));
  const counts = new Map();
  for (const token of haystack) counts.set(token, (counts.get(token) || 0) + 1);
  let score = 0;
  for (const token of queryWords) {
    score += counts.get(token) || 0;
    if ((skill.triggers || []).some(trigger => trigger.toLowerCase().includes(token))) score += 2;
    if (String(skill.id).toLowerCase().includes(token)) score += 3;
  }
  return score;
}

function assertInstallWorks() {
  const tempCodexHome = fs.mkdtempSync(path.join(os.tmpdir(), "cvbg-usage-audit-"));
  const target = path.join(tempCodexHome, "skills", "codex-visual-builder-guild");
  try {
    fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(path.join(target, "SKILL.md"), "stale install");
    const output = execFileSync(process.execPath, [INSTALLER], {
      cwd: ROOT,
      env: { ...process.env, CODEX_HOME: tempCodexHome },
      encoding: "utf8",
      stdio: "pipe"
    });

    const installedSkill = path.join(target, "SKILL.md");
    const installedOpenAi = path.join(target, "agents", "openai.yaml");
    assert(fs.existsSync(installedSkill), "installer should copy SKILL.md");
    assert(fs.existsSync(installedOpenAi), "installer should copy agents/openai.yaml");
    assert(read(installedSkill).includes("Codex Visual Builder Guild"), "installer should overwrite stale skill content");
    assert(read(installedOpenAi).includes("Codex Visual Builder Guild"), "installer should copy UI metadata");
    assert(output.includes("CODEX_HOME:"), "installer output should print CODEX_HOME");
    assert(output.includes("Verified:"), "installer output should include verification summary");
    assert(output.includes("First 5-minute win prompt:"), "installer output should include first-run prompt");
    assert(output.includes("single highest-impact visual issue"), "installer prompt should bias toward one fast visible win");
    assert(output.includes("at most 1-2 specialist lenses"), "installer prompt should suppress specialist ceremony");
    assert(output.includes("Run Report Contract"), "installer prompt should require the run report contract");
    assert(output.includes("automation notes"), "installer prompt should request automation notes");
  } finally {
    fs.rmSync(tempCodexHome, { recursive: true, force: true });
  }
}

const skills = loadSkills();
const skillIds = skills.map(skill => skill.id).sort();
const readme = read(README);
const quickstart = read(QUICKSTART);
const workflow = read(WORKFLOW);
const freeDrop = read(FREE_DROP);
const prompts = read(PROMPTS);
const manifest = read(MANIFEST);
const codexSkill = read(CODEX_SKILL);
const openaiYaml = read(CODEX_OPENAI);
const packageJson = JSON.parse(read(PACKAGE_JSON));

assert(skills.length === 16, `expected 16 design skills, found ${skills.length}`);
assert(packageJson.scripts?.["install:codex"] === "node tools/install-codex-skill.cjs", "package.json should expose install:codex");
assert(packageJson.scripts?.["audit:usage"] === "node tools/usage-audit.cjs", "package.json should expose audit:usage");

for (const file of [README, QUICKSTART, WORKFLOW, PROMPTS, FREE_DROP, MANIFEST, CODEX_SKILL, CODEX_OPENAI, INSTALLER, DEMO_README, DEMO_PROOF, DEMO_INDEX, DEMO_STYLES]) {
  assert(fs.existsSync(file), `expected file to exist: ${path.relative(ROOT, file)}`);
}

for (const id of skillIds) {
  assert(readme.includes(id), `README should mention ${id}`);
  assert(prompts.includes(id), `PROMPTS should include an invocation for ${id}`);
  assert(codexSkill.includes(id), `Codex wrapper should route ${id}`);
}

for (const phrase of [
  "git clone https://github.com/vibeforge1111/codex-visual-builder-guild.git",
  "npm run install:codex",
  "Use codex-visual-builder-guild to run the visual builder loop on this app.",
  "30 Seconds, 2 Minutes, 5 Minutes",
  "First 5-Minute Win",
  "You do not need Spark Skill Graphs for the first win",
  "examples/first-run-demo",
  "PROOF_PACKET.md",
  "at most 1-2 specialist lenses"
]) {
  assert(readme.includes(phrase), `README should include install/invoke phrase: ${phrase}`);
  assert(prompts.includes(phrase) || phrase.startsWith("git clone") || phrase === "You do not need Spark Skill Graphs for the first win" || phrase === "examples/first-run-demo" || phrase === "PROOF_PACKET.md" || phrase === "30 Seconds, 2 Minutes, 5 Minutes", `PROMPTS should include invoke phrase: ${phrase}`);
}

for (const phrase of [
  "Shortest Useful Prompt",
  "First 5-Minute Win",
  "top 3 visual issues",
  "screenshot paths",
  "single highest-impact visual issue",
  "Run Report Contract",
  "viewport matrix",
  "state matrix",
  "screenshots inspected",
  "accepted visual change",
  "automation notes",
  "reusable rule"
]) {
  assert(prompts.includes(phrase), `PROMPTS should include first-run phrase: ${phrase}`);
}

for (const phrase of [
  "30 Seconds: What It Does",
  "2 Minutes: Install It",
  "5 Minutes: Paste This",
  "What Codex Must Report",
  "Lens Router",
  "Screenshots inspected:",
  "If you are unsure, choose Codex Desktop",
  "lens used: none"
]) {
  assert(quickstart.includes(phrase), `QUICKSTART should include fast-start phrase: ${phrase}`);
}

for (const phrase of [
  "Evidence-First Workflow",
  "Minimum Useful Pass",
  "Lens Router",
  "Strong Proof Packet",
  "Automation Recipes",
  "Playwright Visual Baseline",
  "Axe Accessibility Check",
  "Performance And Visual Stability Note",
  "Do not invoke many lenses just because they exist"
]) {
  assert(workflow.includes(phrase), `WORKFLOW should include benchmarked workflow phrase: ${phrase}`);
}

for (const phrase of [
  "Public Drop Promise",
  "Understand it in 30 seconds",
  "Install it in 2 minutes",
  "Get value in 5 minutes"
]) {
  assert(freeDrop.includes(phrase), `FREE-DROP should include public-drop phrase: ${phrase}`);
}

const demoText = `${read(DEMO_README)}\n${read(DEMO_PROOF)}\n${read(DEMO_INDEX)}\n${read(DEMO_STYLES)}`;
for (const phrase of [
  "Use codex-visual-builder-guild",
  "desktop and mobile screenshots",
  "intentional visual problems",
  "Minimum Useful Guild Pass",
  "Run Report Contract",
  "What Success Looks Like"
]) {
  assert(demoText.includes(phrase), `first-run demo should include: ${phrase}`);
}

for (const phrase of [
  "Minimum Useful Pass",
  "Run Report Contract",
  "viewport matrix",
  "state matrix",
  "screenshots inspected",
  "chosen issue",
  "lens used",
  "exact fix",
  "accepted visual change",
  "still weak",
  "reusable rule",
  "automation notes",
  "Lens Router",
  "at most 1-2 specialist lenses",
  "Specialist Output Contract",
  "problem",
  "evidence",
  "fix",
  "verification",
  "residual risk"
]) {
  assert(codexSkill.includes(phrase), `Codex wrapper should include artifact contract phrase: ${phrase}`);
}

for (const phrase of [
  "screenshot-driven design loop",
  "imagegen assets",
  "vision review",
  "responsive checks",
  "A/B variants",
  "SaaS dashboard polish",
  "game UI polish"
]) {
  assert(codexSkill.toLowerCase().includes(phrase.toLowerCase()), `Codex wrapper trigger text should include: ${phrase}`);
}

assert(openaiYaml.includes("default_prompt:"), "agents/openai.yaml should include default_prompt");
assert(openaiYaml.includes("screenshot desktop and mobile"), "default prompt should preserve screenshot workflow");
assert(openaiYaml.includes("single highest-impact visual issue"), "default prompt should bias toward a minimum useful pass");
assert(openaiYaml.includes("Run Report Contract"), "default prompt should require the run report contract");
assert(openaiYaml.includes("at most 1-2 specialist lenses"), "default prompt should suppress specialist ceremony");
assert(openaiYaml.includes("automation notes"), "default prompt should ask for automation notes");
assert(manifest.includes("tools/usage-audit.cjs"), "MANIFEST should list usage audit");
assert(manifest.includes("QUICKSTART.md"), "MANIFEST should list quickstart");
assert(manifest.includes("WORKFLOW.md"), "MANIFEST should list workflow guide");
assert(manifest.includes("examples/first-run-demo/PROOF_PACKET.md"), "MANIFEST should list demo proof packet");

const routingQueries = [
  ["full visual QA loop screenshot vision delegate before after", "visual-loop-qa"],
  ["generate UI-ready imagegen assets product visuals", "imagegen-asset-director"],
  ["mobile tablet desktop responsive viewport overflow", "responsive-vision-auditor"],
  ["hover focus modal dropdown loading error interaction states", "interaction-state-inspector"],
  ["brand consistency typography palette spacing coherent product", "brand-consistency-enforcer"],
  ["extract art bible palette type spacing layout rules", "art-bible-extractor"],
  ["design tokens color type spacing radius component contracts", "design-token-surgeon"],
  ["screenshot regression before after baseline visual diff", "screenshot-regression-guard"],
  ["real content long names empty state ugly data layout fuzzing", "real-content-layout-fuzzer"],
  ["accessibility contrast focus tap targets color motion", "visual-accessibility-sentinel"],
  ["A/B visual variants compare winner readability hierarchy", "ab-visual-lab"],
  ["hero image first viewport cinematography product immediately", "hero-image-cinematographer"],
  ["SaaS dashboard dense readable scannable tables filters", "saas-dashboard-operator"],
  ["game UI HUD inventory stats controls player readability", "game-ui-polish"],
  ["motion feedback hover loading transitions progress", "motion-and-feedback-director"],
  ["asset provenance generated assets prompts usage source lineage", "asset-provenance-librarian"]
];

for (const [query, expectedId] of routingQueries) {
  const ranked = skills
    .map(skill => ({ id: skill.id, score: scoreSkill(skill, query) }))
    .sort((a, b) => b.score - a.score);
  const rank = ranked.findIndex(row => row.id === expectedId) + 1;
  assert(rank > 0 && rank <= 3, `query "${query}" should rank ${expectedId} in top 3, got ${rank}`);
}

assertInstallWorks();

if (failures > 0) {
  console.error(`Usage audit failed with ${failures} failure(s)`);
  process.exit(1);
}

console.log("Usage audit passed");
console.log(`- specialist invocation coverage: ${skillIds.length}/16`);
console.log("- README install path verified");
console.log("- PROMPTS specialist spellbook verified");
console.log("- Codex wrapper trigger and metadata verified");
console.log("- installer overwrite/idempotence verified in temp CODEX_HOME");
console.log("- keyword routing checks passed for all 16 specialists");
console.log("- beginner first-run, quickstart, proof packet, and demo app coverage verified");
