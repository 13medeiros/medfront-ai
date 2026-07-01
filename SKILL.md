# MedFront AI

MedFront AI is a frontend direction, creation, inspection and refinement skill for building distinctive, high-quality digital experiences.

## Mission

Help an AI agent create frontend experiences that are strategically clear, visually distinctive, technically robust, responsive by composition, accessible, performant and memorable without becoming decorative noise.

## Core principle

Do not begin by generating components. First understand the product, audience, context, desired emotion, interaction model and technical constraints. A strong frontend is a coherent system, not a collection of effects.

## Experience modes

Classify the project before making design decisions:

- `UTILITY`: dashboards, internal tools and frequently used products;
- `BRAND`: institutional websites, portfolios and landing pages;
- `CINEMATIC`: launches, campaigns and narrative-driven experiences;
- `PLAYFUL`: exploratory, interactive or gamified experiences;
- `COMMERCE`: product presentation, desire and conversion.

The selected mode changes hierarchy, motion, density, interaction and media decisions.

## Required project memory

Before substantial work, read or create:

- `PRODUCT.md`: audience, goals, value proposition and constraints;
- `IDENTITY.md`: visual and verbal grammar;
- `MOTION.md`: movement principles and reduced-motion rules;
- `QUALITY.md`: measurable delivery criteria.

Never silently overwrite project decisions. Update them explicitly when the direction changes.

## Official workflow

1. `foundation` — establish product context and constraints.
2. `reference` — extract principles from references without copying.
3. `direction` — define concept, hierarchy, architecture and experience mode.
4. `identity` — create the visual and verbal grammar.
5. `chroma` — design and validate palette harmony, semantics, distribution and contrast.
6. `signature` — design the memorable moment connected to the product.
7. `sequence` — define narrative rhythm, scenes and transitions.
8. `build` — implement the interface with semantic, maintainable code.
9. `reflow` — recompose the experience across breakpoints and input modes.
10. `motion` — create and validate the movement language.
11. `benchmark` — measure performance, accessibility and delivery budgets.
12. `anti-slop` — detect generic AI-generated design and content patterns.
13. `compare` — compare versions or references by principles, not visual copying.
14. `inspect` — find technical, visual, accessibility and performance defects.
15. `reinforce` — test extreme content, failures, loading and empty states.
16. `simplify`, `amplify` or `calm` — adjust design intensity intentionally.
17. `tune` — refine spacing, hierarchy, timing and interaction details.
18. `certify` — perform the final quality assessment.

## Chroma requirements

Color decisions must be explicit and testable. The `chroma` stage must:

- propose and compare multiple palette directions when the identity is not established;
- name the harmony strategy and emotional intent;
- define canvas, surface, text, border, brand, accent and semantic tokens;
- separate brand, success, availability, selection and focus roles;
- document approximate color distribution;
- validate text, controls and graphical contrast;
- avoid communicating state only through color;
- test representative screens and states;
- document forbidden foreground/background combinations;
- add a color rationale and token table to `IDENTITY.md`.

Use the MedFront Color Score:

- harmony: 20;
- contrast and readability: 20;
- semantic roles: 15;
- distribution and balance: 15;
- identity coherence: 15;
- state accessibility: 10;
- light/dark consistency: 5.

Minimum certification target: 75/100.

## Benchmark requirements

Measure rather than merely claim performance. Record available evidence for:

- Lighthouse performance, accessibility, best practices and SEO;
- Core Web Vitals or lab proxies;
- initial JavaScript size;
- total transfer size and request count;
- image and font weight;
- layout shifts;
- animation smoothness and expensive effects;
- unnecessary libraries, observers and global listeners.

Default targets, adjustable in `QUALITY.md`:

- Lighthouse Performance: 80 minimum, 90 preferred;
- Accessibility: 90 minimum, 95 preferred;
- LCP: under 2.5 seconds;
- CLS: under 0.1;
- INP: under 200 milliseconds when measurable.

Never fabricate benchmark results. If tools cannot run, report the limitation and provide a reproducible command plan.

## Anti-slop requirements

The `anti-slop` stage must evaluate originality, visual coherence, copy quality, pattern repetition, component genericity, media quality and the relationship between form and product.

Use a Slop Score from 0 to 100, where lower is better:

- 0–15: strong identity;
- 16–30: some generic patterns;
- 31–50: predictable design;
- 51–70: strong template or AI appearance;
- 71–100: severe AI slop.

Certification target: 30 or lower.

Actively detect:

- vague claims and AI marketing clichés;
- unsupported metrics, testimonials and logos;
- repeated identical card grids;
- purple-blue gradients without rationale;
- excessive glassmorphism, blurred orbs and glow;
- icon libraries used without art direction;
- identical reveal animation everywhere;
- decorative dashboard mockups without product meaning;
- every component using the same radius, border and shadow;
- generic stock media;
- interactions unrelated to the product.

Every score contribution must identify evidence and a correction.

## Compare requirements

`compare` may evaluate a previous version, a proposed variant or a reference. Compare hierarchy, rhythm, density, contrast, identity, motion, clarity, accessibility and performance. Do not optimize for pixel similarity or copy protected visual identity.

## Non-negotiable rules

- Do not copy reference layouts, branding, assets or signature interactions literally.
- Do not use animation without a communicative or interaction purpose.
- Do not treat mobile as a reduced desktop screenshot.
- Do not hide essential content behind complex interaction.
- Do not declare completion without visual validation at multiple viewport sizes.
- Do not optimize only for the ideal data state.
- Support keyboard navigation and reduced-motion preferences.
- Prefer semantic HTML and platform capabilities before adding libraries.
- Prefer transform and opacity for motion.
- Avoid generic AI-generated SaaS aesthetics unless explicitly required.
- Do not certify unmeasured claims as facts.

## Visual validation

Minimum viewport review:

- 360 × 800;
- 390 × 844;
- 768 × 1024;
- 1280 × 800;
- 1440 × 900;
- 1920 × 1080.

Check overflow, wrapping, stacking, focus, touch targets, sticky behavior, motion, loading shifts, content density and palette behavior.

## Quality priorities

Classify findings as:

- `P0`: blocks use, access or task completion;
- `P1`: seriously damages UX, stability or conversion;
- `P2`: meaningful visual, technical or responsive defect;
- `P3`: refinement opportunity.

## Certification gates

Do not certify when:

- a `P0` or `P1` remains unresolved;
- Color Score is below 75;
- Slop Score is above 30;
- Performance is below the project minimum;
- Accessibility is below the project minimum;
- mobile validation is missing;
- essential loading, empty, error or extreme-content states are missing;
- benchmark values were invented or cannot be reproduced.

## Definition of done

A project is complete only when it is useful, coherent, distinctive, chromatically resolved, responsive, accessible, performant, resilient, visually validated and maintainable.
