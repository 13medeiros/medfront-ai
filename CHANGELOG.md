# Changelog

All notable changes to MedFront AI are documented here.
This project aims to follow [Semantic Versioning](https://semver.org/).

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
