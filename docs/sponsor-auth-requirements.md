# PREIshare Sponsor Authentication Requirements

## 1. Client Story and Purpose

PREIshare sponsors need to sign in securely, reach protected dashboard information, view property listings they are authorized to see, and sign out. Property listings must come from PostgreSQL rather than hardcoded listing data. The application must protect each sponsor's information and keep private credentials out of the browser.

This document combines the original client story in [docs/requirements/sponsor-auth-and-listings-brief.md](requirements/sponsor-auth-and-listings-brief.md), the planning lists supplied for this assignment, and the supplemental sponsor property-creation requirement supplied for this document. The original brief defines the baseline product requirements; the supplemental requirement adds sponsor-owned property creation. Technical choices not specified by these requirements are identified as assumptions or open questions below.

## 2. Actors

- **Sponsor:** A person who signs in and views property listings they are authorized to access.
- **Signed-out visitor:** A person who does not have a valid signed-in session and may try to open a protected dashboard page.
- **Application server and database:** The application server verifies the signed-in user's identity and permissions. PostgreSQL stores the property listings and enforces the applicable data-access rules.

## 3. Sponsor Goals

- Sign in with valid credentials.
- Access protected dashboard information while signed in.
- View authorized property listings stored in PostgreSQL.
- Sign out and lose access to protected dashboard information until signing in again.

## 4. Functional Requirements

**FR-1 — Sign in:** The application must allow a sponsor to sign in with a valid email address and password. Invalid credentials must not create an authenticated session or grant access.

**FR-2 — Session management and sign-out:** The application must maintain the sponsor's authenticated session for protected requests and provide a way to sign out. After sign-out, a request to protected dashboard information must be treated as unauthenticated.

**FR-3 — Protected dashboard:** Before returning protected dashboard information, the application must verify that the request has a valid authenticated session. A signed-out visitor who requests `/dashboard` must be redirected to the login page without receiving protected dashboard data.

**FR-4 — PostgreSQL property listings:** When a signed-in sponsor requests property listings, the application must retrieve authorized listings from PostgreSQL. It must not substitute hardcoded mock listing data for the database result.

**FR-5 — Sponsor-specific authorization:** The application must return only property listings the authenticated sponsor is authorized to access. The authorization decision must be enforced by the server or database, not only by hiding or filtering rows in the browser.

**FR-6 — Sponsor property creation:** A signed-in sponsor must be able to create a property listing. The application must validate the listing information and save the property in PostgreSQL. The server must determine the new property's `sponsor_id` from the authenticated sponsor's session, not from a sponsor ID submitted by the browser. PostgreSQL row-level security (RLS) must prevent a sponsor from creating a property owned by another sponsor.

The original client brief does not specify property fields, listing editing or deletion permissions, or a sponsor approval workflow. This requirements document therefore does not define those as product requirements. FR-6 is the supplemental sponsor property-creation requirement supplied for this document.

## 5. Security Requirements

**SEC-1 — Reject invalid credentials:** Invalid email/password credentials must not authenticate a visitor or permit access to protected dashboard information.

**SEC-2 — Protect signed-out requests:** A signed-out request for protected information must not receive that information. In particular, `/dashboard` must redirect to login without returning protected data.

**SEC-3 — Isolate sponsor listings:** A sponsor must not receive another sponsor's private property listings. The server or database must enforce this rule for listing requests, including requests that do not use the normal dashboard interface.

**SEC-4 — Do not trust browser-supplied ownership:** A sponsor ID supplied by browser code or request data must not, by itself, authorize access to listings. The server must verify the authenticated identity and use the server/database authorization boundary to decide which listings can be returned.

**SEC-5 — Enforce listing ownership on create:** When a sponsor creates a listing, the server must set its owner from the verified session. PostgreSQL RLS must reject an insert that attempts to assign the listing to another sponsor.

**SEC-6 — Protect private credentials:** Database passwords and connection strings, privileged Supabase keys, authentication signing secrets, private API keys, and other server-only environment values must not appear in browser-facing source or browser bundles.

