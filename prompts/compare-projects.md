# Prompt — Compare projects / detect convergence (compare)

For comparing two projects (or a project against a prior version) and checking
whether the identity was earned by the product or reused by habit.

```text
Follow the MedFront AI skill (SKILL.md), run compare on
<projectA/src> versus <projectB/src>.

1. Extract and diff the identity fingerprints:
   `node scripts/identity-fingerprint.mjs <projectA/src> --vs <projectB/src>`
2. For each dimension (typography, palette, geometry, borders, shadow, motion),
   judge the shared traits. The central question:
   did this identity come from the product, or was it reused by habit?
3. Produce a table:
   dimension · project A · project B · verdict
   (product-appropriate / generic / apparently inherited) · recommendation.
4. Conclude with the distinct visual directions that would fit <projectB>'s
   product better — without copying either project's branding or signature
   interactions.

Treat the script output as evidence, not a verdict: a shared choice can still be
the right one for both products.
```

**Produces:** a per-dimension convergence table separating product-appropriate,
generic and inherited choices, plus alternative directions — mirroring
`examples/service-booking/RETRO_AUDIT.md` (its `compare` section).
