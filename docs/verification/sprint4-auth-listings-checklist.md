# Sprint 4 Authentication and Listings Verification

This checklist records repository evidence only where available. A migration file, source-code review, or successful build does not prove that the migration was applied to Supabase or that authentication and RLS work against a live project.

## User-reported Sprint 4 test accounts

- **User A email:** `dorcask.kuwa17@gmail.com`
- **User B email supplied:** `dorcask.kuwa17@gmail.com`
- **Important limitation:** The same email was supplied for both users. The distinctness of the Auth accounts is unconfirmed, so this report does not count the User B isolation result as a verified two-user test.
- No passwords, API keys, access tokens, or secret values are included.

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
- **Actual observed result:** The migration declares `ENABLE ROW LEVEL SECURITY` and the four ownership policies. The design review's applied-project verification item remains unchecked; deployed policy state is unverified.
- **Status:** NOT TESTED
- **Evidence / notes:** Static migration review confirms intended SQL only. Verify `pg_class.relrowsecurity` and `pg_policies` in the target database. The policies check row ownership; they do **not** establish a separate approved-sponsor role.

### 3. User A signup, signout, and login

- **Test description:** Using a test account, sign up User A, sign out, then log in with the same account.
- **Expected result:** Signup follows the project's configured email-confirmation behavior; signout clears the session; valid credentials restore a session on login.
- **Actual observed result:** User reported this test as PASS for User A (`dorcask.kuwa17@gmail.com`). No step-by-step observations, logs, or screenshots were supplied.
- **Status:** PASS
- **Evidence / notes:** User-reported result only. No credentials, tokens, or confirmation links are recorded here.

### 4. Protected dashboard redirect when signed out

- **Test description:** Open a dashboard route with no authenticated session.
- **Expected result:** The server-side session check redirects the visitor to `/auth/login` before dashboard content is shown.
- **Actual observed result:** User reported the signed-out redirect test as PASS. The expected redirect is `/auth/login`; no browser trace, response status, or screenshot was supplied.
- **Status:** PASS
- **Evidence / notes:** User-reported result. The dashboard route also contains a server-side `beforeLoad` check using `getCurrentUser()`, but source inspection alone is not the live test evidence.

### 5. User A creates a real listing

- **Test description:** As authenticated User A, create a property listing.
- **Expected result:** The listing is saved in PostgreSQL with User A's authenticated ID as `sponsor_id`.
- **Actual observed result:** User reported that User A created a property successfully. No listing identifier, database confirmation, logs, or screenshot were supplied.
- **Status:** PASS
- **Evidence / notes:** User-reported result for `dorcask.kuwa17@gmail.com`. Confirm with ordinary user-scoped access, not a service-role key, if auditable database evidence is required.

### 5a. User A reads a real listing

- **Test description:** As authenticated User A, open the listings page and confirm the created property is returned.
- **Expected result:** User A sees the real listing associated with User A's authenticated ID.
- **Actual observed result:** User reported that User A read a property successfully. No listing identifier, response data, logs, or screenshot were supplied.
- **Status:** PASS
- **Evidence / notes:** User-reported result for `dorcask.kuwa17@gmail.com`. The application source uses `listListings`; live database evidence was not attached.

### 6. User B cannot read User A's listing

- **Test description:** Sign in as a separate User B and attempt to retrieve User A's listing.
- **Expected result:** User B receives no User A rows; PostgreSQL RLS enforces isolation independently of UI filtering.
- **Actual observed result:** User marked this test PASS, but both User A and User B were reported with the same email (`dorcask.kuwa17@gmail.com`), and the supplied observation did not state whether User B could see User A's listing. A distinct second Auth identity and the visibility result therefore cannot be confirmed.
- **Status:** NOT TESTED
- **Evidence / notes:** Limitation: the two account fields have the same email and no direct visibility result was provided. Next investigation: confirm a distinct User B account, sign in with a separate user-scoped session, and query for User A's known listing. Handoff follow-up: record whether the row was returned (and a redacted query/result or screenshot) and verify the two authenticated user IDs differ. Do not use a privileged SQL Editor session as proof of ordinary-user RLS.

### 7. Optional reverse ownership test

- **Test description:** As User B, create a listing and verify User B can read it while User A cannot.
- **Expected result:** The listing is owned by User B and visible only in User B's authorized results.
- **Actual observed result:** No reverse-ownership observation was provided.
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
- Verify deployed RLS state and all four policies.
- Confirm User B is a distinct Auth account, then rerun the isolation test and explicitly record whether User B could see User A's listing.
- If auditable evidence is required, retain redacted evidence for the user-reported PASS results: signup/confirmation/signout/login, signed-out redirect, and User A create/read.
- Optionally run the reverse ownership test.
- Repeat privileged-key checks for any deployment-specific browser assets and configuration before release.
