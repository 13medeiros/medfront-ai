#!/usr/bin/env node
// MedFront AI — slop-lint.mjs
// Deterministic frontend auditor for the `anti-slop` stage. It reports FOUR
// separate results, because not everything it finds is "slop":
//   • Visual Slop score (generic AI look)   — gate ≤ 30
//   • Honesty findings (fake proof)          — certification blocker (P1)
//   • Accessibility findings                 — feed the a11y gate
//   • Hygiene warnings                       — advisory, non-blocking
// No LLM, no dependencies. Every finding has a rule id, weight, confidence and
// file:line evidence. Suppress a false positive with a justified comment:
//   // medfront-ignore GRAD-02 -- brand gradient, intentional
//   <section data-medfront-ignore="SHELL-01">
//
// Usage: node slop-lint.mjs [dir] [--ext ...] [--max 30] [--json]
// Exit: 0 ok · 1 slop>max OR honesty blocker present · 2 bad path.

import fs from "node:fs";
import path from "node:path";

const DEFAULT_EXT = [".tsx", ".jsx", ".ts", ".js", ".css", ".scss", ".html", ".vue", ".svelte", ".astro"];
const CONTENT_EXT = new Set([".tsx", ".jsx", ".html", ".vue", ".svelte", ".astro"]);
const HTMLISH = new Set([".tsx", ".jsx", ".html", ".vue", ".svelte", ".astro"]);
const SKIP = new Set(["node_modules", ".git", ".next", "dist", "build", "out", ".cache", ".svelte-kit"]);
const SHELL_MIN = 6;

// bucket: slop | honesty | accessibility | hygiene · agg: presence-based (skip saturation)
const R = {
  "GRAD-01": { bucket: "slop", cat: "Color", w: 12, conf: "high", t: "Purple-blue gradient" },
  "GRAD-02": { bucket: "slop", cat: "Color", w: 8, conf: "medium", t: "Gradient text (bg-clip-text)" },
  "GRAD-03": { bucket: "slop", cat: "Color", w: 4, conf: "low", t: "Decorative gradient background" },
  "GLASS-01": { bucket: "slop", cat: "Color", w: 8, conf: "high", t: "Glassmorphism (backdrop-blur)" },
  "ORB-01": { bucket: "slop", cat: "Color", w: 8, conf: "high", t: "Blurred glow orb / blob" },
  "HEX-01": { bucket: "slop", cat: "Color", w: 3, conf: "low", agg: true, t: "Raw hex colors in markup (not tokens)" },
  "GEOM-01": { bucket: "slop", cat: "Geometry", w: 6, conf: "low", agg: true, t: "Uniform border-radius across components" },
  "GEOM-02": { bucket: "slop", cat: "Geometry", w: 3, conf: "low", agg: true, t: "Uniform shadow across components" },
  "SHELL-01": { bucket: "slop", cat: "Geometry", w: 8, conf: "medium", agg: true, t: "Repeated container shell (copy-pasted card)" },
  "SHELL-02": { bucket: "slop", cat: "Geometry", w: 5, conf: "medium", agg: true, t: "Repeated identical card grid" },
  "BORDER-01": { bucket: "slop", cat: "Geometry", w: 6, conf: "medium", agg: true, t: "Everything is a bordered box" },
  "ICON-01": { bucket: "slop", cat: "Components", w: 5, conf: "medium", agg: true, t: "Repeated icon-in-rounded-square chip" },
  "BADGE-01": { bucket: "slop", cat: "Components", w: 4, conf: "medium", agg: true, t: "Pill / badge overuse" },
  "MOTION-01": { bucket: "slop", cat: "Motion", w: 4, conf: "medium", agg: true, t: "Identical reveal animation repeated" },
  "MOTION-02": { bucket: "slop", cat: "Motion", w: 3, conf: "medium", agg: true, t: "animate-pulse / bounce overuse" },
  "MOTION-03": { bucket: "slop", cat: "Motion", w: 6, conf: "high", agg: true, t: "Motion without prefers-reduced-motion" },
  "HERO-01": { bucket: "slop", cat: "Structure", w: 6, conf: "medium", agg: true, t: "Generic hero composition" },
  "SECTION-01": { bucket: "slop", cat: "Structure", w: 8, conf: "medium", agg: true, t: "Repeated section grammar" },
  "LAYOUT-01": { bucket: "slop", cat: "Structure", w: 3, conf: "low", agg: true, t: "Excessive centering" },
  "COPY-01": { bucket: "slop", cat: "Copy", w: 3, conf: "medium", t: "Marketing cliché" },
  "COPY-02": { bucket: "slop", cat: "Copy", w: 3, conf: "medium", t: "Generic CTA (Get Started / Learn More…)" },
  "COPY-03": { bucket: "slop", cat: "Copy", w: 5, conf: "high", t: "Lorem ipsum placeholder" },
  "COPY-04": { bucket: "slop", cat: "Copy", w: 2, conf: "low", agg: true, t: "Decorative emoji in content" },
  "COPY-05": { bucket: "slop", cat: "Copy", w: 3, conf: "medium", t: "Interchangeable headline template" },
  "CTA-02": { bucket: "slop", cat: "Copy", w: 2, conf: "low", t: "Vague CTA verb (Explore / Discover…)" },
  "CLAIM-01": { bucket: "honesty", w: 20, conf: "high", sev: "P1", t: "Unmarked metric (label as demo or prove)" },
  "CLAIM-02": { bucket: "honesty", w: 12, conf: "high", sev: "P1", t: "Unmarked testimonial" },
  "A11Y-01": { bucket: "accessibility", w: 6, conf: "high", t: "<img> without alt" },
  "A11Y-02": { bucket: "accessibility", w: 6, conf: "medium", t: "onClick on non-interactive element" },
  "A11Y-03": { bucket: "accessibility", w: 3, conf: "high", t: "Positive tabindex" },
  "A11Y-04": { bucket: "accessibility", w: 4, conf: "high", t: "<html> without lang" },
  "A11Y-05": { bucket: "accessibility", w: 6, conf: "medium", t: "Icon-only control without accessible name" },
  "A11Y-08": { bucket: "accessibility", w: 4, conf: "high", t: "<iframe> without title" },
  "A11Y-10": { bucket: "accessibility", w: 6, conf: "high", t: "aria-hidden on a focusable element" },
  "HYG-01": { bucket: "hygiene", w: 2, conf: "medium", t: 'Placeholder link href="#"' },
  "HYG-02": { bucket: "hygiene", w: 1, conf: "high", t: "TODO / FIXME left in" },
  "HYG-03": { bucket: "hygiene", w: 2, conf: "high", t: "console.log / debugger left in" },
};

