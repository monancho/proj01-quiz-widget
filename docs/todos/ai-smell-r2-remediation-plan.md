# AI Smell R2 Remediation Plan TODO

## Goal

Convert the smell inventory into safe staged remediation tasks.

## Checklist

- [x] Pick a first low-risk execution target.
- [x] Keep broad CSS restructuring out of the first execution pass.
- [x] Keep documentation compaction out of the first execution pass.
- [x] Preserve product behavior and PR #6 scope.
- [x] Define verification for the first execution target.

## Decisions

- Fix now: extract Markdown authoring continuation logic from `AdminQuizManagerPage.jsx`.
- Fix later: split `styles.css` by responsibility.
- Fix later: compact project status/worklog model.
- Fix later: mojibake cleanup in docs and any remaining UI strings.
- Keep for now: admin/human-doc cards and badges where they serve scannability.

## First Execution Target

Extract `getMarkdownContinuation` into `client/src/utils/markdownAuthoring.js`.

Expected benefits:

- Reduces oversized page component smell.
- Makes Markdown authoring behavior isolated and testable.
- Does not change backend, database, routes, or quiz behavior.

## Verification

- Build the client.
- Run a small helper-level check for unordered, ordered, quote, and plain Enter behavior.
- Confirm working tree state and update docs.
