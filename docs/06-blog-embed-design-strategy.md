# Blog Embed Design Strategy

## Purpose

This document splits the remaining design work into small design sub-phases so the quiz widget can fit many Tistory blog layouts without adding new product features.

The priority is not a stronger brand look. The priority is a quiet, adaptable embedded widget that works inside different blog skins.

## Operating Rule

Before starting any design sub-phase implementation, create a matching TODO file under `docs/todos/`.

Use this naming format:

```text
docs/todos/design-dN-short-name.md
```

Example:

```text
docs/todos/design-d1-embed-footprint.md
```

Each TODO must include:

- source documents
- design goal
- scope
- out of scope
- implementation checklist
- verification checklist
- rollback notes
- handoff notes

Do not edit application code for a design sub-phase until its TODO exists.

## Design Principles

- Blend into blog content before standing out as a branded product.
- Keep the public iframe outer background transparent.
- Prefer line, spacing, and type hierarchy over strong color.
- Use strong colors only for semantic states: correct, incorrect, warning, error.
- Avoid decorative visual weight that competes with the blog post.
- Preserve current MVP behavior and admin workflow.
- Keep each design change reversible through a small commit.

## Sub-Phase Plan

### D0. Blog Compatibility Audit

Goal: Define the target blog-layout matrix and current visual risks before changing CSS again.

Scope:

- Identify representative blog contexts.
- Review iframe dimensions, panel weight, title band, buttons, feedback, and banner.
- Decide acceptance criteria for blend-in quality.

Output:

- `docs/todos/design-d0-blog-compatibility-audit.md`
- Audit notes in worklog
- No application code changes unless explicitly approved after the audit

### D1. Embed Footprint Reduction

Goal: Reduce the widget's visual and vertical footprint so it interrupts blog reading less.

Candidate work:

- Lower default panel min-height.
- Reduce iframe internal padding.
- Soften or remove shadow.
- Tighten title band and action area.
- Keep touch targets usable.

Verification:

- Mobile and desktop iframe overflow checks.
- Light, dark, and system theme checks.
- Compare against at least compact and normal article layouts.

### D2. Skin-Adaptive Surface Tuning

Goal: Make the widget panel feel less like an external card and more like an article-native component.

Candidate work:

- Rebalance panel background opacity.
- Offer quieter border and surface rules.
- Tune dark mode surface contrast.
- Ensure transparent iframe body is preserved.

Verification:

- White, off-white, gray, and dark blog background simulations.
- Contrast check by computed colors.

### D3. Typography and Reading Rhythm

Goal: Make question, choice, feedback, and result text feel natural inside blog prose.

Candidate work:

- Revisit font size and line-height.
- Tune question block weight.
- Reduce excessive boldness.
- Ensure Markdown and KaTeX still fit.

Verification:

- Long Korean question.
- Long choice text.
- Markdown list and inline math.
- Mobile width check.

### D4. Action and State Neutrality

Goal: Keep interactive affordances clear without making buttons or states visually dominate.

Candidate work:

- Tune primary action button weight.
- Review choice hover/focus/selected states.
- Review correct/incorrect colors for semantic clarity without harshness.
- Keep accessibility affordances visible.

Verification:

- Keyboard focus check.
- Correct/incorrect feedback check.
- Result/retry check.

### D5. Blog Skin QA Matrix

Goal: Verify the final design against representative blog contexts before deployment work.

Candidate contexts:

- Minimal white article.
- Off-white editorial article.
- Dense text blog.
- Image-heavy magazine article.
- Dark article skin.
- Narrow mobile article.

Output:

- QA notes in worklog.
- Optional human-facing report if the user wants a review checkpoint.

## Current Recommendation

Start with D0, then D1.

D0 prevents another blind visual pass. D1 is likely the highest-impact improvement because the current widget is already neutral in color but still has noticeable vertical and card-like presence.
