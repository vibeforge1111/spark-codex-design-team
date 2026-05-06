#!/usr/bin/env node

const LANES = [
  {
    id: "first-run",
    title: "First public demo polish",
    triggers: ["first", "demo", "quick", "x", "launch", "public", "polish"],
    lenses: ["visual-loop-qa"],
    commands: ["npm run create-proof-packet -- --cwd ../my-app"],
    evidence: ["desktop/tablet/mobile/fluid before-after screenshots", "Codex App vision observations", "Post-Fix Ruthlessness Check", "Run Report Contract"]
  },
  {
    id: "intent",
    title: "Product and page intent clarity",
    triggers: ["intent", "product", "page", "job", "jtbd", "user", "route", "surface", "section", "success", "bloated", "scary", "hard"],
    lenses: ["product-intent-observer", "visual-loop-qa", "user-flow-friction-auditor"],
    commands: ["npm run create-proof-packet -- --cwd ../my-app"],
    evidence: ["product intent brief", "page intent brief", "ideal user route", "design role before visual changes"]
  },
  {
    id: "dashboard",
    title: "SaaS/admin/dashboard operation",
    triggers: ["dashboard", "admin", "saas", "metrics", "table", "operator", "analytics", "console"],
    lenses: ["visual-loop-qa", "saas-dashboard-operator", "real-content-layout-fuzzer"],
    commands: ["npm run create-proof-packet -- --cwd ../my-app"],
    evidence: ["first five-second command answer", "scannable metrics", "real-content stress case"]
  },
  {
    id: "user-flow",
    title: "User flow and onboarding clarity",
    triggers: ["flow", "user", "onboarding", "confusing", "overwhelming", "friction", "journey", "first-time", "clarity", "easy"],
    lenses: ["visual-loop-qa", "user-flow-friction-auditor", "interaction-state-inspector"],
    commands: ["npm run create-proof-packet -- --cwd ../my-app"],
    evidence: ["five-second flow read", "clear next action", "one click-through state", "recovery/back/save path"]
  },
  {
    id: "mobile",
    title: "Mobile and responsive confidence",
    triggers: ["mobile", "responsive", "tablet", "viewport", "overflow", "wrapping", "tap"],
    lenses: ["visual-loop-qa", "responsive-vision-auditor"],
    commands: ["npm run create-proof-packet -- --cwd ../my-app"],
    evidence: ["mobile screenshot", "tablet screenshot", "awkward fluid-width screenshot", "tap target and text fit review"]
  },
  {
    id: "component-states",
    title: "Component state coverage",
    triggers: ["component", "storybook", "chromatic", "states", "hover", "focus", "modal", "loading", "empty", "error"],
    lenses: ["visual-loop-qa", "interaction-state-inspector"],
    commands: ["npm run create-proof-packet -- --cwd ../my-app"],
    evidence: ["state matrix", "important non-default screenshots", "accepted state changes"]
  },
  {
    id: "component-system",
    title: "Art bible and component-system stewardship",
    triggers: ["component", "system", "design-system", "art", "bible", "tokens", "styleguide", "style", "drift", "contract"],
    lenses: ["visual-loop-qa", "component-system-steward", "art-bible-extractor", "design-token-surgeon"],
    commands: ["npm run create-proof-packet -- --cwd ../my-app"],
    evidence: ["found or created system reference", "component contract", "token/art-bible compliance", "rendered screenshot proof"]
  },
  {
    id: "accessibility",
    title: "Accessibility evidence",
    triggers: ["accessibility", "a11y", "contrast", "focus", "keyboard", "wcag", "axe", "tap", "color"],
    lenses: ["visual-loop-qa", "visual-accessibility-sentinel", "interaction-state-inspector"],
    commands: ["npm run create-proof-packet -- --cwd ../my-app"],
    evidence: ["contrast/focus/tap review", "manual focus screenshot", "axe check if installed"]
  },
  {
    id: "asset",
    title: "Generated or external asset integration",
    triggers: ["imagegen", "asset", "image", "hero", "illustration", "photo", "visual", "provenance"],
    lenses: ["visual-loop-qa", "imagegen-asset-director", "asset-provenance-librarian"],
    commands: ["npm run create-proof-packet -- --cwd ../my-app"],
    evidence: ["asset shown inside real UI", "desktop/tablet/mobile/fluid fit", "provenance or replacement note"]
  },
  {
    id: "regression",
    title: "Regression-sensitive visual baseline",
    triggers: ["regression", "baseline", "playwright", "screenshot", "diff", "ci", "guard"],
    lenses: ["visual-loop-qa", "screenshot-regression-guard"],
    commands: [
      "npm run create-proof-packet -- --cwd ../my-app",
      "npm run scaffold:playwright-visual -- --cwd ../my-app --url http://127.0.0.1:5173 --name dashboard"
    ],
    evidence: ["accepted visual change", "stable screenshot baseline", "volatile UI masking note"]
  },
  {
    id: "performance",
    title: "Performance and visual stability",
    triggers: ["performance", "lighthouse", "web vitals", "loading", "layout shift", "cls", "interaction", "heavy"],
    lenses: ["visual-loop-qa", "motion-and-feedback-director"],
    commands: ["npm run create-proof-packet -- --cwd ../my-app"],
    evidence: ["loading/interactivity/visual stability note", "project-local perf check if available"]
  }
];

function parseArgs(argv) {
  const args = { need: "", json: false };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--need") {
      args.need = argv[++i] || "";
    } else if (arg === "--json") {
      args.json = true;
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else {
      args.need = `${args.need} ${arg}`.trim();
    }
  }
  return args;
}

function help() {
  return `Recommend a no-ceremony Visual Builder Guild workflow lane.

Usage:
  npm run recommend-workflow -- --need "dashboard mobile regression"
  node tools/recommend-workflow.cjs --need "accessibility focus contrast"

Options:
  --need <text>  Describe the workflow need.
  --json         Print machine-readable output.
`;
}

function words(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function rankLanes(need) {
  const query = words(need);
  return LANES
    .map(lane => {
      const triggers = new Set(lane.triggers);
      let score = 0;
      for (const token of query) {
        if (triggers.has(token)) score += 3;
        if (lane.title.toLowerCase().includes(token)) score += 1;
        if (lane.evidence.join(" ").toLowerCase().includes(token)) score += 1;
      }
      return { ...lane, score };
    })
    .filter(lane => lane.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 5);
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(help());
    return;
  }

  const ranked = rankLanes(args.need || "first run demo polish");
  const recommendations = ranked.length ? ranked : [LANES[0]];
  if (args.json) {
    console.log(JSON.stringify(recommendations, null, 2));
    return;
  }

  console.log("Recommended Visual Builder Guild workflow:");
  for (const lane of recommendations) {
    console.log("");
    console.log(`${lane.title} (${lane.id})`);
    console.log(`  lenses: ${lane.lenses.join(", ")}`);
    console.log(`  commands: ${lane.commands.join(" && ")}`);
    console.log(`  evidence: ${lane.evidence.join("; ")}`);
  }
}

try {
  main();
} catch (error) {
  console.error(`recommend-workflow failed: ${error.message}`);
  process.exit(1);
}