**SEC-7 — Protect credentials in Git:** Real private credentials must not be added to Git-tracked files. Example environment files may contain placeholders only.

## 6. Out of Scope

- Payments or investment processing.
- An administrative management system or administrator features.
- Public APIs that allow unauthenticated users to create, edit, or delete property listings.
- Replacing the existing dashboard design.
- Deploying a production database as part of this requirements assignment.
- Choosing listing fields, allowed status values, currency rules, or sponsor approval rules that the client has not specified.

## 7. Acceptance Criteria

These criteria describe observable behavior to verify. They are requirements, not claims that testing has already been completed.

1. **Valid sign-in:** A test sponsor enters valid credentials and is granted an authenticated session.
2. **Invalid sign-in:** A test sponsor enters invalid credentials and is not granted an authenticated session or access to protected dashboard information.
3. **Signed-out dashboard access:** With no valid session, a request to `/dashboard` redirects to the login page and returns no protected dashboard data.
4. **Signed-in dashboard access:** With a valid session, a sponsor can access the protected dashboard information that they are authorized to view.
5. **Database-backed listing read:** With an authorized sponsor session and PostgreSQL listing data available, the application returns that sponsor's authorized listing data rather than hardcoded mock listings.
6. **Sponsor property creation:** Sponsor A signs in and creates a property with valid listing information. The property is saved in PostgreSQL and its `sponsor_id` matches Sponsor A's authenticated identity.
7. **Create ownership enforcement:** Sponsor B cannot create a property using Sponsor A's identity or access Sponsor A's private property by supplying its ID. Verify ownership enforcement with two distinct sponsor accounts and user-scoped sessions.
8. **Cross-sponsor listing isolation:** With two distinct sponsor accounts and a listing owned by the first account, the second account's listing request does not return the first account's private listing.
9. **No browser owner override:** Changing a sponsor ID in browser-controlled request data does not grant access to another sponsor's listing.
10. **Sign-out:** After a sponsor signs out, a subsequent request to protected dashboard information is redirected to login or otherwise denied without returning protected data.
11. **Credential exposure:** A review of browser-facing source and generated browser assets finds no database passwords or privileged credentials. A review of Git-tracked files finds no real private credentials; `.env.example` contains placeholders only.
12. **Existing dashboard:** Authentication and listing changes do not replace the existing dashboard design or make its existing pages unusable. Verify the supported dashboard pages remain functional and responsive.

Passing a source-code review or build alone does not demonstrate live database, authentication, or two-sponsor authorization behavior. Record observed results separately from implementation evidence.

## 8. Open Questions

The following are not settled by the original brief and require stakeholder or technical decisions before they are treated as requirements:

- How are sponsor accounts created? Is self-service signup allowed, or are accounts provisioned another way?
- Does a signed-in account automatically qualify as a sponsor, or must sponsors be separately approved? If approval is required, where is it recorded and how is it enforced?
- Can more than one sponsor access the same listing, or does each listing have one owner?
- Which property fields are needed, and which are required?
- Which listing status values and status transitions are allowed?
- What does a listing's price represent, and which currency or currencies may be used?
- Which property fields and validation rules apply when a sponsor creates a listing?
- Are sponsors allowed to edit or delete listings? The original brief does not specify these permissions.
- What should happen to a sponsor's listings if their account is deleted?
- Which email-confirmation behavior and sign-in error messages should users see?

### Technical design assumptions to confirm

- The existing application is built with TanStack Start, React, and TypeScript. This is repository context, not a requirement to replace or redesign the dashboard.
- The client brief calls for PostgreSQL and sponsor authentication but does not require a specific authentication provider. Supabase Auth and the current Supabase/PostgreSQL integration are implementation choices; confirm them if the client requires a different provider or deployment arrangement.
- Server-side session checks and PostgreSQL row-level security are suitable ways to satisfy the requirement that authorization be enforced outside browser-only filtering. The exact policy design must be verified against the approved sponsor and shared-access rules.
