
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS address_text text,
  ADD COLUMN IF NOT EXISTS address_details text,
  ADD COLUMN IF NOT EXISTS lat double precision,
  ADD COLUMN IF NOT EXISTS lng double precision,
  ADD COLUMN IF NOT EXISTS store_accepts_bookings boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS store_accepts_messages boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS store_active boolean NOT NULL DEFAULT true;

ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS is_offer boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_available boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS price_usd numeric,
  ADD COLUMN IF NOT EXISTS old_price numeric,
  ADD COLUMN IF NOT EXISTS discount_percent integer,
  ADD COLUMN IF NOT EXISTS delivery_method text,
  ADD COLUMN IF NOT EXISTS payment_method text,
  ADD COLUMN IF NOT EXISTS delivery_note text;

CREATE INDEX IF NOT EXISTS idx_listings_is_offer ON public.listings(is_offer) WHERE is_offer = true;
CREATE INDEX IF NOT EXISTS idx_listings_is_available ON public.listings(is_available);
CREATE INDEX IF NOT EXISTS idx_listings_owner ON public.listings(owner_id);
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.listings(price);
