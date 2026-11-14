# Sprint 4 Authentication and Listings: Technical Handoff

## 1. Project overview and original client story

PREIshare's original client story is that sponsors need to sign in securely, view property listings they are authorized to access, and sign out. Listings are to be stored in PostgreSQL rather than supplied as hardcoded mock data. A protected session and server- or database-enforced authorization must prevent a sponsor from accessing another sponsor's private listings. Database passwords, service-role or other privileged keys, signing secrets, and other private configuration must never reach browser code.

The original requirements are documented in [docs/requirements/sponsor-auth-and-listings-brief.md](../requirements/sponsor-auth-and-listings-brief.md). That brief explicitly calls for authentication, protected sponsor information, PostgreSQL-backed listing reads, and sponsor-specific authorization. It does not define detailed property fields, sponsor approval rules, shared access, or listing write permissions.

The current implementation adds Supabase Auth routes and a property listings flow while retaining the existing dashboard structure. Implementation does not establish that the database migration has been applied or that deployed row-level security (RLS) has passed a two-user test.

## 2. Delivered functionality versus client requirements

| Original requirement | Delivered implementation | Supporting file or evidence | Verification status | Remaining work |
|---|---|---|---|---|
| FR-1: Sponsors sign in with email and password. | Signup and login pages use the browser Supabase client. Signup handles the configured email-confirmation case and uses a callback route to exchange the confirmation code. | [src/routes/auth/signup.tsx](../../src/routes/auth/signup.tsx), [src/routes/auth/login.tsx](../../src/routes/auth/login.tsx), [src/routes/auth/callback.tsx](../../src/routes/auth/callback.tsx) | **PASS** for User A signup/login/signout, user-reported; no detailed test evidence was attached. | Re-run with retained, redacted evidence and confirm the target Supabase Auth email-confirmation and redirect configuration. |
| FR-2: Sessions are managed securely and users can sign out. | Supabase SSR browser cookies carry the session between browser activity and TanStack Start server requests. Server helpers validate the user; sign-out clears the Supabase session. | [src/lib/supabase/client.ts](../../src/lib/supabase/client.ts), [src/lib/supabase/server.ts](../../src/lib/supabase/server.ts), [src/lib/auth/session.ts](../../src/lib/auth/session.ts) | **PASS** for User A signup/signout/login, user-reported; the report does not include step-by-step evidence. | Reproduce and record session behavior, including email confirmation and subsequent protected-route access after sign-out. |
| FR-3: Signed-out visitors cannot view protected sponsor information. | The dashboard parent route checks the current user on the server before rendering its child routes and redirects unauthenticated visitors to `/auth/login`. | [src/routes/dashboard/route.tsx](../../src/routes/dashboard/route.tsx), [src/lib/auth/session.ts](../../src/lib/auth/session.ts) | **PASS** for the signed-out redirect, user-reported; no browser trace or response evidence was attached. | Retain a repeatable browser or automated test showing the redirect and absence of protected content. |
| FR-4: Listing reads use real PostgreSQL-backed data rather than hardcoded listing data. | The migration defines `public.property_listings`. A server function queries it; the listings page loads through that function and renders real results or loading/error/empty states. A create server function and form are also implemented. | [supabase/migrations/20250321000000_property_listings.sql](../../supabase/migrations/20250321000000_property_listings.sql), [src/server/listings.ts](../../src/server/listings.ts), [src/routes/dashboard/listings/index.tsx](../../src/routes/dashboard/listings/index.tsx), [src/routes/dashboard/listings/new.tsx](../../src/routes/dashboard/listings/new.tsx) | User A create: **PASS**, user-reported. User A read: **PASS**, user-reported. Migration applied/table existence: **NOT TESTED**. | Verify migration and table in the intended Supabase project; capture redacted evidence of the created row and sponsor-scoped read. |
| FR-5: Sponsors can access only listings they are authorized to view, enforced outside React filtering. | Server operations verify the current user and scope queries by that user's ID. The migration defines RLS ownership policies using `auth.uid()` for SELECT, INSERT, UPDATE, and DELETE. | [src/server/listings.ts](../../src/server/listings.ts), [src/lib/supabase/server.ts](../../src/lib/supabase/server.ts), [supabase/migrations/20250321000000_property_listings.sql](../../supabase/migrations/20250321000000_property_listings.sql) | User B isolation: **NOT TESTED**; the same email was supplied for both test accounts and no visibility observation was recorded. Deployed RLS: **NOT TESTED**. | Verify deployed policies and test with two distinct Auth users using ordinary user-scoped sessions. |
| Server-only credentials stay out of browser code. | The browser client uses the public URL and publishable key. The server helper also uses public credentials with the request's authenticated cookie context; listing operations do not use a service-role key. | [src/lib/supabase/client.ts](../../src/lib/supabase/client.ts), [src/lib/supabase/server.ts](../../src/lib/supabase/server.ts), [.env.example](../../.env.example), [docs/verification/sprint4-auth-listings-checklist.md](../verification/sprint4-auth-listings-checklist.md) | Source/config review: **PASS** within inspected scope. Current environment-file tracking/ignore check: **PASS**. Placeholder template review: **PASS**. Deployed browser bundle and Git history: not fully verified. | Scan built/deployed browser assets and review Git history; rotate any credential confirmed exposed. |

