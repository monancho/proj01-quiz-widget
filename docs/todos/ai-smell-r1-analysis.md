# AI Smell R1 Analysis TODO

## Goal

Scan the repository for concrete AI-smell candidates and rank them by risk.

## Source Documents

- `docs/08-ai-smell-review-plan.md`
- `AGENTS.md`
- `docs/00-project-status.md`
- latest `docs/worklog/`

## Checklist

- [x] Inspect largest source and documentation files.
- [x] Search for mojibake markers in app and docs.
- [x] Search for generic AI-web visual signals such as heavy cards, gradients, badges, and shadows.
- [x] Identify oversized component and CSS files.
- [x] Separate high-risk code smells from acceptable MVP tradeoffs.

## Findings

| Area | Evidence | Risk | Recommendation |
| --- | --- | --- | --- |
| CSS layering | `client/src/styles.css` is about 85KB and contains many chronological override layers | High | Split into semantic CSS modules after PR #6 stabilizes |
| Admin page size | `client/src/pages/AdminQuizManagerPage.jsx` is about 32KB and owns many concerns | High | Extract isolated helpers/components incrementally |
| Rolling status docs | `docs/00-project-status.md` and worklogs are very long | Medium | Later compact into current-state + archive model |
| Mojibake | Several docs and some older status entries contain broken Korean text | Medium | Dedicated content cleanup pass |
| Generic web patterns | Some `card`, `badge`, `shadow`, and gradient terms remain | Low/Medium | Many are intentional admin/human-doc affordances; avoid blind removal |
| Backend | Services/repositories are smaller and scoped | Low | No immediate smell remediation needed |

## Handoff

Proceed to R2 planning. First safe execution target: extract Markdown authoring helper from the admin page.
