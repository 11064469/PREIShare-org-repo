# Sprint 2 Topic 1 — Investor Listing Types Handoff

## Client story recap

PREIshare had real production problems with investor-listing data: missing prices, status strings spelled several different ways, and nested address fields that disappeared on some screens. The TypeScript work in this topic was designed to stop those broken shapes from being created in the first place. A strict `InvestorListing` model catches those invalid shapes at compile time before JavaScript runs and before users see them. This does not provide runtime validation; it is a compile-time safety check for the current project. The rationale and current implementation record live in [docs/decisions/ADR-001-investor-listing-types.md](../decisions/ADR-001-investor-listing-types.md).

## What we shipped this topic

This topic produced a shared set of domain types and verification artifacts:

- [src/types/index.ts](../../src/types/index.ts) is the public entry point for the listing domain types and currently re-exports `InvestorListing`, `InvestorListingBase`, `ClosedInvestorListing`, `OpenInvestorListing`, `InvestorContact`, `Ownership`, `Address`, `FinancialSummary`, `ListingStatus`, and `PropertyType`.
- The current `InvestorListing` model is a status-discriminated union built from `InvestorListingBase` and uses the current union values in [src/types/listing-status.ts](../../src/types/listing-status.ts): `draft`, `active`, `under_contract`, `closed`, and `archived`.
- Named nested contracts are in place for the current implementation: `Address`, `FinancialSummary`, `InvestorContact`, and `Ownership` are defined in [src/types/address.ts](../../src/types/address.ts), [src/types/financial-summary.ts](../../src/types/financial-summary.ts), [src/types/investor-contact.ts](../../src/types/investor-contact.ts), and [src/types/ownership.ts](../../src/types/ownership.ts).
- Valid sample fixtures in [src/fixtures/sample-investor-listings.ts](../../src/fixtures/sample-investor-listings.ts) show realistic listings that satisfy the current model for `active`, `draft`, `under_contract`, and `closed` statuses.
- Intentionally invalid fixtures live in [src/fixtures/invalid-listings.errors.ts](../../src/fixtures/invalid-listings.errors.ts), and their expected failures are recorded in [docs/type-safety/expected-type-errors.md](../type-safety/expected-type-errors.md).
- The verification record for what was checked and what remains unresolved is in [docs/type-safety/verification-checklist.md](../type-safety/verification-checklist.md).
- The current implementation decision is recorded in [docs/decisions/ADR-001-investor-listing-types.md](../decisions/ADR-001-investor-listing-types.md).
- The normal project typecheck command is defined in [package.json](../../package.json): `npm run typecheck` runs `tsc --noEmit`.

The current model is intentionally strict and explicit:

- `Address` requires `street`, `city`, `region`, `postalCode`, and `country`.
- `FinancialSummary` requires `noi`, `capRate`, and `occupancyRate`; `askingPrice` is optional and numeric when present. `financialSummary` is optional on `InvestorListingBase`.
- `InvestorContact` requires `id`, `fullName`, `role`, and `email`; `phone` is optional.
- `Ownership` requires `ownerName`; `notes` and `ownershipPercent` are optional.
- `PropertyType` currently allows exactly `single_family`, `multi_family`, `commercial`, and `land`.
- `closed` requires `closedAt: string`, while non-closed branches do not carry a real `closedAt` value.

The normal valid-source typecheck passes, while the intentional invalid fixture is isolated and used to demonstrate expected compiler failures rather than hidden with `@ts-ignore` or type assertions.

## What we must not claim is done

This topic did not complete the full investor listing feature. It did not implement:

- TanStack Start listing forms
- runtime form validation
- Supabase/PostgreSQL schema or migrations
- database persistence
- API routes or runtime API validation
- authentication or authorization
- production integration

TypeScript compile-time checks are not a substitute for runtime validation of untrusted input. The unresolved differences already recorded in the ADR remain unresolved rather than being silently fixed.

## Next sprint pickups

These are separate concerns to design and implement later.

### TanStack Start forms

Forms should import and consume the shared types from [src/types/index.ts](../../src/types/index.ts) rather than inventing another `InvestorListing` shape. Form behavior and runtime validation should be designed separately from the compile-time model.

### Supabase/PostgreSQL schema alignment

The future database implementation should mirror columns and constraints from [src/types/index.ts](../../src/types/index.ts), avoid independently redefining the `InvestorListing` shape, and document any difference between TypeScript optional fields and PostgreSQL `NULL`/`NOT NULL` behavior. Those optional-vs-NULL differences should be recorded in a follow-up ADR. No Supabase schema or migrations are implied to exist yet.

### API boundaries

Request and response contracts and runtime validation should be designed at API boundaries while reusing the shared domain vocabulary from [src/types/index.ts](../../src/types/index.ts). TypeScript alone does not validate network or database input at runtime.

The unresolved status vocabulary, financial-summary differences, contact-count rule, ownership requiredness, and `primaryContactId` membership limitation documented in the ADR should be reviewed before later layers depend on them.

## Prompting and review self-assessment

I found the most helpful prompting pattern was to provide the agent with exact source paths and domain context before asking it to make changes. That prevented invented fields and statuses and kept the work anchored to the actual repo. I also found it helpful to ask for one focused artifact at a time so changes were easier to review and unrelated files were less likely to drift.

I checked generated documentation against the actual TypeScript unions, required and optional fields, fixtures, and verification results instead of assuming the agent's output was correct. I would identify documentation/type drift earlier next time so the current implemented vocabulary is clear from the start and the agent does not need to reverse that mismatch later.

## Final review

Before finishing, I verified that:

1. The current status values match the repo: `draft`, `active`, `under_contract`, `closed`, and `archived`.
2. The current property-type values match the repo: `single_family`, `multi_family`, `commercial`, and `land`.
3. The document does not claim forms, database, API, authentication, or runtime validation are complete.
4. TanStack Start forms, Supabase/PostgreSQL schema alignment, and API boundaries are treated as separate next-work items.
5. Each next-work item explains how it should consume [src/types/index.ts](../../src/types/index.ts) rather than redefine `InvestorListing`.
6. Existing ADR follow-ups remain unresolved rather than being silently fixed.
7. Only this handoff document was created; no existing files were modified.
