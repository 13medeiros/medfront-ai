#!/usr/bin/env node
// MedFront AI — slop-lint.mjs
// Heuristic detector of generic "AI slop" patterns for the `anti-slop` stage.
// It produces EVIDENCE (file:line + counts), not a verdict — the agent still
// makes the final call. No dependencies.
//
// Usage:
//   node slop-lint.mjs [dir] [--ext .tsx,.jsx,.ts,.js,.css,.html,.vue,.svelte]
//   node slop-lint.mjs src --max 30      # exit 1 if estimated contribution > 30
//
// Signals (weights mirror references/scoring-rubric.md):
//   purple-blue gradient (+12) · repeated card shell (+8) · uniform
//   radius/shadow (+6) · repeated reveal/animation (+4) · cliché copy (+3) ·
//   unmarked metric/testimonial (+20, also a P1).

import fs from "node:fs";
import path from "node:path";

const DEFAULT_EXT = [".tsx", ".jsx", ".ts", ".js", ".css", ".scss", ".html", ".vue", ".svelte", ".astro"];
const SKIP = new Set(["node_modules", ".git", ".next", "dist", "build", "out", ".cache"]);
const SHELL_MIN = 6; // a class string repeated this many times ~ a copy-pasted shell

function parseArgs(argv) {
  const cfg = { dir: null, ext: DEFAULT_EXT, max: null };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--ext") cfg.ext = argv[++i].split(",");
    else if (argv[i] === "--max") cfg.max = Number(argv[++i]);
    else rest.push(argv[i]);
  }
  cfg.dir = rest[0] ?? (fs.existsSync("src") ? "src" : ".");
  return cfg;
}

function walk(dir, exts, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, exts, acc);
    else if (exts.includes(path.extname(e.name))) acc.push(p);
  }
  return acc;
}

const lineOf = (text, idx) => text.slice(0, idx).split("\n").length;

// ── Detectors ─────────────────────────────────────────────────────────
const CLICHES = [
  /revolutioniz/i, /revolucion/i, /game.?changer/i, /powered by ai/i,
  /next.level/i, /seamless/i, /supercharge/i, /unlock your/i, /disrupt/i,
  /cutting.edge/i, /best.in.class/i, /world.class/i, /effortless/i,
  /transform your (business|workflow|life)/i, /solu[çc][ãa]o completa/i,
  /transforma[çc][ãa]o digital/i, /leve seu .* para o pr[óo]ximo n[íi]vel/i,
];
const MARKERS = /(demo|example|sample|placeholder|fictional|fict[íi]cio|ilustrativo|demonstra[çc][ãa]o|mock|lorem)/i;
// Marketing metrics live in UI content, near a claim word — not in CSS.
const CONTENT_EXT = new Set([".tsx", ".jsx", ".html", ".vue", ".svelte", ".astro"]);
const CLAIM_CTX = /(faster|slower|increase|growth|boost|save[ds]?|reduc|\broi\b|revenue|conversion|satisfaction|rating|trusted|happy|customers|clients|users|usu[áa]rios|clientes|uptime|aumento|crescimento|economi|mais r[áa]pido|confian[çc]|\+\s?\d)/i;
const METRIC = /(\b\d[\d.,]*\s?%|\b\d+x\b|\$\s?\d[\d.,]*\s?[kmb]?\+?|\b\d[\d.,]{2,}\s?(million|billion|milh[õo]es))/i;

