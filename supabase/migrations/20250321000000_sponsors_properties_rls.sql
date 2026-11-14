-- PREIshare: sponsor profiles, properties, and owner-scoped RLS
-- Design source: docs/data-model-and-rls-matrix.md
-- IMPORTANT: Confirm existing deployed schema/migrations before applying.
-- Earlier project artifacts used public.property_listings(sponsor_id).
-- This migration uses the documented proposed public.properties(owner_id).
-- Do not apply both designs blindly or create duplicate listing tables.

CREATE TABLE public.sponsor_profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id),
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.properties (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id uuid NOT NULL REFERENCES public.sponsor_profiles(id),
    title text NOT NULL,
    description text,
    address text,
    city text NOT NULL,
    status text,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT properties_title_nonblank CHECK (length(btrim(title)) > 0),
    CONSTRAINT properties_city_nonblank CHECK (length(btrim(city)) > 0)
);

-- Supports sponsor-scoped listing reads, newest first.
CREATE INDEX properties_owner_created_at_idx
    ON public.properties (owner_id, created_at DESC);

-- RLS applies to every table containing private sponsor data.
ALTER TABLE public.sponsor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Anonymous visitors cannot access either table. Authenticated users receive
-- only the SQL privileges needed for the policies below. RLS narrows access.
REVOKE ALL ON TABLE public.sponsor_profiles FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.properties FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.sponsor_profiles TO authenticated;
GRANT SELECT, INSERT ON TABLE public.properties TO authenticated;

-- Authenticated sponsors can read their own profile only.
CREATE POLICY sponsor_profiles_select_own
    ON public.sponsor_profiles
    FOR SELECT TO authenticated
    USING (id = (SELECT auth.uid()));

-- No sponsor-facing INSERT/UPDATE/DELETE policies on sponsor_profiles.
-- Profiles must be provisioned by a trusted administrative/server process.
-- No authenticated user may modify another sponsor's profile.

-- A sponsor can read only properties they own.
CREATE POLICY properties_select_own
    ON public.properties
    FOR SELECT TO authenticated
    USING (owner_id = (SELECT auth.uid()));

-- A sponsor can create a property only for their own verified profile.
-- The server must derive owner_id from the verified session, not user input.
CREATE POLICY properties_insert_own
    ON public.properties
    FOR INSERT TO authenticated
    WITH CHECK (
        owner_id = (SELECT auth.uid())
        AND EXISTS (
            SELECT 1 FROM public.sponsor_profiles AS sp
            WHERE sp.id = (SELECT auth.uid())
        )
    );

-- No UPDATE or DELETE grants or policies for properties this sprint.
-- Consequently, sponsor-facing owner_id cannot be reassigned via UPDATE.
-- No public/anonymous policies are defined.
-- Listing status values and sponsor approval remain unresolved requirements.
