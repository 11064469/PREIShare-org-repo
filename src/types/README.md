# Shared TypeScript Types

This folder is the shared home for PREIshare investor-listing TypeScript types. [docs/domain/investor-listing-domain-brief.md](../../docs/domain/investor-listing-domain-brief.md) is the source of truth for PREIshare investor-listing business vocabulary and field rules.

From the project root, run:

```bash
npm run typecheck
```

A successful run means TypeScript found no errors in the valid project sources. `src/fixtures/invalid-listings.errors.ts` is intentionally excluded from this normal check because it contains examples that are supposed to fail. Those expected failures are documented in [docs/type-safety/expected-type-errors.md](../../docs/type-safety/expected-type-errors.md); the invalid file is not a valid fixture.
