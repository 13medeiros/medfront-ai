#!/usr/bin/env node
// MedFront AI — motion.mjs
// The motion probe: makes an agent able to SEE and MEASURE animation, not just
// static screenshots. For the `motion` / `inspect` stages on a live URL.
//   • TIME filmstrip  — frames sampled over time right after load: catches the
//     intro/loader, idle loops and WebGL/shader motion a scroll-only probe misses.
//   • SCROLL filmstrip — frames sampled down the page, read as a sequence.
//   • FPS / jank during a NATURAL wheel scroll (real wheel events, so a
//     smooth-scroll library like Lenis is measured, not fought).
//   • reduced-motion — emulated; captures a with/without pair to compare.
//   • Scroll-jack + animation-library detection (GSAP, Lenis, Lottie, WebGL, …).
//   • GPU honesty — reads the WebGL renderer. If the page draws WebGL but the
//     backend is SOFTWARE (SwiftShader/llvmpipe), motion is DECLARED unmeasurable
//     at intended fidelity instead of reporting a bogus software frame rate.
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
const isSoftwareGL = (s) => /swiftshader|llvmpipe|software|angle \(software/i.test(s || "");

async function main() {
  const argv = process.argv.slice(2);
  const cfg = { url: null, out: "./motion-report", json: false, introSecs: 5 };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--url") cfg.url = argv[++i];
    else if (argv[i] === "--out") cfg.out = argv[++i];
    else if (argv[i] === "--json") cfg.json = true;
    else if (argv[i] === "--intro-secs") cfg.introSecs = Math.max(1, Number(argv[++i]) || 5);
  }
  if (!cfg.url) { console.error("Usage: node motion.mjs --url <url> [--out dir] [--json] [--intro-secs 5]"); process.exit(2); }
  const exe = findBrowser();
  if (!exe) { console.error("BLOCKED: no Chrome/Edge (set CHROME_PATH)."); process.exit(2); }
  let puppeteer;
  try { puppeteer = (await import("puppeteer-core")).default; }
  catch { console.error("BLOCKED: puppeteer-core not installed (npm i -D puppeteer-core)."); process.exit(2); }

  fs.mkdirSync(cfg.out, { recursive: true });
  // Enable the real GPU where one exists (ANGLE→D3D11 on Windows). On a GPU-less
  // host Chrome still falls back to SwiftShader — which we DETECT below, never force.
  const gpuArgs = ["--enable-gpu", "--ignore-gpu-blocklist"];
  if (process.platform === "win32") gpuArgs.push("--use-angle=d3d11");
  const browser = await puppeteer.launch({ executablePath: exe, headless: "new", args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars", ...gpuArgs] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  // Load. domcontentloaded (not networkidle2) so we start filming the intro before
  // heavy assets settle — the intro/loader is exactly the motion we were missing.
  const t0 = Date.now();
  try { await page.goto(cfg.url, { waitUntil: "domcontentloaded", timeout: 45000 }); } catch { /* proceed with what loaded */ }

  // 0) TIME filmstrip — frames over time, page held still: intro / loader / idle / WebGL.
  const introStrip = [];
  const introN = Math.max(6, Math.round((cfg.introSecs * 1000) / 500));
  for (let i = 0; i < introN; i++) {
    await sleep(500);
    const f = path.join(cfg.out, `intro-${String(i).padStart(2, "0")}.png`);
    try { await page.screenshot({ path: f }); introStrip.push(f); } catch {}
  }
  const domReadyMs = Date.now() - t0;

  // 1) libraries + CSS animation surface + reduced-motion CSS + GPU backend
  const libs = await page.evaluate(() => {
    const w = window, q = (s) => document.querySelector(s);
    // does the SITE draw WebGL? scan every canvas — the first one is often 2D
    let webgl = false;
    for (const c of document.querySelectorAll("canvas")) {
      try { if (c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl")) { webgl = true; break; } } catch {}
    }
    // GPU backend from a throwaway context (independent of the site's canvas state)
    let glRenderer = "";
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl");
      if (gl) { const d = gl.getExtension("WEBGL_debug_renderer_info"); glRenderer = d ? gl.getParameter(d.UNMASKED_RENDERER_WEBGL) : "(no debug ext)"; }
    } catch {}
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
      three: !!w.THREE,
      aos: !!w.AOS || !!q("[data-aos]"),
      swiper: !!w.Swiper || !!q(".swiper"),
      motionOne: !!w.Motion || !!q("[data-motion]"),
      webgl, canvasCount: document.querySelectorAll("canvas").length, glRenderer, keyframes, animated, reducedMotionCSS,
    };
  });
  const softwareGL = isSoftwareGL(libs.glRenderer);
  // FPS is only trustworthy when the page's own motion isn't bottlenecked by a
  // software rasterizer. Pure-CSS/DOM motion is fine in software; WebGL is not.
  const fpsMeaningful = !(libs.webgl && softwareGL);

  // 2) scroll-jack: scroll 1200px, see how far the document actually moved
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(200);
  const tall = await page.evaluate(() => document.body.scrollHeight > window.innerHeight * 2);
  const jt0 = await page.evaluate(() => document.scrollingElement.scrollTop);
  await page.evaluate(() => window.scrollBy(0, 1200));
  await sleep(500);
  const jt1 = await page.evaluate(() => document.scrollingElement.scrollTop);
  const nativeDelta = Math.round(jt1 - jt0);
  const scrollJack = tall && nativeDelta < 300;

  // 3) FPS / jank during a NATURAL wheel scroll (real wheel events → a smooth-scroll
  //    library eases them itself; we measure it instead of fighting it with scrollTo)
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(200);
  await page.mouse.move(720, 450);
  await page.evaluate(() => { window.__f = []; const loop = (t) => { window.__f.push(t); window.__raf = requestAnimationFrame(loop); }; window.__raf = requestAnimationFrame(loop); });
  for (let i = 0; i < 45; i++) { await page.mouse.wheel({ deltaY: 120 }); await sleep(40); }
  await sleep(400); // let the ease-out tail play
  const frames = await page.evaluate(() => { cancelAnimationFrame(window.__raf); return window.__f; });
  const iv = []; for (let i = 1; i < frames.length; i++) iv.push(frames[i] - frames[i - 1]);
  const avg = iv.length ? iv.reduce((a, b) => a + b, 0) / iv.length : 0;
  const fps = avg ? Math.round(1000 / avg) : 0;
  const jankPct = iv.length ? Math.round((100 * iv.filter((x) => x > 24).length) / iv.length) : 0;
  const worst = iv.length ? Math.round(Math.max(...iv)) : 0;

  // 4) SCROLL filmstrip — frames read as a top-to-bottom sequence
  const strip = [];
  for (const pct of [0, 25, 50, 75, 100]) {
    await page.evaluate((p) => { const h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight; window.scrollTo(0, (h * p) / 100); }, pct);
    await sleep(650);
    const f = path.join(cfg.out, `scroll-${String(pct).padStart(3, "0")}.png`);
    try { await page.screenshot({ path: f }); strip.push(f); } catch {}
  }

  // 5) reduced-motion pair (top of page): full vs reduced
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(300);
  await page.screenshot({ path: path.join(cfg.out, "reduced-off.png") });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  try { await page.reload({ waitUntil: "domcontentloaded", timeout: 45000 }); } catch {}
  await sleep(2000);
  await page.screenshot({ path: path.join(cfg.out, "reduced-on.png") });
  const reducedTextLen = await page.evaluate(() => (document.body.innerText || "").trim().length);

  await browser.close();

  const detected = Object.entries({ GSAP: libs.gsap, ScrollTrigger: libs.scrollTrigger, Lenis: libs.lenis, Lottie: libs.lottie, "WebGL/three": libs.three || libs.webgl, AOS: libs.aos, Swiper: libs.swiper, "Motion One": libs.motionOne }).filter(([, v]) => v).map(([k]) => k);
  const gpuLabel = libs.glRenderer ? (softwareGL ? `SOFTWARE — ${libs.glRenderer}` : `hardware — ${libs.glRenderer}`) : "n/a (no WebGL context)";
  const fpsField = fpsMeaningful ? fps : null;

  if (cfg.json) {
    console.log(JSON.stringify({
      url: cfg.url, domReadyMs, libraries: detected,
      css: { keyframes: libs.keyframes, animated: libs.animated }, reducedMotionCSS: libs.reducedMotionCSS, reducedStillRenders: reducedTextLen > 30,
      gpu: { renderer: libs.glRenderer, software: softwareGL }, webgl: libs.webgl, canvasCount: libs.canvasCount,
      fps: fpsField, fpsMeasurable: fpsMeaningful, jankPct: fpsMeaningful ? jankPct : null, worstFrameMs: fpsMeaningful ? worst : null,
      scrollJack, nativeScrollDelta: nativeDelta, introFilmstrip: introStrip, scrollFilmstrip: strip, out: cfg.out,
    }, null, 2));
    return;
  }
  console.log(`motion · ${cfg.url}\n`);
  console.log(`Libraries:      ${detected.length ? detected.join(", ") : "none detected"}`);
  console.log(`CSS motion:     ${libs.keyframes} @keyframes · ${libs.animated} transition/animation rules (accessible sheets)`);
  console.log(`WebGL:          ${libs.webgl ? `yes · ${libs.canvasCount} canvas(es)` : "no"} · GPU backend: ${gpuLabel}`);
  console.log(`Reduced-motion: CSS handles it: ${libs.reducedMotionCSS ? "YES" : "NO"} · under reduce it still renders: ${reducedTextLen > 30 ? "yes" : "NO — check reduced-on.png"}`);
  if (fpsMeaningful) {
    console.log(`Scroll FPS:     ~${fps} fps · ${jankPct}% janky frames (>24ms) · worst frame ${worst}ms (natural wheel scroll)`);
  } else {
    console.log(`Scroll FPS:     UNMEASURABLE — this page draws WebGL but the backend is SOFTWARE`);
    console.log(`                (${libs.glRenderer}). A software frame rate is not the site's real`);
    console.log(`                motion. Re-run headful / on a real GPU for a true reading.`);
  }
  console.log(`Scroll-jack:    ${scrollJack ? "POSSIBLE — virtualized/eased scroll (delta " + nativeDelta + "/1200)" : "native (delta " + nativeDelta + "/1200)"}`);
  console.log(`\nTIME filmstrip (intro / idle / WebGL — read as a sequence over ${cfg.introSecs}s):`);
  for (const f of introStrip) console.log(`  ${f}`);
  console.log(`SCROLL filmstrip (read as a top-to-bottom sequence):`);
  for (const f of strip) console.log(`  ${f}`);
  console.log(`Reduced-motion pair: ${path.join(cfg.out, "reduced-off.png")} vs reduced-on.png`);
  console.log(`\nEvidence for the motion stage — READ the filmstrips: does movement reveal`);
  console.log(`information, hold framerate, and degrade gracefully? The frames and numbers`);
  console.log(`are evidence, not a verdict — weigh them against the experience mode. Taste is yours.`);
}

main().catch((e) => { console.error("BLOCKED:", e.message); process.exit(2); });
