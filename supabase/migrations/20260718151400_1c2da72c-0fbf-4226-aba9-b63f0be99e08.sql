
-- Featured flags controlled by admin
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS featured_sort integer NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS featured_sort integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_listings_featured ON public.listings(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_profiles_featured ON public.profiles(is_featured) WHERE is_featured = true;

-- View to expose favorite counts publicly (aggregated only, no user identity)
CREATE OR REPLACE VIEW public.listing_favorite_counts AS
SELECT listing_id, COUNT(*)::int AS favorites_count
FROM public.favorites
WHERE listing_id IS NOT NULL
GROUP BY listing_id;

GRANT SELECT ON public.listing_favorite_counts TO anon, authenticated;
