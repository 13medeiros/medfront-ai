# MedFront AI — Evaluation

This evaluation originally identified critical packaging and instrumentation
gaps in **v0.1.0**. Most of those P0/P1 findings were addressed in **v0.2.0**,
and **v0.3.0** adds usage profiles and an automated slop linter. The assessment
below is kept current: resolved items are marked as such, and the analysis now
focuses on the *remaining* limitations.

It is written from hands-on use — the skill was applied end-to-end to build a
two-sided service-booking app and then to run a retro-audit with the quality
modules (see `examples/service-booking/`).

## Resolved in v0.2.0

| v0.1.0 finding | Status | How |
|---|---|---|
| Not an invokable skill (no frontmatter) | ✅ Resolved | `SKILL.md` YAML frontmatter (`name`, `description`, `license`, `version`) |
| No installation path | ✅ Resolved | Documented Claude Code install (`~/.claude/skills/`) in `README.md` |
| Gates without instruments | ✅ Resolved | `scripts/contrast.mjs`, `shots.mjs`, `benchmark.mjs` — tested, non-zero exit on failure |
| Unanchored, irreproducible scores | ✅ Largely resolved | `references/scoring-rubric.md` — per-band descriptors + computable-vs-judgment split |
| No worked example | ✅ Resolved | `examples/service-booking/` with a modules retro-audit |
| No license | ✅ Resolved | MIT `LICENSE` |
| No versioning / changelog | ✅ Resolved | Semantic Versioning + `CHANGELOG.md` |
| SKILL.md ↔ commands duplication | ✅ Resolved | Single source of truth in `commands/`; `SKILL.md` orchestrates |

## Added in v0.3.0

- **Usage profiles** (`QUICK` / `STANDARD` / `FULL` / `AUDIT`) so the 18-step
  method scales down for reviews, fixes and audits instead of always running in
  full.
- **`scripts/slop-lint.mjs`** — a heuristic slop detector that produces evidence
  (repeated card shells, uniform radius/shadow, gradients, repeated animations,
  clichés, unmarked fake metrics/testimonials). It informs the Slop Score; it
  does not replace visual judgment.

## Added in v0.4.0

- **Usage-profile gates** — QUICK produces a scoped "quick review passed" rather
  than full-product certification; STANDARD gates the touched feature; AUDIT and
  FULL gate everything. On existing projects, `foundation`/`identity`/`chroma`
  are read-and-verified, not recreated.
- **`scripts/identity-fingerprint.mjs`** — cross-project convergence check
  (typography, palette, geometry, borders, shadow, motion). Answers "did this
  identity come from the product, or was it reused by habit?" — automating the
  comparison that previously had to be done by hand.
- Fixed README inconsistencies (slop-lint missing from the tooling list; still
  listed as roadmap although shipped).

## Current limitations (roadmap)

1. **Single-platform packaging.** Installation is documented and guaranteed for
   Claude Code only. Manual use is possible elsewhere, but official adapters for
   Cursor, Codex, OpenCode and Gemini CLI are not yet packaged.
2. **Partial automation of anti-slop.** `slop-lint.mjs` provides evidence, but
   final judgment is still the agent's; false positives/negatives are expected.
3. **Scoring is anchored, not fully computed.** Contrast, distribution, state
   accessibility, performance and viewport checks are measurable; harmony,
   identity coherence and narrative remain judgment calls (with required
   evidence).
4. **One example.** A second, different-mode example (e.g. a CINEMATIC or
   PLAYFUL piece) would broaden calibration.
5. **No CI recipe.** The scripts exit non-zero on failure but there is no
   provided workflow file wiring them into a pipeline yet.

## Strengths (unchanged)

- Concept-before-components corrects the LLM's worst habit.
- Anti-slop is adversarial to the model's defaults — concrete, not vague.
- Enforced honesty (label demo data, never fabricate metrics/benchmarks).
- File-based project memory makes decisions explicit and re-auditable.
- Real states (empty/error/loading/extreme) are first-class.

## Scorecard (v0.3.0)

| Dimension | v0.1.0 | v0.4.0 | Note |
|---|---|---|---|
| Method & philosophy | 9/10 | 9/10 | Unchanged strength |
| Stage coverage | 8/10 | 8/10 | Profiles + gate scope by profile |
| Actionable for an agent | 7/10 | 8/10 | Profiles + wired tooling |
| Metric reproducibility | 3/10 | 7/10 | Rubric + scripts; not 100% computed |
| Tooling / scripts | 1/10 | 9/10 | 5 tested scripts incl. slop-lint + identity-fingerprint |
| Skill packaging | 2/10 | 8/10 | Frontmatter + install (Claude Code only) |
| Examples & onboarding | 3/10 | 7/10 | README, install, example, changelog, eval |
| Versioning / license | 2/10 | 8/10 | MIT + semver + changelog |
| Ethics / honesty | 10/10 | 10/10 | Best trait |

## Verdict

v0.1.0 was **a strong methodology trying to present itself as a skill.**

v0.4.0 is **a functional early-stage skill** — installable on Claude Code, with
its own methodology, project memory, profile-scoped gates, anchored rubrics and
real validation tooling (contrast, viewport, benchmark, slop and cross-project
convergence). It is ready to share as an **experimental / early release**. The
next level is multi-platform packaging, deeper automation of the judgment
scores, and more examples (a second, different-mode piece).
