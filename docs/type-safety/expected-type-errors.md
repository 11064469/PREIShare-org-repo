# Expected type errors for invalid investor listings

| id | business problem | rule that should catch it | expected TS kind |
|----|------------------|---------------------------|------------------|
| invalidStatusSpelling | status typo would break filters | ListingStatus string union | invalid string literal |
| missingAddressCity | city required for display/maps | Address required fields | missing property |
| priceAsString | money must be numeric for math | FinancialSummary.askingPrice: number | type not assignable |

- `src/fixtures/invalid-listings.errors.ts` is supposed to fail typechecking.
- Do not "fix" those errors; update this table if cases are added or removed.
- Happy-path samples live in `src/fixtures/sample-investor-listings.ts` and must stay valid.
