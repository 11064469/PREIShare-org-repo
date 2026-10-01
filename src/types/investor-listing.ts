import type { PropertyType } from "./property-type";
import type { Address } from "./address";
import type { FinancialSummary } from "./financial-summary";
import type { InvestorContact } from "./investor-contact";
import type { Ownership } from "./ownership";

export interface InvestorListingBase {
  /** Identifies the listing; must not be empty. */
  readonly id: string

  /** Names the investment opportunity; must not be empty. */
  title: string

  /** Provides the longer description of the investment listing. */
  summary: string

  /** The ISO-8601 date and time when the listing was created. */
  readonly createdAt: string

  /** The ISO-8601 date and time when the listing was last updated. */
  readonly updatedAt: string

  propertyType: PropertyType
  address: Address
  financialSummary?: FinancialSummary

  /** One or more people associated with this listing. */
  contacts: InvestorContact[];

  /**
   * Must match InvestorContact.id of one entry in contacts.
   * TypeScript cannot fully enforce that the id exists in the array,
   * so this remains a string reference.
   */
  primaryContactId: string;

  ownership: Ownership;
}

// Status is the discriminant; a closed listing requires closedAt.
export type InvestorListing = InvestorListingBase &
  (
    | {
        status: "draft" | "active" | "under_contract" | "archived";
        closedAt?: undefined;
      }
    | {
        status: "closed";
        closedAt: string;
      }
  );

export type ClosedInvestorListing = Extract<
  InvestorListing,
  { status: "closed" }
>;

export type OpenInvestorListing = Exclude<
  InvestorListing,
  { status: "closed" }
>;
