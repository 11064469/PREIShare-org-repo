import type { InvestorListing } from "../types";

export const sampleActiveListing: InvestorListing = {
  id: "listing-active-001",
  title: "Maple Grove Homes",
  summary: "A sample active residential investment opportunity.",
  createdAt: "2026-01-15T09:00:00Z",
  updatedAt: "2026-02-01T14:30:00Z",
  status: "active",
  propertyType: "single_family",
  address: {
    street: "125 Maple Grove Lane",
    city: "Austin",
    region: "TX",
    postalCode: "78701",
    country: "US",
  },
  financialSummary: {
    noi: 118000,
    capRate: 0.052,
    occupancyRate: 0.96,
    askingPrice: 2270000,
  },
  contacts: [
    {
      id: "contact-active-001",
      fullName: "Jordan Lee",
      role: "broker",
      email: "jordan.lee@example.com",
      phone: "512-555-0101",
    },
  ],
  primaryContactId: "contact-active-001",
  ownership: {
    ownerName: "Maple Grove Property LLC",
    notes: "Single ownership entity.",
    ownershipPercent: 100,
  },
};

export const sampleDraftListing: InvestorListing = {
  id: "listing-draft-001",
  title: "Cedar Ridge Residences",
  summary: "A sample residential opportunity being prepared for review.",
  createdAt: "2026-03-02T11:15:00Z",
  updatedAt: "2026-03-06T16:45:00Z",
  status: "draft",
  propertyType: "multi_family",
  address: {
    street: "48 Cedar Ridge Drive",
    city: "Denver",
    region: "CO",
    postalCode: "80202",
    country: "US",
  },
  financialSummary: {
    noi: 94000,
    capRate: 0.048,
    occupancyRate: 0.9,
  },
  contacts: [
    {
      id: "contact-draft-001",
      fullName: "Morgan Patel",
      role: "owner",
      email: "morgan.patel@example.com",
    },
  ],
  primaryContactId: "contact-draft-001",
  ownership: {
    ownerName: "Cedar Ridge Holdings LLC",
  },
};

export const sampleUnderContractListing: InvestorListing = {
  id: "listing-under-contract-001",
  title: "Riverside Commerce Center",
  summary: "A sample commercial listing currently under contract.",
  createdAt: "2025-11-10T08:20:00Z",
  updatedAt: "2026-01-20T12:00:00Z",
  status: "under_contract",
  propertyType: "commercial",
  address: {
    street: "900 Riverside Parkway",
    city: "Nashville",
    region: "TN",
    postalCode: "37201",
    country: "US",
  },
  financialSummary: {
    noi: 310000,
    capRate: 0.061,
    occupancyRate: 0.88,
    askingPrice: 5080000,
  },
  contacts: [
    {
      id: "contact-contract-001",
      fullName: "Taylor Brooks",
      role: "assistant",
      email: "taylor.brooks@example.com",
      phone: "615-555-0134",
    },
  ],
  primaryContactId: "contact-contract-001",
  ownership: {
    ownerName: "Riverside Commercial Partners",
    ownershipPercent: 100,
  },
};

export const sampleClosedListing: InvestorListing = {
  id: "listing-closed-001",
  title: "Pine Creek Land Parcel",
  summary: "A sample land listing that has completed its sale.",
  createdAt: "2025-05-12T10:00:00Z",
  updatedAt: "2025-12-18T17:10:00Z",
  status: "closed",
  closedAt: "2025-12-18T17:10:00Z",
  propertyType: "land",
  address: {
    street: "75 Pine Creek Road",
    city: "Boise",
    region: "ID",
    postalCode: "83702",
    country: "US",
  },
  financialSummary: {
    noi: 0,
    capRate: 0,
    occupancyRate: 0,
    askingPrice: 680000,
  },
  contacts: [
    {
      id: "contact-closed-001",
      fullName: "Casey Nguyen",
      role: "owner",
      email: "casey.nguyen@example.com",
    },
  ],
  primaryContactId: "contact-closed-001",
  ownership: {
    ownerName: "Pine Creek Land LLC",
    notes: "Listing closed.",
    ownershipPercent: 100,
  },
};

export const sampleInvestorListings: InvestorListing[] = [
  sampleActiveListing,
  sampleDraftListing,
  sampleUnderContractListing,
  sampleClosedListing,
];
