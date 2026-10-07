# PREIshare Dashboard Requirements

## Overview

PREIshare is an investor dashboard shell designed to help users review a compact set of investment signals without needing to navigate through a dense financial application. This sprint focuses on the user experience shell: layout, core navigation, route structure, and placeholder content only.

The application is intentionally mock-first. It does not include live backend integrations, real authentication, or production financial processing.

## Product Goal

Provide investors with a clear and fast way to:

- scan overall portfolio value and investment status
- review open or available deals
- view basic profile information
- move between the dashboard areas with minimal friction

## Primary Users

### Investor
An investor wants a quick summary of portfolio information and deal opportunities without digging through unrelated content.

### Future Admin
A future admin may need to manage dashboard content in a later phase, but admin workflows are intentionally out of scope for this sprint.

## Functional Requirements

### 1. Dashboard Shell

The app must include:

- a persistent header
- a sidebar or equivalent navigation region
- a main content area for page-specific content
- responsive behavior that remains usable on narrow screens

### 2. Core Dashboard Routes

The dashboard must provide the following routes:

- `/dashboard` — Home Overview
- `/dashboard/portfolio` — Portfolio
- `/dashboard/deals` — Deals
- `/dashboard/profile` — Profile

Each route should have a clear page title and a distinct purpose.

### 3. Home Overview

The Home overview page must show:

- portfolio summary information
- mock metrics or sample portfolio values
- recent activity or sample updates
- links or quick navigation to important dashboard areas

This page should present high-level investor information without requiring deep exploration.

### 4. Portfolio

The Portfolio page must show:

- mock portfolio value
- placeholder investment holdings
- sample table or list data
- clear labeling that the information is example data

### 5. Deals

The Deals page must show:

- mock deal cards or a list of sample investment opportunities
- basic deal metadata such as status or value band
- visible indication that the content is placeholder data

### 6. Profile

The Profile page must show:

- investor name
- contact details
- account or profile summary information
- sample information clearly labeled as mock data

## Navigation Requirements

- Navigation must allow the investor to reach Home, Portfolio, Deals, and Profile.
- The selected page should be visually obvious.
- Navigation should stay simple and uncluttered.
- The dashboard should feel easy to navigate without extra searching or helper text.

## Content Requirements

- Placeholder and sample investment information must be clearly labeled as mock data.
- User-facing labels must be simple and investment-aware.
- Page structure should prioritize scanning over heavy detail.
- No financial calculations or production-ready reporting logic are required in this sprint.

## UX Success Criteria

The dashboard shell is considered successful if:

- all four primary dashboard pages can be reached from navigation
- each page has a clear page title
- the shell includes a sidebar, header, and main content region
- the layout remains usable on smaller viewports
- the investor can identify major dashboard areas without searching through unnecessary clutter
- mock data is clearly labeled as sample content

## Out of Scope

This sprint intentionally excludes:

- real authentication
- backend database integration
- live investment data
- real financial calculations
- payment or transaction flow
- production admin functionality
- full business intelligence workflows

## Acceptance Summary

The implementation should deliver a dashboard shell that looks and behaves like a simple investor portal for a shell-only sprint, with polished page structure, responsive layout, and clearly labeled sample data across the main dashboard views.
