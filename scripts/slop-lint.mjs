#!/usr/bin/env node
// MedFront AI — slop-lint.mjs
// Deterministic detector of generic "AI slop" patterns for the `anti-slop`
// stage. ~25 rules, no LLM — evidence (rule id + file:line), not a verdict.
// The agent still confirms each finding. No dependencies.
//
// Usage:
//   node slop-lint.mjs [dir] [--ext .tsx,.css,...] [--max 30] [--json]
//
// Exit: 0 ok · 1 over --max · 2 bad path.

import fs from "node:fs";
import path from "node:path";

const DEFAULT_EXT = [".tsx", ".jsx", ".ts", ".js", ".css", ".scss", ".html", ".vue", ".svelte", ".astro"];
const CONTENT_EXT = new Set([".tsx", ".jsx", ".html", ".vue", ".svelte", ".astro"]);
const HTMLISH = new Set([".tsx", ".jsx", ".html", ".vue", ".svelte", ".astro"]);
const SKIP = new Set(["node_modules", ".git", ".next", "dist", "build", "out", ".cache", ".svelte-kit"]);
const SHELL_MIN = 6;

// ── Rule registry: id → { cat, weight, title } ───────────────────────
const R = {
  "GRAD-01": { cat: "Color", w: 12, t: "Purple-blue gradient" },
  "GRAD-02": { cat: "Color", w: 8, t: "Gradient text (bg-clip-text)" },
  "GRAD-03": { cat: "Color", w: 4, t: "Decorative gradient background" },
  "GLASS-01": { cat: "Color", w: 8, t: "Glassmorphism (backdrop-blur)" },
  "ORB-01": { cat: "Color", w: 8, t: "Blurred glow orb / blob" },
  "HEX-01": { cat: "Color", w: 3, t: "Raw hex colors in markup (not tokens)" },
  "GEOM-01": { cat: "Geometry", w: 6, t: "Uniform border-radius across components" },
  "GEOM-02": { cat: "Geometry", w: 3, t: "Uniform shadow across components" },
  "SHELL-01": { cat: "Geometry", w: 8, t: "Repeated container shell (copy-pasted card)" },
  "SHELL-02": { cat: "Geometry", w: 5, t: "Repeated identical card grid" },
  "ICON-01": { cat: "Components", w: 5, t: "Repeated icon-in-rounded-square chip" },
  "MOTION-01": { cat: "Motion", w: 4, t: "Identical reveal animation repeated" },
  "MOTION-02": { cat: "Motion", w: 3, t: "animate-pulse / animate-bounce overuse" },
  "COPY-01": { cat: "Copy", w: 3, t: "Marketing cliché" },
  "COPY-02": { cat: "Copy", w: 3, t: "Generic CTA (Get Started / Learn More…)" },
  "COPY-03": { cat: "Copy", w: 5, t: "Lorem ipsum placeholder" },
  "COPY-04": { cat: "Copy", w: 2, t: "Decorative emoji in content" },
  "CLAIM-01": { cat: "Honesty", w: 20, t: "Unmarked metric (label as demo or prove)" },
  "CLAIM-02": { cat: "Honesty", w: 12, t: "Unmarked testimonial" },
  "A11Y-01": { cat: "Accessibility", w: 6, t: "<img> without alt" },
  "A11Y-02": { cat: "Accessibility", w: 6, t: "onClick on non-interactive element" },
  "A11Y-03": { cat: "Accessibility", w: 3, t: "Positive tabindex" },
  "A11Y-04": { cat: "Accessibility", w: 4, t: "<html> without lang" },
  "HYG-01": { cat: "Hygiene", w: 2, t: 'Placeholder link href="#"' },
  "HYG-02": { cat: "Hygiene", w: 1, t: "TODO / FIXME left in" },
  "HYG-03": { cat: "Hygiene", w: 2, t: "console.log / debugger left in" },
};

