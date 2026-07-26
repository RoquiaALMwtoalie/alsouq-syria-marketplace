
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS store_opens_at time,
  ADD COLUMN IF NOT EXISTS store_closes_at time,
  ADD COLUMN IF NOT EXISTS store_online boolean NOT NULL DEFAULT true;
