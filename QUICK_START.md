# Quick Start

From "installed" to "producing work" in about a minute.

## 1. Install (Claude Code)

```bash
git clone https://github.com/13medeiros/medfront-ai.git ~/.claude/skills/medfront-ai
cd ~/.claude/skills/medfront-ai/scripts && npm install   # optional: enables shots.mjs
```

## 2. Pick the prompt that matches your task

| Task | Profile | Prompt |
|---|---|---|
| Build a new UI / page / app from scratch | FULL · STANDARD | [`prompts/build-new-project.md`](./prompts/build-new-project.md) |
| Audit or retrofit an existing UI | AUDIT | [`prompts/audit-existing-project.md`](./prompts/audit-existing-project.md) |
| Review or fix one screen / component | QUICK | [`prompts/review-one-page.md`](./prompts/review-one-page.md) |
| Design or repair the color system | chroma | [`prompts/improve-colors.md`](./prompts/improve-colors.md) |
| Compare two projects / detect convergence | compare | [`prompts/compare-projects.md`](./prompts/compare-projects.md) |

## 3. Paste it to your agent, fill the `<placeholders>`, send

The agent loads `SKILL.md`, runs the profile's steps, creates or reads the
memory files (`PRODUCT` / `IDENTITY` / `MOTION` / `QUALITY`), uses the
[`scripts/`](./scripts) for evidence, and respects the certification gates.

## What "good" looks like

See a finished result — memory files, case study and a modules retro-audit — in
[`examples/service-booking/`](./examples/service-booking).

## The two rules that matter most

- **Concept before components.** Product, audience and mode first.
- **Never fabricate.** No fake metrics, testimonials, logos or benchmark
  numbers; label demo data as demonstration.
