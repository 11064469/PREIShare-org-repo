# PREIshare Dashboard Routing Plan

This project already has a simple route structure for the investor dashboard. The routes are organized in `src/routes` using TanStack Router file-based routing.

## Existing routes in the project

| Route file | URL | Purpose |
| --- | --- | --- |
| `src/routes/index.tsx` | `/` | Landing page for the app. It introduces PREIshare and includes a button to open the dashboard. |
| `src/routes/about.tsx` | `/about` | A separate informational page outside the dashboard shell. |
| `src/routes/dashboard.tsx` | `/dashboard` | Shared dashboard layout wrapper. This file is the parent route for the dashboard area. |
| `src/routes/dashboard/index.tsx` | `/dashboard` | The dashboard home page content. This is where the overview page lives. |
| `src/routes/dashboard/portfolio.tsx` | `/dashboard/portfolio` | Portfolio page with sample holdings and portfolio data. |
| `src/routes/dashboard/deals.tsx` | `/dashboard/deals` | Deals page with mock investment opportunities. |
| `src/routes/dashboard/profile.tsx` | `/dashboard/profile` | Profile page with investor account information. |

## How the dashboard routes connect to the requirements

The requirements document describes four main dashboard areas:

- Home Overview
- Portfolio
- Deals
- Profile

Those map directly to the file-based routes in `src/routes/dashboard`:

- `dashboard.tsx` creates the shared layout for the dashboard.
- `dashboard/index.tsx` holds the Home Overview content.
- `dashboard/portfolio.tsx` matches the Portfolio requirement.
- `dashboard/deals.tsx` matches the Deals requirement.
- `dashboard/profile.tsx` matches the Profile requirement.

This keeps the dashboard experience consistent: the same header/sidebar shell is reused while each page swaps in its own content.

## Shared layout behavior

`src/routes/dashboard.tsx` is the parent route for everything under `/dashboard`.

It does three important things:

1. It creates the `/dashboard` route.
2. It renders the shared dashboard shell via `AppShell`.
3. It uses `<Outlet />` so child routes can render inside the same layout.

In plain terms, this file is the wrapper that keeps the sidebar and page structure in place while the dashboard pages change.

## Home page content

The dashboard home content lives in `src/routes/dashboard/index.tsx`.

This route is the actual dashboard overview page. It contains the summary content, sample metrics, and supporting sections for the investor dashboard home screen. The route path is `/dashboard`, and it is the page people land on when they enter the dashboard.

## Proposed URL tree

```text
/
├── /about
├── /dashboard
│   ├── /dashboard/portfolio
│   ├── /dashboard/deals
│   └── /dashboard/profile
```

## Summary

The current routing structure already matches the project requirements well:

- `/dashboard` is the dashboard home overview
- `/dashboard/portfolio` is the portfolio screen
- `/dashboard/deals` is the deal screen
- `/dashboard/profile` is the profile screen
- `dashboard.tsx` provides the shared dashboard shell
- `dashboard/index.tsx` contains the home-page content

This is a clean, beginner-friendly structure that keeps the dashboard organized and easy to extend later.
