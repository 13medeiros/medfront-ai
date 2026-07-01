# Changelog

All notable changes to MedFront AI are documented here.
This project aims to follow [Semantic Versioning](https://semver.org/).

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
