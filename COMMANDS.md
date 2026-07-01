# Commands

MedFront is not only an 18-step pipeline — it's a **palette you pull from**.
Call one command when you need a single discipline, or chain them with a
[profile](./SKILL.md#usage-profiles) for the whole arc. Ready-to-paste versions
live in [`prompts/`](./prompts).

> How to invoke: tell your agent, e.g. *"run MedFront `chroma` on `src/`"* or
> *"MedFront `smoke` then `inspect` this page."* Each command reads the relevant
> `commands/*.md` contract and the project memory before acting.

## Direct — shape the design

| Command | Does | Pull it when |
|---|---|---|
| `foundation` | Establishes product truth, audience, mode → `PRODUCT.md` | you're starting, or context is missing |
| `reference` | Extracts transferable principles (no copying) | you have inspiration to mine |
| `direction` | Central concept, architecture, hierarchy | before any visual decision |
| `identity` | Visual + verbal grammar → `IDENTITY.md` | the UI needs a recognizable system |
| `chroma` | Color system + **Color Score** · `scripts/contrast.mjs` | palette is undecided or failing contrast |
| `signature` | The one memorable, product-tied moment | the experience needs a spine |
| `sequence` | Rhythm of intensity and rest | narrative/scroll needs pacing |

## Build & adapt

| Command | Does | Pull it when |
|---|---|---|
| `build` | Semantic, accessible, maintainable code | implementing the direction |
| `reflow` | Recompose across breakpoints · `scripts/shots.mjs` | mobile ≠ shrunk desktop |
| `motion` | Movement language + reduced-motion | animation needs purpose, not noise |

## Prove — measured, can't fake

| Command | Does | Pull it when |
|---|---|---|
| `anti-slop` | Kill generic patterns + **Slop Score** · `scripts/slop-lint.mjs` | it smells like a template |
| `compare` | Cross-project convergence · `scripts/identity-fingerprint.mjs` | "did this identity come from the product or from habit?" |
| `benchmark` | Lighthouse / Web Vitals evidence · `scripts/benchmark.mjs` | you need real perf/a11y numbers |
| `smoke` | **Does it actually run?** · `scripts/smoke.mjs` | before trusting any score — non-skippable |
| `inspect` | Find defects `P0`–`P3` with evidence | reviewing anything |
| `reinforce` | Test empty/error/loading/extreme states | the happy path isn't enough |
| `certify` | Final gate — begins by proving the loop runs | declaring done |

## Adjust intensity

| Command | Does |
|---|---|
| `simplify` / `amplify` / `calm` | dial personality up or down without losing clarity |
| `tune` | refine spacing, timing, hover/focus, microcopy |

## Profiles (bundles)

Don't always run all 18. Announce the profile:

- **QUICK** — `inspect` → `tune` (review a screen; scoped "quick review passed").
- **STANDARD** — a focused feature/page, gated to its scope.
- **AUDIT** — `foundation` (reconstruct) → `chroma` → `benchmark` → `anti-slop` → `inspect` → `certify`.
- **FULL** — all 18, from scratch.

## The rule that makes the palette trustworthy

Every `Prove` command runs a real tool and **pastes its output** — never a
summary. A green Color/Slop score means nothing if `smoke` fails: *verification
incomplete is not certification.*
