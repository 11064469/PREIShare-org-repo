/** A person the team can reach about an investor listing. */
export interface InvestorContact {
  /** Stable id within the listing's contact list. */
  id: string;

  fullName: string;

  /** Role relative to the deal, e.g. "broker", "owner", "assistant". */
  role: string;

  email: string;

  /** Optional because not every contact shares a phone. */
  phone?: string;
}
