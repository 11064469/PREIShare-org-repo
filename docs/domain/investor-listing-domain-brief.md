# PREIshare Investor Listing Domain Brief

## Purpose and Scope

The current PREIshare documentation describes mock investment opportunities in the Deals area, not a separately specified entity named “investor listing.” For this planning brief, **investor listing** means one investment opportunity shown to an investor through `DealsList`. This mapping is an assumption based on the current product context; it should be confirmed before implementation.

A listing is distinct from a portfolio holding, which represents an investment already shown in `PortfolioTable`, and from the investor profile shown in `ProfileCard`. The existing examples are mock data. This brief does not define a live listing workflow, backend record, investor-authored listing, or transaction.

## Supported Business Concepts and Rules

- **Opportunity identity:** Each current deal opportunity has a `name` and a `locationOrAssetClass` display value.
- **Location or asset class:** The examples use either a place (`Austin, TX`, `Denver, CO`) or an asset class (`Industrial`). The current model stores either as one string; the project does not define a complete asset-class list or a structured location format.
- **Availability label:** The current status values are `Open`, `Closing Soon`, and `Waitlist`. They should be restricted values rather than arbitrary strings. The project defines these display labels but does not specify status-transition rules or what actions each status permits.
- **Investment terms:** Each current opportunity supplies a target raise or a minimum investment. The existing `OpenDeal` shape requires exactly one: it rejects both values being present and also rejects neither being present.
- **Collection:** Deals are supplied as a list (`MOCK_OPEN_DEALS` is an array of `OpenDeal`). The Deals view has an empty state, so a list may contain zero items.
- **Separate portfolio records:** Portfolio holdings use their own property, type, invested amount, current value, and status fields. Those fields describe holdings and must not be assumed to be listing fields.

Current sample monetary values are formatted strings such as `$2.4M`, `$10,000`, and `$5,000`. The project does not define a currency policy, numeric precision, range rules, or a canonical money representation. Treat any structured money representation as a future modeling decision, not an established requirement.

## Required and Optional Information

The existing `OpenDeal` model requires `name`, `locationOrAssetClass`, and `status`. It also requires exactly one investment-term alternative: `targetRaise` or `minimumInvestment`. Neither alternative is optional for a valid current deal, even though each is marked as unavailable (`never`) in the opposite branch of the existing type.

No optional listing attributes are specified in the reviewed project documentation or current opportunity model. Descriptions, images, addresses, dates, projected returns, and other financial metrics are not included in this inventory because the current project does not establish them.

**Assumption:** Required text values should be meaningful and non-empty. The current TypeScript model only uses `string`, and no minimum length or text validation rule is documented.

## Restricted Values and Potential Nested Concepts

- **Listing status:** A future listing status type should be limited to `Open`, `Closing Soon`, or `Waitlist`, matching the current `DealStatus` values. Additional statuses require an explicit product decision.
- **Investment terms:** These may deserve a nested `InvestmentTerms` concept with mutually exclusive variants for target raise and minimum investment. The existing model expresses this exclusive choice directly on `OpenDeal`; nesting it would be a future organization of the same rule, not a current structure.
- **Location versus asset class:** These are different concepts currently combined in `locationOrAssetClass`. A future tagged choice could preserve which kind of value is present while allowing place names and class names to remain extensible. The project does not define the allowed set or detailed shape for either branch.
- **Money amount:** A dedicated monetary concept could distinguish numeric amount from currency and display formatting. That is an assumption for future validation; the current sample model stores formatted strings and does not establish currency or precision rules.
- **Listings collection:** Opportunities form an array. The existing collection is `MOCK_OPEN_DEALS`; no persistent collection or database representation is defined.

## Invalid Listing States TypeScript Should Eventually Reject

A future model should reject a listing with any of the following structural states:

- Missing `name`, `locationOrAssetClass`, or `status`.
- A status outside `Open`, `Closing Soon`, and `Waitlist`.
- Neither `targetRaise` nor `minimumInvestment` supplied.
- Both `targetRaise` and `minimumInvestment` supplied together.

The location-or-asset-class distinction can also be enforced if product requirements define a tagged choice. TypeScript alone cannot establish that a formatted monetary string is a valid, positive amount or enforce a currency policy; those rules need to be decided and validated separately. No type implementation is included in this planning document.

## Project Context

- [DealsList](../../src/components/dashboard/DealsList.tsx) and [PortfolioTable](../../src/components/dashboard/PortfolioTable.tsx) show the current mock opportunity and holding shapes.
- [Investor dashboard brief](../investor-dashboard-brief.md), [dashboard information architecture](../dashboard-ia.md), and [component plan](../component-plan.md) define the current scope and component boundaries.
- [Verification checklist](../verification-checklist.md) records that investor data is mock/sample data and that live backend data is deferred.
