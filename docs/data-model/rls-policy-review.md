# PREIshare — Property Listings Migration and RLS Policy Review

**Migration:** `supabase/migrations/20250321000000_property_listings.sql`  
**Design source:** `docs/data-model/property-listings-schema.md`  
**Status:** SQL drafted and statically reviewed. **Not yet applied to a Supabase project or committed to GitHub.**

## 1. Schema and ownership review

The migration creates `public.property_listings` with the following fields and nullability, matching the proposed design:

| Column | PostgreSQL type | Nullability | Database behavior |
|---|---|---|---|
| `id` | `uuid` | NOT NULL | Primary key, default `gen_random_uuid()` |
| `sponsor_id` | `uuid` | NOT NULL | Foreign key to `auth.users(id)`; listing owner |
| `title` | `text` | NOT NULL | Must not be blank |
| `address` | `text` | NULL | Optional street address |
| `city` | `text` | NOT NULL | Must not be blank |
| `region` | `text` | NULL | Optional state/province/region |
| `postal_code` | `text` | NULL | Optional; text preserves leading zeroes |
| `country` | `text` | NOT NULL | Must not be blank |
| `price` | `numeric(14,2)` | NULL | Must be nonnegative if provided |
| `status` | `text` | NOT NULL | Must not be blank; no assumed enum or default |
| `created_at` | `timestamptz` | NOT NULL | Default `now()`; database resets on INSERT and preserves on UPDATE |
| `updated_at` | `timestamptz` | NOT NULL | Default `now()`; database refreshes on INSERT and UPDATE |

The `property_listings_sponsor_created_at_idx` index supports fetching one sponsor's listings newest first. The primary key automatically indexes `id`. A trigger maintains audit timestamps and rejects changing `sponsor_id` on existing rows. `ON DELETE RESTRICT` prevents deleting an Auth user while listings still reference that user.

**Explicit design decisions for this migration:**

1. **Ownership:** Each listing has exactly one sponsor, identified by `sponsor_id = auth.users.id`. This is a proposed single-owner model, not an approved multi-sponsor permission scheme.
2. **Read:** Authenticated users can read only their own listings; anonymous users cannot read private listings.
3. **Write:** The database defines own-row INSERT, UPDATE, and DELETE policies because the migration assignment requires them. The original client brief only explicitly authorizes reading. **Do not expose sponsor create/edit/delete UI until product approval and sponsor eligibility checks are defined.** At the database level, any authenticated user with a matching owner ID can perform these operations; RLS does not independently prove a special sponsor role.
4. **Delete:** Own-row DELETE is included as a proposed policy; no cross-owner delete is allowed. No soft-delete or archival requirement was supplied.
5. **Status:** A nonblank status is required, but no default or fixed allowed values are invented. A caller must provide it; allowed values and transitions remain an open question.
6. **Auth-user deletion:** Use `ON DELETE RESTRICT` rather than silent cascade deletion. This intentionally blocks deleting a sponsor's Auth record while listings exist until a retention/reassignment process is approved.
7. **Price:** Optional nonnegative `numeric(14,2)` without an invented currency; currency meaning and validation remain unresolved.

## 2. Plain-language RLS policy review

RLS is enabled with `ALTER TABLE public.property_listings ENABLE ROW LEVEL SECURITY`. Table privileges are revoked from `PUBLIC` and `anon`, and granted to `authenticated`; grants do **not** override row policies. There are four separate policies:

