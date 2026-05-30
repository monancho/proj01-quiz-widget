# Embed Theme Only TODO

## Source Documents

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/worklog/2026-05-29.md`
- User correction on 2026-05-29: preserve the existing wireframe and only apply theme behavior.

## Branch

- Current branch: `feature/rendering-security`
- Reverted commits: `bf359fb`, `4297f2d`
- Safety checkpoint tag: `checkpoint-before-design-theme-20260529`
- PR: `https://github.com/monancho/proj01-quiz-widget/pull/6`

## Scope

Restore the existing admin wireframe and add only the iframe theme selection behavior.

## Implementation Checklist

- [x] Revert the compact design/sidebar/theme polish that changed the existing wireframe.
- [x] Keep the original admin layout and controls.
- [x] Add `시스템`, `화이트`, and `다크` theme options only inside the iframe utility modal.
- [x] Apply selected theme to the iframe preview URL.
- [x] Apply selected theme to generated/copied iframe code.
- [x] Support `theme=light|dark|system` in the public embed page.
- [x] Keep iframe shell background transparent.

## Verification Checklist

- [x] Run client build.
- [x] Verify admin wireframe does not contain fake sidebar/nav/notification features.
- [x] Verify iframe modal theme option changes preview URL and iframe code.
- [x] Verify copied iframe code includes selected theme.
- [x] Verify public embed light/dark/system themes render without overflow.
- [x] Update `docs/00-project-status.md`.
- [x] Update latest worklog.

## Verification Result

- `npm.cmd run build` in `client/`: passed.
- Headless Chrome QA verified the original admin wireframe markers and confirmed no unsupported fake sidebar or notification UI exists.
- Headless Chrome QA verified the iframe utility modal theme options: `시스템`, `화이트`, `다크`.
- Headless Chrome QA verified `theme=dark` is applied to preview URL, iframe preview `src`, generated iframe code, and clipboard text.
- Headless Chrome QA verified `theme=light`, `theme=dark`, and `theme=system` public embed pages render without horizontal overflow.
- Headless Chrome QA verified public embed `html`, `body`, and `.embed-shell` backgrounds remain transparent.

## Handoff Notes

- Do not add UI that implies unsupported features.
- Design references are only visual inspiration; they must not change product information architecture.
