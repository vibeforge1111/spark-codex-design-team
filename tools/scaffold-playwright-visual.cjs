#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function parseArgs(argv) {
  const args = {
    cwd: process.cwd(),
    name: "visual-baseline",
    url: "http://127.0.0.1:5173",
    outDir: path.join("tests", "visual"),
    force: false
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--force") {
      args.force = true;
    } else if (arg === "--cwd") {
      args.cwd = argv[++i];
    } else if (arg === "--name") {
      args.name = argv[++i];
    } else if (arg === "--url") {
      args.url = argv[++i];
    } else if (arg === "--out-dir") {
      args.outDir = argv[++i];
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function help() {
  return `Scaffold a Playwright visual baseline test for a target app.

Usage:
  npm run scaffold:playwright-visual -- --cwd ../my-app --url http://127.0.0.1:5173 --name dashboard
  node tools/scaffold-playwright-visual.cjs --cwd ../my-app --url http://127.0.0.1:3000

Options:
  --cwd <path>      Target project directory. Defaults to current directory.
  --url <url>       Page URL for the baseline test.
  --name <name>     Test and screenshot name.
  --out-dir <path>  Output directory relative to cwd. Defaults to tests/visual.
  --force           Overwrite an existing scaffolded test or mask file.
`;
}

function safeName(name) {
  return String(name || "visual-baseline")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "visual-baseline";
}

function specTemplate(name, url, maskPath) {
  const title = name.replace(/-/g, " ");
  return `import { expect, test } from '@playwright/test';

test('${title} visual baseline', async ({ page }) => {
  await page.goto('${url}', { waitUntil: 'networkidle' });

  await expect(page).toHaveScreenshot('${name}.png', {
    fullPage: true,
    maxDiffPixels: 100,
    stylePath: '${maskPath}'
  });
});
`;
}

function maskTemplate() {
  return `/*
  Add selectors for timestamps, animated cursors, ads, charts, videos, or
  other volatile UI before committing a visual baseline.

  Example:
  [data-visual-mask],
  .live-clock {
    visibility: hidden !important;
  }
*/
`;
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(help());
    return;
  }

  const cwd = path.resolve(args.cwd);
  const name = safeName(args.name);
  const outDir = path.resolve(cwd, args.outDir);
  const specPath = path.join(outDir, `${name}.spec.ts`);
  const maskPath = path.join(outDir, "visual-baseline-mask.css");

  if (!fs.existsSync(cwd)) {
    throw new Error(`Target cwd does not exist: ${cwd}`);
  }

  for (const file of [specPath, maskPath]) {
    if (fs.existsSync(file) && !args.force) {
      throw new Error(`Refusing to overwrite existing file: ${file}\nPass --force to overwrite.`);
    }
  }

  fs.mkdirSync(outDir, { recursive: true });
  const maskPathForSpec = path.relative(cwd, maskPath).replace(/\\/g, "/");
  fs.writeFileSync(specPath, specTemplate(name, args.url, maskPathForSpec), "utf8");
  fs.writeFileSync(maskPath, maskTemplate(), "utf8");

  console.log("Playwright visual baseline scaffolded.");
  console.log(`  ${specPath}`);
  console.log(`  ${maskPath}`);
  console.log("");
  console.log("Next:");
  console.log("  1. Install Playwright in the target project if needed: npm i -D @playwright/test");
  console.log("  2. Start the app at the URL used by the test.");
  console.log(`  3. Run: npx playwright test ${path.relative(cwd, specPath)}`);
  console.log("  4. Review the generated baseline before committing it.");
}

try {
  main();
} catch (error) {
  console.error(`scaffold-playwright-visual failed: ${error.message}`);
  process.exit(1);
}