const CLICHES = [/revolutioniz/i, /revolucion/i, /game.?changer/i, /powered by ai/i, /next.level/i, /seamless/i, /supercharge/i, /unlock your/i, /disrupt/i, /cutting.edge/i, /best.in.class/i, /world.class/i, /effortless/i, /transform your (business|workflow|life)/i, /solu[çc][ãa]o completa/i, /transforma[çc][ãa]o digital/i];
const HEADLINE_TPL = [/everything you need to/i, /built for (teams|people|developers)/i, /the smarter way to/i, /transform the way you/i, /designed to help you/i, /the easiest way to/i, /say goodbye to/i, /meet the (?:new|future)/i];
const GENERIC_CTA = /\b(get started|learn more|try it (now|free)|sign up free|book a demo|start (free|now)|come[çc]ar agora|saiba mais)\b/i;
const VAGUE_CTA = /\b(explore|discover|unlock|experience|see the magic|dive in)\b/i;
const MARKERS = /(demo|example|sample|placeholder|fictional|fict[íi]cio|ilustrativo|demonstra[çc][ãa]o|mock|lorem)/i;
const CLAIM_CTX = /(faster|slower|increase|growth|boost|save[ds]?|reduc|\broi\b|revenue|conversion|satisfaction|rating|trusted|happy|customers|clients|users|usu[áa]rios|clientes|uptime|aumento|crescimento|economi|mais r[áa]pido|confian[çc]|\+\s?\d)/i;
const METRIC = /(\b\d[\d.,]*\s?%|\b\d+x\b|\$\s?\d[\d.,]*\s?[kmb]?\+?|\b\d[\d.,]{2,}\s?(million|billion|milh[õo]es))/i;
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
const factor = (n) => (n >= 4 ? 1 : n >= 2 ? 0.75 : 0.5);

