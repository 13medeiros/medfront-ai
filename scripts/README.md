# MedFront AI — scripts

Deterministic validation tools so the certification gates have instruments.
Each script exits non-zero on failure (use them in CI). None of them fabricate:
if a tool can't run, they say so and print a reproducible command.

## Setup

```bash
npm install        # installs puppeteer-core (only shots.mjs needs it)
```

`contrast.mjs` needs no dependencies. `benchmark.mjs` uses `npx lighthouse`.

## `contrast.mjs` — WCAG contrast (chroma / inspect)

```bash
node contrast.mjs "#232019 on #f3efe7" "#f3efe7 on #a8451e"
node contrast.mjs --json pairs.json          # [{ "name", "fg", "bg" }]
node contrast.mjs "#111 on #fff" --level AAA-normal
```

Prints ratio and pass/fail for AA/large/graphical; exits 1 if any pair is below
the requested level (default `AA-normal`, 4.5:1).

## `shots.mjs` — 6-viewport screenshots (visual validation)

```bash
node shots.mjs --base http://localhost:3000 --out ./screenshots \
  --routes / /search /profile /dashboard
node shots.mjs --config shots.config.json
node shots.mjs --base http://localhost:3000 --viewport-only
```

Captures the mandatory viewports (360×800, 390×844, 768×1024, 1280×800,
1440×900, 1920×1080) for each route. Auto-detects Chrome/Edge, or set
`CHROME_PATH`.

## `benchmark.mjs` — Lighthouse (benchmark)

```bash
node benchmark.mjs --url http://localhost:3000
node benchmark.mjs --url http://localhost:3000 --mobile
```

Runs Lighthouse, records environment/command/date, prints
metric/result/target/status and the largest opportunities. Exits 1 if a gated
metric is below target.

## `slop-lint.mjs` — deterministic frontend auditor (anti-slop)

37 rules, no LLM. No dependencies.

```bash
node slop-lint.mjs src                 # four-result report
node slop-lint.mjs src --max 30        # exit 1 if Slop > 30 or a honesty blocker
node slop-lint.mjs src --json          # machine-readable for PR checks
node slop-lint.mjs . --ext .tsx,.css   # custom extensions
```

**Four separate results** — because not everything is slop:

- **Visual Slop** (Color, Geometry, Components, Motion, Copy, Structure) — the
  aesthetic gate (≤ 30). E.g. purple-blue gradient, glassmorphism, glow orbs,
  copy-pasted cards, repeated section grammar, generic hero, badge overuse,
  motion without `prefers-reduced-motion`, clichés, generic CTAs.
- **Honesty** (unmarked metrics/testimonials) — a **P1 certification blocker**.
- **Accessibility** (img without alt, aria-hidden on focusable, icon-only
  control without a name, positive tabindex, `<html>` without lang, iframe
  without title…) — feeds the a11y gate.
- **Hygiene** (console.log, TODO, `href="#"`) — advisory.

Each finding has a rule id, weight, **confidence** and `file:line`; contributions
**saturate** by count. Suppress a false positive (reported, never silent):
`// medfront-ignore GRAD-02 -- brand gradient`. **Evidence, not a verdict.**

## `identity-fingerprint.mjs` — cross-project convergence (compare)

```bash
node identity-fingerprint.mjs src                    # print one fingerprint
node identity-fingerprint.mjs src --vs ../other/src   # convergence report
node identity-fingerprint.mjs a/src --vs b/src --max 60
```

Extracts typography, palette, geometry, borders, shadow, motion and layout, and
(with `--vs`) reports per-dimension convergence plus the question: *did this
identity come from the product, or was it reused by habit?* No dependencies.

## `smoke.mjs` — did it actually run? (inspect / certify)

The non-skippable runtime gate. Opens the built page and fails on console errors
/ uncaught exceptions, or if the primary interaction does not change state.

```bash
node smoke.mjs src                       # serve a static dir and smoke it
node smoke.mjs --url http://localhost:3000
node smoke.mjs src --click "Start"       # name the primary control
```

Exit: `0` pass · `1` fail (errors / stuck) · `2` BLOCKED (could not run —
treat as *not certified*, not "certified with a note"). Needs `puppeteer-core`
+ a local Chrome/Edge. A green Color/Slop score means nothing if this fails.

## Platform note

On **Git Bash (Windows)** prefix commands with `MSYS_NO_PATHCONV=1` so route
args like `/` are not rewritten into Windows paths. Not needed in PowerShell,
cmd, Linux or macOS.