| Policy | SQL boundary | Explanation |
|---|---|---|
| `property_listings_select_own` | `SELECT ... USING (auth.uid() IS NOT NULL AND sponsor_id = auth.uid())` | A signed-in user sees only rows whose sponsor ID matches their verified Auth identity. Other owners' rows are invisible. |
| `property_listings_insert_own` | `INSERT ... WITH CHECK (auth.uid() IS NOT NULL AND sponsor_id = auth.uid())` | A new row can be inserted only with the authenticated user's ID as owner. A forged `sponsor_id` fails. |
| `property_listings_update_own` | `UPDATE ... USING (...) WITH CHECK (...)` with the same non-null Auth and owner match on both | The existing row must belong to the caller, and the updated row must still belong to the caller. The audit trigger additionally blocks changing `sponsor_id`. |
| `property_listings_delete_own` | `DELETE ... USING (auth.uid() IS NOT NULL AND sponsor_id = auth.uid())` | A user can delete only their own row, if the future product feature is authorized. |

These policies apply to the `authenticated` role, not `anon`. `auth.uid()` is the authenticated database request's user ID; it is **not** a browser-supplied `sponsor_id`. RLS is enforced by PostgreSQL even if someone bypasses the React dashboard. A privileged/service-role database client may bypass RLS, so it must **not** be used for normal sponsor listing operations.

## 3. Server vs. browser operation map

| Operation | Browser | Server / database |
|---|---|---|
| Sign in and sign out | Displays forms; uses public Supabase URL and publishable key. | Supabase Auth establishes/invalidates the session; protected server code validates the session. |
| List/read listings | Displays authorized results, not a full unfiltered dataset. | TanStack Start **server loader** validates the user session and queries with a **user-scoped** Supabase client; `SELECT` RLS limits rows. |
| Create listing (proposed) | Submits title/location/price/status; must not choose a trusted owner ID. | TanStack Start **server action** validates the session and inputs, sets `sponsor_id` from the verified user ID, uses a **user-scoped** client, and relies on `INSERT WITH CHECK` as an independent ownership boundary. |
| Update listing (proposed) | Submits listing ID and permitted edits. | A **server action** validates the session, uses a **user-scoped** client, and relies on `UPDATE USING` and `WITH CHECK`; it does not accept owner/audit-field changes. |
| Delete listing (proposed) | Requests deletion only if the feature is approved. | A **server action** validates the session, uses a **user-scoped** client, and relies on `DELETE USING`. |
| Privileged credentials | Never receive `SUPABASE_SECRET_KEY`, service-role keys, database passwords, or private signing keys; never place these in `VITE_` variables. | Keep secrets only in trusted server settings; **do not use service-role/privileged credentials for routine listing reads or writes**, because they may bypass RLS. |

**Important boundary:** A cookie is not an authorization rule. The server must validate the session and create its Supabase client in the **authenticated user's context**, forwarding the correct access token/cookie as required by the chosen integration. Merely using a public/publishable key in server code without forwarding the user identity is insufficient. RLS provides a second check on ownership. Authenticated direct browser API calls can still be attempted; the database RLS policies protect rows, but they do not by themselves force all writes through server actions or establish a sponsor-approval role.

## 4. How to apply the migration

**Before applying:** Confirm the correct Supabase project and database, review the SQL, and take a backup/snapshot if it contains important data. Use **one** application method; do not run the same `CREATE TABLE` migration twice. Do not paste credentials into documentation, screenshots, Git, or chat.

**Option A — Supabase SQL Editor (manual):**

1. Sign in to your Supabase dashboard and open the correct project.
2. Go to **SQL Editor** and create a new query.
3. Open `supabase/migrations/20250321000000_property_listings.sql` locally, copy its entire contents, paste into SQL Editor, and select **Run**.
4. Verify that the query completes without an error. If it fails, stop and inspect the exact error before retrying; do not assume the table is secure.
5. Open **Table Editor**, find `public.property_listings`, and confirm that **RLS is enabled**.
6. Inspect the four policies in the dashboard's policies interface, or run the verification queries below.

**Option B — Supabase CLI (for a repo already using CLI migrations):**

1. Make sure the Supabase CLI is installed, authenticated, and linked to the **correct** project (`supabase login` and `supabase link --project-ref YOUR_PROJECT_REF` if needed).
2. Confirm the migration file is in the repository's `supabase/migrations/` folder.
3. Review the pending migrations with `supabase db push --dry-run` if supported by your CLI version; then apply with `supabase db push`.
4. Verify the resulting table and RLS in Supabase Table Editor and by the queries below.

