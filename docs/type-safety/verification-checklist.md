# Investor Listing Type-Safety Verification Checklist

Use this checklist to review the documented domain, each public type, and both valid and intentionally invalid fixtures. A checked item records a verified fact; an unchecked item marks an unresolved mismatch, not permission to redesign the model silently.

## Domain and Model Alignment

- [x] Reviewed `docs/domain/investor-listing-domain-brief.md` for the listing business rules.
- [x] Reviewed `docs/domain/listing-field-inventory.md` for the documented fields and groups.
- [ ] Confirm `InvestorListing` matches the intended domain shape. **Unresolved drift:** the domain documents lifecycle values `draft`, `published`, `under_offer`, `sold`, and `archived`, while `ListingStatus` and the discriminated listing use `draft`, `active`, `under_contract`, `closed`, and `archived`. The domain requires asking price and currency in Financial Summary, while `financialSummary` and its `askingPrice` are optional in the current types, and there is no currency field. Reconcile with the domain owner before changing either contract.

## Type Definitions

- [x] Checked `InvestorListing` fields, nested relationships, and status branches in `src/types/investor-listing.ts`.
- [x] Checked the current `ListingStatus` literals in `src/types/listing-status.ts`: `draft`, `active`, `under_contract`, `closed`, `archived`. Compare these against the unresolved domain mismatch above.
- [x] Checked the current `PropertyType` literals in `src/types/property-type.ts`: `single_family`, `multi_family`, `commercial`, `land`.
- [x] Checked that `status` discriminates the non-closed and closed listing branches.
- [x] Checked that a `closed` listing requires `closedAt`.
- [x] Checked that non-closed listings do not allow a real `closedAt` value; `exactOptionalPropertyTypes` is enabled in `tsconfig.json`.
- [x] Checked that `id`, `createdAt`, and `updatedAt` are readonly in `InvestorListingBase`.
- [x] Checked the nested `Address` fields in `src/types/address.ts`: `street`, `city`, `region`, `postalCode`, and `country` are required.
- [x] Checked the nested `FinancialSummary` fields in `src/types/financial-summary.ts`: `noi`, `capRate`, and `occupancyRate` are required; `askingPrice` is optional. No currency field exists in this type; see the domain mismatch above.
- [x] Checked `contacts` is an `InvestorContact[]` and reviewed its shape in `src/types/investor-contact.ts`.
- [x] Checked that `primaryContactId` is documented as referring to an `InvestorContact.id`; TypeScript does not enforce membership in the contacts array.
- [x] Checked the nested `Ownership` relationship and fields in `src/types/ownership.ts`.
- [x] Checked that `src/types/index.ts` re-exports the public listing and related types.

## Fixture Verification

- [x] Checked that `src/fixtures/sample-investor-listings.ts` covers `active`, `draft`, `under_contract`, and `closed` statuses.
- [x] Checked valid fixtures use values from the current `ListingStatus` and `PropertyType` unions.
- [x] Checked the three intentional invalid cases correspond to `docs/type-safety/expected-type-errors.md`.
- [x] Confirmed invalid status `"availble"` is rejected with TS2322.
- [x] Confirmed omitting `Address.city` is rejected with TS2741.
- [x] Confirmed string `askingPrice` is rejected with TS2322.
- [x] Confirmed the explicit negative check produced only these three errors and no unrelated diagnostics.

## Normal Typecheck Isolation

- [x] Checked `tsconfig.json` excludes only `src/fixtures/invalid-listings.errors.ts`; strict compiler options remain enabled.
- [x] Ran `npm run typecheck`; it completed successfully for the normal project sources.
- [x] Confirmed the intentional invalid fixture remains invalid and separately documented; its errors are not suppressed with `@ts-ignore` or `@ts-expect-error`.
