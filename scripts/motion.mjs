#!/usr/bin/env node
// MedFront AI — motion.mjs
// The motion probe: makes an agent able to SEE and MEASURE animation, not just
// static screenshots. For the `motion` / `inspect` stages on a live URL.
//   • Scroll FILMSTRIP — frames sampled while scrolling, read as a sequence.
//   • FPS / jank during a scripted scroll (does the motion hold up?).
//   • reduced-motion — emulated; captures a with/without pair to compare.
//   • Scroll-jack detection + animation-library detection (GSAP, Lenis, Lottie,
//     WebGL/three, AOS, Swiper…).
//
// Requires: puppeteer-core + a local Chrome/Edge (auto-detected, or CHROME_PATH).
// Usage: node motion.mjs --url https://site.com [--out ./motion-report] [--json]
// Exit: 0 ok · 2 could not run.

import fs from "node:fs";
import path from "node:path";

function findBrowser() {
  for (const e of [process.env.PUPPETEER_EXECUTABLE_PATH, process.env.CHROME_PATH]) if (e && fs.existsSync(e)) return e;
  const p = process.platform;
  const list = p === "win32"
    ? ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Microsoft/Edge/Application/msedge.exe"]
    : p === "darwin"
      ? ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"]
      : ["/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"];
  return list.find((c) => fs.existsSync(c)) ?? null;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const argv = process.argv.slice(2);
  const cfg = { url: null, out: "./motion-report", json: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--url") cfg.url = argv[++i];
    else if (argv[i] === "--out") cfg.out = argv[++i];
    else if (argv[i] === "--json") cfg.json = true;
  }
  if (!cfg.url) { console.error("Usage: node motion.mjs --url <url> [--out dir] [--json]"); process.exit(2); }
  const exe = findBrowser();
  if (!exe) { console.error("BLOCKED: no Chrome/Edge (set CHROME_PATH)."); process.exit(2); }
  let puppeteer;
  try { puppeteer = (await import("puppeteer-core")).default; }
  catch { console.error("BLOCKED: puppeteer-core not installed (npm i -D puppeteer-core)."); process.exit(2); }

  fs.mkdirSync(cfg.out, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: exe, headless: "new", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  try { await page.goto(cfg.url, { waitUntil: "networkidle2", timeout: 45000 }); } catch { /* proceed with what loaded */ }
  await sleep(2500);

  // 1) libraries + CSS animation surface + reduced-motion CSS
  const libs = await page.evaluate(() => {
    const w = window, q = (s) => document.querySelector(s);
    const canvas = q("canvas"); let webgl = false;
    if (canvas) { try { webgl = !!(canvas.getContext("webgl") || canvas.getContext("webgl2") || canvas.getContext("experimental-webgl")); } catch {} }
    let keyframes = 0, animated = 0, reducedMotionCSS = false;
    for (const ss of document.styleSheets) {
      try {
        for (const r of ss.cssRules) {
          if (r.type === CSSRule.KEYFRAMES_RULE) keyframes++;
          else if (r.type === CSSRule.MEDIA_RULE && /prefers-reduced-motion/i.test(r.conditionText || r.media.mediaText)) reducedMotionCSS = true;
          else if (r.style && (r.style.transition || r.style.animationName)) animated++;
        }
      } catch { /* cross-origin stylesheet */ }
    }
    return {
      gsap: !!(w.gsap || w.TweenMax || w.TweenLite),
      scrollTrigger: !!(w.ScrollTrigger || (w.gsap && w.gsap.core && w.gsap.core.globals && w.gsap.core.globals().ScrollTrigger)),
      lenis: !!(w.Lenis || w.lenis) || !!q("[data-lenis],.lenis,html.lenis"),
      lottie: !!w.lottie || !!q("lottie-player,[data-animation-path],.lottie"),
      three: !!w.THREE || webgl,
      aos: !!w.AOS || !!q("[data-aos]"),
      swiper: !!w.Swiper || !!q(".swiper"),
      motionOne: !!w.Motion || !!q("[data-motion]"),
      webgl, canvas: !!canvas, keyframes, animated, reducedMotionCSS,
    };
  });

  // 2) scroll-jack: scroll 1200px, see how far the document actually moved
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(200);
  const tall = await page.evaluate(() => document.body.scrollHeight > window.innerHeight * 2);
  const t0 = await page.evaluate(() => document.scrollingElement.scrollTop);
  await page.evaluate(() => window.scrollBy(0, 1200));
  await sleep(500);
  const t1 = await page.evaluate(() => document.scrollingElement.scrollTop);
  const nativeDelta = Math.round(t1 - t0);
  const scrollJack = tall && nativeDelta < 300;

  // 3) FPS / jank during a scripted full-page scroll
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(200);
  await page.evaluate(() => { window.__f = []; const loop = (t) => { window.__f.push(t); window.__raf = requestAnimationFrame(loop); }; window.__raf = requestAnimationFrame(loop); });
  await page.evaluate(async () => {
    const h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    for (let i = 0; i <= 50; i++) { window.scrollTo(0, (h * i) / 50); await new Promise((r) => setTimeout(r, 40)); }
  });
  const frames = await page.evaluate(() => { cancelAnimationFrame(window.__raf); return window.__f; });
  const iv = []; for (let i = 1; i < frames.length; i++) iv.push(frames[i] - frames[i - 1]);
  const avg = iv.length ? iv.reduce((a, b) => a + b, 0) / iv.length : 0;
  const fps = avg ? Math.round(1000 / avg) : 0;
  const janky = iv.filter((x) => x > 24).length; // below ~42fps
  const jankPct = iv.length ? Math.round((100 * janky) / iv.length) : 0;
  const worst = iv.length ? Math.round(Math.max(...iv)) : 0;

  // 4) scroll filmstrip — frames read as a sequence
  const strip = [];
  for (const pct of [0, 25, 50, 75, 100]) {
    await page.evaluate((p) => { const h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight; window.scrollTo(0, (h * p) / 100); }, pct);
    await sleep(650);
    const f = path.join(cfg.out, `scroll-${String(pct).padStart(3, "0")}.png`);
    await page.screenshot({ path: f });
    strip.push(f);
  }

  // 5) reduced-motion pair (top of page): full vs reduced
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(300);
  await page.screenshot({ path: path.join(cfg.out, "reduced-off.png") });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  try { await page.reload({ waitUntil: "networkidle2", timeout: 45000 }); } catch {}
  await sleep(2000);
  await page.screenshot({ path: path.join(cfg.out, "reduced-on.png") });
  const reducedTextLen = await page.evaluate(() => (document.body.innerText || "").trim().length);

  await browser.close();

  const detected = Object.entries({ GSAP: libs.gsap, ScrollTrigger: libs.scrollTrigger, Lenis: libs.lenis, Lottie: libs.lottie, "WebGL/three": libs.three, AOS: libs.aos, Swiper: libs.swiper, "Motion One": libs.motionOne }).filter(([, v]) => v).map(([k]) => k);

  if (cfg.json) {
    console.log(JSON.stringify({ url: cfg.url, libraries: detected, css: { keyframes: libs.keyframes, animated: libs.animated }, reducedMotionCSS: libs.reducedMotionCSS, reducedStillRenders: reducedTextLen > 30, fps, jankPct, worstFrameMs: worst, scrollJack, nativeScrollDelta: nativeDelta, filmstrip: strip, out: cfg.out }, null, 2));
    return;
  }
  console.log(`motion · ${cfg.url}\n`);
  console.log(`Libraries:      ${detected.length ? detected.join(", ") : "none detected"}`);
  console.log(`CSS motion:     ${libs.keyframes} @keyframes · ${libs.animated} transition/animation rules (accessible sheets)`);
  console.log(`Reduced-motion: CSS handles it: ${libs.reducedMotionCSS ? "YES" : "NO"} · under reduce it still renders: ${reducedTextLen > 30 ? "yes" : "NO — check reduced-on.png"}`);
  console.log(`Scroll FPS:     ~${fps} fps · ${jankPct}% janky frames (>24ms) · worst frame ${worst}ms`);
  console.log(`Scroll-jack:    ${scrollJack ? "POSSIBLE — virtualized/eased scroll (delta " + nativeDelta + "/1200)" : "native (delta " + nativeDelta + "/1200)"}`);
  console.log(`\nFilmstrip (read as a scroll sequence):`);
  for (const f of strip) console.log(`  ${f}`);
  console.log(`Reduced-motion pair: ${path.join(cfg.out, "reduced-off.png")} vs reduced-on.png`);
  console.log(`\nEvidence for the motion stage — read the filmstrip: does movement reveal`);
  console.log(`information, hold framerate, and degrade gracefully? A smooth ${fps}fps with`);
  console.log(`${jankPct}% jank is the number; taste is still yours.`);
}

main().catch((e) => { console.error("BLOCKED:", e.message); process.exit(2); });