**Do not mix methods blindly:** Running the file in SQL Editor does not necessarily mark the migration as applied in Supabase CLI's migration history. A later `supabase db push` may try to apply it again. Coordinate migration history before switching methods.

**Verification queries (run in SQL Editor after application):**

```sql
-- Must return row_security_enabled = true.
SELECT n.nspname AS schema_name, c.relname AS table_name,
       c.relrowsecurity AS row_security_enabled
FROM pg_class AS c
JOIN pg_namespace AS n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname = 'property_listings';

-- Must list SELECT, INSERT, UPDATE, DELETE, all TO authenticated.
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'property_listings'
ORDER BY cmd;

-- Confirm columns and nullability.
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'property_listings'
ORDER BY ordinal_position;
```

**Behavior tests before using production data:** With two separate test Auth users (A and B), insert an A-owned listing as A and verify A can read/update/delete it while B cannot read/update/delete it. Attempt to insert an A-owned listing as B; it must fail. Verify anonymous reads return no private rows. Verify that a user cannot change `sponsor_id` or forge `created_at`/`updated_at`. Use user-scoped clients for these tests; do not use the service-role key to test RLS. A SQL Editor query running as a privileged database role is **not** proof that RLS works for ordinary users.

**Failure handling:** If applying fails, inspect the error and the current database state. Do not expose or use a partially created table without enabled RLS and correct policies. Fix the SQL and retry only after confirming which statements already ran; in an uncertain partial state, seek guidance before deleting data or reapplying. Do not run a destructive reset on a live project.

## 5. Risks / open questions

- **Sponsor eligibility:** `auth.uid()` plus `sponsor_id` restricts ownership but does not prove the user has an approved sponsor role. Sponsor approval/role rules are not defined in the original brief. Enabling authenticated INSERT means any signed-in user can create a listing for themselves unless additional authorization is implemented.
- **Write approval:** The original requirements brief explicitly requires read access, not create/update/delete features. This migration prepares own-row write policies, but exposing those features requires approval.
- **Shared ownership:** The design assumes one sponsor per listing; multi-sponsor read access would require a different model.
- **Status:** No status enum, default, or transition rules are defined. The application must supply a nonblank status; values need approval.
- **Price and currency:** The amount's meaning, currency, and display/rounding rules are unresolved.
- **Account deletion:** `ON DELETE RESTRICT` protects listing history but blocks deleting an Auth user with existing listings. Confirm retention, reassignment, and deletion workflows.
- **Audit fields:** A trigger maintains timestamps for normal writes. Highly privileged database roles can alter data or schema; use least-privilege credentials and operational controls.
- **Permissions and tests:** RLS policies do not replace table grants, valid sessions, server-side validation, sponsor-role checks, or cross-user tests.
- **Scope exclusions:** Property images/uploads, search and discovery, payments/investments, and administrative management are not part of this migration. No new dashboard UI or complete authentication system is implemented here.

## 6. Review checklist

- [x] Exact migration path and table name; all designed columns/types/nullability included.
- [x] UUID primary key and non-null UUID `sponsor_id` foreign key to `auth.users(id)`.
- [x] Sponsor lookup index; `created_at` and `updated_at` have defaults and database-maintained values.
- [x] RLS enabled and four own-row policies with appropriate `USING` / `WITH CHECK`.
- [x] No public/anonymous listing access and no `USING (true)` write policy.
- [x] No service-role credentials or secret values embedded in migration or docs.
- [x] Plain-language policy explanations, server/browser map, application steps, and risks/open questions included.
- [ ] Migration applied to the intended Supabase project and verified in Table Editor.
- [ ] RLS tested with at least two different authenticated users and one anonymous request.
- [ ] Both files committed and pushed to the repository default branch.
