# PREIshare — Sponsor Authentication and Property Listings Requirements Brief

## 1. Client Story

PREIshare sponsors need to securely sign in and access their property listings stored in a PostgreSQL database. Private credentials, database passwords, and secret keys must stay on the server and never be included in the browser bundle.

## 2. Actors

- **Sponsor:** Signs in with an email address and password and views property listings they are authorized to access.
- **PREIshare application:** Authenticates sponsors, manages sessions, and retrieves authorized property listings.
- **Database:** Stores sponsor and property listing records in PostgreSQL.

## 3. Goals

The goal is to prepare the existing PREIshare dashboard for secure sponsor authentication and real property data.

Sponsors should be able to sign in, view their authorized listings, and sign out without exposing private information.

## 4. Current Dashboard Observations

The existing application uses TanStack Start, React, and TypeScript.

The following routes already exist:

- `/dashboard` — Home
- `/dashboard/portfolio` — Portfolio
- `/dashboard/deals` — Deals
- `/dashboard/profile` — Profile

The source-code review identified mock data in:

- `src/components/dashboard/DealsList.tsx`
- `src/components/dashboard/PortfolioTable.tsx`
- `src/components/dashboard/ProfileCard.tsx`

The file `src/lib/user.ts` references user sessions, but the review has not established that real sponsor authentication is implemented.

The source-code search did not identify an existing Supabase or PostgreSQL integration.

## 5. In Scope for This Sprint

- Document sponsor authentication requirements.
- Define protected sponsor sessions and sign-out behavior.
- Specify property listings stored in PostgreSQL.
- Define sponsor-specific authorization rules.
- Identify information that must remain server-only.
- Establish measurable success criteria for future implementation.

## 6. Out of Scope

- Building the complete authentication system during this requirements exercise.
- Processing payments or investments.
- Implementing an administrative management system.
- Replacing the existing dashboard design.
- Deploying a production database during this requirements exercise.

## 7. Functional Requirements

**FR-1: Sponsor Sign-In**

Sponsors must be able to sign in using a valid email address and password.

**FR-2: Session Management**

The application must securely manage authenticated sessions and support sign-out.

**FR-3: Protected Access**

Unauthenticated visitors must not be able to view protected sponsor information.

**FR-4: Real Property Listings**

Property listings must be retrieved from PostgreSQL instead of hardcoded mock data when integration is implemented.

**FR-5: Sponsor Authorization**

Each sponsor must only be able to access property listings they are authorized to view. Authorization must be enforced on the server or database.

## 8. Server-Only Security Boundary

The following information must never be included in client-side code or the browser bundle:

- PostgreSQL database passwords and connection strings.
- Supabase service-role or other privileged keys.
- Authentication signing secrets.
- Private API keys.
- Server-only environment variables.

The server must verify the authenticated sponsor's identity and permissions before returning private listings. The application must not rely solely on client-side filtering or a sponsor ID supplied by the browser.

## 9. Success Criteria

The future implementation must demonstrate that:

1. A sponsor can sign in using valid credentials.
2. Invalid credentials do not grant access.
3. Unauthenticated users cannot access protected sponsor information.
4. Authenticated sponsors can view listings retrieved from PostgreSQL.
5. Sponsors cannot access another sponsor's private listings.
6. Signing out prevents continued access to protected information.
7. Database passwords and privileged keys are absent from the browser bundle.
8. The existing dashboard pages remain functional and responsive.

## 10. Next Steps

This requirements brief will guide future development of sponsor authentication, PostgreSQL data models, server-side access, and authorization testing.

The next implementation phase should preserve the existing PREIshare dashboard while replacing mock information with authorized database-backed data.