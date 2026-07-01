# MedFront AI — direct the design, then prove it

**The frontend skill for AI coding agents that won't hand you generic slop — or
certify what it never actually ran.**

AI ships frontends that all look the same, and that nobody opened: purple-blue
gradients, identical card grids, green scores, broken in the browser. MedFront
gives your agent a **product-first method** to make the UI distinctive (concept
before components, a real color system, real states, accessibility) and
**measured gates it can't fake** — contrast, benchmark, cross-project
convergence, and a **runtime smoke check** that blocks *certified-but-broken*.

**Pull one command** when you need a discipline (`chroma`, `motion`, `anti-slop`,
`inspect`, `smoke`, `certify`) or **run a profile** for the whole arc — see the
command palette in [`COMMANDS.md`](./COMMANDS.md).

> Status: `v0.12.0` — **experimental / early release.** Installable Claude Code
> skill: a directable command palette, measured quality modules, seven tested
> tools (contrast, screenshots, benchmark, a **37-rule deterministic frontend
> auditor** that separates slop / honesty / accessibility / hygiene, convergence,
> runtime smoke, and a **GPU-aware motion probe** — time + scroll filmstrips,
> honest FPS, reduced-motion — that declares motion *unmeasurable* rather than
> faking a number when it can't render), ready-to-paste prompts and two worked
> examples. See
> [`QUICK_START.md`](./QUICK_START.md), [`CHANGELOG.md`](./CHANGELOG.md) and
> [`EVALUATION.md`](./EVALUATION.md).

## Why it's different

- **Concept before components.** Product, audience and intent first.
- **Identity before effects; color roles before random palettes.**
- **Anti-slop by design.** It actively detects the patterns AI defaults to
  (purple-blue gradients, identical card grids, glassmorphism, fake metrics).
- **Measured, not claimed.** Contrast, viewports and performance are checked
  with bundled scripts — and never fabricated.
- **Real states, not perfect demo data.** Empty, error, loading and extreme
  content are first-class.

## Install (as a Claude Code skill)

Skills are discovered from `~/.claude/skills/` (personal) or `.claude/skills/`
(project). Put this repo there:

```bash
# personal (available in every project)
git clone https://github.com/13medeiros/medfront-ai.git ~/.claude/skills/medfront-ai

# or per-project
git clone https://github.com/13medeiros/medfront-ai.git .claude/skills/medfront-ai
```

The agent loads `SKILL.md` (its frontmatter `description` is the trigger) and
opens `commands/`, `references/`, `templates/` and `scripts/` on demand.

Optional — enable the screenshot script:

```bash
cd ~/.claude/skills/medfront-ai/scripts && npm install   # puppeteer-core
```

> Installable as a Claude Code skill today. It can be used manually elsewhere,
> but official adapters for **Cursor, Codex, OpenCode and Gemini CLI are in
> development** — the method, commands and scripts are portable; only the
> install/invoke glue differs.

## Quick start

New here? [`QUICK_START.md`](./QUICK_START.md) gets you producing in a minute.
Ready-to-paste prompts — one per task and profile — live in
[`prompts/`](./prompts): build a new project, audit an existing one, review one
page, improve colors, or compare projects.

## Use

Ask the agent to build or review a frontend and to follow MedFront AI. It runs
the workflow, creating the project-memory files as it goes:

```
foundation → reference → direction → identity → chroma → signature → sequence
→ build → reflow → motion → benchmark → anti-slop → compare → inspect
→ reinforce → simplify/amplify/calm → tune → certify
```

Each step is a *type of work* defined in [`commands/`](./commands). Loop back
when a gate fails (inspect → fix → re-inspect).

## Project memory

Four files hold the decisions and stay in the repo:
[`PRODUCT.md`](./templates/PRODUCT.template.md),
[`IDENTITY.md`](./templates/IDENTITY.template.md),
[`MOTION.md`](./templates/MOTION.template.md),
[`QUALITY.md`](./templates/QUALITY.template.md).
See a filled set in [`examples/service-booking/`](./examples/service-booking).

## Quality modules

| Module | Output | Gate |
|---|---|---|
| [`chroma`](./commands/chroma.md) | Color system + **Color Score** | ≥ 75/100 |
| [`benchmark`](./commands/benchmark.md) | Lighthouse / Web Vitals evidence | Perf ≥ 80, A11y ≥ 90 |
| [`anti-slop`](./commands/anti-slop.md) | Genericity audit + **Slop Score** | ≤ 30/100 |
| [`compare`](./commands/compare.md) | Version/reference diff + cross-project identity convergence | — |

Scores are made reproducible by the anchored rubric in
[`references/scoring-rubric.md`](./references/scoring-rubric.md).

## Tooling (bundled, tested)

Deterministic scripts so the gates have instruments — see
[`scripts/`](./scripts):

```bash
node scripts/contrast.mjs "#232019 on #f3efe7"          # WCAG contrast
node scripts/shots.mjs --base http://localhost:3000     # 6 required viewports
node scripts/benchmark.mjs --url http://localhost:3000  # Lighthouse report
node scripts/slop-lint.mjs src --max 30                          # AI-slop evidence (gate at 30)
node scripts/identity-fingerprint.mjs src --vs ../other --max 60 # convergence (gate at 60)
node scripts/smoke.mjs src                              # did it actually run? (non-skippable gate)
node scripts/motion.mjs --url http://localhost:3000    # motion: time+scroll filmstrip · GPU-honest FPS
```

Gate-oriented scripts (`contrast`, `shots`, `benchmark`, `smoke`) exit non-zero
on failure; the advisory `slop-lint` and `identity-fingerprint` exit non-zero
only with a `--max` threshold — so all are CI-usable. `contrast.mjs`,
`slop-lint.mjs` and `identity-fingerprint.mjs` have no dependencies; `shots.mjs`,
`smoke.mjs` and `motion.mjs` need `puppeteer-core` + local Chrome/Edge;
`benchmark.mjs` shells out to `npx lighthouse`.

## Certification gates

Do not certify with: an unresolved P0/P1; Color Score < 75; Slop Score > 30;
Performance or Accessibility below the project minimum; missing multi-viewport
validation; missing loading/empty/error/extreme states; or any fabricated
benchmark value.

## Repository structure

```
SKILL.md            COMMANDS.md       QUICK_START.md   scripts/
commands/           references/       templates/       prompts/
examples/           LICENSE           CHANGELOG.md
```

## Versioning, license, contributing

Semantic Versioning (see `CHANGELOG.md`). Licensed under [MIT](./LICENSE).
Issues and PRs welcome — the roadmap (broader `slop-lint` coverage and fewer
false positives, deeper score automation, a memory-file validator, more
examples and platform adapters) is in `EVALUATION.md`.
