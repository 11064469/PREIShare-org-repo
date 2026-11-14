PREIshare — Data Model and RLS Matrix
Status: Planning only; no migrations. Source: docs/sponsor-auth-requirements.md.
Scope
Sponsors sign in, view only their own PostgreSQL listings, and create listings. The server derives ownership from the authenticated session. Update/delete, administrator features, sponsor approval, and public access are not approved for this sprint. Property fields and status values are proposed, not final client requirements.
Tables
sponsor_profiles
Column	Type	Purpose
id	UUID primary key, FK → auth.users(id)	Matches authenticated sponsor
created_at	timestamptz, default now()	Audit


Profile provisioning is a trusted server operation, not unrestricted user self-registration. Whether every authenticated account is a sponsor remains to be confirmed.
properties
Column	Type	Purpose
id	UUID primary key, default gen_random_uuid()	Listing identity
owner_id	UUID not null, FK → sponsor_profiles(id)	Immutable sponsor ownership
title	text not null	Proposed required field
description	text	Proposed optional field
address	text	Proposed optional field
city	text	Proposed required field
status	text	Values TBD
created_at	timestamptz default now()	Database-managed timestamp


Index (owner_id, created_at DESC). Schema compatibility: earlier PREIshare materials used property_listings and sponsor_id. Confirm the actual deployed schema before migrations; adapt names rather than create duplicate tables. The source requirement specifically calls the ownership column sponsor_id; owner_id is the proposed design equivalent.
RLS Policy Matrix
Table	Operation	Who	Rule in plain English	Notes
sponsor_profiles	SELECT	Signed-in sponsor	Only own profile, id = auth.uid()	No sponsor directory
sponsor_profiles	INSERT	Trusted provisioning only	Server provisions verified user	No browser insert policy
sponsor_profiles	UPDATE	Nobody this sprint	Deny	No approved profile editing
sponsor_profiles	DELETE	Nobody this sprint	Deny	Deletion lifecycle TBD
properties	SELECT	Signed-in sponsor	Only rows with owner_id = auth.uid()	List and detail
properties	INSERT	Signed-in sponsor	New row owner must equal auth.uid()	Server sets owner; RLS WITH CHECK
properties	UPDATE	Nobody this sprint	Deny	Not specified by source
properties	DELETE	Nobody this sprint	Deny	Not specified by source
Both	All	Anonymous	Deny	Dashboard also redirects signed-out users


Enable RLS on both tables. Do not grant anonymous table access; grant authenticated users only required operations. No UPDATE or DELETE policies yet.
Illustrative policies (not a migration)
CREATE POLICY sponsor_read_self ON public.sponsor_profiles
FOR SELECT TO authenticated
USING (id = (SELECT auth.uid()));

CREATE POLICY property_read_own ON public.properties
FOR SELECT TO authenticated
USING (owner_id = (SELECT auth.uid()));

CREATE POLICY property_insert_own ON public.properties
FOR INSERT TO authenticated
WITH CHECK (
  owner_id = (SELECT auth.uid())
  AND EXISTS (
    SELECT 1 FROM public.sponsor_profiles sp
    WHERE sp.id = (SELECT auth.uid())
  )
);
A trusted server handler validates input and derives owner_id from the verified session. Browser-supplied IDs cannot authorize access. Never expose privileged service-role keys in the browser; these can bypass RLS. Privileged provisioning, if necessary, remains server-only.
Requirement → design mapping
Requirement from sponsor-auth-requirements.md	Design mapping
FR-1, SEC-1: valid sign-in, reject invalid credentials	Supabase Auth; sponsor_profiles.id references auth.users.id
FR-2: session management and sign-out	Verify authenticated session on each protected request
FR-3, SEC-2: signed-out /dashboard redirects without data	Server route guard; anonymous DB access denied
FR-4: retrieve PostgreSQL listings, not mock data	properties table and SELECT policy
FR-5, SEC-3: sponsor-specific access, including non-dashboard requests	SELECT row predicate owner_id = auth.uid()
FR-6, SEC-5: sponsor creates listing, server determines sponsor_id	owner_id derived server-side; INSERT WITH CHECK
SEC-4: browser owner ID must not grant access	RLS compares database owner to authenticated auth.uid()
SEC-6, SEC-7: keep private credentials out of browser and Git	Server-only secrets; placeholder-only .env.example
Acceptance criteria: two sponsors and owner spoofing	Test cross-sponsor reads, guessed IDs, forged inserts
Out of scope and open questions	No admin/public policies; UPDATE/DELETE denied; fields/status TBD


Decisions needed before implementation
Confirm existing table names; sponsor provisioning and eligibility; required fields and valid status values; whether editing/deleting or shared ownership is allowed; and account deletion behavior.
Future verification
Test Sponsor A, Sponsor B, and anonymous sessions. A can read/create A rows; B cannot read A rows or insert rows owned by A. Neither sponsor can update/delete until authorized. Verify signed-out access is blocked and browser bundles contain no privileged secrets. Record actual test outcomes separately from build success.