# PREIshare Dashboard Routing Plan

This document is for the PAUL step: "Inventory the app and draft the dashboard routing plan."

## What Exists Now

The app already includes the starter routes expected by the tutorial. At this stage, we are only inventorying what exists and not claiming any dashboard pages are built yet.

| Route file | URL | Notes |
| --- | --- | --- |
| `src/routes/__root.tsx` | `/` (root layout) | Root route wrapper for the app shell. |
| `src/routes/index.tsx` | `/` | Starter landing page for the app. |

The dashboard routes below are not part of the current inventory; they are planned for a later step.

## Planned Dashboard Routes / Files to Create Later

The investor screen requirements come from `docs/preishare-dashboard-requirements.md`. That document supports a shared dashboard shell and four main investor screens: a Home Overview, Portfolio, Deals, and Profile. It also calls for simple navigation between those screens.

The routes below are planned for later creation:

- `src/routes/dashboard/route.tsx` — planned shared `/dashboard` layout containing the dashboard shell and `<Outlet />`
- `src/routes/dashboard/index.tsx` — planned `/dashboard` home content
- `src/routes/dashboard/portfolio.tsx` — planned `/dashboard/portfolio` placeholder
- `src/routes/dashboard/deals.tsx` — planned `/dashboard/deals` placeholder
- `src/routes/dashboard/profile.tsx` — planned `/dashboard/profile` placeholder
- `src/routes/dashboard/activity.tsx` — optional placeholder route for `/dashboard/activity` if the team wants an extra section later, but this is not required by the brief

## Proposed URL Tree

```text
/
├── /dashboard
│   ├── /dashboard/portfolio
│   ├── /dashboard/deals
│   ├── /dashboard/profile
│   └── /dashboard/activity (optional placeholder)
```

## Navigation Labels

The table below maps the planned dashboard navigation to the investor requirements described in `docs/preishare-dashboard-requirements.md`.

| Navigation Label | URL Path | Planned Route File | Requirement Source |
| --- | --- | --- | --- |
| Home | `/dashboard` | `src/routes/dashboard/index.tsx` | `docs/preishare-dashboard-requirements.md` |
| Portfolio | `/dashboard/portfolio` | `src/routes/dashboard/portfolio.tsx` | `docs/preishare-dashboard-requirements.md` |
| Deals | `/dashboard/deals` | `src/routes/dashboard/deals.tsx` | `docs/preishare-dashboard-requirements.md` |
| Profile | `/dashboard/profile` | `src/routes/dashboard/profile.tsx` | `docs/preishare-dashboard-requirements.md` |

## What Will Be Created Later

The dashboard area is planned as a nested route group under `/dashboard`.

- `src/routes/dashboard/route.tsx` would provide the shared layout for the dashboard shell.
- `src/routes/dashboard/index.tsx` would hold the Home Overview content.
- Each child route would render its own screen inside the same dashboard shell.

This matches the requirements document: the app needs a persistent header, a navigation area, and a main content area for investor screens without building full feature logic yet.

## Out of Scope for This Routing-Plan Step

This step is only planning routes. It should not build page features, data models, or live functionality.

Based on `docs/preishare-dashboard-requirements.md`, the routing plan should avoid implementing:

- full page feature content beyond route placeholders
- backend or database integration
- real authentication
- payment or transaction processing
- production financial calculations
- anything beyond the dashboard shell and route structure required for the sprint

## Summary

The app currently has only the basic starter routes. The planned dashboard work should be created later as a nested `/dashboard` route group, with a shared layout and separate screens for Home, Portfolio, Deals, and Profile. This keeps the work aligned with the requirements brief and avoids building out-of-scope functionality during the planning step.
