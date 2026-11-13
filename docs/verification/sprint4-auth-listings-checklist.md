# Sprint 4 Authentication and Listings Verification

This checklist records repository evidence only where available. A migration file, source-code review, or successful build does not prove that the migration was applied to Supabase or that authentication and RLS work against a live project.

## Verification checklist

### 1. Migration applied and `property_listings` table exists

- **Test description:** Confirm the migration has been applied to the intended Supabase project and verify `public.property_listings` exists in PostgreSQL.
- **Expected result:** The target project contains the table with the schema in `supabase/migrations/20250321000000_property_listings.sql`.
- **Actual observed result:** The migration file is present in the repository. No live Supabase catalog or Table Editor evidence was provided; applied state and table existence are unverified.
- **Status:** NOT TESTED
- **Evidence / notes:** Use the Supabase Table Editor or the catalog query in `docs/data-model/rls-policy-review.md`. Do not infer database state from the checked-in migration.

### 2. RLS enabled and four ownership policies present

- **Test description:** Verify RLS is enabled on the deployed table and the SELECT, INSERT, UPDATE, and DELETE own-row policies are installed.
- **Expected result:** RLS is enabled; all four policies apply to authenticated users and constrain rows by `sponsor_id = auth.uid()`.
- **Actual observed result:** The migration declares `ENABLE ROW LEVEL SECURITY` and the four ownership policies. The design review's applied-project and cross-user verification checklist items remain unchecked; deployed policy state is unverified.
- **Status:** NOT TESTED
- **Evidence / notes:** Static migration review confirms intended SQL only. Verify `pg_class.relrowsecurity` and `pg_policies` in the target database. The policies check row ownership; they do **not** establish a separate approved-sponsor role.

### 3. User A signup, signout, and login

- **Test description:** Using a test account, sign up User A, sign out, then log in with the same account.
- **Expected result:** Signup follows the project's configured email-confirmation behavior; signout clears the session; valid credentials restore a session on login.
- **Actual observed result:** No live Supabase Auth interaction or test-account evidence was provided.
- **Status:** NOT TESTED
- **Evidence / notes:** Test manually against the intended Supabase project. Do not record credentials, tokens, or confirmation links here.

### 4. Protected dashboard redirect when signed out

- **Test description:** Open a dashboard route with no authenticated session.
- **Expected result:** The server-side session check redirects the visitor to `/auth/login` before dashboard content is shown.
- **Actual observed result:** The dashboard route source includes a `beforeLoad` check using `getCurrentUser()` and redirects when it returns no user. No browser or HTTP test of the redirect was provided.
- **Status:** NOT TESTED
- **Evidence / notes:** Source inspection is not an end-to-end test. Verify by requesting a protected route with cleared auth cookies.

### 5. User A creates and reads a real listing

- **Test description:** As authenticated User A, create a listing and then load the listings page.
- **Expected result:** The listing is saved in PostgreSQL with User A's authenticated ID as `sponsor_id` and is returned in User A's listing results.
- **Actual observed result:** The server operation source calls `createListing` and `listListings` using the server Supabase client, and the listing page calls `listListings`. No live database write or read was demonstrated.
- **Status:** NOT TESTED
- **Evidence / notes:** Confirm in the target project using an ordinary user-scoped session, not a service-role key.

### 6. User B cannot read User A's listing

- **Test description:** Sign in as a separate User B and attempt to retrieve User A's listing.
- **Expected result:** User B receives no User A rows; PostgreSQL RLS enforces isolation independently of UI filtering.
- **Actual observed result:** No two-user live RLS test evidence was provided.
- **Status:** NOT TESTED
- **Evidence / notes:** Test with two distinct authenticated users and user-scoped requests. A privileged SQL Editor session is not evidence that RLS works for ordinary users.

### 7. Optional reverse ownership test

- **Test description:** As User B, create a listing and verify User B can read it while User A cannot.
- **Expected result:** The listing is owned by User B and visible only in User B's authorized results.
- **Actual observed result:** No reverse-ownership test evidence was provided.
- **Status:** NOT TESTED
- **Evidence / notes:** Optional but recommended to catch asymmetric test/setup mistakes.

### 8. No privileged credentials exposed in browser code

- **Test description:** Inspect browser-facing source and generated public assets for service-role or `SUPABASE_SECRET_KEY` use.
- **Expected result:** Browser code and bundles contain no privileged credentials or privileged-key usage; only the Supabase URL and publishable key are configured for browser access.
- **Actual observed result:** The inspected route/component source contained no privileged-key references. The Supabase client helpers use `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`; the server helper also uses the user-scoped cookie session. No real key values are included in this report.
- **Status:** PASS
- **Evidence / notes:** This is a source/configuration review, not proof about deployment infrastructure or runtime secrets. The service-role key must not be used for normal sponsor-scoped listing operations.

### 9. Real environment files excluded from Git

- **Test description:** Check whether `.env` and `.env.local` are tracked and whether `.env.local` is ignored.
- **Expected result:** Real environment files are untracked and ignored; only an example template may be committed.
- **Actual observed result:** `git ls-files` returned `.env.example` only for the checked env paths; `git check-ignore` confirmed `.env.local` is ignored by `.gitignore`.
- **Status:** PASS
- **Evidence / notes:** This verifies current Git index/ignore state for the checked paths; continue to keep real environment files out of commits.

### 10. `.env.example` contains placeholders only

- **Test description:** Review `.env.example` without exposing or copying real local values.
- **Expected result:** Public variables and server-only secret variables contain illustrative placeholders only, never actual project credentials.
- **Actual observed result:** The inspected file uses placeholder values for the project URL, publishable key, and server-only secret key.
- **Status:** PASS
- **Evidence / notes:** `.env.example` documents `SUPABASE_SECRET_KEY` as server-only and without a `VITE_` prefix. Keep real secret values only in ignored local/deployment configuration.

## Manual confirmation still required

- Confirm the migration is applied to the intended Supabase project and the table exists.
- Verify deployed RLS state and all four policies, then test access using separate User A and User B accounts.
- Exercise signup, configured email confirmation, signout, login, and the signed-out dashboard redirect.
- Create/read a real listing as User A, verify User B isolation, and optionally run the reverse ownership test.
- Repeat privileged-key checks for any deployment-specific browser assets and configuration before release.
