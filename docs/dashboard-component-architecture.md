# PREIshare Investor Dashboard Component Architecture

This document explains the planned component structure for the PREIshare investor dashboard. It is based on the requirements in `docs/preishare-dashboard-requirements.md` and the route planning in `docs/dashboard-routing-plan.md`.

The goal is to keep the dashboard simple, mock-first, and easy to navigate. The design supports the investor screens described in the brief without building production features such as real auth, live data, or payment flows.

## Existing Files vs. Planned Components

The starter app already contains a few existing route files:

- `src/routes/__root.tsx` — root app layout
- `src/routes/index.tsx` — starter landing page

The dashboard shell and its component tree are planned for later work. The intended dashboard layout would sit under a nested dashboard route group such as:

- `src/routes/dashboard/route.tsx` — shared dashboard layout
- `src/routes/dashboard/index.tsx` — Home Overview page
- `src/routes/dashboard/portfolio.tsx` — Portfolio page
- `src/routes/dashboard/deals.tsx` — Deals page
- `src/routes/dashboard/profile.tsx` — Profile page

This architecture matches the dashboard requirements: a single shared shell for navigation and page content, with page-specific widgets inside the main area.

## 1. Component Inventory

The following components are the planned building blocks for the dashboard shell and investor screens.

| Component name | Responsibility | Parent | Children |
| --- | --- | --- | --- |
| `AppShell` | Provides the shared dashboard layout with a top header, navigation region, and main content area for all dashboard pages. | Planned dashboard route layout (`src/routes/dashboard/route.tsx`) | `Header`, `Sidebar`, `MobileNav`, page content slot |
| `Header` | Renders the top bar with the page title, dashboard branding, and mobile menu trigger. | `AppShell` | Page title, optional user summary, mobile menu button |
| `Sidebar` | Shows the primary desktop navigation for Home, Portfolio, Deals, and Profile. Keeps the current page visually selected. | `AppShell` | Navigation items |
| `MobileNav` | Shows the same navigation on smaller screens in a compact menu or slide-over panel. Helps keep the dashboard usable on phones and tablets. | `AppShell` | Navigation items, close button |
| `MetricCard` | Displays a single metric such as total value, available deals, or portfolio health. Designed for summary tiles on the home screen. | Dashboard overview page or widget group | Label, value, optional trend text |
| `PortfolioSummary` | Presents overall portfolio information, key totals, and a short list of sample holdings or allocation details. | Dashboard overview page or Portfolio page | `MetricCard` children and summary rows |
| `RecentActivity` | Lists recent updates, investor actions, or milestone entries in a simple feed. | Dashboard overview page | Activity entries |

This inventory stays intentionally lightweight, because the sprint calls for a shell and placeholder content rather than full financial tooling.

## 2. Props and Data Contracts

These components should receive simple, reusable props. They should be designed to accept page data from the route or page-level container rather than embedding investor information directly in the component code.

### Shared Layout Props

- `title: string` — the current page title displayed in the header.
- `subtitle?: string` — optional descriptive text for the current workspace or screen.
- `navItems: Array<{ label: string; path: string; isActive?: boolean }>` — the navigation links used by the sidebar or mobile menu.
- `children: ReactNode` — page content that should fill the main dashboard area.
- `onMenuToggle?: () => void` — triggered when the mobile menu opens or closes.

### Navigation Props

- `items` — the same navigation item list used by both the desktop and mobile menu.
- `activeItem` — the currently selected route or identifier.
- `onNavigate` — a callback when a user selects a dashboard section.
- `isOpen` — used only by `MobileNav` to decide if the drawer is visible.
- `onClose` — closes the mobile menu after a selection or outside click.

### Metric Card Props

- `label: string` — short label like "Portfolio Value" or "Open Deals".
- `value: string` — primary value such as "$1.2M" or "12 deals".
- `change?: string` — optional change indicator such as "+4.2%".
- `tone?: "neutral" | "positive" | "warning"` — optional visual emphasis for the metric.

### Portfolio Summary Props

- `title: string` — section heading, for example "Portfolio Summary".
- `totalValue: string` — total portfolio value.
- `holdings?: Array<{ name: string; value: string; allocation?: string }>` — sample holdings or placeholder position data.
- `summaryLabel?: string` — helper text explaining that the data is sample content.

### Recent Activity Props

- `title: string` — heading such as "Recent Activity".
- `entries: Array<{ id: string; title: string; detail?: string; time: string }>` — simple activity items.
- `emptyState?: string` — optional message for when there are no items.