Statuses above reproduce the verification checklist; PASS results for live behavior are user-reported rather than independently evidenced. A checked-in migration and functioning application code do not prove that the migration or policies are deployed.

## 3. Architecture decisions

### Authentication and protected sessions

- Signup and login call Supabase Auth from the browser through the existing `createBrowserSupabaseClient()`. The browser client is configured with the public Supabase URL and publishable key.
- Signup supplies `/auth/callback` as the email-confirmation redirect. If Supabase requires confirmation and does not return a session immediately, the page asks the user to check email. The callback exchanges the returned code for a session, then navigates to the dashboard.
- The SSR browser client stores session state in cookies that can be used by browser Auth and TanStack Start server requests. Cookies use the configured path and `SameSite=Lax`, with `Secure` enabled in production. The server helper reads the request cookies and uses the Supabase SSR client so refreshed Auth cookies can be written back.
- `getCurrentUser()` calls the server-only Supabase helper, which validates a cookie-backed access token with Supabase Auth rather than trusting a stored user object. It returns only the user ID and email needed by dashboard authentication. `signOut()` calls Supabase Auth from a server function to clear the session.
- Server responses from the Supabase helper are marked `private, no-store`; the cookie-refresh callback reapplies those protections after handling refresh headers.
- `src/lib/supabase/server.ts` is marked server-only. Browser-bundled UI must not import it.

### TanStack Start authorization boundary

The `/dashboard` parent route calls `getCurrentUser()` in its server-side `beforeLoad`. If no verified user is returned, it redirects to `/auth/login`; child dashboard routes inherit this protection. This is a server-side gate, not merely a React conditional or client-side redirect.

Listing server functions verify the user again for each operation. `listListings` scopes the query to `sponsor_id` matching that user and orders by newest first. `createListing` derives `sponsor_id` exclusively from the verified session. `updateListing` filters by both listing ID and authenticated sponsor ID. Inputs are validated server-side. The current UI provides listing creation and reading but no edit or delete controls.

### PostgreSQL schema, ownership, and RLS

The original [docs/data-model/property-listings-schema.md](../data-model/property-listings-schema.md) is a design proposal. It labels field choices and writes as proposals, not additional client requirements or stakeholder approvals. The later migration implements a concrete table with:

- UUID `id` primary key and required `sponsor_id` foreign key to `auth.users(id)`.
- Required `title`, `city`, `country`, and `status`; optional `address`, `region`, `postal_code`, and `price`.
- `numeric(14,2)` nonnegative optional price, without a defined currency.
- Database-managed `created_at` and `updated_at`, nonblank checks for required text, an owner/newest index, and `ON DELETE RESTRICT` for the Auth-user foreign key.
- A trigger that resets audit timestamps and prevents changing an existing row's `sponsor_id`.

