#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const yaml = require('yaml');

const ROOT = path.resolve(__dirname, '..');
const DESIGN_DIR = path.join(ROOT, 'design');
const BUNDLE_FILE = path.join(ROOT, 'bundles', 'codex-visual-builder-loop.yaml');
const CODEX_SKILL_FILE = path.join(ROOT, 'codex', 'codex-visual-builder-guild', 'SKILL.md');
const CODEX_INSTALLER = path.join(ROOT, 'tools', 'install-codex-skill.cjs');
const UPSTREAM_ROOT = process.env.SPARK_SKILL_GRAPHS_ROOT || 'C:/Users/USER/Desktop/spark-skill-graphs';
const KNOWN_EXTERNAL_DELEGATE_IDS = new Set([
  'accessibility-design',
  'ai-image-editing',
  'art-consistency',
  'color-theory',
  'design-systems',
  'game-ui-design',
  'motion-design',
  'typography',
  'ux-design'
]);

function readYaml(file) {
  return yaml.parse(fs.readFileSync(file, 'utf8'));
}

function walkYaml(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['.git', 'node_modules', 'mcp-server', 'tools', 'dist', 'benchmark', 'benchmarks', 'bundles'].includes(entry.name)) {
        walkYaml(full, out);
      }
    } else if (entry.isFile() && entry.name.endsWith('.yaml')) {
      out.push(full);
    }
  }
  return out;
}

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function words(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function scoreSkill(skill, query) {
  const queryWords = words(query);
  const triggerText = (skill.triggers || []).join(' ');
  const haystack = words([
    skill.id,
    skill.name,
    skill.description,
    triggerText,
    (skill.owns || []).join(' '),
    (skill.tags || []).join(' ')
  ].join(' '));
  const counts = new Map();
  for (const token of haystack) counts.set(token, (counts.get(token) || 0) + 1);
  let score = 0;
  for (const token of queryWords) {
    score += counts.get(token) || 0;
    if ((skill.triggers || []).some(t => t.toLowerCase().includes(token))) score += 2;
    if (String(skill.id).toLowerCase().includes(token)) score += 3;
  }
  return score;
}

function loadSkills() {
  return fs.readdirSync(DESIGN_DIR)
    .filter(file => file.endsWith('.yaml'))
    .map(file => readYaml(path.join(DESIGN_DIR, file)));
}

function resolveUpstreamIds() {
  const ids = new Set();
  for (const file of walkYaml(UPSTREAM_ROOT)) {
    try {
      const doc = readYaml(file);
      const basename = path.basename(file, '.yaml');
      if (doc?.id) ids.add(doc.id);
      if (doc?.name) ids.add(doc.name);
      ids.add(basename);
    } catch {
      // Upstream validation handles malformed YAML. This smoke only checks references.
    }
  }
  return ids;
}

const skills = loadSkills();
const skillIds = new Set(skills.map(skill => skill.id));
const bundle = readYaml(BUNDLE_FILE);

assert(skills.length === 19, `expected 19 design skills, found ${skills.length}`);
assert(bundle.id === 'codex-visual-builder-loop', 'bundle id should be codex-visual-builder-loop');
assert(bundle.load_order?.[0] === 'product-intent-observer', 'product-intent-observer must be first in bundle load_order');
assert(bundle.load_order?.[1] === 'visual-loop-qa', 'visual-loop-qa must follow product intent in bundle load_order');
assert((bundle.required_skills || []).length === 13, 'bundle should have 13 required skills');
assert((bundle.optional_skills || []).length === 6, 'bundle should have 6 optional skills');

for (const id of [...(bundle.required_skills || []), ...(bundle.optional_skills || []), ...(bundle.load_order || [])]) {
  assert(skillIds.has(id), `bundle references missing package skill: ${id}`);
}

for (const skill of skills) {
  assert(skill.format === 'H70-C+', `${skill.id} must use H70-C+`);
  assert(skill.delegates_version === 2, `${skill.id} must use delegates_version: 2`);
  assert((skill.delegates || []).length >= 4, `${skill.id} should have at least 4 delegate edges`);
  assert((skill.disasters || []).length >= 3, `${skill.id} should have at least 3 disasters`);
  assert((skill.anti_patterns || []).length >= 3, `${skill.id} should have at least 3 anti-patterns`);
  assert((skill.patterns || []).length >= 3, `${skill.id} should have at least 3 patterns`);
  assert((skill.triggers || []).length >= 6, `${skill.id} should have at least 6 triggers`);
  for (const delegate of skill.delegates || []) {
    assert(Array.isArray(delegate.pass_context) && delegate.pass_context.length > 0, `${skill.id}->${delegate.skill} missing pass_context`);
    assert(Array.isArray(delegate.expect_back) && delegate.expect_back.length > 0, `${skill.id}->${delegate.skill} missing expect_back`);
    assert(typeof delegate.sla === 'string' && delegate.sla.length > 0, `${skill.id}->${delegate.skill} missing sla`);
  }
}

const visualLoop = skills.find(skill => skill.id === 'visual-loop-qa');
const visualLoopText = JSON.stringify(visualLoop).toLowerCase();
for (const requiredCue of ['run', 'screenshot', 'vision', 'delegate', 'recapture', 'before/after']) {
  assert(visualLoopText.includes(requiredCue), `visual-loop-qa should contain Codex loop cue: ${requiredCue}`);
}

const codexSkillText = fs.readFileSync(CODEX_SKILL_FILE, 'utf8');
assert(codexSkillText.includes('name: codex-visual-builder-guild'), 'Codex wrapper skill must declare codex-visual-builder-guild');
for (const id of skillIds) {
  assert(codexSkillText.includes(id), `Codex wrapper skill should mention specialist: ${id}`);
}

const tempCodexHome = fs.mkdtempSync(path.join(os.tmpdir(), 'cvbg-codex-home-'));
try {
  execFileSync(process.execPath, [CODEX_INSTALLER], {
    cwd: ROOT,
    env: { ...process.env, CODEX_HOME: tempCodexHome },
    stdio: 'pipe'
  });
  const installedSkill = path.join(tempCodexHome, 'skills', 'codex-visual-builder-guild', 'SKILL.md');
  assert(fs.existsSync(installedSkill), 'Codex installer should copy SKILL.md into CODEX_HOME/skills');
  assert(fs.readFileSync(installedSkill, 'utf8').includes('visual product team'), 'Installed Codex skill should contain guild instructions');
} finally {
  fs.rmSync(tempCodexHome, { recursive: true, force: true });
}

const upstreamIds = resolveUpstreamIds();
const unresolved = [];
for (const skill of skills) {
  for (const delegate of skill.delegates || []) {
    if (!skillIds.has(delegate.skill) && !upstreamIds.has(delegate.skill) && !KNOWN_EXTERNAL_DELEGATE_IDS.has(delegate.skill)) {
      unresolved.push(`${skill.id}->${delegate.skill}`);
    }
  }
}
assert(unresolved.length === 0, `unresolved delegate targets: ${unresolved.join(', ')}`);

const smokeQueries = [
  ['Codex Desktop visual design loop with imagegen screenshots and vision QA', 'visual-loop-qa', 5],
  ['first time user flow onboarding confusing overwhelming next action recovery', 'user-flow-friction-auditor', 3],
  ['generate UI assets hero image product mockup imagegen asset', 'imagegen-asset-director', 3],
  ['responsive vision mobile desktop viewport text overflow', 'responsive-vision-auditor', 3],
  ['hover focus modal loading error dropdown interaction states', 'interaction-state-inspector', 3],
  ['screenshot regression visual baseline before after diff', 'screenshot-regression-guard', 3],
  ['real content long names empty state ugly data layout fuzzing', 'real-content-layout-fuzzer', 3],
  ['art bible component system design tokens reusable contract drift', 'component-system-steward', 3]
];

for (const [query, expectedId, maxRank] of smokeQueries) {
  const ranked = [...skills]
    .map(skill => ({ id: skill.id, score: scoreSkill(skill, query) }))
    .sort((a, b) => b.score - a.score);
  const rank = ranked.findIndex(row => row.id === expectedId) + 1;
  assert(rank > 0 && rank <= maxRank, `query "${query}" expected ${expectedId} in top ${maxRank}, got rank ${rank}`);
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log('Smoke test passed');
console.log(`- skills: ${skills.length}`);
console.log(`- bundle: ${bundle.id}`);
console.log('- Codex wrapper skill install check passed');
console.log(`- delegate targets resolve against package + known external Spark neighbors`);
console.log('- keyword invocation checks passed');
