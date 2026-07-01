# Benchmark

## Purpose

Measure frontend quality with reproducible evidence instead of subjective claims.

## Measure when tools are available

- Lighthouse performance, accessibility, best practices and SEO
- LCP, CLS and INP or suitable lab proxies
- initial JavaScript size
- total transfer size and request count
- image and font weight
- layout shifts
- animation smoothness
- unnecessary libraries, observers and listeners

## Default targets

Performance: 80 minimum, 90 preferred
Accessibility: 90 minimum, 95 preferred
LCP: below 2.5 seconds
CLS: below 0.1
INP: below 200 milliseconds when measurable

Projects may define stricter or different budgets in QUALITY.md.

## Rules

- Never invent benchmark values.
- Record environment, command and date for every measurement.
- Distinguish lab data from field data.
- Explain unavailable measurements.
- Provide a reproducible plan when tools cannot run.
- Identify the largest contributors before recommending optimization.

## Output

Create a benchmark report containing metric, result, target, status, evidence, likely cause and recommended action.
