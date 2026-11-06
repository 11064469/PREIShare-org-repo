# PREIshare — Property Listings Data Model and Auth Boundaries

**Status:** Design proposal for the next PostgreSQL migration and RLS implementation step. No SQL migrations or runtime behavior are implemented by this document.

**Source requirements:** `docs/requirements/sponsor-auth-and-listings-brief.md` and `docs/setup/supabase-env-checklist.md`. The requirements brief explicitly requires sponsor sign-in, protected sessions, PostgreSQL-backed listing reads, sponsor-specific authorization, and server-only secrets. The concrete listing attributes and write permissions below are **proposed design decisions requested for migration planning**, not additional confirmed client requirements.

## 1. Proposed `property_listings` Fields

| Column | PostgreSQL type | Nullability | Purpose / design note |
|---|---|---|---|
| `id` | `uuid` | `NOT NULL` | Primary key; generate a UUID when a listing is created. |
| `sponsor_id` | `uuid` | `NOT NULL` | Owner / authorized sponsor; foreign key to `auth.users(id)`. |
| `title` | `text` | `NOT NULL` | Human-readable property listing title. |
| `address` | `text` | `NULL` | Street address; optional pending privacy and address requirements. |
| `city` | `text` | `NOT NULL` | City of the property. |
| `region` | `text` | `NULL` | State, province, or region, where applicable. |
| `postal_code` | `text` | `NULL` | Postal or ZIP code; text preserves leading zeros and international formats. |
| `country` | `text` | `NOT NULL` | Country of the property; precise format to be confirmed. |
| `price` | `numeric(14,2)` | `NULL` | Proposed monetary amount; currency and meaning (asking price, valuation, etc.) are unresolved. If present, require nonnegative values. |
| `status` | `text` | `NOT NULL` | Listing status; allowable values and default must be approved before migration. |
| `created_at` | `timestamptz` | `NOT NULL` | Creation timestamp, populated by the database. |
| `updated_at` | `timestamptz` | `NOT NULL` | Last-modified timestamp, maintained by trusted database logic. |

**Proposed constraints:** `id` is the primary key; `sponsor_id` references `auth.users(id)`; `price` must be nonnegative when present. The database should assign `created_at` and maintain `updated_at` so the browser cannot forge audit timestamps. The precise status values, currency representation, and Auth-user deletion behavior remain open questions; do not invent them in the migration.

**Design assumptions:** One listing belongs to one sponsor, represented by `sponsor_id`. Required `title`, `city`, `country`, and `status` are proposed to make a minimally usable listing; the brief itself does not specify those fields or their nullability. The migration should confirm these assumptions rather than treat them as established client requirements.

## 2. Ownership Relationship to Supabase Auth

- `property_listings.sponsor_id` is a required UUID foreign key referencing `auth.users(id)`.
- The server obtains the signed-in user's identity from the validated Supabase Auth session. A browser-supplied `sponsor_id` is not proof of authorization.
- For sponsor-scoped database operations, PostgreSQL evaluates the authenticated request context using `auth.uid()` and compares it with `property_listings.sponsor_id`.
- Proposed server create actions assign `sponsor_id` from the authenticated session, not from a form field. RLS independently verifies the inserted row's owner.
- A one-owner-per-listing model is an assumption. Shared viewing permissions, a distinct sponsor role/approval model, and assignment of existing listings require further requirements before implementation.
- The behavior when an `auth.users` record is deleted (restrict, cascade, or reassignment) is unresolved; do not select an `ON DELETE` behavior without a decision.

## 3. Proposed Row Level Security (RLS) Rules

Enable RLS on `property_listings`. Policies apply to the `authenticated` database role; anonymous users receive no listing access. The owner checks below are the **proposed own-row policies** for migration planning. They do not establish that the client has approved sponsor write features.

| Operation | Proposed RLS condition | Effect |
|---|---|---|
| `SELECT` | `USING (auth.uid() IS NOT NULL AND sponsor_id = auth.uid())` | A signed-in sponsor sees only their own listing rows. Other sponsors' rows are not returned. |
| `INSERT` | `WITH CHECK (auth.uid() IS NOT NULL AND sponsor_id = auth.uid())` | A sponsor can create only a row owned by their authenticated user ID. A forged owner ID is rejected. |
| `UPDATE` | `USING (auth.uid() IS NOT NULL AND sponsor_id = auth.uid())` **and** `WITH CHECK (auth.uid() IS NOT NULL AND sponsor_id = auth.uid())` | The existing row must belong to the sponsor and the resulting row must still belong to that sponsor; ownership cannot be transferred by changing `sponsor_id`. |
| `DELETE` | `USING (auth.uid() IS NOT NULL AND sponsor_id = auth.uid())` | A sponsor can delete only a row they own, **if** deletion is authorized as a product feature. |

