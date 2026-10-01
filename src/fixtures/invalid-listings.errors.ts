// INTENTIONAL TYPE ERRORS — this file should NOT typecheck cleanly.
// Each export demonstrates a failure mode documented in
// docs/type-safety/expected-type-errors.md

import type { InvestorListing } from "../types";

export const invalidStatusSpelling: InvestorListing = {
  id: "invalid-status-001",
  title: "Status Typo Example",
  summary: "All required listing data is valid except for the status spelling.",
  createdAt: "2026-01-15T09:00:00Z",
  updatedAt: "2026-02-01T14:30:00Z",
  status: "availble",
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
      id: "contact-invalid-status-001",
      fullName: "Jordan Lee",
      role: "broker",
      email: "jordan.lee@example.com",
    },
  ],
  primaryContactId: "contact-invalid-status-001",
  ownership: {
    ownerName: "Maple Grove Property LLC",
    ownershipPercent: 100,
  },
};

export const missingAddressCity: InvestorListing = {
  id: "invalid-address-001",
  title: "Missing City Example",
  summary: "All required listing data is valid except for the address city.",
  createdAt: "2026-02-15T09:00:00Z",
  updatedAt: "2026-03-01T14:30:00Z",
  status: "active",
  propertyType: "multi_family",
  address: {
    street: "48 Cedar Ridge Drive",
    region: "CO",
    postalCode: "80202",
    country: "US",
  },
  financialSummary: {
    noi: 94000,
    capRate: 0.048,
    occupancyRate: 0.9,
    askingPrice: 1950000,
  },
  contacts: [
    {
      id: "contact-invalid-address-001",
      fullName: "Morgan Patel",
      role: "owner",
      email: "morgan.patel@example.com",
    },
  ],
  primaryContactId: "contact-invalid-address-001",
  ownership: {
    ownerName: "Cedar Ridge Holdings LLC",
  },
};

export const priceAsString: InvestorListing = {
  id: "invalid-price-001",
  title: "String Price Example",
  summary: "All required listing data is valid except for the asking price type.",
  createdAt: "2026-03-15T09:00:00Z",
  updatedAt: "2026-04-01T14:30:00Z",
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
    askingPrice: "610000",
  },
  contacts: [
    {
      id: "contact-invalid-price-001",
      fullName: "Taylor Brooks",
      role: "assistant",
      email: "taylor.brooks@example.com",
    },
  ],
  primaryContactId: "contact-invalid-price-001",
  ownership: {
    ownerName: "Riverside Commercial Partners",
    ownershipPercent: 100,
  },
};
