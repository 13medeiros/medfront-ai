#!/usr/bin/env node
// MedFront AI — smoke.mjs
// The non-skippable runtime gate: actually OPEN the built thing.
// Fails on console errors / uncaught exceptions, and verifies the primary
// interaction changes state (i.e. the experience is not silently stuck).
// A green Color/Slop score means nothing if the page doesn't run — this is the
// check that catches "certified on paper while broken".
//
// Requires: puppeteer-core + a local Chrome/Edge (auto-detected, or CHROME_PATH).
//
// Usage:
//   node smoke.mjs <dir>                 # serve a static dir and smoke it
//   node smoke.mjs --url http://localhost:3000
//   node smoke.mjs <dir> --click "text or css selector"
//   node smoke.mjs <dir> --no-interaction
//
// Exit: 0 pass · 1 fail (errors / stuck) · 2 BLOCKED (could not run —
// treat as NOT certified, never "certified with a note").

import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2" };

function findBrowser() {
  for (const e of [process.env.PUPPETEER_EXECUTABLE_PATH, process.env.CHROME_PATH]) if (e && fs.existsSync(e)) return e;
  const p = process.platform;
  const list = p === "win32"
    ? ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Microsoft/Edge/Application/msedge.exe"]
    : p === "darwin"
      ? ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"]
      : ["/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/microsoft-edge"];
  return list.find((c) => fs.existsSync(c)) ?? null;
}

function parseArgs(argv) {
  const cfg = { dir: null, url: null, click: null, interact: true, port: 4700 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--url") cfg.url = argv[++i];
    else if (a === "--click") cfg.click = argv[++i];
    else if (a === "--no-interaction") cfg.interact = false;
    else if (a === "--port") cfg.port = Number(argv[++i]);
    else if (!a.startsWith("--")) cfg.dir = a;
  }
  return cfg;
}

function serve(dir, port) {
  const server = http.createServer((req, res) => {
    let u = decodeURIComponent(req.url.split("?")[0]);
    if (u === "/") u = "/index.html";
    fs.readFile(path.join(dir, u), (e, d) => {
      if (e) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { "Content-Type": MIME[path.extname(u)] || "application/octet-stream" });
      res.end(d);
    });
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// State signature: strip digits (ignore animating counters), plus active markers + scroll.
async function signature(page) {
  return page.evaluate(() => {
    const txt = (document.body.innerText || "").replace(/\d+/g, "#").replace(/\s+/g, " ").trim();
    const active = [...document.querySelectorAll('[aria-current],[data-scene],[class*="active"],[data-state]')]
      .map((e) => (e.getAttribute("data-state") || e.getAttribute("data-scene") || e.getAttribute("aria-current") || e.className)).join("|");
    return `${txt.length}:${active}:${window.scrollY}:${location.href}`;
  });
}

async function main() {
  const cfg = parseArgs(process.argv.slice(2));
  if (!cfg.dir && !cfg.url) {
    console.error("Usage: node smoke.mjs <dir> | --url <url> [--click <sel/text>] [--no-interaction]");
    process.exit(2);
  }
  const exe = findBrowser();
  if (!exe) { console.error("BLOCKED: no Chrome/Edge found (set CHROME_PATH). NOT certified — verification incomplete."); process.exit(2); }
  let puppeteer;
  try { puppeteer = (await import("puppeteer-core")).default; }
  catch { console.error("BLOCKED: puppeteer-core not installed (npm i -D puppeteer-core). NOT certified — verification incomplete."); process.exit(2); }

  let server = null, url = cfg.url;
  if (!url) { server = await serve(cfg.dir, cfg.port); url = `http://localhost:${cfg.port}/`; }

  const browser = await puppeteer.launch({ executablePath: exe, headless: "new", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const page = await browser.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const u = (m.location && m.location().url) || "";
    if (/favicon\.ico/i.test(u)) return; // browser auto-requests favicon — universal noise
    errors.push(m.text().split("\n")[0]);
  });
  page.on("pageerror", (e) => errors.push(String(e).split("\n")[0]));
  page.on("requestfailed", (r) => { const u = r.url(); if (!/favicon/i.test(u)) errors.push(`request failed: ${u}`); });

  const fails = [];
  await page.setViewport({ width: 1280, height: 800 });
  try {
    await page.goto(url, { waitUntil: "networkidle0", timeout: 25000 });
  } catch (e) {
    console.error(`FAIL: page did not load — ${e.message}`);
    await browser.close(); server?.close();
    process.exit(1);
  }
  await sleep(1200);

  // 1) not hollow / blank
  const textLen = (await page.evaluate(() => (document.body.innerText || "").trim().length));
  if (textLen < 30) fails.push(`page renders almost no text (${textLen} chars) — blank or failed render`);

  // 2) primary interaction changes state
  if (cfg.interact) {
    const before = await signature(page);
    const clicked = await page.evaluate((sel) => {
      let el = null;
      if (sel) { try { el = document.querySelector(sel); } catch { /* not a selector */ } }
      if (!el && sel) el = [...document.querySelectorAll('button,a,[role="button"]')].find((e) => e.textContent.trim().toUpperCase().includes(sel.toUpperCase()));
      if (!el) el = [...document.querySelectorAll('button,a,[role="button"]')].find((e) => e.offsetParent !== null && !e.disabled);
      if (!el) return null;
      el.click();
      return el.textContent.trim().slice(0, 40) || el.tagName;
    }, cfg.click);
    if (!clicked) {
      fails.push("no primary interactive control found (button / link / [role=button])");
    } else {
      await sleep(900);
      const after = await signature(page);
      if (after === before) fails.push(`primary control ("${clicked}") did not change state — the experience appears stuck`);
    }
  }

  // 3) runtime console errors / uncaught exceptions
  const uniqErr = [...new Set(errors)];
  if (uniqErr.length) fails.push(`runtime error(s): ${uniqErr.slice(0, 4).join(" · ")}`);

  await browser.close();
  server?.close();

  console.log(`smoke · ${url}`);
  if (fails.length === 0) {
    console.log("PASS — page loads, primary interaction changes state, no runtime errors.");
    process.exit(0);
  }
  for (const f of fails) console.log(`  ✗ ${f}`);
  console.log(`FAIL — ${fails.length} issue(s). Not certifiable until the experience runs.`);
  process.exit(1);
}

main().catch((e) => { console.error("BLOCKED:", e.message); process.exit(2); });
