# Prompt — Design or repair the color system (chroma)

For building a palette from scratch or fixing an existing one.

```text
Follow the MedFront AI skill (SKILL.md), run chroma on <project>.

- Read IDENTITY.md if it exists (read-and-verify, don't discard decisions).
- Define tokens: canvas, surface(s), text, border, brand, accent, focus and the
  semantic states. Keep brand ≠ available/success ≠ selection ≠ focus clearly
  distinguishable (by hue or by shape).
- Validate EVERY text and UI pair with
  `node scripts/contrast.mjs "<fg> on <bg>" ...`
  (AA: 4.5 for text, 3.0 for large/graphical). Fix anything below.
- Score with references/scoring-rubric.md; target Color Score ≥ 75. The
  contrast and distribution sub-scores are computable — cite the numbers.
- Never signal a state by color alone: pair it with icon/shape/label + aria.
- If two projects might share a palette, check convergence:
  `node scripts/identity-fingerprint.mjs <project/src> --vs <other/src>`.

Update IDENTITY.md with the token table, the harmony rationale, and the
forbidden foreground/background combinations.
```

**Produces:** an updated `IDENTITY.md` with a validated token table, a Color
Score with cited contrast numbers, and role separation for brand/selection/focus.
