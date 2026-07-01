# Examples

Real, filled-in artifacts that show the depth MedFront AI expects — not empty
skeletons. Use them to calibrate what "good" looks like. Two examples in
opposite modes (COMMERCE and PLAYFUL) show the method producing **different
identities per product**, not one recycled style.

## `service-booking/` — two-sided autonomous-services booking app

A COMMERCE (customer) + UTILITY (professional dashboard) product taken through
the full workflow, including the newer quality modules.

| File | What it demonstrates |
|---|---|
| [`PRODUCT.md`](./service-booking/PRODUCT.md) | foundation → reference → direction → sequence, with mode selection and risks |
| [`IDENTITY.md`](./service-booking/IDENTITY.md) | visual/verbal grammar, tokens, and calendar states that never rely on color alone |
| [`MOTION.md`](./service-booking/MOTION.md) | motion tied to availability, with reduced-motion equivalents |
| [`QUALITY.md`](./service-booking/QUALITY.md) | state matrix, viewport checklist, certify log |
| [`CASE_STUDY.md`](./service-booking/CASE_STUDY.md) | end-to-end write-up |
| [`INSPECTION_REPORT.md`](./service-booking/INSPECTION_REPORT.md) | P0–P3 findings with evidence and fixes |
| [`RETRO_AUDIT.md`](./service-booking/RETRO_AUDIT.md) | **chroma + anti-slop + compare + benchmark** applied retroactively, with measured contrast, a real Lighthouse run, and a before/after of an approved visual direction |

`RETRO_AUDIT.md` is the best single demonstration of the v0.2 modules: it shows
a Color Score raised from 75 → ~84 by separating brand/selection/focus roles, a
Slop Score reduced by removing an inherited "house style", and Accessibility
measured from 88 → 100 after fixing contrast and list markup.

> These are the decision artifacts the skill produces. The full application
> code for this example lives in its own project; here we ship the memory files
> and audits, which are what MedFront AI is responsible for.

## `reflex-game/` — a PLAYFUL reflex toy

The opposite mode: dark, saturated, springy. A dependency-free HTML/CSS/JS toy
(`src/`) plus its memory files and a case study.

| File | What it demonstrates |
|---|---|
| [`IDENTITY.md`](./reflex-game/IDENTITY.md) · [`MOTION.md`](./reflex-game/MOTION.md) | PLAYFUL grammar — chunky rounded shapes, springy overshoot (bounce is *correct* here), state colors always paired with labels |
| [`PRODUCT.md`](./reflex-game/PRODUCT.md) · [`QUALITY.md`](./reflex-game/QUALITY.md) | a tiny product with five real states and full keyboard + reduced-motion support |
| [`CASE_STUDY.md`](./reflex-game/CASE_STUDY.md) | mode contrast with `service-booking` and a **measured** distinctness check (identity-fingerprint: ~37% — DISTINCT) |
| `src/` | real, runnable code (open `src/index.html`) — so the convergence tool has something to diff |

Run it by opening `reflex-game/src/index.html` in a browser — no build.
