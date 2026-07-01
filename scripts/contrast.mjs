#!/usr/bin/env node
// MedFront AI — contrast.mjs
// WCAG 2.1 contrast checker for the `chroma` and `inspect` stages.
// No dependencies. Never estimates — computes the ratio from hex values.
//
// Usage:
//   node contrast.mjs "#232019 on #f3efe7" "#f3efe7 on #a8451e"
//   node contrast.mjs --json pairs.json          # [{ "name": "...", "fg": "#..", "bg": "#.." }]
//   node contrast.mjs "#111 on #fff" --level AAA  # gate on AAA instead of AA
//
// Exit code is 1 if any pair fails the requested level (default: AA normal
// text, 4.5:1) — suitable for CI / certification gates.

import fs from "node:fs";
import { pathToFileURL } from "node:url";

function parseHex(hex) {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`Invalid hex: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

function relLuminance([r, g, b]) {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function contrast(fg, bg) {
  const l1 = relLuminance(parseHex(fg));
  const l2 = relLuminance(parseHex(bg));
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

const THRESHOLDS = {
  "AA-normal": 4.5,
  "AA-large": 3.0,
  "AAA-normal": 7.0,
  "AAA-large": 4.5,
  graphical: 3.0, // non-text / UI components / focus indicators (WCAG 1.4.11)
};

function verdicts(ratio) {
  return Object.fromEntries(
    Object.entries(THRESHOLDS).map(([k, t]) => [k, ratio >= t]),
  );
}

// ── CLI ───────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const pairs = [];
  let level = "AA-normal";
  let jsonPath = null;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--level") level = argv[++i];
    else if (a === "--json") jsonPath = argv[++i];
    else if (/ on /i.test(a)) {
      const [fg, bg] = a.split(/\s+on\s+/i);
      pairs.push({ name: `${fg} on ${bg}`, fg, bg });
    }
  }
  if (jsonPath) {
    const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    for (const p of data.pairs ?? data) pairs.push(p);
  }
  return { pairs, level };
}

function main() {
  const { pairs, level } = parseArgs(process.argv.slice(2));
  if (pairs.length === 0) {
    console.error(
      'Usage: node contrast.mjs "#fg on #bg" [...] [--json pairs.json] [--level AA-normal|AA-large|AAA-normal]',
    );
    process.exit(2);
  }
  const gate = THRESHOLDS[level] ?? 4.5;
  let failures = 0;

  console.log(`Ratio   ${level.padEnd(11)} large  graph  pair`);
  console.log("─".repeat(60));
  for (const { name, fg, bg } of pairs) {
    try {
      const r = contrast(fg, bg);
      const v = verdicts(r);
      const pass = r >= gate;
      if (!pass) failures++;
      const mark = (b) => (b ? "✓" : "✗");
      console.log(
        `${r.toFixed(2).padStart(6)}  ${mark(pass).padEnd(11)} ${mark(
          v["AA-large"],
        ).padEnd(6)} ${mark(v.graphical).padEnd(6)} ${name}`,
      );
    } catch (e) {
      failures++;
      console.log(`  ERR   ${name} — ${e.message}`);
    }
  }
  console.log("─".repeat(60));
  console.log(
    failures === 0
      ? `PASS — all ${pairs.length} pair(s) meet ${level} (${gate}:1)`
      : `FAIL — ${failures}/${pairs.length} pair(s) below ${level} (${gate}:1)`,
  );
  process.exit(failures === 0 ? 0 : 1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
