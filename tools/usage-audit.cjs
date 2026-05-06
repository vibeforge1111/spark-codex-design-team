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
const BENCHMARKS_README = path.join(ROOT, "benchmarks", "README.md");
const BENCHMARKS_TEMPLATE = path.join(ROOT, "benchmarks", "RUN_TEMPLATE.md");
const PACKAGE_JSON = path.join(ROOT, "package.json");
const CODEX_SKILL = path.join(ROOT, "codex", "codex-visual-builder-guild", "SKILL.md");
const CODEX_OPENAI = path.join(ROOT, "codex", "codex-visual-builder-guild", "agents", "openai.yaml");
const INSTALLER = path.join(ROOT, "tools", "install-codex-skill.cjs");
const WORKFLOW_RECOMMENDER = path.join(ROOT, "tools", "recommend-workflow.cjs");
const PROOF_PACKET_TOOL = path.join(ROOT, "tools", "create-proof-packet.cjs");
const PROOF_PACKET_CHECKER = path.join(ROOT, "tools", "check-proof-packet.cjs");
const PROOF_PACKET_SCORER = path.join(ROOT, "tools", "score-proof-packet.cjs");
const PLAYWRIGHT_SCAFFOLD_TOOL = path.join(ROOT, "tools", "scaffold-playwright-visual.cjs");
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

function assertNotIncludes(text, phrase, message) {
  assert(!text.includes(phrase), message);
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
    assert(output.includes("desktop, tablet, mobile, and one awkward in-between width"), "installer prompt should include responsive viewport matrix");
    assert(output.includes("Codex App vision"), "installer prompt should require Codex App vision");
    assert(output.includes("local paths"), "installer prompt should require local screenshot paths");
    assert(output.includes("single highest-impact visual issue"), "installer prompt should bias toward one fast visible win");
    assert(output.includes("at most 1-2 specialist lenses"), "installer prompt should suppress specialist ceremony");
    assert(output.includes("Run Report Contract"), "installer prompt should require the run report contract");
    assert(output.includes("automation notes"), "installer prompt should request automation notes");
  } finally {
    fs.rmSync(tempCodexHome, { recursive: true, force: true });
  }
}

function assertScaffoldToolsWork() {
  const tempProject = fs.mkdtempSync(path.join(os.tmpdir(), "cvbg-scaffold-audit-"));
  try {
    const proofOut = path.join("artifacts", "visual-guild", "PROOF_PACKET.md");
    execFileSync(process.execPath, [PROOF_PACKET_TOOL, "--cwd", tempProject, "--out", proofOut, "--goal", "Audit the dashboard command surface."], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: "pipe"
    });
    const proofPath = path.join(tempProject, proofOut);
    assert(fs.existsSync(proofPath), "create-proof-packet should create the requested proof packet");
    const proofText = read(proofPath);
    assert(proofText.includes("Audit the dashboard command surface."), "proof packet should include the requested goal");
    assert(proofText.includes("Viewport matrix:"), "proof packet should include viewport matrix");
    assert(proofText.includes("Vision observations:"), "proof packet should include vision observations");
    assert(proofText.includes("Automation notes:"), "proof packet should include automation notes");
    assert(proofText.includes("desktop, tablet, mobile, and one awkward in-between width"), "proof packet prompt should require full responsive coverage");
    assert(proofText.includes("Codex App vision"), "proof packet prompt should require Codex App vision");
    assertNotIncludes(proofText, "screenshot desktop and mobile", "proof packet prompt should not regress to desktop/mobile-only screenshots");
    assertNotIncludes(proofText, "actual screenshots with vision", "proof packet prompt should not use generic vision wording");
    fs.mkdirSync(path.join(tempProject, "artifacts", "visual-guild"), { recursive: true });
    fs.writeFileSync(path.join(tempProject, "artifacts", "visual-guild", "before-desktop.png"), "fake", "utf8");
    fs.writeFileSync(path.join(tempProject, "artifacts", "visual-guild", "after-desktop.png"), "fake", "utf8");
    fs.writeFileSync(proofPath, `# Visual Guild Proof Packet

Goal: Audit the dashboard command surface.
Viewport matrix: desktop before and after checked.
State matrix: default state checked; interaction states not checked for this pass.
Screenshots inspected: artifacts/visual-guild/before-desktop.png and artifacts/visual-guild/after-desktop.png
Vision observations: desktop before lacks a command surface; after screenshot shows command spine above raw evidence.
Top issues: missing command surface, weak mobile summary, long evidence lists.
Chosen issue: add command surface because it changes the first five seconds.
Lens used: saas-dashboard-operator.
Exact fix: added command spine above evidence lists.
Verification: after screenshot shows trust status, next fix, and vitals above the fold.
Accepted visual change: new command spine is intentionally visible before Good/Bad/Ugly.
Still weak: lower evidence sections remain long.
Reusable rule: dashboards must answer the operator question before showing raw evidence.
Automation notes: manual screenshot pass only.
`, "utf8");
    execFileSync(process.execPath, [PROOF_PACKET_CHECKER, "--cwd", tempProject, "--file", proofOut], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: "pipe"
    });
    const scoreOutput = execFileSync(process.execPath, [PROOF_PACKET_SCORER, "--cwd", tempProject, "--file", proofOut], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: "pipe"
    });
    assert(scoreOutput.includes("Proof packet score:"), "score-proof-packet should print a score");
    assert(scoreOutput.includes("actual vision observations"), "score-proof-packet should score vision observations");

    execFileSync(process.execPath, [PLAYWRIGHT_SCAFFOLD_TOOL, "--cwd", tempProject, "--url", "http://127.0.0.1:5173/#agent", "--name", "agent-dashboard"], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: "pipe"
    });
    const specPath = path.join(tempProject, "tests", "visual", "agent-dashboard.spec.ts");
    const maskPath = path.join(tempProject, "tests", "visual", "visual-baseline-mask.css");
    assert(fs.existsSync(specPath), "scaffold:playwright-visual should create a visual spec");
    assert(fs.existsSync(maskPath), "scaffold:playwright-visual should create a mask stylesheet");
    const specText = read(specPath);
    assert(specText.includes("toHaveScreenshot"), "visual spec should use Playwright screenshot comparison");
    assert(specText.includes("http://127.0.0.1:5173/#agent"), "visual spec should include requested URL");
    assert(specText.includes("visual-baseline-mask.css"), "visual spec should reference the mask stylesheet");
  } finally {
    fs.rmSync(tempProject, { recursive: true, force: true });
  }
}

