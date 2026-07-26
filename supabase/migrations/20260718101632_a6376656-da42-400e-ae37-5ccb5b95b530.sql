
-- Add store visuals to seller applications
ALTER TABLE public.seller_applications
  ADD COLUMN IF NOT EXISTS store_logo_url text,
  ADD COLUMN IF NOT EXISTS store_cover_url text;

-- User addresses (label + required description + optional map location)
CREATE TABLE IF NOT EXISTS public.user_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL,
  address_text text NOT NULL,
  details text NOT NULL,
  lat double precision,
  lng double precision,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_addresses TO authenticated;
GRANT ALL ON public.user_addresses TO service_role;

ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users manage own addresses" ON public.user_addresses;
CREATE POLICY "users manage own addresses" ON public.user_addresses
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS trg_user_addresses_updated ON public.user_addresses;
CREATE TRIGGER trg_user_addresses_updated BEFORE UPDATE ON public.user_addresses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Update approval trigger function to copy logo/cover into profile
CREATE OR REPLACE FUNCTION public.handle_seller_application_approved()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'seller')
    ON CONFLICT DO NOTHING;

    UPDATE public.profiles
    SET store_name = NEW.store_name,
        store_description = COALESCE(NEW.store_description, store_description),
        store_phone = COALESCE(NEW.store_phone, store_phone),
        store_logo_url = COALESCE(NEW.store_logo_url, store_logo_url),
        store_cover_url = COALESCE(NEW.store_cover_url, store_cover_url)
    WHERE id = NEW.user_id;

    NEW.reviewed_at = now();
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_seller_app_approved ON public.seller_applications;
CREATE TRIGGER trg_seller_app_approved BEFORE UPDATE ON public.seller_applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_seller_application_approved();
