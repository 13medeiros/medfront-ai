# Prompt — Audit an existing project (AUDIT)

For reviewing or retrofitting a UI that already exists. Diagnosis first — no
rewrite until approved.

```text
Follow the MedFront AI skill (SKILL.md), profile AUDIT, on the existing project
at <path/to/src> (running at <url> if available). Do NOT change code before you
present the diagnosis.

1. foundation (reconstruct) — infer the product, audience and experience mode.
   If PRODUCT.md / IDENTITY.md / MOTION.md already exist, READ AND VERIFY them —
   do not recreate.
2. chroma — extract the color tokens; validate contrast with
   `node scripts/contrast.mjs "<fg> on <bg>" ...`; compute a Color Score using
   references/scoring-rubric.md (name the computable vs judgment sub-scores).
3. benchmark — `node scripts/benchmark.mjs --url <url>`; record environment,
   command and date; use the median of 3 runs; never fabricate numbers.
4. anti-slop — `node scripts/slop-lint.mjs <path> --max 30` for evidence, then
   confirm each finding; produce a Slop Score.
5. (optional) convergence — if comparing against another project:
   `node scripts/identity-fingerprint.mjs <path> --vs <other/src>`.
6. inspect — list P0–P3 findings, each with evidence, impact and correction.
7. certify (audit scope) — summarize; recommend fixes in phases; keep code
   unchanged until I approve.

Deliver a report in the shape of
examples/service-booking/RETRO_AUDIT.md.
```

**Produces:** a retro-audit report (Color Score, Slop Score, benchmark table,
P0–P3 findings) with no code changes until you approve.
