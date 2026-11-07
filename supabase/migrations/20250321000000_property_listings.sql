-- PREIshare: sponsor-owned property listings
-- Design source: docs/data-model/property-listings-schema.md
-- Decisions and limitations: docs/data-model/rls-policy-review.md
-- Apply once, using either Supabase CLI migration tracking OR SQL Editor (not both blindly).
-- The original client brief explicitly requires sponsor-specific reads; write policies
-- are a migration design proposal, not approval to expose write features in the UI.

CREATE TABLE public.property_listings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sponsor_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE RESTRICT,
    title text NOT NULL,
    address text,
    city text NOT NULL,
    region text,
    postal_code text,
    country text NOT NULL,
    price numeric(14, 2),
    status text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT property_listings_title_nonempty CHECK (length(btrim(title)) > 0),
    CONSTRAINT property_listings_city_nonempty CHECK (length(btrim(city)) > 0),
    CONSTRAINT property_listings_country_nonempty CHECK (length(btrim(country)) > 0),
    CONSTRAINT property_listings_status_nonempty CHECK (length(btrim(status)) > 0),
    CONSTRAINT property_listings_price_nonnegative CHECK (price IS NULL OR price >= 0)
);

-- Supports owner-scoped listing reads ordered by newest first. The PK already indexes id.
CREATE INDEX property_listings_sponsor_created_at_idx
    ON public.property_listings (sponsor_id, created_at DESC);

-- Keep audit timestamps database-controlled even if an authenticated caller sends
-- timestamp values directly. Also prevent reassignment of existing rows.
CREATE FUNCTION public.property_listings_guard_audit_fields()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        NEW.created_at := now();
        NEW.updated_at := now();
    ELSE
        IF NEW.sponsor_id IS DISTINCT FROM OLD.sponsor_id THEN
            RAISE EXCEPTION 'property_listings.sponsor_id cannot be changed';
        END IF;
        NEW.created_at := OLD.created_at;
        NEW.updated_at := now();
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER property_listings_guard_audit_fields_trigger
BEFORE INSERT OR UPDATE ON public.property_listings
FOR EACH ROW
EXECUTE FUNCTION public.property_listings_guard_audit_fields();

-- Enable row security BEFORE exposing the table through an API.
ALTER TABLE public.property_listings ENABLE ROW LEVEL SECURITY;

-- Only authenticated users may access this table; RLS further restricts each row.
REVOKE ALL ON TABLE public.property_listings FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.property_listings TO authenticated;

CREATE POLICY property_listings_select_own
ON public.property_listings
FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL AND sponsor_id = auth.uid());

CREATE POLICY property_listings_insert_own
ON public.property_listings
FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL AND sponsor_id = auth.uid());

CREATE POLICY property_listings_update_own
ON public.property_listings
FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL AND sponsor_id = auth.uid())
WITH CHECK (auth.uid() IS NOT NULL AND sponsor_id = auth.uid());

CREATE POLICY property_listings_delete_own
ON public.property_listings
FOR DELETE TO authenticated
USING (auth.uid() IS NOT NULL AND sponsor_id = auth.uid());
