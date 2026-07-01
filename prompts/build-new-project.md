# Prompt — Build a new project (FULL / STANDARD)

For a new UI, page or app from scratch. Copy the block, fill the `<…>`, send it
to your agent.

```text
Follow the MedFront AI skill (SKILL.md).

Build: <one-line product description>.
Audience: <who they are>. Primary task/conversion: <the one action>.
Stack: <e.g. Next.js + TypeScript + Tailwind + Motion>.

Profile: FULL  (use STANDARD for a single focused page).

Work in order and write the memory files as you go:
1. foundation — product, audience, experience mode
   (UTILITY/BRAND/CINEMATIC/PLAYFUL/COMMERCE), constraints, success criteria
   → PRODUCT.md, QUALITY.md.
2. reference → direction → identity → IDENTITY.md.
3. chroma — design the palette; keep brand ≠ available/success ≠ selection ≠
   focus distinguishable; validate every text/UI pair with
   `node scripts/contrast.mjs "<fg> on <bg>" ...` (Color Score ≥ 75, see
   references/scoring-rubric.md). Never signal state by color alone.
4. signature → sequence → MOTION.md.
5. build — semantic, accessible, responsive code; implement real states
   (empty, error, loading, extreme content), not just the ideal one.
6. reflow → motion (respect prefers-reduced-motion).
7. benchmark `node scripts/benchmark.mjs --url <url>` ·
   anti-slop `node scripts/slop-lint.mjs src --max 30` · inspect · reinforce · tune.
8. certify — do not certify with any open P0/P1, Color < 75, Slop > 30,
   Perf < 80, A11y < 90, or missing viewport validation
   (`node scripts/shots.mjs --base <url>` across the 6 required sizes).

Rules: concept before components; mobile is a recomposition, not a shrunk
desktop; keyboard navigation + prefers-reduced-motion; no fabricated metrics,
testimonials or logos — label any demo data as demonstration.
```

**Produces:** `PRODUCT.md`, `IDENTITY.md`, `MOTION.md`, `QUALITY.md`, the app
code, and a certification summary. Compare depth against
[`examples/service-booking/`](../examples/service-booking).
