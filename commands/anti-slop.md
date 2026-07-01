# Anti-Slop

## Purpose

Detect generic AI-generated design, content and interaction patterns before final certification.

## Evaluate

- originality and identity
- visual coherence
- copy quality
- pattern repetition
- component genericity
- media quality
- relationship between form and product
- unsupported claims or fabricated proof

## Slop Score

Use a score from 0 to 100, where lower is better.

0 to 15: strong identity
16 to 30: some generic patterns
31 to 50: predictable design
51 to 70: strong template or AI appearance
71 to 100: severe AI slop

Certification target: 30 or lower.

## Common signals

- vague marketing clichés
- repeated identical card grids
- unjustified purple-blue gradients
- excessive glassmorphism, glow and blurred orbs
- icon libraries used without art direction
- the same reveal animation on every element
- decorative dashboard mockups without product meaning
- identical radius, border and shadow across every component
- generic stock media
- interactions unrelated to the product
- invented logos, metrics, testimonials or customer claims

## Output

For each issue, report evidence, score contribution, impact and correction. Recalculate the score after refinement.

## Tooling

Run the deterministic linter (37 rules, no LLM) for evidence first, then judge:

```bash
node scripts/slop-lint.mjs src              # four-result report
node scripts/slop-lint.mjs src --max 30     # exit 1 if Slop > 30 or a honesty blocker
node scripts/slop-lint.mjs src --json       # machine-readable for PR checks
```

**Not everything it finds is slop** — it reports **four separate results**, each
feeding a different gate:

- **Visual Slop score** (Color/Geometry/Components/Motion/Copy/Structure) — the
  aesthetic gate, ≤ 30.
- **Honesty** (`CLAIM-01/02`, unmarked metrics/testimonials) — a **P1
  certification blocker**, never just a slop number.
- **Accessibility** (`A11Y-*`) — feeds the accessibility gate, not the Slop score.
- **Hygiene** (`HYG-*`, console.log / TODO) — advisory warnings, non-blocking.

Each finding has a rule id, weight, **confidence** (high/medium/low) and
`file:line`. Contributions **saturate** by count (1 occurrence = 50% of weight).
Suppress a real false positive with a justified comment — reported, never
silent: `// medfront-ignore GRAD-02 -- brand gradient, intentional`. Confirm
each finding. Use `references/scoring-rubric.md` for the
bands so two runs agree.
