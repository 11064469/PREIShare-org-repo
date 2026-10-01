# PREIshare Dashboard Verification Checklist

## Routes and navigation
- [x] `/dashboard` renders the Dashboard overview route.
- [x] `/dashboard/portfolio` renders the Portfolio route.
- [x] `/dashboard/deals` renders the Deals route.
- [x] `/dashboard/profile` renders the Profile route.
- [x] Sidebar navigation clicks reach each of the four routes.
- [x] Exactly one sidebar link has `aria-current="page"` on each route, and it matches the exact route.
- [x] The shared header title matches each route: Dashboard overview, Portfolio, Deals, and Profile.

## Dashboard home
- [x] The home page includes portfolio value, open deals, and year-to-date contributions stats.
- [x] The home page includes Portfolio Summary and Recent Activity widgets.
- [x] Home statistics and both widgets identify their content as sample data.

## Portfolio
- [x] PortfolioTable renders sample holdings with property, type, invested amount, current value, and status.
- [x] PortfolioTable visibly labels the holdings as sample data.
- [x] At narrow widths, the table scrolls within its labeled table region instead of widening the page.

## Deals
- [x] DealsList renders the sample investment opportunities and their status/investment details.
- [x] DealsList visibly labels the opportunities as sample data.

## Profile
- [x] ProfileCard renders sample name, email, membership tier, contact preference, and notes.
- [x] ProfileCard visibly labels the profile as sample data.

## Responsive layout
- [x] Checked all four routes at 375px and 768px viewport widths.
- [x] Dashboard sidebar navigation remains visible and usable at both widths.
- [x] No page-level horizontal overflow was found at either width; document scroll width matched client width on all routes.
- [x] Portfolio table overflow is contained in its own horizontally scrollable region.

## Accessibility basics
- [x] Dashboard navigation has the accessible name “Dashboard navigation.”
- [x] Dashboard pages expose header/banner and main landmarks.
- [x] Keyboard tab navigation reaches the sidebar, and the focused link displays a visible outline.
- [x] Portfolio table uses column and row header cells and is inside a labeled, keyboard-focusable region.

## Client-story/scope verification
- [x] Routes, shared shell, widgets, and placeholder content align with the investor brief, component plan, and dashboard IA.
- [x] No dashboard fetch/API client, database, Supabase, authentication, or payment functionality was found in the source review.
- [ ] No external network requests occur. The browser requested Google Fonts from `fonts.googleapis.com` because the global stylesheet imports those fonts; no dashboard data/API request was observed.

## Build verification
- [x] `npm.cmd run build` passed.
- [x] No existing source files were modified for this verification pass.