function assertWorkflowRecommenderWorks() {
  const output = execFileSync(process.execPath, [WORKFLOW_RECOMMENDER, "--need", "dashboard mobile regression"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: "pipe"
  });
  assert(output.includes("Recommended Visual Builder Guild workflow"), "workflow recommender should print a heading");
  assert(output.includes("SaaS/admin/dashboard operation"), "workflow recommender should route dashboard needs");
  assert(output.includes("Mobile and responsive confidence"), "workflow recommender should route mobile needs");
  assert(output.includes("Regression-sensitive visual baseline"), "workflow recommender should route regression needs");
  assert(output.includes("tablet screenshot"), "workflow recommender should include tablet evidence");
  assert(output.includes("awkward fluid-width screenshot"), "workflow recommender should include fluid-width evidence");
  assertNotIncludes(output, "desktop before/after screenshots", "workflow recommender should not regress to desktop/mobile-only evidence");
}

const skills = loadSkills();
const skillIds = skills.map(skill => skill.id).sort();
const imagegenTaggedIds = skills
  .filter(skill => (skill.tags || []).includes("imagegen"))
  .map(skill => skill.id)
  .sort();
const readme = read(README);
const quickstart = read(QUICKSTART);
const workflow = read(WORKFLOW);
const freeDrop = read(FREE_DROP);
const prompts = read(PROMPTS);
const manifest = read(MANIFEST);
const benchmarksReadme = read(BENCHMARKS_README);
const benchmarksTemplate = read(BENCHMARKS_TEMPLATE);
const codexSkill = read(CODEX_SKILL);
const openaiYaml = read(CODEX_OPENAI);
const proofPacketTool = read(PROOF_PACKET_TOOL);
const workflowRecommender = read(WORKFLOW_RECOMMENDER);
const packageJson = JSON.parse(read(PACKAGE_JSON));

