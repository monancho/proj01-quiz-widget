# AI Smell R0 Research TODO

## Goal

Translate external AI-smell references into a project-specific review checklist.

## Source Documents

- `https://shvbsle.in/various-llm-smells/`
- `https://huggingface.co/papers/2412.18989`
- `https://arxiv.org/abs/2510.03029`
- `https://colab.ws/articles/10.1145%2F3643674`
- `https://www.925studios.co/blog/ai-slop-web-design-guide`
- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/worklog/2026-05-30.md`

## Checklist

- [x] Read the user-provided AI-smell article.
- [x] Search for code-quality research around LLM-generated code smells.
- [x] Search for AI-slop web/design smell references.
- [x] Convert generic AI-smell ideas into project-specific categories.
- [x] Record source URLs in `docs/08-ai-smell-review-plan.md`.

## Findings

- The user-provided article frames AI-smell as recognizable repeated patterns, especially repeated writing structures and generic web UI patterns.
- Code-smell research treats LLM-generated code quality as something that must be measured beyond functional correctness.
- The relevant project categories are oversized files, overlayered CSS, mojibake content, generic web patterns, documentation bloat, and weakly isolated helper logic.

## Handoff

Proceed to R1 analysis with the categories in `docs/08-ai-smell-review-plan.md`.
