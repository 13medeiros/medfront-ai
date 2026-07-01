#!/usr/bin/env node
// MedFront AI — identity-fingerprint.mjs
// Extracts a project's visual "identity fingerprint" and, with --vs, checks
// cross-project convergence: is this identity born from the product, or reused
// by the agent's habit? Evidence for the `compare` / `anti-slop` stages.
// No dependencies.
//
// Usage:
//   node identity-fingerprint.mjs <dir>                 # print one fingerprint
//   node identity-fingerprint.mjs <dirA> --vs <dirB>    # convergence report
//   node identity-fingerprint.mjs <a> --vs <b> --max 60 # exit 1 if convergence > 60%

import fs from "node:fs";
import path from "node:path";

const EXT = [".tsx", ".jsx", ".ts", ".js", ".mjs", ".css", ".scss", ".html", ".vue", ".svelte", ".astro"];
const SKIP = new Set(["node_modules", ".git", ".next", "dist", "build", "out"]);
const SERIF = /(newsreader|fraunces|playfair|lora|merriweather|serif|spectral|bitter|cormorant|garamond|baskerville|roboto.slab)/i;
// Web-safe fallbacks / generic families — not the design font.
const GENERIC_FONT = /^(system|ui|sans|serif|mono|monospace|inherit|initial|arial|helvetica|georgia|times|courier|verdana|tahoma|segoe|blink\w*|-?apple\w*|emoji|sans serif|ui \w+)$/i;

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (EXT.includes(path.extname(e.name))) acc.push(p);
  }
  return acc;
}

function classifyFont(name) {
  if (/mono/i.test(name)) return "mono";
  if (SERIF.test(name)) return "serif";
  return "sans";
}

function toRgb(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
const dist = (a, b) => Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0));

