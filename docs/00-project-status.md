# Project Status

## Current

| Item | Value |
| --- | --- |
| Date | 2026-05-29 |
| Base branch | `develop` |
| Current branch | `feature/rendering-security` |
| Active scope | Pre-deployment admin UX refinement |
| Status | Admin dashboard layout refinement verified for PR #6 |

## Completed

- Git repository initialized.
- GitHub remote connected: `https://github.com/monancho/proj01-quiz-widget.git`.
- `develop` branch pushed to `origin/develop`.
- Planning documents committed under `docs/`.
- Phase 0 + Phase 1 implementation committed.
- Agent operating guide added in `AGENTS.md`.
- Human-facing docs categorized under `docs/human/index.html`, `guides/`, `reports/`, and `decisions/`.
- Phase 0 + Phase 1 branch fast-forwarded into local `develop`.
- `feature/server-api-mvp` branch created for Phase 2+ backend API work.
- Phase TODO convention added to `AGENTS.md`.
- Phase 2 TODO file added under `docs/todos/`.
- Phase 2 Slug Group API implemented.
- Push and PR strategy added to `AGENTS.md`.
- Human-facing docs update timing added to `AGENTS.md`.
- Phase 3 TODO file added under `docs/todos/`.
- Phase 3 Quiz API implemented.
- Phase 4 TODO file added under `docs/todos/`.
- Phase 4 Public Embed API implemented.
- API MVP human checkpoint report added under `docs/human/reports/`.
- Human docs index expanded into a development documentation portal.
- Local `develop` pushed to `origin/develop`.
- `feature/server-api-mvp` pushed to origin.
- Draft PR opened: `https://github.com/monancho/proj01-quiz-widget/pull/1`.
- PR handoff status pushed to `feature/server-api-mvp`: `f6560ca docs: record github pr handoff`.
- `feature/client-embed-mvp` branch created locally.
- Phase 5 TODO file added under `docs/todos/`.
- Phase 5 React/Vite/Tailwind client scaffold implemented.
- Public iframe route `/embed/:postSlug` implemented.
- Immediate client-side quiz grading, feedback, result summary, retry, and static banner implemented.
- Frontend README commands documented.
- `feature/client-embed-mvp` pushed to origin.
- Draft PR opened: `https://github.com/monancho/proj01-quiz-widget/pull/2`.
- Phase 5 desktop and mobile iframe QA completed with headless Chrome CDP fallback.
- Phase 5 human checkpoint report added under `docs/human/reports/`.
- PR #1 merged into `develop`: `https://github.com/monancho/proj01-quiz-widget/pull/1`.
- PR #2 merged into `feature/server-api-mvp`: `https://github.com/monancho/proj01-quiz-widget/pull/2`.
- Direct Phase 5 draft PR opened against `develop`: `https://github.com/monancho/proj01-quiz-widget/pull/3`.
- PR #3 merged into `develop`.
- Local `develop` fast-forwarded to `origin/develop`.
- `feature/admin-mvp` branch created from updated `develop`.
- Phase 6 TODO file added under `docs/todos/`.
- Phase 6 admin API client added.
- Admin route `/admin` implemented.
- Admin Slug Group list, filters, stats, create/edit/delete, quiz table, quiz create/edit/delete, preview, and iframe copy fallback implemented.
- Phase 6 human checkpoint report added under `docs/human/reports/`.
- `feature/admin-mvp` pushed to origin.
- Draft PR opened: `https://github.com/monancho/proj01-quiz-widget/pull/4`.
- `feature/rendering-security` branch created for Phase 7 planning.
- Phase 7 TODO file added under `docs/todos/`.
- Phase 7 shared Markdown/LaTeX renderer implemented.
- Public iframe quiz question, choices, answer, and explanation now use safe rich text rendering.
- Admin quiz table and quiz preview now use the same safe rich text rendering.
- App routes lazy-load admin and embed pages to keep the initial bundle smaller.
- `feature/rendering-security` pushed to origin.
- Stacked draft PR opened: `https://github.com/monancho/proj01-quiz-widget/pull/5`.
- Pre-deployment admin UX TODO file added under `docs/todos/`.
- Added `draft` Slug Group status for incomplete groups.
- Quiz create/edit now opens in a modal.
- iframe preview and iframe code copy now open in modals.
- iframe preview and iframe code copy are now combined in one utility modal.
- Quiz create/edit modal now shows the current question as a finished widget-style preview with selectable feedback.
- Admin status summary/filter now uses 4 visible categories: total, preparing, public, private.
- Incomplete Slug Groups now show automatic readonly `준비중` status in the admin modal.
- Quiz reorder now uses a dedicated drag handle.
- iframe code textarea now copies the code on click/focus without showing a routine success banner.
- Public iframe embed background is transparent while admin preview remains visually framed.
- Quiz order is now creation-order based and can be changed by drag-and-drop.
- Added admin quiz reorder API.
- PR #4 merged into `develop`.
- PR #5 merged into `feature/admin-mvp`.
- Direct draft PR #6 opened into `develop`: `https://github.com/monancho/proj01-quiz-widget/pull/6`.
- Safety checkpoint tag pushed before design experiment: `checkpoint-before-design-theme-20260529`.
- Reverted unsupported compact functional UI experiment via `caec970` and `d4e13c1`.
- Added iframe utility modal theme selection only: `시스템`, `화이트`, `다크`.
- Public iframe route now supports `theme=light|dark|system` while preserving transparent iframe backgrounds.
- Added a left admin navigation rail with only one current item: `대시보드`.
- Changed the admin main area to stack status/filter/stats, Slug Groups, and Quizzes vertically.

