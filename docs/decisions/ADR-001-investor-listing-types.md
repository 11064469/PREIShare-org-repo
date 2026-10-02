# ADR-001: Investor listing TypeScript types (PREIshare)

## Status

- **Status:** Accepted (Sprint 2, Topic 1)
- **Date:** 2026-10-01
- **Owners:** PREIshare types working group (learner + coach)
- **Related code:** `src/types/index.ts` (barrel export for the types package)

## Context

PREIshare needs one reliable compile-time contract for investor-listing data so fixtures and later application layers do not invent different shapes. The shared types describe identity, listing status, property type, address, financial information, contacts, and ownership consistently.

Strict TypeScript checking and typed fixtures were used to test this model. Happy-path samples are explicitly typed as `InvestorListing`, and separate intentional invalid fixtures show cases TypeScript should reject. These checks provide compile-time feedback; they are not runtime validation.

## Decision

The current implemented model uses `InvestorListingBase` for fields shared by every listing and combines it with a status-discriminated `InvestorListing` union. The `status` field selects which listing shape is valid. `ListingStatus` currently contains exactly `draft`, `active`, `under_contract`, `closed`, and `archived`.

A `closed` listing requires `closedAt: string`. A non-closed listing cannot carry a real `closedAt` value. The shared base marks `id`, `createdAt`, and `updatedAt` readonly; normal business fields remain changeable.

`PropertyType` is a named string union with exactly these currently allowed values: `single_family`, `multi_family`, `commercial`, and `land`.

Nested data uses named contracts:

- `Address` is required and contains required `street`, `city`, `region`, `postalCode`, and `country` strings.
- `FinancialSummary` contains required numeric `noi`, `capRate`, and `occupancyRate`, plus optional numeric `askingPrice`. On `InvestorListingBase`, `financialSummary` itself is optional.
- `InvestorContact` is a named type, and `contacts` is a required `InvestorContact[]`. Each contact requires `id`, `fullName`, `role`, and `email`; `phone` is optional.
- `primaryContactId` is a required string reference intended to match an `InvestorContact.id`. TypeScript alone does **not** guarantee that the referenced id exists in the `contacts` array.
- `Ownership` is a named nested contract and is required on `InvestorListing`. It requires `ownerName`; `notes` and `ownershipPercent` are optional.

`src/types/index.ts` is the public barrel for these types. No runtime validation is claimed or implemented by these type definitions.

## Type choices mapped to business rules

| Business rule (plain language) | Type choice | Why this shape |
| --- | --- | --- |
| Each listing has identity and audit dates that should not be reassigned through the shared listing type. | `InvestorListingBase` defines readonly `id`, `createdAt`, and `updatedAt`. | Keeps those typed fields stable while title, contacts, ownership, and financial data remain ordinary mutable business fields. This is compile-time intent, not runtime immutability. |
| A listing must use a recognized lifecycle status. | `ListingStatus` is a named string union; `status` discriminates the listing branches. | Prevents misspelled or unrecognized status literals in typed code. |
| Closed listings have a closure timestamp; non-closed listings do not carry a real one. | The `closed` branch requires `closedAt: string`; the other branch permits only an omitted or undefined `closedAt`. | Makes the closure difference visible to TypeScript when code handles each status. |
| Property type must use one of the supported categories. | `PropertyType` is a named string union: `single_family`, `multi_family`, `commercial`, or `land`. | Prevents unsupported or inconsistently spelled values in typed code. |
| A listing needs its address as a complete structured group. | Required named `Address` with required `street`, `city`, `region`, `postalCode`, and `country`. | Avoids representing the address as an unstructured value and catches missing required fields. |
| Financial data follows one shared nested shape. | Optional `financialSummary` uses `FinancialSummary`; `noi`, `capRate`, and `occupancyRate` are required when present, while `askingPrice` is optional. | Keeps financial values together and rejects a string asking price when one is supplied as a number field. |
| Listings can refer to one or more contact records. | Required `contacts: InvestorContact[]`, using the named `InvestorContact` contract. | Reuses one contact shape and checks each provided contact's required fields. The array may still be empty. |
| A primary contact reference has a consistent representation. | Required `primaryContactId: string`. | Ensures the reference is text, but does not prove that the id exists in `contacts`. |
| Ownership information stays grouped and consistent. | Required named `Ownership` contract with required `ownerName` and optional `notes` and `ownershipPercent`. | Keeps ownership details together instead of mixing those fields into the listing's top level. |

