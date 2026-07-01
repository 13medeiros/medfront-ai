# Quality Standard — Reflexo

Small scope, but the non-negotiables still apply.

## States (reinforce)

| State | Implemented | Not color-only |
|---|---|---|
| idle | ✅ | label "Toque para começar" |
| waiting | ✅ | label "Espere o verde…" |
| go | ✅ | label "TOQUE!" |
| early (tapped too soon) | ✅ | label "Cedo demais! 😅" |
| result | ✅ | ms + rating text |
| no best score yet | ✅ | "Melhor: —" |
| private mode (localStorage blocked) | ✅ | falls back to in-memory best |

## Accessibility

- [x] Keyboard: the pad is a `<button>` (Space/Enter activate it); visible focus ring.
- [x] `aria-live="polite"` status announces every state transition.
- [x] States carry text labels, never color alone.
- [x] `prefers-reduced-motion` honored (no bounce/press/pop).
- [x] Large touch target (min-height ~46vh, capped).

## Responsiveness

- [x] Single-column, fluid `clamp()` type; works 360px → desktop.
- [x] No horizontal overflow; touch-first sizing.

## Gates (example scope)

No P0/P1. No fabricated data. Motion is purposeful (feedback), not decorative.
Reduced-motion equivalent exists. Identity validated as **distinct** from the
other examples via `identity-fingerprint` (see `CASE_STUDY.md`).
