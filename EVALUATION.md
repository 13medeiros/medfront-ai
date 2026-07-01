# MedFront AI — Evaluation from hands-on use

> Written by the *consumer* of the skill (an AI coding agent) after applying it
> end-to-end twice: (1) building a two-sided service-booking app
> ("Combinado" — customer experience + professional dashboard) through
> `foundation → certify`, and (2) running a retroactive audit with the newer
> `chroma`, `benchmark`, `anti-slop` and `compare` modules, then applying an
> approved visual direction and re-auditing.

## Verdict

- **As a methodology / philosophy: strong (≈8.5/10).** It measurably changed
  agent behavior in the right direction: product before components, identity
  before effects, honest data, real states. The output was more distinctive and
  more honest than a naive "build me a booking app" prompt would produce.
- **As a *real, shippable skill* (installable, invokable, with reproducible
  quality): early (≈3/10).** The thinking is ready; the engineering that makes
  quality trustworthy and the packaging that makes it a skill are missing.

**The core tension in one line: the gates are stronger than the instruments.**
The skill mandates reproducible measurement (Color Score ≥75, Slop ≤30,
Lighthouse ≥ target, 6-viewport validation, "never fabricate") but ships **no
deterministic tools** to produce those measurements. So it depends on the agent
to either improvise tooling (which I did) or estimate/fabricate (which it
forbids but cannot detect). This makes the certification numbers vary run to run.

## What genuinely helped (strengths)

| Strength | Why it works, especially for an AI agent |
|---|---|
| Concept-before-components | Corrects the LLM's worst habit — generating UI too early. |
| Named anti-slop signals | Lists the exact defaults a model reaches for (purple-blue gradient, identical card grids, glassmorphism). Adversarial to the model's priors → actionable, not vague. |
| Enforced honesty | "Never fabricate", label demo data, no fake logos/metrics/testimonials. Ethical and quality-raising; it stopped me from claiming "validated across 6 viewports" without doing it. |
| Experience modes | A cheap up-front switch that coherently changes density, motion and hierarchy. |
| File-based project memory | Decisions became explicit and re-auditable — the retroactive audit was trivial because everything was written down. |
| States as first-class | `reinforce` drove ~25 real states (empty/error/conflict/vacation/…). |
| Numeric scores + gates (chroma, anti-slop) | Give a binary certification target, even if the measurement still needs work. |
| Benchmark's "never fabricate" + fallback plan | Correct stance on evidence. |

## Defects / weaknesses (prioritized)

1. **[Critical] It is not actually an Agent Skill.** `SKILL.md` has no YAML
   frontmatter (`name`, `description`), so a runtime cannot discover or invoke
   it — it is a document, not a skill. No install path, no binding of the
   "commands" to anything invokable.
2. **[Critical] Gates without instruments.** Contrast, Lighthouse, screenshots
   and 6-viewport checks are required but not provided. Quality therefore varies
   wildly by agent, and the certification numbers are not reproducible.
3. **[High] Unanchored rubrics.** Color/Slop/Quality scores have weights but no
   per-band descriptors (what is 16/20 harmony vs 12/20?). I scored the same UI
   75 then 84 — my own judgment. Another agent could differ by ±10, which
   undermines gates like "Color Score ≥ 75".
4. **[High] No worked example in the repo.** Templates are empty skeletons; the
   agent must guess the target depth. One complete example in-repo would fix it.
5. **[Medium] Duplication.** chroma/benchmark/anti-slop rules appear both in
   `SKILL.md` and in `commands/*` — they will drift. No single source of truth.
6. **[Medium] No versioning / license / changelog.** History was force-pushed
   during this evaluation ("refusing to merge unrelated histories"); an agent
   cannot know which version's rules apply.
7. **[Medium] Linear workflow, iterative reality.** 18 steps as a sequence, with
   no guidance on loops (inspect→fix→re-inspect) or what to do when a gate fails.
8. **[Low] Ambiguous artifact mapping.** Where does `sequence` get documented?
   `signature` — MOTION.md or PRODUCT.md? I had to decide by inference.
9. **[Low] No output-language / i18n policy** for the artifacts.
10. **[Low] No stance on involving the human** (naming, direction approval) and
    no validator that the memory files are actually filled before `build`.

## What's missing to become a real skill

**Packaging (makes it invokable):**
- `SKILL.md` frontmatter: `name`, a `description` with a concrete *when-to-use*
  trigger, `license`.
- A lean `SKILL.md` using progressive disclosure — say *when* to load
  `commands/*`, `references/*`, `templates/*` instead of restating them.
- An install / usage path (Claude Code plugin or `.claude/skills/`).
- License + semver tags + CHANGELOG.

**Instrumentation (makes it trustworthy) — the biggest win:**
- `scripts/contrast.mjs` — WCAG contrast from tokens (provided in this contrib).
- `scripts/shots.mjs` — 6-viewport screenshot harness (provided).
- `scripts/benchmark.mjs` — Lighthouse wrapper in the module's report format
  (provided).
- `scripts/slop-lint.mjs` — heuristic detector (identical card grids, uniform
  radius/border, purple-blue gradient, repeated reveal) — proposed.
- Anchored rubrics, or split each score into a **computable** part (contrast,
  distribution, JS size — measurable) and a **judgment** part (evidence
  required); gate only on the computable part plus evidence.
- Graceful fallbacks for chroma/anti-slop when tooling is unavailable (benchmark
  already does this — replicate).
- One complete worked example in-repo.

## Suggested roadmap

- **P0 (becomes a skill):** SKILL.md frontmatter · license · one in-repo
  example · `contrast.mjs` + `shots.mjs`.
- **P1 (becomes trustworthy):** anchored/computable scores · `benchmark.mjs` ·
  de-duplicate SKILL vs commands · semver + changelog.
- **P2 (becomes robust):** `slop-lint.mjs` · memory-file validator ·
  iteration/gate-failure guidance · language & human-in-the-loop policy.

## Scorecard

| Dimension | Score | Note |
|---|---|---|
| Method & philosophy | 9/10 | Strong sequence and principles; product-first |
| Stage coverage | 8/10 | Comprehensive; artifact↔stage mapping ambiguous |
| Actionable for an agent | 7/10 | Anti-slop and modes excellent; missing loop/scoping |
| **Metric reproducibility** | **3/10** | Subjective scores; gates not reliable across runs |
| **Tooling / scripts** | **1/10** | Prescribes validation, ships none |
| **Skill packaging** | **2/10** | No frontmatter / discovery / install |
| Examples & onboarding | 3/10 | Empty templates; no in-repo example |
| Versioning / license | 2/10 | No semver/license; history rewritten |
| Ethics / honesty | 10/10 | Best trait; it worked in practice |

**Bottom line:** a high-quality methodology trapped inside a repository that is
not yet a skill. The shortest path to "a real skill" is to **stop requiring
measurements it does not provide** — either ship the scripts (started here) or
convert the subjective gates into computable checklists — then add frontmatter
and one worked example. That moves it from "inspiring document" to "skill whose
output you can trust."
