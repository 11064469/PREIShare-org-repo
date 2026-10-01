# PREIshare Investor Listing Field Inventory

## Scope

This inventory treats an “investor listing” as one investor-facing investment opportunity from the current Deals area. The project calls these records deals or investment opportunities; it does not define a separate listing entity. That mapping is an assumption to confirm before implementation. Portfolio holdings and investor profile fields are separate concepts and are not included as listing fields.

## Listing Fields

| Field name | Investor-friendly meaning | Expected data shape/type concept | Required or optional | Allowed/restricted values | Relevant business rule | Placement |
| --- | --- | --- | --- | --- | --- | --- |
| `name` | Name of the opportunity, such as “Oakridge Multifamily” | Text string | Required | No fixed list documented | Present on each current `OpenDeal`; no length or uniqueness rule is documented. | Directly on the listing |
| `locationOrAssetClass` | The place or asset class associated with the opportunity | Text string in the current model; future tagged choice is an assumption | Required | Examples include `Austin, TX`, `Denver, CO`, and `Industrial`; no complete allowed vocabulary is documented. | Current data combines two meanings in one value. A future model may distinguish location from asset class, but the allowed values and detailed shape need product agreement. | Directly on the listing today; potentially a nested/discriminated location-or-class concept later |
| `status` | Current availability label shown for the opportunity | Restricted text value; eventual union/enum concept | Required | `Open`, `Closing Soon`, `Waitlist` | Reject other values. These are display states; transition and action rules are not documented. | Directly on the listing |
| `targetRaise` | The opportunity's target raise, when that is the displayed investment term | Formatted monetary string today; future structured amount/currency concept is an assumption | Conditionally required | Sample: `$2.4M`; currency, precision, and numeric range are not defined. | Exactly one of `targetRaise` and `minimumInvestment` must be present. Do not allow both or neither. | Directly on the current `OpenDeal`; could be a variant inside a nested `InvestmentTerms` concept |
| `minimumInvestment` | The minimum investment, when that is the displayed investment term | Formatted monetary string today; future structured amount/currency concept is an assumption | Conditionally required | Samples: `$10,000`, `$5,000`; currency, precision, and numeric range are not defined. | Exactly one of `minimumInvestment` and `targetRaise` must be present. Do not allow both or neither. | Directly on the current `OpenDeal`; could be a variant inside a nested `InvestmentTerms` concept |

**Optional listing fields:** None are specified in the current opportunity model or reviewed project documents. Do not infer descriptions, images, addresses, dates, returns, fees, or other financial details from this inventory.

## Collection

| Collection name/concept | Investor-friendly meaning | Expected data shape/type concept | Required or optional | Allowed/restricted values | Relevant business rule | Placement |
| --- | --- | --- | --- | --- | --- | --- |
| Open investor listings/deals | Opportunities shown together in the Deals area | Array of listing records; current source calls it `MOCK_OPEN_DEALS` (`OpenDeal[]`) | The Deals component accepts an optional `deals` array and defaults to sample data; an empty array is supported. | Each item follows the required fields and exclusive investment-term choice above. | The current Deals view renders an empty state when the collection has no items. No database storage or persistence is defined. | Collection containing listings; not a field on an individual listing |

## Related Concepts, Not Listing Fields

- **Portfolio holding:** Current `PortfolioTable` records have `property`, `type`, `investedAmount`, `currentValue`, and `status`. They represent holdings, not deal opportunities. No restricted value set is specified for the holding `type` or `status` in the current model.
- **Portfolio summary item:** `PortfolioSummary` displays `name`, `allocation`, and `value` for summary rows. These are separate mock summary entries, not opportunity fields.
- **Investor profile:** `ProfileCard` displays `displayName`, `email`, `membershipTier`, `preferredContact`, and `notes`. These describe a sample investor profile, not a listing.

## Type-Planning Notes and Assumptions

- A listing-level status union should match the three existing deal labels. Do not reuse holding `status` as if it had the same allowed values; that field is currently an unrestricted string with different examples (`Active`, `Fully funded`).
- The exclusive pair `targetRaise` / `minimumInvestment` is already enforced structurally by the current `OpenDeal` type. A nested `InvestmentTerms` type could make this business concept clearer later, while preserving the exactly-one rule.
- `locationOrAssetClass` needs a product decision before it can be safely narrowed beyond a string. The examples suggest two categories, but the project does not enumerate valid places or asset classes.
- Dollar-prefixed sample strings suggest currency-formatted display values, but they do not define a canonical currency, numeric amount shape, rounding, or validation behavior.
- No stable listing identifier is specified. The current UI uses the deal name as its React key; whether a durable ID is needed is an open domain decision, not a field assumed here.
- TypeScript can reject missing fields, unknown status literals, and invalid combinations of the two investment-term alternatives. It cannot by itself verify that a monetary string parses, is positive, or follows a currency policy; those constraints require explicit rules and suitable runtime validation.

## Project Sources

- [DealsList](../../src/components/dashboard/DealsList.tsx) defines the current `OpenDeal`, status values, sample opportunity values, and empty state.
- [PortfolioTable](../../src/components/dashboard/PortfolioTable.tsx), [PortfolioSummary](../../src/components/dashboard/PortfolioSummary.tsx), and [ProfileCard](../../src/components/dashboard/ProfileCard.tsx) show adjacent but distinct concepts.
- [Investor dashboard brief](../investor-dashboard-brief.md), [dashboard information architecture](../dashboard-ia.md), and [component plan](../component-plan.md) define current business scope and component responsibilities.
