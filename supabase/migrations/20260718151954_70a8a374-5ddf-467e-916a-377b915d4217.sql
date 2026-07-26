
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS allows_messaging boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS allows_bookings boolean NOT NULL DEFAULT false;

ALTER TABLE public.seller_applications
  ADD COLUMN IF NOT EXISTS allows_messaging boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS allows_bookings boolean NOT NULL DEFAULT false;

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
        store_cover_url = COALESCE(NEW.store_cover_url, store_cover_url),
        allows_messaging = NEW.allows_messaging,
        allows_bookings = NEW.allows_bookings
    WHERE id = NEW.user_id;

    NEW.reviewed_at = now();
  END IF;
  RETURN NEW;
END;
$function$;
