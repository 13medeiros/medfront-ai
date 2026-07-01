# Product Context — Reflexo

## Product

**Name:** Reflexo

**One-sentence description:** A tiny reflex toy — tap the moment the pad turns
green — that measures your reaction time and dares you to beat it.

## Audience

**Primary audience:** Anyone with 15 seconds; no onboarding, no account.

**Primary job to be done:** *"Give me one clear, fun thing to do and instant
feedback on how I did."*

## Goals

**Business goal:** Serve as the **PLAYFUL** example for MedFront AI — a
deliberately different mode from the COMMERCE (service-booking) and BRAND
examples, proving the method produces distinct identities, not one house style.

**User goal:** Feel a quick loop of anticipation → action → result → "again".

## Experience mode

**Primary mode:** `PLAYFUL`

**Why:** The product *is* an interaction. Motion, feedback and personality are
the value, not decoration. Density is near-zero; the whole screen is one target.
Bounce and overshoot — banned in the calm booking product — are *correct* here.

## Desired perception

**Should feel:** Snappy, bold, a little cheeky, immediate.
**Must not feel:** Corporate, calm-editorial, form-heavy, or slow.

## Constraints

**Stack:** Vanilla HTML/CSS/JS — zero dependencies, no build. Opens from a file.
**Accessibility:** Keyboard (Space/Enter on the pad), visible focus, `aria-live`
announcements, states carry text labels (never color alone),
`prefers-reduced-motion` keeps it fully playable but calm.

## States (all implemented)

`idle` (press to start) · `waiting` (don't tap yet) · `go` (TAP!) ·
`early` (tapped too soon — playful, recoverable) · `result` (ms + rating).

## Success criteria

- [x] One-tap loop understood with no instructions.
- [x] Every state has a text label + `aria-live`, not color only.
- [x] Fully keyboard-operable; visible focus.
- [x] `prefers-reduced-motion` respected.
- [x] Identity clearly distinct from the other examples (see `CASE_STUDY.md`).
