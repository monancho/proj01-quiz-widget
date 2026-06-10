# Disable Iframe Banner TODO

## Source Docs

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/worklog/2026-05-30.md`
- `client/src/pages/EmbedQuizPage.jsx`
- `client/.env.example`
- `docs/deployment/cloudflare-pages.md`
- `docs/deployment/ko-deployment-guide.md`

## Goal

Hide the optional static banner from the public iframe widget for now.

## Scope

- Stop rendering the static banner in the public iframe route.
- Update client environment examples so banner variables are not configured by default.
- Update deployment docs so Cloudflare Pages does not instruct banner setup for the current deploy.
- Keep existing quiz behavior, theme modes, iframe transparency, and admin flows unchanged.

## Out of Scope

- Removing the old `StaticBanner` component file.
- Adding a new banner toggle or admin setting.
- Changing quiz APIs or database schema.

## Implementation Checklist

- [x] Remove banner rendering from `EmbedQuizPage`.
- [x] Remove default banner env values from `client/.env.example`.
- [x] Update deployment docs to say the banner is currently disabled.
- [ ] Update project status and worklog.

## Verification Checklist

- [x] `npm.cmd run build` passes in `client/`.
- [x] Static search confirms `StaticBanner` is not rendered by `EmbedQuizPage`.
- [x] `git status` checked before commit.

## Handoff Notes

- The existing `StaticBanner` component can be reused later if the banner decision changes.
- For the current deployment, Cloudflare Pages does not need `VITE_BANNER_*` variables.
