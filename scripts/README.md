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

## Platform note

On **Git Bash (Windows)** prefix commands with `MSYS_NO_PATHCONV=1` so route
args like `/` are not rewritten into Windows paths. Not needed in PowerShell,
cmd, Linux or macOS.