function main() {
  const argv = process.argv.slice(2);
  const cfg = { dir: null, ext: DEFAULT_EXT, max: 30, json: false };
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
  const suppressed = []; // {id, file, reason}
  const suppressMap = new Map(); // file -> Map(id -> reason)

  for (const file of files) {
    const t = fs.readFileSync(file, "utf8");
    const m = new Map();
    for (const s of t.matchAll(/medfront-ignore\s+([A-Z0-9-]+)(?:\s*--\s*(.*))?/g)) m.set(s[1], (s[2] || "").trim());
    for (const s of t.matchAll(/data-medfront-ignore=["']([A-Z0-9-]+)/g)) m.set(s[1], "inline");
    if (m.size) suppressMap.set(file, m);
  }
  const add = (id, file, ev) => {
    const sup = suppressMap.get(file);
    if (sup && sup.has(id)) { suppressed.push({ id, file, reason: sup.get(id) }); return; }
    (findings[id] ??= []).push(ev);
  };

  const radius = new Map(), shadow = new Map(), shells = new Map(), grids = new Map();
  const motionInit = new Map();
  let iconChip = 0, badge = 0, boxed = 0, containers = 0, centering = 0, pulse = 0;
  let motionSignals = 0, reducedMotion = false, bigHeadings = 0, sectionGrammar = 0;

  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const ext = path.extname(file);
    const rel = file;
    const at = (i) => `${rel}:${lineOf(text, i)}`;
    const classAttrs = [...text.matchAll(/\bclass(?:Name)?\s*=\s*"([^"]+)"/g)];

    // Color
    if (/(from|via|to)-(purple|violet|indigo|fuchsia)-\d/.test(text) && /(from|via|to)-(blue|indigo|violet|cyan|sky)-\d/.test(text))
      for (const g of text.matchAll(/(from|via|to)-(purple|violet|indigo|fuchsia)-\d\d?\d?/g)) add("GRAD-01", file, at(g.index));
    for (const c of classAttrs) if (/text-transparent/.test(c[1]) && /bg-clip-text|bg-gradient/.test(c[1])) add("GRAD-02", file, at(c.index));
    for (const g of text.matchAll(/(?<!repeating-)\b(linear|radial|conic)-gradient|\bbg-gradient-to-\w+/g)) add("GRAD-03", file, at(g.index));
    for (const g of text.matchAll(/\bbackdrop-blur\b|backdrop-filter:\s*blur/g)) add("GLASS-01", file, at(g.index));
    for (const c of classAttrs) if (/\bblur-(2xl|3xl)\b/.test(c[1]) && /\brounded-full\b/.test(c[1]) && /\babsolute\b/.test(c[1])) add("ORB-01", file, at(c.index));
    if (HTMLISH.has(ext) && !/tokens|theme|colors/i.test(rel) && (text.match(/(class(Name)?|style)\s*=\s*(["'{])[^"'}]*#[0-9a-fA-F]{3,6}/g) || []).length) for (const g of text.matchAll(/#[0-9a-fA-F]{6}\b/g)) add("HEX-01", file, at(g.index));

    // Geometry stats
    for (const g of text.matchAll(/\brounded-([\w[\]/.-]+)/g)) radius.set(g[1], (radius.get(g[1]) ?? 0) + 1);
    for (const g of text.matchAll(/border-radius:\s*([^;]+)/g)) radius.set(g[1].trim(), (radius.get(g[1].trim()) ?? 0) + 1);
    for (const g of text.matchAll(/\bshadow-([\w[\]/.-]+)/g)) shadow.set(g[1], (shadow.get(g[1]) ?? 0) + 1);
    for (const c of classAttrs) {
      const k = c[1].replace(/\s+/g, " ").trim();
      if (/\b(p|px|py)-\d/.test(k) && (/\brounded/.test(k) || /\bborder\b/.test(k))) containers++;
      if (/\bborder\b/.test(k) && /\bbg-/.test(k) && /\b(p|px|py)-\d/.test(k) && /\brounded/.test(k)) boxed++;
      if (k.length >= 20 && /\brounded/.test(k) && /\b(border|bg-|shadow)/.test(k)) { const cur = shells.get(k) ?? { n: 0, ev: at(c.index) }; cur.n++; shells.set(k, cur); }
      if (/\bgrid\b/.test(k) && /grid-cols-/.test(k)) { const cur = grids.get(k) ?? { n: 0, ev: at(c.index) }; cur.n++; grids.set(k, cur); }
      if (/\brounded-(lg|xl|full)\b/.test(k) && /\bbg-[\w-]+\/(10|20)\b/.test(k) && /\bitems-center\b/.test(k) && /\bjustify-center\b/.test(k) && /\b[wh]-(8|9|10|11|12|14|16)\b/.test(k)) iconChip++;
      if (/\brounded-full\b/.test(k) && /\bpx-[23]\b/.test(k) && /\bpy-(0\.5|1)\b/.test(k)) badge++;
      centering += (k.match(/\b(text-center|items-center|justify-center|mx-auto)\b/g) || []).length;
    }
    for (const g of text.matchAll(/\btext-(4xl|5xl|6xl|7xl)\b/g)) bigHeadings++;

    // Motion
    for (const g of text.matchAll(/initial=\{\{([^}]+)\}\}/g)) { const k = g[1].replace(/\s+/g, ""); motionInit.set(k, (motionInit.get(k) ?? 0) + 1); }
    for (const _ of text.matchAll(/\banimate-(pulse|bounce)\b/g)) pulse++;
    motionSignals += (text.match(/\bmotion\.\w|whileInView|@keyframes|\banimate-\[|transition-transform|\btranslate[xy]?-|\bscale-\d|\brotate-\d/g) || []).length;
    if (/prefers-reduced-motion/.test(text)) reducedMotion = true;

    // Copy
    if (CONTENT_EXT.has(ext) || ext === ".md") {
      for (const rx of CLICHES) { const g = rx.exec(text); if (g) add("COPY-01", file, `${at(g.index)} — "${g[0]}"`); }
      for (const g of text.matchAll(new RegExp(GENERIC_CTA, "gi"))) add("COPY-02", file, `${at(g.index)} — "${g[0]}"`);
      for (const g of text.matchAll(/lorem ipsum/gi)) add("COPY-03", file, at(g.index));
      for (const rx of HEADLINE_TPL) { const g = rx.exec(text); if (g) add("COPY-05", file, `${at(g.index)} — "${g[0]}"`); }
      for (const g of text.matchAll(new RegExp(VAGUE_CTA, "gi"))) if (/>\s*[^<]*$/.test(text.slice(Math.max(0, g.index - 12), g.index)) || /button|<a\b/i.test(text.slice(Math.max(0, g.index - 60), g.index))) add("CTA-02", file, `${at(g.index)} — "${g[0]}"`);
    }
    if (CONTENT_EXT.has(ext)) {
      let emo = 0; for (const _ of text.matchAll(new RegExp(EMOJI, "gu"))) emo++; if (emo >= 3) add("COPY-04", file, `${rel} (${emo} emoji)`);
      for (const g of text.matchAll(new RegExp(METRIC, "gi"))) { const c = text.slice(Math.max(0, g.index - 90), g.index + 90); if (CLAIM_CTX.test(c) && !MARKERS.test(c)) add("CLAIM-01", file, `${at(g.index)} — "${g[0].trim()}"`); }
      for (const g of text.matchAll(/<blockquote[^>]*>([\s\S]{20,}?)<\/blockquote>/gi)) { const inner = g[1].replace(/<[^>]+>/g, " "); if (/[a-zà-ú]/i.test(inner) && !MARKERS.test(inner)) add("CLAIM-02", file, `${at(g.index)} — <blockquote>`); }
      for (const g of text.matchAll(/[“][^”]{30,}[”]/g)) { const c = text.slice(Math.max(0, g.index - 160), g.index + 160); if (/(testimonial|depoimento|\breview\b|avalia[çc])/i.test(c) && !MARKERS.test(c)) add("CLAIM-02", file, at(g.index)); }
    }

    // Accessibility
    if (HTMLISH.has(ext)) {
      for (const g of text.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/gi)) add("A11Y-01", file, at(g.index));
      for (const g of text.matchAll(/<(div|span|li)\b[^>]*\bonClick=(?![^>]*\brole=)[^>]*>/gi)) add("A11Y-02", file, at(g.index));
      for (const g of text.matchAll(/tab[iI]ndex=["'{]?\s*[1-9]/g)) add("A11Y-03", file, at(g.index));
      for (const g of text.matchAll(/<iframe\b(?![^>]*\btitle=)[^>]*>/gi)) add("A11Y-08", file, at(g.index));
      for (const g of text.matchAll(/<(a|button|input|select|textarea)\b[^>]*aria-hidden=["'{]?\s*true/gi)) add("A11Y-10", file, at(g.index));
      // icon-only control without accessible name
      for (const g of text.matchAll(/<(button|a)\b((?:(?!aria-label|aria-labelledby|\btitle=)[^>])*)>\s*(<(?:svg|[A-Z]\w*)[^>]*\/?>(?:[^<]*<\/[A-Za-z]+>)?)?\s*<\/\1>/gi)) {
        const inner = g[3] || ""; if (/^<(svg|[A-Z])/i.test(inner.trim())) add("A11Y-05", file, at(g.index));
      }
    }
    if (ext === ".html") for (const g of text.matchAll(/<html\b(?![^>]*\blang=)[^>]*>/gi)) add("A11Y-04", file, at(g.index));

    // Hygiene
    for (const g of text.matchAll(/href=["']#["']/g)) add("HYG-01", file, at(g.index));
    for (const g of text.matchAll(/\b(TODO|FIXME)\b/g)) add("HYG-02", file, at(g.index));
    for (const g of text.matchAll(/console\.log\(|\bdebugger\b/g)) add("HYG-03", file, at(g.index));

    // Section grammar (per file): eyebrow-ish + heading + a 3-card grid, repeated
    const grammar = (text.match(/grid-cols-3|md:grid-cols-3/g) || []).length;
    if (grammar >= 2 && /text-(2xl|3xl|4xl|5xl|6xl)/.test(text)) sectionGrammar += grammar;
  }

  // ── aggregate rules ──
  const gTot = files.length || 1;
  const rTot = [...radius.values()].reduce((a, b) => a + b, 0), rTop = [...radius.entries()].sort((a, b) => b[1] - a[1])[0];
  if (rTop && rTot >= 12 && rTop[1] / rTot > 0.8) add("GEOM-01", rTop[0], `"${rTop[0]}" = ${Math.round((rTop[1] / rTot) * 100)}% of ${rTot} radius uses`);
  const sTot = [...shadow.values()].reduce((a, b) => a + b, 0), sTop = [...shadow.entries()].sort((a, b) => b[1] - a[1])[0];
  if (sTop && sTot >= 10 && sTop[1] / sTot > 0.8) add("GEOM-02", sTop[0], `"${sTop[0]}" = ${Math.round((sTop[1] / sTot) * 100)}% of ${sTot} shadow uses`);
  for (const [k, v] of shells) if (v.n >= SHELL_MIN) add("SHELL-01", "agg", `${v.n}× ${v.ev} "${k.slice(0, 46)}…"`);
  for (const [k, v] of grids) if (v.n >= 3) add("SHELL-02", "agg", `${v.n}× ${v.ev}`);
  if (containers >= 12 && boxed / containers > 0.75) add("BORDER-01", "agg", `${Math.round((boxed / containers) * 100)}% of ${containers} containers are bordered+bg+padded boxes`);
  if (iconChip >= 3) add("ICON-01", "agg", `${iconChip} icon-in-rounded-square chips`);
  if (badge >= 5) add("BADGE-01", "agg", `${badge} pill/badge elements`);
  for (const [k, n] of motionInit) if (n >= 3) add("MOTION-01", "agg", `${n}× identical initial={{${k.slice(0, 36)}…}}`);
  if (pulse >= 4) add("MOTION-02", "agg", `${pulse} animate-pulse/bounce uses`);
  if (motionSignals >= 8 && !reducedMotion) add("MOTION-03", "agg", `${motionSignals} motion signals, no prefers-reduced-motion anywhere`);
  if (bigHeadings >= 3 && centering >= 8) add("HERO-01", "agg", `${bigHeadings} oversized headings + heavy centering`);
  if (sectionGrammar >= 6) add("SECTION-01", "agg", `repeated eyebrow/heading/3-card section grammar (${sectionGrammar})`);
  if (centering >= gTot * 10) add("LAYOUT-01", "agg", `${centering} centering utilities across ${gTot} files`);

  // ── score buckets ──
  const fired = Object.keys(findings);
  const contrib = (id) => { const r = R[id]; return r.agg ? r.w : Math.round(r.w * factor(findings[id].length)); };
  const bucketIds = (b) => fired.filter((id) => R[id].bucket === b);
  const slop = Math.min(100, bucketIds("slop").reduce((s, id) => s + contrib(id), 0));
  const honesty = bucketIds("honesty");
  const a11y = bucketIds("accessibility");
  const hyg = bucketIds("hygiene");
  const confRank = { high: 3, medium: 2, low: 1 };
  const avgConf = fired.length ? fired.reduce((s, id) => s + confRank[R[id].conf], 0) / fired.length : 3;
  const reviewConf = avgConf >= 2.5 ? "high" : avgConf >= 1.8 ? "medium-high" : "medium";
  const slopPass = slop <= cfg.max;

  if (cfg.json) {
    const mk = (id) => ({ id, ...R[id], count: findings[id].length, contribution: contrib(id), evidence: findings[id].slice(0, 20) });
    console.log(JSON.stringify({ files: files.length, slop, slopGate: cfg.max, slopPass, honestyBlockers: honesty.length, accessibility: a11y.reduce((s, id) => s + findings[id].length, 0), hygiene: hyg.reduce((s, id) => s + findings[id].length, 0), reviewConfidence: reviewConf, findings: fired.map(mk), suppressed }, null, 2));
    process.exit(!slopPass || honesty.length ? 1 : 0);
  }

  const P = (n, w) => String(n).padEnd(w);
  console.log(`slop-lint · ${files.length} files${suppressed.length ? ` · ${suppressed.length} suppressed` : ""}\n`);
  console.log(`Visual Slop:   ~${slop}/100 — ${slopPass ? "pass" : "FAIL"} (gate ≤ ${cfg.max})`);
  console.log(`Honesty:       ${honesty.length} blocker(s)${honesty.length ? " — blocks certification" : ""}`);
  console.log(`Accessibility: ${a11y.reduce((s, id) => s + findings[id].length, 0)} finding(s)`);
  console.log(`Hygiene:       ${hyg.reduce((s, id) => s + findings[id].length, 0)} warning(s) — advisory`);
  console.log(`Review confidence: ${reviewConf}`);

  const section = (title, ids, showW) => {
    if (!ids.length) return;
    console.log(`\n[${title}]`);
    for (const id of ids.sort((a, b) => (R[b].w - R[a].w))) {
      const r = R[id];
      const tag = r.sev ? r.sev : showW ? `+${contrib(id)}` : "";
      console.log(`  [${id}${tag ? " " + tag : ""} ${r.conf}] ${r.t} — ${findings[id].length}×`);
      for (const ev of findings[id].slice(0, 3)) console.log(`      ${ev}`);
    }
  };
  // group slop by category
  if (bucketIds("slop").length) {
    console.log(`\n[VISUAL SLOP]`);
    for (const cat of [...new Set(bucketIds("slop").map((id) => R[id].cat))]) {
      const ids = bucketIds("slop").filter((id) => R[id].cat === cat).sort((a, b) => R[b].w - R[a].w);
      console.log(`  ${cat}`);
      for (const id of ids) { console.log(`    [${id} +${contrib(id)} ${R[id].conf}] ${R[id].t} — ${findings[id].length}×`); for (const ev of findings[id].slice(0, 2)) console.log(`        ${ev}`); }
    }
  }
  section("HONESTY — certification blockers", honesty, false);
  section("ACCESSIBILITY", a11y, true);
  section("HYGIENE — advisory", hyg, true);
  if (suppressed.length) { console.log(`\n[SUPPRESSED]`); for (const s of suppressed) console.log(`  ${s.id} — ${s.file} (${s.reason || "no reason"})`); }

  console.log(`\nEvidence only — confirm each in the anti-slop stage. The four results feed`);
  console.log(`different gates: Slop (aesthetic), Honesty (P1), Accessibility, Hygiene.`);
  process.exit(!slopPass || honesty.length ? 1 : 0);
}

main();
