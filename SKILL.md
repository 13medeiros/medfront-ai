---
name: medfront-ai
description: >-
  Direct distinctive frontends and prove they work. Use when building, reviewing
  or auditing any UI — a landing page, dashboard, web app, component or design
  system. MedFront gives your agent a product-first design method (concept
  before components; anti-"AI slop"; a real color system; real states;
  accessibility) AND measured gates it cannot fake: contrast, benchmark,
  cross-project convergence, and a runtime smoke check that blocks "certified but
  broken". Pull one discipline as a command (chroma, motion, reflow, anti-slop,
  inspect, smoke, certify) or run a full profile (QUICK / STANDARD / AUDIT / FULL).
license: MIT
metadata:
  version: 0.11.0
---

# MedFront AI

**Direct the design. Then prove it.** The frontend skill that won't hand your
agent generic slop — or certify what it never actually ran.

## The problem it solves

AI ships frontends that all look the same, and that nobody actually opened:
purple-blue gradients, identical card grids, green scores, broken in the
browser. MedFront gives your agent a **product-first method** to make the UI
distinctive — and **measured gates it can't fake**, including a runtime smoke
check that blocks "certified but broken".

## When to use this skill

Use it whenever you design, build, refactor, audit or review a web frontend.
**Pull one command** when you need a single discipline — `chroma`, `motion`,
`reflow`, `anti-slop`, `compare`, `inspect`, `smoke`, `certify` — or **run a
profile** (QUICK / STANDARD / AUDIT / FULL) for the whole arc. Command palette:
[`COMMANDS.md`](./COMMANDS.md).

## Core principle

Do not begin by generating components. First establish product truth, audience,
context, desired emotion, interaction model and constraints. A strong frontend
is a coherent system, not a collection of effects.

## Experience modes

Classify the project before deciding anything visual — the mode changes
hierarchy, density, motion, interaction and media:

`UTILITY` · `BRAND` · `CINEMATIC` · `PLAYFUL` · `COMMERCE`

## Project memory (create/read before substantial work)

`PRODUCT.md` · `IDENTITY.md` · `MOTION.md` · `QUALITY.md` — templates in
`templates/`. Never silently overwrite decisions; update them explicitly when
the direction changes.

## Workflow

Each step is a *type of work*, defined in `commands/`. Run them in order, but
loop back when a gate fails (e.g. inspect → fix → re-inspect).

1. `foundation` · 2. `reference` · 3. `direction` · 4. `identity` ·
5. `chroma` · 6. `signature` · 7. `sequence` · 8. `build` · 9. `reflow` ·
10. `motion` · 11. `benchmark` · 12. `anti-slop` · 13. `compare` ·
14. `inspect` · 15. `reinforce` · 16. `simplify`/`amplify`/`calm` ·
17. `tune` · 18. `certify`.

## Usage profiles

Right-size the method to the task — do not always run all 18 steps. Announce
which profile you are using.

| Profile | Use for | Steps |
|---|---|---|
| **QUICK** | Review a screen, fix responsiveness, audit one component | `inspect` → `tune` |
| **STANDARD** | Build a focused feature or page | `foundation` → `direction` → `identity` → `chroma` → `build` → `reflow` → `motion` → `inspect` → `reinforce` → `certify` |
| **AUDIT** | Evaluate or retrofit an existing UI | `foundation` (reconstruct context) → `chroma` → `benchmark` → `anti-slop` → `inspect` → `certify` |
| **FULL** | A complete, ambitious build from scratch | all 18 steps |

### Gates by profile

Certification *scope* differs — do not fail a local review for skipping
product-wide checks:

- **QUICK** — no full-product certification. Produce "quick review passed" for
  the analyzed scope: fix the P0/P1s found; state what was out of scope.
- **STANDARD** — apply the gates relevant to the feature/page (contrast on the
  touched surfaces, its states and viewports). Do not gate on unrelated pages.
- **AUDIT** and **FULL** — apply all certification gates.

When a project already has `PRODUCT.md` / `IDENTITY.md` / `MOTION.md` and a
color system, treat `foundation`, `identity` and `chroma` as
**read-and-verify**, not recreate — update them only if the direction actually
changes. This keeps STANDARD light on existing products.