function run() {
  const cfg = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(cfg.dir)) {
    console.error(`Path not found: ${cfg.dir}`);
    process.exit(2);
  }
  const files = walk(cfg.dir, cfg.ext);
  if (files.length === 0) {
    console.log(`No matching files under ${cfg.dir} (ext: ${cfg.ext.join(",")}).`);
    process.exit(0);
  }

  const shellCount = new Map(); // className string -> {n, first}
  const radius = new Map(), shadow = new Map();
  const findings = { gradient: [], animation: 0, animationEx: [], cliche: [], claim: [] };
  let gradientPurpleBlue = false;

  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const rel = file;

    // a) repeated container shell (rounded + border/bg/shadow) — not utilities
    for (const m of text.matchAll(/\bclass(?:Name)?\s*=\s*"([^"]{20,})"/g)) {
      const key = m[1].replace(/\s+/g, " ").trim();
      if (!(/\brounded/.test(key) && /\b(border|bg-|shadow)/.test(key))) continue;
      const cur = shellCount.get(key) ?? { n: 0, first: `${rel}:${lineOf(text, m.index)}` };
      cur.n++;
      shellCount.set(key, cur);
    }
    // b) radius / shadow token distribution
    for (const m of text.matchAll(/\brounded-([\w[\]/.]+)/g)) radius.set(m[1], (radius.get(m[1]) ?? 0) + 1);
    for (const m of text.matchAll(/border-radius:\s*([^;]+);/g)) radius.set(m[1].trim(), (radius.get(m[1].trim()) ?? 0) + 1);
    for (const m of text.matchAll(/\bshadow-([\w[\]/.]+)/g)) shadow.set(m[1], (shadow.get(m[1]) ?? 0) + 1);
    for (const m of text.matchAll(/box-shadow:\s*([^;]+);/g)) shadow.set(m[1].trim(), (shadow.get(m[1].trim()) ?? 0) + 1);

    // c) gradients (exclude repeating-*-gradient: usually functional hatch/texture)
    for (const m of text.matchAll(/(?<!repeating-)\b(linear|radial|conic)-gradient|\bbg-gradient-to-\w+/g)) {
      findings.gradient.push(`${rel}:${lineOf(text, m.index)}`);
    }
    if (/(from|via|to)-(purple|violet|indigo|fuchsia|blue)-\d/.test(text) &&
        /(from|via|to)-(purple|violet|indigo|fuchsia)-\d/.test(text)) {
      gradientPurpleBlue = true;
    }

    // d) repeated animations / reveals
    const anims = [...text.matchAll(/whileInView|animate-\[|initial=\{\{|@keyframes|transition:\s/g)];
    findings.animation += anims.length;
    if (anims.length) findings.animationEx.push(`${rel} (${anims.length})`);

    // e) clichés
    for (const rx of CLICHES) {
      const m = rx.exec(text);
      if (m) findings.cliche.push(`${rel}:${lineOf(text, m.index)} — "${m[0]}"`);
    }
    // f) unmarked metrics / testimonials — UI content only, near a claim word
    if (CONTENT_EXT.has(path.extname(file))) {
      for (const m of text.matchAll(new RegExp(METRIC, "gi"))) {
        const ctx = text.slice(Math.max(0, m.index - 90), m.index + 90);
        if (CLAIM_CTX.test(ctx) && !MARKERS.test(ctx)) {
          findings.claim.push(`${rel}:${lineOf(text, m.index)} — "${m[0].trim()}"`);
        }
      }
      // real <blockquote> content (reliable, no className noise)
      for (const m of text.matchAll(/<blockquote[^>]*>([\s\S]{20,}?)<\/blockquote>/gi)) {
        const inner = m[1].replace(/<[^>]+>/g, " ");
        if (/[a-zà-ú]/i.test(inner) && !MARKERS.test(inner)) {
          findings.claim.push(`${rel}:${lineOf(text, m.index)} — <blockquote> testimonial`);
        }
      }
      // curly-quoted prose near a review word (typographic quotes ≠ code strings)
      for (const m of text.matchAll(/[“][^”]{30,}[”]/g)) {
        const ctx = text.slice(Math.max(0, m.index - 160), m.index + 160);
        if (/(testimonial|depoimento|\breview\b|avalia[çc]|<cite)/i.test(ctx) && !MARKERS.test(ctx)) {
          findings.claim.push(`${rel}:${lineOf(text, m.index)} — testimonial-like quote`);
        }
      }
    }
  }

  // ── Aggregate ─────────────────────────────────────────────────────
  const shells = [...shellCount.entries()].filter(([, v]) => v.n >= SHELL_MIN).sort((a, b) => b[1].n - a[1].n);
  const radTotal = [...radius.values()].reduce((a, b) => a + b, 0);
  const radTop = [...radius.entries()].sort((a, b) => b[1] - a[1])[0];
  const shaTotal = [...shadow.values()].reduce((a, b) => a + b, 0);
  const shaTop = [...shadow.entries()].sort((a, b) => b[1] - a[1])[0];

  let est = 0;
  const line = (s) => console.log(s);
  line(`slop-lint · ${files.length} files under ${cfg.dir}\n`);

  if (shells.length) {
    est += 8;
    line(`▸ Repeated component shell (+8) — ${shells.length} class string(s) reused ≥ ${SHELL_MIN}×:`);
    for (const [k, v] of shells.slice(0, 5)) line(`    ${v.n}×  ${v.first}  "${k.slice(0, 60)}${k.length > 60 ? "…" : ""}"`);
  }
  if (radTop && radTotal >= 12 && radTop[1] / radTotal > 0.8) {
    est += 6;
    line(`▸ Uniform radius (+6) — "${radTop[0]}" is ${Math.round((radTop[1] / radTotal) * 100)}% of ${radTotal} radius uses.`);
  }
  if (shaTop && shaTotal >= 10 && shaTop[1] / shaTotal > 0.8) {
    est += 3;
    line(`▸ Uniform shadow (+3) — "${shaTop[0]}" is ${Math.round((shaTop[1] / shaTotal) * 100)}% of ${shaTotal} shadow uses.`);
  }
  if (findings.gradient.length) {
    const w = gradientPurpleBlue ? 12 : 4;
    est += w;
    line(`▸ Gradient${gradientPurpleBlue ? " — PURPLE-BLUE" : ""} (+${w}) — ${findings.gradient.length} occurrence(s):`);
    for (const g of findings.gradient.slice(0, 5)) line(`    ${g}`);
  }
  if (findings.animation >= 12 && findings.animationEx.length) {
    est += 4;
    line(`▸ Heavy/repeated animation (+4) — ${findings.animation} signals; verify it is not the same reveal everywhere:`);
    for (const a of findings.animationEx.slice(0, 5)) line(`    ${a}`);
  }
  if (findings.cliche.length) {
    est += 3;
    line(`▸ Cliché copy (+3) — ${findings.cliche.length}:`);
    for (const c of findings.cliche.slice(0, 6)) line(`    ${c}`);
  }
  if (findings.claim.length) {
    est += 20;
    line(`▸ Unmarked metric/testimonial (+20, also a P1) — ${findings.claim.length}; label as demo or prove it is real:`);
    for (const c of findings.claim.slice(0, 8)) line(`    ${c}`);
  }

  line(`\nEstimated slop contribution (advisory): ~${est}. Evidence only — confirm`);
  line(`each finding in the anti-slop stage; a low number is not a clean bill.`);

  if (cfg.max !== null && est > cfg.max) {
    line(`\nFAIL — estimated ${est} exceeds --max ${cfg.max}.`);
    process.exit(1);
  }
  process.exit(0);
}

run();
