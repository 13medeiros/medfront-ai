---
name: medfront-ai
description: >-
  Product-first methodology for designing, building, auditing and refining
  distinctive, accessible, high-quality web frontends. Use when creating or
  reviewing a UI, landing page, dashboard, web app or design system — to avoid
  generic "AI slop", establish a color system (chroma), validate contrast,
  accessibility and performance (benchmark), test real states, and certify
  quality. Guides work through staged commands
  (foundation → identity → chroma → build → benchmark → anti-slop → inspect →
  certify) with reproducible, evidence-based scoring.
license: MIT
metadata:
  version: 0.7.0
---

# MedFront AI

Frontend direction, creation, inspection and refinement for building
distinctive, high-quality digital experiences.

## When to use this skill

Use it whenever you are about to design, build, refactor, audit or review a web
frontend — a landing page, dashboard, web app, component or design system.
Reach for it especially to escape generic SaaS aesthetics, to make color and
motion decisions defensible, and to certify accessibility, performance and
resilience with evidence rather than claims.

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

`contrast.mjs`, `slop-lint.mjs` and `identity-fingerprint.mjs` need no dependencies. `shots.mjs` and `smoke.mjs` need `puppeteer-core` and a
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