function fingerprint(dir) {
  const files = walk(dir);
  const fonts = new Set(), colors = new Map(), radii = new Map(), shadows = new Map(), motion = new Set();
  let borders = 0, thin = 0, sections = 0, grids = 0, total = 0;

  for (const f of files) {
    const t = fs.readFileSync(f, "utf8");
    total += t.length;
    // fonts
    for (const m of t.matchAll(/from\s*["']next\/font\/google["']/g)) {
      const imp = t.slice(t.lastIndexOf("import", m.index), m.index);
      for (const n of (imp.match(/\{([^}]+)\}/)?.[1] || "").split(",")) {
        const name = n.trim().replace(/_/g, " ");
        if (name) fonts.add(name);
      }
    }
    for (const m of t.matchAll(/font-family:\s*([^;,)]+)/gi)) {
      const fam = m[1].replace(/var\([^)]*\)|["']/g, "").trim();
      if (fam && !/^(system-ui|ui-|sans-serif|serif|monospace|inherit)/i.test(fam)) fonts.add(fam);
    }
    for (const m of t.matchAll(/--font-[\w-]+:\s*var\([^)]*\),?\s*([A-Za-z][\w ]+)/g)) fonts.add(m[1].trim());
    // colors
    for (const m of t.matchAll(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)) {
      let h = m[1].toLowerCase();
      if (h.length === 3) h = h.split("").map((c) => c + c).join("");
      colors.set("#" + h, (colors.get("#" + h) ?? 0) + 1);
    }
    // radii / shadows / borders / motion / composition
    for (const m of t.matchAll(/\brounded-([\w[\]/.]+)/g)) radii.set(m[1], (radii.get(m[1]) ?? 0) + 1);
    for (const m of t.matchAll(/border-radius:\s*([^;]+)/g)) radii.set(m[1].trim(), (radii.get(m[1].trim()) ?? 0) + 1);
    for (const m of t.matchAll(/\bshadow-([\w[\]/.]+)/g)) shadows.set(m[1], (shadows.get(m[1]) ?? 0) + 1);
    borders += (t.match(/\bborder\b|border:/g) || []).length;
    thin += (t.match(/1px|border-\[?1/g) || []).length;
    for (const s of ["whileInView", "motion.", "ease-", "transition:", "translateY", "stroke-dashoffset"]) if (t.includes(s)) motion.add(s);
    for (const m of t.matchAll(/\[[\d., ]+0\.\d+[\d., ]*\]/g)) motion.add("cubic:" + m[0].replace(/\s/g, ""));
    sections += (t.match(/<section\b/g) || []).length;
    grids += (t.match(/grid-cols-|display:\s*grid/g) || []).length;
  }

  const topColors = [...colors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([hex]) => hex);
  const fontList = [...fonts].filter((f) => f && !GENERIC_FONT.test(f.trim()));
  const roles = new Set(fontList.map(classifyFont));
  const domRadius = [...radii.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  const domShadow = [...shadows.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "none";
  return {
    dir, files: files.length, fonts: fontList, roles, topColors,
    domRadius, domShadow, borderDensity: +(borders / (total / 1000)).toFixed(1),
    thinLines: thin, motion: [...motion], sections, grids,
  };
}

function printFp(fp) {
  console.log(`\n■ ${fp.dir}  (${fp.files} files)`);
  console.log(`  fonts     ${fp.fonts.join(", ") || "—"}  [${[...fp.roles].join("+")}]`);
  console.log(`  palette   ${fp.topColors.join(" ")}`);
  console.log(`  radius    dominant "${fp.domRadius}"`);
  console.log(`  shadow    dominant "${fp.domShadow}"`);
  console.log(`  borders   density ${fp.borderDensity}/kB · ${fp.thinLines} thin(1px) refs`);
  console.log(`  motion    ${fp.motion.join(", ") || "—"}`);
  console.log(`  layout    ${fp.sections} <section> · ${fp.grids} grid`);
}

function jaccard(a, b) {
  const A = new Set(a), B = new Set(b);
  const inter = [...A].filter((x) => B.has(x)).length;
  const uni = new Set([...A, ...B]).size;
  return uni ? inter / uni : 0;
}

function compare(a, b) {
  printFp(a); printFp(b);
  const rows = [];
  const verdict = (s) => (s >= 0.66 ? "● strong" : s >= 0.34 ? "◐ partial" : "○ distinct");

  // fonts: role structure + family overlap
  const roleSim = jaccard([...a.roles], [...b.roles]);
  const famSim = jaccard(a.fonts.map((f) => f.toLowerCase()), b.fonts.map((f) => f.toLowerCase()));
  const fontSim = 0.5 * roleSim + 0.5 * famSim;
  const sharedFonts = a.fonts.filter((f) => b.fonts.map((x) => x.toLowerCase()).includes(f.toLowerCase()));
  rows.push(["Typography", fontSim, sharedFonts.length ? `shared: ${sharedFonts.join(", ")}` : `roles ${[...a.roles].join("+")} vs ${[...b.roles].join("+")}`]);

  // palette: nearest-color match
  let matched = 0; const pairs = [];
  for (const ca of a.topColors) {
    const near = b.topColors.map((cb) => [cb, dist(toRgb(ca), toRgb(cb))]).sort((x, y) => x[1] - y[1])[0];
    if (near && near[1] < 40) { matched++; if (near[1] < 12) pairs.push(`${ca}≈${near[0]}`); }
  }
  const palSim = a.topColors.length ? matched / a.topColors.length : 0;
  rows.push(["Palette", palSim, `${matched}/${a.topColors.length} near-matches${pairs.length ? " · " + pairs.slice(0, 4).join(" ") : ""}`]);

  // radius / shadow / borders / motion / layout
  rows.push(["Geometry (radius)", a.domRadius === b.domRadius ? 1 : 0.2, `"${a.domRadius}" vs "${b.domRadius}"`]);
  rows.push(["Shadow", a.domShadow === b.domShadow ? 1 : 0.3, `"${a.domShadow}" vs "${b.domShadow}"`]);
  const borderSim = 1 - Math.min(1, Math.abs(a.borderDensity - b.borderDensity) / Math.max(1, a.borderDensity, b.borderDensity));
  rows.push(["Borders", borderSim, `density ${a.borderDensity} vs ${b.borderDensity}/kB`]);
  const motionSim = jaccard(a.motion, b.motion);
  const sharedMotion = a.motion.filter((m) => b.motion.includes(m));
  rows.push(["Motion", motionSim, sharedMotion.length ? `shared: ${sharedMotion.slice(0, 4).join(", ")}` : "—"]);

  const weights = { Typography: 0.25, Palette: 0.3, "Geometry (radius)": 0.12, Shadow: 0.08, Borders: 0.1, Motion: 0.15 };
  const overall = rows.reduce((s, [k, v]) => s + v * (weights[k] ?? 0), 0);

  console.log(`\nConvergence report — did this identity come from the product,`);
  console.log(`or was it reused by the agent's habit?\n`);
  console.log(`  Dimension            Verdict     Evidence`);
  console.log(`  ${"─".repeat(70)}`);
  for (const [dim, sim, ev] of rows) {
    console.log(`  ${dim.padEnd(20)} ${verdict(sim).padEnd(11)} ${ev}`);
  }
  const pct = Math.round(overall * 100);
  const band = pct >= 66 ? "STRONG convergence — likely reused house style" : pct >= 40 ? "SOME convergence — review shared choices" : "DISTINCT — identities differ";
  console.log(`  ${"─".repeat(70)}`);
  console.log(`  Overall convergence: ~${pct}% — ${band}`);
  console.log(`  Evidence only; a shared choice may still be product-appropriate.\n`);
  return pct;
}

// ── CLI ───────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const vs = argv.indexOf("--vs");
const maxI = argv.indexOf("--max");
const max = maxI >= 0 ? Number(argv[maxI + 1]) : null;
const dirA = argv[0];
if (!dirA || !fs.existsSync(dirA)) {
  console.error("Usage: node identity-fingerprint.mjs <dir> [--vs <dir>] [--max <pct>]");
  process.exit(2);
}
if (vs >= 0) {
  const dirB = argv[vs + 1];
  if (!fs.existsSync(dirB)) { console.error(`Not found: ${dirB}`); process.exit(2); }
  const pct = compare(fingerprint(dirA), fingerprint(dirB));
  process.exit(max !== null && pct > max ? 1 : 0);
} else {
  printFp(fingerprint(dirA));
  console.log("");
  process.exit(0);
}