## Resources — load on demand (progressive disclosure)

Keep this file small; open the detailed resource only at the relevant step.

| When | Read |
|---|---|
| Any command | `commands/README.md` (the command's own contract) |
| `chroma` | `commands/chroma.md` |
| `benchmark` | `commands/benchmark.md` |
| `anti-slop` | `commands/anti-slop.md` |
| `compare` | `commands/compare.md` |
| `reference` / studying craft | `references/premium-experience-principles.md` |
| Creating memory files | `templates/*.template.md` |
| Starting from a ready prompt | `QUICK_START.md`, `prompts/*.md` |

> Single source of truth: per-command rules live in `commands/`. This file
> orchestrates; it does not restate them.

## Measurement scripts (do not hand-roll validation)

The certification gates require reproducible measurement. Use the bundled
scripts instead of estimating — and never fabricate results.

| Need | Script | Example |
|---|---|---|
| Contrast (chroma / inspect) | `scripts/contrast.mjs` | `node scripts/contrast.mjs "#232019 on #f3efe7"` |
| 6-viewport screenshots | `scripts/shots.mjs` | `node scripts/shots.mjs --base http://localhost:3000 --out ./screenshots` |
| Performance & a11y (benchmark) | `scripts/benchmark.mjs` | `node scripts/benchmark.mjs --url http://localhost:3000` |
| Slop evidence (anti-slop) | `scripts/slop-lint.mjs` | `node scripts/slop-lint.mjs src` |
| Cross-project convergence (compare) | `scripts/identity-fingerprint.mjs` | `node scripts/identity-fingerprint.mjs src --vs ../other` |
| Runtime smoke — did it actually run? (inspect / certify) | `scripts/smoke.mjs` | `node scripts/smoke.mjs src` |
| Motion probe — filmstrip + FPS + reduced-motion (motion) | `scripts/motion.mjs` | `node scripts/motion.mjs --url http://localhost:3000` |

`contrast.mjs`, `slop-lint.mjs` and `identity-fingerprint.mjs` need no dependencies. `shots.mjs`, `smoke.mjs` and `motion.mjs` need `puppeteer-core` and a
local Chrome/Edge (auto-detected). `benchmark.mjs` shells out to
`npx lighthouse`. Each script degrades gracefully and prints a reproducible
command when a tool is unavailable — report the limitation, do not invent
numbers.

## Full-product certification gates

Apply these according to the **profile scope** above: AUDIT and FULL apply them
all; STANDARD applies them to the touched scope; QUICK does not produce
full-product certification. Do not certify when any holds:

- an unresolved `P0` or `P1` finding;
- **the built experience does not actually run** — `scripts/smoke.mjs` fails or
  was not run: console errors / uncaught exceptions, or the primary interaction
  does not change state (the experience is stuck);
- Color Score below 75 (see `commands/chroma.md`);
- Slop Score above 30 (see `commands/anti-slop.md`);
- Performance or Accessibility below the project minimum (`commands/benchmark.md`);
- mobile / multi-viewport validation missing;
- essential loading, empty, error or extreme-content states missing;
- any benchmark value fabricated or not reproducible.

**Verification incomplete is not certification.** If the runtime smoke, viewport
screenshots or the benchmark could not be run, the status is *not certified —
verification incomplete*, never *certified with a note*. A green Color/Slop score
never certifies a page that does not run — open and click the built thing before
certifying, and paste the tool output rather than summarizing it.

## Non-negotiable rules

- Do not copy reference layouts, branding, assets or signature interactions.
- No animation without a communicative or interaction purpose.
- Mobile is a recomposition, not a shrunk desktop.
- Do not hide essential content behind complex interaction.
- Support keyboard navigation and `prefers-reduced-motion`.
- Prefer semantic HTML and platform capabilities before libraries.
- Prefer `transform`/`opacity` for motion.
- Never fabricate metrics, testimonials, logos or benchmark values; label demo
  data as demonstration.

## Scoring must be reproducible

When a score has computable inputs (contrast, JS size, layout shift,
distribution), compute them with the scripts and cite the numbers. For
judgment-based sub-scores, record explicit evidence for each point. Two runs on
the same UI should not disagree by more than a small margin — if they would,
the sub-score needs an anchored rubric, not a guess.