The migration enables RLS, revokes table access from `PUBLIC` and `anon`, grants table operations to `authenticated`, and declares four ownership policies:

| Operation | Ownership enforcement in the migration |
|---|---|
| SELECT | `USING` requires a non-null `auth.uid()` equal to `sponsor_id`. |
| INSERT | `WITH CHECK` requires a non-null `auth.uid()` equal to the new row's `sponsor_id`. |
| UPDATE | `USING` checks ownership of the existing row and `WITH CHECK` checks ownership of the resulting row. The trigger separately prevents owner changes. |
| DELETE | `USING` requires a non-null `auth.uid()` equal to `sponsor_id`. |

The server verifies the session and scopes each operation; PostgreSQL RLS independently constrains rows. Both layers matter: React filtering can be bypassed, and a server query without a user-scoped identity would not by itself establish the caller's ownership. `auth.uid()` is PostgreSQL's authenticated request identity, not an owner ID trusted from a form. RLS is intended to keep another user's rows inaccessible even if a request bypasses the dashboard UI. This intended boundary has **not** been proven against the deployed database by a two-distinct-user test.

The current database policies identify row owners; they do **not** establish a separate approved-sponsor role. Since the original brief explicitly requires authorized reads but does not approve create, edit, or delete, the migration's write policies and the implemented create/update operations must not be presented as stakeholder-approved product permissions.

### Browser and server Supabase clients

| Context | Client and credentials | Responsibility |
|---|---|---|
| Browser | `createBrowserSupabaseClient()` from `src/lib/supabase/client.ts`, using `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` | Signup, login, email-confirmation exchange, and browser session handling. The publishable key is public configuration, not an authorization control. |
| TanStack Start server | `createServerSupabaseClient()` from `src/lib/supabase/server.ts`, using the same public URL/key plus request cookies | Validate the Auth user and run user-scoped listing operations while preserving RLS. |
| Privileged/server administration | No service-role key is used by normal sponsor listing operations. `SUPABASE_SECRET_KEY` is a privileged server-only variable documented in the template. | Do not use privileged credentials for routine sponsor reads or writes; they may bypass RLS. No administrative operation is claimed as delivered. |

### Property creation and reading

The dashboard listing index calls the `listListings` server function and renders the returned database rows with `ListingCard`. Empty, loading, and error states are present. The new-listing route validates fields with the shared schema, calls `createListing`, reports validation/server errors, and navigates to the listings index after success. The server does not accept an owner ID from the form.

These are implemented paths. The verification checklist records User A's create and read as user-reported PASS, but does not include a listing ID or database trace; it records migration application and deployed RLS as NOT TESTED.

## 4. How to run the project locally

### Prerequisites and setup

1. Install Node.js and npm versions compatible with the project's Vite 8 toolchain. The repository defines npm scripts and includes `package-lock.json`; it does not declare a specific Node version in `package.json`.
2. Use a Supabase project with Auth configured. Add the local callback URL (`http://localhost:3000/auth/callback`) to the project's allowed Auth redirect URLs when email confirmation is enabled.
3. From the repository root, install the locked dependencies:

   ```sh
   npm ci
   ```

4. Create a private local environment file:

   ```powershell
   Copy-Item .env.example .env.local
   ```

   Replace the illustrative placeholders in `.env.local` with the appropriate values from the Supabase project. Do not copy real values into this handoff, source control, or browser code. Keep `SUPABASE_SECRET_KEY` out of browser use and do not add a `VITE_` prefix to it. The current sponsor-scoped client helpers use the public URL and publishable key, not the secret key.
5. Start the development server:

   ```sh
   npm run dev
   ```

   Open `http://localhost:3000`.

The available project commands are `npm run dev`, `npm run build`, `npm run preview`, `npm run generate-routes`, and `npm run typecheck`, as defined in `package.json`.

