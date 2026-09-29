# PREIshare Investor Dashboard Client Brief

## Product Summary

PREIshare is for investors who need a simple way to view important investment information without searching through clutter. This sprint is a shell-only build focused on layout, routes, navigation, and placeholder content for portfolio scanning, deals, and profile information. It does not include live backend data or real authentication.

## Primary Actors

- Investor
- Future admin (out of scope for this sprint)

## Investor Goals

- Quickly scan portfolio value and investment information
- View available and open deals
- View profile information
- Easily navigate between the main dashboard areas

## Must-Have Dashboard Areas

### Home Overview

**Route:** `/`

The investor should see a dashboard overview with placeholder portfolio information, recent activity, and quick links to important areas.

### Portfolio

**Route:** `/portfolio`

The investor should see mock portfolio information, such as placeholder portfolio value and investment holdings.

### Deals

**Route:** `/deals`

The investor should see placeholder deal cards or a list of mock investment opportunities.

### Profile

**Route:** `/profile`

The investor should see placeholder profile information, such as name, contact information, and account details.

## Success Criteria

- Navigation allows the investor to reach Home, Portfolio, Deals, and Profile.
- Home, Portfolio, Deals, and Profile each display a clear page title.
- The dashboard includes a sidebar, header, and main content region.
- The layout remains usable on narrow screens.
- Placeholder or sample investment information is clearly labeled as mock data.
- The investor can identify the main dashboard areas without searching through unnecessary clutter.

## Out of Scope

This sprint is shell-only, so it does not include:

- Real authentication
- Live database-backed investment data
- Real financial calculations
- Payment or transaction processing
- Full admin functionality
- Production backend features