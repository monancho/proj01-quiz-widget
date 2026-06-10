# Admin Dashboard Layout TODO

## Source Documents

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/worklog/2026-05-29.md`
- User request on 2026-05-29: stack status, Slug Groups, and Quizzes vertically, and add a left navigation bar with only Dashboard for future expansion.

## Branch

- Current branch: `feature/rendering-security`
- PR: `https://github.com/monancho/proj01-quiz-widget/pull/6`

## Scope

Adjust the admin page layout only. Keep existing admin features and modal behavior intact.

## Out of Scope

- Do not add unsupported navigation destinations.
- Do not add dashboard analytics, settings, notifications, account controls, or content-management features.
- Do not change public iframe quiz behavior except through existing verified code.

## Implementation Checklist

- [x] Add a left admin navigation rail with only one active item: Dashboard.
- [x] Move existing admin content into a main dashboard area.
- [x] Stack status/filter/stats, Slug Groups, and Quizzes vertically.
- [x] Preserve existing Slug Group selection, quiz table, modals, iframe utility modal, and drag reorder behavior.
- [x] Keep mobile layout usable by collapsing the sidebar into the top flow.

## Verification Checklist

- [x] Run client build.
- [x] Verify admin page renders with one Dashboard nav item.
- [x] Verify status/filter/stats, Slug Groups, and Quizzes are vertically stacked.
- [x] Verify Slug Group selection still loads quizzes.
- [x] Verify iframe utility modal still opens.
- [x] Verify public embed route still renders.
- [x] Update `docs/00-project-status.md`.
- [x] Update latest worklog.

## Verification Result

- `npm.cmd run build` in `client/`: passed.
- Headless Chrome QA verified exactly one sidebar nav item: `대시보드`.
- Headless Chrome QA verified status/filter/stats, Slug Groups, and Quizzes are vertically stacked.
- Headless Chrome QA verified Slug Group selection still renders the 3-row quiz table.
- Headless Chrome QA verified the iframe utility modal still opens with theme controls.
- Headless Chrome QA verified the public embed route still renders without horizontal overflow.
- Headless Chrome wide viewport QA verified the 224px left sidebar and main dashboard column render side by side without horizontal overflow.

## Handoff Notes

- The sidebar is an intentional layout foundation for future expansion, not a signal that other pages exist today.
- Keep labels and UI modest so the current MVP scope remains honest.
