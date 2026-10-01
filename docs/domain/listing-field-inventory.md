# PREIshare Investor Listing Field Inventory

## Listing Identity and Lifecycle

| Field or group | Investor-friendly meaning | Information shape | Required or optional | Allowed/restricted values | Business validity rule | Placement |
| --- | --- | --- | --- | --- | --- | --- |
| ID | The listing's identifier | Text | Required | No specific format was supplied | Must be present and not empty. | Directly on the listing |
| Title | The listing's name, used to identify the opportunity | Text | Required | No restricted vocabulary was supplied | Must be present and not empty. | Directly on the listing |
| Lifecycle status | The listing's current business stage | One status chosen from a closed set | Required | `draft`, `published`, `under_offer`, `sold`, `archived` | Every listing must have exactly one of these five values; no other status is allowed. | Directly on the listing |

## Address

| Field or group | Investor-friendly meaning | Information shape | Required or optional | Allowed/restricted values | Business validity rule | Placement |
| --- | --- | --- | --- | --- | --- | --- |
| Address | The complete property/location address | A nested group containing individual address information; the component field names and shapes were not supplied | Required | Not specified | Must provide a complete property/location address. A general location label alone is not sufficient. | Nested group on the listing |
| Individual address parts | The parts that together make the full address understandable | Individual entries within the Address group; exact fields not supplied | Requiredness of each part is unresolved | Not specified | Do not assume particular address components or their requiredness until the source requirements name them. | Inside Address |

## Financial Summary

| Field or group | Investor-friendly meaning | Information shape | Required or optional | Allowed/restricted values | Business validity rule | Placement |
| --- | --- | --- | --- | --- | --- | --- |
| Financial Summary | The financial information describing the listing | A nested group that keeps listing financial information together | Required to provide the asking price and its currency | No further financial fields or value rules were supplied | Must include a numeric asking price and a currency. | Nested group on the listing |
| Asking price | The amount being asked for the investment opportunity | Number | Required | No range or precision was supplied | Must be a numeric amount. A positivity or range rule was not supplied. | Inside Financial Summary |
| Currency | The currency used for the asking price | Currency identifier; exact format and supported choices not supplied | Required with the asking price | Permitted currencies were not supplied | Must identify the currency for the numeric asking price. | Inside Financial Summary |

## Investor Contacts

| Field or group | Investor-friendly meaning | Information shape | Required or optional | Allowed/restricted values | Business validity rule | Placement |
| --- | --- | --- | --- | --- | --- | --- |
| Investor Contacts | People investors can contact with questions about the listing | A nested group containing one or more contact entries; individual details are not specified | Required | No restricted values supplied | A valid listing must contain at least one investor contact. No maximum number was supplied. | Nested group on the listing |
| Contact entry details | The person/contact information an investor can use for questions | Contact information; exact field names and shapes not supplied | Required for at least one contact entry; which individual details are required is unresolved | Not specified | The contact information must support investor questions; do not assume specific details such as name, email, or phone without the source requirements. | Inside Investor Contacts |

## Ownership

| Field or group | Investor-friendly meaning | Information shape | Required or optional | Allowed/restricted values | Business validity rule | Placement |
| --- | --- | --- | --- | --- | --- | --- |
| Ownership | Ownership information associated with the listing | A separate nested business group; individual fields and whether the group is required or optional were not supplied | Unresolved | Not specified | Keep ownership information grouped separately; no additional validity rule was supplied. | Nested group on the listing |
| Individual ownership details | The ownership information that belongs to the listing | Individual entries within the Ownership group; exact field names and number of entries not supplied | Requiredness and cardinality are unresolved | Not specified | Do not assume owners, percentages, legal structures, or allocation rules. | Inside Ownership |

## Validity Summary

A valid listing must have a non-empty ID, a non-empty title, exactly one allowed lifecycle status, a complete Address, a numeric asking price plus currency within Financial Summary, and at least one Investor Contact. No validity requirement was supplied for Ownership beyond keeping it as its own nested group.

## Scope

This inventory documents business information only. It does not implement UI work, API work, database work, or TypeScript types.