assert(skills.length === 16, `expected 16 design skills, found ${skills.length}`);
assert(
  JSON.stringify(imagegenTaggedIds) === JSON.stringify(["asset-provenance-librarian", "imagegen-asset-director"]),
  `only asset-specific skills should carry the broad imagegen tag, got ${imagegenTaggedIds.join(", ")}`
);
assert(packageJson.scripts?.["install:codex"] === "node tools/install-codex-skill.cjs", "package.json should expose install:codex");
assert(packageJson.scripts?.["recommend-workflow"] === "node tools/recommend-workflow.cjs", "package.json should expose recommend-workflow");
assert(packageJson.scripts?.["create-proof-packet"] === "node tools/create-proof-packet.cjs", "package.json should expose create-proof-packet");
assert(packageJson.scripts?.["check-proof-packet"] === "node tools/check-proof-packet.cjs", "package.json should expose check-proof-packet");
assert(packageJson.scripts?.["score-proof-packet"] === "node tools/score-proof-packet.cjs", "package.json should expose score-proof-packet");
assert(packageJson.scripts?.["scaffold:playwright-visual"] === "node tools/scaffold-playwright-visual.cjs", "package.json should expose scaffold:playwright-visual");
assert(packageJson.scripts?.["audit:usage"] === "node tools/usage-audit.cjs", "package.json should expose audit:usage");

