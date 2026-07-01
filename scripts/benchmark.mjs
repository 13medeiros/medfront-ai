#!/usr/bin/env node
// MedFront AI — benchmark.mjs
// Reproducible performance & accessibility measurement for the `benchmark`
// stage. Wraps Lighthouse, records environment/command/date, and NEVER
// fabricates: if the tool cannot run, it reports the limitation and prints a
// reproducible command instead of inventing numbers.
//
// Usage:
//   node benchmark.mjs --url http://localhost:3000
//   node benchmark.mjs --url http://localhost:3000 --mobile
//
// Needs a local Chrome (set CHROME_PATH if not auto-detected) and network
// access for `npx lighthouse` on first run.

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const TARGETS = {
  performance: { min: 80, label: "Performance" },
  accessibility: { min: 90, label: "Accessibility" },
  "best-practices": { min: 0, label: "Best Practices" },
  seo: { min: 0, label: "SEO" },
};
const VITALS = {
  "largest-contentful-paint": { max: 2500, label: "LCP", unit: "ms" },
  "cumulative-layout-shift": { max: 0.1, label: "CLS", unit: "" },
  "total-blocking-time": { max: 300, label: "TBT", unit: "ms" },
};

function parseArgs(argv) {
  const cfg = { url: null, mobile: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--url") cfg.url = argv[++i];
    else if (argv[i] === "--mobile") cfg.mobile = true;
  }
  return cfg;
}

function main() {
  const cfg = parseArgs(process.argv.slice(2));
  if (!cfg.url) {
    console.error("Usage: node benchmark.mjs --url http://localhost:3000 [--mobile]");
    process.exit(2);
  }

  const outFile = path.join(os.tmpdir(), `lh-${Date.now()}.json`);
  const args = [
    "-y", "lighthouse@12", cfg.url,
    "--quiet",
    "--only-categories=performance,accessibility,best-practices,seo",
    '--chrome-flags=--headless=new --no-sandbox',
    "--output=json", `--output-path=${outFile}`,
  ];
  if (!cfg.mobile) args.push("--form-factor=desktop", "--screenEmulation.disabled");

  const cmd = `npx ${args.map((a) => (a.includes(" ") ? `"${a}"` : a)).join(" ")}`;
  console.log("Environment:", `node ${process.version} · ${os.platform()} · ${new Date().toISOString()}`);
  console.log("Command:", cmd, "\n");

  // Run the quoted command string so the space-bearing --chrome-flags arg
  // stays a single argument under shell:true.
  const run = spawnSync(cmd, { encoding: "utf8", shell: true });
  if (run.status !== 0 || !fs.existsSync(outFile)) {
    console.error("Lighthouse could not run (network/Chrome?). NOT fabricating results.");
    console.error("Reproduce with:\n  " + cmd);
    if (run.stderr) console.error(run.stderr.split("\n").slice(-5).join("\n"));
    process.exit(2);
  }

  const r = JSON.parse(fs.readFileSync(outFile, "utf8"));
  const a = r.audits;
  let below = 0;

  console.log("Metric            Result   Target   Status   Cause/Note");
  console.log("─".repeat(66));
  for (const [k, t] of Object.entries(TARGETS)) {
    const c = r.categories[k];
    if (!c) continue;
    const score = Math.round(c.score * 100);
    const ok = t.min === 0 || score >= t.min;
    if (!ok) below++;
    console.log(
      `${t.label.padEnd(17)} ${String(score).padStart(6)}   ${(t.min ? "≥" + t.min : "—").padStart(6)}   ${(ok ? "✅" : "❌").padEnd(7)}`,
    );
  }
  for (const [id, t] of Object.entries(VITALS)) {
    const au = a[id];
    if (!au) continue;
    const val = au.numericValue;
    const ok = val <= t.max;
    if (!ok && t.label !== "TBT") below++;
    console.log(
      `${t.label.padEnd(17)} ${au.displayValue.padStart(6)}   ${("≤" + t.max + t.unit).padStart(6)}   ${(ok ? "✅" : "❌").padEnd(7)}`,
    );
  }

  // Largest opportunities (evidence, not guesses)
  const opps = r.categories.performance.auditRefs
    .map((ref) => a[ref.id])
    .filter((au) => au && au.details && au.details.overallSavingsMs > 100)
    .sort((x, y) => y.details.overallSavingsMs - x.details.overallSavingsMs)
    .slice(0, 3);
  if (opps.length) {
    console.log("\nLargest opportunities:");
    for (const o of opps) console.log(`  ~${Math.round(o.details.overallSavingsMs)}ms  ${o.title}`);
  }

  console.log("─".repeat(66));
  console.log(below === 0 ? "PASS — all gated metrics meet target." : `FAIL — ${below} metric(s) below target.`);
  process.exit(below === 0 ? 0 : 1);
}

main();
