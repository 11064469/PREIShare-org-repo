# PREIshare Architecture Decisions

## TanStack Start File-Based Routing

**Context**

The application is a React and TanStack Start project with file-based routes. The dashboard layout is defined in `src/routes/dashboard.tsx`; it renders child routes through `Outlet`. The dashboard home, portfolio, deals, and profile pages are defined in `src/routes/dashboard/index.tsx`, `portfolio.tsx`, `deals.tsx`, and `profile.tsx`. `src/router.tsx` creates the router from the generated `routeTree`.

**Decision**

Keep route files as the source of truth for `/dashboard`, `/dashboard/portfolio`, `/dashboard/deals`, and `/dashboard/profile`. Continue using the TanStack Start route tree rather than adding a second, separately maintained route configuration.

**Consequences**

Each route stays next to its page component, while TanStack's generated route tree connects the files to the existing router. The shared dashboard layout can own the parent route while child pages render inside it. This preserves the project's existing routing approach and avoids maintaining the same route map in two places. README.md now documents these four current routes, keeping the first-run documentation aligned with the route files and dashboard information architecture.

## Shared AppShell Layout

**Context**

All four dashboard pages use the `/dashboard` parent route, which renders `AppShell` around its `Outlet`. `AppShell` composes `Sidebar`, `Header`, and the main content region. The navigation items and page titles are declared together in `navConfig` and consumed by `NavItems` and `Header`.

**Decision**

Keep `AppShell`, `Sidebar`, `Header`, `NavItems`, and `navConfig` shared across dashboard pages. Page-specific content renders inside the shared shell rather than duplicating layout and navigation on each route.

**Consequences**

The four pages share the same navigation, route-title behavior, and main landmark. Navigation labels and destinations are maintained in one configuration, and exact route matching marks the current link with `aria-current="page"`. Changes to common dashboard chrome can be made once; each page remains responsible for its own content.

## Mock Data Boundary

**Context**

This sprint is explicitly a shell-only build. The brief and component plan exclude live backend/database data, real authentication, financial calculations, payments, and production backend features. Current widgets use local sample values and display sample-data labels. The verification checklist marks real authentication and live backend investor data as deferred.

**Decision**

Keep the current dashboard as a clearly labeled mock-data shell. Do not present live investor data, authentication, or backend behavior as implemented; defer those integrations until their data, access, and product requirements are defined.

**Consequences**

Stakeholders can review the routes, layout, and display of portfolio, deal, activity, and profile examples without interpreting the values as real account information. The shell does not provide personalized or database-backed investor records, real financial calculations, account sign-in, or transaction processing. Future integrations will need an explicit boundary between sample content and validated, authorized investor data.

## Responsive and Accessibility Baseline

**Context**

The dashboard is intended to remain usable on narrow screens. The verification checklist records checks on all four routes at 375px and 768px, plus a 1280px desktop check. It also records that navigation remains available, keyboard focus is visible, and the portfolio table scrolls inside its own labeled region on narrow screens.

**Decision**

Establish responsive layout and basic semantic/keyboard accessibility as part of the shell, before adding production backend features. Keep navigation visible across viewport sizes, use a shared header and main region, show a visible focus outline for navigation and the table region, and contain wide table content in a keyboard-focusable scroll region.

**Consequences**

The verification results provide a practical baseline: at 375px the navigation remains available and the portfolio table scrolls locally; at 768px and 1280px the sidebar/main layout is present; no page-level horizontal overflow was observed at the checked widths. The table has column and row headers. These checks establish the documented baseline, not a claim of a complete accessibility audit.

The checklist also records an unresolved **Low-severity Fail**: `src/styles.css` imports Google Fonts, and a browser request to `fonts.googleapis.com` was observed. This violates the no-external-network criterion even though it is not a dashboard data/API request. The finding is accepted for stakeholder review; the external import remains and is a follow-up item if that criterion still applies.

## Next Sprint Foundations

Everything in this section is future work. None of the following services or capabilities is currently implemented in the dashboard.

### Supabase Authentication

**Context**

The current shell is unauthenticated, uses sample profile data, and has no Supabase dependency or integration in the reviewed application source. Real authentication is explicitly deferred in the verification checklist.

**Decision**

For a future sprint, evaluate Supabase Authentication as a possible way to replace the unauthenticated/mock shell boundary with real investor sign-in and session-aware access. This is a proposed direction, not a current integration or a final vendor decision.

**Consequences**

Before exposing investor-specific records, the team would need to define sign-in and sign-out behavior, session handling, route access rules, and how authenticated identity maps to investor data. The existing mock shell should remain distinct from that future authenticated experience until those flows are implemented and verified.

### Live Portfolio Data

**Context**

Holdings, portfolio summary values, home metrics, deals, recent activity, and profile fields currently come from local sample data. The project documentation excludes live database-backed investor data and real financial calculations from this sprint.

**Decision**

In future work, replace mock holdings, balances, deals, activity, and profile information only with validated backend data and defined calculation rules. The backend and data contract have not yet been selected or implemented.

**Consequences**

Production values will require agreed definitions, validation, and appropriate access checks before they can be shown as investor-specific information. Until then, the existing values must continue to be presented as sample data and must not be treated as real balances or calculated returns.

### pgvector-Powered Search

**Context**

The current dashboard has no search feature, vector storage, or pgvector integration, and search is not part of the documented shell scope.

**Decision**

Treat pgvector as a possible future architectural direction if a defined product need calls for semantic search over suitable investor or property information. Do not add it as part of the current shell or assume a particular database has been chosen.

**Consequences**

That direction would require a separate decision about searchable content, data preparation, access restrictions, storage, and how search quality will be evaluated. It adds no capability to the current dashboard and should be considered only against a concrete search use case.

### GitHub Actions CI

**Context**

The package currently defines `dev`, `generate-routes`, `build`, and `preview` scripts. The verification checklist records a successful build. No GitHub Actions workflow is present in the repository, and `package.json` does not define test or explicit type-check scripts.

**Decision**

Consider adding GitHub Actions as future automation for the checks agreed by the team, such as dependency installation and the existing production build, with type checks and tests once corresponding scripts and test coverage are established. CI is not currently configured.

**Consequences**

A future workflow could run consistent checks before changes are merged and make failures visible during review. The workflow should invoke real project scripts rather than assuming test or type-check commands exist today.

## Project References

- [docs/investor-dashboard-brief.md](investor-dashboard-brief.md) - Client requirements, investor goals, and scope boundaries.
- [docs/dashboard-ia.md](dashboard-ia.md) - Route map, navigation, and dashboard information architecture.
- [docs/component-plan.md](component-plan.md) - Component responsibilities and rules for the current shell.
- [docs/verification-checklist.md](verification-checklist.md) - Browser, accessibility, responsive-layout, and build verification evidence, including the accepted Google Fonts finding.
