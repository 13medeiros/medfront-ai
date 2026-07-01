#!/usr/bin/env node
// MedFront AI — shots.mjs
// Multi-viewport screenshot harness for the mandatory visual validation.
// Captures the 6 required viewport sizes for each route.
//
// Requires: puppeteer-core + a local Chrome or Edge (auto-detected).
//   npm i -D puppeteer-core
//
// Usage:
//   node shots.mjs --base http://localhost:3000 --out ./screenshots --routes / /search /dashboard
//   node shots.mjs --config shots.config.json
//   node shots.mjs --base http://localhost:3000 --viewport-only   # above-the-fold only
//
// Env overrides for the browser binary:
//   PUPPETEER_EXECUTABLE_PATH  or  CHROME_PATH

import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const REQUIRED_VIEWPORTS = [
  { w: 360, h: 800 },
  { w: 390, h: 844 },
  { w: 768, h: 1024 },
  { w: 1280, h: 800 },
  { w: 1440, h: 900 },
  { w: 1920, h: 1080 },
];

function findBrowser() {
  const envs = [process.env.PUPPETEER_EXECUTABLE_PATH, process.env.CHROME_PATH];
  for (const e of envs) if (e && fs.existsSync(e)) return e;
  const p = process.platform;
  const candidates =
    p === "win32"
      ? [
          "C:/Program Files/Google/Chrome/Application/chrome.exe",
          "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
          "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
          "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
        ]
      : p === "darwin"
        ? [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
            "/Applications/Chromium.app/Contents/MacOS/Chromium",
          ]
        : [
            "/usr/bin/google-chrome",
            "/usr/bin/chromium",
            "/usr/bin/chromium-browser",
            "/usr/bin/microsoft-edge",
          ];
  return candidates.find((c) => fs.existsSync(c)) ?? null;
}

function parseArgs(argv) {
  const cfg = { base: "http://localhost:3000", out: "./screenshots", routes: [], full: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--base") cfg.base = argv[++i];
    else if (a === "--out") cfg.out = argv[++i];
    else if (a === "--viewport-only") cfg.full = false;
    else if (a === "--config") {
      Object.assign(cfg, JSON.parse(fs.readFileSync(argv[++i], "utf8")));
    } else if (a === "--routes") {
      while (i + 1 < argv.length && !argv[i + 1].startsWith("--")) cfg.routes.push(argv[++i]);
    }
  }
  if (cfg.routes.length === 0) cfg.routes = ["/"];
  return cfg;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const slug = (r) => (r === "/" ? "home" : r.replace(/^\//, "").replace(/[^\w-]+/g, "-").replace(/-+$/g, "") || "home");

async function main() {
  const cfg = parseArgs(process.argv.slice(2));
  const viewports = cfg.viewports ?? REQUIRED_VIEWPORTS;

  const exe = findBrowser();
  if (!exe) {
    console.error(
      "No Chrome/Edge found. Set CHROME_PATH or install one, then re-run.\n" +
        "Reproducible: CHROME_PATH=/path/to/chrome node shots.mjs --base " + cfg.base,
    );
    process.exit(2);
  }

  let puppeteer;
  try {
    puppeteer = (await import("puppeteer-core")).default;
  } catch {
    console.error("puppeteer-core is not installed. Run: npm i -D puppeteer-core");
    process.exit(2);
  }

  fs.mkdirSync(cfg.out, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: exe,
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  console.log(`Browser: ${exe}`);
  console.log(`Base: ${cfg.base} → ${path.resolve(cfg.out)}\n`);

  let ok = 0, fail = 0;
  for (const route of cfg.routes) {
    for (const { w, h } of viewports) {
      const page = await browser.newPage();
      try {
        await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
        await page.goto(cfg.base + route, { waitUntil: "networkidle0", timeout: 30000 });
        await sleep(700); // let client-rendered content / fonts settle
        const file = path.join(cfg.out, `${slug(route)}-${w}x${h}.png`);
        await page.screenshot({ path: file, fullPage: cfg.full });
        console.log(`  ✓ ${slug(route)}-${w}x${h}.png`);
        ok++;
      } catch (e) {
        console.log(`  ✗ ${route} @ ${w}x${h} — ${e.message}`);
        fail++;
      } finally {
        await page.close();
      }
    }
  }
  await browser.close();
  console.log(`\n${ok} captured, ${fail} failed.`);
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