Intentional invalid fixtures demonstrate three compile-time protections before JavaScript runs: the status typo `"availble"` is rejected, a missing `Address.city` is rejected, and a string `askingPrice` is rejected where the current field expects a number. Valid fixtures are typed separately. The normal `npm run typecheck` command checks valid project sources; the intentional invalid fixture is excluded from that normal check and its expected errors are documented separately.

## Alternatives considered

1. **Free strings, `any`, or untyped JSON:** These approaches would allow unknown status/property values or shapes that do not match the listing contract, reducing useful compile-time feedback.
2. **One flat interface with many optional fields:** That would make it easier to represent combinations that do not match the current lifecycle rule. The status-discriminated shape makes the closed-listing requirement explicit.
3. **Enums instead of string unions:** The current string unions express the finite status and property choices directly as ordinary string values. No enum is needed for the implemented contract.
4. **Runtime schema libraries:** These could validate untrusted data at runtime, but they are not part of this Sprint 2 Topic 1 type-model decision. Compile-time types alone do not validate runtime input.

## Consequences

Positive consequences:

- Listing shapes are consistent across typed code and fixtures.
- The compiler provides feedback for invalid status/property literals and missing or incorrectly typed nested fields.
- Named contracts can be reused by future application layers.
- The valid sample fixtures provide typed examples across multiple statuses.
- `src/types/index.ts` gives consumers stable public imports.

Limitations:

- TypeScript checks at compile time; it does not validate untrusted runtime data by itself.
- `primaryContactId` is not checked for membership in `contacts`, and the current array type permits an empty list.
- Runtime/API/database validation is separate work.

## Out of scope for Sprint 2 Topic 1

This decision does not implement:

- Database schema or migrations.
- Supabase row types or integration.
- API routes or runtime request validation.
- React forms or client-side form validation.
- Authentication or authorization.
- Production persistence.
- pgvector or search work not already represented by the model.

## Follow-ups (for the next topic / implementers)

Do not resolve the following differences in this ADR. They require a future product/domain decision and documentation reconciliation.

**Status vocabulary drift:** The older domain documentation lists `draft`, `published`, `under_offer`, `sold`, and `archived`. The current implemented `ListingStatus` lists `draft`, `active`, `under_contract`, `closed`, and `archived`. This ADR records the implementation as it exists; it does not choose which vocabulary is correct.

**Financial Summary drift:** The older domain documentation describes asking price and currency as part of Financial Summary. The current implementation makes `financialSummary` optional, makes `askingPrice` optional, and has no currency field. The current `FinancialSummary` also requires `noi`, `capRate`, and `occupancyRate`. Reconcile these requirements in a future step; this ADR does not resolve the difference.

Other differences to review with the product/domain owner:

- The older domain documents describe a complete address but do not name its parts; the current `Address` requires five named fields.
- The older documents do not define the property-type vocabulary; the current `InvestorListing` requires one of the four `PropertyType` values listed above.
- The domain requires at least one investor contact, but the current `InvestorContact[]` type permits an empty array. The current type also cannot prove that `primaryContactId` refers to an existing contact.
- The older documents leave ownership fields and group requiredness unresolved; the current model requires `ownership` and defines its named fields.

For future implementation and verification, see:

- `src/types/index.ts`
- `src/fixtures/sample-investor-listings.ts`
- `docs/type-safety/verification-checklist.md`
- `docs/type-safety/expected-type-errors.md`

## Evidence links

- [Investor listing domain brief](../domain/investor-listing-domain-brief.md)
- [Listing field inventory](../domain/listing-field-inventory.md)
- [Expected type errors](../type-safety/expected-type-errors.md)
- [Type-safety verification checklist](../type-safety/verification-checklist.md)
- [Public types barrel](../../src/types/index.ts)
- [Investor listing model](../../src/types/investor-listing.ts)
- [Listing status values](../../src/types/listing-status.ts)
- [Property type values](../../src/types/property-type.ts)
- [Address type](../../src/types/address.ts)
- [Financial summary type](../../src/types/financial-summary.ts)
- [Investor contact type](../../src/types/investor-contact.ts)
- [Ownership type](../../src/types/ownership.ts)
- [Sample investor listings](../../src/fixtures/sample-investor-listings.ts)
