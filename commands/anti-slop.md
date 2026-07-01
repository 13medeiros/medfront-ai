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

Run the deterministic linter (~25 rules, no LLM) for evidence first, then judge:

```bash
node scripts/slop-lint.mjs src              # grouped report + estimate
node scripts/slop-lint.mjs src --max 30     # exit 1 if estimate > 30 (CI gate)
node scripts/slop-lint.mjs src --json       # machine-readable for PR checks
```

Each finding carries a rule id (`GRAD-01` purple-blue gradient, `GLASS-01`
glassmorphism, `ORB-01` glow blob, `SHELL-01` copy-pasted card, `ICON-01`
repeated icon chip, `CLAIM-01` unmarked metric, `A11Y-01` img without alt, …),
a weight and `file:line` evidence, grouped by category. Treat it as input to the
Slop Score, not a verdict — confirm each finding. Use `references/scoring-rubric.md` for the
bands so two runs agree.