const CLICHES = [/revolutioniz/i, /revolucion/i, /game.?changer/i, /powered by ai/i, /next.level/i, /seamless/i, /supercharge/i, /unlock your/i, /disrupt/i, /cutting.edge/i, /best.in.class/i, /world.class/i, /effortless/i, /transform your (business|workflow|life)/i, /solu[çc][ãa]o completa/i, /transforma[çc][ãa]o digital/i];
const GENERIC_CTA = /\b(get started|learn more|try it (now|free)|sign up free|book a demo|start (free|now)|come[çc]ar agora|saiba mais)\b/i;
const MARKERS = /(demo|example|sample|placeholder|fictional|fict[íi]cio|ilustrativo|demonstra[çc][ãa]o|mock|lorem)/i;
const CLAIM_CTX = /(faster|slower|increase|growth|boost|save[ds]?|reduc|\broi\b|revenue|conversion|satisfaction|rating|trusted|happy|customers|clients|users|usu[áa]rios|clientes|uptime|aumento|crescimento|economi|mais r[áa]pido|confian[çc]|\+\s?\d)/i;
const METRIC = /(\b\d[\d.,]*\s?%|\b\d+x\b|\$\s?\d[\d.,]*\s?[kmb]?\+?|\b\d[\d.,]{2,}\s?(million|billion|milh[õo]es))/i;
// Pictographic emoji block + a few common decorative ones — deliberately
// excludes plain symbols like ★ ☆ ✓ that are legit UI glyphs (rating widgets).
const EMOJI = /[\u{1F300}-\u{1FAFF}]|[\u{2728}\u{2705}\u{274C}\u{2764}\u{26A1}\u{2B50}]/u;

const walk = (dir, exts, acc = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, exts, acc);
    else if (exts.includes(path.extname(e.name))) acc.push(p);
  }
  return acc;
};
const lineOf = (t, i) => t.slice(0, i).split("\n").length;

