# Motion Language — Reflexo

## Core principle

Movement **is** the product. Every animation is feedback for the reflex loop:
anticipation, the GO snap, the button press, the result pop.

## Personality

Springy, punchy, physical. **Overshoot is intentional** — `cubic-bezier(0.34,
1.56, 0.64, 1)`. (This is the opposite of the booking product's deliberate,
no-bounce easing — mode drives the choice.)

## Signature moments

- **GO snap:** at `waiting → go`, the pad flips to lime and plays a 220ms `pop`
  (scale 0.96 → 1.04 → 1). The single most important frame.
- **Button press:** `:active` drops the pad 6px and shrinks its shadow — a
  tactile "real button" press.
- **Result:** the pad settles with a lime outline; the reaction time lands big.

## Timing

Micro (press): ~120ms · State change: ~180ms · Pop: 220ms.

## Reduced motion

Under `prefers-reduced-motion: reduce` (and a `.reduce` class): no pop, no press
depth, no scale — only instant color/label changes. **The toy stays fully
playable**; it just stops bouncing.

## Patterns to avoid

Parallax, decorative particles, infinite loops, motion that delays the GO signal
(reaction timing must be honest — the color flip is immediate; the pop is
decoration layered on top, never gating input).