## Phase 0 TODO

- [x] T0-01: Create project structure: `client`, `server`, `migrations`, `infra`.
- [x] T0-02: Draft root `README.md` with run commands and environment overview.
- [x] T0-03: Review and update `.gitignore` for Node, env files, SQLite files, and build outputs.

## Phase 1 TODO

- [x] T1-01: Create Express server base.
- [x] T1-02: Implement `GET /health`.
- [x] T1-03: Add environment variable loading and `.env.example`.
- [x] T1-04: Add SQLite connection helper.
- [x] T1-05: Add initial migration SQL for `quiz_sets` and `quizzes`.
- [x] T1-06: Add migration execution script exposed as `npm run db:migrate`.

## Verification TODO

- [x] Install backend dependencies.
- [x] Run migration script.
- [x] Start API server.
- [x] Verify `GET /health` returns `200`.
- [x] Run final `git status`.
- [x] Commit Phase 0 + Phase 1 implementation.

## Last Verification

- `npm.cmd install`: completed, 0 vulnerabilities.
- `npm.cmd run db:migrate`: applied `0001_init_quiz_sets_and_quizzes.sql`.
- `/health` smoke test: returned `200`.
- Implementation commit: `6a62601 phase0-1: scaffold backend foundation`.
- Agent guide commit: `45a44d2 docs: add agent operating guide`.
- Human docs restructure commit: `f5fb96f docs: separate human-facing reports`.
- Human docs category commit: `9d0ddda docs: categorize human documentation`.
- Phase TODO rule commit: `c5e79da docs: require phase todo before implementation`.
- Phase 2 implementation commit: `a78aa57 phase2: implement slug group api`.
- Push strategy commit: `9fa4daa docs: add push and pr strategy`.
- Human docs timing commit: `d6e17b2 docs: define human docs update timing`.
- Phase 3 TODO commit: `e194a8e docs: prepare phase 3 quiz api todo`.
- Phase 3 implementation commit: `ebef1cc phase3: implement admin quiz api`.
- Phase 4 TODO commit: `b79532a docs: prepare phase 4 public embed api todo`.
- Phase 4 implementation commit: `079b8a6 phase4: implement public embed api`.
- API MVP human report commit: included in `079b8a6 phase4: implement public embed api`.
- Human docs portal commit: `5c843af docs: expand human docs portal`.
- `npm.cmd run smoke:phase4`: passed.
- `npm.cmd run smoke:phase3`: passed.
- `npm.cmd run smoke:phase2`: passed.
- Note: Node 24 reports `node:sqlite` as experimental.
- Phase 5 TODO commit: `be405e3 docs: prepare phase 5 embed todo`.
- `npm.cmd install` in `client/`: completed, 0 vulnerabilities.
- `npm.cmd run build` in `client/`: passed.
- Verification API server on port `3100`: `/health` returned `200`.
- Verification Vite page: `/embed/phase-5-check-175528` returned `200`.
- Browser automation could not complete because the in-app browser node runtime failed to start in this sandbox.
- Headless Chrome CDP mobile QA: `innerWidth = 390`, `scrollWidth = 390`, `overflow = false`.
- Headless Chrome CDP interaction QA: incorrect feedback, answer display, next flow, result summary, and retry reset verified.
- Phase 6 TODO commit: `b0b72d9 docs: prepare phase 6 admin todo`.
- `npm.cmd run build` after Phase 6 implementation: passed.
- Admin QA created Slug Group `phase-6-admin-759869`, added 3 quizzes, published it, verified iframe preview URL, and verified iframe copy fallback.
- Admin QA updated quiz 1, deleted and recreated quiz 3, and verified final `3/3` state.
- Admin QA created and deleted a throwaway Slug Group.
- Phase 6 implementation commit: `cc82950 phase6: implement admin frontend mvp`.
- Draft PR #4: `https://github.com/monancho/proj01-quiz-widget/pull/4`.
- Phase 7 TODO commit: `c497ea1 docs: prepare phase 7 rendering security todo`.
- `npm.cmd install react-markdown remark-gfm remark-math rehype-katex katex`: completed with 0 vulnerabilities.
- `npm.cmd run build` after Phase 7 implementation: passed.
- Public iframe Phase 7 QA: Markdown and KaTeX rendered; quiz content had no script tags, no `onerror`, no `javascript:` URL, and no mobile horizontal overflow at 390px.
- Admin Phase 7 QA: quiz table rendered Markdown and KaTeX through the shared renderer and had no unsafe script/link content.
- Phase 7 implementation commit: `e83b86e phase7: add safe markdown math rendering`.
- Stacked draft PR #5: `https://github.com/monancho/proj01-quiz-widget/pull/5`.
- `npm.cmd run smoke:phase2`: passed after admin UX refinement.
- `npm.cmd run smoke:phase3`: passed after admin UX refinement, including reorder API coverage.
- `npm.cmd run smoke:phase4`: passed after admin UX refinement.
- `npm.cmd run build` after admin UX refinement: passed.
- Headless Chrome admin UX QA verified modal flows, iframe preview/code modals, drag reorder, and draft-only incomplete status behavior.
- Admin UX refinement commit: `2c384f6 admin: refine predeploy quiz management ux`.
- Direct draft PR #6: `https://github.com/monancho/proj01-quiz-widget/pull/6`.
- `npm.cmd run build` after unified iframe/widget preview follow-up: passed.
- Headless Chrome admin follow-up QA verified the combined iframe modal, iframe code textarea, live iframe preview, widget-style quiz preview, selectable feedback, and no horizontal overflow.
- Admin UX follow-up commit: `59c9695 admin: unify embed and widget previews`.
- `npm.cmd run build` after admin UX polish: passed.
- Headless Chrome admin UX polish QA verified 4 status categories, automatic readonly preparing state, handle drag reorder, click-to-copy iframe code, no copy success banner, and transparent public embed background.
- Admin UX polish commit: `1cfc53c admin: polish predeploy ux controls`.
- `npm.cmd run build` after reverting unsupported compact design and applying theme-only behavior: passed.
- Headless Chrome theme-only QA verified the original admin wireframe markers, no fake sidebar/notification UI, iframe modal theme options, `theme=dark` URL/code/clipboard behavior, light/dark/system embed rendering, no horizontal overflow, and transparent public embed backgrounds.
- `npm.cmd run build` after admin dashboard layout refinement: passed.
- Headless Chrome admin layout QA verified one `대시보드` nav item, vertical status/Slug Groups/Quizzes stacking, Slug Group selection, 3-row quiz table rendering, iframe utility modal behavior, public embed rendering, and no horizontal overflow.
- Headless Chrome wide viewport QA verified the 224px left sidebar and main dashboard column render side by side without horizontal overflow.

## Remote Sync Status

- `develop` is pushed to `origin/develop`.
- `feature/server-api-mvp` is pushed and tracks `origin/feature/server-api-mvp`.
- PR #1 is merged into `origin/develop`.
- `feature/client-embed-mvp` is pushed and tracks `origin/feature/client-embed-mvp`.
- PR #2 is merged into `origin/feature/server-api-mvp`.
- PR #3 is merged into `origin/develop`.
- `feature/admin-mvp` is pushed and tracks `origin/feature/admin-mvp`.
- PR #4 is merged into `origin/develop`: `https://github.com/monancho/proj01-quiz-widget/pull/4`.
- `feature/rendering-security` is pushed and tracks `origin/feature/rendering-security`.
- PR #5 is merged into `origin/feature/admin-mvp`: `https://github.com/monancho/proj01-quiz-widget/pull/5`.
- Direct draft PR #6 targets `develop`: `https://github.com/monancho/proj01-quiz-widget/pull/6`.
- `feature/rendering-security` contains the verified revert/theme-only follow-up for PR #6.

## Next

- Review and merge PR #6 into `develop`.
- After PR #6 merge, fast-forward local `develop` from `origin/develop`.
- Prepare Phase 8 TODO before Docker/deployment work.
