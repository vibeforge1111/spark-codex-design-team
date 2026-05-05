#!/usr/bin/env node
/**
 * H70-C+ Format Validator
 *
 * Validates skills against the H70-C+ specification:
 * - 12 required sections
 * - NO root-level detection: or anchors: sections
 * - EVERY disaster has emotional_anchor and detection_command
 * - EVERY anti_pattern has detection field
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const SOURCE_DIR =
  process.env.SPAWNER_H70_SKILLS_DIR ||
  process.env.H70_SKILLS_LAB_DIR ||
  path.resolve(__dirname, '..');

const SKIP_DIRS = [
  '.git', 'node_modules', 'mcp-server', 'benchmark', 'tools',
  'clawdbot-compatible', 'dist', 'examples'
];

// H70-C+ Required Sections (12 total)
const REQUIRED_SECTIONS = [
  'identity',
  'owns',
  'delegates',
  'disasters',
  'anti_patterns',
  'patterns',
  'red_team',
  'testing',
  'decision_framework',
  'recovery',
  'examples',
  'gotchas'
];

// Sections that should NOT exist at root level in H70-C+
const FORBIDDEN_ROOT_SECTIONS = ['detection', 'anchors'];

const SELECTION_HINT_KEYS = new Set([
  'aliases',
  'boost_terms',
  'boost',
  'negative_terms',
  'penalty'
]);

function validateStringList(value, fieldName, errors) {
  if (!Array.isArray(value)) {
    errors.push(`selection_hints.${fieldName} must be a list of non-empty strings`);
    return;
  }

  value.forEach((item, i) => {
    if (typeof item !== 'string' || item.trim() === '') {
      errors.push(`selection_hints.${fieldName}[${i}] must be a non-empty string`);
    }
  });
}

function validateSelectionHints(selectionHints, errors) {
  if (selectionHints === undefined) return;

  if (!selectionHints || typeof selectionHints !== 'object' || Array.isArray(selectionHints)) {
    errors.push(`selection_hints must be a mapping`);
    return;
  }

  for (const key of Object.keys(selectionHints)) {
    if (!SELECTION_HINT_KEYS.has(key)) {
      errors.push(`selection_hints has unsupported key '${key}'`);
    }
  }

  if (selectionHints.aliases !== undefined) {
    validateStringList(selectionHints.aliases, 'aliases', errors);
  }
  if (selectionHints.boost_terms !== undefined) {
    validateStringList(selectionHints.boost_terms, 'boost_terms', errors);
  }
  if (selectionHints.negative_terms !== undefined) {
    validateStringList(selectionHints.negative_terms, 'negative_terms', errors);
  }

  for (const fieldName of ['boost', 'penalty']) {
    if (selectionHints[fieldName] !== undefined) {
      const value = selectionHints[fieldName];
      if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
        errors.push(`selection_hints.${fieldName} must be a non-negative number`);
      }
    }
  }
}

function validateSkill(filePath, content, skill) {
  const errors = [];
  const warnings = [];
  const relativePath = path.relative(SOURCE_DIR, filePath);

  // Check if it claims to be H70-C+
  if (!content.includes('format: H70-C+')) {
    return { valid: false, errors: ['Not marked as H70-C+ format'], warnings: [], relativePath };
  }

  // 1. Check for FORBIDDEN root-level sections
  for (const forbidden of FORBIDDEN_ROOT_SECTIONS) {
    if (skill[forbidden] !== undefined) {
      errors.push(`Has root-level '${forbidden}:' section (should be EMBEDDED in disasters/anti_patterns)`);
    }
  }

  // 2. Check for required sections
  for (const section of REQUIRED_SECTIONS) {
    if (skill[section] === undefined) {
      warnings.push(`Missing section: ${section}`);
    }
  }

  // 3. Validate disasters have embedded fields
  if (skill.disasters && Array.isArray(skill.disasters)) {
    skill.disasters.forEach((d, i) => {
      if (!d.emotional_anchor) {
        warnings.push(`Disaster ${i + 1} (${d.title || 'untitled'}) missing 'emotional_anchor'`);
      }
      if (!d.detection_command) {
        warnings.push(`Disaster ${i + 1} (${d.title || 'untitled'}) missing 'detection_command'`);
      }
    });
  }

  // 4. Validate anti_patterns have detection field
  if (skill.anti_patterns && Array.isArray(skill.anti_patterns)) {
    skill.anti_patterns.forEach((ap, i) => {
      if (!ap.detection) {
        warnings.push(`Anti-pattern ${i + 1} (${ap.name || 'untitled'}) missing 'detection'`);
      }
    });
  }

  // 5. Check gotchas format
  if (skill.gotchas && Array.isArray(skill.gotchas)) {
    skill.gotchas.forEach((g, i) => {
      if (!g.trap) {
        warnings.push(`Gotcha ${i + 1} missing 'trap' field`);
      }
      if (!g.correct) {
        warnings.push(`Gotcha ${i + 1} missing 'correct' field`);
      }
    });
  }

  // 6. Validate optional matcher metadata used by Spawner UI.
  validateSelectionHints(skill.selection_hints, errors);

  // 7. delegates_v2 contract enforcement
  //    When a skill declares `delegates_version: 2`, every delegate entry
  //    must carry the contract triple: pass_context, expect_back, sla.
  //    This is an ERROR, not a warning - v2 is a structural commitment.
  if (skill.delegates_version === 2) {
    if (!Array.isArray(skill.delegates) || skill.delegates.length === 0) {
      errors.push(`delegates_version: 2 declared but 'delegates' list is missing or empty`);
    } else {
      skill.delegates.forEach((d, i) => {
        const label = d.skill || `entry ${i + 1}`;
        if (!Array.isArray(d.pass_context) || d.pass_context.length === 0) {
          errors.push(`delegates[${i}] (${label}): v2 requires non-empty 'pass_context' list`);
        }
        if (!Array.isArray(d.expect_back) || d.expect_back.length === 0) {
          errors.push(`delegates[${i}] (${label}): v2 requires non-empty 'expect_back' list`);
        }
        if (typeof d.sla !== 'string' || d.sla.trim() === '') {
          errors.push(`delegates[${i}] (${label}): v2 requires 'sla' string (e.g. synchronous, async)`);
        }
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    relativePath
  };
}

function getAllSkillFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(SOURCE_DIR, fullPath);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.some(skip => relativePath.startsWith(skip))) {
        getAllSkillFiles(fullPath, files);
      }
    } else if (entry.isFile() && entry.name.endsWith('.yaml')) {
      files.push(fullPath);
    }
  }
  return files;
}

function main() {
  console.log('🔍 H70-C+ Format Validator\n');
  console.log('Checking all skills against H70-C+ specification...\n');

  const files = getAllSkillFiles(SOURCE_DIR);
  console.log(`📁 Found ${files.length} skill files\n`);

  let valid = 0;
  let invalid = 0;
  let skipped = 0;
  let totalErrors = 0;
  let totalWarnings = 0;
  let v2Count = 0;
  let v2Clean = 0;

  const invalidSkills = [];
  const warningSkills = [];

  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');

      // Skip non-H70-C+ files
      if (!content.includes('format: H70-C+')) {
        skipped++;
        continue;
      }

      const skill = yaml.parse(content);
      if (skill && skill.delegates_version === 2) {
        v2Count++;
      }
      const result = validateSkill(filePath, content, skill);
      if (skill && skill.delegates_version === 2 && result.valid) {
        v2Clean++;
      }

      if (!result.valid) {
        invalid++;
        totalErrors += result.errors.length;
        invalidSkills.push(result);
      } else {
        valid++;
      }

      if (result.warnings.length > 0) {
        totalWarnings += result.warnings.length;
        warningSkills.push(result);
      }

    } catch (err) {
      invalid++;
      totalErrors += 1;
      invalidSkills.push({
        relativePath: path.relative(SOURCE_DIR, filePath),
        errors: [`Parse error: ${err.message}`],
        warnings: []
      });
    }
  }

  // Print results
  console.log('═'.repeat(70));
  console.log('📊 VALIDATION RESULTS');
  console.log('═'.repeat(70));
  console.log(`✅ Valid H70-C+: ${valid}`);
  console.log(`❌ Invalid: ${invalid}`);
  console.log(`⏭️  Skipped (not H70-C+): ${skipped}`);
  console.log(`⚠️  With warnings: ${warningSkills.length}`);
  console.log('═'.repeat(70));

  // Print invalid skills
  if (invalidSkills.length > 0) {
    console.log('\n❌ INVALID SKILLS (Critical Errors):\n');
    for (const skill of invalidSkills) {
      console.log(`  📄 ${skill.relativePath}`);
      for (const err of skill.errors) {
        console.log(`     ❌ ${err}`);
      }
    }
  }

  // Print warning summary
  if (warningSkills.length > 0) {
    console.log('\n⚠️  WARNING SUMMARY:\n');

    // Count warning types
    const warningCounts = {};
    for (const skill of warningSkills) {
      for (const warning of skill.warnings) {
        const type = warning.split(':')[0].split('(')[0].trim();
        warningCounts[type] = (warningCounts[type] || 0) + 1;
      }
    }

    // Sort by count
    const sorted = Object.entries(warningCounts).sort((a, b) => b[1] - a[1]);
    for (const [type, count] of sorted.slice(0, 15)) {
      console.log(`  ${count.toString().padStart(4)} × ${type}`);
    }
  }

  // Print files with most warnings
  if (warningSkills.length > 0) {
    console.log('\n📋 TOP 10 SKILLS WITH MOST WARNINGS:\n');
    const sorted = warningSkills.sort((a, b) => b.warnings.length - a.warnings.length);
    for (const skill of sorted.slice(0, 10)) {
      console.log(`  ${skill.warnings.length.toString().padStart(2)} warnings: ${skill.relativePath}`);
    }
  }

  console.log('\n═'.repeat(70));
  console.log(`Total: ${totalErrors} errors, ${totalWarnings} warnings across ${files.length - skipped} H70-C+ skills`);
  console.log(`delegates_v2: ${v2Clean}/${v2Count} skills pass the v2 contract check`);
  console.log('═'.repeat(70));

  // Return exit code
  process.exit(invalid > 0 ? 1 : 0);
}

main();
