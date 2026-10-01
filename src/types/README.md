# Shared TypeScript Types

This folder is the shared home for PREIshare investor-listing TypeScript types. [docs/domain/investor-listing-domain-brief.md](../../docs/domain/investor-listing-domain-brief.md) is the source of truth for PREIshare investor-listing business vocabulary and field rules.

Shared investor-listing types help TypeScript catch bad or incomplete listing data at compile time, before users see it. They can catch missing required fields, a missing price, inconsistent or invalid status values, and missing address information. Strict mode in `tsconfig.json` makes TypeScript refuse incomplete or loosely typed listing data instead of silently accepting it.

Run this command to check the TypeScript contracts without producing application files:

```bash
npm run typecheck
```
