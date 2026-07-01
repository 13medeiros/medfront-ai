# MedFront Commands

Each command represents a type of work, not a fictional specialist persona. Commands must read the project memory files before changing code.

## Core flow

`foundation → reference → direction → identity → chroma → signature → sequence → build → reflow → motion → benchmark → anti-slop → compare → inspect → reinforce → simplify/amplify/calm → tune → certify`

## `foundation`
Establish audience, goals, experience mode, constraints and success criteria. Create initial `PRODUCT.md` and `QUALITY.md`.

## `reference`
Extract transferable principles from references: emotion, composition, typography, rhythm, motion, interaction, media and memorable moments. Record what must not be copied.

## `direction`
Define central concept, architecture, hierarchy, interaction strategy, risks and trade-offs before implementation.

## `identity`
Create the visual and verbal grammar: geometry, typography, image direction, spacing, language and recurring behaviors.

## `chroma`
Create and validate the color system. Compare palette directions, define harmony and emotional intent, establish tokens and semantic roles, test contrast and distribution, and write the Color Score. Update `IDENTITY.md` with rationale, tokens and prohibited combinations.

## `signature`
Design one primary memorable moment, one secondary moment and one recurring microinteraction. Every moment must express the product or brand idea.

## `sequence`
Plan the experience as a rhythm of intensity and rest. Use scenes only when narrative progression improves understanding.

## `build`
Implement semantic, maintainable and production-oriented frontend code. Preserve the established direction and avoid introducing unapproved visual patterns.

## `reflow`
Recompose the interface for different widths, orientations, pointer types and device capabilities. Change order, interaction and density when necessary.

## `motion`
Define or inspect movement purpose, timing, easing, orchestration, performance and reduced-motion alternatives.

**Don't judge motion from a static screenshot.** On a live URL, run
`node scripts/motion.mjs --url <url>`: it captures a **scroll filmstrip** (frames
to read as a sequence), measures **FPS / jank**, checks **reduced-motion** (with
vs without), and detects **scroll-jacking** and animation libraries (GSAP, Lenis,
Lottie, WebGL…). Read the filmstrip — does the movement reveal information and
hold framerate, or is it decorative jank? Taste stays yours; the frames and the
numbers are the evidence.

## `benchmark`
Run or define reproducible measurements for performance, accessibility, best practices, SEO, Web Vitals, bundle weight, transfer size, images, fonts and animation cost. Never invent results.

## `anti-slop`
Score generic AI-generated patterns from 0 to 100, where lower is better. Identify evidence, score contribution and correction for every issue. Certification target: 30 or lower.

## `compare`
Compare versions or references using hierarchy, rhythm, density, contrast, identity, motion, clarity, accessibility and performance. Never optimize for literal visual copying.

## `inspect`
Find defects in usability, accessibility, responsiveness, performance, state handling, code structure, visual consistency and generic design patterns. Return findings as `P0` through `P3`, each with evidence, impact, correction and validation.

**Run it first:** `node scripts/smoke.mjs <src-or-url>`. Actually open the built experience — a console error / uncaught exception, or a primary interaction that does not change state (stuck), is a `P0`. Static scores never substitute for running the page.

## `reinforce`
Test long names, translations, missing data, errors, offline states, broken media, slow requests, extreme values, loading and empty states.

## `simplify`
Remove visual, content and interaction elements that do not improve comprehension, identity or conversion.

## `amplify`
Increase personality, contrast and memorability without reducing clarity, accessibility or performance.

## `calm`
Reduce competition, intensity and movement while preserving identity and hierarchy.

## `tune`
Refine spacing, line breaks, optical alignment, color distribution, motion timing, hover, focus, loading transitions and microcopy.

## `certify`
Run the final assessment against `QUALITY.md`. **Begin by proving the core loop runs** — `node scripts/smoke.mjs <src-or-url>` must pass — before looking at any score. **Paste** the tool outputs (contrast, benchmark, identity-fingerprint, smoke), do not summarize them. Do not certify with unresolved `P0` or `P1` findings, a failing/absent smoke, Color Score below 75, Slop Score above 30, missing mobile validation, or benchmark claims without evidence. Verification that could not run means *not certified — verification incomplete*, never *certified with a note*.