for (const file of [README, QUICKSTART, WORKFLOW, PROMPTS, FREE_DROP, MANIFEST, BENCHMARKS_README, BENCHMARKS_TEMPLATE, CODEX_SKILL, CODEX_OPENAI, INSTALLER, WORKFLOW_RECOMMENDER, PROOF_PACKET_TOOL, PROOF_PACKET_CHECKER, PROOF_PACKET_SCORER, PLAYWRIGHT_SCAFFOLD_TOOL, DEMO_README, DEMO_PROOF, DEMO_INDEX, DEMO_STYLES]) {
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
  "at most 1-2 specialist lenses",
  "npm run recommend-workflow",
  "npm run create-proof-packet",
  "npm run check-proof-packet",
  "npm run score-proof-packet",
  "npm run scaffold:playwright-visual"
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
  "vision observations",
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
  "Viewport matrix:",
  "Screenshots inspected:",
  "Vision observations:",
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
  "Workflow Needs Matrix",
  "npm run recommend-workflow",
  "Automation Recipes",
  "npm run create-proof-packet",
  "npm run check-proof-packet",
  "npm run score-proof-packet",
  "npm run scaffold:playwright-visual",
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

for (const phrase of [
  "Plain Codex",
  "Guild Codex",
  "Do not invent results",
  "proof packet score",
  "not run"
]) {
  assert(benchmarksReadme.includes(phrase), `benchmarks README should include: ${phrase}`);
  assert(benchmarksTemplate.includes(phrase) || phrase === "Do not invent results", `benchmark template should include: ${phrase}`);
}

for (const [text, label] of [
  [workflow, "WORKFLOW"],
  [benchmarksTemplate, "benchmark template"],
  [proofPacketTool, "proof packet generator"],
  [workflowRecommender, "workflow recommender"],
  [prompts, "PROMPTS"],
  [codexSkill, "Codex wrapper"]
]) {
  assertNotIncludes(text, "screenshot desktop and mobile", `${label} should not regress to desktop/mobile-only screenshot wording`);
  assertNotIncludes(text, "capture before screenshots on desktop and mobile", `${label} should not regress to desktop/mobile-only screenshot wording`);
  assertNotIncludes(text, "actual screenshots with vision", `${label} should not use generic vision wording when Codex App vision is intended`);
  assertNotIncludes(text, "Codex vision", `${label} should say Codex App vision for native workflows`);
  assertNotIncludes(text, "desktop/mobile fit", `${label} should not compress responsive evidence into desktop/mobile only`);
  assertNotIncludes(text, "desktop before/after screenshots", `${label} should not recommend desktop/mobile-only evidence`);
}

for (const phrase of [
  "desktop, tablet, mobile, and one awkward in-between width",
  "Codex App vision",
  "before tablet:",
  "before fluid:",
  "after tablet:",
  "after fluid:"
]) {
  assert(benchmarksTemplate.includes(phrase), `benchmark template should include native responsive phrase: ${phrase}`);
}

for (const phrase of [
  "desktop, tablet, mobile, and one awkward in-between width",
  "Codex App vision"
]) {
  assert(proofPacketTool.includes(phrase), `proof packet generator should include native responsive phrase: ${phrase}`);
}

const demoText = `${read(DEMO_README)}\n${read(DEMO_PROOF)}\n${read(DEMO_INDEX)}\n${read(DEMO_STYLES)}`;
for (const phrase of [
  "Use codex-visual-builder-guild",
  "desktop, tablet, mobile, and awkward in-between screenshots",
  "intentional visual problems",
  "Minimum Useful Guild Pass",
  "Run Report Contract",
  "What Success Looks Like"
]) {
  assert(demoText.includes(phrase), `first-run demo should include: ${phrase}`);
}

for (const phrase of [
  "Minimum Useful Pass",
  "Codex App Native Capability Router",
  "Lens Handoff Protocol",
  "Run Report Contract",
  "viewport matrix",
  "state matrix",
  "screenshots inspected",
  "vision observations",
  "chosen issue",
  "lens used",
  "handoff log",
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
  "residual risk",
  "handoff next",
  "from lens -> to lens",
  "vision source",
  "vision observation",
  "supporting evidence",
  "next vision check",
  "vision handoff blocked"
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
assert(openaiYaml.includes("screenshot desktop, tablet, mobile, and one awkward in-between width"), "default prompt should preserve responsive screenshot workflow");
assert(openaiYaml.includes("Codex App vision"), "default prompt should explicitly require Codex App vision");
assert(openaiYaml.includes("in-app browser as live context"), "default prompt should use the in-app browser as native live context");
assert(openaiYaml.includes("local paths"), "default prompt should require local screenshot paths");
assert(openaiYaml.includes("imagegen only for integrated assets"), "default prompt should prevent detached decorative imagegen work");
assert(openaiYaml.includes("single highest-impact visual issue"), "default prompt should bias toward a minimum useful pass");
assert(openaiYaml.includes("vision-backed lens handoff packets"), "default prompt should require vision-backed lens handoff packets when specialists chain");
assert(openaiYaml.includes("Run Report Contract"), "default prompt should require the run report contract");
assert(openaiYaml.includes("at most 1-2 specialist lenses"), "default prompt should suppress specialist ceremony");
assert(openaiYaml.includes("automation notes"), "default prompt should ask for automation notes");
assert(readme.includes("Codex App Native Guardrails"), "README should explain Codex App native guardrails");
assert(readme.includes("The in-app browser is live context"), "README should make in-app browser context explicit");
assert(readme.includes("Imagegen is for integrated assets"), "README should constrain imagegen to integrated assets");
assert(readme.includes("vision-backed handoff packet"), "README should explain native Codex vision-backed handoff packets");
assert(readme.includes("what Codex actually saw in the image"), "README handoff packet should require vision observations");
assert(prompts.includes("Codex App Native Guardrails"), "PROMPTS should include copy-paste Codex App native guardrails");
assert(prompts.includes("Use Codex App native capabilities first"), "PROMPTS should include native-first invocation language");
assert(prompts.includes("imagegen only for assets that will be integrated into the UI"), "PROMPTS should constrain imagegen to integrated UI assets");
assert(prompts.includes("from lens -> to lens"), "PROMPTS should include copy-paste handoff packet format");
assert(prompts.includes("vision observation: what Codex actually saw in the image"), "PROMPTS should require vision-backed handoff observations");
assert(manifest.includes("tools/usage-audit.cjs"), "MANIFEST should list usage audit");
assert(manifest.includes("tools/recommend-workflow.cjs"), "MANIFEST should list workflow recommender");
assert(manifest.includes("tools/create-proof-packet.cjs"), "MANIFEST should list proof packet scaffold tool");
assert(manifest.includes("tools/check-proof-packet.cjs"), "MANIFEST should list proof packet checker");
assert(manifest.includes("tools/score-proof-packet.cjs"), "MANIFEST should list proof packet scorer");
assert(manifest.includes("tools/scaffold-playwright-visual.cjs"), "MANIFEST should list Playwright scaffold tool");
assert(manifest.includes("QUICKSTART.md"), "MANIFEST should list quickstart");
assert(manifest.includes("WORKFLOW.md"), "MANIFEST should list workflow guide");
assert(manifest.includes("benchmarks/README.md"), "MANIFEST should list benchmarks README");
assert(manifest.includes("benchmarks/RUN_TEMPLATE.md"), "MANIFEST should list benchmark template");
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
assertWorkflowRecommenderWorks();
assertScaffoldToolsWork();

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
console.log("- workflow recommender verified");
console.log("- proof packet check, score, and Playwright visual scaffold tools verified");
console.log("- keyword routing checks passed for all 16 specialists");
console.log("- beginner first-run, quickstart, proof packet, and demo app coverage verified");