**Authorization boundary:** Database RLS, not React filtering or a hidden UI control, must enforce access. Requests without a valid authenticated identity must not access private listings. Direct attempts to read or modify another sponsor's listing must be denied by the database, even when someone bypasses the dashboard UI. Database grants and policies must be configured consistently; RLS does not replace authentication, session validation, or least-privilege database access.

**Important limitation:** The brief does not define how a user is designated or approved as a *sponsor*. Ownership-based RLS alone distinguishes users, not approved sponsors. Before enabling `INSERT`, `UPDATE`, or `DELETE`, confirm the sponsor authorization model and whether each write operation is permitted. The original brief explicitly requires read access; write policies above are proposed because the schema assessment asks for migration-ready boundaries.

## 4. Server vs. Browser Operation Map

| Operation or value | Browser responsibility | Server / database responsibility |
|---|---|---|
| Sign in / sign out | Show email/password sign-in and sign-out UI; use only public Supabase configuration. | Supabase Auth establishes and invalidates sessions; protected server routes validate session identity. |
| List/read authorized property listings | Render returned rows; never enforce access by filtering a full dataset in React. | A TanStack Start **server loader** obtains the user session, performs a user-scoped PostgreSQL/Supabase query, and returns only rows allowed by RLS. Do not trust a client-supplied sponsor ID. |
| Create a property listing (proposed future capability) | Submit validated listing inputs; do not choose or assert the owner. | A TanStack Start **server action/function** validates the session and inputs, sets `sponsor_id` from the authenticated user, and inserts using the user-scoped database context. RLS `INSERT WITH CHECK` verifies ownership. Enable only when authorized. |
| Update a property listing (proposed future capability) | Submit permitted field changes and listing ID; never submit privileged credentials. | A **server action/function** validates the session, checks the target listing through user-scoped access, and updates under RLS `UPDATE USING` and `WITH CHECK`; prevent unauthorized owner or audit-field changes. Enable only when authorized. |
| Delete a property listing (proposed future capability) | Request deletion only if a confirmed feature exists. | A **server action/function** uses the validated session and owner-scoped RLS `DELETE USING`. Do not implement until authorized. |
| Public Supabase configuration | `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` may be included in browser code. Public keys are not authorization controls. | May also use public configuration with a user-scoped session. RLS must be enabled before browser access to private data. |
| Privileged credentials | **Never** use `SUPABASE_SECRET_KEY`, service-role keys, PostgreSQL passwords/connection strings, signing secrets, or private API keys in browser code or `VITE_` variables. | Keep secrets only in trusted server configuration. Do not use a service-role/privileged key for routine sponsor-scoped access because privileged access may bypass RLS. |

**Data boundary:** The brief identifies hardcoded mock data in `src/components/dashboard/DealsList.tsx`, `PortfolioTable.tsx`, and `ProfileCard.tsx`. For **property listings**, the future implementation must read authorized PostgreSQL rows instead of browser mock listings. The brief does not define replacement data sources for every unrelated dashboard metric or profile field; do not invent them. Preserve the existing dashboard routes and responsive design.

### Out of scope for this schema design

- Property images, uploads, media storage, and image permissions.
- Search, filtering, ranking, geolocation, and advanced discovery features.
- Payments, investments, and an administrative management system.
- Implementing SQL migrations, RLS policies, or authentication in this documentation step.
- Replacing the dashboard design or deploying a production database as part of this design exercise.

### Open questions before migrations and feature implementation

1. Which proposed property fields are actually required by the client, and what validation limits apply (title length, country format, address privacy)?
2. What does `price` represent, which currency is used, and should currency have its own column?
3. What values may `status` contain, and what is its default or transition workflow?
4. How are sponsor accounts designated, approved, or assigned listings? Is a separate sponsor role/table needed?
5. Can more than one sponsor be authorized to view the same listing?
6. Are sponsors permitted to create, edit, or delete listings? The original brief requires read access but does not explicitly authorize writes.
7. What happens to owned listings if a sponsor's `auth.users` record is deleted?
8. What validation, audit, and server-side timestamp update mechanism should the migration use?

**Next step:** After these decisions are confirmed, translate this design into a PostgreSQL migration, grants, RLS policies, and tests demonstrating cross-sponsor isolation. No SQL `CREATE TABLE` statements are included here.
