# PREIshare Investor Listing Domain Brief

## Actors and Business Goals

### Internal listing editor

The internal listing editor needs one consistent listing definition for creating and maintaining accurate investor opportunities.

### Investor

The investor needs complete, understandable, consistent listing information to review an investment opportunity.

PREIshare needs one shared investor-listing definition so internal editors and investors work from the same business concepts, and future application layers can apply the same validity rules consistently.

## Investor Listing and Nested Groups

An investor listing is the shared business description of an investment opportunity. It has listing identity and lifecycle information and contains four separate nested business groups:

- **Address:** A complete property/location address. It is a group of address information, not a single general location label. The individual address parts have not been named in the supplied requirements, so their names and detailed rules remain unresolved.
- **Financial Summary:** Financial information about the listing, including a numeric asking price and its currency. Other financial details are not specified here.
- **Investor Contacts:** People and contact information investors can use to ask questions. The listing must contain at least one contact. The individual contact details have not been specified.
- **Ownership:** Ownership information represented as its own nested group, separate from the listing's top-level identity and status. Its individual details and whether it is required or optional have not been specified.

## Lifecycle Status

Every listing must have exactly one lifecycle status. The complete allowed set is:

- `draft`
- `published`
- `under_offer`
- `sold`
- `archived`

No other status is allowed. The business requirements define the allowed lifecycle labels but do not define transition timing or who may make a transition.

## Required and Optional Information

The six validity requirements below determine what a listing must contain to be valid. The supplied requirements do not identify additional optional listing information. The individual component fields inside Address, Investor Contacts, and Ownership, and any Financial Summary details beyond asking price and currency, remain unspecified. Ownership group's requiredness is also unresolved.

## Business Validity Rules

A valid investor listing must have:

- An ID that is present and not empty.
- A title that is present and not empty.
- Exactly one lifecycle status from the five allowed values listed above.
- A complete property/location address.
- An asking price expressed as a number and a currency.
- At least one investor contact who can be used for questions.

These are business rules, not an implementation specification. The exact address parts, currency format and permitted currencies, contact details, ownership details, and any further constraints were not specified and must not be guessed.

## Out of Scope

This planning step defines the investor-listing business domain only. It does not implement:

- User interface work.
- API work.
- Database work.
- TypeScript types.

## Project Context

- [Investor dashboard brief](../investor-dashboard-brief.md), [dashboard information architecture](../dashboard-ia.md), and [component plan](../component-plan.md) describe the current dashboard shell scope and component responsibilities.
- [Verification checklist](../verification-checklist.md) records that current investor information is mock/sample data; it is not the source of the investor-listing business model.
