# PREIshare Sprint 3 Handoff

## Summary for Stakeholders

The PREIshare dashboard shell gives stakeholders a working preview of the main investor areas: a home overview, portfolio, deals, and profile. Visitors can move between the pages using the shared dashboard navigation, review clearly labeled sample information, and see the layout adapt from a compact mobile navigation to a sidebar layout on wider screens.

This is a shell and demonstration, not a live investor account. Portfolio figures, deals, recent activity, and profile details are examples. There is no real sign-in, live investor data, or production investment or payment workflow. The verification checklist also records a low-severity issue: the page requests Google Fonts from an external service. That finding is accepted for stakeholder review but still needs a future resolution if the no-external-network criterion remains required.

## What Shipped

The dashboard routes are:

- `/dashboard` - Dashboard Home
- `/dashboard/portfolio` - Portfolio
- `/dashboard/deals` - Deals
- `/dashboard/profile` - Profile

All four routes use the shared `AppShell`, which places the `Sidebar`, `Header`, and main content region together. `Sidebar` contains `NavItems`; `NavItems` renders Home, Portfolio, Deals, and Profile links with exact active-route states. `Header` displays the PREIshare name and a title corresponding to the current dashboard route.

The route content includes:

- **Dashboard Home:** Three `StatsCard` metrics display Total Portfolio Value ($200,000), Open Deals (3), and Contributions YTD ($12,500). `PortfolioSummary` shows Residential Fund (60%, $120,000) and Commercial Fund (40%, $80,000). `RecentActivity` lists four sample events with dates.
- **Portfolio:** `PortfolioTable` displays three sample holdings and their property, type, invested amount, current value, and status. At narrow widths, the table can scroll within its labeled region.
- **Deals:** `DealsList` displays three sample opportunities with their location or asset class, status, and target raise or minimum investment.
- **Profile:** `ProfileCard` displays sample display name, email, membership tier, preferred contact, and notes.

These components display placeholder content; they do not fetch or update investor records. The Portfolio route uses `PortfolioTable`; `PortfolioSummary` is displayed on Dashboard Home.

## How to Run Locally

Prerequisites: Node.js and npm.

From the repository root, install dependencies:

```bash
npm install
```

Start the development server using the package's `dev` script:

```bash
npm run dev
```

The script runs `vite dev --port 3000`. Open [http://localhost:3000](http://localhost:3000), then navigate to `/dashboard`.

Create a production build with the existing `build` script:

```bash
npm run build
```

The verification checklist records a successful build.

## Demo Script

1. Open `/dashboard`. Point out the Dashboard overview title and the note that the investor information is sample data.
2. Review the three `StatsCard` metrics, then the `PortfolioSummary` fund allocations and `RecentActivity` sample entries.
3. Select **Portfolio** in the dashboard navigation, or open `/dashboard/portfolio`. Review the three rows in `PortfolioTable` and its sample-data label.
4. Select **Deals**, or open `/dashboard/deals`. Review the three sample opportunities and their statuses and investment details.
5. Select **Profile**, or open `/dashboard/profile`. Review the five sample profile fields and the sample-data label.
6. Resize the browser to about 375px, then to 768px or wider. Confirm the navigation remains available, the layout changes for the wider viewport, and the holdings table scrolls within its own region on narrow screens. The verification checklist records checks at 375px, 768px, and 1280px, with no page-level horizontal overflow observed.

## Known Limitations

- Portfolio values, holdings, deal opportunities, recent activity, and profile details are mock/sample content, not real investor information.
- Live portfolio or other investor data is not connected to a backend or database. The verification checklist marks live backend/database data as deferred because this sprint intentionally uses sample data.
- Real authentication is not implemented; the verification checklist marks it deferred because it is outside the dashboard shell sprint's scope.
- The app does not provide real financial calculations, investment transactions, or production payment processing.
- The verification checklist records an external Google Fonts request as **Fail, Severity: Low**. The global stylesheet requests fonts from `fonts.googleapis.com`, violating the no-external-network criterion even though it is not a dashboard data/API request. It is accepted as a low-severity blocker for stakeholder review. A follow-up can remove the external import and use an existing, local, or system font.
- `README.md` still describes the dashboard routes as future work and says the root route is the only dashboard-related route. That documentation does not match the current route files and dashboard IA.

## Recommended Next-Sprint Work

- Decide the future data source and data contract, then replace sample portfolio, deal, activity, and profile content with appropriately authorized live investor data.
- Design and implement real authentication before exposing investor-specific information.
- Define and validate financial calculation rules before presenting production balances or returns.
- Scope any investment transaction and payment workflow separately; none exists in this shell.
- Resolve the Google Fonts finding by removing the external request or formally revising the no-external-network requirement.
- Update the README route description so it reflects the dashboard routes that now exist.
- Add automated checks for the verified routes, navigation states, responsive layouts, and build as the project grows.
