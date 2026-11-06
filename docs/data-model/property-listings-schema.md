# Property Listings Schema Design

This is a proposed design based only on the sponsor authentication and listings brief and the Supabase environment checklist. It is not a migration or an implementation of authentication or row-level security (RLS).

## 1. Proposed Property Listings Fields

The brief requires property listings to be stored in PostgreSQL and tied to the sponsor authorized to access them. It does not specify any listing details or business attributes. Accordingly, no property-specific business columns are proposed until those requirements are defined.

| Field | PostgreSQL type | Required? | Purpose |
|---|---|---:|---|
| `id` | `uuid` | Yes | Primary key identifying one listing. **Technical design assumption:** use a UUID primary key. |
| `sponsor_id` | `uuid` | Yes | Ownership field referencing the sponsor's Supabase Auth user ID in `auth.users(id)`. **Technical design assumption:** store the owner ID as a non-null UUID foreign key. |

**Technical design assumptions:** The table will have a primary key named `id`, and `sponsor_id` will be non-null. The brief does not prescribe key names, types, or foreign-key deletion behavior; the UUID choices follow the Supabase Auth user ID relationship and should be confirmed before implementation.

**Not specified by the brief:** Listing attributes (for example, what property information sponsors need to see), whether any attributes are required, and whether timestamps or listing status are needed. No such fields are included here.

## 2. Ownership Relationship to Supabase Auth

Each listing's `sponsor_id` is intended to reference `auth.users.id`, the UUID of the Supabase Auth user who owns the listing. This is a foreign-key relationship: a listing's owner must correspond to an Auth user, and the database—not a browser-supplied sponsor identifier—provides referential integrity.

For an authenticated request, Supabase makes the user's ID available to PostgreSQL through the request's verified authentication context (commonly `auth.uid()`). A sponsor's own listings are the rows whose `sponsor_id` equals that authenticated user ID. The application must not decide ownership by trusting an ID sent by the browser or by filtering results only in React.

The brief does not define how an Auth user is designated or approved as a PREIshare sponsor, how listing ownership is initially assigned, or what should happen to listings if an Auth user is deleted. Those decisions need to be established before implementation; authentication alone should not be treated as proof of any additional sponsor role or approval.

## 3. Proposed Row Level Security Rules

RLS must be enabled for the listings table, with policies that enforce access in PostgreSQL. The following reflects the permissions actually described in the brief:

- **Read:** An authenticated sponsor may read a listing only when its `sponsor_id` matches the authenticated user's ID (`auth.uid()`). The policy should apply to the authenticated database role and reject a missing authenticated user ID.
- **Create:** The brief does not require or authorize sponsors to create listings. No sponsor insert permission should be granted unless that behavior is separately specified. If it is later authorized, PostgreSQL must verify that the new row's `sponsor_id` matches the authenticated user's ID; it must not accept ownership based only on a browser-provided value.
- **Update:** The brief does not require or authorize sponsors to update listings. No sponsor update permission should be granted unless that behavior is separately specified. If later authorized, PostgreSQL must check ownership for both the existing row and the resulting row, so an owner cannot change a listing's `sponsor_id` to another user.
- **Delete:** The brief does not require or authorize sponsors to delete listings. No sponsor delete permission should be granted unless that behavior is separately specified.
- **Ownership verification:** PostgreSQL compares `sponsor_id` with the authenticated request's user ID, rather than relying on React filtering or a sponsor ID supplied by the caller.
- **Attempt to access another sponsor's listing:** A query returns no rows for listings the user does not own; a direct operation against another sponsor's row is blocked by RLS. The application must not expose that data. RLS is the security boundary even if a caller bypasses the dashboard UI.

The brief requires sponsor-specific authorization but does not define an additional sponsor approval/role mechanism. The ownership match above enforces per-user listing ownership; the authoritative process for assigning listings to approved sponsors remains an open requirement.

## 4. Server vs. Browser Operations

| Operation or value | Browser | Server / database |
|---|---|---|
| Sponsor authentication | Provide the sign-in and sign-out interaction and use Supabase Auth with the public project configuration. Do not treat client-side route guards as authorization. | Validate the authenticated session before serving protected sponsor information. Supabase Auth and the database request context must provide the identity used for authorization. |
| Reading authorized listings | May request listings through an authenticated, user-scoped Supabase client. The browser may display returned authorized data but must not enforce security by filtering on its own. | PostgreSQL RLS must limit results to rows owned by the authenticated user. Server routes or functions returning protected listings must verify the session and must not trust a sponsor ID from the browser. |
| Creating and updating listings | Not enabled by this design: the brief does not specify sponsor create or update behavior. | Do not grant write access until requirements define it. If later authorized, enforce ownership in PostgreSQL RLS for both the row being changed and its resulting owner. |
| Deleting listings | Not enabled by this design: deletion is not required by the brief. | Do not grant delete access unless requirements separately authorize it. |
| Supabase public URL and publishable key | May be present in browser configuration; the checklist uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. These are public values, not authorization controls. | May also be used by trusted server code as appropriate. |
| Supabase secret/service-role key | Must never appear in browser code, browser components, or the client bundle. Never use a `VITE_` prefix for this privileged secret. | Server-only if a trusted operation requires it. Privileged keys can bypass RLS; do not use them for sponsor-scoped listing access in place of the authenticated user's RLS-protected context. No privileged key is needed by this proposed read design. |

No real environment variable values or credentials belong in this document. Appropriate RLS policies must be enabled before browser access to private sponsor listings.