function main() {
  const argv = process.argv.slice(2);
  const cfg = { dir: null, ext: DEFAULT_EXT, max: null, json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--ext") cfg.ext = argv[++i].split(",");
    else if (a === "--max") cfg.max = Number(argv[++i]);
    else if (a === "--json") cfg.json = true;
    else if (!a.startsWith("--")) cfg.dir = a;
  }
  cfg.dir = cfg.dir ?? (fs.existsSync("src") ? "src" : ".");
  if (!fs.existsSync(cfg.dir)) { console.error(`Path not found: ${cfg.dir}`); process.exit(2); }

  const files = walk(cfg.dir, cfg.ext);
  const findings = {}; // id -> [ev...]
  const add = (id, ev) => (findings[id] ??= []).push(ev);

  // aggregate stats
  const radius = new Map(), shadow = new Map(), shells = new Map(), grids = new Map();
  let motionInit = new Map(), pulse = 0, iconChip = 0;

  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const ext = path.extname(file);
    const rel = file;
    const at = (i) => `${rel}:${lineOf(text, i)}`;
    const classAttrs = [...text.matchAll(/\bclass(?:Name)?\s*=\s*"([^"]+)"/g)];

    // Color
    if (/(from|via|to)-(purple|violet|indigo|fuchsia)-\d/.test(text) && /(from|via|to)-(blue|indigo|violet|cyan|sky)-\d/.test(text))
      for (const m of text.matchAll(/(from|via|to)-(purple|violet|indigo|fuchsia)-\d\d?\d?/g)) add("GRAD-01", at(m.index));
    for (const c of classAttrs) if (/text-transparent/.test(c[1]) && /bg-clip-text|bg-gradient/.test(c[1])) add("GRAD-02", at(c.index));
    for (const m of text.matchAll(/(?<!repeating-)\b(linear|radial|conic)-gradient|\bbg-gradient-to-\w+/g)) add("GRAD-03", at(m.index));
    for (const m of text.matchAll(/\bbackdrop-blur\b|backdrop-filter:\s*blur/g)) add("GLASS-01", at(m.index));
    for (const c of classAttrs) if (/\bblur-(2xl|3xl)\b/.test(c[1]) && /\brounded-full\b/.test(c[1]) && /\babsolute\b/.test(c[1])) add("ORB-01", at(c.index));
    if (HTMLISH.has(ext)) { const hexes = (text.match(/(class(Name)?|style)\s*=\s*(["'{])[^"'}]*#[0-9a-fA-F]{3,6}/g) || []); if (hexes.length) for (const m of text.matchAll(/#[0-9a-fA-F]{6}\b/g)) add("HEX-01", at(m.index)); }

    // Geometry stats
    for (const m of text.matchAll(/\brounded-([\w[\]/.-]+)/g)) radius.set(m[1], (radius.get(m[1]) ?? 0) + 1);
    for (const m of text.matchAll(/border-radius:\s*([^;]+)/g)) radius.set(m[1].trim(), (radius.get(m[1].trim()) ?? 0) + 1);
    for (const m of text.matchAll(/\bshadow-([\w[\]/.-]+)/g)) shadow.set(m[1], (shadow.get(m[1]) ?? 0) + 1);
    for (const c of classAttrs) {
      const k = c[1].replace(/\s+/g, " ").trim();
      if (k.length >= 20 && /\brounded/.test(k) && /\b(border|bg-|shadow)/.test(k)) { const cur = shells.get(k) ?? { n: 0, ev: at(c.index) }; cur.n++; shells.set(k, cur); }
      if (/\bgrid\b/.test(k) && /grid-cols-/.test(k)) { const cur = grids.get(k) ?? { n: 0, ev: at(c.index) }; cur.n++; grids.set(k, cur); }
      if (/\brounded-(lg|xl|full)\b/.test(k) && /\bbg-[\w-]+\/(10|20)\b/.test(k) && /\bitems-center\b/.test(k) && /\bjustify-center\b/.test(k) && /\b[wh]-(8|9|10|11|12|14|16)\b/.test(k)) iconChip++;
    }

    // Motion
    for (const m of text.matchAll(/initial=\{\{([^}]+)\}\}/g)) { const k = m[1].replace(/\s+/g, ""); motionInit.set(k, (motionInit.get(k) ?? 0) + 1); }
    for (const m of text.matchAll(/\banimate-(pulse|bounce)\b/g)) { pulse++; }

    // Copy (content files)
    if (CONTENT_EXT.has(ext) || ext === ".md") {
      for (const rx of CLICHES) { const m = rx.exec(text); if (m) add("COPY-01", `${at(m.index)} — "${m[0]}"`); }
      for (const m of text.matchAll(new RegExp(GENERIC_CTA, "gi"))) add("COPY-02", `${at(m.index)} — "${m[0]}"`);
      for (const m of text.matchAll(/lorem ipsum/gi)) add("COPY-03", at(m.index));
    }
    if (CONTENT_EXT.has(ext)) {
      let emo = 0; for (const _ of text.matchAll(new RegExp(EMOJI, "gu"))) emo++; if (emo >= 3) add("COPY-04", `${rel} (${emo} emoji)`);
      for (const m of text.matchAll(new RegExp(METRIC, "gi"))) { const c = text.slice(Math.max(0, m.index - 90), m.index + 90); if (CLAIM_CTX.test(c) && !MARKERS.test(c)) add("CLAIM-01", `${at(m.index)} — "${m[0].trim()}"`); }
      for (const m of text.matchAll(/<blockquote[^>]*>([\s\S]{20,}?)<\/blockquote>/gi)) { const inner = m[1].replace(/<[^>]+>/g, " "); if (/[a-zà-ú]/i.test(inner) && !MARKERS.test(inner)) add("CLAIM-02", `${at(m.index)} — <blockquote>`); }
      for (const m of text.matchAll(/[“][^”]{30,}[”]/g)) { const c = text.slice(Math.max(0, m.index - 160), m.index + 160); if (/(testimonial|depoimento|\breview\b|avalia[çc])/i.test(c) && !MARKERS.test(c)) add("CLAIM-02", at(m.index)); }
    }

    // Accessibility (markup)
    if (HTMLISH.has(ext)) {
      for (const m of text.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/gi)) add("A11Y-01", at(m.index));
      for (const m of text.matchAll(/<(div|span|li)\b[^>]*\bonClick=(?![^>]*\brole=)[^>]*>/gi)) add("A11Y-02", at(m.index));
      for (const m of text.matchAll(/tab[iI]ndex=["'{]?\s*[1-9]/g)) add("A11Y-03", at(m.index));
    }
    if (ext === ".html") for (const m of text.matchAll(/<html\b(?![^>]*\blang=)[^>]*>/gi)) add("A11Y-04", at(m.index));

    // Hygiene
    for (const m of text.matchAll(/href=["']#["']/g)) add("HYG-01", at(m.index));
    for (const m of text.matchAll(/\b(TODO|FIXME)\b/g)) add("HYG-02", at(m.index));
    for (const m of text.matchAll(/console\.log\(|\bdebugger\b/g)) add("HYG-03", at(m.index));
  }

  // ── aggregate rules ─────────────────────────────────────────────
  const rTot = [...radius.values()].reduce((a, b) => a + b, 0), rTop = [...radius.entries()].sort((a, b) => b[1] - a[1])[0];
  if (rTop && rTot >= 12 && rTop[1] / rTot > 0.8) add("GEOM-01", `"${rTop[0]}" = ${Math.round((rTop[1] / rTot) * 100)}% of ${rTot} radius uses`);
  const sTot = [...shadow.values()].reduce((a, b) => a + b, 0), sTop = [...shadow.entries()].sort((a, b) => b[1] - a[1])[0];
  if (sTop && sTot >= 10 && sTop[1] / sTot > 0.8) add("GEOM-02", `"${sTop[0]}" = ${Math.round((sTop[1] / sTot) * 100)}% of ${sTot} shadow uses`);
  for (const [k, v] of shells) if (v.n >= SHELL_MIN) add("SHELL-01", `${v.n}× ${v.ev} "${k.slice(0, 50)}…"`);
  for (const [k, v] of grids) if (v.n >= 3) add("SHELL-02", `${v.n}× ${v.ev} "${k.slice(0, 50)}…"`);
  if (iconChip >= 3) add("ICON-01", `${iconChip} icon-in-rounded-square chips`);
  for (const [k, n] of motionInit) if (n >= 3) add("MOTION-01", `${n}× identical initial={{${k.slice(0, 40)}…}}`);
  if (pulse >= 4) add("MOTION-02", `${pulse} animate-pulse/bounce uses`);

  // ── output ──────────────────────────────────────────────────────
  const fired = Object.keys(findings);
  const est = fired.reduce((s, id) => s + (R[id]?.w ?? 0), 0);
  if (cfg.json) {
    console.log(JSON.stringify({ files: files.length, estimate: est, findings: fired.map((id) => ({ id, ...R[id], count: findings[id].length, evidence: findings[id].slice(0, 20) })) }, null, 2));
    process.exit(cfg.max !== null && est > cfg.max ? 1 : 0);
  }
  console.log(`slop-lint · ${files.length} files · ${fired.length} rule(s) fired\n`);
  const cats = [...new Set(fired.map((id) => R[id].cat))];
  for (const cat of cats) {
    const ids = fired.filter((id) => R[id].cat === cat).sort((a, b) => R[b].w - R[a].w);
    console.log(`${cat}`);
    for (const id of ids) {
      console.log(`  [${id} +${R[id].w}] ${R[id].t} — ${findings[id].length}×`);
      for (const ev of findings[id].slice(0, 4)) console.log(`      ${ev}`);
    }
  }
  const band = est <= 15 ? "strong identity" : est <= 30 ? "some generic patterns" : est <= 50 ? "predictable" : est <= 70 ? "template/AI look" : "severe AI slop";
  console.log(`\nEstimated slop contribution (advisory): ~${est} — ${band}.`);
  console.log("Evidence only — confirm each in the anti-slop stage. Low ≠ clean bill.");
  process.exit(cfg.max !== null && est > cfg.max ? 1 : 0);
}

main();
