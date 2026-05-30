# AI Smell Review Plan

## Purpose

This plan defines a staged review process for finding and reducing AI-smell in this project.

AI-smell here means code, UI, documentation, or workflow artifacts that look plausible but create maintainability, design, review, or trust problems because they were produced too quickly or too generically.

## Source References

- User-provided article: `https://shvbsle.in/various-llm-smells/`
- Code smell benchmark paper: `https://huggingface.co/papers/2412.18989`
- LLM generated code smell study: `https://arxiv.org/abs/2510.03029`
- ChatGPT-generated code quality study: `https://colab.ws/articles/10.1145%2F3643674`
- AI-slop web design article used as a secondary design-smell reference: `https://www.925studios.co/blog/ai-slop-web-design-guide`

## Review Passes

### R0. Research Parser

Goal: Translate external AI-smell references into project-specific smell categories.

Output:

- `docs/todos/ai-smell-r0-research.md`
- Source summary.
- Project-specific checklist.

### R1. Analysis Parser

Goal: Scan the repository for concrete smell candidates.

Output:

- `docs/todos/ai-smell-r1-analysis.md`
- Smell inventory with severity, evidence, and recommended action.

### R2. Planning Parser

Goal: Convert smell inventory into safe, staged remediation tasks.

Output:

- `docs/todos/ai-smell-r2-remediation-plan.md`
- Keep / fix now / fix later decisions.

### R3. Execution Parser

Goal: Apply the first low-risk changes that reduce smell without changing product behavior.

Output:

- `docs/todos/ai-smell-r3-execution.md`
- Code or documentation changes.

### R4. Test Parser

Goal: Verify that remediation did not regress behavior, UI, build, or handoff documentation.

Output:

- `docs/todos/ai-smell-r4-verification.md`
- Build and smoke results.
- Follow-up risks.

## Project-Specific AI-Smell Categories

| Category | Signal | Project Risk |
| --- | --- | --- |
| Overlayered CSS | Many later CSS overrides for the same surfaces | Future visual changes become hard to reason about |
| Oversized component/page | One file owns too many UI concerns | Small changes become risky and hard to test |
| Documentation bloat | Rolling status/worklog files become huge | New sessions may miss the actual current state |
| Mojibake text | Korean UI/docs encoded incorrectly | Human trust and UX quality drop immediately |
| Generic AI-web pattern | Decorative cards, gradients, badges, broad dashboards | Widget may look generic instead of blog-compatible |
| Unverified convenience logic | Small UX helpers without isolated tests | Regressions hide behind manual QA |
| Excessive generated reports | Human docs become noise rather than decision support | Review burden increases |

## Initial Assessment

The project has some AI-smell risk, but it is not uniformly high.

High-risk areas:

- `client/src/styles.css` is very large and contains many chronological override layers.
- `client/src/pages/AdminQuizManagerPage.jsx` is large and mixes data fetching, modal state, drag/drop, utility modal, authoring helper, and rendering.
- `docs/00-project-status.md` and the latest worklog are useful but now very long.
- Several planning docs still contain mojibake from earlier encoding issues.

Lower-risk areas:

- Backend services and repositories are comparatively small and domain-scoped.
- Smoke scripts exist for the backend phases.
- Feature work generally has TODO files, verification logs, commits, and pushes.

## Remediation Strategy

Do not attempt a broad cleanup in one pass.

Recommended order:

1. Extract isolated helpers from oversized UI files.
2. Add focused tests or script-level checks for extracted helpers.
3. Split CSS into semantic files only after PR #6 is reviewed or merged.
4. Compact status/worklog conventions after the current PR stabilizes.
5. Fix remaining mojibake in docs/UI strings in a dedicated content cleanup pass.

## Current First Execution Target

Extract the Markdown authoring continuation helper from `AdminQuizManagerPage.jsx` into a small utility module.

Reason:

- It is low risk.
- It directly reduces oversized-component smell.
- It makes the helper easier to test.
- It does not change public behavior.
