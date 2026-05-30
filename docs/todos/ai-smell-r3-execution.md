# AI Smell R3 Execution TODO

## Goal

Apply the first low-risk remediation from the AI-smell review.

## Scope

- Extract Markdown authoring continuation logic from `AdminQuizManagerPage.jsx`.
- Import the helper from a small utility module.
- Preserve current textarea behavior.

## Out of Scope

- CSS splitting.
- Admin page component decomposition beyond the helper.
- Documentation compaction.
- Mojibake cleanup.
- Product behavior changes.

## Checklist

- [x] Create `client/src/utils/markdownAuthoring.js`.
- [x] Move `getMarkdownContinuation` into the utility.
- [x] Import the helper in `AdminQuizManagerPage.jsx`.
- [x] Remove the inline helper from the page component.
- [x] Keep caret behavior unchanged.

## Implementation Notes

- The extraction is behavior-preserving.
- The page component still owns the event handler because it needs React state updates and caret restoration.
- The pure parsing helper is now isolated and can be checked without browser automation.

## Handoff

Proceed to R4 verification after implementation.
