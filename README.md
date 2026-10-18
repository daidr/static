# static

Sponsor images are generated with SponsorKit and pnpm 10.4.1.

SponsorKit 16.5.0 is pinned and patched in `patches/` to discover Patreon
campaigns through API v2. Patreon retired the old API v1 endpoint on
[October 7, 2026](https://docs.patreon.com/#2026-08-07-public-api-v1-retiring-october-7-2026).
Keep the patch until an upstream release replaces that endpoint.

Run `pnpm install --frozen-lockfile` and `pnpm test` for the offline regression
test. The Scheduler workflow can be dispatched manually on a repair branch
to validate the full build with the existing repository secrets; it commits
generated sponsor files to that branch.
