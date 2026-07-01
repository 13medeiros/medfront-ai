// Reflexo — reflex mini-game. Vanilla JS, no dependencies.
// States: idle → waiting → go → result | early. Each state has an explicit
// label (never color alone), an aria-live announcement, and keyboard support
// (the pad is a <button>, so Space/Enter activate it natively).

const pad = document.getElementById("pad");
const label = document.getElementById("padLabel");
const sub = document.getElementById("padSub");
const statusEl = document.getElementById("status");
const bestEl = document.getElementById("best");

let state = "idle";
let timer = null;
let goAt = 0;
let best = loadBest();
renderBest();

// Belt-and-suspenders reduced motion (CSS @media already covers OS setting).
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.body.classList.add("reduce");
}

function loadBest() {
  try {
    const v = Number(localStorage.getItem("reflexo_best"));
    return Number.isFinite(v) && v > 0 ? v : null;
  } catch {
    return null;
  }
}
function saveBest(v) {
  try {
    localStorage.setItem("reflexo_best", String(v));
  } catch {
    /* private mode — keep in memory only */
  }
}
function renderBest() {
  bestEl.textContent = best ? `${best} ms` : "—";
}

function setState(next, text, subtext, announce) {
  state = next;
  pad.dataset.state = next;
  label.textContent = text;
  sub.textContent = subtext || "";
  if (announce) statusEl.textContent = announce;
}

function start() {
  clearTimeout(timer);
  setState("waiting", "Espere o verde…", "não toque ainda", "Espere o verde.");
  const wait = 1200 + Math.random() * 1800; // 1.2–3.0s
  timer = setTimeout(go, wait);
}

function go() {
  goAt = performance.now();
  setState("go", "TOQUE!", "", "Agora! Toque!");
}

function rating(ms) {
  if (ms < 200) return "Relâmpago ⚡";
  if (ms < 300) return "Rápido 🔥";
  if (ms < 400) return "Ok 👍";
  return "Café primeiro? ☕";
}

function tap() {
  switch (state) {
    case "idle":
    case "early":
    case "result":
      start();
      break;
    case "waiting":
      clearTimeout(timer);
      setState(
        "early",
        "Cedo demais! 😅",
        "toque para tentar de novo",
        "Você tocou antes do verde. Tente de novo.",
      );
      break;
    case "go": {
      const ms = Math.round(performance.now() - goAt);
      const r = rating(ms);
      setState("result", `${ms} ms`, `${r} · toque para repetir`, `Reflexo: ${ms} ms — ${r}.`);
      if (!best || ms < best) {
        best = ms;
        saveBest(ms);
        renderBest();
      }
      break;
    }
  }
}

pad.addEventListener("click", tap);
