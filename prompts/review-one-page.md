# Prompt — Review one page or component (QUICK)

For a localized review: one screen, one component, a responsiveness fix.

```text
Follow the MedFront AI skill (SKILL.md), profile QUICK, on <file or route>.
Scope: this screen/component only — not the whole product.

Run inspect → tune:
- inspect — usability; accessibility (keyboard, visible focus, labels, and
  contrast via `node scripts/contrast.mjs "<fg> on <bg>" ...`); responsiveness
  (`node scripts/shots.mjs --base <url> --routes <route>`); required states
  (empty / error / loading); and generic patterns
  (`node scripts/slop-lint.mjs <path>`).
- tune — fix the P0/P1 you find; refine spacing, hierarchy, motion timing,
  hover/focus and microcopy for this scope.

Output a "quick review passed" for the analyzed scope: list what you fixed and
what was out of scope. Do NOT claim full-product certification (QUICK does not
run product-wide benchmark/viewport/state coverage).
```

**Produces:** a scoped "quick review passed" with the fixes applied to that
screen/component — fast, without pretending it certifies the whole product.
