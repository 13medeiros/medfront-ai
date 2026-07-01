# Changelog

All notable changes to MedFront AI are documented here.
This project aims to follow [Semantic Versioning](https://semver.org/).

## [0.9.0] — 2026-07-01

A real deterministic slop detector.

### Changed
- **`scripts/slop-lint.mjs` rewritten as a ~25-rule engine** (no LLM). Rules
  carry an id, category and weight, with `file:line` evidence, grouped into
  Color, Geometry, Components, Motion, Copy, Honesty and Accessibility. New
  detections include gradient text, glassmorphism, glow orbs, repeated icon
  chips, repeated card grids, generic CTAs, decorative emoji, `<img>` without
  alt, `onClick` on non-interactive elements, positive tabindex and `<html>`
  without lang.
- **`--json` output** for CI / PR checks; the emoji rule no longer flags plain
  UI glyphs like `★`.
- Validated: a real app scores ~12 ("strong identity"), an adversarial fixture
  ~76 ("severe AI slop") firing 15 rules.
- `commands/anti-slop.md` and `scripts/README.md` document the rule set.

## [0.8.0] — 2026-07-01

Positioning: a sharp pitch and a directable command palette.

### Added
- **`COMMANDS.md`** — MedFront as a *palette you pull from*, not only an 18-step
  pipeline. Commands grouped into **Direct / Build / Prove**, each tied to its
  contract and tool; profiles remain the bundles.

### Changed
- **Sharpened the pitch.** `SKILL.md` frontmatter, its hero and the `README.md`
  now lead with one problem + one mechanism: *"direct the design, then prove
  it — no slop, and no certifying what you never ran."* The measured gates
  (especially the runtime smoke check) are framed as the differentiator, and
  the workflow is presented as "pull one command, or run a profile."

### Why
Inspired by feedback comparing MedFront to a sharper, product-shaped skill: the
method was strong but described as a broad process. This reframes it as a
directable toolkit without changing the methodology or the gates.

## [0.7.0] — 2026-07-01

The runtime gate — stop certifying pages that don't run.

### Added
- **`scripts/smoke.mjs`** — a non-skippable runtime check: serves/loads the
  built page, fails on console errors / uncaught exceptions, and asserts the
  primary interaction changes state (catches "stuck on screen one"). Exit `2`
  when it cannot run — treated as *not certified*, never "certified with a note".
  Validated on a real broken build (caught an SVG `className` crash) and a
  working one (pass).

### Changed
- **Certification is now behavioral first.** `SKILL.md` gates and
  `commands/README.md` (`inspect`, `certify`) require `smoke.mjs` to pass before
  any score counts; the agent must **paste** tool outputs, not summarize them.
- **Verification incomplete ≠ certification.** If smoke, screenshots or benchmark
  could not run, the status is *not certified — verification incomplete*.
- `references/scoring-rubric.md`: scores are explicitly *necessary, not
  sufficient* — a green score on a page that doesn't run is worth zero.
- `scripts/package.json`: description and script entries now list all six tools.

### Why
A generated example passed Color 89 / Slop 4 and was written up as "certified",
yet the whole experience was stuck on the first screen due to a runtime crash —
because nobody had actually opened it. This release closes that gap.

## [0.6.0] — 2026-07-01

A second example, in the opposite mode — proving the method produces distinct
identities.

### Added
- **`examples/reflex-game/`** — a PLAYFUL reflex toy (dependency-free
  HTML/CSS/JS in `src/`) with its memory files and case study. Dark, saturated
  and springy — the opposite of the calm editorial booking example.
- The two examples are validated as **distinct** by `identity-fingerprint`
  (~37% — DISTINCT: fonts, radius and shadow diverge; only a near-white text
  token and a transform primitive overlap), demonstrating that the method does
  not recycle one house style.

## [0.5.0] — 2026-07-01

Onboarding: get from installed to producing in a minute.

### Added
- **`QUICK_START.md`** — install → pick a prompt → run, with a task→profile map
  and a pointer to the worked example.
- **`prompts/`** — five ready-to-paste, `<placeholder>`-driven prompts, each
  tied to a profile and the right scripts:
  `build-new-project` (FULL/STANDARD), `audit-existing-project` (AUDIT),
  `review-one-page` (QUICK), `improve-colors` (chroma),
  `compare-projects` (compare).
- README "Quick start" section and a `prompts/*` entry in the SKILL resource map.

## [0.4.1] — 2026-07-01

Documentation and CI-semantics fixes from a v0.4.0 review.

### Fixed
- `EVALUATION.md`: scorecard heading said `(v0.3.0)` while the table already
  scored v0.4.0.
- `SKILL.md`: the global gates section is now "Full-product certification
  gates" and states it applies by profile scope (QUICK does not produce
  full-product certification), removing ambiguity against the profile rules.