### Design Principle

These props avoid hard-coded investor data. The dashboard will render sample values passed in from page components or mock data objects during the UI prototype phase. The components should not contain a single real investor record or business-specific account details.

## 3. Layout Diagram

The dashboard should use a simple two-part shell:

```text
AppShell
├── Header
│   ├── page title
│   ├── optional user area or status indicator
│   └── mobile menu button
├── Sidebar (desktop navigation)
│   ├── Home
│   ├── Portfolio
│   ├── Deals
│   └── Profile
├── MobileNav (mobile/tablet navigation drawer)
│   ├── menu items
│   └── close action
└── Main Content Area
    ├── MetricCard (overview metrics)
    ├── PortfolioSummary
    ├── RecentActivity
    └── page-specific sections
```

This matches the requirements document: the shell has a persistent header, a navigation region, and a main area for content. The main area is where each dashboard route renders its page-specific widgets.

## 4. Responsive Design

The dashboard should remain simple and readable across multiple screen sizes.

### Mobile

- The `Header` stays visible at the top of the screen.
- The `Sidebar` is hidden to save space.
- A menu button in the header opens `MobileNav`.
- `MobileNav` can slide in from the side or appear as a full-width drawer, depending on the visual design.
- The main content area stacks vertically so cards and summary sections are easy to read on a small screen.
- Users can open a page from the mobile menu without leaving the dashboard shell.

### Tablet

- A compact sidebar may remain visible at the side, or the layout may switch to a narrower navigation rail.
- `MobileNav` still works well for quick navigation when space is limited.
- Main content may use a two-column layout for tiles and summary sections, while keeping enough breathing room for readability.

### Desktop

- The `Sidebar` remains visible and the current route is clearly highlighted.
- The main area can use a more spacious grid with metric cards and summary panels.
- The dashboard feels like a simple investor portal with quick scanning at a glance.

### How `MobileNav` Works

`MobileNav` is the small-screen replacement for the desktop `Sidebar`. It should:

- open from the header menu button
- show the same Home, Portfolio, Deals, and Profile links
- highlight the active page
- close automatically after a user selects a route
- remain easy to understand without extra explanatory text

This keeps the investor experience consistent across desktop and mobile, while avoiding a heavy or cluttered UI.

## 5. Out of Scope

This component architecture intentionally excludes features outside the sprint goals:

- authentication or user login flows
- payments or transaction processing
- backend or database integration
- live investment data or real-time feeds
- production financial calculations
- advanced analytics or complex charts
- admin workflows
- unrelated app features not required by the investor dashboard brief

These components are only for shell structure, placeholder content, and navigation behavior.

## 6. Requirements Alignment

This architecture supports the investor dashboard goals described in the source documents.

### Dashboard Shell and Navigation

The requirements say the app needs:

- a persistent header
- a sidebar or equivalent navigation area
- a main content area
- responsive behavior
- clear navigation among Home, Portfolio, Deals, and Profile

`AppShell`, `Header`, `Sidebar`, and `MobileNav` directly satisfy this requirement. Together they create the shared dashboard shell and support simple navigation without extra complexity.

### Home Overview Requirements

The Home overview page should show:

- portfolio summary information
- sample metrics or mock values
- recent activity or sample updates
- quick links to important sections

`MetricCard`, `PortfolioSummary`, and `RecentActivity` support these goals by creating a visual overview page that is easy to scan.

### Portfolio, Deals, and Profile Requirements

The remaining screens can reuse the same shell and common sections while rendering different content:

- `Portfolio` can use `PortfolioSummary` plus placeholder holdings or table rows.
- `Deals` can use card-like sections and status labels.
- `Profile` can use summary blocks for personal information and account details.

These screens remain clean and easy to understand because they share the same dashboard shell instead of becoming separate full applications.

### Alignment with the Existing App

The current app only has starter route files and no dashboard implementation yet. The planned route structure described in `docs/dashboard-routing-plan.md` acts as the home for this component architecture. The shell is meant to live under the future `/dashboard` route group, while the components provide the reusable presentation layer inside that layout.

This keeps the work aligned with the brief: simpler route planning first, then visual and component structure, without moving past the sprint’s shell-only scope.

## Summary

The planned dashboard architecture is intentionally small and beginner-friendly. It provides a reusable layout for all investor screens while keeping the work focused on navigation, overview widgets, and responsive behavior. The components described here match the requirements in the brief and stay within the scope of a mock-first dashboard shell.
