export interface InvestorListing {
  /** Identifies the listing; must not be empty. */
  id: string

  /** Names the investment opportunity; must not be empty. */
  title: string

  /** Provides the longer description of the investment listing. */
  summary: string

  /** The asking price in whole US dollars. */
  askingPrice: number

  /** The ISO-8601 date and time when the listing was created. */
  createdAt: string

  /** The ISO-8601 date and time when the listing was last updated. */
  updatedAt: string
}
