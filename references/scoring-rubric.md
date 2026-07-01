# Scoring Rubric

Makes MedFront AI scores **reproducible**. Two honest evaluators of the same
interface should land within a small margin. The rule that gets you there:

> **Compute what is computable; require evidence for what is judged.**
> Never assign a number without either a measurement or a cited artifact.

- **Computable sub-scores** — derive from tools/tokens, not opinion (contrast,
  color distribution, JS size, CLS, viewport overflow). Use `scripts/`.
- **Judgment sub-scores** — pick the band whose descriptor matches, and cite
  concrete evidence (file, line, screenshot) for the points you award.
- **Noisy metrics** (Lighthouse) — report the environment and use the **median
  of ≥3 runs**, not a single sample.

---

## Color Score (chroma) — 100

| Sub-score | Max | Type | How to score |
|---|---|---|---|
| Harmony | 20 | Judgment | 17–20: one clear strategy (analogous/complementary/…), temperature and saturation intentional. 12–16: mostly coherent, one clash. 6–11: mixed strategies. 0–5: random. |
| Contrast & readability | 20 | **Computable** | Run `contrast.mjs` on every text/UI pair. 18–20: all text ≥ AA, UI ≥ 3:1. 14–17: 1–2 borderline (AA-large only). 8–13: a primary/CTA pair fails AA. 0–7: multiple text failures. |
| Semantic roles | 15 | Judgment | 13–15: brand, success/available, selection and focus are all **distinguishable** (by hue or by shape). 9–12: two roles collide but are recoverable. 4–8: brand==selection==focus. 0–3: color is the only signal. |
| Distribution & balance | 15 | **Computable** | Estimate share of neutral/brand/accent/semantic. 12–15: neutral-dominant (~60/30/10). 8–11: accent overused. 0–7: no clear hierarchy. |
| Identity coherence | 15 | Judgment | 13–15: recognizable without the logo. 9–12: coherent but generic. 0–8: interchangeable with any SaaS. |
| State accessibility | 10 | **Computable** | 9–10: **no state relies on color alone** (icon/shape/label present) — verify each. 5–8: one or two color-only states. 0–4: several. |
| Light/dark consistency | 5 | Judgment | 5: both modes designed and consistent. 2–3: single mode only. 0–1: broken in one mode. |

**Gate:** ≥ 75. Below that, do not certify.

---

## Slop Score (anti-slop) — 0–100, lower is better

Start at 0 and **add** contributions; do not certify above 30.

| Band | Meaning |
|---|---|
| 0–15 | Strong identity |
| 16–30 | Some generic patterns |
| 31–50 | Predictable design |
| 51–70 | Strong template / AI appearance |
| 71–100 | Severe AI slop |

Suggested contribution per signal (cite file+line as evidence):

| Signal | Add |
|---|---|
| Purple-blue gradient without rationale | +12 |
| Repeated identical card grid | +8 |
| Same radius/border/shadow across every component | +6 |
| Identical reveal animation on every element | +4 |
| Icon set with no art direction | +3 |
| Generic "eyebrow + big heading" section pattern everywhere | +3 |
| Glassmorphism / blurred orbs / glow (decorative) | +8 |
| Fabricated metrics/testimonials/logos | +20 (also a P1) |
| Generic stock media | +6 |
| Interaction unrelated to the product | +5 |

Mechanically checkable signals (card grids, uniform tokens, purple-blue
gradient) must be **grepped/cited**, not asserted.

---

## Quality Score (certify) — 100

Use the weighted areas in `templates/QUALITY.template.md`. For each area, award
points only against a checklist item or a cited artifact:

- Prefer a **checklist** ("keyboard reaches all controls: yes/no") over a vibe.
- Any performance/accessibility number must come from `benchmark.mjs`.
- Any viewport claim must be backed by a screenshot from `shots.mjs`.

**Do not certify** when any gate fails: unresolved P0/P1, Color Score < 75,
Slop Score > 30, Performance/Accessibility below the project minimum, missing
multi-viewport validation, missing loading/empty/error/extreme states, or a
fabricated benchmark value.
