ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS reference text NOT NULL DEFAULT upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));