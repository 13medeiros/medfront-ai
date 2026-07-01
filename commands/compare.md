# Compare

## Purpose

Compare versions, variants or references by design principles and measurable outcomes without encouraging literal visual copying.

## Compare dimensions

- hierarchy
- rhythm
- density
- contrast
- identity
- motion
- clarity
- accessibility
- responsiveness
- performance

## Rules

- Do not optimize for pixel similarity.
- Do not copy branding, protected assets or signature interactions.
- Separate subjective observations from measured evidence.
- Explain trade-offs rather than declaring one version universally better.
- Prefer comparison against project goals in PRODUCT.md and QUALITY.md.

## Output

Create a comparison table with dimension, baseline, candidate, evidence, impact and recommendation. End with a clear decision and unresolved risks.

## Tooling

When comparing two projects (or a project against a prior version), extract and
diff their identity fingerprints:

```bash
node scripts/identity-fingerprint.mjs projectA/src --vs projectB/src
```

It reports per-dimension convergence (typography, palette, geometry, borders,
shadow, motion) and a headline question: *did this identity come from the
product, or was it reused by habit?* A shared choice may still be
product-appropriate — treat the output as evidence, then judge.
