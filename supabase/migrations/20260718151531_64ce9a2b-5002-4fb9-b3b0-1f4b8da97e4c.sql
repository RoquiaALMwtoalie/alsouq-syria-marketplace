
DROP VIEW IF EXISTS public.listing_favorite_counts;

ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS favorites_count integer NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_listings_favorites_count ON public.listings(favorites_count DESC);

-- Backfill existing counts
UPDATE public.listings l
SET favorites_count = COALESCE(sub.c, 0)
FROM (
  SELECT listing_id, COUNT(*)::int AS c
  FROM public.favorites
  WHERE listing_id IS NOT NULL
  GROUP BY listing_id
) sub
WHERE sub.listing_id = l.id;

-- Trigger to maintain the count
CREATE OR REPLACE FUNCTION public.sync_listing_favorites_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.listing_id IS NOT NULL THEN
    UPDATE public.listings SET favorites_count = favorites_count + 1 WHERE id = NEW.listing_id;
  ELSIF TG_OP = 'DELETE' AND OLD.listing_id IS NOT NULL THEN
    UPDATE public.listings SET favorites_count = GREATEST(favorites_count - 1, 0) WHERE id = OLD.listing_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.sync_listing_favorites_count() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_favorites_count_ins ON public.favorites;
DROP TRIGGER IF EXISTS trg_favorites_count_del ON public.favorites;
CREATE TRIGGER trg_favorites_count_ins AFTER INSERT ON public.favorites
  FOR EACH ROW EXECUTE FUNCTION public.sync_listing_favorites_count();
CREATE TRIGGER trg_favorites_count_del AFTER DELETE ON public.favorites
  FOR EACH ROW EXECUTE FUNCTION public.sync_listing_favorites_count();
