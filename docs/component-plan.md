# PREIshare Dashboard Component Plan

| Component | Responsibility | Used On | Must NOT Do |
|---|---|---|---|
| AppShell | Provides the shared dashboard layout containing the sidebar, header, and main content area. | All dashboard pages | Must not fetch investment data or contain page-specific content. |
| Sidebar | Displays dashboard navigation. | All dashboard pages | Must not define separate page content or duplicate navigation configuration. |
| Header | Displays the dashboard header area. | All dashboard pages | Must not define the full navigation list or fetch data. |
| NavItems | Stores the shared Home, Portfolio, Deals, and Profile navigation configuration. | Sidebar/navigation | Must not control page layout or fetch data. |
| StatsCard | Displays one mock statistic with a label and value. | Dashboard Home | Must not fetch data or control page layout. |
| PortfolioSummary | Displays a summary of mock portfolio information. | Dashboard Home, Portfolio | Must not perform financial calculations or fetch live data. |
| RecentActivity | Displays mock recent investor activity. | Dashboard Home | Must not load real transaction history. |
| PortfolioTable | Displays mock investment holdings in a table. | Portfolio | Must not edit investments or connect to a database. |
| DealsList | Displays mock investment opportunities. | Deals | Must not process investments, payments, or live deals. |
| ProfileCard | Displays mock investor profile and account information. | Profile | Must not update accounts or handle authentication. |

## Component Rules

- Mock data must be clearly identified as mock or placeholder data.
- Shared navigation labels should come from `NavItems`.
- `AppShell` owns the shared dashboard layout.
- Page-specific components only display content for their assigned area.
- Components do not connect to a backend or database during this sprint.
- Authentication, payments, and production financial functionality are out of scope.