### Relevant routes

- `/auth/signup` — create an account; if confirmation is required, follow the emailed link.
- `/auth/callback` — exchange the confirmation code and continue to the dashboard.
- `/auth/login` — sign in.
- `/dashboard` — protected dashboard root.
- `/dashboard/listings` — read the authenticated user's listings.
- `/dashboard/listings/new` — create a listing.

### Reproducing the verification

1. Confirm the intended Supabase project and apply the migration exactly once using the project's chosen migration method. Do not assume a repository migration is already deployed.
2. Verify that `public.property_listings`, RLS, and all four policies exist. The SQL checks in [docs/data-model/rls-policy-review.md](../data-model/rls-policy-review.md) cover table/RLS metadata and policy definitions.
3. Create and confirm a test account through `/auth/signup`; sign out and sign in again through `/auth/login`.
4. In a separate signed-out browser/session, open `/dashboard/listings` and verify redirect to `/auth/login` without dashboard content.
5. Sign in as User A, create a listing at `/dashboard/listings/new`, and verify it appears at `/dashboard/listings`.
6. Use a **distinct** User B Auth account and a separate user-scoped session. Attempt to read User A's known row and record explicitly whether it is visible. Verify the two test identities differ. Do not use a service-role or privileged SQL Editor context as proof of ordinary-user RLS.
7. Optionally test reverse ownership and forbidden cross-owner update/delete/insert attempts, using only user-scoped sessions.
8. Retain redacted evidence such as test steps, outcome, and non-sensitive database/query results. Never record passwords, tokens, confirmation links, or secret values.

## 5. Secret hygiene and environment configuration

- `.env.example` contains illustrative placeholders, not actual project credentials. The verification checklist records its placeholder review as **PASS**.
- `.env.local` is for private local configuration. The checklist records that checked real environment files were not tracked and `git check-ignore` confirmed `.env.local` is ignored; that current Git tracking/ignore review is **PASS** within its scope.
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are public Supabase configuration used by the browser client. Their presence in browser code is expected and does not grant authorization; Auth and RLS enforce access.
- `SUPABASE_SECRET_KEY` is privileged. It must remain in trusted server configuration, must not have a `VITE_` prefix, and must never be embedded in client source, public build output, or commits. The sponsor listing operations use the user-scoped server helper and do not use this key.
- The checklist records the inspected browser-source/configuration review as **PASS**, but generated/deployed browser assets were not separately verified. It records Git tracking/ignore behavior as **PASS**, but Git history was not fully audited. Those results do not prove the absence of past or deployed exposure.
- If an actual privileged credential is found in public output or history, treat it as exposed: rotate/revoke it and review the affected deployment and repository history. Do not reproduce the value in issue reports or handoff evidence.

## 6. Verification results and known limitations

The statuses below match [docs/verification/sprint4-auth-listings-checklist.md](../verification/sprint4-auth-listings-checklist.md). Auth and listing behavior marked PASS is user-reported and lacks detailed attached evidence.

| Checklist test | Status | Result and limitation |
|---|---|---|
| 1. Migration applied and `property_listings` table exists | **NOT TESTED** | The migration exists in the repository; no live catalog or Table Editor evidence confirms that it is applied. |
| 2. RLS enabled and four ownership policies present | **NOT TESTED** | The migration defines RLS and four policies, but the deployed project was not verified. |
| 3. User A signup, signout, and login | **PASS** | User-reported result; no detailed observations, logs, or screenshots were attached. |
| 4. Protected dashboard redirect when signed out | **PASS** | User-reported result; no browser trace, response status, or screenshot was attached. |
| 5. User A creates a real listing | **PASS** | User-reported result; no listing identifier or database evidence was attached. |
| 5a. User A reads a real listing | **PASS** | User-reported result; no listing identifier or response/database evidence was attached. |
| 6. User B cannot read User A's listing | **NOT TESTED** | The same email was supplied for both accounts, and no direct visibility observation was recorded. Whether User B could see User A's listing is unknown. |
| 7. Optional reverse ownership test | **NOT TESTED** | No reverse-ownership observation was provided. |
| 8. No privileged credentials exposed in inspected browser-facing source | **PASS** | Limited to inspected source/configuration. Generated browser assets and deployment output were not separately checked. |
| 9. Real environment files excluded from Git | **PASS** | Current tracking/ignore evidence for checked files only; this does not establish a clean Git history. |
| 10. `.env.example` contains placeholders only | **PASS** | The inspected template uses illustrative values and documents the server-only key without a `VITE_` prefix. |