- `README.md`: corrected the CI claim — gate-oriented scripts exit non-zero on
  failure, while advisory `slop-lint`/`identity-fingerprint` do so only with
  `--max`; examples now show the threshold.
- `README.md`: the `compare` module row now mentions cross-project identity
  convergence.

## [0.4.0] — 2026-07-01

Profile-scoped gates, cross-project convergence detection, and doc fixes.

### Added
- **`scripts/identity-fingerprint.mjs`** — cross-project convergence check
  across typography, palette, geometry, borders, shadow and motion. Answers
  "did this identity come from the product, or was it reused by habit?" Wired
  into `commands/compare.md`. Validated on two real projects (surfacing shared
  paper palette, thin-border density and motion DNA while fonts/radius diverge).
- **Gates by profile** in `SKILL.md`: QUICK yields a scoped "quick review
  passed" (no full-product certification); STANDARD gates the touched
  feature/page; AUDIT and FULL apply all gates.
- **Read-and-verify** guidance: on existing projects, `foundation`/`identity`/
  `chroma` are read, not recreated — keeping STANDARD light.

### Fixed
- README listed only three scripts in Tooling (slop-lint missing) and still
  cited "a slop linter" as roadmap although it shipped in v0.3.0.

## [0.3.0] — 2026-07-01

Practicality and automated evidence; fixes a documentation contradiction.

### Added
- **Usage profiles** in `SKILL.md` (`QUICK` / `STANDARD` / `FULL` / `AUDIT`) so
  the 18-step method scales down for reviews, fixes and audits.
- **`scripts/slop-lint.mjs`** — heuristic slop detector (repeated shells,
  uniform radius/shadow, gradients incl. purple-blue, repeated animation,
  clichés, unmarked metrics/testimonials). Tuned against real and adversarial
  inputs for low false positives; advisory input to the Slop Score.
- Wired `slop-lint` into `commands/anti-slop.md`, `SKILL.md` and `scripts/README.md`.

### Changed
- **`EVALUATION.md` rewritten** — it previously described v0.1.0 gaps as if
  still open, contradicting the v0.2.0 README. It now marks resolved items and
  focuses on current limitations.
- `README.md` — marked **experimental / early release** and clarified that
  install is guaranteed for Claude Code only; other-platform adapters are in
  development.

## [0.2.0] — 2026-07-01

Turns the framework into an installable, measurable skill.

### Added
- **Skill packaging:** `SKILL.md` now has YAML frontmatter (`name`,
  `description`, `license`, `version`) so it can be discovered and invoked as a
  skill, plus a progressive-disclosure resource map.
- **Measurement scripts** (`scripts/`), each tested end-to-end and exiting
  non-zero on failure so they double as certification gates:
  - `contrast.mjs` — WCAG contrast checker (no dependencies).
  - `shots.mjs` — 6-viewport screenshot harness (auto-detects Chrome/Edge).
  - `benchmark.mjs` — Lighthouse wrapper that records environment/command/date
    and never fabricates results.
- **Anchored scoring rubric** (`references/scoring-rubric.md`) with per-band
  descriptors and a computable-vs-judgment split, making Color Score, Slop
  Score and the quality score reproducible across runs.
- **Worked example** (`examples/service-booking/`) — real memory files, case
  study and a retro-audit that exercises chroma, benchmark, anti-slop and
  compare.
- `LICENSE` (MIT) and this `CHANGELOG.md`.
- `EVALUATION.md` — an honest self-assessment from hands-on use.

### Changed
- De-duplicated `SKILL.md`: per-command rules now live only in `commands/`
  (single source of truth); `SKILL.md` orchestrates and binds the scripts.
- `commands/chroma.md`, `commands/benchmark.md` and `commands/anti-slop.md`
  now point to the scripts and the scoring rubric.

## [0.1.0]

- Initial MedFront AI framework: SKILL, commands, references, templates and the
  first measurable quality modules (chroma, benchmark, anti-slop, compare).
