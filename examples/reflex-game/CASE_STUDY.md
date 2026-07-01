# Case Study — Reflexo (PLAYFUL)

The second MedFront AI example, chosen to be as far as possible from the first:
where `service-booking` is calm, warm and editorial (COMMERCE + UTILITY),
`Reflexo` is dark, saturated and springy (PLAYFUL). The goal is to show the
method produces **different identities per product**, not one recycled style.

## Context

A reflex toy: tap when the pad turns green; it measures your reaction time.
Vanilla HTML/CSS/JS, no build — it opens straight from a file.

## Mode drives everything

| Decision | Booking (COMMERCE) | Reflexo (PLAYFUL) |
|---|---|---|
| Density | Airy, information-rich | Near-zero — one target |
| Motion | Deliberate, **no bounce** | **Springy, overshoot on purpose** |
| Type | Grotesque + mono for data | One chunky rounded display (Fredoka) |
| Palette | Warm neutral + terracotta | Dark base + electric lime/pink/yellow |
| Copy | "Tá combinado." | "TOQUE!", "Cedo demais! 😅" |

Same methodology, opposite output — that is the point.

## States & accessibility

Five states (idle/waiting/go/early/result) each carry a **text label** and an
`aria-live` announcement, so nothing depends on color. The pad is a real
`<button>`, so keyboard works for free; `prefers-reduced-motion` keeps it fully
playable without the bounce. See `QUALITY.md`.

## Distinct identity — measured, not claimed

Run the convergence check against the booking app's source:

```bash
node scripts/identity-fingerprint.mjs examples/reflex-game/src \
  --vs <path-to>/service-booking/src
```

Result (Reflexo vs the booking app):

```
Typography        ○ distinct   sans (Fredoka) vs sans+mono (Bricolage+Spline)
Palette           ◐ partial    5/11 near (both have a near-white text token)
Geometry (radius) ○ distinct   var(--r) 28px vs "lg"
Shadow            ○ distinct   chunky offset vs subtle "sm"
Borders           ◐/●          fewer thin lines (0.8 vs 1.2 /kB)
Motion            ◐ partial    shares a transform/transition primitive only
→ Overall ~37% — DISTINCT — identities differ
```

Two projects, same method, **distinct identities** — the fingerprint proves the
divergence rather than us asserting it. (The small palette/motion overlap is a
shared near-white text token and the CSS `transform`/`transition` primitives —
product-appropriate, not a reused house style.)

## Limitations

- A toy, by design — one screen, one interaction.
- `identity-fingerprint`'s shadow check reads Tailwind `shadow-*` classes, so it
  under-counts this project's raw `box-shadow` (still lands "distinct").
- Sound/haptics omitted to keep it dependency-free.

## Run it

Open `src/index.html` in a browser — no server, no install. Space/Enter or tap.