The checklist's RLS section reports no result for whether User B could see User A's listing; this remains unknown. Do not claim that RLS was proven secure through live two-user testing. Ownership-based RLS also does not establish a separate approved-sponsor role. A successful build, static migration review, or source-code review is not evidence that the production database has the expected schema or policies.

## 7. Recommended next-sprint work

1. **Confirm the deployed migration and policies.** Apply the migration once to the intended project, then save redacted evidence that the table exists, RLS is enabled, and SELECT/INSERT/UPDATE/DELETE policies match the intended owner checks. This closes the gap between checked-in SQL and deployed database state.
2. **Complete ownership isolation with two distinct users.** Verify distinct Auth identities, create a known User A listing, and record whether User B can read it using a separate ordinary user session. Include a redacted result and, if practical, test reverse ownership. This is required to demonstrate the core sponsor-specific security story.
3. **Add automated authentication and authorization tests.** Cover signed-out route protection, authenticated listing reads, owner assignment on create, cross-owner access denial, and invalid input. Use isolated test data and user-scoped credentials; do not make privileged bypass part of the proof. A repeatable test report should identify which checks use local mocks versus a real test project.
4. **Confirm sponsor approval and authorization with stakeholders.** Decide whether any authenticated user can become a sponsor, whether an approval/role record is needed, and which actions are allowed. Document the decision and update server/database policies before treating current authenticated-user writes as approved behavior.
5. **Clarify listing fields and business rules.** Decide required fields and limits, country representation, what price means, currency handling, and status values/transitions/defaults. Record approved requirements before adding database constraints or UI behavior.
6. **Expand listing management only after approval.** Confirm whether sponsors can edit or delete, which fields can change, whether deletion is permanent or archival, and how to audit changes. Then design and test the UI/server operations against the approved permissions; do not infer approval from existing policy code.
7. **Complete secret exposure audits.** Scan production browser assets and deployed output for privileged credentials, and review Git history for previously committed secrets. Record redacted evidence; rotate any confirmed exposed key. This supplements, rather than replaces, the already recorded source, tracking, and template reviews.

## 8. Open questions for stakeholders

- **Sponsor approval:** Is every Supabase Auth account a sponsor, or must an account be separately approved? Who approves it, and where is that authorization recorded and enforced?
- **Shared listing access:** Does each listing have exactly one owner, or may multiple sponsors view or manage one listing? If shared, how are access grants created and revoked?
- **Listing permissions:** Are sponsors allowed to create listings? Which fields may they edit? May they delete listings, and should deletion be permanent, soft-delete, or archival? Are there administrator actions?
- **Listing status:** What values are allowed, what is the initial status, and which actors may change status or transition it between values?
- **Price and currency:** What does `price` represent, which currency applies, can listings have different currencies, and what precision/format should be displayed?
- **Ownership on account deletion:** The migration uses `ON DELETE RESTRICT`, which blocks deletion of an Auth account while listings reference it. Should listings be retained, reassigned, archived, or deleted through an approved process?
- **Signup and confirmation:** Is open email/password signup intended for production, which confirmation policy should apply, and what should happen when a confirmation link expires?
- **Additional listing data:** Are address and other property details required, and are there privacy, validation, or access restrictions for those fields?

Until these decisions are confirmed, preserve the current authentication/dashboard architecture, treat the single-owner model and write policies as implementation choices rather than approved business rules, and avoid expanding permissions.
